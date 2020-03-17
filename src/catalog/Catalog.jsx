import React from 'react'
import $ from 'jquery'

import Color from '../color-bar/Color.jsx'
import ColorLibrary from '../color-bar-library-widget/ColorLibraryWidget.jsx'
import Gradient from '../gradient-widget/GradientWidget.jsx'
import Associations from '../associations-widget/AssociationsWidget.jsx'

function CatalogList(props) {
  return(
    <div className="catalogList">
      <Color where='catalog' updateBind={props.updateBind} data={props.data.ColorBarWidget} />
      <ColorLibrary where='catalog' updateBind={props.updateBind} data={props.data.ColorBarLibraryWidget} />
      <Gradient where='catalog' updateBind={props.updateBind} data={props.data.GradientWidget} />
      <Associations where='catalog' updateBind={props.updateBind} data={props.data.Association} />
    </div>
  )
}

export default class Catalog extends React.Component {
  constructor(props) {
    super(props)

    this.buttonToggle = this.buttonToggle.bind(this)

    this.state = {
      name: props.name,
      pressed: false,
    }
  }

  buttonToggle(event) {
    const target = event.target['className']
    target.split(' ')[0] === "popButton" && (
      $('.popButton').toggleClass('is-active'),
      $('.catalogList').toggleClass('is-active'),
      this.setState({
        ...this.state,
        pressed: !this.state.pressed,
      })
    )

  }

  render() {
    const pressed = this.state.pressed
    const { updateBind, setEditMode } = this.props
    
    return(
      <div className="catalogWrapper">
        {this.state.pressed && <CatalogList updateBind={updateBind} data={this.props.data}/>}
        <button className="popButton" onClick={e => this.buttonToggle(e)}/>
        <button className="editButton" onClick={setEditMode}/>
      </div>
    )
  }
}
