import React, {useState} from 'react'
import Sketch from 'react-p5';

const axisPadding = 10;
const xTickSize = 2;
const timeWindow = 7;

// gotta put this under constants at some point
const interpolate = (val, lowerInitial, upperInitial, lowerFinal, upperFinal) => {
  const decimal = (val - lowerInitial) / (upperInitial - lowerInitial);
  return (decimal < 0 || decimal > 1) ? null : (decimal * (upperFinal - lowerFinal) + lowerFinal);
};

export default function Readout(props) {
  // define a variable for literally every possible use so I don't have to reference props
  const state = props.state;
  const parameters = props.parameters;
  const pastStates = props.pastStates;
  const currentTime = state.time < timeWindow ? timeWindow : state.time;
  const vals = props.gridProps.vals;
  const isDark = props.isDark;
  const yLimits = props.gridProps.yLimits;
  const yTickSize = props.gridProps.yTicks;

  const [valsToShow, setValsToShow] = useState(Object.fromEntries(vals(state, parameters).map(o => [o.label, true])));

  const scaleYValue = val => interpolate(val, yLimits[0], yLimits[1], 50, -50);
  const scaleTime = t => interpolate(t, currentTime, currentTime - timeWindow, 0, -100);

  const initialScaling = (p) => {
    p.scale(p.width / (axisPadding + 100));
    p.translate(axisPadding + 98, 50);
    p.background(props.isDark ? "#1F1E27" : 255);
  }

  const drawYTick = (p, val) => {
    const scaledVal = scaleYValue(val);
    p.stroke(isDark ? 255 : 0);
    p.line(-100, scaledVal, -102, scaledVal);
    p.noStroke();
    p.text(val, -104, scaledVal+1);
  }

  const drawXTick = (p, t) => {
    const scaledVal = scaleTime(t);
    p.stroke(isDark ? 255 : 0);
    p.line(scaledVal, 50, scaledVal, 52);
    p.noStroke();
    p.text(t, scaledVal, 54);
  }

  const drawAxes = p => {
    p.stroke(isDark ? 255 : 0);
    p.strokeWeight(0.2);
    p.line(0, 0, -100, 0); // middle x-axis
    p.line(-100, 50, -100, -50); // y-axis at left
    p.line(-100, 50, 0, 50); // lower x-axis

    // Tick mark time! Y ticks first...
    p.textSize(3);
    p.textAlign(p.RIGHT);
    p.fill(isDark ? 255 : 0);
    for (let tick=0; tick<yLimits[1]; tick+=yTickSize) {
      drawYTick(p, tick);
    } 
    for (let tick=0; tick>yLimits[0]; tick-=yTickSize) {
      drawYTick(p, tick);
    } 

    // Now x ticks...
    p.textAlign(p.CENTER);
    const firstTick = Math.floor(currentTime / xTickSize) * xTickSize;
    for (let tick=firstTick; tick > currentTime-timeWindow; tick-=xTickSize) {
      drawXTick(p, tick);
    }

    // and labelling the x axis
    p.text('Time (s)', -50, 59)
  }

  const drawState = (p, time, o) => {
    if (valsToShow[o.label]) {
      p.stroke(o.color);
      const t = scaleTime(time);
      const y = scaleYValue(o.value);
      if (t != null && y != null) p.point(t, y);
    }
  }

  const drawStates = p => {

    // filter states by those that fall in range: can be made more efficient!
    const drawnStates = pastStates.filter(s => s.time > currentTime - timeWindow);


    // all the points
    p.strokeWeight(isDark ? 0.5 : 0.8);
    drawnStates.forEach(s => {
      vals(s, parameters).forEach(o => drawState(p, s.time, o))
    })
    
    // big point for current state
    p.strokeWeight(isDark ? 1.5 : 2);
    vals(state, parameters).forEach(o => drawState(p, state.time, o))
  }

  const setup = (p, canvasParentRef) => {
    p.createCanvas(440, 440).parent(canvasParentRef);
    p.pixelDensity(4);
    p.textFont('Alegreya');
  };
  const draw = (p) => {
    initialScaling(p);
    drawAxes(p);
    drawStates(p);
  };

  return (
    <div id="Readout" className="graphicsWrapper">
      <div className='graphicsContainer'>
        <Sketch setup={setup} draw={draw}></Sketch>
      </div>
      <div className='bottomRow'>
        {vals(state, parameters).map(o => 
          <span style={{color: o.color, fontWeight: 900}} key={o.label}>
            <input type="checkbox" id={"show " + o.label} checked={valsToShow[o.label]} 
            onChange={() => {
              const newShownVals = {...valsToShow};
              newShownVals[o.label] = !newShownVals[o.label];
              setValsToShow(newShownVals);
            }}
            style={
              { 
                ...{ // default styles
                  marginRight: 8,
                  transform: `translateY(2px)`,
                }, 
                ...(valsToShow[o.label] ? {
                  // idk some checked stuff goes here?
                } : {})
              }
            }
            />
            <label htmlFor={"show " + o.label}>{o.label}:&nbsp;
            {o.value >= 0 ? "+" : ""}
            {o.value.toFixed(3)} {o.units}</label>
          </span>
        )}
      </div>
    </div>
  )
}
