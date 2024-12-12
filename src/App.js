/**
 * APP.JS
 * 
 * This is the main file for the React app. It contains the main App component and 
 * contains the routing logic for the app. It accesses and passes down the data
 * objects for each simulation.
 */

import './App.css';
import Simulation from './Simulation.js';
import {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PendulumData } from './simulations/pendulum/data';
import { SpringData } from './simulations/spring/data';
import { BrusselatorData } from './simulations/brusselator/data';
import Main from './Main.js';


const COLOR_SCHEME_KEY = "de_simulator.theme";


function App() {

  // if the user has a color scheme preference, use that. Otherwise, use the default
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState(localStorage.getItem(COLOR_SCHEME_KEY, defaultDark ? 'dark' : 'light'));

  // create a function to change the theme
  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  // save the theme preference to local storage each time it's updated
  useEffect(() => 
    {localStorage.setItem(COLOR_SCHEME_KEY, theme);}
  , [theme])


  return (
    <div id="App" data-theme={theme}>
      <BrowserRouter>
        <Routes>
        {/* Home page */}
        <Route path="/" element={<Main switchTheme={switchTheme} theme={theme} />} />
        {/* Pendulum simulation */}
          <Route path="/pendulum" element={<Simulation switchTheme={switchTheme} theme={theme} data={PendulumData} />} />
          {/* Spring simulation */}
          <Route path="/spring" element={<Simulation switchTheme={switchTheme} theme={theme} data={SpringData}/>} />
          {/* Brusselator simulation */}
          <Route path="/brusselator" element={<Simulation switchTheme={switchTheme} theme={theme} data={BrusselatorData}/>} />
        </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
