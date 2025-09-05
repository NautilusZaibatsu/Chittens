// init
// catboxes
thisCatBox = 0;
let maxPop; // maximum number of chittens allowed

// --- LIFESTAGES
const maturesAt = 2; // how many days the chitten is in the kitten stage
const oldAgeFor = 2; // how many days the chitten is in the old age stage
const chittenGrowthRate = 1 / 2000; // amount chittens grow per game tick until they reach their max size
const maxMaxAge = 20; // default maximum age before old death checks start - can be increased by breeding
const minMaxAge = 13; // default min maximum age
const ageVariance = maxMaxAge - minMaxAge;
// litters
const minLitterSize = 6;
const kittenPreviewSizeMod = 2.5; // amount a kitten's size is increased for the preview during litter selection for better visibility
// adoption centre
const proportionOfRandomChittens = 0.3; // proportion of mixed filter chittens that are truely randomly generated 
// nose colours
const nosePink = '#dfb2bc';
const noseBrown = '#473526';
const noseGrey = '#616166';
const noseBlack = '#25221f';
// skin colours
const skinPink = '#e9bbc5';
const skinBrown = '#685647';
const skinDarkBrown = '#3a3633';
const skinGrey = '#aa97a7';
const skinBlack = '#292726';
// --- Meter settings
// energy
const minEnergy = 0;
const maxEnergy = 100;
const sleepAt = minEnergy;
const wakeAt = maxEnergy * 0.9;
const baseEnergyDrain = 0.01325; // scales with temperature
const energyGainAsleep = 0.125;
// health
const minHealth = 0;
const maxHealth = 100;
const dieAt = 0;
const healthDrain = 0.001;
const starvationDrain = 0.001;
const healthGainAsleep = 0.05;
// hunger
const minHunger = 0;
const maxHunger = 100;
const eatAt = maxHunger / 2;
const starveAt = maxHunger * 0.9;
const hungerPerTick = 0.025;
// love
const minLove = 0;
const maxLove = 100;
const breedingLoveReq = 100;
const breedingEnergyReq = 50;
const breedingHealthReq = 50;
const loveSpringBonus = 0.5;
const loveGainAsleep = 0.005;
const snuggleTimerMale = 250; // how many UPS it takes to give birth after snuggling
const snuggleTimerFemale = 260; // how many UPS it takes to give birth after snuggling
// --- SIZE
const chittenBaseSize = 15;
const chittenMinSize = 10;
const chittenMaxSize = 20;
const chittenSizeVariation = chittenMaxSize - chittenMinSize;
// --- PHYSICALS
const baseJumpPower = 500; // the base jumping power of a chitten
const kittenJumpPenalty = baseJumpPower / 3;
const chittenBaseCoordination = 0.999; // how coordinated the base chittens are (1 is perfect). Associated with fumbling fruits and adjusting speed in the air
const elasticity = 0.5; // bounciness of chittens
const chittenJumpCooldown = 90; // UPS (game logic updates at 50 UPS)
// --- ANIMATION
const youngChittenJumpCooldown = 15; // UPS
const chittenSittingCooldown = 60; // UPS - how long chittens must sit before standing up. This counts down
const chittenSittingSpeed = 1 / 15; // UPS 
const chittenStandingUpSpeed = 1 / 10; // UPS
const chittenFlopSleepTreeSpeed = 1 / 60; // UPS
const chittenMaxSeekFireflyDistance = 1000; // diagonal measurement for physics calculations
const chittenMouthOpenCloseSpeed = 8; // UPS - frames to fully open/close mouth
const eatingChewCycleDuration = 20; // UPS frames per chew cycle (open + close)
const eatingTotalChews = 4; // Number of chew cycles during eating
// Derived eating phase durations (all based on eatingChewCycleDuration)
const eatingClosedPauseDuration = Math.max(1, Math.round(eatingChewCycleDuration * 0.1)); // 10% of cycle
const eatingOpenHoldDuration = Math.max(1, Math.round(eatingChewCycleDuration * 0.15)); // 15% of cycle
const speechDuration = 25; // time a chitten's speech lasts

// images
// patterns and body parts
const smile = new Image();
smile.src = 'img/smile.png';
const smile2 = new Image();
smile2.src = 'img/smile2.png';
const smile3 = new Image();
smile3.src = 'img/smile3.png';
const eyesClosed = new Image();
eyesClosed.src = 'img/eyesClosed.png';
const pattern1 = new Image(); // tortoiseshell
pattern1.src = 'img/pattern1.png';
pattern1.onload = () => { };
const pattern2 = new Image(); // piebald
pattern2.src = 'img/pattern2.png';
pattern2.onload = () => { };
const pattern3 = new Image(); // tabby
pattern3.src = 'img/pattern3.png';
pattern3.onload = () => { };
const pattern6 = new Image(); // rosette
pattern6.src = 'img/pattern6.png';
pattern6.onload = () => { };
const tickedCoat = new Image(); // ticked
tickedCoat.src = 'img/ticked.png';
const sparseCoat = new Image(); // sparse coat
sparseCoat.src = 'img/sparse.png';
sparseCoat.onload = () => { };
const butthole = new Image();
butthole.src = 'img/butthole.png';

// Pattern lookup
const validPatterns = [
  { value: 0, image: null, label: 'None' },
  { value: 1, image: pattern1, label: 'Tortoiseshell' },
  { value: 2, image: pattern2, label: 'Piebald' },
  { value: 3, image: pattern3, label: 'Tabby' },
  { value: 6, image: pattern6, label: 'Rosette' },
];
const patternResolution = 400; // 400px x 400px images
const chittenPatternRes = patternResolution / 100;  // == 4
const basePatternSize = chittenMinSize * chittenPatternRes;
const maxPatternShift = patternResolution / 8;

// Special bodypart strings lookup
const specialColours = [
  { value: 0, label: 'firstColour' },
  { value: 1, label: 'secondColour' },
  { value: 2, label: 'thirdColour' },
  { value: 3, label: 'baldFaced' },
  { value: 4, label: 'colourpoint' },
  { value: 5, label: 'pupil' },
  { value: 6, label: 'leftEye' },
  { value: 7, label: 'rightEye' },
];

// Age specific colours (all arrays should be darkest to brightest)
const kittenEyeColours = ['#253485', '#a1b2d8'];
const colourpointKittenColours = ['#d3cd91', trueWhite];
const oldAgePupilColour = '#535353'

// Define anatomical connections: [topBodypartIndex, bottomBodypartIndex]
const connections = [
  [12, 0],   // [0] front foot left: chest to front foot left
  [12, 1],   // [1] front foot right: chest to front foot right  
  [2, 12],  // [2] head: head to chest
  [3, 2],   // [3] left ear: left ear to head
  [4, 2],   // [4] right ear: right ear to head
  [5, 12],  // [5] body: body to chest
  [6, 5],   // [6] tail: tail to body
  [5, 7],   // [7] back foot left: body to back foot left
  [5, 8],   // [8] back foot right: body to back foot right
  [9, 11],  // [9] left jowl: left jowl to chin
  [10, 11], // [10] right jowl: right jowl to chin
  [2, 11],  // [11] chin: head to chin
  [5, 12]   // [12] chest: body to chest
];

/**
* Get pattern name from validPatterns array
*/
function getPatternName(patternValue) {
  const pattern = validPatterns.find(p => p.value === patternValue);
  return pattern ? pattern.label : 'Unknown';
}

// Performance optimization: Cache mate-finding results
let availableMates = [];
let matesCacheFrame = 0;
const MATES_CACHE_REFRESH_RATE = 30; // Refresh every 30 frames

// choosing from litter choice timer
const standardModeChoiceTimer = 5000; // 100 seconds - appears as 99
const endlessModeChoiceTimer = 300; // 6 seconds - appears as 5

// arrays
chittens = [];

