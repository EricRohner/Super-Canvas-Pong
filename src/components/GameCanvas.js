import React, { Component } from 'react'

// removed useless constructor and 2 lines that pushed to deadBalls[]

class GameCanvas extends Component {
  //when props update, update the gameCanvas to reflect the changes.
  componentDidUpdate() {
    this.player1 = { ...this.player1, ...this.props.player1 }
    this.player2 = { ...this.player2, ...this.props.player2 }
    this.gameBall = { ...this.gameBall, ...this.props.ball }
  }

  componentDidMount = () => {
    this._initializeGameCanvas()
  }

  _initializeGameCanvas = () => {
    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas
    this.ctx = this.canvas.getContext('2d')

    this.keys = {}
    // add keyboard input listeners to handle user interactions
    window.addEventListener('keydown', e => {
      // keycode is technically deprecated. In a production environment we'd want to test key and keyIdentifier !== undefined.
      // however, since keyCode is actually the most supported one I'll stick with it.
      this.keys[e.keyCode] = 1
      if (e.target.nodeName !== 'INPUT') e.preventDefault()
    })
    window.addEventListener('keyup', e => delete this.keys[e.keyCode])
    // declare initial variables
    this._initGame()
    // start render loop
    this._renderLoop()
  }

  // initialize gamestate variables
  _initGame = () => {
    this._initGameObjects()
    this.p1Score = 0
    this.p2Score = 0
    this.aiTarget = this._getAiTarget(this.gameBall.x, this.gameBall.y, this.gameBall.velocityX, this.gameBall.velocityY)
    this.winner = false
  }

