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
  }
  frameLength = 16;

  checkWindowSize = () => {
    this.setState({
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight
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
    return ( 
      <div>
        <Scene width={this.state.windowInnerWidth + 'px'}
          height={this.state.windowInnerHeight + 'px'}
          backgroundColor="#444" 
        />
        <Tortoise scrWidth={this.state.windowInnerWidth}
          scrHeight={this.state.windowInnerHeight}
          rotation={this.state.rotation}
          keysPressed={this.state.keysPressed}
          frameLength={this.frameLength}
          checkWindowSize={this.checkWindowSize}
        />
      </div>
  );
}
}

export default App;