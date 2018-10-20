import React, { Component } from 'react'

import GameCanvas from './components/GameCanvas'
import GameControls from './components/GameControls'

class GameInterface extends Component {
  constructor() {
    super()
    this._getConfig = this._getConfig.bind(this)
    this.state = {
      player1Width: 15,
      player1Height: 40,
      player1R: 255,
      player1G: 255,
      player1B: 255,
      player1VelocityY: 1,

      player2Width: 15,
      player2Height: 40,
      player2R: 255,
      player2G: 255,
      player2B: 255,
      player2VelocityY: 1,

      ballWidth: 15,
      ballHeight: 15,
      ballR: 255,
      ballG: 255,
      ballB: 255,
      ballVelocityY: 1,
      ballVelocityX: 1,
    }
  }

  //

  async _getConfig() {
    const resp = await fetch(
      'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG'
    ).then(data => {
      return data.json()
    })
    if (resp.gameData.paddle1.width !== undefined) {
      this.setState({player1Width: resp.gameData.paddle1.width})
      console.log(this.state.player1Width)
    }
    if (resp.gameData.paddle1.height !== undefined) {
      this.setState({player1Height: resp.gameData.paddle1.height})
      console.log(this.state.player1Height)
    }
    if (resp.gameData.paddle2.width !== undefined) {
      this.setState({player2Width: resp.gameData.paddle2.width})
      console.log(this.state.player2Width)
    }
    if (resp.gameData.paddle2.height !== undefined) {
      this.setState({player2Height: resp.gameData.paddle2.height})
      console.log(this.state.player2Height)
    }
    console.log(resp.gameData)
    setTimeout(this._getConfig, resp.gameData.newDelay)
  }

  render() {
    this._getConfig()

    return (
      <main
        style={{
          width: '100vw',
          height: '100vh',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <GameCanvas {...this.state} />
          <GameControls />
        </section>
      </main>
    )
  }
}

export default GameInterface
