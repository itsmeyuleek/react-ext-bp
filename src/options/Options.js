import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import $ from 'jquery'

import './Options.css';
import '../color-bar/color-bar.css';
import '../gradient-widget/gradient-widget.css';
import '../color-bar-library-widget/color-bar-library-widget.css';
import '../associations-widget/associations-widget.css';
import '../catalog/catalog.css';
import '../widgets-grid.css';

import Color from '../color-bar/Color.jsx';
import Gradient from '../gradient-widget/GradientWidget.jsx';
import ColorLibrary from '../color-bar-library-widget/ColorLibraryWidget.jsx';
import Association from '../associations-widget/AssociationsWidget.jsx';
import Catalog from '../catalog/Catalog.jsx';

class Options extends Component {
  render() {
    return (
      <div className="App"></div>
    );
  }
}

const Colors = props => (
  //<div>
    <Color />
  //</div>
)

const Gradients = props => (
  //<div>
    <Gradient />
  //</div>
)

const ColorsLibrary = props => (
  //<div>
    <ColorLibrary />
  //</div>
)

const Associations = props => (
  //<div>
    <Association />
  //</div>
)

const Catalogs = props => (
  <Catalog />
)

// let userId = 0
//
// console.log("getting data from chrome storage")
//
// chrome.storage.sync.get(['userId'], function(result) {
//   console.log(result.userId)
//   userId = result.userId
//   if (userId == null) {
//     console.log("no data, sending get request on user id")
//     $.ajax({
//       method: "GET",
//       url: "http://localhost:3000/users/syncData",
//       dataType: "json"
//     })
//     .done(function(data) {
//       console.log("handling back request")
//       userId = data["userId"]
//       chrome.storage.sync.set({'userId': userId}, function() {
//         console.log('Current user id set to ' + userId)
//       })
//     })
//   }
//   else {
//     $.ajax({
//       method: "POST",
//       url: "http://localhost:3000/users/syncData",
//       dataType: "json",
//       data: {
//         userId: userId
//       }
//     })
//     .done(function(data) {
//       console.log("handling back request")
//       if (data == null) console.log("such user exists, OK")
//       else {
//         userId = data["userId"]
//         chrome.storage.sync.set({'userId': userId}, function() {
//           console.log('Current user id set to ' + userId)
//         })
//       }
//     })
//   }
// })

export default Options;
