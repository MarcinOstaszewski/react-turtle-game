import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Scene from './containers/Scene/Scene';
import Tortoise from './containers/Tortoise/Tortoise';
import Start from './components/Start/Start';
import GameOver from './components/GameOver/GameOver';
import history from './components/history';

class App extends Component {
  state = {
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    rotation: 0,
    keysPressed: {},
    score: 0,
    health: 10,
    isGameOn: true
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
    console.log(history)
    if (this.state.health - change >= 0) {
      this.setState({
        health: this.state.health - change * 3,
      })
    } else {
      this.setState({
        health: 0,
        isGameOn: false,
        gameOver: <GameOver score={this.state.score}/>
      })
      history.push('/gameover')
      history.go();
    }
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
      <BrowserRouter>
        <div>
          <Scene width={this.state.windowInnerWidth}
            height={this.state.windowInnerHeight}
            backgroundColor="#132f4c"
            health={this.state.health}
            score={this.state.score}
          />
          <Switch>
            <Route path="/start" component={Start} />
            <Route path="/gameon" render={()=>
              <Tortoise scrWidth={this.state.windowInnerWidth}
                scrHeight={this.state.windowInnerHeight}
                rotation={this.state.rotation}
                keysPressed={this.state.keysPressed}
                frameLength={this.frameLength}
                checkWindowSize={this.checkWindowSize}
                addToScore={this.addToScore}
                updateHealth={this.updateHealth}
                health={this.state.health}
                isGameOn={this.state.isGameOn}
              />
            }>
            </Route>
            <Route path="/gameover" render={() => 
              this.state.gameOver
            }/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;