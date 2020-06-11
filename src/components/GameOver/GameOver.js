import React from 'react';
import styles from './GameOver.module.css'

const GameOver = (props) => {
    return ( 
        <div id={styles.gameover}>
            <h2>GAME OVER</h2>
            <h3>Your score:</h3>
            <h1>{props.score}</h1>
            <div className={styles.btn}
                onClick={ () => props.changeGameState('start') }
            >RESTART</div>
        </div>
     );
}
 
export default GameOver;