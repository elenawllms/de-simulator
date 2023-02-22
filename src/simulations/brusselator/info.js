var Latex = require('react-latex');

const info = <>
<h1>Brusselator</h1>
This simulation models the <a href="https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction">Belousov-Zhabotinsky Reaction</a>, better known as the clock reaction,which describes the autocatalytic oxidation of malonic acid by potassium bromate.
The chemical system obeys the equation:
<Latex displayMode={true}>
    $ x' = a-bx+x^2y-x  $
</Latex>
where <Latex>$x$</Latex> is the concentration of the first chemical, <Latex>$y$</Latex> is the concentration of the second chemical, and <Latex>$a$</Latex> and <Latex>$b$</Latex> are constants. The color of the test tube at left reflects the relative concentrations of the reactants. One reactant (Y) is pink, the other (X) green, and the solution's color is some fraction of the way between those colors depending on the fraction of each reactant present (see <a href="https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law">this Wikipedia article on the Beer-Lambert Law</a> for justification).
<br/><br/>
The system either approaches a steady-state point or a limit cycle, depending on system parameters. Play around with the parameters in the Options tab to see what happens!
<br/><br/>
We approximate the system using 
the <a href="https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods">Runge-Kutta</a> 4th order method.
</>;

export default info;