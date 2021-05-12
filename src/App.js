import React, { Component } from 'react';
import './App.css';
import Scene from './containers/Scene/Scene';
import Tortoise from './containers/Tortoise/Tortoise';
import { obstaclesInfo } from './helperFunctions';
import { sounds } from '../src/assetsImports';

class App extends Component {

  state = {
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    gameState: 'start'
  }
  frameLength = 16;
  
  resetThisState = () => {
    this.setState({
      rotation: 0,
      keysPressed: {},
      score: 0,
      health: 100,
      maxObstaclesNum: obstaclesInfo.length,
    })
  }

  checkWindowSize = () => {
    this.setState({
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight
    })
  }

  addToScore = (add) => {
    sounds.collectSound.play();
    let obstaclesVisible = Math.floor((this.state.score + add) / 50);
    if (obstaclesVisible > 13) obstaclesVisible = 13;
    this.setState({ 
      score: this.state.score + add,
      maxObstaclesNum: obstaclesVisible
    })
  }

  updateHealth = (change) => {
    if (this.state.health - change >= 100) {
      this.setState({
        health: 100,
      })
    } else if (this.state.health - change * 2 > 0) {
      if (change < 0) {
        sounds.healSound.play();
      } else {
        if (change > 3) {
          sounds.hit03Sound.play();
        } else if (change > 2) {
          sounds.hit02Sound.play();
        } else {
          sounds.hit01Sound.play();
        }
      }
      this.setState({
        health: this.state.health - change * 2,
      })
    } else {
      this.changeGameState('over');
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
        maxObstaclesNum: 0,
      })
    }
    if (text === 'over') { localStorage['hiscore'] = Math.max(this.state.score, localStorage['hiscore']) }
    this.setState({ ...newState });
  }

  componentDidMount() {
    this.resetThisState();
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
    // sounds.bgmusic.play();
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
          maxObstaclesNum={this.state.maxObstaclesNum}
          gameState={this.state.gameState}
        />
      </div>
    );
  }
}

export default App;