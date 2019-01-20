/**
* function to initialise all the buttons
*/
function initButtons() {
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 65, 'Show me more'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 30, 'Choose this Chibi'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 85, 'Give them all away'));
  buttons[0].visible = false;
  buttons[1].visible = false;
  buttons[2].visible = false;
  buttons.push(new Button(canvasWidth/2, 335, 'Give away'));
  buttons.push(new Button(canvasWidth/2, 370, 'Close'));
  buttons.push(new Button(canvasWidth/2, 405, 'Save as .chi file'));
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  // menu shit
  buttons.push(new Button(396, 0, 'Load'));

  // gene editing
  buttons.push(new Button(60, 590, 'Save Female'));
  buttons.push(new Button(60, 625, 'Save Male'));
  buttons.push(new Button(60, 660, 'Close'));
  buttons[7].visible = false;
  buttons[8].visible = false;
  buttons[9].visible = false;
  // menu shit
  buttons.push(new Button(160, 0, 'Create'));
  buttons.push(new Button(240, 0, 'Adopt F'));
  buttons.push(new Button(324, 0, 'Adopt M'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 100, 'Close'));
  buttons[13].visible = false;


  labels.push(new Button(canvasWidth/2, 10, 'Welcome message'));
  labels.push(new Button(canvasWidth/2, 45, 'Choose a ....'));
  labels.push(new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 85, 'X'));
  labels[0].visible = false;
  labels[1].visible = false;
  labels[2].visible = false;
  selectionInfo = new InfoPanel();
}

