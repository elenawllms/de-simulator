import React, {useState, useEffect} from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import Panel from '../Panel.js';
import Visualization from '../cards/Visualization.js';
import {PendulumData as data} from './simulation_data/PendulumData.js';


export default function Pendulum(props) {

  const [pendState, setPendState] = useState({time: 0, theta: 3, omega: 5, damping: 0.2, length: 10});
  const [clock, setClock] = useState(0);

  const play = () => {
    const intervalId = setInterval(() => {
      setPendState(state => data.update(state));
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
  const resetTime = () => {
    pendState.time = 0;
  }

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };

  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={data.title}/>
        <button id="pauseOrPlay" onClick={pauseOrPlay}>Pause/Play</button>
        <button id="reset" onClick={resetTime}>t = 0</button>
        <div id="stage-wrapper">
          <div className="Stage" style={style}>
            <Visualization state={pendState}/>
            <Panel data={data} state={pendState}/>
          </div>
        </div>
    </>
  );
}
