// font
const globalFont = 'Consolas';
// scaling fonts
fontSize = 15;
fontSizeSmall = 12;
fontWidth = 8.4;
// adoption centre / litter picker
boxes = [];
parentBoxes = [];
adoptionBackground = null;
const adoptionCentrePadding = 20;
const adoptionCentreColour = 'rgba(34, 34, 34, 0.7)'
const adoptionCentreBorderColour = trueWhite;
const breedFilterXMargin = adoptionCentrePadding + 20;
// cat boxes
const boxSize = 170;
const boxPadding = 20;
const boxColumns = 3;
const boxRows = 3;
const boxThickness = 10;
// buttons and labels
buttons = [];
labels = [];
const buttonHeight = 25;
const buttonPadding = 20;
const buttonMargin = 5;
// hovering
const hoverIndicatorSize = 60;
const hoverIndicatorStroke = 3;
const tooltipCharacterWrapLimit = 40;
// chitten tooltip
const cTooltipPMarginX = 60;
const cTooltipMargin = 10;
const cTooltipPadding = 20;
const tooltipBorderColour = 'rgba(255, 255, 255, 0.3)';
const tooltipBackgroundColour = trueBlack;
let buttonsInTopBar = 0;
let topBarButtonsXTotal = 0;
// colours
uiColourArray = [];

// Breed filtering variables
let selectedBreedFilter = 'All'; // Current breed filter
let breedFilterButtons = []; // Array to hold breed filter buttons
let breedFilterVisible = false; // Whether breed filter buttons are shown

