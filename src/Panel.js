import React, {useState} from 'react'

import {Energy, Options, Readout, StateSpace} from './cards/index.js';





export default function Panel(props) {

  const [activeTab, setActiveTab] = useState('State Space');

  const tabNames = [
    'State Space', 'Options', 'Energy Diagram', 'Time Series', 'Info'
  ]  

  const tabs = [
    <StateSpace key='State Space' label='State Space' grid={props.data.grid} state={props.state}/>,
    <Options key='Options' label='Options' state={props.state} data={props.data}/>,
    <Energy key='Energy Diagram' label='Energy Diagram' state={props.state}/>,
    <Readout key='Time Series' label='Time Series' state={props.state}/>
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
