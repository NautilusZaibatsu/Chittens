const version = 0.070;

// canvas - now dynamic for resize support with constraints
let rawWidth = (window.innerWidth || document.body.clientWidth) - 20;
let rawHeight = (window.innerHeight || document.body.clientHeight) - 20;

// Enforce minimum resolution and landscape mode from startup
const minCanvasWidth = 800;
const minCanvasHeight = 600;

// Enforce landscape mode - swap dimensions if height > width
if (rawHeight > rawWidth) {
  console.warn('Portrait mode detected at startup, enforcing landscape');
  [rawWidth, rawHeight] = [rawHeight, rawWidth];
}

let canvasWidth = Math.max(rawWidth, minCanvasWidth);
let canvasHeight = Math.max(rawHeight, minCanvasHeight);
const floorLevel = 45;
let trueBottom = canvasHeight - floorLevel;
let maxDistance = Math.hypot(canvasWidth, canvasHeight); // measure the diagonal across the game area

// global scaling values
const idealX = 1920 - 20;
const idealY = 1080 - 20 - floorLevel;
const idealArea = idealX * idealY;
let proportion = 1 / (idealArea / (canvasWidth * trueBottom));
let maxPop = 50 * proportion;

// UI and messaging
let messagesToSave = canvasHeight / 20;
// FPS and timing
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

// Delta time and fixed timestep
let gameLastTime = performance.now();
let accumulator = 0;
const targetFPS = 50;
const fixedTimeStep = 1000 / targetFPS; // 20ms timesteps
let deltaTime = 0;

// Time-based counters (to replace frame-based ones)
let gameTimeElapsed = 0; // Total game time in ms
let gameSpeedMultiplier = 1.0; // Speed multiplier for scaling game speed

// game modes
let endlessMode = false; // endless modes ensures we always have at least one male and female chitten of breeding age and autospawns kittens
const devMode = false; // turn devmode on or off

// setup
secondTimer = 0;
daytimeCounter = 0;
timeMod = daytimeCounter;
day = 0;
today = day;
season = 1; // spring
seasonNext = 2; // summer
paused = false;
chosenChittenM = true;
chosenChittenF = true;
chosenKitten = true;
choiceTimer = 0;
maleCount = 0;
femaleCount = 0;
nonbinaryCount = 0;
selection = null;

// set global colours
const trueWhite = '#FFFFFF';
const trueBlack = '#000000';
const glowColour = '#FFFF88';
const explosionColour = glowColour;
const albinoRed = '#ee4433';
const genderPink = '#f27bfe';
const genderBlue = '#78c7fc';
const genderPurple = '#9978f1';
const energyBlue = '#1e6ee9';
const hungerOrange = '#e9af4e';
const heartsPink = '#e94db5';

// days and seasons
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const seasonNames = ['Winter', 'Spring', 'Summer', 'Autumn'];

// unicode symbols
const unicodeHeart = '\u2764'; // love heart - used in many places
const unicodeDegrees = '\u00B0'; // for temperature
const unicodeAsterix = '\u274b'; // used for old age
const unicodeMedic = '\u271A'; // used for death
const unicodePlay = '\u25B6'; // used to resume game
const unicodeBar = '\u275A'; // used for pause button
const unicodeThunderstorm = '\u2608'; // used for rehoming button
const unicodeArrowDown = '\u21E9';
const unicodeArrowUp = '\u21E7';
const unicodeInfinity = '\u221e';
// gender
const unicodeNonBinary = '\u26A5';
const unicodeMale = '\u2642';
const unicodeFemale = '\u2640';
// genetics
const unicodeTick = '\u2713';
const unicodeCross = '\u2717';
// seasonal
const unicodeLeaf = '\u2EDA';
const unicodeSnowflake = '\u2744';
const unicodeStar = '\u2606';
const unicodeSun = '\u263C';

// set timer parameters
const glyphTimer = 75;

// firefly parameters
const fireflyMinSeekHeight = 25; // lowest to the ground a firefly will look for fruit
const fireflyMaxEatingSpeed = 0.5; // Maximum average speed for fireflies to eat fruit
const startingFireflies = 2; // fireflies at start of game

// tree parameters - now dynamic
let minTrees = canvasWidth / 300;
let maxTrees = canvasWidth / 80;
let startingTrees = canvasWidth / 250;
const minSeeds = 10;
const treeGrowthRate = 1.5;
const treeWitherRate = 1;

// init stuff
chittens = [];
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
pointerPos = new MousePosition(canvasWidth / 2, canvasHeight / 2);
touchOnorOffThisFrame = false;
boxes = [];
parentBoxes = [];
buttons = [];
labels = [];
speech = [];

// font
const globalFont = 'Consolas';
// scaling for rotation
boxSize = 0;
fontSize = 15;
fontWidth = 8.4;

const boxPadding = 20 * proportion;
const boxColumns = 3;
const boxRows = 3;
const boxThickness = 10 * proportion;
currentChittens = 0;
maleParent = null;
femaleParent = null;
choosingChitten = false;

// Images
// landscape
const newtree = new Image();
newtree.src = 'img/newtree.png';
const acacia = new Image();
acacia.src = 'img/acacia.png';
const clouds = new Image();
clouds.src = 'img/clouds.png';
clouds.onload = function () {
  console.log('Images Loaded succesfully');
};
// patterns and body parts
const smile = new Image();
smile.src = 'img/smile.png';
const smile2 = new Image();
smile2.src = 'img/smile2.png';
const smile3 = new Image();
smile3.src = 'img/smile3.png';
const content = new Image();
content.src = 'img/content.png';
const pattern0 = new Image(); // standard cat pattern
pattern0.src = 'img/pattern0.png';
const pattern1 = new Image(); // tortoiseshell
pattern1.src = 'img/pattern1.png';
const pattern2 = new Image(); // albino spotting (unused atm)
pattern2.src = 'img/pattern2.png';
const pattern3 = new Image(); // tabby
pattern3.src = 'img/pattern3.png';
const pattern6 = new Image(); // bengal
pattern6.src = 'img/pattern6.png';
const pattern7 = new Image(); // ticked
pattern7.src = 'img/pattern7.png';
const butthole = new Image();
butthole.src = 'img/butthole.png';

