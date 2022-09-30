import { rk4 } from '../../constants.js';

const h = 0.01;

class Parameter {
    /**
     * Initializes a parameter, which includes constants and state variables.
     * @param {string} displayName 
     * @param {number} min 
     * @param {number} max 
     * @param {number} defaultValue 
     * @param {string} unit 
     * @param {string} symbol 
     */
    constructor(displayName, min, max, defaultValue, unit, symbol) {
        Object.assign(this, {displayName, min, max, defaultValue, unit, symbol});
    }
}

class StateVar extends Parameter {
    /**
     * 
     * @param {string} color 
     * @param {object => number} derivative 
     * @param {string} displayName
     * @param {number} min
     * @param {number} max
     * @param {number} defaultValue
     * @param {string} unit
     * @param {string} symbol
     * @param {number => number} postProcess
     */
    constructor(displayName, min, max, defaultValue, unit, symbol, color, postProcess) {
        super(displayName, min, max, defaultValue, unit, symbol);
        this.color = color;
        this.postProcess = postProcess; // anything like angle needs to be within -pi and pi, function of 
    }
}

// given state variables and derivatives, create a step function
const createStepFunction = (stateVars, derivatives) => (
    (state, parameters) => {
        const newState = rk4(state, parameters, derivatives,Object.keys(stateVars), h);
        Object.keys(stateVars).forEach(v => newState[v] = stateVars[v].postProcess(newState[v]));
        return newState;
    }
);


export {Parameter, StateVar, createStepFunction};