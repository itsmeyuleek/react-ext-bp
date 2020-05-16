import React from 'react'
import $ from 'jquery'

import '../color-bar-library-widget/color-bar-library-widget.css'

export default class Color extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: props.data.userId,
      where: props.where,
      name: 'Color',
      description: 'Get a color by hex code',
      colorNumber: ''
    }
  }

  componentDidMount = () => {
    if (this.state.where != "catalog") {
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/color_bar_widgets/handleColor",
        dataType: "json",
        data: {
          userId: this.state.userId
        }
      })
      .done((data) => {
        let color = data["color"];
        if (color != null)
        {
          $(".Color").css("background", color);
          $("#colorNumber").val(color);
          this.setState({
            colorNumber: color
          });
        }
        this.props.widgetHasLoaded("ColorBarWidget");
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const color = this.state.colorNumber
    if (color.length == 4 || color.length == 7)
      if (prevState.colorNumber != color) {
        this.changeColor()
        this.props.grabColorFromColorWidget(color)
      }
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  changeColor = () => {
    $(".Color").css("background", this.state.colorNumber)
    $("#colorNumber").val(this.state.colorNumber)

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/color_bar_widgets/handleColor",
      data: {
        userId: this.state.userId,
        color: this.state.colorNumber
      }
    })
  }

  sh = (e) => {
    console.log(e)
  }

  render() {
    const { updateBind, toggleHidden, data, addColorToColorLibrary } = this.props
    let rmBtnClass = ""
    let addBtnClass = ""
    if (data !== undefined) {
      rmBtnClass = data.editable ? "removeButton is-active" : "removeButton"
      addBtnClass = data.isBinded ? "addButton remove" : "addButton enabled"
    }
    const toBind = !data.isBinded ? true : false;
    const toHide = !data.isHidden ? true : false;
    const addText = data.isBinded ? "remove" : "add";

    return (
      this.state.where == 'catalog' ?
      (
       <div className="catalogEntry">
         <h2>{this.state.name}</h2>
         <p>{this.state.description}</p>
         <button className="CatalogAddButton" onClick={() => updateBind(toBind, 'ColorBarWidget')} >{addText}</button>
         <button className="CatalogShowButton" disabled={toHide} onClick={() => toggleHidden('ColorBarWidget')}>show</button>
       </div>
     ) :
     (
      <div className="widgetWrapper">
      <div className="widget Color" onDrag={(e) => this.sh(e)}>

        <h1>{this.state.name}</h1>

        {/*
        <button
          className={rmBtnClass}
          type="button"
          id="addWidgetColor"
          onClick={() => updateBind(false, 'ColorBarWidget')}
        />
        */}

        <button
          className={rmBtnClass}
          type="button"
          id="addWidgetColor"
          onClick={() => toggleHidden('ColorBarWidget')}
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

        {/*
        <button
          className="sendButton"
          type="button"
          onClick={ this.changeColor }
        >
          send
        </button>
        */}

        <button
          className="saveButton"
          type="button"
          id="addColorToLibrary"
          onClick={() => addColorToColorLibrary(this.state.colorNumber)}
        />
      </div>
      </div>
    )
  )
  }
}
