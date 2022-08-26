import React from 'react';
import { Link } from 'react-router-dom';
import './ThemeToggle.css';

export default function NavBar(props) {
  return (
    <div className="NavBar">
      <div id="navbar-left">
        <button onClick={() => {console.log("menu")}} id="menu-button"><Link to="/home">
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" width="16px" height="16px"><path d="M 8 1.320313 L 0.660156 8.132813 L 1.339844 8.867188 L 2 8.253906 L 2 14 L 7 14 L 7 9 L 9 9 L 9 14 L 14 14 L 14 8.253906 L 14.660156 8.867188 L 15.339844 8.132813 Z M 8 2.679688 L 13 7.328125 L 13 13 L 10 13 L 10 8 L 6 8 L 6 13 L 3 13 L 3 7.328125 Z"/></svg>        
        </Link></button>
      </div>
      
      <span id="title-text">{props.title}</span>
      <div id="navbar-right">
        {/* <button onClick={() => {console.log("info")}} id="info-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-info-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
        </button> */}



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