/**
* function to describe a button
* @param {int} x - the x coordinate of the middle of the button
* @param {int} y - the y coordinate of the top of the button
* @param {string} text - text on the button
*/
function Button(x, y, text) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.width = (this.text.length*fontWidth)+20;
  this.size = ((this.text.length*fontWidth)+20);
  this.height = 25;
  this.visible = true;
  this.available = true;
  this.highlighted = false;
  this.reinitSizes = function() {
    this.width = (this.text.length*fontWidth)+20;
    this.size = ((this.text.length*fontWidth)+20);
  };
  this.update = function() {
    if (this.visible) {
      ctx.save();
      ctx.translate(this.x -(this.width/2), this.y);
      if (this.highlighted) {
        ctx.fillStyle = outputArray[2];
      } else if (!this.available) {
        ctx.fillStyle = outputArray[3];
      } else {
        ctx.fillStyle = mixTwoColours(trueWhite, outputArray[2]);
      }
      ctx.fillRect(0, 0, this.width, this.height);
      if (this.highlighted) {
        ctx.fillStyle = mixTwoColours(trueWhite, outputArray[2]);
      } else {
        ctx.fillStyle = outputArray[2];
      }
      ctx.fillText(this.text, 10, 18);
      ctx.restore();
    }
  };
}
/**
* function to describe the information panel
*/
function InfoPanel() {
  this.visible = false;
  this.update = function() {
    if (this.visible) {
      if (selection.snuggling > 0) {
        buttons[3].available = false;
      } else {
        buttons[3].available = true;
      }
      let cString = '';
      if (selection.albino || selection.sphynx) {
        if (selection.albino) {
          cString = 'Albino ';
        }
        if (selection.sphynx) {
          cString += 'Sphynx';
        }
      } else {
        let c1 = ntc.name(selection.firstColour)[1];
        let c2 = ntc.name(selection.secondColour)[1];
        let c3 = ntc.name(selection.thirdColour)[1];
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
      let eString = '';
      if (selection.eyeColour == selection.eyeColour2 && !selection.albino) {
        eString = ntc.name(selection.eyeColour)[1];
      } else if (selection.albino) {
        eString = 'Albino';
      } else {
        eString = 'Heterochromia';
      }
      // determine width of this box
      let offsetX = 8; // 8 == length of 'positive' and 'negative'
      if (cString.length > offsetX) {
        offsetX = cString.length;
      }
      if (eString.length > offsetX) {
        offsetX = eString.length;
      }
      if (selection.name.length > offsetX) {
        offsetX = selection.name.length;
      }
      if (selection.breed.length > offsetX) {
        offsetX = selection.breed.length;
      }
      offsetX += 11;
      offsetX *= fontWidth/2;

      ctx.fillStyle = mixTwoColours(outputArray[2], trueWhite);
      ctx.fillRect(-offsetX - 20 + (canvasWidth/2), 125, (offsetX*2) + 40, 205 );
      ctx.fillStyle = outputArray[2];
      ctx.fillText('Name', -offsetX + (canvasWidth/2), 140 + 10);
      ctx.fillText(selection.name, -offsetX + (canvasWidth/2) + 100, 140 + 10);
      ctx.fillText('ID', -offsetX + (canvasWidth/2), 140 + 25);
      ctx.fillText(selection.id, -offsetX + (canvasWidth/2) + 100, 140 + 25);
      ctx.fillText('Breed ', -offsetX + (canvasWidth/2), 140 + 40);
      ctx.fillText(selection.breed, -offsetX + (canvasWidth/2) + 100, 140 + 40);
      ctx.fillText('Age ', -offsetX + (canvasWidth/2), 140 + 55);
      ctx.fillText(selection.age, -offsetX + (canvasWidth/2) + 100, 140 + 55);
      ctx.fillText('Gender ', -offsetX + (canvasWidth/2), 140 + 70);
      ctx.fillText(selection.gender, -offsetX + (canvasWidth/2) + 100, 140 + 70);
      ctx.fillText('Colour ', -offsetX + (canvasWidth/2), 140 + 85);
      ctx.fillText(cString, -offsetX + (canvasWidth/2) + 100, 140 + 85);
      ctx.fillText('Eye colour ', -offsetX + (canvasWidth/2), 140 + 100);
      ctx.fillText(eString, -offsetX + (canvasWidth/2) + 100, 140 + 100);
      ctx.fillText('Size ', -offsetX + (canvasWidth/2), 140 + 115);
      ctx.fillText(Math.round(selection.size), -offsetX + (canvasWidth/2) + 100, 140 + 115);
      ctx.fillText('Birthhour ', -offsetX + (canvasWidth/2), 140 + 130);
      ctx.fillText(tickerToTime(Math.round(selection.birthday)), -offsetX + (canvasWidth/2) + 100, 140 + 130);
      ctx.fillText('Litters ', -offsetX + (canvasWidth/2), 140 + 145);
      ctx.fillText(selection.litters, -offsetX + (canvasWidth/2) + 100, 140 + 145);
      ctx.fillText('Albino Gene ', -offsetX + (canvasWidth/2), 140 + 160);
      let ag = 'Negative';
      if (selection.albinoGene) {
        ag = 'Positive';
      }
      ctx.fillText(ag, -offsetX + (canvasWidth/2) + 100, 140 + 160);
      ctx.fillText('Sphynx Gene ', -offsetX + (canvasWidth/2), 140 + 175);
      let sg = 'Negative';
      if (selection.sphynxGene) {
        sg = 'Positive';
      }
      ctx.fillText(sg, -offsetX + (canvasWidth/2) + 100, 140 + 175);
    }
  };
}

function handleButton(input) {
  switch (input) {
    case 0:
    if (!chosenChibiF) {
      for (let i = currentChibis; i < chibis.length; i++) {
        chibis.splice(i, 1);
        i--;
      }
      initFemaleCattery();
    } else if (!chosenChibiM) {
      for (let i = currentChibis; i < chibis.length; i++) {
        chibis.splice(i, 1);
        i--;
      }
      initMaleCattery();
    }
    break;
    case 1:
    if (selection !== null) {
      labels[2].visible = false;
      if (!chosenChibiF) {
        chosenChibiF = true;
        for (let i = currentChibis; i < chibis.length; i++) {
          if (chibis[i] !== selection) {
            chibis.splice(i, 1);
            i--;
          }
        }
        sendMessage(selection.name+' was adopted');
        selection.love = 100;
        speech.push(new Speak(selection, neutralWord()));
        selection.sitting = false;
        createGlyphs(selection.x, selection.y, '\u2764');
        seeds.push(new Seed(randomColourFruity(), selection));
        seeds.push(new Seed(randomColourFruity(), selection));
        seeds[seeds.length-1].timer = 750;
        boxes = [];
        buttons[0].visible = false;
        buttons[1].visible = false;
        buttons[2].visible = false;
        labels[0].visible = false;
        labels[1].visible = false;
        selection.inCatBox = null;
        buttons[10].available = true;
        buttons[11].available = true;
        buttons[12].available = true;
        buttons[6].available = true;
        buttons[13].visible = false;
        choosingChibi = false;
        selection = null;
      } else if (!chosenChibiM) {
        chosenChibiM = true;
        for (let i = currentChibis; i < chibis.length; i++) {
          if (chibis[i] !== selection) {
            chibis.splice(i, 1);
            i--;
          }
        }
        sendMessage(selection.name+' was adopted');
        selection.love = 100;
        speech.push(new Speak(selection, neutralWord()));
        selection.sitting = false;
        createGlyphs(selection.x, selection.y, '\u2764');
        seeds.push(new Seed(randomColourFruity(), selection));
        seeds.push(new Seed(randomColourFruity(), selection));
        seeds[seeds.length-1].timer = 750;
        boxes = [];
        buttons[0].visible = false;
        buttons[1].visible = false;
        buttons[3].visible = false;
        labels[0].visible = false;
        labels[1].visible = false;
        selection.inCatBox = null;
        buttons[10].available = true;
        buttons[11].available = true;
        buttons[12].available = true;
        buttons[6].available = true;
        buttons[13].visible = false;
        choosingChibi = false;
        selection = null;
      } else if (!chosenKitten) {
        chosenKitten = true;
        for (let i = currentChibis; i < chibis.length; i++) {
          if (chibis[i] !== selection) {
            chibis.splice(i, 1);
            i--;
          }
        }
        sendMessage(selection.name+' joined the family');
        selection.love = 100;
        speech.push(new Speak(selection, neutralWord()));
        selection.size *= 0.5;
        selection.reinitSizeAndColour();
        selection.sitting = false;
        createGlyphs(selection.x, selection.y, '\u2764');
        selection.reinitSizeAndColour;
        boxes = [];
        buttons[0].visible = false;
        buttons[1].visible = false;
        buttons[2].visible = false;
        labels[0].visible = false;
        labels[1].visible = false;
        buttons[10].available = true;
        buttons[11].available = true;
        buttons[12].available = true;
        buttons[6].available = true;
        selection.inCatBox = null;
        choosingChibi = false;
        selection = null;
      }
    }
    break;
    case 2:
    labels[2].visible = false;
    chosenKitten = true;
    for (let i = currentChibis; i < chibis.length; i++) {
      chibis.splice(currentChibis, chibis.length - currentChibis);
    }
    sendMessage('A litter of chittens was rehomed');
    boxes = [];
    buttons[0].visible = false;
    buttons[1].visible = false;
    buttons[2].visible = false;
    buttons[10].available = true;
    buttons[11].available = true;
    buttons[12].available = true;
    buttons[6].available = true;
    labels[0].visible = false;
    labels[1].visible = false;
    selection = null;
    choosingChibi = false;
    break;
    case 3:
    sendMessage(selection.name+' went to live with someone else');
    speech.push(new Speak(selection, angryWord()));
    selectionInfo.visible = false;
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
    for (let i = 0, stop = false; i < chibis.length && !stop; i++) {
      if (chibis[i] == selection) {
        stop = true;
        graveStones.push(new Grave(selection.x, selection.y, selection.size, selection.speedX, selection.speedY, selection.elder, selection.firstColour));
        chibis[i].kill();
      }
    }
    selection = null;
    break;
    case 4:
    selectionInfo.visible = false;
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
    break;
    case 5:
    saveToFile(selection);
    break;
    case 6:
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
    openUploadDialog();
    break;
    case 7:
    pasteChibi(copyChibi(experiment));
    break;
    case 8:
    pasteChibi(copyChibi(experiment));
    chibis[chibis.length-1].gender = 'Male';
    chibis[chibis.length-1].name = null;
    while (chibis[chibis.length-1].name == null) {
      chibis[chibis.length-1].name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
    }
    break;
    case 9:
    geneEditing = false;
    buttons[7].visible = false;
    buttons[8].visible = false;
    buttons[9].visible = false;
    buttons[10].available = true;
    buttons[11].available = true;
    buttons[12].available = true;
    buttons[6].available = true;
    break;
    case 10:
    if (selection !== null) {
      cloneChibi(copyChibi(selection), experiment);
      reinitSliders();
      buttons[3].visible = false;
      buttons[4].visible = false;
      buttons[5].visible = false;
    }
    geneEditing = true;
    buttons[7].visible = true;
    buttons[8].visible = true;
    buttons[9].visible = true;
    buttons[10].available = false;
    buttons[11].available = false;
    buttons[12].available = false;
    buttons[6].available = false;
    break;
    case 11:
    initFemaleCattery();
    buttons[10].available = false;
    buttons[11].available = false;
    buttons[12].available = false;
    buttons[6].available = false;
    break;
    case 12:
    initMaleCattery();
    buttons[10].available = false;
    buttons[11].available = false;
    buttons[12].available = false;
    buttons[6].available = false;
    break;
    case 13:
    choosingChibi = false;
    chosenChibiF = true;
    chosenChibiM = true;
    selection = null;
    boxes = [];
    for (let i = currentChibis; i < chibis.length; i++) {
      if (chibis[i] !== selection) {
        chibis.splice(i, 1);
        i--;
      }
    }
    buttons[0].visible = false;
    buttons[1].visible = false;
    labels[0].visible = false;
    labels[1].visible = false;
    buttons[13].visible = false;
    buttons[10].available = true;
    buttons[11].available = true;
    buttons[12].available = true;
    buttons[6].available = true;
    break;
  }
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function clickMouse(e) {
  let clickedSomething = false;
  for (let i = 0; i < boxes.length; i++) {
    if (!clickedSomething && detectCollision(pointerPos, boxes[i])) {
      clickedSomething = true;
      selection = chibis[chibis.length - boxes.length + i];
      boxes[i].selected = true;
    } else {
      boxes[i].selected = false;
    }
  }
  if (!clickedSomething) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].available && buttons[i].visible && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
        clickedSomething = true;
        handleButton(i);
      }
    }
  }
  if (!clickedSomething && choosingChibi) {
    selection = null;
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].selected = false;
    }
    let genderString = 'female';
    if (chosenChibiF) {
      genderString = 'male';
    }
    if (!chosenChibiM || !chosenChibiF) {
      sendMessage('\u2764 Choose a '+genderString+' Chibi');
      buttons[1].available = false;
    }
  }
  if ((!chosenChibiF || !chosenChibiM || !chosenKitten) && selection !== null) {
    buttons[1].available = true;
  }
  // now select Chibis
  if (!clickedSomething && !choosingChibi) {
    for (let i = chibis.length-1; i >= 0 && !clickedSomething; i--) {
      if (detectCollision(pointerPos, chibis[i])) {
        clickedSomething = true;
        selection = chibis[i];
        selection.dragging = true;
        selectionInfo.visible = true;
        buttons[3].visible = true;
        buttons[4].visible = true;
        buttons[5].visible = true;
      }
    }
  }

  // if we are gene editing, turn on click checkers
  if (geneEditing) {
    // now check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (detectCollision(sliders[i].sBar, pointerPos)) {
        sliders[i].sBar.dragging = true;
        clickedSomething = true;
      } else {
        sliders[i].sBar.dragging = false;
      }
    }

    // colour bar
    if (pointerPos.x >= colourBars.x && pointerPos.x <= colourBars.x + 100 && pointerPos.y >= colourBars.y && pointerPos.y <= colourBars.y + 20) {
      if (pointerPos.x - colourBars.x < 25) {
        colourBars.selected = 0;
      } else if (pointerPos.x - colourBars.x < 50) {
        colourBars.selected = 1;
      } else if (pointerPos.x - colourBars.x < 75) {
        colourBars.selected = 2;
      } else {
        colourBars.selected = 3;
      }
    }
    // colour picker
    if (pointerPos.x >= colourBlock.x && pointerPos.x <= colourBlock.x + 100 && pointerPos.y >= colourBlock.y && pointerPos.y <= colourBlock.y + 100) {
      let xCoord = Math.round((pointerPos.x - colourBlock.x)/colourBlock.pixelSize);
      let yCoord = Math.round((pointerPos.y - colourBlock.y)/colourBlock.pixelSize);
      let newIndex = (yCoord*colourBlock.pixelColumns) + xCoord;
      if (newIndex > 624) {
        newIndex = 624;
      }
      if (colourBars.selected == 0) {
        experiment.firstColour = colourBlock.pixels[newIndex];
      } else if (colourBars.selected == 1) {
        experiment.secondColour = colourBlock.pixels[newIndex];
      } else if (colourBars.selected == 2) {
        experiment.thirdColour = colourBlock.pixels[newIndex];
      } else {
        experiment.eyeColour = colourBlock.pixels[newIndex];
      }
    }
  }
  if (!clickedSomething && chibis.includes(selection)) {
    selection = null;
    selectionInfo.visible = true;
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
  }
}

