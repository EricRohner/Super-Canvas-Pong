import React, { Component } from 'react'

class GameControls extends Component {

  // expect an incoming value string. Convert it to hex and add a padding 0 if appropriate
  _intToHex = (value) => {
    let str = parseInt(value).toString(16)
    if (str.length < 2) str = '0' + str
    return str
  }

  // return a new player (or ball) object updated with the red value (0-255)
  _changeRed = (value, player) => {
    const red = this._intToHex(value)
    return { ...player, color: `#${red}${player.color.substring(3, 7)}` }
  }

  _changeGreen = (value, player) => {
    const green = this._intToHex(value)
    return { ...player, color: `${player.color.substring(0, 3)}${green}${player.color.substring(5, 7)}` }
  }

  _changeBlue = (value, player) => {
    const blue = this._intToHex(value)
    return { ...player, color: `${player.color.substring(0, 5)}${blue}` }
  }

  // incoming value will be a string so parseInt to not break things, make sure to retain sign of previous value
  _changeBallVelocity = (value) => {
    if (this.props.ball.velocityX > 0) {
      return { ...this.props.ball, velocityX: parseInt(value) }
    } else {
      return { ...this.props.ball, velocityX: parseInt(value) * -1 }
    }
  }

  render() {
    return (
      <main className="controlBody">
        <section className="top">
          <p onClick= {this.props._changeGameStart}>Start/Pause</p>
          <p onClick= {this.props._toggleReset}>Reset</p>
          <label htmlFor="pointsToWin"> Points to win: </label>
          <input className="pointsToWin" onChange={(e) => this.props._changePointsToWin(e.target.value)} />
          <label htmlFor="ballVelocity"> Ball Velocity: </label>
          <input className="ballVelocity"
                 onChange={(e) => this.props._updateBall(this._changeBallVelocity(e.target.value))}
                 type="range" min="1" max="3" />
        </section>
        <section>
          <label htmlFor="P1Red">P1 red: </label>
          <input className="P1Red"
                 onChange={(e) => this.props._updateP1(this._changeRed(e.target.value, this.props.player1))}
                 type="range" min="0" max="255" />
          <label htmlFor="P1Green">P1 green: </label>
          <input className="P1Green"
                 onChange={(e) => this.props._updateP1(this._changeGreen(e.target.value, this.props.player1))}
                 type="range" min="0" max="255" />
          <label htmlFor="P1Blue">P1 blue: </label>
          <input className="P1Blue"
                 onChange={(e) => this.props._updateP1(this._changeBlue(e.target.value, this.props.player1))}
                 type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="P2Red">P2 red: </label>
          <input className="P2Red"
                 onChange={(e) => this.props._updateP2(this._changeRed(e.target.value, this.props.player2))}
                 type="range" min="0" max="255" />
          <label htmlFor="P2Green">P2 green: </label>
          <input className="P2Green"
                 onChange={(e) => this.props._updateP2(this._changeGreen(e.target.value, this.props.player2))}
                 type="range" min="0" max="255" />
          <label htmlFor="P2Blue">P2 blue: </label>
          <input className="P2Blue"
                 onChange={(e) => this.props._updateP2(this._changeBlue(e.target.value, this.props.player2))}
                 type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="ballRed">Ball red: </label>
          <input className="ballRed"
                 onChange={(e) => this.props._updateBall(this._changeRed(e.target.value, this.props.ball))}
                 type="range" min="0" max="255" />
          <label htmlFor="ballGreen">Ball green: </label>
          <input className="ballGreen"
                 onChange={(e) => this.props._updateBall(this._changeGreen(e.target.value, this.props.ball))}
                 type="range" min="0" max="255" />
          <label htmlFor="ballBlue">Ball blue: </label>
          <input className="ballBlue"
                 onChange={(e) => this.props._updateBall(this._changeBlue(e.target.value, this.props.ball))}
                 type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="ai">Enable AI</label>
          <input className="ai" onClick={this.props._toggleAi} type="checkbox" />
        </section>
      </main>
    )
  }
}

export default GameControls
