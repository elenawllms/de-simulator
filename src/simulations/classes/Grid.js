import {range, convertLimits, CANVAS_RES_FACTOR, drawLine} from '../../constants.js';

const xyObjectMap = (fn) => (Object.fromEntries(['x', 'y'].map(dim => [dim, fn(dim)])));

export default class Grid {
    constructor(props) {
        this.limits = props.limits;
        this.ticks = props.ticks;
        this.origin = props.origin;
        Object.keys(props.canvasSize).map((k, v) => props.canvasSize[k] *= CANVAS_RES_FACTOR);
        this.canvasSize = props.canvasSize;
        this.gridLimits = {
            x: {lower: this.canvasSize.padding, upper: this.canvasSize.x - this.canvasSize.padding},
            y: {upper: this.canvasSize.padding, lower: this.canvasSize.y - this.canvasSize.padding},
        }
    }

    get majorTicks() {
        return this.getMajorTicks();
    }

    get minorTicks() {
        return this.getMinorTicks();
    }

    getMajorTicks() {
        return xyObjectMap(dim => {
            const upperTicks = range(this.origin[dim], this.limits[dim].upper, this.ticks[dim].major);
            const lowerTicks = range(this.origin[dim] - this.ticks[dim].major, this.limits[dim].lower, -1 * this.ticks[dim].major).reverse();
            const majorTicks = lowerTicks.concat(upperTicks);
            return majorTicks;
        });
    }

    getMinorTicks() {
        return xyObjectMap(dim => {
            const tickSize = this.ticks[dim].major / this.ticks[dim].minor;
            const upperTicks = range(this.origin[dim], this.limits[dim].upper, tickSize);
            const lowerTicks = range(this.origin[dim] - tickSize, this.limits[dim].lower, -1 * tickSize).reverse();
            const minorTicks = lowerTicks.concat(upperTicks)
            // .filter(tick => !this.majorTicks[dim].includes(tick));
            return minorTicks;
        });
    }

    isPointInLimits(point, limits) {
        return (((point.x >= limits.x.lower && point.x <= limits.x.upper) || (point.x <= limits.x.lower && point.x >= limits.x.upper))
             && ((point.y >= limits.y.lower && point.y <= limits.y.upper) || (point.y <= limits.y.lower && point.y >= limits.y.upper)));

    }

    pixelToCoords(pixels) {

        // if within range
        if (this.isPointInLimits(pixels, this.gridLimits)) {

            return xyObjectMap(dim => convertLimits(pixels[dim], this.gridLimits[dim], this.limits[dim]));
        }
        return null;
    }

    coordToPixel(dim, coord) {
        if (dim === 'x') {
            return Math.round(convertLimits(coord, this.limits.x, this.gridLimits.x))
        } else if (dim === 'y') {
            return Math.round(convertLimits(coord, this.limits.y, this.gridLimits.y))
        }
    }

