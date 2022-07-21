import React from 'react';

export default function NavBar(props) {
  return (
    <div className="NavBar">
      <button onClick={props.switchTheme}>Switch to {props.theme === 'light' ? "Dark" : "Light"} Mode</button>
    </div>
  )
}
