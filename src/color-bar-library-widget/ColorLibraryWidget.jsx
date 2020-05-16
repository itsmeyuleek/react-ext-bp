import React from 'react'
import $ from 'jquery'

import ColorLibraryColors from './ColorLibraryColors'
import ColorLibraryGradients from './ColorLibraryGradients'
import ColorLibraryPalettes from './ColorLibraryPalettes'

export default class ColorLibrary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: props.data.userId,
      where: props.where,
      name: 'Library',
      description: 'Store colors from color-type widgets',
      colors: props.where != 'catalog' ? props.data.widgets.ColorBarLibraryWidget.colors : [],
      gradients: props.where != 'catalog' ? props.data.widgets.ColorBarLibraryWidget.gradients : [],
      palettes: props.where != 'catalog' ? props.data.widgets.ColorBarLibraryWidget.palettes : []
    }
  }

  componentDidMount = () => {
    if (this.state.where != "catalog") {
      // $.ajax({
      //   method: "POST",
      //   url: "http://localhost:3000/color_bar_library_widgets/checkUser",
      //   dataType: "json",
      //   data: {
      //     userId: this.state.userId
      //   }
      // })
      // .done((data) => {
      //   let isAdded = data['isAdded']
      //   if (isAdded == '0') {
      //     $('#bindColorLibrary').attr('disabled', 'disabled');
      //     $('#addColorToLibrary').attr('disabled', 'disabled');
      //   }
      //   else {
      //     $('#bindColorLibrary').removeAttr('disabled');
      //     $('#addColorToLibrary').removeAttr('disabled');
      //   }
      // });

      $.ajax({
        method: "GET",
        url: "http://localhost:3000/color_bar_library_widgets/retrieveColors",
        dataType: "json",
        data: {
          userId: this.state.userId
        }
      })
      .done((data) => {
        let result = data['result'];
        if (result == '0') {
            if (this.state.where !== 'catalog') {
              this.setState({
                colors: data['colors'] != null ? data['colors'] : [],
                gradients: data['gradients'] != null ? data['gradients'] : [],
                palettes: data['palettes'] != null ? data['palettes'] : []
              });
              this.props.addToLibrary.addColorsToColorLibrary(data['colors']);
              this.props.addToLibrary.addGradientsToColorLibrary(data['gradients']);
              this.props.addToLibrary.addPalettesToColorLibrary(data['palettes']);
            }
        }
        this.props.widgetHasLoaded("ColorBarLibraryWidget");
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.where != 'catalog') {
      const saved = Object.assign({}, props.data.widgets.ColorBarLibraryWidget);
      let newState = {
        colors: state.colors,
        gradients: state.gradients,
        palettes: state.palettes
      };
      if (JSON.stringify(saved.colors) !== JSON.stringify(state.colors)) {
        newState.colors = saved.colors;
      }
      if (JSON.stringify(saved.gradients) !== JSON.stringify(state.gradients)) {
        newState.gradients = saved.gradients;
      }
      if (JSON.stringify(saved.palettes) !== JSON.stringify(state.palettes)) {
        newState.palettes = saved.palettes;
      }
      return newState;
    } else {
      return null;
    }
  }

  componentDidUpdate = () => {
    if (this.state.where != 'catalog') {
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_library_widgets/addColor",
        dataType: "json",
        data: {
          userId: this.state.userId,
          colors: this.state.colors,
          gradients: this.state.gradients,
          palettes: this.state.palettes
        }
      })
    }
  }

  render() {
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

    return (
      this.state.where == 'catalog' ?
      (
       <div className="catalogEntry">
         <h2>{this.state.name}</h2>
         <p>{this.state.description}</p>
         <button className="CatalogAddButton" onClick={() => updateBind(toBind, 'ColorBarLibraryWidget')} >{addText}</button>
         <button className="CatalogShowButton" disabled={toHide} onClick={() => toggleHidden('ColorBarLibraryWidget')}>show</button>
       </div>
     ) :
     (
    //  <div className="widgetsGrid">
    <div className="widgetWrapper">
      <div
        className="widget ColorLibrary"
      >
        <button
          className={rmBtnClass}
          type="button"
          id="addWidgetColorLibrary"
          onClick={() => toggleHidden('ColorBarLibraryWidget')}
        />
        <h1>{this.state.name}</h1>
        <ColorLibraryColors colors={ this.state.colors != null ? this.state.colors : [] } delete={ this.props.deleteFunc.color } />
        <div
          className="LibraryBreak"
        />
        <ColorLibraryGradients gradients={ this.state.gradients } delete={ this.props.deleteFunc.gradient } />
        <div
          className="LibraryBreak"
        />
        <ColorLibraryPalettes palettes={ this.state.palettes } delete={ this.props.deleteFunc.palette } />
      </div>
      </div>
    )
  )
  }
}