function unclickMouse(e) {
  if (chibis.includes(selection) && selection.dragging) {
    selection.dragging = false;
    selection.focus = selection.findClosestFireFly();
    // selection.speedX = dummypointerPos.speedX;
    // selection.speedY = dummypointerPos.speedY;
    // console.log('let go. speedX was '+dummypointerPos.speedX);
  }
  if (geneEditing) {
    // check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i].sBar.dragging) {
        sliders[i].sBar.dragging = false;
        if ((i > 6 && i < 18) || i == 26) {
          sliders[i].currentPos = Math.round(sliders[i].currentPos);
        }
        console.log('exact: '+sliders[i].currentPos);
      }
    }
  }
}

/**
* function to check for and process mouse hovering over objects
*/
function hover() {
  let hovered = false;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].available && buttons[i].visible && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
      buttons[i].highlighted = true;
      hovered = true;
    } else {
      buttons[i].highlighted = false;
    }
  }
  for (let i = 0; !hovered && i < boxes.length; i++) {
    if (pointerPos.x < boxes[i].x + boxes[i].size && pointerPos.x > boxes[i].x && pointerPos.y < boxes[i].y + boxes[i].size && pointerPos.y > boxes[i].y) {
      boxes[i].highlighted = true;
    } else {
      boxes[i].highlighted = false;
    }
  }
}

