const version = 0.071;

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
const ticksPerDay = 1000;
const dayTicksPerFrame = 0.25;

// Time-based counters
let gameTimeElapsed = 0; // Total game time in ms
let gameSpeedMultiplier = 1.0; // Speed multiplier for scaling game speed

// game modes
let endlessMode = false; // endless modes ensures we always have at least one male and female chitten of breeding age and autospawns kittens
const devMode = false; // turn devmode on or off

// game setup
secondTimer = 0;
daytimeCounter = 0;
timeMod = daytimeCounter;
day = 0;
today = day;
paused = false;
choosingChitten = false;
chosenChittenM = true;
chosenChittenF = true;
chosenKitten = true;
choiceTimer = 0;
maleCount = 0;
femaleCount = 0;
nonbinaryCount = 0;
selection = null;
starfield = [];
pointerPos = new MousePosition(canvasWidth / 2, canvasHeight / 2);
touchOnorOffThisFrame = false;
boxes = [];
parentBoxes = [];
speech = [];
currentChittens = 0;
maleParent = null;
femaleParent = null;

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

// star parameters
const starsAmountModifier = 100;

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

// days and seasons
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const seasonNames = ['Winter', 'Spring', 'Summer', 'Autumn'];
// starting season
season = 1; // spring
seasonNext = season + 1; // summer
const seasonColour = ['#5ec3ed', '#65bf4f', '#fae10b', '#ee7f17'];

// set background gradient colours by time of day
const nightColour = ['#1c324c', '#79366d', '#334d5b', '#281b41'];
const morningColour = ['#6ad7db', '#89b83f', '#c24728', '#ffff00'];
const middayColour = ['#4381cc', '#42adb4', '#3e9225', '#59a86a'];
const midnightColour = ['#020421', '#020423', '#020e2b', '#010005'];

