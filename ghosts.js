// arrays

ghosts = [];
gravestones = [];

/**
* function for a Ghost
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} size - the size
* @param {string} firstColour - the colour
*/
function Ghost(x, y, size, firstColour) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speedX = 0;
  this.speedY = 0;
  this.firstColour = firstColour;
  this.update = function () {
    // start floating up if the main FireFly is below you
    if (this.y > fireflies[0].y) {
      this.speedY = -Math.abs(0.025 * (15 - this.size));
    } else {
      this.speedY *= 0.9999;
    }
    let diffx = fireflies[0].x - this.x;
    if (this.x < 0 || this.x > canvasWidth) {
      this.speedX *= -0.99;
    } else if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
      // if we are going right and it's to our right
      // if we are going left and it's to our left
    } else {
      this.speedX *= 0.9999;
    }
    let targetangle = Math.atan2(fireflies[0].y - this.y, fireflies[0].x - this.x);
    this.speedX += 0.001 * Math.cos(targetangle);
    applySpeedLimit(this);
    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.render = function () {
    ctx.globalAlpha = 0.1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(-trueBottom, this.speedX * 500));
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(spectre, -(this.size), -(this.size), this.size * 2, this.size * 4);
    ctx.restore();
    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.size * 20);
    glow.addColorStop(0, glowColour);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // Fill with gradient
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 20, 0, 2 * Math.PI);
    ctx.fill();
  };
}

/**
* function for a grave
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} size - the size
* @param {int} speedX - the x speed
* @param {int} speedY - the y speed
* @param {boolean} elder - elder status
* @param {string} firstColour - the colour
*/
function Grave(x, y, size, speedX, speedY, elder, firstColour) {
  this.x = x;
  this.y = y + 10;
  this.speedX = speedX / 2;
  this.speedY = speedY / 2;
  this.timer = 500;
  this.onSurface = false;
  this.elder = elder;
  this.firstColour = firstColour;
  // elders spawn obelisks
  if (this.elder) {
    this.image = obelisk;
    this.size = size * 1.5;
  } else {
    this.size = size;
    let whichTombstone = Math.random();
    if (whichTombstone < 0.3334) {
      this.image = tombstone;
    } else if (whichTombstone < 0.6667) {
      this.image = tombstone2;
    } else {
      this.image = tombstone3;
    }
  }
  this.update = function () {
    this.timer -= 0.075;
    if (!this.onSurface && this.y < trueBottom - (this.size * 5)) {
      checkBounceSides(this);
      checkBounceTop(this);
      let mass = gravity * (this.size * 2) * (this.size * 2);
      this.speedX *= 0.99;
      this.speedY += mass * gravity;
      applySpeedLimit(this);
      this.y += this.speedY / 2;
      this.x += this.speedX / 2;
    } else {
      // come to a rest at the bottom
      this.onSurface = true;
      this.y = trueBottom - (this.size * 5);
      this.speedY = 0;
      this.speedX *= 0.9;
    }
    ctx.globalAlpha = 0.2 + (this.timer / 100);
    ctx.drawImage(this.image, this.x - (this.size), this.y + this.size * 3, this.size * 2, this.size * 2);
    ctx.globalAlpha = 1;
  };
}