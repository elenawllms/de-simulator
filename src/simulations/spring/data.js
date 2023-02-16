import SpringVis from './animation.js';
import {Parameter, StateVar, createStepFunction} from '../Variables.js';
import info from './info.js';

const stateVars = {
    // the time variable doesn't quite work in this data structure... but that's a later problem
    time: new StateVar('Time', 0, 100, 0, 's', 't', 'black', x=>x),
    displacement: new StateVar('Displacement', -5, 5, 10, 'm', 'x', '#b95adb', x=>x),
    velocity: new StateVar('Velocity', -10, 10, 0, 'm/s', '\\dot{x}', '#37b098', x=>x),
}

const parameters = {
    mass: new Parameter('Mass', 0.1, 2, 1, 'kg', 'm'),
    damping: new Parameter('Damping', 0, 1, 0.1, 'kg/s', 'b'),
    stiffness: new Parameter('Spring Stiffness', 5, 20, 5, 'N/m', 'k')
}

const derivatives = {
    time: (state, parameters) => 1,
    displacement: (state, parameters) => state.velocity, 
    velocity: (state, parameters) => (
        -(parameters.damping * state.velocity / parameters.mass)
        - (parameters.stiffness * state.displacement / parameters.mass)
    )};

const step = createStepFunction(stateVars, derivatives);


const gridVariables = {
    x: "displacement", y: "velocity"
}

const stateSpaceProps = {
    limits: {x: [-10, 10], y: [-20, 20]},
    ticks: {x: 3, y: 5},
    origin: {x: 0, y: 0},
}

const energyDiagramProps = {
    limits: {x: [-3.5, 3.5], y: [-10, 10], z: [-30, 100]},
    ticks: {x: 1, y: 3, z: 20}
}

const timeSeriesProps =  {
    yLimits: [-31, 31],
    yTicks: 10,
    vals: (state, parameters) => ([
        {label: 'Displacement', value: state.displacement, 
            color: stateVars.displacement.color, units: stateVars.displacement.unit},
        {label: 'Velocity', value: state.velocity, 
            color: stateVars.velocity.color, units: stateVars.velocity.unit},
        {label: 'Acceleration', value: derivatives.velocity(state, parameters), 
            color: "#d1650d", units: "rad/s^2"}
    ])
}

/**
 * Finds the energy of the system as a function of the current state and
 * the constants of the system.
 * @param {Object} state - current state as object including time
 * @param {Object} parameters - current constants of the system
 * @returns energy value, usually in Joules, of the current state of the system
 */
const energyFn = (state, parameters) => (
    // (parameters.mass * 9.8 * state.displacement) // gravitational PE mgx
    + (0.5 * parameters.stiffness * Math.pow(state.displacement, 2)) // spring PE kx^2 /2
    + (0.5 * parameters.mass * Math.pow(state.velocity, 2)) // kinetic energy mv^2 /2
)


const visualizationScale = 1;

/**
 * Creates XML Element containing a visualization given the current state,
 * constants and theme.
 * @param {Object} state 
 * @param {Object} parameters 
 * @param {"light" | "dark"} theme 
 * @returns 
 */
const visualization = (state, parameters, theme) => <SpringVis state={state} parameters={parameters} theme={theme} scale={visualizationScale}/>;


export const SpringData = {
    title: "Spring",
    stateVars: stateVars,
    parameters: parameters,
    stateSpaceProps: stateSpaceProps,
    gridVariables: gridVariables,
    derivatives: derivatives,
    stepFn: step,
    energyFn: energyFn,
    energyDiagramProps: energyDiagramProps,
    timeSeriesProps: timeSeriesProps,
    info: info,
    visualization: visualization
}