// graves
const tombstone = new Image();
tombstone.src = 'img/grave.png';
const tombstone2 = new Image();
tombstone2.src = 'img/grave2.png';
const tombstone3 = new Image();
tombstone3.src = 'img/grave3.png';
const obelisk = new Image();
obelisk.src = 'img/obelisk.png';
// Ghosts
const spectre = new Image();
spectre.src = 'img/ghost.png';
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
uiColourArray = [];

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
* function to start the game
*/
function startGame() {
  // init > console data
  sendMessage('Initialising');

  // Initialize UI components that have circular dependencies
  colourBars = new ColourBar(130, 155);
  colourBlock = new ColourPixelBlock();

  initButtons();
  console.log(reportNames());
  // initial fireflies
  for (let i = 0; i < startingFireflies; i++) {
    if (Math.random() < 0.5) {
      fireflies.push(new FireFly(0, Math.random() * trueBottom, pointerPos, 1, glowColour));
    } else {
      fireflies.push(new FireFly(canvasWidth, Math.random() * trueBottom, pointerPos, 1, glowColour));
    }
  }
  // plant starter trees
  let defaultFruitColour = randomColourFruity();
  for (let i = 0; i < startingTrees; i++) {
    tryToPlantaTree(Math.abs(Math.random() * canvasWidth), defaultFruitColour);
    trees[trees.length - 1].y = trueBottom - (trees[trees.length - 1].maxHeight * Math.random() * 0.33);
    trees[trees.length - 1].birthday = Math.round(Math.random() * 1000);
    trees[trees.length - 1].reachedMaxHeight = (Math.random() < 0.5);
    // spawn with random number of fruit
    let numFruit = Math.round(Math.random() * 3);
    for (let i = 0; i < numFruit; i++) {
      trees[trees.length - 1].spawnFruit();
    }
  }
  // gene editing
  experiment = new Chitten(70, 90, 13.5, 10, 'Female');
  experiment.name = getFemaleName(Math.floor(Math.random() * numlibs * namesinlib));
  randomiseGenetics(experiment);
  experiment.awake = true;
  experiment.hitBottom = true;
  initSliders();

  // start the game
  sendMessage('Starting simulation');
  recalcSeasonVariables();
  myGameArea.start();
  // set up patterns for ChittenS
  ctx = myGameArea.context;
  pat0 = ctx.createPattern(pattern0, 'repeat'); // basic
  pat1 = ctx.createPattern(pattern1, 'repeat'); // tortoiseshell
  pat2 = ctx.createPattern(pattern2, 'repeat'); // albino spotting
  pat3 = ctx.createPattern(pattern3, 'repeat'); // tabby
  pat4 = ctx.createRadialGradient(0, 0, 0, 0, 0, 0); // persian face colour gradient
  // pat5 = Lykoi
  pat6 = ctx.createPattern(pattern6, 'repeat'); // tabby
  pat7 = ctx.createPattern(pattern7, 'repeat'); // ticked (abyssinian)

}

// Function to update canvas dimensions and recalculate dependent values
function updateCanvasDimensions() {
  const oldCanvasWidth = canvasWidth;
  const oldCanvasHeight = canvasHeight;
  
  // Get raw window dimensions
  let rawWidth = (window.innerWidth || document.body.clientWidth) - 20;
  let rawHeight = (window.innerHeight || document.body.clientHeight) - 20;
    
  // Enforce landscape mode - swap dimensions if height > width
  if (rawHeight > rawWidth) {
    console.warn('Portrait mode detected, enforcing landscape');
    [rawWidth, rawHeight] = [rawHeight, rawWidth];
  }
  
  // Apply minimum constraints
  canvasWidth = Math.max(rawWidth, minCanvasWidth);
  canvasHeight = Math.max(rawHeight, minCanvasHeight);
  
  // Recalculate abstract concepts that depend on canvas size
  trueBottom = canvasHeight - floorLevel;
  maxDistance = Math.hypot(canvasWidth, canvasHeight); // diagonal measurement for physics calculations
  
  // Update scaling values based on new dimensions
  proportion = 1 / (idealArea / (canvasWidth * trueBottom));
  maxPop = 50 * proportion;
  
  // Update tree parameters (ecosystem scaling)
  minTrees = Math.max(1, Math.floor(canvasWidth / 300)); // At least 1 tree
  maxTrees = Math.max(minTrees * 2, Math.floor(canvasWidth / 80)); // Sensible maximum
  startingTrees = Math.max(1, Math.floor(canvasWidth / 250));
  
  // Update UI values
  messagesToSave = Math.max(10, Math.floor(canvasHeight / 20)); // At least 10 messages
  
  // Update canvas size if it exists
  if (myGameArea && myGameArea.canvas) {
    myGameArea.canvas.width = canvasWidth;
    myGameArea.canvas.height = canvasHeight;
    
    // Notify user if we had to adjust their resolution
    if (canvasWidth !== rawWidth || canvasHeight !== rawHeight) {
      console.log(`Resolution adjusted to ${canvasWidth}x${canvasHeight} (minimum: ${minCanvasWidth}x${minCanvasHeight})`);
    }
  }
  
  // Push objects back in bounds if screen shrank
  if (canvasWidth < oldCanvasWidth || canvasHeight < oldCanvasHeight) {
    pushObjectsInBounds();
  }
}

// Function to push physics objects back within new bounds
function pushObjectsInBounds() {
  // Push chittens back in bounds
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].x > canvasWidth - chittens[i].size) {
      chittens[i].x = canvasWidth - chittens[i].size;
    }
    if (chittens[i].y > trueBottom - chittens[i].size) {
      chittens[i].y = trueBottom - chittens[i].size;
    }
  }
  
  // Push trees back in bounds
  for (let i = 0; i < trees.length; i++) {
    if (trees[i].x > canvasWidth - trees[i].size) {
      trees[i].x = canvasWidth - trees[i].size;
    }
    if (trees[i].y > trueBottom - trees[i].size) {
      trees[i].y = trueBottom - trees[i].size;
    }
  }
  
  // Push fruits back in bounds
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].x > canvasWidth - fruits[i].size) {
      fruits[i].x = canvasWidth - fruits[i].size;
    }
    if (fruits[i].y > trueBottom - fruits[i].size) {
      fruits[i].y = trueBottom - fruits[i].size;
    }
  }
  
  // Push fireflies back in bounds
  for (let i = 0; i < fireflies.length; i++) {
    if (fireflies[i].x > canvasWidth - fireflies[i].size) {
      fireflies[i].x = canvasWidth - fireflies[i].size;
    }
    if (fireflies[i].y > trueBottom - fireflies[i].size) {
      fireflies[i].y = trueBottom - fireflies[i].size;
    }
  }
  
  // Push glyphs back in bounds
  for (let i = 0; i < glyphs.length; i++) {
    if (glyphs[i].x > canvasWidth - glyphs[i].size) {
      glyphs[i].x = canvasWidth - glyphs[i].size;
    }
    if (glyphs[i].y > trueBottom - glyphs[i].size) {
      glyphs[i].y = trueBottom - glyphs[i].size;
    }
  }
  
  // Push ghosts back in bounds
  for (let i = 0; i < myGhosts.length; i++) {
    if (myGhosts[i].x > canvasWidth - myGhosts[i].size) {
      myGhosts[i].x = canvasWidth - myGhosts[i].size;
    }
    if (myGhosts[i].y > trueBottom - myGhosts[i].size) {
      myGhosts[i].y = trueBottom - myGhosts[i].size;
    }
  }
}

