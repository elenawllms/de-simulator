class Parameter {
    /**
     * Initializes a parameter, which includes constants and state variables.
     * @param {string} variableName 
     * @param {string} displayName 
     * @param {number} min 
     * @param {number} max 
     * @param {number} defaultValue 
     * @param {string} unit 
     * @param {string} symbol 
     */
    constructor(variableName, displayName, min, max, defaultValue, unit, symbol) {
        Object.assign(this, {variableName, displayName, min, max, defaultValue, unit, symbol});
    }
}

class StateVar extends Parameter {
    constructor(color, derivative, ...args) {
        super(...args);
        this.color = color;
        this.derivative = derivative; // function of state, assuming this won't cause issues... for now
    }
}



/**
 * Desired behavior:
 * - Easy to create new simulation
 * - Compiles x, y, min/max, etc data
 * - Ensures that all state variables are accounted for
 */


class StateTemplate {
    constructor(t, x, y, ...other) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.other = other;
    }

    get stateVariableNames() {
        return [this.t, this.x, this.y, ...this.other];
    }
}

const pendulumState = new StateTemplate(t = "time", x = "angle", y = "velocity");

class Simulation {
    /**
     * Creates a new simulation from a StateTemplate.
     * @param {StateTemplate} stateTemplate
     */
    constructor(stateTemplate) {
        this.stateTemplate = stateTemplate;
        this.stateVars = null;
    }

    /** Given a list of variables, checks that the list matches the list of state variables */
    checkForStateTemplateMatch(varList) {
        if (varList.sort() != this.stateTemplate.stateVariableName.sort()) {
            throw new Error("Provided state variables do not match state template");
        }
    }

    /**
     * @param {StateVar[]} stateVars
     */
    set stateVars (stateVars) {
        // check that the state variables provided match the state template
        this.checkForStateTemplateMatch(stateVars.map(v => v.variableName));
        this.stateVars = stateVars;
    }

    /**
     * @param {Parameter[]} constants
     */
    set constants (constants) {
        this.constants = constants;
    }
}


/* TESTS */

module.exports = StateTemplate;

