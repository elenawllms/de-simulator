import React from 'react'

import {Energy, Options, Readout, StateSpace} from './cards/index.js';

export default function Panel(props) {
  return (
    <div id="Panel">
        <StateSpace grid={props.data.grid} state={props.state}/>
    </div>
  )
}
