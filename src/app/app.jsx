import React, { Component, PropTypes } from 'react'

import Options from '../options/options.js'
import Color from '../color-bar/Color.jsx'
import Gradient from '../gradient-widget/GradientWidget.jsx'
import ColorLibrary from '../color-bar-library-widget/ColorLibraryWidget.jsx'
import Associations from '../associations-widget/AssociationsWidget.jsx'
import ColorPalette from '../color-palette/color-palette.jsx'
import Catalog from '../catalog/Catalog.jsx'

import Placeholder from '../placeholder/Placeholder'

import './app.css'
import '../widgets-grid.css'

import $ from 'jquery'

export default class App extends Component {
  constructor(props) {
    super(props)

    window.addEventListener("resize", this.resizeWidgets)

    this.state = {
      userId: 0,
      isLoaded: false,
      editMode: false,
      widgets:
      {
        ColorBarWidget: {
          url: "http://localhost:3000/color_bar_widgets/",
          isBinded: false,
          isHidden: false,
          isLoaded: false
        },
        ColorBarLibraryWidget: {
          url: "http://localhost:3000/color_bar_library_widgets/",
          isBinded: false,
          isHidden: false,
          isLoaded: false,
          colors: [],
          gradients: [],
          palettes: []
        },
        GradientWidget: {
          url: "http://localhost:3000/gradient_widgets/",
          isBinded: false,
          isHidden: false,
          isLoaded: false
        },
        Association: {
          url: "http://localhost:3000/associations/",
          isBinded: false,
          isHidden: false,
          isLoaded: false
        },
        ColorPaletteWidget: {
          url: "http://localhost:3000/color_palette_widgets/",
          isBinded: false,
          isHidden: false,
          isLoaded: false,
          fixedColor: ''
        }
      }
    }
  }

  //----------------------------------------------------------------
  // LIFECYCLE
  //----------------------------------------------------------------

  componentDidMount = () => {
    // get data
    let userId = 0
    console.log("getting data from chrome storage")

    chrome.storage.sync.get(['userId'], (result) => {
      userId = result.userId
      if (userId == null) {
        console.log("no data, sending get request on user id")
        $.ajax({
          method: "GET",
          url: "http://localhost:3000/users/syncData",
          dataType: "json"
        })
        .done((data) => {
          console.log("handling back request")
          userId = data["userId"]
          this.setState({
            userId: userId
          })
          chrome.storage.sync.set({'userId': userId}, () => {
            console.log('Current user id set to ' + userId)
          });
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
        .done((data) => {
          console.log("handling back request")
          if (data == null) {
            console.log("such user exists, OK", userId)
            this.setState({
              userId: userId
            })
          }
          else {
            userId = data["userId"]
            this.setState({
              userId: userId
            })
            chrome.storage.sync.set({'userId': userId}, function() {
              console.log('Current user id set to ' + userId)
            })
          }
        })
      }

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/user_widgets/getWidgets",
        dataType: "json",
        data: {
          userId: userId
        }
      }).done((data) => {
        let widgets = Object.assign({}, this.state.widgets)
        data.results.map(e => {
          widgets[e.type].isBinded = true,
          widgets[e.type].isHidden = e.hidden
        })
        this.setState({
          isLoaded: true,
          widgets: widgets
        })
      })
    })
  }

  componentDidUpdate = () => {
    this.resizeWidgets()
  }

  //----------------------------------------------------------------
  // FUNCTIONS
  //----------------------------------------------------------------

  setWidgetProps = (widgetName, props) => {
    let newState = Object.assign({}, this.state);
    newState.widgets[widgetName] = props;
    this.setState({ newState });
    return { result: 0 };
  }

  getWidgetProps = (widgetName) => {
    if (this.state.widgets.hasOwnProperty(widgetName)) {
      return this.state.widgets[widgetName];
    } else {
      return { result: -1 };
    }
  }

  changeWidgetProps = (widgetName, propName, value) => {
    const newState = Object.assign({}, this.state);
    if (newState.hasOwnProperty(widgetName)) {
      newState[widgetName][propName] = value;
      this.setState(newState);
      return { result: 0 };
    } else return { result: -1 };
  }

