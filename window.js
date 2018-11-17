/**
* mate 0.44
**/

let debugString = 'nothing';
const globalFont = 'Lucida Console';

const gravity = 0.02;
const elasticity = 0.2;
const speedLimit = 100;
let started = true;
let superThreshold = 99;
//  canvas
const canvasWidth = (window.innerWidth || document.body.clientWidth) - 20;
const canvasHeight = (window.innerHeight || document.body.clientHeight) - 20;
const maxDistance = canvasWidth*canvasHeight;
const muckLevel = 45;
const trueBottom = canvasHeight - muckLevel;
// global scaling values
idealX = 1920 - 20;
const idealY = 1080 - 20 - muckLevel;
const idealArea = idealX * idealY;
const proportion = 1/(idealArea/(canvasWidth*trueBottom));

// set the environment start time
const d = new Date();
const startTime = d.getHours();
const hourOfCreation = Math.floor(startTime * (1000/23));
const hocLength = 1000/12;
let daytimeCounter = hourOfCreation;
let timeMod = daytimeCounter;
let anniversary = true;
let day = 0;

// Images
// for my guys
const smile = new Image();
smile.src = 'smile.png';
const flame = new Image();
flame.src = 'flame.png';
// landscape
const newtree = new Image();
newtree.src = 'newtree.png';
let ph = newtree.height;
// graves
const tombstone = new Image();
tombstone.src = 'grave.png';
const tombstone2 = new Image();
tombstone2.src = 'grave2.png';
const tombstone3 = new Image();
tombstone3.src = 'grave3.png';
const obelisk = new Image();
obelisk.src = 'obelisk.png';
// Ghosts
const spectre = new Image();
spectre.src = 'Ghost.png';
// explosions
let explosions = [];

// set background gradient colours
nightcolour = [];
nightcolour[0] = '#0b154f';
nightcolour[1] = '#3e083b';
nightcolour[2] = '#58070e';
nightcolour[3] = '#552f05';
morningcolour = [];
morningcolour[0] = '#151d28';
morningcolour[1] = '#353a43';
morningcolour[2] = '#232f39';
morningcolour[3] = '#333f3b';
middaycolour = [];
middaycolour[0] = '#142e47';
middaycolour[1] = '#5c4d05';
middaycolour[2] = '#5b0c00';
middaycolour[3] = '#371603';
midnightcolour = [];
midnightcolour[0] = '#020421';
midnightcolour[1] = '#020423';
midnightcolour[2] = '#020e2b';
midnightcolour[3] = '#010005';
// set global colours / limits
glowColour = '#FFFF88';
trueWhite = '#FFFFFF';
trueBlack = '#000000';
superColour = 255;

pointerPos = new MousePosition(canvasWidth/2, canvasHeight/2);
myGuys = [];
graveStones = [];
myGhosts = [];
starfield = [];
comets = [];
trails = [];
fireflies = [];
fireflies.push(new FireFly(pointerPos.x, pointerPos.y, pointerPos, 1, glowColour));
elders = 0;
obelisks = 0;
guyID = 0;
selection = '0000';

platforms = [];
platWidth = canvasWidth/3;
platforms.push(new Platform(0, canvasHeight/2, platWidth, 10));
platforms.push(new Platform(canvasWidth-platWidth, canvasHeight/2, platWidth, 10));

// UI and messaging
basicInfo = new TextElement('15px', 'Consolas', trueWhite, 10, canvasHeight - 10);
messageBuffer = [];
let currentMessage = '';
newestMessage = new TextElement('15px', 'Consolas', trueWhite, 10, canvasHeight - 30);
let messagesToSave = canvasHeight/20;

/**
* function to update the message on the UI
* @param {string} text - the message
*/
function sendMessage(text) {
  messageBuffer.push(tickerToTime()+' ' + text);
  // store the previous 'messagesToSave' messages
  if (messageBuffer.length > messagesToSave) {
    messageBuffer.splice(0, 1);
  }
  currentMessage = messageBuffer[messageBuffer.length-1];
}

/**
* function to start the simulation
*/
function startGame() {
  myGameArea.start();
  myGuys.push(new Agent(canvasWidth*0.75, trueBottom-20, 6, 10, 'girl', 0));
  myGuys.push(new Agent(canvasWidth-(canvasWidth*0.75), trueBottom-20, 6, 10, 'boy', 1));
  sendMessage('Once upon a time...');
  let nameSeed = Math.round(Math.random()*totalMaleNames);
  myGuys[0].name = getRandomFemaleName(nameSeed);
  myGuys[1].name = getRandomMaleName(nameSeed);
  sendMessage('It was just the two of us; '+myGuys[1].name+' and '+myGuys[0].name);
  // init console data
  console.log('Scale to base is '+proportion);
  console.log(reportNames());
  // myGuys[0].elder = true;
  // elders++;
  myGuys[1].secretColour = randomColour();
  myGuys[0].secretColour = randomColour();

  for (let j = 0; j < 50; j++) {
    ranX = Math.floor(Math.random()*(canvasWidth));
    ranY = Math.floor(Math.random()*(trueBottom));
    ranSize = Math.random()*3;
    starfield.push(new Inert(ranSize, ranSize, glowColour, ranX, ranY, false));
    // myGuys.push(new Agent(ranX, ranY, 8, 10, 'girl', Math.random()));
    // myGuys[j+2].name = getRandomFemaleName();
    // graveStones.push(new Grave(ranX, trueBottom, 10*Math.random(), 0, 0, false, '#0000ff'));
    // graveStones[graveStones.length-1].timer *= Math.random()*10;
    // fireflies.push(new FireFly(ranX, ranY, pointerPos, 1, '#00ff00'));
    // fireflies[fireflies.length-1].touches = 200;
  }
}

let myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    // add listener for mouse
    this.canvas.addEventListener('mousemove', function(event) {
      pointerPos = trackMouse(event);
      fireflies[0].focus = pointerPos;
      started = true;
    });
    this.canvas.addEventListener('mousedown', function(event) {
      clickMouse(event);
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

/**
* function to redraw and recalculate everything each fram
**/
function updateGameArea() {
  if (started) {
    myGameArea.clear();
    ctx = myGameArea.context;
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(3)) {
      // fire a comet
      if (Math.random() < 0.005) {
        ranX = Math.floor(Math.random()*(canvasWidth));
        ranY = Math.floor(Math.random()*(trueBottom/2));
        comets.push(new Inert(2, 2, glowColour, ranX, ranY, false));
        comets[comets.length-1].speedX = (Math.random()*2)-1;
        comets[comets.length-1].speedY = -(Math.random()+0.1);
      }
    }
    // change the colour by time of day
    outputArray = [];
    for (let tick = 0; tick < nightcolour.length; tick++) {
      let ri = 0;
      let gi = 0;
      let bi = 0;
      let rj = 0;
      let gj = 0;
      let bj = 0;
      if (daytimeCounter < 250) {
        timeMod = daytimeCounter;
        ri = hexToRgb(midnightcolour[tick]).r;
        gi = hexToRgb(midnightcolour[tick]).g;
        bi = hexToRgb(midnightcolour[tick]).b;
        rj = hexToRgb(morningcolour[tick]).r;
        gj = hexToRgb(morningcolour[tick]).g;
        bj = hexToRgb(morningcolour[tick]).b;
      } else if (daytimeCounter < 500) {
        timeMod = daytimeCounter - 250;
        ri = hexToRgb(morningcolour[tick]).r;
        gi = hexToRgb(morningcolour[tick]).g;
        bi = hexToRgb(morningcolour[tick]).b;
        rj = hexToRgb(middaycolour[tick]).r;
        gj = hexToRgb(middaycolour[tick]).g;
        bj = hexToRgb(middaycolour[tick]).b;
      } else if (daytimeCounter < 750) {
        timeMod = daytimeCounter - 500;
        ri = hexToRgb(middaycolour[tick]).r;
        gi = hexToRgb(middaycolour[tick]).g;
        bi = hexToRgb(middaycolour[tick]).b;
        rj = hexToRgb(nightcolour[tick]).r;
        gj = hexToRgb(nightcolour[tick]).g;
        bj = hexToRgb(nightcolour[tick]).b;
      } else {
        timeMod = daytimeCounter - 750;
        ri = hexToRgb(nightcolour[tick]).r;
        gi = hexToRgb(nightcolour[tick]).g;
        bi = hexToRgb(nightcolour[tick]).b;
        rj = hexToRgb(midnightcolour[tick]).r;
        gj = hexToRgb(midnightcolour[tick]).g;
        bj = hexToRgb(midnightcolour[tick]).b;
      }
      let combr = Math.floor(ri - ((((ri - rj)/250))*timeMod));
      let combg = Math.floor(gi - ((((gi - gj)/250))*timeMod));
      let combb = Math.floor(bi - ((((bi - bj)/250))*timeMod));
      outputArray[tick] = rgbToHex(combr, combg, combb);
    }
    let tankGradient=ctx.createLinearGradient(0, 0, 0, canvasHeight);
    tankGradient.addColorStop(0, outputArray[0]);
    tankGradient.addColorStop(0.4, outputArray[1]);
    tankGradient.addColorStop(0.75, outputArray[2]);
    tankGradient.addColorStop(1, outputArray[3]);
    ctx.fillStyle=tankGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    if (daytimeCounter < 1000) {
      daytimeCounter += 0.25;
      // establish if it is the age of creation or not
      if (!anniversary && (daytimeCounter <= Math.abs(1000-(hourOfCreation + hocLength) || daytimeCounter >= hourOfCreation) && daytimeCounter <= (hourOfCreation + hocLength))) {
        anniversary = true;
        sendMessage('The Hour of Creation began');
        day ++;
      } else if (anniversary && (daytimeCounter >= Math.abs(1000-(hourOfCreation + hocLength)) || daytimeCounter >= (hourOfCreation+ hocLength))) {
        anniversary = false;
        if (day > 0) {
          sendMessage('The Hour of Creation ended ');
        }
      }
    } else {
      daytimeCounter = 1;
    }
    // fix the starfield
    recalculateStarfield();
    recalculateComets();
    for (i = starfield.length-1; i >= 0; i--) {
      starfield[i].update();
    }
    // trails
    for (i = trails.length-1; i >= 0; i--) {
      trails[i].update();
      trails[i].timer --;
      if (trails[i].timer < 0) {
        trails.splice(i, 1);
        i --;
      }
    }


    // draw the ground and the background
    // draw the tree
    ctx.globalAlpha = 0.8;
    let iw = newtree.width;
    if (ph <= 0) {
      ph = iw;
    } else {
      ph -= 100;
    }
    // center the image
    ctx.save();
    ctx.translate((canvasWidth-idealX)/2, (canvasHeight-idealY)/2);
    // scale it to the canvas width
    // ctx.scale(1/(idealY/canvasHeight), 1/(idealY/canvasHeight));
    for (let y = 0; y < iw; y++) {
      let scan = 0.3 * Math.sin((y + ph)/100);
      ctx.drawImage(newtree, 0, y, iw, 1, scan, y, iw, 1);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    let horizon = ctx.createLinearGradient(0, canvasHeight-muckLevel-5, 0, canvasHeight-muckLevel);
    horizon.addColorStop(0, 'rgba(0, 0, 0, 0)');
    horizon.addColorStop(1, trueBlack);
    ctx.fillStyle = horizon;
    ctx.fillRect(0, canvasHeight-muckLevel-5, canvasWidth, 5+muckLevel);

    // draw the platforms
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].update();
    }

    // draw the message history
    let fade = ctx.createLinearGradient(0, 0, 0, trueBottom);
    let ri = Math.round((255+(hexToRgb(outputArray[2]).r))/2);
    let gi = Math.round((255+(hexToRgb(outputArray[2]).g))/2);
    let bi = Math.round((255+(hexToRgb(outputArray[2]).b))/2);
    fade.addColorStop(0, 'rgba('+ri+', '+gi+', '+bi+', 0.05)');
    fade.addColorStop(1, 'rgba('+ri+', '+gi+', '+bi+', 0.3)');
    // Fill with gradient
    ctx.fillStyle = fade;
    for (let i = messageBuffer.length-2; i >= 0; i--) {
      ctx.fillText(messageBuffer[i], 10, 35+trueBottom-(20*(messageBuffer.length-i)));
    }

    // for graveStones
    for (let d = 0; d < graveStones.length; d++) {
      // combine adjacent gravestones
      for (let e = 0; e < graveStones.length; e++) {
        if (!graveStones[e].elder && d !== e && graveStones[d].x == graveStones[e].x && graveStones[d].y == graveStones[e].y) {
          graveStones[d].timer += graveStones[e].timer;
          graveStones.splice(e, 1);
          e--;
        }
      }
      if (graveStones[d].timer < 1) {
        let ghostSize = graveStones[d].size;
        if (graveStones[d].elder) {
          obelisks --;
          ghostSize /= 3;
        }
        myGhosts.push(new Ghost(graveStones[d].x, graveStones[d].y, ghostSize*0.8, graveStones[d].secretColour));
        sendMessage('A ghost emerged from a grave');
        graveStones.splice(d, 1);
        d--;
      } else {
        graveStones[d].update(d);
      }
    }

    // draw the Ghosts
    for (let i = 0; i < myGhosts.length; i++) {
      if (myGhosts[i].y < 0 - myGhosts[i].size*20) {
        if (Math.random() < 1/2) {
          let fireFlySize = myGhosts[i].size/3;
          if (fireFlySize < 0.5) {
            fireFlySize = 0.4;
          }
          sendMessage('A Ghost became a FireFly');
          fireflies.push(new FireFly(myGhosts[i].x, myGhosts[i].y, fireflies[fireflies.length-1], fireFlySize, myGhosts[i].secretColour));
          fireflies[fireflies.length-1].touches = 200;
        }
        myGhosts.splice(i, 1);
        i--;
      } else {
        myGhosts[i].update();
      }
    }
    // sort the guys
    myGuys.sort(function(obj1, obj2) {
      // Ascending by phase
      return (obj1.health) - (obj2.health);
    });

    // for my guys
    // global and prep first
    // check for both sexes
    let malePresent = false;
    let femalePresent = false;
    for (let i = 0; (!malePresent || !femalePresent) && i < myGuys.length; i++) {
      if (!myGuys[i].elder && myGuys[i].gender == 'girl') {
        femalePresent = true;
      } else if (!myGuys[i].elder) {
        malePresent = true;
      }
    }
    if (!malePresent || !femalePresent) {
      ranX = Math.floor(Math.random()*(canvasWidth));
      ranY = Math.floor(Math.random()*(trueBottom));
      randSize = 5 + (Math.random()*10);
      let nameSeed = Math.round(Math.random()*totalMaleNames);
      if (!malePresent) {
        myGuys.push(new Agent(ranX, ranY, 5, randSize, 'boy', Math.random()));
        myGuys[myGuys.length-1].name = getRandomMaleName(nameSeed);
      } else {
        myGuys.push(new Agent(ranX, ranY, 5, randSize, 'girl', Math.random()));
        myGuys[myGuys.length-1].name = getRandomFemaleName(nameSeed);
      }
      sendMessage('A stranger called '+myGuys[myGuys.length-1].name+' appeared');
    }

    // firefly logic
    for (let f = 0; f < fireflies.length; f++) {
      fireflies[f].touchedThisFrame = false;
      if (fireflies[f].touches >= 400) {
        sendMessage('A FireFly was overwhelmed');
        // create the explosion
        explosions.push(new Explosion(fireflies[f].x, fireflies[f].y, '#FF2288', glowColour));
        produceExplosion(fireflies[f].x, fireflies[f].y);
        // if this was the main FireFly, 'respawn' it
        if (f == 0) {
          fireflies[f].touches = 0;
          fireflies[f].y = 0;
          fireflies[f].x = Math.random()*canvasWidth;
          fireflies[f].speedX = 0;
          fireflies[f].speedY = 0;
        } else {
          // otherwise, kill it
          fireflies.splice(f, 1);
          f--;
        }
      }
    }

    for (let i = 0; i < explosions.length; i++) {
      if (explosions[i].timer < 200) {
        explosions[i].timer += 4;
        explosions[i].update();
      } else {
        explosions.splice(i, 1);
        i--;
      }
    }

    recalculateMyGuys();
    for (let i = 0; i < myGuys.length; i++) {
      myGuys[i].i = i+' of '+myGuys[i].length;
      myGuys[i].update();
    }


    // for fireflies
    // set the focus of all expcept the main one
    for (let f = 1; f < fireflies.length; f++) {
      fireflies[f].focus = fireflies[0];
    }
    // draw ther trails, log touches, then update
    for (let f = 0; f < fireflies.length; f++) {
      trails.push(new Particle(fireflies[f].size/15, glowColour, fireflies[f].x, fireflies[f].y, fireflies[f].speedX, fireflies[f].speedY));
      if (fireflies[f].touchedThisFrame) {
        fireflies[f].touches += 1;
      } else if (f == 0 && fireflies[f].touches > 0) {
        fireflies[f].touches -= 1;
      }
      fireflies[f].update();
    }
    basicInfo.text = tickerToTime() +' Day '+day+' Mates '+ myGuys.length+ ' Elders '+elders+' Fireflies '+fireflies.length;
    basicInfo.update();
    newestMessage.text = currentMessage;
    newestMessage.update();
    // filter
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = outputArray[2];
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = 1;
  }
}

