import React, { Component } from 'react';
import './App.css';
import Scene from './containers/Scene/Scene';
import Tortoise from './containers/Tortoise/Tortoise';

class App extends Component {

  state = {
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    rotation: 0,
    keysPressed: {},
    score: 0,
    health: 100,
    gameState: 'start'
  }
  frameLength = 16;

  checkWindowSize = () => {
    this.setState({
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight
    })
  }

  addToScore = (add) => {
    this.setState({ score: this.state.score + add })
  }

  updateHealth = (change) => {
    if (this.state.health - change >= 100) {
      this.setState({
        health: 100
      })
    } else if (this.state.health - change * 2 > 0) {
      this.setState({
        health: this.state.health - change * 2,
      })
    } else {
      this.changeGameState('over')
    }
  }

  changeGameState = (text) => {
    let newState = {
      gameState: text
    }
    if (text === 'game') {
      Object.assign(newState, {
        rotation: 0,
        keysPressed: {},
        score: 0,
        health: 100,
      })
    }
    if (text === 'over') { localStorage['hiscore'] = Math.max(this.state.score, localStorage['hiscore']) }
    this.setState({ ...newState })
  }

  componentDidMount() {
    document.onkeyup = (e) => {
      const keys = {...this.state.keysPressed};
      delete keys[e.key];
      this.setState({ keysPressed: keys })
    }
    document.onkeydown = (e) => {
      const keys = {
        ...this.state.keysPressed,
        [e.key]: 1
      }
      this.setState({ keysPressed: keys })
    }
  }

  render() {
    return ( 
      <div>
        <Scene width={this.state.windowInnerWidth}
          height={this.state.windowInnerHeight}
          backgroundColor="#132f4c"
          health={this.state.health}
          score={this.state.score}
          gameState={this.state.gameState}
          changeGameState={this.changeGameState}
        />
        <Tortoise scrWidth={this.state.windowInnerWidth}
          scrHeight={this.state.windowInnerHeight}
          rotation={this.state.rotation}
          keysPressed={this.state.keysPressed}
          frameLength={this.frameLength}
          checkWindowSize={this.checkWindowSize}
          addToScore={this.addToScore}
          updateHealth={this.updateHealth}
          health={this.state.health}
          gameState={this.state.gameState}
        />
      </div>
  );
}
}

export default App;