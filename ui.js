// Breed filtering variables
let selectedBreedFilter = 'All'; // Current breed filter
let breedFilterButtons = []; // Array to hold breed filter buttons
let breedFilterVisible = false; // Whether breed filter buttons are shown

// Get available breeds based on gender from BREED_SPAWN_CONFIG
function getAvailableBreeds(gender) {
  let breeds = ['All', mixedBreed]; // Always include 'All' and mixedBreed at the top

  // Collect all breed names
  let breedNames = [];
  
  // Add regular breeds (available to all genders)
  BREED_SPAWN_CONFIG.regularBreeds.forEach(breed => {
    breedNames.push(breed.name);
  });

  // Add female-only breeds only for female adoption center
  if (gender === 'Female') {
    BREED_SPAWN_CONFIG.femaleOnlyBreeds.forEach(breed => {
      breedNames.push(breed.name);
    });
  }
  
  // Sort breed names alphabetically
  breedNames.sort();
  
  // Add sorted breeds to the list
  breeds = breeds.concat(breedNames);

  return breeds;
}

// Create breed filter buttons
function createBreedFilterButtons(gender) {
  // Preserve current visibility state
  const wasVisible = breedFilterVisible;
  
  // Clear existing breed filter buttons
  breedFilterButtons = [];

  const availableBreeds = getAvailableBreeds(gender);
  const buttonsPerRow = 1;
  const buttonWidth = 140;
  const buttonHeight = 25;
  const startY = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2);
  const startX = (canvasWidth / 2) + (boxSize * 2) - 20;

  availableBreeds.forEach((breed, index) => {
    const row = Math.floor(index / buttonsPerRow);
    const col = index % buttonsPerRow;
    const x = startX + (col * buttonWidth);
    const y = startY + (row * (buttonHeight + 5));

    let buttonTooltip;
    if (breed === 'All') {
      buttonTooltip = 'Show all breeds';
    } else if (breed === mixedBreed) {
      buttonTooltip = 'Show only mixed breeds and crossbreeds';
    } else {
      buttonTooltip = `Show only ${breed} chittens`;
    }
    
    let button = new Button(x, y, breed, buttonTooltip, 'left');
    button.visible = wasVisible; // Preserve previous visibility state
    breedFilterButtons.push(button);
  });
}

// Toggle breed filter visibility
function toggleBreedFilter() {
  breedFilterVisible = !breedFilterVisible;
  breedFilterButtons.forEach(button => {
    button.visible = breedFilterVisible;
  });

  // Update toggle button text and recalculate the size of the button
  if (buttons[15]) { // Breed filter toggle button
    buttons[15].text = breedFilterVisible ? 'Hide filters' : 'Breed filters';
    buttons[15].reinitSizes();
  }
}

// Reset breed filter when adoption center closes
function resetBreedFilter() {
  breedFilterVisible = false;
  selectedBreedFilter = 'All';
  breedFilterButtons.forEach(button => {
    button.visible = false;
  });
  if (buttons[15]) {
    buttons[15].text = 'Filter by breed';
    buttons[15].reinitSizes();
  }
}

