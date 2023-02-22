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
import {range} from '../constants';
import Alegreya from '../assets/Alegreya-VariableFont_wght.ttf';

// initialize camera position
let cameraLatitude = 0.5;
let cameraLongitude = 2;

let showLeftAxis = true;
let showFrontAxis = true;

let myFont;


// TODO: put this in constants
const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};

export default function Energy(props) {
  // set up constants from props
  const isDark = props.isDark;
  const gridProps = props.gridProps;
  // limits: {x: [-3.5, 3.5], y: [-10, 10], z: [-30, 50]}

  const parameters = props.parameters;
  const energy = props.energy;
  // energy(state, parameters)

  const stateVars = props.stateVars;

  const state = props.state; // actual array
  const vars = props.gridVars;

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

    // Change axes shown
    showFrontAxis = Math.sin(cameraLongitude) < 0;
    showLeftAxis = Math.cos(cameraLongitude) > 0;
  }

  const drawAxes = p => {
    const axisSize = 102;
    p.stroke(0);
    p.strokeWeight(0.5);

    p.fill(isDark ? 100 : 150);
    p.stroke(isDark ? 150 : 100);

    // Compute tick values
    let ticks = {};
    for (const dim of ['x', 'y', 'z']) {
      ticks[dim] = range(0, gridProps.limits[dim][1], gridProps.ticks[dim]).concat(range(0, gridProps.limits[dim][0], -gridProps.ticks[dim]));
    }

    p.textSize(10);

    // TODO: make this more efficient

    // FRONT OR BACK AXIS
    p.push();
    p.rotateX(p.HALF_PI);
    p.strokeWeight(1);
    p.translate(0, 0, axisSize * (showFrontAxis ? -1 : 1));
    // Draw box around background
    p.line(-axisSize, -axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, axisSize, -axisSize, 0);
    p.line(-axisSize, -axisSize, 0, axisSize, -axisSize, 0);

    p.strokeWeight(0.5);
    
    // Draw z-Ticks on front or back axis
    const dontRotateY = showFrontAxis;
    const swapSides = showLeftAxis ^ showFrontAxis;

    p.push();
    p.fill(isDark ? 255 : 0);
    p.textAlign(swapSides ? 'left' : 'right');

    for (let zTick of ticks["z"]) {
      p.line(-axisSize, valToPixel(zTick, 'z'), 0, axisSize, valToPixel(zTick, 'z'), 0);

      // Z-axis tick labels
      p.push();
      p.translate((axisSize + 5) * (showLeftAxis ? 1 : -1), valToPixel(zTick, 'z'), 0);
      p.rotateZ(p.PI);
      p.rotateY(dontRotateY ? 0 : p.PI);
      p.text(zTick,0, 0);
      p.pop();
    }

    // TODO: Draw z-label
    p.push();
    p.textAlign('center');
    p.translate((axisSize + 25) * (showLeftAxis ? 1 : -1), 0, 0);
    p.rotateZ(p.HALF_PI * (showLeftAxis ? -1 : 1));
    p.rotateY(dontRotateY ? 0 : p.PI);
    p.text("Energy",0, 0);
    p.pop();
    p.pop();
    
    // Draw x-Ticks on front or back axis
    for (let xTick of ticks["x"]) {
      p.line( valToPixel(xTick, 'x'), -axisSize, 0, valToPixel(xTick, 'x'), axisSize, 0);
    }
    p.pop();

    // Left or right axis
    p.push();
    p.strokeWeight(1);
    p.rotateY(p.HALF_PI);
    p.rotateZ(p.HALF_PI);
    p.translate(0, 0, axisSize * (showLeftAxis ? -1 : 1));
    p.line(-axisSize, -axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, axisSize, -axisSize, 0);
    p.line(-axisSize, -axisSize, 0, axisSize, -axisSize, 0);
    p.strokeWeight(0.5);

    // Draw y- and z-Ticks on left or right axis
    for (let yTick of ticks["y"]) {
      p.line( valToPixel(yTick, 'y'), -axisSize, 0, valToPixel(yTick, 'y'), axisSize, 0);
    }
    for (let zTick of ticks["z"]) {
      p.line(-axisSize, valToPixel(zTick, 'z'), 0, axisSize, valToPixel(zTick, 'z'), 0);
    }

    p.pop();

    // Bottom axis
    // Left or right axis
    p.push();
    p.strokeWeight(1);
    p.rotateZ(p.HALF_PI);
    p.translate(0, 0, -axisSize);
    p.line(-axisSize, -axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, -axisSize, axisSize, 0);
    p.line(axisSize, axisSize, 0, axisSize, -axisSize, 0);
    p.line(-axisSize, -axisSize, 0, axisSize, -axisSize, 0);
    p.strokeWeight(0.5);

    // Draw x- and y-Ticks on bottom axis
    p.textAlign(swapSides ? 'left' : 'right');
    p.fill(isDark ? 255 : 0);
    for (let yTick of ticks["y"]) {
      p.line( valToPixel(yTick, 'y'), -axisSize, 0, valToPixel(yTick, 'y'), axisSize, 0);
      // y labels
      p.push();
      p.translate(valToPixel(yTick, 'y'), (axisSize + 5) * (showLeftAxis ? -1 : 1),  0);
      p.rotateZ(p.HALF_PI * (showFrontAxis ? 1 : -1));
      p.text(yTick,0, 0);
      p.pop();
    }
    // Label the x-axis with name
    p.push();
    p.textAlign('center');
    p.translate(0, (axisSize + 25) * (showLeftAxis ? -1 : 1),  0);
    p.rotateZ(p.PI * (showLeftAxis ? 1 : 0));
    p.text(vars.y,0, 0);
    p.pop();


    p.textAlign(swapSides ? 'right' : 'left');
    for (let xTick of ticks["x"]) {
      p.line( -axisSize, valToPixel(xTick, 'x'),  0, axisSize, valToPixel(xTick, 'x'), 0);
      // x labels
      p.push();
      p.translate((axisSize + 5) * (showFrontAxis ? -1 : 1), valToPixel(xTick, 'x'),  0);
      p.rotateZ(p.PI * (showLeftAxis ? 1 : 0));
      p.text(xTick,0, 0);
      p.pop();
    }
    p.push();
    p.textAlign('center');
    p.translate((axisSize + 25) * (showFrontAxis ? -1 : 1), 0, 0);
    p.rotateZ(p.HALF_PI * (showFrontAxis ? 1 : -1));
    p.text(vars.x,0, 0);
    p.pop();

    p.pop();
  }

  // drawEnergySurface: draws the energy surface
  const drawEnergySurface = p => {
    const increment = 6;
    // p.noStroke();
    let allStates = [];
    const newState = {...state}; // deep copy of state

    for (let x = -100; x < 101; x+= increment) { // change increments to change resolution of surface
      let newRow = [];
      for (let y = -100; y < 101; y+= increment) {
        // p.push();
        newState[vars.x] = pixelToVal(x, 'x');
        newState[vars.y] = pixelToVal(y, 'y');
        const z = valToPixel(energy(newState, parameters), 'z'); // calculate energy
        newRow.push(z);
        // const hue = (p.int(z * 2) + 320) % 360; // color based on energy value
        // p.fill(p.color('hsl(' + hue + ', 90%, 70%)'));
        // p.translate(x, y, z);
        // p.sphere(1.5); // draw point
        // p.pop();
      }
      allStates.push(newRow);
    }

    p.strokeWeight(1);
    let row = 0;
    for (let x = -100; x < 101; x+= increment) {
      let col = 0;
      for (let y = -100; y < 101; y+= increment) {
        const z = allStates[row][col];
        if (z !== null) {
          const hue = (p.int(z*1.5) + 250) % 360; // color based on energy value
          p.stroke(p.color('hsl(' + hue + ', 90%, 70%)'));
          // p.stroke(0);

          let leftZ = 0;
          let behindZ = 0;

          if (row !== 0) {
            leftZ = allStates[row-1][col];
            if (leftZ !== null) p.line(x, y, z, x-increment, y, leftZ);
          }
          if (col !== 0) {
            behindZ = allStates[row][col-1];
            if (behindZ !== null) p.line(x, y, z, x, y-increment, behindZ);
          }

          // p.fill(p.color('hsla(' + hue + ', 90%, 70%, 0.6)'));
          // p.noStroke();
          // if (row !== 0 && col !== 0 && leftZ !== null && behindZ !== null) {
          //   let behindLeftZ = allStates[row-1][col-1];
          //   if (behindLeftZ !== null) {
          //     p.quad(x-increment, y-increment, behindLeftZ, x-increment, y, leftZ,x, y, z, x, y-increment, behindZ, 3, 3);
          //   }
            
          // }

        }
        col++;
      }
      row++;
    }
  }

  // drawState: draws the current state as a sphere w/ shadow
  const drawState = p => {
    p.push();
    p.noStroke();
    p.fill(isDark ? 255 : 0);

    // compute position in pixels and draw as a sphere
    const xyPixelVal = ['x', 'y'].map(dim => valToPixel(state[vars[dim]], dim));
    if (xyPixelVal[0] == null || xyPixelVal[1] == null) {
      return;
    }

    const energyPixelVal = valToPixel(energy(state, parameters), 'z');
    if (energyPixelVal == null) return;
    p.translate(...xyPixelVal, energyPixelVal);
    p.sphere(3);

    // draw shadow as cylinder with height 0 and radius 4
    p.translate(0, 0, -100 - energyPixelVal);
    p.rotateX(p.HALF_PI);
    p.fill(isDark ? 10 : 150);
    p.cylinder(5, 0, 10, 1, true, false);
    p.pop();
  }

  const pre = p => {
    myFont = p.loadFont(Alegreya, font=>console.log("loaded font"));
  }

  // TODO: make dimensions of energy diagram responsive
  // setup: sets up the canvas with the correct dimensions
  const setup = (p, canvasParentRef) => {
    p.createCanvas(460, 460, p.WEBGL).parent(canvasParentRef);
    p.pixelDensity(2);
    p.frameRate(25);
    p.textFont(myFont);
  }

  

  // draw: incremented regularly at frame rate
  // TODO: make colors responsive to constants.js
  const draw = p => {
    p.background(isDark ? "#1F1E27" : 255);
    orientCamera(p);
    drawEnergySurface(p);
    drawAxes(p);
    drawState(p);

  }


  return (
    <div id="Energy" className="graphicsWrapper">
      <div className='graphicsContainer'>
        <Sketch setup={setup} draw={draw} preload={pre}></Sketch>
      </div>
      <div className='bottomRow'>
        <BottomRowSpan label={stateVars[vars.x].displayName} value={state[vars.x]} units={stateVars[vars.x].unit}/>
        <BottomRowSpan label={stateVars[vars.y].displayName} value={state[vars.y]} units={stateVars[vars.y].unit}/>
        <BottomRowSpan label={"Energy"} value={energy(state, parameters)} units={"J"}/>
      </div>
    </div>
  )
}
