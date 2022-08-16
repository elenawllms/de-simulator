import React from 'react'
import Option from './Option.js'



export default function Options(props) {
  const options = props.options;

  return (
    <div id="Options">
      {options.map(option => (<Option
                  key={option.name} 
                  state={props.state}
                  option={option}
                  setState={props.setState}
                 />))}
    </div>
  )
}
