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
    tortoise: {
      left: 0,
      top: 0, 
    },
    score: 0,
    health: 100,
    healthBarWidth: window.innerWidth / 2,
    healthBarColor: '#26f12680',
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
    this.setState({
      healthBarWidth: this.state.healthBarWidth - change,

    })
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
    this.checkWindowSize();
  }

  render() {
    let style = {
      width: this.state.healthBarWidth + 'px',
      left: ((this.state.windowInnerWidth - this.state.healthBarWidth) / 2) + 'px',
      backgroundColor: this.state.healthBarColor
    }
    return ( 
      <div>
        <Scene width={this.state.windowInnerWidth + 'px'}
          height={this.state.windowInnerHeight + 'px'}
          backgroundColor="#132f4c"
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
        />
        <div id="healthbar" style={style}></div>
        <div className="score">Score: <span id="score">{this.state.score}</span></div>
      </div>
  );
}
}

export default App;