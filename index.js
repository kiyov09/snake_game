const blessed = require('blessed');
const contrib = require('blessed-contrib');

const Game  = require('./src/game');

var screen = blessed.screen({
    smartCSR: true
});

const game = new Game(screen);
screen.render();
