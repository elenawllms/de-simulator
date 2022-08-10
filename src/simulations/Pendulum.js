import React, {useState, useEffect} from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import Panel from '../Panel.js';
import Visualization from '../cards/Visualization.js';
import {PendulumData as data} from './simulation_data/PendulumData.js';


export default function Pendulum(props) {

  const [pendState, setPendState] = useState({time: 0, initialTheta: 1, initialOmega: 1, theta: 1, omega: 1, damping: 0.2, length: 10});
  const [clock, setClock] = useState(0);

  const play = () => {
    const intervalId = setInterval(() => {
      setPendState(state => ({...data.update(state)}));
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
  const reset = () => {
    pendState.time = 0;
    console.log(pendState.initialTheta);
    // pendState.theta = pendState.initialTheta;
    // pendState.omega = pendState.initialOmega;
    // data.updateFromOptions.theta();
  }

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };

 

  return (
    <>
      
        
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={data.title}/>
        <button className="controlButton" id="pauseOrPlay" onClick={pauseOrPlay}>
          {clock ? <span className="material-symbols-rounded">pause</span> 
          : <span className="material-symbols-rounded">play_arrow</span> }
        </button>
        <button className="controlButton" id="reset" onClick={reset}>{<span className="material-symbols-rounded">replay</span>}</button>
        <div id="stage-wrapper">
          <div className="Stage" style={style}>
            <Visualization key="pendVis" state={pendState}/>
            <Panel data={data} state={pendState}/>
          </div>
        </div>
    </>
  );
}
