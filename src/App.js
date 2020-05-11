import React, {Component} from 'react';
// import './App.css';
import Scene from './containers/Scene/Scene';
import Tortoise from './containers/Tortoise/Tortoise';

class App extends Component {

  state= {
    left: '200px',
    top: '590px',
    rotation: 0,
    keysPressed: {},
  }

  changeScreenSize = () => {
    this.setState({
      windowInnerWidth: window.innerWidth + 'px',
      windowInnerHeight: window.innerHeight + 'px'
    })
  }
  componentDidMount() {
    document.onkeyup = (e) => {
      const keys = {...this.state.keysPressed};
      delete keys[e.key];
      this.setState({ keysPressed: keys })
    }
    document.onkeydown = (e) =>  {
      const keys = {
        ...this.state.keysPressed,
        [e.key] : 1
      }
      this.setState({ keysPressed: keys })
    }
    
    window.onresize = () => this.changeScreenSize();
    this.changeScreenSize();
  }

  render() {
    return (
      <div>
        <Scene width={this.state.windowInnerWidth} 
          height={this.state.windowInnerHeight} 
          backgroundColor="#444" />
        <Tortoise 
          width={this.state.windowInnerWidth} 
          height={this.state.windowInnerHeight}
          left={this.state.left} 
          top={this.state.top}
          rotation={this.state.rotation}
          keysPressed={this.state.keysPressed}
        />
      </div>
    );
  }
}

export default App;
