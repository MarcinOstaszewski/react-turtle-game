import React, { Component } from 'react';
import styles from './Tortoise.module.css'
import {
    setPlayerPosition,
    setPlayerRotation,
    verifyBounce,
    checkCollisions,
    moveStar,
    calculateVelocityAndRotation,
    flapsMoving,
    consts
} from '../../helperFunctions';

class Tortoise extends Component {
    state = {
        scrHeight: this.props.scrHeight || window.innerHeight,
        scrWidth: this.props.scrWidth || window.innerWidth,
        left: this.props.left, // tortoise horiz. position
        top: this.props.top, // tortoise vert. position
        rotation: this.props.rotation || 0,
        horizontalVelocity: this.props.horizontalVelocity || 0,
        verticalVelocity: this.props.verticalVelocity || 0,
        leftFlap: {
            moving: 0,
            speed: 0,
            transform: '',
            sign: 0,
            key: 'a'
        },
        rightFlap: {
            moving: 0,
            speed: 0,
            transform: '',
            sign: 1, 
            key: 'd'
        },
        starsArr: [
            {
                left: '',
                top: '',
                size: 20,
                hSpeed: 0,
                vSpeed: 0
            }
        ],
        rearRightTransform: '',
        rearLeftTransform: '',
        head: '-10px',
        rotationVelocity: 0,
    }
    starInterval;

    update = () => {
        let tempVal = {
            leftFlap: {...this.state.leftFlap},
            rightFlap: {...this.state.rightFlap},
            rearLeftTransform: "rotate(-20deg)", // starting position
            rearRightTransform: "rotate(20deg)",
            top: Number(this.state.top.slice(0, -2)),
            left: Number(this.state.left.slice(0, -2)),
            rotation: this.state.rotation + 0,
            rotationVelocity: this.state.rotationVelocity,
            head: '-10px',
        }
        
        if (this.props.keysPressed['w']) { tempVal.head = '-20px'; }
        
        Object.assign(tempVal.leftFlap, flapsMoving(tempVal.leftFlap, this.props.keysPressed)) // overwrite in tempVal variables for flap(s)
        Object.assign(tempVal.rightFlap, flapsMoving(tempVal.rightFlap, this.props.keysPressed))
        
        tempVal.rotation = tempVal.rotation + tempVal.leftFlap.speed - tempVal.rightFlap.speed;

        tempVal.horizontalVelocity = this.state.horizontalVelocity - (consts.maxVelocity * (tempVal.leftFlap.speed + tempVal.rightFlap.speed) / 4) * Math.cos(this.state.rotation * Math.PI / 180);
        tempVal.verticalVelocity = this.state.verticalVelocity + (consts.maxVelocity * (tempVal.leftFlap.speed + tempVal.rightFlap.speed) / 4) * Math.sin(this.state.rotation * Math.PI / 180);
        
        if (this.props.keysPressed['s']) {
            tempVal.rearRightTransform = "rotate(-40deg)";
            tempVal.rearLeftTransform = "rotate(40deg)";
            tempVal.horizontalVelocity = 0.97 * tempVal.horizontalVelocity;
            tempVal.verticalVelocity = 0.97 * tempVal.verticalVelocity;
        }
        Object.assign(tempVal, calculateVelocityAndRotation(tempVal, consts.maxRotation));

        for (let i = 0; i < consts.maxStarsCount; i++) {
            if (checkCollisions(
                consts.tortoiseSize, tempVal.left, tempVal.top,  // tortoise
                this.state.starsArr[i] // star
            )) {
                window.clearInterval(this.starInterval);
                this.placeStar(0)
            }
        }

        Object.assign(tempVal, verifyBounce(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity, consts.tortoiseSize, this.state.scrWidth, this.state.scrHeight, consts.bounceFactor));
        Object.assign(tempVal, setPlayerPosition(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
        Object.assign(tempVal, setPlayerRotation(tempVal.rotation));
        
        this.setState({...tempVal})
    }
    
    placeStar = (i) => {
        let x = Math.floor(Math.random() * (this.state.scrWidth - 60) + 30);
        let y = Math.floor(Math.random() * (this.state.scrHeight - 60) + 30);
        this.setState(state => {
            const stars = state.starsArr.map((item, j) => {
                if (j === i) {
                    return {
                        ...item,
                        hSpeed: Math.random() * 4 - 2,
                        vSpeed: Math.random() * 4 - 2,
                        left: x + 'px',
                        top: y + 'px'
                    };
                } else {
                    return item;
                };
            })

            return { starsArr: stars }
        })
        this.starInterval = window.setInterval(moveStar.bind(null, i, this), this.props.frameLength);
    }    

    componentDidMount() {
        this.interval = window.setInterval(this.update, this.props.frameLength);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.starsArr[0].left === '' && this.state.scrHeight && this.state.scrWidth) {
            for (let i = 0; i < consts.maxStarsCount; i++) {
                this.placeStar(i);
            }
        }
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
        window.clearInterval(this.starInterval);
    }

    render() { 
        return ( 
            <div>
                <div id={styles.Tortoise} 
                    style = {{
                        left: this.state.left,
                        top: this.state.top,
                        transform: "rotate(" + this.state.rotation + "deg)"
                }}>
                    <div className={styles.head} 
                        style={{top: this.state.head}}>
                    </div>
                    <div className={styles.flap} 
                        style={{transform: this.state.rightFlap.transform}}>
                    </div>
                    <div className={[styles.flap, styles.left].join(' ')} 
                        style={{transform: this.state.leftFlap.transform}}>
                    </div>
                    <div className={styles.rear} style={{transform: this.state.rearRightTransform}}></div>
                    <div className={[styles.rear, styles.left].join(' ')} style={{transform: this.state.rearLeftTransform}}></div>
                </div>
                <div id="star"
                    style={{
                        left: this.state.starsArr[0].left,
                        top: this.state.starsArr[0].top,
                        backgroundColor: consts.starColors[0]
                }}></div>
            </div>
         );
    }
}
 
export default Tortoise;