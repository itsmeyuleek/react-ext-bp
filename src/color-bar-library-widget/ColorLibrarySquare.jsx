import React from 'react'
import ReactDOM from 'react-dom';
import $ from 'jquery'

export default class ColorLibrarySquare extends React.Component {
  constructor(props) {
    super(props)

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)

    this.copyColor = this.copyColor.bind(this)

    this.state = {
      idx: props.idx,
      color: props.color,
      isMouseInside: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.color !== state.color) {
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

  copyColor = () => {
    // копирование
    const el = document.createElement('textarea')
    el.className = 'TextToCopy'
    el.value = this.state.color
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
    const style = {
      backgroundColor: this.state.color
    }

    const buttonClass = this.state.isMouseInside ? "DeleteColorButton is-active" : "DeleteColorButton"

    return(
      <div key={this.state.idx} className="ColorLibrarySquareWrap">
        <canvas
          className="SavedColor"
          style={style}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          onClick={this.copyColor}
        />
        <button
          className={buttonClass}
          onClick={() => this.props.deleteColorFromColorLibrary(this.state.idx)}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        />
      </div>
    )
  }
}
