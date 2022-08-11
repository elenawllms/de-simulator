import React, {useRef, useEffect} from 'react'

export default function StateSpace(props) {
  const canvasRef = useRef(null);

  const grid = props.grid;

  const state = props.state;

  useEffect(() => {
    const c = canvasRef.current;
    c.width = grid.canvasSize.x;
    c.height = grid.canvasSize.y;
    const ctx = c.getContext('2d');
    c.addEventListener("mousedown", function(e) {grid.handleClick(e, c, props.setState);});
    grid.draw(ctx, state, props.pastStates, {x: 'theta', y: 'omega'});
    // eslint-disable-next-line
  }, [state.time])


  return (
    <div id="StateSpace">
      <canvas
        ref={canvasRef}
      ></canvas>
    </div>
  )
}
