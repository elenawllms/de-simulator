import PendulumVis from './animation.js';
import {Parameter, StateVar, createStepFunction} from '../Variables.js';
import info from './info.js';

const normalizeAngle = (angle) => angle + (angle <= -Math.PI ? 2 * Math.PI : angle >= Math.PI ? -2 * Math.PI : 0);

const stateVars = {
    time: new StateVar('Time', 0, 100, 0, 's', 't', 'black', (x) => x),
    angle: new StateVar('Angle', -Math.PI, Math.PI, Math.PI-0.01, 'rad', '\\theta', 'blue', normalizeAngle),
    velocity: new StateVar('Velocity', -10, 10, 0, 'rad/s', '\\dot{\\theta}', 'red', (x) => x),
}

const derivatives = {
    time: (state, parameters) => 1,
    angle: (state, parameters) => state.velocity, 
    velocity: (state, parameters) => (-9.8 * Math.sin(state.angle) / parameters.length) 
                        - (parameters.damping * state.velocity) 
                        + parameters.force * Math.cos(parameters.forcingFrequency * state.time)};

const step = createStepFunction(stateVars, derivatives);

const parameters = {
    length: new Parameter('Length', 0.5, 2, 1.5, 'm', 'l'),
    damping: new Parameter('Damping', 0, 1, 0.1, 'kg/s', 'c'),
    force: new Parameter('Force', 0, 1, 0, 'N', 'F'),
    forcingFrequency: new Parameter('Forcing Frequency', 0, 10, 1, 'Hz', '\\omega'),
}

const gridVariables = {
    x: "angle", y: "velocity"
}

const stateSpaceProps = {
    limits: {x: [-3.5, 3.5], y: [-10, 10]},
    ticks: {x: 1, y: 3},
    origin: {x: 0, y: 0},
}

const energyDiagramProps = {
    limits: {x: [-3.5, 3.5], y: [-10, 10], z: [-30, 50]},
    ticks: {x: 1, y: 3, z: 15}
}

const timeSeriesProps =  {
    yLimits: [-10, 10],
    yTicks: 3,
    vals: (state, parameters) => ([
        {label: 'Angle', value: state.angle, color: "#f54e42", units: "rad"},
        {label: 'Velocity', value: state.velocity, color: "#38a317", units: "rad/s"},
        {label: 'Acceleration', value: derivatives.velocity(state, parameters), color: "#4287f5", units: "rad/s^2"}
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
    0.5 * Math.pow(state.velocity, 2) 
    + 0.5 * Math.pow(parameters.force * parameters.forcingFrequency * Math.sin(parameters.forcingFrequency * state.time), 2)
    + 9.8 * parameters.force * Math.cos(parameters.forcingFrequency * state.time) 
    - 9.8 * Math.cos(state.angle) / parameters.length
)

/**
 * Creates XML Element containing a visualization given the current state,
 * constants and theme.
 * @param {Object} state 
 * @param {Object} parameters 
 * @param {"light" | "dark"} theme 
 * @returns 
 */
const visualization = (state, parameters, theme) => <PendulumVis state={state} parameters={parameters} theme={theme}/>;


export const PendulumData = {
    title: "Pendulum",
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



