import React from 'react';
import NavBar from '../NavBar.js';
import { STAGE_DIMENSIONS } from '../constants.js';
import {Energy, Options, Readout, StateSpace, Visualization} from '../cards/index.js';

export default function Spring(props) {

  const style = {
    width: 600 + 'px',
    height: 400 + 'px',
    minWidth: 600 + 'px'
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
