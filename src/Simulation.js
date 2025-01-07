/* 
* Simulation.js
* Component controlling layout for site. All dependent components can be simulated 
* this way given the appropriate data.js file.
* 
*/

import React, {useState, useEffect} from 'react';
import NavBar from './NavBar.js';
import Panel from './Panel.js';

export default function Simulation(props) {

  // set initial state of simulation system
  const [state, setState] = useState(Object.fromEntries(Object.entries(props.data.stateVars).map(([key, value]) => [key, value.defaultValue])));

  // set initialState variable
  const stateWithoutTime = {...state};
  delete stateWithoutTime.time;
  const [initialState, setInitialState] = useState(stateWithoutTime);
  // set parameters of system
  const [parameters, setParameters] = useState(Object.fromEntries(Object.entries(props.data.parameters).map(([key, value]) => [key, value.defaultValue])))
  // eslint-disable-next-line
  const [pastStates, setPastStates] = useState([]);
  const [clock, setClock] = useState(0);

  // keeps track of past states up to 4000 entries
  useEffect(() => {
    pastStates.push(state);
    if (pastStates.length > 4000) { // avoid clogging up too much memory
      pastStates.shift();
    }
    // eslint-disable-next-line
  }, [state]);

  // update the pendulum's state regularly based on a window interval
  const play = () => {
    const intervalId = setInterval(() => {
      setState(state => ({...props.data.stepFn(state, {...parameters})}));
    }, 10); // TODO: make the time of the interval a constant
    setClock(intervalId);
  }

  // on load, start playing the animation. remove/comment this line to not play automatically.
  // eslint-disable-next-line
  useEffect(play, []);

  // toggles between playing and pausing the animation
  const pauseOrPlay = () => {
    if (clock) {
      clearInterval(clock);
      setClock(0);
    } else {play();}
  }

  // sets new interval when parameters change 
  // (otherwise while playing it doesn't take changes into account)
  useEffect(() => {
    if (clock) {
      clearInterval(clock);
      play();
    }
    // eslint-disable-next-line
  }, [parameters])

  // on reset, update t=0, and set angle and velocity to their initial states
  const reset = () => {
    state.time = 0;
    Object.keys(initialState).forEach(v => state[v] = initialState[v]);
    setState(state => ({...state}));
    setPastStates([]);
  }
 

  return (
    <>
      {/* Top navigation bar, passing down the switchTheme function */}
        <NavBar switchTheme={props.switchTheme} theme={props.theme} title={props.data.title}/>

        {/* Pause/Play and Reset buttons */}
        <button className="controlButton" id="pauseOrPlay" onClick={pauseOrPlay}>
          {clock ? <span className="material-symbols-rounded">pause</span> 
          : <span className="material-symbols-rounded">play_arrow</span> }
        </button>
        <button className="controlButton" id="reset" onClick={reset}>{<span className="material-symbols-rounded">replay</span>}</button>
        
        <div id="stage-wrapper">
          <div className="Stage">
            {/* Renders visualization provided in data */}
            {props.data.visualization(state, parameters, props.theme)} 
            {/* Renders panel */}
            <Panel
             data={props.data} 
             theme={props.theme} 
             state={state} 
             setState={setState} 
             initialState={initialState}
             setInitialState={setInitialState}
             pastStates={pastStates} 
             parameters={parameters}
             setParameters={setParameters}
             reset={reset}/>
          </div>
        </div>
    </>
  );
}
