function initButtons() {
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 70, 'Show me more'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 30, 'Choose this Chibi'));
  buttons.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) + (3*boxSize) + 70, 'Give them all away'));
  buttons[2].displayed = false;
  labels.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 110, 'Welcome to the Cattery'));
  labels.push(new Button(canvasWidth/2, (canvasHeight/2) - ((3*(boxSize+boxPadding))/2) - 70, 'Choose a girl'));
}

/**
* function to describe a button
* @param {int} x - the x coordinate
* @param {int} y - the y coordinate
*/
function Button(x, y, text) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.width = (this.text.length*fontWidth)+20;
  this.size = ((this.text.length*fontWidth)+20);
  this.height = 30;
  this.displayed = true;
  this.available = true;
  this.highlighted = false;
  this.update = function() {
    if (this.displayed) {
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

function handleButton(input) {
  switch (input) {
    case 0:
    if (!chosenChibiF) {
      initFemaleCattery();
    } else if (!chosenChibiM) {
      for (let i = 1; i < chibis.length; i++) {
        if (chibis[i] !== selection) {
          chibis.splice(i, 1);
          i--;
        }
      }
      initMaleCattery();
    }
    break;
    case 1:
    if (!chosenChibiF) {
      chosenChibiF = true;
      for (let i = 0; i < chibis.length; i++) {
        if (chibis[i] !== selection) {
          chibis.splice(i, 1);
          i--;
        }
      }
      sendMessage('adopted '+chibis[0].name);
      createGlyphs(chibis[0].x, chibis[0].y, chibis[0].firstColour, '\u2764');
      initMaleCattery();
      chibis[0].inCatBox = null;
      choosingChibi = false;
    } else if (!chosenChibiM) {
      chosenChibiM = true;
      for (let i = 1; i < chibis.length; i++) {
        if (chibis[i] !== selection) {
          chibis.splice(i, 1);
          i--;
        }
      }
      sendMessage('adopted '+chibis[1].name);
      createGlyphs(chibis[1].x, chibis[1].y, chibis[1].firstColour, '\u2764');
      chibis[0].id = '0000';
      chibis[1].id = '0001';
      selection = null;
      boxes = [];
      buttons[0].displayed = false;
      buttons[1].displayed = false;
      labels[0].displayed = false;
      labels[1].displayed = false;
      sendMessage('\u2764 Once upon a time...');
      sendMessage('It was just the two of us; '+chibis[1].name+' and '+chibis[0].name);
      chibis[1].inCatBox = null;
      choosingChibi = false;
    } else if (!chosenKitten) {
      chosenKitten = true;
        for (let i = currentChibis; i < chibis.length; i++) {
          if (chibis[i] !== selection) {
            chibis.splice(i, 1);
            i--;
          }
      }
      sendMessage(selection.name+' joined the family');
      createGlyphs(selection.x, selection.y, selection.firstColour, '\u2764');
      boxes = [];
      buttons[0].displayed = false;
      buttons[1].displayed = false;
      labels[0].displayed = false;
      labels[1].displayed = false;
      selection.inCatBox = null;
      selection = null;
      choosingChibi = false;
    }
    break;
    case 2:
    chosenKitten = true;
      for (let i = currentChibis; i < chibis.length; i++) {
          chibis.splice(currentChibis, chibis.length - currentChibis);
    }
    sendMessage('A litter of chittens was rehomed');
    boxes = [];
    buttons[0].displayed = false;
    buttons[1].displayed = false;
    buttons[2].displayed = false;
    labels[0].displayed = false;
    labels[1].displayed = false;
    selection = null;
    choosingChibi = false;
  }
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function clickMouse(e) {
  let clickedSomething = false;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].available && buttons[i].displayed && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
      clickedSomething = true;
      handleButton(i);
    }
  }
  for (let i = 0; i < boxes.length; i++) {
    if (detectCollision(pointerPos, boxes[i])) {
      clickedSomething = true;
      if (!chosenChibiF) {
      selection = chibis[i];
    } else if (!chosenChibiM) {
      selection = chibis[i+1];
    } else {
      selection = chibis[i+currentChibis];
    }
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
      sendMessage('Selected '+selection.name);
      sendMessage('Age '+selection.age);
      sendMessage('Children '+ selection.children);
      sendMessage('Gender '+selection.gender);
      let c2 = ntc.name(selection.secondColour)[1];
      let cString = ntc.name(selection.firstColour)[1];
      if (c2 !== cString) {
        cString += ' & '+ c2;
      }
      sendMessage('Colour '+cString);
      sendMessage('Maximum size '+Math.round((selection.maxSize)));
      sendMessage('Thickness '+Math.round((selection.thickness*100))+'%');
      sendMessage('Legginess '+Math.round((selection.legginess*100))+'%');
      sendMessage('Ear protrusion '+Math.round((selection.ears*100))+'%');
      sendMessage('Birthhour '+Math.round(selection.birthday));
    }
  }
}
}

function hover() {
  let hovered = false;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].available && buttons[i].displayed && pointerPos.x < buttons[i].x + (buttons[i].width/2) && pointerPos.x > buttons[i].x - (buttons[i].width/2) && pointerPos.y < buttons[i].y + buttons[i].height && pointerPos.y > buttons[i].y) {
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
