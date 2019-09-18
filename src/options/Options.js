import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import '@polymer/paper-button/paper-button.js';

import './Options.css';
import '../color-bar/color-bar.css';
import Color from '../color-bar/Color.jsx';

class Options extends Component {
  render() {
    return (
      <div className="App"></div>
    );
  }
}

const Colors = props => (
  <div>
    <Color name="Color"/>
  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Colors name="React" />,
    document.body.appendChild(document.createElement('div')),
  )
})

export default Options;
