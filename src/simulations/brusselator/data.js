import BrusselatorVis from './animation.js';
import {Parameter, StateVar, createStepFunction} from '../Variables.js';
import info from './info.js';

const stateVars = {
    // the time variable doesn't quite work in this data structure... but that's a later problem
    time: new StateVar('Time', 0, 100, 0, 's', 't', 'black', v=>v),
    x: new StateVar('[X]', 0, 1, 0.5, 'M', 'x', 'hsl(150, 55%, 55%)', v=>v),
    y: new StateVar('[Y]', 0, 1, 0.2, 'M', 'y', 'hsl(320, 55%, 65%)', v=>v)
}
 
const parameters = {
    a: new Parameter('a', 0.2, 1, 0.5, 'M/s', 'a'),
    b: new Parameter('b', 0.2, 2, 1.5, 's^{-1}', 'b'),
}

const derivatives = {
    time: (state, parameters) => 1,
    x: (state, parameters) => (
        parameters.a - (parameters.b * state.x) + (Math.pow(state.x, 2) * state.y) - state.x
    ), 
    y: (state, parameters) => (
        (parameters.b * state.x) - (Math.pow(state.x, 2) * state.y)
    )};

const step = createStepFunction(stateVars, derivatives);


const gridVariables = {
    x: "x", y: "y"
}

const stateSpaceProps = {
    limits: {x: [0, 5.2], y: [0, 5.2]},
    ticks: {x: 1, y: 1},
    origin: {x: 0, y: 0},
}

const timeSeriesProps =  {
    yLimits: [0, 6],
    yTicks: 1,
    vals: (state, parameters) => ([
        {label: '[X]', value: state.x, color: stateVars.x.color, units: stateVars.x.unit},
        {label: '[Y]', value: state.y, color: stateVars.y.color, units: stateVars.y.unit},
    ])
}

const energyFn = (state, parameters) => (
    0
);


const visualizationScale = 1;

/**
 * Creates XML Element containing a visualization given the current state,
 * constants and theme.
 * @param {Object} state 
 * @param {Object} parameters 
 * @param {"light" | "dark"} theme 
 * @returns 
 */
const visualization = (state, parameters, theme) => <BrusselatorVis state={state} parameters={parameters} theme={theme} scale={visualizationScale}/>;


export const BrusselatorData = {
    title: "Brusselator",
    stateVars: stateVars,
    parameters: parameters,
    stateSpaceProps: stateSpaceProps,
    gridVariables: gridVariables,
    derivatives: derivatives,
    stepFn: step,
    energyFn: energyFn,
    energyDiagramProps: null,
    timeSeriesProps: timeSeriesProps,
    info: info,
    visualization: visualization
}



