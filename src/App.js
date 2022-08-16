import './App.css';
import Simulation from './Simulation.js';
import {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PendulumData } from './simulations/data/PendulumData';
import Main from './Main.js';


const COLOR_SCHEME_KEY = "de_simulator.theme";


function App() {

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState(localStorage.getItem(COLOR_SCHEME_KEY, defaultDark ? 'dark' : 'light'));


  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }


  useEffect(() => 
    {localStorage.setItem(COLOR_SCHEME_KEY, theme);}
  , [theme])


  return (
    <div id="App" data-theme={theme}>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Main switchTheme={switchTheme} theme={theme} />} />
          <Route path="/pendulum" element={<Simulation switchTheme={switchTheme} theme={theme} data={PendulumData} />} />
          {/* <Route path="/spring" element={<Spring switchTheme={switchTheme} theme={theme} />} /> */}
        </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