/**
* function to reiit the sliders when you load a new chibi etc
*/
function initSliders() {
  sliders = [];
  sliders[0] = new Slider(0.5, 1, experiment.thickness, 20, 185, 'thickness');
  sliders[1] = new Slider(5, 20, experiment.size, 20, 155, 'size');
  sliders[2] = new Slider(0, 1, experiment.legginess, 20, 215, 'legginess');
  sliders[3] = new Slider(0, 1, experiment.earWidth, 20, 275, 'ear width');
  sliders[4] = new Slider(0, 1, experiment.tailLength, 20, 305, 'tail length');
  sliders[5] = new Slider(0, 1, experiment.coatMod[0], 20, 335, 'fade');
  sliders[6] = new Slider(0, 1, experiment.coatMod[1], 20, 365, 'coat angle');

  sliders[7] = new Slider(0, 2, experiment.bodypartCode[0], 130, 440, 'front foot left');
  sliders[8] = new Slider(0, 2, experiment.bodypartCode[1], 130, 470, 'front foot right');
  sliders[9] = new Slider(0, 2, experiment.bodypartCode[7], 130, 500, 'back foot left');
  sliders[10] = new Slider(0, 2, experiment.bodypartCode[8], 130, 530, 'back foot right');

  sliders[11] = new Slider(0, 2, experiment.bodypartCode[2], 130, 200, 'head');
  sliders[12] = new Slider(0, 2, experiment.bodypartCode[9], 130, 230, 'jowl left');
  sliders[13] = new Slider(0, 2, experiment.bodypartCode[10], 130, 260, 'jowl right');
  sliders[14] = new Slider(0, 2, experiment.bodypartCode[11], 130, 290, 'chin');

  sliders[15] = new Slider(0, 2, experiment.bodypartCode[3], 130, 320, 'left ear');
  sliders[16] = new Slider(0, 2, experiment.bodypartCode[4], 130, 350, 'right ear');
  sliders[17] = new Slider(0, 2, experiment.bodypartCode[5], 130, 380, 'body');
  sliders[18] = new Slider(0, 2, experiment.bodypartCode[6], 130, 410, 'tail');

  sliders[19] = new Slider(0, 1, experiment.nosePos, 20, 395, 'nose height');
  sliders[20] = new Slider(0, 1, experiment.eyePosX, 20, 425, 'eyes width');
  sliders[21] = new Slider(0, 1, experiment.eyePosY, 20, 455, 'eyes height');
  sliders[22] = new Slider(0, 1, experiment.headWidth, 20, 515, 'head width');
  sliders[23] = new Slider(0, 1, experiment.headHeight, 20, 545, 'head height');
  sliders[24] = new Slider(0, 1, experiment.eyeSize, 20, 485, 'eye size');
  sliders[25] = new Slider(0, 1, experiment.fangs, 20, 575, 'fang size');
  sliders[26] = new Slider(0, 6, experiment.pattern, 130, 560, 'pattern');
  sliders[27] = new Slider(0, 1, experiment.patternAlpha, 130, 590, 'opacity');
  sliders[28] = new Slider(0, 1, experiment.earHeight, 20, 245, 'ear height');
};

