import React, { Component } from 'react';
import styles from './Tortoise.module.css';

import {
    setPlayerPosition,
    setPlayerRotation,
    verifyBounce,
    checkObjectsCollisions,
    checkVerticalCollisions,
    placeStar,
    calculateVelocityAndRotation,
    flapsMoving,
    createObstacles,
    countAnimatedPoints,
    setObstaclesPositions,
    obstaclesInfo,
    consts
} from '../../helperFunctions';

class Tortoise extends Component {
    state = {
        starsArr: [],
        obstaclesArr: createObstacles(consts.obstaclesAddressesArray, consts.topBarHeight, this.props.scrWidth, this.props.scrHeight),
        leftFlap: {
            transform: '',
        },
        rightFlap: {
            transform: '',
        },
        head: '-10px',
        rotationVelocity: 0,
    }
    starInterval = [];

    tmOut;

    resetThisState = () => {
        this.setState({
            rearRightTransform: '',
            rearLeftTransform: '',
            left: this.props.scrWidth / 2, // tortoise horiz. position
            top: this.props.scrHeight / 2, // tortoise vert. position
            rotation: 0,
            horizontalVelocity: 0,
            verticalVelocity: 0,
            health: this.props.health,
            pointsAnimated: [],
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
            head: '-10px',
            rotationVelocity: 0, 
            healthChange: 0
        })
    }

    update = () => {
        if (this.props.gameState === 'game') {
            let tempVal = {
                leftFlap: {...this.state.leftFlap},
                rightFlap: {...this.state.rightFlap},
                rearLeftTransform: "rotate(-20deg)", // starting position
                rearRightTransform: "rotate(20deg)",
                top: this.state.top,
                left: this.state.left,
                rotation: this.state.rotation + 0,
                rotationVelocity: this.state.rotationVelocity,
                head: '-10px',
                health: this.state.health,
                pointsAnimated: this.state.pointsAnimated,
                healthChange: 0
            }

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
                let star = this.state.starsArr[i];
                if (checkObjectsCollisions(
                    consts.tortoiseSize, tempVal.left, tempVal.top,  // tortoise
                    star // star
                )) {
                    tempVal.pointsAnimated = countAnimatedPoints(tempVal, star, consts.starColors, this.props.addToScore)
                    window.clearInterval(this.starInterval[i]);
                    placeStar(i, this, consts.tortoiseSize)
                }
            }

            for (let i = 0; i < this.props.maxObstaclesNum; i++) { // state.obstaclesArr.length
                if (checkVerticalCollisions(consts.tortoiseSize, tempVal.left, tempVal.top, this.state.obstaclesArr[i])) {
                    tempVal.health -= 1;
                }
            }

            if (this.props.keysPressed['w']) { 
                tempVal.head = '-20px'; 
                tempVal.horizontalVelocity *= 1.005;
                tempVal.verticalVelocity *= 1.005;
            }

            Object.assign(tempVal, verifyBounce(tempVal, consts, this.props));
            Object.assign(tempVal, setPlayerPosition(tempVal.left, tempVal.top, tempVal.horizontalVelocity, tempVal.verticalVelocity));
            Object.assign(tempVal, setPlayerRotation(tempVal.rotation));

            let healthChange;
            if (this.state.health) {
                healthChange = this.state.health - tempVal.health
            }

            if (tempVal.pointsAnimated) {
                tempVal.pointsAnimated = tempVal.pointsAnimated.map( item => {
                    let fs = item.style.fontSize;
                    let colorValues = '36, 91, 150,'
                    if (item.heal) { colorValues = '68, 152, 27,' }
                    if (fs < 300) {
                        return {
                            ...item,
                            style: {
                                ...item.style,
                                fontSize: (fs + 2),
                                color: `rgba(${colorValues} 0.${999 - fs * 3})`
                            }
                        }
                    } else return ''
                }).filter(item => item !== '')
            }

            if (healthChange && healthChange !== 0) {
                tempVal.healthChange = healthChange;
                this.props.updateHealth(healthChange)
            }
            this.setState({...tempVal})
        }
    }

    componentDidMount() {
        this.resetThisState();
        window.onresize = () => {
            this.props.checkWindowSize();
            consts.obstaclesAddressesArray = setObstaclesPositions(obstaclesInfo);
            this.setState({obstaclesArr: createObstacles(consts.obstaclesAddressesArray, consts.topBarHeight, this.props.scrWidth, this.props.scrHeight)})
        }
        this.interval = window.setInterval(this.update, this.props.frameLength);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.gameState === 'start' && this.props.gameState === 'game') {
            this.resetThisState();
        }
        if (this.state.starsArr.length < consts.maxStarsCount) {
            placeStar(this.state.starsArr.length, this, consts.tortoiseSize);
        }
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
        window.clearInterval(this.starInterval);
    }

    render() { 
        let healthChangeIndicator;
        if (this.state.healthChange !== 0 && this.state.top) {
            let bgColor = this.state.healthChange > 0 ? '#e338' : '#3f38';
            healthChangeIndicator = <div id={styles.healthIndicator}
                style={{
                    backgroundColor: bgColor,
                    top: this.state.top - consts.tortoiseSize,
                    left: this.state.left - consts.tortoiseSize
                }}
            />
        }

        let stars = this.state.starsArr.map((item, i) => 
            <div className={styles.star} key={i}
                style={{
                    left: item.left,
                    top: item.top,
                    backgroundColor: consts.starColors[item.bgColor]
                }}>
            </div>
        )
        let obstacles = [];
        for (let i = 0; i < this.props.maxObstaclesNum; i++) {
            let item = this.state.obstaclesArr[i];
            obstacles.push(
                <div className={styles.obstacle} key={i}
                style={{
                    left: item.left,
                    top: item.top,
                    height: item.height
                }}/>
            )
        } 
        let pointsAnimated = '';
        if (this.state.pointsAnimated) {
            pointsAnimated = this.state.pointsAnimated.map((item,i) => {
                let bonus = item.bonusScore === 0 ? '' : `+${item.bonusScore}`
                return <div className={styles.pointsAnimated} key={i} style={item.style}>{item.score}{bonus}</div> 
            })
        }

        return ( 
            <div>
                { stars }
                { healthChangeIndicator }
                <div id={styles.Tortoise} 
                    style = {{
                        left: this.state.left,
                        top: this.state.top,
                        transform: `translate(-50%, -50%) rotate(${this.state.rotation}deg)`
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
                { obstacles }
                { pointsAnimated }
            </div>
         );
        }
    }

export default Tortoise;