/**
* function to count the intervals
* @param {int} n - the frame
* @return {boolean}
*/
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
/**
* function to describe a platform
* @param {int} x - the x coordinate
* @param {int} y - the y coordinate
* @param {int} width - the width
* @param {int} height - the height
*/
function Platform(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.update = function() {
    ctx.fillStyle = trueBlack;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

/**
* function for a piece of plain text
* @param {int} width - the width
* @param {int} height - the height
* @param {string} colour - the colour
* @param {int} x - the x pos
* @param {int} y - the y pos
*/
function TextElement(width, height, colour, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.colour = colour;
  this.update = function() {
    ctx.globalAlpha = 0.7;
    ctx.font = this.width + ' ' + this.height;
    ctx.fillStyle = this.colour;
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = 1;
  };
}

/**
* function for a firefly
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {object} focus - the firefly's focus
* @param {int} size - the size
* @param {string} secretColour - the colour
*/
function FireFly(x, y, focus, size, secretColour) {
  this.x = x;
  this.y = y;
  this.focus = focus;
  this.speedX = 0;
  this.speedY = 0;
  this.size = size*20;
  this.touches = 0;
  this.touchedThisFrame = false;
  this.secretColour = secretColour;
  this.update = function() {
    if (this.x < 0 || this.x > canvasWidth) {
      this.speedX *= -0.99;
      if (this.x < 0) {
        this.x = ((2.5*this.size)/20);
      } else {
        this.x = canvasWidth - ((2.5*this.size)/20);
      }
    }
    if (this.y < 0 || this.y > trueBottom) {
      this.speedY *= -0.99;
      if (this.y > trueBottom) {
        this.y = trueBottom-10;
      } else {
        this.y += (2.5*this.size)/20;
      }
    }

    let diffx = this.focus.x - this.x;
    let diffy = this.focus.y - this.y;
    let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);

    if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
      // if we are going right and it's to our right
      // if we are going left and it's to our left
    } else {
      this.speedX *= 0.99;
    }
    if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
      // if we are going up and it's above
      // if we are going down and it's below
    } else {
      this.speedY *= 0.99;
    }

    this.speedX += 0.05*Math.cos(targetangle);
    this.speedY += 0.05*Math.sin(targetangle);
    applySpeedLimit(this);
    this.x += this.speedX;
    this.y += this.speedY;

    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 100);
    let ri = hexToRgb(this.secretColour).r;
    let gi = hexToRgb(this.secretColour).g;
    let bi = hexToRgb(this.secretColour).b;
    let rj = hexToRgb('#FF2288').r;
    let gj = hexToRgb('#FF2288').g;
    let bj = hexToRgb('#FF2288').b;
    let combr = Math.floor(ri - ((((ri - rj)/400)))*this.touches);
    let combg = Math.floor(gi - ((((gi - gj)/400)))*this.touches);
    let combb = Math.floor(bi - ((((bi - bj)/400)))*this.touches);
    let newC = rgbToHex(combr, combg, combb);
    glow.addColorStop(0, newC);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // Fill with gradient
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.15*this.size/40;// - (this.touches/2000);
    // make it flicker when touched
    if (this.touchedThisFrame) {
      ctx.globalAlpha *= 0.9;
    }
    ctx.beginPath();
    // ctx.fillStyle = glowColour;
    ctx.arc(this.x, this.y, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.fillStyle = trueWhite;
    ctx.arc(this.x, this.y, (2.5*this.size)/20, 0, 2 * Math.PI);
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
* @param {string} secretColour - the colour
*/
function Grave(x, y, size, speedX, speedY, elder, secretColour) {
  this.x = x;
  this.y = y + 10;
  this.speedX = speedX/2;
  this.speedY = speedY/1000;
  this.timer = 200;
  this.hitBottom = false;
  this.elder = elder;
  this.tended = 0;
  this.secretColour = secretColour;
  // elders spawn obelisks
  if (this.elder) {
    this.image = obelisk;
    this.size = size*1.5;
    obelisks ++;
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
  this.update = function(d) {
    if (!this.elder) {
      this.timer -= 0.075;
    }
    if (!this.hitBottom && this.y < trueBottom-(this.size*5)) {
      let mass = gravity*this.size*this.size;
      this.speedX *= 0.99;
      this.speedY += mass*gravity;
      applySpeedLimit(this);
      this.y += this.speedY/2;
      this.x += this.speedX/2;
      if (this.x < this.size || this.x > canvasWidth-this.size) {
        this.speedX *= -0.99;
        if (this.x < this.size) {
          this.x = this.size;
        } else {
          this.x = canvasWidth-this.size;
        }
      }
    } else {
      this.hitBottom = true;
      this.y = trueBottom - (this.size*5);
      this.speedY = -1;
      this.speedX *= 0.9;
    }

    // sparks emanating from graves
    if (this.tended > 0) {
      let step = 100-(this.timer);
      step -= Math.floor(step);
      step *= 10;
      ctx.fillStyle = glowColour;
      ctx.font = '7px' + ' ' + globalFont;
      ctx.globalAlpha = 0.2*(this.timer/100);
      ctx.fillText('*', this.x, this.y+(5*this.size)-(2*step));
      this.tended --;
    }
    ctx.globalAlpha = 0.2+(this.timer/100);
    ctx.drawImage(this.image, this.x-(this.size), this.y+this.size*3, this.size*2, this.size*2);
    ctx.globalAlpha = 1;
  };
}

/**
* function for a Ghost
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} gender - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Agent(x, y, bodySize, maxSize, gender, ears) {
  this.i = ''; // temp for debug
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.colour = trueBlack;
  this.secretColour = this.colour;
  this.ears = ears;
  this.angleToFocus = 0;
  this.size = bodySize;
  this.limbLength = (this.size*1.5);
  this.maxSize = maxSize;
  this.hitBottom = false;
  this.sitting = false;
  this.health = 100;
  this.love = 0;
  this.energy = 100;
  this.phase = 0; // awake phase 1 is asleep phase
  this.children = 0;
  this.id = ('0000' + guyID).slice(-4);
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = 'UNSPECIFIED';
  guyID++;
  this.elder = false;
  this.supersaiyan = 0;
  this.focus = fireflies[0];
  // reset rotation
  this.resetRotation = function(fastest) {
    // if we are close enough, just stop

    // if we want to do this the quickest way
    if (fastest) {
      if (this.rotation > 3) {
        this.rotation += 0.1;
      } else if (this.rotation < -3) {
        this.rotation -= 0.1;
      } else if (this.rotation > 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }
      // if we want to spin down
    } else {
      if (this.spin < 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }
    }
    if (Math.abs(this.rotation) <= 0.5 || Math.abs(this.rotation) >= 5.5) {
      this.spin = 0;
      this.rotation = 0;
    }
  };
  // jump semi-randomly
  this.jump = function() {
    // decide what to aim for
    if (this.elder && graveStones.length > 0) {// }&& this.anniversary) {
      if (!anniversary || obelisks == 0 ) {
        // if it's a regular time of day, or there are no obelsisks, just go for the shittiest gravestone to maintain it
        this.focus = graveStones[this.findClosestGrave()];
        if (this.focus == 0) {
          this.focus = fireflies[this.findClosestFireFly()];
        }
      } else {
        // if it's a special time of day and there are obelisks, go for the best gravestone and make babies out of it
        this.focus = graveStones[this.findClosestObelisk()];
      }
    } else {
      this.focus = fireflies[this.findClosestFireFly()];
    }

    if (this.focus.y <= this.y) {
      let jumpImpetus = Math.random();
      if (jumpImpetus <= 0.05 && this.focus.y <= this.y) {
        this.speedY = -this.size;
        let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
        this.speedX += 50*Math.cos(targetangle);
        this.speedY += 70*Math.sin(targetangle);
        this.y--;
        this.energy -= 7;
        this.sitting = false;
        return true;
      }
    } else {
      if (!this.supersaiyan && this.y < trueBottom-(this.size)-(this.limbLength/2.5)) {
        this.sitting = true;
      }
      return false;
    }
  };
  this.findClosestFireFly = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let i=0; i < fireflies.length; i++) {
      let tmpX = this.x-fireflies[i].x;
      let tmpY = this.y-fireflies[i].y;
      let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
      if (distance < tmp) {
        tmp = distance;
        target = i;
      }
    }
    if (target == 'X') {
      console.log('no FireFly to target');
      return 0;
    }
    return target;
  };

  this.findClosestGrave = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let i=0; i < graveStones.length; i++) {
      if (graveStones[i].timer < 100) {
        let tmpX = this.x-graveStones[i].x;
        let tmpY = this.y-graveStones[i].y;
        let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
        if (distance < tmp) {
          tmp = distance;
          target = i;
        }
      }
    }
    if (target == 'X') {
      console.log('no viable target found');
      return 0;
    }
    return target;
  };

  this.findClosestObelisk = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let i=0; i < graveStones.length; i++) {
      if (graveStones[i].elder) {
        let tmpX = this.x-graveStones[i].x;
        let tmpY = this.y-graveStones[i].y;
        let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
        if (distance < tmp) {
          tmp = distance;
          target = i;
        }
      }
    }
    if (target == 'X') {
      // console.log('no viable target found');
      return 0;
    }
    return target;
  };

  // check for bounce on walls
  this.physicsCheck = function() {
    this.hitBottom = false;
    let hitPlatform = false;
    for (let i = 0; i < platforms.length && !hitPlatform; i++) {
      if (this.x >= platforms[i].x && this.x <= platforms[i].x + platforms[i].width && this.y >= platforms[i].y-(this.size)-(this.limbLength/2.5) && this.y <= platforms[i].y+ platforms[i].height && this.speedY >= 0) {
        this.y = platforms[i].y-(this.size)-(this.limbLength/2.5);
        hitPlatform = true;
        this.hitAFloor();
      }
    }

    if (this.x < this.size || this.x >= canvasWidth-this.size) {
      this.speedX *= -0.9;
      let targetangle = Math.atan2(this.y, 0);
      this.spin += elasticity*targetangle/10;
      if (this.x < this.size) {
        this.x = this.size;
      } else {
        this.x = canvasWidth-this.size;
      }
    }
    if (this.y < this.size) {
      this.speedY *= -0.9;
      this.y = this.size;
      // calculate rotation on collision with roof
      let targetangle = Math.atan2(0, this.x);
      this.spin += elasticity*targetangle/10;
    }
    if (!this.hitBottom && this.y >= trueBottom-(this.size)-(this.limbLength/2.5)) {
      this.y = trueBottom-(this.size)-(this.limbLength/2.5);
      this.hitAFloor();
    }
  };
  this.hitAFloor = function() {
    this.hitBottom = true;
    this.sitting = false;
    // apply floor forces
    this.speedY = 0;
    this.speedX *= 0.9;
    this.resetRotation(false);
    // jump occasionally
    if (this.rotation == 0 && this.phase == 0 && this.hitBottom && this.jump()) {
      this.health -= 1;
    } else if (this.energy <= 0) {
      // fall asleep when tired
      this.phase = 1;
      this.speedX = 0;
      this.rotation = 0;
      this.spin = 0;
    }
  };
  this.update = function() {
    // calculate angle to focus
    this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
    diffx = Math.cos(this.angleToFocus)*4;
    diffy = Math.sin(this.angleToFocus)*4;
    // setting leg angle
    let sameDirection = false;
    let offsetX = Math.abs(this.focus.x - this.x);
    let legAngle = Math.atan2(this.speedY, this.speedX);

    // calculate colour
    this.colour = colourIndicator(this);
    let ri = hexToRgb(this.secretColour).r;
    let gi = hexToRgb(this.secretColour).g;
    let bi = hexToRgb(this.secretColour).b;
    let rj = hexToRgb(this.colour).r;
    let gj = hexToRgb(this.colour).g;
    let bj = hexToRgb(this.colour).b;
    combr = Math.round((ri+ri+rj)/3);
    combg = Math.round((gi+gi+gj)/3);
    combb = Math.round((bi+bi+bj)/3);
    this.colour = rgbToHex(combr, combg, combb);
    ctx.fillStyle= this.colour;


    for (let f = 0; f < fireflies.length; f++) {
      if (!fireflies[f].touchedThisFrame && this.phase == 0 && this.energy > 0 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        this.focus = fireflies[f];
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX*this.size)/2000;
        fireflies[f].speedY += (this.speedY*this.size)/2000;// + (0.002 * this.size);
        if (this.health >= 95 && this.love >= 95 && this.energy >= 95 && this.size >= 10) {
          // let go of the FireFly
          this.speedY = -20;
        } else {
          let thisMiddleX = this.x;
          let thisMiddleY = this.y;
          let otherMiddleX = this.focus.x;
          let otherMiddleY = this.focus.y;
          let diffx = otherMiddleX - thisMiddleX;
          let diffy = otherMiddleY - thisMiddleY;

          if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
            // if we are going right and it's to our right
            // if we are going left and it's to our left
          } else {
            this.speedX *= 0.1;
          }
          if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
            // if we are going up and it's above
            // if we are going down and it's below
          } else {
            this.speedY *= 0.1;
          }
          let targetangle = Math.atan2(otherMiddleY - thisMiddleY, otherMiddleX - thisMiddleX);
          this.speedX += Math.cos(targetangle);
          this.speedY += Math.sin(targetangle);
          // give them love, energy and health
          // grow the little fuckers
          if (this.size < this.maxSize) {
            this.size += this.size/125;
          }
          this.speedY -= 1;
          this.limbLength = (this.size*1.5);
          this.size = this.size;
          if (this.energy <= 99.4) {
            this.energy += 0.6;
          }
          if (this.love <= 98) {
            this.love += 2;
          }
          if (this.health <= 96) {
            this.health += 4;
          }
          if (this.speedX < 10 && this.speedX > -10 && this.speedY < 10 & this.speedY > -10) {
            // legAngle = -1.6;
          }
        }
      }
    }
    legAngle = Math.atan2(this.focus.y - this.y, offsetX);
    if (legAngle < -0.2) {
      sameDirection = true;
    }

    // drawing
    ctx = myGameArea.context;
    ctx.globalAlpha = 1;
    let sleepshift = 0;
    if (this.phase == 1) {
      sleepshift = this.limbLength+(this.size/4);
    }


    if (this.phase == 0 && this.energy > 0) {
      ctx.lineWidth = this.size/2.5;
      ctx.strokeStyle = this.colour;

      // legs
      let shadow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*0.8);
      shadow.addColorStop(0, trueBlack);
      shadow.addColorStop(1, this.colour);
      ctx.strokeStyle = shadow;
      ctx.save(); // 0 open - rotated
      ctx.translate(this.x, this.y);
      if (!this.hitBottom) {
        ctx.rotate(this.rotation);
      }

      ctx.save(); // 1 open
      ctx.translate(-(this.size/2), (this.size/2));
      // don't rotate if we have hit the bottom
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(legAngle);
        }
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.limbLength/1.2);
      ctx.stroke();
      ctx.restore(); // 1 close
      ctx.save(); // 1 open
      ctx.translate((this.size/2), (this.size/2));

      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(-legAngle);
        }
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.limbLength/1.2);
      ctx.stroke();
      ctx.restore(); // 1 close
      ctx.restore(); // 0 close
      ctx.strokeStyle = this.colour;
    }
    // label
    if (selection == this.id || this.id == '0000' || this.id == '0001') {
      ctx.fillStyle = glowColour;
      ctx.font = '10px' + ' ' + globalFont;
      let shift = this.name.length*5.6/2;
      ctx.fillText(this.name, this.x-shift, this.y-(this.size*2));
    }
    // translate before drawing again
    ctx.fillStyle = this.colour;
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);

    // tail
    ctx.save();
    // make it flap
    let tmp = Math.abs(daytimeCounter-this.birthday);
    while (tmp > 30 && tmp > 0) {
      tmp -= 30; // 0 to 30
    }
    tmp = Math.abs(tmp-15); // 0 to 15 to 0 to 15

    if (!this.hitBottom) {
      tmp = 0;
      ctx.rotate(90 * Math.PI / 180);
      ctx.rotate(Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.phase == 1) {
      ctx.translate(0, sleepshift);
    }
    ctx.beginPath();
    ctx.moveTo(0, this.size/1.5);
    ctx.arc(this.size*(-tmp+7.5)/8, -this.size*1.5, this.size/3, 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(0, this.size/3);
    let tailGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*2);
    tailGradient.addColorStop(0, trueBlack);
    tailGradient.addColorStop(1, this.colour);
    ctx.fillStyle = tailGradient;
    ctx.fill();
    if (!this.hitBottom) {
      ctx.rotate(-Math.atan2(-this.speedY, -this.speedX));
    }
    ctx.restore();

    // aura and trail on supersaiyans
    if (this.supersaiyan > 0) {
      // flame aura
      ctx.globalAlpha = (this.supersaiyan-50)/50;
      ctx.drawImage(flame, -this.size*1.5, -(this.size*2), this.size*3, this.size*3);
      if (this.speedY < 0) {
        trails.push(new Particle(this.size/4, this.colour, this.x-(this.size/2), this.y, this.speedX*0.5, this.speedY*0.5));
        trails.push(new Particle(this.size/4, this.colour, this.x+(this.size/2), this.y, this.speedX*0.5, this.speedY*0.5));
        trails.push(new Particle(this.size/3, this.colour, this.x, this.y, this.speedX, this.speedY));
      }
      let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.supersaiyan);
      glow.addColorStop(0, glowColour);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(0, 0, this.supersaiyan, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = this.colour;
      ctx.globalAlpha = 1;
    }
    ctx.rotate(this.rotation);


    if (this.sitting) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    }

    // ears
    ctx.save();
    if (this.phase == 0) {
      ctx.translate(-this.size, -this.size/2);
    } else {
      ctx.translate(-this.size, sleepshift);
    }
    oneq = this.size/2;
    ctx.beginPath();
    ctx.moveTo(0, +this.size/2);
    ctx.lineTo(0-(this.ears*8), -this.size+(this.size*this.ears/2));
    ctx.lineTo(oneq*2, -(this.size*this.ears)/4);
    ctx.lineTo((oneq*4)+(this.ears*8), -this.size+(this.size*this.ears/2));
    ctx.lineTo(oneq*4, +this.size/2);
    let earGradient=ctx.createLinearGradient(0, -this.size, 0, this.limbLength/2);
    earGradient.addColorStop(0, this.colour);
    earGradient.addColorStop(1, trueBlack);
    ctx.fillStyle = earGradient;
    ctx.fill();
    ctx.restore();


    // head
    if (this.phase == 0) {
      // awake mode
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
      // smile
      if (this.health >= 50 && !this.elder && this.energy > 0) {
        ctx.globalAlpha = this.love/100;
        ctx.drawImage(smile, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
        ctx.globalAlpha = 1;
      }
    } else {
      // sleep mode
      ctx.beginPath();
      ctx.arc(0, this.limbLength+(this.size/2), this.size, 3.15, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // draw a halo on an elder
    if (this.elder && this.phase == 0) {
      ctx.rotate(-this.rotation);
      let aura = ctx.createLinearGradient(0, this.y-(this.size*3)-(this.size/2), 0, -this.size);
      aura.addColorStop(0, 'rgba(0, 0, 0, 0)');
      aura.addColorStop(1, this.secretColour);
      ctx.strokeStyle = aura;
      ctx.lineWidth *= 0.6;
      ctx.beginPath();
      ctx.ellipse(0, -(this.size*1.25), this.size/3.3, this.size*0.9, Math.PI / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.rotate(this.rotation);
    }


    // zzzzs
    if (this.phase == 1) {
      ctx.fillStyle = 'white';
      ctx.font = '10px' + ' ' + globalFont;
      let amntToMove = this.energy; // 0 to 10
      while (amntToMove > 10) {
        amntToMove -= 10;
      }
      if (amntToMove < 0) {
        amntToMove += 10;
      }
      ctx.globalAlpha = (1 - (amntToMove/10))/2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size-amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size-7-amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size-14-amntToMove);
      ctx.globalAlpha = 1;
    }

    // eyes
    diffy = 0.5;
    ctx.lineWidth = 1.5;
    if (this.phase == 0) {
      ctx.globalAlpha = 0.9;
      // left eye
      ctx.beginPath();
      ctx.fillStyle = trueBlack;
      ctx.save(); // 1 open
      ctx.translate(-this.size/2, -(this.size/4));
      ctx.arc(0, 0, this.size/2.25, 0, 2 * Math.PI);
      ctx.fill();
      // draw highlights
      if (this.energy > 0) {
        ctx.beginPath();
        ctx.fillStyle = trueWhite;
        ctx.rotate(-this.rotation);
        ctx.arc(0, -this.size/7, this.size/6, 0, 2 * Math.PI);
        ctx.arc(-this.size/7, this.size/5, this.size/12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate(this.rotation);
      }
      ctx.restore(); // 1 closed
      // right eye
      ctx.beginPath();
      ctx.fillStyle = trueBlack;
      ctx.save(); // 1 open
      ctx.translate(this.size/2, -(this.size/4));
      ctx.arc(0, 0, this.size/2.25, 0, 2 * Math.PI);
      ctx.fill();
      // draw highlights
      if (this.energy > 0) {
        ctx.beginPath();
        ctx.fillStyle = trueWhite;
        ctx.rotate(-this.rotation);
        ctx.arc(0, -this.size/7, this.size/6, 0, 2 * Math.PI);
        ctx.arc(this.size/6, this.size/5, this.size/12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate(this.rotation);
      }
      ctx.restore(); // 1 closed
      // eyelids
      if (this.energy < 0) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.arc(-(this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore(); // close 0
    // hands
    ctx.lineWidth = this.size/3.33;
    ctx.fillStyle = this.colour;
    ctx.strokeStyle = this.colour;
    // let shadow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size/2);
    // shadow.addColorStop(0, trueBlack);
    // shadow.addColorStop(1, this.colour);
    // ctx.strokeStyle = shadow;

    // put your front legs down if you are on the floor and healthy
    if (this.phase == 0 && this.hitBottom) {
      ctx.save(); // 0 open
      ctx.translate(this.x, this.y);
      if (!this.sitting) {
        ctx.beginPath();
        ctx.moveTo(-this.size+(this.size/1.6), this.size*0.8);
        ctx.lineTo(-this.size+(this.size/1.6), this.limbLength);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.size-(this.size/1.6), this.size*0.8);
        ctx.lineTo(this.size-(this.size/1.6), this.limbLength);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(-this.size+(this.size/1.6), this.limbLength, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.size-(this.size/1.6), this.limbLength, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    } else {
      // if we are holding something
      if (this.phase == 0 && detectCollision(this, this.focus)) {
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(-this.size+(this.size/7), (this.size/2));
        ctx.restore(); // 0 closed
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(this.size-(this.size/7), (this.size/2));
        ctx.restore(); // 0 closed
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        // if we are not holding anything
      } else if (this.phase == 0 && this.energy > 0) {
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x-this.size+(this.size/7), this.y+(this.size/2));
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(-this.rotation);
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x+this.size-(this.size/7), this.y+(this.size/2));
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(-this.rotation);
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
      }
    }
    ctx.globalAlpha = 1;
  };
}
/**
* function for a Ghost
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} size - the size
* @param {string} secretColour - the colour
*/
function Ghost(x, y, size, secretColour) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speedX = 0;
  this.speedY = 0;
  this.secretColour = secretColour;
  this.update = function() {
    // start floating up if the main FireFly is below you
    if (this.y > fireflies[0].y) {
      this.speedY = -Math.abs(0.025*(15-this.size));
    } else {
      this.speedY *= 0.9995;
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
    this.speedX += 0.001*Math.cos(targetangle);
    applySpeedLimit(this);
    this.x += this.speedX;
    this.y += this.speedY;
    ctx.globalAlpha = 0.1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(-trueBottom, this.speedX*500));
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(spectre, -(this.size), -(this.size), this.size*2, this.size*4);
    ctx.restore();
    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.size*20);
    glow.addColorStop(0, glowColour);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // Fill with gradient
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*20, 0, 2 * Math.PI);
    ctx.fill();
  };
}

