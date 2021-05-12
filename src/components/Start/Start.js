import React from 'react';
import styles from './Start.module.css'

const Start = (props) => {
    
    return ( 
        <div id={styles.start}>
            <div>Collect the circles for points.</div>
            <div>Brighter circles give more points.</div>
            <div>The greater is your's and circle's speed the more you score.</div>
            <div>Collisions with walls and obstacles hurt you.</div>
            <div>Red circles heal you or give more points.</div>
            <div>Use <strong>w, s, a, d</strong> keys.</div>
            <div className={styles.btn}
                onClick={ () => props.changeGameState('game') }
            >START</div>
            <div className={styles.sounds}>
                <p>Music: </p>
                <p>"Covered In Oil" by Broke For Free @freemusicarchive.org</p>
                <p>Sounds:</p>
                <p>bradwesson, Julien Nicolas, Andy Rhode @freesounds.com</p>
            </div>
        </div>
    );
}
 
export default Start;