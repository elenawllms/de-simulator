import React from 'react';
import Sketch from 'react-p5';

const SLOPE_SCALE_FACTOR = 25;

const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};
const totalCanvasSize = 130;



export default function StateSpace(props) {
  const state = props.state;
  const pastStates = props.pastStates;
  const gridProps = props.gridProps;
  const isDark = props.isDark;
  const xVar = gridProps.variables.x;
  const yVar = gridProps.variables.y;

  const getX = xValue => interpolate(xValue, gridProps.limits.x[0], gridProps.limits.x[1], -100, 100);
  const getY = xValue => interpolate(xValue, gridProps.limits.y[1], gridProps.limits.y[0],  -100, 100);
  const getXVal = x => interpolate(x, -100, 100, gridProps.limits['x'][0], gridProps.limits['x'][1]);
  const getYVal = y => interpolate(y, -100, 100, gridProps.limits['y'][1], gridProps.limits['y'][0]);
  const getPoint = (point) => {
    const x = getX(point[0]);
    const y = getY(point[1]);
    return (x != null & y != null) ? [x, y] : null;
  }
  const initialScaling = (p) => {
    p.translate(p.width / 2, p.height / 2);
    p.scale(p.width / (totalCanvasSize * 2));
    p.background(props.isDark ? 20 : 255);
  }
  const drawGrid = (p) => {
    p.stroke(isDark ? 255 : 0);
    p.fill(isDark ? 20 : 255);
    p.strokeWeight(0.2);
    p.rect(-100, -100, 200, 200);
  }
  function tickMark(p, val, isVertical) {
    const scaledVal = (isVertical) ? getX(val) : getY(val);
    if (null == scaledVal) return;
    if (isVertical) {
      p.line(scaledVal, 103, scaledVal, 100);
      p.line(scaledVal, -103, scaledVal, -100);
      p.text(val, scaledVal, -106);
      p.text(val, scaledVal, 110);
    } else {
      p.line(-103, scaledVal, -100, scaledVal);
      p.line(103, scaledVal, 100, scaledVal);
      p.text(val, -108, scaledVal+2);
      p.text(val, 108, scaledVal+2);
    }
  }
  function drawAllTicks(p) {
    p.textSize(7);
    p.textAlign(p.CENTER);
    p.fill(isDark ? 255 : 0);
    p.stroke(isDark ? 255 : 0);
    p.strokeWeight(0.2);
    ['x', 'y'].forEach(dim => { // for both dimensions..
      for (let tick=gridProps.origin[dim]; tick<gridProps.limits[dim][1]; tick+=gridProps.ticks[dim]) {
        tickMark(p, tick, dim === 'x');
      }
      for (let tick=gridProps.origin[dim]; tick>gridProps.limits[dim][0]; tick-=gridProps.ticks[dim]) {
        tickMark(p, tick, dim === 'x');
      }
    })
    
  }
  function drawArrow(p, xVal, yVal) {

    // new modifiable state
    const newState = {...state};
    newState[xVar] = xVal;
    newState[yVar] = yVal;
  
    // calculations
    const dx = props.derivatives[xVar](newState);
    const dy = props.derivatives[yVar](newState);
    const angle = Math.atan(dy/dx);
    const del_x = 3 * Math.cos(angle);
    const del_y = -3 * Math.sin(angle);
    const [x, y] = getPoint([xVal, yVal]);
    if (dx === 0 && dy === 0) return;
    
    // draw line
    p.strokeWeight(0.5);
    const magnitude = SLOPE_SCALE_FACTOR*Math.sqrt(dy*dy + dx*dx);
    if (isDark) {
      // stroke(color('hsl(' + (650 - int(magnitude)) % 360 + ', 90%, 70%)'));
      p.stroke(0.7 * magnitude);
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
  
  function drawSlopes(p) {
    p.strokeWeight(1);
    p.stroke(isDark ? 255 : 0);
    for (let x=-90; x<=90; x+=10) {
      for (let y=-90; y<=90; y+=10) {
        drawArrow(p, getXVal(x), getYVal(y));
      }
    }
  }

  function drawState(p) {
    // draw current state
    const currentPoint = getPoint([props.state[xVar], props.state[yVar]]);
    if (currentPoint != null) {
      p.stroke(isDark ? 0 : 255);
      p.strokeWeight(9);
      p.point(...currentPoint);
      p.stroke("#0091ff");
      p.strokeWeight(5);
      p.point(...currentPoint);
    }

    // draw trail for past states
    
    const pastStatePoints = pastStates.map(state => {
      const scale = Math.exp(2 * (state.time - props.state.time));
      const point = getPoint([state[xVar], state[yVar]]);
      return {scale: scale, point: point};
    }).filter(pastState => pastState.point != null);

    // trailing points and shadows
    [[isDark ? 20 : 255, 9], ["#0091ff", 5]].forEach(list => {
      p.stroke(list[0]);
      pastStatePoints.forEach(pastState => {

        p.strokeWeight(list[1] * pastState.scale);
        p.point(...pastState.point);
      })
    })
    
  }

  const setup = (p, canvasParentRef) => {
    const c = p.createCanvas(500, 500).parent(canvasParentRef);
    p.pixelDensity(4);
    p.textFont('Alegreya');
    
    c.mouseClicked(e => {
      const scaledPosition = [e.offsetX - p.width / 2, e.offsetY - p.width / 2].map(
        val => val * (totalCanvasSize * 2) / p.width);
      const stateValues = {x: getXVal(scaledPosition[0]), y: getYVal(scaledPosition[1])}

      if (stateValues.x != null && stateValues.y != null) {
        console.log(stateValues);
        state[gridProps.initialVariables.x] = stateValues.x;
        state[gridProps.initialVariables.y] = stateValues.y;
        props.setState(state);
        props.reset();
      }
    })
    
  }

  const draw = (p) => {
    initialScaling(p);
    drawGrid(p);
    drawAllTicks(p);
    drawSlopes(p);
    drawState(p);
  }


  return (
    <div id="StateSpace">
      <Sketch setup={setup} draw={draw}></Sketch>
    </div>
  )
}