  // initialize game objects
  _initGameObjects = () => {
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: '#FFFFFF',
      velocityY: 2
    })
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: '#FFFFFF',
      velocityY: 2
    })
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: '#FFFFFF'
    })
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 15,
      height: 15,
      color: '#FF0000',
      velocityX: 3,
      velocityY: 1
    })
    this.props._updateState(this.player1, this.player2, this.gameBall)
  }

  // the way this looks, it appears that the AI should perfectly predict the ball's movement every single time.
  // by only calling it at certain times in the code we can make it appear that the ai randomly misses. Users will
  // eventually catch on and abuse the AI but it's pretty fun to play against and has a decently balanced difficulty.
  // can you figure out how to make it miss every time?
  _getAiTarget = (x, y, vX, vY) => {
    // simulate the ball moving, if it makes it to this.canvas.width return y as the ai's target
    // if it hits the top or bottom of the screen recursively call with the velocityY's sign switched
    // I'm more than a little disappointed that I wasn't able to get this working by solving y=mx+b
    // for b and then using that to solve for x when y intercepts canvas.height or 0. Sometimes you
    // just have to go with the option that you know works correctly.
    while ((y + vY > 0) && (y + vY < this.canvas.height) && (x + vX < this.canvas.width)) {
      y += vY
      x += vX
    }
    if ((x + vX) >= this.canvas.width) {
      return y
    } else {
      return this._getAiTarget(x, y, vX, vY * -1)
    }
  }

  // recursively process game state and redraw canvas
  _renderLoop = () => {

    // we want to stop all movement until the game starts. _drawRender has been moved to the render loop from _ballCollisionX
    // so that the players can see their changes to ball and paddle colors pre-game.
    if (this.props.gameStart) {
      this._ballCollisionY()
      this._userInput(this.player1)
      // if ai is turned on run _aiInput(), else run player2 input
      if (this.props.ai) {
        this._aiInput()
      } else {
        this._userInput(this.player2)
      }
    }
    // the player has clicked reset so call the game init function and turn off the reset toggle
    if (this.props.reset) {
      this._initGame()
      this.props._toggleReset()
    }
    // update state in GameInterface to match any changes
    this.props._updateState(this.player1, this.player2, this.gameBall)
    this._drawRender()
    this.frameId = window.requestAnimationFrame(this._renderLoop)
  }

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
      this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1
      this.gameBall.x += this.gameBall.velocityX
      this.gameBall.y += this.gameBall.velocityY
    } else {
      this.gameBall.x += this.gameBall.velocityX
      this.gameBall.y += this.gameBall.velocityY
    }
    this._ballCollisionX()
  }

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    if (
      this.gameBall.x + this.gameBall.velocityX <=
      this.player1.x + this.player1.width &&
      this.gameBall.y + this.gameBall.velocityY > this.player1.y &&
      this.gameBall.y + this.gameBall.velocityY <=
      this.player1.y + this.player1.height
    ) {
      // Fixed bug where "catching" the ball with the top or bottom of the paddle
      // would result in it switching X direction every frame. Since few players have frame
      // perfect timing this essentially gives the top and bottom of the paddle a 50/50 chance
      // to lose the volley. Players don't like random chance hurting them in a skill game.
      if (this.props.ai && this.gameBall.velocityX < 0) {
        this.aiTarget = this._getAiTarget(this.gameBall.x, this.gameBall.y, this.gameBall.velocityX * -1, this.gameBall.velocityY)
      }
      this.gameBall.velocityX = Math.abs(this.gameBall.velocityX)
      // check if the paddle is moving and increase ball velocityY accordingly. This stacks every frame
      // until the ball leaves the paddle making a previously deadly top and bottom hits advantageous. Free feature!
      if (83 in this.keys) {
        this.gameBall.velocityY += 1
      } else if (87 in this.keys) {
        this.gameBall.velocityY -= 1
      }
    } else if (
      this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >=
      this.player2.x &&
      this.gameBall.y + this.gameBall.velocityY > this.player2.y &&
      this.gameBall.y + this.gameBall.velocityY <=
      this.player2.y + this.player2.height
    ) {
      // see bug fix above
      this.gameBall.velocityX = (Math.abs(this.gameBall.velocityX)) * -1
      if (40 in this.keys) {
        this.gameBall.velocityY += 1
      } else if (38 in this.keys) {
        this.gameBall.velocityY -= 1
      }
    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - this.player1.width
    ) {
      this.p2Score += 1
      // this is where I'd call this._initGameObjects() to reset the randomization from the server after a point is scored.
      // I personally think the game's more fun if you don't. Design choice made.
      if (this.p2Score >= this.props.pointsToWin) {
        this.winner = 2
        this.props._changeGameStart()
      }
      this.gameBall = ({ ...this.gameBall, x: this.canvas.width / 2, y: this.canvas.height / 2, })
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1
      // this is where I'd call this._initGameObjects() to reset the randomization from the server after a point is scored.
      // I personally think the game's more fun if you don't. Design choice made.
      if (this.p1Score >= this.props.pointsToWin) {
        this.winner = 1
        this.props._changeGameStart()
      }
      this.gameBall = ({ ...this.gameBall, x: this.canvas.width / 2, y: this.canvas.height / 2, })
      // the ball has bounced off player1's paddle so re-target the ai.
      this.aiTarget = this._getAiTarget(this.gameBall.x, this.gameBall.y, this.gameBall.velocityX, this.gameBall.velocityY)
    } else {
      this.gameBall.x += this.gameBall.velocityX
      this.gameBall.y += this.gameBall.velocityY
    }
  }

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.winner) {
      this._displayWinner(this.winner)
    }
    this._displayScore1()
    this._displayScore2()
    this._drawBox(this.player1)
    this._drawBox(this.player2)
    this._drawBox(this.boardDivider)
    this._drawBox(this.gameBall)
  }

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color
    this.ctx.fillRect(box.x, box.y, box.width, box.height)
  }

  // Display the winner!
  _displayWinner = (winner) => {
    this.ctx.font = '20px Arial'
    this.ctx.fillStyle = 'rgb(255, 255, 255)'
    this.ctx.fillText('Player ' + winner + ' wins!', this.canvas.width / 2 + (this.winner === 2 ? 33 : -155), 150)
  }

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = '20px Arial'
    this.ctx.fillStyle = 'rgb(255, 255, 255)'
    this.ctx.fillText(this.p1Score, this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45), 30)
  }

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = '20px Arial'
    this.ctx.fillStyle = 'rgb(255, 255, 255)'
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30)
  }

  _aiInput = () => {
    if (this.player2.y > (this.aiTarget - this.player2.height / 2)) {
      this.player2.y -= this.player1.velocityY
    } else if (this.player2.y < (this.aiTarget - this.player2.height / 2)) {
      this.player2.y += this.player1.velocityY
    }
  }

  //track user input
  _userInput = () => {

    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0)
        this.player1.y -= this.player1.velocityY
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      )
        this.player1.y += this.player1.velocityY
    }

    if (38 in this.keys) {
      if (this.player2.y - this.player2.velocityY > 0)
        this.player2.y -= this.player2.velocityY
    } else if (40 in this.keys) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      )
        this.player2.y += this.player2.velocityY
    }
  }

  GameClasses = (() => {
    return {
      // fixed memory leak (I think) where the function Box was unintentionally leaking into global scope and not getting garbage collected.
      Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts
        this.x = x || 10
        this.y = y || 10
        this.width = width
        this.height = height
        this.color = color || '#FFFFFF'
        this.velocityX = velocityX || 2
        this.velocityY = velocityY || 2
      }
    }
  })()

  render() {
    return (
      <canvas
        id="pong_canvas"
        ref="pong_canvas"
        width="750"
        height="500"
        style={{ background: '#12260e', border: '4px solid #FFF' }}
      />
    )
  }
}

export default GameCanvas
