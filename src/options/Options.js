import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import '@polymer/paper-button/paper-button.js';

import $ from 'jquery'

import './Options.css';
import '../color-bar/color-bar.css';
import '../gradient-widget/gradient-widget.css';
import '../color-bar-library-widget/color-bar-library-widget.css';

import Color from '../color-bar/Color.jsx';
import Gradient from '../gradient-widget/GradientWidget.jsx';
import ColorLibrary from '../color-bar-library-widget/ColorLibraryWidget.jsx';

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

const Gradients = props => (
  <div>
    <Gradient name="Gradient"/>
  </div>
)

const ColorsLibrary = props => (
  <div>
    <ColorLibrary name="Color Library"/>
  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Colors name="React1" />,
    document.body.appendChild(document.createElement('div'))
  )
})

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Gradients name="React2" />,
    document.body.appendChild(document.createElement('div'))
  )
})

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ColorsLibrary name="React3" />,
    document.body.appendChild(document.createElement('div'))
  )
})

function showCoords(event) {

}

let userId = 0

console.log("getting data from chrome storage")

chrome.storage.sync.get(['userId'], function(result) {
  console.log(result.userId)
  userId = result.userId
  if (userId == null) {
    console.log("no data, sending get request on user id")
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/users/syncData",
      dataType: "json"
    })
    .done(function(data) {
      console.log("handling back request")
      userId = data["userId"]
      chrome.storage.sync.set({'userId': userId}, function() {
        console.log('Current user id set to ' + userId)
      })
    })
  }
  else {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/users/syncData",
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      console.log("handling back request")
      if (data == null) console.log("such user exists, OK")
      else {
        userId = data["userId"]
        chrome.storage.sync.set({'userId': userId}, function() {
          console.log('Current user id set to ' + userId)
        })
      }
    })
  }
})

export default Options;
