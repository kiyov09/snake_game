const blessed = require('blessed');

const Game  = require('./src/game');

var screen = blessed.screen({
    smartCSR: true
});

const game = new Game(screen);
screen.render();
