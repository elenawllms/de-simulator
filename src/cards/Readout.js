import React from 'react'

export default function Readout(props) {
  return (
    <div id="Readout" style={{fontFamily: "IBM Plex Mono"}}>
      time: {props.state.time.toFixed(3)}<br/>
      angle: {props.state.angle.toFixed(3)}<br/>
      velocity: {props.state.velocity.toFixed(3)}
    </div>
  )
}