// set seasonal colours and temperatures
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

  initUi();

  console.log(reportNames());
  // initial fireflies
  for (let i = 0; i < startingFireflies; i++) {
    let x = selectLeftOrRightEdge();
    fireflies.push(new FireFly(x, Math.random() * trueBottom, pointerPos, 1, glowColour));
  }
  // plant starter trees
  for (let i = 0; i < startingTrees; i++) {
    tryToPlantaTree(Math.abs(Math.random() * canvasWidth), randomColourFruity());
    trees[trees.length - 1].y = trueBottom - (trees[trees.length - 1].maxHeight * Math.random() * 0.66);
    trees[trees.length - 1].birthday = Math.round(Math.random() * ticksPerDay);
    trees[trees.length - 1].reachedMaxHeight = (Math.random() < 0.5);
    // spawn with random number of fruit
    let numFruit = Math.round(Math.random() * 3);
    for (let i = 0; i < numFruit; i++) {
      trees[trees.length - 1].spawnFruit();
    }
  }
  // gene editing
  experiment = new Chitten(70, 90, 13.5, chittenMaxSize, 'Female');
  experiment.name = getFemaleName(Math.floor(Math.random() * numlibs * namesinlib));
  randomiseGenetics(experiment);
  experiment.awake = true;
  experiment.onSurface = true;
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

  // recalculate screen positions of buttons/labels that are canvas size dependent
  boxSize = 170 * proportion;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].canvasSizeDependent) {
      buttons[i].reinitPosition();
    }
  }
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].canvasSizeDependent) {
      labels[i].reinitPosition();
    }
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

  // Remove trees that are outside bounds instead of pushing them back
  for (let i = trees.length - 1; i >= 0; i--) {
    if (trees[i].x > canvasWidth - trees[i].width || trees[i].y > trueBottom - trees[i].width) {
      trees.splice(i, 1);
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

  // kill glyphs if they are offscreen on resize
  for (let i = 0; i < glyphs.length; i++) {
    if (glyphs[i].x > canvasWidth - glyphs[i].size || glyphs[i].y > trueBottom - glyphs[i].size) {
      glyphs.splice(i, 1);
      i--;
    }
  }

  // Remove offscreen fruits on resize (especially fumbled ones that may have bounced off screen)
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].x < -fruits[i].size || fruits[i].x > canvasWidth + fruits[i].size ||
      fruits[i].y < -fruits[i].size || fruits[i].y > trueBottom + fruits[i].size) {
      // Remove fruit from focus if any chitten was targeting it
      removeFocusFrom(fruits[i]);
      fruits.splice(i, 1);
      i--;
    }
  }

  // Push ghosts back in bounds
  for (let i = 0; i < ghosts.length; i++) {
    if (ghosts[i].x > canvasWidth - ghosts[i].size) {
      ghosts[i].x = canvasWidth - ghosts[i].size;
    }
    if (ghosts[i].y > trueBottom - ghosts[i].size) {
      ghosts[i].y = trueBottom - ghosts[i].size;
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

  if (trees.length < minTrees && seeds.length == 0) {
    // No seeds in bellies, spawn random tree
    tryToPlantaTree(Math.abs(Math.random() * canvasWidth), randomColourFruity());
  }

  // Update all fruits logic
  for (let i = 0; i < fruits.length; i++) {
    fruits[i].update();

    // Update position for fruits on trees (like chittens do)
    if (fruits[i].onSurface && fruits[i].landedOnTree) {
      fruits[i].y = fruits[i].landedOnTree.y - (fruits[i].size * 2);
    }

    // Apply physics to fumbled fruits
    if (fruits[i].fumbled && !fruits[i].onSurface) {
      // Apply gravity
      let massGravity = gravity * fruits[i].mass;
      fruits[i].speedY += massGravity;

      // Apply drag
      let dragX = fruits[i].speedX * dragFactor * (fruits[i].size / 15);
      let dragY = fruits[i].speedY * dragFactor * (fruits[i].size / 15);
      fruits[i].speedX -= dragX;
      fruits[i].speedY -= dragY;

      // Update position
      fruits[i].x += fruits[i].speedX / 4;
      fruits[i].y += fruits[i].speedY / 4;

      // Check tree collision first (only when falling downward)
      let hitTree = false;
      if (fruits[i].speedY >= 0) {
        for (let t = 0; t < trees.length && !hitTree; t++) {
          if (fruits[i].x >= trees[t].x - trees[t].width / 2 - fruits[i].size / 2 &&
            fruits[i].x <= trees[t].x + trees[t].width / 2 + fruits[i].size / 2 &&
            fruits[i].y >= trees[t].y - fruits[i].size * 2 &&
            fruits[i].y <= trees[t].y + trees[t].height) {
            // Fruit lands on tree
            fruits[i].y = trees[t].y - (fruits[i].size * 2);
            fruits[i].speedY *= -0.2; // Small bounce or settle
            fruits[i].speedX *= 0.9; // Tree friction
            if (Math.abs(fruits[i].speedY) < 1) {
              fruits[i].onSurface = true; // Settled on tree
              fruits[i].landedOnTree = trees[t]; // Remember which tree we're on
            }
            hitTree = true;
          }
        }
      }

      // Check ground collision (if didn't hit tree)
      if (!hitTree && fruits[i].y >= trueBottom - fruits[i].size * 2) {
        fruits[i].y = trueBottom - fruits[i].size * 2;
        fruits[i].speedY *= -0.3; // Bounce with some energy loss
        fruits[i].speedX *= 0.8; // Friction on ground
        if (Math.abs(fruits[i].speedY) < 0.5) {
          fruits[i].onSurface = true; // Stop physics when settled
        }
      }

      // Check wall collisions
      if (fruits[i].x <= fruits[i].size) {
        fruits[i].x = fruits[i].size;
        fruits[i].speedX *= -0.4; // Bounce off left wall with energy loss
      } else if (fruits[i].x >= canvasWidth - fruits[i].size) {
        fruits[i].x = canvasWidth - fruits[i].size;
        fruits[i].speedX *= -0.4; // Bounce off right wall with energy loss
      }

      // Apply speed limits
      applySpeedLimit(fruits[i]);
    }
  }

  // Update all fireflies logic
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].update();
  }

  // Update all glyphs logic
  for (let i = 0; i < glyphs.length; i++) {
    glyphs[i].update();
  }

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
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].update();
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

  while (accumulator >= fixedTimeStep && logicUpdates < 5) {
    // Run one game logic update at 50 UPS
    myGameArea.frameNo += 1;
    touchOnorOffThisFrame = false;

    // Always track total time for rendering calculations
    gameTimeElapsed += fixedTimeStep;

    if (!paused && gameSpeedMultiplier > 0) {

      // increase daytime counter and make seasons rotate (scaled by speed)
      daytimeCounter += dayTicksPerFrame * gameSpeedMultiplier;
      if (daytimeCounter >= ticksPerDay) {
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

  // change the colour by time of day (must run every frame)
  if (true) { // Always run to ensure uiColourArray is populated
    for (let tick = 0; tick < nightColour.length; tick++) {
      let ri = 0;
      let gi = 0;
      let bi = 0;
      let rj = 0;
      let gj = 0;
      let bj = 0;
      if (daytimeCounter < 250) {
        timeMod = daytimeCounter;
        ri = hexToRgb(midnightColour[tick]).r;
        gi = hexToRgb(midnightColour[tick]).g;
        bi = hexToRgb(midnightColour[tick]).b;
        rj = hexToRgb(morningColour[tick]).r;
        gj = hexToRgb(morningColour[tick]).g;
        bj = hexToRgb(morningColour[tick]).b;
      } else if (daytimeCounter < 500) {
        timeMod = daytimeCounter - 250;
        ri = hexToRgb(morningColour[tick]).r;
        gi = hexToRgb(morningColour[tick]).g;
        bi = hexToRgb(morningColour[tick]).b;
        rj = hexToRgb(middayColour[tick]).r;
        gj = hexToRgb(middayColour[tick]).g;
        bj = hexToRgb(middayColour[tick]).b;
      } else if (daytimeCounter < 750) {
        timeMod = daytimeCounter - 500;
        ri = hexToRgb(middayColour[tick]).r;
        gi = hexToRgb(middayColour[tick]).g;
        bi = hexToRgb(middayColour[tick]).b;
        rj = hexToRgb(nightColour[tick]).r;
        gj = hexToRgb(nightColour[tick]).g;
        bj = hexToRgb(nightColour[tick]).b;
      } else {
        timeMod = daytimeCounter - 750;
        ri = hexToRgb(nightColour[tick]).r;
        gi = hexToRgb(nightColour[tick]).g;
        bi = hexToRgb(nightColour[tick]).b;
        rj = hexToRgb(midnightColour[tick]).r;
        gj = hexToRgb(midnightColour[tick]).g;
        bj = hexToRgb(midnightColour[tick]).b;
      }
      let dayR = Math.floor(ri - ((((ri - rj) / 250)) * timeMod));
      let dayG = Math.floor(gi - ((((gi - gj) / 250)) * timeMod));
      let dayB = Math.floor(bi - ((((bi - bj) / 250)) * timeMod));

      // create seasonal colour shading
      let tempColour = mixTwoColours(seasonColour[seasonNext], seasonColour[season], daytimeCounter / ticksPerDay);
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
    temperature = (temp2 * (daytimeCounter / ticksPerDay)) + (temp1 * (1 - (daytimeCounter / ticksPerDay)));
    temperature = ('0' + Math.round(temperature)).slice(-2);
  }

  // countdown timer, used when choosing from a litter
  if (!paused && !chosenKitten) {
    updateChoiceTimer();
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
  let offsetX = daytimeCounter * cloudWidth / ticksPerDay;

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
      if (fruits[i].eater !== 'X' && fruits[i].eater.onSurface && fruits[i].eater.eatingChewsRemaining == 0) {
        // Only allow eating if chitten is fully sitting (or if they weren't preparing)
        if (!fruits[i].eater.preparingToEat || fruits[i].eater.sittingProgress >= 1) {
          // sendMessage(fruits[i].eater.name+' ate a piece of fruit');
          fruits[i].eater.hunger += 500;
          fruits[i].eater.health += 50;
          fruits[i].eater.energy += 10;
          fruits[i].eater.eatingChewsRemaining = 4;
          fruits[i].eater.eatingChewTimer = 0;
          fruits[i].eater.eatingChewState = 'closed';
          fruits[i].eater.sitting = true;
          fruits[i].eater.preparingToEat = false; // Reset the flag
        }
      } else if (fruits[i].eater !== 'X' && fruits[i].eater.onSurface && fruits[i].eater.eatingChewsRemaining > 0) {
        // Eating finished - allow chitten to stand up again
        // fruits[i].eater.targetSittingState = false;
        removeFocusFrom(fruits[i]);
        fruits.splice(i, 1);
        i--;
      }
    }
  }
  // draw the fruit that should be drawn BEHIND chittens and the floor
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == null && !fruits[i].fumbled) {
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

  // glyphs
  for (i = glyphs.length - 1; i >= 0; i--) {
    if (glyphs[i].timer < 0) {
      glyphs.splice(i, 1);
      i--;
    } else {
      glyphs[i].render();
    }
  }

  ctx.globalAlpha = 1;

  // for gravestones
  for (let d = 0; d < gravestones.length; d++) {
    // combine adjacent gravestones
    for (let e = 0; e < gravestones.length; e++) {
      if (!gravestones[e].elder && d !== e && gravestones[d].x == gravestones[e].x && gravestones[d].y == gravestones[e].y) {
        gravestones[d].timer = gravestones[e].timer;
        gravestones.splice(e, 1);
        e--;
      }
    }
    if (gravestones[d].timer < 1) {
      let ghostSize = gravestones[d].size;
      if (gravestones[d].elder) {
        ghostSize /= 3;
      }
      ghosts.push(new Ghost(gravestones[d].x, gravestones[d].y, ghostSize * 0.8, gravestones[d].firstColour));
      sendMessage('A ghost emerged from a grave');
      gravestones.splice(d, 1);
      d--;
    } else {
      gravestones[d].update(d);
    }
  }

  // draw and kill the ghosts
  for (let i = 0; i < ghosts.length; i++) {
    if (ghosts[i].y < 0 - ghosts[i].size * 20) {
      let fireFlySize = ghosts[i].size / 8;
      if (fireFlySize < 0.4) {
        fireFlySize = 0.4;
      }
      if (fireflies.length < maxFireflies) {
        sendMessage('A ghost became a FireFly');
        fireflies.push(new FireFly(ghosts[i].x, ghosts[i].y, fireflies[fireflies.length - 1], fireFlySize, ghosts[i].firstColour));
      }
      ghosts.splice(i, 1);
      i--;
    } else {
      ghosts[i].render();
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

  // Render sleeping chittens first (background)
  for (let i = 0; i < chittens.length; i++) {
    const chitten = chittens[i];
    if (selection !== chitten && !chitten.awake) {
      const catSize = chitten.size || 20;
      const bounceBuffer = catSize * 2;

      // Only render chittens that are on-screen
      if (chitten.x >= -bounceBuffer && chitten.x <= canvasWidth + bounceBuffer &&
        chitten.y >= -bounceBuffer && chitten.y <= canvasHeight + bounceBuffer) {
        chitten.render();
      }
    }
  }

  // Render awake chittens second (foreground)
  for (let i = 0; i < chittens.length; i++) {
    const chitten = chittens[i];
    if (selection !== chitten && chitten.awake) {
      const catSize = chitten.size || 20;
      const bounceBuffer = catSize * 2;

      // Only render chittens that are on-screen
      if (chitten.x >= -bounceBuffer && chitten.x <= canvasWidth + bounceBuffer &&
        chitten.y >= -bounceBuffer && chitten.y <= canvasHeight + bounceBuffer) {
        chitten.render();
      }
    }
  }

  // render the selected chitten last
  for (let i = 0; i < chittens.length; i++) {
    const chitten = chittens[i];
    if (selection == chitten) {
      const catSize = chitten.size || 20;
      const bounceBuffer = catSize * 2;

      // Only render chittens that are on-screen
      if (chitten.x >= -bounceBuffer && chitten.x <= canvasWidth + bounceBuffer &&
        chitten.y >= -bounceBuffer && chitten.y <= canvasHeight + bounceBuffer) {
        chitten.render();
      }
    }
  }

  // draw the fruit that should appear in front of chittens and the floor being eaten or fumbled
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater !== null || fruits[i].fumbled) {
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
      // Close mouth when speech ends, but not if currently eating
      if (speech[i].who.eatingChewsRemaining == 0) {
        speech[i].who.targetMouthOpenState = false;
      }
      speech.splice(i, 1);
    }
  }

  // Firefly logic
  for (let f = 0; f < fireflies.length; f++) {
    // setting focus for fireflies
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

          // Check if firefly fumbles the fruit
          if (Math.random() < fireflyFumbleRate) {
            fireflies[f].focus.fumbleFruit();
            return;
          }

          fireflies[f].stomach++;
          fireflies[f].justAte = true;
          // spawning another firefly when this one has eaten enough fruit
          if (fireflies[f].stomach >= 25 && fireflies.length <= maxFireflies) {
            fireflies[f].stomach = 0;
            let x = selectLeftOrRightEdge();
            fireflies.push(new FireFly(fireflies[f].x, fireflies[f].y, null, 0.8, fireflies[f].firstColour));
            fireflies[fireflies.length - 1].chooseNewTarget();
          }
          // consume the fruit and reset the focus
          let victimIndex = fruits.indexOf(fireflies[f].focus);
          fireflies[f].lastTreeVisited = fireflies[f].focus.parent;
          removeFocusFrom(fireflies[f].focus);
          fireflies[f].chooseNewTarget();
          fruits.splice(victimIndex, 1);
          let glyphsSpawned = createGlyphs(fireflies[f].x, fireflies[f].y, '.', 1)
          for (let i = 1; i <= glyphsSpawned; i++) {
            glyphs[glyphs.length - i].colour = trueWhite;
            glyphs[glyphs.length - i].timer *= 0.25;
          }
        }
      }
    }

    // draw firefly trails, log touches, then update
    trails.push(new Particle(fireflies[f].size / 10, glowColour, fireflies[f].x, fireflies[f].y, fireflies[f].speedX, fireflies[f].speedY));
    if (fireflies[f].touchedThisFrame) {
      // spawn a new firefly if there are less than or close to the minimum, and it is nearly dead
      if (fireflies[f].touches >= 0.8 * fireflyTouchLimit && fireflies.length <= minFireflies && fireflies.length < maxFireflies) {
        let x = selectLeftOrRightEdge();
        fireflies.push(new FireFly(x, Math.random() * trueBottom, pointerPos, 1, glowColour));
      }
      fireflies[f].touches += 1;
      fireflies[f].chooseNewTarget();
    }
    fireflies[f].render();
  }

  // killing fireflies
  for (let f = 0; f < fireflies.length; f++) {
    fireflies[f].touchedThisFrame = false;
    if (fireflies[f].touches >= fireflyTouchLimit) {
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
          targets[i].focus = null;
        }
      }
    }
  }

  // if we get below the minimum required fireflies, spawn one
  if (fireflies.length < minFireflies) {
    let x = selectLeftOrRightEdge();
    fireflies.push(new FireFly(x, Math.random() * trueBottom, pointerPos, 1, glowColour));
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

  // pause blacking out
  if (paused) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = mixTwoColours(trueBlack, uiColourArray[3], 0.5);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = 1;
  }

  renderUi();
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

