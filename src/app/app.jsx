import React, { Component, PropTypes } from 'react'

import Options from '../options/options.js'
import Color from '../color-bar/Color.jsx'
import Gradient from '../gradient-widget/GradientWidget.jsx'
import ColorLibrary from '../color-bar-library-widget/ColorLibraryWidget.jsx'
import Associations from '../associations-widget/AssociationsWidget.jsx'
import Catalog from '../catalog/Catalog.jsx'

import Placeholder from '../placeholder/Placeholder'

import './app.css'
import '../widgets-grid.css'

import $ from 'jquery'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)

    this.resizeWidgets = this.resizeWidgets.bind(this)
    this.setEditMode = this.setEditMode.bind(this)
    this.updateBind = this.updateBind.bind(this)
    this.bindUser = this.bindUser.bind(this)
    this.unbindUser = this.unbindUser.bind(this)

    this.addColorToColorLibrary = this.addColorToColorLibrary.bind(this)
    this.addColorsToColorLibrary = this.addColorsToColorLibrary.bind(this)
    this.deleteColorFromColorLibrary = this.deleteColorFromColorLibrary.bind(this)

    window.addEventListener("resize", this.resizeWidgets)

    this.state = {
      userid: 0,
      isLoading: true,
      editMode: false,
      widgets: {
        ColorBarWidget: {
          url: "http://localhost:3000/color_bar_widgets/",
          isBinded: false,
        },
        ColorBarLibraryWidget: {
          url: "http://localhost:3000/color_bar_library_widgets/",
          isBinded: false,
          colors: [],
        },
        GradientWidget: {
          url: "http://localhost:3000/gradient_widgets/",
          isBinded: false,
        },
        Association: {
          url: "http://localhost:3000/associations/",
          isBinded: false,
        }
      }
    }
  }

  //----------------------------------------------------------------
  // LIFECYCLE
  //----------------------------------------------------------------

  componentDidMount() {
    // get data
    let userId
    const self = this
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
          self.setState({
            userId: userId
          })
          chrome.storage.sync.set({'userId': userId}, function() {
            console.log('Current user id set to ' + userId)
          })
          self.setState({
            isLoading: false
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
          if (data == null) {
            console.log("such user exists, OK")
            self.setState({
              userId: userId
            })
          }
          else {
            userId = data["userId"]
            self.setState({
              userId: userId
            })
            chrome.storage.sync.set({'userId': userId}, function() {
              console.log('Current user id set to ' + userId)
            })
          }
          self.setState({
            isLoading: false
          })
        })
      }
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/user_widgets/getWidgets",
        dataType: "json",
        data: {
          userId: userId
        }
      }).done(function(data) {
        let widgets = self.state.widgets
        data.results.map(e => {
          console.log(e)
          widgets[e.type].isBinded = true
        })
        self.setState({
          widgets: widgets,
        })
      })
    })
  }

  componentDidUpdate() {
    this.resizeWidgets()
  }

  //----------------------------------------------------------------
  // FUNCTIONS
  //----------------------------------------------------------------

  resizeWidgets() {
    const allItems = document.getElementsByClassName("widgetWrapper");
    for(var x=0;x<allItems.length;x++){
      var grid = document.getElementsByClassName("widgetsGrid")[0];
      var rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      var rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
      var rowSpan = Math.ceil((allItems[x].querySelector('div').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap )) + 1;
      allItems[x].style.gridRowEnd = "span " + rowSpan;
    }
  }

  setEditMode() {
    const isEdit = !this.state.editMode
    this.setState({
      editMode: isEdit
    })
  }

  updateBind(toBind, type) {
    toBind ? this.bindUser(type, this) : this.unbindUser(type, this)
  }

  bindUser(type, self) {
    const url = self.state.widgets[type].url + "bindUser"
    const userId = self.state.userId
    $.ajax({
      method: "POST",
      url: url,
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      if (data["result"] == '1') {
        let widgets = self.state.widgets
        widgets[type].isBinded = true
        self.setState({
          widgets: widgets
        })
      }
      else {
        return false
      }
    })
  }

  unbindUser(type, self) {
    const url = self.state.widgets[type].url + "unbindUser"
    const userId = self.state.userId
    $.ajax({
      method: "POST",
      url: url,
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      if (data["result"] == '1') {
        let widgets = self.state.widgets
        widgets[type].isBinded = false
        self.setState({
          widgets: widgets
        })
      }
      else {
        return false
      }
    })
  }

  addColorToColorLibrary(c) {
    console.log('add color to library', c)
    var newColors = this.state.widgets.ColorBarLibraryWidget
    newColors.colors.unshift(c)
    if (newColors.colors.length > 30) newColors.colors.pop()
    this.setState({
      ColorBarLibraryWidget: newColors
    })
  }

  addColorsToColorLibrary(cs) {
    var newColors = this.state.widgets.ColorBarLibraryWidget
    newColors.colors = cs
    this.setState({
      ColorBarLibraryWidget: newColors
    })
  }

  deleteColorFromColorLibrary(idx) {
    console.log('idx to delete color', idx)
    var newColors = this.state.widgets.ColorBarLibraryWidget
    newColors.colors.splice(newColors.colors.length - 1 - idx, 1)
    this.setState({
      ColorBarLibraryWidget: newColors
    })
  }

  render() {
    const data = {
      editable: this.state.editMode
    }
    const widgetData = this.state.widgets.ColorBarLibraryWidget

    var isAny = false
    for (var key of Object.keys(this.state.widgets)) {
      if (this.state.widgets[key].isBinded) {
        isAny = true
        break
      }
    }

    return(
      this.state.isLoading && !isAny
      ?
        <h1>Data is loading</h1>
      :
        <div className="wrapper">
        <div className="CopiedToClipboard">
          <p>Copied to clipboard!</p>
        </div>
            {!isAny && <Placeholder />}
            <div className="widgetsGrid">
              {
                this.state.widgets.Association.isBinded
                &&
                <Associations
                  data={data}
                  updateBind={this.updateBind}
                  resizeWidgets={this.resizeWidgets}
                />
              }
              {
                this.state.widgets.ColorBarLibraryWidget.isBinded
                &&
                <ColorLibrary
                  data={data}
                  widgetData={widgetData}
                  updateBind={this.updateBind}
                  resizeWidgets={this.resizeWidgets}
                  addColorsToColorLibrary={this.addColorsToColorLibrary}
                  deleteColorFromColorLibrary={this.deleteColorFromColorLibrary}
                />
              }
              {
                this.state.widgets.ColorBarWidget.isBinded
                &&
                <Color
                  data={data}
                  updateBind={this.updateBind}
                  resizeWidgets={this.resizeWidgets}
                  addColorToColorLibrary={this.addColorToColorLibrary}
                />
              }
              {
                this.state.widgets.GradientWidget.isBinded
                &&
                <Gradient
                  data={data}
                  updateBind={this.updateBind}
                />
              }
            </div>
            <Catalog
              updateBind={this.updateBind}
              setEditMode={this.setEditMode}
              data={this.state.widgets}
            />
          </div>
    )
  }
}
