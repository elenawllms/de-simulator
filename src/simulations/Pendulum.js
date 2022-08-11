/* 
* PENDULUM: Component controlling layout for Pendulum site. All dependent
* components should be generalizable given the appropriate data file.
* 
* Good for now
*/

import React, {useState, useEffect} from 'react';
import NavBar from '../NavBar.js';
import Panel from '../Panel.js';
import Visualization from '../cards/Visualization.js';
import {PendulumData as data} from './simulation_data/PendulumData.js';


export default function Pendulum(props) {

  // set initial state of pendulum system. should ideally have initial and actual values be the same.
  const [pendState, setPendState] = useState(
    {time: 0, initialTheta: 3, initialOmega: 3, theta: 3, omega: 3, damping: 0.2, length: 1}
    );
  const [clock, setClock] = useState(0);

  // update the pendulum's state regularly based on a window interval
  const play = () => {
    const intervalId = setInterval(() => {
      setPendState(state => ({...data.update(state)}));
    }, 10);
    setClock(intervalId);
  }

  // on load, start playing the animation. remove/comment this line to not play automatically.
  useEffect(play, []);


  const pauseOrPlay = () => {
    if (clock) {
      clearInterval(clock);
      setClock(0);
    } else {play();}
  }

  // on reset, update t=0, and set theta and omega to their initial states
  const reset = () => {
    pendState.time = 0;
    pendState.theta = pendState.initialTheta;
    pendState.omega = pendState.initialOmega;
  }
 

  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={data.title}/>
        <button className="controlButton" id="pauseOrPlay" onClick={pauseOrPlay}>
          {clock ? <span className="material-symbols-rounded">pause</span> 
          : <span className="material-symbols-rounded">play_arrow</span> }
        </button>
        <button className="controlButton" id="reset" onClick={reset}>{<span className="material-symbols-rounded">replay</span>}</button>
        
        <div id="stage-wrapper">
          <div className="Stage">
            <Visualization drawVisualization={data.drawVisualization} state={pendState}/>
            <Panel data={data} state={pendState}/>
          </div>
        </div>
    </>
  );
}