let myGameArea = {
  canvas: document.createElement('canvas'),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    // Use requestAnimationFrame for uncapped FPS
    const gameLoop = () => {
      updateGameArea();
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);

    // Window resize listener
    window.addEventListener('resize', updateCanvasDimensions);

    // check mouse position first
    this.canvas.addEventListener('mousemove', function (event) {
      pointerPos = trackMouse(event);
    });

    // add listener for touch
    this.canvas.addEventListener('touchmove', function (event) {
      pointerPos.x = event.touches[0].clientX;
      pointerPos.y = event.touches[0].clientY;
    }, { passive: true });
    this.canvas.addEventListener('touchstart', function (event) {
      pointerPos.x = event.touches[0].clientX;
      pointerPos.y = event.touches[0].clientY;
      tapOn();
    }, { passive: true });
    this.canvas.addEventListener('touchend', function (event) {
      tapOff();
    });

    // add listener for mouse
    this.canvas.addEventListener('mousedown', function (event) {
      mouseOn();
    });
    this.canvas.addEventListener('mouseup', function (event) {
      mouseOff();
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

/**
* Functions to control game speed
**/
function setGameSpeed(multiplier) {
  gameSpeedMultiplier = Math.max(0, multiplier); // Prevent negative speeds
}

/**
* Update all game objects at fixed timestep
**/
function updateGameObjects() {
  const fruitSet = new Set(fruits);
  recalculateChittens(fruitSet);

  // Update all chittens logic
  for (let i = 0; i < chittens.length; i++) {
    chittens[i].update();
  }

  // Update all trees logic
  for (let i = 0; i < trees.length; i++) {
    trees[i].update();
    // kill dead trees
    if (trees[i].dead) {
      trees.splice(i, 1);
      i--;
    }
  }
  // let seeds get planted as long as we aren't at tree maximum
  if (trees.length < maxTrees) {
    // First try to force plant the oldest valid seed if any exist
    if (seeds.length > 0) {
      // Find oldest seed (lowest timer value)
      let foundSuitableSeed = false;
      let oldestSeed = seeds[0];
      let oldestIndex = 0;
      for (let i = 1; i < seeds.length; i++) {
        if (seeds[i].timer <= 0 && seeds[i].owner.hitBottom && seeds[i].timer < oldestSeed.timer) {
          oldestSeed = seeds[i];
          oldestIndex = i;
          foundSuitableSeed = true;
        }
      }
      // Force plant the oldest seed
      if (foundSuitableSeed && tryToPlantaTree(oldestSeed.owner.x, oldestSeed.colour)) {
        seeds.splice(oldestIndex, 1);
      }
    }
  }
  if (trees.length < minTrees && seeds.length == 0) {
    // No seeds in bellies, spawn random tree
    tryToPlantaTree(Math.abs(Math.random() * canvasWidth), randomColourFruity());
  }

  // Update all fruits logic
  for (let i = 0; i < fruits.length; i++) {
    fruits[i].update();
  }

  // Update all fireflies logic
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].update();
  }

  // Update all glyphs logic
  for (let i = 0; i < glyphs.length; i++) {
    glyphs[i].update();
  }

  // Update comet physics
  recalculateComets();

  // Update starfield physics
  recalculateStarfield();

  // Update trails timers
  for (let i = trails.length - 1; i >= 0; i--) {
    trails[i].timer--;
    if (trails[i].timer < 0) {
      trails.splice(i, 1);
    }
  }

  // Update ghosts logic
  for (let i = 0; i < myGhosts.length; i++) {
    myGhosts[i].update();
  }
}

/**
* function to redraw and recalculate everything each frame with fixed timestep
**/
function updateGameArea() {
  // Calculate fps  
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 500) { // Calculate FPS twice per second
    fps = Math.round((frameCount * 1000) / (now - lastTime)); // Account for actual time elapsed
    frameCount = 0;
    lastTime = now;
  }

  // Calculate delta time and update game logic with fixed timestep
  deltaTime = now - gameLastTime;
  gameLastTime = now;

  // Cap delta time to prevent spiral of death when tab switching
  if (deltaTime > 100) { // Cap at 100ms (10 FPS equivalent)
    deltaTime = fixedTimeStep; // Just run one frame worth of updates
  }

  accumulator += deltaTime;

  // Only run game logic when we've accumulated enough time
  let logicUpdates = 0;
  const effectiveTimeStep = fixedTimeStep * gameSpeedMultiplier;

  while (accumulator >= fixedTimeStep && logicUpdates < 5) {
    // Run one game logic update at 50 UPS
    myGameArea.frameNo += 1;
    touchOnorOffThisFrame = false;

    // Always track total time for rendering calculations
    gameTimeElapsed += fixedTimeStep;

    if (!paused && gameSpeedMultiplier > 0) {

      // increase daytime counter and make seasons rotate (scaled by speed)
      daytimeCounter += 0.25 * gameSpeedMultiplier;
      if (daytimeCounter >= 1000) {
        daytimeCounter = 1;
        day++;
        // calculate the count (array position) of the day of the week
        let tempDay = day;
        while (tempDay > 6) {
          tempDay -= 7;
        }
        today = tempDay;
        season++;
        recalcSeasonVariables();
      }

      // Update all game objects at fixed timestep (50 UPS)
      updateGameObjects();
    }

    accumulator -= fixedTimeStep;
    logicUpdates++;
  }
  // Now clear the canvas and prepare for rendering
  myGameArea.clear();
  ctx = myGameArea.context;
  // Fire comets at night (time-based instead of frame-based)
  if (gameTimeElapsed > 0 && (gameTimeElapsed % 60) < fixedTimeStep) { // Every ~3 frames at 50fps = 60ms
    // fire a comet
    if (Math.random() < 0.005 && (daytimeCounter <= 250 || daytimeCounter >= 750)) {
      ranX = Math.floor(Math.random() * (canvasWidth));
      if (Math.random() < 0.5) {
        ranY = 0;
      } else {
        ranY = canvasWidth;
      }
      comets.push(new Inert(2, 2, trueWhite, ranX, ranY));
      if (ranY == 0) {
        comets[comets.length - 1].speedX = Math.random();
      } else {
        comets[comets.length - 1].speedX = -Math.random();
      }
      comets[comets.length - 1].speedY = - Math.random() + 0.1;
    }
  }

  // change the colour by time of day (must run every frame)
  if (true) { // Always run to ensure uiColourArray is populated
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
      let dayR = Math.floor(ri - ((((ri - rj) / 250)) * timeMod));
      let dayG = Math.floor(gi - ((((gi - gj) / 250)) * timeMod));
      let dayB = Math.floor(bi - ((((bi - bj) / 250)) * timeMod));
      debugString = 'daytimeCounter' + daytimeCounter;

      // create seasonal colour shading
      let tempColour = mixTwoColours(seasonColour[seasonNext], seasonColour[season], daytimeCounter / 1000);
      // shade backgrouund
      uiColourArray[tick] = mixTwoColours(rgbToHex(dayR, dayG, dayB), tempColour, 0.75);
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
    temperature = (temp2 * (daytimeCounter / 1000)) + (temp1 * (1 - (daytimeCounter / 1000)));
    temperature = ('0' + Math.round(temperature)).slice(-2);
  }

  // countdown timer, used when choosing from a litter
  if (!paused && !chosenKitten) {
    labels[2].text = parseInt(choiceTimer / 50);
    // check the timer
    if (choiceTimer > 0) {
      choiceTimer--;
    }
    if (choiceTimer == 0) {
      // in endless mode, pick a random kitten
      if (endlessMode) {
        if (selection == null) {
          selection = chittens[Math.round(Math.random() * (boxes.length - 1)) + currentChittens];
        }
        handleButton(1);
      } else {
        // otherwise give all the kittens away
        handleButton(2);
      }
    }
  }

  let tankGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  tankGradient.addColorStop(0, uiColourArray[0]);
  tankGradient.addColorStop(0.4, uiColourArray[1]);
  tankGradient.addColorStop(0.75, uiColourArray[2]);
  tankGradient.addColorStop(1, uiColourArray[3]);
  ctx.fillStyle = tankGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  textColour = mixTwoColours(trueWhite, uiColourArray[2], 0.5);
  // fix the starfield
  // Render comets  
  for (let i = 0; i < comets.length; i++) {
    comets[i].render();
  }
  // Render starfield
  for (i = starfield.length - 1; i >= 0; i--) {
    starfield[i].render();
  }
  // trails
  for (i = 0; i < trails.length; i++) {
    trails[i].render();
  }

  // background
  // draw the clouds - disappearing at nighttime
  ctx.globalAlpha = 0.3;
  if (daytimeCounter <= 300) {
    ctx.globalAlpha = 0.3 - (0.3 * ((300 - daytimeCounter) / 300));
  } else if (daytimeCounter > 700) {
    ctx.globalAlpha = 0.3 - (0.3 * ((daytimeCounter - 700) / 300));
  }
  let cloudWidth = canvasHeight / 540 * 2160;
  let offsetX = daytimeCounter * cloudWidth / 1000;

  // Wrap the offset to create seamless looping
  offsetX = offsetX % cloudWidth;

  // Draw first cloud image
  ctx.drawImage(clouds, -offsetX, 0, cloudWidth, canvasHeight);

  // Draw second cloud image for seamless looping
  ctx.drawImage(clouds, cloudWidth - offsetX, 0, cloudWidth, canvasHeight);

  ctx.globalAlpha = 1;

  // draw the background
  // center and translate the image
  ctx.save();
  ctx.translate((canvasWidth - idealX) / 2, (canvasHeight - idealY) / 2);
  ctx.drawImage(newtree, 0, 0, newtree.width, newtree.height);
  ctx.restore();

  // update the seeds
  for (let i = seeds.length - 1; i >= 0; i--) {
    seeds[i].update();
    if (seeds[i].planted || seeds[i].kill) {
      seeds.splice(i, 1);
    }
  }

  // draw the trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].render();
  }

  // update the fruit
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater !== null) {
      if (fruits[i].eater !== 'X' && fruits[i].eater.hitBottom && fruits[i].eater.nomnomnom == -1) {
        // Only allow eating if chitten is fully sitting (or if they weren't preparing)
        if (!fruits[i].eater.preparingToEat || fruits[i].eater.sittingProgress >= 1) {
          // sendMessage(fruits[i].eater.name+' ate a piece of fruit');
          if (Math.random() < 0.05) {
            speech.push(new Speak(fruits[i].eater, happyWord()));
          }
          fruits[i].eater.hunger += 500;
          fruits[i].eater.health += 50;
          fruits[i].eater.energy += 10;
          fruits[i].eater.nomnomnom = 125;
          fruits[i].eater.sitting = true;
          fruits[i].eater.preparingToEat = false; // Reset the flag
        }
      } else if (fruits[i].eater !== 'X' && fruits[i].eater.hitBottom && fruits[i].eater.nomnomnom <= 0) {
        // Eating finished - allow chitten to stand up again
        fruits[i].eater.targetSittingState = false;
        removeFocusFrom(fruits[i]);
        fruits.splice(i, 1);
        i--;
      }
    }
  }
  // draw the fruit that should appear BEHIND chittens
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == null) {
      fruits[i].render();
    }
  }

  // draw the glow coming off the floor
  ctx.globalAlpha = 0.15;
  let floorGlow = ctx.createLinearGradient(0, canvasHeight - floorLevel - 200, 0, canvasHeight);
  floorGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  floorGlow.addColorStop(1, mixTwoColours(trueWhite, uiColourArray[1], 0.5));
  ctx.fillStyle = floorGlow;
  ctx.fillRect(0, canvasHeight - floorLevel - 5 - 200, canvasWidth, 5 + floorLevel + 200);

  // draw the floor
  ctx.globalAlpha = 1;
  let horizon = ctx.createLinearGradient(0, canvasHeight - floorLevel - 100, 0, canvasHeight - floorLevel);
  horizon.addColorStop(0, 'rgba(0, 0, 0, 0)');
  horizon.addColorStop(1, trueBlack);
  ctx.fillStyle = horizon;
  ctx.fillRect(0, canvasHeight - floorLevel - 5, canvasWidth, 5 + floorLevel);

  // draw the message history
  if (pointerPos.y > canvasHeight - floorLevel - 5) {
    let fade = ctx.createLinearGradient(0, 0, 0, trueBottom);
    let rMessage = Math.round(hexToRgb(uiColourArray[2]).r);
    let gMessage = Math.round(hexToRgb(uiColourArray[2]).g);
    let bMessage = Math.round(hexToRgb(uiColourArray[2]).b);
    fade.addColorStop(0, 'rgba(' + rMessage + ', ' + gMessage + ', ' + bMessage + ', 0.05)');
    fade.addColorStop(1, 'rgba(' + rMessage + ', ' + gMessage + ', ' + bMessage + ', 0.3)');
    // Fill with gradient
    ctx.fillStyle = fade;
    ctx.font = fontSize + 'px' + ' ' + globalFont;
    for (let i = messageBuffer.length - 2; i >= 0; i--) {
      ctx.fillText(messageBuffer[i].timeStamp + ' ' + messageBuffer[i].text, 10, 30 + trueBottom - (20 * (messageBuffer.length - i)));
    }
  }

  if (!paused) {
    // increase daytime counter and make seasons rotate
    daytimeCounter += 0.25;
    if (daytimeCounter >= 1000) {
      daytimeCounter = 1;
      day++;
      // calculate the count (array position) of the day of the week
      let tempDay = day;
      while (tempDay > 6) {
        tempDay -= 7;
      }
      today = tempDay;
      season++;
      recalcSeasonVariables();
    }
  }

  // glyphs
  for (i = glyphs.length - 1; i >= 0; i--) {
    glyphs[i].render();
    if (glyphs[i].timer < 0) {
      glyphs.splice(i, 1);
      i--;
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
      myGhosts.push(new Ghost(graveStones[d].x, graveStones[d].y, ghostSize * 0.8, graveStones[d].firstColour));
      sendMessage('A ghost emerged from a grave');
      graveStones.splice(d, 1);
      d--;
    } else {
      graveStones[d].update(d);
    }
  }

  // draw the ghosts
  for (let i = 0; i < myGhosts.length; i++) {
    if (myGhosts[i].y < 0 - myGhosts[i].size * 20) {
      let fireFlySize = myGhosts[i].size / 8;
      if (fireFlySize < 0.4) {
        fireFlySize = 0.4;
      }
      sendMessage('A ghost became a FireFly');
      fireflies.push(new FireFly(myGhosts[i].x, myGhosts[i].y, fireflies[fireflies.length - 1], fireFlySize, myGhosts[i].firstColour));
      myGhosts.splice(i, 1);
      i--;
    } else {
      myGhosts[i].render();
    }
  }
  // calculate how many chittens exist now
  recalculateChittenNumbers();

  // firefly logic
  for (let f = 0; f < fireflies.length; f++) {
    fireflies[f].touchedThisFrame = false;
    if (fireflies[f].touches >= 500) {
      // create the explosion
      explosions.push(new Explosion(fireflies[f].x, fireflies[f].y, explosionColour, glowColour));
      produceExplosion(fireflies[f].x, fireflies[f].y);
      let targets = [];
      for (let i = 0; i < chittens.length; i++) {
        if (fireflies[f] == chittens[i].focus) {
          targets.push(chittens[i]);
        }
      }
      fireflies.splice(f, 1);
      f--;
      if (targets > 0) {
        for (let i = 0; i < targets.length; i++) {
          targets[i].focus = targets[i].inCatBox ? null : targets[i].findClosestFireFly();
        }
      }
    }
  }

  // draw explosions
  for (let i = 0; i < explosions.length; i++) {
    if (explosions[i].timer < 200) {
      explosions[i].timer += 4;
      explosions[i].update();
    } else {
      explosions.splice(i, 1);
      i--;
    }
  }

  // draw boxes
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();
  }
  for (let i = 0; i < parentBoxes.length; i++) {
    parentBoxes[i].update();
  }

  // Create fruit Set for O(1) lookups instead of O(n) - major performance optimization
  const fruitSet = new Set(fruits);

  // Render all chittens
  for (let i = 0; i < chittens.length; i++) {
    const chitten = chittens[i];
    const catSize = chitten.size || 20;
    const bounceBuffer = catSize * 2;

    // Only render chittens that are on-screen
    if (chitten.x >= -bounceBuffer && chitten.x <= canvasWidth + bounceBuffer &&
      chitten.y >= -bounceBuffer && chitten.y <= canvasHeight + bounceBuffer) {
      chitten.render();
    }
  }

  // draw the fruit that should appear in front of chittens (being eaten)
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater !== null) {
      fruits[i].render();
    }
  }

  // draw the speech bubble
  for (let i = 0; i < speech.length; i++) {
    for (let j = i + 1; j < speech.length; j++) {
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
    if (!fireflies[f].justAte && !fruitSet.has(fireflies[f].focus)) {
      fireflies[f].chooseNewTarget();
    } else if (fireflies[f].focus.y > trueBottom - fireflies[f].focus.size - fireflyMinSeekHeight) {
      fireflies[f].chooseNewTarget();
    } else {
      if ((Math.abs(fireflies[f].speedX) + Math.abs(fireflies[f].speedY)) / 2 < fireflyMaxEatingSpeed) {
        // fireflies eating (must be moving slowly enough)
        if (fruitSet.has(fireflies[f].focus) && (detectCollision(fireflies[f], fireflies[f].focus))) {
          fireflies[f].speedX *= 0.5;
          fireflies[f].speedY *= 0.5;
          fireflies[f].stomach++;
          fireflies[f].justAte = true;
          if (fireflies[f].stomach >= 25 && fireflies.length <= 6) {
            fireflies[f].stomach = 0;
            fireflies.push(new FireFly(fireflies[f].focus.x, fireflies[f].focus.y, fireflies[f].focus, 0.8, fireflies[f].firstColour));
            fireflies[fireflies.length - 1].chooseNewTarget();
            fireflies[fireflies.length - 1].touches = 250;
          }
          // consume the fruit and reset the focus
          let victimIndex = fruits.indexOf(fireflies[f].focus);
          fireflies[f].lastTreeVisited = fireflies[f].focus.parent;
          removeFocusFrom(fireflies[f].focus);
          fireflies[f].chooseNewTarget();
          fruits.splice(victimIndex, 1);
          if (createGlyphs(fireflies[f].x, fireflies[f].y, '.')) {
            for (let i = 1; i < 9; i++) {
              glyphs[glyphs.length - i].colour = trueWhite;
              glyphs[glyphs.length - i].timer *= 0.25;
            }
          }
        }
      }
    }

    // draw firefly trails, log touches, then update
    trails.push(new Particle(fireflies[f].size / 10, glowColour, fireflies[f].x, fireflies[f].y, fireflies[f].speedX, fireflies[f].speedY));
    if (fireflies[f].touchedThisFrame) {
      // spawn a new firefly if there is only one, and it is nearly consumed
      if (fireflies[f].touches == 400 && fireflies.length == 1) {
        let x = 0;
        if (Math.random() < 0.5) {
          x = canvasWidth;
        }
        fireflies.push(new FireFly(x, Math.random() * trueBottom, pointerPos, 1, glowColour));
      }
      fireflies[f].touches += 1;
      fireflies[f].chooseNewTarget();
    }
    fireflies[f].render();
  }

  // firefly-to-firefly collisions
  for (let i = 0; i < fireflies.length; i++) {
    for (let j = i + 1; j < fireflies.length; j++) {
      if (detectCollision(fireflies[i], fireflies[j])) {
        collide(fireflies[i], fireflies[j]);
        fireflies[i].chooseNewTarget();
        fireflies[j].chooseNewTarget();
      }
    }
  }

  // pause blacking out
  if (paused) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = mixTwoColours(trueBlack, uiColourArray[3], 0.5);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = 1;
  }

  // ui text
  basicInfo = new TextElement(fontSize + 'px', textColour, 10, canvasHeight - 5);
  basicInfo.text = tickerToTime(daytimeCounter) + ' Day ' + day +
    ' Chittens ' + (femaleCount + maleCount + nonbinaryCount) + ' | ' + femaleCount + unicodeFemale + ' ' + maleCount + unicodeMale + ' ' + nonbinaryCount + unicodeNonBinary + ' ';
  basicInfo.update();
  topLabel = new TextElement(fontSize + 'px', textColour, canvasWidth - 115, 17);
  topLabel.text = 'v' + version + ' FPS ' + fps;
  topLabel.update();
  // day of the week and the season
  leftLabel = new TextElement(fontSize + 'px', textColour, 250, 17);
  leftLabel.text = dayNames[today] + ', ' + seasonText + ' ' + temperature + unicodeDegrees;
  leftLabel.update();
  newestMessage = new TextElement(fontSize + 'px', textColour, 10, canvasHeight - 25);
  if (!paused) {
    newestMessage.text = currentMessage.timeStamp + ' ' + currentMessage.text;
  } else {
    newestMessage.text = tickerToTime(daytimeCounter) + ' Simulation paused';
  }
  newestMessage.update();

  // gene editing block
  if (geneEditing) {
    spliceBox.update();
    experiment.update();
    experiment.render();
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

  // draw labels
  for (let i = 0; i < labels.length; i++) {
    labels[i].update();
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].update();
  }

  // Render breed filter buttons
  for (let i = 0; i < breedFilterButtons.length; i++) {
    breedFilterButtons[i].update();
  }
  for (let i = 0; i < buttons.length; i++) {
    // tool tip - draw on top of buttons and labels
    if (buttons[i].detectButtonClick()) {
      buttons[i].drawToolTip();
    }
  }

  // Tooltips for breed filter buttons
  for (let i = 0; i < breedFilterButtons.length; i++) {
    if (breedFilterButtons[i].detectButtonClick()) {
      breedFilterButtons[i].drawToolTip();
    }
  }

  // hover operations
  hover();

  // Tooltip section
  // Draw tooltip for selected chitten LAST - on top of everything
  if (selection !== null && selection.dragging) {
    drawChittenTooltip(selection, pointerPos.x, pointerPos.y);
  }
  // Draw tooltip for chittens and parents in catboxes if hovered on
  if (parentBoxes.length !== 0 || boxes.length !== 0) {
    let stop = false; // can only hover on one at a time
    if (boxes.length > 0) {
      for (let i = 0; i < boxes.length && !stop; i++) {
        if (boxes[i].highlighted) {
          drawChittenTooltip(chittens[boxes[i].id]);
          stop = true;
        }
      }
    }
    if (!stop && parentBoxes.length > 0) {
      for (let i = 0; i < parentBoxes.length && !stop; i++) {
        if (parentBoxes[i].highlighted) {
          drawChittenTooltip(chittens[parentBoxes[i].id]);
          stop = true;
        }
      }
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
  this.dead = false;
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
  this.spawnFruit = function () {
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
        let posTemp = Math.round(Math.random() * 3);
        if (!positions.includes(posTemp)) {
          fruits.push(new Fruit(this.fruitColour, this, posTemp));
          fruitsOnTree++;
        }
      }
    }
    // check that all fruits are on screen
    for (let i = fruits.length - 1; i >= 0; i--) {
      if (fruits[i].x < 0 || fruits[i].x > canvasWidth) {
        removeFocusFrom(fruits[i]);
        fruits.splice(i, 1);
      }
    }
  };
  this.update = function () {
    // respawning fruit twice a day
    if (this.birthday == daytimeCounter || Math.abs(this.birthday - daytimeCounter) == 500) {
      this.spawnFruit();
    }
    // Update position and growth logic
    // don't go below the floor
    if (this.y < floorLevel) {
      this.y = floorLevel;
      //stop growing when reach max height
    } else if (this.y < trueBottom - this.maxHeight) {
      this.y = trueBottom - this.maxHeight;
      this.reachedMaxHeight = true;
    }
    // tree dies if it reaches the bottom after hitting it's max height
    if (this.reachedMaxHeight && this.y > trueBottom) {
      // Remove seeds linked to this tree
      for (let j = 0; j < seeds.length; j++) {
        if (seeds[j].parent === this) {
          seeds.splice(j, 1);
          j--;
        }
      }
      // mark tree for removal
      this.dead = true;
    } else {
      // growth logic
      if (this.reachedMaxHeight) {
        this.y += treeWitherRate * ((this.loadthisframe / 60) + (0.0125 * (75 / this.width)));
      } else if (this.y <= canvasHeight && this.y >= trueBottom - this.maxHeight) {
        this.y += treeGrowthRate * ((this.loadthisframe / 60) - (0.025 * (75 / this.width)));
      }
    }
    this.loadthisframe = 0;
  };
  this.render = function () {
    ctx.globalAlpha = 0.9;
    ctx.drawImage(acacia, this.x - (this.width * 0.5), this.y - 10, this.width, 200 / (300 / this.width));
    ctx.fillStyle = trueBlack;
    ctx.fillRect(this.x - (this.width / 30), this.y + (this.width / 4.5), this.width / 12.5, trueBottom - this.y - this.height);
  };
}