/**
* function to initialise all the buttons
*/
function initButtons() {
  buttons.push(new Button(canvasWidth / 2, (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * boxSize) + 65, 'Show me more', 'Generate another 9 Chittens'));
  buttons.push(new Button(canvasWidth / 2, (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * boxSize) + 30, 'Adopt this Chitten', 'Add the selected Chitten to your game'));
  buttons.push(new Button(canvasWidth / 2, (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * boxSize) + 85, 'Give them all away', 'Rehome the entire litter'));
  buttons[0].visible = false;
  buttons[1].visible = false;
  buttons[2].visible = false;
  buttons.push(new Button(195, 0, unicodeThunderstorm, 'Rehome the selected Chitten'));
  buttons.push(new Button(canvasWidth / 2, 370, 'DUMMY', 'DUMMY')); // not being used
  buttons[4].visible = false;
  // menu
  buttons.push(new Button(164, 0, unicodeArrowDown, 'Download the selected Chitten to your device'));
  buttons.push(new Button(133, 0, unicodeArrowUp, 'Upload a Chitten from your device'));
  // gene editing
  buttons.push(new Button(60, 595, 'Save Female', 'Save a Female clone of this Chitten'));
  buttons.push(new Button(60, 630, 'Save Male', 'Save a Male clone of this Chitten'));
  buttons.push(new Button(60, 665, 'Close', 'Close the genetic editor'));
  buttons[7].visible = false;
  buttons[8].visible = false;
  buttons[9].visible = false;
  // menu
  buttons.push(new Button(231, 0, '&!', 'Dev mode - open genetic editor'));
  buttons.push(new Button(59, 0, unicodeFemale, 'Adopt a female Chitten'));
  buttons.push(new Button(98, 0, unicodeMale, 'Adopt a male Chitten'));
  buttons.push(new Button(canvasWidth / 2, (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * boxSize) + 100, 'Close', 'Close the chittery'));
  buttons[13].visible = false;
  buttons.push(new Button(20, 0, unicodeBar + '' + unicodeBar, 'Pause the simulation'));

  // Add breed filter toggle button (positioned under "Show me more")
  buttons.push(new Button(canvasWidth / 2, (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * boxSize) + 135, 'Filter by breed', 'Choose specific breeds to view'));
  buttons[15].visible = false; // Hide breed filter button initially

  labels.push(new Button(canvasWidth / 2, 10, 'Welcome message', ''));
  labels.push(new Button(canvasWidth / 2, 45, 'Choose a ....', ''));
  labels.push(new Button(canvasWidth / 2, (trueBottom / 2) - ((3 * (boxSize + boxPadding)) / 2) - 85, 'X', ''));
  labels[0].visible = false;
  labels[1].visible = false;
  labels[2].visible = false;
}

/**
* function for a piece of plain text
* @param {int} size - the size
* @param {string} colour - the colour
* @param {int} x - the x pos
* @param {int} y - the y pos
*/
function TextElement(size, colour, x, y) {
  this.size = size;
  this.x = x;
  this.y = y;
  this.colour = colour;
  this.update = function () {
    ctx.font = this.size + ' ' + globalFont;
    ctx.fillStyle = this.colour;
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = 1;
  };
}

/**
* function to describe a button
* @param {int} x - the x coordinate of the middle of the button
* @param {int} y - the y coordinate of the top of the button
* @param {string} text - text on the button
*/
function Button(x, y, text, toolTip, alignment) {
  this.align = alignment;
  this.x = x;
  this.y = y;
  this.text = text;
  this.width = (this.text.length * fontWidth) + 20;
  this.size = ((this.text.length * fontWidth) + 20);
  this.height = 25;
  this.visible = true;
  this.available = true;
  this.highlighted = false;
  this.toolTip = toolTip;
  this.toolTipWidth = (toolTip.length * fontWidth) + 20;
  this.reinitSizes = function () {
    this.toolTipWidth = (toolTip.length * fontWidth) + 20;
    this.width = (this.text.length * fontWidth) + 20;
    this.size = ((this.text.length * fontWidth) + 20);
  };
  this.drawToolTip = function () {
    ctx.fillStyle = mixTwoColours(outputArray[3], trueBlack, 0.5);
    ctx.fillRect(pointerPos.x, pointerPos.y + 20, this.toolTipWidth, 20);
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.toolTip, pointerPos.x + 12.5, pointerPos.y + 35);
  };
  this.detectButtonClick = function () {
    // Calculate button hitbox bounds based on alignment
    let leftBound, rightBound;
    if (this.align === 'left') {
      leftBound = this.x;
      rightBound = this.x + this.width;
    } else if (this.align === 'right') {
      leftBound = this.x - this.width;
      rightBound = this.x;
    } else {
      // Center alignment (default)
      leftBound = this.x - (this.width / 2);
      rightBound = this.x + (this.width / 2);
    }
    
    return this.visible && pointerPos.x < rightBound && pointerPos.x > leftBound && 
           pointerPos.y < this.y + this.height && pointerPos.y > this.y;
  };
  this.update = function () {
    if (this == buttons[5] || this == buttons[3]) {
      if (selection == null || selection.inCatBox !== null) {
        this.available = false;
      } else {
        this.available = true;
      }
    }
    if (this.visible) {
      // box
      ctx.save();
      if (this.align == 'left') {
        ctx.translate(this.x, this.y);
      } else if (this.align == 'right') {
        ctx.translate(this.x - this.width, this.y);
      } else {
        ctx.translate (this.x - (this.width / 2), this.y);
      }
      ctx.globalAlpha = 0.25;
      if (this.highlighted) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = mixTwoColours(trueWhite, outputArray[2]);
      } else if (!this.available) {
        ctx.fillStyle = outputArray[3];
      } else {
        ctx.fillStyle = outputArray[2];
      }
      ctx.fillRect(0, 0, this.width, this.height);
      // label
      ctx.globalAlpha = 1;
      if (this.highlighted) {
        ctx.fillStyle = outputArray[3];
      } else if (!this.available) {
        ctx.fillStyle = outputArray[2];
      } else {
        ctx.fillStyle = trueWhite;
      }
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.width / 2, 18);
      ctx.textAlign = 'left'; // Reset to default
      ctx.restore();
    }
  };
}

