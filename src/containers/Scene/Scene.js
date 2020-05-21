import React from 'react';

import styles from './Scene.module.css';

const scene = (props) => {
    
    let healthBarStyle = {
        width: (props.width * props.health / 200 ) + 'px',
        left: (props.width / 2 - (props.width * props.health / 400)) + 'px',
        backgroundColor: `hsl(${props.health}, 70%, 35%)`
    }

    return ( 
        <div>
            <div style={props}></div>
            <div id={styles.healthbar} style={healthBarStyle}></div>
            <div className={styles.score}>Score: <span id="score">{props.score}</span></div>
        </div> 
    );

}
 
export default scene;