/**
* function to describe a Chitten
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} sex - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Chitten(x, y, bodySize, maxSize, sex) {
  this.name = null;
  this.age = 0;
  this.maxAge = minMaxAge + (ageVariance / 2);
  this.birthday = daytimeCounter;
  // Life stages
  this.matureModifier = 1; // 0 to 1 value for maturity (0 = newborn, 1 = mature)
  this.oldAgeModifier = 0; // 0 to 1 value for old age (0 = not aging, 1 = dead)
  // General
  this.sex = sex;
  this.litters = 0;
  // Coats / colours / outlines
  this.firstColour = trueWhite;
  this.secondColour = trueWhite;
  this.thirdColour = trueWhite;
  this.patternColour = trueBlack;
  this.skinColour1 = trueWhite;
  this.skinColour2 = trueWhite;
  this.skinColour3 = trueWhite;
  this.eyeColour = trueWhite;
  this.eyeColour2 = trueWhite;
  this.pattern = 0;
  this.patternAlpha = 0.5;
  this.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.coatMod = [0, 0, 0, 0, 0, 0,];
  // cached colours, gradients and patterns
  this.bodypartColours = [];
  this.specialColours = [];
  this.bodypartGradients = [];
  this.patternColours = [];
  this.outlineColour = '';
  this.noseColour = noseBlack;
  this.leftToeColour = skinPink;
  this.rightToeColour = skinPink;
  this.cachedPatternImage;
  this.cachedPatternRotation;
  this.cachedPatternScale;
  // Size
  this.size = bodySize;
  this.maxSize = Math.min(maxSize, chittenMaxSize);
  // Appearance
  this.nosePos = 0.5;
  this.eyePosX = 0.5;
  this.eyePosY = 0.5;
  this.eyeSize = 0.5;
  this.headWidth = 0.5;
  this.headHeight = 0.5;
  this.fangs = 0.5; // [style, length]
  this.earWidth = 0.5; // 0.5 is average
  this.earHeight = 0.5;
  this.thickness = 0.5; // 0.5 is average
  this.legLength = 0.5;
  this.tailLength = 0.5;
  this.mawSize = 0.5;
  // Derived sizes and offsets, calculated in recalculateSizes
  this.bodyToFeetDistance;
  this.outlineThickness;
  this.legWidth;
  this.frontLegLength;
  this.frontLegOriginX;
  this.frontLegOriginY;
  this.backLegOriginY;
  this.backLegOriginX;
  this.footSize;
  this.frontFootOriginX;
  this.frontFootOriginY;
  this.backFootOriginX;
  this.backFootOriginY;
  this.thicknessModS;
  this.thicknessModL;
  this.tailLengthY;
  this.tailThickness;
  // behaviour
  this.angleToFocus = Math.PI / 2; // spawn with angle to focus straight down
  this.originalAngleToFocus = Math.PI / 2;
  this.behaviorUpdateCounter = Math.floor(Math.random() * 5); // Stagger initial updates
  this.jumpCooldown = 0; // Frames to wait before next jump
  //meters
  this.health = maxHealth; // max 100
  this.love = maxLove; // max 100
  this.energy = maxEnergy; // max 100
  this.hunger = maxHunger / 2; // full at 0, hungriest at 100
  // physics
  this.mass = this.size * this.thickness;
  this.coordination = 0.5; // how well coordinated the chitten is (0.0 to 1.0)
  this.maxJumpPower = 0; // set in reinitsizes
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.jumpHeight = 0;
  // special states
  this.snuggling = -1; // Default is -1. 0 is the snuggling state, anything above -1 is the animation length in UPS frames
  // animation states
  this.eatingChewsRemaining = 0; // 0 = not eating, >0 = chews left to do
  this.eatingChewTimer = 0; // tracks progress within current chew cycle
  this.eatingChewState = 'closed'; // 'closed', 'opening', 'open', 'closing'
  this.preparingToEat = false; // true when grabbed fruit and sitting before eating
  this.sittingProgress = 0; // 0 = standing, 1 = fully sitting
  this.sittingCooldown = 0; // Frames left before chitten can stand up from sitting
  this.targetSittingState = false; // Which sitting state we're lerping toward
  this.openMouthProgress = 0; // 0 = closed, 1 = fully open
  this.targetMouthOpenState = false; // Which mouth open state we're lerping toward
  this.treeSleepPosProgress = 0; // 0 = normal position, 1 = tree sleeping position
  // interaction
  this.beingHeld = false;
  // genetics
  this.breed = mixedBreed;
  this.heterochromicGene = false;
  this.heterochromicExpressed = false;
  this.albinoGene = false;
  this.albinoExpressed = false;
  this.baldFacedGene = false;
  this.baldFacedExpressed = false;
  this.sparseCoatGene = false;
  this.sparseCoatExpressed = false;
  this.tickedCoatGene = false;
  this.tickedCoatExpressed = false;
  this.hairlessGene = false;
  this.hairlessExpressed = false;
  this.colourpointGene = false;
  this.colourpointExpressed = false;
  this.brachycephalicGene = false;
  this.brachycephalicExpressed = false;
  this.dwarfismGene = false;
  this.dwarfismExpressed = false;
  this.melanismGene = false;
  this.melanismExpressed = false;
  this.colourpointMap = [false, false, false, false]; // chin, ears, feet, tail
  // checks
  this.onSurface = false;
  this.closestFirefly = null;
  this.inCatBox = null;
  this.awake = true;
  this.reachedNirvana = false;
  this.partner = null;
  this.mother = null;
  this.facingForwards = true;
  this.focus = null;
  this.hitFocus = false;
  this.flaggedForDeath = false;
  this.onTree = false;
  this.kill = function (death = true) {
    if (death) {
      createGlyphs(this.x, this.y, unicodeMedic, 1);
      gravestones.push(new Grave(this.x, this.y, this.size, this.speedX, this.speedY, this.age >= (this.maxAge - oldAgeFor), this.firstColour));
    }
    removeRelationships(this);
    chittens.splice(chittens.indexOf(this, chittens), 1);
    recalculateChittenNumbers();
  };
  // --- COLOURS
  // Helper function to read a stored colour after it is calculated
  this.getBodyPartColour = function (bpi) {
    if (typeof bpi !== 'string') {
      return this.bodypartColours[bpi];
    } else {
      const index = this.getSpecialBodypartIndex(bpi);
      if (index >= 0) {
        return this.specialColours[index];
      }
      console.warn('getBodyPartColour fed a bad string: ' + bpi);
    }
  }
  this.getSpecialBodypartIndex = function (string) {
    const found = specialColours.find(item => item.label === string);
    return found ? found.value : -1;
  }
  // function to recalculate colours
  this.recalculateColours = function (all = false) {
    // Determine whether we can skip any bodypartCodes
    let forceRefreshBPC = [];
    let forceRefreshSC = [];
    if (!all) {
      // colourpoint parts need to be refreshed if they are affected by the gene
      if (this.colourpointExpressed) {
        forceRefreshBPC.push(9, 10, 'colourpoint');
        for (let i = 0; i < this.colourpointMap.length; i++) {
          if (this.colourpointMap[i]) {
            const bodypartIndices = this.colourMapToBodypartCode(i);
            forceRefreshBPC.push(...bodypartIndices);
          }
        }
      }
      if (this.baldFacedExpressed) {
        forceRefreshBPC.push(9, 10, 11);
      }
      // tabby kitten colours change constantly
      if ((this.age < maturesAt && (this.pattern == 3 || this.colourpointExpressed))
        // elderly chittens colours fade constantly
        || this.age >= this.maxAge - oldAgeFor) {
        for (let i = 0; i < this.bodypartCode.length; i++) {
          forceRefreshBPC.push(i);
        }
      }
      // kitten eye colours change
      if (this.age < maturesAt) {
        forceRefreshSC.push(6, 7);
        // old age chittens' pupils fade
      } else if (this.age >= this.maxAge - oldAgeFor) {
        forceRefreshBPC.push(5);
      }
    }

    // --- CALCULATIONS
    // Calculate the base bodypartCode colours
    if (all || forceRefreshBPC.length > 0) {
      for (let i = 0; i < this.bodypartCode.length; i++) {
        if (all || forceRefreshBPC.includes(i)) {
          this.bodypartColours[i] = this.calculateBodyPartColour(i);
        }
      }
    }
    // Calculate special colours
    if (all || forceRefreshSC.length > 0) {
      for (const special of specialColours) {
        if (all || forceRefreshSC.includes(special.value)) {
          this.specialColours[special.value] = this.calculateBodyPartColour(special.label);
        }
      }
    }
    // Calculate the pattern colours
    if (this.pattern !== 0) {
      this.patternColours = this.calculatePatternColours();
    }
    // Calculate the gradients - include connected body parts
    for (let i = 0; i < this.bodypartCode.length; i++) {
      if (all || forceRefreshBPC.length > 0) {
        let needsRefresh = all || forceRefreshBPC.includes(i);

        // Also refresh if any connected body parts need refreshing
        if (!needsRefresh) {
          const connectedParts = this.getConnectedBodyparts(i);
          needsRefresh = connectedParts.some(connectedIndex => forceRefreshBPC.includes(connectedIndex));
        }

        if (needsRefresh) {
          this.bodypartGradients[i] = this.calculateBodypartGradient(i);
        }
      }
    }
    // Cache expensive pattern calculations
    if (all) {
      this.cachedPatternImage = this.getPatternImageFromValidPatterns();
    }
    this.cachedPatternRotation = this.coatMod[2] * 2 * Math.PI;
    // calculating skin and nose colours using helpers
    if (all || this.sparseCoatExpressed) {
      this.skinColour1 = this.getSkinColourFromColour(this.firstColour);
      this.skinColour2 = this.getSkinColourFromColour(this.secondColour);
      this.skinColour3 = this.getSkinColourFromColour(this.thirdColour);
    }
    if (all) {
      this.noseColour = this.getNoseColourFromColour(this.firstColour);
      this.leftToeColour = this.getNoseColourFromColour(this.getBodyPartColour(0));
      this.rightToeColour = this.getNoseColourFromColour(this.getBodyPartColour(1));
    }
    // Calculating the colours of cell shading
    if (all && this.melanismExpressed) {
      this.outlineColour = mixTwoColours(trueBlack, trueWhite, 0.7);
    } else if (all && this.albinoExpressed && !this.hairlessExpressed && !this.sparseCoatExpressed) {
      this.outlineColour = mixTwoColours(trueWhite, trueBlack, 0.7);
    } else if (all && this.albinoExpressed && this.hairlessExpressed) {
      this.outlineColour = mixTwoColours(nosePink, trueBlack, 0.7);
    } else if (all && this.hairlessExpressed) {
      this.outlineColour = mixTwoColours(this.noseColour, noseBlack, 0.5);
    } else if (all && this.sparseCoatExpressed) {
      let c1 = mixThreeColours(this.getSkinColour(0), this.getSkinColour(1), this.getSkinColour(2));
      if (!this.albinoExpressed) {
        let c2 = mixThreeColours(this.getBaseColour(0), this.getBaseColour(1), this.getBaseColour(2));
        let cc = mixTwoColours(c1, c2, 0.5);
        this.outlineColour = mixTwoColours(cc, trueBlack, 0.5);
      } else {
        this.outlineColour = mixTwoColours(c1, trueWhite, 0.9);
      }
    } else {
      let c1 = mixTwoColours(this.getBaseColour(0), this.getBaseColour(1), 0.5);
      let c2 = mixTwoColours(this.getBaseColour(2), this.getPatternColourAndAlpha()[0], 0.5);
      let cc = mixTwoColours(c1, c2, 0.5);
      this.outlineColour = mixTwoColours(this.modifyColourByLifeStage(cc), trueBlack, 0.7);
    }
  }
  // function to return whether a chitten needs to have it colours updated
  this.coatChangesColour = function () {
    // old ages desaturate
    if (this.age >= (this.maxAge - oldAgeFor)
      // young chittens eye's change and tabbys/colourpoints change colour
      || this.age < maturesAt
      // coloupoint temperature sensitivity
      || this.colourpointExpressed
      // sparse coat temperature sensitivity
      || this.sparseCoatExpressed) {
      return true;
    }
    else return false;
  }
  // Helper functions for color resolution
  this.getBaseColour = function (ColourIndex) {
    const colorMap = [this.firstColour, this.secondColour, this.thirdColour];
    return this.modifyColourByLifeStage(colorMap[ColourIndex]);
  };
  this.getSkinColour = function (ColourIndex) {
    const skinMap = [this.skinColour1, this.skinColour2, this.skinColour3];
    return skinMap[ColourIndex];
  };
  this.getSkinColourFromColour = function (theColour) {
    let rgb = hexToRgb(theColour);
    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;
    let output = trueWhite;
    if (r > rgbMax / 2 && g > rgbMax / 2 && b > rgbMax / 2) {
      // Check for white cats (high brightness across all channels)
      output = skinPink;
    } else if (r > 150 && r > g * 1.3 && r > b * 1.5) {
      // Check for ginger/orange cats (red dominance)
      output = skinPink;
    } else if (r < 50 && g < 50 && b < 50) {
      // check for very dark cats
      output = skinBlack;
    } else {
      // everything else gets grey skin
      output = skinGrey;
    }
    // special case - the sparseCoat gene makes the skin tan when exposed to sunlight
    if (this.sparseCoatExpressed) {
      let temperatureMod = temperature / (maxTemperature - minTemperature); // 0 (cold) to 1 (hot)
      if (output == skinPink) {
        return mixTwoColours(skinBrown, skinPink, temperatureMod);
      } else {
        return mixTwoColours(skinDarkBrown, skinGrey, temperatureMod);
      }
    }
    // All other colors (grey, black, etc.) get grey skin
    return output;
  };
  this.getNoseColourFromColour = function (theColour) {
    // special cases - melanism /albinism
    if (this.albinoExpressed) return nosePink;
    if (this.melanismExpressed) return noseBlack;
    // special case - the sparseCoat gene makes the skin tan when exposed to sunlight
    if (this.sparseCoatExpressed) {
      let temperatureMod = temperature / (maxTemperature - minTemperature); // 0 (cold) to 1 (hot)
      return mixTwoColours(noseBrown, skinPink, temperatureMod);
    }
    let rgb = hexToRgb(theColour);
    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;
    let output = trueWhite;
    if (r > rgbMax / 2 && g > rgbMax / 2 && b > rgbMax / 2) {
      // Check for white cats (high brightness across all channels)
      output = skinPink;
    } else if (r > 150 && r > g * 1.3 && r > b * 1.5) {
      // Check for ginger/orange cats (red dominance)
      output = skinPink;
    } else if (r < 50 && g < 50 && b < 50) {
      // check for very dark cats
      output = noseBlack;
    } else {
      // everything else gets grey skin
      output = noseGrey;
    }
    // All other colors (grey, black, etc.) get grey skin
    return output;
  };
  // helper function for mixing coat colours at different stages of life
  this.modifyColourByLifeStage = function (clr) {
    let colour = clr;
    // colourpoint first
    if (this.colourpointExpressed && (this.matureModifier !== 1)) {
      let modifier = 1; // 0 is newborn, 1 is mature
      if (this.matureModifier !== 1) {
        modifier = this.matureModifier;
        const colourBrightness = getBrightness(colour) / rgbMax; // 0 to 1 where 1 is brightest
        const colourMix = mixTwoColours(colourpointKittenColours[1], colourpointKittenColours[0], colourBrightness);
        colour = mixTwoColours(colour, colourMix, modifier);
      }
    }
    // tabbies start off darker
    if (this.pattern == 3 && (this.matureModifier !== 1)) {
      let modifier = 1;
      if (this.matureModifier !== 1) {
        modifier = this.matureModifier;
        const colourMix = mixTwoColours(clr, trueBlack, 0.6);
        colour = mixTwoColours(colour, colourMix, modifier);
      }
      // old age chittens next
    } else if (this.oldAgeModifier !== 0) { // 0 is adult, 1 is totally old age
      let modifier = 0;
      if (this.oldAgeModifier !== 0) {
        modifier = this.oldAgeModifier;
        let colourMix = decreaseSaturationHEX(colour, 1.1);
        colourMix = increaseBrightnessHEX(colourMix, 1.05);
        colour = mixTwoColours(colourMix, colour, modifier);
      }
    }
    return colour;
  }
  this.getBodypartColourIndex = function (bpi) {
    return typeof bpi === 'number' ? this.bodypartCode[bpi] : 0;
  };
  // --- CALCULATING BODYPART COLOURS TO STORE
  // helper function for eye colours (includes life stages)
  this.calculateEyeColour = function (eyePart) {
    if (this.albinoExpressed) {
      return albinoRed;
    }
    if (eyePart == 'leftEye') {
      let leftEyeColour = this.eyeColour;
      if (this.age < maturesAt) {
        const eyeBrightness1 = getBrightness(leftEyeColour) / rgbMax; // 0 to 1 where 1 is brightest
        const eyeMix1 = mixTwoColours(kittenEyeColours[1], kittenEyeColours[0], eyeBrightness1);
        leftEyeColour = mixTwoColours(leftEyeColour, eyeMix1, this.matureModifier);
      }
      if (this.melanismExpressed) {
        let mEye = hexToRgb(leftEyeColour);
        leftEyeColour = rgbToHex(mEye.r, mEye.g, 0);
      }
      return leftEyeColour;
    } else if (eyePart == 'rightEye') {
      let rightEyeColour = this.eyeColour2;
      if (this.age < maturesAt) {
        const eyeBrightness2 = getBrightness(rightEyeColour) / rgbMax;
        const eyeMix2 = mixTwoColours(kittenEyeColours[1], kittenEyeColours[0], eyeBrightness2);
        rightEyeColour = mixTwoColours(rightEyeColour, eyeMix2, this.matureModifier);
      }
      if (this.melanismExpressed) {
        let mEye = hexToRgb(rightEyeColour);
        rightEyeColour = rgbToHex(mEye.r, mEye.g, 0);
      }
      return rightEyeColour;
    } else if (eyePart == 'pupil') {
      let pupilColour = trueBlack;
      if (this.albinoExpressed) {
        pupilColour = mixTwoColours(trueBlack, albinoRed, 0.5);
      } else if (this.albinoGene) {
        pupilColour = mixTwoColours(trueBlack, albinoRed, 0.7);
      }
      if (this.oldAgeModifier !== 0) { // 0 is adult, 1 is totally old age
        let modifier = this.oldAgeModifier;
        pupilColour = mixTwoColours(oldAgePupilColour, pupilColour, modifier);
      }
      return pupilColour
    } else {
      console.warn("calculateEyeColour fed bad string: " + eyePart);
    }
  }
  // getBodyPartColour with priority-based resolution
  this.calculateBodyPartColour = function (bpi, bypass = false) {
    // priority 0: Eye parts passes to different function
    if (typeof bpi == 'string' && (bpi == 'pupil' || bpi == 'leftEye' || bpi == 'rightEye')) {
      return this.calculateEyeColour(bpi);
    }
    // Priority 1: Albino override (highest priority)
    if (this.albinoExpressed && !this.baldFacedExpressed) {
      return (this.hairlessExpressed) ? skinPink : trueWhite;
    } else if (this.albinoExpressed && (bpi === 'baldFaced' || bpi === 9 || bpi == 10)) {
      return skinPink;
    } else if (this.albinoExpressed) {
      return trueWhite;
    }
    // Priority 1: Melanic override (joint highest priority)
    if (this.melanismExpressed && !this.baldFacedExpressed && typeof bpi !== 'string') {
      return (this.hairlessExpressed) ? skinBlack : mixTwoColours(this.getBaseColour(this.bodypartCode[bpi]), trueBlack, 0.2);
    } else if (this.melanismExpressed && (bpi === 'baldFaced' || bpi === 9 || bpi == 10)) {
      return skinBlack;
    } else if (this.melanismExpressed) {
      return trueBlack;
    }

    // Priority 2: Bypass mode (raw colors)
    if (bypass && typeof bpi === 'number') {
      return this.getBaseColour(this.bodypartCode[bpi]);
    }

    // Priority 3: Special color references (firstColour, secondColour, etc.)
    if (typeof bpi === 'string' && ['firstColour', 'secondColour', 'thirdColour'].includes(bpi)) {
      const colourIndex = ['firstColour', 'secondColour', 'thirdColour'].indexOf(bpi);
      return this.hairlessExpressed ? this.getSkinColour(colourIndex) : this.getBaseColour(colourIndex);
    }

    // Priority 4: Colorpoint effects
    const isColorpointPart = this.colourpointExpressed && (
      bpi === 'colourpoint' ||
      bpi === 9 || bpi === 10 ||
      (typeof bpi === 'number' && this.colourpointMap && this.colourpointMap[this.bodypartcodeToColourMap(bpi)])
    );

    if (isColorpointPart) {
      if (this.hairlessExpressed || (this.baldFacedExpressed && (bpi === 11 || bpi === 9 || bpi === 10))) {
        return this.getSkinColour(2);
      }
      // colourpoint temperature sensitivity
      let temperatureMod = 1 - ((temperature / (maxTemperature - minTemperature)) * 0.9); // 1 (cold) to 0.25 (hot)
      let output = this.getBaseColour(2);
      // map the special 'colourpoint' string to the face bodyPartIndex
      if (bpi === 'colourpoint') {
        bpi = 2;
      }
      return mixTwoColours(output, this.getBaseColour(this.bodypartCode[bpi]), temperatureMod);
    }

    // Priority 5: Bald-faced effects
    if (this.baldFacedExpressed) {
      if (bpi === 'baldFaced') {
        if (this.sparseCoatExpressed) {
          return this.getSkinColourFromColour(this.thirdColour);
        }
        if (this.colourpointExpressed) {
          return this.skinColour3;
        }
        // Calculate mixed jowl color
        const jowlColor9 = this.getBaseColour(this.bodypartCode[9]);
        const jowlColor10 = this.getBaseColour(this.bodypartCode[10]);
        return this.getSkinColourFromColour(mixTwoColours(jowlColor9, jowlColor10, 0.5));
      }

      if ([9, 10, 11].includes(bpi)) {
        return this.getSkinColour(this.bodypartCode[bpi]);
      }
    }

    // Priority 6: Hairless effects
    if (this.hairlessExpressed && typeof bpi === 'number') {
      return this.getSkinColour(this.bodypartCode[bpi]);
    }

    // Priority 7: Default bodypart colors
    if (typeof bpi === 'number') {
      return this.getBaseColour(this.bodypartCode[bpi]);
    }

    // Fallback
    return this.modifyColourByLifeStage(this.firstColour);
  };

  // function to convert a bodypartcode index to a colourmap index
  this.bodypartcodeToColourMap = function (bpc) {
    if (bpc == 11) {
      return 0;
    }
    if (bpc == 3 || bpc == 4) {
      return 1;
    }
    if (bpc == 0 || bpc == 1 || bpc == 7 || bpc == 8) {
      return 2;
    }
    if (bpc == 6) {
      return 3;
    }
  };

  // function to convert a colourmap index to a bodypartcode index
  this.colourMapToBodypartCode = function (cmi) {
    if (cmi == 0) {
      return [11]; // chin
    }
    if (cmi == 1) {
      return [3, 4]; // ears
    }
    if (cmi == 2) {
      return [0, 1, 7, 8]; // feet
    }
    if (cmi == 3) {
      return [6]; // tail
    }
    return [];
  };

  // Helper to find all body parts connected to a given body part index
  this.getConnectedBodyparts = function (bodypartIndex) {
    const connected = [];
    for (let i = 0; i < connections.length; i++) {
      const [top, bottom] = connections[i];
      if (i === bodypartIndex) {
        // This bodypart's own connections
        connected.push(top, bottom);
      } else if (top === bodypartIndex || bottom === bodypartIndex) {
        // Other bodyparts that connect to this one
        connected.push(i);
      }
    }
    return [...new Set(connected)]; // Remove duplicates
  };

  // helper to get a pattern, taking all modifiers into account
  this.getPatternColourAndAlpha = function () {
    let patColour = this.modifyColourByLifeStage(this.patternColour);
    let patAlpha = this.patternAlpha;
    // modify the pattern according to life stage and genes
    if (this.hairlessExpressed || this.sparseCoatExpressed) {
      patColour = this.getSkinColourFromColour(patColour);
    } else if (this.pattern == 3) {
      // tabby markings fade in from 50%
      patAlpha = (this.patternAlpha / 2) + (this.matureModifier * (patAlpha / 2));
    } else if (this.pattern == 1) {
      // tortoiseshell pattern is always black
      patColour = trueBlack;
    }
    if (this.melanismExpressed) {
      patColour = mixTwoColours(patColour, trueBlack, 0.2);
    }
    return [patColour, patAlpha];
  }

  // --- SIZES
  // function to reinitialise sizes - call this when the chitten's size changes (growth)
  this.recalculateSizes = function () {
    // --- Pattern
    this.cachedPatternScale = (this.size / basePatternSize) * patternResolution;
    // --- LIFESTAGES
    // Fraction of current day passed and exact age
    const dayFrac = ((daytimeCounter - this.birthday + ticksPerDay) % ticksPerDay) / ticksPerDay;
    const ageExact = this.age + dayFrac;
    // --- Maturity modifier
    let matureModifier = Math.min(1, Math.max(0, ageExact / maturesAt));
    // --- Old age modifier ---
    const startOld = this.maxAge - oldAgeFor;
    let oldAgeModifier = 0;
    if (ageExact >= this.maxAge) {
      oldAgeModifier = 1;
    } else if (ageExact >= startOld) {
      oldAgeModifier = (ageExact - startOld) / oldAgeFor; // 0..1 over the last `oldAgeFor` years
    }
    // Store results
    this.matureModifier = matureModifier;
    this.oldAgeModifier = oldAgeModifier;
    // Calculate mass and jumping range based on physical attributes
    this.mass = (this.size + ((this.size / 2) * this.thickness)) / 2; // ~ 5 to 15
    let power = (this.size / chittenBaseSize) * (baseJumpPower - ((1 - matureModifier) * kittenJumpPenalty));
    const work = power * this.size;
    const v0 = Math.sqrt(Math.max(0, (2 * work) / this.mass));
    this.maxJumpPower = v0;
    if (this.dwarfismExpressed) {
      this.maxJumpPower *= 0.6;
    }
    // Use calculateBallisticTrajectory to determine maximum horizontal range
    // Test with a target at ground level to get maximum distance
    let testResult = calculateBallisticTrajectory(200, 0, this.size, this.mass, this.maxJumpPower);
    if (testResult && testResult.reachable) {
      // If we can reach 200 units, try further
      let testResult2 = calculateBallisticTrajectory(400, 0, this.size, this.mass, this.maxJumpPower);
      this.jumpingRange = testResult2 && testResult2.reachable ? 400 : 200;
    } else {
      // Try shorter distances
      let testResult2 = calculateBallisticTrajectory(100, 0, this.size, this.mass, this.maxJumpPower);
      this.jumpingRange = testResult2 && testResult2.reachable ? 100 : 50;
    }
    // derived values
    this.outlineThickness = this.size / 10;
    this.legWidth = (this.size / 3) + (this.size * this.thickness * 0.4);
    this.thicknessModS = this.thickness * this.size / 2;
    this.thicknessModL = this.thickness * this.size / 5;
    if (!this.dwarfismExpressed) {
      // for dwarfism, init the leglength at birth but then never again
      this.frontLegLength = this.size + (1.75 * this.legLength * this.size); // 10 to 16 + 0 to 6 == 16 to 6
    } else {
      this.frontLegLength = this.size + ((1.75 * this.legLength * this.size) / 2);

    }
    this.frontLegOriginX = this.size * 2 / 3;
    this.frontLegOriginY = this.size / 4;
    this.backLegLength = this.frontLegLength * 0.6;
    this.backLegOriginY = this.size / 2;
    this.backLegOriginX = this.size / 1.6;
    this.footSize = (this.size / 5.5) + (this.thickness * this.size * 0.5);
    this.frontFootOriginX = this.size / 1.6;
    this.frontFootOriginY = this.size + (this.frontLegLength / 2.5);
    this.backFootOriginX = this.backLegOriginX;
    this.backFootOriginY = this.backLegLength;
    this.bodyToFeetDistance = this.frontLegLength - this.footSize;
    this.tailLengthY = -(this.size / 2) - (2 * this.tailLength * this.size);
    this.tailThickness = (this.size / 3) + (this.size * this.thickness * 0.3);
  };

  // --- BEHAVIOUR / LIFECYCLE

  // reset jump cooldown
  this.resetJumpCooldown = function () {
    // Wait frames before next jump, fat cats are lazier
    let jcd = 0;
    if (this.age < maturesAt) {
      // Kittens following mothers get much shorter cooldown to be eager followers
      jcd = youngChittenJumpCooldown + (youngChittenJumpCooldown * this.thickness);
    } else {
      jcd = chittenJumpCooldown + (chittenJumpCooldown * this.thickness);
    }
    this.jumpCooldown = jcd * Math.random();
  }

  // reset rotation
  this.resetRotation = function (fastest) {
    // Normalize rotation to [-π, π] range to prevent full spins
    this.rotation = ((this.rotation + Math.PI) % (2 * Math.PI)) - Math.PI;
    // Always take the shortest path to 0 for natural cat behavior
    if (Math.abs(this.rotation) <= 0.1) {
      this.rotation = 0;
      this.spin = 0;
    } else {
      // Always rotate towards 0 by the shortest path
      if (this.rotation > 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }
      // If we're not in fastest mode, slow down the rotation for more natural movement
      if (!fastest) {
        // Reduce spin momentum gradually when landing
        this.spin *= 0.9;
      }
    }
  };
  this.lifeTick = function () {
    // === GROWTH ===
    this.updateGrowth();

    // === HUNGER & STARVATION ===
    this.updateHunger();

    // === HEALTH ===
    this.updateHealth();

    // === ENERGY & SLEEP ===
    this.updateEnergy();

    // === LOVE ===
    this.updateLove();

    // === SLEEP/WAKE CYCLE ===
    this.updateSleepState();

    // === APPLY LIMITS ===
    this.applyStatLimits();
  }

  // Growth system
  this.updateGrowth = function () {
    if (this.size < this.maxSize) {
      this.size += chittenGrowthRate;
      if (this.age < maturesAt) {
        this.size += chittenGrowthRate; // Extra growth for kittens
      }
      this.recalculateSizes();
      // colours are calculated per frame drawn, not at UPS
    }
  }

  // Hunger and starvation effects
  this.updateHunger = function () {
    // Natural hunger increase
    if (this.hunger < maxHunger) {
      this.hunger += hungerPerTick;
    }

    // Starvation effects
    if (this.hunger >= starveAt && this.awake && this.snuggling <= 0 && !this.isEating()) {
      if (Math.random() <= 0.0005) {
        speak(this, angryWord());
      }
      this.health -= starvationDrain; // Health damage from starvation
    }
  }

  // Health system
  this.updateHealth = function () {
    // Natural health decay
    if (this.health > minHealth) {
      this.health -= healthDrain;
    }

    // Health recovery while sleeping
    if (!this.awake) {
      this.health += healthGainAsleep;
    }
  }

  // Energy system with temperature and time effects
  this.updateEnergy = function () {
    // Base energy drain (affected by temperature)
    if (temperature < maxTemperature) {
      this.energy -= baseEnergyDrain - (baseEnergyDrain / maxTemperature * temperature);
    }

    // Time of day effects
    if (this.awake && daytimeCounter <= ticksPerDay / 4) {
      this.energy -= baseEnergyDrain; // More tired between midnight and 3am
    }

    // Energy recovery while sleeping
    if (!this.awake) {
      this.energy += energyGainAsleep;
    }
  }

  // Love system with seasonal effects
  this.updateLove = function () {
    // Seasonal love bonuses
    if (season == 1) {
      this.love += loveSpringBonus // Spring: more amorous
    }
    // Love recovery while sleeping
    if (!this.awake) {
      this.love += loveGainAsleep;
    }
  }

  // Sleep state management and leg flop animation
  this.updateSleepState = function () {
    // Leg flop animation for sleeping chittens in trees
    if (!this.awake) {
      let shouldFlopLegs = this.onTree && this.y < trueBottom - this.bodyToFeetDistance - this.footSize;
      if (shouldFlopLegs && this.treeSleepPosProgress < 1) {
        let rawProgress = this.treeSleepPosProgress + chittenFlopSleepTreeSpeed;
        this.treeSleepPosProgress = this.getAnimationValue(rawProgress, 1, true, true);
        if (this.treeSleepPosProgress >= 1) {
          this.treeSleepPosProgress = 1;
        }
      }
    }
    // Wake up when energy is restored
    if (!this.awake && this.energy > wakeAt) {
      this.awake = true;
    }
  }

  // Clamp all stats to their valid ranges
  this.applyStatLimits = function () {
    this.energy = Math.max(minEnergy, Math.min(maxEnergy, this.energy));
    this.love = Math.max(minLove, Math.min(maxLove, this.love));
    this.health = Math.max(minHealth, Math.min(maxHealth, this.health));
    this.hunger = Math.max(minHunger, Math.min(maxHunger, this.hunger));
  }

  // functions to call to enter the sleep state
  this.fallAsleep = function () {
    this.awake = false;
    this.focus = null;
    this.facingForwards = true;
    this.speedX = 0;
    this.rotation = 0;
    this.spin = 0;
  }

  // function to make a chitten continue eating once they have started
  this.continueEating = function () {
    // Handle eating chew cycles
    this.eatingChewTimer++;
    // Eating chew cycle: closed -> opening -> open -> closing -> closed (repeat)
    if (this.eatingChewState === 'closed' && this.eatingChewTimer >= eatingClosedPauseDuration) {
      // Start opening mouth
      this.eatingChewState = 'opening';
      this.targetMouthOpenState = true;
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'opening' && this.openMouthProgress >= 1) {
      // Mouth is fully open, stay open briefly
      this.eatingChewState = 'open';
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'open' && this.eatingChewTimer >= eatingOpenHoldDuration) {
      // Start closing mouth
      this.eatingChewState = 'closing';
      this.targetMouthOpenState = false;
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'closing' && this.openMouthProgress <= 0) {
      // Mouth is fully closed, chew cycle complete
      this.eatingChewState = 'closed';
      this.eatingChewTimer = 0;
      this.eatingChewsRemaining--;
      if (this.eatingChewsRemaining <= 0) {
        // Finished all chews
        this.eatingChewState = 'closed';
        this.targetMouthOpenState = false;
        // sendMessage(fruits[i].eater.name+' ate a piece of fruit');
        // kill fruit that has been consumed
        let found = false;
        for (let i = 0; i < fruits.length && !found; i++) {
          if (fruits[i].eater == this) {
            found = true;
            let fruitValue = fruits[i].size / (treeMaxWidth * fruitTreeSizeRatio)
            this.hunger -= fruitValue * maxHunger / 2;
            this.health += fruitValue * maxHealth / 2;
            this.energy += fruitValue * maxEnergy * 0.1;
            console.log()
            this.love += fruitValue * maxLove * 0.1;
            // give the chitten a seed to plant
            if (seeds.length < minSeeds) {
              seeds.push(new Seed(fruits[i].colour, this));
            }
            fruits[i].remove();
            speak(this, happyWord());
          }
        }
      }
    }
    // Cycle the eating phases
    if (this.targetMouthOpenState && this.openMouthProgress < 1) {
      // Lerping toward mouth open with easing
      let rawProgress = this.openMouthProgress + (1 / chittenMouthOpenCloseSpeed);
      this.openMouthProgress = this.getAnimationValue(rawProgress, 1, true);
      if (this.openMouthProgress >= 1) {
        this.openMouthProgress = 1;
      }
    } else if (!this.targetMouthOpenState && this.openMouthProgress > 0) {
      // Lerping toward mouth closed with easing (reverse)
      let rawProgress = this.openMouthProgress - (1 / chittenMouthOpenCloseSpeed);
      if (rawProgress <= 0) {
        this.openMouthProgress = 0;
      } else {
        let reversedProgress = 1 - rawProgress;
        let easedReversed = this.getAnimationValue(reversedProgress, 1, true);
        this.openMouthProgress = 1 - easedReversed;
      }
    }
  }

  // function to return whether thwe chitten is eating or not
  this.isEating = function () {
    if (this.eatingChewsRemaining > 0) {
      return true;
    }
    return false;
  }

  // Dedicated sitting state management function
  this.updateSittingState = function () {
    // Being held - immediately stop sitting with no animation
    if (this.beingHeld) {
      this.sittingProgress = 0;
      this.targetSittingState = false;
      return; // Skip normal sitting logic
    }

    // Sitting down
    if (this.targetSittingState && this.sittingProgress < 1) {
      this.resetJumpCooldown(); // reset the jump cooldown if are trying to sit
      // Lerping toward sitting: fatter cats sit down faster
      let rawProgress = this.sittingProgress + chittenSittingSpeed * (1 + this.thickness);
      this.sittingProgress = this.getAnimationValue(rawProgress, 1, true, true);
      if (this.sittingProgress >= 1) {
        this.sittingProgress = 1;
        // Start sitting cooldown when fully sitting
        this.sittingCooldown = chittenSittingCooldown;
      }
    } else if (!this.targetSittingState && this.sittingProgress > 0) {
      // Lerping toward standing: fatter cats stand up slower
      // standing up (reverse the easing by using 1 - eased(1 - progress))
      let rawProgress = this.sittingProgress - chittenStandingUpSpeed * (2 - this.thickness);
      if (rawProgress <= 0) {
        this.sittingProgress = 0;
      } else {
        let reversedProgress = 1 - rawProgress;
        let easedReversed = this.getAnimationValue(reversedProgress, 1, true, true);
        this.sittingProgress = 1 - easedReversed;
      }
    } else {
      // Decrement sitting cooldown
      if (this.sittingCooldown > 0) {
        this.sittingCooldown--;
      }
    }

    // Handle leg unflop animation when standing up or leaving tree
    let shouldUnflopLegs = (this.awake && !this.targetSittingState) || !this.onTree;
    if (shouldUnflopLegs && this.treeSleepPosProgress > 0) {
      // Lerping back to normal legs (reverse easing)
      let rawProgress = this.treeSleepPosProgress - (chittenFlopSleepTreeSpeed * 2); // Faster return (2x speed)
      if (rawProgress <= 0) {
        this.treeSleepPosProgress = 0;
      } else {
        let reversedProgress = 1 - rawProgress;
        let easedReversed = this.getAnimationValue(reversedProgress, 1, true);
        this.treeSleepPosProgress = 1 - easedReversed;
      }
    }
  }

  // Convenience function to check if chitten is sitting
  this.isSitting = function () {
    return this.sittingProgress >= 1;
  }

  // act
  this.act = function () {
    // Decrement jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }
    // Update sitting animation and leg states
    this.updateSittingState();

    // giving birth
    if (!choosingChitten && !this.geneEditing && parentBoxes.length === 0 && this.snuggling == 0 && this.sex == 'Female') {
      if (this.partner !== null) {
        this.partner.snuggling = -1;
        this.partner.partner = null;
        createGlyphs((this.x - (this.x - this.partner.x) / 2), (this.y - (this.y - this.partner.y) / 2), unicodeHeart, 1);
        initLitter(this.partner, this); // this.partner = male, this = female
        // take snuggling to -1 so that it doesn't give birth forever
      } else {
        sendMessage(this.name + ' had a phantom pregnancy');
      }
      this.snuggling = -1;
      this.partner = null;
    } else if (!choosingChitten && !geneEditing && (this.snuggling >= 0)) {
      this.snuggling--;
    } else if (!this.isEating()) {
      // --- Opportunistic/Reactive Swatting:
      // Opportunistic firefly interactions happen every frame for responsiveness
      if (!this.inCatBox && this.awake && this.snuggling == -1 && !this.isEating()) {
        // Check for nearby fireflies for quick opportunistic jumps
        let closestFirefly = fireflies[this.findClosestFireFly()];
        if (closestFirefly) {
          let dx = this.x - closestFirefly.x;
          let dy = this.y - closestFirefly.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // If firefly is very close, switch focus and reset jump cooldown for immediate action
          if (distance < (this.size * 2) + this.bodyToFeetDistance && (!this.focus || fireflies.includes(this.focus))) {
            this.focus = closestFirefly;
            this.jumpCooldown = 0; // Allow immediate jumping at close fireflies
            if (Math.random() < 0.1) speak(this, angryWord());
          }
        }
      }

      // Throttle heavy behavior updates based on cat state
      this.behaviorUpdateCounter++;
      let updateFrequency = 3; // Reduced from 5 to make cats more active

      if (this.inCatBox) {
        updateFrequency = 15; // Cats in boxes update less frequently
      } else if (!this.awake) {
        updateFrequency = 10; // Sleeping cats update less frequently
      } else if (this.age < maturesAt) {
        updateFrequency = 2; // Kittens are even more active
      }

      if (this.behaviorUpdateCounter >= updateFrequency) {
        this.behaviorUpdateCounter = 0;

        // Don't change focus while eating or preparing to eat
        if (this.isEating() || this.preparingToEat) {
          // Skip focus updates while eating
        } else {
          // deciding what the focus is
          let target = null;

          // if not an adult, just follow mother (unless in catbox)
          if (this.age < maturesAt && this.mother !== null && !this.inCatBox) {
            target = this.mother;
          }
          // are we hungry?
          if (target == null && this.inCatBox == null && this.hunger >= eatAt && fruits.length > 0) {
            let closestFruit = this.findClosestFruit();
            if (closestFruit !== 'X') {
              target = closestFruit;
            }
          }
          // are we gonna pick a mate? (using cached mate list for performance)
          if (target == null && this.snuggling == -1 && !choosingChitten && this.age < (this.maxAge - oldAgeFor) && this.sex == 'Male' && this.age >= maturesAt && chittens.length <= maxPop && this.health >= breedingHealthReq
            && this.energy >= breedingEnergyReq) {
            // Update mates cache periodically
            matesCacheFrame++;
            if (matesCacheFrame >= MATES_CACHE_REFRESH_RATE) {
              matesCacheFrame = 0;
              updateMatesCache();
            }

            // Use cached available mates instead of looping through all cats
            if (!choosingChitten && this.sex == "Male" && this.love >= breedingLoveReq && this.energy >= breedingEnergyReq && this.health >= breedingHealthReq) {
            }
            for (let j = 0; j < availableMates.length && target == null; j++) {
              // We can target mates beyond our jumping range to get closer to them
              // The jumping range is just for filtering other targets
              this.partner = availableMates[j];
              availableMates[j].partner = this;
              target = availableMates[j];
            }
          }

          // --- Predatory distraction
          // Check for nearby fireflies that might override other targets
          if (!this.inCatBox && target !== null && target !== this.partner) {
            let closestFireflyIndex = this.findClosestFireFly();
            if (closestFireflyIndex !== 0) {
              let fireflyDistance = Math.sqrt(
                (this.x - fireflies[closestFireflyIndex].x) ** 2 +
                (this.y - fireflies[closestFireflyIndex].y) ** 2
              );
              // If firefly is within jumping range, consider jumping at it
              if (fireflyDistance <= this.jumpingRange) {
                // Higher chance to jump at closer fireflies
                let jumpChance = Math.max(0.1, Math.min(0.8, 1 - (fireflyDistance / this.jumpingRange)));
                if (Math.random() < jumpChance) {
                  target = fireflies[closestFireflyIndex];
                }
              }
            }
          }
          if (target == null && !this.inCatBox) {
            // --- Idle entertainment
            // default action - target firefly if we can't find anything better (only if not in adoption box)
            // This allows targeting distant fireflies occasionally
            this.focus = fireflies[this.findClosestFireFly()];
          } else if (!this.inCatBox) {
            // Check if target is too far away and we should tree-hop instead
            if (target) {
              let targetDistance = Math.sqrt((this.x - target.x) ** 2 + (this.y - target.y) ** 2);
              if (targetDistance > this.jumpingRange) {
                let helpfulTree = this.findHelpfulTree(target);
                if (helpfulTree) {
                  // Use tree as intermediate target, but remember our ultimate goal
                  this.ultimateTarget = target;
                  this.focus = helpfulTree;
                } else {
                  // No helpful tree found, target directly (will jump to get closer)
                  this.focus = target;
                }
              } else {
                // Target is within range, go directly
                this.focus = target;
              }
            }
          }
        } // End of eating check

        // kittens sitting down near their mothers - only when very close
        if (this.age < maturesAt && this.mother !== null
          && (Math.abs(this.x - this.mother.x) < (this.size + this.mother.size) * 3)
          && (Math.abs(this.y - this.mother.y) < (this.size + this.mother.size) * 3)) {
          if (this.mother.awake) {
            // copy the mother
            this.targetSittingState = this.mother.targetSittingState;
            this.facingForwards = true;
            // kittens falling asleep near their mothers
          } else if (this.onSurface && this.isSitting() && !this.isEating()) {
            this.energy = this.mother.energy - (Math.random() * 5);
            this.fallAsleep();
          }

        } else if (this.focus) {
          // Determine if we should allow jumping down based on target type
          let isFirefly = fireflies.includes(this.focus);
          let isMother = (this.focus === this.mother && this.age < maturesAt);
          let canJumpDown = !isFirefly; // Allow jumping down for mates and food, but not fireflies

          // For regular targets, use the old cooldown system
          // For fireflies and mothers, use opportunistic distance-based probability
          let shouldJump = false;
          if (!isFirefly && !isMother && this.jumpCooldown <= 0) {
            shouldJump = true;
          } else if ((isFirefly || isMother) && this.jumpCooldown <= 0) {
            // Calculate distance-based jump probability for fireflies and mothers
            let distance = Math.sqrt(
              Math.pow(this.focus.x - this.x, 2) +
              Math.pow(this.focus.y - this.y, 2)
            );
            let jumpChance;
            if (isMother) {
              // Kittens are eager followers - high base chance, even higher when far
              // Base 60% chance when very close, up to 95% when far away
              let maxMotherDistance = this.size * 8; // Consider distances up to 8 body lengths  
              let normalizedDistance = Math.min(1, distance / maxMotherDistance);
              jumpChance = Math.max(0.6, Math.min(0.95, normalizedDistance * 0.35 + 0.6));
            } else {
              // Firefly logic: closer = higher chance to jump
              let normalizedDistance = distance / chittenMaxSeekFireflyDistance;
              jumpChance = Math.max(0.1, Math.min(0.8, 1 - normalizedDistance));
            }
            // scale jump chance by energy.
            shouldJump = jumpChance < (Math.random() * 1);// + (this.energy / 200);
          }

          // if the focus is below the Chitten OR we can jump down to any target
          if (shouldJump && (this.focus.y <= this.y + (this.size * 2) || (canJumpDown && this.focus.y > this.y + (this.size * 2)))) {
            // If sitting, must lerp to standing before jumping (unless eating)
            if (this.sittingProgress > 0) {
              // Don't stand up if eating or preparing to eat, or if sitting cooldown is active
              if (!this.isEating() && !this.preparingToEat && this.sittingCooldown <= 0) {
                this.targetSittingState = false; // Start standing up
              }
              return false; // Don't jump yet, wait for sitting animation or eating to finish
            }
            // Jumping starts here
            let dx = this.focus.x - this.x;
            let dy = this.focus.y - this.y;
            let trajectory = calculateBallisticTrajectory(dx, dy, this.size, this.mass, this.maxJumpPower);
            if (trajectory && trajectory.reachable) {
              // Use the calculated optimal trajectory with coordination-based error
              let taskDifficulty = 0.3; // Precise jumping is moderately difficult
              let failureRate = (1 - (this.coordination * chittenBaseCoordination)) * taskDifficulty;
              let errorMagnitude = Math.random() * failureRate; // 0 to failureRate

              // Apply coordination errors to trajectory
              let speedXError = (Math.random() - 0.5) * 2 * errorMagnitude * this.maxJumpPower * 0.2;
              let speedYError = (Math.random() - 0.5) * 2 * errorMagnitude * this.maxJumpPower * 0.15;

              this.speedX += trajectory.speedX + speedXError;
              this.speedY += trajectory.speedY + speedYError;
              // console.log("Using ballistic trajectory: angle=" + trajectory.angle + "°, power=" + Math.round(trajectory.power));
            } else {
              // Fallback to directional jump with proper arc (target is unreachable, but jump to get closer)
              let totalDistance = Math.sqrt(dx * dx + dy * dy);
              if (totalDistance > 0) {
                // Always jump in an arc - never shuffle on ground
                let optimalAngle = Math.PI / 6; // 30 degrees default

                // If target is significantly above/below, adjust angle
                if (Math.abs(dy) > this.size * 2) {
                  let targetAngle = Math.atan2(Math.abs(dy), Math.abs(dx));
                  optimalAngle = Math.max(Math.PI / 8, Math.min(Math.PI / 3, targetAngle));
                }

                // Scale power based on distance needed (don't overjump short targets)
                let distanceScale = Math.min(1.0, totalDistance / this.jumpingRange);
                let scaledPower = this.maxJumpPower * Math.max(0.3, distanceScale); // Minimum 30% power

                // Apply coordination-based errors to fallback jumping
                let taskDifficulty = 0.4; // Fallback jumping is harder than precise trajectory
                let failureRate = (1 - (this.coordination * chittenBaseCoordination)) * taskDifficulty;
                let errorMagnitude = Math.random() * failureRate; // 0 to failureRate

                // Errors affect angle and power
                let angleError = (Math.random() - 0.5) * errorMagnitude * (Math.PI / 4); // Up to ±45° error
                let powerError = (Math.random() - 0.5) * 2 * errorMagnitude * scaledPower * 0.3; // Up to ±30% power error

                let adjustedAngle = optimalAngle + angleError;
                let adjustedPower = scaledPower + powerError;

                let horizontalDirection = dx > 0 ? 1 : -1;
                this.speedX += adjustedPower * Math.cos(adjustedAngle) * horizontalDirection;
                this.speedY += -adjustedPower * Math.sin(adjustedAngle); // Always arc upward

                // console.log("Jumping with " + Math.round(optimalAngle * 180 / Math.PI) + "° arc toward partner/target");
              }
            }
            this.resetJumpCooldown();

            // pay jumping costs:
            if (this.age >= maturesAt) {
              // it doesn't cost kittens energy or health to jump
              this.energy -= 7;
              this.health -= 1;
            }
            // frame timing edge
            this.y--;
            // one in ten jumps is facing backwards
            if (Math.random() < 1 / 10) {
              this.facingForwards = false;
            }
          }
        }
      } else {
        // 1% chance to sit when behavior updates, unless we are very tired
        if (!this.targetSittingState && (this.energy <= minEnergy || Math.random() < 0.01)) {
          this.targetSittingState = true;
        }
      }
      // 0.1% chance of speaking
      if (Math.random() <= 0.001) {
        speak(this, neutralWord());
      }
    }
  };

  this.findClosestFruit = function () {
    let tmp = maxDistance;
    let target = 'X';
    let reachableTarget = 'X';
    let reachableDistance = maxDistance;

    for (let f = 0; f < fruits.length; f++) {
      let tmpX = this.x - fruits[f].x;
      let tmpY = this.y - fruits[f].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));

      // Check if fruit is available and above ground
      if (fruits[f].eaterId == null && fruits[f].y <= trueBottom - fruits[f].size && distance < tmp) {
        // Check if it's within jumping range
        if (distance <= this.jumpingRange) {
          // Prefer reachable fruits
          if (distance < reachableDistance) {
            reachableTarget = fruits[f];
            reachableDistance = distance;
          }
        } else {
          // Only consider distant fruits if we're hungry and they're on the floor
          let onFloor = fruits[f].y >= trueBottom - fruits[f].size - 10; // Within 10 pixels of ground
          if (this.hunger > eatAt && onFloor) {
            tmp = distance;
            target = fruits[f];
          }
        }
      }
    }

    // Return reachable fruit if found, otherwise return distant fruit (if any)
    return reachableTarget !== 'X' ? reachableTarget : target;
  };

  // Find a tree that could help us get closer to our ultimate target
  this.findHelpfulTree = function (ultimateTarget) {
    if (!ultimateTarget) return null;

    let bestTree = null;
    let bestImprovement = 0;
    let currentDistance = Math.sqrt((this.x - ultimateTarget.x) ** 2 + (this.y - ultimateTarget.y) ** 2);

    for (let t = 0; t < trees.length; t++) {
      let treeDistance = Math.sqrt((this.x - trees[t].x) ** 2 + (this.y - trees[t].y) ** 2);

      // Only consider trees we can actually reach
      if (treeDistance <= this.jumpingRange) {
        // Calculate how much closer this tree gets us to the ultimate target
        let treeToTargetDistance = Math.sqrt((trees[t].x - ultimateTarget.x) ** 2 + (trees[t].y - ultimateTarget.y) ** 2);
        let improvement = currentDistance - treeToTargetDistance;

        // Only use tree if it gets us significantly closer (at least 50 units)
        if (improvement > 50 && improvement > bestImprovement) {
          bestTree = trees[t];
          bestImprovement = improvement;
        }
      }
    }

    return bestTree;
  };

  this.findClosestFireFly = function () {
    let tmp = maxDistance;
    let target = 'X';
    for (let i = 0; i < fireflies.length; i++) {
      let tmpX = this.x - fireflies[i].x;
      let tmpY = this.y - fireflies[i].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));
      if (distance < tmp) {
        tmp = distance;
        target = i;
      }
    }
    if (target == 'X') {
      return 0;
    }
    return target;
  };

  // check for bounces on walls and landing on trees
  this.physicsCheck = function () {
    this.onSurface = false;
    this.onTree = false;
    // check if chitten hit a Tree
    let hitTree = false;
    for (let i = 0; i < trees.length && !hitTree; i++) {
      if (!this.inCatBox && detectTreeCollision(this, trees[i], this.bodyToFeetDistance)) {
        if (this.speedY >= 0) {
          this.y = trees[i].y - this.bodyToFeetDistance;
          hitTree = true;
          this.landedOnSurface();
        }
        this.onTree = true;
        trees[i].loadthisframe += this.mass;

        // Check if we landed on our target tree and should now go to ultimate target
        if (this.ultimateTarget && this.focus === trees[i]) {
          let ultimateDistance = Math.sqrt((this.x - this.ultimateTarget.x) ** 2 + (this.y - this.ultimateTarget.y) ** 2);
          if (ultimateDistance <= this.jumpingRange) {
            // Now we can reach our ultimate target directly
            this.focus = this.ultimateTarget;
            this.ultimateTarget = null;
          } else {
            // Still too far, look for another tree to hop to
            let nextTree = this.findHelpfulTree(this.ultimateTarget);
            if (nextTree && nextTree !== trees[i]) {
              this.focus = nextTree;
            } else {
              // No more helpful trees, go directly to ultimate target
              this.focus = this.ultimateTarget;
              this.ultimateTarget = null;
            }
          }
        }

        if (!this.isEating() && this.snuggling <= 0) {
          this.energy -= 0.01;
        }
        if (this.y > trueBottom - (this.size) - (this.frontLegLength / 2.5)) {
          this.y = trueBottom - (this.size) - (this.frontLegLength / 2.5);
        }
      }
    }
    checkBounceSides(this);
    checkBounceTop(this);

    // check if chitten hit the floor, come to a rest if so
    if (!this.onSurface && this.y >= trueBottom - this.bodyToFeetDistance) {
      this.y = trueBottom - this.bodyToFeetDistance;
      this.landedOnSurface();
    }
  };

  this.landedOnSurface = function () {
    this.speedY = 0;
    this.onSurface = true;
    // Debug sleep conditions
    if (this.energy <= sleepAt && !this.isEating() && this.snuggling == -1 && this.isSitting()) {
      // fall asleep when tired
      this.fallAsleep();
    } else {
      this.facingForwards = true;
      // apply ground friction
      this.resetRotation(false);
      // jump occasionally
      if (!this.beingHeld && this.rotation == 0 && this.awake && !this.inCatBox) {
        this.act();
      }
    }
  };

  // Helper function for animation calculations (modulo operation)
  this.getAnimationValue = function (value, modulo, oneShot = false, linear = false) {
    // Normalize to 0-1 range
    let normalizedValue = oneShot ?
      Math.min(1, Math.max(0, value / modulo)) :  // One-shot: clamp to 0-1
      (value % modulo) / modulo;                   // Cyclical: wrap with modulo

    if (oneShot) {
      if (linear) {
        // Linear one-shot: no easing
        return normalizedValue * modulo;
      } else {
        // One-shot easing: smooth acceleration/deceleration using sine
        let easedValue = Math.sin(normalizedValue * Math.PI / 2);
        return easedValue * modulo;
      }
    } else {
      // Cyclical animation: continuous sine wave
      let sineValue = Math.sin(normalizedValue * 2 * Math.PI);
      // Convert from -1 to +1 range back to 0 to modulo range
      return ((sineValue + 1) / 2) * modulo;
    }
  };

  // --- GRADIENTS
  this.calculateBodypartGradient = function (bpi) {
    let gradientArray = [];
    const [topPartIndex, bottomPartIndex] = connections[bpi];
    let topColour, bottomColour, middleColour;
    topColour = mixTwoColours(this.getBodyPartColour(topPartIndex), this.getBodyPartColour(bpi), this.coatMod[3]);
    bottomColour = mixTwoColours(this.getBodyPartColour(bottomPartIndex), this.getBodyPartColour(bpi), this.coatMod[3]);
    middleColour = mixTwoColours(topColour, bottomColour, 0.5);
    gradientArray = [topColour, middleColour, bottomColour];
    return gradientArray;
  }

  this.getBodypartGradient = function (bpi) {
    return this.bodypartGradients[bpi];
  }

  // Helper function to apply bodypart code colors to gradient based on anatomical connections
  this.applyBodypartGradient = function (bodypartIndex, gradient) {
    let colourSet = this.getBodypartGradient(bodypartIndex);
    // Create gradient
    gradient.addColorStop(0, colourSet[0]);
    gradient.addColorStop(this.coatMod[0], colourSet[1]);
    gradient.addColorStop(1, colourSet[2]);
    return gradient;
  };

  // Helper function to create foot gradient
  // Combined function to create gradients for body parts
  this.createBodypartGradient = function (bodypartIndex, gradientType, gradientParams) {
    // For solid colors (hairless, albino, or colorpoint), use getBodyPartColour
    if (this.hairlessExpressed || this.albinoExpressed ||
      (!this.albinoExpressed && this.colourpointExpressed && this.colourpointMap[this.bodypartcodeToColourMap(bodypartIndex)])) {
      return this.getBodyPartColour(bodypartIndex);
    }

    // For normal cats, create the specified gradient
    if (!this.albinoExpressed && !this.hairlessExpressed) {
      let gradient;
      if (gradientType === 'radial') {
        gradient = ctx.createRadialGradient(...gradientParams);
      } else { // linear
        gradient = ctx.createLinearGradient(...gradientParams);
      }
      return this.applyBodypartGradient(bodypartIndex, gradient);
    }

    // Fallback
    return trueWhite;
  };

  // Helper function to create foot gradient
  this.createFootGradient = function (bodypartIndex, footSize) {
    return this.createBodypartGradient(bodypartIndex, 'radial', [
      0, 0, 1,
      0, 0, (this.size) + (this.frontLegLength / 2.5) + (footSize * 2)
    ]);
  };

  // Helper function to create ear gradient
  this.createEarGradient = function (bodypartIndex) {
    return this.createBodypartGradient(bodypartIndex, 'linear', [
      0, -this.size - (this.size * this.earWidth / 2),
      0, this.frontLegLength / 4
    ]);
  };

  // Helper function to create body gradient with consistent angle and color logic
  this.createBodyGradient = function (bpi, size) {
    return this.createBodypartGradient(bpi, 'linear', [
      + Math.cos(this.coatMod[1] * 2 * Math.PI) * size, // start pos
      + Math.sin(this.coatMod[1] * 2 * Math.PI) * size,
      - Math.cos(this.coatMod[1] * 2 * Math.PI) * size, // end pos
      - Math.sin(this.coatMod[1] * 2 * Math.PI) * size
    ]);
  };

  // Helper function to create tail gradient
  this.createTailGradient = function () {
    return this.createBodypartGradient(6, 'radial', [
      0, this.size, 1,
      0, 0, this.size * 4
    ]);
  };

  // Helper function to create linear leg gradient
  this.createLegGradient = function (bodypartIndex, x1, y1, x2, y2) {
    let gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    return this.applyBodypartGradient(bodypartIndex, gradient);
  };

  // Helper function to create head gradient with proper bodypart color logic
  this.createHeadGradient = function (gradHeight) {
    return this.createBodypartGradient(2, 'linear', [
      + Math.cos(this.coatMod[1] * 2 * Math.PI) * gradHeight, // start pos - same angle as body
      + Math.sin(this.coatMod[1] * 2 * Math.PI) * gradHeight,
      - Math.cos(this.coatMod[1] * 2 * Math.PI) * gradHeight, // end pos
      - Math.sin(this.coatMod[1] * 2 * Math.PI) * gradHeight
    ]);
  };

  // --- PATTERNS AND OVERLAYS

  this.calculatePatternColours = function () {
    let patColours = [];
    let patMods = this.getPatternColourAndAlpha();
    for (let i = 0; i < this.bodypartCode.length; i++) {
      let bodyPartColour = this.getBodyPartColour(i);
      patColours[i] = mixTwoColours(patMods[0], bodyPartColour, patMods[1]);
    }
    return patColours;
  }

  this.getPatternColour = function (bpi) {
    return this.patternColours[bpi];
  }

  // Helper to get pattern image using validPatterns lookup
  this.getPatternImageFromValidPatterns = function () {
    const patternData = validPatterns.find(p => p.value === this.pattern);
    return patternData ? patternData.image : null;
  }

  // helper to draw a pattern in a specific colour
  this.drawPatternOverlay = function (bpi, drawFunction) {
    // FIRST PASS: Draw regular patterns (if any)
    if (!this.albinoExpressed && this.pattern !== 0) {
      // Use cached values for performance
      const patImage = this.cachedPatternImage;
      const alphaColour = this.getPatternColour(bpi);
      // Draw regular pattern if we have one
      if (patImage) {
        const w = this.cachedPatternScale;
        const h = this.cachedPatternScale;
        ctx.save();
        // Define clip shape
        ctx.beginPath();
        drawFunction();   // only defines path
        ctx.closePath();
        ctx.clip();
        // Draw the pattern
        ctx.globalCompositeOperation = "destination-atop";
        ctx.rotate(this.cachedPatternRotation);
        let shiftX = (this.coatMod[4] - 0.5) * maxPatternShift;
        let shiftY = (this.coatMod[5] - 0.5) * maxPatternShift;
        if (bpi === 1 || bpi === 8 || bpi == 10) {
          shiftX *= -1;
          shiftY *= -1;
        }
        ctx.drawImage(patImage,
          -(w / 2) + shiftX,
          -(h / 2) + shiftY,
          w, h);
        // Tint it with desired color
        ctx.fillStyle = alphaColour;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
    }
  };

  // function to draw specialoverlays, such as sparse hair
  this.drawSpecialOverlay = function (bpc, drawFunction) {
    // SECOND PASS: Draw sparse coat overlay (if expressed)
    if (this.tickedCoatExpressed && this.albinoExpressed) return;
    if (this.sparseCoatExpressed || this.tickedCoatExpressed) {
      let specialPatternColour;
      let patImage;
      if (this.sparseCoatExpressed) {
        // Sparse coat
        specialPatternColour = this.getSkinColourFromColour(this.getBodyPartColour(bpc));
        patImage = sparseCoat;
      } else if (this.tickedCoatExpressed) {
        // Ticked coat
        patImage = tickedCoat;
      }
      // Draw coat overlay
      const w = this.cachedPatternScale;
      const h = this.cachedPatternScale;
      ctx.save();
      // Define clip shape
      ctx.beginPath();
      drawFunction();   // only defines path
      ctx.closePath();
      ctx.clip();
      if (bpc === 0 || bpc === 7) {
        ctx.rotate(Math.PI / 2);
      } else if (bpc === 1 || bpc === 8) {
        ctx.rotate(-Math.PI / 2)
      }
      // Draw the  coat overlay
      if (this.sparseCoatExpressed) {
        ctx.globalCompositeOperation = "destination-atop";
      }
      ctx.drawImage(patImage, -w / 2, -h / 2, w, h);
      if (this.sparseCoatExpressed) {
        // Tint it with desired color + alpha
        if (this.melanismExpressed) ctx.globalAlpha = 0.1;
        ctx.fillStyle = hexToRgba(specialPatternColour, 1);
        ctx.fillRect(-w / 2, -h / 2, w, h);
      }
      ctx.restore();
    }
  }

  // --- DRAW METHODS
  // Function to draw a single leg
  this.drawSingleLeg = function (bpc, startX, startY, endX, endY, legGradient) {
    // PRECALC
    startY += this.outlineThickness * 2;
    endY += this.outlineThickness * 2;
    let dx = endX - startX;
    let dy = endY - startY;
    let legLength = Math.sqrt(dx * dx + dy * dy);
    let legAngle = Math.atan2(dy, dx);
    // Translate
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(legAngle);
    // Cell shading
    ctx.strokeStyle = this.outlineColour;
    ctx.lineWidth = this.outlineThickness * 2;
    // Drawing with gradient
    ctx.fillStyle = legGradient;
    ctx.beginPath();
    ctx.rect(-this.legWidth / 2, -this.legWidth / 2, legLength, this.legWidth);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    // Pattern overlay (needs same transformations as leg drawing)
    this.drawPatternOverlay(bpc, () => {
      ctx.translate(startX, startY);
      ctx.rotate(legAngle);
      ctx.rect(-this.legWidth / 2, -this.legWidth / 2, legLength, this.legWidth);
    });
    this.drawSpecialOverlay(bpc, () => {
      ctx.translate(startX, startY);
      ctx.rotate(legAngle);
      ctx.rect(-this.legWidth / 2, -this.legWidth / 2, legLength, this.legWidth);
    });
    return legAngle;
  };

  this.drawSingleFoot = function (bpc, x, y, rotation, gradient, drawToes, toeColour) {
    ctx.save();
    if (rotation !== 0) {
      ctx.translate(x, y)
      ctx.rotate(rotation);
    }
    ctx.lineWidth = 2 * this.outlineThickness;
    ctx.strokeStyle = this.outlineColour
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.footSize, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    // Pattern overlay for foot
    this.drawPatternOverlay(bpc, () => {
      if (rotation !== 0) {
        ctx.translate(x, y)
        ctx.rotate(rotation);
      }
      ctx.arc(0, 0, this.footSize, 0, 2 * Math.PI);
    });
    this.drawSpecialOverlay(bpc, () => {
      if (rotation !== 0) {
        ctx.translate(x, y)
        ctx.rotate(rotation);
      }
      ctx.arc(0, 0, this.footSize, 0, 2 * Math.PI);
    });
    if (drawToes && !this.onSurface && this.focus && this.facingForwards && this.y > this.focus.y) {
      // jelly beans / toe pads
      ctx.save();
      ctx.translate(x, y + (this.footSize / 2));
      // uniformly scale the pads so that it looks like the feet are reaching towards the focus
      let scaleY = 1;
      if (!this.onSurface && this.focus && this.y - (this.size * 10) < this.focus.y) {
        scaleY = (this.y - this.focus.y) / this.size / 10;
        ctx.scale(1, scaleY);
      }
      ctx.fillStyle = toeColour;
      ctx.strokeStyle = this.outlineColour;
      ctx.lineWidth = this.size / 10;
      ctx.beginPath();
      ctx.arc(0, -(this.footSize), this.footSize / 3.5, 0, 2 * Math.PI); // mid
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-this.footSize / 2, -(this.footSize), this.footSize / 3.5, 0, 2 * Math.PI); // left
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.footSize / 2, -(this.footSize), this.footSize / 3.5, 0, 2 * Math.PI); // right
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, this.footSize / 10, this.footSize / 1.5, 0, 3 * Math.PI); // main
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }

  this.drawTail = function (backendShiftX, backendShiftY) {
    // === TAIL ANIMATION CALCULATIONS ===
    let tailWagMod = 0;
    tailWagMod = this.getAnimationValue(Math.abs(daytimeCounter - this.birthday), 30, false);
    tailWagMod = (tailWagMod - 15) / 15; // Convert 0-30 sine wave to -1 to +1 range
    tailWagMod *= 5; // Scale to ±5 for tail wagging amplitude

    // === CONTEXT TRANSFORMATIONS ===
    ctx.save();
    if (!this.onSurface && this.awake) {
      tailWagMod = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
    }

    // === COLOR SETUP ===
    let tailGradient;
    tailGradient = this.createTailGradient();

    // === DRAW OUTLINE AND FILL ===
    ctx.fillStyle = tailGradient;
    ctx.lineWidth = 2 * this.outlineThickness;
    ctx.strokeStyle = this.outlineColour;
    ctx.beginPath();
    ctx.moveTo(+this.size / 3, (this.size / 3));
    ctx.arc((this.size * tailWagMod * this.tailLength / 8) - (this.size / 32), this.tailLengthY, this.tailThickness, 0, Math.PI, true);
    ctx.lineTo(-this.size / 3, this.size / 3);
    ctx.stroke();
    ctx.fill();

    // === PATTERN OVERLAY ===
    this.drawPatternOverlay(6, () => {
      ctx.moveTo(+this.size / 3, (this.size / 3));
      ctx.arc((this.size * tailWagMod * this.tailLength / 8) - (this.size / 32), this.tailLengthY, this.tailThickness, 0, Math.PI, true);
      ctx.lineTo(-this.size / 3, this.size / 3);
      ctx.fill();
    });
    this.drawSpecialOverlay(6, () => {
      ctx.moveTo(+this.size / 3, (this.size / 3));
      ctx.arc((this.size * tailWagMod * this.tailLength / 8) - (this.size / 32), this.tailLengthY, this.tailThickness, 0, Math.PI, true);
      ctx.lineTo(-this.size / 3, this.size / 3);
      ctx.fill();
    });

    // === ADDITIONAL DETAILS ===
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(butthole, -(this.size / 3), -this.size / 3, this.size / 1.5, this.size / 1.5);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  this.drawBackLegs = function (backendShiftX) {
    // setting leg angle
    // calculate positions
    let startXL = (-this.backLegOriginX) - backendShiftX;
    let startXR = (this.backLegOriginX) - backendShiftX;
    let startY = this.backLegOriginY;
    let endXL = startXL;
    let endXR = startXR;
    let endY = this.backLegLength;

    if (!this.awake) {
      if (this.onTree) {
        startY += ((this.bodyToFeetDistance - (this.footSize * 2) - this.backLegOriginY) * this.treeSleepPosProgress);
        startXL += this.backLegOriginX * this.treeSleepPosProgress * 0.5;
        startXR -= this.backLegOriginX * this.treeSleepPosProgress * 0.5;
      } else {
        startY += (endY - (this.footSize * 2)) * (this.sittingProgress);
      }
    }
    if (this.sittingProgress > 0) {
      startY *= this.sittingProgress;
    }
    let leftLegRotation = Math.PI / 2; // straight down
    let rightLegRotation = Math.PI / 2; // straight down;
    if (!this.onSurface || this.onTree) {
      if (this.beingHeld) {
        leftLegRotation = Math.PI / 2 + Math.PI / 4;
        rightLegRotation = Math.PI / 2 - Math.PI / 4;
      }

      // Apply lerping only during fall
      if (!this.beingHeld && this.speedY > 0 && this.jumpHeight && this.originalAngleToFocus !== null) {
        const currentHeight = trueBottom - this.y;
        const fallProgress = Math.max(0, Math.min(1, (this.jumpHeight - currentHeight) / this.jumpHeight));
        // Fall: lerp to straight down (Math.PI/2)
        leftLegRotation = Math.PI + (Math.PI / 2 - Math.PI) * fallProgress;        // π to π/2 (anticlockwise)
        rightLegRotation = 0 + (Math.PI / 2 - 0) * fallProgress;                   // 0 to π/2 (clockwise)
        startXL += this.backLegOriginX * fallProgress * 0.75;
        startXR -= this.backLegOriginX * fallProgress * 0.75;

      } else if (this.onTree && this.sittingProgress <= 1) {
        // lerp to outstretched when sleeping
        leftLegRotation = (Math.PI / 2) + ((Math.PI / 3) * this.treeSleepPosProgress);
        rightLegRotation = (Math.PI / 2) - ((Math.PI / 3) * this.treeSleepPosProgress);
      }

      // Update end positions based on rotation
      endXL = startXL + this.backLegLength * Math.cos(leftLegRotation);
      endY = startY + this.backLegLength * Math.sin(leftLegRotation);
      endXR = startXR + this.backLegLength * Math.cos(rightLegRotation);
      // Right leg endY should be same as left since they both extend from same hip level
    }

    let leftBackLegGradient = this.createLegGradient(7, startXL, this.backLegOriginY, 0, this.backLegLength);
    let leftFrontLegGradient = this.createLegGradient(8, startXL, this.backLegOriginY, 0, this.backLegLength);
    let leftFootGradient = this.createFootGradient(7, this.footSize);
    let rightFootGradient = this.createFootGradient(8, this.footSize);

    // left
    this.drawSingleLeg(7, startXL, startY, endXL, endY, leftBackLegGradient);
    this.drawSingleFoot(7, endXL, endY, leftLegRotation, leftFootGradient);
    // // right  
    this.drawSingleLeg(8, startXR, startY, endXR, endY, leftFrontLegGradient);
    this.drawSingleFoot(8, endXR, endY, rightLegRotation, rightFootGradient);
  };

  this.drawBody = function (backendShiftX, backendShiftY) {
    // Calculate common values
    let buttWiggle = 0;
    if (!this.beingHeld && this.awake) {
      buttWiggle = this.getAnimationValue(Math.abs(daytimeCounter - this.birthday), 15, false, true);
      buttWiggle = (buttWiggle - 7.5) / 7.5; // Convert 0-15 sine wave to -1 to +1
      buttWiggle *= (this.size / 2); // Scale to ±this.size/2 for smooth left/right wiggle  
    }
    let bodyRadius = this.size + this.thicknessModS;
    let sittingOffset = this.sittingProgress || 0;
    // Create body gradient
    let bodyGradient = this.createBodyGradient(5, bodyRadius);
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = this.outlineColour;
    ctx.lineWidth = 2 * this.outlineThickness;
    if (!this.awake) return; // Skip drawing if asleep
    const drawBodyOutline = (x, y) => {
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    // Helper function to draw a body segment with pattern and special effects
    const drawBodySegment = (x, y, drawGradient = false) => {
      // Apply pattern overlay
      this.drawPatternOverlay(5, () => {
        ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
      });
      // Apply special pattern effects for certain patterns
      // in this case it is related to the not-patterned parts of chittens' markings
      if (drawGradient && (this.pattern == 3 || this.pattern == 6 || this.tickedCoatExpressed)) {
        let fadeGrad = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
        ctx.globalAlpha = 0.5;
        fadeGrad.addColorStop(0.25, hexToRgba(this.getBodyPartColour('firstColour'), 1));
        fadeGrad.addColorStop(0.6, hexToRgba(this.getBodyPartColour('firstColour'), 0));
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // draw special coat over the sepcial pattern
      this.drawSpecialOverlay(5, () => {
        ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
      });
    };

    if (sittingOffset > 0) {
      // Sitting position - draw butt and belly segments
      drawBodyOutline(buttWiggle, -this.size + sittingOffset);
      drawBodyOutline(-backendShiftX / 4, -this.size - (backendShiftY / 4) + sittingOffset);
      drawBodySegment(buttWiggle, -this.size + sittingOffset, false);
      drawBodySegment(-backendShiftX / 4, -this.size - (backendShiftY / 4) + sittingOffset, true);
    } else {
      // Standing position - draw butt and belly segments
      drawBodyOutline(-backendShiftX, -backendShiftY);
      drawBodyOutline(-backendShiftX / 4, -backendShiftY / 4);
      drawBodySegment(-backendShiftX, -backendShiftY, false);
      drawBodySegment(-backendShiftX / 4, -backendShiftY / 4, true);
    }
  };

  this.drawChest = function () {
    let offsetY = (this.size * 0.5 * (1 - this.sittingProgress));
    // Chest
    ctx.globalAlpha = 1;
    // REAL DRAWING
    let chestGradient = this.createBodyGradient(12, this.size + this.thicknessModL);
    ctx.fillStyle = chestGradient;
    ctx.strokeStyle = this.outlineColour;
    ctx.lineWidth = 2 * this.outlineThickness;
    ctx.save();
    // ctx.globalCompositeOperation = "destination-over";
    ctx.beginPath();
    ctx.arc(0, offsetY, (this.size + this.thicknessModL), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    // chest coloured piece using bodypart gradient helper
    let chestColour;
    if (this.hairlessExpressed) {
      chestColour = this.getBodyPartColour(12);
    } else if (!this.albinoExpressed && !this.hairlessExpressed) {
      chestColour = this.applyBodypartGradient(12, chestGradient);
    } else {
      chestColour = chestGradient; // Default for albino
    }
    ctx.fillStyle = chestColour;
    ctx.beginPath();
    ctx.arc(0, offsetY, (this.size + this.thicknessModL), 0, 2 * Math.PI);
    ctx.fill();
    // draw pattern now
    this.drawPatternOverlay(12, () => {
      ctx.arc(0, offsetY, (this.size + this.thicknessModL), 0, 2 * Math.PI);
    });
    // additional gradient on top for tabby, bengal, mau patterns
    if (this.pattern == 3 || this.pattern == 6 || this.tickedCoatExpressed7) {
      let chestGradient = ctx.createRadialGradient(0, (this.size + (this.thickness * this.size)), 0, 0, 0, (this.size * 2));
      ctx.globalAlpha = 1;
      chestGradient.addColorStop(0.2, hexToRgba(this.getBodyPartColour('firstColour'), 1));
      chestGradient.addColorStop(0.7, hexToRgba(this.getBodyPartColour('firstColour'), 0));
      ctx.fillStyle = chestGradient;
      ctx.beginPath();
      ctx.arc(0, offsetY, (this.size + this.thicknessModL), 0, 2 * Math.PI);
    }
    // draw special coat over the special pattern
    this.drawSpecialOverlay(12, () => {
      ctx.arc(0, offsetY, (this.size + this.thicknessModL), 0, 2 * Math.PI);
    });
    ctx.rotate(this.rotation);
  };

  this.drawHead = function () {
    // ears
    ctx.globalAlpha = 1;
    ctx.save(); // 0
    ctx.translate(-this.size, -this.size / 2);
    oneq = this.size / 2;
    let leftEarGradient = this.createEarGradient(3);
    let rightEarGradient = this.createEarGradient(4);
    ctx.fillStyle = leftEarGradient;
    ctx.strokeStyle = this.outlineColour;
    ctx.lineWidth = this.outlineThickness;
    // stroke and fill left ear
    ctx.beginPath();
    ctx.moveTo(0, +this.size / 2);
    ctx.lineTo(-(this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
    ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.stroke();
    ctx.fill();
    // stroke and fill right ear
    ctx.fillStyle = rightEarGradient;
    ctx.beginPath();
    ctx.moveTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
    ctx.lineTo(oneq * 4, +this.size / 2);
    ctx.stroke();
    ctx.fill();
    // Apply pattern overlay to left ear
    this.drawPatternOverlay(3, () => {
      ctx.moveTo(0, +this.size / 2);
      ctx.lineTo(-(this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
      ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
    });
    this.drawSpecialOverlay(3, () => {
      ctx.moveTo(0, +this.size / 2);
      ctx.lineTo(-(this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
      ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
    });
    // Apply pattern overlay to right ear
    this.drawPatternOverlay(4, () => {
      ctx.moveTo(oneq * 2, -(this.size * this.earWidth) / 4);
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
      ctx.lineTo(oneq * 4, +this.size / 2);
    });
    this.drawSpecialOverlay(4, () => {
      ctx.moveTo(oneq * 2, -(this.size * this.earWidth) / 4);
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -this.thicknessModS - this.earHeight * (this.size));
      ctx.lineTo(oneq * 4, +this.size / 2);
    });
    // skin inside the ear
    if (this.facingForwards && this.awake) {
      ctx.fillStyle = this.noseColour;
      ctx.lineWidth = this.size / 10;
      ctx.beginPath();
      ctx.moveTo(0, +(this.size / 2) + (this.earWidth * this.size / 2));
      ctx.lineTo(-(this.earWidth * this.size * 0.5), -(this.thickness * this.size / 4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq * 2, (this.earHeight * this.size * 0.25));
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(oneq * 2, (this.earHeight * this.size * 0.25));
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size * 0.5), -(this.thickness * this.size / 4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq * 4, +(this.size / 2) + (this.earWidth * this.size / 2));
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore(); // 0

    // head
    if (this.sittingProgress > 0) {
      ctx.translate(0, ((this.frontLegLength + (this.size / 4)) / 2) * this.sittingProgress);
    }
    let headGradient = this.createHeadGradient((this.size * 2) + this.thicknessModL);
    if (this.sittingProgress > 0) {
      ctx.translate(0, -((this.frontLegLength + (this.size / 4)) / 2) * this.sittingProgress);
    }
    // awake mode
    ctx.save();
    ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
    // REAL DRAWING
    ctx.fillStyle = headGradient;
    ctx.lineWidth = 2 * this.outlineThickness;
    ctx.strokeStyle = this.outlineColour;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    this.drawPatternOverlay(2, () => {
      ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
    });
    // additional gradient on top for tabby, bengal, mau patterns
    if (this.facingForwards && (this.pattern == 3 || this.pattern == 6 || this.tickedCoatExpressed)) {
      let faceGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 2);
      ctx.globalAlpha = 1;
      faceGradient.addColorStop(0.2, hexToRgba(this.getBodyPartColour('firstColour'), 1));
      faceGradient.addColorStop(0.3, hexToRgba(this.getBodyPartColour('firstColour'), 0));
      ctx.fillStyle = faceGradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
      ctx.fill();
    }
    // draw ticked coat
    if (this.tickedCoatExpressed) {
      this.drawSpecialOverlay(2, () => {
        ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
      });
    }
    // colourpoint genetic mutation face gradient
    if (this.facingForwards && this.colourpointExpressed) {
      let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2 * this.patternAlpha, 0, 0, this.size * this.patternAlpha);
      faceGradient.addColorStop(0, hexToRgba(this.getBodyPartColour('colourpoint'), 1));
      faceGradient.addColorStop(1, hexToRgba(this.getBodyPartColour('colourpoint'), 0));
      ctx.fillStyle = faceGradient;
      ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (this.sparseCoatExpressed) {
      this.drawSpecialOverlay(2, () => {
        ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
      });
    }
    // draw bald face above the last coat colour
    if (this.facingForwards && this.baldFacedExpressed) {
      let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2, 0, 0, this.size);
      ctx.globalAlpha = 1;
      faceGradient.addColorStop(0, hexToRgba(this.getBodyPartColour('baldFaced'), 1));
      faceGradient.addColorStop(1, hexToRgba(this.getBodyPartColour('baldFaced'), 0));
      ctx.fillStyle = faceGradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + this.thicknessModL, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();

    if (this.facingForwards && this.inCatBox == null && this !== experiment) {
      // smile
      if (this.health >= maxHealth / 2 && this.age < (this.maxAge - oldAgeFor) && this.energy > sleepAt) {
        ctx.globalAlpha = this.love / maxLove;
        if (this.sex == 'Female') {
          ctx.drawImage(smile, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
        } else if (this.sex == 'Male') {
          ctx.drawImage(smile2, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
        } else if (this.sex == 'Non Binary') {
          ctx.drawImage(smile3, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
        }
      }
    }

    this.drawEyes();

    // chin
    if (this.facingForwards) {
      // drawing chin / lower jaw
      let chinSize = (this.size / 3.5);
      let chinPosX = 0;
      let chinPosY = (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5;
      if (this.brachycephalicExpressed) {
        chinPosY += this.size / 15;
      }
      // for opening and closing: mouth
      let mouthInnerSize = chinSize / 1.5;
      // this controls how open/closed the mouth is
      // 0.75 is the bare minimum for drawing
      let offsetY = this.openMouthProgress * (0.75 + (2 * this.mawSize * chinSize));
      ctx.lineWidth = this.outlineThickness * 2;
      // setting up colours:
      ctx.fillStyle = this.getBodyPartColour(11);
      // drawing chin
      ctx.beginPath();
      ctx.arc(chinPosX, chinPosY + offsetY, chinSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the pattern if we have a sparse coat
      if (this.sparseCoatExpressed) {
        this.drawSpecialOverlay(11, () => {
          ctx.arc(chinPosX, chinPosY + offsetY, chinSize, 0, 2 * Math.PI);
        });
      }

      // drawing inside of mouth
      // // cellshading
      ctx.fillStyle = this.outlineColour;
      ctx.beginPath();
      ctx.rect(chinPosX - mouthInnerSize - this.outlineThickness, chinPosY - chinSize, (mouthInnerSize * 2) + this.outlineThickness, offsetY + mouthInnerSize);
      ctx.arc(0, chinPosY - chinSize + offsetY + mouthInnerSize, mouthInnerSize + this.outlineThickness, 0, Math.PI, false)      // semi circle
      ctx.fill();

      // fill inside of mouth
      ctx.fillStyle = skinPink; // it's always pink
      ctx.beginPath();
      ctx.rect(chinPosX - mouthInnerSize, chinPosY - chinSize, mouthInnerSize * 2, offsetY + mouthInnerSize);
      ctx.arc(0, chinPosY - chinSize + offsetY + mouthInnerSize, mouthInnerSize, 0, Math.PI, false)      // semi circle
      ctx.fill();

      // fangs
      // cellshading
      ctx.strokeStyle = this.outlineColour;
      ctx.lineWidth = this.size / 10;
      // real drawing
      ctx.fillStyle = trueWhite;
      ctx.beginPath();
      ctx.moveTo(-this.size / 5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.lineTo(-this.size / 4, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45) + (this.size * (this.fangs) / 2));
      ctx.lineTo(-this.size / 2.5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.moveTo(+this.size / 5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.lineTo(+this.size / 4, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45) + (this.size * (this.fangs) / 2));
      ctx.lineTo(+this.size / 2.5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.stroke();
      ctx.fill();

      this.drawJowls();

      // === T-SHAPED NOSE (uses nose-specific colors, not skin colors) ===
      let noseY = (this.size * (this.nosePos - 0.5) / 2) + (this.size / 2.5);
      let noseWidth = this.size / 1.75;
      let noseHeight = this.size / 4;
      let noseVertWidth = this.size / 6;
      let noseVertHeight = this.size / 2.5;

      // Draw T-shaped nose outline (cellshading)
      ctx.lineWidth = this.outlineThickness;
      ctx.strokeStyle = this.outlineColour;
      // Draw T-shaped nose fill using nose-specific color
      ctx.fillStyle = this.noseColour;
      ctx.beginPath();
      // Top horizontal bar of T
      ctx.rect(-noseWidth / 2, noseY - noseHeight, noseWidth, noseHeight);
      // Vertical bar of T
      ctx.rect(-noseVertWidth / 2, noseY - noseHeight, noseVertWidth, noseVertHeight);
      ctx.stroke();
      ctx.fill();
    }
  };

  this.drawEyes = function () {
    // set up colours
    let pupilColour = this.calculateBodyPartColour('pupil');
    let leftIrisColour = this.calculateBodyPartColour('leftEye');
    let rightIrisColour = leftIrisColour;
    if (this.heterochromicExpressed) {
      rightIrisColour = this.calculateBodyPartColour('rightEye');
    }

    ctx.globalAlpha = 1;
    // eyes - blink timer
    if (this.facingForwards) {
      let temp = daytimeCounter;
      while (temp > 100) {
        temp -= 100;
      }
      let temp2 = this.birthday;
      while (temp2 > 100) {
        temp2 -= 100;
      }
      if (!this.awake || (temp > temp2 - 1.5 && temp < temp2 + 1.5)) {
        ctx.save();
        ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
        ctx.drawImage(eyesClosed, -this.size, -this.size, this.size * 2, this.size * 2);
        ctx.restore();
      } else {
        diffy = 0.5;
        ctx.save(); // 0 open
        let glowingeyes = false;
        let glowalpha = 0;
        // Eyes glow when firefly is nearby (including cats in adoption boxes)
        if (this.closestFirefly) {
          let diffx = Math.abs(this.x - this.closestFirefly.x);
          let diffy = Math.abs(this.y - this.closestFirefly.y);
          if (diffx <= 100 && diffy <= 100) {
            glowingeyes = true;
            let absolute = Math.sqrt((diffy * diffy) + (diffx * diffx)); // 0 to 100
            glowalpha = 0.6 * (1 - (absolute / (Math.sqrt(20000))));
          }
        }
        ctx.fillStyle = pupilColour;
        // REAL DRAWING
        // left eye
        ctx.beginPath();
        ctx.strokeStyle = this.outlineColour;
        ctx.lineWidth = this.size / 4;
        ctx.translate(-(this.size * this.eyePosX * 0.3) - this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
        ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (glowingeyes) {
          ctx.globalAlpha = 1 - glowalpha;
        }
        // iris
        ctx.lineWidth = this.size / 7;
        ctx.strokeStyle = leftIrisColour;
        ctx.beginPath();
        ctx.arc(0, 0, (this.size / 2.25) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
        ctx.stroke();
        // draw highlights
        ctx.beginPath();
        ctx.fillStyle = trueWhite;
        ctx.rotate(-this.rotation);
        ctx.arc(0, -this.size / 7, this.size / 6, 0, 2 * Math.PI);
        ctx.arc(-this.size / 7, this.size / 5, this.size / 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate(this.rotation);
        // glowing at night
        if (glowingeyes && this.closestFirefly) {
          let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * this.eyeSize);
          glow.addColorStop(0, hexToRgba(this.closestFirefly.firstColour, 1));
          glow.addColorStop(1, hexToRgba(this.closestFirefly.firstColour, 0));
          ctx.globalAlpha = glowalpha / 2;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * this.eyeSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = trueWhite;
          ctx.globalAlpha = glowalpha / 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 0.6 * ((this.size / 2) + (this.eyeSize * this.size / 6)), 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.restore(); // 0 closed
        // right eye
        ctx.fillStyle = pupilColour;
        ctx.beginPath();
        ctx.strokeStyle = this.outlineColour;
        ctx.lineWidth = this.size / 4;
        ctx.save(); // 0 open
        ctx.translate((this.size * this.eyePosX * 0.3) + this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
        ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        // iris
        if (glowingeyes) {
          ctx.globalAlpha = (1 - glowalpha);
        }
        ctx.lineWidth = this.size / 7;
        ctx.strokeStyle = rightIrisColour;
        ctx.beginPath();
        ctx.arc(0, 0, (this.size / 2.25) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
        ctx.stroke();

        // draw highlights
        ctx.beginPath();
        ctx.fillStyle = trueWhite;
        ctx.rotate(-this.rotation);
        ctx.arc(0, -this.size / 7, this.size / 6, 0, 2 * Math.PI);
        ctx.arc(this.size / 6, this.size / 5, this.size / 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate(this.rotation);

        // glowing at night
        if (glowingeyes && this.closestFirefly) {
          let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
          glow.addColorStop(0, hexToRgba(this.closestFirefly.firstColour, 1));
          glow.addColorStop(1, hexToRgba(this.closestFirefly.firstColour, 0));
          ctx.globalAlpha = glowalpha / 4;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = trueWhite;
          ctx.globalAlpha = glowalpha / 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 0.6 * ((this.size / 2) + (this.eyeSize * this.size / 6)), 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.restore(); // 0 closed
      }
    }
  }

  this.drawJowls = function () {
    // jowls
    ctx.strokeStyle = this.outlineColour;
    ctx.lineWidth = this.outlineThickness * 2;
    ctx.fillStyle = this.getBodyPartColour(9);
    if (this.brachycephalicExpressed) {
      //left
      ctx.beginPath();
      ctx.ellipse(-this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, Math.PI / 4, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the coat pattern if it has the spotted pattern type
      if (this.pattern == 2) {
        this.drawPatternOverlay(2, () => {
          ctx.ellipse(-this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, Math.PI / 4, 0, 2 * Math.PI);
        });
      }
      // draw the special pattern if we have a sparse coat
      if (this.sparseCoatExpressed && !this.baldFacedExpressed) {
        this.drawSpecialOverlay(9, () => {
          ctx.ellipse(-this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, Math.PI / 4, 0, 2 * Math.PI);
        });
      }

      ctx.fillStyle = this.getBodyPartColour(10);
      // right
      ctx.beginPath();
      ctx.ellipse(this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, -Math.PI / 4, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the coat pattern if it has the spotted pattern type
      if (this.pattern == 2) {
        this.drawPatternOverlay(2, () => {
          ctx.ellipse(this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, -Math.PI / 4, 0, 2 * Math.PI);
        });
      }
      // draw the special pattern if we have a sparse coat
      if (this.sparseCoatExpressed && !this.baldFacedExpressed) {
        this.drawSpecialOverlay(9, () => {
          ctx.ellipse(this.size / 3.5, (this.size * (this.nosePos - 0.5) / 2) + this.size / 2, this.size / 3.5, this.size / 2.5, -Math.PI / 4, 0, 2 * Math.PI);
        });
      }
    } else {
      // left
      ctx.beginPath();
      ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the coat pattern if it has the spotted pattern type
      if (this.pattern == 2) {
        this.drawPatternOverlay(2, () => {
          ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        });
      }
      // draw the special pattern if we have a sparse coat
      if (this.sparseCoatExpressed && !this.baldFacedExpressed) {
        this.drawSpecialOverlay(9, () => {
          ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        });
      }
      // right
      ctx.fillStyle = this.getBodyPartColour(10);
      ctx.beginPath();
      ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the coat pattern if it has the spotted pattern type
      if (this.pattern == 2) {
        this.drawPatternOverlay(2, () => {
          ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        });
      }
      // draw the special pattern if we have a sparse coat
      if (this.sparseCoatExpressed && !this.baldFacedExpressed) {
        this.drawSpecialOverlay(10, () => {
          ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        });
      }
    }
  }

  // front legs
  this.drawFrontLegs = function () {
    // setup feet
    let leftHandGradient = this.createFootGradient(0, this.footSize);
    let rightHandGradient = this.createFootGradient(1, this.footSize);
    let drawToes = false;
    // draw
    ctx.globalAlpha = 1;
    let endX1 = -this.frontLegOriginX;
    let endX2 = this.frontFootOriginX;
    let startY = this.frontLegOriginY;
    let endY = this.frontLegLength - this.footSize;
    // if we are sitting on a surface
    if (!this.inCatBox && this.onSurface && this.sittingProgress <= 1) {
      // let your legs hang down if you're chilling on a tree high enough to let them hang
      if (this.onTree && this.y < trueBottom - this.size - this.bodyToFeetDistance - this.footSize) {
        endY += (endY - this.footSize) * this.treeSleepPosProgress * this.legLength;
      } else {
        // otherwise, just shrink the legs down so they don't clip into the floor
        startY += ((endY * 0.75) - this.footSize) * (this.sittingProgress);
      }
    } else if (!this.onSurface) {
      // if we are holding something
      if (this.focus && this.hitFocus) {
        endX1 = this.focus.x - this.x; // target
        endX2 = endX1;
        endY = this.focus.y - this.y;
      } else {
        // if we are reaching for something
        endX1 += this.frontLegLength * Math.cos(this.angleToFocus);
        endX2 += this.frontLegLength * Math.cos(this.angleToFocus);
        endY *= Math.sin(this.angleToFocus);
      }
    }
    // Set up gradients
    let leftFrontLegGradient = this.createLegGradient(0, -this.frontLegOriginX, startY, endX1, endY);
    let rightFrontLegGradient = this.createLegGradient(1, this.frontLegOriginX, startY, endX2, endY);

    // Draw both legs using unified function
    let leftAngle = this.drawSingleLeg(0, -this.frontLegOriginX, startY, endX1, endY, leftFrontLegGradient);
    let rightAngle = this.drawSingleLeg(1, this.frontLegOriginX, startY, endX2, endY, rightFrontLegGradient);
    if (!this.facingForwards) {
      // if we are facing backwards draw the feet now..
      this.drawSingleFoot(0, endX1, endY, leftAngle, leftHandGradient, false, null);
      this.drawSingleFoot(1, endX2, endY, rightAngle, rightHandGradient, false, null);
    } else {
      // return the front feet data to draw later
      return [endX1, endX2, endY, leftHandGradient, rightHandGradient, this.leftToeColour, this.rightToeColour, leftAngle, rightAngle];
    }
  };

  this.drawIcons = function () {
    ctx.save(); // 0
    // // debug icon/label
    // ctx.fillStyle = trueWhite;
    // ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;    
    // // ctx.globalAlpha = 1;
    // ctx.fillText(this.snuggling, 0, this.size - this.bodyToFeetDistance - 30);

    // zzzzs
    if (!this.awake) {
      ctx.fillStyle = energyBlue;
      ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;
      let amntToMove = (this.energy % 10);
      ctx.globalAlpha = (1 - (amntToMove / 10)) / 1.5;
      amntToMove *= 2;
      ctx.fillText('z', -6, -this.bodyToFeetDistance - amntToMove + this.size + this.thicknessModL);
      ctx.font = '7px ${UI_THEME.fonts.primary}';
      ctx.fillText('z', 0, - 7 - this.bodyToFeetDistance - amntToMove + this.size + this.thicknessModL);
      ctx.font = '3px ${UI_THEME.fonts.primary}';
      ctx.fillText('z', 6, - 14 - this.bodyToFeetDistance - amntToMove + this.size + this.thicknessModL);
    }

    // hearts for snuggling
    if (this.snuggling > 0) {
      ctx.fillStyle = heartsPink;
      ctx.font = `${UI_THEME.fonts.sizes.large}px ${UI_THEME.fonts.primary}`;
      let amntToMove;
      if (!geneEditing) {
        amntToMove = this.getAnimationValue(this.snuggling, 40, false);
      } else {
        amntToMove = this.getAnimationValue(0, 40, false);
      }
      ctx.globalAlpha = (1 - (amntToMove / 40)) / 2;
      let textXOffset = (ctx.measureText(unicodeHeart).width) / 2;
      ctx.fillText(unicodeHeart, -textXOffset, -(this.size * 4) + amntToMove);
    }

    // eating nom nom noms
    if (this.isEating()) {
      ctx.fillStyle = trueWhite;
      ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;
      if (this.age >= maturesAt) {
        let text = '*nom*';
        let textXOffset = (ctx.measureText(text).width) / 2;
        ctx.save();
        if (this.eatingChewsRemaining === 1 || this.eatingChewsRemaining == 3) {
          ctx.rotate(0.5);
          ctx.fillText(text, -textXOffset, -this.size * 1.5);
        } else {
          ctx.rotate(-0.5);
          ctx.fillText(text, -textXOffset, -this.size * 1.5);
        }
        ctx.restore();
      } else {
        let text = '*suckle*'
        let textXOffset = (ctx.measureText(text).width) / 2;
        ctx.fillStyle = trueWhite;
        ctx.fillText(text, -textXOffset, -this.size * 2.5);
      }
    }
    ctx.restore(); // 0
  };

  this.update = function () {
    //check if we are in a catbox (awaiting adoption or being picked from a litter)
    if (this.inCatBox) {
      this.awake = true; // Ensure catbox chittens stay awake for adoption display
    } else {
      // age, grow, lose meters
      this.lifeTick();
      if (this.birthday == daytimeCounter) {
        this.age++;
        // maturing to adult
        if (this.age == maturesAt) {
          sendMessage(this.name + ' reached adulthood');
          let glyphsSpawned = createGlyphs(this.x, this.y, unicodeHeart, 1)
          for (let i = 1; i <= glyphsSpawned; i++) {
            glyphs[glyphs.length - i].timer *= 1 + (Math.random() * 1);
          }
          if (this.energy < maxEnergy / 2) {
            this.energy += maxEnergy / 2;
          } else {
            (this.energy = maxEnergy);
          }
          this.love += maxLove / 2;
          // reaching old age
        } else if (this.age == (this.maxAge - oldAgeFor)) {
          sendMessage(this.name + ' reached old age');
          createGlyphs(this.x, this.y, unicodeAsterix, 1);
        }
      } else {
        // now check if we are dead
        if (this.snuggling == -1 && !this.isEating() && this.age > this.maxAge && Math.random() * ticksPerDay) {
          // dying of old age
          this.flaggedForDeath = true;
          sendMessage(this.name + ' died of old age');
          // dying because of low health
        } else if (this.health <= dieAt) {
          this.flaggedForDeath = true;
          sendMessage(this.name + ' died');
        }
      }
    }

    // Manage jump animation state in update (once per frame)
    if (!this.onSurface) {
      // Store original angle and jump height when we start falling
      if (this.speedY <= 0) {
        // Going up or at peak - store data for fall animation
        if (this.focus) {
          this.originalAngleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
        } else {
          this.originalAngleToFocus = Math.PI / 2;
        }
        this.jumpHeight = null; // Will be set when we start falling
      } else {
        // Coming down - store jump height at start of fall
        if (!this.jumpHeight) {
          this.jumpHeight = trueBottom - this.y; // How high we are when we start falling
        }
      }
    } else {
      // Reset animation state when landing
      this.originalAngleToFocus = null;
      this.jumpHeight = null;
    }

    if (!this.focus) {
      diffx = 0;
      diffy = 0;
    }

    if (this.inCatBox == null) {
      // continue eating no matter what
      if (this.inCatBox == null && this.isEating()) {
        this.continueEating();
      }

      // Dragging with mouse
      if (this.beingHeld) {
        this.facingForwards = true;
        this.x = pointerPos.x;
        this.y = pointerPos.y;
        this.speedX = 0;
        this.speedY = 0;
        this.resetRotation();
        this.onSurface = false;
        return;
      }
    }
    // --- COLLISION CHECKS
    // Only check collisions if this chitten is awake (further optimization)
    if (!this.awake) {
      // Sleeping chittens still need tree collision checks to follow growing/withering trees, but do nothing else
      this.physicsCheck();
      return;
    }
    // reset hitstate
    this.hitFocus = false;
    let thisIndex = chittens.indexOf(this, chittens);
    // chitten to chitten collision checking
    for (let j = thisIndex + 1; j < chittens.length; j++) {
      // Early exit optimizations for performance
      if (!chittens[j].awake || chittens[j].inCatBox !== null) continue;

      // Fast distance check before expensive collision detection
      let dx = this.x - chittens[j].x;
      let dy = this.y - chittens[j].y;
      let maxDistance = (this.size + chittens[j].size) * 1.5; // Buffer for collision
      if (dx * dx + dy * dy > maxDistance * maxDistance) continue;

      // if two chittens bump into each other (only check each pair once)
      // ignore sleeping chittens, and let chittens jump out of each other's way
      if (
        ((!this.onSurface && chittens[j].awake) || !chittens[j].onSurface) && !(this.speedY < 0 && chittens[j].onSurface)
        && detectChittenCollision(this, chittens[j])) {
        collide(this, chittens[j], !this.onSurface, !chittens[j].onSurface && chittens[j].awake, true);

        // having a snuggle
        if (!choosingChitten
          && !this.beingHeld && !chittens[j].beingHeld
          && ((this.sex == 'Male' && chittens[j].sex == 'Female') || (this.sex == 'Female' && chittens[j].sex == 'Male'))
          && !this.isEating() && chittens[j].eatingChewsRemaining == 0
          && this.snuggling == -1 && chittens[j].snuggling == -1
          && this.partner == chittens[j] && chittens[j].partner == this
          && this.age < (this.maxAge - oldAgeFor) && chittens[j].age < (chittens[j].maxAge - oldAgeFor)
          && this.health >= breedingHealthReq && chittens[j].health >= breedingHealthReq
          && this.energy >= breedingEnergyReq && chittens[j].energy >= breedingEnergyReq
          && this.love >= breedingLoveReq && chittens[j].love >= breedingLoveReq) {
          // snuggle starts
          // pay the costs
          this.health -= maxHealth * 0.2;
          chittens[j].health -= maxHealth * 0.2;
          this.energy -= maxEnergy * 0.35;
          chittens[j].energy -= maxEnergy * 0.35;
          this.love -= maxLove / 2;
          chittens[j].love -= maxLove / 2;
          this.speedX = 0;
          chittens[j].speedX = 0;
          this.speedY = 0;
          chittens[j].speedY = 0;
          // Start sitting down animation for both chittens
          this.targetSittingState = true;
          chittens[j].targetSittingState = true;
          if (Math.random() < 1 / 3) {
            speak(this, happyWord());
          } else if (Math.random() < 2 / 3) {
            speak(chittens[j], happyWord());
          }
          this.facingForwards = true;
          chittens[j].facingForwards = true;
          // Both cats should sit while snuggling
          this.targetSittingState = true;
          chittens[j].targetSittingState = true;
          this.snuggling = snuggleTimerMale;
          chittens[j].snuggling = snuggleTimerFemale;
          sendMessage(chittens[j].name + ' and ' + this.name + ' had a snuggle');
        }
      }
    }

    // Collision with fruit
    if (this.focus && this.awake && !this.isEating() && this.snuggling == -1 && fruits.includes(this.focus) && !this.focus.flaggedForRemoval) {
      if (detectFruitCollision(this, this.focus)) {
        let fruit = this.focus;
        this.hitFocus = true;
        // Check if fruit is already claimed
        if (fruit.eater) {
          // Find a new target since this fruit is taken
          this.focus = null;
          return;
        }
        let taskDifficulty = 0.2;
        let failureRate = (1 - (this.coordination * chittenBaseCoordination)) * taskDifficulty;
        if (Math.random() < failureRate) {
          fruit.fumbleFruit(this.speedX, this.speedY);
        } else {
          // Atomically claim the fruit
          fruit.eater = this;
          fruit.rotTimer = -1;
          // Set chitten eating state
          this.facingForwards = true;
          this.speedX = 0;
          this.speedY = 0;
          this.preparingToEat = true;
          this.targetSittingState = true;
          // Decrement parent fruit count
          if (fruit.parent && !fruit.fumbled) {
            fruit.parent.fruitCount--;
          }
        }
      }
    }

    // Collision with fireflies
    if (!this.onSurface && this.focus && this.awake && !this.isEating() && this.snuggling == -1 && fireflies.includes(this.focus)) {
      if (this.y < trueBottom - this.bodyToFeetDistance && detectCollision(this, this.focus)) {
        this.hitFocus = true;
        this.focus.touchedThisFrame = true;
        this.focus.speedX += (this.speedX * this.mass) / 1500;
        this.focus.speedY += (this.speedY * this.mass) / 2000;// + (0.002 * this.size);
        this.facingForwards = true;
        this.speedX = 0;
        this.speedY = - gravity * this.mass;
        gainMeter(this);
        // let go of the FireFly if we are fully charged
        if (this.health >= maxHealth && this.love >= maxLove && this.energy >= maxEnergy) {
          this.speedY = -this.mass * 2;
        } else {
          let targetangle = Math.atan2(this.focus.x - this.y, this.focus.y - this.x);
          this.speedX += Math.cos(targetangle);
          this.speedY += Math.sin(targetangle);
        }
      }
    }

    // Kitten nursing from mother
    if (this.age < maturesAt && this.inCatBox == null && this.awake
      && this.mother !== null && this.onSurface && this.mother.snuggling == -1 && detectChittenCollision(this, this.mother)) {
      this.speedX = 0;
      this.speedY = 0;
      if (this.mother.awake && this.eatingChewsRemaining == 0 && this.health < 50) {
        this.mother.resetJumpCooldown();
        this.mother.energy -= 5;
        this.mother.love += 5;
        this.mother.speedX = 0;
        this.mother.speedY = 0;
        this.mother.targetSittingState = true;
        this.eatingChewsRemaining = eatingTotalChews; // Start suckling
        this.eatingChewTimer = 0;
        this.eatingChewState = 'closed'; // Start with mouth closed
        this.mother.facingForwards = true;
        gainMeter(this);
        // sendMessage(this.mother.name + ' fed '+ this.name);
      }
    }

    // --- APPLY Y SPEED
    if (!this.onSurface) {
      // Standard gravity with subtle size-based effects
      let mass = gravity * this.mass;
      // Apply drag proportional to velocity and size
      let dragX = this.speedX * dragFactor * (this.size / 15);
      let dragY = this.speedY * dragFactor * (this.size / 15);

      // Subtract drag in the direction of motion
      this.speedX -= dragX;
      this.speedY -= dragY;

      // Gravity/mass force only applies vertically
      this.speedY += mass;

      // apply y speed
      this.y += this.speedY / 4;
    } else {
      // Apply ground friction
      this.speedX *= groundFriction;
    }
    // --- APPLY X SPEED
    this.x += this.speedX / 4;
    this.rotation += this.spin;
    this.spin *= 0.9;
    // resetting full rotations
    while (this.rotation > 6) {
      this.rotation -= 6;
    }
    while (this.rotation < -6) {
      this.rotation += 6;
    }

    // adjusting speed in the air if we are going in the wrong direction
    if (!this.onSurface && (diffx > 0 && this.speedX < 0) || (diffx < 0 && this.speedX > 0)) {
      let correctionFactor = chittenBaseCoordination * (0.95 + (this.coordination * 0.05));
      this.speedX *= correctionFactor;
    }
    if (this.inCatBox && !this.onSurface) {
      this.inCatBox.checkBounce(this);
    }
    if (!this.inCatBox) {
      this.physicsCheck();
    }
    applySpeedLimit(this);
    // clamp rotation of the head to 135 degrees either side
    if (this.rotation > 3 * Math.PI / 4) this.rotation = 3 * Math.PI / 4;
    if (this.rotation < -3 * Math.PI / 4) this.rotation = -3 * Math.PI / 4;

    // update which firefly is the closest for drawing eye glow
    let closestFireflyIndex = this.findClosestFireFly();
    if (closestFireflyIndex !== 'X' && closestFireflyIndex < fireflies.length) {
      this.closestFirefly = fireflies[closestFireflyIndex];
    } else {
      this.closestFirefly = null;
    }
  };
  this.render = function () {
    /* focus lines for debug*/
    // if (this.focus !== null) {
    //   ctx.strokeStyle = trueWhite;
    //   ctx.lineWidth = 1;
    //   ctx.beginPath();
    //   ctx.moveTo(this.x, this.y);
    //   ctx.lineTo(this.focus.x, this.focus.y);
    //   ctx.stroke();
    // }

    // if the chitten didn't grow or age this frame, determine whether it may need to change its' colours
    if (this.coatChangesColour()) {
      this.recalculateColours(false);
      // sizes are calculated per UPS, not FPS
    }

    // Calculate angle to focus every frame (no caching for smooth animation)
    if (!this.beingHeld && !this.onSurface && this.speedY > 0 && this.jumpHeight && this.originalAngleToFocus !== null) {
      // Falling - lerp from original angle to straight down based on fall progress
      const currentHeight = trueBottom - this.y;
      const fallProgress = Math.max(0, Math.min(1, (this.jumpHeight - currentHeight) / this.jumpHeight));
      // Smooth lerp from original angle to straight down (Math.PI / 2) in shortest direction
      const targetAngle = Math.PI / 2; // Straight down
      function lerpAngleShortest(from, to, progress) {
        let diff = to - from;
        // Normalize difference to [-π, π] for shortest path
        if (diff > Math.PI) {
          diff -= 2 * Math.PI;
        } else if (diff < -Math.PI) {
          diff += 2 * Math.PI;
        }
        return from + diff * progress;
      }
      this.angleToFocus = lerpAngleShortest(this.originalAngleToFocus, targetAngle, fallProgress);
    } else {
      // Normal angle calculation - going up, on surface, or no jump state
      if (!this.beingHeld && this.focus) {
        this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
      } else {
        this.angleToFocus = Math.PI / 2;
      }
    }
    // Calculate positioning and gradients
    let backendShiftX = this.size / 30 * this.speedX;
    let backendShiftY = this.size / 30 * this.speedY;
    if (backendShiftY > trueBottom - this.y) {
      backendShiftY = trueBottom - this.y;
    }
    if (this.awake && !this.onSurface && this.hitFocus) {
      backendShiftY = -this.size / 4;
    }

    // Smooth leg animation for jumping/falling based on distance to ground
    if (!this.onSurface) {
      // Store original angle when jumping up  
      if (!this.originalAngleToFocus && this.speedY <= 0) {
        this.originalAngleToFocus = this.angleToFocus;
      }

      if (this.speedY <= 0) {
        // Going up or at peak - use original angle to focus
        this.angleToFocus = this.originalAngleToFocus || this.angleToFocus;
      } else {
        // Coming down - lerp legs based on distance to ground
        const distanceToGround = trueBottom - this.y;
        const lerpDistance = 50; // pixels from ground to start lerping
        const lerpProgress = Math.max(0, Math.min(1, (lerpDistance - distanceToGround) / lerpDistance));

        // Smooth lerp from original angle to straight down (Math.PI / 2)
        const originalAngle = this.originalAngleToFocus || this.angleToFocus;
        const targetAngle = Math.PI / 2; // Straight down  
        this.angleToFocus = originalAngle + (targetAngle - originalAngle) * lerpProgress;
      }
    } else {
      // Reset animation state when landing
      this.originalAngleToFocus = null;
    }

    // Single translate to chitten position - all drawing happens in relative coordinates from here
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.beingHeld) {
      ctx.translate(0, this.size + this.thicknessModL);
    }

    // Prepare drawing state
    ctx.globalAlpha = 1;
    // Draw tail (for facing forwards)  
    if (this.facingForwards) {
      ctx.save();
      ctx.translate(0, - this.thicknessModL);
      this.drawTail(backendShiftX, backendShiftY, 0);
      ctx.restore();
    }

    // Draw back legs (for facing forwards)
    if (this.facingForwards) {
      this.drawBackLegs(backendShiftX);
    }

    // Apply backward facing adjustment
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
    }
    ctx.save();
    // Apply sitting adjustment
    if (this.onSurface && this.sittingProgress > 0) {
      ctx.translate(0, ((this.frontLegLength) / 2) * this.sittingProgress);
    }

    // Draw body (for facing forwards)
    if (this.facingForwards) {
      ctx.translate(0, - this.thicknessModL);
      if (this.beingHeld) {
      }
      this.drawBody(backendShiftX, backendShiftY);
    }
    ctx.restore();
    let frontFootData = [];
    frontFootData = this.drawFrontLegs() || [];
    ctx.save();
    if (this.onSurface && this.sittingProgress > 0) {
      ctx.translate(0, ((this.frontLegLength) / 2) * this.sittingProgress);
    }
    // Move to head position and draw head and chest parts
    ctx.translate(0, -(this.size / 2) - this.thicknessModL);
    if (this.facingForwards) {
      this.drawChest();
    }
    if (!this.awake) {
      ctx.translate(0, this.size / 2);
    }
    ctx.rotate(this.rotation);
    this.drawHead();
    ctx.rotate(-this.rotation);

    ctx.restore();
    if (frontFootData.length !== 0) {
      // left
      this.drawSingleFoot(0, frontFootData[0], frontFootData[2], frontFootData[7], frontFootData[3], true, frontFootData[5]);
      // right
      this.drawSingleFoot(1, frontFootData[1], frontFootData[2], frontFootData[8], frontFootData[4], true, frontFootData[6]);
    }

    if (!this.facingForwards) {
      this.drawChest();
    }

    // Draw back parts (for facing backwards)
    if (!this.facingForwards) {
      // Reset to base position for back legs
      ctx.translate(0, this.size / 2);  // Undo head translate
      if (this.onSurface && this.sittingProgress > 0) {
        ctx.translate(0, -((this.frontLegLength + (this.size / 4)) / 2) * this.sittingProgress);
      }
      this.drawBackLegs(backendShiftX);
      this.drawBody(backendShiftX, backendShiftY);
      this.drawTail(backendShiftX, backendShiftY);
    }
    this.drawIcons();
    ctx.restore(); // Single restore - back to global coordinates
    ctx.globalAlpha = 1;
  };
}