function handleButton(input) {
  switch (input) {
    case 0:
      if (!chosenChittenF) {
        for (let i = currentChittens; i < chittens.length; i++) {
          chittens.splice(i, 1);
          i--;
        }
        initFemaleCattery();
      } else if (!chosenChittenM) {
        for (let i = currentChittens; i < chittens.length; i++) {
          chittens.splice(i, 1);
          i--;
        }
        initMaleCattery();
      }
      break;
    case 1:
      if (selection !== null) {
        labels[2].visible = false;
        if (!chosenChittenF) {
          chosenChittenF = true;
          for (let i = currentChittens; i < chittens.length; i++) {
            if (chittens[i] !== selection) {
              chittens.splice(i, 1);
              i--;
            }
          }

          // Adoption handling
          sendMessage(selection.name + ' was adopted');
          selection.hitBottom = false;
          selection.love = 100;
          speech.push(new Speak(selection, neutralWord()));
          selection.sitting = false;
          createGlyphs(selection.x, selection.y, unicodeHeart);
          seeds.push(new Seed(randomColourFruity(), selection));
          seeds.push(new Seed(randomColourFruity(), selection));
          seeds[seeds.length - 1].timer = 750;
          boxes = [];
          buttons[0].visible = false;
          buttons[1].visible = false;
          buttons[2].visible = false;
          labels[0].visible = false;
          labels[1].visible = false;
          selection.inCatBox = null;
          selection.focus = fireflies[selection.findClosestFireFly()];
          buttons[10].available = true;
          buttons[11].available = true;
          buttons[12].available = true;
          buttons[6].available = true;
          buttons[13].visible = false;
          buttons[15].visible = false;
          resetBreedFilter();
          choosingChitten = false;
          selection = null;
        } else if (!chosenChittenM) {
          chosenChittenM = true;
          for (let i = currentChittens; i < chittens.length; i++) {
            if (chittens[i] !== selection) {
              chittens.splice(i, 1);
              i--;
            }
          }
          // Adoption handling
          sendMessage(selection.name + ' was adopted');
          selection.hitBottom = false;
          selection.love = 100;
          speech.push(new Speak(selection, neutralWord()));
          selection.sitting = false;
          createGlyphs(selection.x, selection.y, unicodeHeart);
          seeds.push(new Seed(randomColourFruity(), selection));
          seeds.push(new Seed(randomColourFruity(), selection));
          seeds[seeds.length - 1].timer = 750;
          boxes = [];
          buttons[0].visible = false;
          buttons[1].visible = false;
          labels[0].visible = false;
          labels[1].visible = false;
          selection.inCatBox = null;
          buttons[10].available = true;
          buttons[11].available = true;
          buttons[12].available = true;
          buttons[6].available = true;
          buttons[13].visible = false;
          buttons[15].visible = false;
          resetBreedFilter();
          choosingChitten = false;
          selection = null;
        } else if (!chosenKitten) {
          for (let i = 0, found = false; i < parentBoxes.length && !found; i++) {
            for (let j = 0; j < chittens.length && !found; j++) {
              if (chittens[j].inCatBox == parentBoxes[i]) {
                chittens[j].inCatBox = null;
                chittens[j].hitBottom = false;
              }
            }
          }
          parentBoxes = [];
          chosenKitten = true;
          for (let i = currentChittens; i < chittens.length; i++) {
            if (chittens[i] !== selection) {
              chittens.splice(i, 1);
              i--;
            }
          }
          if (selection && selection.name) {
            sendMessage(selection.name + ' joined the family');
            selection.hitBottom = false;
            selection.love = 100;
            speech.push(new Speak(selection, neutralWord()));
            selection.size *= 0.5;
            selection.reinitSizeAndColour();
            selection.sitting = false;
            createGlyphs(selection.x, selection.y, unicodeHeart);
            selection.reinitSizeAndColour();
          } else {
            console.warn('Selection became undefined during litter processing');
          }
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
          if (selection) {
            selection.inCatBox = null;
          }
          choosingChitten = false;
          selection = null;
        }
      }
      break;
    case 2:
      for (let i = 0, found = false; i < parentBoxes.length && !found; i++) {
        for (let j = 0; j < chittens.length && !found; j++) {
          if (chittens[j].inCatBox == parentBoxes[i]) {
            chittens[j].inCatBox = null;
          }
        }
      }
      parentBoxes = [];
      labels[2].visible = false;
      chosenKitten = true;
      for (let i = currentChittens; i < chittens.length; i++) {
        chittens.splice(currentChittens, chittens.length - currentChittens);
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
      choosingChitten = false;
      break;
    case 3:
      sendMessage(selection.name + ' went to live with someone else');
      speech.push(new Speak(selection, angryWord()));
      for (let i = 0, stop = false; i < chittens.length && !stop; i++) {
        if (chittens[i] == selection) {
          stop = true;
          graveStones.push(new Grave(selection.x, selection.y, selection.size, selection.speedX, selection.speedY, selection.elder, selection.firstColour));
          removeRelationships(selection);
          chittens[i].kill();
        }
      }
      selection = null;
      break;
    case 4:
      // DUMMY
      break;
    case 5:
      saveToFile(selection);
      break;
    case 6:
      openUploadDialog();
      break;
    case 7:
      pasteChitten(copyChitten(experiment));
      chittens[chittens.length - 1].gender = 'Female';
      chittens[chittens.length - 1].name = null;
      while (chittens[chittens.length - 1].name == null) {
        chittens[chittens.length - 1].name = getFemaleName(Math.floor(Math.random() * numlibs * namesinlib));
      }
      break;
    case 8:
      pasteChitten(copyChitten(experiment));
      chittens[chittens.length - 1].gender = 'Male';
      chittens[chittens.length - 1].name = null;
      while (chittens[chittens.length - 1].name == null) {
        chittens[chittens.length - 1].name = getMaleName(Math.floor(Math.random() * numlibs * namesinlib));
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
        cloneChitten(copyChitten(selection), experiment);
        reinitSliders();
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
      choosingChitten = false;
      chosenChittenF = true;
      chosenChittenM = true;
      selection = null;
      boxes = [];
      for (let i = currentChittens; i < chittens.length; i++) {
        if (chittens[i] !== selection) {
          chittens.splice(i, 1);
          i--;
        }
      }
      buttons[0].visible = false;
      buttons[1].visible = false;
      labels[0].visible = false;
      labels[1].visible = false;
      buttons[13].visible = false;
      buttons[15].visible = false;
      resetBreedFilter();

      buttons[10].available = true;
      buttons[11].available = true;
      buttons[12].available = true;
      buttons[6].available = true;
      break;
    case 14:
      // pause button
      if (!paused) {
        paused = true;
        buttons[6].available = false;
        buttons[10].available = false;
        buttons[11].available = false;
        buttons[12].available = false;
        buttons[0].available = false;
        buttons[1].available = false;
        buttons[2].available = false;
        if (selection !== null && selection.dragging) {
          selection.dragging = false;
          selection.findClosestFireFly();
        }
      } else {
        paused = false;
        buttons[6].available = true;
        buttons[10].available = true;
        buttons[11].available = true;
        buttons[12].available = true;
        buttons[0].available = true;
        buttons[1].available = true;
        buttons[2].available = true;
      }
      break;
    case 15:
      // Toggle breed filter visibility
      toggleBreedFilter();
      break;
  }
}

function tapOn() {
  touchOnorOffThisFrame = true;
  click();
}

function tapOff() {
  touchOnorOffThisFrame = true;
  unclick();
}

function mouseOn() {
  if (!touchOnorOffThisFrame) {
    click();
  }
}

function mouseOff() {
  if (!touchOnorOffThisFrame) {
    unclick();
  }
}

/**
* function to be called when user clicks on the game area
* @param {event} e - the clicking event
*/
function click() {
  let clickedSomething = false;
  for (let i = 0; i < boxes.length; i++) {
    if (!clickedSomething && detectRectCollision(pointerPos, boxes[i])) {
      clickedSomething = true;
      selection = chittens[chittens.length - boxes.length + i];
      boxes[i].selected = true;
    } else {
      boxes[i].selected = false;
    }
  }
  if (!clickedSomething) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].available && buttons[i].detectButtonClick()) {
        clickedSomething = true;
        handleButton(i);
      }
    }

    // Handle breed filter button clicks
    if (!clickedSomething) {
      for (let i = 0; i < breedFilterButtons.length; i++) {
        if (breedFilterButtons[i].detectButtonClick()) {
          clickedSomething = true;
          selectedBreedFilter = breedFilterButtons[i].text;
          // Regenerate cattery with new filter (keep buttons visible)
          if (!chosenChittenF) {
            handleButton(0); // Regenerate female cattery
          } else if (!chosenChittenM) {
            handleButton(0); // Regenerate male cattery
          }
          break;
        }
      }
    }
  }
  if (!clickedSomething && choosingChitten) {
    selection = null;
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].selected = false;
    }
    let genderString = 'female';
    if (chosenChittenF) {
      genderString = 'male';
    }
    if (!chosenChittenM || !chosenChittenF) {
      buttons[1].available = false;
    }
  }
  if ((!chosenChittenF || !chosenChittenM || !chosenKitten) && selection !== null) {
    buttons[1].available = true;
  }
  // Picking up Chittens
  if (!clickedSomething && !choosingChitten) {
    for (let i = chittens.length - 1; i >= 0 && !clickedSomething; i--) {
      if (detectCollision(pointerPos, chittens[i])) {
        clickedSomething = true;
        selection = chittens[i];
        selection.dragging = true;
        // wake up sleeping chittens when you pick them up
        if (!selection.awake) {
          selection.awake = true;
        }
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
    if (pointerPos.x >= colourBlock.x && pointerPos.x < colourBlock.x + 100 && pointerPos.y >= colourBlock.y && pointerPos.y < colourBlock.y + 100) {
      colourBlock.dragging = true;
      colourBlock.updateHoverColour();
    }
  }
  if (!clickedSomething && chittens.includes(selection)) {
    selection = null;
  }
}

function unclick() {
  if (chittens.includes(selection) && selection.dragging) {
    selection.dragging = false;
    selection.focus = selection.inCatBox ? null : selection.findClosestFireFly();
  }

  if (geneEditing) {
    // check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i].sBar.dragging) {
        sliders[i].sBar.dragging = false;
        if ((i > 6 && i < 18) || i == 26 || i == 29) {
          sliders[i].currentPos = Math.round(sliders[i].currentPos);
        }
      }
    }
    if (colourBlock.dragging) {
      colourBlock.dragging = false;
    }
  }
}

