import React, {useState} from 'react'


export default function Option(props) {

    const valueName = props.option.name;
    const updateValue = (newValue) => {
        const newState = {...props.state};
        newState[valueName] = newValue;
        props.setState(newState);
    }

    const [value, setValue] = useState(props.state[valueName]);


    const handleBlur = () => {
        var revisedValue = value;
        if (value < props.option.min) {
            revisedValue = props.option.min;
        } else if (value > props.option.max) {
            revisedValue = props.option.max;
        }
        setValue(revisedValue);
        updateValue(revisedValue);
    };

    const handleSliderChange = (e) => {
        setValue(e.target.value);
        updateValue(e.target.value);
    };

    const handleInputChange = (e) => {
        setValue(e.target.value === '' ? '' : Number(e.target.value));
    }

    return (
        <div className="option">
            <div className="option-banner">
                <span className="option-name">{props.option.displayName}</span>
                <span className="option-value">
                <input type="number" onWheel={(e) => e.target.blur()}
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                /> {props.option.units}
                </span>
            </div>
            
            <input type="range"
                value={value} 
                onChange={handleSliderChange}
                min={props.option.min} 
                max={props.option.max}
                step={0.01}/>

            

            
            
        </div>
    )
}