/**
* the mouse position object
* @param {int} x - the x position
* @param {int} y - the y position
*/
function MousePosition(x, y) {
  this.x = x;
  this.y = y;
  this.size = 10;
}

/**
* function to track where the mouse is
* @param {event} e - the mousemove event
* @return {MousePosition} mouse - the XY pointer
*/
function trackMouse(e) {
  let mouseX;
  let mouseY;
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
  let mouse = new MousePosition(mouseX, mouseY);
  return mouse;
}

/**
* function to detect a collision between two objects
* @param {Lifeform} thisobj - the first object
* @param {lifeform} otherobj - the second object
* @return {boolean} whether they collided or not
*/
function detectCollision(thisobj, otherobj) {
  let myleft = thisobj.x-5;
  let myright = thisobj.x + (thisobj.size)+5;
  let mytop = thisobj.y-5;
  let mybottom = thisobj.y + (thisobj.size)+5;
  let otherleft = otherobj.x;
  let otherright = otherobj.x + (otherobj.size);
  let othertop = otherobj.y;
  let otherbottom = otherobj.y + (otherobj.size);
  let crash = true;
  if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
    crash = false;
  }
  return crash;
}


/**
* function to return health number / 100 as colour
* @param {object} creature - the creature to calculate the colour for
* @return {string} - the colour as a hex value
*/
function colourIndicator(creature) {
  let health = Math.floor((255*creature.health)/100);
  let love = 0;
  if (creature.love > 0) {
    love = Math.round((255*creature.love)/100);
  } else {
    love = 0;
  }
  let quirk = 122;
  if (!creature.elder) {
    quirk = -creature.speedY - Math.abs(creature.speedX);// ((creature.speedX*creature.speedX) + (creature.speedY*creature.speedY))/2;
    if (quirk < 0) {
      quirk = 0;
    } else if (quirk > 100) {
      quirk = 100;
    }
    quirk *= 2.55/5;
  }
  // handle super saiyan colours
  if (creature.supersaiyan > 0) {
    love += creature.supersaiyan*((superColour - love)/100); // 0 to 255
    health += creature.supersaiyan*((superColour - health)/100); // 0 to 255
    quirk += creature.supersaiyan*((superColour - quirk)/100); // 0 to 255
  }
  // make brightness of colour relative to health
  let modifier = Math.floor(creature.health)/100; // modifier range 0 to 1
  // console.log(modifier+' x '+love+' = '+modifier*love);
  love = Math.round(modifier*love);
  quirk = Math.round(modifier*quirk);
  health = Math.round(modifier*health);
  if (love < 0) {
    love = 0;
  } else if (love > 255) {
    love = 255;
  }
  if (health > 255) {
    health = 255;
  } else if (health < 0) {
    health = 0;
  }
  if (quirk > 255) {
    quirk = 255;
  } else if (quirk < 0) {
    quirk = 0;
  }
  if (creature.gender == 'girl') {
    return rgbToHex(love, quirk, health);
  }
  return rgbToHex(quirk, love, health);
}

