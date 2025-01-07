# Differential Equation Simulator for Math 82

This project simulates three differential equations explored in Harvey Mudd's Math 82: Differential Equations—a damped driven pendulum, a spring, and the [Brusselator chemical reaction](https://en.wikipedia.org/wiki/Brusselator). It is built with React.js. The site is live at https://elenawllms.github.io/de-simulator/.

## How it works

The app uses the [Runge-Kutta 4th-order method](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods) to solve the differential equations from various initial conditions. In effect, it approximates the slope at the beginning, middle, and end of a timestep, with greater weight given to the midpoint. 

## Organization

In ``src/simulations``, there are three folders corresponding to the three simulations, each containing the files ``data.js``, ``info.js``, and ``animation.js``. The ``data.js`` file encodes all information pertaining to the simulation—the parameters required to denote a point in state space, the limits on each property, the equations used to find derivatives and energies, and more. The ``info.js`` file simply provides the HTML displayed in the Info tab explaining the differential equation. The ``animation.js`` file provides the logic required to visualize the system. 

Templates for displaying the different tabs are under ``src/cards``, including the logic for updating a state based on modifications to the ``Options`` tab or by clicking somewhere on the ``StateSpace`` graph.

## How to deploy

Run `npm start` to run the app locally on localhost. Run `npm run deploy` which to build the app and deploy to the `gh-pages` branch.

## Future Work

Future work on this project could include adding multithreading capabilities to reduce performance issues, particularly in the Energy Diagram tab, and making it responsive to more device sizes. Furthermore, adding a contour plot option would be interesting. Finally, the simulations could be better defined in terms of dimensionless parameters, although this might make the physical applicability less intuititve.

## Credits

Thank you to the Harvey Mudd Math Department for funding this project.
