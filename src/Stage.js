import React from 'react';
import {STAGE_DIMENSIONS} from './constants';

export default function Stage() {

  const style = {
    width: STAGE_DIMENSIONS.width + 'px',
    height: STAGE_DIMENSIONS.height + 'px'
  };


  return(
    <div className="Stage" style={style}>Stage</div>
  );
}
