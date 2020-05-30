import React from 'react';
import styles from './Start.module.css'

const Start = (props) => {
    
    return ( 
        <div id={styles.start}>
            <div>Catch the circles for points.</div>
            <div>Brighter circles give more points.</div>
            <div>The greater is your's and circle's speed the more you score.</div>
            <div>Collisions at high speed hurt you.</div>
            <div>Red circles heal you.</div>
            <div>Use <strong>w, s, a, d</strong> keys.</div>
            <div className={styles.btn}
                onClick={ () => props.changeGameState('game') }
            >START</div>

        </div>
     );
}
 
export default Start;