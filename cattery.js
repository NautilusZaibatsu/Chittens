const boxSize = 150;
const boxPadding = 20;
const boxColumns = 3;
const boxRows = 3;
const boxThickness = 10;


function initFemaleCattery() {
  sendMessage('\u2764 Choose a female Chibi');
  selection = null;
  buttons[1].available = false;
  chibis = [];
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + 75, 6, (Math.random()*6)+8, 'girl', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox;
      chibis[thisCatBox].age = 1;
      chibis[thisCatBox].size = chibis[thisCatBox].maxSize;
      chibis[thisCatBox].coatMod[0] = Math.random();
      chibis[thisCatBox].coatMod[1] = Math.random();
      chibis[thisCatBox].firstColour = randomColourRealistic();
      chibis[thisCatBox].secondColour = randomColourRealistic();
      chibis[thisCatBox].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox].birthday = Math.random()*1000;
      while (chibis[thisCatBox].name == null) {
        chibis[thisCatBox].name = getFemaleName(Math.floor(Math.random()*350));
      }
    }
  }
}

function initMaleCattery() {
  sendMessage('\u2764 Choose a male Chibi');
  selection = null;
  buttons[1].available = false;
  boxes = [];
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + 75, 6, (Math.random()*5)+9, 'boy', Math.random()));
      let thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox+1;
      chibis[thisCatBox+1].age = 1;
      chibis[thisCatBox+1].size = chibis[thisCatBox+1].maxSize;
      chibis[thisCatBox+1].coatMod[0] = Math.random();
      chibis[thisCatBox+1].coatMod[1] = Math.random();
      chibis[thisCatBox+1].firstColour = randomColourRealistic();
      chibis[thisCatBox+1].secondColour = randomColourRealistic();
      chibis[thisCatBox+1].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+1].birthday = Math.random()*1000;
      while (chibis[thisCatBox+1].name == null) {
        chibis[thisCatBox+1].name = getMaleName(Math.floor(Math.random()*350));
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
      ctx.strokeStyle = mixTwoColours(trueWhite, outputArray[2]);
      if (!this.selected && this.highlighted) {
        ctx.fillText(chibis[this.id].name, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2)+10);
        ctx.fillText('Age '+ chibis[this.id].age, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 25);
        ctx.fillText('Gender '+ chibis[this.id].gender, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 40);
      }
      } else {
        ctx.strokeStyle = outputArray[2];
      }
    ctx.save();
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
