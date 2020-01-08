import React from 'react'
import $ from 'jquery'

import '../color-bar-library-widget/color-bar-library-widget.css';

export default class Color extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name
    }

    this.bindUser = this.bindUser.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.bindColorLibrary = this.bindColorLibrary.bind(this)
    this.addColorToLibrary = this.addColorToLibrary.bind(this)

    this.userId = 0
    chrome.storage.sync.get(['userId'], function(result) {
      this.userId = result.userId
      console.log("retrieveng color")

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_widgets/handleColor",
        dataType: "json",
        data: {
          userId: this.userId
        }
      })
      .done(function(data) {
        console.log(data)
        let color = data["color"]
        if (color != null)
        {
          document.getElementById("box").style.background = color
        }
      });
    });
  }

  bindUser() {
    console.log("sending user id " + this.userId)
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_widgets/bindUser",
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      if (data["result"] == '1') console.log("widget has been binded")
      else if (data["result"] == '0') console.log("was unable to bind widget")
      else console.log("no return value")
    })
  }

  changeColor() {
    document.getElementById("box").style.background = document.getElementById("colorNumber").value

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_widgets/handleColor",
      data: {
        userId: userId,
        color: document.getElementById("colorNumber").value
      }
    })
  }

  bindColorLibrary () {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_library_widgets/bindUser",
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      if (data["result"] == '1') {
        console.log("widget has been binded");
        $('#bindColorLibrary').attr('disabled', 'disabled');
        $('#addColorToLibrary').attr('disabled', 'disabled');
      }
      else if (data["result"] == '0') console.log("was unable to bind widget")
      else console.log("no return value")
    })
  }

  addColorToLibrary() {
    let color_list = $("#SavedFromColorWidget")[0].children
    let new_color = document.getElementById("colorNumber").value
    console.log(color_list)
    if (color_list.length > 29) {

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_library_widgets/addColor",
        dataType: "json",
        data: {
          userId: userId,
          color: new_color,
          overflow: 1
        }
      })

      let id = 0
      color_list[29].remove()
      let canv = $('<canvas class=\'SavedColor\' id=\'' + id + '\' style="background-color: ' + new_color + '">');
      $("#SavedFromColorWidget").prepend(canv);
      for (let el of color_list) {
        el.id = id++;
      }
    } else {

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_library_widgets/addColor",
        dataType: "json",
        data: {
          userId: userId,
          color: new_color,
          overflow: 0
        }
      })

      let id = 29 - color_list.length
      let canv = $('<canvas class=\'SavedColor\' id=\'' + id + '\' style="background-color: ' + new_color + '">');
      $("#SavedFromColorWidget").prepend(canv);
    }
  }

  // Первый рендер виджета - проверяем файл настроек? если нет - создаем
  // componentDidMount() {
  //   document.getElementById("box").style.background = document.getElementById("colorNumber").value
  //
  //    $.ajax({
  //      method: "POST",
  //      url: "http://localhost:3000/widgets/handleColor",
  //      data: document.getElementById("colorNumber").value
  //    })
  // }
  //   console.log('Check if options file exist')
  //   const fs = require('fs')
  //   const path = './options/options.txt'
  //
  //   fs.access(path, fs.F_OK, (err) => {
  //     if (err) {
  //       // создать файл
  //     }
  //     else {
  //       // считываем цвет и меняем цвет виджета
  //     }
  //   })

  render() {
    return (
      <div className="Color">
        <h1>Get {this.state.name}</h1>

        <button
        type="button"
        id="addWidgetColor"
        onClick={ this.bindUser }>Добавить</button>

        <button
        type="button"
        id="addColorToLibrary"
        onClick={ this.addColorToLibrary }>Сохранить</button>

        <button
        type="button"
        id="bindColorLibrary"
        onClick={ this.bindColorLibrary }>Добавить библиотеку</button>

        <div
          id="box"
          className="colorBox"
        />

        <input
          id="colorNumber"
          type="text"
          placeholder="#000fff"
          pattern="^#[0-9a-fA-F]{6}$"
        />

        <button
          type="button"
          onClick={ this.changeColor }>Отправить</button>
      </div>
    )
  }
}
