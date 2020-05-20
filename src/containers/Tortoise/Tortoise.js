import React, { Component } from 'react';
import styles from './Tortoise.module.css'
import {
    setPlayerPosition,
    setPlayerRotation,
    verifyBounce,
    checkCollisions,
    placeStar,
    calculateVelocityAndRotation,
    flapsMoving,
    consts
} from '../../helperFunctions';

class Tortoise extends Component {
    state = {
        left: this.props.scrWidth / 2 + 'px', // tortoise horiz. position
        top: this.props.scrWidth / 2 + 'px', // tortoise vert. position
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
        starsArr: [],
        rearRightTransform: '',
        rearLeftTransform: '',
        head: '-10px',
        rotationVelocity: 0,
    }
    starInterval = [];
    tmOut;

    update = () => {
        let tempVal = {
            leftFlap: {...this.state.leftFlap},
            rightFlap: {...this.state.rightFlap},
            rearLeftTransform: "rotate(-20deg)", // starting position
            rearRightTransform: "rotate(20deg)",
            top: parseFloat(this.state.top), // Number(this.state.top.slice(0, -2)),
            left: parseFloat(this.state.left), //Number(this.state.left.slice(0, -2)),
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

        for (let i = 0; i < this.state.starsArr.length; i++) {
            if (checkCollisions(
                consts.tortoiseSize, tempVal.left, tempVal.top,  // tortoise
                this.state.starsArr[i] // star
            )) {
                window.clearInterval(this.starInterval[i]);
                placeStar(i, this)
            }
        }

        Object.assign(tempVal, verifyBounce(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity, consts.tortoiseSize, this.props.scrWidth, this.props.scrHeight, consts.bounceFactor));
        Object.assign(tempVal, setPlayerPosition(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
        Object.assign(tempVal, setPlayerRotation(tempVal.rotation));
        
        this.setState({...tempVal})
    }

    componentDidMount() {
        window.onresize = () => this.props.checkWindowSize();
        this.interval = window.setInterval(this.update, this.props.frameLength);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.starsArr.length < consts.maxStarsCount && this.props.scrHeight && this.props.scrWidth) {
            // this.tmOut = window.setTimeout(placeStar.bind(null, this.state.starsArr.length, this), Math.floor(Math.random() * 1000) + 500)
            placeStar(this.state.starsArr.length, this);
        }
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
        window.clearInterval(this.starInterval);
    }

    render() { 
        let stars = this.state.starsArr.map((item, i) => {
            return (
                <div className="star" key={i}
                    style={{
                        left: this.state.starsArr[i].left,
                        top: this.state.starsArr[i].top,
                        backgroundColor: consts.starColors[i] }}></div>
            )
        })
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
                { stars }
            </div>
         );
    }
}
 
export default Tortoise;