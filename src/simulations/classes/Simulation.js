class Simulation {
    constructor(title, update, grid, updateFromOptions, optionRanges,drawVisualization) {
        this.title = title;
        this.update = update;
        this.grid = grid;
        this.updateFromOptions = updateFromOptions;
        this.optionRanges = optionRanges;
        this.drawVisualization = drawVisualization;
    }
}

export default Simulation;