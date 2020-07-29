const blessed = require('blessed');

const getRandomNumberInRange = (min, max) => parseInt(Math.random() * (max - min) + min, 10);
const isOdd = n => n % 2 !== 0;


function redBox(top, left) {
    return blessed.box({
        width: 2,
        height: 1,
        top,
        left,
        style: {
            fg: 'red',
            bg: 'red'
        }
    });
}

class _Apple {
    _apple = null;

    constructor() {
        let randomTop = getRandomNumberInRange(1, 18);
        let randomLeft = getRandomNumberInRange(1, 57);

        if (isOdd(randomLeft)) randomLeft++;

        this._apple = redBox(randomTop, randomLeft);
        return this._apple;
    }

    destroy() {
        this._apple.detach();
    }
}

const Apple = {
    create: () => new _Apple(),
    destroy: apple => apple.destroy()
}

module.exports = Apple;
