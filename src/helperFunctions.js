
let setPlayerPosition = (left, top, hVelocity, vVelocity) => {
    return {
        left: (left + vVelocity),
        top: (top + hVelocity)
    }
}

let setPlayerRotation = (rotation) => {
    let rot = 0 + (rotation % 360);
    if (rotation < -180) { rot = rotation + 360 }
    return rot;
}

let verifyBounce = (tempVal, consts, props) => {
    let { left, top, health } = tempVal;
    let { bounceFactor, tortoiseSize } = consts;
    let { scrWidth, scrHeight } = props;
    let hVelocity = tempVal.horizontalVelocity;
    let vVelocity = tempVal.verticalVelocity;
    let values = {
        horizontalVelocity: hVelocity,
        verticalVelocity: vVelocity,
        health: health
    }
    
    if (top + hVelocity > scrHeight - tortoiseSize / 2 || top + hVelocity < consts.topBarHeight + tortoiseSize / 2) {
        values.health -= Math.abs(parseInt(values.horizontalVelocity));
        values.horizontalVelocity *= bounceFactor;
    }
    if (left + vVelocity > scrWidth - tortoiseSize / 2 || left + vVelocity < 0 + tortoiseSize / 2) {
        values.health -= Math.abs(parseInt(values.verticalVelocity));
        values.verticalVelocity *= bounceFactor;
    }

    return values;
}

let checkObjectsCollisions = (s1, x1, y1, star) => {
    let s2 = star.size;
    let x2 = star.left;
    let y2 = star.top;
    let dx = x1 - x2;
    let dy = y1 - y2;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (s1 + s2) * 0.7 ? true : false;
}

let checkVerticalCollisions = (size, left, top, obst) => {
    if (top - size / 2 > obst.top && top + size / 2 < obst.top + obst.height) { // is between the top and bottom of obstacle?
        if ( obst.left > left - size / 2 && obst.left < left + size / 2 ) { // is "touchin" an obstacle?
            return true
        }
    } else return false
}

let getRandomNumBetweenExcluding = (min1, max1, min2, max2) => {
    return getRandomNumBetween(1, 2) === 1 ? getRandomNumBetween(min1, max1) : getRandomNumBetween(min2, max2)
}

let placeStar = (i, that, size) => {
    let tortoise = that;
    let tmpLeft = tortoise.left || tortoise.props.scrWidth / 2;
    let tmpTop = tortoise.top || tortoise.props.scrHeight / 2;
    if (tmpLeft < size || tmpLeft > tortoise.props.scrWidth - size) tmpLeft = tortoise.props.scrWidth / 2
    if (tmpTop < size || tmpTop > tortoise.props.scrHeight - size) tmpTop = tortoise.props.scrHeight / 2
    let x = getRandomNumBetweenExcluding(size * 2, tmpLeft - size * 2, 
        tmpLeft + size * 2, tortoise.props.scrWidth - size * 2);
    let y = getRandomNumBetweenExcluding(size * 2 + consts.topBarHeight, tmpTop - size * 2,
        tmpTop + size * 2, tortoise.props.scrHeight - size * 2);
    tortoise.setState(state => {
        let stars = state.starsArr.map(item => item);
        stars[i] = {
            size: 20,
            hSpeed: Math.random() * 4 - 2,
            vSpeed: Math.random() * 4 - 2,
            left: x,
            top: y,
            bgColor: getRandomNumBetween(0, consts.starColors.length - 1)
        };
        return {starsArr: stars};
    })
    ++tortoise.starsCount;
    tortoise.starInterval[i] = window.setInterval(moveStar.bind(null, i, tortoise), tortoise.props.frameLength);
}

