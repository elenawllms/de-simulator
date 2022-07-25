import React, {useRef, useEffect} from 'react'

export default function StateSpace(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'hsl('+ (props.time * 2) +',50%,70%)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }, [props.time])

  const grid = props.grid;

  return (
    <div id="StateSpace">
      <canvas ref={canvasRef} width={grid.canvasSize.x} height={grid.canvasSize.y}></canvas>
    </div>
  )
}
