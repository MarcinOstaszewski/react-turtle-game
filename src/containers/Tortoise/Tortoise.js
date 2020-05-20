import React, { Component } from 'react';
import styles from './Tortoise.module.css'

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
    starColors = ['#C5DE79', '#C0DA74', '#ADC668', '#9AB15D', '#869D51', '#738846', '#60743A', '#4D602E', '#3A4B23', '#263717']
    starInterval;
    maxStarsCount = 1;
    bounceFactor = -0.33;
    maxVelocity = 0.25;
    maxRotation = 2.5;
    size = 40;

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

    verifyBounce = (left, top, hVelocity, vVelocity, size, width, height, bounceFactor) => {
        let values = {
            horizontalVelocity: hVelocity,
            verticalVelocity: vVelocity,
        }
        if (top + hVelocity > height - size) { values.horizontalVelocity *= bounceFactor; }
        if (left + vVelocity > width - size) { values.verticalVelocity *= bounceFactor; }
        if (top + hVelocity < 0) { values.horizontalVelocity *= bounceFactor; }
        if (left + vVelocity < 0) { values.verticalVelocity *= bounceFactor; }
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

        for (let i = 0; i < this.maxStarsCount; i++) {
            if (this.checkCollisions(
                this.size, tempVal.left, tempVal.top,  // tortoise
                this.state.starsArr[i] // star
            )) {
                window.clearInterval(this.starInterval);
                this.placeStar(0)
            }
        }

        Object.assign(tempVal, this.verifyBounce(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity, this.size, this.state.scrWidth, this.state.scrHeight, this.bounceFactor));
        Object.assign(tempVal, this.setPlayerPosition(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
        Object.assign(tempVal, this.setPlayerRotation(tempVal.rotation));
        
        this.setState({...tempVal})
    }

    checkCollisions = (s1, x1, y1, star) => {
        let s2 = star.size;
        let x2 = parseInt(star.left.slice(0, -2));
        let y2 = parseInt(star.top.slice(0, -2));
        let dx = x1 - x2;
        let dy = y1 - y2;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (s1 + s2) * 0.7 ? true : false;
    }
    
    placeStar = (i) => {
        let x = Math.floor(Math.random() * (this.state.scrWidth - 60) + 30);
        let y = Math.floor(Math.random() * (this.state.scrHeight - 60) + 30);
        this.setState(state => {
            const stars = state.starsArr.map((item,j) => {
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
        this.starInterval = window.setInterval(this.moveStar.bind(null, 0), this.props.frameLength);
    }
            
    moveStar = (i) => {
        let left = Number(this.state.starsArr[i].left.slice(0, -2));
        let top = Number(this.state.starsArr[i].top.slice(0, -2));
        let hSpeed = this.state.starsArr[i].hSpeed;
        let vSpeed = this.state.starsArr[i].vSpeed;
        if (left + this.state.starsArr[i].hSpeed <= 0) {
            hSpeed = 0 - this.state.starsArr[i].hSpeed;
        }
        if (left + this.state.starsArr[i].hSpeed > this.state.scrWidth - this.state.starsArr[i].size) {
            hSpeed = 0 - this.state.starsArr[i].hSpeed;
        }
        if (top + this.state.starsArr[i].vSpeed < 0) {
            vSpeed = 0 - this.state.starsArr[i].vSpeed;
        }
        if (top + this.state.starsArr[i].vSpeed > this.state.scrHeight - this.state.starsArr[i].size) {
            vSpeed = 0 - this.state.starsArr[i].vSpeed;
        }
        this.setState(state => {
            const stars = state.starsArr.map((item,j) => {
                if (j === i) {
                    return {
                        ...item, // this.state.starsArr[i]
                        left: (left + hSpeed) + 'px',
                        top: (top + vSpeed) + 'px',
                        vSpeed: vSpeed,
                        hSpeed: hSpeed
                    }
                } else {
                    return item
                }
            })

            return { starsArr: stars}
            // star: {
            //     ...this.state.starsArr[i],
            //     left: (left + hSpeed) + 'px',
            //     top: (top + vSpeed) + 'px',
            //     vSpeed: vSpeed,
            //     hSpeed: hSpeed
            // }
        })
    }

    componentDidMount() {
        this.interval = window.setInterval(this.update, this.props.frameLength);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.starsArr[0].left === '' && this.state.scrHeight && this.state.scrWidth) {
            for (let i = 0; i < this.maxStarsCount; i++) {
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
                        backgroundColor: this.starColors[0]
                }}></div>
            </div>
         );
    }
}
 
export default Tortoise;