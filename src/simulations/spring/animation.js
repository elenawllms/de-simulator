import React from 'react'
import Sketch from 'react-p5';


const PRIMARY_COLOR = "#0091ff";
const RADIUS = 20;
const WALL_HEIGHT = 5;
const WALL_WIDTH = 100;
const WALL_Y_POSITION = -180;

// the important stuff
const SQUIGGLE_FRACTION = 0.6; // how much of the spring should be squiggles
const NUM_SQUIGGLES = 6; // how many squiggles!
const SQUIGGLE_WIDTH = 30;

export default function SpringVis(props) {

    const scaledDisplacement = 30 + props.state.displacement * props.scale * 10;
    const isDark = props.theme === 'dark';

    const drawWall = p => {
        p.stroke(0);
        p.strokeWeight(2);
        p.rect(-WALL_WIDTH / 2, WALL_Y_POSITION - WALL_HEIGHT, WALL_WIDTH, WALL_HEIGHT);
    }

    const drawMass = p => {
        p.stroke(PRIMARY_COLOR);
        p.strokeWeight(RADIUS * 2);
        p.point(0, scaledDisplacement);
    }

    const drawSpring = p => {        
        const springBottom = scaledDisplacement - RADIUS + 3;
        const springLength = springBottom - WALL_Y_POSITION;
        const topOfSquiggles = WALL_Y_POSITION + springLength * (1-SQUIGGLE_FRACTION) / 2;
        const bottomOfSquiggles = springBottom - springLength * (1-SQUIGGLE_FRACTION) / 2;

        // draw straight part
        p.stroke(0);
        p.strokeWeight(2);
        p.line(0, WALL_Y_POSITION, 0, topOfSquiggles);
        p.line(0, springBottom, 0, bottomOfSquiggles);

        // draw ~squiggles~ !!!
        const totalSquiggleLength = bottomOfSquiggles - topOfSquiggles;
        const squiggleLength = totalSquiggleLength / (2 * NUM_SQUIGGLES);

        // draw first and last half-squigs
        p.line(0, topOfSquiggles, SQUIGGLE_WIDTH, topOfSquiggles + squiggleLength / 2);
        p.line(0, bottomOfSquiggles, -SQUIGGLE_WIDTH, bottomOfSquiggles - squiggleLength / 2);

        // now draw n-1 full squigs in between
        let y = topOfSquiggles + squiggleLength / 2;
        let directionFactor = 1;
        while (y + squiggleLength < bottomOfSquiggles) {
            p.line(directionFactor * SQUIGGLE_WIDTH, y,
                 -directionFactor * SQUIGGLE_WIDTH, y + squiggleLength);
            y += squiggleLength;
            directionFactor *= -1;
        }

        // const wall = [0, -150];
        // const springEnd = [0, wall[1] + 50 * (state.displacement + state.restLength)];
        // const interpolateSpring = frac => wall[1] + (springEnd[1] - wall[1]) * frac;
        // p.strokeWeight(3);
        // p.stroke(0);
        // const yPoints = [0, 1/8, 5/32, 7/32, 9/32, 11/32, 13/32, 15/32, 17/32, 19/32, 21/32, 23/32, 25/32, 27/32, 7/8, 1].map(interpolateSpring);
        // const width = 20;
        // const xPoints = [0, 0, width, -width, width, -width, width, -width,width, -width, width, -width, width, -width, 0, 0];
        // for (let i=0; i<=xPoints.length - 1; i++) {
        //     p.line(xPoints[i], yPoints[i], xPoints[i+1], yPoints[i+1])
        // }
        // // p.line(...wall, ...springEnd);

        // p.stroke(PRIMARY_COLOR);
        // p.strokeWeight(20);
        // p.point(...springEnd);
    }


    const setup = (p, canvasParentRef) => {
        p.createCanvas(300, 500).parent(canvasParentRef);
        p.scale(p.height / 200);
        p.pixelDensity(4);
    }

    const draw = p => {
        p.background(isDark ? "#1F1E27" : 255);
        p.translate(p.width / 2, p.height / 2);
        drawWall(p);
        drawSpring(p);
        drawMass(p);
    }

    return (
        <div className="Visualization"><Sketch setup={setup} draw={draw}/></div>
    )
}