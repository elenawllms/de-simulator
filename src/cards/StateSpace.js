/* 
* STATE SPACE
* Grid of angle vs. velocity depicting the current state, along with a slope field. 
* Illustrates past states as a comet or trail.
* Allows a user to interact with the state (click to set initial state)
*/

import React, {useState} from 'react';
import Sketch from 'react-p5';
import BottomRowSpan from '../templates/BottomRowSpan';

// TODO: make this specific to each simulation
const SLOPE_SCALE_FACTOR = 25;

// TODO: Put this in constants.js
const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};

// allow 100 pixels for actual grid, 30 for padding and labels
const TOTAL_CANVAS_SIZE = 130;



export default function StateSpace(props) {
  // default to comet style
  const [trailStyle, setTrailStyle] = useState('comet');

  // set constants based on states, theme, simulation data, etc
  const state = props.state;
  const pastStates = props.pastStates;
  const gridProps = props.gridProps;
  const isDark = props.isDark;
  const xVar = props.gridVariables.x;
  const yVar = props.gridVariables.y;
  const parameters = props.parameters;
  const stateVars = props.stateVars;

  // TODO: rename these helper functions
  // different for x and y in order to scale the y axis positively in the upward direction
  const getX = xValue => interpolate(xValue, gridProps.limits.x[0], gridProps.limits.x[1], -100, 100);
  const getY = xValue => interpolate(xValue, gridProps.limits.y[1], gridProps.limits.y[0],  -100, 100);
  const getXVal = x => interpolate(x, -100, 100, gridProps.limits['x'][0], gridProps.limits['x'][1]);
  const getYVal = y => interpolate(y, -100, 100, gridProps.limits['y'][1], gridProps.limits['y'][0]);
  const getPoint = (point) => {
    const x = getX(point[0]);
    const y = getY(point[1]);
    return (x != null & y != null) ? [x, y] : null;
  }

  // initialScaling: resets the coordinate system
  const initialScaling = (p) => {
    p.translate(p.width / 2, p.height / 2);
    p.scale(p.width / (TOTAL_CANVAS_SIZE * 2));
    p.background(props.isDark ? "#1F1E27" : 255);
  }

  // drawGridBorder: draws the outline of the grid
  const drawGridBorder = (p) => {
    p.stroke(isDark ? 255 : 0);
    p.fill(isDark ? "#1F1E27" : 255);
    p.strokeWeight(0.2);
    p.rect(-100, -100, 200, 200);
  }

  // tickMark: draws and labels a tick mark
  function tickMark(p, val, isVertical) { // isVertical: true if in y-direction, false if in x-direction
    const scaledVal = (isVertical) ? getX(val) : getY(val);
    if (null == scaledVal) return; // disregard if out of bounds
    if (isVertical) { // if an x-coordinate
      p.line(scaledVal, 103, scaledVal, 100);
      p.line(scaledVal, -103, scaledVal, -100);
      p.text(val, scaledVal, -106);
      p.text(val, scaledVal, 110);
    } else { // if a y-coordinate
      p.line(-103, scaledVal, -100, scaledVal);
      p.line(103, scaledVal, 100, scaledVal);
      p.text(val, -108, scaledVal+2);
      p.text(val, 108, scaledVal+2);
    }
  }

  // drawAllTicks: draws all the tick marks and labels
  function drawAllTicks(p) {
    p.textSize(7);
    p.textAlign(p.CENTER);
    p.fill(isDark ? 255 : 0);
    p.stroke(isDark ? 255 : 0);
    p.strokeWeight(0.2);
    ['x', 'y'].forEach(dim => { // for both dimensions, for each tick value...
      for (let tick=gridProps.origin[dim]; tick<gridProps.limits[dim][1]; tick+=gridProps.ticks[dim]) {
        tickMark(p, tick, dim === 'x');
      }
      for (let tick=gridProps.origin[dim]; tick>gridProps.limits[dim][0]; tick-=gridProps.ticks[dim]) {
        tickMark(p, tick, dim === 'x');
      }
    })
    
  }

  // drawArrow: draws one arrow on the slope field
  function drawArrow(p, xVal, yVal) {

    // new modifiable state
    const newState = {...state};
    newState[xVar] = xVal;
    newState[yVar] = yVal;
  
    // derivative calculations
    const xWindowSize = gridProps.limits.x[1] - gridProps.limits.x[0];
    const yWindowSize = gridProps.limits.y[1] - gridProps.limits.y[0];

    const dx = props.derivatives[xVar](newState, parameters);
    const dy = props.derivatives[yVar](newState, parameters);
    const angle = Math.atan((dy / yWindowSize)/(dx / xWindowSize));
    const del_x = 3 * Math.cos(angle);
    const del_y = -3 * Math.sin(angle);
    const [x, y] = getPoint([xVal, yVal]);
    if (dx === 0 && dy === 0) return;
    
    // draw line
    p.strokeWeight(0.5);
    const magnitude = SLOPE_SCALE_FACTOR*Math.sqrt(dy*dy + dx*dx);
    if (isDark) {
      // stroke(color('hsl(' + (650 - int(magnitude)) % 360 + ', 90%, 70%)'));
      p.stroke(0.7 * magnitude + 30);
    } else {
      p.stroke(255 - 0.65 * magnitude);
    }
    p.line(x-del_x, y-del_y, x+del_x, y+del_y);
    
    // draw arrow
    p.strokeWeight(1.5);
    const dir = (dx >= 0) ? 1 : -1;
    p.push();
    p.translate(x + dir*del_x, y + dir*del_y);
    p.rotate(-angle);
    p.triangle(dir*0.5, 0, 0, -0.2, 0, 0.2);
    p.pop();
  }
  
  // drawSlopeField: draws the entire slope field
  function drawSlopeField(p) {
    p.strokeWeight(1);
    p.stroke(isDark ? 255 : 0);
    for (let x=-90; x<=90; x+=10) {
      for (let y=-90; y<=90; y+=10) {
        drawArrow(p, getXVal(x), getYVal(y));
      }
    }
  }

  // drawComet: draws a comet representing the last 50 states
  function drawComet(p) {
    const pastStatePoints = pastStates.slice(-50).map(state => { // select last 50 states
      const scale = Math.exp(2 * (state.time - props.state.time)); // scale down size of comet exponentially
      const point = getPoint([state[xVar], state[yVar]]);
      return {scale: scale, point: point};
    }).filter(pastState => pastState.point != null);

    // trailing points and shadows
    [{color: isDark ? "#1F1E27" : 255, size: 9}, {color:"#0091ff", size: 5}].forEach(trail => {
      p.stroke(trail.color);
      pastStatePoints.forEach(pastState => {
        p.strokeWeight(trail.size * pastState.scale);
        p.point(...pastState.point);
      })
    })
  }

  // drawPath: draws all past states still saved as constant-sized points
  function drawPath(p) {
    if (pastStates.length === 0) return;
    const pastStatePoints = pastStates.map(
      state => getPoint([state[xVar], state[yVar]])
      ).filter(point => point != null);
    p.stroke(isDark ? 235 : 20);
    p.strokeWeight(1);
    // let lastPoint = pastStatePoints[0];
    pastStatePoints.forEach(point => {
      // causes weird behavior off the page
      p.point(...point);
      // p.line(...lastPoint, ...point);
      // lastPoint = point;
    })
  }

  // drawState: draws the current state as a point in the theme color
  // TODO: make this vary with the theme color from constants.js
  function drawState(p) {
    // draw current state shadow
    const currentPoint = getPoint([props.state[xVar], props.state[yVar]]);
    if (currentPoint != null) {
      p.stroke(isDark ? "#1F1E27" : 255);
      p.strokeWeight(9);
      p.point(...currentPoint);
    }

    // draw trail for past states
    if (trailStyle === 'comet') {
      drawComet(p);
    } else {
      drawPath(p);
    };

    // draw current state
    if (currentPoint != null) {
      p.stroke("#0091ff");
      p.strokeWeight(5);
      p.point(...currentPoint);
    }
        
  }

  // drawLabels: draws y- and x-axis labels
  const drawLabels = (p) => {
    // x-axis label
    p.noStroke(0);
    p.textSize(9);
    p.text(stateVars[xVar].displayName, 0, 125);

    // y-axis label
    p.push();
    p.rotate(-p.HALF_PI);
    p.text(stateVars[yVar].displayName, 0, -120);
    p.pop();
  }

  // setup: runs before the first draw
  const setup = (p, canvasParentRef) => {
    const c = p.createCanvas(460, 460).parent(canvasParentRef);
    p.pixelDensity(4); // can afford higher pixel density for 2D canvas
    p.textFont('Alegreya');
    
    // handle click to set initial state and reset past states
    c.mouseClicked(e => {
      // compute canvas's pixel value of the click location given the transformations applied
      // in initialScaling()
      const scaledPosition = [e.offsetX - p.width / 2, e.offsetY - p.width / 2].map(
        val => val * (TOTAL_CANVAS_SIZE * 2) / p.width);
      // compute the state value of the click location
      const stateValues = {x: getXVal(scaledPosition[0]), y: getYVal(scaledPosition[1])}

      // if not out of bounds of the grid, reset state and past states
      if (stateValues.x != null && stateValues.y != null) {
        const newState = {...props.state};
        newState["time"] = 0;
        newState[xVar] = stateValues.x;
        newState[yVar] = stateValues.y;
        props.setState(newState);
        const newStateWithoutTime = {...newState};
        delete newStateWithoutTime.time;
        props.setInitialState(newStateWithoutTime);
        props.reset();
      }
    })
    
  }

  // draw: runs every frame
  const draw = (p) => {
    initialScaling(p);
    drawGridBorder(p);
    drawAllTicks(p);
    drawSlopeField(p);
    drawState(p);
    drawLabels(p);
  }


  return (
    <div id="StateSpace" className="graphicsWrapper">
      <div className='graphicsContainer'>
        <Sketch setup={setup} draw={draw}></Sketch>
      </div>
      <div className='bottomRow'>
        <BottomRowSpan label={stateVars[xVar].displayName} value={state[xVar]} units={stateVars[xVar].unit}/>
        <BottomRowSpan label={stateVars[yVar].displayName} value={state[yVar]} units={stateVars[xVar].unit}/>
        <span>
          <button onClick={() => {setTrailStyle(trailStyle === 'comet' ? 'path' : 'comet')}}>
            {trailStyle === 'comet' ? 'Draw Path' : 'Draw Comet'}
          </button>
        </span>
      </div>
    </div>
  )
}