function reinitSliders() {
  sliders[0].currentPos = experiment.thickness;
  sliders[1].currentPos = experiment.size;
  sliders[2].currentPos = experiment.legginess;
  sliders[3].currentPos = experiment.earWidth;
  sliders[4].currentPos = experiment.tailLength;
  sliders[5].currentPos = experiment.coatMod[0];
  sliders[6].currentPos = experiment.coatMod[1];
  sliders[7].currentPos = experiment.bodypartCode[0];
  sliders[8].currentPos = experiment.bodypartCode[1];
  sliders[9].currentPos = experiment.bodypartCode[7];
  sliders[10].currentPos = experiment.bodypartCode[8];
  sliders[11].currentPos = experiment.bodypartCode[2];
  sliders[12].currentPos = experiment.bodypartCode[9];
  sliders[13].currentPos = experiment.bodypartCode[10];
  sliders[14].currentPos = experiment.bodypartCode[11];
  sliders[15].currentPos = experiment.bodypartCode[3];
  sliders[16].currentPos = experiment.bodypartCode[4];
  sliders[17].currentPos = experiment.bodypartCode[5];
  sliders[18].currentPos = experiment.bodypartCode[6];
  sliders[19].currentPos = experiment.nosePos;
  sliders[20].currentPos = experiment.eyePosX;
  sliders[21].currentPos = experiment.eyePosY;
  sliders[22].currentPos = experiment.headWidth;
  sliders[23].currentPos = experiment.headHeight;
  sliders[24].currentPos = experiment.eyeSize;
  sliders[25].currentPos = experiment.fangs;
  sliders[26].currentPos = experiment.pattern;
  sliders[27].currentPos = experiment.patternAlpha;
  sliders[28].currentPos = experiment.earHeight;
}