/**
* function to handle myGuys
*/
function recalculateMyGuys() {
  // block for all my guys
  for (let i = 0; i < myGuys.length; i++) {
    if (myGuys[i].size >= myGuys[i].maxSize && myGuys[i].supersaiyan == 0 && myGuys[i].health >= superThreshold && myGuys[i].energy >= superThreshold && myGuys[i].love >= superThreshold) {
      explosions.push(new Explosion(myGuys[i].x, myGuys[i].y, myGuys[i].secretColour, glowColour));
      produceExplosion(myGuys[i].x, myGuys[i].y);
      myGuys[i].supersaiyan = 100;
      myGuys[i].speedX = 0;
      myGuys[i].speedY = 0;
      sendMessage(myGuys[i].name+' reached nirvana');
    }
    // check to see if it's time to die
    // attrition, aging etc.
    if (myGuys[i].birthday == daytimeCounter+1) {
      myGuys[i].age ++;
    }
    if (myGuys[i].health <= 0) {
      if (myGuys[i].elder) {
        sendMessage('Elder '+myGuys[i].name+' died');
        elders--;
      }
      graveStones.push(new Grave(myGuys[i].x, myGuys[i].y, myGuys[i].size, myGuys[i].speedX, myGuys[i].speedY, myGuys[i].elder, myGuys[i].secretColour));
      sendMessage(myGuys[i].name+' died');
      myGuys.splice(i, 1);
      i--;
    } else {
      // grow them a tiny bit
      if (this.size < this.maxSize) {
        this.size += this.size/1000;
      }
      if (!myGuys[i].supersaiyan == 0 && myGuys[i].supersaiyan <= 50) {
        sendMessage(myGuys[i].name+'\'s nirvana ended');
        myGuys[i].supersaiyan = 0;
      } else if (myGuys[i].supersaiyan > 0) {
        myGuys[i].supersaiyan -= 0.05;
        myGuys[i].energy = 100;
      }
      if (myGuys[i].love > 0.2 && myGuys[i].love < 100) {
        myGuys[i].love -= 0.25;
      } else if (myGuys[i].love > 100) {
        myGuys[i].love = 100;
      }
      if (myGuys[i].speedY < 0) {
        myGuys[i].health -= 0.1;
      }
      // if asleep, gain energy and a little health
      if (myGuys[i].phase == 1) {
        myGuys[i].energy += 0.25;
        myGuys[i].health += 0.1;
      }
      // if energy goes above 100, wake up
      if (myGuys[i].phase == 1 && myGuys[i].energy > 90) {
        myGuys[i].phase = 0;
        // console.log('woke up');
      }
      if (myGuys[i].health > 100) {
        myGuys[i].health = 100;
      }

      // if you're a supersaiyan and you hit a grave ...

      // if you're an elder and you hit your focus (a grave or obelisk)
      for (let f = 0; f < fireflies.length; f++) {
        if (myGuys.length <= 100 && myGuys[i].elder && myGuys[i].phase == 0 && myGuys[i].focus!== fireflies[f]) {
          if (detectCollision(myGuys[i], myGuys[i].focus)) {
            myGuys[i].speedX *=0.5;
            myGuys[i].speedY *=0.5;
            if ((!myGuys[i].focus.elder || !anniversary)) {
              myGuys[i].focus.tended = 50;
              myGuys[i].focus.timer += 30;
              let ri = hexToRgb(myGuys[i].secretColour).r;
              let gi = hexToRgb(myGuys[i].secretColour).g;
              let bi = hexToRgb(myGuys[i].secretColour).b;
              let rj = hexToRgb(glowColour).r;
              let gj = hexToRgb(glowColour).g;
              let bj = hexToRgb(glowColour).b;
              combr = Math.round((ri+rj)/2);
              combg = Math.round((gi+gj)/2);
              combb = Math.round((bi+bj)/2);
              let newC = rgbToHex(combr, combg, combb);
              starfield.push(new Inert(3, 3, newC, myGuys[i].focus.x, myGuys[i].focus.y+(5*myGuys[i].focus.size), true));
              myGuys[i].health += 0.5;
            } else {
              myGuys[i].focus.timer -= 20;
              myGuys[i].love += 10;
              let msgString = (generateBaby(myGuys[i], myGuys[i]))+' called ';
              let nameSeed = Math.round(Math.random()*totalMaleNames);
              if (myGuys[myGuys.length-1].gender == 'boy') {
                myGuys[myGuys.length-1].name = getRandomMaleName(nameSeed);
              } else {
                myGuys[myGuys.length-1].name = getRandomFemaleName(nameSeed);
              }
              sendMessage('A baby '+msgString+myGuys[myGuys.length-1].name+' was sprouted at an obelisk');
            }
          }
        }
      }

      for (let j = 0; j < myGuys.length; j++) {
        // if two guys bump into each other
        if (i !== j && detectCollision(myGuys[i], myGuys[j])) {
          // spread the love
          // let loveDiff = (myGuys[j].love + myGuys[i].love)/2;
          // myGuys[i].love = (loveDiff/2)+(myGuys[i].love/2);
          // myGuys[j].love = (loveDiff/2)+(myGuys[j].love/2);
        }

        if (i !== j && myGuys[i].phase == 0 && myGuys[j].phase == 0 && detectCollision(myGuys[i], myGuys[j])) {
          collide(myGuys[i], myGuys[j]);
          // having a baby
          if (myGuys.length <= 100 && !(myGuys[i].gender == myGuys[j].gender) && myGuys[i].supersaiyan == 0 && myGuys[j].supersaiyan == 0 && !myGuys[i].elder && !myGuys[j].elder && (myGuys[i].love + myGuys[j].love) >= 90
          && myGuys[i].health >= 50 && myGuys[j].health >= 50 && myGuys[i].energy >= 50 && myGuys[j].energy >= 50 && myGuys[i].size >= myGuys[i].maxSize && myGuys[j].size >= myGuys[j].maxSize) {
            // generate a baby
            let msgString = 'error';
            if (myGuys[i].gender == 'boy') {
              msgString = (generateBaby(myGuys[i], myGuys[j]))+' called ';
              myGuys[myGuys.length-1].name = generateBabyName(myGuys[i].name, myGuys[j].name, myGuys[myGuys.length-1].gender);
            } else {
              msgString = (generateBaby(myGuys[j], myGuys[i]))+' called ';
              myGuys[myGuys.length-1].name = generateBabyName(myGuys[j].name, myGuys[i].name, myGuys[myGuys.length-1].gender);
            }
            if (myGuys[myGuys.length-1].name == null) {
              console.log('null name, parents were '+myGuys[i].name+' and '+myGuys[j].name);
            }
            sendMessage('A '+msgString+myGuys[myGuys.length-1].name+' was born');
            // pay the costs
            myGuys[i].children ++;
            myGuys[j].children ++;
            myGuys[i].health -= 20;
            myGuys[j].health -= 20;
            myGuys[i].energy -= 35;
            myGuys[j].energy -= 35;
            myGuys[i].love += 30;
            myGuys[j].love += 30;
          }
        }
      }
      // set elder status
      if (!myGuys[i].elder && elders+1 <= myGuys.length/8 && myGuys[i].children >= 6) {
        myGuys[i].elder = true;
        myGuys[i].size*=0.8;
        sendMessage(myGuys[i].name+' became an Elder');
        elders++;
      } else if (elders > 1 && elders > myGuys.length/8 && myGuys[i].elder) {
        // myGuys[i].elder = false;
        // elders --;
        // sendMessage('An elder gave up their position');
      }

      // calculate angle to focus
      myGuys[i].angleToFocus = Math.atan2(myGuys[i].focus.y - myGuys[i].y, myGuys[i].focus.x - myGuys[i].x);
      diffx = Math.cos(myGuys[i].angleToFocus)*4;
      diffy = Math.sin(myGuys[i].angleToFocus)*4;


      if ((diffx > 0 && myGuys[i].speedX > 0) || (diffx < 0 && myGuys[i].speedX < 0)) {
        // if we are going right and it's to our right
        // if we are going left and it's to our left
      } else {
        myGuys[i].speedX *= 0.98;
      }

      // change direction mid air


      // limit speedX and speedY
      applySpeedLimit(myGuys[i]);

      // apply gravity and movement
      myGuys[i].x += myGuys[i].speedX/4;
      myGuys[i].rotation += myGuys[i].spin;
      myGuys[i].spin *= 0.9;
      while (myGuys[i].rotation > 6) {
        myGuys[i].rotation -= 6;
      }
      while (myGuys[i].rotation < -6) {
        myGuys[i].rotation += 6;
      }

      // bounce off walls if necessary
      if (!myGuys[i].hitBottom) {
        let mass = gravity*myGuys[i].size*myGuys[i].size;
        myGuys[i].speedY += mass;
        myGuys[i].y += myGuys[i].speedY/4;
      }
      myGuys[i].physicsCheck();
      // change direction mid air
    }
  }
}

