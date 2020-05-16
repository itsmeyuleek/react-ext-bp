import React from 'react'
import $ from 'jquery'

export default class Gradient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: props.data.userId,
      where: props.where,
      name: 'Gradient',
      description: 'Generate or create a linear gradient',
      colorStartNumber: "",
      colorEndNumber: ""
    }
  }

  componentDidMount = () => {
    if (this.state.where != "catalog") {
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/gradient_widgets/handleColor",
        dataType: "json",
        data: {
          userId: this.state.userId
        }
      })
      .done((data) => {
        let startColor = data["startColor"]
        let endColor = data["endColor"]
        if (startColor != null && endColor != null)
        {
          let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
          $(".Gradient").css("background", lg)
          $("#colorStartNumber").val(startColor)
          $("#colorEndNumber").val(endColor)
        }
        this.setState({
          colorStartNumber: startColor,
          colorEndNumber: endColor
        })
        this.props.widgetHasLoaded("GradientWidget");
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { colorStartNumber, colorEndNumber } = this.state;
    const startLength = this.state.colorStartNumber && colorStartNumber.length,
          endLength = this.state.colorEndNdNumber && colorEndNumber.length;
    if (prevState.colorStartNumber != colorStartNumber || prevState.colorEndNumber != colorEndNumber)
      if ((startLength == 4|| startLength == 7) && (endLength == 4 || endLength == 7))
        this.changeColor()
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleSave = () => {
    const { getWidgetProps, setWidgetProps } = this.props.funcProps;
    const pair = { startColor: this.state.colorStartNumber, endColor: this.state.colorEndNumber };
    const libraryState = getWidgetProps("ColorBarLibraryWidget");
    let gradients = libraryState.gradients.slice();
    if (gradients.length > 5) {
      gradients.pop();
    }
    gradients.unshift(pair);
    libraryState.gradients = gradients;
    setWidgetProps("ColorBarLibraryWidget", libraryState);
  }

  changeColor = () => {
    let startColor = document.getElementById("colorStartNumber").value
    let endColor = document.getElementById("colorEndNumber").value

    let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
    $(".Gradient").css("background", lg)

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/gradient_widgets/handleColor",
      dataType: "json",
      data: {
        userId: this.state.userId,
        startColor: startColor,
        endColor: endColor
      }
    })
  }

  changeColorRandom = () => {
    let startColor = "#" + Math.random().toString(16).slice(2, 8)
    let endColor = "#" + Math.random().toString(16).slice(2, 8)

    let lg = "linear-gradient(90deg, " + startColor + ", " + endColor + ")"
    $(".Gradient").css("background", lg)

    $("#colorStartNumber").val(startColor)
    $("#colorEndNumber").val(endColor)

    this.setState({
      colorStartNumber: startColor,
      colorEndNumber: endColor
    })

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/gradient_widgets/handleColor",
      dataType: "json",
      data: {
        userId: this.state.userId,
        startColor: startColor,
        endColor: endColor
      }
    })
  }

  render() {
    const { updateBind, toggleHidden, data } = this.props
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
         <button className="CatalogAddButton" onClick={() => updateBind(toBind, 'GradientWidget')} >{addText}</button>
         <button className="CatalogShowButton" disabled={toHide} onClick={() => toggleHidden('GradientWidget')}>show</button>
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
          onClick={() => toggleHidden('GradientWidget')}
        />

        <label
          id="colorStartNumberLabel"
          htmlFor="colorStartNumber"
        >
          hex:
        </label>
        <input
          name="colorStartNumber"
          id="colorStartNumber"
          type="text"
          placeholder="#0F0F0F"
          pattern="^#[0-9a-fA-F]{6}$"
          onChange={(e) => this.handleChange(e)}
          value={ this.state.colorStartNumber || "" }
        />

        <label
          id="colorEndNumberLabel"
          htmlFor="colorEndNumber"
        >
          hex:
        </label>
        <input
          name="colorEndNumber"
          id="colorEndNumber"
          type="text"
          placeholder="#0F0F0F"
          pattern="^#[0-9a-fA-F]{6}$"
          onChange={(e) => this.handleChange(e)}
          value={ this.state.colorEndNumber || "" }
        />

        {/*
        <button
          className="sendButton"
          type="button"
          id="buttonSend"
          onClick={ this.changeColor }
        >
        send
        </button>
        */}
        <button
          className="saveButton"
          type="button"
          onClick={() => this.handleSave()}
        />
        <button
          className="randomButton"
          type="button"
          id="buttonRandom"
          onClick={ this.changeColorRandom }
        >
          random
        </button>
      </div>
      </div>
    //  </div>

    )
  )
  }
}