    drawGridLines(ctx) {
        ctx.lineWidth = 7;
        ctx.strokeStyle='#000';

        const gridSize = xyObjectMap(dim => this.canvasSize[dim] - 2 * this.canvasSize.padding);
        const extra = xyObjectMap(dim => 0.02 * gridSize[dim]);

        // main lines
        ['x', 'y'].forEach(dim => {
            [this.limits[dim].lower, this.limits[dim].upper].forEach(tickVal => {
                const tick = this.coordToPixel(dim, tickVal);
                if (dim === 'x') {
                    drawLine(ctx, tick, tick, this.gridLimits.y.lower, this.gridLimits.y.upper);
                } else {
                    drawLine(ctx, this.gridLimits.x.lower, this.gridLimits.x.upper, tick, tick);
                }
            })
        });

        // labelled ticks
        const BASE_FONT_SIZE = 16 ;
        ctx.font = BASE_FONT_SIZE * CANVAS_RES_FACTOR + "px Alegreya";
        ctx.textAlign = "center";

        ['x', 'y'].forEach(dim => {
            this.majorTicks[dim].forEach(tickVal => {
                const tick = this.coordToPixel(dim, tickVal);
                if (dim === 'x') {
                    const yLims = this.gridLimits.y;
                    drawLine(ctx, tick, tick, yLims.lower + extra.y, yLims.lower);
                    drawLine(ctx, tick, tick, yLims.upper - extra.y, yLims.upper);
                    ctx.fillText(tickVal, tick, yLims.lower + 3 * extra.y);
                    ctx.fillText(tickVal, tick, yLims.upper - 2 * extra.y);
                } else {
                    const xLims = this.gridLimits.x;
                    drawLine(ctx, xLims.lower - extra.x, xLims.lower, tick, tick);
                    drawLine(ctx, xLims.upper + extra.x, xLims.upper, tick, tick);
                    ctx.fillText(tickVal, xLims.lower - 2.5 * extra.x, tick + BASE_FONT_SIZE);
                    ctx.fillText(tickVal, xLims.upper + 2.5 * extra.x, tick + BASE_FONT_SIZE);
                }
            })
        })

        // all gridlines
        ctx.lineWidth = 2;
        ctx.strokeStyle='#666';
        ['x', 'y'].forEach(dim => {
            this.minorTicks[dim].map(tick => this.coordToPixel(dim, tick)).forEach(tick => {
                if (dim === 'x') {
                    drawLine(ctx, tick, tick, this.gridLimits.y.lower, this.gridLimits.y.upper);
                } else {
                    drawLine(ctx, this.gridLimits.x.lower, this.gridLimits.x.upper, tick, tick);
                }
            })
        });

        // origin lines
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#666';
        ['x', 'y'].forEach(dim => {
            [this.origin[dim]].forEach(tickVal => {
                const tick = this.coordToPixel(dim, tickVal);
                if (dim === 'x') {
                    drawLine(ctx, tick, tick, this.gridLimits.y.lower, this.gridLimits.y.upper);
                } else {
                    drawLine(ctx, this.gridLimits.x.lower, this.gridLimits.x.upper, tick, tick);
                }
            })
        });

        
    }

    drawPoint(ctx, x, y, r, fillStyle) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    drawPointCoord(ctx, point, r, fillStyle) {
        if (this.isPointInLimits(point, this.limits)) {
            const coords = xyObjectMap(dim => convertLimits(point[dim], this.limits[dim], this.gridLimits[dim]))
            this.drawPoint(ctx, coords.x, coords.y, r, fillStyle);
        }
    }

    drawState(ctx, point) {
        this.drawPointCoord(ctx, point, 20, '#057aff');
    }

    drawPastStates(ctx, currentTime, pastStates, stateVars) {
        pastStates.forEach(state => {
            const timeAgo = Math.min(1, Math.exp(2 * (state.time - currentTime)));
            this.drawPointCoord(ctx, {x: state[stateVars.x], y: state[stateVars.y]}, 20 * timeAgo, '#057aff');
        })
    }

    drawLabels(ctx, labels) {
        ctx.fillStyle = 'black';
        ctx.fillText(labels.x, ctx.canvas.width / 2, this.canvasSize.y - 40);

        ctx.translate(80, ctx.canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(labels.y, 0, 0);
    }

    draw(ctx, state, pastStates, stateVars, stateVarLabels) {
        // ctx.fillStyle = 'hsl('+ (time * 5) +',50%,70%)';
        // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.drawGridLines(ctx);
        this.drawPastStates(ctx, state.time, pastStates.slice(-100), stateVars);
        this.drawState(ctx, {x: state[stateVars.x], y: state[stateVars.y]});
        this.drawLabels(ctx, {x: 'Angle (θ)', y: 'Velocity (ω)'})
    }

    handleClick(e, c, setState) {
        const rect = c.getBoundingClientRect();
        const pixels = {x: (e.clientX - rect.left) * CANVAS_RES_FACTOR, y: (e.clientY - rect.top) * CANVAS_RES_FACTOR};
        const coords = this.pixelToCoords(pixels);
        if (coords != null) {
            setState(state => {
                state.initialTheta = coords.x;
                state.initialOmega = coords.y;
                state.theta = coords.x;
                state.omega = coords.y;
                state.time = 0;
                return {...state};
            })
        }
    }
}




