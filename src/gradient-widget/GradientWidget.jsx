import React from 'react'
import $ from 'jquery'

export default class Gradient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name
    }

    this.changeColor = this.changeColor.bind(this)
    this.changeColorRandom = this.changeColorRandom.bind(this)
    this.bindUser = this.bindUser.bind(this)

    this.userId = 0
    chrome.storage.sync.get(['userId'], function(result) {
      this.userId = result.userId

      console.log("retrieveng colors")

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/gradient_widgets/handleColor",
        dataType: "json",
        data: {
          userId: userId
        }
      })
      .done(function(data) {
        console.log(data)
        let startColor = data["startColor"]
        let endColor = data["endColor"]
        if (startColor != null && endColor != null)
        {
          var c = document.getElementById("gradientCanvas");
          var ctx = c.getContext("2d");

          var grd = ctx.createLinearGradient(0, 0, c.width, 0);
          grd.addColorStop(0, startColor);
          grd.addColorStop(1, endColor);

          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, c.width, c.height);
        }
      });
    })
  }

  bindUser() {
    console.log("sending user id " + this.userId)
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/gradient_widgets/bindUser",
      dataType: "json",
      data: {
        userId: userId
      }
    })
    .done(function(data) {
      if (data["result"] == '1') console.log("widget has benn binded")
      else if (data["result"] == '0') console.log("was unable to bind widgte")
      else console.log("no return value")
    })
  }

  changeColor() {
    let startColor = document.getElementById("colorStartNumber").value
    let endColor = document.getElementById("colorEndNumber").value

    var c = document.getElementById("gradientCanvas");
    var ctx = c.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, c.width, 0);
    grd.addColorStop(0, startColor);
    grd.addColorStop(1, endColor);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, c.width, c.height);

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/gradient_widgets/handleColor",
      dataType: "json",
      data: {
        userId: userId,
        startColor: startColor,
        endColor: endColor
    }
    })
  }

  changeColorRandom() {
    let startColor = "#" + Math.random().toString(16).slice(2, 8)
    let endColor = "#" + Math.random().toString(16).slice(2, 8)

    var c = document.getElementById("gradientCanvas");
    var ctx = c.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, c.width, 0);
    grd.addColorStop(0, startColor);
    grd.addColorStop(1, endColor);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, c.width, c.height);

    document.getElementById("colorStartNumber").value = startColor;
    document.getElementById("colorEndNumber").value = endColor;

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/gradient_widgets/handleColor",
      dataType: "json",
      data: {
        userId: userId,
        startColor: startColor,
        endColor: endColor
    }
    })
  }

  render() {
    return (
      <div className="Gradient">
        <h1>Get {this.state.name}</h1>

        <button
        type="button"
        id="addWidgetGradient"
        onClick={ this.bindUser }>Добавить</button>

        <button
          type="button"
          id="buttonRandom"
          onClick={ this.changeColorRandom }>Рандом</button>

        <canvas
          id="gradientCanvas"
          className="colorBoxGradient"
        />

        <input
          id="colorStartNumber"
          type="text"
          placeholder="#000fff"
          pattern="^#[0-9a-fA-F]{6}$"
        />

        <input
          id="colorEndNumber"
          type="text"
          placeholder="#000fff"
          pattern="^#[0-9a-fA-F]{6}$"
        />

        <button
          type="button"
          id="buttonSend"
          onClick={ this.changeColor }>Отправить</button>

      </div>

    )
  }
}
