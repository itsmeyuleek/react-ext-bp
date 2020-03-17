import React from 'react'
import $ from 'jquery'

import './placeholder.css'

export default function Placeholder() {
  const h1 = {
    fontSize: 36,
  }

  const h2 = {
    fontSize: 20,
  }

  return(
    <div className="PlaceholderWrap">
      <h1 style={h1}>Looks like you have no widgets yet</h1>
      <h2 style={h2}>CLICK THE PLUS BUTTON TO ADD THE FIRST ONE</h2>
    </div>
  )
}