/**
* function to describe a slider
*/
function Slider(lowerLimit, upperLimit, currentPos, x, y, txt) {
  this.id = sliderIndex;
  sliderIndex ++;
  this.lowerLimit = lowerLimit;
  this.upperLimit = upperLimit;
  this.currentPos = currentPos;
  this.relativePosition = 0;
  this.proportion = 1;
  this.x = x;
  this.y = y;
  this.text = txt;
  this.sBar = new SliderBar(this);
  this.update = function() {
    // bar base is 0 to 100
    this.proportion = 100/(Math.abs(this.upperLimit - this.lowerLimit));
    this.relativePosition = this.proportion * (this.currentPos - this.lowerLimit);
    ctx.lineWidth = 2;
    ctx.strokeStyle = trueBlack;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 100, this.y);
    ctx.stroke();
    ctx.fillStyle = trueWhite;
    ctx.font = '12px' + ' ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.text, this.x, this.y - 8);
    ctx.globalAlpha = 1;
    this.sBar.update();
  };
}

/**
* function to describe a slider bar
*/
function SliderBar(parent) {
  this.parent = parent;
  this.dragging = false;
  this.colour = trueWhite;
  // translate coord to center
  this.x = this.parent.x;
  this.y = this.parent.y;
  this.size = 10;
  this.update = function() {
    // if (this.colour == trueWhite || !this.dragging) {
    //   if (this.parent.currentPos == 0) {
    //     this.parent.sBar.colour = experiment.firstColour;
    //   } else if (this.parent.currentPos == 1) {
    //     this.parent.sBar.colour = experiment.secondColour;
    //   } else if (this.parent.currentPos == 2) {
    //     this.parent.sBar.colour = experiment.thirdColour;
    //   }
    // }
    if (this.dragging) {
      let correctMouseX = pointerPos.x;
      if (correctMouseX < this.parent.x) {
        correctMouseX = this.parent.x;
      } else if (correctMouseX > this.parent.x + 100) {
        correctMouseX = this.parent.x + 100;
      }
      let score = (correctMouseX - this.parent.x);
      this.parent.currentPos = (score / this.parent.proportion) + this.parent.lowerLimit;
      this.x = correctMouseX;
      ctx.fillRect(this.x - 5, this.y -10, 10, 20);
      if (this.parent.id == 0) {
        experiment.thickness = this.parent.currentPos;
      } else if (this.parent.id == 1) {
        experiment.maxSize = this.parent.currentPos;
        experiment.size = experiment.maxSize;
      } else if (this.parent.id == 2) {
        experiment.legginess = this.parent.currentPos;
      } else if (this.parent.id == 3) {
        experiment.earWidth = this.parent.currentPos;
      } else if (this.parent.id == 4) {
        experiment.tailLength = this.parent.currentPos;
      } else if (this.parent.id == 5) {
        experiment.coatMod[0] = this.parent.currentPos;
      } else if (this.parent.id == 6) {
        experiment.coatMod[1] = this.parent.currentPos;
      } else if (this.parent.id == 7) {
        experiment.bodypartCode[0] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 8) {
        experiment.bodypartCode[1] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 9) {
        experiment.bodypartCode[7] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 10) {
        experiment.bodypartCode[8] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 11) {
        experiment.bodypartCode[2] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 12) {
        experiment.bodypartCode[9] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 13) {
        experiment.bodypartCode[10] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 14) {
        experiment.bodypartCode[11] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 15) {
        experiment.bodypartCode[3] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 16) {
        experiment.bodypartCode[4] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 17) {
        experiment.bodypartCode[5] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 18) {
        experiment.bodypartCode[6] = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 19) {
        experiment.nosePos = this.parent.currentPos;
      } else if (this.parent.id == 20) {
        experiment.eyePosX = this.parent.currentPos;
      } else if (this.parent.id == 21) {
        experiment.eyePosY = this.parent.currentPos;
      } else if (this.parent.id == 22) {
        experiment.headWidth = this.parent.currentPos;
      } else if (this.parent.id == 23) {
        experiment.headHeight = this.parent.currentPos;
      } else if (this.parent.id == 24) {
        experiment.eyeSize = this.parent.currentPos;
      } else if (this.parent.id == 25) {
        experiment.fangs = this.parent.currentPos;
      } else if (this.parent.id == 26) {
        experiment.pattern = Math.round(this.parent.currentPos);
      } else if (this.parent.id == 27) {
        experiment.patternAlpha = this.parent.currentPos;
      } else if (this.parent.id == 28) {
        experiment.earHeight = this.parent.currentPos;
      }
      experiment.reinitSizeAndColour();
    } else {
      this.x = this.parent.x + this.parent.relativePosition;
    }
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x - 2.5, this.y - 10, 5, 20);
  };
}

