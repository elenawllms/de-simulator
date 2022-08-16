import React, {useRef, useEffect} from 'react';


export default function Visualization(props) {
  const pendulumRef = useRef(null);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.state.time]);



  return (
    <div id="Visualization">

      <canvas ref={pendulumRef} style={{width: 300, height: 450}}></canvas>
    </div>
  )
}
