import { rk4 } from '../../constants.js';
import PendulumVis from '../visualizations/PendulumVis.js';
var Latex = require('react-latex');


const derivatives = {angle: (state) => state.velocity, 
    velocity: (state) => (-9.8 * Math.sin(state.angle) / state.length) 
                        - (state.damping * state.velocity) 
                        + state.force * Math.cos(state.forcingFrequency * state.time)};


const defaultState = {
    time: 0,
    initialAngle: 3, 
    initialVelocity: 3, 
    angle: 3, 
    velocity: 3, 
    damping: 0.2, 
    length: 1.5,
    force: 1,
    forcingFrequency: 1
}

const stateSpaceProps = {
    labels: {x: 'Angle', y: 'Velocity'},
    units: {x: 'rad', y: 'rad/s'},
    variables: {x: 'angle', y: 'velocity'},
    initialVariables: {x: 'initialAngle', y: 'initialVelocity'},
    limits: {x: [-3.5, 3.5], y: [-10, 10]},
    ticks: {x: 1, y: 3},
    origin: {x: 0, y: 0},
}

const energyDiagramProps = {
    variables: {x: 'angle', y: 'velocity'},
    labels: {x: "Angle", y: "Velocity", z: 'Energy'},
    limits: {x: [-3.5, 3.5], y: [-10, 10], z: [-30, 50]},
    units: {x: "rad", y: "rad/s", z: "J"}
}

const readoutVals = state => [
    {label: 'Angle', value: state.angle, color: "#a31733", units: "rad"},
    {label: 'Velocity', value: state.velocity, color: "#38a317", units: "rad/s"},
    {label: 'Acceleration', value: derivatives.velocity(state), color: "#d1650d", units: "rad/s^2"}
]

const readoutProps =  {
    yLimits: [-10, 10],
    yTicks: 3
}


const options = [
    {displayName: 'Initial Angle', symbol: <Latex>$\theta_0$</Latex>, min: -3.14, max: 3.14, units: 'rad', name: "initialAngle"},
    {displayName: 'Initial Velocity', symbol: <Latex>$\theta_0 '$</Latex>, min: -5, max: 5, units: 'rad/s', name: "initialVelocity"},
    {displayName: 'Damping', symbol: <Latex>$c$</Latex>, min: 0, max: 2, units: 'kg/s', name: "damping"},
    {displayName: 'Length', symbol: <Latex>$l$</Latex>, min: 1, max: 1.5, units: 'm', name: "length"},
    {displayName: 'Force', symbol: <Latex>$F_0$</Latex>, min: 0, max: 2, units: 'N', name: "force"},
    {displayName: 'Forcing Freq.', symbol: <Latex>$\Omega$</Latex>, min: 0.25, max: 4, units: 'rad/s', name: "forcingFrequency"}
];

const h = 0.01;

const incrementState = (state) => {
    const newState = rk4(state, derivatives, ["angle", "velocity"], h);
    newState.angle += (newState.angle <= -Math.PI ? 2 * Math.PI : newState.angle >= Math.PI ? -2 * Math.PI : 0)
    return newState;
};

const getEnergyFromState = (state) => (
    0.5 * Math.pow(state.velocity, 2) 
    + 0.5 * Math.pow(state.force * state.forcingFrequency * Math.sin(state.forcingFrequency * state.time), 2)
    + 9.8 * state.force * Math.cos(state.forcingFrequency * state.time) 
    - 9.8 * Math.cos(state.angle) / state.length
)

const visualization = (state, theme) => <PendulumVis state={state} theme={theme}/>;

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



