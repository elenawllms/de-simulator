import React, {useState, useEffect} from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import {Energy, Options, Readout, StateSpace, Visualization} from '../cards/index.js';
import {PendulumData as data} from './simulation_data/PendulumData.js';


export default function Pendulum(props) {

  const [time, setTime] = useState(0);

  useEffect(() => {setInterval(() => {
    setTime(prevTime => prevTime + 1);
  }, 50);}, []);

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };



  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={data.title}/>
        <div id="stage-wrapper">
          <div className="Stage" style={style}>
            <Visualization/>
            <StateSpace grid={data.grid} time={time}/>
            <Energy/>
            <Options/>
            <Readout/>
          </div>
        </div>
    </>
  );
}
