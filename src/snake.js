const blessed = require('blessed');

class Snake {
    _nodes = [];
    _parent = null;
    _direction = null;

    constructor(parent, direction='left') {
        this._parent = parent;
        this._direction = direction;

        this._nodes = [
            this._createBodyBlock(10, 20),
            this._createBodyBlock(10, 22),
            this._createBodyBlock(10, 24),
            this._createBodyBlock(10, 26),
            this._createBodyBlock(10, 28),
            this._createBodyBlock(10, 30),
            this._createBodyBlock(10, 32)
        ];

        this._nodes.forEach(node => this._parent.append(node));
    }

    get direction() {
        return this._direction;
    }

    set direction(newDirection) {
        this._direction = newDirection;
    }

    getNodes () {
        return this._nodes.map(node => ({ top: node.top, left: node.left }));
    }

    grow() {
        this._addBlock(this._direction);
    }

    move() {
        this._addBlock(this._direction);
        this._removeTail();
    }

    getHead() {
        return this._nodes[0];
    }

    getTail() {
        return this._nodes.slice(-1).pop();
    }

    // PRIVATE METHODS

    _createBodyBlock(top, left) {
        return blessed.box({
            width: 2,
            height: 1,
            top,
            left,
            style: {
                fg: 'lightgray',
                bg: 'lightgray',
            }
        });
    }

    _addBlock() {
        const head = this.getHead();
        const tail = this.getTail();

        const newBlock = this._createBodyBlock(head.top - 1, head.left - 1);
        this._parent.append(newBlock);

        switch (this._direction) {
            case 'up':
                newBlock.top -= 2;
                break;
            case 'down':
                newBlock.top += 0;
                break;
            case 'left':
                newBlock.left -= 3;
                break;
            case 'right':
                newBlock.left += 1;
                break;
            default:
                break;
        }

        this._nodes.unshift(newBlock);
    }

    _removeTail() {
        this._parent.remove(this.getTail());
        this._nodes.pop();
    }
}

module.exports = Snake;
