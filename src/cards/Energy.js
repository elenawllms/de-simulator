/* 
* ENERGY.JS
* This file controls the Energy Diagram tab.
* The main issue here is performance -- the 3D graphics for the energy diagram 
* take a lot of power from the browser.
* 
* Other issues include:
* - Making the colors responsive to theme (from constants.js)
* - Drawing a grid around the energy surface
* - Making a more interesting surface without sacrificing performance
* - Making the dimensions responsive
*/

import React from 'react';
import Sketch from 'react-p5'
import BottomRowSpan from '../templates/BottomRowSpan';

// initialize camera position
let cameraLatitude = 0.5;
let cameraLongitude = 2;

// TODO: put this in constants
const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};

export default function Energy(props) {

  // set up constants from props
  const isDark = props.isDark;
  const gridProps = props.gridProps;
  const energy = props.energy;
  const state = props.state;
  const vars = props.gridProps.variables;

  // Functions that convert between grid coordinates and pixel values
  // TODO: give these better names
  const valToPixel = (val, dim) => interpolate(val, gridProps.limits[dim][0], gridProps.limits[dim][1], -100, 100);
  const pixelToVal = (pixel, dim) => interpolate(pixel, -100, 100, gridProps.limits[dim][0], gridProps.limits[dim][1]);

  // orientCamera: handles camera movement from arrow keys -- no effect on mobile
  const orientCamera = (p) => {
    const cameraTiltIncrement = 1 / p.getFrameRate(); // constant speed regardless of framerate

    // longitudinal camera movement
    if (p.keyIsDown(p.LEFT_ARROW)) {
      cameraLongitude += cameraTiltIncrement;
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
      cameraLongitude -= cameraTiltIncrement;
    }
    
    // latitudinal camera movement
    if (p.keyIsDown(p.UP_ARROW) && cameraLatitude < p.HALF_PI - cameraTiltIncrement) {
      cameraLatitude += cameraTiltIncrement;
    } else if (p.keyIsDown(p.DOWN_ARROW) && cameraLatitude > cameraTiltIncrement - p.HALF_PI) {
      cameraLatitude -= cameraTiltIncrement;
    }

    // set camera position
    p.camera(300*Math.cos(cameraLongitude)*Math.cos(cameraLatitude),
         300*Math.sin(cameraLongitude)*Math.cos(cameraLatitude), 
         300*Math.sin(cameraLatitude), 0, 0, 0, 0, 0, -1);
  }

  // drawEnergySurface: draws the energy surface as discrete points
  const drawEnergySurface = p => {
    p.noStroke();
    const newState = {...state}; // deep copy of state
    for (let x = -100; x < 101; x+= 5) { // change increments to change resolution of surface
      for (let y = -100; y < 101; y+= 5) {
        p.push();
        newState[vars.x] = pixelToVal(x, 'x');
        newState[vars.y] = pixelToVal(y, 'y');
        const z = valToPixel(energy(newState), 'z'); // calculate energy
        if (z === null) continue; // ignore out-of-bounds points

        const hue = (p.int(z * 2) + 320) % 360; // color based on energy value
        p.fill(p.color('hsl(' + hue + ', 90%, 70%)'));
        p.translate(x, y, z);
        p.sphere(1.5); // draw point
        p.pop();
      }
    }
  }

  // drawState: draws the current state as a sphere w/ shadow
  const drawState = p => {
    p.push();
    p.fill(isDark ? 255 : 0);

    // compute position in pixels and draw as a sphere
    const xyPixelVal = ['x', 'y'].map(dim => valToPixel(state[vars[dim]], dim));
    const energyPixelVal = valToPixel(energy(state), 'z');
    p.translate(...xyPixelVal, energyPixelVal);
    p.sphere(4);

    // draw shadow as cylinder with height 0 and radius 4
    p.translate(0, 0, -120 - energyPixelVal);
    p.rotateX(p.HALF_PI);
    p.fill(isDark ? 10 : 150);
    p.cylinder(4, 0, 10, 1, true, false);
    p.pop();
  }

  // TODO: make dimensions of energy diagram responsive
  // setup: sets up the canvas with the correct dimensions
  const setup = (p, canvasParentRef) => {
    p.createCanvas(460, 460, p.WEBGL).parent(canvasParentRef);
    p.pixelDensity(2);
    p.frameRate(25);

  }

  // draw: incremented regularly at frame rate
  // TODO: make colors responsive to constants.js
  const draw = p => {
    p.background(isDark ? "#1F1E27" : 255);
    orientCamera(p);
    drawEnergySurface(p);
    drawState(p);
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
