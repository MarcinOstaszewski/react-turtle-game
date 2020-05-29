import React from 'react';
import styles from './GameOver.module.css'

const GameOver = (props) => {
    console.log(props)
    return ( 
        <div id={styles.gameover}>
            <h2>GAME OVER</h2>
            <p> Your score: {props.score}</p>
            <div className={styles.btn}
                onClick={()=> props.history.push('/gameon')}
            >START</div>
        </div>
     );
}
 
export default GameOver;