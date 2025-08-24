// init
thisCatBox = 0;

// chitten params
const maturesAt = 2; // age the chittens turn into adults at
const elasticity = 0.5; // bounciness of chittens
const chittenMaxSize = 15;
const chittenBaseSize = 9;
const chittenSizeVariation = chittenMaxSize - chittenBaseSize;
const chittenJumpCooldown = 60; // frames
const youngChittenJumpCooldown = 15;
const chittenSittingCooldown = 60; // frames - how long chittens must sit before standing up
const chittenSittingSpeed = 15; // frames
const chittenStandingUpSpeed = 5; // frames
const chittenMaxSeekFireflyDistance = maxDistance / 2; // maximum distance a chitten will actively seek out a firefly
const chittenNormalJumpDistance = 100; // the distance a chitten normally jumps
const chittenJumpMod = 1.5; // the multiple of the normal jumping distance a chitten can reach
const chittenFireflySwatDistanceMod = 10; // the multiple of the chitten's size  that defines how close a firefly can get before it swats at it

// breeding requirements
const breedingLoveReq = 100;
const breedingEnergyReq = 50;
const breedingHealthReq = 50;

// skin colours
nosePink = '#dfb2bc';
noseBlack = '#111111';
skinPink = '#e9bbc5ff';
skinGrey = '#91868e';

// gene editing
geneEditing = false;
spliceBox = new CatBox(20, 30, 100, 5);
sliderIndex = 0;
colourBars = null; // Will be initialized in startGame()
colourBlock = null; // Will be initialized in startGame()

// Performance optimization: Cache mate-finding results
let availableMates = [];
let matesCacheFrame = 0;
const MATES_CACHE_REFRESH_RATE = 30; // Refresh every 30 frames

// catboxes
const timeToMakeChoice = 5000;
// if it is in landscape
if (canvasWidth > canvasHeight || canvasWidth == canvasHeight) {
  boxSize = 200 * proportion;
} else {
  // if it is in portrait (like a phone)
  boxSize = canvasWidth / 5;
}

function updateMatesCache() {
  availableMates = [];
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].snuggling == -1 && chittens[i].awake && !chittens[i].elder &&
      chittens[i].gender == 'Female' && chittens[i].age >= maturesAt &&
      chittens[i].health >= breedingHealthReq && chittens[i].energy >= breedingEnergyReq && chittens[i].love >= breedingLoveReq) {
      availableMates.push(chittens[i]);
    }
  }
}

function initChoiceBoxes() {
  choosingChitten = true;
  labels[0].visible = true;
  labels[1].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  currentChittens = chittens.length;
  boxes = [];
  if (selection !== null && selection.dragging) {
    selection.dragging = false;
    selection.focus = selection.findClosestFireFly();
  }
  selection = null;
}

function initLitter(mParent, fParent) {
  parentBoxes = [];
  parentBoxes.push(new CatBox((canvasWidth / 2) - (boxSize * 3), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2), boxSize, boxThickness));
  parentBoxes.push(new CatBox((canvasWidth / 2) + (boxSize * 2), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2), boxSize, boxThickness));
  fParent.inCatBox = parentBoxes[0];
  mParent.inCatBox = parentBoxes[1];

  // Reset sitting state for parents when moved to boxes
  fParent.sitting = false;
  fParent.sittingProgress = 0;
  fParent.targetSittingState = false;
  fParent.sittingCooldown = 0;
  mParent.sitting = false;
  mParent.sittingProgress = 0;
  mParent.targetSittingState = false;
  mParent.sittingCooldown = 0;

  // Set the parent box IDs to point to the correct chittens
  parentBoxes[0].id = chittens.indexOf(fParent);
  parentBoxes[1].id = chittens.indexOf(mParent);
  fParent.x = parentBoxes[0].x + (boxSize / 2);
  fParent.y = parentBoxes[0].y + (boxSize / 2);
  mParent.x = parentBoxes[1].x + (boxSize / 2);
  mParent.y = parentBoxes[1].y + (boxSize / 2);
  fParent.speedX = 0;
  fParent.speedY = 0;
  mParent.speedX = 0;
  mParent.speedY = 0;
  // Parent cats should not target fireflies during litter selection
  fParent.focus = null;
  mParent.focus = null;
  parentBoxes[0].colour = genderPink;
  parentBoxes[1].colour = genderBlue;
  buttons[10].available = false;
  buttons[11].available = false;
  buttons[12].available = false;
  buttons[6].available = false;
  initChoiceBoxes();
  choiceTimer = timeToMakeChoice;
  labels[2].visible = true;
  sendMessage(unicodeHeart + ' ' + fParent.name + ' gave birth to ' + mParent.name + '\'s chittens');
  labels[0] = new Button(canvasWidth / 2, (trueBottom / 2) - ((3 * (boxSize + boxPadding)) / 2) - 120, 'Choose one of ' + fParent.name + ' and ' + mParent.name + '\'s litter to keep', '');
  labels[1] = new Button(canvasWidth / 2, (trueBottom / 2) - ((3 * (boxSize + boxPadding)) / 2) - 50, 'The rest will be adopted by nice people', '');
  maleParent = mParent;
  femaleParent = fParent;
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  buttons[2].visible = true;
  // random number of chittens (6-9)
  let numberInLitter = Math.round(6 + (Math.random() * 3));
  let count = 0;
  for (let j = 0; j < boxRows; j++) {
    for (let i = 0; i < boxColumns && count < numberInLitter; i++) {
      boxes.push(new CatBox((canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize), boxSize, boxThickness));
      generateBaby(maleParent, femaleParent, generateChildBreedText(maleParent, femaleParent));
      thisCatBox = (j * 3) + i;
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      chittens[thisCatBox + currentChittens].inCatBox = boxes[thisCatBox];
      chittens[thisCatBox + currentChittens].name = generateBreedBasedName(maleParent.breed, femaleParent.breed, chittens[thisCatBox + currentChittens].gender);
      chittens[thisCatBox + currentChittens].mother = fParent;
      chittens[thisCatBox + currentChittens].size *= 2;
      chittens[thisCatBox + currentChittens].reinitSizeAndColour();
      chittens[thisCatBox + currentChittens].x = (canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize) + (boxSize / 2);
      chittens[thisCatBox + currentChittens].y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize) + (boxSize / 2);
      count++;
      // setting the box colour
      if (chittens[thisCatBox + currentChittens].gender == 'Female') {
        boxes[thisCatBox].colour = genderPink;
      } else if (chittens[thisCatBox + currentChittens].gender == 'Male') {
        boxes[thisCatBox].colour = genderBlue;
      } else {
        boxes[thisCatBox].colour = genderPurple;
      }
      // don't mutate the pick of the litter, or the runt
      if (thisCatBox !== 0 && thisCatBox !== boxes.length - 1) {
        mutate(chittens[thisCatBox + currentChittens]);
        determineTraitExpression(chittens[thisCatBox + currentChittens]);
      }
    }
  }
  // Pick of litter
  chittens[currentChittens].size *= 1.2;
  chittens[currentChittens].reinitSizeAndColour();
  boxes[0].text = 'Pick';
  // Runt of litter
  chittens[chittens.length - 1].size *= 0.85;
  chittens[chittens.length - 1].maxSize *= 0.85;
  chittens[chittens.length - 1].health *= 0.85;
  chittens[chittens.length - 1].firstColour = mixTwoColours(chittens[chittens.length - 1].firstColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  chittens[chittens.length - 1].secondColour = mixTwoColours(chittens[chittens.length - 1].secondColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  chittens[chittens.length - 1].thirdColour = mixTwoColours(chittens[chittens.length - 1].thirdColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  boxes[boxes.length - 1].text = 'Runt';
  chittens[chittens.length - 1].reinitSizeAndColour();
}

function randomiseGenetics(who) {
  who.age = Math.round(Math.random() * 5) + maturesAt;
  who.size = (who.maxSize * 0.75) + (Math.random() * 0.25 * who.maxSize);
  who.coatMod[0] = Math.random();
  who.coatMod[1] = Math.random();
  who.thickness = (Math.random() * 0.5) + 0.5;
  who.legginess = (Math.random() * 0.9) + 0.1;
  who.patternAlpha = Math.random(); // Ensure patternAlpha is set
  // Set default colors first (will be overridden by breed if applicable)
  let colourArray = generateRealisticCoat();
  who.firstColour = colourArray[0];
  who.secondColour = colourArray[1];
  who.thirdColour = colourArray[2];
  who.inCatBox = boxes[thisCatBox];
  who.birthday = Math.round(Math.random() * 1000);
  who.love = 50 + Math.round((Math.random() * 50));
  who.tailLength = (Math.random() * 0.75) + 0.25;
  who.bodypartCode = randomBodyPartCode();
  who.nosePos = Math.random();
  who.eyePosX = Math.random();
  who.eyePosY = Math.random();
  who.headWidth = Math.random();
  who.headHeight = Math.random();
  who.eyeColour = getRandomEyeColour();
  who.eyeColour2 = who.eyeColour;
  who.eyeSize = Math.random();
  who.maxAge = 12 + (Math.random() * 8);
  who.fangs = Math.random();
  who.earHeight = 0.25 + (Math.random() * 0.75);
  who.earLength = 0.25 + (Math.random() * 0.75);
  if (who !== experiment) {
    applyBreedTemplate(who);
  }
  who.eyeColour2 = who.eyeColour;
  if (who !== experiment) {
    mutate(who);
    determineTraitExpression(who);
  }
  who.reinitSizeAndColour();
}

// Function to create a crossbreed for adoption using same logic as regular cats
function generateAdoptionCrossbreed(who) {
  // Get available pure breeds dynamically from BREED_DATA
  const availableBreeds = Object.keys(BREED_DATA);

  // Pick two different breeds to mix
  const breed1 = availableBreeds[Math.floor(Math.random() * availableBreeds.length)];
  let breed2;
  do {
    breed2 = availableBreeds[Math.floor(Math.random() * availableBreeds.length)];
  } while (breed2 === breed1);

  // Set crossbreed name BEFORE applying genetics (so mutations can append to it)
  who.breed = breed1 + ' x ' + breed2;

  // Apply genetics after breed name is set
  randomiseGenetics(who);
}

function initCattery(gender) {
  initChoiceBoxes();
  buttons[13].visible = true;

  if (gender === 'Female') {
    chosenChittenF = false;
  } else {
    chosenChittenM = false;
  }

  labels[0] = new Button(
    canvasWidth / 2,
    (trueBottom / 2) - ((3 * (boxSize + boxPadding)) / 2) - 85,
    'Welcome to the Chittery',
    ''
  );

  labels[1] = new Button(
    canvasWidth / 2,
    (trueBottom / 2) - ((3 * (boxSize + boxPadding)) / 2) - 50,
    gender === 'Female' ? 'Choose a girl' : 'Choose a boy',
    ''
  );

  buttons[0].visible = true;
  buttons[6].visible = true;

  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      const x = (canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize);
      const y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize);

      boxes.push(new CatBox(x, y, boxSize, boxThickness));

      // Gender-specific size scaling
      const scale = ((Math.random() * chittenBaseSize) + chittenSizeVariation) * (gender === 'Female' ? 1 / 1.1 : 1.1);

      chittens.push(new Chitten(x + (boxSize / 2), y + (boxSize / 2), 6, scale, gender));

      thisCatBox = (i * 3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      boxes[thisCatBox].colour = (gender === 'Female' ? genderPink : genderBlue);

      if (Math.random() < 0.3) {
        generateAdoptionCrossbreed(chittens[thisCatBox + currentChittens]);
      } else {
        randomiseGenetics(chittens[thisCatBox + currentChittens]);
      }

      const chit = chittens[thisCatBox + currentChittens];
      chit.speedX = 0;
      chit.speedY = 0;
      chit.awake = false;

      generateBreedAppropiateName(chit);
    }
  }
}

