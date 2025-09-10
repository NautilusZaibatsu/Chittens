// Images
const wing = new Image();
wing.src = 'img/wing.png';

// firefly parameters
const fireflyMinSeekHeight = 40; // lowest to the ground a firefly will look for fruit
const fireflyMaxEatingSpeed = 0.25; // Maximum average speed fireflies can eat fruit at
const startingFireflies = 1; // fireflies at start of game
const minFireflies = 1;
const maxFireflies = 6;
const fireflyTouchLimit = 500; // how many times a firefly can be touched before it explodes 
const fireflyFumbleRate = 0.25; // chance (25%) that firefly fumbles a fruit when touching it
const fireflyFlapFreq = 15; // how many frames pass between a firefly can flap it's wings again
const fireflyFlapFreqVar = 15; // how many frames extra the fireflay may choose to wait to flap

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
function FireFly(x, y, focus, firstColour) {
  this.x = x;
  this.y = y;
  this.focus = focus;
  this.waitingForFruit = false;
  this.lastTreeVisited = null;
  this.speedX = 0;
  this.speedY = 0;
  this.spin = 0;
  this.rotation = 0;
  this.size = 10; // size for chitten collisions
  this.renderedSize = 2; // size for physical drawing and firefly to firefly collisions
  this.flapTimer = Math.random() * fireflyFlapFreq;
  this.touches = 0;
  this.touchedThisFrame = false;
  this.landed = false;
  this.firstColour = firstColour;
  this.stomach = 0;
  this.justAte = false;
  this.spin = 0;
  this.land = function () {
    this.landed = true;
    this.flapTimer = 0;
  }
  this.takeOffFromLanded = function () {
    this.landed = false;
    this.flapTimer = fireflyFlapFreq;
  }
  this.chooseNewTarget = function () {
    // set up an array of option indexes
    this.waitingForFruit = false;
    let options = [];
    for (let i = 0; i < fruits.length; i++) {
      let flagged = false;
      // don't pick a fruit from the same tree
      if (fruits[i].parent == this.lastTreeVisited) {
        flagged = true;
      }
      if (!flagged && fruits[i] !== this.focus && fruits[i].y < trueBottom - fireflyMinSeekHeight) {
        options.push(i);
      }
    }
    let diffx = 0;
    let diffy = 0;
    let absolute = 0;
    let smallAbs = canvasWidth * canvasHeight;
    let target = 0;
    if (options.length > 0) {
      if (this.landed) {
        this.takeOffFromLanded();
      }
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
      // no valid fruit targets, wait for a fruit
      this.waitingForFruit = true;
    }
    // go to a random tree or a sleeping chitten to investigate
    if (this.waitingForFruit) {
      let pickNewTarget = false;
      if (trees.includes(this.focus)) {
        // if the firefly has investigated the tree or gets distracted, pick a different target
        if (!this.landed && detectTreeCollision(this, this.focus, 0)
          && Math.abs(this.speedX) + Math.abs(this.speedY) / 2 < fireflyMaxEatingSpeed) {
          this.land();
        } else {
          if (Math.random() < 1 / ticksPerDay) {
            pickNewTarget = true;
            this.takeOffFromLanded();
          }
        }
      } else if (this.focus && this.focus.chitten && chittens.includes(this.focus.chitten)) {
        if (this.focus.chitten.awake) {
          pickNewTarget = true;
          this.takeOffFromLanded();
        } else {
          // Check if we're close to the chitten's head
          if (!this.landed && detectCollision(this, this.focus, 0)
            && Math.abs(this.speedX) + Math.abs(this.speedY) / 2 < fireflyMaxEatingSpeed) {
              sendMessage('A firefly landed on '+this.focus.chitten.name+'\'s head');
            this.land();
          } else {
            if (Math.random() < 1 / ticksPerDay) {
              pickNewTarget = true;
              this.takeOffFromLanded();
            } else if (Math.random() < 1 / ticksPerDay) {
              this.focus.chitten.awake = true;
              pickNewTarget = true;
              this.takeOffFromLanded();
            }
          }
        }
      } else if (!trees.includes(this.focus) && !this.focus.chitten) {
        // Focus is neither tree nor chitten head, pick new target
        pickNewTarget = true;
      }
      if (pickNewTarget) {
        let cTargets = [];
        for (let i = 0; i < chittens.length; i++) {
          if (!chittens[i].awake && !chittens[i].inCatBox) {
            cTargets.push(i);
          }
        }
        if (cTargets.length > 0 && Math.random() < 0.5) {
          // 50% chance to pick a sleeping chitten
          let targetChitten = chittens[cTargets[Math.floor(Math.random() * cTargets.length)]];
          this.focus = {
            chitten: targetChitten,
            x: targetChitten.x,
            y: targetChitten.y,
            size: 10
          };
        } else if (trees.length > 0) {
          this.focus = trees[Math.floor(Math.random() * trees.length)];
        } else {
          this.focus = pointerPos;
        }
      }
    }
  };
  this.update = function () {
    this.justAte = false;
    let bounced = false;
    // add firefly trails, log touches, then update
    trails.push(new Particle(this.size / 5, glowColour, this.x, this.y, this.speedX, this.speedY));
    if (this.touchedThisFrame) {
      // spawn a new firefly if there are less than or close to the minimum, and this one is nearly dead
      if (this.touches >= 0.8 * fireflyTouchLimit && fireflies.length <= minFireflies && fireflies.length < maxFireflies) {
        let x = selectLeftOrRightEdge();
        fireflies.push(new FireFly(x, Math.random() * trueBottom, pointerPos, glowColour));
      }
      this.touches += 1;
      this.chooseNewTarget();
      this.flapTimer = fireflyFlapFreq;

    }
    this.touchedThisFrame = false;

    // firefly-to-firefly collisions
    let thisIndex = fireflies.indexOf(this, fruits);
    for (let i = thisIndex + 1; i < fireflies.length; i++) {
      if (detectFireflyToFireflyCollision(fireflies[i], this)) {
        collide(fireflies[i], this, true, true, false);
        // one of the fireflies should now choose another target
        if (Math.random() < 0.5) {
          fireflies[i].chooseNewTarget();
          fireflies[i].flapTimer = fireflyFlapFreq;
        } else {
          this.chooseNewTarget();
          this.flapTimer = fireflyFlapFreq;
        }
        fireflies[i].flapTimer = fireflyFlapFreq;
      }
    }

    // reset focus if the fruit is no longer valid because something ate it or it has rotted away
    // reset focus if the fruit falls too low
    let focusIsValidFruit = fruits.includes(this.focus);
    if (!this.focus || !focusIsValidFruit || this.focus.flaggedForRemoval || (focusIsValidFruit && this.focus.y > trueBottom - fireflyMinSeekHeight)) {
      this.chooseNewTarget();
    }

    if (this.focus && fruits.includes(this.focus) && !this.focus.flaggedForRemoval) {
      if ((Math.abs(this.speedX) + Math.abs(this.speedY)) / 2 < fireflyMaxEatingSpeed) {
        // fireflies eating (must be moving slowly enough)
        if (fruits.includes(this.focus) && !this.focus.flaggedForRemoval && (detectCollision(this, this.focus))) {
          // Check if firefly fumbles the fruit
          if (Math.random() < fireflyFumbleRate) {
            this.focus.fumbleFruit(this.speedX, this.speedY);
          } else {
            this.stomach++;
            this.justAte = true;
            // spawning another firefly when this one has eaten enough fruit
            if (this.stomach >= 25 && fireflies.length < maxFireflies) {
              this.stomach = 0;
              fireflies.push(new FireFly(this.x, this.y, null, this.firstColour));
              fireflies[fireflies.length - 1].chooseNewTarget();
            }
            // consume the fruit and reset the focus
            let victimIndex = fruits.indexOf(this.focus);
            this.lastTreeVisited = this.focus.parent;
            removeFocusFrom(this.focus);
            this.chooseNewTarget();
            let glyphsSpawned = createGlyphs(this.x, this.y, '.', 1)
            for (let i = 1; i <= glyphsSpawned; i++) {
              glyphs[glyphs.length - i].colour = trueWhite;
              glyphs[glyphs.length - i].timer *= 0.25;
            }
            fruits[victimIndex].remove();
          }
          this.flapTimer = fireflyFlapFreq;
        }
      }
    }
    if (this.justAte) {
      this.speedX *= 0.5;
      this.speedY *= 0.5;
    }
    // PHYSICS
    if (this.landed) {
      // If landed on a tree, move with the tree as it grows/withers
      if (trees.includes(this.focus)) {
        this.y = this.focus.y; // Stay slightly above the tree top
      }
      // If landed on a chitten head, update position with the chitten
      else if (this.focus.chitten && chittens.includes(this.focus.chitten)) {
        this.focus.y = this.focus.chitten.y;;
        this.y = this.focus.y;
      }
      
      if (this.speedX != 0) {
        this.speedX *= 0.9;
      }
      if (this.speedY != 0) {
        this.speedY *= 0.9;
      }
      if (this.rotation != 0) {
        this.rotation *= 0.9;
      }
    } else {
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
        flaptimer = fireflyFlapFreq;
      }
      // fireflies flapping their wings
      this.flapTimer--;
      let targetangle;
      let diffx;
      let diffy;
      diffx = this.focus.x - this.x;
      diffy = this.focus.y - this.y;
      targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
      if (!bounced && this.flapTimer <= 0) {
        this.flapTimer = fireflyFlapFreq + (Math.random() * fireflyFlapFreqVar);
        // flap wings here
        this.speedX += 0.025 * Math.cos(targetangle) * this.flapTimer;
        this.speedY -= gravity * this.flapTimer;
        this.speedY += 0.0125 * Math.sin(targetangle) * this.flapTimer;
        this.rotation *= 0.75;
      }
      // apply gravity
      this.speedY += gravity;
      if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
      } else {
        this.speedX *= 0.95;
      }
      if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
      } else {
        this.speedY *= 0.95;
      }
      // Apply drag proportional to velocity and size
      let dragX = this.speedX * dragFactor / this.renderedSize;
      let dragY = this.speedY * dragFactor / this.renderedSize;
      // Subtract drag in the direction of motion
      this.speedX -= dragX;
      this.speedY -= dragY;
      // apply spin
      this.rotation += this.spin;
      this.spin *= 0.9;
      applySpeedLimit(this);
    }
    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.render = function () {

    // draw wings
    const drawX = - wing.width / 2;
    const drawY = - wing.height;
    const scale = 0.25; // equivalent to /4
    ctx.globalAlpha = 0.5;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    let normaliseTimer = 1 - (this.flapTimer / fireflyFlapFreq);
    if (normaliseTimer > 1) normaliseTimer = 1
    // draw wings
    const lerp = (a, b, t) => a * (1 - t) + b * t;
    const rotationL = lerp(-Math.PI / 2, -Math.PI / 8, normaliseTimer);
    const rotationR = lerp(Math.PI / 2, Math.PI / 8, normaliseTimer);
    ctx.rotate(rotationL);
    ctx.scale(scale, scale);
    ctx.drawImage(wing, drawX, drawY, wing.width, wing.height);
    ctx.restore();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(rotationR);
    ctx.scale(scale, scale);
    ctx.drawImage(wing, drawX, drawY, wing.width, wing.height);
    ctx.restore();
    // draw glow
    ctx.globalAlpha = 0.3 * this.size / 40;// - (this.touches/2000);
    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 100);
    glow.addColorStop(0, this.firstColour);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 100, 0, 2 * Math.PI);
    ctx.fill();
    // draw body
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.fillStyle = trueWhite;
    ctx.arc(this.x, this.y, this.renderedSize, 0, 2 * Math.PI);
    ctx.fill();
  };
}