// firefly parameters
const fireflyMinSeekHeight = 25; // lowest to the ground a firefly will look for fruit
const fireflyMaxEatingSpeed = 0.5; // Maximum average speed for fireflies to eat fruit
const startingFireflies = 1; // fireflies at start of game
const minFireflies = 1;
const maxFireflies = 6;
const fireflyTouchLimit = 500; // how many times a firefly can be touched before it explodes 
const fireflyFumbleRate = 0.25; // chance (25%) that firefly fumbles a fruit when touching it

// arrays
fireflies = [];
trails = [];

/**
* function to describe a firefly
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {object} focus - the firefly's focus
* @param {int} size - the size
* @param {string} firstColour - the colour
*/
function FireFly(x, y, focus, size, firstColour) {
  this.x = x;
  this.y = y;
  this.focus = focus;
  this.lastTreeVisited = null;
  this.speedX = 0;
  this.speedY = 0;
  this.size = size * 10;
  this.touches = 0;
  this.touchedThisFrame = false;
  this.firstColour = firstColour;
  this.stomach = 0;
  this.justAte = false;
  this.chooseNewTarget = function () {
    if (this.justAte) {
      this.focus = pointerPos;
    } else {
      // set up an array of option indexes
      let options = [];
      for (let i = 0; i < fruits.length; i++) {
        let flagged = false;
        // don't pick a fruit from the same tree
        if (fruits[i].parent == this.lastTreeVisited) {
          flagged = true;
        }
        if (!flagged && fruits[i] !== this.focus && fruits[i].y < trueBottom - fireflyMinSeekHeight && !fruits[i].fumbled) {
          options.push(i);
        }
      }
      let diffx = 0;
      let diffy = 0;
      let absolute = 0;
      let smallAbs = canvasWidth * canvasHeight;
      let target = 0;
      if (options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          diffx = Math.abs(this.x - fruits[options[i]].x);
          diffy = Math.abs(this.y - fruits[options[i]].y);
          absolute = Math.sqrt((diffy * diffy) + (diffx * diffx));
          if (absolute < smallAbs) {
            smallAbs = absolute;
            target = options[i];
          }
        }
        this.focus = fruits[target];
      } else if (options.length == 0) {
        // no valid fruit targets, decide between other fireflies or trees
        let useFirefly = fireflies.length > 1 && Math.random() < 0.1; // 10% chance to target another firefly

        if (useFirefly) {
          // Target another firefly
          let fireflyOptions = [];
          for (let i = 0; i < fireflies.length; i++) {
            if (fireflies[i] !== this) {
              fireflyOptions.push(i);
            }
          }
          if (fireflyOptions.length > 0) {
            let randomFireflyIndex = Math.floor(Math.random() * fireflyOptions.length);
            this.focus = fireflies[fireflyOptions[randomFireflyIndex]];
          } else {
            this.focus = pointerPos;
          }
        } else {
          // Look for suitable trees instead
          let treeOptions = [];
          for (let i = 0; i < trees.length; i++) {
            if (trees[i].y < trueBottom - fireflyMinSeekHeight) {
              treeOptions.push(i);
            }
          }

          if (treeOptions.length > 0) {
            // Pick a random suitable tree
            let randomTreeIndex = Math.floor(Math.random() * treeOptions.length);
            this.focus = trees[treeOptions[randomTreeIndex]];
          } else {
            // No suitable trees either, fall back to pointer
            this.focus = pointerPos;
          }
        }
      }
    }
  };
  this.update = function () {
    if (this.justAte && Math.random() < 0.995) {
      this.justAte = false;
    }
    let bounced = false;
    if (this.x < 0 || this.x > canvasWidth) {
      this.speedX *= -0.98;
      if (this.x < 0) {
        this.x = ((2.5 * this.size) / 20);
      } else {
        this.x = canvasWidth - ((2.5 * this.size) / 20);
      }
      bounced = true;
    }
    if (this.y < 0 || this.y > trueBottom) {
      this.speedY *= -0.99;
      if (this.y > trueBottom) {
        this.y = trueBottom - 10;
      } else {
        this.y += (2.5 * this.size) / 20;
      }
      bounced = true;
    }
    if (!bounced) {
      let diffx;
      let diffy;
      let targetangle;
      if (this.focus == null) {
        diffx = pointerPos.x - this.x;
        diffy = pointerPos.y - this.y;
        targetangle = Math.atan2(pointerPos.y - this.y, pointerPos.x - this.x);
      } else {
        diffx = this.focus.x - this.x;
        diffy = this.focus.y - this.y;
        targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
      }

      if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
        // if we are going right and it's to our right
        // if we are going left and it's to our left
      } else {
        this.speedX *= 0.95;
      }
      if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
        // if we are going up and it's above
        // if we are going down and it's below
      } else {
        this.speedY *= 0.95;
      }
      this.speedX += 0.05 * Math.cos(targetangle);
      this.speedY += 0.05 * Math.sin(targetangle);
      applySpeedLimit(this);
      this.x += this.speedX;
      this.y += this.speedY;
    }
  };
  this.render = function () {
    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 100);
    glow.addColorStop(0, this.firstColour);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // Fill with gradient
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.3 * this.size / 40;// - (this.touches/2000);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.fillStyle = trueWhite;
    ctx.arc(this.x, this.y, (5 * this.size) / 20, 0, 2 * Math.PI);
    ctx.fill();
  };
}