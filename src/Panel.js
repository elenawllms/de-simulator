import React, {useState} from 'react'

import {Energy, Options, Readout, StateSpace, Info} from './cards/index.js';


export default function Panel(props) {

  const [activeTab, setActiveTab] = useState('State Space');

  const tabNames = [
    'Info', 'State Space', 'Energy Diagram', 'Time Series', 'Options'
  ]  

  const tabs = [
    <StateSpace 
      key='State Space' 
      label='State Space'
      gridProps={props.data.stateSpaceProps}
      reset={props.reset}
      setState={props.setState} 
      state={props.state}
      pastStates={props.pastStates}
      isDark={props.theme === 'dark'}
      derivatives={props.data.derivatives}/>,

    <Options 
      key='Options' 
      label='Options' 
      state={props.state} 
      setState={props.setState} 
      options={props.data.options}/>,

    <Energy 
      key='Energy Diagram' 
      label='Energy Diagram' 
      state={props.state} 
      energy={props.data.getEnergyFromState}
      isDark={props.theme === 'dark'}
      gridProps={props.data.energyDiagramProps}/>,

    <Readout 
      key='Time Series' 
      label='Time Series' 
      state={props.state}
      pastStates={props.pastStates}
      isDark={props.theme === 'dark'}
      gridProps={props.data.readoutProps}
      vals={props.data.readoutVals}/>,
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