/**
* function to check for and process mouse hovering over objects
*/
function hover() {
  let hovered = false;
  // highlighting buttons
  for (let i = 0; i < buttons.length; i++) {
    // tooltip creation on hover is handled in window.js
    if (buttons[i].available && buttons[i].detectButtonClick()) {
      buttons[i].highlighted = true;
      hovered = true;
    } else {
      buttons[i].highlighted = false;
    }
  }

  // highlighting breed filter buttons
  for (let i = 0; i < breedFilterButtons.length; i++) {
    if (breedFilterButtons[i].detectButtonClick()) {
      breedFilterButtons[i].highlighted = true;
      hovered = true;
    } else {
      breedFilterButtons[i].highlighted = false;
    }
  }
  // highlighting catboxes
  for (let i = 0; i < boxes.length; i++) {
    if (detectRectCollision(pointerPos, boxes[i])) {
      boxes[i].highlighted = true;
      hovered = true;
    } else {
      boxes[i].highlighted = false;
    }
  }
  // highlighting parent boxes in litter selection
  if (typeof parentBoxes !== 'undefined') {
    for (let i = 0; i < parentBoxes.length; i++) {
      if (detectRectCollision(pointerPos, parentBoxes[i])) {
        parentBoxes[i].highlighted = true;
        hovered = true;
      } else {
        parentBoxes[i].highlighted = false;
      }
    }
  }
  // colour picker
  if (colourBlock.dragging && pointerPos.x >= colourBlock.x && pointerPos.x < colourBlock.x + 100 && pointerPos.y >= colourBlock.y && pointerPos.y < colourBlock.y + 100) {
    colourBlock.updateHoverColour();
  } else if (colourBlock.dragging && pointerPos.x < colourBlock.x && pointerPos.x >= colourBlock.x + 100 && pointerPos.y < colourBlock.y && pointerPos.y >= colourBlock.y + 100) {
    colourBlock.dragging = false;
  }
  // chittens hover label
  for (let i = 0, stop = false; i < chittens.length && !stop; i++) {
    if (!chittens[i].inCatBox && chittens[i] !== experiment && detectCollision(pointerPos, chittens[i])) {
      stop = true;
      let labelText = chittens[i].name;
      let shift = (2 + chittens[i].name.length) * 6.72 / 2;
      ctx.save();
      ctx.translate(chittens[i].x, chittens[i].y);
      ctx.globalAlpha = 1;
      // draw box
      ctx.fillStyle = mixTwoColours(outputArray[2], trueBlack, 0.5);
      ctx.fillRect(-shift - 10, - 40 - (chittens[i].size * 2.75), (shift * 2) + 20, 20);
      // draw label
      ctx.fillStyle = trueWhite;
      ctx.font = '12px' + ' ' + globalFont;
      if (chittens[i].gender == 'Female') {
        ctx.fillText(labelText + ' ' + unicodeFemale, -shift, - 25 - (chittens[i].size * 2.75));
      } else if (chittens[i].gender == 'Male') {
        ctx.fillText(labelText + ' ' + unicodeMale, -shift, - 25 - (chittens[i].size * 2.75));
      } else {
        ctx.fillText(labelText + ' ' + unicodeNonBinary, -shift, - 25 - (chittens[i].size * 2.75));
      }
      ctx.restore();
    }
  }
}