function updateMatesCache() {
  availableMates = [];
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].snuggling == -1 && chittens[i].partner == null && chittens[i].awake && !chittens[i].age < (chittens[i].maxAge - oldAgeFor) &&
      chittens[i].sex == 'Female' && chittens[i].age >= maturesAt &&
      chittens[i].health >= breedingHealthReq && chittens[i].energy >= breedingEnergyReq && chittens[i].love >= breedingLoveReq) {
      availableMates.push(chittens[i]);
    }
  }
}


// Helper function to safely remove temporary chittens while preserving endless mode chittens
function removeTemporaryChittens(keepSelection = false) {
  // Work backwards to avoid index shifting issues
  for (let i = chittens.length - 1; i >= currentChittens; i--) {
    const chitten = chittens[i];

    // Skip if this is the selected chitten and we want to keep it
    if (keepSelection && chitten === selection) {
      continue;
    }

    // Skip if this chitten is NOT in a catbox (endless mode chittens are adopted and free)
    if (chitten.inCatBox === null) {
      continue;
    }

    // Remove temporary chitten (those in catboxes)
    chittens.splice(i, 1);
  }
}

function initChoiceBoxes() {
  choosingChitten = true;
  currentChittens = chittens.length;
  boxes = [];
  // drop any held chittens when we init the boxes
  if (selection !== null && selection.beingHeld) {
    selection.beingHeld = false;
  }
  selection = null;
}

