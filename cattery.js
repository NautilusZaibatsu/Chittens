
function initGenetics() {
}

function initChoiceBoxes() {
  labels[3].visible = true;
  if (!choosingChibi) {
    choiceTimer = 500;
  }
  selectionInfo.visible = false;
  choosingChibi = true;
  labels[0].visible = true;
  labels[1].visible = true;
  labels[2].visible = false;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  currentChibis = chibis.length;
  boxes = [];
  selection = null;
}

function initLitter(mParent, fParent) {
  initChoiceBoxes();
  sendMessage('\u2764 '+fParent.name+' gave birth to '+mParent.name+'\'s chittens');
  labels[0] = new Button(canvasWidth/2, 10, 'Choose one of '+fParent.name+' and '+mParent.name+'\'s litter to keep');
  labels[1] = new Button(canvasWidth/2, 45, 'The others will be adopted by nice people');
  maleParent = mParent;
  femaleParent = fParent;
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  buttons[2].visible = true;
  // random number of chittens (3-9)
  let numberInLitter = Math.round(3 + (Math.random()*6));
  let count = 0;
  for (let j = 0; j < boxRows; j++) {
    for (let i = 0; i < boxColumns && count < numberInLitter; i++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      generateBaby(maleParent, femaleParent);
      let thisCatBox = (j*3) + i;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].name = generateBabyName(maleParent.name, femaleParent.name, chibis[thisCatBox+currentChibis].gender);
      chibis[thisCatBox+currentChibis].mother = fParent;
      chibis[thisCatBox+currentChibis].size *= 2;
      chibis[thisCatBox+currentChibis].reinitSizes();
      chibis[thisCatBox+currentChibis].x = (canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2);
      chibis[thisCatBox+currentChibis].y = (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2);
      count++;
      noseColourCheck(chibis[thisCatBox+currentChibis]);
    }
  }
  // Pick of litter
  chibis[currentChibis].size *= 1.2;
  chibis[currentChibis].reinitSizes();
  boxes[0].text = 'Pick';
  // Runt of litter
  chibis[chibis.length-1].size *= 0.6;
  chibis[chibis.length-1].reinitSizes();
  chibis[chibis.length-1].maxSize *= 0.75;
  chibis[chibis.length-1].health *= 0.5;
  chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), chibis[chibis.length-1].firstColour, Math.random()*0.5);
  chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), chibis[chibis.length-1].secondColour, Math.random()*0.5);
  chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), chibis[chibis.length-1].thirdColour, Math.random()*0.5);
  noseColourCheck(chibis[chibis.length-1]);
  boxes[boxes.length-1].text = 'Runt';
}


function initFemaleCattery() {
  initChoiceBoxes();
  chosenChibiF = false;
  sendMessage('\u2764 Choose a female Chibi');
  labels[0] = new Button(canvasWidth/2, 10, 'Welcome to the Cattery');
  labels[1] = new Button(canvasWidth/2, 45, 'Choose a girl');
  buttons[0].visible = true;
  buttons[6].visible = true;
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)/1.1, 'Female', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].age = Math.round(Math.random()*5) + maturesAt;
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize*0.75+ (Math.random()*0.25*chibis[thisCatBox+currentChibis].maxSize);
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      let colourArray = generateRealisticCoat();
      chibis[thisCatBox+currentChibis].firstColour = colourArray[0];
      chibis[thisCatBox+currentChibis].secondColour = colourArray[1];
      chibis[thisCatBox+currentChibis].thirdColour = colourArray[2];
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = 50 + Math.round((Math.random()*50));
      chibis[thisCatBox+currentChibis].tailLength = (Math.random()*0.75)+0.25;
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
      chibis[thisCatBox+currentChibis].bodypartCode = randomBodyPartCode();
      applyGenetics(chibis[thisCatBox+currentChibis]);
      noseColourCheck(chibis[thisCatBox+currentChibis]);
      chibis[thisCatBox+currentChibis].nosePos = Math.random();
      chibis[thisCatBox+currentChibis].eyePosX = Math.random();
      chibis[thisCatBox+currentChibis].eyePosY = Math.random();
      chibis[thisCatBox+currentChibis].headWidth = Math.random();
      chibis[thisCatBox+currentChibis].headHeight = Math.random();
    }
  }
}

