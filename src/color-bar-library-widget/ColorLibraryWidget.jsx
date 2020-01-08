import React from 'react'
import $ from 'jquery'

export default class ColorLibrary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name
    }

    this.userId = 0
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
        console.log(data)
        let result = data['result']
        if (result == '1') {
          let colors = data['colors']
          colors = colors.split(',')
          console.log('COLOR FOR LIBRARY:', colors)
          console.log('UPDATING WIDGET')
          let id = 0
          for (let el of colors) {
            console.log(id, el)
            let canv = $('<canvas class=\'SavedColor\' id=\'' + id + '\' style="background-color: ' + el + '">');
            $("#SavedFromColorWidget").prepend(canv)
            id = id + 1
          }
        }
      });
    });
  }

  render() {
    return (
      <div className="ColorLibrary">
        <h1>Get {this.state.name}</h1>

        <h2>Your colors from color widget</h2>

        <div id="SavedFromColorWidget" className="SavedFromColorWidget">

        </div>

      </div>

    )
  }
}
