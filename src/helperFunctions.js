
let setPlayerPosition = (left, top, hVelocity, vVelocity) => {
    return {
        left: (left + vVelocity) + "px",
        top: (top + hVelocity) + "px"
    }
}

let setPlayerRotation = (rotation) => {
    let rot = 0 + (rotation % 360);
    if (rotation < -180) { rot = rotation + 360 }
    return rot;
}

let verifyBounce = (left, top, hVelocity, vVelocity, size, width, height, bounceFactor) => {
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

let checkCollisions = (s1, x1, y1, star) => {
    let s2 = star.size;
    let x2 = parseInt(star.left.slice(0, -2));
    let y2 = parseInt(star.top.slice(0, -2));
    let dx = x1 - x2;
    let dy = y1 - y2;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (s1 + s2) * 0.7 ? true : false;
}

let placeStar = (i, that) => {
    let tortoise = that;
    let x = Math.floor(Math.random() * (tortoise.state.scrWidth - 60) + 30);
    let y = Math.floor(Math.random() * (tortoise.state.scrHeight - 60) + 30);
    tortoise.setState(state => {
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
    tortoise.starInterval = window.setInterval(moveStar.bind(null, i, tortoise), tortoise.props.frameLength);
}

let moveStar = (i, that) => {
    let tortoise = that
    let left = Number(tortoise.state.starsArr[i].left.slice(0, -2));
    let top = Number(tortoise.state.starsArr[i].top.slice(0, -2));
    let hSpeed = tortoise.state.starsArr[i].hSpeed;
    let vSpeed = tortoise.state.starsArr[i].vSpeed;
    if (left + tortoise.state.starsArr[i].hSpeed <= 0) {
        hSpeed = 0 - tortoise.state.starsArr[i].hSpeed;
    }
    if (left + tortoise.state.starsArr[i].hSpeed > tortoise.state.scrWidth - tortoise.state.starsArr[i].size) {
        hSpeed = 0 - tortoise.state.starsArr[i].hSpeed;
    }
    if (top + tortoise.state.starsArr[i].vSpeed < 0) {
        vSpeed = 0 - tortoise.state.starsArr[i].vSpeed;
    }
    if (top + tortoise.state.starsArr[i].vSpeed > tortoise.state.scrHeight - tortoise.state.starsArr[i].size) {
        vSpeed = 0 - tortoise.state.starsArr[i].vSpeed;
    }
    tortoise.setState(state => {
        const stars = state.starsArr.map((item, j) => {
            if (j === i) {
                return {
                    ...item,
                    left: (left + hSpeed) + 'px',
                    top: (top + vSpeed) + 'px',
                    vSpeed: vSpeed,
                    hSpeed: hSpeed
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

let consts = {
    starColors: ['#C5DE79', '#C0DA74', '#ADC668', '#9AB15D', '#869D51', '#738846', '#60743A', '#4D602E', '#3A4B23', '#263717'],
    maxStarsCount: 1,
    bounceFactor: -0.33,
    maxVelocity: 0.25,
    maxRotation: 2.5,
    tortoiseSize: 40,
}


export {
    setPlayerPosition, 
    setPlayerRotation, 
    verifyBounce,
    checkCollisions,
    placeStar,
    // moveStar,
    calculateVelocityAndRotation,
    flapsMoving,
    consts
}