/**
* function to handle comets
*/
function recalculateComets() {
  for (let i =0; i < comets.length; i++) {
    comets[i].x += comets[i].speedX*5;
    comets[i].y += comets[i].speedY*5;
    if (comets[i].x < 0 || comets[i].x > canvasWidth || comets[i].y < 0 || comets[i].y > trueBottom) {
      comets.splice(i, 1);
      i--;
    } else {
      trails.push(new Particle(comets[i].size/2, glowColour, comets[i].x, comets[i].y, comets[i].speedX*15, comets[i].speedY*15));
      comets[i].update();
    }
  }
}

/**
* function to habndle the decorative starfield
*/
function recalculateStarfield() {
  if (starfield.length < 1000*proportion) {
    let ranX = Math.floor(Math.random()*(canvasWidth));
    let ranSize = Math.random()*3;
    starfield.push(new Inert(ranSize, ranSize, glowColour, ranX, trueBottom, false));
  }
  // moving stars
  let defaultMovement = 0.5;
  for (let i = 0; i < starfield.length; i++) {
    defaultMovement = 0.5 * (1/trueBottom)*starfield[i].y;
    starfield[i].y -= Math.abs(defaultMovement*(4-starfield[i].size));

    // starfield wrapping
    if (starfield[i].y <= 1) {
      starfield[i].y = trueBottom;
      // starfield[i].manmade = false;
    }

    // star collision
    let starBump = false;
    for (j = 0; j < starfield.length && !starBump; j++) {
      if (j !== i && detectCollision(starfield[i], starfield[j])) {
        starfield.splice(i, 1);
        i--;
        starBump = true;
      }
    }
  }
}