function initFemaleCattery() {
  initCattery('Female');
}

function initMaleCattery() {
  initCattery('Male');
}

/**
* function to describe a box
*/
function CatBox(x, y, size, thickness) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.thickness = thickness;
  this.selected = false;
  this.highlighted = false;
  this.id = 0;
  this.text = '';
  this.colour = trueBlack;
  this.update = function () {
    ctx.globalAlpha = 1;
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.text, this.x + 5, this.y + 15);
    ctx.lineWidth = this.thickness;
    ctx.save();
    if (!this.selected) {
      ctx.globalAlpha = 0.5;
    }
    if (this.highlighted || this.selected) {
      ctx.strokeStyle = mixTwoColours(this.colour, trueWhite, 0.5);
    } else {
      ctx.strokeStyle = this.colour;
    }
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  };
  this.checkBounce = function (what) {
    if (what.inCatBox == this) {
      // if we bounce off a side wall
      if (what.x < this.x + what.size || what.x >= this.x + this.size - what.size) {
        what.speedX *= -0.9;
        let targetangle = Math.atan2(what.y, this.y);
        what.spin += elasticity * targetangle / 10;
        if (what.x < this.x + what.size) {
          what.x = this.x + what.size;
        } else {
          what.x = this.x + this.size - what.size;
        }
      }
      if (what.y < this.y + what.size) {
        what.speedY *= -0.99;
        what.y = this.y + what.size;
      }
      if (what.y >= this.y + this.size - (what.size) - (what.limbLength / 2.5)) {
        what.y = this.y + this.size - (what.size) - (what.limbLength / 2.5);
        what.hitAFloor();
      }
    }
  };
}

/**
 * Draws a tooltip for any chitten at specified coordinates
 * @param {Chitten} chitten - The chitten to show tooltip for
 */
function drawChittenTooltip(chitten) {
  ctx.save();

  // Calculate dynamic tooltip size based on content
  let maxWidth = 200; // Minimum width
  let lineHeight = 15;
  let contentHeight = 20; // Top padding

  // Measure text widths to find max width needed
  ctx.font = 'bold 14px Arial';
  maxWidth = Math.max(maxWidth, ctx.measureText(chitten.name).width);

  ctx.font = '12px Arial';
  maxWidth = Math.max(maxWidth, ctx.measureText('Breed: ' + chitten.breed).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Age: ' + chitten.age).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Gender: ' + chitten.gender).width);

  // Pre-calculate coat string for width measurement
  let cString = '';
  if (chitten.albino || chitten.sphynx) {
    if (chitten.albino) {
      cString = 'Albino White';
    } else if (chitten.hairless) {
      let c1 = ntc.name(chitten.skinColour1)[1];
      let c2 = ntc.name(chitten.skinColour2)[1];
      let c3 = ntc.name(chitten.skinColour3)[1];
      cString = c1 + ', ' + c2 + ' & ' + c3;
    }
  } else {
    let c1 = ntc.name(chitten.firstColour)[1];
    let c2 = ntc.name(chitten.secondColour)[1];
    let c3 = ntc.name(chitten.thirdColour)[1];
    if (chitten.secondColour == chitten.thirdColour) {
      cString = c1 + ' & ' + c2;
    } else {
      cString = c1 + ', ' + c2 + ' & ' + c3;
    }
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Coat: ' + cString).width);

  // Pre-calculate eye string for width measurement
  let eString = '';
  if (chitten.eyeColour == chitten.eyeColour2 && !chitten.albino) {
    eString = ntc.name(chitten.eyeColour)[1];
  } else if (chitten.albino) {
    eString = 'Pink';
  } else {
    let color1Name = ntc.name(chitten.eyeColour)[1];
    let color2Name = ntc.name(chitten.eyeColour2)[1];
    eString = 'Heterochromic ' + color1Name + ' & ' + color2Name;
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Eyes: ' + eString).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Size: ' + Math.round(chitten.maxSize)).width);

  ctx.font = 'bold 11px Arial';
  maxWidth = Math.max(maxWidth, ctx.measureText('GENETICS').width);

  // Gene strings with unicode symbols
  let ag = chitten.albinoGene ? unicodeTick : unicodeCross;
  let ae = chitten.albino ? unicodeTick : unicodeCross;
  let hg = chitten.hairlessGene ? unicodeTick : unicodeCross;
  let he = chitten.hairless ? unicodeTick : unicodeCross;
  let lg = chitten.lykoiGene ? unicodeTick : unicodeCross;
  let le = chitten.lykoi ? unicodeTick : unicodeCross;
  let htg = chitten.heterochromicGene ? unicodeTick : unicodeCross;
  let hte = (chitten.eyeColour !== chitten.eyeColour2) ? unicodeTick : unicodeCross;

  ctx.font = '10px Arial';
  maxWidth = Math.max(maxWidth, ctx.measureText('Albino Gene: ' + ag + ' Expressed: ' + ae).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Hairless Gene: ' + hg + ' Expressed: ' + he).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Lykoi Gene: ' + lg + ' Expressed: ' + le).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Heterochromic Gene: ' + htg + ' Expressed: ' + hte).width);

  contentHeight = 20 + (lineHeight * 11); // 11 lines (removed gender line) + GENETICS spacing

  const tooltipWidth = maxWidth + 20; // Add padding
  const tooltipHeight = contentHeight;

  // Position tooltip near mouse
  let tooltipX, tooltipY;
  tooltipX = pointerPos.x + 15; // Offset from mouse
  tooltipY = pointerPos.y - tooltipHeight - 15; // Above mouse
  // Keep tooltip on screen
  if (tooltipX + tooltipWidth > canvasWidth) tooltipX = canvasWidth - tooltipWidth - 10;
  if (tooltipY < 0) tooltipY = pointerPos.y + 15; // Below mouse if no room above
  if (tooltipX < 0) tooltipX = 10;

  // Draw tooltip background with border
  ctx.fillStyle = trueBlack;
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  // Header with cat name
  ctx.fillStyle = trueWhite;
  ctx.font = 'bold 14px Arial';
  ctx.fillText(chitten.name, tooltipX + 10, tooltipY + 20);

  // Gender symbol in top right with color coding
  let genderSymbol = unicodeNonBinary;
  let genderColor = genderPurple;
  if (chitten.gender == 'Male') {
    genderSymbol = unicodeMale;
    genderColor = genderBlue;
  } else if (chitten.gender == 'Female') {
    genderSymbol = unicodeFemale;
    genderColor = genderPink;
  }

  ctx.fillStyle = genderColor;
  ctx.font = 'bold 16px Arial';
  let genderWidth = ctx.measureText(genderSymbol).width;
  ctx.fillText(genderSymbol, tooltipX + tooltipWidth - genderWidth - 10, tooltipY + 20);

  // Basic info with smaller font (moved up one line)
  ctx.font = '12px Arial';
  ctx.fillStyle = trueWhite;
  ctx.fillText('Breed: ' + chitten.breed, tooltipX + 10, tooltipY + 40);
  ctx.fillText('Age: ' + chitten.age, tooltipX + 10, tooltipY + 55);
  ctx.fillText('Coat: ' + cString, tooltipX + 10, tooltipY + 70);
  ctx.fillText('Eyes: ' + eString, tooltipX + 10, tooltipY + 85);
  ctx.fillText('Size: ' + Math.round(chitten.maxSize), tooltipX + 10, tooltipY + 100);

  ctx.font = 'bold 11px Arial';
  ctx.fillText('GENETICS', tooltipX + 10, tooltipY + 125);

  ctx.font = '10px Arial';
  ctx.fillText('Albino Gene: ' + ag + ' Expressed: ' + ae, tooltipX + 10, tooltipY + 140);
  ctx.fillText('Hairless Gene: ' + hg + ' Expressed: ' + he, tooltipX + 10, tooltipY + 153);
  ctx.fillText('Lykoi Gene: ' + lg + ' Expressed: ' + le, tooltipX + 10, tooltipY + 166);
  ctx.fillText('Heterochromic Gene: ' + htg + ' Expressed: ' + hte, tooltipX + 10, tooltipY + 179);

  ctx.restore();
}

/**
* function to return a random gender
* @return {string} the gender
*/
function randomGender() {
  if (Math.random() < 0.004) {
    return 'Non Binary';
  } else {
    let base = Math.round(Math.random());
    if (base == 0) {
      return 'Male';
    }
    return 'Female';
  }
}

// Improved crossbreeding with generation limits
function generateChildBreedText(parent1, parent2) {
  const breed1 = cleanBreedName(parent1.breed);
  const breed2 = cleanBreedName(parent2.breed);

  // Same breed
  if (breed1 === breed2) {
    return breed1;
  }

  // Count generation depth
  const depth1 = getBreedDepth(parent1.breed);
  const depth2 = getBreedDepth(parent2.breed);
  const maxDepth = Math.max(depth1, depth2);

  // Too mixed - revert to "Mixed" after 3 generations
  if (maxDepth >= 3) {
    return 'Mixed';
  }

  // Create cross name (alphabetical order for consistency)
  const breeds = [breed1, breed2].sort();
  return `${breeds[0]} x ${breeds[1]}`;
}

function cleanBreedName(breedName) {
  if (!breedName || breedName === 'Mixed') return 'Mixed';

  // Remove albino suffix
  let cleaned = breedName.replace(/\s+(albino|Albino)$/, '');

  // Remove cross suffix  
  cleaned = cleaned.replace(/\s+cross$/, '');

  // For already crossed breeds, take the first breed only
  const firstBreed = cleaned.split(' x ')[0];

  return firstBreed || 'Mixed';
}

function getBreedDepth(breedName) {
  if (!breedName || breedName === 'Mixed') return 0;

  // Count ' x ' patterns (with spaces) to determine crossing depth
  // This avoids counting 'x' in breed names like "Sphynx"
  const crossCount = (breedName.match(/\s+x\s+/g) || []).length;

  if (crossCount === 0) return 0; // Pure breed
  if (crossCount === 1) return 1; // First generation cross
  return 2; // Complex cross (simplified to avoid infinite complexity)
}

