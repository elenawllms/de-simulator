import React from 'react'
import Option from './Option.js'



export default function Options(props) {

  return (
    <div id="Options">
      <h1>Constants</h1>
      {Object.keys(props.parameters).map(name => (<Option
                  key={name} 
                  name={name}
                  vars={props.parameterVars[name]}
                  state={props.parameters}
                  setState={props.setParameters}
                 />))}
      <h1>Initial Conditions</h1>
      {Object.keys(props.initialState).map(name => (<Option
                  key={name} 
                  name={name}
                  vars={props.stateVars[name]}
                  state={props.initialState}
                  setState={props.setInitialState}
                 />))}
    </div>
  )
}
