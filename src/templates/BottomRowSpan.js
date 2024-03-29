/*
* BOTTOM ROW SPAN
* This template creates the readout along the bottom of the right panel.
*/

import React from 'react'

export default function BottomRowSpan(props) {
  return (
    <span>{props.label}: {props.value >= 0 ? "+" : ""}{props.value.toFixed(3)} {props.units}</span> 
  )
}
