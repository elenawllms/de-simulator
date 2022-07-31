import React, {useState, useEffect} from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import {Energy, Options, Readout, StateSpace, Visualization} from '../cards/index.js';
import {PendulumData as data} from './simulation_data/PendulumData.js';


export default function Pendulum(props) {

  const [time, setTime] = useState(0);
  const [clock, setClock] = useState(0);

  const play = () => {
    const intervalId = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 10);
    setClock(intervalId);
  }

  useEffect(play, []);


  const pauseOrPlay = () => {
    if (clock) {
      clearInterval(clock);
      setClock(0);
    } else {play();}
  }

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };

  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={data.title}/>
        <button onClick={pauseOrPlay}>Pause/Play</button>
        <button onClick={() => setTime(0)}>t = 0</button>
        <div id="stage-wrapper">
          <div className="Stage" style={style}>
            <Visualization time={time}/>
            <StateSpace grid={data.grid} time={time}/>
            <Energy/>
            <Options/>
            <Readout/>
          </div>
        </div>
    </>
  );
}
