var Latex = require('react-latex');

const info = <>
<h1>BrusselatorVis</h1>
This simulation models the Belousov-Zhabotinsky Reaction, better known as the clock reaction,
which describes the autocatalytic oxidation of malonic acid by potassium bromate.
The chemical system obeys the linear system:
<Latex displayMode={true}>
    $ x' = a-bx+x^2y-x  $
</Latex>
We approximate the system using 
the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;

export default info;