import React from "react";

const GameControls = props => {
  return (
    <article>
      <label htmlFor="maxScore">Max Score</label>
      <input id="maxScore" defaultValue={props.maxScore} />
      <label htmlFor="velocity">Velocity</label>
      <input id="velocity" defaultValue={props.velocity} />
      <br />
      <label htmlFor="player1Color">Player 1 Color</label>
      <input id="player1Color" defaultValue="FFF" />
      <label htmlFor="player2Color">Player 2 Color</label>
      <input id="player2Color" defaultValue="FFF" />
      <br />
      <label htmlFor="ballColor">Ball Color</label>
      <input id="ballColor" defaultValue="FF0000" />
      <label htmlFor="singlePlayer">Single Player?</label>
      <input
        id="singlePlayer"
        defaultChecked={props.singlePlayer}
        onChange={props.handleCheckbox}
        type="checkbox"
      />
      <button
        onClick={() =>
          props.onUpdate(
            document.getElementById("maxScore").value,
            document.getElementById("velocity").value,
            document.getElementById("player1Color").value,
            document.getElementById("player2Color").value,
            document.getElementById("ballColor").value
          )
        }
      >
        Start Game
      </button>
    </article>
  );
};

export default GameControls;
