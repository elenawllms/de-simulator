var Latex = require('react-latex');

const info = <>
<h1>Spring</h1>
This simulation models a pendulum, allowing for control of initial conditions, pendulum length, and damping.
The pendulum obeys the formula
<Latex displayMode={true}>
    $ \theta '' + c\theta ' + \lambda\theta = F_0 \cos \Omega t $
</Latex>
We approximate the pendulum using 
the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;

export default info;