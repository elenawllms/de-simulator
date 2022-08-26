import React from 'react'
import {Link} from 'react-router-dom';

export default function Main() {
  return (
    <div id="Main">
      <h1>DE Simulations</h1>
      <h2>Math 82: Differential Equations</h2>
      <p>A bit of description can go here that introduces the tool and describes how to navigate it. 
        This should probably also note that the tool is being developed and might be buggy which is unfortunate.</p>
      <div className='cardLinks'>
        <Link to="/pendulum">
          <div className='card'>
            <img src={require('./simulations/coverImages/pendulum.png')} alt=""/>
            <div className='desc'>Pendulum</div>
          </div>
          
        </Link>
        <Link to="/spring">
          <div className='card'>
            <img src={require('./simulations/coverImages/spring.jpg')} alt=""/>
            <div className='desc'>Spring</div>
          </div>
        </Link>
        
      </div>
    </div>
  )
}
