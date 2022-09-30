import React from 'react'
import Sketch from 'react-p5';


const PRIMARY_COLOR = "#0091ff";


export default function SpringVis(props) {

    const state = props.state;
    const isDark = props.theme === 'dark';

    const drawSpring = p => {
        const wall = [0, -150];
        const springEnd = [0, wall[1] + 50 * (state.displacement + state.restLength)];
        const interpolateSpring = frac => wall[1] + (springEnd[1] - wall[1]) * frac;
        p.strokeWeight(3);
        p.stroke(0);
        const yPoints = [0, 1/8, 5/32, 7/32, 9/32, 11/32, 13/32, 15/32, 17/32, 19/32, 21/32, 23/32, 25/32, 27/32, 7/8, 1].map(interpolateSpring);
        const width = 20;
        const xPoints = [0, 0, width, -width, width, -width, width, -width,width, -width, width, -width, width, -width, 0, 0];
        for (let i=0; i<=xPoints.length - 1; i++) {
            p.line(xPoints[i], yPoints[i], xPoints[i+1], yPoints[i+1])
        }
        // p.line(...wall, ...springEnd);

        p.stroke(PRIMARY_COLOR);
        p.strokeWeight(20);
        p.point(...springEnd);
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