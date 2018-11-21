

function initLitter(mParent, fParent) {
  choosingChibi = true;
  maleParent = mParent;
  femaleParent = fParent;
  chosenKitten = false;
  sendMessage('\u2764 '+fParent.name+' gave birth to '+mParent.name+'\'s chittens');
  selection = null;
  buttons[1].available = false;
  buttons[1].displayed = true;
  buttons[2].displayed = true;
  labels[1].displayed = true;
  labels[1] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 110, 'Choose one of '+fParent.name+' and '+mParent.name+'\'s litter to keep');
  labels[0].displayed = true;
  labels[0] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'The others will be adopted by nice people')
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
      chibis[thisCatBox+currentChibis].x = (canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2);
      chibis[thisCatBox+currentChibis].y = (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2);
      count++;
  }
}
}


function initFemaleCattery() {
  choosingChibi = true;
  sendMessage('\u2764 Choose a female Chibi');
  selection = null;
  buttons[1].available = false;
  chibis = [];
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)/1.1, 'Female', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox;
      chibis[thisCatBox].age = Math.round(Math.random()*5);
      chibis[thisCatBox].size = chibis[thisCatBox].maxSize;
      chibis[thisCatBox].coatMod[0] = Math.random();
      chibis[thisCatBox].coatMod[1] = Math.random();
      chibis[thisCatBox].thickness = (Math.random()*0.6)+0.4;
      chibis[thisCatBox].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox].birthday = Math.random()*1000;
      chibis[thisCatBox].love = Math.round((Math.random()*50));
      while (chibis[thisCatBox].name == null) {
        chibis[thisCatBox].name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
    }
  }
}

function initMaleCattery() {
  choosingChibi = true;
  sendMessage('\u2764 Choose a male Chibi');
  selection = null;
  buttons[1].available = false;
  labels[1] = new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'Choose a boy');
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)*1.1, 'Male', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox+1;
      chibis[thisCatBox+1].age = Math.round(Math.random()*5);
      chibis[thisCatBox+1].size = chibis[thisCatBox+1].maxSize;
      chibis[thisCatBox+1].coatMod[0] = Math.random();
      chibis[thisCatBox+1].coatMod[1] = Math.random();
      chibis[thisCatBox+1].thickness = (Math.random()*0.6)+0.4;
      chibis[thisCatBox+1].legginess = (Math.random()*0.9)+0.1;
      chibis[thisCatBox+1].firstColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+1].secondColour = mixTwoColours(randomColourRealistic(), randomColourRealistic(), 0.5);
      chibis[thisCatBox+1].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+1].birthday = Math.random()*1000;
      chibis[thisCatBox+1].love = Math.round((Math.random()*50));
      while (chibis[thisCatBox+1].name == null) {
        chibis[thisCatBox+1].name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
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
        ctx.fillText('Maximum size '+Math.round((chibis[this.id].maxSize)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 70);
        ctx.fillText('Thickness '+Math.round((chibis[this.id].thickness*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 85);
        ctx.fillText('Legginess '+Math.round((chibis[this.id].legginess*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 100);
        ctx.fillText('Ear protrusion '+Math.round((chibis[this.id].ears*100))+'%', (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 115);
        ctx.fillText('Birthhour '+Math.round(chibis[this.id].birthday), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 130);
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
