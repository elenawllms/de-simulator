import React from 'react'
import Sketch from 'react-p5';

const Y_LIMITS = [-1.3, 1.3];
const PRIMARY_COLOR = "#0091ff";

export default function PendulumVis(props) {
  const state = props.state;
  const isDark = props.theme === 'dark';

  const getPixelVal = val => {
    const decimal = (val - Y_LIMITS[0]) / (Y_LIMITS[1]-Y_LIMITS[0]);
    return (decimal - 0.5) * 200;
  }
  const getY = val => -getPixelVal(val);
  const getX = getPixelVal;
  const getPoint = point => [getX(point[0]), getY(point[1])];
  

  const getCenter = () => [0, state.force * Math.cos(state.forcingFrequency * state.time)];

  const drawPendulum = (p) => {
    const [centerX, centerY] = getPoint(getCenter());
    const x = getX(state.length * Math.sin(state.angle)) + centerX;
    const y = getY(-state.length * Math.cos(state.angle)) + centerY;
    // console.log([x, y]);


    p.stroke(isDark ? 50 : 200);
    p.strokeWeight(10);
    p.line(0, getY(state.force), 0, -getY(state.force));
    p.stroke(isDark ? 150 : 100);
    p.strokeWeight(3);
    p.line(0, getY(state.force), 0, -getY(state.force));

    // line
    p.stroke(isDark ? 255 : 0);
    p.strokeWeight(6);
    p.point(centerX, centerY);
    p.strokeWeight(3);
    p.line(centerX, centerY, x, y);
    //ball
    p.stroke(p.color(PRIMARY_COLOR));
    p.strokeWeight(20);
    p.point(x, y);

  }

  
  

  const setup = (p, canvasParentRef) => {
    p.createCanvas(300, 500).parent(canvasParentRef);
    p.scale(p.height / 200);
    p.pixelDensity(4);
  }

  const draw = p => {
    p.background(isDark ? "#1F1E27" : 255);
    p.translate(p.width / 2, p.height / 2);
    drawPendulum(p);
  }

  return (
    <div className="Visualization"><Sketch setup={setup} draw={draw}/></div>
  )
}
