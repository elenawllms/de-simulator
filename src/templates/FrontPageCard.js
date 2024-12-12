import React from 'react'
import {Link} from 'react-router-dom';


export default function FrontPageCard(props) {
    return (
        <Link to={props.link}>
            <div className='card'>
                {/* <img src={require(`../simulations/${props.simulation}/cover.png`)} alt=""/> */}
                <h2 className='title'>{props.title}</h2>
                <p className="desc">{props.desc}</p>
            </div>
        </Link>
    )
}
