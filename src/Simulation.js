/* 
* SIMULATION: Component controlling layout for Pendulum site. All dependent
* components should be generalizable given the appropriate data file.
* 
* Good for now
*/

import React, {useState, useEffect} from 'react';
import NavBar from './NavBar.js';
import Panel from './Panel.js';
import PendulumVis from './simulations/visualizations/PendulumVis.js';

export default function Pendulum(props) {

  // set initial state of pendulum system. should ideally have initial and actual values be the same.
  const [state, setState] = useState(props.data.defaultState);
  // eslint-disable-next-line
  const [pastStates, setPastStates] = useState([]);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    pastStates.push(state);
    if (pastStates.length > 5000) {
      pastStates.shift();
    }
    // eslint-disable-next-line
  }, [state]);

  // update the pendulum's state regularly based on a window interval
  const play = () => {
    const intervalId = setInterval(() => {
      setState(state => ({...props.data.incrementState(state)}));
    }, 10);
    setClock(intervalId);
  }

  // on load, start playing the animation. remove/comment this line to not play automatically.
  // eslint-disable-next-line
  useEffect(play, []);

  const pauseOrPlay = () => {
    if (clock) {
      clearInterval(clock);
      setClock(0);
    } else {play();}
  }

  // on reset, update t=0, and set angle and velocity to their initial states
  const reset = () => {
    state.time = 0;
    state.angle = state.initialAngle;
    state.velocity = state.initialVelocity;
    setState(state => ({...state}));
    setPastStates([]);
  }
 

  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={props.data.title}/>
        <button className="controlButton" id="pauseOrPlay" onClick={pauseOrPlay}>
          {clock ? <span className="material-symbols-rounded">pause</span> 
          : <span className="material-symbols-rounded">play_arrow</span> }
        </button>
        <button className="controlButton" id="reset" onClick={reset}>{<span className="material-symbols-rounded">replay</span>}</button>
        
        <div id="stage-wrapper">
          <div className="Stage">
            <PendulumVis state={state} theme={props.theme}/>
            <Panel data={props.data} theme={props.theme} state={state} setState={setState} pastStates={pastStates} reset={reset}/>
          </div>
        </div>
    </>
  );
}
