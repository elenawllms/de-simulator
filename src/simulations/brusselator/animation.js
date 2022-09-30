import Sketch from 'react-p5';

const GREEN_HUE = 120;
const PINK_HUE = -40;

export default function BrusselatorVis(props) {

    const isDark = props.theme === 'dark';

    // find hue value as function of concentrations of x and y
    const fractionGreen = (props.state.x / (props.state.x + props.state.y));
    let currentHue = PINK_HUE + fractionGreen * (GREEN_HUE - PINK_HUE);
    if (currentHue < 0) {currentHue += 360};
    const colorString = `hsl(${parseInt(currentHue).toString()}, 75%, 75%)`;

    const setup = (p, canvasParentRef) => {
        p.createCanvas(300, 500).parent(canvasParentRef);
        p.scale(p.height / 200);
        p.pixelDensity(4);
    }

    const draw = p => {
        p.background(isDark ? "#1F1E27" : 255);
        p.translate(p.width / 2, p.height / 2);

        //contents of test tube
        p.strokeWeight(0);
        p.fill(p.color(colorString));
        p.rect(-30, -90, 60, 190);
        p.triangle(0, -90, -100, 100, 100, 100);

        // border of test tube
        p.stroke(0);
        p.strokeWeight(5);
        // sides of the top
        p.line(-30, -100, -30, -30);
        p.line(30, -100, 30, -30);
        // angled sides
        p.line(-30, -30, -100, 100);
        p.line(30, -30, 100, 100);
        // bottom
        p.line(-100, 100, 100, 100);
        // cap
        p.strokeWeight(10);
        p.line(-40, -105, 40, -105);
    }

    return (
        <div className="Visualization"><Sketch setup={setup} draw={draw}/></div>
    )
}