import React from 'react'
import FrontPageCard from './templates/FrontPageCard';

export default function Main() {
  return (
    <div id="Main">
      <h1>Simulations of Differential Equations</h1>
      <h2>HMC Math 82: Differential Equations</h2>
      <p>This is a new tool to interactively simulate differential equations. It is still in development, though, so I apologize for any buggy behavior! In particular, <strong>do not view this website on a mobile phone</strong>. Ideally, view it in the browser of your computer; a tablet works too, though it might be slower with the 3D Energy Diagram tabs.</p>
      <div className='cardLinks'>
        <FrontPageCard link="/pendulum" title="Pendulum" desc="Simulates a pendulum with variable length, damping, forcing, and initial angle/velocity."/>
        <FrontPageCard link="/brusselator" title="Brusselator" desc="Simulates a version of the Belousov-Zhabotinsky reaction, an oscillating chemical system. The system either approaches a steady-state point or a limit cycle, depending on system parameters."/>
        <FrontPageCard link="/spring" title="Spring" desc="Simulates a spring with variable mass, damping, spring stiffness, and initial displacement/velocity. Does not account for gravity (yet)."/>
        
      </div>
    </div>
  )
}