let moveStar = (i, that) => {
    let tortoise = that
    let star = tortoise.state.starsArr[i];
    let left = parseFloat(star.left);
    let top = parseFloat(star.top);
    let hSpeed = star.hSpeed;
    let vSpeed = star.vSpeed;
    if (left + star.hSpeed <= 0) {
        hSpeed = 0 - star.hSpeed;
    }
    if (left + star.hSpeed > tortoise.props.scrWidth - star.size) {
        hSpeed = 0 - star.hSpeed;
    }
    if (top + star.vSpeed < consts.topBarHeight) {
        vSpeed = 0 - star.vSpeed;
    }
    if (top + star.vSpeed > tortoise.props.scrHeight - star.size) {
        vSpeed = 0 - star.vSpeed;
    }
    tortoise.setState(state => {
        const stars = state.starsArr.map((item, j) => {
            if (j === i) {
                return {
                    ...item,
                    left: (left + hSpeed),
                    top: (top + vSpeed),
                    vSpeed: vSpeed,
                    hSpeed: hSpeed,
                }
            } else { return item }
        })

        return { starsArr: stars }
    })
}

let calculateVelocityAndRotation = (obj, maxRotation) => {
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
    if (values.rotationVelocity > maxRotation) { 
        values.rotationVelocity = maxRotation; // rotation cannot exceed max...
    } else if (values.rotationVelocity < -maxRotation) { 
        values.rotationVelocity = -maxRotation; // ... nor -max
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

let flapsMoving = (obj, keysPressed) => {
    let flap = Object.assign({}, {...obj})
    if (flap.moving === 0) {
        if (keysPressed[flap.key]) {
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

let getRandomNumBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let createObstacles = (arr) => {
    return arr.map(item => {
        return {
            top: item.t,
            left: item.l,
            height: item.h
        };
    })
}
let countAnimatedPoints = (tempVal, star, starColors, addToScore ) => {
    let bonusScore = 0;
    if (tempVal.pointsAnimated.length) {
        let arr = [];
        tempVal.pointsAnimated.forEach(item=> arr.push(item.score))
        bonusScore = arr.reduce((total, score) => total + score, 0)
    }
    let healedPoints = 0;
    let score = parseInt(Math.abs(tempVal.horizontalVelocity) + Math.abs(tempVal.verticalVelocity) + Math.abs(star.hSpeed) + Math.abs(star.vSpeed)) + (starColors.length - star.bgColor) + bonusScore;
    if (star.bgColor < 3) {
        if (tempVal.health < 100) {
            healedPoints = 4 * star.bgColor - 12
            tempVal.health -= healedPoints; // heals 
            score = 0;
        } else {
            addToScore(score * 2); // OR multiples score when 100% healthy
        }
    } else {
        addToScore(score); // OR just scores
    }
    
    return [
        ...tempVal.pointsAnimated,
        {
            score: score,
            bonusScore: bonusScore,
            heal: healedPoints,
            style: {
                left: star.left,
                top: star.top,
                fontSize: 60,
            }
        }
    ]
}

let setObstaclesPositions = (arr) => {
    let scrWidth = window.innerWidth;
    let scrHeight = window.innerHeight;
    
    let ret = arr.map( a => ({
        'l': scrWidth / a[0] * a[1],
        't': scrHeight / a[2] * a[3], 
        'h': scrHeight / a[4], 
    }))
    return ret
}

const arr = [[4,1,4,1,4],[6,4,6,1,6],[5,4,4,3,6],[2,1,3,2,8],[9,8,3,1,6],[5,1,12,8,5],[12,1,8,1,7]
    ,[14,5,4,3,5],[9,7,6,1,4],[2,1,29,3,5],[3,2,9,5,4],[23,2,23,15,3],[48,20,5,1,5]]

const consts = {
    starColors: ['#EF5757', '#e67474', '#DE9079', '#C5DE79', '#C0DA74', '#ADC668', '#9AB15D', '#869D51', '#738846', '#60743A'], //  '#263717'   ////  , '#4D602E' , '#3A4B23', '#354e1f'
    obstaclesAddressesArray: setObstaclesPositions(arr),
    maxStarsCount: 3,
    bounceFactor: -0.33,
    maxVelocity: 0.35,
    maxRotation: 2.5,
    tortoiseSize: 35,
    topBarHeight: 40,
}


export {
    setPlayerPosition, 
    setPlayerRotation, 
    verifyBounce,
    checkObjectsCollisions,
    checkVerticalCollisions,
    placeStar,
    calculateVelocityAndRotation,
    flapsMoving,
    getRandomNumBetween,
    createObstacles,
    countAnimatedPoints,
    setObstaclesPositions,
    arr,
    consts
}