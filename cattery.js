

function initLitter(mParent, fParent) {
  sendMessage('\u2764 '+fParent.name+' gave birth to '+mParent.name+'\'s chittens');
  labels[1] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 110, 'Choose one of '+fParent.name+' and '+mParent.name+'\'s litter to keep');
  labels[0] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'The others will be adopted by nice people');
  selectionInfo.visible = false;
  choosingChibi = true;
  maleParent = mParent;
  femaleParent = fParent;
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  selection = null;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[2].visible = true;
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  labels[1].visible = true;
  labels[2].visible = false;
  labels[0].visible = true;
  currentChibis = chibis.length;
  boxes = [];
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
      if (chibis[thisCatBox+currentChibis].name == null) {
      }
      chibis[thisCatBox+currentChibis].x = (canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2);
      chibis[thisCatBox+currentChibis].y = (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2);
      count++;
    }
  }
}


function initFemaleCattery() {
  selectionInfo.visible = false;
  choosingChibi = true;
  chosenChibiF = false;
  sendMessage('\u2764 Choose a female Chibi');
  labels[0] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 110, 'Welcome to the Cattery');
  labels[1] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'Choose a girl');
  selection = null;
  buttons[0].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  buttons[6].visible = true;
  labels[0].visible = true;
  labels[1].visible = true;
  labels[2].visible = false;
  currentChibis = chibis.length;
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)/1.1, 'Female', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].age = Math.round(Math.random()*5);
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize*0.75;
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox+currentChibis].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = 50 + Math.round((Math.random()*50));
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
    }
  }
}

