var Latex = require('react-latex');

const equation = `$$\\ddot{\\theta} + c\\dot{\\theta} + (g/L)\\sin\\theta = F_0 \\cos \\Omega t$$`;

const info = <>
<h1>Pendulum</h1>
This simulation models a pendulum, allowing for control of initial conditions, pendulum length, and damping.
The pendulum obeys the formula
<Latex displayMode={true} math="">
    {equation}
</Latex>
where <Latex>$\theta$</Latex> is the angle of the pendulum from the vertical, <Latex>$c$</Latex> is the damping coefficient, <Latex>$\lambda$</Latex> is proportional to the length of the pendulum, <Latex>$F_0$</Latex> is the amplitude of the forcing function, and <Latex>$\Omega$</Latex> is the frequency of the forcing function. 
<br/><br/>
At small angles of <Latex>$\theta$</Latex>, we can apply the small angle approximation and the pendulum exhibits roughly sinusoidal behavior. That breaks down as the angle increases. Click on the state space to provide non-small angle initial conditions and see how the pendulum behaves in the animation at left. Examine the time series to see how the system converges to a sinusoidal system over time. In the options tab, you can manually set initial conditions, length, damping, and forcing frequency.
<br/><br/>
We approximate the pendulum using 
the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;

export default info;