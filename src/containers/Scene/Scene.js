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
    let displayScore;
    let healthBar;
    let legend = '';

    if (props.gameState === 'start') {
        legend = <Start changeGameState={props.changeGameState} />
        displayScore = <div className={styles.score}>Hiscore: <span id="score">{localStorage['hiscore'] || 0}</span></div>
        
    } else if (props.gameState === 'game') {
        healthBar = <div id={styles.healthbar} style={healthBarStyle}></div> ;
        displayScore = <div className={styles.score}>Score: <span id="score">{props.score}</span></div>

    } else if (props.gameState === 'over') {
        legend = <GameOver 
            score={props.score}
            changeGameState={props.changeGameState}/>
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