import React, { Component } from "react";

class GameControls extends Component {

  // expect an incoming value string. Convert it to hex and add padding 0 if appropriate
  _intToHex = (value) => {
    let str = parseInt(value).toString(16)
    if (str.length < 2) {
      str = "0" + str
    }
    return str
  }

  _changeP1Red = ( value ) => {
    const red = this._intToHex(value)
    return{ ...this.props.player1, color: `#${red}${this.props.player1.color.substring( 3, 7 )}` } }

  //incoming value will be a string so parseInt to not break things, make sure to retain sign of previous value
  _changeBallVelocity = ( value ) => {
    if(this.props.ball.velocityX > 0) {
      return{ ...this.props.ball, velocityX: parseInt( value ) }
    } else {
      return{ ...this.props.ball, velocityX: parseInt( value ) * -1 }
    }
  }

  render() {
    return (
      <main className="controlBody">
        <section className="top">
          <p onClick={this.props._gameStart}>Start Game</p>
          <label htmlFor="pointsToWin">Points to win: </label>
          <input className="pointsToWin" />
          <label htmlFor="ballVelocity">Ball Velocity: </label>
          <input className="ballVelocity" onChange={(e) => this.props._updateBall(this._changeBallVelocity(e.target.value))} type="range" min="1"
                 max="3" />
        </section>
        <section>
          <label htmlFor="P1Red">P1 red: </label>
          <input className="P1Red" onChange={(e) => this.props._updateP1(this._changeP1Red(e.target.value))} type="range" min="0" max="255" />
          <label htmlFor="P1Green">P1 green: </label>
          <input className="P1Green" type="range" min="0" max="255" />
          <label htmlFor="P1Blue">P1 blue: </label>
          <input className="P1Blue" type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="P2Red">P2 red: </label>
          <input className="P2Red" type="range" min="0" max="255" />
          <label htmlFor="P2Green">P2 green: </label>
          <input className="P2Green" type="range" min="0" max="255" />
          <label htmlFor="P2Blue">P2 blue: </label>
          <input className="P2Blue" type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="ballRed">Ball red: </label>
          <input className="ballRed" type="range" min="0" max="255" />
          <label htmlFor="ballGreen">Ball green: </label>
          <input className="ballGreen" type="range" min="0" max="255" />
          <label htmlFor="ballBlue">Ball blue: </label>
          <input className="ballBlue" type="range" min="0" max="255" />
        </section>
        <section>
          <label htmlFor="ballType">Round Ball</label>
          <input className="ballType" type="checkbox" />
        </section>
      </main>
    );
  };
}

export default GameControls;