/**
* function to initialise all the buttons and labels / dynamic ui elements
*/
function initUi() {
  // adoption / litter picking centre
  adoptionBackground = new (AdoptionCentreBackground);

  buttons.push(new Button(0, (-buttonHeight / 2) + (1 * (buttonHeight + buttonMargin)) + buttonMargin, 'Show more', 'See another 9 chittens'));
  buttons[0].visible = false;
  buttons[0].canvasSizeDependent = true;
  buttons[0].reinitPosition();

  buttons.push(new Button(0, -buttonHeight / 2 + buttonMargin, 'Adopt', 'Adopt the selected chitten'));
  buttons[1].visible = false;
  buttons[1].canvasSizeDependent = true;
  buttons[1].reinitPosition();

  buttons.push(new Button(0, (-buttonHeight / 2) + (1 * (buttonHeight + buttonMargin)) + buttonMargin, 'Rehome all', 'Give away this litter'));
  buttons[2].visible = false;
  buttons[2].canvasSizeDependent = true;
  buttons[2].reinitPosition();

  buttons.push(new Button(0, buttonMargin, unicodeThunderstorm, 'Rehome the selected Chitten'));
  buttons[3].topBarPosition = 5;
  buttons.push(new Button(canvasWidth / 2, 370, 'DUMMY', 'DUMMY')); // not currently being used
  buttons[4].visible = false;
  // upload / download and editing
  buttons.push(new Button(0, buttonMargin, unicodeArrowDown, 'Download the selected Chitten to your device'));
  buttons[5].topBarPosition = 4;
  buttons.push(new Button(0, buttonMargin, unicodeArrowUp, 'Upload a Chitten from your device'));
  buttons[6].topBarPosition = 3;

  // gene editing
  buttons.push(new Button(60, 595, 'Save Female', 'Save a Female clone of this Chitten'));
  buttons[7].visible = false;
  buttons.push(new Button(60, 630, 'Save Male', 'Save a Male clone of this Chitten'));
  buttons[8].visible = false;
  buttons.push(new Button(60, 665, 'Close', 'Close the genetic editor'));
  buttons[9].visible = false;
  // menu items
  // devmode button
  buttons.push(new Button(canvasWidth - 20, canvasHeight - 25, '&!', 'Dev mode - open genetic editor', false));
  if (!devMode) {
    buttons[10].visible = false;
  }
  buttons[10].canvasSizeDependent = false;
  buttons.push(new Button(0, buttonMargin, unicodeFemale, 'Adopt a female Chitten'));
  buttons[11].topBarPosition = 1;
  buttons.push(new Button(0, buttonMargin, unicodeMale, 'Adopt a male Chitten'));
  buttons[12].topBarPosition = 2;
  buttons.push(new Button(0, (-buttonHeight / 2) + (3 * (buttonHeight + buttonMargin)) + buttonMargin, 'Close', 'Close the adoption centre'));
  buttons[13].visible = false;
  buttons[13].canvasSizeDependent = true;
  buttons[13].reinitPosition();

  // Pause button
  buttons.push(new Button(0, buttonMargin, unicodeBar + unicodeBar, 'Pause the game'));
  buttons[14].fixedSize = true;
  buttons[14].topBarPosition = 0;

  // Add breed filter toggle button (positioned under "Show me more")
  buttons.push(new Button(0, (-buttonHeight / 2) + (2 * (buttonHeight + buttonMargin)) + buttonMargin, 'Filter by breed', 'Choose specific breeds to view'));
  buttons[15].visible = false; // Hide breed filter button initially
  buttons[15].canvasSizeDependent = true;
  buttons[15].reinitPosition();

  // Button for endless mode
  buttons.push(new Button(0, buttonMargin, unicodeInfinity, 'Turn on endless mode'));
  buttons[16].topBarPosition = 6;

  // adoption centre label
  labels.push(new Button(0, - 2 * (buttonHeight + buttonMargin) - buttonMargin, unicodeCat + ' Welcome to the Adoption Centre', '', '', true));
  labels[0].visible = false;
  labels[0].canvasSizeDependent = true;
  labels[0].aboveCattery = true;
  labels[0].reinitPosition();

  // choose a ....
  labels.push(new Button(0, - 1 * (buttonHeight + buttonMargin) - buttonMargin, 'Choose a ....', '', '', true)); // text populated later
  labels[1].visible = false;
  labels[1].canvasSizeDependent = true;
  labels[1].aboveCattery = true;
  labels[1].reinitPosition();

  // litter choice timer label
  labels.push(new Button(0, - 1 * (buttonHeight + buttonMargin) - buttonMargin, 'X', '', '', true));
  labels[2].visible = false;
  labels[2].canvasSizeDependent = true;
  labels[2].aboveCattery = true;
  labels[2].reinitPosition();

  // litter centre label
  labels.push(new Button(0, - 3 * (buttonHeight + buttonMargin) - buttonMargin, 'Choose one of ....', '', '', true)); // text populated later
  labels[3].visible = false;
  labels[3].canvasSizeDependent = true;
  labels[3].aboveCattery = true;
  labels[3].reinitPosition();

  // rehoming info label
  labels.push(new Button(0, - 2 * (buttonHeight + buttonMargin) - buttonMargin, 'The rest will be adopted by nice people', '', '', true));
  labels[4].visible = false;
  labels[4].canvasSizeDependent = true;
  labels[4].aboveCattery = true;
  labels[4].reinitPosition();

  // place all the buttons in the top bar correctly according to their topBarPosition index
  positionTopBar();
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

  // Calculate rightmost edge of catboxes: center + half of grid width + box width
  const rightmostBoxEdge = (canvasWidth / 2) + (((boxSize * 3) + (boxPadding * 2)) / 2);
  const startX = rightmostBoxEdge + breedFilterXMargin;

  // Center the group of buttons vertically on canvas
  const totalHeight = (availableBreeds.length - 1) * (buttonHeight + 5) + buttonHeight;
  const startY = (canvasHeight / 2) - (totalHeight / 2);

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

function positionTopBar() {
  // reset counters if they're globals
  buttonsInTopBar = 0;
  // collect indices with a numeric topBarPosition (includes 0)
  const tbIndices = buttons
    .map((btn, idx) => ({ idx, pos: Number(btn.topBarPosition) }))
    .filter(({ pos }) => Number.isFinite(pos))
    .sort((a, b) => a.pos - b.pos)
    .map(({ idx }) => idx);
  buttonsInTopBar = tbIndices.length;
  // lay out left -> right
  let x = 0; // left edge cursor
  for (const i of tbIndices) {
    const btn = buttons[i];
    btn.x = buttonMargin + x + btn.width / 2;      // center at current segment
    x += buttonMargin + btn.width;  // advance cursor
  }
  topBarButtonsXTotal = x + buttonMargin; // total width consumed, including last margin
}

/**
* function to describe a button
* @param {int} x - the x coordinate of the middle of the button
* @param {int} y - the y coordinate of the top of the button
* @param {string} text - text on the button
*/
function Button(x, y, text, toolTip, alignment, isLabel = false) {
  this.align = alignment;
  this.x = x;
  this.y = y;
  this.text = text;
  this.width = (this.text.length * fontWidth) + buttonPadding;
  this.size = ((this.text.length * fontWidth) + buttonPadding);
  this.fixedSize = false;
  this.topBarPosition;
  this.height = buttonHeight;
  this.visible = true;
  this.available = true;
  this.highlighted = false;
  this.on = false;
  this.toolTip = toolTip;
  this.isLabel = isLabel;
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
      this.y = (trueBottom / 2) - ((boxSize + boxPadding) * 1.5) - (boxThickness / 2) + this.canvasYOffset;
    } else {
      this.y = (trueBottom / 2) + ((boxSize + boxPadding) * 1.5) + (boxThickness / 2) + this.canvasYOffset;
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
      if (!this.isLabel) {
        ctx.globalAlpha = 0.25;
        if (this.highlighted) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = mixTwoColours(trueWhite, uiColourArray[2], 0.5);
        } else if (!this.available) {
          ctx.fillStyle = mixTwoColours(trueBlack, uiColourArray[2], 0.5);
        } else if (this.on) {
          ctx.fillStyle = mixTwoColours(trueWhite, uiColourArray[0], 0.5);
        } else {
          ctx.fillStyle = mixTwoColours(trueWhite, uiColourArray[2], 0.3);
        }
        ctx.fillRect(0, 0, this.width, this.height);
      }
      // text
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
    // - Case 3: Rehome the selected chitten (storm button)
    case 3:
      sendMessage(selection.name + ' went to live with someone else');
      for (let i = 0, stop = false; i < chittens.length && !stop; i++) {
        if (chittens[i] == selection) {
          stop = true;
          chittens[i].kill(false);
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

let lastTouchTime = 0;
const touchMouseDelay = 500; // 500ms to prevent mouse events after touch

function tapOn() {
  lastTouchTime = performance.now();
  click();
}

function tapOff() {
  lastTouchTime = performance.now();
  unclick();
}

function mouseOn() {
  // Only process mouse events if no touch event happened recently
  if (performance.now() - lastTouchTime > touchMouseDelay) {
    click();
  }
}

function mouseOff() {
  // Only process mouse events if no touch event happened recently
  if (performance.now() - lastTouchTime > touchMouseDelay) {
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
      if (detectCollisionPointerObject(chittens[i])) {
        clickedSomething = true;
        updateCursor('grabbing');
        selection = chittens[i];
        selection.beingHeld = true;
        selection.targetSittingState = false;
        selection.focus = null;
        selection.onSurface = false;
        selection.onTree = false;
        selection.awake = true;
      }
    }
  }

  if (!paused && !clickedSomething && !choosingChitten) {
    for (let i = 0; i < fruits.length && !clickedSomething; i++) {
      if (!fruits[i].fumbled && fruits[i].y < trueBottom && detectCollisionPointerObject(fruits[i])) {
        clickedSomething = true;
        fruits[i].fumbleFruit(0, 0);
      }
    }
  }

  if (!paused && !clickedSomething && !choosingChitten) {
    for (let i = 0; i < fireflies.length && !clickedSomething; i++) {
      if (detectCollisionPointerObject(fireflies[i])) {
        clickedSomething = true;
        fireflies[i].speedX = (Math.random() - 0.5) * 2; // Small random horizontal velocity
        fireflies[i].speedY = (Math.random() - 0.5) * 2; // Small random vertical velocity
        if (fireflies[i].landed) {
          fireflies[i].takeOffFromLanded();
        }
      }
    }
  }

  // if we are gene editing, turn on click checkers
  if (geneEditing) {
    // Handle new editor control clicks
    if (handleEditorControlClicks(pointerPos)) {
      clickedSomething = true;
    }

    // now check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (detectCollision(sliders[i].sThumb, pointerPos)) {
        sliders[i].sThumb.dragged = true;
        clickedSomething = true;
      } else {
        sliders[i].sThumb.dragged = false;
      }
    }

    // colour bar - now supports 6 colors
    if (devMode && colourBars && pointerPos.x >= colourBars.x && pointerPos.x <= colourBars.x + (colourBars.colors.length * colourBars.colorWidth) && pointerPos.y >= colourBars.y && pointerPos.y <= colourBars.y + colourBars.colorHeight) {
      const colourIndex = Math.floor((pointerPos.x - colourBars.x) / colourBars.colorWidth);
      if (colourIndex >= 0 && colourIndex < colourBars.colors.length) {
        colourBars.selected = colourIndex;
        clickedSomething = true;
      }
    }
    // colour picker
    if (!clickedSomething && colourPicker.detectPointer()) {
      colourPicker.updateColour();
      colourPicker.dragging = true;
      clickedSomething = true;
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
    selection.resetJumpCooldown();
    updateCursor('default');
  }

  if (geneEditing) {
    // check sliders
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i].sThumb.dragged) {
        sliders[i].sThumb.dragged = false;
      }
    }
    if (colourPicker.dragging) {
      colourPicker.dragging = false;
    }
  }
}

