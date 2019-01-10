/**
* function to initialise all the buttons
*/
function initButtons() {
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 70, 'Show me more'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 30, 'Choose this Chibi'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 85, 'Give them all away'));
  buttons[0].visible = false;
  buttons[1].visible = false;
  buttons[2].visible = false;
  buttons.push(new Button(canvasWidth/2, 370, 'Give away'));
  buttons.push(new Button(canvasWidth/2, 405, 'Close'));
  buttons.push(new Button(canvasWidth/2, 440, 'Save as .chi file'));
  buttons[3].visible = false;
  buttons[4].visible = false;
  buttons[5].visible = false;
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 110, 'Load from .chi file'));
  labels.push(new Button(canvasWidth/2, 10, 'Welcome message'));
  labels.push(new Button(canvasWidth/2, 45, 'Choose a ....'));
  labels.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 100, 'Selection'));
  labels.push(new Button(canvasWidth/2, 80, 'X'));
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
  this.height = 30;
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
      ctx.fillText(this.text, 10, 20);
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
      if (selection.albinism) {
        cString = 'Albino';
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
      let offsetX = 0;
      if ((cString.length > selection.name.length) && (cString.length > 8)) { // 8 == length of 'positive' and 'negative'
        offsetX = (11 + cString.length)*fontWidth/2;
      } else if (selection.name.length > 8) {
        offsetX = (11 + selection.name.length)*fontWidth/2;
      } else {
        offsetX = (11 + 8)*fontWidth/2;
      }
      ctx.fillStyle = mixTwoColours(outputArray[2], trueWhite);
      ctx.fillRect(-offsetX - 20 + (canvasWidth/2), 125, (offsetX*2) + 40, 215 + 20 );
      ctx.fillStyle = outputArray[2];
      ctx.fillText('Name', -offsetX + (canvasWidth/2), 140 + 10);
      ctx.fillText(selection.name, -offsetX + (canvasWidth/2) + 100, 140 + 10);
      ctx.fillText('ID', -offsetX + (canvasWidth/2), 140 + 25);
      ctx.fillText(selection.id, -offsetX + (canvasWidth/2) + 100, 140 + 25);
      ctx.fillText('Age ', -offsetX + (canvasWidth/2), 140 + 40);
      ctx.fillText(selection.age, -offsetX + (canvasWidth/2) + 100, 140 + 40);
      ctx.fillText('Gender ', -offsetX + (canvasWidth/2), 140 + 55);
      ctx.fillText(selection.gender, -offsetX + (canvasWidth/2) + 100, 140 + 55);
      ctx.fillText('Colour ', -offsetX + (canvasWidth/2), 140 + 70);
      ctx.fillText(cString, -offsetX + (canvasWidth/2) + 100, 140 + 70);
      ctx.fillText('Size ', -offsetX + (canvasWidth/2), 140 + 85);
      ctx.fillText(Math.round(selection.size), -offsetX + (canvasWidth/2) + 100, 140 + 85);
      ctx.fillText('Max size ', -offsetX + (canvasWidth/2), 140 + 100);
      ctx.fillText(Math.round(selection.maxSize), -offsetX + (canvasWidth/2) + 100, 140 + 100);
      ctx.fillText('Thickness ', -offsetX + (canvasWidth/2), 140 + 115);
      ctx.fillText(Math.round((selection.thickness*100))+'%', -offsetX + (canvasWidth/2) + 100, 140 + 115);
      ctx.fillText('Legginess ', -offsetX + (canvasWidth/2), 140 + 130);
      ctx.fillText(Math.round((selection.legginess*100))+'%', -offsetX + (canvasWidth/2) + 100, 140 + 130);
      ctx.fillText('Ear width ', -offsetX + (canvasWidth/2), 140 + 145);
      ctx.fillText(Math.round((selection.ears*100))+'%', -offsetX + (canvasWidth/2) + 100, 140 + 145);
      ctx.fillText('Tail length ', -offsetX + (canvasWidth/2), 140 + 160);
      ctx.fillText(Math.round((selection.tailLength*100))+'%', -offsetX + (canvasWidth/2) + 100, 140 + 160);
      ctx.fillText('Birthhour ', -offsetX + (canvasWidth/2), 140 + 175);
      ctx.fillText(tickerToTime(Math.round(selection.birthday)), -offsetX + (canvasWidth/2) + 100, 140 + 175);
      ctx.fillText('Litters ', -offsetX + (canvasWidth/2), 140 + 190);
      ctx.fillText(selection.litters, -offsetX + (canvasWidth/2) + 100, 140 + 190);
      ctx.fillText('Albino Gene ', -offsetX + (canvasWidth/2), 140 + 205);
      let ag = 'Negative';
      if (selection.albinismGene) {
        ag = 'Positive';
      }
      ctx.fillText(ag, -offsetX + (canvasWidth/2) + 100, 140 + 205);
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
    labels[3].visible = false;
    if (!chosenChibiF) {
      chosenChibiF = true;
      for (let i = currentChibis; i < chibis.length; i++) {
        if (chibis[i] !== selection) {
          chibis.splice(i, 1);
          i--;
        }
      }
      sendMessage(selection.name+' was adopted');
      speech.push(new Speak(selection, neutralWord()));
      selection.sitting = false;
      createGlyphs(selection.x, selection.y, selection.firstColour, '\u2764');
      seeds.push(new Seed(randomColourFruity(), selection));
      seeds.push(new Seed(randomColourFruity(), selection));
      seeds[seeds.length-1].timer = 750;
      boxes = [];
      buttons[0].visible = false;
      buttons[1].visible = false;
      buttons[6].visible = false;
      labels[0].visible = false;
      labels[1].visible = false;
      selection.inCatBox = null;
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
      speech.push(new Speak(selection, neutralWord()));
      selection.sitting = false;
      createGlyphs(selection.x, selection.y, selection.firstColour, '\u2764');
      seeds.push(new Seed(randomColourFruity(), selection));
      seeds.push(new Seed(randomColourFruity(), selection));
      seeds[seeds.length-1].timer = 750;
      boxes = [];
      buttons[0].visible = false;
      buttons[1].visible = false;
      buttons[6].visible = false;
      labels[0].visible = false;
      labels[1].visible = false;
      selection.inCatBox = null;
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
      speech.push(new Speak(selection, neutralWord()));
      selection.size *= 0.5;
      selection.reinitSizes();
      selection.sitting = false;
      createGlyphs(selection.x, selection.y, selection.firstColour, '\u2764');
      selection.reinitSizes;
      boxes = [];
      buttons[0].visible = false;
      buttons[1].visible = false;
      buttons[2].visible = false;
      labels[0].visible = false;
      labels[1].visible = false;
      selection.inCatBox = null;
      choosingChibi = false;
      selection = null;
    }
    break;
    case 2:
    labels[3].visible = false;
    chosenKitten = true;
    for (let i = currentChibis; i < chibis.length; i++) {
      chibis.splice(currentChibis, chibis.length - currentChibis);
    }
    sendMessage('A litter of chittens was rehomed');
    boxes = [];
    buttons[0].visible = false;
    buttons[1].visible = false;
    buttons[2].visible = false;
    labels[0].visible = false;
    labels[1].visible = false;
    selection = null;
    choosingChibi = false;
    break;
    case 3:
    sendMessage(selection.name+' went to live with someone else');
    speech.push(new Speak(selection, angryWord()));
    selectionInfo.visible = false;
    labels[2].visible = false;
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
    for (let i = 0, stop = false; i < chibis.length && !stop; i++) {
      if (chibis[i] == selection) {
        stop = true;
        graveStones.push(new Grave(selection.x, selection.y, selection.size, selection.speedX, selection.speedY, selection.elder, selection.firstColour));
        removeRelationships(selection);
        chibis.splice(i, 1);
      }
    }
    selection = null;
    break;
    case 4:
    selectionInfo.visible = false;
    labels[2].visible = false;
    buttons[3].visible = false;
    buttons[4].visible = false;
    buttons[5].visible = false;
    break;
    case 5:
    saveToFile(selection);
    break;
    case 6:
    openUploadDialog();
  }
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function clickMouse(e) {
  let clickedSomething = false;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].available && buttons[i].visible && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
      clickedSomething = true;
      handleButton(i);
    }
  }
  for (let i = 0; i < boxes.length; i++) {
    if (detectCollision(pointerPos, boxes[i])) {
      clickedSomething = true;
      selection = chibis[i+currentChibis];
      boxes[i].selected = true;
    } else {
      boxes[i].selected = false;
    }
  }
  if (!clickedSomething && !(chosenChibiF && chosenChibiM)) {
    selection = null;
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].selected = false;
    }
    let genderString = 'female';
    if (chosenChibiF) {
      genderString = 'male';
    }
    if (!chosenChibiM) {
      sendMessage('\u2764 Choose a '+genderString+' Chibi');
      buttons[1].available = false;
    }
  }
  if ((!chosenChibiF || !chosenChibiM || !chosenKitten) && selection !== null) {
    buttons[1].available = true;
  }
  // now select Chibis
  if (!clickedSomething && !choosingChibi && chosenChibiF && chosenChibiM && chosenKitten) {
    for (let i = chibis.length-1; i >= 0; i--) {
      if (detectCollision(pointerPos, chibis[i])) {
        selection = chibis[i];
        labels[2].visible = true;
        labels[2].text = selection.name;
        labels[2].reinitSizes();
        selectionInfo.visible = true;
        buttons[3].visible = true;
        buttons[4].visible = true;
        buttons[5].visible = true;
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
