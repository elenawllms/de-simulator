import React from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import {Energy, Options, Readout, StateSpace, Visualization} from '../cards/index.js';

export default function Pendulum(props) {

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };


  return (
    <>
        <NavBar switchTheme={props.switchTheme} theme={props.theme}/>
        <div id="stage-wrapper">
          <div className="Stage" style={style}>
            <Visualization/>
            <StateSpace/>
            <Energy/>
            <Options/>
            <Readout/>
          </div>
        </div>
    </>
  );
}
