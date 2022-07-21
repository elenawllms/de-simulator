import React from 'react';
import {STAGE_DIMENSIONS} from './constants';
import Pendulum from './cards/Pendulum.js';
import StateSpace from './cards/StateSpace.js';
import Energy from './cards/Energy.js';
import Options from './cards/Options.js';
import Readout from './cards/Readout.js';


export default function Stage() {

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px',
    minWidth: STAGE_DIMENSIONS.width + 'px'
  };


  return(
    <div className="Stage" style={style}>
      <Pendulum/>
      <StateSpace/>
      <Energy/>
      <Options/>
      <Readout/>
    </div>
  );
}
