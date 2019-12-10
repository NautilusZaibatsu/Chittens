// universal physics constants
const gravity = 0.02; // constant for gravity
const elasticity = 0.5; // bounciness of chibis
const speedLimit = 100; // maximum X or Y speed
const maturesAt = 1; // age the chibis turn into adults at
// canvas
const canvasWidth = (window.innerWidth || document.body.clientWidth) - 20;
const canvasHeight = (window.innerHeight || document.body.clientHeight) - 20;
const maxDistance = canvasWidth*canvasHeight;
const muckLevel = 45;
const trueBottom = canvasHeight - muckLevel;
// UI and messaging
let messagesToSave = canvasHeight/20;

// global scaling values
idealX = 1920 - 20;
const idealY = 1080 - 20 - muckLevel;
const idealArea = idealX * idealY;
const proportion = 1/(idealArea/(canvasWidth*trueBottom));
const maxPop = 50*proportion;

secondTimer = 0;
fps = 0;
fpsCount = '00';
daytimeCounter = 0;
timeMod = daytimeCounter;
day = 0;
today = day;
dayNames = [];
dayNames[0] = 'Monday';
dayNames[1] = 'Tuesday';
dayNames[2] = 'Wednesday';
dayNames[3] = 'Thursday';
dayNames[4] = 'Friday';
dayNames[5] = 'Saturday';
dayNames[6] = 'Sunday';
season = 1; // spring
seasonNext = 2; // summer
paused = false;
chosenChibiM = true;
chosenChibiF = true;
chosenKitten = true;
choiceTimer = 0;
guyID = 0;
maleCount = 0;
femaleCount = 0;
nonbinaryCount = 0;
selection = null;

// set global colours / limits
glowColour = '#FFFF88';
trueWhite = '#FFFFFF';
nosePink = '#f5b2c1';
noseBlack = '#27090f';
trueBlack = '#000000';
albinoRed = '#ee4433';
superColour = 255;
genderPink = '#f27bfe';
genderBlue = '#78c7fc';
genderPurple = '#9978f1';
healthGreen = '#4ee986';
lovePink = '#eb8ec9';
energyBlue = '#1e6ee9';
hungerOrange = '#e9af4e';

// set timer parameters
const glyphTimer = 100;

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
dummypointerPos = new DummyPointer();
touchOnorOffThisFrame = false;

boxes = [];
parentBoxes = [];
buttons = [];
labels = [];
speech = [];

// gene editing
geneEditing = false;
spliceBox = new CatBox(20, 30, 100, 5);
sliderIndex = 0;
colourBars = new ColourBar(130, 155);
colourBlock = new ColourPixelBlock();

