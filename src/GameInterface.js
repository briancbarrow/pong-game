import React, { Component } from "react";

import GameCanvas from "./components/GameCanvas";
import GameControls from "./components/GameControls";

class GameInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxScore: 3,
      isPlayInProcess: false,
      velocity: 1,
      player1Color: "fff",
      player2Color: "fff",
      ballColor: "ff0000",
      singlePlayer: true
    };
  }

  updateAll = (score, velocity, player1Color, player2Color, ballColor) => {
    score = parseInt(score, 10);
    velocity = parseInt(velocity, 10);
    this.setState({
      maxScore: score,
      isPlayInProcess: true,
      velocity: velocity,
      player1Color: player1Color,
      player2Color: player2Color,
      ballColor: ballColor
    });
  };

  handleCheckbox = () => {
    this.setState({
      singlePlayer: !this.state.singlePlayer
    });
  };

  updateOnGameEnd = () => {
    this.setState(
      {
        isPlayInProcess: false
      },
      () => {}
    );
  };

  startPlay = () => {
    this.setState({
      isPlayInProcess: true
    });
  };

  render() {
    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <GameCanvas
            isPlayInProcess={this.state.isPlayInProcess}
            maxScore={this.state.maxScore}
            onGameEnd={this.updateOnGameEnd}
            velocity={this.state.velocity}
            player1Color={this.state.player1Color}
            player2Color={this.state.player2Color}
            ballColor={this.state.ballColor}
            singlePlayer={this.state.singlePlayer}
          />
          <GameControls
            maxScore={this.state.maxScore}
            velocity={this.state.velocity}
            onUpdate={this.updateAll}
            singlePlayer={this.state.singlePlayer}
            handleCheckbox={this.handleCheckbox}
          />

          <h2 id="winnerBox" />
        </section>
      </main>
    );
  }
}

export default GameInterface;
