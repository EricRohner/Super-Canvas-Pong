import React, { Component } from 'react'
import GameCanvas from './components/GameCanvas'
import GameControls from './components/GameControls'

class GameInterface extends Component {
  constructor() {
    super()
    this._getConfig = this._getConfig.bind(this)
    this.state = {
      player1: {
        width: 15,
        height: 80,
        color: {
          hex: 'ffffff',
          rgb: {
            b: 255,
            g: 255,
            r: 255,
          }
        },
        velocityY: 1,
      },

      player2: {
        width: 15,
        height: 80,
        color: {
          hex: 'ffffff',
          rgb: {
            b: 255,
            g: 255,
            r: 255,
          }
        },
        velocityY: 1,
      },

      ball: {
        width: 15,
        height: 80,
        color: {
          hex: 'ff0000',
          rgb: {
            b: 255,
            g: 0,
            r: 0,
          }
        },
        velocityY: 1,
        velocityX: 1,
      },

    }
  }

  changeBallVelocity = (value) => {
    this.setState({ball: { ...this.state.ball, velocityX: parseInt(value) } })
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
   // this._getConfig()

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
          {/*pass the game config fetch'd from the serve  r to the GameCanvas props*/}
          <GameCanvas {...this.state} />
          <GameControls changeBallVelocity = {this.changeBallVelocity}/>
        </section>
      </main>
    )
  }
}

export default GameInterface