/**
* an interactable object that is not alive
* @param {int} width - the width of the inert
* @param {int} height - the height of the inert
* @param {string} colour - the colour of the object
* @param {int} x - the x position
* @param {int} y - the y position
* @param {boolean} manmade - whether it was made at a gravestone by an elder
*/
function Inert(width, height, colour, x, y, manmade) {
  this.width = width;
  this.height = height;
  this.size = width;
  this.colour = colour;
  this.manmade = manmade;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function() {
    if (this.size > 0.5) {
      this.size *= 0.999;
    }
    // draw the thing
    if (this.manmade) {
      ctx.globalAlpha = 1;
    } else {
      let tmp = this.size/3; // 0 to 1
      tmp = 1 - tmp;
      ctx.globalAlpha = tmp*(1-(1/(trueBottom/this.y)));
    }
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  };
}
/**
* function to create an explosion (graphical only)
* @param {int} x - the x position
* @param {int} y - the y position
* @param {string} colour1 - colour of the outside of the explosion
* @param {string} colour2 - colour of the inside of the explosion
*/
function Explosion(x, y, colour1, colour2) {
  this.x = x;
  this.y = y;
  this.colour1 = colour1;
  this.colour2 = colour2;
  this.timer = 0;
  this.update = function() {
    ctx.fillStyle = this.colour1;
    ctx.globalAlpha = 0.3*(1-(this.timer/200));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.timer, 0, 2 * Math.PI);
    ctx.fill();
    let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.timer);
    glow.addColorStop(0, this.colour2);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.timer, 0, 2 * Math.PI);
    ctx.fill();
  };
}
/**
* function to create an explosion (graphics only)
* @param {int} size - the size
* @param {string} colour - the colour
* @param {int} x - the x position
* @param {int} y - the y position
* @param {int} speedX - the x speed
* @param {int} speedY - the y speed
*/
function Particle(size, colour, x, y, speedX, speedY) {
  this.size = size;
  this.colour = colour;
  this.x = x;
  this.y = y;
  this.speedX = speedX/2;
  this.speedY = speedY/2;
  this.timer = 5;
  this.update = function() {
    // draw the thing
    // console.log(this.width);
    ctx.globalAlpha = (this.timer/15);
    ctx.lineWidth = size;
    ctx.strokeStyle = this.colour;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x-this.speedX, this.y-this.speedY);
    ctx.stroke();

    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
  };
}
/**
* function to collide two objects using physics
* @param {object} obj1 - the first object
* @param {object} obj2 - the second object
*/
function collide(obj1, obj2) {
  // fix the distance between the objects
  let diffx = Math.abs(obj1.x - obj2.x);
  let diffy = Math.abs(obj1.y - obj2.y);
  let currenth = Math.sqrt((diffx*diffx)+(diffy*diffy));
  let targeth = obj1.size + obj2.size;
  let newprop = targeth/currenth;
  if (diffx == 0 && diffy == 0) {
    newprop = 1;
  }
  obj1.x += (obj1.x - obj2.x)*newprop/obj1.size;
  obj2.x -= (obj1.x - obj2.x)*newprop/obj2.size;
  // detect if one of the guys is touching the floor
  if (!obj1.hitBottom && !obj2.hitBottom) {
    obj1.y += (obj1.y - obj2.y)*newprop/obj1.size;
    obj2.y -= (obj1.y - obj2.y)*newprop/obj2.size;
  } else {
    if (obj1.hitBottom && !obj2.hitBottom) {
      // let thisX = (obj1.x - obj2.x)*newprop/obj2.size;
      // let thisY = Math.sqrt(Math.abs((targeth*targeth)-(thisX*thisX)));
      // obj2.y -= thisY;
    } else if (obj2.hitBottom && !obj1.hitBottom) {
      // let thisX = (obj1.x - obj2.x)*newprop/obj1.size;
      // let thisY = Math.sqrt(Math.abs((targeth*targeth)-(thisX*thisX)));
      // obj1.y -= thisY;
    }
  }
  // calculate transfer of energy
  // energy = mass X velocity
  let myEnergy = obj1.speedX*obj1.size;
  let theirEnergy = obj2.speedX*obj2.size;
  let energyTransfer = elasticity*(myEnergy-theirEnergy)/(obj1.size+obj2.size);
  obj1.speedX += energyTransfer;
  obj2.speedX += energyTransfer;
  myEnergy = obj1.speedY*obj1.size;
  theirEnergy = obj2.speedY*obj2.size;
  energyTransfer = elasticity*(myEnergy-theirEnergy)/(obj1.size+obj2.size);
  obj1.speedY += energyTransfer;
  obj2.speedY += energyTransfer;
  // calculate rotation on collision
  let targetangle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  obj1.spin += targetangle/10;
  obj2.spin -= targetangle/10;
}

