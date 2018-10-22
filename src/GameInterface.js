import React, { Component } from 'react'
import GameCanvas from './components/GameCanvas'
import GameControls from './components/GameControls'

class GameInterface extends Component {
  constructor() {
    super()
    this.state = {

      pointsToWin: 10,
      gameStart: false
    }
  }

  _updateState = (player1, player2, ball) => {
    this.setState({player1: player1, player2: player2, ball: ball})
  }

  _updateBall = (newBall) => {
    this.setState({ball: newBall})
  }

  _updateP1 = (newPlayer) => {
    this.setState({ player1: newPlayer })
  }

  _updateP2 = (newPlayer) => {
    this.setState({ player2: newPlayer })
  }

  _gameStart = () => {
    this.setState({ gameStart: true })
  }

  _changePointsToWin = (value) => {
    this.setState({ pointsToWin: parseInt(value)})
  }

  async _getConfig() {
    const resp = await fetch(
      'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG'
    ).then(data => {
      return data.json()
    })
    //the reply is an object; I'm interested in three child objects.
    //i trust 'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG' to not screw with me.
    //therefore: it is safe to update when the children are not arrays.
    if (!Array.isArray(resp.gameData.paddle1)) {
      //this is a shallow merge. It merges objects but replaces child objects like player1.color => paddle1.color. This is fine.
      //shallow merge player1 and paddle1. Set the result to state.
      this.setState({ player1: { ...this.state.player1, ...resp.gameData.paddle1 } })
      //fix color so that it can be displayed correctly
      this.setState({player1: { ...this.state.player1, color: "#" + this.state.player1.color.hex } })
    }
    if (!Array.isArray(resp.gameData.paddle2)) {
      this.setState({ player2: { ...this.state.player2, ...resp.gameData.paddle2 } })
      this.setState({player2: { ...this.state.player2, color: "#" + this.state.player2.color.hex } })
    }
    if (!Array.isArray(resp.gameData.ball)) {
      this.setState({ ball: { ...this.state.ball, ...resp.gameData.ball } })
      this.setState({ball: { ...this.state.ball, color: "#" + this.state.ball.color.hex } })
    }
    console.log(resp.gameData)
    //last recursively call self after the delay.
    setTimeout(this._getConfig, resp.gameData.newDelay)
  }

  render() {
    //this._getConfig()

    return (
      <main className="gameInterface">
        <section>
          {/* pass the game config fetch'd from the server to the GameCanvas props */}
          <GameCanvas { ...this.state }
                      _updateState = {this._updateState}
                      _updateBall = { this._updateBall } />
          {/* pass state change functions to game controls */}
          <GameControls { ...this.state }
                        _updateP1 = { this._updateP1 }
                        _updateP2 = { this._updateP2 }
                        _updateBall = { this._updateBall }
                        _gameStart = { this._gameStart }
                        _changePointsToWin = { this._changePointsToWin } />
        </section>
      </main>
    )
  }
}

export default GameInterface
