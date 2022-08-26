import React from 'react';
import Sketch from 'react-p5'
import BottomRowSpan from '../templates/BottomRowSpan';

let cameraLatitude = 0.5;
let cameraLongitude = 2;

const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};

export default function Energy(props) {

  const isDark = props.isDark;
  const gridProps = props.gridProps;
  const energy = props.energy;
  const state = props.state;
  const vars = props.gridProps.variables;

  const valToPixel = (val, dim) => interpolate(val, gridProps.limits[dim][0], gridProps.limits[dim][1], -100, 100);
  const pixelToVal = (pixel, dim) => interpolate(pixel, -100, 100, gridProps.limits[dim][0], gridProps.limits[dim][1]);

  const orientCamera = (p) => {
    const cameraTiltIncrement = 1 / p.getFrameRate();
    if (p.keyIsDown(p.LEFT_ARROW)) {
      cameraLongitude += cameraTiltIncrement;
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
      cameraLongitude -= cameraTiltIncrement;
    }
    
    if (p.keyIsDown(p.UP_ARROW) && cameraLatitude < p.HALF_PI - cameraTiltIncrement) {
      cameraLatitude += cameraTiltIncrement;
    } else if (p.keyIsDown(p.DOWN_ARROW) && cameraLatitude > cameraTiltIncrement - p.HALF_PI) {
      cameraLatitude -= cameraTiltIncrement;
    }
    p.camera(300*Math.cos(cameraLongitude)*Math.cos(cameraLatitude),
         300*Math.sin(cameraLongitude)*Math.cos(cameraLatitude), 
         300*Math.sin(cameraLatitude), 0, 0, 0, 0, 0, -1);
  }

  const energySurface = p => {
    p.noStroke();
    const newState = {...state};
    for (let x = -100; x < 101; x+= 5) {
      for (let y = -100; y < 101; y+= 5) {
        p.push();
        newState[vars.x] = pixelToVal(x, 'x');
        newState[vars.y] = pixelToVal(y, 'y');
        const z = valToPixel(energy(newState), 'z');
        if (z === null) continue;
        const hue = (p.int(z * 2) + 320) % 360;
        p.fill(p.color('hsl(' + hue + ', 90%, 70%)'));
        p.translate(x, y, z);
        p.sphere(1.5);
        p.pop();
      }
    }
  }

  const drawState = p => {
    p.push();
    p.fill(isDark ? 255 : 0);

    // point
    const pixelState = ['x', 'y'].map(dim => valToPixel(state[vars[dim]], dim));
    const currentEnergy = valToPixel(energy(state), 'z');
    p.translate(...pixelState, currentEnergy);
    p.sphere(4);

    // shadow
    p.translate(0, 0, -120 - currentEnergy);
    p.rotateX(p.HALF_PI);
    p.fill(isDark ? 10 : 150);
    p.cylinder(4, 0, 10, 1, true, false);
    p.pop();
  }

  const setup = (p, canvasParentRef) => {
    p.createCanvas(460, 460, p.WEBGL).parent(canvasParentRef);
    p.pixelDensity(2);
    p.frameRate(25);

  }
  const draw = p => {
    p.background(isDark ? "#1F1E27" : 255);
    orientCamera(p);
    energySurface(p);
    drawState(p);
    // p.noStroke();
    // p.fill(255);
    // p.sphere(40);
  }


  return (
    <div id="Energy" className="graphicsWrapper">
      <div className='graphicsContainer'>
        <Sketch setup={setup} draw={draw}></Sketch>
      </div>
      <div className='bottomRow'>
        <BottomRowSpan label={gridProps.labels.x} value={state[vars.x]} units={gridProps.units.x}/>
        <BottomRowSpan label={gridProps.labels.y} value={state[vars.y]} units={gridProps.units.y}/>
        <BottomRowSpan label={gridProps.labels.z} value={energy(state)} units={gridProps.units.z}/>
      </div>
    </div>
  )
}
