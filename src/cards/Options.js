import React from 'react'
import Option from './Option.js'

export default function Options() {

  const optionRanges = [
    {name: 'Initial Angle', min: -3.14, max: 3.14, default: 3, units: 'rad'},
    {name: 'Initial Velocity', min: -3.14, max: 3.14, default: 2, units: 'rad/s'},
    {name: 'Damping Constant', min: 0, max: 2, default: 0.2, units: 'kg/s'},
    {name: 'Length', min: 3, max: 10, default: 5, units: 'm'}
  ];

  return (
    <div id="Options">
      {optionRanges.map((option) => {return <Option key={option.name} option={option}/>})}
    </div>
  )
}
