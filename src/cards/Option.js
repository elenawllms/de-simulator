import React, {useState, useEffect} from 'react'


export default function Option(props) {

    const [value, setValue] = useState(props.option.value);
    
    // eslint-disable-next-line
    useEffect(() => {props.option.update(value)}, [value]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleInputChange = (e, newValue) => {
        setValue(e.target.value === '' ? '' : Number(e.target.value));
    }

    const handleBlur = () => {
        if (value < props.option.min) {
          setValue(props.option.min);
        } else if (value > props.option.max) {
          setValue(props.option.max);
        }
    };

    return (
        <div className="option">
            <p id="input-slider">
                {props.option.name}: <input type="number"
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                />
            </p>

            <input type="range"
            value={value} 
            onChange={handleChange}
            min={props.option.min} 
            max={props.option.max}
            step={0.01}/>
            
        </div>
    )
}