function removeFocusFrom(who) {
  for (let i = 0; i < fireflies.length; i++) {
    if (fireflies[i].focus == who) {
      fireflies[i].chooseNewTarget();
    }
  }
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].focus == who) {
      chittens[i].focus = null;
    }
  }
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

function recalculateChittens(fruitSet) {
  // block for all my guys
  if (!paused) {
    for (let i = 0; i < chittens.length; i++) {
      // do dragging first
      if (chittens[i].beingHeld) {
        chittens[i].facingForwards = true;
        chittens[i].x = pointerPos.x;
        chittens[i].y = pointerPos.y;
        chittens[i].speedX = 0;
        chittens[i].speedY = 0;
        chittens[i].resetRotation();
        chittens[i].sitting = false;
        chittens[i].onSurface = false;
      }
      // check to see if it's time to die
      // attrition, aging etc.
      // increasing age, and related checks
      if (chittens[i].inCatBox == null && chittens[i].birthday == daytimeCounter + 1) {
        chittens[i].age++;
        // maturing to adult
        if (chittens[i].age == maturesAt) {
          sendMessage(chittens[i].name + ' reached adulthood');
          let glyphsSpawned = createGlyphs(chittens[i].x, chittens[i].y, unicodeHeart, 1)
          for (let i = 1; i <= glyphsSpawned; i++) {
            glyphs[glyphs.length - i].timer *= 1 + (Math.random() * 1);
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
          createGlyphs(chittens[i].x, chittens[i].y, unicodeAsterix, 1);
          // dying of old age
        } else if (chittens[i].snuggling == -1 && chittens[i].eatingChewsRemaining == 0 && chittens[i].age > chittens[i].maxAge) {
          sendMessage(chittens[i].name + ' died of old age');
          gravestones.push(new Grave(chittens[i].x, chittens[i].y, chittens[i].size, chittens[i].speedX, chittens[i].speedY, chittens[i].elder, chittens[i].firstColour));
          chittens[i].kill();
          i--;
        }
      }
    }
    // start a new loop to check for next cause of death
    for (let i = 0; i < chittens.length; i++) {
      // dying because of low health
      if (chittens[i].health <= 0) {
        createGlyphs(chittens[i].x, chittens[i].y, unicodeMedic, 1);
        gravestones.push(new Grave(chittens[i].x, chittens[i].y, chittens[i].size, chittens[i].speedX, chittens[i].speedY, chittens[i].elder, chittens[i].firstColour));
        sendMessage(chittens[i].name + ' died');
        removeRelationships(chittens[i]);
        chittens[i].kill();
        i--;
        // so as long as that doesn't kill you......
      } else {
        // Handle catbox chittens with reduced processing but allow physics collisions with the box they are in
        if (chittens[i].inCatBox !== null) {
          chittens[i].awake = true; // Ensure catbox chittens stay awake for adoption display
          // Ensure catbox chittens can fall and move by resetting onSurface if needed
          if (chittens[i].y < chittens[i].inCatBox.y + chittens[i].inCatBox.height - chittens[i].size) {
            chittens[i].onSurface = false; // Allow falling until they reach the bottom of their box
          }
        } else {
          chittens[i].lifeTick();
        }

        // Only check collisions if this chitten is awake (further optimization)
        if (!chittens[i].awake) {
          // Sleeping chittens still need tree collision checks to follow growing/withering trees
          chittens[i].physicsCheck();
          continue;
        }

        // chitten collision checking
        for (let j = i + 1; j < chittens.length; j++) {
          // Early exit optimizations for performance
          if (!chittens[j].awake || chittens[j].inCatBox !== null) continue;

          // Fast distance check before expensive collision detection
          let dx = chittens[i].x - chittens[j].x;
          let dy = chittens[i].y - chittens[j].y;
          let maxDistance = (chittens[i].size + chittens[j].size) * 1.5; // Buffer for collision
          if (dx * dx + dy * dy > maxDistance * maxDistance) continue;

          // if two chittens bump into each other (only check each pair once)
          if (detectCollision(chittens[i], chittens[j])) {
            if (!chittens[i].onSurface && !chittens[j].onSurface) {
              collide(chittens[i], chittens[j]);
            }

            // having a snuggle
            if (!choosingChitten
              && !chittens[i].beingHeld && !chittens[j].beingHeld
              && ((chittens[i].gender == 'Male' && chittens[j].gender == 'Female') || (chittens[i].gender == 'Female' && chittens[j].gender == 'Male'))
              && chittens[i].eatingChewsRemaining == 0 && chittens[j].eatingChewsRemaining == 0
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
                addSpeech(chittens[i], happyWord());
              } else if (Math.random() < 2 / 3) {
                addSpeech(chittens[j], happyWord());
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

        // trying to eat fruit
        if (chittens[i].focus && chittens[i].awake && chittens[i].eatingChewsRemaining == 0 && chittens[i].snuggling == -1 && fruitSet.has(chittens[i].focus)) {
          if (detectFruitCollision(chittens[i], chittens[i].focus)) {
            let fruit = chittens[i].focus;
            // chance to fumble the fruit if it is in a tree
            let taskDifficulty = 0.2;
            let failureRate = (1 - (chittens[i].coordination * chittenBaseCoordination)) * taskDifficulty;
            if (Math.random() < failureRate) {
              //FAIL
              fruit.fumbleFruit();
            } else {
              chittens[i].facingForwards = true;
              chittens[i].speedX = 0;
              chittens[i].speedY = 0;
              // Set preparing to eat
              chittens[i].preparingToEat = true;
              chittens[i].sitting = true;
              chittens[i].targetSittingState = true;
              // Only decrement parent fruit count if fruit has a parent (not fumbled)
              if (fruit.parent && !fruit.fumbled) {
                fruit.parent.fruitCount--;
              }
              fruit.eater = chittens[i];
              // give the chitten a seed to plant
              if (seeds.length < minSeeds) {
                seeds.push(new Seed(fruit.colour, chittens[i]));
              }
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
          // For chittens without focus (like those in catboxes or being held by the player), use a neutral downward angle
          chittens[i].angleToFocus = chittens[i].inCatBox ? Math.PI / 2 : 0;
          diffx = 0;
          diffy = 0;
        }

        // adjusting speed in the air if we are going in the wrong direction
        if ((diffx > 0 && chittens[i].speedX < 0) || (diffx < 0 && chittens[i].speedX > 0)) {
          let correctionFactor = chittenBaseCoordination * (0.3 + (chittens[i].coordination * 0.7));
          chittens[i].speedX *= correctionFactor;
        } else {
          // Apply ground friction when on ground, air resistance when airborne
          if (chittens[i].onSurface) {
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

        if (!chittens[i].onSurface) {
          // Standard gravity with subtle size-based effects
          let mass = gravity * chittens[i].mass;
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

        }
        chittens[i].physicsCheck();
        applySpeedLimit(chittens[i]);
      }
    }
  }
}

/**
* function to handle the decorative starfield
*/
function recalculateStarfield() {
  // if there is less than the designated amount, add one
  if (starfield.length < starsAmountModifier * proportion) {
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
* function to turn the current ticker in the form of a 24 hour clock
* @param {int} counter - the current time of day (0 to ticksPerDay)
* @return {string} the minutes and seconds
*/
function tickerToTime(counter) {
  let seconds = (86400 / ticksPerDay) * (counter);
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
* function to calculate the season change and act accordingly
*/
function recalcSeasonVariables() {
  let glyph = 'Error';
  let glyphAlpha = 1;
  // clamp season if too high, wrap around to winter
  if (season > 3) season = 0;
  // work out next season
  seasonNext = (season === 3) ? 0 : season + 1;
  sendMessage(seasonNames[season] + ' began');
  // trees spawn glyphs
  switch (season) {
    case 0: // winter
      glyph = unicodeSnowflake;
      glyphAlpha = 0.2;
      break;
    case 1: // spring
      glyph = unicodeStar;
      break;
    case 2: // summer
      glyph = unicodeSun;
      break;
    case 3: // autumn
      glyph = unicodeLeaf;
      break;
  }
  for (let i = 0; i < trees.length && i < canvasWidth / 150; i++) {
    if (Math.random() < 0.5) {
      let glyphsSpawned = createGlyphs(trees[i].x, trees[i].y, glyph, glyphAlpha)
      for (let j = 1; j <= glyphsSpawned; j++) {
        const g = glyphs[glyphs.length - j];
        if (season === 0) {
          // white glyphs in winter
          g.colour = mixTwoColours(trueWhite, seasonColour[seasonNext], 0.5);
        }
        g.timer *= 2 + (Math.random() * 2.5);
      }
    }
  }
}

function selectLeftOrRightEdge() {
  let x = 0;
  if (Math.random() < 0.5) {
    x = canvasWidth;
  }
  return x;
}