/**
* function to collide two objects using physics
* @param {object} parent1 - the first parent
* @param {object} parent2 - the second parent
* @return {string} the gender of the baby
*/
function generateBaby(parent1, parent2, specBreed) {
  // male is parent1
  // female is parent2
  let babyGender = randomGender();

  // max age logic
  let ageSwitch = Math.round(Math.random() * 2); // 0 to 2
  let specMaxAge = 1;
  if (ageSwitch == 0) {
    specMaxAge = ((parent1.maxAge * 9) + Math.random()) / 10;
  } else if (ageSwitch == 1) {
    specMaxAge = ((parent2.maxAge * 9) + Math.random()) / 10;
  } else {
    specMaxAge = (parent1.maxAge + parent2.maxAge + 12 + (Math.random() * 8)) / 3;
  }
  // max size logic
  let sizeSwitch = Math.round(Math.random() * 2); // 0 to 2
  let specSize = 1;
  if (sizeSwitch == 0) {
    specSize = ((parent1.maxSize * 9) + ((Math.random() * chittenSizeVariation) + chittenBaseSize)) / 10;
  } else if (sizeSwitch == 1) {
    specSize = ((parent2.maxSize * 9) + ((Math.random() * chittenSizeVariation) + chittenBaseSize)) / 10;
  } else {
    specSize = (parent1.maxSize + parent2.maxSize + ((Math.random() * chittenSizeVariation) + chittenBaseSize)) / 3;
  }
  // Ensure breeding never exceeds global maximum
  specSize = Math.min(specSize, chittenMaxSize);
  // thickness logic
  let thickSwitch = Math.round(Math.random() * 2); // 0 to 2
  let specThickness = 1;
  if (thickSwitch == 0) {
    specThickness = ((parent1.thickness * 9) + Math.random()) / 10;
  } else if (thickSwitch == 1) {
    specThickness = ((parent2.thickness * 9) + Math.random()) / 10;
  } else {
    specThickness = (parent1.thickness + parent2.thickness + Math.random()) / 3;
  }
  // legginess logic
  let legSwitch = Math.round(Math.random() * 2); // 0 to 2
  let specLegginess = 1;
  if (legSwitch == 0) {
    specLegginess = ((parent1.legginess * 9) + Math.random()) / 10;
  } else if (legSwitch == 1) {
    specLegginess = ((parent2.legginess * 9) + Math.random()) / 10;
  } else {
    specLegginess = (parent1.legginess + parent2.legginess + Math.random()) / 3;
  }

  // tail logic
  let tailSwitch = Math.round(Math.random() * 2);
  let specTail = 1;
  if (tailSwitch == 0) {
    specTail = ((parent1.tailLength * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (tailSwitch == 1) {
    specTail = ((parent2.tailLength * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specTail = (parent1.tailLength + parent2.tailLength + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // fang logic
  let fangSwitch = Math.round(Math.random() * 2);
  let specFang = 1;
  if (fangSwitch == 0) {
    specFang = ((parent1.fangs * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (fangSwitch == 1) {
    specFang = ((parent2.fangs * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specFang = (parent1.fangs + parent2.fangs + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // nose position logic
  let noseSwitch = Math.round(Math.random() * 2);
  let specNose = 1;
  if (noseSwitch == 0) {
    specNose = ((parent1.nosePos * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (noseSwitch == 1) {
    specNose = ((parent2.nosePos * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specNose = (parent1.nosePos + parent2.nosePos + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // eye size logic
  let eyeSwitch = Math.round(Math.random() * 2);
  let specEyeSize = 1;
  if (eyeSwitch == 0) {
    specEyeSize = ((parent1.eyeSize * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (eyeSwitch == 1) {
    specEyeSize = ((parent2.eyeSize * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specEyeSize = (parent1.eyeSize + parent2.eyeSize + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // eye position logic X
  eyeSwitch = Math.round(Math.random() * 2);
  let specEyeX = 1;
  if (eyeSwitch == 0) {
    specEyeX = ((parent1.eyePosX * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (eyeSwitch == 1) {
    specEyeX = ((parent2.eyePosX * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specEyeX = (parent1.eyePosX + parent2.eyePosX + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // eye position logic Y
  eyeSwitch = Math.round(Math.random() * 2);
  let specEyeY = 1;
  if (eyeSwitch == 0) {
    specEyeY = ((parent1.eyePosY * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (eyeSwitch == 1) {
    specEyeY = ((parent2.eyePosY * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specEyeY = (parent1.eyePosY + parent2.eyePosY + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // head width
  let headSwitch = Math.round(Math.random() * 2);
  let specHeadW = 1;
  if (headSwitch == 0) {
    specHeadW = ((parent1.headWidth * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (headSwitch == 1) {
    specHeadW = ((parent2.headWidth * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specHeadW = (parent1.headWidth + parent2.headWidth + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // head height
  headSwitch = Math.round(Math.random() * 2);
  let specHeadH = 1;
  if (headSwitch == 0) {
    specHeadH = ((parent1.headHeight * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else if (headSwitch == 1) {
    specHeadH = ((parent2.headHeight * 9) + ((Math.random() * 0.75) + 0.25)) / 10;
  } else {
    specHeadH = (parent1.headHeight + parent2.headHeight + ((Math.random() * 0.75) + 0.25)) / 3;
  }

  // ear Width logic
  let earSwitch = Math.round(Math.random() * 2); // 0 to 2
  let babyEars = 1;
  if (earSwitch == 0) {
    babyEars = ((parent1.earWidth * 9) + Math.random()) / 10;
  } else if (earSwitch == 1) {
    babyEars = ((parent2.earWidth * 9) + Math.random()) / 10;
  } else {
    babyEars = (parent1.earWidth + parent2.earWidth + Math.random()) / 3;
  }

  // ear Height logic
  earSwitch = Math.round(Math.random() * 2); // 0 to 2
  babyEars2 = 1;
  if (earSwitch == 0) {
    babyEars2 = ((parent1.earHeight * 9) + Math.random()) / 10;
  } else if (earSwitch == 1) {
    babyEars2 = ((parent2.earHeight * 9) + Math.random()) / 10;
  } else {
    babyEars2 = (parent1.earHeight + parent2.earHeight + Math.random()) / 3;
  }
  // make sure the baby is not too big for the mother
  let babySize = specSize / 3;
  let babySizeRandom = (Math.random() * 0.1) + 0.3; // randomise here to create more variation
  if (babySize > parent2.size * babySizeRandom) {
    babySize = parent2.size * babySizeRandom;
  }
  chittens.push(new Chitten(parent1.x + ((parent2.x - parent1.x) / 2), parent1.y + ((parent2.y - parent1.y) / 2), babySize, specSize, babyGender));
  // set the baby's ears
  // set the baby's genetic colour
  let colour1 = 'red'; // for debug
  let colour2 = 'blue';
  let colour3 = 'green';
  // decide which method of colour logic to use for the genetic colour
  let seed = Math.round(Math.random() * 2);
  if (seed == 0) {
    colour1 = parent1.firstColour;
  } else if (seed == 1) {
    colour1 = parent2.firstColour;
  } else {
    colour1 = mixTwoColours(parent1.firstColour, parent2.firstColour, Math.random());
  }
  // decide which method of colour logic to use for the second colour
  seed = Math.round(Math.random() * 2);
  if (seed == 0) {
    colour2 = parent1.secondColour;
  } else if (seed == 1) {
    colour2 = parent2.secondColour;
  } else {
    colour2 = mixTwoColours(parent1.secondColour, parent2.secondColour, Math.random());
  }
  // decide which method of colour logic to use for the third colour
  seed = Math.round(Math.random() * 2);
  if (seed == 0) {
    colour3 = parent1.thirdColour;
  } else if (seed == 1) {
    colour3 = parent2.thirdColour;
  } else {
    colour3 = mixTwoColours(parent1.thirdColour, parent2.thirdColour, Math.random());
  }
  // decide which method of colour logic to use for the eyes
  seed = Math.round(Math.random() * 2);
  let eyeColour;
  if (seed == 0) {
    eyeColour = parent1.eyeColour;
  } else if (seed == 1) {
    eyeColour = parent2.eyeColour;
  } else {
    eyeColour = mixTwoColours(parent1.eyeColour, parent2.eyeColour, Math.random());
  }

  // pattern logic
  let patternSwitch = Math.round(Math.random() * 2); // 0 to 2.
  if (patternSwitch == 0) {
    chittens[chittens.length - 1].patternAlpha = ((parent1.patternAlpha * 9) + Math.random()) / 10;
  } else if (patternSwitch == 1) {
    chittens[chittens.length - 1].patternAlpha = ((parent2.patternAlpha * 9) + Math.random()) / 10;
  } else {
    chittens[chittens.length - 1].patternAlpha = (parent1.patternAlpha + parent2.patternAlpha + Math.random()) / 3;
  }

  // pattern inheritance
  patternSwitch = Math.round(Math.random()); // 0 to 1.
  if (patternSwitch == 0) {
    chittens[chittens.length - 1].pattern = parent1.pattern;
  } else {
    chittens[chittens.length - 1].pattern = parent2.pattern;
  }

  // coat logic
  let coatSwitch = Math.round(Math.random() * 2); // 0 to 2
  if (coatSwitch == 0) {
    chittens[chittens.length - 1].coatMod[0] = ((parent1.coatMod[0] * 9) + Math.random()) / 10;
  } else if (coatSwitch == 1) {
    chittens[chittens.length - 1].coatMod[0] = ((parent2.coatMod[0] * 9) + Math.random()) / 10;
  } else {
    chittens[chittens.length - 1].coatMod[0] = (parent1.coatMod[0] + parent2.coatMod[0] + Math.random()) / 3;
  }
  coatSwitch = Math.round(Math.random() * 2); // 0 to 2
  if (coatSwitch == 0) {
    chittens[chittens.length - 1].coatMod[1] = ((parent1.coatMod[1] * 9) + Math.random()) / 10;
  } else if (coatSwitch == 1) {
    chittens[chittens.length - 1].coatMod[1] = ((parent2.coatMod[1] * 9) + Math.random()) / 10;
  } else {
    chittens[chittens.length - 1].coatMod[1] = (parent1.coatMod[1] + parent2.coatMod[1] + Math.random()) / 3;
  }
  // check for genetic conditions being passed down
  // albino gene inheritance (separate from expression)
  let albinoGeneChance = 0;
  if (parent1.albinoGene && parent2.albinoGene) {
    albinoGeneChance = 0.75; // 75% chance to inherit gene when both parents carry it
  } else if (parent1.albinoGene || parent2.albinoGene) {
    albinoGeneChance = 0.5; // 50% chance when one parent carries it
  }
  if (albinoGeneChance >= Math.random()) {
    chittens[chittens.length - 1].albinoGene = true;
    // Expression chance: only 25% of gene carriers actually express albinism
    if (Math.random() <= 0.25) {
      chittens[chittens.length - 1].albino = true;
    }
  }

  // hairless gene inheritance (recessive trait)
  let hairlessGeneChance = 0;
  if (parent1.hairlessGene && parent2.hairlessGene) {
    hairlessGeneChance = 0.75; // 75% chance to inherit gene when both parents carry it
  } else if (parent1.hairlessGene || parent2.hairlessGene) {
    hairlessGeneChance = 0.5; // 50% chance when one parent carries it
  }
  if (hairlessGeneChance >= Math.random()) {
    chittens[chittens.length - 1].hairlessGene = true;
  }

  // lykoi gene inheritance (separate recessive trait)
  let lykoiGeneChance = 0;
  if (parent1.lykoiGene && parent2.lykoiGene) {
    lykoiGeneChance = 0.75; // 75% chance to inherit gene when both parents carry it
  } else if (parent1.lykoiGene || parent2.lykoiGene) {
    lykoiGeneChance = 0.5; // 50% chance when one parent carries it
  }
  if (lykoiGeneChance >= Math.random()) {
    chittens[chittens.length - 1].lykoiGene = true;
  }
  if (chittens[chittens.length - 1].breed == 'Sphynx' && !chittens[chittens.length - 1].hairlessGene) {
    chittens[chittens.length - 1].breed = 'Mixed';
  }

  // heterochromic gene inheritance
  let heterochromicGeneChance = 0;
  if (parent1.heterochromicGene && parent2.heterochromicGene) {
    heterochromicGeneChance = 0.75; // 75% chance to inherit gene when both parents carry it
  } else if (parent1.heterochromicGene || parent2.heterochromicGene) {
    heterochromicGeneChance = 0.5; // 50% chance when one parent carries it
  }
  if (heterochromicGeneChance >= Math.random()) {
    chittens[chittens.length - 1].heterochromicGene = true;
  }

  // mixing in a little randomness to the colours
  let seedC = Math.random();
  if (seedC < 0.0625) {
    // rotate the colour positions 1/8 of the time
    chittens[chittens.length - 1].firstColour = mixTwoColours(colour3, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].secondColour = mixTwoColours(colour1, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].thirdColour = mixTwoColours(colour2, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
  } else if (seedC < 0.125) {
    chittens[chittens.length - 1].firstColour = mixTwoColours(colour2, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].secondColour = mixTwoColours(colour3, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].thirdColour = mixTwoColours(colour1, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
  } else {
    chittens[chittens.length - 1].firstColour = mixTwoColours(colour1, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].secondColour = mixTwoColours(colour2, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
    chittens[chittens.length - 1].thirdColour = mixTwoColours(colour3, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.025));
  }
  chittens[chittens.length - 1].eyeColour = mixTwoColours(eyeColour, getRandomEyeColour(), 1 - (Math.random() * 0.025));

  // Heterochromic expression: only cats with the gene can express it
  if (chittens[chittens.length - 1].heterochromicGene) {
    // 40% chance for gene carriers to actually express heterochromia
    if (Math.random() <= 0.4) {
      mutateHeterochromia(chittens[chittens.length - 1], 0);
    } else {
      chittens[chittens.length - 1].eyeColour2 = chittens[chittens.length - 1].eyeColour;
    }
  } else {
    chittens[chittens.length - 1].eyeColour2 = chittens[chittens.length - 1].eyeColour;
  }

  if (chittens[chittens.length - 1].gender == 'Male' && Math.random() > 1 / 3000) {
    chittens[chittens.length - 1].thirdColour = chittens[chittens.length - 1].firstColour;
  }
  let tmpBodypartCode = [];
  for (let i = 0; i < parent1.bodypartCode.length; i++) {
    if (Math.random() < 0.5) {
      tmpBodypartCode.push(parent1.bodypartCode[i]);
    } else {
      tmpBodypartCode.push(parent2.bodypartCode[i]);
    }
  }
  chittens[chittens.length - 1].breed = specBreed;
  chittens[chittens.length - 1].thickness = specThickness;
  chittens[chittens.length - 1].legginess = specLegginess;
  chittens[chittens.length - 1].tailLength = specTail;
  chittens[chittens.length - 1].bodypartCode = tmpBodypartCode;
  chittens[chittens.length - 1].nosePos = specNose;
  chittens[chittens.length - 1].eyePosX = specEyeX;
  chittens[chittens.length - 1].eyePosY = specEyeY;
  chittens[chittens.length - 1].eyeSize = specEyeSize;
  chittens[chittens.length - 1].headWidth = specHeadW;
  chittens[chittens.length - 1].headHeight = specHeadH;
  chittens[chittens.length - 1].maxAge = specMaxAge;
  // Subtle newborn bounce variation based on leg length
  let kitten = chittens[chittens.length - 1];
  let legPower = 1 + (kitten.legginess * 0.1); // Very subtle leg effect for newborns
  kitten.speedY = -6 * legPower;
  chittens[chittens.length - 1].fangs = specFang;
  chittens[chittens.length - 1].earWidth = babyEars;
  chittens[chittens.length - 1].earHeight = babyEars2;

  // Determine trait expression for inherited genes
  determineTraitExpression(chittens[chittens.length - 1]);

  return babyGender;
}

/**
* function to describe a Chitten
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} gender - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Chitten(x, y, bodySize, maxSize, gender) {
  this.id = ('0000' + guyID).slice(-4);
  guyID++;
  this.size = bodySize;
  this.maxSize = Math.min(maxSize, chittenMaxSize);
  this.breed = 'Mixed';
  this.inCatBox = null;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.firstColour = trueWhite;
  this.secondColour = trueWhite;
  this.thirdColour = trueWhite;
  this.skinColour1 = trueWhite;
  this.skinColour2 = trueWhite;
  this.skinColour3 = trueWhite;
  this.noseColour = noseBlack;
  this.eyeColour = trueWhite;
  this.eyeColour2 = trueWhite;
  this.nosePos = 0;
  this.eyePosX = 0;
  this.eyePosY = 0;
  this.eyeSize = 0;
  this.headWidth = 0;
  this.headHeight = 0;
  this.coatMod = [1, 1]; // [0] is fade position for gradients, [1] is the angle of the gradient
  this.patternAlpha = 0;
  this.pattern = 0;
  this.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.fangs = 0.5; // [style, length]
  this.earWidth = 0.5; // 0.5 is average
  this.earHeight = 0.5;
  this.thickness = 0; // 0.5 is average
  this.legginess = 0;
  this.mass = 0; // Calculated based on size and thickness
  this.angleToFocus = 0;
  this.behaviorUpdateCounter = Math.floor(Math.random() * 5); // Stagger initial updates
  this.jumpCooldown = 0; // Frames to wait before next jump
  this.cellShadeThickness = this.size / 10;
  this.cellShadeLine = '';
  this.limbLength = (this.size) + (1.5 * this.legginess * this.size); // 10 to 16 + 0 to 6 == 16 to 6
  this.tailLength = 0;
  this.maxAge = 14;
  this.hitBottom = false;
  this.sitting = false;
  this.sittingProgress = 0; // 0 = standing, 1 = fully sitting
  this.targetSittingState = false; // What sitting state we're lerping toward
  this.sittingCooldown = 0; // Frames left before chitten can stand up from sitting
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.hunger = 1000;
  this.snuggling = -1; // Default is. 1 is the snuggling state, anything above 0 is the animation length in frames
  this.nomnomnom = -1; // as above
  this.preparingToEat = false; // true when grabbed fruit and sitting before eating
  this.awake = true;
  this.litters = 0;
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  this.elder = false;
  this.reachedNirvana = false;
  this.focus = this.inCatBox ? null : fireflies[0];
  this.hitFocus = false;
  this.partner = null;
  this.mother = null;
  this.jumpY = trueBottom;
  this.facingForwards = true;
  // interaction
  this.dragging = false;
  // genetic conditions
  this.albino = false;
  this.albinoGene = false;
  this.hairlessGene = false;
  this.lykoiGene = false;
  this.heterochromicGene = false;
  this.hairless = false;
  this.lykoi = false;
  this.kill = function () {
    removeFocusFrom(this);
    chittens.splice(chittens.indexOf(this, chittens), 1);
  };
  // function to reinitialisae sizes (for growth)
  this.reinitSizeAndColour = function () {
    this.limbLength = (this.size) + (1.5 * this.legginess * this.size);
    this.cellShadeThickness = this.size / 10;
    // Calculate mass based on size and thickness
    this.mass = this.size * this.thickness;
    if (this.albino && !this.hairless && !this.lykoi) {
      this.cellShadeLine = mixTwoColours(trueWhite, trueBlack, 0.7);
    } else if (this.hairless || this.lykoi) {
      this.cellShadeLine = mixTwoColours(nosePink, noseBlack, 0.5);
    } else {
      this.cellShadeLine = mixTwoColours(mixThreeColours(this.firstColour, this.secondColour, this.thirdColour), trueBlack, 0.7);
    }
    if (this.albino) {
      this.skinColour1 = skinPink;
      this.skinColour2 = skinPink;
      this.skinColour3 = skinPink;
      this.noseColour = nosePink;
    } else {
      this.skinColour1 = skinColourCheck(this.firstColour);
      this.skinColour2 = skinColourCheck(this.secondColour);
      this.skinColour3 = skinColourCheck(this.thirdColour);
      // Set nose color based on primary fur color
      this.noseColour = noseColourCheck(this.firstColour);
    }

  };
  // reset jump cooldown
  this.resetJumpCoolDown = function () {
    // Wait frames before next jump, fat cats are lazier
    if (this.age < maturesAt) {
      // Kittens following mothers get much shorter cooldown to be eager followers
      this.jumpCooldown = youngChittenJumpCooldown + (youngChittenJumpCooldown * this.thickness);;
    } else {
      this.jumpCooldown = chittenJumpCooldown + (chittenJumpCooldown * this.thickness);
    }
  }
  // reset rotation
  this.resetRotation = function (fastest) {
    // Normalize rotation to [-π, π] range to prevent full spins
    while (this.rotation > Math.PI) this.rotation -= 2 * Math.PI;
    while (this.rotation < -Math.PI) this.rotation += 2 * Math.PI;

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

  // act
  // @return {boolean} - whether the action has a cost
  this.act = function () {
    // Decrement jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

    // Decrement sitting cooldown
    if (this.sittingCooldown > 0) {
      this.sittingCooldown--;
    }

    // Update sitting animation
    // Sitting down
    if (this.targetSittingState && this.sittingProgress < 1) {
      this.resetJumpCoolDown(); // reset the jump cooldown if are trying to sit
      // Lerping toward sitting: fatter cats sit down faster
      this.sittingProgress += (1 / chittenSittingSpeed) * (1 + this.thickness);
      if (this.sittingProgress >= 1) {
        this.sittingProgress = 1;
        this.sitting = true;
        // Start sitting cooldown when fully sitting
        this.sittingCooldown = chittenSittingCooldown;
      }
    } else if (!this.targetSittingState && this.sittingProgress > 0) {
      // Lerping toward standing: fatter cats stand up slower
      // standing up
      this.sittingProgress -= (1 / chittenStandingUpSpeed) * (1 - this.thickness);
      if (this.sittingProgress <= 0) {
        this.sittingProgress = 0;
        this.sitting = false;
      }
    }
    if (choosingChitten && this.snuggling == 0 && this.gender == 'Female') {
      if (!chosenKitten) {
        if (selection == null) {
          selection = chittens[Math.round(Math.random() * (boxes.length - 1)) + currentChittens];
        }
        handleButton(1);
      } else {
        handleButton(13);
      }
    }
    // giving birth
    if (!choosingChitten && parentBoxes.length === 0 && this.snuggling == 0 && this.gender == 'Female') {
      if (this.partner !== null) {
        this.partner.snuggling = -1;
        this.partner.partner = null;
        createGlyphs((this.x - (this.x - this.partner.x) / 2), (this.y - (this.y - this.partner.y) / 2), unicodeHeart);
        initLitter(this.partner, this); // this.partner = male, this = female
        // take snuggling to -1 so that it doesn't give birth forever
      } else {
        sendMessage(this.name + ' had a phantom pregnancy');
      }
      this.snuggling = -1;
      this.partner = null;
    } else if (!choosingChitten && (this.snuggling >= 0)) {
      this.snuggling--;
    } else if (this.inCatBox == null && this.nomnomnom >= 0) {
      // if you're eating, decrease the eating timer
      this.nomnomnom--;
    } else {
      // Opportunistic firefly interactions happen every frame for responsiveness
      if (!this.inCatBox && this.awake && this.snuggling == -1 && this.nomnomnom == -1) {
        // Check for nearby fireflies for quick opportunistic jumps
        let closestFirefly = fireflies[this.findClosestFireFly()];
        if (closestFirefly) {
          let dx = this.x - closestFirefly.x;
          let dy = this.y - closestFirefly.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // If firefly is very close, switch focus and reset jump cooldown for immediate action
          if (distance < this.size * chittenFireflySwatDistanceMod && (!this.focus || fireflies.includes(this.focus))) {
            this.focus = closestFirefly;
            this.jumpCooldown = 0; // Allow immediate jumping at close fireflies
          }
        }
      }

      // deciding what the focus is
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
        // decide what to target
        let target = null;
        // if not an adult, just follow mother (unless in catbox)
        if (this.age < maturesAt && this.mother !== null && !this.inCatBox) {
          target = this.mother;
        }
        // are we hungry?
        if (target == null && this.inCatBox == null && this.hunger <= 250 && fruits.length > 0) {
          let closestFruit = this.findClosestFruit();
          if (closestFruit !== 'X') {
            target = closestFruit;
          }
        }
        // are we gonna pick a mate? (using cached mate list for performance)
        if (target == null && this.snuggling == -1 && !choosingChitten && !this.elder && this.gender == 'Male' && this.age >= maturesAt && chittens.length <= maxPop && this.health >= breedingHealthReq
          && this.energy >= breedingEnergyReq) {
          // Update mates cache periodically
          matesCacheFrame++;
          if (matesCacheFrame >= MATES_CACHE_REFRESH_RATE) {
            matesCacheFrame = 0;
            updateMatesCache();
          }

          // Use cached available mates instead of looping through all cats
          if (!choosingChitten && this.gender == "Male" && this.love >= breedingLoveReq && this.energy >= breedingEnergyReq && this.health >= breedingHealthReq) {
          }
          for (let j = 0; j < availableMates.length && target == null; j++) {
            this.partner = availableMates[j];
            availableMates[j].partner = this;
            target = availableMates[j];
          }
        }

        // decide what we are focused on now
        if (target == null && !this.inCatBox) {
          // default action - jump at firefly (only if not in adoption box)
          this.focus = fireflies[this.findClosestFireFly()];
        } else {
          this.focus = target;
        }

        // // debug - draw focus
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.restore();
        // ctx.lineTo(this.focus.x, this.focus.y);
        // ctx.stroke();

        // kittens sitting down near their mothers - only when very close
        if (this.age < maturesAt && this.mother !== null && (Math.abs(this.x - this.mother.x) < (this.size + this.mother.size) * 1.5) && (Math.abs(this.y - this.mother.y) < (this.size + this.mother.size) * 1.5)) {
          if (this.mother.awake) {
            this.targetSittingState = true;
            this.facingForwards = true;
          } else if (this.nomnomnom == -1) {
            this.energy = this.mother.energy - (Math.random() * 5);
            this.awake = false;
            this.targetSittingState = false;
            this.facingForwards = true;
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
            shouldJump = Math.random() < jumpChance;
          }

          // if the focus is below the Chitten OR we can jump down to any target
          if (shouldJump && (this.focus.y <= this.y + this.size || (canJumpDown && this.focus.y > this.y + this.size))) {
            // If sitting, must lerp to standing before jumping (unless eating)
            if (this.sittingProgress > 0) {
              // Don't stand up if eating or preparing to eat, or if sitting cooldown is active
              if (this.nomnomnom <= 0 && !this.preparingToEat && this.sittingCooldown <= 0) {
                this.targetSittingState = false; // Start standing up
              }
              return false; // Don't jump yet, wait for sitting animation or eating to finish
            }

            // Jumping starts here
            let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
            // Modify the jump power by how far away the target is
            let dx = this.focus.x - this.x;
            let dy = this.focus.y - this.y;
            let jumpDistance = Math.sqrt(dx * dx + dy * dy);
            let jumpMod = Math.min(jumpDistance / chittenNormalJumpDistance, chittenJumpMod);
            // Calculate jump power based on leg length (subtle effect)
            let legPower = 1 + (this.legginess * 0.15); // Longer legs = slightly better jumping (0.85 to 1.15x)
            // Only apply upward base velocity if target is above or level, not when jumping down
            if (this.focus.y <= this.y) {
              this.speedY = -this.size * 0.7 * legPower;
            } else {
              this.speedY = 0; // No base upward velocity when jumping down
            }
            this.speedX += Math.cos(targetangle) * 25 * legPower * jumpMod;
            this.speedY += Math.sin(targetangle) * 25 * legPower * jumpMod;

            this.resetJumpCoolDown();

            if (this.age < maturesAt) {
              // Reduce jump power but not as severely when following mother
              let reduction = isMother ? 0.75 : 0.5; // 75% power for mother, 50% for others
              this.speedX *= reduction;
              this.speedY *= reduction;
            } else {
              // it doesn't cost kittens energy or health to jump
              this.energy -= 7;
              this.health -= 1;
              if (this.energy <= 0) {
                this.facingForwards = false;
              }
            }
            this.y--;
            this.targetSittingState = false;
            // one in ten jumps is facing backwards
            if (Math.random() < 1 / 10) {
              this.facingForwards = false;
            }
          }
        }
      } else {
        // 1% chance to sit when behavior updates
        if (Math.random() < 0.01) {
          this.targetSittingState = true;
        }
      }
      // 0.1% chance of speaking
      if (Math.random() <= 0.001) {
        speech.push(new Speak(this, neutralWord()));
      }
    }
  };

  this.findClosestFruit = function () {
    let tmp = maxDistance;
    let target = 'X';
    for (let f = 0; f < fruits.length; f++) {
      let tmpX = this.x - fruits[f].x;
      let tmpY = this.y - fruits[f].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));
      // only jump for fruits within your range
      if (fruits[f].eaterId == null && distance < tmp && fruits[f].y >= trueBottom - (trueBottom - this.jumpY - this.size) && fruits[f].y < trueBottom - this.size) {
        tmp = distance;
        target = fruits[f];
      }
    }
    return target;
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
      console.log('no FireFly to target');
      return 0;
    }
    return target;
  };

  // check for bounces on walls and landing on trees
  this.physicsCheck = function () {
    this.hitBottom = false;
    // check if mate hit a Tree
    let hitTree = false;
    for (let i = 0; i < trees.length && !hitTree; i++) {
      if (this.x >= trees[i].x + (this.size / 2) - (trees[i].width / 2) && this.x <= trees[i].x - (this.size / 2) + (trees[i].width / 2) && this.y >= trees[i].y - (this.size) - (this.limbLength / 2.5) - (this.size / 2) && this.y <= trees[i].y + trees[i].height && this.speedY >= 0) {
        this.y = trees[i].y - (this.size) - (this.limbLength / 2.5);
        trees[i].loadthisframe += this.size;
        hitTree = true;
        this.hitAFloor();
        if (this.nomnomnom <= 0 && this.snuggling <= 0) {
          this.energy -= 0.01;
        }
        if (this.y > trueBottom - (this.size) - (this.limbLength / 2.5)) {
          this.y = trueBottom - (this.size) - (this.limbLength / 2.5);
        }
      }
    }
    checkBounceSides(this);
    checkBounceTop(this);
    if (choosingChitten) {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].checkBounce(this);
      }
      if (!chosenKitten) {
        for (let i = 0; i < parentBoxes.length; i++) {
          parentBoxes[i].checkBounce(this);
        }
      }
    }

    // check if chitten hit the floor, come to a rest if so
    if (!this.hitBottom && this.y >= trueBottom - (this.size) - (this.limbLength / 2.5)) {
      this.y = trueBottom - (this.size) - (this.limbLength / 2.5);
      this.hitAFloor();
    }
  };
  this.hitAFloor = function () {
    this.speedY = 0;
    if (this.energy <= 0 && this.nomnomnom == -1 && this.snuggling == -1) {
      // fall asleep when tired
      this.targetSittingState = false;
      this.awake = false;
      this.facingForwards = true;
      this.speedX = 0;
      this.rotation = 0;
      this.spin = 0;
    } else {
      this.hitBottom = true;
      this.facingForwards = true;
      // apply ground friction
      this.speedX *= groundFriction;
      this.resetRotation(false);
      // jump occasionally
      if (!this.dragging && this.rotation == 0 && this.awake && this.inCatBox == null) {
        this.act();
        // this.hitBottom = false;
      }
    }
  };

  this.drawTail = function (pat, backendShiftX, backendShiftY, sleepshift) {
    // === TAIL ANIMATION CALCULATIONS ===
    let tmp = Math.abs(daytimeCounter - this.birthday);
    while (tmp > 30 && tmp > 0) {
      tmp -= 30; // 0 to 30
    }
    tmp = Math.abs(tmp - 15); // 0 to 15 to 0 to 15 (wagging motion)

    // === CONTEXT TRANSFORMATIONS ===
    ctx.save();
    if (this.awake && !this.facingForwards && this.sittingProgress > 0) {
      ctx.translate(0, -this.size * this.sittingProgress);
    }
    if (!this.hitBottom && this.awake) {
      tmp = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
      ctx.rotate((90 * Math.PI / 180) + Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.hitBottom || !this.awake) {
      ctx.translate(0, sleepshift - this.size);
    }

    // === COLOR SETUP ===
    let tailGradient = trueWhite;
    if (this.hairless) {
      if (this.bodypartCode[6] == 0) {
        tailGradient = this.skinColour1;
      } else if (this.bodypartCode[6] == 1) {
        tailGradient = this.skinColour2;
      } else {
        tailGradient = this.skinColour3;
      }
    } else if (!this.albino && !this.hairless) {
      tailGradient = ctx.createRadialGradient(0, this.size, 1, 0, 0, this.size * 4);
      tailGradient.addColorStop(0, trueBlack);
      if (this.bodypartCode[6] == 0) {
        tailGradient.addColorStop(0, this.secondColour);
        tailGradient.addColorStop(this.coatMod[0], this.firstColour);
        tailGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[6] == 1) {
        tailGradient.addColorStop(0, this.thirdColour);
        tailGradient.addColorStop(this.coatMod[0], this.secondColour);
        tailGradient.addColorStop(1, this.secondColour);
      } else {
        tailGradient.addColorStop(0, this.firstColour);
        tailGradient.addColorStop(this.coatMod[0], this.thirdColour);
        tailGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino) {
      tailGradient = trueWhite;
    } else {
      tailGradient = skinPink;
    }

    // === DRAW OUTLINE AND FILL ===
    ctx.fillStyle = tailGradient;
    ctx.lineWidth = 2 * this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(+this.size / 3, (this.size / 3));
    ctx.arc((this.size * (-tmp + 7.5) * this.tailLength / 8 * this.thickness) - (this.size / 32), (this.size / 3) - (2 * this.tailLength * this.size), (this.size / 3 * this.thickness * 2), 0, Math.PI, true);
    ctx.lineTo(-this.size / 3, this.size / 3);
    ctx.stroke();
    ctx.fill();

    // === PATTERN OVERLAY ===
    if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = this.patternAlpha;
      ctx.beginPath();
      ctx.moveTo(+this.size / 3, (this.size / 3));
      ctx.arc((this.size * (-tmp + 7.5) * this.tailLength / 8 * this.thickness) - (this.size / 32), (this.size / 3) - (2 * this.tailLength * this.size), (this.size / 3 * this.thickness * 2), 0, Math.PI, true);
      ctx.lineTo(-this.size / 3, this.size / 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // === ADDITIONAL DETAILS ===
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(butthole, -(this.size / 3), -this.size / 3, this.size / 1.5, this.size / 1.5);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  this.drawBackLegs = function (pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle) {
    let footPat = pat;
    if (this.awake && this.energy > 0) {
      let leftFootColour = trueWhite;
      let rightFootColour = trueWhite;
      if (this.hairless) {
        if (this.bodypartCode[7] == 0) {
          leftFootColour = this.skinColour1;
        } else if (this.bodypartCode[7] == 1) {
          leftFootColour = this.skinColour2;
        } else {
          leftFootColour = this.skinColour3;
        }
        if (this.bodypartCode[8] == 0) {
          rightFootColour = this.skinColour1;
        } else if (this.bodypartCode[8] == 1) {
          rightFootColour = this.skinColour2;
        } else {
          rightFootColour = this.skinColour3;
        }
      }
      if (!this.albino && !this.hairless) {
        leftFootColour = this.firstColour;
        rightFootColour = this.firstColour;
        if (this.bodypartCode[7] == 0) {
          leftFootColour = this.firstColour;
        } else if (this.bodypartCode[7] == 1) {
          leftFootColour = this.secondColour;
        } else {
          leftFootColour = this.thirdColour;
        }

        if (this.bodypartCode[8] == 0) {
          rightFootColour = this.firstColour;
        } else if (this.bodypartCode[8] == 1) {
          rightFootColour = this.secondColour;
        } else {
          rightFootColour = this.thirdColour;
        }
      } else if (this.albino && this.hairless) {
        leftFootColour = skinPink;
        rightFootColour = skinPink;
      }
      ctx.lineWidth = (this.size / 2.5) * this.thickness * 2;
      ctx.save(); // 0 open - rotated
      ctx.translate(this.x - backendShiftX, this.y - backendShiftY);
      if (!this.hitBottom) {
        ctx.rotate(this.rotation);
      }
      // back legs
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth += this.cellShadeThickness;

      ctx.save(); // 1 open
      ctx.translate(-(this.size / 2.5), (this.size / 2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus + (90 * Math.PI / 180));
        } else {
          ctx.rotate(legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sittingProgress > 0) {
        ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
      } else {
        ctx.moveTo(0, 0);
      }

      ctx.lineTo(0, this.limbLength * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength * 0.6, (this.size / 3.5 * this.thickness * 2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close

      ctx.save(); // 1 open
      ctx.translate((this.size / 2.5), (this.size / 2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus + (90 * Math.PI / 180));
        } else {
          ctx.rotate(-legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sittingProgress > 0) {
        ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength * 0.6, (this.size / 3.5 * this.thickness * 2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close
      ctx.lineWidth -= this.cellShadeThickness;
      // REAL DRAWING
      ctx.strokeStyle = bodyGradient;
      ctx.fillStyle = bodyGradient;
      // don't rotate if we have hit the bottom
      ctx.save(); // 1 open
      ctx.translate(-(this.size / 2.5), (this.size / 2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus + (90 * Math.PI / 180));
        } else {
          ctx.rotate(legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sittingProgress > 0) {
        ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength * 0.6);
      ctx.stroke();
      ctx.fillStyle = leftFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albino && this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        if (this.awake && this.sittingProgress > 0) {
          ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
        } else {
          ctx.moveTo(0, 0);
        }
        ctx.lineTo(0, this.limbLength * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore(); // 1 close
      ctx.save(); // 1 open
      ctx.translate((this.size / 2.5), (this.size / 2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus + (90 * Math.PI / 180));
        } else {
          ctx.rotate(-legAngle);
        }
      }
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      if (this.awake && this.sittingProgress > 0) {
        ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength * 0.6);
      ctx.stroke();
      ctx.fillStyle = rightFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albino && this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        if (this.awake && this.sittingProgress > 0) {
          ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
        } else {
          ctx.moveTo(0, 0);
        }
        ctx.lineTo(0, this.limbLength * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore(); // 1 close
      ctx.restore(); // 0 close
    }
  };

  this.drawIcons = function () {
    ctx.save(); // 0
    ctx.translate(this.x, this.y);
    // zzzzs
    if (!this.awake) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      let amntToMove = this.energy; // 0 to 10
      while (amntToMove > 10) {
        amntToMove -= 10;
      }
      while (amntToMove < 0) {
        amntToMove += 10;
      }
      ctx.globalAlpha = (1 - (amntToMove / 10)) / 2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size - amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size - 7 - amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size - 14 - amntToMove);
    }

    // hearts
    if (this.snuggling > 0) {
      ctx.fillStyle = '#e94db5';
      ctx.font = '20px' + ' ' + globalFont;
      let amntToMove = this.snuggling; // 0 to 250
      while (amntToMove > 40) {
        amntToMove -= 40;
      }
      while (amntToMove < 0) {
        amntToMove += 40;
      }
      ctx.globalAlpha = (1 - (amntToMove / 40)) / 2;
      amntToMove *= 1;
      ctx.fillText(unicodeHeart, -10, -(this.size * 4) + amntToMove);
    }

    // eating noms
    if (this.nomnomnom > 0) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      let alphaShift = this.nomnomnom; // 0 to 250
      while (alphaShift > 40) {
        alphaShift -= 40;
      }
      while (alphaShift < 0) {
        alphaShift += 40;
      }
      ctx.globalAlpha = (1 - (alphaShift / 40)) / 2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(0.5);
        ctx.fillText('*nom*', -25, -this.size);
        ctx.restore();
      }
      ctx.globalAlpha = alphaShift / 40 / 2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(-0.5);
        ctx.fillText('*nom*', -2, -this.size);
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
    ctx.restore(); // 0
  };

  this.drawBody = function (pat, backendShiftX, backendShiftY, bodyGradient) {
    // === BODY ANIMATION CALCULATIONS ===
    let tmp = Math.abs(daytimeCounter - this.birthday);
    while (tmp > 15 && tmp > 0) {
      tmp -= 15; // 0 to 30
    }
    tmp *= 0.5;
    tmp = Math.abs(tmp - 3.75); // -0 to -3.75 to 0 to 3.75 (butt wagging)

    // === SETUP DRAWING STYLE ===
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = 2 * this.cellShadeThickness;

    if (this.awake && this.sittingProgress > 0) {
      // === SITTING POSITION - INTERPOLATED ===
      let sittingOffset = this.sittingProgress;

      // DRAW OUTLINE AND FILL - BUTT
      ctx.beginPath();
      ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // DRAW OUTLINE AND FILL - BELLY
      ctx.beginPath();
      ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // === PATTERN OVERLAY - SITTING ===
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        // Pattern - butt
        ctx.beginPath();
        ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
        // Pattern - belly
        ctx.beginPath();
        ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();

        // Special pattern effects
        if (this.pattern == 3) {
          let fadeGrad = ctx.createLinearGradient(0, -(this.size + (this.thickness * this.size / 2)) / 2, 0, (this.size + (this.thickness * this.size / 2)));
          fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
          fadeGrad.addColorStop(1, this.firstColour);
          ctx.fillStyle = fadeGrad;
          ctx.beginPath();
          ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
          ctx.fill();
        }
        if (this.pattern == 6) {
          let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
          ctx.globalAlpha = 0.5;
          bGradient.addColorStop(0, this.thirdColour);
          bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = bGradient;
          ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
          ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    } else if (this.awake) {
      // === STANDING POSITION ===

      // DRAW OUTLINE AND FILL - BUTT
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // DRAW OUTLINE AND FILL - BELLY
      ctx.beginPath();
      ctx.arc(-(this.size / 32) - backendShiftX / 4, - backendShiftY / 4, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // === PATTERN OVERLAY - STANDING ===
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size / 32) - backendShiftX / 4, - backendShiftY / 4, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();

        // Special pattern effects
        if (this.pattern == 3) {
          let fadeGrad = ctx.createLinearGradient(0, -(this.size + (this.thickness * this.size / 2)) / 2, 0, (this.size + (this.thickness * this.size / 2)));
          fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
          fadeGrad.addColorStop(1, this.firstColour);
          ctx.fillStyle = fadeGrad;
          ctx.beginPath();
          ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
          ctx.fill();
        }
        if (this.pattern == 6) {
          let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
          ctx.globalAlpha = 0.5;
          bGradient.addColorStop(0, this.thirdColour);
          bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = bGradient;
          ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
  };

  this.drawChest = function (pat, backendShiftX, backendShiftY, bodyGradient) {
    if (this.awake && this.sittingProgress < 1) {
      // Scale chest down to 0% when sitting
      let chestScale = 1 - this.sittingProgress; // 0 when sitting, 1 when standing
      let bgY = this.size / 2;
      let fgY = bgY + (this.size * 0.9 - bgY) * chestScale; // scale the offset
      // Chest
      ctx.globalAlpha = 1;
      // REAL DRAWING
      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = 2 * this.cellShadeThickness;
      ctx.beginPath();
      ctx.arc(0, bgY, (this.size + (this.thickness * this.size / 5)) * chestScale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // chest coloured piece
      // default works for albino
      let chestColour = bodyGradient;
      if (this.albino && this.hairless) {
        chestColour = skinPink;
      } else if (this.hairless) {
        if (this.bodypartCode[12] == 0) {
          chestColour = this.skinColour1;
        } else if (this.bodypartCode[12] == 1) {
          chestColour = this.skinColour2;
        } else {
          chestColour = this.skinColour3;
        }
      } else if (!this.albino && !this.hairless) {
        if (this.bodypartCode[12] == 0) {
          chestColour.addColorStop(0, this.secondColour);
          chestColour.addColorStop(this.coatMod[0], this.firstColour);
          chestColour.addColorStop(0.5, this.firstColour);
        } else if (this.bodypartCode[12] == 1) {
          chestColour.addColorStop(0, this.thirdColour);
          chestColour.addColorStop(this.coatMod[0], this.secondColour);
          chestColour.addColorStop(0.5, this.secondColour);
        } else {
          chestColour.addColorStop(0, this.firstColour);
          chestColour.addColorStop(this.coatMod[0], this.thirdColour);
          chestColour.addColorStop(0.5, this.thirdColour);
        }
      }
      ctx.fillStyle = chestColour;
      ctx.beginPath();
      ctx.arc(0, fgY, ((this.size + (this.thickness * this.size / 5)) / 1.5) * chestScale, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        // Scale chest pattern to match chest scaling
        ctx.beginPath();
        ctx.arc(0, bgY, (this.size + (this.thickness * this.size / 5)) * chestScale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.rotate(this.rotation);
    }
  };

  this.drawHead = function (pat, sleepshift) {
    let jowlPat = pat;
    // ears
    ctx.globalAlpha = 1;
    ctx.save(); // 0
    if (this.awake) {
      ctx.translate(-this.size, -this.size / 2);
    } else {
      ctx.translate(-this.size, sleepshift);
    }
    oneq = this.size / 2;
    let leftEarGradient = trueWhite;
    let rightEarGradient = trueWhite;
    if (this.hairless) {
      if (this.bodypartCode[3] == 0) {
        leftEarGradient = this.skinColour1;
      } else if (this.bodypartCode[3] == 1) {
        leftEarGradient = this.skinColour2;
      } else {
        leftEarGradient = this.skinColour3;
      }
      if (this.bodypartCode[4] == 0) {
        rightEarGradient = this.skinColour1;
      } else if (this.bodypartCode[4] == 1) {
        rightEarGradient = this.skinColour2;
      } else {
        rightEarGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.hairless) {
      leftEarGradient = ctx.createLinearGradient(0, -this.size - (this.size * this.earWidth / 2), 0, this.limbLength / 4);
      rightEarGradient = ctx.createLinearGradient(0, -this.size - (this.size * this.earWidth / 2), 0, this.limbLength / 4);
      if (this.bodypartCode[3] == 0) {
        leftEarGradient.addColorStop(0, this.secondColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.firstColour);
        leftEarGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[3] == 1) {
        leftEarGradient.addColorStop(0, this.thirdColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.secondColour);
        leftEarGradient.addColorStop(1, this.secondColour);
      } else {
        leftEarGradient.addColorStop(0, this.firstColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.thirdColour);
        leftEarGradient.addColorStop(1, this.thirdColour);
      }
      if (this.bodypartCode[4] == 0) {
        rightEarGradient.addColorStop(0, this.secondColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.firstColour);
        rightEarGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[4] == 1) {
        rightEarGradient.addColorStop(0, this.thirdColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.secondColour);
        rightEarGradient.addColorStop(1, this.secondColour);
      } else {
        rightEarGradient.addColorStop(0, this.firstColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.thirdColour);
        rightEarGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      leftEarGradient = skinPink;
      rightEarGradient = skinPink;
    }
    ctx.fillStyle = leftEarGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = this.cellShadeThickness;
    ctx.beginPath();
    ctx.moveTo(0, +this.size / 2);
    ctx.lineTo(-(this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
    ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = rightEarGradient;
    ctx.beginPath();
    ctx.moveTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
    ctx.lineTo(oneq * 4, +this.size / 2);
    ctx.stroke();
    ctx.fill();
    if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = this.patternAlpha;
      ctx.beginPath();
      ctx.moveTo(0, +this.size / 2);
      ctx.lineTo(-(this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
      ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
      ctx.lineTo(oneq * 4, +this.size / 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // skin inside the ear
    if (this.facingForwards && this.awake) {
      ctx.fillStyle = this.skinColour1;
      ctx.strokeStyle = this.cellShadeLine;
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
    if (this.awake && this.sittingProgress > 0) {
      ctx.translate(0, ((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    } else if (!this.awake) {
      ctx.translate(0, sleepshift);
    }
    let s = this.size * 6;
    let maxWidth = Math.sqrt(s * s + s * s) / 2;
    let headGradient = trueWhite;
    if (this.hairless) {
      if (this.bodypartCode[2] == 0) {
        headGradient = this.skinColour1;
      } else if (this.bodypartCode[2] == 1) {
        headGradient = this.skinColour2;
      } else {
        headGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.hairless) {
      headGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1] * 6.3) * maxWidth, // start pos
        + Math.sin(this.coatMod[1] * 6.3) * maxWidth,
        - Math.cos(this.coatMod[1] * 6.3) * maxWidth, // end pos
        - Math.sin(this.coatMod[1] * 6.3) * maxWidth
      );
      if (this.bodypartCode[2] == 0) {
        headGradient.addColorStop(0, this.secondColour);
        headGradient.addColorStop(this.coatMod[0], this.firstColour);
        headGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[2] == 1) {
        headGradient.addColorStop(0, this.thirdColour);
        headGradient.addColorStop(this.coatMod[0], this.secondColour);
        headGradient.addColorStop(1, this.secondColour);
      } else {
        headGradient.addColorStop(0, this.firstColour);
        headGradient.addColorStop(this.coatMod[0], this.thirdColour);
        headGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      headGradient = skinPink;
    }
    if (this.awake && this.sittingProgress > 0) {
      ctx.translate(0, -((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    } else if (!this.awake) {
      ctx.translate(0, -sleepshift);
    }
    if (this.awake) {
      // awake mode
      ctx.save();
      ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.lineWidth = 2 * this.cellShadeThickness;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // draw the pattern image
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
        // colourpoint
      } else if (this.pattern == 4) {
        let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2 * this.patternAlpha, 0, 0, this.size * this.patternAlpha);
        faceGradient.addColorStop(0, this.firstColour);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // additional gradient on top for tabby
      if (this.pattern == 3) {
        let fadeGrad = ctx.createLinearGradient(0, -this.size / 2, 0, this.size);
        fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
        fadeGrad.addColorStop(1, this.firstColour);
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // additional gradient on top for bengal / mau pattern
      if (this.pattern == 6) {
        let faceGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
        ctx.globalAlpha = 0.5;
        faceGradient.addColorStop(0, this.thirdColour);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // draw lykoi skin coloured face on top
      if (this.lykoi) {
        let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2 * this.patternAlpha, 0, 0, this.size * this.patternAlpha);
        faceGradient.addColorStop(0, skinPink);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();

      if (this.facingForwards && this.inCatBox == null && this !== experiment) {
        // smile
        if (this.health >= 50 && !this.elder && this.energy > 0) {
          ctx.globalAlpha = this.love / 100;
          if (this.gender == 'Female') {
            ctx.drawImage(smile, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          } else if (this.gender == 'Male') {
            ctx.drawImage(smile2, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          } else if (this.gender == 'Non Binary') {
            ctx.drawImage(smile3, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          }
          ctx.globalAlpha = 1;
        }
      }
    } else {
      // sleep mode
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, this.limbLength + (this.size / 2), this.size + this.cellShadeThickness, 3.15, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(0, this.limbLength + (this.size * 0.6), this.size, 3.15, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(0, this.limbLength + (this.size * 0.6), this.size, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
    // eyes
    if (this.awake && this.facingForwards) {
      let temp = daytimeCounter;
      while (temp > 100) {
        temp -= 100;
      }
      let temp2 = this.birthday;
      while (temp2 > 100) {
        temp2 -= 100;
      }
      if (((this.snuggling >= 0 || this.nomnomnom >= 0) && this.age >= maturesAt) || (temp > temp2 - 1.5 && temp < temp2 + 1.5)) {
        ctx.save();
        ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
        ctx.drawImage(content, -this.size, -this.size, this.size * 2, this.size * 2);
        ctx.restore();
      } else {
        diffy = 0.5;
        ctx.save(); // 0 open
        if (this.energy > 0) {
          let glowingeyes = false;
          let glowalpha = 0;
          let closestfly = null;
          // Eyes glow when firefly is nearby (including cats in adoption boxes)
          closestfly = fireflies[this.findClosestFireFly()];
          let diffx = Math.abs(this.x - closestfly.x);
          let diffy = Math.abs(this.y - closestfly.y);
          if (diffx <= 100 && diffy <= 100) {
            glowingeyes = true;
            let absolute = Math.sqrt((diffy * diffy) + (diffx * diffx)); // 0 to 100
            glowalpha = 0.6 * (1 - (absolute / (Math.sqrt(20000))));
          }
          // REAL DRAWING
          // left eye
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 4;
          ctx.translate(-(this.size * this.eyePosX * 0.3) - this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
          ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          if (glowingeyes) {
            ctx.globalAlpha = 1 - glowalpha;
          }
          // eye colour
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour;
          } else {
            ctx.strokeStyle = albinoRed;
          }
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
          if (glowingeyes && closestfly) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * this.eyeSize);
            glow.addColorStop(0, closestfly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
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
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 4;
          ctx.save(); // 0 open
          ctx.translate((this.size * this.eyePosX * 0.3) + this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
          ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          // eye colour
          if (glowingeyes) {
            ctx.globalAlpha = (1 - glowalpha);
          }
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour2;
          } else {
            ctx.strokeStyle = albinoRed;
          }
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
          if (glowingeyes && closestfly) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
            glow.addColorStop(0, closestfly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
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
        }
        ctx.restore(); // 0 closed
      }
    }

    // jowl
    if (this.awake && this.facingForwards) {
      // chin
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // real drawing
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = skinPink;
      } else if (this.hairless) {
        if (this.bodypartCode[11] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[11] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.hairless) {
        if (this.bodypartCode[11] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[11] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc(0, (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5, (this.size / 3.5), 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(0, (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5, (this.size / 3.5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // fangs
      // cellshading
      ctx.strokeStyle = this.cellShadeLine;
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

      // jowls
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();

      // real drawing
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = skinPink;
      } else if (this.hairless) {
        if (this.bodypartCode[9] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[9] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.hairless) {
        if (this.bodypartCode[9] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[9] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = nosePink;
      } else if (this.hairless) {
        if (this.bodypartCode[10] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[10] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.hairless) {
        if (this.bodypartCode[10] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[10] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // === T-SHAPED NOSE (uses nose-specific colors, not skin colors) ===
      let noseX = 0;
      let noseY = (this.size * (this.nosePos - 0.5) / 2) + (this.size / 2.5);
      let noseWidth = this.size / 1.75;
      let noseHeight = this.size / 4;
      let noseVertWidth = this.size / 6;
      let noseVertHeight = this.size / 2.5;

      // Draw T-shaped nose outline (cellshading)
      ctx.fillStyle = this.cellShadeLine;
      ctx.lineWidth = this.cellShadeThickness;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.beginPath();
      // Top horizontal bar of T
      ctx.rect(-noseWidth / 2 - this.cellShadeThickness, noseY - noseHeight - this.cellShadeThickness, noseWidth + (this.cellShadeThickness * 2), noseHeight + (this.cellShadeThickness * 2));
      // Vertical bar of T  
      ctx.rect(-noseVertWidth / 2 - this.cellShadeThickness, noseY - noseHeight - this.cellShadeThickness, noseVertWidth + (this.cellShadeThickness * 2), noseVertHeight + (this.cellShadeThickness * 2));
      ctx.fill();

      // Draw T-shaped nose fill using nose-specific color
      ctx.fillStyle = this.noseColour;
      ctx.beginPath();
      // Top horizontal bar of T
      ctx.rect(-noseWidth / 2, noseY - noseHeight, noseWidth, noseHeight);
      // Vertical bar of T
      ctx.rect(-noseVertWidth / 2, noseY - noseHeight, noseVertWidth, noseVertHeight);
      ctx.fill();
    }
  };

  this.drawFrontFeet = function (pat) {
    let footPat = pat;
    let footSize = this.size / 3.5 * this.thickness * 2.25;
    let leftHandGradient = trueWhite;
    let rightHandGradient = trueWhite;
    // sphynx
    if (this.hairless) {
      if (this.bodypartCode[0] == 0) {
        leftHandGradient = this.skinColour1;
      } else if (this.bodypartCode[0] == 1) {
        leftHandGradient = this.skinColour2;
      } else {
        leftHandGradient = this.skinColour3;
      }
      if (this.bodypartCode[1] == 0) {
        rightHandGradient = this.skinColour1;
      } else if (this.bodypartCode[1] == 1) {
        rightHandGradient = this.skinColour2;
      } else {
        rightHandGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.hairless) {
      if (this.bodypartCode[0] == 0) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        leftHandGradient.addColorStop(0, this.secondColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        leftHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[0] == 1) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        leftHandGradient.addColorStop(0, this.thirdColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        leftHandGradient.addColorStop(1, this.secondColour);
      } else {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        leftHandGradient.addColorStop(0, this.firstColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        leftHandGradient.addColorStop(1, this.thirdColour);
      }

      if (this.bodypartCode[1] == 0) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        rightHandGradient.addColorStop(0, this.secondColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        rightHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[1] == 1) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        rightHandGradient.addColorStop(0, this.thirdColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        rightHandGradient.addColorStop(1, this.secondColour);
      } else {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2));
        rightHandGradient.addColorStop(0, this.firstColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        rightHandGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      leftHandGradient = skinPink;
      rightHandGradient = skinPink;
    }
    ctx.lineWidth = 2 * this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;

    // if we are awake on a floor
    if (this.awake && this.hitBottom) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // REAL DRAWING
      ctx.fillStyle = leftHandGradient;
      ctx.beginPath();
      ctx.arc(-(this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = rightHandGradient;
      ctx.beginPath();
      ctx.arc((this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
        ctx.arc((this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.focus && this.awake && this.hitFocus) {
        ctx.fillStyle = leftHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = rightHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        // REAL DRAWING
        // left arm
        ctx.fillStyle = leftHandGradient;
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // jelly beans / toe pads
        if (this.focus && this.facingForwards && this.y > this.focus.y) {
          // uniformly scale the pads so that it looks like the feet are reaching towards the focus
          ctx.save();
          let scaleY = 1;
          if (this.y - (this.size * 10) < this.focus.y) {
            scaleY = (this.y - this.focus.y) / this.size / 10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize / 10, footSize / 1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }

        ctx.restore(); // closed

        // right arm
        ctx.fillStyle = rightHandGradient;
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // jelly beans
        if (this.focus && this.facingForwards && this.y > this.focus.y) {
          ctx.save();
          // uniformly scale the pads
          // Debug: Force cats in boxes to have neutral limb position
          if (this.inCatBox) {
            ctx.translate(0, (footSize / 2) + this.limbLength);
          } else {
            ctx.translate(this.limbLength * Math.cos(this.angleToFocus), (footSize / 2) + (this.limbLength * Math.sin(this.angleToFocus)));
          }
          let scaleY = 1;
          if (this.y - (this.size * 10) < this.focus.y) {
            scaleY = (this.y - this.focus.y) / this.size / 10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize / 10, footSize / 1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore(); // closed
      }
    }
  };

  this.drawFrontLegs = function (bodyGradient, pat) {
    ctx.globalAlpha = 1;
    let footSize = this.size / 3.5 * this.thickness * 2.25;
    // front legs
    ctx.lineWidth = (this.size / 2.5) * this.thickness * 2;
    // if we are awake on a floor
    if (this.awake && this.hitBottom && this.sittingProgress < 1) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // cell shading
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth += this.cellShadeThickness;
      ctx.beginPath();
      ctx.moveTo(-this.size * 1 / 2, (this.size / 4));
      // Shrink front legs from top as cat sits - bottom stays in place
      let frontLegBottom = this.limbLength - footSize / 2;
      let frontLegTop = (this.size / 4);
      let shrunkLegEnd = frontLegTop + (frontLegBottom - frontLegTop) * (1 - this.sittingProgress);
      ctx.lineTo(-this.size * 1 / 2, shrunkLegEnd);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.size * 1 / 2, (this.size / 4));
      ctx.lineTo(this.size * 1 / 2, shrunkLegEnd);
      ctx.stroke();
      // real drawing
      ctx.lineWidth -= this.cellShadeThickness;
      ctx.strokeStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(-this.size * 1 / 2, (this.size / 4));
      ctx.lineTo(-this.size * 1 / 2, shrunkLegEnd);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.size * 1 / 2, (this.size / 4));
      ctx.lineTo(this.size * 1 / 2, shrunkLegEnd);
      ctx.stroke();
      // pattern
      if (!this.albino && this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.moveTo(-this.size * 1 / 2, (this.size / 4));
        ctx.lineTo(-this.size * 1 / 2, this.limbLength - footSize / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.size * 1 / 2, (this.size / 4));
        ctx.lineTo(this.size * 1 / 2, this.limbLength - footSize / 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.focus && this.awake && this.hitFocus) {
        // CELL SHADING
        ctx.strokeStyle = this.cellShadeLine;
        ctx.lineWidth += this.cellShadeThickness;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.strokeStyle = bodyGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        if (!this.albino && this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.strokeStyle = pat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        ctx.strokeStyle = this.cellShadeLine;
        ctx.lineWidth += this.cellShadeThickness;
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = bodyGradient;
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        if (!this.albino && this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.strokeStyle = pat;
          ctx.globalAlpha = this.patternAlpha;
          // left arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
          // right arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
          ctx.globalAlpha = 1;
        }
      }
    }
  };
  this.update = function () {
    ctx.save();
    let pat = pat0;
    if (this.pattern == 1) {
      pat = pat1;
    } else if (this.pattern == 2) {
      pat = pat2;
    } else if (this.pattern == 3) {
      pat = pat3;
    } else if (this.pattern == 6) {
      pat = pat6;
    } else if (this.pattern == 7) {
      pat = pat7;
    }
    ctx.setTransform(100 / this.size, 0, 0, 100 / this.size, 0, 0);
    ctx.restore();
    /* new gradient opps */
    ctx.save();
    ctx.translate(this.x, this.y);
    let bodyGradient = trueWhite;
    // Hairless
    if (this.hairless) {
      if (this.bodypartCode[5] == 0) {
        bodyGradient = this.skinColour1;
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient = this.skinColour2;
      } else {
        bodyGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.hairless) {
      let s = this.size * 6;
      let maxWidth = Math.sqrt(s * s + s * s) / 2;
      bodyGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1] * 6) * maxWidth, // start pos
        + Math.sin(this.coatMod[1] * 6) * maxWidth,
        - Math.cos(this.coatMod[1] * 6) * maxWidth, // end pos
        - Math.sin(this.coatMod[1] * 6) * maxWidth
      );
      if (this.bodypartCode[5] == 0) {
        bodyGradient.addColorStop(0, this.secondColour);
        bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
        bodyGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient.addColorStop(0, this.thirdColour);
        bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
        bodyGradient.addColorStop(1, this.secondColour);
      } else {
        bodyGradient.addColorStop(0, this.firstColour);
        bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
        bodyGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      bodyGradient = nosePink;
    }
    ctx.restore();


    /* focus lines */
    // if (this.focus !== null) {
    // ctx.strokeStyle = trueWhite;
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(this.focus.x, this.focus.y);
    // ctx.stroke();
    // }
    this.hitFocus = this.focus ? detectCollision(this, this.focus) : false;
    let backendShiftX = this.size * this.speedX / 30;
    let backendShiftY = this.size * this.speedY / 30;
    if (backendShiftY > trueBottom - this.y) {
      backendShiftY = trueBottom - this.y;
    }
    if (this.awake && !this.hitBottom && this.hitFocus) {
      backendShiftY = -this.size / 4;
    }
    // calculate angle to focus
    if (this.focus) {
      this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
      diffx = Math.cos(this.angleToFocus) * 4;
      diffy = Math.sin(this.angleToFocus) * 4;
    } else {
      // For cats without focus (like those in catboxes), use a neutral downward angle
      this.angleToFocus = this.inCatBox ? Math.PI / 2 : 0;
      diffx = 0;
      diffy = 0;
    }

    // Force neutral angle for cats in catboxes regardless of focus
    if (this.inCatBox) {
      this.angleToFocus = Math.PI / 2;
    }
    // setting leg angle
    let sameDirection = false;
    let offsetX = this.focus ? Math.abs(this.focus.x - this.x) : 0;
    let legAngle = Math.atan2(this.speedY, this.speedX);

    if (this.inCatBox == null && this.awake && this.mother !== null && this.age < maturesAt && this.hitBottom && this.mother.snuggling == -1 && detectCollision(this, this.mother)) {
      this.speedX = 0;
      this.speedY = 0;
      if (this.mother.awake && this.nomnomnom == -1 && this.health < 50) {
        this.mother.energy -= 5;
        this.mother.love += 5;
        this.mother.speedX = 0;
        this.mother.speedY = 0;
        this.mother.sitting = true;
        this.nomnomnom = 50;
        this.mother.facingForwards = true;
        // sendMessage(this.mother.name + ' fed '+ this.name);
        gainMeter(this);
      }
    }
    for (let f = 0; f < fireflies.length; f++) {
      if (this.inCatBox == null && this.focus == fireflies[f] && !this.hitBottom && !fireflies[f].touchedThisFrame && this.awake && this.energy > 0 && this.snuggling == -1 && this.nomnomnom == -1 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        fireflies[f].chooseNewTarget(); // Force firefly to choose new target when touched
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX * this.size) / 1500;
        fireflies[f].speedY += (this.speedY * this.size) / 2000;// + (0.002 * this.size);
        gainMeter(this);
        this.facingForwards = true;
        if (this.health >= 100 && this.love >= 100 && this.energy >= 100) {
          // let go of the FireFly
          this.speedY = -this.size * 2;
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
          if (this.speedX < 10 && this.speedX > -10 && this.speedY < 10 & this.speedY > -10) {
            // legAngle = -1.6;
          }
        }
      }
    }
    legAngle = this.focus ? Math.atan2(this.focus.y - this.y, offsetX) : Math.atan2(this.speedY, this.speedX);
    if (legAngle < -0.2) {
      sameDirection = true;
    }

    // drawing
    ctx = myGameArea.context;
    ctx.globalAlpha = 1;
    let sleepshift = 0;
    if (!this.awake) {
      sleepshift = this.limbLength + (this.size / 4);
    }
    if (this.facingForwards) {
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
    }
    // translate before drawing again
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);
    if (this.facingForwards) {
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }
    if (this.hitBottom && this.sittingProgress > 0) {
      ctx.translate(0, ((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    }
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
    }
    if (this.facingForwards) {
      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.translate(-this.x, -this.y);
    this.drawFrontLegs(bodyGradient, pat);
    ctx.translate(this.x, this.y);
    // rotate around axis and move a bit before drawing head parts
    ctx.translate(0, -this.size / 2);
    if (!this.facingForwards) {
      this.drawFrontFeet(pat);
    }
    if (this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.rotate(this.rotation);
    this.drawHead(pat, sleepshift);
    ctx.rotate(-this.rotation);
    if (!this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    if (!this.facingForwards) {
      ctx.translate(-this.x, -this.y);
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
      ctx.translate(this.x, this.y);
      bodyGradient = trueWhite;
      // sphynx
      if (this.hairless) {
        if (this.bodypartCode[5] == 0) {
          bodyGradient = this.skinColour1;
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient = this.skinColour2;
        } else {
          bodyGradient = this.skinColour3;
        }
      }
      if (!this.albino && !this.hairless) {
        let s = this.size * 6;
        let maxWidth = Math.sqrt(s * s + s * s) / 2;
        bodyGradient = ctx.createLinearGradient(
          + Math.cos(this.coatMod[1] * 6) * maxWidth, // start pos
          + Math.sin(this.coatMod[1] * 6) * maxWidth,
          - Math.cos(this.coatMod[1] * 6) * maxWidth, // end pos
          - Math.sin(this.coatMod[1] * 6) * maxWidth
        );
        if (this.bodypartCode[5] == 0) {
          bodyGradient.addColorStop(0, this.secondColour);
          bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
          bodyGradient.addColorStop(1, this.firstColour);
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient.addColorStop(0, this.thirdColour);
          bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
          bodyGradient.addColorStop(1, this.secondColour);
        } else {
          bodyGradient.addColorStop(0, this.firstColour);
          bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
          bodyGradient.addColorStop(1, this.thirdColour);
        }
      } else if (this.albino && this.hairless) {
        bodyGradient = skinPink;
      }

      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }

    ctx.restore(); // close
    if (this.facingForwards) {
      this.drawFrontFeet(pat);
    }

    this.drawIcons();
    ctx.globalAlpha = 1;

  };

  // Initialize mass and other size-dependent properties
  this.reinitSizeAndColour();
}

/**
* function to add meters to a chitten
* @param {Chitten} who - the chitten
*/
gainMeter = function (who) {
  if (who.energy < 100) {
    who.energy += 1;
  }
  if (who.love < 100) {
    who.love += 3;
  }
  if (who.health < 100) {
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
  // kill fruit that is being consumed
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == who) {
      fruits.splice(i, 1);
      i--;
    }
  }
  // decrease currentchittens if chosing a chitten to compensate for losing this one
  if (choosingChitten) {
    currentChittens--;
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

/** function to apply genetics and disorders to Chittens
* @param {Chitten} who - the chitten
*/
mutate = function (who) {
  // albino gene chance (4%)
  let albinoChance = Math.random();
  if (albinoChance <= 0.04) {
    who.albinoGene = true;
    // Don't set pattern or call mutateAlbino - let determineTraitExpression handle it
  }

  // heterochromic gene chance (3%)
  if (Math.random() <= 0.03) {
    who.heterochromicGene = true;
    // Don't automatically set different eye colors - let determineTraitExpression handle it
  }
};

/** function to determine if genetic traits should be expressed
* @param {Chitten} who - the chitten
*/
determineTraitExpression = function (who) {
  // Hairless gene expression (recessive - needs gene to be present)
  if (who.hairlessGene) {
    // Expression chance: 90% of gene carriers actually express hairlessness
    if (Math.random() <= 0.9) {
      who.hairless = true;
    }
  }

  // Lykoi gene expression (recessive - needs gene to be present) 
  if (who.lykoiGene && !who.hairless) { // Hairless dominates over Lykoi
    // Expression chance: 85% of gene carriers actually express lykoi trait
    if (Math.random() <= 0.85) {
      who.lykoi = true;
    }
  }

  // Albino gene expression (already handled in breeding, but check for adoption cats)
  if (who.albinoGene && !who.albino) {
    // Expression chance: 25% of gene carriers actually express albinism
    if (Math.random() <= 0.25) {
      who.albino = true;
    }
  }

  // Heterochromia gene expression
  if (who.heterochromicGene) {
    // Expression chance: 70% of gene carriers actually express heterochromia
    if (Math.random() <= 0.7) {
      // Generate different eye color
      let eyeColors = ['#00ff00', '#0000ff', '#ff0000', '#ffff00', '#ff00ff', '#00ffff'];
      who.eyeColour2 = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    }
  }
};

skinColourCheck = function (theColour) {
  let rgb = hexToRgb(theColour);
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  // Check for white cats (high brightness across all channels)
  if (r > 200 && g > 200 && b > 200) {
    return skinPink;
  }

  // Check for ginger/orange cats (red dominance)
  if (r > 150 && r > g * 1.3 && r > b * 1.5) {
    return skinPink;
  }

  // Check for brown cats (balanced warm tones)
  if (r > 80 && g > 60 && b < 100 && r >= g && g >= b) {
    return skinPink;
  }

  // All other colors (grey, black, etc.) get grey skin
  return skinGrey;
};

noseColourCheck = function (theColour) {
  let rgb = hexToRgb(theColour);
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  // Check for white cats (high brightness across all channels)
  if (r > 200 && g > 200 && b > 200) {
    return nosePink;
  }

  // Check for ginger/orange cats (red dominance)
  if (r > 150 && r > g * 1.3 && r > b * 1.5) {
    return nosePink;
  }

  // Check for brown cats (balanced warm tones)
  if (r > 80 && g > 60 && b < 100 && r >= g && g >= b) {
    return nosePink;
  }

  // All other colors (grey, black, etc.) get black nose
  return noseBlack;
};

/** function to create a random bodypartCode
* this code is used to denote the zones of colour on a Chitten
* @return {array} - the bodypart code
*/
randomBodyPartCode = function () {
  let tmpArray = [];
  for (let i = 0; i < 13; i++) {
    tmpArray.push(Math.round(Math.random() * 2));
  }
  return tmpArray;
};
