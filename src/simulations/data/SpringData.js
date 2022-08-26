import { rk4 } from '../../constants.js';
import SpringVis from '../visualizations/SpringVis.js';
var Latex = require('react-latex');



const derivatives = {displacement: (state) => state.velocity, 
    velocity: (state) => (-1 * state.damping / state.mass) * state.velocity
                        - (state.springConstant / state.mass) * state.displacement};


const defaultState = {
    time: 0,
    initialDisplacement: 1, 
    initialVelocity: 0, 
    displacement: 1, 
    velocity: 0, 
    mass: 3,
    springConstant: 10,
    restLength: 4,
    damping: 0.2,
}

const stateSpaceProps = {
    labels: {x: 'Displacement', y: 'Velocity'},
    units: {x: 'm', y: 'm/s'},
    variables: {x: 'displacement', y: 'velocity'},
    initialVariables: {x: 'initialDisplacement', y: 'initialVelocity'},
    limits: {x: [-3.5, 3.5], y: [-10, 10]},
    ticks: {x: 1, y: 3},
    origin: {x: 0, y: 0},
}

const energyDiagramProps = {
    variables: {x: 'displacement', y: 'velocity'},
    labels: {x: "Displacement", y: "Velocity", z: 'Energy'},
    limits: {x: [-3.5, 3.5], y: [-10, 10], z: [0, 100]},
    units: {x: "m", y: "m/s", z: "J"}
}


const readoutVals = state => [
    {label: 'Displacement', value: state.displacement, color: "#a31733", units: "m"},
    {label: 'Velocity', value: state.velocity, color: "#38a317", units: "m/s"},
    {label: 'Acceleration', value: derivatives.velocity(state), color: "#d1650d", units: "m/s^2"}
]

const readoutProps =  {
    yLimits: [-10, 10],
    yTicks: 3
}

const options = [
    {displayName: 'Initial Displacement', symbol: <Latex>$x_0$</Latex>, min: -3.14, max: 3.14, units: 'm', name: "initialDisplacement"},
    {displayName: 'Initial Velocity', symbol: <Latex>$x_0 '$</Latex>, min: -5, max: 5, units: 'm/s', name: "initialVelocity"},
    {displayName: 'Mass', symbol: <Latex>$m$</Latex>, min: 1, max: 5, units: 'kg', name: "mass"},
    {displayName: 'Damping', symbol: <Latex>$b$</Latex>, min: 0, max: 2, units: 'kg/s', name: "damping"},
    {displayName: 'Spring Constant', symbol: <Latex>$k$</Latex>, min: 5, max: 20, units: 'N/m', name: "springConstant"},
    {displayName: 'Rest Length', symbol: <Latex>$l$</Latex>, min: 3, max: 5, units: 'm', name: "restLength"},

];

const h = 0.01;

const incrementState = (state) => {
    const newState = rk4(state, derivatives, ["displacement", "velocity"], h);
    return newState;
};

const visualization = (state, theme) => <SpringVis state={state} theme={theme}/>;

const getEnergyFromState = (state) => ( // edit this
    0.5 * state.springConstant * Math.pow(state.displacement, 2) // 1/2 kx^2
    + 0.5 * state.mass * Math.pow(state.velocity, 2) // 1/2 mv^2
)

const info = <>
    <h1>Spring</h1>
    <p>It's a spring</p>
</>

export const SpringData = {
    title: "Spring",
    defaultState: defaultState,
    stateSpaceProps: stateSpaceProps,
    energyDiagramProps: energyDiagramProps,
    readoutVals: readoutVals,
    readoutProps: readoutProps,
    options: options,
    incrementState: incrementState,
    getEnergyFromState: getEnergyFromState,
    derivatives: derivatives,
    info: info,
    visualization: visualization
}