function initMaleCattery() {
  initChoiceBoxes();
  chosenChibiM = false;
  sendMessage('\u2764 Choose a male Chibi');
  labels[0] = new Button(canvasWidth/2, 10, 'Welcome to the Cattery');
  labels[1] = new Button(canvasWidth/2, 45, 'Choose a boy');
  buttons[0].visible = true;
  buttons[6].visible = true;
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)*1.1, 'Male', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].age = Math.round(Math.random()*5) + maturesAt;
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize*0.75 + (Math.random()*0.25*chibis[thisCatBox+currentChibis].maxSize);
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      let colourArray = generateRealisticCoat();
      chibis[thisCatBox+currentChibis].firstColour = colourArray[0];
      chibis[thisCatBox+currentChibis].secondColour = colourArray[1];
      chibis[thisCatBox+currentChibis].thirdColour = colourArray[2];
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = 50 + Math.round((Math.random()*50));
      chibis[thisCatBox+currentChibis].tailLength = (Math.random()*0.75)+0.25;
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
      chibis[thisCatBox+currentChibis].bodypartCode = randomBodyPartCode();
      applyGenetics(chibis[thisCatBox+currentChibis]);
      noseColourCheck(chibis[thisCatBox+currentChibis]);
      chibis[thisCatBox+currentChibis].nosePos = Math.random();
      chibis[thisCatBox+currentChibis].eyePosX = Math.random();
      chibis[thisCatBox+currentChibis].eyePosY = Math.random();
      chibis[thisCatBox+currentChibis].headWidth = Math.random();
      chibis[thisCatBox+currentChibis].headHeight = Math.random();
    }
  }
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
  this.update = function() {
    ctx.fillText(this.text, this.x+5, this.y+15);
    ctx.lineWidth = this.thickness;
    if (this.highlighted || this.selected) {
      ctx.strokeStyle = mixTwoColours(trueWhite, outputArray[2], 0.5);
      if (this.highlighted) {
        ctx.fillText(chibis[this.id].name, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2)+10);
        ctx.fillText('Age '+ chibis[this.id].age, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 25);
        ctx.fillText('Gender '+chibis[this.id].gender, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 40);
        let cString = '';
        if (chibis[this.id].albinism) {
          cString = 'Albino';
        } else {
          let c1 = ntc.name(chibis[this.id].firstColour)[1];
          let c2 = ntc.name(chibis[this.id].secondColour)[1];
          let c3 = ntc.name(chibis[this.id].thirdColour)[1];
          if (c1 == c2 & c1 == c3) {
            cString = c1;
          } else if (c1 == c2) {
            cString = c1 + ' & '+ c3;
          } else if (c1 == c3) {
            cString = c1 + ' & '+ c2;
          } else if (c2 == c3) {
            cString = c1 + ' & '+ c2;
          } else {
            cString = c1 +', '+c2+' & '+c3;
          }
        }
        ctx.fillText('Colour '+cString, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 55);
        ctx.fillText('Size '+Math.round((chibis[this.id].size)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 70);
        ctx.fillText('Max size '+Math.round((chibis[this.id].maxSize)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 85);
        ctx.fillText('Thickness '+Math.round((chibis[this.id].thickness*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 100);
        ctx.fillText('Legginess '+Math.round((chibis[this.id].legginess*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 115);
        ctx.fillText('Ear width '+Math.round((chibis[this.id].ears*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 130);
        ctx.fillText('Tail length '+Math.round((chibis[this.id].tailLength*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 145);
        ctx.fillText('Birthhour '+tickerToTime(Math.round(chibis[this.id].birthday)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 160);
        let ag = 'Negative';
        if (chibis[this.id].albinismGene) {
          ag = 'Positive';
        }
        ctx.fillText('Albino Gene '+ag, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 175);
      }
    } else {
      ctx.strokeStyle = outputArray[2];
    }
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(this.size, this.size);
    ctx.lineTo(0, this.size);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  };
  this.checkBounce = function(what) {
    if (what.inCatBox == this) {
      // if we bounce off a side wall
      if (what.x < this.x + what.size || what.x >= this.x + this.size - what.size) {
        what.speedX *= -0.9;
        let targetangle = Math.atan2(what.y, this.y);
        what.spin += elasticity*targetangle/10;
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
      if (what.y >= this.y + this.size -(what.size)-(what.limbLength/2.5)) {
        what.y = this.y + this.size -(what.size)-(what.limbLength/2.5);
        what.hitAFloor();
      }
    }
  };
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

/**
* function to collide two objects using physics
* @param {object} parent1 - the first parent
* @param {object} parent2 - the second parent
* @return {string} the gender of the baby
*/
function generateBaby(parent1, parent2) {
  // male is parent1
  // female is parent2
  let babyGender = randomGender();
  // max size logic
  let sizeSwitch = Math.round(Math.random()*2); // 0 to 2
  let specSize = 1;
  if (sizeSwitch == 0) {
    specSize = ((parent1.maxSize*9) + ((Math.random()*9) + 7))/10;
  } else if (sizeSwitch == 1) {
    specSize = ((parent2.maxSize*9) + ((Math.random()*9) + 7))/10;
  } else {
    specSize = (parent1.maxSize + parent2.maxSize + ((Math.random()*9) + 7))/3;
  }
  // thickness logic
  let thickSwitch = Math.round(Math.random()*2); // 0 to 2
  let specThickness = 1;
  if (thickSwitch == 0) {
    specThickness = ((parent1.thickness*9) + Math.random())/10;
  } else if (thickSwitch == 1) {
    specThickness = ((parent2.thickness*9) + Math.random())/10;
  } else {
    specThickness = (parent1.thickness + parent2.thickness + Math.random())/3;
  }
  // legginess logic
  let legSwitch = Math.round(Math.random()*2); // 0 to 2
  let specLegginess = 1;
  if (legSwitch == 0) {
    specLegginess = ((parent1.legginess*9) + Math.random())/10;
  } else if (legSwitch == 1) {
    specLegginess = ((parent2.legginess*9) + Math.random())/10;
  } else {
    specLegginess = (parent1.legginess + parent2.legginess + Math.random())/3;
  }

  // tail logic
  let tailSwitch = Math.round(Math.random()*2);
  let specTail = 1;
  if (tailSwitch == 0) {
    specTail = ((parent1.tailLength*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (tailSwitch == 1) {
    specTail = ((parent2.tailLength*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specTail = (parent1.tailLength + parent2.tailLength + ((Math.random()*0.75)+0.25))/3;
  }

  // nose position logic
  let noseSwitch = Math.round(Math.random()*2);
  let specNose = 1;
  if (noseSwitch == 0) {
    specNose = ((parent1.nosePos*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (noseSwitch == 1) {
    specNose = ((parent2.nosePos*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specNose = (parent1.nosePos + parent2.nosePos + ((Math.random()*0.75)+0.25))/3;
  }

  // eye position logic X
  let eyeSwitch = Math.round(Math.random()*2);
  let specEyeX = 1;
  if (eyeSwitch == 0) {
    specEyeX = ((parent1.eyePosX*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (eyeSwitch == 1) {
    specEyeX = ((parent2.eyePosX*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specEyeX = (parent1.eyePosX + parent2.eyePosX + ((Math.random()*0.75)+0.25))/3;
  }

  // eye position logic Y
  eyeSwitch = Math.round(Math.random()*2);
  let specEyeY = 1;
  if (eyeSwitch == 0) {
    specEyeY = ((parent1.eyePosY*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (eyeSwitch == 1) {
    specEyeY = ((parent2.eyePosY*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specEyeY = (parent1.eyePosY + parent2.eyePosY + ((Math.random()*0.75)+0.25))/3;
  }

  // head width
  let headSwitch = Math.round(Math.random()*2);
  let specHeadW = 1;
  if (headSwitch == 0) {
    specHeadW = ((parent1.headWidth*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (headSwitch == 1) {
    specHeadW = ((parent2.headWidth*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specHeadW = (parent1.headWidth + parent2.headWidth + ((Math.random()*0.75)+0.25))/3;
  }

  // head width
  headSwitch = Math.round(Math.random()*2);
  let specHeadH = 1;
  if (headSwitch == 0) {
    specHeadH = ((parent1.headHeight*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (headSwitch == 1) {
    specHeadH = ((parent2.headHeight*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specHeadH = (parent1.headHeight + parent2.headHeight + ((Math.random()*0.75)+0.25))/3;
  }

  // ear logic
  let earSwitch = Math.round(Math.random()*2); // 0 to 2
  let babyEars = 1;
  if (earSwitch == 0) {
    babyEars = ((parent1.ears*9) + Math.random())/10;
  } else if (earSwitch == 1) {
    babyEars = ((parent2.ears*9) + Math.random())/10;
  } else {
    babyEars = (parent1.ears + parent2.ears + Math.random())/3;
  }
  chibis.push(new Chibi(parent1.x + ((parent2.x - parent1.x)/2), parent1.y + ((parent2.y - parent1.y)/2), specSize/3, specSize, babyGender, babyEars));
  // set the baby's ears
  // set the baby's genetic colour
  let colour1 = 'red'; // for debug
  let colour2 = 'blue';
  let colour3 = 'green';
  // decide which method of colour logic to use for the genetic colour
  let seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour1 = parent1.firstColour;
  } else if (seed == 1) {
    colour1 = parent2.firstColour;
  } else {
    colour1 = mixTwoColours(parent1.firstColour, parent2.firstColour, 0.5);
  }
  // decide which method of colour logic to use for the second colour
  seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour2 = parent1.secondColour;
  } else if (seed == 1) {
    colour2 = parent2.secondColour;
  } else {
    colour2 = mixTwoColours(parent1.secondColour, parent2.secondColour, 0.5);
  }
  // decide which method of colour logic to use for the third colour
  seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour3 = parent1.thirdColour;
  } else if (seed == 1) {
    colour3 = parent2.thirdColour;
  } else {
    colour3 = mixTwoColours(parent1.thirdColour, parent2.thirdColour, 0.5);
  }
  // mix in a little random
  if (Math.random() < 0.25) {
    // flip the colours
    chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), colour3, Math.random()*0.2);
    chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), colour1, Math.random()*0.2);
    chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), colour2, Math.random()*0.2);
  } else {
    chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), colour1, Math.random()*0.2);
    chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), colour2, Math.random()*0.2);
    chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), colour3, Math.random()*0.2);
  }
  chibis[chibis.length-1].speedY = -25;
  // coat logic
  let coatSwitch = Math.round(Math.random()*2); // 0 to 2
  if (coatSwitch == 0) {
    chibis[chibis.length-1].coatMod[0] = ((parent1.coatMod[0]*9) + Math.random())/10;
  } else if (coatSwitch == 1) {
    chibis[chibis.length-1].coatMod[0] = ((parent2.coatMod[0]*9) + Math.random())/10;
  } else {
    chibis[chibis.length-1].coatMod[0] = (parent1.coatMod[0] + parent2.coatMod[0] + Math.random())/3;
  }
  coatSwitch = Math.round(Math.random()*2); // 0 to 2
  if (coatSwitch == 0) {
    chibis[chibis.length-1].coatMod[1] = ((parent1.coatMod[1]*9) + Math.random())/10;
  } else if (coatSwitch == 1) {
    chibis[chibis.length-1].coatMod[1] = ((parent2.coatMod[1]*9) + Math.random())/10;
  } else {
    chibis[chibis.length-1].coatMod[1] = (parent1.coatMod[1] + parent2.coatMod[1] + Math.random())/3;
  }
  chibis[chibis.length-1].thickness = specThickness;
  chibis[chibis.length-1].legginess = specLegginess;
  chibis[chibis.length-1].tailLength = specTail;
  // check for genetic conditions being passed down
  // albinism
  let albinoChance = 0;
  if (parent1.albinismGene && parent2.albinismGene) {
    albinoChance = 0.25;
  } else if (parent1.albinismGene || parent2.albinismGene) {
    albinoChance = 0.125;
  }
  if (albinoChance > 0) {
    if ((albinoChance*2) >= Math.random()) {
      chibis[chibis.length-1].albinismGene = true;
      if (0.5 <= Math.random()) {
        chibis[chibis.length-1].albinism = true;
      }
    }
  }

  let tmpBodypartCode = [];
  for (let i = 0; i < 12; i++) {
    if (Math.random() < 0.5) {
      tmpBodypartCode.push(parent1.bodypartCode[i]);
    } else {
      tmpBodypartCode.push(parent2.bodypartCode[i]);
    }
  }
  chibis[chibis.length-1].bodypartCode = tmpBodypartCode;
  chibis[chibis.length-1].nosePos = specNose;
  chibis[chibis.length-1].eyePosX = specEyeX;
  chibis[chibis.length-1].eyePosY = specEyeY;
  chibis[chibis.length-1].headWidth = specHeadW;
  chibis[chibis.length-1].headHeight = specHeadH;
  return babyGender;
}

/**
* function to describe a Chibi
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} gender - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Chibi(x, y, bodySize, maxSize, gender, ears) {
  this.inCatBox = null;
  this.i = ''; // temp for debug
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.firstColour = trueWhite;
  this.secondColour = trueBlack;
  this.thirdColour = '#ffff00';
  this.noseColour = '#000000';
  this.nosePos = 0;
  this.eyePosX = 0;
  this.eyePosY = 0;
  this.headWidth = 0;
  this.headHeight = 0;
  this.coatMod = [1, 1];
  this.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.ears = ears; // 0.5 is average
  this.thickness = 0; // 0.5 is average
  this.legginess = 0;
  this.angleToFocus = 0;
  this.size = bodySize;
  this.cellShadeThickness = this.size/10;
  this.cellShadeLine = '';
  this.limbLength = (this.size)+(20*this.legginess); // 10 to 16 + 0 to 6 == 16 to 6
  this.tailLength = 0;
  this.maxSize = maxSize;
  this.hitBottom = false;
  this.sitting = false;
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.hunger = 1000;
  this.snuggling = -1; // start at -1 so they dont try to give birth when they are not truly snuggling
  this.nomnomnom = -1; // as above
  this.awake = 0;
  this.litters = 0;
  this.id = ('0000' + guyID).slice(-4);
  guyID++;
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  this.elder = false;
  this.supersaiyan = 0;
  this.reachedNirvana = false;
  this.focus = fireflies[0];
  this.hitFocus = false;
  this.partner = null;
  this.mother = null;
  // genetic conditions
  this.albinism = false;
  this.albinismGene = false;
  // function to reinitialisae sizes (for growth)
  this.reinitSizes = function() {
    this.limbLength = (this.size)+(20*this.legginess);
    this.cellShadeThickness = this.size/10;
  };
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
  };
  // act
  // @return {boolean} - whether the action has a cost
  this.act = function() {
    // giving birth
    if (!choosingChibi && this.snuggling == 0 && this.gender == 'Female') {
      if (this.partner !== null) {
        this.partner.snuggling = -1;
        this.partner.partner = null;
        createGlyphs((this.x - (this.x - this.partner.x)/2), (this.y - (this.y - this.partner.y)/2), mixTwoColours(this.firstColour, this.partner.firstColour, 0.5), '\u2764');
        initLitter(this.partner, this);
        // take snuggling to -1 so that it doesn't give birth forever
      } else {
        sendMessage(this.name + ' had a phantom pregnancy');
      }
      this.snuggling = -1;
      this.partner = null;
    } else if ((this.gender == 'Male' && this.snuggling >= 0) || (!choosingChibi && this.snuggling >= 0)) {
      this.snuggling --;
    } else if (this.inCatBox == null && this.nomnomnom >= 0) {
      // if you're eating, decrease the eating timer
      this.nomnomnom --;
    } else {
      // if you've are in a state of nirvana, or in a catbox, just sit down
      if (this.inCatBox !== null || (this.supersaiyan > 0 && (this.health > superThreshold && this.love > superThreshold))) {
        this.sitting = true;
      } else {
        // decide whether to act this frame
        let chanceToAct = Math.random();
        // twice as likely to act if infant
        if (this.age < maturesAt) {
          chanceToAct *= 0.5;
        }
        if (chanceToAct <= 0.02) {
          // decide what to target
          let target = null;
          // if not an adult, just follow mother
          if (this.age < maturesAt && this.mother !== null) {
            this.focus = this.mother;
            target = this.mother;
          }
          // are we hungry?
          if (target == null && this.inCatBox == null && this.hunger <= 0 && fruits.length > 0) {
            let closestFruit = this.findClosestFruit();
            if (closestFruit !== 'X') {
              this.focus = closestFruit;
              target = closestFruit;
            }
          }
          // are we gonna pick a mate?
          if (target == null && !choosingChibi && !this.elder && this.gender == 'Male' && this.age >= maturesAt && chibis.length <= maxPop && this.supersaiyan == 0 && this.health >= 50
          && this.energy >= 50) {
            for (let j = 0; j < chibis.length && target == null; j++) {
              if (this !== chibis[j] && chibis[j].awake && this.love + chibis[j].love >= 100 && !chibis[j].elder && chibis[j].gender == 'Female'
              && chibis[j].age >= maturesAt && chibis[j].supersaiyan == 0 && chibis[j].health >= 50
              && chibis[j].energy >= 50) {
                this.partner = chibis[j];
                chibis[j].partner = this;
                target = chibis[j];
              }
            }
          }


          if (target == null) {
            // default action - jump at firefly
            this.focus = fireflies[this.findClosestFireFly()];
          }
          // actually jumping now
          // one in ten chance of speaking
          if (Math.random() <= 0.1) {
            speech.push(new Speak(this, neutralWord()));
          }

          if (this.age < maturesAt && this.mother !== null && (Math.abs(this.x - this.mother.x) < (this.size + this.mother.size)*2) && (Math.abs(this.y - this.mother.y) < (this.size + this.mother.size)*2)) {
            if (this.mother.awake) {
              this.sitting = true;
            } else if (this.nomnomnom == -1) {
              this.sitting = false;
              this.energy = this.mother.energy - (Math.random()*5);
              this.awake = false;
            }
          } else {
            this.speedY = -this.size;
            let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
            this.speedX += Math.cos(targetangle)*40;
            this.speedY += Math.sin(targetangle)*40;
            if (this.age < maturesAt) {
              this.speedX *= 0.5;
              this.speedY *= 0.5;
            } else {
              // it doesn't cost kittens energy or health to jump
              this.energy -= 7;
              this.health -= 1;
            }
            this.y--;
            this.sitting = false;
          }
        } else {
          this.sitting = true;
        }
      }
    }
  };
  this.findClosestFruit = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let f = 0; f < fruits.length; f++) {
      let tmpX = this.x-fruits[f].x;
      let tmpY = this.y-fruits[f].y;
      let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
      if (fruits[f].eaterId == null && fruits[f].y < this.y && distance < tmp) {
        tmp = distance;
        target = fruits[f];
      }
    }
    return target;
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
        if (this.nomnomnom <= 0 && this.snuggling <= 0) {
          this.energy -= 0.01;
        }
        if (this.y > trueBottom-(this.size)-(this.limbLength/2.5)) {
          this.y = trueBottom-(this.size)-(this.limbLength/2.5);
        }
      }
    }
    checkBounceSides(this);
    checkBounceTop(this);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].checkBounce(this);
    }
    // check if chibi hit the floor, come to a rest if so
    if (!this.hitBottom && this.y >= trueBottom-(this.size)-(this.limbLength/2.5)) {
      this.y = trueBottom-(this.size)-(this.limbLength/2.5);
      this.hitAFloor();
    }
  };
  this.hitAFloor = function() {
    this.speedY = 0;
    if (this.energy <= 0 && this.nomnomnom == -1 && this.snuggling == -1) {
      // fall asleep when tired
      this.sitting = false;
      this.awake = false;
      this.speedX = 0;
      this.rotation = 0;
      this.spin = 0;
    } else {
      this.hitBottom = true;
      // apply floor forces
      this.speedX *= 0.92;
      this.resetRotation(false);
      // jump occasionally
      if (this.rotation == 0 && this.awake) {
        this.act();
        // this.hitBottom = false;
      }
    }
  };

  this.drawFrontFeet = function() {
    let footSize = this.size/3.5*this.thickness*2.25;
    let leftHandGradient = trueWhite;
    let rightHandGradient = trueWhite;
    if (!this.albinism) {
      if (this.bodypartCode[0] == 0) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.secondColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        leftHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[0] == 1) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.thirdColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        leftHandGradient.addColorStop(1, this.secondColour);
      } else {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.firstColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        leftHandGradient.addColorStop(1, this.thirdColour);
      }

      if (this.bodypartCode[1] == 0) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.secondColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        rightHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[1] == 1) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.thirdColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        rightHandGradient.addColorStop(1, this.secondColour);
      } else {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.firstColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        rightHandGradient.addColorStop(1, this.thirdColour);
      }
    }
    // if we are awake on a floor
    if (this.awake && this.hitBottom) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(-(this.size/1.6), (this.size)+(this.limbLength/2.5), (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc((this.size/1.6), (this.size)+(this.limbLength/2.5), (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();

      // REAL DRAWING
      ctx.fillStyle = leftHandGradient;
      ctx.beginPath();
      ctx.arc(-(this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = rightHandGradient;
      ctx.beginPath();
      ctx.arc((this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();

    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.awake && this.hitFocus) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        // REAL DRAWING
        ctx.fillStyle = leftHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = rightHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.fill();
        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        // left arm
        ctx.save();
        ctx.translate(this.x-this.size+(this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
        // right arm
        ctx.save();
        ctx.translate(this.x+this.size-(this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), (footSize)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        // left arm
        ctx.fillStyle = leftHandGradient;
        ctx.save();
        ctx.translate(this.x - this.size + (this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
        // right arm
        ctx.fillStyle = rightHandGradient;
        ctx.save();
        ctx.translate(this.x + this.size - (this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
      }
    }
  };

  this.drawFrontLegs = function(bodyGradient) {
    // front legs
    ctx.lineWidth = (this.size/2.5)*this.thickness*2;
    // if we are awake and sitting on a floor
    if (this.awake && this.hitBottom && this.sitting) {
      // draw nothing
    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.awake && this.hitFocus) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        ctx.strokeStyle = this.cellShadeLine;
        ctx.lineWidth += this.cellShadeThickness;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = bodyGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
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
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x-this.size+(this.size/3), this.y + (this.size/1.25));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x+this.size-(this.size/3), this.y + (this.size/1.25));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = bodyGradient;
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size+(this.size/3), this.y + (this.size/1.25));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size/3), this.y + (this.size/1.5));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
      }
    }
  };

  this.update = function() {
    /* new gradient opps */
    ctx.save();
    ctx.translate(this.x, this.y);
    let bodyGradient = trueWhite;
    if (this.albinism) {
      // do nothing additional
    } else {
      let s = this.size*6;
      let maxWidth = Math.sqrt(s * s + s * s) / 2;
      bodyGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1]*6.3) * maxWidth, // start pos
        + Math.sin(this.coatMod[1]*6.3) * maxWidth,
        - Math.cos(this.coatMod[1]*6.3) * maxWidth, // end pos
        - Math.sin(this.coatMod[1]*6.3) * maxWidth
      );
      if (this.bodypartCode[5] == 0) {
        bodyGradient.addColorStop(0, this.secondColour);
        bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
        bodyGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[2] == 1) {
        bodyGradient.addColorStop(0, this.thirdColour);
        bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
        bodyGradient.addColorStop(1, this.secondColour);
      } else {
        bodyGradient.addColorStop(0, this.firstColour);
        bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
        bodyGradient.addColorStop(1, this.thirdColour);
      }
    }
    // ctx.fillStyle = bodyGradient;
    // ctx.beginPath();
    // ctx.arc(0, 0, this.size*3, 0, 2 * Math.PI);
    // ctx.fill();
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
    this.hitFocus = detectCollision(this, this.focus);
    if (this.albinism) {
      this.cellShadeLine = mixTwoColours(trueWhite, trueBlack, 0.7);
    } else if (this.supersaiyan > 0) {
      this.cellShadeLine = mixTwoColours(glowColour, mixThreeColours(this.firstColour, this.secondColour, this.thirdColour), this.supersaiyan/100);
    } else {
      this.cellShadeLine = mixTwoColours(mixThreeColours(this.firstColour, this.secondColour, this.thirdColour), trueBlack, 0.7);
    }
    let backendShiftX = this.size * this.speedX / 30;
    let backendShiftY = this.size * this.speedY / 30;
    if (backendShiftY > trueBottom - this.y) {
      backendShiftY = trueBottom - this.y;
    }
    if (this.awake && !this.hitBottom && this.hitFocus) {
      backendShiftY = -this.size/4;
    }

    // calculate angle to focus
    this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
    diffx = Math.cos(this.angleToFocus)*4;
    diffy = Math.sin(this.angleToFocus)*4;
    // setting leg angle
    let sameDirection = false;
    let offsetX = Math.abs(this.focus.x - this.x);
    let legAngle = Math.atan2(this.speedY, this.speedX);

    if (this.inCatBox == null && this.awake && this.mother !== null && this.age < maturesAt && this.hitBottom && this.mother.snuggling == -1 && detectCollision(this, this.mother)) {
      this.speedX = 0;
      this.speedY = 0;
      if (!this.mother.awake && this.nomnomnom == -1) {
        this.energy = this.mother.energy - (Math.random()*30);
        this.awake = false;
        this.sitting = false;
      } else if (this.mother.awake && this.nomnomnom == -1) {
        this.mother.energy -= 2.5;
        this.mother.speedX = 0;
        this.mother.speedY = 0;
        this.mother.sitting = true;
        this.nomnomnom = 50;
        sendMessage(this.mother.name + ' fed '+ this.name);
        gainMeter(this);
      }
    }
    for (let f = 0; f < fireflies.length; f++) {
      if (this.snuggling <= 0 && !this.hitBottom && !fireflies[f].touchedThisFrame && this.awake && this.energy > 0 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX*this.size)/1500;
        fireflies[f].speedY += (this.speedY*this.size)/2000;// + (0.002 * this.size);
        gainMeter(this);
        if (this.health >= superThreshold && this.love >= superThreshold && this.energy >= superThreshold) {
          // let go of the FireFly
          this.speedY = -this.size*2;
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
    if (this.awake && this.energy > 0 && !this.sitting) {
      let leftFootColour = trueWhite;
      let rightFootColour = trueWhite;
      if (!this.albinism) {
        leftFootColour = this.firstColour;
        rightFootColour = this.firstColour;
        if (this.bodypartCode[7] == 0) {
          leftFootColour = this.firstColour;
        } else if (this.bodypartCode[7] ==1 ) {
          leftFootColour = this.secondColour;
        } else {
          leftFootColour = this.thirdColour;
        }

        if (this.bodypartCode[8] == 0) {
          rightFootColour = this.firstColour;
        } else if (this.bodypartCode[8] ==1 ) {
          rightFootColour = this.secondColour;
        } else {
          rightFootColour = this.thirdColour;
        }
      }
      ctx.lineWidth = (this.size/2.5)*this.thickness*2;
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
      ctx.translate(-(this.size/2), (this.size/2));
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
      ctx.lineTo(0, this.limbLength/1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.5, (this.size/3.5*this.thickness*2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
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
      ctx.lineTo(0, this.limbLength/1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.5, (this.size/3.5*this.thickness*2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close
      ctx.lineWidth -= this.cellShadeThickness;
      // REAL DRAWING
      if (!this.albinism) {
        ctx.strokeStyle = bodyGradient;
        ctx.fillStyle = bodyGradient;
      } else {
        ctx.strokeStyle = trueWhite;
        ctx.fillStyle = trueWhite;
      }
      // don't rotate if we have hit the bottom
      ctx.save(); // 1 open
      ctx.translate(-(this.size/2), (this.size/2));
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
      ctx.lineTo(0, this.limbLength/1.5);
      ctx.stroke();
      ctx.fillStyle = leftFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.5, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
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
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.limbLength/1.5);
      ctx.stroke();
      ctx.fillStyle = rightFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.5, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close
      ctx.restore(); // 0 close
    }

    // translate before drawing again
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);
    // tail
    // make it wag
    let tmp = Math.abs(daytimeCounter-this.birthday);
    while (tmp > 30 && tmp > 0) {
      tmp -= 30; // 0 to 30
    }
    tmp = Math.abs(tmp-15); // 0 to 15 to 0 to 15
    ctx.save();
    if (!this.hitBottom && this.awake) {
      tmp = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.rotate(Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.hitBottom || !this.awake) {
      ctx.translate(0, sleepshift - this.size);
    }
    // CELL SHADING
    ctx.fillStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(-this.cellShadeThickness, (this.size/1.5) - this.cellShadeThickness);
    ctx.arc((this.size*(-tmp+7.5)/8)*this.thickness, -(2*this.tailLength*this.size) - (this.cellShadeThickness*2), ((this.size/3)*this.thickness*2), 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(this.cellShadeThickness, this.size/3);
    ctx.fill();
    // REAL DRAWING
    let tailGradient = trueWhite;
    if (!this.albinism) {
      tailGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*2);
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
    }
    ctx.fillStyle = tailGradient;
    ctx.beginPath();
    ctx.moveTo(0, (this.size/1.5) + this.cellShadeThickness);
    ctx.arc((this.size*(-tmp+7.5)/8)*this.thickness, -(2*this.tailLength*this.size), (this.size/3)*this.thickness*2, 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(0, this.size/3);
    ctx.fill();

    if (!this.hitBottom && this.awake) {
      ctx.rotate(-Math.atan2(-this.speedY, -this.speedX));
    }
    ctx.restore(); // 0 - rotated
    if (this.sitting) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    }
    // body balls
    // CELL SHADING
    ctx.fillStyle = this.cellShadeLine;
    ctx.beginPath();
    if (this.sitting) {
      let tmp = Math.abs(daytimeCounter-this.birthday);
      while (tmp > 15 && tmp > 0) {
        tmp -= 15; // 0 to 30
      }
      tmp *= 0.5;
      tmp = Math.abs(tmp-3.75); // -0 to -3.75 to 0 to 3.75
      ctx.arc(-tmp+1.875, -this.size, (this.thickness*this.size*1.6)+this.cellShadeThickness, 0, 2 * Math.PI);
    } else if (this.awake) {
      ctx.arc(-(this.size/32) - backendShiftX, -backendShiftY, (this.thickness*this.size*1.3)+this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc(-(this.size/32) - (backendShiftX*2/3), -backendShiftY*2/3, (this.thickness*this.size*1.5)+this.cellShadeThickness, 0, 2 * Math.PI);
    }
    ctx.fill();
    // REAL DRAWING
    // bum sticking in the air
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    if (this.sitting && this.awake) {
      // make it wag
      let tmp = Math.abs(daytimeCounter-this.birthday);
      while (tmp > 15 && tmp > 0) {
        tmp -= 15; // 0 to 30
      }
      tmp *= 0.5;
      tmp = Math.abs(tmp-3.75); // 0 to 15 to 0 to 15
      ctx.arc(-tmp+1.875, -this.size, this.thickness*this.size*1.6, 0, 2 * Math.PI);
    } else if (this.awake) {
      ctx.arc(-(this.size/32) - backendShiftX, -backendShiftY, this.thickness*this.size*1.3, 0, 2 * Math.PI);
      ctx.arc(-(this.size/32) - (backendShiftX*2/3), -backendShiftY*2/3, this.thickness*this.size*1.5, 0, 2 * Math.PI);
      ctx.arc(-(this.size/32) - (backendShiftX*1/3), -backendShiftY*2/3, this.thickness*this.size*1.5, 0, 2 * Math.PI);
    }
    ctx.fill();


    // aura and trail on supersaiyans
    if (this.supersaiyan > 0) {
      // flame aura
      ctx.globalAlpha = (this.supersaiyan-50)/50;
      ctx.drawImage(flame, -this.size*1.5, -(this.size*3), this.size*3, this.size*3);
      if (this.speedY < 0) {
        trails.push(new Particle(this.size/4, glowColour, this.x-(this.size/2), this.y, this.speedX*0.5, this.speedY*0.5));
        trails.push(new Particle(this.size/4, glowColour, this.x+(this.size/2), this.y, this.speedX*0.5, this.speedY*0.5));
        trails.push(new Particle(this.size/3, glowColour, this.x, this.y, this.speedX, this.speedY));
      }
      let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.supersaiyan);
      glow.addColorStop(0, glowColour);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(0, 0, this.supersaiyan, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albinism) {
        ctx.fillStyle = this.secondColour;
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.globalAlpha = 1;
    }
    // rotate around axis and move a bit before drawing head parts
    ctx.translate(0, -this.size/2);
    ctx.save();
    ctx.translate(-this.x, -this.y);
    // draw the front legs
    this.drawFrontLegs(bodyGradient);
    ctx.restore();
    ctx.rotate(this.rotation);

    if (this.awake && !this.sitting) {
      // NECK
      // CELL SHADING
      ctx.rotate(-this.rotation);
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0 - (backendShiftX*1/3), (this.size/2) - (backendShiftY*1/3), this.size+(this.thickness*this.size/5)+this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      if (!this.albinism) {
        ctx.fillStyle = bodyGradient;
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.beginPath();
      ctx.arc(0 - (backendShiftX*1/3), (this.size/2) - (backendShiftY*1/3), this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
      ctx.fill();
      ctx.rotate(this.rotation);
    }

    // ears
    ctx.save(); // 0
    if (this.awake) {
      ctx.translate(-this.size, -this.size/2);
    } else {
      ctx.translate(-this.size, sleepshift);
    }
    oneq = this.size/2;
    // CELL SHADING
    ctx.fillStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(-this.cellShadeThickness, - this.cellShadeThickness + (this.size/2));
    ctx.lineTo(-this.cellShadeThickness - (this.ears*8), - this.cellShadeThickness - this.size+(this.size*this.ears/5));
    ctx.lineTo((oneq*2), - this.cellShadeThickness - (this.size*this.ears)/4);
    ctx.lineTo(this.cellShadeThickness + (oneq*4)+(this.ears*8), - this.cellShadeThickness - this.size+(this.size*this.ears/5));
    ctx.lineTo(this.cellShadeThickness + (oneq*4), - this.cellShadeThickness + (this.size/2));
    ctx.fill();
    // REAL DRAWING
    let leftEarGradient = trueWhite;
    let rightEarGradient = trueWhite;
    if (!this.albinism) {
      leftEarGradient = ctx.createLinearGradient(0, -this.size-(this.size*this.ears/2), 0, this.limbLength/4);
      rightEarGradient = ctx.createLinearGradient(0, -this.size-(this.size*this.ears/2), 0, this.limbLength/4);
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
    }
    ctx.fillStyle = leftEarGradient;
    ctx.beginPath();
    ctx.moveTo(0, +this.size/2);
    ctx.lineTo(0-(this.ears*8), -this.size+(this.size*this.ears/5));
    ctx.lineTo(oneq*2, -(this.size*this.ears)/4);
    ctx.fill();
    ctx.fillStyle = rightEarGradient;
    ctx.beginPath();
    ctx.moveTo(oneq*2, -(this.size*this.ears)/4);
    ctx.lineTo((oneq*4)+(this.ears*8), -this.size+(this.size*this.ears/5));
    ctx.lineTo(oneq*4, +this.size/2);
    ctx.fill();
    ctx.restore(); // 0

    // head
    if (this.sitting && this.awake) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, sleepshift);
    }
    let s = this.size*6;
    let maxWidth = Math.sqrt(s * s + s * s) / 2;
    let headGradient = ctx.createLinearGradient(
      + Math.cos(this.coatMod[1]*6.3) * maxWidth, // start pos
      + Math.sin(this.coatMod[1]*6.3) * maxWidth,
      - Math.cos(this.coatMod[1]*6.3) * maxWidth, // end pos
      - Math.sin(this.coatMod[1]*6.3) * maxWidth
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
    if (this.sitting && this.awake) {
      ctx.translate(0, -(this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, -sleepshift);
    }
    if (this.awake) {
      // awake mode
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.save();
      ctx.scale(1+(this.headWidth/3), 1 + (this.headHeight/3));
      ctx.beginPath();
      ctx.arc(0, 0, this.size+(this.thickness*this.size/5)+this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      if (!this.albinism) {
        ctx.fillStyle = headGradient;
      } else {
        ctx.fillStyle = trueWhite;
      }
      // ctx.rotate(this.coatMod[1] * 6.3);
      ctx.beginPath();
      ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // smile
      if (this.health >= 50 && !this.elder && this.energy > 0) {
        ctx.globalAlpha = this.love/100;
        if (this.gender == 'Female') {
          ctx.drawImage(smile, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
        } else if (this.gender == 'Male') {
          ctx.drawImage(smile2, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
        } else if (this.gender == 'Non Binary') {
          ctx.drawImage(smile3, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
        }
        ctx.globalAlpha = 1;
      }
    } else {
      // sleep mode
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, this.limbLength+(this.size/2), this.size+this.cellShadeThickness, 3.15, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      if (!this.albinism) {
        ctx.fillStyle = headGradient;
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.beginPath();
      ctx.arc(0, this.limbLength+(this.size*0.6), this.size, 3.15, 2 * Math.PI);
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
    ctx.globalAlpha = 1;
    // eyes
    if (this.awake) {
      if ((this.snuggling >= 0 || this.nomnomnom >= 0) && this.age >= maturesAt) {
        ctx.drawImage(content, -this.size, -this.size, this.size*2, this.size*2);
      } else {
        diffy = 0.5;
        ctx.save(); // 0 open
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        ctx.beginPath();
        ctx.save(); // 0 open
        ctx.arc(-(this.size*this.eyePosX*0.3) - this.size/2, - (this.size/2) + (this.eyePosY*this.size*0.75), (this.size/2.25)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.save(); // 0 open
        ctx.arc((this.size*this.eyePosX*0.3) + this.size/2, - (this.size/2) + (this.eyePosY*this.size*0.75), (this.size/2.25)+this.cellShadeThickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        // REAL DRAWING
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        // left eye
        ctx.beginPath();
        if (!this.albinism) {
          ctx.fillStyle = trueBlack;
        } else {
          ctx.fillStyle = albinoRed;
        }
        ctx.translate(-(this.size*this.eyePosX*0.3) - this.size/2, - (this.size/2) + (this.eyePosY*this.size*0.75));
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
        ctx.restore(); // 0 closed
        // right eye
        ctx.beginPath();
        if (!this.albinism) {
          ctx.fillStyle = trueBlack;
        } else {
          ctx.fillStyle = albinoRed;
        }
        ctx.save(); // 0 open
        ctx.translate((this.size*this.eyePosX*0.3) + this.size/2, - (this.size/2) + (this.eyePosY*this.size*0.75));
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
        ctx.restore(); // 0 closed
      }

      // eyelids
      if (this.energy < 0) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        if (!this.albinism) {
          ctx.fillStyle = this.firstColour;
        } else {
          ctx.fillStyle = trueWhite;
        }
        ctx.arc(-(this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // jowl
    if (this.awake) {
      // chin
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, (this.size*(this.nosePos-0.5)/2) + this.size/1.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // real drawing
      if (!this.albinism) {
        if (this.bodypartCode[11] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[11] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.beginPath();
      ctx.arc(0, (this.size*(this.nosePos-0.5)/2) + this.size/1.5, (this.size/3.5), 0, 2 * Math.PI);
      ctx.fill();
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(-(this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc((this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();

      // real drawing
      if (!this.albinism) {
        if (this.bodypartCode[9] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[9] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.beginPath();
      ctx.arc(-(this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albinism) {
        if (this.bodypartCode[10] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[10] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.beginPath();
      ctx.arc((this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();

      // nose
      // cell cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.fillRect(-(this.size/3.5) - this.cellShadeThickness, (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3) - this.cellShadeThickness, (this.size/1.75) + (this.cellShadeThickness*2), (this.size/4) + (this.cellShadeThickness*2));
      ctx.fillRect(-(this.size/12) - this.cellShadeThickness, (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3) - this.cellShadeThickness, (this.size/6) + (this.cellShadeThickness*2), (this.size/2.5) + (this.cellShadeThickness*2));

      // real drawing
      if (!this.albinism) {
        ctx.fillStyle = this.noseColour;
      } else {
        ctx.fillStyle = nosePink;
      }
      ctx.fillRect(-(this.size/3.5), (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3), this.size/1.75, this.size/4);
      ctx.fillRect(-(this.size/12), (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3), this.size/6, this.size/2.5);
    }
    ctx.restore(); // close

    // draw status icons
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
      ctx.globalAlpha = (1 - (amntToMove/10))/2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size-amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size-7-amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size-14-amntToMove);
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
      ctx.globalAlpha = (1 - (amntToMove/40))/2;
      amntToMove *= 1;
      ctx.fillText('\u2764', -10, -(this.size*4)+amntToMove);
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
      ctx.globalAlpha = (1 - (alphaShift/40))/2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(0.5);
        ctx.fillText('*nom*', -25, -this.size);
        ctx.restore();
      }
      ctx.globalAlpha = alphaShift/40/2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(-0.5);
        ctx.fillText('*nom*', -2, -this.size);
        ctx.restore();
      }
    }

    // label
    if ((selection == this || this.inCatBox !== null) && this !== experiment) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = colourIndicator(this);
      ctx.font = '10px' + ' ' + globalFont;
      let shift = this.name.length*5.6/2;
      ctx.fillText(this.name, -shift, -(this.size*2));
      // ctx.fillText(Math.round(this.health)+' '+Math.round(this.love)+' '+Math.round(this.energy)+' '+Math.round(this.hunger), -shift, -(this.size*2));
    }
    /* debug label */
    // if (this == experiment) {
    //   ctx.fillStyle = trueWhite;
    //   ctx.font = '10px' + ' ' + globalFont;
    //   ctx.fillText(this.energy, 0, -10 - (this.size*2));
    // }

    ctx.globalAlpha = 1;
    ctx.restore(); // 0
    this.drawFrontFeet();
    ctx.globalAlpha = 1;
  };
}

/**
* function to add meters to a chibi
* @param {Chibi} who - the chibi
*/
gainMeter = function(who) {
  if (who.energy < 100) {
    who.energy += 0.6;
  }
  if (who.love < 100) {
    who.love += 2;
  }
  if (who.health < 100) {
    who.health += 4;
  }
};

/**
* function to remove relationships from a chibi
* @param {Chibi} who - the chibi
*/
removeRelationships = function(who) {
  // remove mother and partner
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].mother == who) {
      chibis[i].mother = null;
    }
    if (chibis[i].partner == who) {
      chibis[i].partner = null;
    }
  }
  // kill fruit that is being consumes
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == who) {
      fruits.splice(i, 1);
      i--;
    }
  }
};

/** function to apply genetics and  disorders to Chibis
* @param {Chibi} who - the chibi
*/
applyGenetics = function(who) {
  // albinism
  let albinoChance = Math.random();
  if (albinoChance <= 0.04) {
    who.albinismGene = true;
  }
  if (who.albinismGene && 0.5 < Math.random()) {
    who.albinism = true;
  }
};

noseColourCheck = function(who) {
  let c1 = hexToRgb(who.firstColour).r + hexToRgb(who.firstColour).g + hexToRgb(who.firstColour).b;
  if (c1 > 382.5) {
    who.noseColour = nosePink;
  } else {
    who.noseColour = trueBlack;
  }
};

/** function to create a random bodypartCode
* this code is used to denote the zones of colour on a Chibi
* @return {array} - the bodypart code
*/
randomBodyPartCode = function() {
  let tmpArray = [];
  for (let i = 0; i < 12; i++) {
    tmpArray.push(Math.round(Math.random()*2));
  }
  return tmpArray;
};
