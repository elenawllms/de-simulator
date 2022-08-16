import React from 'react'
import Option from './Option.js'



export default function Options(props) {
  const optionRanges = props.data.optionRanges;

  return (
    <div id="Options">
      {optionRanges(props.state).map((option) => 
        {return <Option
                  key={option.name} 
                  optionRanges={props.optionRanges}
                 />}
      )}
    </div>
  )
}
