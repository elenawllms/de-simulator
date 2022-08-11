import Simulation from '../classes/Simulation.js';
import Grid from '../classes/Grid.js';
import { rk4, drawLine, CANVAS_RES_FACTOR} from '../../constants.js';
var Latex = require('react-latex');

const gridProperties = {
    limits: {x: {lower: -3.14, upper: 3.14}, y: {lower: -10, upper: 10}},
    ticks: {x: {major: 1, minor: 2}, y: {major: 3, minor: 2}},
    origin: {x: 0, y: 0},
    canvasSize: {x: 500, y: 500, padding: 60}
}

const grid = new Grid(gridProperties);

const optionRanges = state => [
    {name: 'Initial Angle', min: -3.14, max: 3.14, units: 'rad', update: updateFromOptions(state).initialTheta, value: state.initialTheta},
    {name: 'Initial Velocity', min: -5, max: 5, units: 'rad/s', update: updateFromOptions(state).initialOmega, value: state.initialOmega},
    {name: 'Damping Constant', min: 0, max: 2, units: 'kg/s', update: updateFromOptions(state).damping, value: state.damping},
    {name: 'Length', min: 1, max: 1.5, units: 'm', update: updateFromOptions(state).length, value: state.length}
];

const h = 0.01;

const des = {theta: (state) => state.omega, 
             omega: (state) => (-9.8 * Math.sin(state.theta) / state.length) - (state.damping * state.omega)};

const update = (state) => {
    const newState = rk4(state, des, ["theta", "omega"], h);
    newState.theta += (newState.theta <= -Math.PI ? 2 * Math.PI : newState.theta >= Math.PI ? -2 * Math.PI : 0)
    return newState;
};


const drawVisualization = (c, props) => {
    // visualization dimensions
    const dims = {
        width: 300,
        height: 450,
        max_length: 125,
        max_radius: 12.5,
        center: 200,
        bottom: 400
    }

    Object.keys(dims).forEach(key => dims[key] *= CANVAS_RES_FACTOR);


    // set 
    c.width = dims.width;
    c.height = dims.height;
    const ctx = c.getContext('2d');

    const scaleFactor = props.state.length / 1.5;
  
    const length = dims.max_length * scaleFactor;
    const radius = dims.max_radius * scaleFactor;
    const ballPos = {x: dims.width/2 + length * Math.sin(props.state.theta),
                y: dims.center + length * Math.cos(props.state.theta)}
  
    // Draw line
    ctx.strokeStyle ="black";
    ctx.lineWidth = 3 * scaleFactor * CANVAS_RES_FACTOR;
    drawLine(ctx, dims.width/2, ballPos.x, dims.center, ballPos.y);
  
    // Draw ball
    ctx.beginPath();
    // ctx.fillStyle = 'hsl('+ (props.state.time * 20) +',50%,70%)';
    ctx.fillStyle = "#047AFF";
    ctx.arc(ballPos.x, ballPos.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  
    // Draw circle
    ctx.beginPath();
    ctx.strokeStyle = "#047AFF";
    ctx.setLineDash([1, 3].map(x => x * CANVAS_RES_FACTOR));
    ctx.lineWidth = CANVAS_RES_FACTOR;
    ctx.arc(dims.width/2, dims.center, length, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  
  
    // Draw shadow
    ctx.setTransform(1, 0, 0, 0.5, 0, 0);
    const height = ballPos.y + length;
    const heightConst = 1 + height / 2000;
    var grd = ctx.createRadialGradient(ballPos.x, dims.bottom * 2, 0, ballPos.x, dims.bottom * 2, radius * heightConst); // Creates gradient
    
    grd.addColorStop(0, 'rgb(0, 0, 0,' + height / 5000 + ')');
    grd.addColorStop(0.4, 'rgb(0, 0, 0,' + height / 10000 + ')');
    grd.addColorStop(0.6, 'rgb(0, 0, 0,' + height / 15000 + ')');
    grd.addColorStop(0.8, 'rgb(0, 0, 0,' + height / 80000 + ')');
    grd.addColorStop(1, "#00000000");
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, dims.width, dims.height * 2);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
  };

const updateFromOptions = state => ({
    initialTheta: (value) => {state.initialTheta = parseFloat(value);},
    initialOmega: (value) => {state.initialOmega = parseFloat(value);},
    damping: (value) => {state.damping = parseFloat(value)},
    length: (value) => {state.length = parseFloat(value)}
});

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


const handleStateSpaceClick = (state, x, y) => {
    state.theta = x;
    state.omega = y;
}

const energy = (theta, omega, length) => (
    0.5 * Math.pow(omega, 2) + 9.8 * Math.cos(theta) / length
)
    

export const PendulumData = new Simulation(
    "Pendulum",
    update,
    grid,
    updateFromOptions,
    optionRanges,
    drawVisualization,
    info,
    energy,
    gridProperties,
    handleStateSpaceClick
);