/**
* function to reinit the sliders when you load a new chitten etc
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
  sliders[29] = new Slider(0, 2, experiment.bodypartCode[12], 130, 610, 'chest');
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
  sliders[29].currentPos = experiment.bodypartCode[12];
}

/**
* function to describe a slider
*/
function Slider(lowerLimit, upperLimit, currentPos, x, y, txt) {
  this.id = sliderIndex;
  sliderIndex++;
  this.lowerLimit = lowerLimit;
  this.upperLimit = upperLimit;
  this.currentPos = currentPos;
  this.relativePosition = 0;
  this.proportion = 1;
  this.x = x;
  this.y = y;
  this.text = txt;
  this.sBar = new SliderBar(this);
  this.update = function () {
    // bar base is 0 to 100
    this.proportion = 100 / (Math.abs(this.upperLimit - this.lowerLimit));
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
  this.update = function () {
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
      ctx.fillRect(this.x - 5, this.y - 10, 10, 20);
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
      } else if (this.parent.id == 29) {
        experiment.bodypartCode[12] = Math.round(this.parent.currentPos);
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
  this.update = function () {
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
  this.pixelRows = 24;
  this.pixelColumns = 25;
  this.dragging = false;
  // convert x axis
  let lrInterval = (255 * 6) / this.pixelColumns; // 71.68
  // generate hue gradient
  for (let i = 0; i < this.pixelColumns - 1; i++) {
    this.huePixels.push((i * lrInterval) + (lrInterval / 2));
  }
  // convert gradient positions to hex values
  for (let i = 0; i < this.huePixels.length; i++) {
    if (this.huePixels[i] < 255) {
      let tmp = [255, 0, Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 255 * 2) {
      let tmp = [255 + 256 - Math.round(this.huePixels[i]), 0, 255];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 255 * 3) {
      let tmp = [0, Math.round(this.huePixels[i] - (256 * 2)), 255];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 255 * 4) {
      let tmp = [0, 255, 255 + (255 * 3) - Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 255 * 5) {
      let tmp = [Math.round(this.huePixels[i]) - (256 * 4), 255, 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < 255 * 6) {
      let tmp = [255, 255 + (255 * 5) - Math.round(this.huePixels[i]), 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    }
  }
  let outputPixels = [];
  // create all rows and populate white - transparent - black fade
  let tmpPix = [];
  for (let i = 0; i < this.pixelRows; i++) {
    if (i < this.pixelRows / 2) {
      for (let j = 0; j < this.pixelColumns - 1; j++) {
        tmpPix[j] = mixTwoColours(trueWhite, this.huePixels[j], 1 - (i / this.pixelRows * 2));
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else if (i > this.pixelRows / 2) {
      for (let j = 0; j < this.pixelColumns - 1; j++) {
        tmpPix[j] = mixTwoColours(trueBlack, this.huePixels[j], (i - (this.pixelRows / 2)) / this.pixelRows * 2);
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else {
      outputPixels = outputPixels.concat(this.huePixels);
    }
  }

  // make a set of pixels that are greys (black to white)
  let factor = 256 / this.pixelColumns;
  for (let i = 0; i < this.pixelColumns; i++) {
    let tmp = Math.round(i * factor);
    outputPixels.push(rgbToHex(tmp, tmp, tmp));
  }

  this.pixels = outputPixels;

  this.updateHoverColour = function () {
    let xPoint = pointerPos.x - this.x;
    let yPoint = pointerPos.y - this.y;
    let xCoord = Math.round(xPoint / this.pixelSize);
    let yCoord = Math.round(yPoint / this.pixelSize);
    let newIndex = (yCoord * this.pixelRows + 1) + xCoord;
    if (newIndex < this.pixels.length) {
      let midPointX = xCoord + (this.pixelSize / 2);
      let midPointY = yCoord + (this.pixelSize / 2);
      let perfectColour = this.pixels[newIndex];
      let diffx = midPointX - xPoint; // 0 to pixelSize/2
      let diffy = midPointY - yPoint;

      // now get the exact colour by combining boxes
      let newC1 = perfectColour;
      let newC2 = perfectColour;
      if (diffx < 0 && xCoord > 0 && xCoord < this.pixelColumns) {
        newC1 = mixTwoColours(perfectColour, this.pixels[newIndex - 1], Math.abs((this.pixelSize / 2) / diffx));
      } else if (diffx > 0 && xCoord > 0 && xCoord < this.pixelColumns) {
        newC1 = mixTwoColours(perfectColour, this.pixels[newIndex + 1], Math.abs((this.pixelSize / 2) / diffx));
      }

      if (diffy < 0 && yCoord > 0 && yCoord < this.pixelRows - 1) {
        newC2 = mixTwoColours(perfectColour, this.pixels[newIndex - this.pixelRows], Math.abs((this.pixelSize / 2) / diffy));
      } else if (diffy > 0 && yCoord > 0 && yCoord < this.pixelRows - 1) {
        newC2 = mixTwoColours(perfectColour, this.pixels[newIndex + this.pixelRows], Math.abs((this.pixelSize / 2) / diffy));
      }
      perfectColour = mixTwoColours(newC1, newC2, 0.5);

      if (colourBars.selected == 0) {
        experiment.firstColour = perfectColour;
      } else if (colourBars.selected == 1) {
        experiment.secondColour = perfectColour;
      } else if (colourBars.selected == 2) {
        experiment.thirdColour = perfectColour;
      } else {
        experiment.eyeColour = perfectColour;
        experiment.eyeColour2 = perfectColour;
      }
      experiment.reinitSizeAndColour();
    }
  };
  this.update = function () {
    ctx.strokeStyle = outputArray[3];
    ctx.strokeRect(this.x, this.y, this.pixelSize * this.pixelRows, this.pixelSize * this.pixelColumns);

    for (let i = 0; i < outputPixels.length; i++) {
      let row = Math.floor(i / this.pixelRows);
      ctx.fillStyle = this.pixels[i];
      ctx.fillRect(this.x + (i * this.pixelSize) - (row * this.pixelSize * this.pixelRows), this.y + (row * this.pixelSize), this.pixelSize, this.pixelSize);
    }
  };
}
