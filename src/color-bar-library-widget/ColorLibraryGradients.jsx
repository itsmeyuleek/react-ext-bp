import React from 'react'
import $ from 'jquery'

import ColorLibraryGradient from './ColorLibraryGradient.jsx'

import './ColorLibraryGradients.css'

export default class ColorLibraryGradients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "Your gradients",
      gradients: props.gradients
    }
  }

  onClick = (i) => {
    console.log(i);
  }

  render() {
    let gradients = Array();
    if (this.props.gradients.length > 0) {
      for (let key = 0, n = this.props.gradients.length; key < n; key++) {
        const pair = this.props.gradients[key];
        gradients.push(
          <ColorLibraryGradient key={key} idx={key} colors={pair} delete={this.props.delete} />
        );
      }
    }

    return(
      <div className="LibraryGradientsWrapper">
      <h2>Your gradients</h2>
      <button
        className="LibraryDropdown"
        onClick={() => { $(".LibrarySavedLine.Gradients").toggle(300); $(".LibraryGradientsWrapper").find(".LibraryDropdown").toggleClass("is-pressed"); }}>
      </button>
      <div
        className="LibrarySavedLine Gradients"
      >
        <div
          className="LibraryGradients"
        >
          {gradients}
        </div>
      </div>
      </div>
    )
  }
}