// function to adopt a specified chitten
function adoptChitten(who) {
  who.onSurface = false;
  speak(who, neutralWord());
  who.targetSittingState = false;
  createGlyphs(who.x, who.y, unicodeHeart, 1);
  seeds.push(new Seed(randomColourFruity(), who));
  seeds[seeds.length - 1].timer = 750;
  who.inCatBox = null;
  // Update mates cache so new chittens can find partners immediately
  updateMatesCache();
  if (who.age < maturesAt) {
    initKitten(who);
  }
}

function initLitter(mParent, fParent) {
  parentBoxes = [];
  parentBoxes.push(new CatBox(true, false, 1, 0, CATBOX.size, CATBOX.thickness));
  parentBoxes.push(new CatBox(true, false, 2, 0, CATBOX.size, CATBOX.thickness));
  fParent.inCatBox = parentBoxes[0];
  mParent.inCatBox = parentBoxes[1];
  // Reset animation states for parents when moved to boxes
  fParent.targetSittingState = false;
  fParent.sittingProgress = 0;
  fParent.openMouthProgress = 0;
  fParent.treeSleepPosProgress = 0;
  fParent.onSurface = false;
  mParent.targetSittingState = false;
  mParent.sittingProgress = 0;
  mParent.openMouthProgress = 0;
  mParent.treeSleepPosProgress = 0;
  mParent.onSurface = false;
  // Set the parent box IDs to point to the correct chittens
  parentBoxes[0].id = chittens.indexOf(fParent);
  parentBoxes[1].id = chittens.indexOf(mParent);
  fParent.x = parentBoxes[0].x + (CATBOX.size / 2);
  fParent.y = parentBoxes[0].y + (CATBOX.size / 2);
  mParent.x = parentBoxes[1].x + (CATBOX.size / 2);
  mParent.y = parentBoxes[1].y + (CATBOX.size / 2);
  fParent.speedX = 0;
  fParent.speedY = 0;
  mParent.speedX = 0;
  mParent.speedY = 0;
  fParent.rotation = 0;
  mParent.rotation = 0;
  // Parent cats should not target anything during litter picking
  fParent.focus = null;
  mParent.focus = null;
  parentBoxes[0].colour = sexPink;
  parentBoxes[1].colour = sexBlue;
  initChoiceBoxes();
  if (endlessMode) {
    choiceTimer = endlessModeChoiceTimer;
  } else {
    choiceTimer = standardModeChoiceTimer;
  }
  sendMessage(unicodeHeart + ' ' + fParent.name + ' gave birth to ' + mParent.name + '\'s kittens');
  maleParent = mParent;
  femaleParent = fParent;
  litterChoiceUiOn(fParent.name, mParent.name);
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  // random number of chittens (6-9)
  let numberInLitter = Math.round(minLitterSize + (Math.random() * 3));
  let count = 0;
  for (let j = 0; j < CATBOX.rows; j++) {
    for (let i = 0; i < CATBOX.columns && count < numberInLitter; i++) {
      boxes.push(new CatBox(false, false, i, j, CATBOX.size, CATBOX.thickness));
      generateKitten(maleParent, femaleParent, generateChildBreedText(maleParent, femaleParent));
      thisCatBox = (j * 3) + i;
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      const who = chittens[thisCatBox + currentChittens];
      who.inCatBox = boxes[thisCatBox];
      who.name = generateBreedBasedName(maleParent.breed, femaleParent.breed, who.sex);
      who.mother = fParent;
      who.x = (canvasWidth / 2) - (((CATBOX.size * 3) + (CATBOX.padding * 2)) / 2) + (i * CATBOX.padding) + (i * CATBOX.size) + (CATBOX.size / 2);
      who.y = (trueBottom / 2) - ((CATBOX.columns * (CATBOX.size + CATBOX.padding)) / 2) + (j * CATBOX.padding) + (j * CATBOX.size) + (CATBOX.size / 2);
      // increase size here so that we can see the kittens better:
      who.size *= kittenPreviewSizeMod;
      // Pick of litter
      if (thisCatBox + currentChittens == currentChittens) {
        chittens[currentChittens].size *= 1.2;
        boxes[0].text = 'Pick';
      } else if (thisCatBox + currentChittens == currentChittens + numberInLitter - 1) {
        // Runt of litter
        chittens[currentChittens + numberInLitter - 1].size *= 0.85;
        chittens[currentChittens + numberInLitter - 1].maxSize *= 0.85;
        chittens[currentChittens + numberInLitter - 1].health *= 0.85;
        boxes[boxes.length - 1].text = 'Runt';
      }
      // setting the box colour by sex
      if (who.sex == 'Female') {
        boxes[thisCatBox].colour = sexPink;
      } else if (who.sex == 'Male') {
        boxes[thisCatBox].colour = sexBlue;
      } else {
        boxes[thisCatBox].colour = sexPurple;
      }
      // don't mutate the pick of the litter, or the runt
      if (thisCatBox !== 0 && thisCatBox !== boxes.length - 1) {
        mutate(who);
      }
      // reinit sizes and kitten variables
      determineTraitExpression(who, true, maleParent, femaleParent);
      who.recalculateSizes();
      who.recalculateColours(true);
      boxes[thisCatBox].updateSymbol();
      adoptionBackground.resize();
      count++;
    }
  }
}

