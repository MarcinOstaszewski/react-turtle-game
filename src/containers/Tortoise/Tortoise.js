import React, { Component } from 'react';
import styles from './Tortoise.module.css'

class Tortoise extends Component {
    state = {
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
        rearRightTransform: '',
        rearLeftTransform: '',
        head: '-10px',
        rotationVelocity: 0,
    }
    frameLength = 16;
    bounceFactor = -0.33;
    maxVelocity = 0.25;
    maxRotation = 2.5;
    size = 20;

    flapsMoving = (obj) => {
        let flap = Object.assign({}, {...obj})
        if (flap.moving === 0) {
            if (this.props.keysPressed[flap.key]) {
                return {
                    transform: 'rotate(' + (flap.sign ? '-' : '') + '20deg)',
                    moving: 60,
                    speed: 1.3
                }
            } else return {}
        } else if (flap.moving === 30) { // flap starts to return
            return {
                        transform: 'rotate(' + (flap.sign ? '-' : '') + '80deg)',
                        // transform: null,
                moving: --flap.moving,
                speed: 0
            }
        } else if (flap.moving <= 60 && flap.moving > 0) {
            return {
                moving: --flap.moving,
                speed: (flap.moving > 55)  ?  flap.speed * 1.15  :  flap.speed * 0.97,
            }
        }
    }

    calculateVelocityAndRotation(obj) {
        let values = Object.assign({}, {...obj})
        if (Math.abs(values.verticalVelocity) > 0.01) {
            values.verticalVelocity = values.verticalVelocity * 0.97; // gradually slows down speed
        } else {
            values.verticalVelocity = 0; // stops
        }
        if (Math.abs(values.horizontalVelocity) > 0.01) {
            values.horizontalVelocity = values.horizontalVelocity * 0.97;
        } else {
            values.horizontalVelocity = 0;
        }
        if (values.rotationVelocity > this.maxRotation) { 
            values.rotationVelocity = this.maxRotation; // rotation cannot exceed max...
        } else if (values.rotationVelocity < -this.maxRotation) { 
            values.rotationVelocity = -this.maxRotation; // ... nor -max
        } else {
            if (Math.abs(values.rotationVelocity) > 0.1) {
                values.rotationVelocity *= 0.97; // slowing down rotation
            } else {
                values.rotationVelocity = 0;
            }
        }
        return {
            rotation: values.rotation,
            verticalVelocity: values.verticalVelocity,
            horizontalVelocity: values.horizontalVelocity
        }
    }

    verifyBounce = (left, top, hVelocity, vVelocity) => {
        let values = {
            horizontalVelocity: hVelocity,
            verticalVelocity: vVelocity,
        }
        if (top + hVelocity > this.props.height - this.size) { values.horizontalVelocity *= this.bounceFactor; }
        if (left + vVelocity > this.props.width - this.size) {
            values.verticalVelocity *= this.bounceFactor;
        }
        if (top + hVelocity < 0) { values.horizontalVelocity *= this.bounceFactor; }
        if (left + vVelocity < 0) { values.verticalVelocity *= this.bounceFactor; }
        return values;
    }

    setPlayerPosition = (left, top, hVelocity, vVelocity) => {
        return {
            left: (left + vVelocity) + "px",
            top: (top + hVelocity) + "px"
        }
    }

    setPlayerRotation = (rotation) => {
        let rot = 0 + (rotation % 360);
        if (rotation < -180) { rot = rotation + 360 }
        return rot;
    }

    moveTortoise = () => {
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
        
        Object.assign(tempVal.leftFlap, this.flapsMoving(tempVal.leftFlap)) // naspisuje w tempVal zmienne dla płetw
        Object.assign(tempVal.rightFlap, this.flapsMoving(tempVal.rightFlap))
        
        tempVal.rotation = tempVal.rotation + tempVal.leftFlap.speed - tempVal.rightFlap.speed;

        tempVal.horizontalVelocity = this.state.horizontalVelocity - (this.maxVelocity * (tempVal.leftFlap.speed + tempVal.rightFlap.speed) / 4) * Math.cos(this.state.rotation * Math.PI / 180);
        tempVal.verticalVelocity = this.state.verticalVelocity + (this.maxVelocity * (tempVal.leftFlap.speed + tempVal.rightFlap.speed) / 4) * Math.sin(this.state.rotation * Math.PI / 180);
        
        if (this.props.keysPressed['s']) {
            tempVal.rearRightTransform = "rotate(-40deg)";
            tempVal.rearLeftTransform = "rotate(40deg)";
            tempVal.horizontalVelocity = 0.97 * tempVal.horizontalVelocity;
            tempVal.verticalVelocity = 0.97 * tempVal.verticalVelocity;
        }
        Object.assign(tempVal, this.calculateVelocityAndRotation(tempVal));

        // this.checkCollisions(tempVal.left, tempVal.top);

        Object.assign(tempVal, this.verifyBounce(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
        Object.assign(tempVal, this.setPlayerPosition(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
        Object.assign(tempVal, this.setPlayerRotation(tempVal.rotation));
        
        this.setState({...tempVal})
    }

    componentDidMount() {
        this.interval = window.setInterval(this.moveTortoise, this.frameLength);
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
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
            </div>
         );
    }
}
 
export default Tortoise;