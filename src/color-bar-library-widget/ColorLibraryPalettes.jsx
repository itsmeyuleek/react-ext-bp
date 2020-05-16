import React from 'react'
import $ from 'jquery'

import ColorLibraryPalette from './ColorLibraryPalette.jsx'

import './ColorLibraryPalettes.css'

export default class ColorLibraryPalettes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "Your palettes",
      palettes: props.palettes
    };
  }

  render() {
    let palettes = Array();
    if (this.props.palettes.length > 0) {
      for (let key = 0, n = this.props.palettes.length; key < n; key++) {
        const pair = this.props.palettes[key];
        palettes.push(
          <ColorLibraryPalette key={key} idx={key} color={pair} delete={this.props.delete} />
        );
      }
    }

    return(
      <div className="LibraryPalettesWrapper">
      <h2>Your palettes</h2>
      <button
        className="LibraryDropdown"
        onClick={() => { $(".LibrarySavedLine.Palettes").toggle(300); $(".LibraryPalettesWrapper").find(".LibraryDropdown").toggleClass("is-pressed"); }}>
      </button>
      <div
        className="LibrarySavedLine Palettes"
      >
        <div
          className="LibraryPalettes"
        >
          {palettes}
        </div>
      </div>
      </div>
    )
  }
}
