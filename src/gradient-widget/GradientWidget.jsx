import React from 'react'
import $ from 'jquery'

export default class Gradient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      where: props.where,
      name: 'Gradient',
      description: 'Generate or create a linear gradient'
    }

    this.changeColor = this.changeColor.bind(this)
    this.changeColorRandom = this.changeColorRandom.bind(this)

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
          let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
          $(".Gradient").css("background", lg)
          $("#colorStartNumber").val(startColor)
          $("#colorEndNumber").val(endColor)
        }
      });
    })
  }

  changeColor() {
    let startColor = document.getElementById("colorStartNumber").value
    let endColor = document.getElementById("colorEndNumber").value

    let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
    $(".Gradient").css("background", lg)

    $("#colorStartNumber").val(startColor)
    $("#colorEndNumber").val(endColor)

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

    // var c = document.getElementById("gradientCanvas");
    // var ctx = c.getContext("2d");

    let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
    $(".Gradient").css("background", lg)

    $("#colorStartNumber").val(startColor)
    $("#colorEndNumber").val(endColor)
    // var grd = ctx.createLinearGradient(0, 0, c.width, 0);
    // grd.addColorStop(0, startColor);
    // grd.addColorStop(1, endColor);
    //
    // ctx.fillStyle = grd;
    // ctx.fillRect(0, 0, c.width, c.height);
    //
    // document.getElementById("colorStartNumber").value = startColor;
    // document.getElementById("colorEndNumber").value = endColor;

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
    const { updateBind, data } = this.props
    let rmBtnClass = ""
    let addBtnClass = ""
    if (data !== undefined) {
      rmBtnClass = data.editable ? "removeButton is-active" : "removeButton"
      addBtnClass = data.isBinded ? "addButton disabled" : "addButton enabled"
    }

    return (
      this.state.where == 'catalog' ?
      (
       <div className="catalogEntry">
         <h2>{this.state.name}</h2>
         <p>{this.state.description}</p>
         <button className={addBtnClass} disabled={data.isBinded} onClick={() => updateBind(true, 'GradientWidget')} />
       </div>
     ) :
     (
    //  <div className="widgetsGrid">
    <div className="widgetWrapper">
      <div className="widget Gradient">
        <h1>{this.state.name}</h1>

        <button
          className={rmBtnClass}
          type="button"
          id="addWidgetGradient"
          onClick={() => updateBind(false, 'GradientWidget')}
        />

        <button
          className="randomButton"
          type="button"
          id="buttonRandom"
          onClick={ this.changeColorRandom }
        >
          random
        </button>

        <label
          id="colorStartNumberLabel"
          htmlFor="colorStartNumber"
        >
          hex:
        </label>
        <input
          id="colorStartNumber"
          type="text"
          placeholder="#0F0F0F"
          pattern="^#[0-9a-fA-F]{6}$"
        />

        <label
          id="colorEndNumberLabel"
          htmlFor="colorEndNumber"
        >
          hex:
        </label>
        <input
          id="colorEndNumber"
          type="text"
          placeholder="#0F0F0F"
          pattern="^#[0-9a-fA-F]{6}$"
        />


        <button
          className="sendButton"
          type="button"
          id="buttonSend"
          onClick={ this.changeColor }
        >
        send
        </button>
      </div>
      </div>
    //  </div>

    )
  )
  }
}
