import React from 'react'
import $ from 'jquery'

import ColorLibrarySquare from './ColorLibrarySquare.jsx'

import './ColorLibraryGradients.css'

export default class ColorLibraryColors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "Your colors",
      colors: props.colors
    }
  }

  render() {
    let squares = Array();
    if (this.props.colors.length > 0) {
      for (let key = 0, n = this.props.colors.length; key < n; key++) {
        const color = this.props.colors[key];
        squares.push(
          <ColorLibrarySquare key={key} idx={key} color={color} delete={ this.props.delete } />
        );
      }
    }

    return(
      <div className="LibraryColorsWrapper">
        <h2>Your colors</h2>
        <button
          className="LibraryDropdown"
          onClick={() => { $(".LibrarySavedLine.Colors").toggle(300); $(".LibraryColorsWrapper").find(".LibraryDropdown").toggleClass("is-pressed"); }}>

        </button>
        <div
          className="LibrarySavedLine Colors"
        >
            {squares}
        </div>
      </div>
    )
  }
}