/**
* function to return a random gender
* @return {string} the gender
*/
function randomGender() {
  let base = Math.round(Math.random());
  if (base == 0) {
    return 'boy';
  }
  return 'girl';
}

/**
* function to collide two objects using physics
* @param {object} parent1 - the first parent
* @param {object} parent2 - the second parent
* @return {string} the gender of the baby
*/
function generateBaby(parent1, parent2) {
  // male is parent1
  // female is parent2
  // set the baby's max size
  let babyGender = randomGender();
  let randSize = 5 + (Math.random()*10);
  randSize = (parent1.maxSize + parent2.maxSize + randSize)/3;
  // sort out the ear logic
  let babyEars = 1;
  let randSeed = Math.random();
  if (randSeed < 0.3) {
    babyEars = parent1.ears;
  } else if (randSeed < 0.6) {
    babyEars = parent2.ears;
  } else {
    babyEars = (parent1.ears + parent2.ears + Math.random())/3;
  }
  myGuys.push(new Agent(parent1.x, parent1.y-parent1.size, 5, randSize, babyGender, babyEars));
  // set the baby's ears
  // set the baby's secret colour
  let ri = hexToRgb(parent1.secretColour).r;
  let gi = hexToRgb(parent1.secretColour).g;
  let bi = hexToRgb(parent1.secretColour).b;
  let rj = hexToRgb(parent2.secretColour).r;
  let gj = hexToRgb(parent2.secretColour).g;
  let bj = hexToRgb(parent2.secretColour).b;
  let seedR = Math.floor(Math.random()*255);
  let seedG = Math.floor(Math.random()*255);
  let seedB = Math.floor(Math.random()*255);
  combr = Math.round((ri+rj+seedR)/3);
  combg = Math.round((gi+gj+seedG)/3);
  combb = Math.round((bi+bj+seedB)/3);
  // spawn the baby
  myGuys[myGuys.length-1].secretColour = rgbToHex(combr, combg, combb);
  myGuys[myGuys.length-1].speedY = -25;
  myGuys[myGuys.length-1].love = 50;
  return babyGender;
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function clickMouse(e) {
  let stop = false;
  for (let i = 0; !stop && i < myGuys.length; i++) {
    if (detectCollision(pointerPos, myGuys[i])) {
      selection = myGuys[i].id;
      stop = true;
      sendMessage('Name '+myGuys[i].name+' ID: '+selection+' age '+myGuys[i].age);
    }
  }

  // let diffx = pointerPos.x - fireflies[0].x;
  // let diffy = pointerPos.y - fireflies[0].y;
  // // let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
  // if ((diffx > 0 && fireflies[0].speedX > 0) || (diffx < 0 && fireflies[0].speedX < 0)) {
  //   fireflies[0].speedX *= 2;
  // } else {
  //   fireflies[0].speedX *= -0.9;
  // }
  // if ((diffy > 0 && fireflies[0].speedY > 0) || (diffy < 0 && fireflies[0].speedY < 0)) {
  //   fireflies[0].speedY *= 2;
  // } else {
  //   fireflies[0].speedY *= -0.9;
  // }
}

/**
* function to turn the current ticker (0 to 1000) in the form of a 24 hour clock
* @return {string} the minutes and seconds
*/
function tickerToTime() {
  let seconds = (86400/1000)*(daytimeCounter);
  let minutes = Math.floor(seconds/60);
  let hours = Math.floor(minutes/60);
  hours = ('0' + hours).slice(-2);
  minutes = Math.floor(minutes - (hours*60));
  minutes = ('0' + minutes).slice(-2);
  // seconds = Math.floor(seconds - (minutes*60));
  // seconds = ('0' + seconds).slice(-2);
  return (hours+':'+minutes/* +':'+seconds*/);
}
/**
* function to produce an explosion's physics
* @param {int} ex - the x coordinate
* @param {int} ey - the y coordinate
*/
function produceExplosion(ex, ey) {
  // blast all the guys
  for (let i = 0; i < myGuys.length; i++) {
    if (myGuys[i].phase == 0) {
      let diffx = ex - myGuys[i].x;
      let diffy = ey - myGuys[i].y;
      // as long as it's not the guy that triggered it
      if (!diffx == 0 && !diffy == 0) {
        // if the guy is within range;
        let range = 200;
        if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
          myGuys[i].love += 25;
          myGuys[i].energy -= 50;
          myGuys[i].health -= 10;
          diffx /= 5;
          diffy /= 5;
          if (diffx >= 0) {
            myGuys[i].speedX -= (100-diffx)/2;
          } else if (diffx < 0) {
            myGuys[i].speedX += (100-diffx)/2;
          }
          if (diffy >= 0) {
            myGuys[i].speedY -= (100-diffy)/2;
          } else if (diffy <= 0) {
            myGuys[i].speedY += (100-diffy)/2;
          }
        }
      }
    }
  }
  // now blast the Ghosts
  for (let i = 0; i < myGhosts.length; i++) {
    let diffx = ex - myGhosts[i].x;
    let diffy = ey - myGhosts[i].y;
    // if the Ghost is within range;
    let range = 300;
    if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
      diffx /= range;
      diffy /= range;
      if (diffx >= 0) {
        myGhosts[i].speedX -= (1-diffx);
      } else if (diffx < 0) {
        myGhosts[i].speedX += (1-diffx);
      }
      if (diffy >= 0) {
        myGhosts[i].speedY -= (1-diffy);
      } else if (diffy < 0) {
        myGhosts[i].speedY += (1-diffy);
      }
    }
  }
  // blast the other fireflies
  for (let i = 0; i < fireflies.length; i++) {
    let diffx = ex - fireflies[i].x;
    let diffy = ey - fireflies[i].y;
    // as long as it's not the fly that triggered it
    if (!diffx == 0 && !diffy == 0) {
      // if the firefly is within range;
      let range = 200;
      if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
        diffx /= range;
        diffy /= range;
        if (diffx >= 0) {
          fireflies[i].speedX -= (diffx)*10;
        } else if (diffx < 0) {
          fireflies[i].speedX += (diffx)*10;
        }
        if (diffy >= 0) {
          fireflies[i].speedY -= (diffy)*10;
        } else if (diffy < 0) {
          fireflies[i].speedY += (diffy)*10;
        }
      }
    }
  }
  // destroy the  graves
  for (let i = 0; i < graveStones.length; i++) {
    if (!graveStones[i].elder) {
      let diffx = ex - graveStones[i].x;
      let diffy = ey - graveStones[i].y;
      // if the firefly is within range;
      let range = 200;
      if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
        graveStones.splice(i, 1);
        i--;
      }
    }
  }
}

/**
* function to limit the speed of an object
* @param {object} what - the object
*/
function applySpeedLimit(what) {
  if (isNaN(what.speedX) || isNaN(what.speedY) || isNaN(what.x) || isNaN(what.y)) {
    console.log('2080 error - speed or coordinate is not a number');
    console.log('x '+what.x+' y '+what.y+' speedX '+what.speedX+' speedY '+what.speedY);
  }
  if (what.speedX > speedLimit) {
    what.speedX = speedLimit;
  } else if (what.speedX < -speedLimit) {
    what.speedX = -speedLimit;
  }
  if (what.speedY > speedLimit) {
    what.speedY = speedLimit;
  } else if (what.speedY < -speedLimit) {
    what.speedY = -speedLimit;
  }
}