/** function to describe a seed for a tree
*/
function Seed(colour, owner) {
  this.colour = colour;
  this.owner = owner;
  this.timer = Math.random() * 750;
  this.planted = false;
  this.kill = false;
  this.update = function () {
    this.timer--;
    // if a chitten is digesting this seed and all conditions are met, plant a tree
    let eaten = chittens.includes(this.owner);
    if (trees.length < maxTrees && eaten) {
      if (this.timer <= 0) {
        if (this.owner.snuggling <= 0 && this.owner.nomnomnom <= 0
          && this.owner.y >= trueBottom - this.owner.size - this.owner.limbLength
          && tryToPlantaTree(this.owner.x, this.colour)) {
          this.planted = true;
          sendMessage(this.owner.name + ' planted a seed');
        }
      }
      if (!eaten) {
        // cheap way to tag the seed to be killed
        this.kill = true;
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
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].focus == who) {
      chittens[i].focus = chittens[i].inCatBox ? null : chittens[i].findClosestFireFly();
    }
  }
}


/**
* function to describe a piece of fruit on a tree
*/
function Fruit(colour, parent, treePos) {
  this.colour = colour;
  this.parent = parent;
  this.treePos = treePos; // 0 to 3
  this.inTree = true;
  this.size = this.parent.width / 20;
  this.x = 0;
  this.y = 0;
  this.eater = null;
  this.update = function () {
    // Update position
    if (this.eater !== null) {
      this.x = this.eater.x;
      this.y = this.eater.y + (this.eater.size * 1.75);
    } else {
      this.x = this.parent.x - (this.size * 2.5) + ((treePos - 1) * this.parent.width) / 4;
      this.y = this.parent.y + this.size + (this.parent.width / 10);
    }
  };

  this.render = function () {
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
  this.hitBottom = false;
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
    if (!this.hitBottom && this.y < trueBottom - (this.size * 5)) {
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
      this.hitBottom = true;
      this.y = trueBottom - (this.size * 5);
      this.speedY = 0;
      this.speedX *= 0.9;
    }
    ctx.globalAlpha = 0.2 + (this.timer / 100);
    ctx.drawImage(this.image, this.x - (this.size), this.y + this.size * 3, this.size * 2, this.size * 2);
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
* function to handle chittens
* @param {Set} fruitSet - Set of fruits for O(1) lookups
*/
function recalculateChittens(fruitSet) {
  // block for all my guys
  if (!paused) {
    for (let i = 0; i < chittens.length; i++) {
      // do dragging first
      if (chittens[i].dragging) {
        chittens[i].facingForwards = true;
        chittens[i].x = pointerPos.x;
        chittens[i].y = pointerPos.y;
        chittens[i].speedX = 0;
        chittens[i].speedY = 0;
        chittens[i].resetRotation();
        chittens[i].sitting = false;
        chittens[i].hitBottom = false;
      }
      // check to see if it's time to die
      // attrition, aging etc.
      // increasing age, and related checks
      if (chittens[i].inCatBox == null && chittens[i].birthday == daytimeCounter + 1) {
        chittens[i].age++;
        // maturing to adult
        if (chittens[i].age == maturesAt) {
          sendMessage(chittens[i].name + ' reached adulthood');
          if (createGlyphs(chittens[i].x, chittens[i].y, unicodeHeart)) {
            for (let i = 1; i < 9; i++) {
              glyphs[glyphs.length - i].timer *= 1 + (Math.random() * 1);
            }
          } else {
            failed = true;
          }
          if (chittens[i].energy < 50) {
            chittens[i].energy += 50;
          } else {
            (chittens[i].energy = 100);
          }
          chittens[i].love += 50;
          // reaching old age
        } else if (chittens[i].age >= chittens[i].maxAge - 1 && !chittens[i].elder) {
          chittens[i].elder = true;
          chittens[i].firstColour = decreaseSaturationHEX(chittens[i].firstColour, 2);
          chittens[i].secondColour = decreaseSaturationHEX(chittens[i].secondColour, 2);
          chittens[i].thirdColour = decreaseSaturationHEX(chittens[i].thirdColour, 2);
          sendMessage(chittens[i].name + ' reached old age');
          createGlyphs(chittens[i].x, chittens[i].y, unicodeAsterix);
          // dying of old age
        } else if (chittens[i].snuggling == -1 && chittens[i].nomnomnom == -1 && chittens[i].age > chittens[i].maxAge) {
          sendMessage(chittens[i].name + ' died of old age');
          graveStones.push(new Grave(chittens[i].x, chittens[i].y, chittens[i].size, chittens[i].speedX, chittens[i].speedY, chittens[i].elder, chittens[i].firstColour));
          chittens[i].kill();
          i--;
        }
      }
    }
    // start a new loop to check for next cause of death
    for (let i = 0; i < chittens.length; i++) {
      // dying because of low health
      if (chittens[i].health <= 0) {
        createGlyphs(chittens[i].x, chittens[i].y, unicodeMedic);
        graveStones.push(new Grave(chittens[i].x, chittens[i].y, chittens[i].size, chittens[i].speedX, chittens[i].speedY, chittens[i].elder, chittens[i].firstColour));
        sendMessage(chittens[i].name + ' died');
        removeRelationships(chittens[i]);
        chittens[i].kill();
        i--;
        // so as long as that doesn't kill you......
      } else {
        // Handle catbox chittens with reduced processing but allow physics
        if (chittens[i].inCatBox !== null) {
          chittens[i].awake = true; // Ensure catbox chittens stay awake for adoption display
          // Ensure catbox chittens can fall and move by resetting hitBottom if needed
          if (chittens[i].y < chittens[i].inCatBox.y + chittens[i].inCatBox.height - chittens[i].size) {
            chittens[i].hitBottom = false; // Allow falling until they reach the bottom of their box
          }
          if (chittens[i].health > 0) {
            chittens[i].health -= 0.001;
          }
          // Allow basic physics processing for catbox chittens (they need to fall and move in boxes)
          // Skip expensive behavioral processing but keep movement/gravity
        }

        // grow them a tiny bit
        if (chittens[i].size < chittens[i].maxSize) {
          chittens[i].size += 1 / 2000;
          if (chittens[i].age < maturesAt) {
            chittens[i].size += 1 / 2000;
          }
          chittens[i].reinitSizeAndColour();
        }
        if (chittens[i].inCatBox == null && chittens[i].hunger <= 0 && chittens[i].awake && chittens[i].snuggling <= 0 && chittens[i].nomnomnom <= 0) {
          if (Math.random() <= 0.0005) {
            speech.push(new Speak(chittens[i], angryWord()));
          }
          chittens[i].health -= 0.001;
        }
        if (chittens[i].speedY < 0) {
          chittens[i].health -= 0.1;
        }

        // tiredness linked to temperature (30 is max temp)
        chittens[i].energy -= 0.01325 - (0.01325 / 30 * temperature)
        if (season == 1) {
          // get less tired and more amorous in spring
          chittens[i].energy += 0.07;
          chittens[i].love += 0.01;
        } else if (season == 2) {
          // get more energy in summer
          chittens[i].energy += 0.04;
        } else {
          // become less amorous in the autumn and winter
          chittens[i].love -= 0.001;
        }
        // get more tired between midnight and 3am
        if (chittens[i].awake && daytimeCounter <= 250) {
          chittens[i].energy -= 0.03125;
        }
        // if asleep, gain energy and a little health
        if (!chittens[i].awake) {
          chittens[i].energy += 0.125;
          chittens[i].health += 0.05;
        }
        // if energy goes above 100, wake up
        if (!chittens[i].awake && chittens[i].energy > 90) {
          chittens[i].awake = true;
          // console.log('woke up');
        }
        if (chittens[i].love > 100) {
          chittens[i].love = 100;
        } else if (chittens[i].love < 0) {
          chittens[i].love = 0;
        }
        if (chittens[i].health > 100) {
          chittens[i].health = 100;
        }
        if (chittens[i].energy > 100) {
          chittens[i].energy = 100;
        } else if (chittens[i].energy < 0) {
          chittens[i].energy = 0;
        }
        if (chittens[i].hunger > 0) {
          chittens[i].hunger -= 0.25;
        } else if (this.hunger < 0) {
          this.hunger == 0;
        } else if (this.hunger > 1000) {
          this.hunger = 1000;
        }

        // Only check collisions if this chitten is awake (further optimization)
        if (!chittens[i].awake) continue;

        for (let j = i + 1; j < chittens.length; j++) {
          // Early exit optimizations for performance
          if (!chittens[j].awake) continue;

          // Fast distance check before expensive collision detection
          let dx = chittens[i].x - chittens[j].x;
          let dy = chittens[i].y - chittens[j].y;
          let maxDistance = (chittens[i].size + chittens[j].size) * 1.5; // Buffer for collision
          if (dx * dx + dy * dy > maxDistance * maxDistance) continue;

          // if two chittens bump into each other (only check each pair once)
          if (detectCollision(chittens[i], chittens[j])) {
            if (!chittens[i].hitBottom && !chittens[j].hitBottom) {
              collide(chittens[i], chittens[j]);
            }

            // having a snuggle
            if (!choosingChitten && ((chittens[i].gender == 'Male' && chittens[j].gender == 'Female') || (chittens[i].gender == 'Female' && chittens[j].gender == 'Male'))
              && chittens[i].nomnomnom <= 0 && chittens[j].nomnomnom <= 0
              && chittens[i].snuggling == -1 && chittens[j].snuggling == -1
              && chittens[i].partner == chittens[j] && chittens[j].partner == chittens[i]
              && !chittens[i].elder && !chittens[j].elder
              && chittens[i].health >= breedingHealthReq && chittens[j].health >= breedingHealthReq
              && chittens[i].energy >= breedingEnergyReq && chittens[j].energy >= breedingEnergyReq
              && chittens[i].love >= breedingLoveReq && chittens[j].love >= breedingLoveReq) {
              // snuggle starts
              // pay the costs
              chittens[i].health -= 20;
              chittens[j].health -= 20;
              chittens[i].energy -= 35;
              chittens[j].energy -= 35;
              chittens[i].love -= 50;
              chittens[j].love -= 50;
              chittens[i].speedX = 0;
              chittens[j].speedX = 0;
              chittens[i].speedY = 0;
              chittens[j].speedY = 0;
              chittens[i].sitting = true;
              chittens[j].sitting = true;
              if (Math.random() < 1 / 3) {
                speech.push(new Speak(chittens[i], happyWord()));
              } else if (Math.random() < 2 / 3) {
                speech.push(new Speak(chittens[j], happyWord()));
              }
              chittens[i].facingForwards = true;
              chittens[j].facingForwards = true;
              // Both cats should sit while snuggling
              chittens[i].targetSittingState = true;
              chittens[j].targetSittingState = true;
              chittens[i].snuggling = 250;
              chittens[j].snuggling = 260;
              sendMessage(chittens[j].name + ' and ' + chittens[i].name + ' had a snuggle');
            }
          }
        }

        if (chittens[i].focus && chittens[i].awake && chittens[i].nomnomnom == -1 && chittens[i].snuggling == -1 && fruitSet.has(chittens[i].focus)) {
          if (detectCollision(chittens[i].focus, chittens[i])) {
            chittens[i].facingForwards = true;
            chittens[i].speedX = 0;
            chittens[i].speedY = 0;
            // Set preparing to eat and make chitten sit
            chittens[i].preparingToEat = true;
            chittens[i].sitting = true;
            chittens[i].targetSittingState = true;
            chittens[i].focus.parent.fruitCount--;
            chittens[i].focus.eater = chittens[i];
            // give the chitten a seed to plant
            if (seeds.length < minSeeds) {
              seeds.push(new Seed(chittens[i].focus.colour, chittens[i]));
            }
          }
        }

        // calculate angle to focus (cached for performance - only update every 60ms)
        if (chittens[i].focus) {
          if (!chittens[i].angleToFocusCache || chittens[i].angleToFocusCache.time < gameTimeElapsed - 60 || chittens[i].angleToFocusCache.focus !== chittens[i].focus) {
            chittens[i].angleToFocus = Math.atan2(chittens[i].focus.y - chittens[i].y, chittens[i].focus.x - chittens[i].x);
            chittens[i].angleToFocusCache = {
              time: gameTimeElapsed,
              focus: chittens[i].focus,
              diffx: Math.cos(chittens[i].angleToFocus) * 4,
              diffy: Math.sin(chittens[i].angleToFocus) * 4
            };
          }
          diffx = chittens[i].angleToFocusCache.diffx;
          diffy = chittens[i].angleToFocusCache.diffy;
        } else {
          // For chittens without focus (like those in catboxes), use a neutral downward angle
          chittens[i].angleToFocus = chittens[i].inCatBox ? Math.PI / 2 : 0;
          diffx = 0;
          diffy = 0;
        }

        if ((diffx > 0 && chittens[i].speedX > 0) || (diffx < 0 && chittens[i].speedX < 0)) {
          // if we are going right and it's to our right
          // if we are going left and it's to our left
        } else {
          // Apply ground friction when on ground, air resistance when airborne
          if (chittens[i].hitBottom) {
            chittens[i].speedX *= groundFriction;
          }
        }
        // apply x speed, spin and counterrotation
        chittens[i].x += chittens[i].speedX / 4;
        chittens[i].rotation += chittens[i].spin;
        chittens[i].spin *= 0.9;
        while (chittens[i].rotation > 6) {
          chittens[i].rotation -= 6;
        }
        while (chittens[i].rotation < -6) {
          chittens[i].rotation += 6;
        }

        if (!chittens[i].hitBottom) {
          // Standard gravity with subtle size-based effects
          let mass = gravity * chittens[i].size * 6;
          // Apply air resistance
          let dragFactor = 1 - airResistance; // e.g. 0.001 if airResistance = 0.999
          // Apply drag proportional to velocity and size
          let dragX = chittens[i].speedX * dragFactor * (chittens[i].size / 15);
          let dragY = chittens[i].speedY * dragFactor * (chittens[i].size / 15);
          // Subtract drag in the direction of motion
          chittens[i].speedX -= dragX;
          chittens[i].speedY -= dragY;

          // Gravity/mass force only applies vertically
          chittens[i].speedY += mass;
          // apply y speed
          chittens[i].y += chittens[i].speedY / 4;

          if (Math.round(chittens[i].speedY) == 0) {
            let tmp = ((chittens[i].jumpY * 4) + chittens[i].y) / 5;
            chittens[i].jumpY = tmp;
          }
        }
        chittens[i].physicsCheck();
        applySpeedLimit(chittens[i]);
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
  let maxHeight = trueBottom * 0.30 + (Math.random() * (trueBottom * 0.30));
  let treeWidth = 35 + (Math.random() * 45);
  for (let j = 0; j < trees.length; j++) {
    if (trees[j].x == x || (x - (treeWidth / 4) < trees[j].x + (trees[j].width / 4) && trees[j].x - (trees[j].width / 4) < x + (treeWidth / 4))) {
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
  for (let i = 0; i < comets.length; i++) {
    comets[i].x += comets[i].speedX * 5;
    comets[i].y += comets[i].speedY * 5;
    if (comets[i].x < 0 || comets[i].x > canvasWidth || comets[i].y < 0 || comets[i].y > trueBottom) {
      comets.splice(i, 1);
      i--;
    } else {
      trails.push(new Particle(comets[i].size / 2, glowColour, comets[i].x, comets[i].y, comets[i].speedX * 15, comets[i].speedY * 15));
      // Rendering will be handled separately
    }
  }
}

/**
* function to handle the decorative starfield
*/
function recalculateStarfield() {
  // if there is less than the designated amount, add one
  if (starfield.length < 100 * proportion) {
    let ranX = Math.floor(Math.random() * (canvasWidth));
    let ranY = Math.floor(Math.random() * (canvasHeight / 3));
    let ranSize = Math.random() * 3;
    starfield.push(new Inert(ranSize, ranSize, trueWhite, ranX, ranY));
  }
  // moving stars
  for (let i = 0; i < starfield.length; i++) {
    starfield[i].x -= 0.01 * Math.abs(0.5 * (4 - starfield[i].size));
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
  this.render = function () {
    // more opaque nearer the top
    // more opaque at night
    let glowalpha = 0;
    if (daytimeCounter <= 250 || daytimeCounter >= 750) {
      glowalpha = (1 - (1 / (canvasHeight) * this.y)) * ((250 - daytimeCounter) / 250);
      if (daytimeCounter > 750) {
        glowalpha = (1 - (1 / (canvasHeight) * this.y)) * ((daytimeCounter - 750) / 250);
      }
    }
    if (glowalpha > 0 && glowalpha < 1) {
      ctx.globalAlpha = glowalpha / 2;
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
  this.update = function () {
    ctx.fillStyle = this.colour1;
    ctx.globalAlpha = 0.15 * (1 - (this.timer / 200));
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
  this.speedX = speedX / 2;
  this.speedY = speedY / 2;
  this.timer = 5;
  this.render = function () {
    // draw the thing
    // console.log(this.width);
    ctx.globalAlpha = (this.timer / 15);
    ctx.lineWidth = size;
    ctx.strokeStyle = this.colour;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.speedX, this.y - this.speedY);
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
  let speed = 1;
  glyphs.push(new Glyph(x, y, 0, -speed, symbol));
  glyphs.push(new Glyph(x, y, 0, speed, symbol));
  glyphs.push(new Glyph(x, y, speed, 0, symbol));
  glyphs.push(new Glyph(x, y, -speed, 0, symbol));
  glyphs.push(new Glyph(x, y, speed / 1.5, speed / 1.5, symbol));
  glyphs.push(new Glyph(x, y, speed / 1.5, -speed / 1.5, symbol));
  glyphs.push(new Glyph(x, y, -speed / 1.5, speed / 1.5, symbol));
  glyphs.push(new Glyph(x, y, -speed / 1.5, -speed / 1.5, symbol));
  return true;
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
  this.spin = (Math.random() * 2) - 1;
  this.speedX += (Math.random() * 2) - 1;
  this.speedY += (Math.random() * 2) - 1;
  this.update = function () {
    this.speedY += gravity / 2;
    if (checkBounceSides(this) || checkBounceTop(this) || checkBounceBottom(this)) {
      this.timer -= 1;
    }
    // drift to middle (hopefully not enough to counteract gravity);
    if (this.y > trueBottom / 2) {
      this.speedY -= 0.0125;
    } else if (this.y < trueBottom / 2) {
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
    this.timer -= this.step;
  };
  this.render = function () {
    // draw glyph
    ctx.globalAlpha = this.timer / glyphTimer / 2;
    ctx.fillStyle = this.colour;
    ctx.font = '14px' + ' ' + globalFont;
    ctx.save();
    ctx.translate(this.x - (this.size / 2), this.y + (this.size / 2));
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
  let seconds = (86400 / 1000) * (counter);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  hours = ('0' + hours).slice(-2);
  minutes = Math.floor(minutes - (hours * 60));
  minutes = ('0' + minutes).slice(-2);
  // seconds = Math.floor(seconds - (minutes*60));
  // seconds = ('0' + seconds).slice(-2);
  return (hours + ':' + minutes/* +':'+seconds*/);
}

/**
* function to calculate the season colours
*/
function recalcSeasonVariables() {
  seasonText = seasonNames[3];
  let glyph = unicodeLeaf;
  if (season > 3) {
    season = 0;
    glyph = unicodeSnowflake;
    seasonText = seasonNames[0];
  } else if (season == 1) {
    glyph = unicodeStar;
    seasonText = seasonNames[1];
  } else if (season == 2) {
    glyph = unicodeSun;
    seasonText = seasonNames[2];
  }
  if (season == 3) {
    seasonNext = 0;
  } else {
    seasonNext = season + 1;
  }
  sendMessage(seasonText + ' began');
  // trees spawn glyphs

  let failed = false;
  for (let i = 0; !failed && i < trees.length && i < canvasWidth / 150; i++) {
    if (!failed && Math.random() < 0.5) {
      if (createGlyphs(trees[i].x, trees[i].y, glyph)) {
        for (let i = 1; !failed && i < 9; i++) {
          // white glyphs in winter
          if (season == 0) {
            glyphs[glyphs.length - i].colour = mixTwoColours(trueWhite, seasonColour[seasonNext], 0.5);
          }
          glyphs[glyphs.length - i].timer *= 2 + (Math.random() * 2.5);
        }
      } else {
        failed = true;
      }
    }
  }
}
