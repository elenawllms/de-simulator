import React from 'react'
import {Link} from 'react-router-dom';


export default function Main() {
  return (
    <div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/spring">Spring</Link></li>
            <li><Link to="/pendulum">Pendulum</Link></li>
        </ul>

    </div>
  )
}