// Main adoption cat generator based on filter
function generateAdoptionCat(who, breedFilter) {
  if (breedFilter === mixedBreed) {
    // Mixed filter: 30% mixed, 70% crossbreed
    if (Math.random() < proportionOfRandomChittens) {
      randomiseGeneticsBase(who, false, null); // Pure mixed
    } else {
      generateCrossbreed(who); // Crossbreed
    }
  } else if (breedFilter !== 'All') {
    // Specific breed filter: mostly bred from two parents of same breed
    if (breedFilter == mixedBreed) {
      randomiseGeneticsBase(who, true, breedFilter);
    } else {
      if (Math.random() < 0.3) {
        // 30% chance: breed two parents of the same specified breed together
        // First apply the breed to the chitten, then cross with same breed
        randomiseGeneticsBase(who, true, breedFilter);
        generateCrossbreed(who, breedFilter);
      } else {
        // 20% chance: pure template of the breed
        randomiseGeneticsBase(who, true, breedFilter);
      }
    }
  } else {
    // All/Unfiltered filter: 40% purebred, 30% mixed, 30% crossbreed
    let rand = Math.random();
    if (rand < 0.4) {
      randomiseGeneticsBase(who, true, null); // Random purebred
    } else if (Math.random() < proportionOfRandomChittens) { // reroll this number to set distibution
      randomiseGeneticsBase(who, false, null); // Pure mixed
    } else {
      generateCrossbreed(who); // Crossbreed
    }
  }
  who.name = generateBreedBasedName(who.breed, who.breed, who.sex);
  who.recalculateSizes();
  who.recalculateColours(true);
}

