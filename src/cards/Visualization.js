import React, {useRef, useEffect} from 'react';
import {drawLine, CANVAS_RES_FACTOR} from '../constants.js';

const dims = {
  width: 300 * CANVAS_RES_FACTOR,
  height: 450 * CANVAS_RES_FACTOR,
  length: 500,
  radius: 50,
  center: 800,
  bottom: 1600
}

export default function Visualization(props) {
  const pendulumRef = useRef(null);


  const drawPendulum = (ctx) => {

    const ballPos = {x: dims.width/2 + dims.length * Math.sin(props.state.theta),
               y: dims.center + dims.length * Math.cos(props.state.theta)}

    // Draw line
    ctx.strokeStyle ="black";
    ctx.lineWidth = 3 * CANVAS_RES_FACTOR;
    drawLine(ctx, dims.width/2, ballPos.x, dims.center, ballPos.y);

    // Draw ball
    ctx.beginPath();
    // ctx.fillStyle = 'hsl('+ (props.state.time * 20) +',50%,70%)';
    ctx.fillStyle = "#047AFF";
    ctx.arc(ballPos.x, ballPos.y, dims.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw circle
    ctx.beginPath();
    ctx.strokeStyle = "#047AFF";
    ctx.setLineDash([1, 3].map(x => x * CANVAS_RES_FACTOR));
    ctx.lineWidth = CANVAS_RES_FACTOR;
    ctx.arc(dims.width/2, dims.center, dims.length, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);


    // Draw shadow
    ctx.setTransform(1, 0, 0, 0.5, 0, 0);
    const height = ballPos.y + dims.length;
    const heightConst = 1 + height / 2000;
    var grd = ctx.createRadialGradient(ballPos.x, dims.bottom * 2, 0, ballPos.x, dims.bottom * 2, dims.radius * heightConst); // Creates gradient
    
    grd.addColorStop(0, 'rgb(0, 0, 0,' + height / 5000 + ')');
    grd.addColorStop(0.4, 'rgb(0, 0, 0,' + height / 10000 + ')');
    grd.addColorStop(0.6, 'rgb(0, 0, 0,' + height / 15000 + ')');
    grd.addColorStop(0.8, 'rgb(0, 0, 0,' + height / 80000 + ')');
    grd.addColorStop(1, "#00000000");
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, dims.width, dims.height * 2);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    
  };
  
  useEffect(() => {
    const c = pendulumRef.current;
    c.width = dims.width;
    c.height = dims.height;
    const ctx = c.getContext('2d');
    ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPendulum(ctx);
  }, [props.state.time]);



  return (
    <div id="Visualization">
      <canvas ref={pendulumRef} style={{width: dims.width / CANVAS_RES_FACTOR, height: dims.height / CANVAS_RES_FACTOR}}></canvas>
    </div>
  )
}
