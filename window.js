/**
* mate 0.44
**/

// universal physics constants
const gravity = 0.02;
const elasticity = 0.2;
const speedLimit = 100;
const superThreshold = 99;
// canvas
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
// set the environment start time and start values
const d = new Date();
const startTime = d.getHours();
const hourOfCreation = Math.floor(startTime * (1000/23));
const hocLength = 1000/12;
daytimeCounter = hourOfCreation;
timeMod = daytimeCounter;
anniversary = true;
day = 0;
paused = false;
chosenChibiM = false;
chosenChibiF = false;
chosenKitten = true;
elders = 0;
obelisks = 0;
guyID = 0;
selection = null;

// set global colours / limits
glowColour = '#FFFF88';
trueWhite = '#FFFFFF';
trueBlack = '#000000';
superColour = 255;

// init stuff
chibis = [];
graveStones = [];
myGhosts = [];
starfield = [];
comets = [];
trails = [];
glyphs = [];
fireflies = [];
trees = [];
seeds = [];
fruits = [];
pointerPos = new MousePosition(canvasWidth/2, canvasHeight/2);
fireflies.push(new FireFly(canvasWidth/2, trueBottom, pointerPos, 1, glowColour));
boxes = [];
buttons = [];
labels = [];

// font
let debugString = 'nothing'; // for debugging
const globalFont = 'Consolas';
// scaling for rotation
boxSize = 0;
fontSize = 15;
fontWidth = 8.4;
// if it is in landscape
if (canvasWidth > canvasHeight || canvasWidth == canvasHeight) {
  boxSize = 250*proportion;
} else {
  // if it is in portrait (like a phone)
  boxSize = canvasWidth/5;
}
const boxPadding = 20*proportion;
const boxColumns = 3;
const boxRows = 3;
const boxThickness = 10*proportion;
currentChibis = 0;
maleParent = null;
femaleParent = null;
choosingChibi = false;


// Images
// for my guys
const smile = new Image();
smile.src = 'smile.png';
const smile2 = new Image();
smile2.src = 'smile2.png';
const smile3 = new Image();
smile3.src = 'smile3.png';
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
outputArray = [];


// UI and messaging
basicInfo = new TextElement(fontSize+'px', trueWhite, 10, canvasHeight - 10);
newestMessage = new TextElement(fontSize+'px', trueWhite, 10, canvasHeight - 30);
let messagesToSave = canvasHeight/20;