// function to generate a random size for a new chitten
function getRandomChittenSize(sex) {
  const scale = ((Math.random() * chittenMinSize) + (chittenSizeVariation)) * (sex === 'Female' ? 1 / 1.1 : 1);
  return scale;
}

// Function to generate a random max size for a new chitten 
function getRandomChittenMaxSize(sex) {
  const scale = ((Math.random() * chittenMinSize) + chittenSizeVariation) * (sex === 'Female' ? 1 / 1.1 : 1);
  return scale;
}

function initCattery(sex) {
  adoptionCentreUiOn(sex);
  initChoiceBoxes();
  if (sex === 'Female') {
    chosenChittenF = false;
  } else if (sex === 'Male') {
    chosenChittenM = false;
  } else {
    chosenChittenNB = false;
  }
  for (let i = 0; i < CATBOX.columns; i++) {
    for (let j = 0; j < CATBOX.rows; j++) {
      boxes.push(new CatBox(false, false, i, j, CATBOX.size, CATBOX.thickness));
      // Size scaling
      const maximumSize = getRandomChittenMaxSize(sex);
      let currentSize = Math.min(getRandomChittenSize(sex), maximumSize);
      thisCatBox = (i * 3) + j;
      chittens.push(new Chitten(boxes[thisCatBox].x + (CATBOX.size / 2), boxes[thisCatBox].y + (CATBOX.size / 2), currentSize, maximumSize, sex));
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      boxes[thisCatBox].colour = sex === 'Female' ? sexPink : sex === 'Male' ? sexBlue : sexPurple;
      // Set the cat's catbox reference BEFORE generating adoption cat
      chittens[thisCatBox + currentChittens].inCatBox = boxes[thisCatBox];
      // Generate adoption cat based on breed filter
      generateAdoptionCat(chittens[thisCatBox + currentChittens], selectedBreedFilter);
      boxes[thisCatBox].updateSymbol();
      const who = chittens[thisCatBox + currentChittens];
      who.recalculateSizes();
      who.recalculateColours(true);
    }
  }
  adoptionBackground.resize();
}