function initMaleCattery() {
  selectionInfo.visible = false;
  choosingChibi = true;
  chosenChibiM = false;
  sendMessage('\u2764 Choose a male Chibi');
  labels[0] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 110, 'Welcome to the Cattery');
  labels[1] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'Choose a boy');
  selection = null;
  buttons[0].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  buttons[6].visible = true;
  labels[0].visible = true;
  labels[1].visible = true;
  labels[2].visible = false;
  currentChibis = chibis.length;
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)*1.1, 'Male', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].age = Math.round(Math.random()*5);
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize*0.75;
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox+currentChibis].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = 50 + Math.round((Math.random()*50));
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
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
  this.update = function() {
    ctx.lineWidth = this.thickness;
    if (this.highlighted || this.selected) {
      ctx.strokeStyle = mixTwoColours(trueWhite, outputArray[2], 0.5);
      if (this.highlighted) {
        ctx.fillText(chibis[this.id].name, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2)+10);
        ctx.fillText('Age '+ chibis[this.id].age, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 25);
        ctx.fillText('Gender '+chibis[this.id].gender, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 40);
        let c2 = ntc.name(chibis[this.id].secondColour)[1];
        let cString = ntc.name(chibis[this.id].firstColour)[1];
        if (c2 !== cString) {
          cString += ' & '+ c2;
        }
        ctx.fillText('Colour '+cString, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 55);
        ctx.fillText('Size '+Math.round((chibis[this.id].size)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 70);
        ctx.fillText('Max size '+Math.round((chibis[this.id].maxSize)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 85);
        ctx.fillText('Thickness '+Math.round((chibis[this.id].thickness*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 100);
        ctx.fillText('Legginess '+Math.round((chibis[this.id].legginess*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 115);
        ctx.fillText('Ear width '+Math.round((chibis[this.id].ears*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 130);
        ctx.fillText('Birthhour '+tickerToTime(Math.round(chibis[this.id].birthday)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 145);
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
    return 'non binary';
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
  // set the baby's max size
  let babyGender = randomGender();
  let specSize = 7 + (Math.random()*9);
  specSize = (parent1.maxSize + parent2.maxSize + specSize)/3;
  if (chibis[chibis.length-1].gender == 'Male') {
    specSize *= 1.1;
  } else if (chibis[chibis.length-1].gender == 'Female') {
    specSize /= 1.1;
  }
  let specthickness = (Math.random()*0.5)+0.5;
  specthickness = (parent1.thickness + parent2.thickness + specthickness)/3;
  let speclegginess = (Math.random()*0.9)+0.1;
  speclegginess = (parent1.legginess + parent2.legginess + speclegginess)/3;
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
  chibis.push(new Chibi(parent1.x + ((parent2.x - parent1.x)/2), parent1.y + ((parent2.y - parent1.y)/2), 10, specSize, babyGender, babyEars));
  // set the baby's ears
  // set the baby's genetic colour
  let colour = 'red'; // for debug
  // decide which method of colour logic to use for the genetic colour
  let seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour = parent1.firstColour;
  } else if (seed == 1) {
    colour = parent2.firstColour;
  } else {
    colour = mixTwoColours(parent1.firstColour, parent2.firstColour, 0.5);
  }
  // mix in a little random
  chibis[chibis.length-1].firstColour = mixTwoColours(colour, randomColourRealistic(), 0.75);
  // decide which method of colour logic to use for the second colour
  seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour = parent1.secondColour;
  } else if (seed == 1) {
    colour = parent2.secondColour;
  } else {
    colour = mixTwoColours(parent1.secondColour, parent2.secondColour, 0.5);
  }
  // mix in a little random
  chibis[chibis.length-1].secondColour = mixTwoColours(colour, randomColourRealistic(), 0.75);
  chibis[chibis.length-1].speedY = -25;
  // set the baby's coat and appearance modifiers
  chibis[chibis.length-1].coatMod[0] = (parent1.coatMod[0] + parent2.coatMod[0] + Math.random())/3;
  chibis[chibis.length-1].coatMod[1] = (parent1.coatMod[1] + parent2.coatMod[1] + Math.random())/3;
  chibis[chibis.length-1].thickness = specthickness;
  chibis[chibis.length-1].legginess = speclegginess;
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
  this.secondColour = trueBlack;
  this.firstColour = trueWhite;
  this.coatMod = [1, 1];
  this.ears = ears; // 0.5 is average
  this.thickness = 0.5; // 0.5 is average
  this.legginess = 0.5;
  this.angleToFocus = 0;
  this.size = bodySize;
  this.limbLength = this.size*3*this.legginess;
  this.maxSize = maxSize;
  this.hitBottom = false;
  this.sitting = false;
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.snuggling = -1; // start at -1 so they dont try to give birth when they are not truly snuggling
  this.awake = 0;
  this.litters = 0;
  this.id = ('0000' + guyID).slice(-4);
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  this.elder = false;
  this.supersaiyan = 0;
  this.reachedNirvana = false;
  this.focus = fireflies[0];
  this.partnerId = null;
  guyID++;
  this.reinitSizes = function() {
    this.limbLength = this.size*3*this.legginess;
  };
  // method to find a partner's index
  this.getPartner = function() {
    for (let i = 0; i < chibis.length; i++) {
      // console.log('comparing '+chibis[i].id+' with '+this.partnerId)
      if (chibis[i].id == this.partnerId) {
        return chibis[i];
      }
    }
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
    if (!choosingChibi && this.snuggling == 0 && this.gender == 'Male') {
      // giveBirth(this, this.focus);
      createGlyphs((this.x - (this.x - this.focus.x)/2), (this.y - (this.y - this.focus.y)/2), mixTwoColours(this.firstColour, this.focus.firstColour, 0.5), '\u2764');
      initLitter(this, this.getPartner());
      this.getPartner().partnerId = null;
      this.partnerId = null;
      // take snuggling to -1 so that it doesn't give birth forever
      this.snuggling --;
    } else if (this.snuggling > 0) {
      this.sitting = true;
      this.snuggling --;
    } else {
      // decide whether to act or not
      // if you've already reached nirvana, and you max out one of your meters, just sit down
      if (this.supersaiyan == 0 && (this.health > superThreshold && this.love > superThreshold)) {
        this.sitting = true;
      } else {
        if (Math.random() <= 0.025 && this.focus.y <= this.y) {
          // decide what to do
          // are we gonna pick a mate?
          let mate = null;
          if (!choosingChibi && !this.elder && this.gender == 'Male' && this.age > 0 && chibis.length <= maxPop && this.supersaiyan == 0 && this.health >= 60
          && this.energy >= 60 && this.size >= this.maxSize) {
            for (let j = 0; j < chibis.length && mate == null; j++) {
              if (this !== chibis[j] && chibis[j].awake && this.love + chibis[j].love >= 90 && !chibis[j].elder && chibis[j].gender == 'Female'
              && chibis[j].age > 0 && chibis[j].supersaiyan == 0 && chibis[j].health >= 60
              && chibis[j].energy >= 60 && chibis[j].size >= chibis[j].maxSize) {
                this.partnerId = ''+chibis[j].id;
                chibis[j].partnerId = ''+this.id;
                mate = chibis[j];
                // let nameArray = [];
                // nameArray.push(this);
                // nameArray.push(mate);
                // nameArray.sort(function twoVars(a, b) {
                //   if (a.name > b.name) return 1;
                //   if (a.name < b.name) return -1;
                //   return 0;
                // });
                // sendMessage(nameArray[0].name+' and '+nameArray[1].name+' felt like snuggling');
              }
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
    checkBounceSides(this);
    checkBounceTop(this);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].checkBounce(this);
    }
    // check if chibi hit the floor, come to a rest if so
    if (!this.hitBottom && this.y >= trueBottom-(this.size)-(this.limbLength/2.5)) {
      this.y = trueBottom-(this.size)-(this.limbLength/2.5);
      this.hitAFloor();
      if (this.supersaiyan > 0 && tryToPlantaTree(this.x)) {
        sendMessage(this.name+' planted some seeds');
      }
    }
  };
  this.hitAFloor = function() {
    this.speedY = 0;
    if (this.energy <= 0) {
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
  this.update = function() {
    let backendShiftX = this.size * this.speedX / 30;
    let backendShiftY = this.size * this.speedY / 30;
if (backendShiftY > trueBottom - this.y) {
  backendShiftY = trueBottom - this.y;
}
    if (this.awake && !this.hitBottom && detectCollision(this, this.focus)) {
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
    // set body colour
    ctx.fillStyle= this.firstColour;
    for (let f = 0; f < fireflies.length; f++) {
      if (this.snuggling <= 0 && !this.hitBottom && !fireflies[f].touchedThisFrame && this.awake && this.energy > 0 && detectCollision(this, fireflies[f])) {
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
      ctx.lineWidth = (this.size/2.5)*this.thickness*2;

      // legs
      let legGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size*0.8));
      legGradient.addColorStop(0, trueBlack);
      legGradient.addColorStop(0.1, this.firstColour);
      legGradient.addColorStop(1, this.secondColour);
      ctx.strokeStyle = legGradient;
      ctx.fillStyle = legGradient;
      ctx.save(); // 0 open - rotated
      ctx.translate(this.x - backendShiftX, this.y - backendShiftY);
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
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.2, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
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
      ctx.lineTo(0, this.limbLength/1.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength/1.2, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close
      ctx.restore(); // 0 close
      ctx.strokeStyle = this.firstColour;
    }
    // label
    if (selection == this || this.inCatBox !== null) {
      ctx.fillStyle = colourIndicator(this);
      ctx.font = '10px' + ' ' + globalFont;
      let shift = this.name.length*5.6/2;
      ctx.fillText(this.name, this.x-shift, this.y-(this.size*2));
    }
    // translate before drawing again
    ctx.fillStyle = this.firstColour;
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);

    // tail
    ctx.save();
    // make it wag
    let tmp = Math.abs(daytimeCounter-this.birthday);
    while (tmp > 30 && tmp > 0) {
      tmp -= 30; // 0 to 30
    }
    tmp = Math.abs(tmp-15); // 0 to 15 to 0 to 15

    if (!this.hitBottom && this.awake) {
      tmp = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.rotate(Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.hitBottom || !this.awake) {
      ctx.translate(0, sleepshift - (this.size/4));
    }
    ctx.beginPath();
    ctx.moveTo(0, this.size/1.5);
    ctx.arc((this.size*(-tmp+7.5)/8)*this.thickness, -(this.size*1.5), (this.size/3)*this.thickness*2, 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(0, this.size/3);
    let tailGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*2);
    tailGradient.addColorStop(0, trueBlack);
    tailGradient.addColorStop(1*this.coatMod[0], this.firstColour);
    tailGradient.addColorStop(1, this.secondColour);
    ctx.fillStyle = tailGradient;
    ctx.fill();
    if (!this.hitBottom && this.awake) {
      ctx.rotate(-Math.atan2(-this.speedY, -this.speedX));
    }
    ctx.restore(); // 0 - rotated

    // aura and trail on supersaiyans
    if (this.supersaiyan > 0) {
      // flame aura
      ctx.globalAlpha = (this.supersaiyan-50)/50;
      ctx.drawImage(flame, -this.size*1.5, -(this.size*2), this.size*3, this.size*3);
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
      ctx.fillStyle = this.secondColour;
      ctx.globalAlpha = 1;
    }

    if (this.sitting) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    }
    // body balls
    let bodyGradient = ctx.createRadialGradient(0, 0, this.size/3, 0, 0, (this.size*2)+Math.sqrt((backendShiftY*backendShiftY)+(backendShiftX*backendShiftX)));
    bodyGradient.addColorStop(0, trueBlack);
    bodyGradient.addColorStop(0.25, this.firstColour);
    bodyGradient.addColorStop(1*this.coatMod[0], this.firstColour);
    bodyGradient.addColorStop(1, this.secondColour);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    // bum sticking in the air
    if (this.sitting) {
      // make it wag
      let tmp = Math.abs(daytimeCounter-this.birthday);
      while (tmp > 7.5 && tmp > 0) {
        tmp -= 7.5; // 0 to 30
      }
      tmp = Math.abs(tmp-3.75); // 0 to 15 to 0 to 15
      ctx.arc(-(this.size*(-tmp+3.75)/32), -this.size/2, this.thickness*this.size*1.6, 0, 2 * Math.PI);
    } else if (this.awake) {
      ctx.arc(-(this.size/32) - backendShiftX, -backendShiftY, this.thickness*this.size*1.3, 0, 2 * Math.PI);
      ctx.arc(-(this.size/32) - (backendShiftX*2/3), -backendShiftY*2/3, this.thickness*this.size*1.5, 0, 2 * Math.PI);
      ctx.arc(-(this.size/32) - (backendShiftX*1/3), -backendShiftY*2/3, this.thickness*this.size*1.5, 0, 2 * Math.PI);
    }
    ctx.fill();

    // put your front legs down if you are on the floor and healthy
    ctx.lineWidth = (this.size/2.5)*this.thickness*2;
    let handGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5));
    handGradient.addColorStop(0, this.firstColour);
    handGradient.addColorStop(this.coatMod[0], this.firstColour);
    handGradient.addColorStop(1, this.secondColour);
    ctx.fillStyle = handGradient;
    ctx.strokeStyle = handGradient;
    if (this.awake && this.hitBottom) {
      if (!this.sitting) {
        ctx.beginPath();
        ctx.moveTo(-this.size+(this.size/1.6), this.size*0.8);
        ctx.lineTo(-this.size+(this.size/1.6), this.limbLength);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.size-(this.size/1.6), this.size*0.8);
        ctx.lineTo(this.size-(this.size/1.6), this.limbLength);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-this.size+(this.size/1.6), this.limbLength, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.size-(this.size/1.6), this.limbLength, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // rotate around axis before drawing head parts
    ctx.rotate(this.rotation);
    // ears
    ctx.save(); // 0
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
    earGradient.addColorStop(0, this.secondColour);
    earGradient.addColorStop(1-(this.coatMod[0]), this.firstColour);
    earGradient.addColorStop(1, trueBlack);
    ctx.fillStyle = earGradient;
    ctx.fill();
    ctx.restore(); // 0

    // head
    if (this.sitting && this.awake) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, sleepshift);
    }
    let headGradient=ctx.createLinearGradient(0, -this.size, 0, this.size);
    headGradient.addColorStop(0, this.firstColour);
    headGradient.addColorStop(1*this.coatMod[0], this.firstColour);
    headGradient.addColorStop(1, this.secondColour);
    ctx.fillStyle = headGradient;
    if (this.sitting && this.awake) {
      ctx.translate(0, -(this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, -sleepshift);
    }
    if (this.awake) {
      ctx.rotate(360 * this.coatMod[1] * Math.PI / 180);
      // awake mode
      ctx.beginPath();
      ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
      ctx.fill();
      ctx.rotate(-360 * this.coatMod[1] * Math.PI / 180);
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
      ctx.save(); // 0 open
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
      ctx.restore(); // 0 closed
      // right eye
      ctx.beginPath();
      ctx.fillStyle = trueBlack;
      ctx.save(); // 0 open
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
      ctx.restore(); // 0 closed
      // eyelids
      if (this.energy < 0) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.fillStyle = this.firstColour;
        ctx.arc(-(this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.size/2), -(this.size/8), this.size/1.7, 3.15, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore(); // close
    // draw status icons
    ctx.save(); // 0
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


    ctx.globalAlpha = 1;
    ctx.restore(); // 0


    // hands
    ctx.lineWidth = (this.size/2.5)*this.thickness*2;
    ctx.fillStyle = handGradient;
    ctx.strokeStyle = handGradient;
    // if we are awake and sitting on a floor
    if (this.awake && this.hitBottom && this.sitting) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(-(this.size/1.6), (this.size)+(this.limbLength/2.5), this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc((this.size/1.6), (this.size)+(this.limbLength/2.5), this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
    if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.awake && detectCollision(this, this.focus)) {
        handGradient = ctx.createRadialGradient(this.focus.x, this.focus.y, 1, this.focus.x, this.focus.y, this.size);
        handGradient.addColorStop(0, this.secondColour);
        handGradient.addColorStop((1-this.coatMod[0])/2, this.secondColour);
        handGradient.addColorStop(1, this.firstColour);
        ctx.fillStyle = handGradient;
        ctx.strokeStyle = handGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x-this.size+(this.size/3), this.y+(this.size/1.25));
        ctx.rotate(-this.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, this.size/4*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(+this.rotation);
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.save(); // 0 open
        ctx.translate(this.x+this.size-(this.size/3), this.y+(this.size/1.25));
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/4*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(+this.rotation);
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x-this.size+(this.size/3), this.y+(this.size/1.25));
        ctx.rotate(-this.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, this.size/4*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(+this.rotation);
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x+this.size-(this.size/3), this.y+(this.size/1.25));
        ctx.rotate(-this.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, this.size/4*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(+this.rotation);
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore(); // closed
      }
    }
    ctx.globalAlpha = 1;
  };
}
