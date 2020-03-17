import React from 'react'
import $ from 'jquery'

import ColorLibrarySquare from './ColorLibrarySquare'

export default class ColorLibrary extends React.Component {
  constructor(props) {
    super(props)

    this.componentDidUpdate = this.componentDidUpdate.bind(this)

    props.where !== 'catalog' ?
      this.state = {
        where: props.where,
        name: 'Color library',
        description: 'Store colors from Color widget',
        colors: props.widgetData.colors,
      }
    :
      this.state = {
        where: props.where,
        name: 'Color library',
        description: 'Store colors from Color widget',
      }

    this.userId = 0
    const self = this
    chrome.storage.sync.get(['userId'], function(result) {
      this.userId = result.userId

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_library_widgets/checkUser",
        dataType: "json",
        data: {
          userId: this.userId
        }
      })
      .done(function(data) {
        let isAdded = data['isAdded']
        if (isAdded == '0') {
          $('#bindColorLibrary').attr('disabled', 'disabled');
          $('#addColorToLibrary').attr('disabled', 'disabled');
        }
        else {
          $('#bindColorLibrary').removeAttr('disabled');
          $('#addColorToLibrary').removeAttr('disabled');
        }
      });

      console.log('GET COLORS FOR LIBRARY')
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_library_widgets/retrieveColors",
        dataType: "json",
        data: {
          userId: this.userId
        }
      })
      .done(function(data) {
        console.log('COLORS FOR LIBRARY', data)
        let result = data['result']
        if (result == '1') {
          if (data['colors'] !== null && data['colors'].length > 0) {
            let colors = data['colors']
            if (props.where !== 'catalog') {
              self.setState({
                colors: colors
              })
              self.props.addColorsToColorLibrary(colors)
              self.props.resizeWidgets()
            }
          }
        }
      });
    });
  }

  componentDidUpdate() {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_library_widgets/addColor",
      dataType: "json",
      data: {
        userId: userId,
        colors: this.state.colors
      }
    })
  }

  render() {
    const { updateBind, data } = this.props
    let rmBtnClass = ""
    let addBtnClass = ""
    if (data !== undefined) {
      rmBtnClass = data.editable ? "removeButton is-active" : "removeButton"
      addBtnClass = data.isBinded ? "addButton disabled" : "addButton enabled"
    }

    var colorSquares = []
    if (this.state.where !== 'catalog') {
      colorSquares = this.state.colors.slice(0).reverse().map((color, idx) => {
        return <ColorLibrarySquare key={idx} idx={idx} color={color} deleteColorFromColorLibrary={this.props.deleteColorFromColorLibrary}/>
      })
    }


    return (
      this.state.where == 'catalog' ?
      (
       <div className="catalogEntry">
         <h2>{this.state.name}</h2>
         <p>{this.state.description}</p>
         <button className={addBtnClass} disabled={data.isBinded} onClick={() => updateBind(true, 'ColorBarLibraryWidget')} />
       </div>
     ) :
     (
    //  <div className="widgetsGrid">
    <div className="widgetWrapper">
      <div
        className="widget ColorLibrary"
      >
        <h1>{this.state.name}</h1>
        <h2>
          Your colors from color widget
        </h2>
        <button
          className={rmBtnClass}
          onClick={() => updateBind(false, 'ColorBarLibraryWidget')}
        />
        <div
          id="SavedFromColorWidget"
          className="SavedFromColorWidget"
        >
          {colorSquares}
        </div>
      </div>
      </div>

    )
  )
  }
}
