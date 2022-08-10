import Simulation from '../classes/Simulation.js';
import Grid from '../classes/Grid.js';
import { rk4 } from '../../constants.js';

const NewGrid = new Grid(
    {x: {lower: -3.14, upper: 3.14}, y: {lower: -3.14, upper: 3.14}}, 
    {x: {major: 1, minor: 2}, y: {major: 1, minor: 2}}, 
    {x: 0, y: 0},
    {x: 450, y: 450, padding: 30},
);

const h = 0.03;

const des = {theta: (state) => state.omega, 
             omega: (state) => (-9.8 * Math.sin(state.theta) / state.length) - (state.damping * state.omega)};



const update = (state) => (rk4(state, des, ["theta", "omega"], h));

const updateFromOptions = state => ({
    initialTheta: (value) => {console.log(value); state.initialTheta = parseFloat(value);},
    initialOmega: (value) => {state.initialOmega = parseFloat(value);},
    damping: (value) => {state.damping = parseFloat(value)},
    length: (value) => {state.length = parseFloat(value)}
});

const optionRanges = state => [
    {name: 'Initial Angle', min: -3.14, max: 3.14, units: 'rad', update: updateFromOptions(state).initialTheta, value: state.initialTheta},
    {name: 'Initial Velocity', min: -3.14, max: 3.14, units: 'rad/s', update: updateFromOptions(state).initialOmega, value: state.initialOmega},
    {name: 'Damping Constant', min: 0, max: 2, units: 'kg/s', update: updateFromOptions(state).damping, value: state.damping},
    {name: 'Length', min: 3, max: 10, units: 'm', update: updateFromOptions(state).length, value: state.length}
];

export const PendulumData = new Simulation(
    "Pendulum",
    update,
    NewGrid,
    updateFromOptions,
    optionRanges
);