function initFemaleCattery() {
  initCattery('Female');
}

function initMaleCattery() {
  initCattery('Male');
}
function initNonBinaryCattery() {
  initCattery('Non Binary');
}

/**
* function to add health, love and energy to a chitten (for eating etc)
* @param {Chitten} who - the chitten
*/
gainMeter = function (who) {
  if (who.energy < maxEnergy) {
    who.energy += 1;
  }
  if (who.love < maxEnergy) {
    who.love += 3;
  }
  if (who.health < maxEnergy) {
    who.health += 3;
  }
};

/**
* function to remove relationships from a chitten and compensate for death
* @param {Chitten} who - the chitten
*/
removeRelationships = function (who) {
  // remove mother and partner
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].mother == who) {
      chittens[i].mother = null;
    }
    if (chittens[i].partner == who) {
      chittens[i].partner = null;
      // remove any snuggling status
      chittens[i].snuggling = -1;
    }
  }
  // decrease currentchittens if chosing a chitten to compensate for losing this one
  if (choosingChitten) {
    // shift all catbox IDs down by 1
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].id--;
    }
  }
  // make sure this chitten is no longer selected
  if (selection == who) {
    selection = null;
  }
  removeFocusFrom(who);
};

function recalculateChittenNumbers() {
  femaleCount = 0;
  maleCount = 0;
  nonbinaryCount = 0;
  let fertileFemales = 0;
  let fertileMales = 0;
  for (let i = 0; i < chittens.length; i++) {
    const c = chittens[i];
    if (c.inCatBox != null) continue;
    // Count sexes
    if (c.sex === 'Female') femaleCount++;
    else if (c.sex === 'Male') maleCount++;
    else nonbinaryCount++;

    // Fertility check
    if (c.age < (c.maxAge - oldAgeFor) && c.age >= maturesAt) {
      if (c.sex === 'Female') fertileFemales++;
      if (c.sex === 'Male') fertileMales++;
    }
  }
  // Parents in catboxes count as present and fertile
  if (parentBoxes.length === 2) {
    maleCount++;
    femaleCount++;
    fertileMales++;
    fertileFemales++;
  }
  if (endlessMode) {
    if (fertileFemales === 0) spawnRandomChitten('Female');
    if (fertileMales === 0) spawnRandomChitten('Male');
    recalculateChittenNumbers();
  }
}

