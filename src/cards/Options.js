import React from 'react'
import Option from './Option.js'



export default function Options(props) {
  const optionRanges = props.data.optionRanges;
  const updateFromOptions = props.data.updateFromOptions;

  return (
    <div id="Options">
      {optionRanges(props.state).map((option) => 
        {return <Option
                  key={option.name} 
                  update={updateFromOptions(option)} 
                  option={option}
                 />}
      )}
    </div>
  )
}
