import React, { Component } from 'react'
import GameCanvas from './components/GameCanvas'
import GameControls from './components/GameControls'

// It's important to lift state to one single component to avoid state bloat and to have a single source of truth
// some components keep local variables but the important things stay in state here. Child components modify state
// with callback functions that are passed down in props.

class GameInterface extends Component {
  constructor() {
    super()
    this.state = {
      player1: {},
      player2: {},
      ball: {},
      pointsToWin: 10,
      gameStart: false,
      reset: false,
      ai: false
    }
  }

// get configuration from the server
// we only want to call our recursive getConfiguration function once so put it in componentDidMount
  componentDidMount() {
    this._getConfig()
  }

  // it's important that this function be asynchronous because we don't know how long the server will take to respond.
  // this function pulls down data from the server and updates state accordingly.
  _getConfig = async () => {
    const response = await fetch(
      'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG'
    ).then(data => {
      return data.json()
    })
    // i could validate more but I trust the server so a simple !array test tells me if important data is coming in or not
    if (!Array.isArray(response.gameData.paddle1)) {
      //shallow merge player1 and paddle1. Set the result to state.
      this.setState({ player1: { ...this.state.player1, ...response.gameData.paddle1 } })
      // fix color so that it can be displayed without any further logic unless it's a string meaning we already did so
      if (typeof(this.state.player1.color) !== 'string') {
        this.setState({ player1: { ...this.state.player1, color: '#' + this.state.player1.color.hex } })
      }
    }
    if (!Array.isArray(response.gameData.paddle2)) {
      this.setState({ player2: { ...this.state.player2, ...response.gameData.paddle2 } })
      if (typeof(this.state.player2.color) !== 'string') {
        this.setState({ player2: { ...this.state.player2, color: '#' + this.state.player2.color.hex } })
      }
    }
    if (!Array.isArray(response.gameData.ball)) {
      this.setState({ ball: { ...this.state.ball, ...response.gameData.ball } })
      if (typeof(this.state.ball.color) !== 'string') {
        this.setState({ ball: { ...this.state.ball, color: '#' + this.state.ball.color.hex } })
      }
    }
    setTimeout(this._getConfig, response.gameData.newDelay)
  }
  // this updates the three most used state variables all at once
  _updateState = (player1, player2, ball) => {
    this.setState({ player1: player1, player2: player2, ball: ball })
  }
  // the next three functions update state for only for one of the three. technically I could use _updateState
  // since everything's available through props but the code in gameControls is much easier to read this way.
  _updateP1 = (player1) => {
    this.setState({ player1: player1 })
  }
  _updateP2 = (player2) => {
    this.setState({ player2: player2 })
  }
  _updateBall = (ball) => {
    this.setState({ ball: ball })
  }
  // this state is used to reset the game
  _toggleReset = () => {
    this.setState({ reset: !this.state.reset })
    console.log(this.state.reset)
  }
  // this state variable is used to turn the ai on and off
  _toggleAi = () => {
    this.setState({ ai: !this.state.ai })
  }
  // this function could be folded into _updateState but since gameStart is only changed in three places, it's simpler not to.
  _changeGameStart = () => {
    this.setState({ gameStart: !this.state.gameStart })
  }
  // this function could be folded into _updateState but since pointsToWin is only changed in one place, it's simpler not to.
  _changePointsToWin = (value) => {
    // validate that the input is a positive number.
    if (!isNaN(parseInt(value)) && parseInt(value) > 0) {
      this.setState({ pointsToWin: parseInt(value) })
    }
  }

  render() {
    return (
      <main className="gameInterface">
        <section>
          {/* pass the game config fetched from the server and callback functions to the GameCanvas props */}
          <GameCanvas {...this.state}
                      _toggleReset={this._toggleReset}
                      _updateState={this._updateState}
                      _changeGameStart={this._changeGameStart} />
          {/* pass state change callback functions to game controls */}
          <GameControls {...this.state}
                        _updateP1={this._updateP1}
                        _updateP2={this._updateP2}
                        _updateBall={this._updateBall}
                        _toggleAi={this._toggleAi}
                        _toggleReset={this._toggleReset}
                        _changeGameStart={this._changeGameStart}
                        _changePointsToWin={this._changePointsToWin} />
        </section>
      </main>
    )
  }
}

export default GameInterface
