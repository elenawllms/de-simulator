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
