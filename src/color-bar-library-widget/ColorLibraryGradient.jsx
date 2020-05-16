import React from 'react'
import $ from 'jquery'

import './ColorLibraryGradients.css'

export default class ColorLibraryGradient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      idx: props.idx,
      colors: props.colors,
      isMouseInside: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.colors) !== JSON.stringify(state.colors)) {
      return {
        colors: props.colors
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

  copyGradient = () => {
    // копирование
    const el = document.createElement('textarea')
    el.className = 'TextToCopy'
    const pair = this.state.colors
    el.value = "linear-gradient(90deg, " + pair.startColor + " 0%, " + pair.endColor + " 100%)"
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

  render() {
    const pair = this.state.colors;
    const style = {
      background: "linear-gradient(90deg, " + pair.startColor + " 0%, " + pair.endColor + " 100%)"
    }
    const buttonClass = this.state.isMouseInside ? "DeleteGradientButton is-active" : "DeleteGradientButton"


    return(
      <div key={this.state.idx} className="ColorLibraryGradientWrap">
        <canvas
          className="LibraryGradientsCanvas"
          style={style}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          onClick={this.copyGradient}
        />
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
