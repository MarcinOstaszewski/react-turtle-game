import React from 'react';
import styles from './Start.module.css'

const Start = (props) => {
    // console.log(props)
    return ( 
        <div id={styles.start}>
            <p>Your goal is to catch the stars.</p>
            <p>The greater the speed the more points you score.</p>
            <p>Avoid collisions with the walls.</p>
            <p>Use w, s, a, d keys.</p>
            <div className={styles.btn}
                onClick={()=> props.history.push('/gameon')}
            >START</div>

        </div>
     );
}
 
export default Start;