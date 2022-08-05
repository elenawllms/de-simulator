import React, {useState} from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Grid from '@mui/material/Grid';


const Input = styled(MuiInput)`
  width: 70px;
`;


export default function Option(props) {

    const [value, setValue] = useState(props.option.default);

    const handleChange = (e, newValue) => {
        setValue(newValue);
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
        <div>{props.option.name}: 
        <Box sx={{width: 250}}>
            <Grid container spacing={2} alignItems="center">
                
                <Grid item xs><Slider 
                    value={value} 
                    onChange={handleChange}
                    min={props.option.min} 
                    max={props.option.max}
                    step={0.01}

                /></Grid>
                <Grid item><Input
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 0.01,
                        min: props.option.mins,
                        max: props.option.max,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                /></Grid>
            </Grid>
            </Box>
        </div>
    )
}