function ColourBar(x, y) {
  this.x = x;
  this.y = y;
  this.text = 'colours';
  this.selected = 0;
  this.update = function() {
    ctx.font = '12px' + ' ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.text, this.x, this.y - 8);
    ctx.globalAlpha = 1;
    ctx.fillStyle = experiment.firstColour;
    ctx.fillRect(this.x, this.y, 25, 20);
    ctx.fillStyle = experiment.secondColour;
    ctx.fillRect(this.x + 25, this.y, 25, 20);
    ctx.fillStyle = experiment.thirdColour;
    ctx.fillRect(this.x + 50, this.y, 25, 20);
    ctx.fillStyle = experiment.eyeColour;
    ctx.fillRect(this.x + 75, this.y, 25, 20);
    ctx.lineWidth = 3;
    ctx.strokeStyle = trueWhite;
    if (this.selected == 0) {
      ctx.strokeRect(this.x, this.y, 25, 20);
    } else if (this.selected == 1) {
      ctx.strokeRect(this.x + 25, this.y, 25, 20);
    } else if (this.selected == 2) {
      ctx.strokeRect(this.x + 50, this.y, 25, 20);
    } else if (this.selected == 3) {
      ctx.strokeRect(this.x + 75, this.y, 25, 20);
    }
  };
}

