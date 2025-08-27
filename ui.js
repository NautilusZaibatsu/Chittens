// ui constants
boxSize = 170 * proportion;
const boxPadding = 20 * proportion;
const boxColumns = 3;
const boxRows = 3;
const boxThickness = 10 * proportion;
const buttonPadding = 20;
const hoverIndicatorSize = 60;
const hoverIndicatorStroke = 3;
const tooltipCharacterWrapLimit = 40;

// font
const globalFont = 'Consolas';
// scaling fonts
fontSize = 15;
fontWidth = 8.4;

// init
buttons = [];
labels = [];
uiColourArray = [];

// Breed filtering variables
let selectedBreedFilter = 'All'; // Current breed filter
let breedFilterButtons = []; // Array to hold breed filter buttons
let breedFilterVisible = false; // Whether breed filter buttons are shown

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
      buttonTooltip = 'Show a random selection of purebred, crossed and mixed cats';
    } else if (breed === mixedBreed) {
      buttonTooltip = 'Crossbred and mixed cats can come in all manner of shapes and sizes!';
    } else if (BREED_DATA[breed] && BREED_DATA[breed].description) {
      buttonTooltip = BREED_DATA[breed].description;
    } else {
      buttonTooltip = `Show only ${breed} chittens`;
    }

    let button = new Button(x, y, breed, buttonTooltip, 'left');
    button.visible = wasVisible; // Preserve previous visibility state
    button.reinitSizes(); // Calculate wrapped tooltip dimensions
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
* function to initialise all the buttons and labels / dynamic ui elements
*/
function initUi() {
  // devmode specific:
  colourBars = new ColourBar(130, 155);
  colourBlock = new ColourPixelBlock();

  buttons.push(new Button(0, 15, 'Show more', 'See another 9 chittens'));
  buttons[0].visible = false;
  buttons[0].canvasSizeDependent = true;
  buttons[0].reinitPosition();

  buttons.push(new Button(0, -20, 'Adopt', 'Adopt the selected chitten'));
  buttons[1].visible = false;
  buttons[1].canvasSizeDependent = true;
  buttons[1].reinitPosition();

  buttons.push(new Button(0, 15, 'Rehome all', 'Give away this litter'));
  buttons[2].visible = false;
  buttons[2].canvasSizeDependent = true;
  buttons[2].reinitPosition();

  buttons.push(new Button(195, 0, unicodeThunderstorm, 'Rehome the selected Chitten'));

  buttons.push(new Button(canvasWidth / 2, 370, 'DUMMY', 'DUMMY')); // not currently being used
  buttons[4].visible = false;
  // upload / download and editing
  buttons.push(new Button(164, 0, unicodeArrowDown, 'Download the selected Chitten to your device'));
  buttons.push(new Button(133, 0, unicodeArrowUp, 'Upload a Chitten from your device'));
  // gene editing
  buttons.push(new Button(60, 595, 'Save Female', 'Save a Female clone of this Chitten'));
  buttons[7].visible = false;
  buttons.push(new Button(60, 630, 'Save Male', 'Save a Male clone of this Chitten'));
  buttons[8].visible = false;
  buttons.push(new Button(60, 665, 'Close', 'Close the genetic editor'));
  buttons[9].visible = false;
  // menu items
  // devmode button
  buttons.push(new Button(canvasWidth - 20, canvasHeight - 25, '&!', 'Dev mode - open genetic editor'));
  if (!devMode) {
    buttons[10].visible = false;
  }
  buttons[10].canvasSizeDependent = true;
  buttons.push(new Button(59, 0, unicodeFemale, 'Adopt a female Chitten'));
  buttons.push(new Button(98, 0, unicodeMale, 'Adopt a male Chitten'));
  buttons.push(new Button(0, 85, 'Close', 'Close the adoption centre'));
  buttons[13].visible = false;
  buttons[13].canvasSizeDependent = true;
  buttons[13].reinitPosition();

  // Pause button
  buttons.push(new Button(20, 0, unicodeBar + unicodeBar, 'Pause the game'));
  buttons[14].fixedSize = true;

  // Add breed filter toggle button (positioned under "Show me more")
  buttons.push(new Button(0, 50, 'Filter by breed', 'Choose specific breeds to view'));
  buttons[15].visible = false; // Hide breed filter button initially
  buttons[15].canvasSizeDependent = true;
  buttons[15].reinitPosition();

  // Button for endless mode
  buttons.push(new Button(225, 0, unicodeInfinity, 'Turn on endless mode'));

  // adoption centre label
  labels.push(new Button(0, - 105, 'Adoption Centre', ''));
  labels[0].visible = false;
  labels[0].canvasSizeDependent = true;
  labels[0].aboveCattery = true;
  labels[0].reinitPosition();

  // choose a ....
  labels.push(new Button(0, - 70, 'Choose a ....', '')); // text populated later
  labels[1].visible = false;
  labels[1].canvasSizeDependent = true;
  labels[1].aboveCattery = true;
  labels[1].reinitPosition();

  // litter choice timer label
  labels.push(new Button(0, - 70, 'X', ''));
  labels[2].visible = false;
  labels[2].canvasSizeDependent = true;
  labels[2].aboveCattery = true;
  labels[2].reinitPosition();

  // litter centre label
  labels.push(new Button(0, - 140, 'Choose one of ....', '')); // text populated later
  labels[3].visible = false;
  labels[3].canvasSizeDependent = true;
  labels[3].aboveCattery = true;
  labels[3].reinitPosition();

  // rehoming info label
  labels.push(new Button(0, - 105, 'The rest will be adopted by nice people', ''));
  labels[4].visible = false;
  labels[4].canvasSizeDependent = true;
  labels[4].aboveCattery = true;
  labels[4].reinitPosition();
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
  this.width = (this.text.length * fontWidth) + buttonPadding;
  this.size = ((this.text.length * fontWidth) + buttonPadding);
  this.fixedSize = false;
  this.height = 25;
  this.visible = true;
  this.available = true;
  this.highlighted = false;
  this.on = false;
  this.toolTip = toolTip;
  // Initialize tooltip wrapping - will be calculated in reinitSizes()
  this.wrappedToolTip = [toolTip];
  this.toolTipLines = 1;
  this.toolTipWidth = (toolTip.length * fontWidth) + buttonPadding;
  this.toolTipHeight = 25;
  // for preserving position when the canvas resizes
  this.canvasSizeDependent = false;
  this.canvasYOffset = this.y;
  this.aboveCattery = false; // bool for placing above or below cattery
  this.reinitSizes = function () {
    // Word wrap tooltips longer than the character limit
    if (this.toolTip.length > tooltipCharacterWrapLimit) {
      this.wrappedToolTip = this.wrapText(this.toolTip, 50);
      this.toolTipLines = this.wrappedToolTip.length;
      this.toolTipWidth = Math.max(...this.wrappedToolTip.map(line => line.length)) * fontWidth + buttonPadding;
      this.toolTipHeight = (this.toolTipLines * 20) + buttonPadding;
    } else {
      this.wrappedToolTip = [this.toolTip];
      this.toolTipLines = 1;
      this.toolTipWidth = (this.toolTip.length * fontWidth) + buttonPadding;
      this.toolTipHeight = 25;
    }
    
    if (!this.fixedSize) {
      this.width = (this.text.length * fontWidth) + buttonPadding;
      this.size = ((this.text.length * fontWidth) + buttonPadding);
    }
  };
  this.reinitPosition = function () {
    this.x = canvasWidth / 2;
    if (this.aboveCattery) {
      this.y = (canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + this.canvasYOffset;
    } else {
      this.y = ((canvasHeight / 2) - ((3 * (boxSize + boxPadding)) / 2) + (3 * (boxSize + boxPadding))) + this.canvasYOffset;
    }
  }
  this.wrapText = function (text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is longer than maxLength, break it
          lines.push(word.substring(0, maxLength));
          currentLine = word.substring(maxLength);
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };
  
  this.drawToolTip = function () {
    ctx.fillStyle = mixTwoColours(uiColourArray[3], trueBlack, 0.5);
    ctx.fillRect(pointerPos.x, pointerPos.y + buttonPadding, this.toolTipWidth, this.toolTipHeight || buttonPadding);
    ctx.fillStyle = trueWhite;
    
    if (this.wrappedToolTip && this.wrappedToolTip.length > 1) {
      // Multi-line tooltip
      for (let i = 0; i < this.wrappedToolTip.length; i++) {
        ctx.fillText(this.wrappedToolTip[i], pointerPos.x + 12.5, pointerPos.y + 35 + (i * 20));
      }
    } else {
      // Single line tooltip
      ctx.fillText(this.toolTip, pointerPos.x + 12.5, pointerPos.y + 35);
    }
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
        ctx.translate(this.x - (this.width / 2), this.y);
      }
      ctx.globalAlpha = 0.25;
      if (this.highlighted) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = mixTwoColours(trueWhite, uiColourArray[2]);
      } else if (!this.available) {
        ctx.fillStyle = uiColourArray[3];
      } else if (this.on) {
        ctx.fillStyle = mixTwoColours(trueWhite, uiColourArray[1]);
      } else {
        ctx.fillStyle = uiColourArray[2];
      }
      ctx.fillRect(0, 0, this.width, this.height);
      // label
      ctx.globalAlpha = 1;
      if (this.highlighted) {
        ctx.fillStyle = uiColourArray[3];
      } else if (!this.available) {
        ctx.fillStyle = uiColourArray[2];
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
    // - Case 0: Close adoption center / Switch between male and female adoption centers
    case 0:
      if (!chosenChittenF) {
        removeTemporaryChittens();
        initFemaleCattery();
      } else if (!chosenChittenM) {
        removeTemporaryChittens();
        initMaleCattery();
      }
      break;
    case 1:
      // - Case 1: Adopt selected chitten (adoption center) / Keep selected kitten (litter choice)
      if (selection !== null) {
        labels[2].visible = false;
        // choosing a female chitten from the adoption centre
        if (!chosenChittenF) {
          chosenChittenF = true;
          removeTemporaryChittens(true);

          // Adoption handling
          choosingChitten = false;
          sendMessage(selection.name + ' was adopted');
          adoptChitten(selection);
          recalculateChittenNumbers();

          selection = null;
          boxes = [];
          hideButtons = [0, 1, 2, 13, 15];
          hideLabels = [0, 1];
          enableButtons = [6, 10, 11, 12];
          hideButtons.forEach(i => buttons[i].visible = false);
          hideLabels.forEach(i => labels[i].visible = false);
          enableButtons.forEach(i => buttons[i].available = true);
          resetBreedFilter();
          // choosing a male chitten from the adoption centre
        } else if (!chosenChittenM) {
          chosenChittenM = true;
          removeTemporaryChittens(true);

          // Adoption handling
          choosingChitten = false;
          sendMessage(selection.name + ' was adopted');
          adoptChitten(selection);
          recalculateChittenNumbers();

          boxes = [];
          hideButtons = [0, 1, 13, 15];
          hideLabels = [0, 1];
          enableButtons = [6, 10, 11, 12];
          hideButtons.forEach(i => buttons[i].visible = false);
          hideLabels.forEach(i => labels[i].visible = false);
          enableButtons.forEach(i => buttons[i].available = true);
          resetBreedFilter();
          selection = null;
          // choosing a chitten from a litter
        } else if (!chosenKitten) {
          for (let i = 0, found = false; i < parentBoxes.length && !found; i++) {
            for (let j = 0; j < chittens.length && !found; j++) {
              if (chittens[j].inCatBox == parentBoxes[i]) {
                chittens[j].inCatBox = null;
                chittens[j].onSurface = false;
              }
            }
          }
          parentBoxes = [];
          chosenKitten = true;
          removeTemporaryChittens(true);
          if (selection && selection.name) {

            // Adoption handling
            choosingChitten = false;
            sendMessage(selection.name + ' joined the family');
            adoptChitten(selection);
            recalculateChittenNumbers();
            selection.size *= 0.5;
            selection.reinitSizeAndColour();
          } else {
            console.warn('Selection became undefined during litter processing');
          }
          boxes = [];
          hideButtons = [0, 1, 2];
          hideLabels = [2, 3, 4];
          enableButtons = [6, 10, 11, 12];
          hideButtons.forEach(i => buttons[i].visible = false);
          hideLabels.forEach(i => labels[i].visible = false);
          enableButtons.forEach(i => buttons[i].available = true);
          if (selection) {
            selection.inCatBox = null;
          }
          choosingChitten = false;
          selection = null;
        }
      }
      break;
    // - Case 2: Rehome entire litter (litter choice)
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
      removeTemporaryChittens();
      sendMessage('A litter of chittens was rehomed');
      boxes = [];
      hideButtons = [0, 1, 2];
      hideLabels = [2, 3, 4];
      enableButtons = [6, 10, 11, 12];
      hideButtons.forEach(i => buttons[i].visible = false);
      hideLabels.forEach(i => labels[i].visible = false);
      enableButtons.forEach(i => buttons[i].available = true);
      selection = null;
      choosingChitten = false;
      break;
    // - Case 3: Kill/remove selected chitten (storm button)
    case 3:
      sendMessage(selection.name + ' went to live with someone else');
      addSpeech(selection, angryWord());
      for (let i = 0, stop = false; i < chittens.length && !stop; i++) {
        if (chittens[i] == selection) {
          stop = true;
          removeRelationships(selection);
          chittens[i].kill();
        }
      }
      selection = null;
      break;
    // - Case 4: Dummy button (not currently used)
    case 4:
      // DUMMY
      break;
    // - Case 5: Save selected chitten to file
    case 5:
      saveToFile(selection);
      break;
    // - Case 6: Upload chitten from file
    case 6:
      openUploadDialog();
      break;
    // - Case 7: Spawn female chitten from experiment template (dev mode)
    case 7:
      pasteChitten(copyChitten(experiment));
      chittens[chittens.length - 1].gender = 'Female';
      chittens[chittens.length - 1].name = null;
      while (chittens[chittens.length - 1].name == null) {
        chittens[chittens.length - 1].name = getFemaleName(Math.floor(Math.random() * numlibs * namesinlib));
      }
      break;
    // - Case 8: Spawn male chitten from experiment template (dev mode)
    case 8:
      pasteChitten(copyChitten(experiment));
      chittens[chittens.length - 1].gender = 'Male';
      chittens[chittens.length - 1].name = null;
      while (chittens[chittens.length - 1].name == null) {
        chittens[chittens.length - 1].name = getMaleName(Math.floor(Math.random() * numlibs * namesinlib));
      }
      break;
    // - Case 9: Exit gene editing mode (dev mode)
    case 9:
      geneEditing = false;
      hideGeneButtons = [7, 8, 9];
      enableMainButtons = [6, 10, 11, 12];
      hideGeneButtons.forEach(i => buttons[i].visible = false);
      enableMainButtons.forEach(i => buttons[i].available = true);
      break;
    // - Case 10: Enter gene editing mode with selected chitten (dev mode)
    case 10:
      if (devMode) {
        if (selection !== null) {
          cloneChitten(copyChitten(selection), experiment);
          reinitSliders();
        }
        geneEditing = true;
        const showGeneButtons = [7, 8, 9];
        disableMainButtons = [6, 10, 11, 12];
        showGeneButtons.forEach(i => buttons[i].visible = true);
        disableMainButtons.forEach(i => buttons[i].available = false);
      }
      break;
    // - Case 11: Open female adoption center
    case 11:
      initFemaleCattery();
      disableButtons = [6, 10, 11, 12];
      disableButtons.forEach(i => buttons[i].available = false);
      break;
    // - Case 12: Open male adoption center
    case 12:
      initMaleCattery();
      disableButtons = [6, 10, 11, 12];
      disableButtons.forEach(i => buttons[i].available = false);
      break;
    // - Case 13: Close adoption center without adopting
    case 13:
      choosingChitten = false;
      chosenChittenF = true;
      chosenChittenM = true;
      selection = null;
      boxes = [];
      removeTemporaryChittens();
      hideButtons = [0, 1, 13, 15];
      hideLabels = [0, 1];
      enableButtons = [6, 10, 11, 12];
      hideButtons.forEach(i => buttons[i].visible = false);
      hideLabels.forEach(i => labels[i].visible = false);
      enableButtons.forEach(i => buttons[i].available = true);
      resetBreedFilter();
      break;
    // - Case 14: Toggle pause/resume game
    case 14:
      // toggle pause
      paused = !paused;
      const affected = [6, 10, 11, 12, 0, 1, 2, 16];
      affected.forEach(i => buttons[i].available = !paused);
      if (paused) {
        buttons[14].toolTip = 'Resume the game';
        buttons[14].text = unicodePlay;
      } else {
        buttons[14].toolTip = 'Pause the game';
        buttons[14].text = unicodeBar + unicodeBar;
      }
      buttons[14].on = paused;
      buttons[14].reinitSizes();
      break;
    // - Case 15: Toggle breed filter visibility
    case 15:
      // Toggle breed filter visibility
      toggleBreedFilter();
      break;
    // - Case 16: Toggle endless mode on/off
    case 16:
      // toggle endless mode
      endlessMode = !endlessMode;
      buttons[16].on = endlessMode;
      buttons[16].toolTip = endlessMode
        ? 'Turn off endless mode'
        : 'Turn on endless mode';
      buttons[16].reinitSizes();
      recalculateChittenNumbers();
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
        if (selectedBreedFilter !== breedFilterButtons[i].text && breedFilterButtons[i].detectButtonClick()) {
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
  if (!paused && !clickedSomething && !choosingChitten) {
    for (let i = chittens.length - 1; i >= 0 && !clickedSomething; i--) {
      if (detectCollision(pointerPos, chittens[i])) {
        clickedSomething = true;
        selection = chittens[i];
        selection.beingHeld = true;
        selection.focus = null;
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
        sliders[i].sBar.dragged = true;
        clickedSomething = true;
      } else {
        sliders[i].sBar.dragged = false;
      }
    }

    // colour bar
    if (devMode && pointerPos.x >= colourBars.x && pointerPos.x <= colourBars.x + 100 && pointerPos.y >= colourBars.y && pointerPos.y <= colourBars.y + 20) {
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
      colourBlock.dragged = true;
      colourBlock.updateHoverColour();
    }
  }
  if (!clickedSomething && chittens.includes(selection)) {
    selection = null;
  }
}

function unclick() {
  if (chittens.includes(selection) && selection.beingHeld) {
    selection.beingHeld = false;
    selection.focus = null;
  }

  if (geneEditing) {
    // check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i].sBar.dragged) {
        sliders[i].sBar.dragged = false;
        if ((i > 6 && i < 18) || i == 26 || i == 29) {
          sliders[i].currentPos = Math.round(sliders[i].currentPos);
        }
      }
    }
    if (colourBlock.dragged) {
      colourBlock.dragged = false;
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
  if (colourBlock.dragged && pointerPos.x >= colourBlock.x && pointerPos.x < colourBlock.x + 100 && pointerPos.y >= colourBlock.y && pointerPos.y < colourBlock.y + 100) {
    colourBlock.updateHoverColour();
  } else if (colourBlock.dragged && pointerPos.x < colourBlock.x && pointerPos.x >= colourBlock.x + 100 && pointerPos.y < colourBlock.y && pointerPos.y >= colourBlock.y + 100) {
    colourBlock.dragged = false;
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
      ctx.fillStyle = mixTwoColours(uiColourArray[2], trueBlack, 0.5);
      ctx.fillRect(-shift - 10, - 40 - (chittens[i].size * 2.75), (shift * 2) + buttonPadding, buttonPadding);
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
      // hover indicator
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = mixTwoColours(uiColourArray[0], trueWhite, 0.5);
      ctx.lineWidth = hoverIndicatorStroke;
      ctx.beginPath();
      ctx.arc(chittens[i].x, chittens[i].y, hoverIndicatorSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.globalAlpha = 1;

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
  this.dragged = false;
  this.colour = trueWhite;
  // translate coord to center
  this.x = this.parent.x;
  this.y = this.parent.y;
  this.size = 10;
  this.update = function () {
    if (this.dragged) {
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
  this.dragged = false;
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
    ctx.strokeStyle = uiColourArray[3];
    ctx.strokeRect(this.x, this.y, this.pixelSize * this.pixelRows, this.pixelSize * this.pixelColumns);

    for (let i = 0; i < outputPixels.length; i++) {
      let row = Math.floor(i / this.pixelRows);
      ctx.fillStyle = this.pixels[i];
      ctx.fillRect(this.x + (i * this.pixelSize) - (row * this.pixelSize * this.pixelRows), this.y + (row * this.pixelSize), this.pixelSize, this.pixelSize);
    }
  };
}

function adoptionCentreUiOn(gender) {
  labels[0].visible = true;
  labels[1].text = gender == 'Female' ? 'Choose a girl' : 'Choose a boy';
  labels[1].reinitSizes();
  labels[1].visible = true;
  buttons[0].visible = true;
  buttons[6].visible = true;
  // Show breed filter toggle button and create breed filter buttons
  buttons[15].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[13].visible = true;
  createBreedFilterButtons(gender);
}

function litterChoiceUiOn(fParentName, mParentName) {
  labels[3].text = 'Choose one of ' + fParentName + ' and ' + mParentName + '\'s litter to keep';
  labels[3].reinitSizes()
  labels[3].visible = true;
  labels[4].visible = true;
  labels[2].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[2].visible = true;
  buttons[10].available = false;
  buttons[11].available = false;
  buttons[12].available = false;
  buttons[6].available = false;
}

function updateChoiceTimer() {
  labels[2].text = "" + parseInt(choiceTimer / 50);
  labels[2].reinitSizes();
}

function renderUi() {
  // ui text
  basicInfo = new TextElement(fontSize + 'px', textColour, 10, canvasHeight - 5);
  basicInfo.text = tickerToTime(daytimeCounter) + ' Day ' + day +
    ' Chittens ' + (femaleCount + maleCount + nonbinaryCount) + ' | ' + femaleCount + unicodeFemale + ' ' + maleCount + unicodeMale + ' ' + nonbinaryCount + unicodeNonBinary + ' ';
  basicInfo.update();
  topLabel = new TextElement(fontSize + 'px', textColour, canvasWidth - 115, 17);
  topLabel.text = 'v' + version + ' FPS ' + fps;
  topLabel.update();
  // day of the week and the season
  leftLabel = new TextElement(fontSize + 'px', textColour, 250, 17);
  leftLabel.text = dayNames[today] + ', ' + seasonNames[season] + ' ' + temperature + unicodeDegrees;
  leftLabel.update();
  newestMessage = new TextElement(fontSize + 'px', textColour, 10, canvasHeight - 25);
  if (!paused) {
    newestMessage.text = currentMessage.timeStamp + ' ' + currentMessage.text;
  } else {
    newestMessage.text = tickerToTime(daytimeCounter) + ' Simulation paused';
  }
  newestMessage.update();

  // gene editing block
  if (geneEditing) {
    spliceBox.update();
    experiment.update();
    experiment.render();
    colourBars.update();
    colourBlock.update();
    for (let i = 0; i < sliders.length; i++) {
      sliders[i].update();
    }
  }

  // draw labels
  for (let i = 0; i < labels.length; i++) {
    labels[i].update();
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].update();
  }

  // Render breed filter buttons
  for (let i = 0; i < breedFilterButtons.length; i++) {
    breedFilterButtons[i].update();
  }
  for (let i = 0; i < buttons.length; i++) {
    // tool tip - draw on top of buttons and labels
    if (buttons[i].detectButtonClick()) {
      buttons[i].drawToolTip();
    }
  }

  // Tooltips for breed filter buttons
  for (let i = 0; i < breedFilterButtons.length; i++) {
    if (breedFilterButtons[i].detectButtonClick()) {
      breedFilterButtons[i].drawToolTip();
    }
  }

  // hover operations
  hover();

  // Tooltip section
  // Draw tooltip for selected chitten LAST - on top of everything
  if (selection !== null && selection.beingHeld) {
    drawChittenTooltip(selection, pointerPos.x, pointerPos.y);
  }
  // Draw tooltip for chittens and parents in catboxes if hovered on
  if (parentBoxes.length !== 0 || boxes.length !== 0) {
    let stop = false; // can only hover on one at a time
    if (boxes.length > 0) {
      for (let i = 0; i < boxes.length && !stop; i++) {
        if (boxes[i].highlighted) {
          drawChittenTooltip(chittens[boxes[i].id]);
          stop = true;
        }
      }
    }
    if (!stop && parentBoxes.length > 0) {
      for (let i = 0; i < parentBoxes.length && !stop; i++) {
        if (parentBoxes[i].highlighted) {
          drawChittenTooltip(chittens[parentBoxes[i].id]);
          stop = true;
        }
      }
    }
  }
}