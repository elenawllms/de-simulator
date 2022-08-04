import {range, convertLimits, CANVAS_RES_FACTOR, drawLine} from '../../constants.js';

export default class Grid {
    constructor(limits, ticks, origin, canvasSize) {
        this.limits = limits;
        this.ticks = ticks;
        this.origin = origin;
        Object.keys(canvasSize).map((k, v) => canvasSize[k] *= CANVAS_RES_FACTOR);
        this.canvasSize = canvasSize;
        this.gridLimits = {
            x: {lower: this.canvasSize.padding, upper: this.canvasSize.x - this.canvasSize.padding},
            y: {lower: this.canvasSize.padding, upper: this.canvasSize.y - this.canvasSize.padding},
        }
    }

    get majorTicks() {
        return this.getMajorTicks();
    }

    get minorTicks() {
        return this.getMinorTicks();
    }

    getMajorTicks() {
        const upperX = range(this.origin.x, this.limits.x.upper, this.ticks.x.major);
        const lowerX = range(this.origin.x - this.ticks.x.major, this.limits.x.lower, -1 * this.ticks.x.major).reverse();
        const majorTicksX = lowerX.concat(upperX);

        const upperY = range(this.origin.y, this.limits.y.upper, this.ticks.y.major);
        const lowerY = range(this.origin.y - this.ticks.y.major, this.limits.y.lower, -1 * this.ticks.y.major).reverse();
        const majorTicksY = lowerY.concat(upperY);

        return({x: majorTicksX, y: majorTicksY});
    }

    getMinorTicks() {

        const tickSizeX = this.ticks.x.major / this.ticks.x.minor;

        const upperX = range(this.origin.x, this.limits.x.upper, tickSizeX);
        const lowerX = range(this.origin.x - tickSizeX, this.limits.x.lower, -1 * tickSizeX).reverse();
        var minorTicksX = lowerX.concat(upperX);

        const tickSizeY = this.ticks.y.major / this.ticks.y.minor;

        const upperY = range(this.origin.y, this.limits.y.upper, tickSizeY);
        const lowerY = range(this.origin.y - tickSizeY, this.limits.y.lower, -1 * tickSizeY).reverse();
        var minorTicksY = lowerY.concat(upperY);

        return({x: minorTicksX.filter(item => !this.majorTicks.x.includes(item)), 
                y: minorTicksY.filter(item => !this.majorTicks.y.includes(item))});
    }

    pixelToCoords(pixels) {

        if ((pixels.x < this.gridLimits.x.lower && pixels.x > this.gridLimits.x.upper) ||
            (pixels.y < this.gridLimits.y.lower && pixels.y > this.gridLimits.y.upper))  {
            return (null);
        } else {
            return({
                x: convertLimits(pixels.x, this.gridLimits.x, this.limits.x),
                y: convertLimits(pixels.y, this.gridLimits.y, this.limits.y)
            })
        }
    }

    drawGridLines(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle='#444';

        const gridSize = {x: this.canvasSize.x - 2 * this.canvasSize.padding, y:this.canvasSize.y - 2 * this.canvasSize.padding};
        const extra = {x: 0.03 * gridSize.x, y: 0.03 * gridSize.y};
        const tickLimits = {x: {lower: this.gridLimits.x.lower - extra.x, upper: this.gridLimits.x.upper + extra.x},
                            y: {lower: this.gridLimits.y.lower - extra.y, upper: this.gridLimits.y.upper + extra.y}};

        this.majorTicks.x.map(tick => Math.round(convertLimits(tick, this.limits.x, this.gridLimits.x))).forEach(tick => {
            drawLine(ctx, tick, tick, tickLimits.y.lower, tickLimits.y.upper);
        });

        this.majorTicks.y.map(tick => Math.round(convertLimits(tick, this.limits.y, this.gridLimits.y))).forEach(tick => {
            drawLine(ctx, tickLimits.x.lower, tickLimits.x.upper, tick, tick);
        });

        ctx.lineWidth = 2;

        this.minorTicks.x.map(tick => Math.round(convertLimits(tick, this.limits.x, this.gridLimits.x))).forEach(tick => {
            drawLine(ctx, tick, tick, this.gridLimits.y.lower, this.gridLimits.y.upper);
        });

        this.minorTicks.y.map(tick => Math.round(convertLimits(tick, this.limits.y, this.gridLimits.y))).forEach(tick => {
            drawLine(ctx, this.gridLimits.x.lower, this.gridLimits.x.upper, tick, tick);
        });

        ctx.strokeStyle="#000";
        ctx.lineWidth = 7;
        [this.limits.x.lower, this.origin.x, this.limits.x.upper].map(
            tick => Math.round(convertLimits(tick, this.limits.x, this.gridLimits.x))).forEach(tick => {
            drawLine(ctx, tick, tick, this.gridLimits.y.lower, this.gridLimits.y.upper);
        });
        [this.limits.y.lower, this.origin.y, this.limits.y.upper].map(
            tick => Math.round(convertLimits(tick, this.limits.y, this.gridLimits.y))).forEach(tick => {
            drawLine(ctx, this.gridLimits.x.lower, this.gridLimits.x.upper, tick, tick);
        });
    }

    drawPoint(ctx, theta, omega) {

        const xCoord = convertLimits(theta, this.limits.x, this.gridLimits.x);
        const yCoord = convertLimits(omega, this.limits.y, this.gridLimits.y);

        ctx.beginPath();
        ctx.arc(xCoord, yCoord, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#057aff';
        ctx.fill();
    }

    draw(ctx, theta, omega) {
        // ctx.fillStyle = 'hsl('+ (time * 5) +',50%,70%)';
        // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.drawGridLines(ctx);
        this.drawPoint(ctx, theta, omega);
    }
}




