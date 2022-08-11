class Simulation {
    constructor(title, update, grid, updateFromOptions, optionRanges,drawVisualization, info, energy, gridProps, handleStateSpaceClick) {
        this.title = title;
        this.update = update;
        this.grid = grid;
        this.updateFromOptions = updateFromOptions;
        this.optionRanges = optionRanges;
        this.drawVisualization = drawVisualization;
        this.info = info;
        this.energy = energy;
        this.gridProps = gridProps;
        this.handleStateSpaceClick = handleStateSpaceClick;
    }
}

export default Simulation;