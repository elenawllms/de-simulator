import React from 'react'
import Sketch from 'react-p5';

export default function SpringVis(props) {

    const state = props.state;
    const isDark = props.theme === 'dark';

    const drawSpring = p => {
        p.strokeWeight(10);
        p.stroke(0);
        p.line(0, 0, 0, 50 * (state.displacement + state.restLength))
    }


    const setup = (p, canvasParentRef) => {
        p.createCanvas(300, 500).parent(canvasParentRef);
        p.scale(p.height / 200);
        p.pixelDensity(4);
        console.log("setup called");
    }

    const draw = p => {
        p.background(isDark ? "#1F1E27" : 255);
        p.translate(p.width / 2, p.height / 2);
        drawSpring(p);
    }

    return (
        <div className="Visualization"><Sketch setup={setup} draw={draw}/></div>
    )
}