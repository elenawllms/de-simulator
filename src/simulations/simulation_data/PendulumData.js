import Simulation from '../classes/Simulation.js';
import Grid from '../classes/Grid.js';

const NewGrid = new Grid(
    {x: {lower: -3.14, upper: 3.14}, y: {lower: -3.14, upper: 3.14}}, 
    {x: {major: 1, minor: 2}, y: {major: 1, minor: 2}}, 
    {x: 0, y: 0},
    {x: 200, y: 200, padding: 50},
);

export const PendulumData = new Simulation(
    "Pendulum",
    NewGrid
);



