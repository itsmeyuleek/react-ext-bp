import React from 'react'
import $ from 'jquery'

import '../color-bar-library-widget/color-bar-library-widget.css'

export default class Color extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      where: props.where,
      name: 'Color',
      description: 'Get a color by hex code',
      colorNumber: ''
    }

    this.changeColor = this.changeColor.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.userId = 0
    const self = this
    chrome.storage.sync.get(['userId'], function(result) {
      this.userId = result.userId
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_widgets/handleColor",
        dataType: "json",
        data: {
          userId: this.userId
        }
      })
      .done(function(data) {
        let color = data["color"]
        if (color != null)
        {
          $(".Color").css("background", color)
          $("#colorNumber").val(color)
          self.setState({
            colorNumber: color
          })
        }
      });
    });
  }

  changeColor() {
    $(".Color").css("background", this.state.colorNumber)
    $("#colorNumber").val(this.state.colorNumber)

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_widgets/handleColor",
      data: {
        userId: userId,
        color: this.state.colorNumber
      }
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  render() {
    const { updateBind, data, addColorToColorLibrary } = this.props
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
         <button className={addBtnClass} disabled={data.isBinded} onClick={() => updateBind(true, 'ColorBarWidget')} />
       </div>
     ) :
     (
       <div className="widgetWrapper">
      <div className="widget Color">

        <h1>{this.state.name}</h1>

        <button
          className={rmBtnClass}
          type="button"
          id="addWidgetColor"
          onClick={() => updateBind(false, 'ColorBarWidget')}
        />

        <label
          id="colorNumberLabel"
          htmlFor="colorNumber"
        >
          hex:
        </label>
        <input
          name="colorNumber"
          id="colorNumber"
          type="text"
          placeholder="#0F0F0F"
          pattern="^#[0-9a-fA-F]{6}$"
          onChange={(e) => this.handleChange(e)}
          value={this.state.colorNumber}
        />

        <button
          className="sendButton"
          type="button"
          onClick={ this.changeColor }
        >
          send
        </button>

        <button
          className="saveButton"
          type="button"
          id="addColorToLibrary"
          onClick={() => addColorToColorLibrary(this.state.colorNumber)}
        >
          save to library
        </button>
      </div>
      </div>
    )
  )
  }
}
