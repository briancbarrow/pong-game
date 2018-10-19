import React, { Component } from "react";
import axios from "axios";

class GameCanvas extends Component {
  constructor() {
    super();
    this.deadBalls = [];
    this.state = {
      maxScore: 0,
      isPlayInProcess: false,
      velocity: 1,
      player1Color: "FFF",
      player2Color: "FFF",
      ballColor: "FF0000"
    };
  }

  componentDidMount = () => {
    if (this.props.isPlayInProcess) {
      this._ballCollisionY();
    }
    this.setState(
      {
        maxScore: this.props.maxScore,
        velocity: this.props.velocity,
        player1Color: this.props.player1Color,
        player2Color: this.props.player2Color,
        ballColor: this.props.ballColor
      },
      this._initializeGameCanvas()
    );

    this._drawRender();
  };

  componentDidUpdate = () => {
    if (this.props.isPlayInProcess && !this.state.isPlayInProcess) {
      this.setState(
        {
          isPlayInProcess: this.props.isPlayInProcess,
          player1Color: this.props.player1Color,
          player2Color: this.props.player2Color,
          ballColor: this.props.ballColor
        },
        () => {
          this.gameBall.velocityX = this.gameBall.velocityY = this.state.velocity;
          this.gameBall = new this.GameClasses.Box({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            width: 15,
            height: 15,
            color: `#${this.state.ballColor}`,
            velocityX: this.state.velocity,
            velocityY: this.state.velocity
          });
          this.player1.color = `#${this.state.player1Color}`;
          this.player2.color = `#${this.state.player2Color}`;
          this.gameBall.color = `#${this.state.ballColor}`;
          //this._poll(1000);
          this._renderLoop();
        }
      );
    }
    if (this.props.velocity !== this.state.velocity) {
      this.setState(
        {
          velocity: this.props.velocity
        },
        () => {
          this.gameBall.velocityX = this.gameBall.velocityY = this.state.velocity;
        }
      );
    }
  };

  _poll = waitTime => {
    this.timer = setTimeout(() => {
      axios
        .get("https://wwwforms.suralink.com/pong.php?accessToken=pingPONG")
        .then(res => {
          this._poll(res.data.gameData.newDelay);
          let newball = res.data.gameData.ball;
          let paddle1 = res.data.gameData.paddle1;
          let paddle2 = res.data.gameData.paddle2;

          if (newball.width) {
            this.gameBall.width = newball.width;
          }
          if (newball.height) {
            this.gameBall.height = newball.height;
          }
          if (newball.color) {
            this.gameBall.color = `#${newball.color.hex}`;
          }
          if (newball.velocityX) {
            this.gameBall.velocityX = newball.velocityX;
          }
          if (newball.velocityY) {
            this.gameBall.velocityY = newball.velocityY;
          }

          if (paddle1.color) {
            this.player1.color = `#${paddle1.color.hex}`;
          }
          if (paddle1.height) {
            this.player1.height = paddle1.height;
          }
          if (paddle1.width) {
            this.player1.width = paddle1.width;
          }
          if (paddle1.velocityY) {
            this.player1.velocityY = paddle1.velocityY;
          }

          if (paddle2.color) {
            this.player2.color = `#${paddle2.color.hex}`;
          }
          if (paddle2.height) {
            this.player2.height = paddle2.height;
          }
          if (paddle2.width) {
            this.player2.width = paddle2.width;
          }
          if (paddle2.velocityY) {
            this.player2.velocityY = paddle2.velocityY;
          }
          console.log(this.player2);
          console.log(res.data.gameData, res.data.gameData.ball.length);
        });
    }, waitTime || 1000);
  };

  _declareWinner = winner => {
    this.gameBall.velocityX = this.gameBall.velocityY = 0;
    this.deadBalls = [];
    this.setState(
      {
        isPlayInProcess: false
      },
      this.props.onGameEnd()
    );
    // this.setState((state, props) => ({
    //   isPlayInProcess: props.isPlayInProcess
    // }));

    document.getElementById("winnerBox").innerHTML = `${winner} is the winner!`;
    //window.cancelAnimationFrame(this.frameId);
  };

