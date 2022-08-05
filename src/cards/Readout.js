import React from 'react'

export default function Readout(props) {
  return (
    <div id="Readout" style={{fontFamily: "IBM Plex Mono"}}>
      time: {props.state.time.toFixed(3)}<br/>
      angle: {props.state.theta.toFixed(3)}<br/>
      velocity: {props.state.omega.toFixed(3)}
    </div>
  )
}
