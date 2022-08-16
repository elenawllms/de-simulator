import { rk4 } from '../../constants.js';
import PendulumVis from '../visualizations/PendulumVis.js';
var Latex = require('react-latex');

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
    variables: {x: 'angle', y: 'velocity'},
    initialVariables: {x: 'initialAngle', y: 'initialVelocity'},
    limits: {x: [-3.5, 3.5], y: [-10, 10]},
    ticks: {x: 1, y: 3},
    origin: {x: 0, y: 0},
}


const options = [
    {displayName: 'Initial Angle', min: -3.14, max: 3.14, units: 'rad', name: "initialAngle"},
    {displayName: 'Initial Velocity', min: -5, max: 5, units: 'rad/s', name: "initialVelocity"},
    {displayName: 'Damping Constant', min: 0, max: 2, units: 'kg/s', name: "damping"},
    {displayName: 'Length', min: 1, max: 1.5, units: 'm', name: "length"},
    {displayName: 'Force', min: 0, max: 2, units: 'N', name: "force"},
    {displayName: 'Forcing Frequency', min: 0.25, max: 4, units: 'rad/s', name: "forcingFrequency"}
];

const h = 0.01;

const derivatives = {angle: (state) => state.velocity, 
             velocity: (state) => (-9.8 * Math.sin(state.angle) / state.length) - (state.damping * state.velocity) + state.force * Math.cos(state.forcingFrequency * state.time)};

const incrementState = (state) => {
    const newState = rk4(state, derivatives, ["angle", "velocity"], h);
    newState.angle += (newState.angle <= -Math.PI ? 2 * Math.PI : newState.angle >= Math.PI ? -2 * Math.PI : 0)
    return newState;
};

const getEnergyFromState = (state) => (
    0.5 * Math.pow(state.velocity, 2) + 9.8 * Math.cos(state.angle) / state.length
)

const visualization = PendulumVis;

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
    options: options,
    incrementState: incrementState,
    getEnergyFromState: getEnergyFromState,
    derivatives: derivatives,
    info: info,
    visualization: visualization
}



