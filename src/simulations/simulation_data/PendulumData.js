import Simulation from '../classes/Simulation.js';
import Grid from '../classes/Grid.js';

const NewGrid = new Grid(
    {x: {lower: -3.14, upper: 3.14}, y: {lower: -3.14, upper: 3.14}}, 
    {x: {major: 1, minor: 2}, y: {major: 1, minor: 2}}, 
    {x: 0, y: 0},
    {x: 450, y: 450, padding: 30},
);

const h = 0.03;

const des = {theta: (state) => state.omega, 
             omega: (state) => (-9.8 * Math.sin(state.theta) / state.length) - (state.damping * state.omega)};

const update = (state) => {
    // RK4 Update

    // k1 and k2
    const theta_k = [state.omega];
    const omega_k = [des.omega(state)];
    const state_k2 = {time: state.time + h/2, theta: state.theta + h * theta_k[0]/2, 
                omega: state.omega + h * omega_k[0]/2, damping: state.damping, length: state.length};
    theta_k.push(des.theta(state_k2));
    omega_k.push(des.omega(state_k2));

    // k3
    const state_k3 = {time: state.time + h/2, theta: state.theta + h * theta_k[1]/2, 
                omega: state.omega + h * omega_k[1]/2, damping: state.damping, length: state.length};
    theta_k.push(des.theta(state_k3));
    omega_k.push(des.omega(state_k3));

    // k4
    const state_k4 = {time: state.time + h, theta: state.theta + h * theta_k[2]/2, 
                omega: state.omega + h * omega_k[2], damping: state.damping, length: state.length};
    theta_k.push(des.theta(state_k4));
    omega_k.push(des.omega(state_k4));

    const newState = {time: state.time + h, theta: state.theta + h * (theta_k[0] + 2*theta_k[1] + 2*theta_k[2] + theta_k[3])/6,
                      omega: state.omega + h * (omega_k[0] + 2*omega_k[1] + 2*omega_k[2] + omega_k[3])/6,
                      damping: state.damping, length: state.length};

    newState.theta = (newState.theta < -Math.PI) ? newState.theta + 2 * Math.PI :
                     (newState.theta > Math.PI) ? newState.theta - 2 * Math.PI : newState.theta;


    return newState;
    
}

export const PendulumData = new Simulation(
    "Pendulum",
    update,
    NewGrid
);



