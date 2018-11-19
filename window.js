/**
* mate 0.44
**/

// font
let debugString = 'nothing'; // for debugging
const globalFont = 'Lucida Console';
// universal physics constants
const gravity = 0.02;
const elasticity = 0.2;
const speedLimit = 100;
const superThreshold = 99;
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
const maxPop = 50*proportion;
// set the environment start time
const d = new Date();
const startTime = d.getHours();
const hourOfCreation = Math.floor(startTime * (1000/23));
const hocLength = 1000/12;
let daytimeCounter = hourOfCreation;
let timeMod = daytimeCounter;
let anniversary = true;
let day = 0;
let paused = false;

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
const acacia = new Image();
acacia.src = 'acacia.png';
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
chibis = [];
graveStones = [];
myGhosts = [];
starfield = [];
comets = [];
trails = [];
glyphs = [];
fireflies = [];
fireflies.push(new FireFly(Math.random()*canvasWidth, Math.random()*canvasHeight, pointerPos, 1, glowColour));
elders = 0;
obelisks = 0;
guyID = 0;
selection = '0000';
trees = [];


// UI and messaging
basicInfo = new TextElement('15px', 'Consolas', trueWhite, 10, canvasHeight - 10);
newestMessage = new TextElement('15px', 'Consolas', trueWhite, 10, canvasHeight - 30);
let messagesToSave = canvasHeight/20;