  widgetHasLoaded = (widgetName) => {
    const widgets = this.state.widgets;
    widgets[widgetName].isLoaded = true;
    this.setState({widgets});
  }

  resizeWidgets = () => {
    const allItems = document.getElementsByClassName("widgetWrapper");
    for(var x=0; x < allItems.length; x++) {
      var grid = document.getElementsByClassName("widgetsGrid")[0];
      var rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      var rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
      var rowSpan = Math.ceil((allItems[x].querySelector('div').getBoundingClientRect().height + rowGap)/(rowHeight + rowGap));
      allItems[x].style.gridRowEnd = "span " + rowSpan;
    }
  }

  setEditMode = () => {
    const isEdit = !this.state.editMode
    this.setState({
      editMode: isEdit
    })
  }

  updateBind = (toBind, type) => {
    toBind ? this.bindUser(type, this) : this.unbindUser(type, this)
  }

  toggleHidden = (type) => {
    let widgets = this.state.widgets
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/user_widgets/toggleHidden",
      dataType: "json",
      data: {
        userId: this.state.userId,
        type: type
      }
    })
    .done((data) => {
      console.log(data)
      if (data["result"] == 0) {
        console.log(widgets)
        widgets[type].isHidden = !widgets[type].isHidden;
        this.setState({widgets});
      }
    });
  }

  bindUser = (type, self) => {
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

  unbindUser = (type, self) => {
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

  addColorToColorLibrary = (c) => {
    console.log('add color to library', c)
    let widgets = this.state.widgets;
    let library = widgets.ColorBarLibraryWidget;
    let colors = library.colors != null ? library.colors.slice() : [];
    if (colors.length > 9) {
      colors.pop();
    }
    colors.unshift(c);
    library.colors = colors != null ? colors : [];
    widgets.ColorBarLibraryWidget = library;
    this.setState({ widgets });
  }

  addColorsToColorLibrary = (cs) => {
    let lib = this.state.widgets.ColorBarLibraryWidget
    lib.colors = cs
    // this.setState({
    //   ColorBarLibraryWidget: newColors
    // })
  }

  addGradientsToColorLibrary = (cs) => {
    var lib = this.state.widgets.ColorBarLibraryWidget
    lib.gradients = cs
    // this.setState({
    //   ColorBarLibraryWidget: newColors
    // })
  }

  addPalettesToColorLibrary = (cs) => {
    var lib = this.state.widgets.ColorBarLibraryWidget
    lib.palettes = cs
    // this.setState({
    //   ColorBarLibraryWidget: new
    // })
  }

  deleteColorFromColorLibrary = (idx) => {
    console.log('idx to delete color', idx);
    let widgets = Object.assign({}, this.state.widgets);
    let widget = Object.assign({}, widgets.ColorBarLibraryWidget);
    let colors = widget.colors.slice();
    colors.splice(idx, 1);
    widget.colors = colors;
    widgets.ColorBarLibraryWidget = widget;
    this.setState({
      widgets: widgets
    });
  }

  deleteGradientFromColorLibrary = (idx) => {
    console.log('idx to delete gradient', idx);
    let widgets = Object.assign({}, this.state.widgets);
    let widget = Object.assign({}, widgets.ColorBarLibraryWidget);
    let gradients = widget.gradients.slice();
    gradients.splice(idx, 1);
    widget.gradients = gradients;
    widgets.ColorBarLibraryWidget = widget;
    this.setState({
      widgets: widgets
    });
  }

  deletePaletteFromColorLibrary = (idx) => {
    console.log('idx to delete palette', idx);
    let widgets = Object.assign({}, this.state.widgets);
    let widget = Object.assign({}, widgets.ColorBarLibraryWidget);
    let palettes = widget.palettes.slice();
    palettes.splice(idx, 1);
    widget.palettes = palettes;
    widgets.ColorBarLibraryWidget = widget;
    this.setState({
      widgets: widgets
    });

    // var newColors = this.state.widgets.ColorBarLibraryWidget
    // // newColors.colors.splice(newColors.colors.length - 1 - idx, 1)
    // newColors.colors.splice(idx, 1)
    // this.setState({
    //   ColorBarLibraryWidget: newPalettes
    // })
  }

  grabColorFromColorWidget = (color) => {
    let widgets = this.state.widgets;
    let palette = widgets.ColorPaletteWidget
    palette.fixedColor = color
    this.setState({
      widgets
    })
  }

  render() {
    const data = {
      userId: this.state.userId,
      editable: this.state.editMode,
      widgets: this.state.widgets
    }

    const funcProps = {
      getWidgetProps: this.getWidgetProps,
      setWidgetProps: this.setWidgetProps
    }

    let isAny = false;
    let bindedCounter = 0, loadedCounter = 0, hiddenCounter = 0;
    for (var key of Object.keys(this.state.widgets)) {
      const widget = this.state.widgets[key];
      if (widget.isBinded) {
        bindedCounter++;
        isAny = true;
      }
      if (widget.isLoaded)
        loadedCounter++;
      if (widget.isHidden)
        hiddenCounter++;
    }
    const isGood = (bindedCounter > 0 && bindedCounter <= loadedCounter) ? true : false;

    // resizing

    let elementsArray = document.querySelectorAll(".LibraryDropdown");
    const self = this;
    elementsArray.forEach((elem) => {
        elem.addEventListener("click", () => {
          clearTimeout();
          setTimeout(() => {
            this.resizeWidgets();
          }, 250);
        });
    });

    return(
      !this.state.isLoaded
      ?
        <div>
          <h1>Data is loading</h1>
        </div>
      :
        <div className="wrapper">
          <div className="CopiedToClipboard">
            <p>Copied to clipboard!</p>
          </div>
            {!isAny && <Placeholder />}
            <div className="widgetsGrid">
              {
                this.state.widgets.ColorBarLibraryWidget.isBinded
                &&
                !this.state.widgets.ColorBarLibraryWidget.isHidden
                &&
                <ColorLibrary
                  data={data}
                  updateBind={this.updateBind}
                  toggleHidden={this.toggleHidden}
                  widgetHasLoaded={this.widgetHasLoaded}
                  addToLibrary={ {
                    addColorsToColorLibrary: this.addColorsToColorLibrary,
                    addGradientsToColorLibrary: this.addGradientsToColorLibrary,
                    addPalettesToColorLibrary: this.addPalettesToColorLibrary
                  } }
                  deleteFunc={ {
                    color: this.deleteColorFromColorLibrary,
                    gradient: this.deleteGradientFromColorLibrary,
                    palette: this.deletePaletteFromColorLibrary
                  } }
                />
              }
              {
                this.state.widgets.ColorBarWidget.isBinded
                &&
                !this.state.widgets.ColorBarWidget.isHidden
                &&
                <Color
                  data={data}
                  updateBind={this.updateBind}
                  toggleHidden={this.toggleHidden}
                  widgetHasLoaded={this.widgetHasLoaded}
                  addColorToColorLibrary={this.addColorToColorLibrary}
                  grabColorFromColorWidget={this.grabColorFromColorWidget}
                />
              }
              {
                this.state.widgets.GradientWidget.isBinded
                &&
                !this.state.widgets.GradientWidget.isHidden
                &&
                <Gradient
                  data={data}
                  updateBind={this.updateBind}
                  toggleHidden={this.toggleHidden}
                  widgetHasLoaded={this.widgetHasLoaded}
                  funcProps={funcProps}
                />
              }
              {
                this.state.widgets.ColorPaletteWidget.isBinded
                &&
                !this.state.widgets.ColorPaletteWidget.isHidden
                &&
                <ColorPalette
                  data={data}
                  updateBind={this.updateBind}
                  toggleHidden={this.toggleHidden}
                  widgetHasLoaded={this.widgetHasLoaded}
                  funcProps={ funcProps }
                />
              }
              {
                this.state.widgets.Association.isBinded
                &&
                !this.state.widgets.Association.isHidden
                &&
                <Associations
                  data={data}
                  updateBind={this.updateBind}
                  toggleHidden={this.toggleHidden}
                  widgetHasLoaded={this.widgetHasLoaded}
                />
              }
            </div>
            <Catalog
              updateBind={this.updateBind}
              toggleHidden={this.toggleHidden}
              setEditMode={this.setEditMode}
              data={this.state.widgets}
            />
          </div>
    )
  }
}
