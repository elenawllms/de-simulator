import {range, convertLimits} from '../../constants.js';

export default class Grid {
    constructor(limits, ticks, origin, canvasSize) {
        this.limits = limits;
        this.ticks = ticks;
        this.origin = origin;
        this.canvasSize = canvasSize;
        this.gridLimits = {
            x: {lower: canvasSize.padding, upper: canvasSize.x - canvasSize.padding},
            y: {lower: canvasSize.padding, upper: canvasSize.y - canvasSize.padding},
        }
    }

    get majorTicks() {
        return this.getMajorTicks();
    }

    get minorTicks() {
        return this.getMinorTicks();
    }

    getMajorTicks() {
        const upperX = range(this.origin.x, this.limits.x.max, this.ticks.x.major);
        const lowerX = range(this.origin.x - this.ticks.x.major, this.limits.x.min, -1 * this.ticks.x.major).reverse();
        const majorTicksX = lowerX.concat(upperX);

        const upperY = range(this.origin.y, this.limits.y.max, this.ticks.y.major);
        const lowerY = range(this.origin.y - this.ticks.y.major, this.limits.y.min, -1 * this.ticks.y.major).reverse();
        const majorTicksY = lowerY.concat(upperY);

        return({x: majorTicksX, y: majorTicksY});
    }

    getMinorTicks() {

        const tickSizeX = this.ticks.x.major / this.ticks.x.minor;

        const upperX = range(this.origin.x, this.limits.x.max, tickSizeX);
        const lowerX = range(this.origin.x - tickSizeX, this.limits.x.min, -1 * tickSizeX).reverse();
        var minorTicksX = lowerX.concat(upperX);

        const tickSizeY = this.ticks.y.major / this.ticks.y.minor;

        const upperY = range(this.origin.y, this.limits.y.max, tickSizeY);
        const lowerY = range(this.origin.y - tickSizeY, this.limits.y.min, -1 * tickSizeY).reverse();
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
}




