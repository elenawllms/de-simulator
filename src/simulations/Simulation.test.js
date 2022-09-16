const StateTemplate = require('./Simulation.js');

// Getting list of state variable names
const actualStateVarNames = ['time', 'angle', 'velocity'];
const newStateTemplate = new StateTemplate(...actualStateVarNames);
console.log(newStateTemplate.stateVariableNames);
test('list of state variable names', () => {
    expect(newStateTemplate.stateVariableNames).toEqual(actualStateVarNames);
})