// function to spawn a random chitten of a specific sex in endless mode
function spawnRandomChitten(sex) {
  const maximumSize = getRandomChittenMaxSize(sex);
  let currentSize = Math.min(getRandomChittenSize(sex), maximumSize);
  let offsetX = 0;
  if (sex == 'Male') {
    offsetX = canvasWidth - 20;
  } else if (sex == 'Female') {
    offsetX = 20;
  } else {
    console.warn('Incorrect sex specified in spawnRandomChitten')
  }
  const tempChitten = new Chitten(offsetX, trueBottom - 20, currentSize, maximumSize, sex);
  generateAdoptionCat(tempChitten, 'All');
  chittens.push(tempChitten);
  // Adoption handling
  sendMessage(chittens[chittens.length - 1].name + ' wandered in');
  adoptChitten(chittens[chittens.length - 1]);
}

// Function to add speech and trigger mouth animation
function speak(chitten, word) {
  // Don't allow speech while eating
  if (chitten.eatingChewsRemaining > 0) {
    return;
  }

  // Check if chitten is already speaking
  for (let i = 0; i < speech.length; i++) {
    if (speech[i].who === chitten && !speech[i].flagged) {
      return; // Don't add new speech if already speaking
    }
  }
  speech.push(new Speech(chitten, word));
  // Trigger mouth opening animation
  chitten.targetMouthOpenState = true;
}
