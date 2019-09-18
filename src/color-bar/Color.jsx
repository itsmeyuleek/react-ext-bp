import React from 'react'
import $ from 'jquery'

export default class Color extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name
    }

    $.ajax({
      method: "GET",
      url: "http://localhost:3000/widgets/handleColor"
    })
    .done(function(data) {
      console.log("color: ")
      console.log(data);
      document.getElementById("box").style.background = data;
    });

    this.changeColor = this.changeColor.bind(this)
  }

  changeColor() {
    document.getElementById("box").style.background = document.getElementById("colorNumber").value

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/widgets/handleColor",
      data: document.getElementById("colorNumber").value
    })
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
