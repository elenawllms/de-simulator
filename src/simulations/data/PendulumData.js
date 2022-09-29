import { rk4 } from '../../constants.js';
import PendulumVis from '../visualizations/PendulumVis.js';
var Latex = require('react-latex');

// stuff to pull out into other files
const h = 0.01;

class Parameter {
    /**
     * Initializes a parameter, which includes constants and state variables.
     * @param {string} displayName 
     * @param {number} min 
     * @param {number} max 
     * @param {number} defaultValue 
     * @param {string} unit 
     * @param {string} symbol 
     */
    constructor(displayName, min, max, defaultValue, unit, symbol) {
        Object.assign(this, {displayName, min, max, defaultValue, unit, symbol});
    }
}

class StateVar extends Parameter {
    /**
     * 
     * @param {string} color 
     * @param {object => number} derivative 
     * @param {string} displayName
     * @param {number} min
     * @param {number} max
     * @param {number} defaultValue
     * @param {string} unit
     * @param {string} symbol
     * @param {number => number} postProcess
     */
    constructor(displayName, min, max, defaultValue, unit, symbol, color, postProcess) {
        super(displayName, min, max, defaultValue, unit, symbol);
        this.color = color;
        this.postProcess = postProcess; // anything like angle needs to be within -pi and pi, function of 
    }
}


// stuff specific to this simulation

const derivatives = {
    time: (state, parameters) => 1,
    angle: (state, parameters) => state.velocity, 
    velocity: (state, parameters) => (-9.8 * Math.sin(state.angle) / parameters.length) 
                        - (parameters.damping * state.velocity) 
                        + parameters.force * Math.cos(parameters.forcingFrequency * state.time)};
                        

// generic step function
const step = (state, parameters) => {
    const newState = rk4(state, parameters, derivatives,Object.keys(stateVars), h);
    Object.keys(stateVars).forEach(v => newState[v] = stateVars[v].postProcess(newState[v]));
    return newState;
}


const normalizeAngle = (angle) => angle + (angle <= -Math.PI ? 2 * Math.PI : angle >= Math.PI ? -2 * Math.PI : 0);

const stateVars = {
    time: new StateVar('Time', 0, 100, 0, 's', 't', 'black', (x) => x),
    angle: new StateVar('Angle', -Math.PI, Math.PI, Math.PI / 2, 'rad', '\\theta', 'blue', normalizeAngle),
    velocity: new StateVar('Velocity', -10, 10, 0, 'rad/s', '\\dot{\\theta}', 'red', (x) => x),
}

const parameters = {
    length: new Parameter('Length', 0.1, 2, 1, 'm', 'l'),
    damping: new Parameter('Damping', 0, 1, 0.1, '', '\\gamma'),
    force: new Parameter('Force', 0, 1, 0.5, 'N', 'F'),
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
    limits: {x: [-3.5, 3.5], y: [-10, 10], z: [-30, 50]}
}

const timeSeriesProps =  {
    yLimits: [-10, 10],
    yTicks: 3,
    vals: (state, parameters) => ([
        {label: 'Angle', value: state.angle, color: "#a31733", units: "rad"},
        {label: 'Velocity', value: state.velocity, color: "#38a317", units: "rad/s"},
        {label: 'Acceleration', value: derivatives.velocity(state, parameters), color: "#d1650d", units: "rad/s^2"}
    ])
}

const energyFn  = (state, parameters) => (
    0.5 * Math.pow(state.velocity, 2) 
    + 0.5 * Math.pow(parameters.force * parameters.forcingFrequency * Math.sin(parameters.forcingFrequency * state.time), 2)
    + 9.8 * parameters.force * Math.cos(parameters.forcingFrequency * state.time) 
    - 9.8 * Math.cos(state.angle) / parameters.length
)

const visualization = (state, parameters, theme) => <PendulumVis state={state} parameters={parameters} theme={theme}/>;

const info = <>
    <h1>Pendulum</h1>
    This simulation models a pendulum, allowing for control of initial conditions, pendulum length, and damping.
    The pendulum obeys the formula
    <Latex displayMode={true}>
        $ \theta '' + c\theta ' + \lambda\theta = F_0 \cos \Omega t $
    </Latex>
    We approximate the pendulum using 
    the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;



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