/**
* function to start the simulation
*/
function startGame() {
  // chibis.push(new Chibi(canvasWidth*0.75, trueBottom-20, 6, 11.5, 'Female', 0));
  // chibis.push(new Chibi(canvasWidth-(canvasWidth*0.75), trueBottom-20, 6, 12, 'Male', 1));
  // let ethnicitySeed = Math.round(Math.random()*(numlibs-1));
  // while (chibis[0].name == null) {
  //   chibis[0].name = getRandomFemaleEthnicName(ethnicitySeed);
  // }
  // while (chibis[1].name == null) {
  //   chibis[1].name = getRandomMaleEthnicName(ethnicitySeed);
  // }
  // chibis[0].age = 1;
  // chibis[1].age = 1;
  // chibis[0].coatMod[0] = Math.random();
  // chibis[1].coatMod[0] = Math.random();
  // chibis[0].coatMod[1] = Math.random();
  // chibis[1].coatMod[1] = Math.random();
  // chibis[0].firstColour = randomColour();
  // chibis[1].firstColour = randomColour();

  // init console data
  sendMessage('Initialising');
  initButtons();
  sendMessage('Checking integrity of names database');
  console.log(reportNames());
  // start the game
  sendMessage('Starting simulation');
  myGameArea.start();
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
    let dayR = Math.floor(ri - ((((ri - rj)/250))*timeMod));
    let dayG = Math.floor(gi - ((((gi - gj)/250))*timeMod));
    let dayB = Math.floor(bi - ((((bi - bj)/250))*timeMod));
    outputArray[tick] = rgbToHex(dayR, dayG, dayB);
  }
  let tankGradient=ctx.createLinearGradient(0, 0, 0, canvasHeight);
  tankGradient.addColorStop(0, outputArray[0]);
  tankGradient.addColorStop(0.4, outputArray[1]);
  tankGradient.addColorStop(0.75, outputArray[2]);
  tankGradient.addColorStop(1, outputArray[3]);
  ctx.fillStyle=tankGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // change the value of trueWhite
  // trueWhite = mixTwoColours('#FFFFFF', outputArray[2], 0.5);
  hover();
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
  ctx.restore();

  // draw glow coming off the ground
  ctx.globalAlpha = 0.15;

  // update the seeds
  for (let i = 0; i < seeds.length; i++) {
    seeds[i].update();
    if (seeds[i].planted) {
      seeds.splice(i, 1);
      i--;
    }
  }

  // update the fruit
  for (let i = 0, stop = false; i < fruits.length; i++) {
        fruits[i].update();
    for (let j = 0; !stop && j < chibis.length; j++) {
      if (chibis[j].focus == fruits[i] && detectCollision(fruits[i], chibis[j])) {
        chibis[j].hunger += 200;
        chibis[j].health += 50;
        stop = true;
        sendMessage(chibis[j].name+' ate a piece of fruit');
        chibis[j].speedX = 0;
        chibis[j].speedY = 0;
        seeds.push(new Seed(fruits[i].colour, chibis[j]));
        fruits[i].parent.fruitCount--;
        fruits.splice(i, 1);
        i--;
      }
    }
  }

  let floorGlow = ctx.createLinearGradient(0, canvasHeight - muckLevel - 200, 0, canvasHeight);
  floorGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  floorGlow.addColorStop(1, mixTwoColours(trueWhite, outputArray[1], 0.5));
  ctx.fillStyle = floorGlow;
  ctx.fillRect(0, canvasHeight-muckLevel-5 - 200, canvasWidth, 5 + muckLevel + 200);
  // draw the floor
  ctx.globalAlpha = 1;

  let horizon = ctx.createLinearGradient(0, canvasHeight - muckLevel - 100, 0, canvasHeight-muckLevel);
  horizon.addColorStop(0, 'rgba(0, 0, 0, 0)');
  horizon.addColorStop(1, trueBlack);
  ctx.fillStyle = horizon;
  ctx.fillRect(0, canvasHeight-muckLevel-5, canvasWidth, 5+muckLevel);

  // draw the trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].update();
    if (trees[i].reachedMaxHeight && trees[i].y > trueBottom) {
      for (let j = 0; j < seeds.length; j++) {
        if (seeds[j].parent == trees[i]) {
          splice(j, 1);
          j--;
        }
      }
      trees.splice(i, 1);
      i--;
      sendMessage('A tree died');
    }
  }
  // draw the message history
  if (pointerPos.y > canvasHeight - muckLevel - 5) {
  let fade = ctx.createLinearGradient(0, 0, 0, trueBottom);
  let rMessage = Math.round((255+(hexToRgb(outputArray[2]).r))/2);
  let gMessage = Math.round((255+(hexToRgb(outputArray[2]).g))/2);
  let bMessage = Math.round((255+(hexToRgb(outputArray[2]).b))/2);
  fade.addColorStop(0, 'rgba('+rMessage+', '+gMessage+', '+bMessage+', 0.05)');
  fade.addColorStop(1, 'rgba('+rMessage+', '+gMessage+', '+bMessage+', 0.3)');
  // Fill with gradient
  ctx.fillStyle = fade;
  ctx.font = fontSize+'px' + ' ' + globalFont;
  for (let i = messageBuffer.length-2; i >= 0; i--) {
    ctx.fillText(messageBuffer[i].timeStamp+' '+messageBuffer[i].text, 10, 35+trueBottom-(20*(messageBuffer.length-i)));
  }
}
  // update the text
  basicInfo.text = tickerToTime(daytimeCounter) +' Day '+day+' Chibis '+chibis.length;
  basicInfo.update();
  newestMessage.text = currentMessage.timeStamp +' ' + currentMessage.text;
  newestMessage.update();
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();
  }
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].update();
  }
  for (let i = 0; i < labels.length; i++) {
    labels[i].update();
  }
  selectionInfo.update();

  if (!paused) {
    if (daytimeCounter < 1000) {
      daytimeCounter += 0.25;
      // establish if it is the age of creation or not
      if (chosenChibiF && chosenChibiM && !anniversary && (daytimeCounter <= Math.abs(1000-(hourOfCreation + hocLength) || daytimeCounter >= hourOfCreation) && daytimeCounter <= (hourOfCreation + hocLength))) {
        anniversary = true;
        if (elders > 0) {
          sendMessage('The Hour of Creation began');
        }
        day ++;
      } else if (chosenChibiF && chosenChibiM && anniversary && (daytimeCounter >= Math.abs(1000-(hourOfCreation + hocLength)) || daytimeCounter >= (hourOfCreation+ hocLength))) {
        anniversary = false;
        if (elders > 0) {
          sendMessage('The Hour of Creation ended');
        }
      }
    } else {
      daytimeCounter = 1;
    }

    // glyphs
    for (i = glyphs.length-1; i >= 0; i--) {
      glyphs[i].update();
      if (glyphs[i].timer < 0) {
        glyphs.splice(i, 1);
        i --;
      }
    }

    ctx.globalAlpha = 1;

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
        myGhosts.push(new Ghost(graveStones[d].x, graveStones[d].y, ghostSize*0.8, graveStones[d].firstColour));
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
        fireflies.push(new FireFly(myGhosts[i].x, myGhosts[i].y, fireflies[fireflies.length-1], fireFlySize, myGhosts[i].firstColour));
        fireflies[fireflies.length-1].touches = 200;
        myGhosts.splice(i, 1);
        i--;
      } else {
        myGhosts[i].update();
      }
    }


    // for my guys
    // global and prep first
    // check for both sexes
    let malePresent = false;
    let femalePresent = false;
    for (let i = 0; i < chibis.length; i++) {
      if (!chibis[i].elder && chibis[i].gender == 'Female') {
        femalePresent = true;
      } else if (!chibis[i].elder && chibis[i].gender == 'Male') {
        malePresent = true;
      }
    }
    if (!choosingChibi) {
      if (!femalePresent) {
        initFemaleCattery();
      } else if (!malePresent) {
        initMaleCattery();
      }
      if (chosenChibiF && chosenChibiM && chosenKitten) {
        chibis.sort(function twoVars(a, b) {
          if (a.health + a.energy + a.love> b.health+ b.energy + b.love) return 1;
          if (a.health + a.energy + a.love< b.health+ b.energy + b.love) return -1;
          return 0;
        });
      }
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
    // filter
    // ctx.globalAlpha = 0.25;
    // ctx.fillStyle = outputArray[2];
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // ctx.globalAlpha = 1;

    // rain
    // for (let i = 0; i < 500*proportion; i++) {
    //   ctx.lineWidth = 0.5 +(Math.random()*0.5);
    //   ctx.strokeStyle = trueWhite;
    //   ctx.globalAlpha = 0.1 + (Math.random()*0.5);
    //   ctx.beginPath();
    //   let dropX = Math.random()*canvasWidth;
    //   let dropY = (Math.random()*trueBottom) - 110;
    //   ctx.moveTo(dropX, dropY);
    //   ctx.lineTo(dropX+dropY, dropY+10+(Math.random()*100));
    //   ctx.stroke();
    //   ctx.globalAlpha = 1
    // }
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
function Tree(x, y, width, height, maxHeight, fruitColour) {
  this.reachedMaxHeight = false;
  this.loadthisframe = 0;
  this.circleCenterX = x;
  this.circleCenterY = y;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.maxHeight = maxHeight;
  this.fruitColour = fruitColour;
  this.fruitCount = 0;
  this.birthday = daytimeCounter;
  // this.angle = 0;
  // this.speedX = 0;
  // this.clockwise = clockwise;
  this.update = function() {
    if (this.fruitCount < 4 && this.birthday == daytimeCounter) {
      for (let i = 0; i < fruits.length; i++) {
        if (fruits[i].parent == this) {
          fruits.splice(i, 1);
          i--;
        }
      }
      fruits.push(new Fruit(this.fruitColour, this, 0));
      fruits.push(new Fruit(this.fruitColour, this, 1));
      fruits.push(new Fruit(this.fruitColour, this, 2));
      fruits.push(new Fruit(this.fruitColour, this, 3));
    }
    ctx.fillStyle = trueBlack;
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
    ctx.globalAlpha = 0.9;
    ctx.drawImage(acacia, this.x-(this.width*0.5), this.y-10, this.width, 200/(300/this.width));
    ctx.fillRect(this.x-(this.width/30), this.y+(this.width/4.5), this.width/12.5, trueBottom - this.y - this.height);
    this.loadthisframe = 0;
  };
}

/** function to describe a seed for a tree
*/
function Seed(colour, owner) {
  this.colour = colour;
  this.ownerid = ''+owner.id;
  this.timer = 250;
  this.planted = false;
  this.update = function() {
    this.timer --;
    let found = false;
    if (this.timer <= 0) {
      for (let i = 0; i < chibis.length; i++) {
        if (chibis[i].id == this.ownerid) {
          found = true;
          if (found && chibis[i].sitting && chibis[i].snuggling <= 0
            && chibis[i].y >= trueBottom-(chibis[i].size)-(chibis[i].limbLength/2.5)
            && tryToPlantaTree(chibis[i].x, this.colour)) {
              this.planted = true;
              sendMessage(chibis[i].name+' planted a seed');
            }
          }
        }
        if (!found) {
          // cheap way to tag the seed to be killed
          this.planted = true;
        }
      }
    };
  }

  /**
  * function to describe a piece of fruit on a tree
  */
  function Fruit(colour, parent, treePos) {
    this.colour = colour;
    this.parent = parent;
    this.treePos = treePos; // 0 to 3
    this.size = this.parent.width/20;
    this.x = 0;
    this.y = 0;
    this.update = function() {
      ctx.save();
      this.x = this.parent.x - (this.size*2.5) + ((treePos-1)*this.parent.width)/4;
      this.y = this.parent.y + (this.parent.width/4.5);
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.colour;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 0.025;
      let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 100);
      glow.addColorStop(0, this.colour);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      // Fill with gradient
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };
  };

  /**
  * function for a piece of plain text
  * @param {int} size - the size
  * @param {string} colour - the colour
  * @param {int} x - the x pos
  * @param {int} y - the y pos
  */
  function TextElement(size, colour, x, y) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.update = function() {
      ctx.font = this.size + ' ' + globalFont;
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
  * @param {string} firstColour - the colour
  */
  function FireFly(x, y, focus, size, firstColour) {
    this.x = x;
    this.y = y;
    this.focus = focus;
    this.speedX = 0;
    this.speedY = 0;
    this.size = size*20;
    this.touches = 0;
    this.touchedThisFrame = false;
    this.firstColour = firstColour;
    this.update = function() {
      if (this.x < 0 || this.x > canvasWidth) {
        this.speedX *= -0.98;
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
      let riGlow = hexToRgb(this.firstColour).r;
      let giGlow = hexToRgb(this.firstColour).g;
      let biGlow = hexToRgb(this.firstColour).b;
      let rjGlow = hexToRgb('#FF2288').r;
      let gjGlow = hexToRgb('#FF2288').g;
      let bjGlow = hexToRgb('#FF2288').b;
      let combr = Math.floor(riGlow - ((((riGlow - rjGlow)/400)))*this.touches);
      let combg = Math.floor(giGlow - ((((giGlow - gjGlow)/400)))*this.touches);
      let combb = Math.floor(biGlow - ((((biGlow - bjGlow)/400)))*this.touches);
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
  * @param {string} firstColour - the colour
  */
  function Grave(x, y, size, speedX, speedY, elder, firstColour) {
    this.x = x;
    this.y = y + 10;
    this.speedX = speedX/2;
    this.speedY = speedY/1000;
    this.timer = 200;
    this.hitBottom = false;
    this.elder = elder;
    this.tended = 0;
    this.firstColour = firstColour;
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
        checkBounceSides(this);
        checkBounceTop(this);
        let mass = gravity*(this.size*this.thickness*2)*(this.size*this.thickness*2);
        this.speedX *= 0.99;
        this.speedY += mass*gravity;
        applySpeedLimit(this);
        this.y += this.speedY/2;
        this.x += this.speedX/2;
      } else {
        // come to a rest at the bottom
        this.hitBottom = true;
        this.y = trueBottom - (this.size*5);
        this.speedY = 0;
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
    if (creature.energy > 0) {
      energy = Math.round((255*creature.energy)/100);
    } else {
      energy = 0;
    }
    // handle super saiyan colours
    if (creature.supersaiyan > 0) {
      love += creature.supersaiyan*((superColour - love)/100); // 0 to 255
      health += creature.supersaiyan*((superColour - health)/100); // 0 to 255
      energy += creature.supersaiyan*((superColour - energy)/100); // 0 to 255
    }
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
    if (energy > 255) {
      energy = 255;
    } else if (energy < 0) {
      energy = 0;
    }
    return rgbToHex(love, energy, health);
  }

  /**
  * function to handle chibis
  */
  function recalculateMyGuys() {
    // block for all my guys
    for (let i = 0; i < chibis.length; i++) {
      // check to see if it's time to die
      // attrition, aging etc.
      // check nirvana status
      if (!choosingChibi && !chibis[i].reachedNirvana && chibis[i].litters > 0 && chibis[i].age > 0 && chibis[i].size >= chibis[i].maxSize && chibis[i].supersaiyan == 0 && chibis[i].health >= superThreshold && chibis[i].energy >= superThreshold && chibis[i].love >= superThreshold) {
        explosions.push(new Explosion(chibis[i].x, chibis[i].y, chibis[i].firstColour, glowColour));
        produceExplosion(chibis[i].x, chibis[i].y);
        chibis[i].reachedNirvana = true;
        chibis[i].supersaiyan = 100;
        chibis[i].speedX = 0;
        chibis[i].speedY = 0;
        sendMessage(chibis[i].name+' reached nirvana');
      }
      // check for age
      if (chibis[i].birthday == daytimeCounter+1) {
        chibis[i].age ++;
        if (chibis[i].age == 1) {
          sendMessage(chibis[i].name+' reached adulthood');
        }

        // set elder status
        if (!choosingChibi && chibis[i].reachedNirvana && !chibis[i].elder && elders+1 <= chibis.length/4 && chibis[i].litters >= 2) {
          chibis[i].elder = true;
          chibis[i].size*=0.8;
          chibis[i].firstColour = decreaseSaturationHEX(chibis[i].firstColour);
          chibis[i].secondColour = decreaseSaturationHEX(chibis[i].secondColour);

          sendMessage(chibis[i].name+' became an Elder');
          createGlyphs(chibis[i].x, chibis[i].y, chibis[i].secretColour, '\u274b');

          elders++;
        } else if (elders > 1 && elders > chibis.length/4 && chibis[i].elder) {
          chibis[i].elder = false;
          elders --;
          sendMessage(chibis[i].name+' is no longer an elder');
        }
      }
      if (!choosingChibi && chibis[i].health <= 0) {
        createGlyphs(chibis[i].x, chibis[i].y, trueBlack, '\u271A');
        if (chibis[i].elder) {
          sendMessage('Elder '+chibis[i].name+' died');
          elders--;
        }
        graveStones.push(new Grave(chibis[i].x, chibis[i].y, chibis[i].size, chibis[i].speedX, chibis[i].speedY, chibis[i].elder, chibis[i].firstColour));
        sendMessage(chibis[i].name+' died');
        chibis.splice(i, 1);
        i--;
      } else {
        // grow them a tiny bit
        if (chibis[i].size < chibis[i].maxSize) {
          chibis[i].size += 1/500;
          chibis[i].reinitSizes();
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
        if (chibis[i].inCatBox == null && chibis[i].hunger <= 0) {
          sendMessage(chibis[i].name+' felt hungry');
          chibis[i].health -= 0.001;
        }
        if (chibis[i].speedY < 0) {
          chibis[i].health -= 0.1;
        }
        // if asleep, gain energy and a little health
        if (!chibis[i].awake) {
          chibis[i].energy += 0.125;
          chibis[i].health += 0.05;
        }
        // if energy goes above 100, wake up
        if (!chibis[i].awake && chibis[i].energy > 90) {
          chibis[i].awake = true;
          // console.log('woke up');
        }
        if (chibis[i].health > 100) {
          chibis[i].health = 100;
        }
        if (chibis[i].hunger > 0) {
          chibis[i].hunger -= 0.25;
        }

        // if you're a supersaiyan and you hit a grave ...

        // if you're an elder and you hit your focus (a grave or obelisk)
        for (let f = 0; f < graveStones.length; f++) {
          if (chibis[i].elder && chibis[i].awake && chibis[i].focus == graveStones[f]) {
            if (detectCollision(chibis[i], chibis[i].focus)) {
              chibis[i].speedX *=0.5;
              chibis[i].speedY *=0.5;
              if ((!chibis[i].focus.elder || !anniversary)) {
                chibis[i].focus.tended = 50;
                chibis[i].focus.timer += 5;
                let newC = mixTwoColours(chibis[i].firstColour, glowColour, 0.5);
                starfield.push(new Inert(3, 3, newC, chibis[i].focus.x, chibis[i].focus.y+(5*chibis[i].focus.size), true));
                chibis[i].health += 0.5;
              } else {
                chibis[i].focus.timer -= 30;
                chibis[i].love += 10;
                generateBaby(chibis[i], chibis[i]);
                let nameSeed = Math.round(Math.random()*totalMaleNames);
                if (chibis[chibis.length-1].gender == 'Male') {
                  chibis[chibis.length-1].name = getMaleName(nameSeed);
                } else if (chibis[chibis.length-1].gender == 'Female') {
                  chibis[chibis.length-1].name = getFemaleName(nameSeed);
                } else {
                  let nameSeed2 = Math.round(Math.random()*numlibs*namesinlib);
                  chibis[chibis.length-1].name = getRandomName(nameSeed+nameSeed2);
                }
                sendMessage(chibis[chibis.length-1].name+' was sprouted at an obelisk');
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

          if (!choosingChibi && i !== j && chibis[i].awake && chibis[j].awake && detectCollision(chibis[i], chibis[j])) {
            collide(chibis[i], chibis[j]);
            // having a snuggle
            if (chibis[i].snuggling <= 0 && chibis[j].snuggling <= 0 && chibis[i].partnerId == chibis[j].id && chibis[j].partnerId == chibis[i].id
              && chibis[i].supersaiyan == 0 && chibis[j].supersaiyan == 0 && !chibis[i].elder && !chibis[j].elder
              && chibis[i].health >= 50 && chibis[j].health >= 50 && chibis[i].energy >= 50 && chibis[j].energy >= 50) {
                // snuggle
                // pay the costs
                chibis[i].health -= 20;
                chibis[j].health -= 20;
                chibis[i].energy -= 35;
                chibis[j].energy -= 35;
                chibis[i].love += 50;
                chibis[j].love += 50;
                chibis[i].speedX = 0;
                chibis[j].speedX = 0;
                chibis[i].speedY = 0;
                chibis[j].speedY = 0;
                if (chibis[i].gender == 'Female') {
                  chibis[i].snuggling = 270;
                  chibis[j].snuggling = 250;
                } else if (chibis[i].gender == 'Male') {
                  chibis[i].snuggling = 250;
                  chibis[j].snuggling = 270;
                }
                sendMessage(chibis[i].name+ ' and '+chibis[j].name+' had a snuggle');
              }
            }
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

          if (!chibis[i].hitBottom) {
            let mass = gravity*chibis[i].size*6;
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
    * @return {boolean} - whether the tree was planted or not
    */
    function tryToPlantaTree(x, fruitColour) {
      let allow = true;
      let maxHeight = trueBottom*0.30+(Math.random()*(trueBottom*0.30));
      let treeWidth = 35 + (Math.random()*45);
      for (let j = 0; j < trees.length; j++) {
        if (trees[j].x == x || ( x - (treeWidth/4) < trees[j].x + (trees[j].width/4) && trees[j].x - (trees[j].width/4) < x + (treeWidth/4))) {
          allow = false;
        }
      }
      if (allow) {
        trees.push(new Tree(x, canvasHeight, treeWidth, 1, maxHeight, fruitColour));
        fruits.push(new Fruit(fruitColour, trees[trees.length-1], 0));
        fruits.push(new Fruit(fruitColour, trees[trees.length-1], 1));
        fruits.push(new Fruit(fruitColour, trees[trees.length-1], 2));
        fruits.push(new Fruit(fruitColour, trees[trees.length-1], 3));

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
      for (let i = 0; i < starfield.length; i++) {
        starfield[i].y -= Math.abs(0.5*(4-starfield[i].size));
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

    /**
    * function to create a glyph
    * @param {int} x -  the x coordinate
    * @param {int} y -  the y coordinate
    * @param {string} colour - the colour
    * @param {string} symbol - the symbol of the glyph
    */
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
    * @param {int} x - the x position
    * @param {int} y - the y position
    * @param {int} speedX - the x speed
    * @param {int} speedY - the y speed
    * @param {string} colour - the colour
    * @param {string} symbol - the symbol of the glyph
    */
    function Glyph(x, y, speedX, speedY, colour, symbol) {
      this.speedX = speedX;
      this.speedY = speedY;
      this.size = fontWidth;
      this.timer = 100;
      this.x = x;
      this.y = y;
      this.spin = 0;
      this.rotation = 0;
      this.step = 0.2;
      this.colour = colour;
      this.symbol = symbol;
      this.update = function() {
        this.speedY += gravity;
        for (let i = 0; i < glyphs.length; i++) {
          if (glyphs[i] !== this && detectCollision(glyphs[i], this)) {
            collide(this, glyphs[i]);
          }
        }
        checkBounceSides(this);
        checkBounceTop(this);
        checkBounceBottom(this);
        applySpeedLimit(this);
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.spin;
        this.spin *= 0.9;
        while (this.rotation > 6) {
          this.rotation -= 6;
        }
        while (this.rotation < -6) {
          this.rotation += 6;
        }
        this.timer -= this.step;
        // draw glyph
        ctx.globalAlpha = (this.timer/100)+0.000001;
        ctx.fillStyle = this.colour;
        ctx.font = '14px' + ' ' + globalFont;
        ctx.save();
        ctx.translate(this.x-(this.size/2), this.y+(this.size/2));
        ctx.rotate(this.rotation);
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      };
    }




    /**
    * function to turn the current ticker in the form of a 24 hour clock
    * @param {int} counter - the current time of day (0 to 1000)
    * @return {string} the minutes and seconds
    */
    function tickerToTime(counter) {
      let seconds = (86400/1000)*(counter);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      hours = ('0' + hours).slice(-2);
      minutes = Math.floor(minutes - (hours*60));
      minutes = ('0' + minutes).slice(-2);
      // seconds = Math.floor(seconds - (minutes*60));
      // seconds = ('0' + seconds).slice(-2);
      return (hours+':'+minutes/* +':'+seconds*/);
    }
