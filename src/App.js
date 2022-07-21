import './App.css';
import NavBar from './NavBar.js';
import Stage from './Stage.js';
import {HEADING_SIZE} from './constants.js';
import {createContext, useState, useEffect} from 'react';

export const ThemeContext = createContext(null);

const COLOR_SCHEME_KEY = "de_simulator.theme";


function App() {
  const style = {'--heading-size': HEADING_SIZE};

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
    <div id="App" style={style} data-theme={theme}>
      <NavBar switchTheme={switchTheme} theme={theme}/>
      <div id="stage-wrapper">
        <Stage />
      </div>
      
    </div>
  );
}

export default App;