function ColourPixelBlock() {
  this.x = 130;
  this.y = 30;
  this.pixelSize = 4;
  this.huePixels = [];
  this.pixelRows = 25;
  this.pixelColumns = 25;
  // convert x axis
  let lrInterval = (256*6)/this.pixelColumns; // 71.68
  // generate hue gradient
  for (let i = 0; i < this.pixelColumns; i++) {
    this.huePixels.push((i * lrInterval)+(lrInterval/2));
  }
  // convert gradient positions to hex values
  for (let i = 0; i < this.huePixels.length; i ++) {
    if (this.huePixels[i] < 256) {
      let tmp = [255, 0, Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 256*2) {
      let tmp = [255 + 256 - Math.round(this.huePixels[i]), 0, 255];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 256*3) {
      let tmp = [0, Math.round(this.huePixels[i] - (256*2)), 255];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 256*4) {
      let tmp = [0, 255, 255 + (256*3) - Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 256*5) {
      let tmp = [Math.round(this.huePixels[i]) - (256*4), 255, 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 256*6) {
      let tmp = [255, 255 + (256*5) - Math.round(this.huePixels[i]), 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    }
  }

  let outputPixels = [];
  // create all rows and populate white - transparent - black fade
  let tmpPix = [];
  for (let i = 0; i < this.pixelRows; i ++) {
    if (i < this.pixelRows/2) {
      for (let j = 0; j < this.pixelRows; j++) {
        tmpPix[j] = mixTwoColours('#FFFFFF', this.huePixels[j], 1 - (i/this.pixelRows*2));
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else if (i > this.pixelRows/2) {
      for (let j = 0; j < this.pixelRows; j++) {
        tmpPix[j] = mixTwoColours('#000000', this.huePixels[j], (i - (this.pixelRows/2))/this.pixelRows*2);
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else {
      outputPixels = outputPixels.concat(this.huePixels);
    }
  }
  this.pixels = outputPixels;

  this.update = function() {
    for (let i = 0; i < outputPixels.length; i ++) {
      let row = Math.floor(i/this.pixelRows);
      ctx.fillStyle = this.pixels[i];
      ctx.fillRect(this.x + (i * this.pixelSize) - (row * this.pixelSize * this.pixelColumns), this.y + (row * this.pixelSize), this.pixelSize, this.pixelSize);
    }
  };
}
