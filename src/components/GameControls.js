import React, { Component } from "react";

class GameControls extends Component {


  render() {
    return (
      <main className="controlBody">
        <section className="top">
          <p onClick={this.props._gameStart}>Start Game</p>
          <label htmlFor="pointsToWin">Points to win: </label>
          <input className="pointsToWin" />
          <label htmlFor="ballVelocity">Ball Velocity: </label>
          <input className="ballVelocity" onChange={(e) => this.props._changeBallVelocity(e.target.value)} type="range" min="1"
                 max="3" />
        </section>
        <section>
          <label htmlFor="P1Red">P1 red: </label>
          <input className="P1Red" type="range" min="0" max="255" />
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
