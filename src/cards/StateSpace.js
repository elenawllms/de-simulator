import React from 'react'

export default function StateSpace(props) {
  return (
    <div id="StateSpace">{props.grid.limits.x.lower}, {props.grid.origin.y}</div>
  )
}
