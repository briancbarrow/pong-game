# Suralink Client Side Tech Assessment


This project is designed to test your understanding of Javascript, React and general programmatic logic.

## Table of Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [My Implementation](#implementation)

## Installation

$ npm install


## Usage

Player 1(left paddle) Controls:
  * 'W' - paddle up
  * 'S' - paddle down

Player 2(right paddle) Controls:
  * 'Arrow Up' - paddle up
  * 'Arrow Down' - paddle down


## Implementation

### Build out game menu control panel component
  * I added the requested controls plus a couple of others from other tasks
  * Colors should be in Hexadecimal format. In future versions this could be updated to include RGB as well, or dropdowns with specific colors
  * I put these values into state when the 'Start Game' button is clicked
  * In future versions I could make the button unclickable so that users don't click in the middle of the game.

### Add changing Y velocity to ball - paddle collisions
  * I implemented this by subtracting/adding a random number to the velocity of the ball
  * Because it is a random number the impact of the change can be either minimal or drastic. 
  * This could potentially be cleaned up to call a method with parameters specifying how to affect the ball.

### Add AI functionality to the player 2 paddle
  * Initially I implemented this by calling a method (_compAI) that would be called again at a random interval and would change the direction of the paddle every time.
  * I decided that it would be closer to AI if it was actually following the direction of the ball.
  * So the method is still called at random intervals but the direction the paddle moves will be dependent on the direction of the gameball.

### Add asynchronous server interactions
  * I added this in a method called _poll and used [axios](https://www.npmjs.com/package/axios) to make the call
  * This was the task I had the most fun with because of the impact it had on game play. It was cool to see what changes came in.

### Find and fix memory leak
  * I wasn't 100% sure on this one. The instructions said it was a mounting memory leak so I added a 'componentWillUnmount' function to remove the keyup and keydown event listeners. 