import React, {useRef, useEffect} from 'react'

export default function StateSpace(props) {
  const canvasRef = useRef(null);

  const grid = props.grid;


  useEffect(() => {
    const c = canvasRef.current;
    c.width = grid.canvasSize.x;
    c.height = grid.canvasSize.y;
    const ctx = c.getContext('2d');
    grid.draw(ctx, props.time);
    // eslint-disable-next-line
  }, [props.time])


  return (
    <div id="StateSpace">
      <canvas
        ref={canvasRef}
      ></canvas>
    </div>
  )
}
