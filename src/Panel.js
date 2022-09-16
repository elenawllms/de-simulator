/**
 * PANEL.JS
 * Panel component, containing all non-visualization windows for the simulation.
 * Allows toggling between tabs and keeps track of the active tab. Last component
 * to receive all data from the simulation, so we need to keep track of what we
 * pass down at this stage.
 */

import React, {useState} from 'react'
import {Energy, Options, Readout, StateSpace, Info} from './cards/index.js';

export default function Panel(props) {

  // keep track of the active tab
  const [activeTab, setActiveTab] = useState('State Space');
  // titles that go at the top of each tab
  const tabNames = [
    'Info', 'State Space', 'Energy Diagram', 'Time Series', 'Options'
  ]  

  // what JSX element to render for each tab
  const tabs = [
    // State Space tab
    <StateSpace 
      key='State Space' 
      label='State Space'
      gridProps={props.data.stateSpaceProps}
      reset={props.reset}
      state={props.state}
      stateVars={props.data.stateVars}
      setInitialState={props.setInitialState}
      parameters={props.parameters}
      pastStates={props.pastStates}
      setState={props.setState}
      gridVariables={props.data.gridVariables}
      isDark={props.theme === 'dark'}
      derivatives={props.data.derivatives}/>,

      // Options tab
    <Options 
      key='Options' 
      label='Options' 
      initialState={props.initialState}
      setInitialState={props.setInitialState}
      parameters={props.parameters}
      setParameters={props.setParameters}
      stateVars={props.data.stateVars}
      parameterVars={props.data.parameters} // I am aware of how bad this is
      />,

    <Energy 
      key='Energy Diagram' 
      label='Energy Diagram' 
      state={props.state} 
      energy={props.data.energyFn}
      isDark={props.theme === 'dark'}
      gridProps={props.data.energyDiagramProps}/>,

    <Readout 
      key='Time Series' 
      label='Time Series' 
      state={props.state}
      stateVars={props.data.stateVars}
      parameters={props.parameters}
      pastStates={props.pastStates}
      isDark={props.theme === 'dark'}
      gridProps={props.data.timeSeriesProps}
      />,
    <Info key='Info' label='Info' state={props.state} info={props.data.info}/>
  ]

  return (
    <div id="Panel">
        <div className='tabs'>
          <ol className='tab-list'>
            {tabNames.map((label) => {
              return <li key={label} 
                          className={activeTab === label ? 'tab-list-active' : 'tab-list-inactive'}
                          onClick={() => {setActiveTab(label)}}>
                            {label}
                      </li>})}
          </ol>
        </div>
        <div className='panel-content'>
          {tabs.map((tab) => {
            return (tab.props.label !== activeTab) ? undefined : tab
          })}
        </div>
    </div>
  )
}
