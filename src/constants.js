export const STAGE_DIMENSIONS = {width: 900, height: 500};
export const HEADING_SIZE = '50px';
export const CANVAS_RES_FACTOR = 4;

export const range = (start, end, step=1) => {
    let output = [];
    if (typeof end === 'undefined') {
      end = start;
      start = 0;
    }
    if (step === 0) return null;
    if (step < 0) {
        for (let i = start; i > end; i += step) {
            output.push(i);
        }
    } else {
        for (let i = start; i < end; i += step) {
            output.push(i);
        }
    }
    
    return output;
}

export const convertLimits = (value, init_limits, final_limits) => {
    const decimal =  ((value - init_limits.lower) / (init_limits.upper - init_limits.lower));
    return (final_limits.lower + decimal * (final_limits.upper - final_limits.lower));
}

export const drawLine = (ctx, x1, x2, y1, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export const rk4 = (initialState, des, stateVars, h) => {
    const kList = Array(4).fill().map(()=> {return {}});
    const stateVarIncrementors = [v => 0, v => kList[0][v]*h/2, v => kList[1][v]*h/2, v => kList[2][v]*h];
    const timeIncrements = [0, h/2, h/2, h];

    const states = Array(4).fill().map(() => (JSON.parse(JSON.stringify(initialState))));

    var stateVar;
    for (var i = 0; i < 4; i++) {
        states[i].time += timeIncrements[i];
        for (let j = 0; j < stateVars.length; j++) {
            stateVar = stateVars[j];
            states[i][stateVar] += stateVarIncrementors[i](stateVar);
        }
        for (let j=0; j<stateVars.length; j++) {
            stateVar = stateVars[j];
            kList[i][stateVar] = des[stateVar](states[i]);
        }

    }
    const finalState = initialState;
    finalState.time += h;
    stateVars.forEach(v => {
        finalState[v] += (kList[0][v] + 2*kList[1][v] + 2*kList[2][v] + kList[3][v]) * h / 6;
    });
    return finalState;
    
}