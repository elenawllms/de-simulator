var Latex = require('react-latex');

const equation = `$$ m\\ddot{x} + b\\dot{x} + kx = 0 $$`

const info = <>
<h1>Spring</h1>
This simulation models a pendulum, allowing for control of initial conditions, pendulum length, and damping. Importantly, this simulation does not include gravity; the vertical layout of the spring is slightly misleading but makes it easier to see the spring and the options at the same time.
<br/><br/>
The pendulum obeys the formula
<Latex displayMode={true}>
    {equation}
</Latex>
where <Latex>$m$</Latex> is the mass of the weight on the spring, <Latex>$b$</Latex> is the damping coefficient, <Latex>$k$</Latex> is the spring constant, and <Latex>$x$</Latex> is the displacement from equilibrium. This is derived from Hooke's Law with a damping term added.
<br/><br/>
We approximate the pendulum using 
the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;

export default info;