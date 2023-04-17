const canvasEl = document.querySelector("canvas"),
  canvaCtx = canvasEl.getContext("2d"),
  lineWidth = 15,
  gapX = 10;

const field = {
  color: "#286947",
  width: window.innerWidth,
  height: window.innerHeight,
  x: 0,
  y: 0,
  draw: function () {
    canvaCtx.fillStyle = this.color;
    canvaCtx.fillRect(this.x, this.y, this.width, this.height);
  },
};

const line = {
  color: "#fff",
  width: lineWidth,
  height: window.innerHeight,
  x: window.innerWidth / 2 - lineWidth / 2,
  y: 0,
  draw() {
    canvaCtx.fillStyle = this.color;
    canvaCtx.fillRect(this.x, this.y, this.width, this.height);
  },
};

const mouse = {
  x: 0,
  y: 0,
};

const leftPaddle = {
  color: line.color,
  x: gapX,
  y: 0,
  width: lineWidth,
  height: 200,
  _move() {
    this.y = mouse.y - this.height / 2;
  },
  draw() {
    canvaCtx.fillStyle = this.color;
    canvaCtx.fillRect(this.x, this.y, this.width, this.height);

    this._move();
  },
};

const rightPaddle = {
  color: line.color,
  x: window.innerWidth - lineWidth - gapX,
  y: 0,
  width: lineWidth,
  height: 200,
  speed: 5,
  _speedUp() {
    this.speed += 2;
  },
  _move() {
    if (this.y + this.height / 2 < ball.y + ball.r) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },
  draw() {
    canvaCtx.fillStyle = this.color;
    canvaCtx.fillRect(this.x, this.y, this.width, this.height);

    this._move();
  },
};

const score = {
  font: "bold 72px Arial",
  textAlign: "center",
  textBaseline: "top",
  color: "#e3e5e1",
  human: 0,
  computer: 0,
  increaseHuman() {
    this.human++;
  },
  increaseComputer() {
    this.computer++;
  },
  x: window.innerWidth / 4,
  y: 50,
  draw() {
    canvaCtx.font = this.font;
    canvaCtx.textAlign = this.textAlign;
    canvaCtx.textBaseline = this.textBaseline;
    canvaCtx.fillStyle = this.color;
    canvaCtx.fillText(this.human, this.x, this.y);
    canvaCtx.fillText(this.computer, window.innerWidth - this.x, this.y);
  },
};

const ball = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  r: 20,
  speed: 5,
  arcInital: 0,
  arcEnd: 2 * Math.PI,
  reverse: false,
  directionX: 1,
  directionY: 1,
  _calcPosition() {
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.height - this.r && this.directionY > 0)
    ) {
      this._reverseY();
    }

    if (this.x > field.width - this.r - rightPaddle.width - gapX) {
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.height
      ) {
        this._reverseX();
      } else {
        score.increaseHuman();
        this._pointUp();
      }
    }

    if (this.x < 0 + this.r + leftPaddle.width + gapX) {
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.height
      ) {
        this._reverseX();
      } else {
        score.increaseComputer();
        this._pointUp();
      }
    }
  },
  _speedUp() {
    this.speed += 3;
  },
  _pointUp() {
    this.x = field.width / 2;
    this.y = field.height / 2;

    this._speedUp();
    rightPaddle._speedUp();
  },
  _reverseX() {
    this.directionX *= -1;
  },
  _reverseY() {
    this.directionY *= -1;
  },
  _move() {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  // arc(x, y, r, ArcInital, ArcEnd  ,false)
  draw() {
    canvaCtx.beginPath();
    canvaCtx.arc(
      this.x,
      this.y,
      this.r,
      this.arcInital,
      this.arcEnd,
      this.reverse
    );
    canvaCtx.fill();

    this._calcPosition();
    this._move();
  },
};

function setup() {
  canvaCtx.width = canvasEl.width = field.width;
  canvaCtx.height = canvasEl.height = field.height;
}

function draw() {
  // desenhando campo
  field.draw();
  // desenhando linha central
  line.draw();
  // raquete esquerda
  leftPaddle.draw();
  // raquete esquerda
  rightPaddle.draw();
  // desenhando o placar
  score.draw();
  // desenhando a bola
  ball.draw();
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  animateFrame(main);
  draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
