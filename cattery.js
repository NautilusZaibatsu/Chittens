

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
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize;
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox+currentChibis].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = Math.round((Math.random()*50));
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
      chibis[thisCatBox+currentChibis].size = chibis[thisCatBox+currentChibis].maxSize;
      chibis[thisCatBox+currentChibis].coatMod[0] = Math.random();
      chibis[thisCatBox+currentChibis].coatMod[1] = Math.random();
      chibis[thisCatBox+currentChibis].thickness = (Math.random()*0.5)+0.5;
      chibis[thisCatBox+currentChibis].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox+currentChibis].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].birthday = Math.random()*1000;
      chibis[thisCatBox+currentChibis].love = Math.round((Math.random()*50));
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
        ctx.fillText(this.id+'Age '+ chibis[this.id].age, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 25);
        ctx.fillText('Gender '+chibis[this.id].gender, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 40);
        let c2 = ntc.name(chibis[this.id].secondColour)[1];
        let cString = ntc.name(chibis[this.id].firstColour)[1];
        if (c2 !== cString) {
          cString += ' & '+ c2;
        }
        ctx.fillText('Colour '+cString, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 55);
        ctx.fillText('Maximum size '+Math.round((chibis[this.id].maxSize)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 70);
        ctx.fillText('Thickness '+Math.round((chibis[this.id].thickness*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 85);
        ctx.fillText('Legginess '+Math.round((chibis[this.id].legginess*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 100);
        ctx.fillText('Ear width '+Math.round((chibis[this.id].ears*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 115);
        ctx.fillText('Birthhour '+tickerToTime(Math.round(chibis[this.id].birthday)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 130);
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
