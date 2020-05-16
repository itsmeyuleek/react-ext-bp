import React from 'react'
import $ from 'jquery'

import PaletteLine from './palette-line.jsx'

import './color-palette.css'

export default class ColorPalette extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: props.data.userId,
      where: props.where,
      name: 'Additional colors',
      description: 'Generate different color palettes',
      fixedColor: props.where != 'catalog' ?
        props.data.widgets.ColorPaletteWidget.fixedColor: '',
      fixedColorHSL: { h: 0, s: 0, l: 0 },
      selectedScheme: 'Analogous'
    }
  }

  componentDidMount = () => {
    if (this.state.where != "catalog") {
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_palette_widgets/handleColor",
        dataType: "json",
        data: {
          userId: this.state.userId
        }
      })
      .done((data) => {
        let color = data["color"], selectedScheme = data["selectedScheme"];
        if (color != null)
        {
          $(".Color").css("background", color);
          $("#colorNumber").val(color);
          this.setState({
            selectedScheme: selectedScheme
          });
        }
        this.props.widgetHasLoaded("ColorPaletteWidget");
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const color = this.state.fixedColor;
    if (prevState.selectedScheme != this.state.selectedScheme) {
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_palette_widgets/handleColor",
        data: {
          userId: this.state.userId,
          selectedScheme: this.state.selectedScheme
        }
      })
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.where != 'catalog')
      return { fixedColor: props.data.widgets.ColorPaletteWidget.fixedColor }
    else return {}
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSave = () => {
    const { getWidgetProps, setWidgetProps } = this.props.funcProps;
    const pair = { color: this.state.fixedColor, scheme: this.state.selectedScheme };
    const libraryState = getWidgetProps("ColorBarLibraryWidget");
    let palettes = libraryState.palettes.slice();
    if (palettes.length > 5) {
      palettes.pop();
    }
    palettes.unshift(pair);
    libraryState.palettes = palettes;
    setWidgetProps("ColorBarLibraryWidget", libraryState);
  }

  calcColor = (level, color) => {
    const scheme = this.state.selectedScheme;
    // ------------------------------------------------------------------------------------------------
    // Монохромная
    // ------------------------------------------------------------------------------------------------
    if (scheme == 'Monochromatic') {
      const copy = Object.assign({}, color);
      copy.s = ((this.state.fixedPos + level != 0) && (this.state.fixedPos + level) % 2 == 0) ? copy.s + 0.3 : copy.s;
      const abs = Math.abs(level);
      if (abs % 2 == 1)
        if (copy.l > 0.6) copy.l -= level*0.25;
        else copy.l += level*0.25;
      else if (abs % 2 == 0)
        if (copy.l > 0.4) copy.l -= level*0.15;
        else copy.l += level*0.15;
      copy.l = copy.l > 1 ? 1 : copy.l;
      copy.l = copy.l < 0 ? Math.abs(copy.l) : copy.l;
      return copy;
    }
    // ------------------------------------------------------------------------------------------------
    // Последовательная
    // ------------------------------------------------------------------------------------------------
    if (scheme == 'Analogous') {
      const copy = Object.assign({}, color);
      copy.h = copy.h + 30 * level > 360 ? copy.h + 30 * level - 360 : ( copy.h + 30 * level < 0 ? 360 + copy.h + 30 * level : copy.h + 30 * level);
      copy.l = ((this.state.fixedPos + level != 0) && (this.state.fixedPos + level) % 2 == 1) ? copy.l + 0.1 : copy.l;
      copy.l = copy.l > 1 ? 1 : copy.l;
      return copy;
    }
  }

  RGBtoHSL = (color) => {
    let red = 0, green = 0, blue = 0;
    const len = color.length;
    if (len == 4) {
      red = parseInt(color.slice(1, 2) + color.slice(1, 2), 16) / 256;
      green = parseInt(color.slice(2, 3) + color.slice(2, 3), 16) / 256;
      blue = parseInt(color.slice(3, 4) + color.slice(3, 4), 16) / 256;
    }
    if (len == 7) {
      red = parseInt(color.slice(1, 3), 16) / 255;
      green = parseInt(color.slice(3, 5), 16) / 255;
      blue = parseInt(color.slice(5, 7), 16) / 255;
    }
    const xmax = Math.max(red, green, blue);
    const xmin = Math.min(red, green, blue);
    const chroma = xmax - xmin;
    const lightness = (xmax + xmin)/2;

    let hue = 0;
    if (xmax == xmin) hue = 0;
    else if (xmax == red) hue = 60 * ((green - blue) / chroma);
    else if (xmax == green) hue = 60 * (2 + (blue - red) / chroma);
    else if (xmax == blue) hue = 60 * (4 + (red - green) / chroma);

    if (hue < 0) hue = 360 + hue;
    else if (hue > 360) hue -= 360;

    const sv = xmax == 0 ? 0 : chroma/xmax;
    const sl = (lightness == 0 || lightness == 1) ? 0 : (xmax - lightness) / Math.min(lightness, 1 - lightness);

    return { h: hue, s: sl, l: lightness };
  }

  render() {
    let colors = new Array(5);
    const len = this.state.fixedColor.length;
    const pos = 2;
    if (this.state.selectedScheme != "Select") {
      if (len == 4 || len == 7) {
        const convColor = this.RGBtoHSL(this.state.fixedColor);
        colors[pos] = convColor;
        for (let i = pos - 1; i > -1; i--) {
          colors[i] = this.calcColor(i - pos, convColor);
        }
        for (let i = pos + 1; i < 5; i++) {
          colors[i] = this.calcColor(i - pos, convColor);
        }
      }
    }

    const { updateBind, toggleHidden, data } = this.props
    let rmBtnClass = ""
    let addBtnClass = ""
    if (data !== undefined) {
      rmBtnClass = data.editable ? "removeButton is-active" : "removeButton"
      addBtnClass = data.isBinded ? "addButton remove" : "addButton enabled"
    }
    const toBind = !data.isBinded ? true : false;
    const toHide = !data.isHidden ? true : false;
    const addText = data.isBinded ? "remove" : "add";

    return(
      this.state.where == "catalog" ?
      (
        <div className="catalogEntry">
          <h2>{this.state.name}</h2>
          <p>{this.state.description}</p>
          <button className="CatalogAddButton" onClick={() => updateBind(toBind, 'ColorPaletteWidget')} >{addText}</button>
          <button className="CatalogShowButton" disabled={toHide} onClick={() => toggleHidden('ColorPaletteWidget')}>show</button>
        </div>
      ) :
      (
        <div className="widgetWrapper">
          <div className="widget ColorPalette">
            <button
              className={rmBtnClass}
              type="button"
              id="addWidgetColor"
              onClick={() => toggleHidden('ColorPaletteWidget')}
            />
            <h1>{ this.state.name }</h1>
            {/*<button>Random</button>*/}

            <button
              className="saveButton"
              type="button"
              onClick={() => this.handleSave()}
            />

            <select
              className="PaletteSelect"
              name="selectedScheme"
              onChange={(e) => this.handleChange(e)}
              value={this.state.selectedScheme}
            >
              <option values="Select">Select</option>
              <option value="Analogous">Analogous</option>
              <option value="Monochromatic">Monochromatic</option>
            </select>
            <PaletteLine colors={colors}/>
          </div>
        </div>
      )
    )
  }
}
