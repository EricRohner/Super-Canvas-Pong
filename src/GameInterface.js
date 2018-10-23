import React, { Component } from 'react'
import GameCanvas from './components/GameCanvas'
import GameControls from './components/GameControls'

class GameInterface extends Component {
  constructor() {
    super()
    this.state = {
      player1: {},
      player2: {},
      ball: {},
      pointsToWin: 10,
      gameStart: false,
      reset: false
    }
  }

// get configuration from the server
// we only want to call our recursive getConfiguration function once so put it in componentDidMount
  componentDidMount() {
    this._getConfig()
  }

  _getConfig = async () => {
    const response = await fetch(
      'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG'
    ).then(data => {
      return data.json()
    })
    //i could validate but I trust the server so a simple !array test tells me if important info is coming in or not
    if (!Array.isArray(response.gameData.paddle1)) {
      //shallow merge player1 and paddle1. Set the result to state.
      this.setState({ player1: { ...this.state.player1, ...response.gameData.paddle1 } })
      //fix color so that it can be displayed without any further logic unless it's already a string
      if (typeof(this.state.player1.color !== "string")) {
        this.setState({ player1: { ...this.state.player1, color: '#' + this.state.player1.color.hex } })
      }
    }
    if (!Array.isArray(response.gameData.paddle2)) {
      this.setState({ player2: { ...this.state.player2, ...response.gameData.paddle2 } })
      if (typeof(this.state.player2.color !== "string")) {
        this.setState({ player2: { ...this.state.player2, color: '#' + this.state.player2.color.hex } })
      }
    }
    if (!Array.isArray(response.gameData.ball)) {
      this.setState({ ball: { ...this.state.ball, ...response.gameData.ball } })
      if (typeof(this.state.ball.color !== "string")) {
        this.setState({ ball: { ...this.state.ball, color: '#' + this.state.ball.color.hex } })
      }
    }
    setTimeout(this._getConfig, response.gameData.newDelay)
  }

  // this state is used to reset the game
  _toggleReset = () => {
    this.setState({ reset: !this.state.reset })
    console.log(this.state.reset)
  }

  // this function is our workhorse. It takes the three most used state objects and writes them to state.
  // it will be used a lot in GameControls and GameCanvas.
  _updateState = (player1, player2, ball) => {
    this.setState({ player1: player1, player2: player2, ball: ball })
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
          {/* pass the game config fetched from the server and _updateState callback function to the GameCanvas props */}
          <GameCanvas {...this.state}
                      _toggleReset={this._toggleReset}
                      _updateState={this._updateState}
                      _changeGameStart={this._changeGameStart} />
          {/* pass state change callback functions to game controls */}
          <GameControls {...this.state}
                        _toggleReset={this._toggleReset}
                        _updateState={this._updateState}
                        _changeGameStart={this._changeGameStart}
                        _changePointsToWin={this._changePointsToWin} />
        </section>
      </main>
    )
  }
}

export default GameInterface
