const blessed = require('blessed');

const Snake  = require('./snake');
const Apple  = require('./apple');

class Game {
    _screen = null;
    _snake = null;
    _apple = null;
    _gameInterval = null;

    constructor(screen) {
        this._screen = screen;

        this._game = blessed.box({
            top: 'center',
            left: 'center',
            width: 60,
            height: 20,
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'lightgray',
                bg: 'black',
                border: {
                    fg: '#f0f0f0'
                },
            }
        });
        this._screen.append(this._game);

        this._createSnake();
        this._createNewApple();

        this._setBindings();

        this._cycle = this._cycle.bind(this);
        this._gameInterval = setInterval(this._cycle, 300);
    }

    _setBindings() {
        this._screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        this._screen.on('keypress', (...args) => {
            const key = args[1];

            const isDirKey = ['up', 'down', 'left', 'right'].includes(key.name);
            if (!isDirKey) return;

            const isAllowed = this._isMoveAllowed(this._snake.direction, key.name)
            if (!isAllowed) return;

            this._snake.direction = key.name;
        });
    }

    _createSnake() {
        this._snake = new Snake(this._game);
    }

    _createNewApple() {
        if (this._apple) Apple.destroy(this._apple);

        this._apple = Apple.create();

        this._game.append(this._apple);
        this._screen.render();
    }

    _isEdgeReached(box, key) {
        const map = {
            'up': () => box.top > 1,
            'down':  () => box.top < 18,
            'left':  () => box.left > 1,
            'right':  () => box.left < 57
        }

        return map[key] ? map[key]() : true;
    }

    _isMoveAllowed(currentDir, newDir) {
        const map = {
            'up': () => newDir !== 'down',
            'down':  () => newDir !== 'up',
            'left':  () => newDir !== 'right',
            'right':  () => newDir !== 'left'
        }

        return map[currentDir]();
    }

    _willHeadOverlaps(newHeadPosition) {
        const snakeNodes = this._snake.getNodes();
        snakeNodes.shift() // Remove the head

        return snakeNodes.some(block => {
            if ((newHeadPosition.top === block.top) && (newHeadPosition.left === block.left)) {
                return true;
            }
            return false;
        });
    }

    _isEatingApple() {
        const snakeHead = this._snake.getHead();
        if ((snakeHead.top === this._apple.top) && (snakeHead.left === this._apple.left)) {
            return true;
        }
        return false;
    }

    _cycle() {
        const head = this._snake.getHead();
        const tail = this._snake.getTail();

        if (this._isEdgeReached(head, this._snake.direction) === false) {
            this._setGameOver();
            return;
        }

        this._snake.move();

        if (this._willHeadOverlaps(this._snake.getHead())) {
            this._setGameOver();
            return;
        }

        if (this._isEatingApple()) {
            this._snake.grow();
            this._createNewApple();
        }

        this._screen.render();
    }

    _setGameOver() {
        clearInterval(this._gameInterval);

        this._game.style.border.fg = 'red';

        while (this._snake.length) {
            snake.shift().detach();
        }

        this._game.setContent('Game Over!');

        this._screen.removeListener('keypress', this._cycle);
        this._screen.render();
    }
}

module.exports = Game;
