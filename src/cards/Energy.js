import React from 'react';
import Sketch from 'react-p5'

export default function Energy(props) {

  const setup = (p, canvasParentRef) => {
    p.createCanvas(300, 200).parent(canvasParentRef);
  }
  const draw = p => {
    p.background('black');
    p.ellipse(50,props.state.theta * 20 + 100,80,80);
  }


  return (
    <div id="Energy">
      <Sketch id="energy-plot-container" setup={setup} draw={draw}></Sketch>
    </div>
  )
}
