import React from 'react'
import $ from 'jquery'

import './palette-line.css'

export default class PaletteLine extends React.Component {
  constructor(props) {
    super(props)

  }

  componentDidMount = () => {

  }

  componentDidUpdate = () => {

  }

  render() {
    const style = this.props.colors.map(color => {
      const { h, s, l } = color;
      // hsl color : hue(0, 360), saturation(0, 100, %), lightness (0, 100, %)
      return { backgroundColor: `hsl(${Math.floor(h)}, ${(Math.floor(s * 100))}%, ${(Math.floor(l * 100))}%)` }
    })

    return(
      <div className="PaletteLineWrap">
        <div className="PaletteLine">
          <div
            className="PaletteSquare"
            style={style[0]}
          />
          <div
            className="PaletteSquare"
            style={style[1]}
          />
          <div
            className="PaletteSquare"
            style={style[2]}
          />
          <div
            className="PaletteSquare"
            style={style[3]}
          />
          <div
            className="PaletteSquare"
            style={style[4]}
          />
        </div>
      </div>
    )
  }
}
