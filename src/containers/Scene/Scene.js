import React from 'react';

import styles from './Scene.module.css';

import Start from '../../components/Start/Start';
import GameOver from '../../components/GameOver/GameOver';

const scene = (props) => {
    let healthBarStyle = {
        width: (props.width * props.health / 200 ),
        left: (props.width / 2 - (props.width * props.health / 400)),
        backgroundColor: `hsl(${props.health}, 70%, 35%)`
    }
    let displayScore, healthBar, legend = '';

    switch (props.gameState){
        case 'start':
            legend = <Start changeGameState={props.changeGameState} />
            displayScore = <div className={styles.score}>Hiscore: <span id="score">{localStorage['hiscore'] || 0}</span></div>
            break;
        case 'game':
            healthBar = <div id={styles.healthbar} style={healthBarStyle}></div> ;
            displayScore = <div className={styles.score}>Score: <span id="score">{props.score}</span></div>
            break;
        case 'over':
            legend = <GameOver score={props.score} changeGameState={props.changeGameState}/>
            break;
        default: return;
    }
        
    return (
        <div>
            <div id={styles.scene} style={props}></div>
            <div id={styles.topBar} ></div>
            { healthBar }
            { displayScore }
            { legend }
        </div> 
    );
}
 
export default scene;