import React from 'react';
import './ThemeToggle.css';

export default function NavBar(props) {
  return (
    <div className="NavBar">
      <div id="navbar-left">
        <button onClick={() => {console.log("menu")}} id="menu-button">
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30">
            <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"/>
          </svg>
        </button>
      </div>
      
      <span id="title-text">Pendulum</span>
      <div id="navbar-right">
        <button onClick={() => {console.log("info")}} id="info-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-info-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
        </button>



        <label className="switch" id="theme-button">
          <input 
            id="theme-toggle-input" 
            type="checkbox" 
            checked={props.theme === "dark"} 
            onChange={props.switchTheme}/>
          <span className="slider"></span>
        </label>
        
      </div>
      

    </div>
  )
}
