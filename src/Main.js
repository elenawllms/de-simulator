import React from 'react'
import FrontPageCard from './templates/FrontPageCard';

export default function Main() {
  return (
    <div id="Main">
      <h1>DE Simulations Homepage</h1>
      <h2>HMC Math 82: Differential Equations</h2>
      <p></p>
      <div className='cardLinks'>
        <FrontPageCard link="/pendulum" title="Pendulum" desc="A pendulum with variable length, damping, forcing, and initial angle/velocity."/>
        <FrontPageCard link="/brusselator" title="Brusselator" desc="A version of the Belousov-Zhabotinsky reaction, an oscillating chemical system. The system either approaches a steady-state point or a limit cycle, depending on system parameters."/>
        <FrontPageCard link="/spring" title="Spring" desc="A spring with variable mass, damping, spring stiffness, and initial displacement/velocity."/>
        
      </div>
    </div>
  )
}
