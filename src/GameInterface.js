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
      gameStart: false
    }
  }

//we only want to call our getConfig function once since it's recursive.
  async componentDidMount() {
    await this._getConfig()
  }

  _getConfig = async () => {
    const response = await fetch(
      'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG'
    ).then(data => {
      return data.json();
    });
    //the reply is an object; I'm interested in three child objects.
    //i trust 'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG' to not screw with me.
    //therefore: it is safe to update when the children are not arrays.
    if (!Array.isArray(response.gameData.paddle1)) {
      //this is a shallow merge. It merges objects but replaces child objects Ex: player1.color => paddle1.color. This is fine.
      //shallow merge player1 and paddle1. Set the result to state.
      this.setState({ player1: { ...this.state.player1, ...response.gameData.paddle1 } })
      //fix color so that it can be displayed without any further logic
      this.setState({player1: { ...this.state.player1, color: "#" + this.state.player1.color.hex } })
    }
    if (!Array.isArray(response.gameData.paddle2)) {
      this.setState({player2: { ...this.state.player2, ...response.gameData.paddle2 } })
      this.setState({player2: { ...this.state.player2, color: "#" + this.state.player2.color.hex } })
    }
    if (!Array.isArray(response.gameData.ball)) {
      this.setState({ ball: { ...this.state.ball, ...response.gameData.ball } })
      this.setState({ ball: { ...this.state.ball, color: "#" + this.state.ball.color.hex } })
    }
    console.log(response.gameData.newDelay);
    setTimeout(this._getConfig, response.gameData.newDelay);
  };

  _updateState = (player1, player2, ball) => {
    this.setState({player1: player1, player2: player2, ball: ball})
  }

  _gameStart = () => {
    this.setState({ gameStart: true })
  }

  _changePointsToWin = (value) => {
    this.setState({ pointsToWin: parseInt(value)})
  }

  render() {
    return (
      <main className="gameInterface">
        <section>
          {/* pass the game config fetch'd from the server to the GameCanvas props */}
          <GameCanvas { ...this.state }
                      _updateState = {this._updateState} />
          {/* pass state change functions to game controls */}
          <GameControls { ...this.state }
                        _updateState = { this._updateState }
                        _gameStart = { this._gameStart }
                        _changePointsToWin = { this._changePointsToWin } />
        </section>
      </main>
    )
  }
}

export default GameInterface