/**
* function to start the simulation
*/
function startGame() {
  // init console data
  console.log('Scale to base is '+proportion);
  console.log('Maximum population is '+maxPop);
  console.log(reportNames(100000));

  myGameArea.start();

  chibis.push(new Chibi(canvasWidth*0.75, trueBottom-20, 6, 11.5, 'girl', 0));
  chibis.push(new Chibi(canvasWidth-(canvasWidth*0.75), trueBottom-20, 6, 12, 'boy', 1));
  // createGlyphs(chibis[0].x + ((chibis[1].x - chibis[0].x)/2), trueBottom, '#e94db5', '\u2764');
  // createGlyphs(chibis[0].x + ((chibis[1].x - chibis[0].x)/2), 0, '#92ecf5', '\u274b');
  // createGlyphs(chibis[0].x + ((chibis[1].x - chibis[0].x)/2), 0+10, '#e94db5', '\u2764');
  // createGlyphs(chibis[0].x + ((chibis[1].x - chibis[0].x)/2), trueBottom-10, '#92ecf5', '\u274b');


  let ethnicitySeed = Math.round(Math.random()*(numlibs-1));
  while (chibis[0].name == null) {
    chibis[0].name = getRandomFemaleEthnicName(ethnicitySeed);
  }
  while (chibis[1].name == null) {

    chibis[1].name = getRandomMaleEthnicName(ethnicitySeed);
  }
  chibis[0].age = 1;
  chibis[1].age = 1;
  chibis[0].facemod[0] = Math.random();
  chibis[1].facemod[0] = Math.random();
  chibis[0].facemod[1] = Math.random();
  chibis[1].facemod[1] = Math.random();
  chibis[0].geneticColour = randomColour();
  chibis[1].geneticColour = randomColour();
  // chibis[0].elder = true;
  // elders++;

  // chibis.push(new Chibi(canvasWidth-(canvasWidth*0.5), trueBottom-20, 6, 10, 'non binary', 1));
  // chibis[2].name = getRandomName(nameSeed);
  // chibis[2].geneticColour = mixTwoColours(increaseSaturationHEX(randomColour()), '#12d4ee');

  sendMessage('\u2764 Once upon a time...');
  sendMessage('It was just the two of us; '+chibis[1].name+' and '+chibis[0].name);

  for (let j = 0; j < 20; j++) {
    ranX = Math.floor(Math.random()*(canvasWidth));
    ranY = Math.floor(Math.random()*(trueBottom));
    // ranSize = Math.random()*3;
    // starfield.push(new Inert(ranSize, ranSize, glowColour, ranX, ranY, false));

    // chibis.push(new Chibi(ranX, ranY, 8, 10, 'girl', Math.random()));
    // chibis[(j*2)+2].name = getFemaleName(Math.round(Math.random()*namesinlib*numlibs));
    // chibis[(j*2)+2].geneticColour = randomColour();
    // chibis[(j*2)+2].age = 1;
    // chibis[(j*2)+2].facemod[0] = Math.random();
    // chibis[(j*2)+2].facemod[1] = Math.random();
    // chibis[(j*2)+2].elder = true;

    // chibis.push(new Chibi(ranX, ranY, 8, 10, 'boy', Math.random()));
    // chibis[(j*2)+3].name = getMaleName(Math.round(Math.random()*namesinlib*numlibs));
    // chibis[(j*2)+3].geneticColour = randomColour();
    // chibis[(j*2)+3].age = 1;
    // chibis[(j*2)+2].facemod[0] = Math.random();
    // chibis[(j*2)+3].facemod[1] = Math.random();


    // graveStones.push(new Grave(ranX, trueBottom, 5+(Math.random()*6), 0, 0, false, '#0000ff'));
    // graveStones[graveStones.length-1].timer = Math.random()*100;
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
  if (!paused) {
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
        if (elders > 0) {
          sendMessage('The Hour of Creation began');
        }
        if (day == 1) {
          sendMessage('We survived the first day');
        }
        day ++;
      } else if (anniversary && (daytimeCounter >= Math.abs(1000-(hourOfCreation + hocLength)) || daytimeCounter >= (hourOfCreation+ hocLength))) {
        anniversary = false;
        if (elders > 0) {
          sendMessage('The Hour of Creation ended');
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

    // glyphs
    for (i = glyphs.length-1; i >= 0; i--) {
      glyphs[i].update();
      if (glyphs[i].timer < 0) {
        glyphs.splice(i, 1);
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
    ctx.restore();

    // draw the trees
    for (let i = 0; i < trees.length; i++) {
      trees[i].update();
      if (trees[i].reachedMaxHeight && trees[i].y > trueBottom) {
        trees.splice(i, 1);
        i--;
        sendMessage('A tree died');
      }
    }

    ctx.globalAlpha = 1;
    // draw the floor
    let horizon = ctx.createLinearGradient(0, canvasHeight-muckLevel-5, 0, canvasHeight-muckLevel);
    horizon.addColorStop(0, 'rgba(0, 0, 0, 0)');
    horizon.addColorStop(1, trueBlack);
    ctx.fillStyle = horizon;
    ctx.fillRect(0, canvasHeight-muckLevel-5, canvasWidth, 5+muckLevel);


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
      ctx.fillText(messageBuffer[i].timeStamp+' '+messageBuffer[i].text, 10, 35+trueBottom-(20*(messageBuffer.length-i)));
    }

    // for graveStones
    for (let d = 0; d < graveStones.length; d++) {
      // combine adjacent gravestones
      for (let e = 0; e < graveStones.length; e++) {
        if (!graveStones[e].elder && d !== e && graveStones[d].x == graveStones[e].x && graveStones[d].y == graveStones[e].y) {
          graveStones[d].timer = graveStones[e].timer;
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
        myGhosts.push(new Ghost(graveStones[d].x, graveStones[d].y, ghostSize*0.8, graveStones[d].geneticColour));
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
        let fireFlySize = myGhosts[i].size/8;
        if (fireFlySize < 0.4) {
          fireFlySize = 0.4;
        }
        sendMessage('A Ghost became a FireFly');
        fireflies.push(new FireFly(myGhosts[i].x, myGhosts[i].y, fireflies[fireflies.length-1], fireFlySize, myGhosts[i].geneticColour));
        fireflies[fireflies.length-1].touches = 200;
        myGhosts.splice(i, 1);
        i--;
      } else {
        myGhosts[i].update();
      }
    }
    // sort the guys
    chibis.sort(function(obj1, obj2) {
      return (obj1.health) - (obj2.health);
    });

    chibis.sort(function twoVars(a, b) {
      if (a.health + a.energy + a.love> b.health+ b.energy + b.love) return 1;
      if (a.health + a.energy + a.love< b.health+ b.energy + b.love) return -1;
      return 0;
    });


    // for my guys
    // global and prep first
    // check for both sexes
    let malePresent = false;
    let femalePresent = false;
    for (let i = 0; (!malePresent || !femalePresent) && i < chibis.length; i++) {
      if (!chibis[i].elder && chibis[i].gender == 'girl') {
        femalePresent = true;
      } else if (!chibis[i].elder) {
        malePresent = true;
      }
    }
    if (!malePresent || !femalePresent) {
      ranX = Math.floor(Math.random()*(canvasWidth));
      ranY = Math.floor(Math.random()*(trueBottom));
      randSize = 5 + (Math.random()*10);
      let nameSeed = Math.round(Math.random()*totalMaleNames);
      if (!malePresent) {
        chibis.push(new Chibi(ranX, ranY, 5, randSize, 'boy', Math.random()));
        chibis[chibis.length-1].name = getMaleName(nameSeed);
      } else {
        chibis.push(new Chibi(ranX, ranY, 5, randSize, 'girl', Math.random()));
        chibis[chibis.length-1].name = getFemaleName(nameSeed);
      }
      chibis[chibis.length-1].geneticColour = randomColour();
      sendMessage('A stranger called '+chibis[chibis.length-1].name+' appeared');
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
    for (let i = 0; i < chibis.length; i++) {
      chibis[i].i = i+' of '+chibis[i].length;
      chibis[i].update();
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
    basicInfo.text = tickerToTime() +' Day '+day+' Mates '+ chibis.length+ ' Elders '+elders+' Fireflies '+fireflies.length+' Trees '+trees.length;
    basicInfo.update();
    newestMessage.text = currentMessage.timeStamp +' ' + currentMessage.text;
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
* function to describe a Tree
* @param {int} x - the x coordinate
* @param {int} y - the y coordinate
* @param {int} width - the width
* @param {int} height - the height of the Tree base
* @param {int} maxHeight - the maximum height the Tree can reach;
*/
function Tree(x, y, width, height, maxHeight) {
  this.reachedMaxHeight = false;
  this.loadthisframe = 0;
  this.circleCenterX = x;
  this.circleCenterY = y;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.maxHeight = maxHeight;
  // this.angle = 0;
  // this.speedX = 0;
  // this.clockwise = clockwise;
  this.update = function() {
    ctx.fillStyle = trueBlack;
    // COMMENTED OUT CODE FOR CIRCULAR MOTION
    // the radius and angle of the circle, we start at angle 0
    // let radius = trueBottom*0.4;
    // Math.PI/180 is for transforming angle into radiant
    // Math.cos(angle) is the ratio of adjacent to hypothenuse
    // Math.sin(angle) is the ratio of opposite to hypothenuse
    // the hypothenuse is the radius
    // let newX = radius * Math.cos(this.angle * (Math.PI/180));
    // let newY = radius * Math.sin(this.angle * (Math.PI/180));
    // w x and y values to the circle center
    // let newxpos = newX + this.circleCenterX;
    // let newypos = newY + this.circleCenterY;
    // this.speedX = newxpos - this.x;
    // this.x = newxpos;
    // this.y = newypos;

    if (this.y > canvasHeight) {
      this.y = canvasHeight;
    }
    if (this.y < trueBottom-this.maxHeight) {
      this.y = trueBottom-this.maxHeight;
      this.reachedMaxHeight = true;
    }

    if (this.y <= canvasHeight && this.y >= trueBottom-(this.maxHeight)) {
      if (this.y > fireflies[0].y) {
        this.y += (this.loadthisframe/60) - (0.025*(75/this.width));
      } else {
        this.y += (this.loadthisframe/60);
      }
    }
    // ctx.fillRect(this.x-(this.width/2), this.y, this.width, this.height);
    ctx.globalAlpha = 0.9;
    // ctx.fillRect(this.x-(this.width/6), this.y+this.height, this.width/3, trueBottom - this.y - this.height);
    // ctx.globalAlpha = 1;
    ctx.drawImage(acacia, this.x-(this.width*0.5), this.y-10, this.width, 200/(300/this.width));
    ctx.fillRect(this.x-(this.width/30), this.y+(this.width/4.5), this.width/12.5, trueBottom - this.y - this.height);
    // label
    // ctx.fillStyle = glowColour;
    // ctx.font = '10px' + ' ' + globalFont;
    // ctx.fillText(this.reachedMaxHeight, this.x, this.y);


    // increase the angle so that it moves in circular way
    // it is not necessary to limit/reset the angle to 360°
    // because sinus and cosinus work for angles bigger than 360°
    //   if (this.clockwise) {
    //   this.angle ++;
    // } else {
    //   this.angle --;
    // }
    this.loadthisframe = 0;
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
* @param {string} geneticColour - the colour
*/
function FireFly(x, y, focus, size, geneticColour) {
  this.x = x;
  this.y = y;
  this.focus = focus;
  this.speedX = 0;
  this.speedY = 0;
  this.size = size*20;
  this.touches = 0;
  this.touchedThisFrame = false;
  this.geneticColour = geneticColour;
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
    let ri = hexToRgb(this.geneticColour).r;
    let gi = hexToRgb(this.geneticColour).g;
    let bi = hexToRgb(this.geneticColour).b;
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
* @param {string} geneticColour - the colour
*/
function Grave(x, y, size, speedX, speedY, elder, geneticColour) {
  this.x = x;
  this.y = y + 10;
  this.speedX = speedX/2;
  this.speedY = speedY/1000;
  this.timer = 200;
  this.hitBottom = false;
  this.elder = elder;
  this.tended = 0;
  this.geneticColour = geneticColour;
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
  this.update = function() {
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
function Chibi(x, y, bodySize, maxSize, gender, ears) {
  this.i = ''; // temp for debug
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.colour = trueBlack;
  this.geneticColour = this.colour;
  this.facemod = [1, 1];
  this.ears = ears;
  this.angleToFocus = 0;
  this.size = bodySize;
  this.limbLength = (this.size*1.5);
  this.maxSize = maxSize;
  this.hitBottom = false;
  this.sitting = false;
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.snuggling = 0;
  this.awake = 0;
  this.children = 0;
  this.id = ('0000' + guyID).slice(-4);
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  guyID++;
  this.elder = false;
  this.supersaiyan = 0;
  this.reachedNirvana = false;
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

  this.focusIsFirefly = function() {
    isFireFly = false;
    for (let i = 0; i < fireflies.length; i++) {
      if (this.focus == fireflies[i]) {
        isFireFly = true;
      }
    }
    return isFireFly;
  }
  // act
  // @return {boolean} - whether the action has a cost
  this.act = function() {
    if (this.snuggling > 0) {
      this.sitting = true;
      this.snuggling -= 1;
    } else {
      // decide whether to act or not
      // if you've already reached nirvana, and you max out one of your meters, just sit down
      if (this.supersaiyan == 0 && (this.health > superThreshold && this.love > superThreshold)) {
        this.sitting = true;
      } else {
        if (Math.random() <= 0.05 && this.focus.y <= this.y) {
          // decide what to do
          // are we gonna pick a mate?
          let mate = null;
          if (this.focusIsFirefly() && !this.elder && this.gender !== 'non binary' && this.age > 0 && chibis.length <= maxPop && this.supersaiyan == 0 && this.health >= 70
          && this.energy >= 70 && this.size >= this.maxSize) {
            for (let j = 0; j < chibis.length && mate == null; j++) {
              if (chibis[j].awake && chibis[j].focusIsFirefly() && this!== chibis[j] && this.gender !== chibis[j].gender && this.love + chibis[j].love >= 90 && !chibis[j].elder && chibis[j].gender !== 'non binary'
              && chibis[j].age > 0 && chibis[j].supersaiyan == 0 && chibis[j].health >= 70
              && chibis[j].energy >= 70 && chibis[j].size >= chibis[j].maxSize) {
                mate = chibis[j];
              }
            }
            if (mate !== null && this.focus !== mate & mate.focus !== this) {
              this.focus = mate;
              mate.focus = this;
              let nameArray = [];
              nameArray.push(this);
              nameArray.push(mate);
              nameArray.sort(function twoVars(a, b) {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
              });
              sendMessage(nameArray[0].name+' and '+nameArray[1].name+' wanted to snuggle');
            }
          }

          if (mate == null && this.elder && graveStones.length > 0) {// }&& this.anniversary) {
            if (!anniversary || obelisks == 0 ) {
              // if it's a regular time of day, or there are no obelsisks, just go for the shittiest gravestone to maintain it
              let target = this.findClosestGrave();
              if (target == 'X') {
                this.focus = fireflies[this.findClosestFireFly()];
              } else {
                this.focus = graveStones[target];
              }
            } else if (mate == null) {
              // if it's a special time of day and there are obelisks, go for the best gravestone and make babies out of it
              this.focus = graveStones[this.findClosestObelisk()];
            }
          } else if (mate == null) {
            // default action - jump at firefly
            this.focus = fireflies[this.findClosestFireFly()];
          }
          if (this.focus.y <= this.y) {
            if (this.focus == mate) {
              // sendMessage(this.name+' jumping at mate');
            }
            // actually jumping now
            this.speedY = -this.size;
            let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
            this.speedX += 50*Math.cos(targetangle);
            this.speedY += 70*Math.sin(targetangle);
            this.y--;
            this.energy -= 7;
            this.sitting = false;
            this.health -= 1;
          }
        } else if (this.focus.y > this.y) {
          this.sitting = true;
        }
      }
    }
  };
  this.findClosestFireFly = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let i = 0; i < fireflies.length; i++) {
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
    let tmp2 = 100;
    let target = 'X';
    for (let i = 0; i < graveStones.length; i++) {
      if (graveStones[i].timer < tmp2) {
        let tmpX = this.x-graveStones[i].x;
        let tmpY = this.y-graveStones[i].y;
        let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
        if (distance < tmp) {
          tmp = distance;
          tmp2 = graveStones[i].timer;
          target = i;
        }
      }
    }
    if (target == 'X') {
    }
    return target;
  };

  this.findClosestObelisk = function() {
    let target = 'X';
    if (chibis.length >= maxPop) {
      return target;
    }
    let tmp = maxDistance;
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
      return target;
    }
    return target;
  };

  // check for bounces on walls and landing on trees
  this.physicsCheck = function() {
    this.hitBottom = false;
    // check if mate hit a Tree
    let hitTree = false;
    for (let i = 0; i < trees.length && !hitTree; i++) {
      if (this.x >= trees[i].x + (this.size/2) - (trees[i].width/2) && this.x <= trees[i].x - (this.size/2) + (trees[i].width/2) && this.y >= trees[i].y - (this.size) - (this.limbLength/2.5) - (this.size/2) && this.y <= trees[i].y+ trees[i].height && this.speedY >= 0) {
        this.y = trees[i].y-(this.size)-(this.limbLength/2.5);
        trees[i].loadthisframe += this.size;
        hitTree = true;
        this.hitAFloor();
        this.energy -= 0.01;
        if (this.y > trueBottom-(this.size)-(this.limbLength/2.5)) {
          this.y = trueBottom-(this.size)-(this.limbLength/2.5);
        }
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
    // check if mate hit the floor
    if (!this.hitBottom && this.y >= trueBottom-(this.size)-(this.limbLength/2.5)) {
      this.y = trueBottom-(this.size)-(this.limbLength/2.5);
      this.speedY = 0;
      this.hitAFloor();
      if (this.supersaiyan > 0 && tryToPlantaTree(this.x)) {
        sendMessage(this.name+' planted some seeds');
      }
    }
  };
  this.hitAFloor = function() {
    if (this.energy <= 0) {
      // fall asleep when tired
      this.awake = false;
      this.speedX = 0;
      this.speedY = 0;
      this.rotation = 0;
      this.spin = 0;
      this.erergy = 0;
    } else {
      this.hitBottom = true;
      // this.sitting = false;
      // apply floor forces
      this.speedX *= 0.9;
      this.resetRotation(false);
      // jump occasionally
      if (this.rotation == 0 && this.awake && this.hitBottom) {
        this.act();
      }
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
    // set body colour
    this.colour = mixTwoColours(this.geneticColour, colourIndicator(this));
    if (this.elder) {
      this.colour = decreaseSaturationHEX(this.colour);
    }
    ctx.fillStyle= this.geneticColour;
    for (let f = 0; f < fireflies.length; f++) {
      if (!this.hitBottom && !fireflies[f].touchedThisFrame && this.awake && this.energy > 0 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        this.focus = fireflies[f];
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX*this.size)/2000;
        fireflies[f].speedY += (this.speedY*this.size)/2000;// + (0.002 * this.size);
        if (this.energy < 100) {
          this.energy += 0.6;
        }
        if (this.love < 100) {
          this.love += 2;
        }
        if (this.health < 100) {
          this.health += 4;
        }
        if (this.health >= superThreshold && this.love >= superThreshold && this.energy >= superThreshold) {
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
    if (!this.awake) {
      sleepshift = this.limbLength+(this.size/4);
    }


    if (this.awake && this.energy > 0) {
      ctx.lineWidth = this.size/2.5;
      ctx.strokeStyle = this.geneticColour;

      // legs
      let legGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*0.8);
      legGradient.addColorStop(0, trueBlack);
      legGradient.addColorStop(0.7, this.geneticColour);
      legGradient.addColorStop(1, this.colour);
      ctx.strokeStyle = legGradient;
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
      ctx.strokeStyle = this.geneticColour;
    }
    // label
    if (selection == this.id || this.id == '0000' || this.id == '0001') {
      ctx.fillStyle = glowColour;
      ctx.font = '10px' + ' ' + globalFont;
      let shift = this.name.length*5.6/2;
      ctx.fillText(this.name, this.x-shift, this.y-(this.size*2));
    }
    // translate before drawing again
    ctx.fillStyle = this.geneticColour;
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

    if (!this.hitBottom && this.awake) {
      tmp = 0;
      ctx.rotate(90 * Math.PI / 180);
      ctx.rotate(Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.hitBottom || !this.awake) {
      ctx.translate(0, sleepshift);
    }
    ctx.beginPath();
    ctx.moveTo(0, this.size/1.5);
    ctx.arc(this.size*(-tmp+7.5)/8, -this.size*1.5, this.size/3, 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(0, this.size/3);
    let tailGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*2);
    tailGradient.addColorStop(0, trueBlack);
    tailGradient.addColorStop(1*this.facemod[0], this.geneticColour);
    tailGradient.addColorStop(1, this.colour);
    ctx.fillStyle = tailGradient;
    ctx.fill();
    if (!this.hitBottom && this.awake) {
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
    if (this.awake) {
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

    let earGradient=ctx.createLinearGradient(0, -this.size+(this.size*this.ears/2), 0, this.limbLength/4);
    earGradient.addColorStop(0, this.colour);
    earGradient.addColorStop(1-(this.facemod[0]), this.geneticColour);
    ctx.fillStyle = earGradient;
    ctx.fill();
    ctx.restore();


    // head
    if (this.awake) {
      let bodyGradient=ctx.createLinearGradient(0, -this.size, 0, this.size);
      bodyGradient.addColorStop(0, this.geneticColour);
      bodyGradient.addColorStop(1*this.facemod[0], this.geneticColour);
      bodyGradient.addColorStop(1, this.colour);
      ctx.fillStyle = bodyGradient;
      ctx.rotate(360 * this.facemod[1] * Math.PI / 180);
      // awake mode
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.rotate(-360 * this.facemod[1] * Math.PI / 180);
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
    if (this.elder && this.awake) {
      ctx.rotate(-this.rotation);
      // elder halo glow
      let elderaura = ctx.createRadialGradient(0, -this.size*2, 1, 0, 0, this.love);
      elderaura.addColorStop(0, glowColour);
      elderaura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = elderaura;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(0, -this.size*2, this.love, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = glowColour;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth *= 0.6;
      ctx.beginPath();
      ctx.ellipse(0, -(this.size*1.25), this.size/3.3, this.size*0.9, Math.PI / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.rotate(this.rotation);
    }

    // eyes
    diffy = 0.5;
    ctx.lineWidth = 1.5;
    if (this.awake) {
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
        ctx.fillStyle = this.geneticColour;
        ctx.arc(-(this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore(); // close 0
    // draw status icons
    ctx.save();
    ctx.translate(this.x, this.y);
    // zzzzs
    if (!this.awake) {
      ctx.fillStyle = 'white';
      ctx.font = '10px' + ' ' + globalFont;
      let amntToMove = this.energy; // 0 to 10
      while (amntToMove > 10) {
        amntToMove -= 10;
      }
      while (amntToMove < 0) {
        amntToMove += 10;
      }
      ctx.globalAlpha = (1 - (amntToMove/10))/2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size-amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size-7-amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size-14-amntToMove);
    }
    ctx.globalAlpha = 1;
    ctx.restore();


    // hands
    ctx.lineWidth = this.size/3.33;
    let handGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.limbLength);
    handGradient.addColorStop(0, this.geneticColour);
    handGradient.addColorStop(1*this.facemod[0], this.geneticColour);
    handGradient.addColorStop(1, this.colour);
    ctx.fillStyle = handGradient;
    ctx.strokeStyle = handGradient;

    // put your front legs down if you are on the floor and healthy
    if (this.awake && this.hitBottom) {
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
      if (this.awake && detectCollision(this, this.focus)) {
        handGradient = ctx.createLinearGradient(0, 0, 1, this.focus.x - this.x, this.focus.y - this.y, this.limbLength);
        handGradient.addColorStop(0, this.geneticColour);
        handGradient.addColorStop(1*this.facemod[0], this.geneticColour);
        handGradient.addColorStop(1, this.colour);
        ctx.fillStyle = handGradient;
        ctx.strokeStyle = handGradient;
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
      } else if (this.awake && this.energy > 0) {
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
* @param {string} geneticColour - the colour
*/
function Ghost(x, y, size, geneticColour) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speedX = 0;
  this.speedY = 0;
  this.geneticColour = geneticColour;
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
  } else if (creature.gender == 'boy') {
    return rgbToHex(health, quirk, love);
  } else {
    return rgbToHex(quirk, love, health);
  }
}

/**
* function to handle chibis
*/
function recalculateMyGuys() {
  // block for all my guys
  for (let i = 0; i < chibis.length; i++) {
    // check nirvana status
    if (!chibis[i].reachedNirvana && chibis[i].children > 0 && chibis[i].age > 0 && chibis[i].size >= chibis[i].maxSize && chibis[i].supersaiyan == 0 && chibis[i].health >= superThreshold && chibis[i].energy >= superThreshold && chibis[i].love >= superThreshold) {
      explosions.push(new Explosion(chibis[i].x, chibis[i].y, chibis[i].geneticColour, glowColour));
      produceExplosion(chibis[i].x, chibis[i].y);
      chibis[i].reachedNirvana = true;
      chibis[i].supersaiyan = 100;
      chibis[i].speedX = 0;
      chibis[i].speedY = 0;
      sendMessage(chibis[i].name+' reached nirvana');
    }
    // check to see if it's time to die
    // attrition, aging etc.
    if (chibis[i].birthday == daytimeCounter+1) {
      chibis[i].age ++;
    }
    if (chibis[i].health <= 0) {
      createGlyphs(chibis[i].x, chibis[i].y, trueBlack, '\u274C')
      if (chibis[i].elder) {
        sendMessage('Elder '+chibis[i].name+' died');
        elders--;
      }
      graveStones.push(new Grave(chibis[i].x, chibis[i].y, chibis[i].size, chibis[i].speedX, chibis[i].speedY, chibis[i].elder, chibis[i].geneticColour));
      sendMessage(chibis[i].name+' died');
      chibis.splice(i, 1);
      i--;
    } else {
      // grow them a tiny bit
      if (this.size < this.maxSize) {
        this.size += this.size/1000;
      }
      if (!chibis[i].supersaiyan == 0 && chibis[i].supersaiyan <= 50) {
        sendMessage(chibis[i].name+'\'s nirvana ended');
        chibis[i].supersaiyan = 0;
      } else if (chibis[i].supersaiyan > 0) {
        chibis[i].supersaiyan -= 0.05;
        chibis[i].energy = 100;
      }
      if (chibis[i].love > 0.25) {
        chibis[i].love -= 0.1;
      } else if (chibis[i].love > 100) {
        chibis[i].love = 100;
      }
      if (chibis[i].health > 0) {
        chibis[i].health -= 0.001;
      }
      if (chibis[i].speedY < 0) {
        chibis[i].health -= 0.1;
      }
      // if asleep, gain energy and a little health
      if (!chibis[i].awake) {
        chibis[i].energy += 0.25;
        chibis[i].health += 0.1;
      }
      // if energy goes above 100, wake up
      if (!chibis[i].awake && chibis[i].energy > 90) {
        chibis[i].awake = true;
        // console.log('woke up');
      }
      if (chibis[i].health > 100) {
        chibis[i].health = 100;
      }

      // if you're a supersaiyan and you hit a grave ...

      // if you're an elder and you hit your focus (a grave or obelisk)
      for (let f = 0; f < fireflies.length; f++) {
        if (chibis[i].elder && chibis[i].awake && chibis[i].focus!== fireflies[f]) {
          if (detectCollision(chibis[i], chibis[i].focus)) {
            chibis[i].speedX *=0.5;
            chibis[i].speedY *=0.5;
            if ((!chibis[i].focus.elder || !anniversary)) {
              chibis[i].focus.tended = 50;
              chibis[i].focus.timer += 5;
              let newC = mixTwoColours(chibis[i].geneticColour, glowColour);
              starfield.push(new Inert(3, 3, newC, chibis[i].focus.x, chibis[i].focus.y+(5*chibis[i].focus.size), true));
              chibis[i].health += 0.5;
            } else {
              chibis[i].focus.timer -= 30;
              chibis[i].love += 10;
              let msgString = (generateBaby(chibis[i], chibis[i]))+' called ';
              let nameSeed = Math.round(Math.random()*totalMaleNames);
              if (chibis[chibis.length-1].gender == 'boy') {
                chibis[chibis.length-1].name = getMaleName(nameSeed);
              } else if (chibis[chibis.length-1].gender == 'girl') {
                chibis[chibis.length-1].name = getFemaleName(nameSeed);
              } else {
                let nameSeed2 = Math.round(Math.random()*totalFemaleNames);
                chibis[chibis.length-1].name = getRandomName(nameSeed+nameSeed2);
              }
              sendMessage('A '+msgString+chibis[chibis.length-1].name+' was sprouted at an obelisk');
            }
          }
        }
      }

      for (let j = 0; j < chibis.length; j++) {
        // if two guys bump into each other
        if (i !== j && detectCollision(chibis[i], chibis[j])) {
          // spread the love
          // let loveDiff = (chibis[j].love + chibis[i].love)/2;
          // chibis[i].love = (loveDiff/2)+(chibis[i].love/2);
          // chibis[j].love = (loveDiff/2)+(chibis[j].love/2);
        }

        if (i !== j && chibis[i].awake && chibis[j].awake && detectCollision(chibis[i], chibis[j])) {
          collide(chibis[i], chibis[j]);
          // having a baby
          if (chibis[i].focus == chibis[j] && chibis[j].focus == chibis[i] && chibis[i].age > 0 && chibis[j].age > 0 && chibis.length <= maxPop && chibis[i].gender !== 'non binary' && chibis[j].gender !== 'non binary'
          && chibis[i].gender !== chibis[j].gender && chibis[i].supersaiyan == 0 && chibis[j].supersaiyan == 0 && !chibis[i].elder && !chibis[j].elder
          && (chibis[i].love + chibis[j].love) >= 90 && chibis[i].health >= 50 && chibis[j].health >= 50 && chibis[i].energy >= 50 && chibis[j].energy >= 50
          && chibis[i].size >= chibis[i].maxSize && chibis[j].size >= chibis[j].maxSize) {
            // generate a baby
            let msgString = 'error';
            if (chibis[i].gender == 'boy') {
              msgString = (generateBaby(chibis[i], chibis[j]))+' called ';
              chibis[chibis.length-1].name = generateBabyName(chibis[i].name, chibis[j].name, chibis[chibis.length-1].gender);
            } else {
              msgString = (generateBaby(chibis[j], chibis[i]))+' called ';
              chibis[chibis.length-1].name = generateBabyName(chibis[j].name, chibis[i].name, chibis[chibis.length-1].gender);
            }
            if (chibis[chibis.length-1].name == null) {
              console.log('null name, parents were '+chibis[i].name+' and '+chibis[j].name);
            }
            sendMessage('A '+msgString+chibis[chibis.length-1].name+' was born to '+chibis[i].name+' and '+chibis[j].name);
            // pay the costs
            chibis[i].children ++;
            chibis[j].children ++;
            chibis[i].health -= 20;
            chibis[j].health -= 20;
            chibis[i].energy -= 35;
            chibis[j].energy -= 35;
            chibis[i].love += 30;
            chibis[j].love += 30;
            chibis[i].speedX = 0;
            chibis[j].speedX = 0;
            chibis[i].speedY = 0;
            chibis[j].speedY = 0;
            chibis[i].snuggling = 250;
            chibis[j].snuggling = 250;
            createGlyphs(chibis[i].x + ((chibis[j].x - chibis[i].x)/2), chibis[i].y + ((chibis[j].y - chibis[i].y)/2), '#e94db5', '\u2764');
          }
        }
      }
      // set elder status
      if (chibis[i].reachedNirvana && !chibis[i].elder && elders+1 <= chibis.length/4 && chibis[i].children >= 2) {
        chibis[i].elder = true;
        chibis[i].size*=0.8;
        sendMessage(chibis[i].name+' became an Elder');
        createGlyphs(chibis[i].x, chibis[i].y, chibis[i].secretColour, '\u274b');

        elders++;
      } else if (elders > 1 && elders > chibis.length/8 && chibis[i].elder) {
        // chibis[i].elder = false;
        // elders --;
        // sendMessage('An elder gave up their position');
      }

      // calculate angle to focus
      chibis[i].angleToFocus = Math.atan2(chibis[i].focus.y - chibis[i].y, chibis[i].focus.x - chibis[i].x);
      diffx = Math.cos(chibis[i].angleToFocus)*4;
      diffy = Math.sin(chibis[i].angleToFocus)*4;


      if ((diffx > 0 && chibis[i].speedX > 0) || (diffx < 0 && chibis[i].speedX < 0)) {
        // if we are going right and it's to our right
        // if we are going left and it's to our left
      } else {
        chibis[i].speedX *= 0.98;
      }

      // change direction mid air


      // limit speedX and speedY
      applySpeedLimit(chibis[i]);

      // apply gravity and movement
      chibis[i].x += chibis[i].speedX/4;
      chibis[i].rotation += chibis[i].spin;
      chibis[i].spin *= 0.9;
      while (chibis[i].rotation > 6) {
        chibis[i].rotation -= 6;
      }
      while (chibis[i].rotation < -6) {
        chibis[i].rotation += 6;
      }

      // bounce off walls if necessary
      if (!chibis[i].hitBottom) {
        let mass = gravity*chibis[i].size*chibis[i].size;
        chibis[i].speedY += mass;
        chibis[i].y += chibis[i].speedY/4;
      }
      chibis[i].physicsCheck();
      // change direction mid air
    }
  }
}
/**
* function to attempt to plant a tree
* @param {int} x - the x coordinate where the mate is trying to place a tree
*/
function tryToPlantaTree(x) {
  let allow = true;
  let maxHeight = trueBottom*0.60+(Math.random()*(trueBottom*0.30));
  let treeWidth = 35 + (Math.random()*45);
  for (let j = 0; j < trees.length; j++) {
    if (trees[j].x == x || ( x - (treeWidth/4) < trees[j].x + (trees[j].width/4) && trees[j].x - (trees[j].width/4) < x + (treeWidth/4))) {
      allow = false;
    }
  }
  if (allow) {
    trees.push(new Tree(x, canvasHeight, treeWidth, 1, maxHeight));
    return true;
  }
  return false;
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
  // if there is less than the designated amount, add one
  if (starfield.length < 50*proportion) {
    let ranX = Math.floor(Math.random()*(canvasWidth));
    let ranSize = Math.random()*3;
    starfield.push(new Inert(ranSize, ranSize, glowColour, ranX, trueBottom, false));
    // if there is more than the designated amount, remove one
  } else {
    if (starfield.length > 100*proportion) {
      starfield.splice(0, 1);
    }
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
* function to describe a particle (trail usually);
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

function createGlyphs(x, y, colour, symbol) {
  let speed = 2;
  glyphs.push(new Glyph(x, y, 0, -speed, colour, symbol));
  glyphs.push(new Glyph(x, y, 0, speed, colour, symbol));
  glyphs.push(new Glyph(x, y, speed, 0, colour, symbol));
  glyphs.push(new Glyph(x, y, -speed, 0, colour, symbol));
  glyphs.push(new Glyph(x, y, speed/1.5, speed/1.5, colour, symbol));
  glyphs.push(new Glyph(x, y, speed/1.5, -speed/1.5, colour, symbol));
  glyphs.push(new Glyph(x, y, -speed/1.5, speed/1.5, colour, symbol));
  glyphs.push(new Glyph(x, y, -speed/1.5, -speed/1.5, colour, symbol));
}

/**
* function to control glyphs
* @param {int} size - the size
* @param {string} colour - the colour
* @param {int} x - the x position
* @param {int} y - the y position
* @param {int} speedX - the x speed
* @param {int} speedY - the y speed
*/
function Glyph(x, y, speedX, speedY, colour, symbol) {
  this.speedX = speedX;
  this.speedY = speedY;
  this.size = 8;
  this.timer = 100;
  this.x = x;
  this.step = 0.2;
  this.y = y;
  this.colour = colour;
  this.symbol = symbol;
  this.update = function() {
    this.speedY += gravity;
    for (let i = 0; i < glyphs.length; i++) {
      if (glyphs[i] !== this && detectCollision(glyphs[i], this)) {
        collide(this, glyphs[i]);
      }
    }
    if (this.x < this.size || this.x > canvasWidth-this.size) {
      this.speedX *= -0.99;
      if (this.x < this.size) {
        this.x = this.size;
      } else {
        this.x = canvasWidth-this.size;
      }
    }
    if (this.y < this.size || this.y > trueBottom-this.size) {
      this.speedY *= -0.99;
      if (this.y < this.size) {
        this.y = this.size;
      } else {
        this.y = trueBottom-this.size;
      }
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.timer -= this.step;
    // draw glyph
    ctx.globalAlpha = (this.timer/100)+0.000001;
    ctx.fillStyle = this.colour;
    ctx.font = '14px' + ' ' + globalFont;
    ctx.save();
    ctx.translate(this.x-(this.size/2), this.y+(this.size/2));
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
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
  if (!obj1.hitBottom) {
    obj1.spin += targetangle/10;
  }
  if (!obj2.hitBottom) {
    obj2.spin -= targetangle/10;
  }
  applySpeedLimit(obj1);
  applySpeedLimit(obj2);
}

/**
* function to return a random gender
* @return {string} the gender
*/
function randomGender() {
  if (Math.random() < 0.004) {
    return 'non binary';
  } else {
    let base = Math.round(Math.random());
    if (base == 0) {
      return 'boy';
    }
    return 'girl';
  }
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
  chibis.push(new Chibi(parent1.x + ((parent2.x - parent1.x)/2), parent1.y + ((parent2.y - parent1.y)/2), 5, randSize, babyGender, babyEars));
  // set the baby's ears
  // set the baby's secret colour
  let ri = 0;
  let gi = 0;
  let bi = 0;
  let rj = 0;
  let gj = 0;
  let bj = 0;
  // decide which method of colour logic to use
  let seed = Math.round(Math.random()*2);
  if (seed == 0) {
    ri = hexToRgb(parent1.geneticColour).r;
    gi = hexToRgb(parent1.geneticColour).g;
    bi = hexToRgb(parent1.geneticColour).b;
    rj = hexToRgb(parent1.geneticColour).r;
    gj = hexToRgb(parent1.geneticColour).g;
    bj = hexToRgb(parent1.geneticColour).b;
  } else if (seed == 1) {
    ri = hexToRgb(parent2.geneticColour).r;
    gi = hexToRgb(parent2.geneticColour).g;
    bi = hexToRgb(parent2.geneticColour).b;
    rj = hexToRgb(parent2.geneticColour).r;
    gj = hexToRgb(parent2.geneticColour).g;
    bj = hexToRgb(parent2.geneticColour).b;
  } else {
    ri = hexToRgb(parent1.geneticColour).r;
    gi = hexToRgb(parent1.geneticColour).g;
    bi = hexToRgb(parent1.geneticColour).b;
    rj = hexToRgb(parent2.geneticColour).r;
    gj = hexToRgb(parent2.geneticColour).g;
    bj = hexToRgb(parent2.geneticColour).b;
  }
  // mix in a little random
  let seedR = Math.floor(Math.random()*255);
  let seedG = Math.floor(Math.random()*255);
  let seedB = Math.floor(Math.random()*255);
  combr = Math.round((ri+rj+seedR)/3);
  combg = Math.round((gi+gj+seedG)/3);
  combb = Math.round((bi+bj+seedB)/3);
  // spawn the baby
  chibis[chibis.length-1].geneticColour = rgbToHex(combr, combg, combb);
  chibis[chibis.length-1].speedY = -25;
  // set the baby's face gradient
  chibis[chibis.length-1].facemod[0] = (parent1.facemod[0] + parent2.facemod[0] + Math.random())/3;
  chibis[chibis.length-1].facemod[1] = (parent1.facemod[1] + parent2.facemod[1] + Math.random())/3;
  return babyGender;
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function clickMouse(e) {
  let stop = false;
  for (let i = 0; !stop && i < chibis.length; i++) {
    if (detectCollision(pointerPos, chibis[i])) {
      selection = chibis[i].id;
      stop = true;
      sendMessage('Name '+chibis[i].name+' gender '+chibis[i].gender+' age '+chibis[i].age);
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
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].awake) {
      let diffx = ex - chibis[i].x;
      let diffy = ey - chibis[i].y;
      // as long as it's not the guy that triggered it
      if (!diffx == 0 && !diffy == 0) {
        // if the guy is within range;
        let range = 200;
        if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
          chibis[i].love += 25;
          chibis[i].energy -= 50;
          chibis[i].health -= 10;
          diffx /= 5;
          diffy /= 5;
          if (diffx >= 0) {
            chibis[i].speedX -= (100-diffx)/2;
          } else if (diffx < 0) {
            chibis[i].speedX += (100-diffx)/2;
          }
          if (diffy >= 0) {
            chibis[i].speedY -= (100-diffy)/2;
          } else if (diffy <= 0) {
            chibis[i].speedY += (100-diffy)/2;
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