// font
const globalFont = 'Consolas';
// scaling for rotation
boxSize = 0;
fontSize = 15;
fontWidth = 8.4;
// if it is in landscape
if (canvasWidth > canvasHeight || canvasWidth == canvasHeight) {
  boxSize = 200*proportion;
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
// landscape
const newtree = new Image();
newtree.src = 'newtree.png';
const acacia = new Image();
acacia.src = 'acacia.png';
const clouds = new Image();
clouds.src = 'clouds.png';
clouds.onload = function() {
  console.log('Images buffered succesfully');
};

// for my guys
const smile = new Image();
smile.src = 'smile.png';
const smile2 = new Image();
smile2.src = 'smile2.png';
const smile3 = new Image();
smile3.src = 'smile3.png';
const content = new Image();
content.src = 'content.png';
const pattern0 = new Image();
pattern0.src = 'pattern0.png';
const pattern1 = new Image();
pattern1.src = 'pattern1.png';
const pattern2 = new Image();
pattern2.src = 'pattern2.png';
const pattern3 = new Image();
pattern3.src = 'pattern3.png';
const pattern6 = new Image();
pattern6.src = 'pattern6.png';
const butthole = new Image();
butthole.src = 'butthole.png';

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
spectre.src = 'ghost.png';
// explosions
let explosions = [];

// set background gradient colours
nightcolour = [];
nightcolour[0] = '#1c324c';
nightcolour[1] = '#79366d';
nightcolour[2] = '#334d5b';
nightcolour[3] = '#281b41';
morningcolour = [];
morningcolour[0] = '#0f2d45';
morningcolour[1] = '#82325e';
morningcolour[2] = '#b63d20';
morningcolour[3] = '#5b3100';
middaycolour = [];
middaycolour[0] = '#1c324c';
middaycolour[1] = '#6f4730';
middaycolour[2] = '#3b505b';
middaycolour[3] = '#4f686c';
midnightcolour = [];
midnightcolour[0] = '#020421';
midnightcolour[1] = '#020423';
midnightcolour[2] = '#020e2b';
midnightcolour[3] = '#010005';
outputArray = [];

// set seasonal colours and temperatures
seasonText = 'Spring';
seasonColour = [];
seasonColour[0] = '#ee7f17'; // autumn
seasonColour[1] = '#5ec3ed'; // winter
seasonColour[2] = '#73bf4f'; // spring
seasonColour[3] = '#fae10b'; // summer
temperature = 30;
tempSpring = 15;
tempSummer = 30;
tempAutumn = 10;
tempWinter = 0;

/**
* function to start the simulation
*/
function startGame() {
  // init > console data
  sendMessage('Initialising');
  initButtons();
  sendMessage('Checking integrity of names database');
  console.log(reportNames());
  // initial fireflies, trees etc
  for (let i = 0; i < 2; i++) {
    if (Math.random() < 0.5) {
      fireflies.push(new FireFly(0, Math.random()*trueBottom, pointerPos, 1, glowColour));
    } else {
      fireflies.push(new FireFly(canvasWidth, Math.random()*trueBottom, pointerPos, 1, glowColour));
    }
  }
  // plant trees to begin with
  let defaultTreeNumber = canvasWidth/250;
  let defaultFruitColour = randomColourFruity();
  for (let i = 0; i < defaultTreeNumber; i++) {
    tryToPlantaTree(Math.abs(Math.random()*canvasWidth), defaultFruitColour);
    trees[trees.length - 1].y = trueBottom - (trees[trees.length - 1].maxHeight * Math.random() * 0.33);
  }
  // gene editing
  experiment = new Chibi(70, 90, 13.5, 10, 'Female');
  experiment.name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
  randomiseGenetics(experiment);
  experiment.awake = true;
  experiment.hitBottom = true;
  initSliders();

  // start the game
  sendMessage('Starting simulation');
  recalcSeasonVariables();
  myGameArea.start();
  // set up patterns for CHIBIS
  ctx = myGameArea.context;
  pat0 = ctx.createPattern(pattern0, 'repeat'); // debug
  pat1 = ctx.createPattern(pattern1, 'repeat'); // tortoiseshell
  pat2 = ctx.createPattern(pattern2, 'repeat'); // albino spotting
  pat3 = ctx.createPattern(pattern3, 'repeat'); // tabby
  pat4 = ctx.createRadialGradient(0, 0, 0, 0, 0, 0); // persian face colour gradient
  // pat5 = Lykoi
  pat6 = ctx.createPattern(pattern6, 'repeat'); // tabby

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

    // check mouse position first
    this.canvas.addEventListener('mousemove', function(event) {
      pointerPos = trackMouse(event);
    });

    // add listener for touch
    this.canvas.addEventListener('touchmove', function(event) {
      pointerPos.x = event.touches[0].clientX;
      pointerPos.y = event.touches[0].clientY;
    });
    this.canvas.addEventListener('touchstart', function(event) {
      pointerPos.x = event.touches[0].clientX;
      pointerPos.y = event.touches[0].clientY;
      tapOn();
    });
    this.canvas.addEventListener('touchend', function(event) {
      tapOff();
    });

    // add listener for mouse
    this.canvas.addEventListener('mousedown', function(event) {
      mouseOn();
    });
    this.canvas.addEventListener('mouseup', function(event) {
      mouseOff();
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
  touchOnorOffThisFrame = false;
  if (myGameArea.frameNo == 1 || everyinterval(3)) {
    // fire a comet
    if (fps >= 30 && Math.random() < 0.005 && (daytimeCounter <= 250 || daytimeCounter >= 750)) {
      ranX = Math.floor(Math.random()*(canvasWidth));
      if (Math.random() < 0.5) {
        ranY = 0;
      } else {
        ranY = canvasWidth;
      }
      comets.push(new Inert(2, 2, trueWhite, ranX, ranY));
      if (ranY == 0) {
        comets[comets.length-1].speedX = Math.random();
      } else {
        comets[comets.length-1].speedX = -Math.random();
      }
      comets[comets.length-1].speedY = - Math.random() + 0.1;
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
      debugString = 'daytimeCounter' + daytimeCounter;

      // create seasonal colour shading
      let tempColour = mixTwoColours(seasonColour[seasonNext], seasonColour[season], daytimeCounter/1000);
      // shade backgrouund
      outputArray[tick] = mixTwoColours(rgbToHex(dayR, dayG, dayB), tempColour, 0.75);
    }
    // detect temperature
    let temp1 = 0;
    let temp2 = 0;
    if (season == 0) {
      temp1 = tempAutumn;
      temp2 = tempWinter;
    } else if (season == 1) {
      temp1 = tempWinter;
      temp2 = tempSpring;
    } else if (season == 2) {
      temp1 = tempSpring;
      temp2 = tempSummer;
    } else if (season == 3) {
      temp1 = tempSummer;
      temp2 = tempAutumn;
    }
    temperature = (temp2*(daytimeCounter/1000))+(temp1*(1-(daytimeCounter/1000)));
    temperature = ('0' + Math.round(temperature)).slice(-2);
  }


  // countdown timer, used when choosing from a litter
  if (!paused && !chosenKitten) {
    labels[2].text = parseInt(choiceTimer/50);
    // check the timer
    if (choiceTimer > 0) {
      choiceTimer --;
    }
    if (choiceTimer == 0) {
      if (selection == null) {
        selection = chibis[Math.round(Math.random()*(boxes.length-1))+currentChibis];
      }
      handleButton(1);
    }
  }

  let tankGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  tankGradient.addColorStop(0, outputArray[0]);
  tankGradient.addColorStop(0.4, outputArray[1]);
  tankGradient.addColorStop(0.75, outputArray[2]);
  tankGradient.addColorStop(1, outputArray[3]);
  ctx.fillStyle = tankGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // change the value of trueWhite
  // trueWhite = mixTwoColours('#FFFFFF', outputArray[2], 0.5);
  hover();
  // fix the starfield
  if (!paused) {
    recalculateStarfield();
    recalculateComets();
  }

  for (i = starfield.length-1; i >= 0; i--) {
    starfield[i].update();
  }
  // trails
  for (i = trails.length-1; i >= 0; i--) {
    trails[i].update();
    if (!paused) {
      trails[i].timer --;
    }
    if (trails[i].timer < 0) {
      trails.splice(i, 1);
      i --;
    }
  }

  // background
  // draw the clouds - disappearring at nighttime
  ctx.globalAlpha = 0.3;
  if (daytimeCounter <= 300) {
    ctx.globalAlpha = 0.3 - (0.3*((300 - daytimeCounter)/300));
  } else if (daytimeCounter > 700) {
    ctx.globalAlpha = 0.3 - (0.3*((daytimeCounter-700)/300));
  }
  let offsetX = daytimeCounter*(canvasHeight/540*2160)/1000;
  ctx.drawImage(clouds, - offsetX, 0, (canvasHeight/540*2160), canvasHeight);
  if (offsetX > canvasWidth) {
    ctx.drawImage(clouds, (canvasHeight/540*2160) - offsetX, 0, (canvasHeight/540*2160), canvasHeight);
  }

  ctx.globalAlpha = 1;

  // draw the background
  // center and translate the image
  ctx.save();
  ctx.translate((canvasWidth-idealX)/2, (canvasHeight-idealY)/2);
  ctx.drawImage(newtree, 0, 0, newtree.width, newtree.height);
  ctx.restore();

  // update the seeds
  for (let i = 0; i < seeds.length; i++) {
    seeds[i].update();
    if (seeds[i].planted) {
      seeds.splice(i, 1);
      i--;
    }
  }

  // update the fruit
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater !== null) {
      if (fruits[i].eater !== 'X' && fruits[i].eater.hitBottom && fruits[i].eater.nomnomnom == -1) {
        // sendMessage(fruits[i].eater.name+' ate a piece of fruit');
        if (Math.random() < 0.05) {
          speech.push(new Speak(fruits[i].eater, happyWord()));
        }
        fruits[i].eater.hunger += 500;
        fruits[i].eater.health += 50;
        fruits[i].eater.nomnomnom = 125;
        fruits[i].eater.sitting = true;
      } else if (fruits[i].eater !== 'X' && fruits[i].eater.hitBottom && fruits[i].eater.nomnomnom <= 0) {
        removeFocusFrom(fruits[i]);
        fruits.splice(i, 1);
        i--;
      }
    }
  }
  // draw the fruit that should appear BEHIND chibis
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == null) {
      fruits[i].update();
    }
  }

  // draw the glow coming off the floor
  ctx.globalAlpha = 0.15;
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
      // sendMessage('A tree died');
    }
  }
  // draw the message history
  if (pointerPos.y > canvasHeight - muckLevel - 5) {
    let fade = ctx.createLinearGradient(0, 0, 0, trueBottom);
    let rMessage = Math.round(hexToRgb(outputArray[2]).r);
    let gMessage = Math.round(hexToRgb(outputArray[2]).g);
    let bMessage = Math.round(hexToRgb(outputArray[2]).b);
    fade.addColorStop(0, 'rgba('+rMessage+', '+gMessage+', '+bMessage+', 0.05)');
    fade.addColorStop(1, 'rgba('+rMessage+', '+gMessage+', '+bMessage+', 0.3)');
    // Fill with gradient
    ctx.fillStyle = fade;
    ctx.font = fontSize+'px' + ' ' + globalFont;
    for (let i = messageBuffer.length-2; i >= 0; i--) {
      ctx.fillText(messageBuffer[i].timeStamp +' '+ messageBuffer[i].text, 10, 30 + trueBottom - (20*(messageBuffer.length-i)));
    }
  }
  // update the text
  d = new Date();
  if (d.getSeconds() !== secondTimer) {
    secondTimer = d.getSeconds();
    fps = fpsCount;
    fpsCount = 0;
  } else {
    fpsCount ++;
  }

  if (!paused) {
    // increase daytime counter and make seasons rotate
    daytimeCounter += 0.25;
    if (daytimeCounter >= 1000) {
      daytimeCounter = 1;
      day ++;
      // calculate the count (array position) of the day of the week
      let tempDay = day;
      while (tempDay > 6) {
        tempDay -= 7;
      }
      today = tempDay;
      season ++;
      recalcSeasonVariables();
    }
  }

  // glyphs
  for (i = glyphs.length-1; i >= 0; i--) {
    glyphs[i].update();
    if (glyphs[i].timer < 0 || fps < 30) {
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
      myGhosts.splice(i, 1);
      i--;
    } else {
      myGhosts[i].update();
    }
  }

  // check for both sexes - if either sex is not present we will init the cattery for adoption
  let malePresent = false;
  let femalePresent = false;
  femaleCount = 0;
  maleCount = 0;
  nonbinaryCount = 0;
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].inCatBox == null) {
      if (chibis[i].gender == 'Female') {
        femalePresent = true;
        femaleCount ++;
      } else if (chibis[i].gender == 'Male') {
        malePresent = true;
        maleCount ++;
      } else {
        nonbinaryCount++;
      }
    }
  }

  //   if (!choosingChibi) {
  //   if (!femalePresent) {
  //     initFemaleCattery();
  //   } else if (!malePresent) {
  //     initMaleCattery();
  //   }
  // }


  // firefly logic
  for (let f = 0; f < fireflies.length; f++) {
    fireflies[f].touchedThisFrame = false;
    if (fireflies[f].touches >= 500) {
      // create the explosion
      explosions.push(new Explosion(fireflies[f].x, fireflies[f].y, '#FF2288', glowColour));
      produceExplosion(fireflies[f].x, fireflies[f].y);
      let targets = [];
      for (let i = 0; i < chibis.length; i ++) {
        if (fireflies[f] == chibis[i].focus) {
          targets.push(chibis[i]);
        }
      }
      fireflies.splice(f, 1);
      f--;
      if (targets > 0) {
        for (let i = 0; i < targets.length; i++) {
          targets[i].focus = targets[i].findClosestFireFly();
        }
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

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();
  }
  for (let i = 0; i < parentBoxes.length; i++) {
    parentBoxes[i].update();
  }


  recalculateMyGuys();
  // DRAW SLEEPING CHIBIS FIRST
  for (let i = 0; i < chibis.length; i++) {
    if (!chibis[i].awake) {
      chibis[i].update();
    }
  }
  // NOW AWAKE CHIBIS
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].awake) {
      chibis[i].update();
    }
  }

  // draw the fruit that should appear IN FRONT OF chibis
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater !== null) {
      fruits[i].update();
    }
  }
  for (let i = 0; i < speech.length; i++) {
    for (let j = i+1; j < speech.length; j++) {
      if (speech[i].who == speech[j].who) {
        speech[i].flagged = true;
      }
    }
    if (!speech[i].flagged) {
      speech[i].update();
    } else {
      speech.splice(i, 1);
    }
  }
  // setting focus for fireflies
  for (let f = 0; f < fireflies.length; f++) {
    if (!fireflies[f].justAte && !fruits.includes(fireflies[f].focus)) {
      fireflies[f].chooseNewTarget();
    } else if (fireflies[f].focus.y > trueBottom - fireflies[f].focus.size) {
      fireflies[f].chooseNewTarget();
    } else if (Math.random() > 0.995) {
      fireflies[f].chooseNewTarget()
    } else {
      if ((Math.abs(fireflies[f].speedX)+(fireflies[f].speedY))/2 < 1) {
        if (detectCollision(fireflies[f], fireflies[f].focus)) {
          fireflies[f].speedX *= 0.5;
          fireflies[f].speedY *= 0.5;
          fireflies[f].stomach ++;
          fireflies[f].justAte = true;
          if (fireflies[f].stomach >= 10) {
            fireflies[f].stomach = 0;
            fireflies.push(new FireFly(fireflies[f].focus.x, fireflies[f].focus.y, fireflies[f].focus, 0.5, fireflies[f].firstColour));
            fireflies[fireflies.length-1].chooseNewTarget();
            fireflies[fireflies.length-1].touches = 250;
          }
          let victimIndex = findIndex(fireflies[f].focus, fruits);
          removeFocusFrom(fireflies[f].focus);
          fireflies[f].chooseNewTarget();
          fruits.splice(victimIndex, 1);
        }
      }
    }
    // draw their trails, log touches, then update
    trails.push(new Particle(fireflies[f].size/10, glowColour, fireflies[f].x, fireflies[f].y, fireflies[f].speedX, fireflies[f].speedY));
    if (fireflies[f].touchedThisFrame) {
      if (f == 0 && fireflies[f].touches == 400) {
        let x = 0;
        if (Math.random() < 0.5) {
          x = canvasWidth;
        }
        fireflies.push(new FireFly(x, Math.random()*trueBottom, pointerPos, 1, glowColour));
      }
      fireflies[f].touches += 1;
      fireflies[f].chooseNewTarget();
    }
    fireflies[f].update();
  }

  // pause blacking out
  if (paused) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = mixTwoColours(trueBlack, outputArray[3], 0.5);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = 1;
  }
  basicInfo = new TextElement(fontSize+'px', outputArray[2], 10, canvasHeight - 5);
  basicInfo.text = tickerToTime(daytimeCounter) +' Day '+day+' Chibis '+(femaleCount+maleCount+nonbinaryCount) + ' /'+femaleCount+'F '+maleCount+'M '+nonbinaryCount+'N '; // +(chibis.length + trees.length + fruits.length + fireflies.length + seeds.length + glyphs.length);
  basicInfo.update();
  topLabel = new TextElement(fontSize+'px', outputArray[2], canvasWidth - 115, 17);
  topLabel.text = 'v0.065 FPS '+fps;
  topLabel.update();
  // day of the week and the season
  leftLabel = new TextElement(fontSize+'px', outputArray[2], 255, 17);
  leftLabel.text = dayNames[today]+', '+seasonText+ ' '+temperature+'\u00B0';
  leftLabel.update();
  newestMessage = new TextElement(fontSize+'px', outputArray[2], 10, canvasHeight - 25);
  if (!paused) {
    newestMessage.text = currentMessage.timeStamp +' ' + currentMessage.text;
  } else {
    newestMessage.text = tickerToTime(daytimeCounter) +' Simulation paused';
  }
  newestMessage.update();

  // gene editing block
  if (geneEditing) {
    spliceBox.update();
    experiment.update();
    colourBars.update();
    colourBlock.update();
    for (let i = 0; i < sliders.length; i++) {
      sliders[i].update();
    }
  }

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

  for (let i = 0; i < labels.length; i++) {
    labels[i].update();
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].update();
  }
  for (let i = 0; i < buttons.length; i++) {
    // tool tip - draw on top of buttons and labels
    if (buttons[i].visible && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
      buttons[i].drawToolTip();
    }
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
  this.size = 5;
  this.spawnFruit = function() {
    // find out how many fruits are on this tree
    let fruitsOnTree = 0;
    let positions = [];
    for (let i = 0; i < fruits.length; i++) {
      if (fruits[i].parent == this) {
        fruitsOnTree++;
        positions.push(fruits[i].treePos);
      }
    }
    if (fruitsOnTree < 4) {
      // add a fruit in a random position
      let target = fruitsOnTree + 1;
      while (fruitsOnTree < target) {
        let posTemp = Math.round(Math.random()*3);
        if (!positions.includes(posTemp)) {
          fruits.push(new Fruit(this.fruitColour, this, posTemp));
          fruitsOnTree ++;
        }
      }
    }
    // check that all fruits are on screen
    for (let i = fruits.length-1; i >= 0; i--) {
      if (fruits[i].x < 0 || fruits[i].x > canvasWidth) {
        removeFocusFrom(fruits[i]);
        fruits.splice(i, 1);
      }
    }
  };
  this.update = function() {
    if (!paused) {
      // respawning fruit twice a day
      if (this.birthday == daytimeCounter || Math.abs(this.birthday - daytimeCounter) == 500) {
        this.spawnFruit();
      }
      ctx.fillStyle = trueBlack;
      if (this.y > canvasHeight) {
        this.y = canvasHeight;
      }
      if (this.y < trueBottom-this.maxHeight) {
        this.y = trueBottom-this.maxHeight;
        this.reachedMaxHeight = true;
      }

      if (this.reachedMaxHeight) {
        this.y += (this.loadthisframe/60) + (0.0125*(75/this.width));
      } else {
        if (this.y <= canvasHeight && this.y >= trueBottom-(this.maxHeight)) {
          this.y += (this.loadthisframe/60) - (0.025*(75/this.width));
        }
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
  this.owner = owner;
  this.timer = Math.random()*750;
  this.planted = false;
  this.update = function() {
    this.timer --;
    let found = false;
    if (this.timer <= 0) {
      for (let i = 0; i < chibis.length && !found; i++) {
        if (chibis[i] == this.owner) {
          found = true;
          if (found && chibis[i].snuggling <= 0 && chibis[i].nomnomnom <= 0
            && chibis[i].y >= trueBottom-chibis[i].size-chibis[i].limbLength
            && tryToPlantaTree(chibis[i].x, this.colour)) {
              this.planted = true;
              // sendMessage(chibis[i].name+' planted a seed');
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

  function removeFocusFrom(who) {
    for (let i = 0; i < fireflies.length; i++) {
      if (fireflies[i].focus == who) {
        fireflies[i].chooseNewTarget();
      }
    }
    for (let i = 0; i < chibis.length; i++) {
      if (chibis[i].focus == who) {
        chibis[i].focus = chibis[i].findClosestFireFly();
      }
    }
  }

  function findIndex(who, where) {
    for (let i = 0; i < where.length; i++) {
      if (where[i] == who) {
        return i;
      }
    }
    console.log('error - object not found in array at findIndex');
  };


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
    this.eater = null;
    this.update = function() {
      if (this.eater !== null) {
        this.x = this.eater.x;
        this.y = this.eater.y + (this.eater.size*1.75);
      } else {
        this.x = this.parent.x - (this.size*2.5) + ((treePos-1)*this.parent.width)/4;
        this.y = this.parent.y + this.size + (this.parent.width/10);
      }
      ctx.save();
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
    this.stomach = 0;
    this.justAte = false;
    createGlyphs(this.x, this.y, '\u25EF');
    this.chooseNewTarget = function() {
      if (this.justAte) {
        this.focus = pointerPos;
      } else {
        // set up an array of option indexes
        let options = [];
        for (let i = 0; i < fruits.length; i ++) {
          let flagged = false;
          // don't pick a fruit from the same tree
          if (fruits[i].parent == this.focus.parent) {
            flagged = true;
          } else {
            for (let j = 0; j < fireflies.length; j++) {
              if (fruits[i] == fireflies[j].focus) {
                flagged = true;
              }
            }
          }
          if (!flagged && fruits[i] !== this.focus && fruits[i].y < trueBottom) {
            options.push(i);
          }
        }
        let diffx = 0;
        let diffy = 0;
        let absolute = 0;
        let smallAbs = canvasWidth * canvasHeight;
        let target = 0;
        if (options.length > 0) {
          for (let i = 0; i < options.length; i ++) {
            diffx = Math.abs(this.x - fruits[options[i]].x);
            diffy = Math.abs(this.x - fruits[options[i]].y);
            absolute = Math.sqrt((diffy*diffy) + (diffx*diffx));
            if (absolute < smallAbs) {
              smallAbs = absolute;
              target = options[i];
            }
          }
          this.focus = fruits[target];
        } else if (options.length == 0) {
          // no valid targets
          this.focus = pointerPos;
        }
      }
    };
    this.update = function() {
      /* focus lines and label */
      //   if (this.focus !== null) {
      //     ctx.globalAlpha = 0.25;
      //   ctx.strokeStyle = trueWhite;
      //   ctx.lineWidth = 1;
      //   ctx.beginPath();
      //   ctx.moveTo(this.x, this.y);
      //   ctx.lineTo(this.focus.x, this.focus.y);
      //   ctx.stroke();
      //   }
      //   if (Math.abs(this.speedX) < 2 && Math.abs(this.speedY) < 2) {
      //   ctx.fillText('SLO', this.x, this.y - 10);
      // }
      if (!paused) {
        if (this.justAte && Math.random() < 0.995) {
          this.justAte = false;
        }
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
      }

      let glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 100);
      glow.addColorStop(0, this.firstColour);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      // Fill with gradient
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.3*this.size/40;// - (this.touches/2000);
      ctx.beginPath();
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
    this.speedY = speedY/2;
    this.timer = 500;
    this.hitBottom = false;
    this.elder = elder;
    this.firstColour = firstColour;
    // elders spawn obelisks
    if (this.elder) {
      this.image = obelisk;
      this.size = size*1.5;
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
      this.timer -= 0.075;
      if (!this.hitBottom && this.y < trueBottom-(this.size*5)) {
        checkBounceSides(this);
        checkBounceTop(this);
        let mass = gravity*(this.size*2)*(this.size*2);
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
  * function to handle chibis
  */
  function recalculateMyGuys() {
    // block for all my guys
    if (!paused) {
      for (let i = 0; i < chibis.length; i++) {
        // do dragging first
        if (chibis[i].dragging) {
          chibis[i].facingForwards = true;
          chibis[i].x = pointerPos.x;
          chibis[i].y = pointerPos.y;
          chibis[i].speedX = 0;
          chibis[i].speedY = 0;
          chibis[i].resetRotation();
          if (selection == chibis[i]) {
            dummypointerPos.update();
          }
          chibis[i].sitting = false;
          chibis[i].hitBottom = false;
        }
        // check to see if it's time to die
        // attrition, aging etc.
        // increasing age, and related checks
        if (chibis[i].inCatBox == null && chibis[i].birthday == daytimeCounter+1) {
          chibis[i].age ++;
          // maturing to adult
          if (chibis[i].age == maturesAt) {
            sendMessage(chibis[i].name+' reached adulthood');
            if (chibis[i].energy < 50) {
              chibis[i].energy += 50;
            } else {
              (chibis[i].energy = 100);
            }
            chibis[i].love += 25;
            createGlyphs(chibis[i].x, chibis[i].y, '\u274b');
            // reaching old age
          } else if (chibis[i].age >= chibis[i].maxAge-1 && !chibis[i].elder) {
            chibis[i].elder = true;
            chibis[i].firstColour = decreaseSaturationHEX(chibis[i].firstColour, 2);
            chibis[i].secondColour = decreaseSaturationHEX(chibis[i].secondColour, 2);
            chibis[i].thirdColour = decreaseSaturationHEX(chibis[i].thirdColour, 2);
            sendMessage(chibis[i].name+' reached old age');
            createGlyphs(chibis[i].x, chibis[i].y, '\u274b');
            // dying of old age
          } else if (chibis[i].snuggling == -1 && chibis[i].nomnomnom == -1 && chibis[i].age > chibis[i].maxAge) {
            sendMessage(chibis[i].name+' died of old age');
            graveStones.push(new Grave(chibis[i].x, chibis[i].y, chibis[i].size, chibis[i].speedX, chibis[i].speedY, chibis[i].elder, chibis[i].firstColour));
            chibis[i].kill();
            i--;
          }
        }
      }
      // start a new loop to check for next cause of death
      for (let i = 0; i < chibis.length; i++) {
        // dying because of low health
        if (chibis[i].health <= 0) {
          createGlyphs(chibis[i].x, chibis[i].y, '\u271A');
          graveStones.push(new Grave(chibis[i].x, chibis[i].y, chibis[i].size, chibis[i].speedX, chibis[i].speedY, chibis[i].elder, chibis[i].firstColour));
          sendMessage(chibis[i].name+' died');
          removeRelationships(chibis[i]);
          chibis[i].kill();
          i--;
          // so as long as that doesn't kill you......
        } else {
          // grow them a tiny bit
          if (chibis[i].size < chibis[i].maxSize) {
            chibis[i].size += 1/2000;
            if (chibis[i].age < maturesAt) {
              chibis[i].size += 1/2000;
            }
            chibis[i].reinitSizeAndColour();
          }
          chibis[i].love -= 0.1;
          if (chibis[i].health > 0 && chibis[i].inCatBox !== null) {
            chibis[i].health -= 0.001;
          }
          if (chibis[i].inCatBox == null && chibis[i].hunger <= 0 && chibis[i].awake && chibis[i].snuggling <= 0 && chibis[i].nomnomnom <= 0) {
            if (Math.random() <= 0.0005) {
              speech.push(new Speak(chibis[i], angryWord()));
            }
            chibis[i].health -= 0.001;
          }
          if (chibis[i].speedY < 0) {
            chibis[i].health -= 0.1;
          }

          // tiredness linked to temperature (30 is max temp)
          chibis[i].energy -= 0.01325-(0.01325/30*temperature)
          if (season == 1) {
            // get less tired and more amorous in spring
            chibis[i].energy += 0.07;
            chibis[i].love += 1.5;
          } else if (season == 2) {
            // get more energy in summer
            chibis[i].energy += 0.04;
          }
          // get more tired between midnight and 3am
          if (chibis[i].awake && daytimeCounter <= 250) {
            chibis[i].energy -= 0.03125;
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
          if (chibis[i].love > 100) {
            chibis[i].love = 100;
          } else if (chibis[i].love < 0) {
            chibis[i].love = 0;
          }
          if (chibis[i].health > 100) {
            chibis[i].health = 100;
          }
          if (chibis[i].energy > 100) {
            chibis[i].energy = 100;
          } else if (chibis[i].energy < 0) {
            chibis[i].energy = 0;
          }
          if (chibis[i].hunger > 0) {
            chibis[i].hunger -= 0.25;
          } else if (this.hunger < 0) {
            this.hunger == 0;
          } else if (this.hunger > 1000) {
            this.hunger = 1000;
          }

          for (let j = 0; j < chibis.length; j++) {
            // if two chibis bump into each other
            if (i !== j && chibis[i].awake && chibis[j].awake && !chibis[i].hitBottom && !chibis[j].hitBottom && detectCollision(chibis[i], chibis[j])) {
              collide(chibis[i], chibis[j]);
              // having a snuggle
              if (chibis[i].nomnomnom <= 0 && chibis[j].nomnomnom <= 0 && chibis[i].snuggling == -1 && chibis[j].snuggling == -1
                && chibis[i].partner == chibis[j] && chibis[i].gender == 'Male' && chibis[j].gender == 'Female'
                && !chibis[i].elder && !chibis[j].elder
                && chibis[i].health >= 40 && chibis[j].health >= 40 && chibis[i].energy >= 40 && chibis[j].energy >= 40) {
                  // snuggle
                  chibis[j].partner = chibis[i];
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
                  chibis[i].sitting = true;
                  chibis[j].sitting = true;
                  if (Math.random() < 1/3) {
                    speech.push(new Speak(chibis[i], happyWord()));
                  } else if (Math.random() < 2/3) {
                    speech.push(new Speak(chibis[j], happyWord()));
                  }
                  chibis[i].facingForwards = true;
                  chibis[j].facingForwards = true;
                  chibis[i].snuggling = 250;
                  chibis[j].snuggling = 260;
                  sendMessage(chibis[j].name+' and '+chibis[i].name+' had a snuggle');
                }
              }
            }

            if (chibis[i].awake && chibis[i].nomnomnom == -1 && chibis[i].snuggling == -1 && fruits.includes(chibis[i].focus)) {
              if (detectCollision(chibis[i].focus, chibis[i])) {
                chibis[i].facingForwards = true;
                chibis[i].speedX = 0;
                chibis[i].speedY = 0;
                chibis[i].energy += 10;
                chibis[i].focus.parent.fruitCount--;
                chibis[i].focus.eater = chibis[i];
                if (seeds.length < 10) {
                  seeds.push(new Seed(chibis[i].focus.colour, chibis[i]));
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
              if (Math.round(chibis[i].speedY) == 0) {
                let tmp = ((chibis[i].jumpY*4)+chibis[i].y)/5;
                chibis[i].jumpY = tmp;
              }
            }
            chibis[i].physicsCheck();
          }
        }
      }
    }
    /**
    * function to attempt to plant a tree
    * @param {int} x - the x coordinate where the mate is trying to place a tree
    * @param {hex} fruitColour - the colour of the fruit
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
    * function to handle the decorative starfield
    */
    function recalculateStarfield() {
      // if there is less than the designated amount, add one
      if (starfield.length < 100*proportion) {
        let ranX = Math.floor(Math.random()*(canvasWidth));
        let ranY = Math.floor(Math.random()*(canvasHeight/3));
        let ranSize = Math.random()*3;
        starfield.push(new Inert(ranSize, ranSize, trueWhite, ranX, ranY));
      }
      // moving stars
      for (let i = 0; i < starfield.length; i++) {
        starfield[i].x -= 0.01*Math.abs(0.5*(4-starfield[i].size));
        // starfield wrapping
        if (starfield[i].x <= 1) {
          starfield[i].x = canvasWidth;
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
    */
    function Inert(width, height, colour, x, y) {
      this.width = width;
      this.height = height;
      this.size = width;
      this.colour = colour;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
      this.update = function() {
        // more opaque nearer the top
        // more opaque at night
        let glowalpha = 0;
        if (daytimeCounter <= 250 || daytimeCounter >= 750) {
          glowalpha = (1 - (1/(canvasHeight)*this.y)) * ((250 - daytimeCounter)/250);
          if (daytimeCounter > 750) {
            glowalpha = (1 - (1/(canvasHeight)*this.y)) * ((daytimeCounter-750)/250);
          }
        }
        if (glowalpha > 0 && glowalpha < 1) {
          ctx.globalAlpha = glowalpha/2;
        } else {
          ctx.globalAlpha = 0;
        }

        // draw the thing
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
        ctx.globalAlpha = 0.15*(1-(this.timer/200));
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
    * @param {string} symbol - the symbol of the glyph
    */
    function createGlyphs(x, y, symbol) {
      if (fps >= 30) {
        let speed = 1;
        glyphs.push(new Glyph(x, y, 0, -speed, symbol));
        glyphs.push(new Glyph(x, y, 0, speed, symbol));
        glyphs.push(new Glyph(x, y, speed, 0, symbol));
        glyphs.push(new Glyph(x, y, -speed, 0, symbol));
        glyphs.push(new Glyph(x, y, speed/1.5, speed/1.5, symbol));
        glyphs.push(new Glyph(x, y, speed/1.5, -speed/1.5, symbol));
        glyphs.push(new Glyph(x, y, -speed/1.5, speed/1.5, symbol));
        glyphs.push(new Glyph(x, y, -speed/1.5, -speed/1.5, symbol));
      }
    }

    /**
    * function to control glyphs
    * @param {int} x - the x position
    * @param {int} y - the y position
    * @param {int} speedX - the x speed
    * @param {int} speedY - the y speed
    * @param {string} symbol - the symbol of the glyph
    */
    function Glyph(x, y, speedX, speedY, symbol) {
      this.speedX = speedX;
      this.speedY = speedY;
      this.size = fontWidth;
      this.timer = glyphTimer;
      this.x = x;
      this.y = y;
      this.spin = 0;
      this.rotation = 0;
      this.step = 0.1;
      this.colour = trueBlack;
      this.symbol = symbol;
      this.spin = (Math.random()*2) - 1;
      this.speedX += (Math.random()*2) - 1;
      this.speedY += (Math.random()*2) - 1;
      this.update = function() {
        if (!paused) {
          this.speedY += gravity/2;
          if (checkBounceSides(this) || checkBounceTop(this) || checkBounceBottom(this)) {
            this.timer -= 1;
          }
          // drift to middle (hopefully not enough to counteract gravity);
          if (this.y > trueBottom/2) {
            this.speedY -= 0.0125;
          } else if (this.y < trueBottom/2) {
            this.speedY += 0.0125;
          }
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
        }
        // draw glyph
        ctx.globalAlpha = this.timer/glyphTimer/2;
        ctx.fillStyle = this.colour;
        ctx.font = '14px' + ' ' + globalFont;
        ctx.save();
        ctx.translate(this.x-(this.size/2), this.y+(this.size/2));
        ctx.rotate(this.rotation);
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
        this.timer -= this.step;
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

    /**
    * function to calculate the season colours
    */
    function recalcSeasonVariables() {
      seasonText = 'Autumn';
      let glyph = '\u2EDA';
      if (season > 3) {
        season = 0;
        glyph = '\u2744';
        seasonText = 'Winter';
      } else if (season == 1) {
        glyph = '\u2606';
        seasonText = 'Spring';
      } else if (season == 2) {
        glyph = '\u263C';
        seasonText = 'Summer';
      }
      if (season == 3) {
        seasonNext = 0;
      } else {
        seasonNext = season + 1;
      }
      // trees spawn glyphs
      for (let i = 0; i < trees.length && i < canvasWidth/250; i++) {
        if (Math.random() < 0.5) {
          createGlyphs(trees[i].x, trees[i].y, glyph);
          //glyphs[glyphs.length-1].timer *= 1 + (Math.random()*2);
        }
      }
    }