/**
* function to check for and process mouse hovering over objects
*/
function hover() {
  let hovered = false;

  // Reset all highlights first
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].highlighted = false;
  }
  for (let i = 0; i < breedFilterButtons.length; i++) {
    breedFilterButtons[i].highlighted = false;
  }
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].highlighted = false;
  }
  if (typeof parentBoxes !== 'undefined') {
    for (let i = 0; i < parentBoxes.length; i++) {
      parentBoxes[i].highlighted = false;
    }
  }

  // highlighting buttons
  for (let i = 0; i < buttons.length && !hovered; i++) {
    // tooltip creation on hover is handled in window.js
    if (buttons[i].available && buttons[i].detectButtonClick()) {
      buttons[i].highlighted = true;
      buttons[i].drawToolTip();
      updateCursor('help');
      hovered = true;
    }
  }

  // highlighting breed filter buttons
  for (let i = 0; i < breedFilterButtons.length && !hovered; i++) {
    if (breedFilterButtons[i].detectButtonClick()) {
      breedFilterButtons[i].highlighted = true;
      breedFilterButtons[i].drawToolTip();
      updateCursor('help');
      hovered = true;
    }
  }
  // highlighting catboxes
  for (let i = 0; i < boxes.length && !hovered; i++) {
    if (detectRectCollision(pointerPos, boxes[i])) {
      drawChittenTooltip(chittens[boxes[i].id]);
      updateCursor('help');
      boxes[i].highlighted = true;
      hovered = true;
    }
  }
  // highlighting parent boxes in litter selection
  if (typeof parentBoxes !== 'undefined') {
    for (let i = 0; i < parentBoxes.length && !hovered; i++) {
      if (detectRectCollision(pointerPos, parentBoxes[i])) {
        drawChittenTooltip(chittens[parentBoxes[i].id]);
        updateCursor('help');
        parentBoxes[i].highlighted = true;
        hovered = true;
      }
    }
  }

  // colour picker
  if (!hovered && colourPicker.dragging && colourPicker.detectPointer()) {
    hovered = true;
    colourPicker.dragging = true;
    colourPicker.updateColour();
  }

  // chittens hover label
  for (let i = 0; i < chittens.length && !hovered; i++) {
    if (!chittens[i].inCatBox && chittens[i] !== experiment && detectCollisionPointerObject(chittens[i])) {
      hovered = true;
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
      if (!chittens[i].beingHeld) {
        updateCursor('grab');
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

  if (!paused && !hovered && !choosingChitten) {
    for (let i = 0; i < fruits.length && !hovered; i++) {
      if (!fruits[i].fumbled && fruits[i].y < trueBottom && detectCollisionPointerObject(fruits[i])) {
        hovered = true;
        updateCursor('grab');
      }
    }
  }
  if (!paused && !hovered && !choosingChitten) {
    for (let i = 0; i < fireflies.length && !hovered; i++) {
      if (detectCollisionPointerObject(fireflies[i])) {
        hovered = true;
        updateCursor('grab');
      }
    }
  }

  if (!hovered && document.body.style.cursor !== 'grabbing') {
    updateCursor();
  }
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
  labels[2].text = "" + parseInt(choiceTimer / UPS);
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
  topLabelLeft = new TextElement(fontSize + 'px', textColour, topBarButtonsXTotal, 17 + buttonMargin);
  topLabelLeft.text = dayNames[today] + ', ' + seasonNames[season] + ' ' + temperature + unicodeDegrees;
  topLabelLeft.update();
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
    // experiment.update();
    experiment.render();
    colourBars.update();
    colourPicker.update();
    for (let i = 0; i < sliders.length; i++) {
      sliders[i].update();
    }
    // Render new editor controls
    renderEditorControls();
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

  // hover operations
  if (selection !== null && selection.beingHeld) {
    drawChittenTooltip(selection);
  } else {
    hover();
  }
}

// Helper function to draw text with colored tick/cross symbols
function drawTextWithColoredSymbols(text, x, y) {
  let currentX = x;
  let i = 0;

  while (i < text.length) {
    if (text[i] === unicodeTick) {
      // Draw green tick
      ctx.fillStyle = tickColour;
      ctx.fillText(unicodeTick, currentX, y);
      currentX += ctx.measureText(unicodeTick).width;
      ctx.fillStyle = trueWhite; // Reset to white
    } else if (text[i] === unicodeCross) {
      // Draw red cross
      ctx.fillStyle = crossColour;
      ctx.fillText(unicodeCross, currentX, y);
      currentX += ctx.measureText(unicodeCross).width;
      ctx.fillStyle = trueWhite; // Reset to white
    } else {
      // Find the next symbol or end of string
      let nextSymbolIndex = text.length;
      let nextTick = text.indexOf(unicodeTick, i);
      let nextCross = text.indexOf(unicodeCross, i);

      if (nextTick !== -1) nextSymbolIndex = Math.min(nextSymbolIndex, nextTick);
      if (nextCross !== -1) nextSymbolIndex = Math.min(nextSymbolIndex, nextCross);

      // Draw text segment up to next symbol
      let segment = text.substring(i, nextSymbolIndex);
      ctx.fillText(segment, currentX, y);
      currentX += ctx.measureText(segment).width;
      i = nextSymbolIndex - 1; // -1 because loop will increment
    }
    i++;
  }
  return currentX; // Return final x position
}

/**
 * Draws a tooltip for any chitten at specified coordinates
 * @param {Chitten} chitten - The chitten to show tooltip for
 */
function drawChittenTooltip(chitten) {
  ctx.save();

  // Calculate dynamic tooltip size based on content
  let maxWidth = 200; // Maximum width
  let lineHeight = 15;
  let contentHeight = 20; // Top padding

  // Measure text widths to find max width needed
  ctx.font = 'bold 14px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText(chitten.name).width);

  ctx.font = '12px ' + globalFont;
  let bString = chitten.breed;
  if (getBreedDepth(chitten.breed) == 0) {
    if (hasBreedStandard(chitten.breed)) {
      if (meetsBreedStandard(chitten)) {
        bString += " " + unicodeTick + " " + breedStandardText;
      } else {
        bString += " " + unicodeCross + " " + notBreedStandardText;
      }
    }
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Breed: ' + bString).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Age: ' + chitten.age).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Gender: ' + chitten.gender).width);

  // Pre-calculate coat string for width measurement
  let cString = '';
  if (chitten.sparseCoatExpressed && !chitten.hairlessExpressed) {
    cString += 'Sparse '
  }
  if (chitten.albinoExpressed || chitten.hairlessExpressed) {
    if (chitten.albinoExpressed) {
      cString += 'Albino White';
    } else if (chitten.hairlessExpressed) {
      let c1 = ntc.name(chitten.skinColour1)[1];
      let c2 = ntc.name(chitten.skinColour2)[1];
      let c3 = ntc.name(chitten.skinColour3)[1];
      cString += c1 + ', ' + c2 + ' & ' + c3;
    }
    // unknown colours for chittens whos colours change over time
  } else if ((chitten.colourpointExpressed || chitten.pattern == 3)
    && chitten.age < maturesAt) {
    cString = unicodeUnknown;
  } else {
    let c1 = ntc.name(chitten.getBodyPartColour('firstColour'))[1];
    let c2 = ntc.name(chitten.getBodyPartColour('secondColour'))[1];
    let c3 = ntc.name(chitten.getBodyPartColour('thirdColour'))[1];
    if (chitten.secondColour == chitten.thirdColour) {
      cString += c1 + ' & ' + c2;
    } else {
      cString += c1 + ', ' + c2 + ' & ' + c3;
    }
    if (chitten.tickedCoatExpressed) {
      cString += ' Ticked';
    }
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Coat: ' + cString).width);

  // pattern colours
  let pString = 'None';
  if ((chitten.albinoExpressed && !this.sparseCoatExpressed)
    || ((chitten.colourpointExpressed)
      && chitten.age < maturesAt)) {
    pString = unicodeUnknown;
  } else if (chitten.age < maturesAt && chitten.pattern == 3) {
    pString = unicodeUnknown + " " + getPatternName(3);
  } else if (chitten.pattern == 1) {
    pString = getPatternName(1);
  } else if (chitten.pattern == 2) {
    pString = getPatternName(2);
  } else if (chitten.pattern == 5) {
    pString = getPatternName(5);
  } else if (chitten.pattern == 3 || chitten.pattern == 6) {
    if (chitten.hairlessExpressed) {
      pString = '';
    } else {
      pString = ntc.name(chitten.getPatternColourAndAlpha()[0])[1];
    }
    pString += ' ' + getPatternName(chitten.pattern);
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Pattern: ' + pString).width);

  // Pre-calculate eye string for width measurement
  let eString = '';
  if (chitten.age < maturesAt) {
    eString = unicodeUnknown;
  } else {
    if (!chitten.heterochromicExpressed && !chitten.albinoExpressed) {
      eString = ntc.name(chitten.specialColours[6])[1];
    } else if (chitten.albinoExpressed) {
      eString = 'Albino';
    } else {
      let color1Name = ntc.name(chitten.specialColours[6])[1];
      let color2Name = ntc.name(chitten.specialColours[7])[1];
      eString = 'Heterochromic ' + color1Name + ' & ' + color2Name;
    }
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Eyes: ' + eString).width);

  ctx.font = 'bold 11px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText('GENETICS').width);

  // Auto-generate genetics section from GENE_DATA
  let geneLines = [];
  ctx.font = '10px ' + globalFont;

  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    let geneSymbol = chitten[geneData.geneProp] ? unicodeTick : unicodeCross;
    let expressedSymbol = chitten[geneData.expressedProp] ? unicodeTick : unicodeCross;
    let lineText = `${geneData.tooltip}: ${geneSymbol} Expressed: ${expressedSymbol}`;

    geneLines.push(lineText);
    maxWidth = Math.max(maxWidth, ctx.measureText(lineText).width);
  }

  contentHeight = cTooltipPadding + (lineHeight * (7 + geneLines.length)); // 7 basic lines + gene count + GENETICS spacing

  const tooltipWidth = maxWidth + cTooltipPadding;
  const tooltipHeight = contentHeight;

  // Position tooltip near mouse
  let tooltipX, tooltipY;
  tooltipX = pointerPos.x + cTooltipPMarginX; // Offset from mouse
  tooltipY = pointerPos.y - (tooltipHeight / 2); // Above mouse
  // Keep tooltip on screen, and don't block held chittens
  if (tooltipX + tooltipWidth > canvasWidth) {
    tooltipX = pointerPos.x - cTooltipPMarginX - tooltipWidth;
  }
  if (tooltipY < 0) tooltipY = cTooltipMargin; // Below mouse if no room above
  if (tooltipX < 0) tooltipX = cTooltipMargin;
  if (tooltipY + tooltipHeight > canvasHeight) {
    tooltipY = canvasHeight - tooltipHeight - cTooltipMargin;
  }

  // Draw tooltip background with border
  ctx.fillStyle = tooltipBackgroundColour;
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
  ctx.strokeStyle = tooltipBorderColour;
  ctx.lineWidth = 1;
  ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  // Header with cat name
  ctx.fillStyle = trueWhite;
  ctx.font = 'bold 14px ' + globalFont;
  ctx.fillText(chitten.name, tooltipX + 10, tooltipY + 20);

  // Gender symbol in top right with color coding
  let genderSymbol = unicodeNonBinary;
  let genderColor = genderPurple;
  if (chitten.gender == 'Male') {
    genderSymbol = unicodeMale;
    genderColor = genderBlue;
  } else if (chitten.gender == 'Female') {
    genderSymbol = unicodeFemale;
    genderColor = genderPink;
  }

  ctx.fillStyle = genderColor;
  ctx.font = 'bold 18px ' + globalFont;
  let genderWidth = ctx.measureText(genderSymbol).width;
  ctx.fillText(genderSymbol, tooltipX + tooltipWidth - genderWidth - 10, tooltipY + 20);

  // Basic info with smaller font (moved up one line)
  ctx.font = '12px ' + globalFont;
  ctx.fillStyle = trueWhite;
  drawTextWithColoredSymbols('Breed: ' + bString, tooltipX + 10, tooltipY + 40);
  ctx.fillText('Age: ' + chitten.age, tooltipX + 10, tooltipY + 55);
  ctx.fillText('Coat: ' + cString, tooltipX + 10, tooltipY + 70);
  ctx.fillText('Eyes: ' + eString, tooltipX + 10, tooltipY + 85);
  ctx.fillText('Pattern: ' + pString, tooltipX + 10, tooltipY + 100);

  ctx.font = 'bold 11px ' + globalFont;
  ctx.fillText('GENETICS', tooltipX + 10, tooltipY + 125);

  ctx.font = '10px ' + globalFont;
  // Auto-generate genetics display from GENE_DATA with colored symbols
  let currentY = tooltipY + 140;
  for (const geneLine of geneLines) {
    drawTextWithColoredSymbols(geneLine, tooltipX + 10, currentY);
    currentY += 13; // Line spacing
  }
  ctx.restore();
}

function AdoptionCentreBackground() {
  this.x = 0;
  this.y = 0;
  this.width = canvasWidth;
  this.height = canvasHeight;
  this.expectedBoxes = 9;
  this.columns = boxColumns;
  this.rows = boxRows;
  this.resize = function () {
    this.rows = Math.floor(boxes.length / this.columns);
    let halfColumns = this.columns / 2;
    let halfRows = this.rows / 2;
    let buttonsAbove;
    let buttonsBelow;
    let xOffset;
    let yOffset;
    if (!chosenKitten) {
      buttonsAbove = 1;
      buttonsBelow = 2;
      xOffset = boxSize + boxPadding + adoptionCentrePadding + boxThickness + adoptionCentrePadding;
      yOffset = (boxSize / 2);
    } else {
      buttonsAbove = 2;
      buttonsBelow = 4;
      xOffset = 0;
      yOffset = 0;
    }
    let yOffsetTop = (buttonsAbove * (buttonHeight + buttonMargin)) + yOffset;
    let yOffsetBelow = (buttonsBelow * (buttonHeight + buttonMargin));
    this.x = (canvasWidth / 2) - ((boxSize + boxPadding) * halfColumns) + (boxThickness / 2) - (adoptionCentrePadding) - xOffset;
    this.y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (adoptionCentrePadding) - yOffsetTop;
    this.width = boxRows * (boxSize + boxPadding) - boxThickness + (adoptionCentrePadding * 2) + (2 * xOffset);
    this.height = boxColumns * (boxSize + boxPadding) - boxThickness + (adoptionCentrePadding * 2) + yOffsetTop + yOffsetBelow;
  }
  this.render = function () {
    ctx.globalAlpha = 1;
    ctx.fillStyle = adoptionCentreColour;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = adoptionCentreBorderColour;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/**
* function to describe a box
*/
function CatBox(parentBox, editorBox, column, row, size, thickness) {
  this.x = 0;
  this.y = 0;
  this.column = column;
  this.row = row;
  this.parentBox = parentBox;
  this.editorBox = editorBox;
  this.size = size;
  this.thickness = thickness;
  this.selected = false;
  this.highlighted = false;
  this.id = 0;
  this.text = '';
  this.symbol = unicodeHeart;
  this.colour = trueBlack;
  this.selectedColour;
  this.reinitPosition = function () {
    if (!this.parentBox && !this.editorBox) {
      this.x = (canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (this.column * boxPadding) + (this.column * boxSize);
      this.y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (this.row * boxPadding) + (this.row * boxSize);
    } else if (this.parentBox) {
      this.y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2);
      if (this.column == 1) {
        this.x = (canvasWidth / 2) - (boxSize * 3);
      } else if (this.column == 2) {
        this.x = (canvasWidth / 2) + (boxSize * 2);
      } else console.warn('CatBox reinit sent a bad column');
    } else if (this.editorBox) {
      this.x = editorPreviewBoxX;
      this.y = editorPreviewBoxY;
    }
  }
  this.reinitPosition();
  this.updateSymbol = function () {
    if (getBreedDepth(chittens[this.id].breed) == 0) {
      if (hasBreedStandard(chittens[this.id].breed)) {
        if (meetsBreedStandard(chittens[this.id])) {
          this.symbol = unicodeTick;
        } else this.symbol = unicodeCross;
      } else this.symbol = unicodeNoBreedStandard;
    } else this.symbol = unicodeCrossbreed;
  }
  this.update = function () {
    ctx.globalAlpha = 1;
    ctx.font = fontSizeSmall + 'px' + ' ' + globalFont;
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.text, this.x + 10, this.y + 20);
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.symbol, this.x + this.size - this.thickness - 10, this.y + this.size - this.thickness);
    ctx.globalAlpha = 1;
    ctx.lineWidth = this.thickness;
    if (!this.selected) {
      ctx.globalAlpha = 0.6;
    }
    if (this.highlighted || this.selected) {
      // set the highlight colour if it hasn't already
      if (!this.selectedColour) {
        this.selectedColour = mixTwoColours(this.colour, trueWhite, 0.5);
      }
      ctx.strokeStyle = this.selectedColour;
    } else {
      ctx.strokeStyle = this.colour;
    }
    ctx.strokeRect(this.x, this.y, this.size, this.size);
  };
  // function to check if we have hit the edge of the catbox
  this.checkBounce = function (who) {
    if (who.inCatBox == this && !who.onSurface) {
      // if we bounce off a side wall
      if (who.x < this.x + who.size || who.x >= this.x + this.size - who.size) {
        who.speedX *= -0.9;
        let targetangle = Math.atan2(who.y, this.y);
        who.spin += elasticity * targetangle / 10;
        if (who.x < this.x + who.size) {
          who.x = this.x + who.size;
        } else {
          who.x = this.x + this.size - who.size;
        }
      }
      if (who.y < this.y + who.size) {
        who.speedY *= -0.99;
        who.y = this.y + who.size;
      }
      if (who.y >= this.y + this.size - who.bodyToFeetDistance) {
        who.y = this.y + this.size - who.bodyToFeetDistance;
        who.landedOnSurface();
      }
    }
  };
}

function updateCursor(state) {
  switch (state) {
    case 'grabbing':
      document.body.style.cursor = 'grabbing';
      break;
    case 'grab':
      document.body.style.cursor = 'grab';
      break;
    case 'help':
      document.body.style.cursor = 'help';
      break;
    default:
      document.body.style.cursor = 'default';
  }
}