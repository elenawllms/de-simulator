/**
 * OPTION.JS
 * 
 * Allows users to adjust values of parameters in the simulation.
 */

import React, {useState} from 'react'
var Latex = require('react-latex');

export default function Option(props) {

    // Changes the state reflecting the new value of the parameter
    const updateValue = (newValue) => {
        const newState = {...props.state};
        newState[props.name] = newValue;
        props.setState(newState);
    }

    // Truncates the value to two decimal places
    const [value, setValue] = useState(Number(props.state[props.name].toFixed(2)));

    // When the slider is moved, change the value and update state
    const handleSliderChange = (e) => {
        setValue(Number(e.target.value));
        updateValue(Number(e.target.value));
    };

    const handleInputChange = (e) => {
        setValue(e.target.value === '' ? '' : Number(e.target.value));
    }

    // Enforces limits of the parameter when it is manually entered
    const handleBlur = () => {
        var revisedValue = Number(value.toFixed(2));
        if (value < props.vars.min) {
            revisedValue = props.min;
        } else if (value > props.vars.max) {
            revisedValue = props.vars.max;
        }
        setValue(revisedValue);
        updateValue(revisedValue);
    };


    return (
        <div className="option">
            <div className="option-banner">
                <span className="option-name">{props.vars.displayName} (<span style={{fontSize: 12}}>
                    <Latex>{`$${props.vars.symbol}$`}</Latex> in <Latex>{`$${props.vars.unit}$`}</Latex> 
                    </span>)</span>
                <span className="option-value">
                <input type="number" onWheel={(e) => e.target.blur()}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                />
                </span>
            </div>
            
            <input type="range"
                value={value} 
                onChange={handleSliderChange}
                min={props.vars.min} 
                max={props.vars.max}
                step={0.01}/>

            

            
            
        </div>
    )
}