  _initializeGameCanvas = () => {
    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas;
    this.ctx = this.canvas.getContext("2d");

    // declare initial variables
    this.p1Score = 0;
    this.p2Score = 0;
    this.keys = {};

    // add keyboard input listeners to handle user interactions
    window.addEventListener("keydown", e => {
      this.keys[e.keyCode] = 1;
      if (e.target.nodeName !== "INPUT") e.preventDefault();
    });
    window.addEventListener("keyup", e => delete this.keys[e.keyCode]);

    // instantiate our game elements
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: `#${this.state.player1Color}`,
      velocityY: 2
    });
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: `#${this.state.player2Color}`,
      velocityY: 2
    });
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: "#FFF"
    });
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 15,
      height: 15,
      color: `#${this.state.ballColor}`,
      velocityX: this.state.velocity,
      velocityY: this.state.velocity
    });

    // start render loop
    //this._renderLoop();
  };

  // recursively process game state and redraw canvas
  _renderLoop = () => {
    this._ballCollisionY();
    //this._drawRender();
    this._userInput(this.player1);
    this._userInput(this.player2);
    if (this.gameBall.velocityY === 0) {
      return;
    }
    this.frameId = window.requestAnimationFrame(this._renderLoop);
    if (!this.timer) {
      console.log("this.timer");
      this._poll(3000);
    }
  };

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
        this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1;
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._ballCollisionX();
  };

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    if (
      (this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width &&
        this.gameBall.y + this.gameBall.velocityY > this.player1.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height) ||
      (this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >=
        this.player2.x &&
        this.gameBall.y + this.gameBall.velocityY > this.player2.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player2.y + this.player2.height)
    ) {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
      if (this.gameBall.velocityY > 0) {
        if (87 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY - Math.random(); //this.player2.velocityY / 2;
        } else if (38 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY - Math.random(); // this.player2.velocityY / 2;
        } else if (40 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY + Math.random(); // this.player1.velocityY / 2;
        } else if (83 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY + Math.random(); // this.player1.velocityY / 2;
        }
      } else {
        if (87 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY + Math.random(); //this.player2.velocityY / 2;
        } else if (38 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY + Math.random(); // this.player2.velocityY / 2;
        } else if (40 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY - Math.random(); // this.player1.velocityY / 2;
        } else if (83 in this.keys) {
          this.gameBall.velocityY = this.gameBall.velocityY - Math.random(); // this.player1.velocityY / 2;
        }
      }
    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - 15
    ) {
      this.p2Score += 1;
      this.deadBalls.push(this.gameBall);
      clearTimeout(this.timer);
      this.timer = null;

      this.player1.height = 80;
      this.player1.width = 15;
      this.player1.color = "#FFF";
      this.player1.velocityY = 2;

      this.player2.height = 80;
      this.player2.width = 15;
      this.player2.color = "#FFF";
      this.player2.velocityY = 2;

      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color: `#${this.state.ballColor}`,
        velocityX: this.state.velocity,
        velocityY: this.state.velocity
      });
      if (this.p2Score === this.props.maxScore) {
        this.p1Score = this.p2Score = 0;
        this._declareWinner("Player 2");
        this._drawRender();
      }
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.deadBalls.push(this.gameBall);
      clearTimeout(this.timer);
      this.timer = null;

      this.player1.height = 80;
      this.player1.width = 15;
      this.player1.color = "#FFF";
      this.player1.velocityY = 2;

      this.player2.height = 80;
      this.player2.width = 15;
      this.player2.color = "#FFF";
      this.player2.velocityY = 2;

      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color: `#${this.state.ballColor}`,
        velocityX: -this.state.velocity,
        velocityY: this.state.velocity
      });
      if (this.p1Score === this.props.maxScore) {
        //alert("Player 1 wins!");
        this.p1Score = this.p2Score = 0;
        this._declareWinner("Player 1");
        this._drawRender();
      }
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._drawRender();
  };

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._displayScore1();
    this._displayScore2();
    this._drawBox(this.player1);
    this._drawBox(this.player2);
    this._drawBox(this.boardDivider);
    this._drawBox(this.gameBall);
  };

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(
      this.p1Score,
      this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45),
      30
    );
  };

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30);
  };

  //track user input
  _userInput = () => {
    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0) {
        this.player1.y -= this.player1.velocityY;
      }
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      ) {
        this.player1.y += this.player1.velocityY;
      }
    }

    if (38 in this.keys) {
      if (this.player2.y - this.player2.velocityY > 0) {
        this.player2.y -= this.player2.velocityY;
      }
    } else if (40 in this.keys) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      ) {
        this.player2.y += this.player2.velocityY;
      }
    }
  };

  GameClasses = (() => {
    return {
      Box: function Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts;
        this.x = x || 10;
        this.y = y || 10;
        this.width = width || 40;
        this.height = height || 50;
        this.color = color || "#FFF";
        this.velocityX = velocityX || 2;
        this.velocityY = velocityY || 2;
      }
    };
  })();

  render() {
    return (
      <canvas
        id="pong_canvas"
        ref="pong_canvas"
        width="750"
        height="500"
        style={{ background: "#12260e", border: "4px solid #FFF" }}
      />
    );
  }
}

export default GameCanvas;
