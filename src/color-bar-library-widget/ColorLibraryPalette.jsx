import React from 'react'
import $ from 'jquery'

import PaletteLine from '../color-palette/palette-line.jsx'

import './ColorLibraryPalettes.css'

export default class ColorLibraryGradient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      idx: props.idx,
      color: props.color,
      isMouseInside: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.color) !== JSON.stringify(state.color)) {
      return {
        color: props.color
      }
    }
    return null;
  }

  mouseEnter = () => {
    this.setState({
      isMouseInside: true
    })
  }

  mouseLeave = () => {
    this.setState({
      isMouseInside: false
    })
  }

  copyPalette = () => {
    // копирование
    const el = document.createElement('textarea')
    el.className = 'TextToCopy'
    const pair = this.state.color
    el.value = pair.color + ", " + pair.scheme
    el.setAttribute('readonly', '')
    document.body.appendChild(el)
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(selected)
    }

    // анимация элемента, сам элемент в ColorLibraryWidget
    $(".CopiedToClipboard").fadeIn(500, function() {
      $(this).delay(1500).fadeOut(2000)
    })
  }

  calcColor = (level, color, scheme) => {
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
    const pair = this.state.color;

    const convColor = this.RGBtoHSL(pair.color);
    colors[2] = convColor;
    for (let i = 2 - 1; i > -1; i--) {
      colors[i] = this.calcColor(i - 2, convColor, pair.scheme);
    }
    for (let i = 2 + 1; i < 5; i++) {
      colors[i] = this.calcColor(i - 2, convColor, pair.scheme);
    }

    const buttonClass = this.state.isMouseInside ? "DeletePaletteButton is-active" : "DeletePaletteButton"

    return(
      <div
        className="ColorLibraryGradientWrap"
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <div         onClick={this.copyPalette}>
          <PaletteLine colors={colors} />
        </div>
        <button
          className={buttonClass}
          onClick={() => this.props.delete(this.state.idx)}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        />
      </div>
    )
  }
}
