// adoption centre / litter picker
boxes = [];
parentBoxes = [];
adoptionBackground = null;
// buttons and labels
buttons = [];
labels = [];
// hovering
const hoverIndicatorSize = 60;
const hoverIndicatorStroke = 3;
const tooltipCharacterWrapLimit = 40;
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
  adoptionBackground = new AdoptionCentreBackground();

  buttons.push(new AdoptionButton(
    0,
    (-CONTROL_SPACING.button.height / 2) + (1 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY)) + CONTROL_SPACING.button.marginY,
    'Show more',
    'See another 9 chittens'));
  buttons[0].action = function () {
    // 0: Show more / Switch between male and female adoption centers
    if (!chosenChittenF) {
      removeTemporaryChittens();
      initFemaleCattery();
    } else if (!chosenChittenM) {
      removeTemporaryChittens();
      initMaleCattery();
    } else if (!chosenChittenNB) {
      removeTemporaryChittens();
      initNonBinaryCattery();
    }
  };
  buttons[0].visible = false;
  buttons[0].aboveCattery = false;
  buttons[0].reinitPosition();

  buttons.push(new AdoptionButton(
    0,
    -CONTROL_SPACING.button.height / 2 + CONTROL_SPACING.button.marginY,
    'Adopt',
    'Adopt the selected chitten'));
  buttons[1].action = function () {
    confirmAdoption();
  };
  buttons[1].visible = false;
  buttons[1].aboveCattery = false;
  buttons[1].reinitPosition();

  buttons.push(new AdoptionButton(
    0,
    (-CONTROL_SPACING.button.height / 2) + (1 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY)) + CONTROL_SPACING.button.marginY,
    'Rehome all',
    'Give away this litter'));
  buttons[2].action = function () {
    rehomeLitter();
  };
  buttons[2].visible = false;
  buttons[2].aboveCattery = false;
  buttons[2].reinitPosition();


  buttons.push(new TopBarButton(unicodeThunderstorm, 'Rehome the selected Chitten', 6));
  buttons[3].action = function () {
    // Case 3: Rehome the selected chitten (storm button)
    sendMessage(selection.name + ' went to live with someone else');
    for (let i = 0, stop = false; i < chittens.length && !stop; i++) {
      if (chittens[i] == selection) {
        stop = true;
        chittens[i].kill(false);
      }
    }
    selection = null;
  };
  // upload / download and editing
  buttons.push(new TopBarButton(unicodeArrowDown, 'Download the selected Chitten to your device', 5));
  buttons[4].action = function () {
    // Case 5: Save selected chitten to file
    saveToFile(selection);
  };
  buttons.push(new TopBarButton(unicodeArrowUp, 'Upload a Chitten from your device', 5));
  buttons[5].action = function () {
    // Case 6: Upload chitten from file
    openUploadDialog();
  };

  // gene editing
  buttons.push(new EditorButton(0, 0, 'Save Chitten', 'Save this Chitten'));
  buttons[6].action = function () {
    // Case 7: Spawn an chitten from experiment template (dev mode)
    pasteChitten(copyChitten(experiment));
    // Name is already set in experiment object from text input
  };
  buttons[6].visible = false;
  buttons.push(new EditorButton(0, 0, 'Close', 'Close the genetic editor'));
  buttons[7].action = function () {
    // Exit gene editing mode (dev mode)
    closeEditor();
  };
  buttons[7].visible = false;
  // menu items
  // devmode button - general button (not on top bar or adoption screen)
  buttons.push(new Button(canvasWidth - 20, canvasHeight - 25, '&!', 'Open the genetic editor', false));
  buttons[8].action = function () {
    //  Enter gene editing mode with selected chitten (dev mode)
    openEditor();
  };
  if (!devMode) {
    buttons[8].visible = false;
  }
  buttons.push(new TopBarButton(unicodeFemale, 'Adopt a female Chitten', 1));
  buttons[9].action = function () {
    // Open female adoption center
    initFemaleCattery();
    disableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
    disableButtons.forEach(i => buttons[i].available = false);
  };
  buttons.push(new TopBarButton(unicodeMale, 'Adopt a male Chitten', 2));
  buttons[10].action = function () {
    // Open male adoption center
    initMaleCattery();
    disableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
    disableButtons.forEach(i => buttons[i].available = false);
  };
  buttons.push(new AdoptionButton(
    0,
    (-CONTROL_SPACING.button.height / 2) + (3 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY)) + CONTROL_SPACING.button.marginY,
    'Close',
    'Close the adoption centre'));
  buttons[11].action = function () {
    // Close adoption center without adopting
    choosingChitten = false;
    chosenChittenF = true;
    chosenChittenM = true;
    chosenChittenNB = true;
    selection = null;
    boxes = [];
    removeTemporaryChittens();
    hideButtons = [0, 1, 11, 13];
    hideLabels = [0, 1];
    enableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
    hideButtons.forEach(i => buttons[i].visible = false);
    hideLabels.forEach(i => labels[i].visible = false);
    enableButtons.forEach(i => buttons[i].available = true);
    resetBreedFilter();
  };
  buttons[11].visible = false;
  buttons[11].aboveCattery = false;
  buttons[11].reinitPosition();

  // Pause button
  buttons.push(new TopBarButton(unicodeBar + unicodeBar, 'Pause the game', 0));
  buttons[12].action = function () {
    // Case 14: Toggle pause/resume game
    paused = !paused;
    const affected = [3, 4, 5, 8, 9, 10, 0, 1, 2, 14, 15];
    affected.forEach(i => buttons[i].available = !paused);
    if (paused) {
      buttons[12].toolTip = 'Resume the game';
      buttons[12].text = unicodePlay;
    } else {
      buttons[12].toolTip = 'Pause the game';
      buttons[12].text = unicodeBar + unicodeBar;
    }
    buttons[12].on = paused;
    buttons[12].reinitSizes();
  };
  buttons[12].fixedSize = true;

  // Add breed filter toggle button (positioned under "Show me more")
  buttons.push(new AdoptionButton(
    0,
    (-CONTROL_SPACING.button.height / 2) + (2 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY)) + CONTROL_SPACING.button.marginY,
    'Filter by breed',
    'Choose specific breeds to view'));
  buttons[13].action = function () {
    // Case 15: Toggle breed filter visibility
    toggleBreedFilter();
  };
  buttons[13].visible = false;
  buttons[13].aboveCattery = false;
  buttons[13].reinitPosition();

  // Button for endless mode
  buttons.push(new TopBarButton(unicodeInfinity, 'Turn on endless mode', 7));
  buttons[14].action = function () {
    // Case 16: Toggle endless mode on/off
    endlessMode = !endlessMode;
    buttons[14].on = endlessMode;
    buttons[14].setToolTip(endlessMode
      ? 'Turn off endless mode'
      : 'Turn on endless mode');
    buttons[14].reinitSizes();
    recalculateChittenNumbers();
  };

  buttons.push(new TopBarButton(unicodeNonBinary, 'Adopt a non-binary Chitten', 4));
  buttons[15].action = function () {
    // Open non binary adoption center
    initNonBinaryCattery();
    disableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
    disableButtons.forEach(i => buttons[i].available = false);
  };

  // adoption centre label
  labels.push(new Label(0,
    - 2 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY) - CONTROL_SPACING.button.marginY,
    unicodeCat + ' Welcome to the Adoption Centre', UI_THEME.colours.primary));
  labels[0].visible = false;
  labels[0].aboveCattery = true;
  labels[0].reinitPosition();

  // choose a ....
  labels.push(new Label(0,
    - 1 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY) - CONTROL_SPACING.button.marginY,
    'Choose a ....', UI_THEME.colours.primary)); // text populated later
  labels[1].visible = false;
  labels[1].aboveCattery = true;
  labels[1].reinitPosition();

  // litter choice timer label
  labels.push(new Label(0,
    - 1 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY) - CONTROL_SPACING.button.marginY,
    'X', UI_THEME.colours.primary));
  labels[2].visible = false;
  labels[2].aboveCattery = true;
  labels[2].reinitPosition();

  // litter centre label
  labels.push(new Label(0,
    - 2 * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY) - CONTROL_SPACING.button.marginY,
    'Choose one of ....', UI_THEME.colours.primary)); // text populated later
  labels[3].visible = false;
  labels[3].aboveCattery = true;
  labels[3].reinitPosition();

  // place all the buttons in the top bar correctly according to their topBarPosition index
  positionTopBar();
}

function renderUi() {
  // bottomBar
  // day and time
  basicInfo = new Label(
    UI_AREAS.bottomBar.x,
    canvasHeight - UI_AREAS.bottomBar.y,
    tickerToTime(daytimeCounter) + ' Day ' + day +
    ' Chittens ' + (femaleCount + maleCount + nonbinaryCount)
    + ' | ' + femaleCount + unicodeFemale + ' '
    + maleCount + unicodeMale + ' '
    + nonbinaryCount + unicodeNonBinary + ' ',
    UI_THEME.colours.adaptive,
    'left');
  basicInfo.update();
  // last sent message
  let messageText;
  if (!paused) {
    messageText = currentMessage.timeStamp + ' ' + currentMessage.text;
  } else {
    messageText = tickerToTime(daytimeCounter) + ' Simulation paused';
  }
  newestMessage = new Label(
    UI_AREAS.bottomBar.x,
    canvasHeight - UI_AREAS.bottomBar.y - UI_AREAS.bottomBar.rowHeight,
    messageText,
    UI_THEME.colours.adaptive,
    'left');
  newestMessage.update();

  // topBar
  // fps and version
  topLabelRight = new Label(
    canvasWidth - UI_AREAS.topBar.rightMargin,
    UI_AREAS.topBar.textBottom,
    'v' + version + ' FPS ' + fps,
    UI_THEME.colours.adaptive,
    'right');
  topLabelRight.update();
  // day of the week and the season
  topLabelLeft = new Label(
    topBarButtonsXTotal,
    UI_AREAS.topBar.textBottom,
    dayNames[today] + ', ' + seasonNames[season] + ' ' + temperature + unicodeDegrees,
    UI_THEME.colours.adaptive,
    'left');
  topLabelLeft.update();

  // gene editing block
  if (geneEditing) {
    updateEditor();
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


// Create breed filter buttons
function createBreedFilterButtons(sex) {
  // Preserve current visibility state
  const wasVisible = breedFilterVisible;
  // Clear existing breed filter buttons
  breedFilterButtons = [];
  const availableBreeds = getAvailableBreeds(sex);
  const buttonsPerRow = 1;
  const buttonWidth = 140;
  // Calculate rightmost edge of catboxes: center + half of grid width + box width
  const rightmostBoxEdge = (canvasWidth / 2) + (((CATBOX.size * 3) + (CATBOX.padding * 2)) / 2);
  const startX = rightmostBoxEdge + UI_AREAS.adoption.filterMarginX;

  // Center the group of buttons vertically on canvas
  const totalHeight = (availableBreeds.length - 1) * (CONTROL_SPACING.button.height + 5) + CONTROL_SPACING.button.height;
  const startY = (canvasHeight / 2) - (totalHeight / 2);

  availableBreeds.forEach((breed, index) => {
    const row = Math.floor(index / buttonsPerRow);
    const col = index % buttonsPerRow;
    const x = startX + (col * buttonWidth);
    const y = startY + (row * (CONTROL_SPACING.button.height + 5));

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

    let button = new Button(x, y, breed, buttonTooltip, 'left'); // Breed filter buttons - general buttons
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
  if (buttons[13]) { // Breed filter toggle button
    buttons[13].text = breedFilterVisible ? 'Hide filters' : 'Breed filters';
    buttons[13].reinitSizes();
  }
}

// Reset breed filter when adoption center closes
function resetBreedFilter() {
  breedFilterVisible = false;
  selectedBreedFilter = 'All';
  breedFilterButtons.forEach(button => {
    button.visible = false;
  });
  if (buttons[13]) {
    buttons[13].text = 'Filter by breed';
    buttons[13].reinitSizes();
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
  let x = UI_AREAS.topBar.x; // left edge cursor
  for (const i of tbIndices) {
    const btn = buttons[i];
    btn.x = UI_AREAS.topBar.x + x + btn.width / 2; // center at current segment
    x += CONTROL_SPACING.button.marginX + btn.width;  // advance cursor
    btn.y = UI_AREAS.topBar.y;
  }
  topBarButtonsXTotal = x + CONTROL_SPACING.button.marginX; // total width consumed, including last margin
}

/**
* Button class that extends BaseControl
* @param {int} x - the x coordinate of the middle of the button
* @param {int} y - the y coordinate of the top of the button
* @param {string} text - text on the button
*/
class Button extends BaseControl {
  constructor(x, y, text, toolTip, alignment) {
    // Set font context before measuring
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    const width = ctx.measureText(text).width + CONTROL_SPACING.button.padding;
    const height = CONTROL_SPACING.button.height;
    super(x, y, width, height, '');
    // Button-specific properties
    this.align = alignment;
    this.text = text;
    this.fixedSize = false;
    this.available = true;
    this.highlighted = false;
    this.on = false;
    this.setToolTip(toolTip);
  }
  setToolTip(text) {
    this.toolTip = text;
    // Set font context before measuring
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    // Initialize tooltip wrapping - will be calculated in reinitSizes()
    if (this.toolTip.length > tooltipCharacterWrapLimit) {
      this.wrappedToolTip = this.wrapText(this.toolTip, 50);
      this.toolTipLines = this.wrappedToolTip.length;
      this.toolTipWidth = Math.max(...this.wrappedToolTip.map(line => ctx.measureText(line).width)) + CONTROL_SPACING.toolTip.padding;
      this.toolTipHeight = (this.toolTipLines * 20) + CONTROL_SPACING.toolTip.paddingY;
    } else {
      this.wrappedToolTip = [this.toolTip];
      this.toolTipLines = 1;
      this.toolTipWidth = ctx.measureText(this.toolTip).width + CONTROL_SPACING.toolTip.paddingX;
      this.toolTipHeight = 20 + CONTROL_SPACING.toolTip.paddingY; // Use consistent line height
    }
  }
  reinitSizes() {
    // Set font context before measuring
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    // Word wrap tooltips longer than the character limit
    if (!this.fixedSize) {
      this.width = ctx.measureText(this.text).width + CONTROL_SPACING.button.padding;
      this.size = ctx.measureText(this.text).width + CONTROL_SPACING.button.padding;
    }
  }
  wrapText(text, maxLength) {
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
  }

  drawToolTip() {
    let tooltipX = pointerPos.x;
    let tooltipY = pointerPos.y + CONTROL_SPACING.toolTip.y;

    // Keep tooltip within screen bounds
    if (tooltipX + this.toolTipWidth > canvasWidth) {
      tooltipX = canvasWidth - this.toolTipWidth - 5; // 5px margin
    }
    if (tooltipX < 0) {
      tooltipX = 5; // 5px margin from left edge
    }
    if (tooltipY + this.toolTipHeight > canvasHeight) {
      tooltipY = pointerPos.y - this.toolTipHeight - 5; // Position above cursor
    }
    if (tooltipY < 0) {
      tooltipY = 5; // 5px margin from top
    }

    ctx.fillStyle = mixTwoColours(uiColourArray[3], UI_THEME.colours.secondary, 0.5);
    ctx.fillRect(tooltipX, tooltipY, this.toolTipWidth, this.toolTipHeight);
    ctx.fillStyle = UI_THEME.colours.primary;

    if (this.wrappedToolTip && this.wrappedToolTip.length > 1) {
      // Multi-line tooltip
      for (let i = 0; i < this.wrappedToolTip.length; i++) {
        ctx.fillText(this.wrappedToolTip[i],
          tooltipX + (CONTROL_SPACING.toolTip.paddingX / 2),
          tooltipY + (CONTROL_SPACING.toolTip.paddingY / 2) + 15 + (i * 20));
      }
    } else {
      // Single line tooltip - center vertically
      ctx.textBaseline = 'middle';
      ctx.fillText(this.toolTip,
        tooltipX + (CONTROL_SPACING.toolTip.paddingX / 2),
        tooltipY + (this.toolTipHeight / 2));
      ctx.textBaseline = 'alphabetic'; // Reset to default
    }
  }

  detectButtonClick() {
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
  }

  update() {
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
        ctx.fillStyle = mixTwoColours(UI_THEME.colours.primary, uiColourArray[2], 0.5);
      } else if (!this.available) {
        ctx.fillStyle = mixTwoColours(UI_THEME.colours.secondary, uiColourArray[2], 0.5);
      } else if (this.on) {
        ctx.fillStyle = mixTwoColours(UI_THEME.colours.primary, uiColourArray[2], 0.8);
      } else {
        ctx.fillStyle = mixTwoColours(UI_THEME.colours.primary, uiColourArray[2], 0.3);
      }
      ctx.fillRect(0, 0, this.width, this.height);
      // text
      ctx.globalAlpha = 1;
      if (this.highlighted) {
        ctx.fillStyle = uiColourArray[3];
      } else if (!this.available) {
        ctx.fillStyle = uiColourArray[2];
      } else {
        ctx.fillStyle = UI_THEME.colours.primary;
      }
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.width / 2, 18);
      ctx.textAlign = 'left'; // Reset to default
      ctx.restore();
    }
  }

  // Override BaseControl methods
  containsPoint(point) {
    if (!this.visible) return false;

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

    return point.x >= leftBound && point.x <= rightBound &&
      point.y >= this.y && point.y <= this.y + this.height;
  }

  handleMouseMove() {
    this.isHovered = this.containsPoint(pointerPos);
    this.highlighted = this.isHovered;
  }

  handleClick() {
    if (this.detectButtonClick()) {
      if (this.action) {
        this.action();
      }
      return true;
    }
    return false;
  }

  render(ctx) {
    this.update(); // Keep existing rendering logic for now
  }
}

/**
* Simple Label class for non-interactive text display
*/
class Label {
  constructor(x, y, text, colour, alignment = 'center') {
    this.x = x;
    this.y = y;
    this.align = alignment;
    this.visible = true;
    this.colour = colour;
    // Properties for positioning compatibility
    this.canvasYOffset = this.y;
    this.aboveCattery = false;
    // Use setText to set text and measure dimensions
    this.setText(text);
  }
  setText(text) {
    this.text = text;
    // Set font context before measuring
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    this.width = ctx.measureText(this.text).width;
  }
  update() {
    if (!this.visible) return;
    ctx.save();
    if (this.align == 'left') {
      ctx.translate(this.x, this.y);
    } else if (this.align == 'right') {
      ctx.translate(this.x - this.width, this.y);
    } else {
      ctx.translate(this.x - (this.width / 2), this.y);
    }
    // Just draw text, no background
    ctx.fillStyle = this.colour;
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.width / 2, 18);
    ctx.textAlign = 'left'; // Reset to default
    ctx.restore();
  }
  reinitPosition() {
    this.x = canvasWidth / 2;
    if (this.aboveCattery) {
      this.y = (trueBottom / 2) - ((CATBOX.size + CATBOX.padding) * 1.5) - (CATBOX.thickness / 2) + this.canvasYOffset;
    } else {
      this.y = (trueBottom / 2) + ((CATBOX.size + CATBOX.padding) * 1.5) + (CATBOX.thickness / 2) + this.canvasYOffset;
    }
  }
}

/**
* TopBarButton class for buttons that position in the top bar
*/
class TopBarButton extends Button {
  constructor(text, toolTip, topBarPosition) {
    super(0, UI_AREAS.topBar.y, text, toolTip, 'center', false, false);
    this.topBarPosition = topBarPosition;
  }
}

/**
* EditorButton class for editor-style buttons (dark grey with white borders)
*/
class EditorButton extends Button {
  constructor(x, y, text, toolTip, alignment = 'center') {
    super(x, y, text, toolTip, alignment, false, true);
  }
  update() {
    // box
    ctx.save();
    if (this.align == 'left') {
      ctx.translate(this.x, this.y);
    } else if (this.align == 'right') {
      ctx.translate(this.x - this.width, this.y);
    } else {
      ctx.translate(this.x - (this.width / 2), this.y);
    }
    if (this.visible) {
      ctx.globalAlpha = 1;
      if (this.highlighted) {
        ctx.fillStyle = UI_THEME.colours.highlight;
      } else if (!this.available) {
        ctx.fillStyle = UI_THEME.colours.unavailable;
      } else {
        ctx.fillStyle = UI_THEME.colours.background;
      }
      ctx.fillRect(0, 0, this.width, this.height);
      if (this.available) {
        ctx.lineWidth = UI_THEME.borders.medium;
        ctx.strokeStyle = UI_THEME.colours.border;
        ctx.strokeRect(UI_THEME.borders.medium, UI_THEME.borders.medium, this.width - (UI_THEME.borders.medium * 2), this.height - (UI_THEME.borders.medium * 2));
      }
      // text
      ctx.globalAlpha = 1;
      if (this.highlighted) {
        ctx.fillStyle = UI_THEME.colours.text.highlight;
      } else if (!this.available) {
        ctx.fillStyle = UI_THEME.colours.text.unavailable;
      } else {
        ctx.fillStyle = UI_THEME.colours.text.primary;
      }
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.width / 2, 18);
      ctx.textAlign = 'left'; // Reset to default
    }
    ctx.restore();

  }
}

/**
* AdoptionButton class for buttons on adoption centre/litter selection screens
*/
class AdoptionButton extends Button {
  constructor(x, y, text, toolTip, alignment = 'center') {
    super(x, y, text, toolTip, alignment, false);
    // for preserving position when the canvas resizes - all adoption buttons are canvas size dependent
    this.canvasYOffset = y;
    this.aboveCattery = false; // bool for placing above or below cattery
  }

  reinitPosition() {
    this.x = canvasWidth / 2;
    if (this.aboveCattery) {
      this.y = (trueBottom / 2) - ((CATBOX.size + CATBOX.padding) * 1.5) - (CATBOX.thickness / 2) + this.canvasYOffset;
    } else {
      this.y = (trueBottom / 2) + ((CATBOX.size + CATBOX.padding) * 1.5) + (CATBOX.thickness / 2) + this.canvasYOffset;
    }
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
      if (buttons[i].available && buttons[i].handleClick()) {
        clickedSomething = true;
      }
    }

    // Handle breed filter button clicks
    if (!clickedSomething) {
      for (let i = 0; i < breedFilterButtons.length; i++) {
        if (selectedBreedFilter !== breedFilterButtons[i].text && breedFilterButtons[i].detectButtonClick()) {
          clickedSomething = true;
          selectedBreedFilter = breedFilterButtons[i].text;
          // Regenerate cattery with new filter (keep buttons visible)
          if (!chosenChittenF || !chosenChittenM || !chosenChittenNB) {
            buttons[0].action(); // Regenerate cattery
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
    if (!chosenChittenM || !chosenChittenF || !chosenChittenNB) {
      buttons[1].available = false;
    }
  }
  if ((!chosenChittenF || !chosenChittenM || !chosenChittenNB || !chosenKitten) && selection !== null) {
    buttons[1].available = true;
  }
  // Picking up Chittens
  if (!paused && !geneEditing && !clickedSomething && !choosingChitten) {
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

  if (!paused && !geneEditing && !clickedSomething && !choosingChitten) {
    for (let i = 0; i < fruits.length && !clickedSomething; i++) {
      if (!fruits[i].fumbled && fruits[i].y < trueBottom && detectCollisionPointerObject(fruits[i])) {
        clickedSomething = true;
        fruits[i].fumbleFruit(0, 0);
      }
    }
  }

  if (!paused && !geneEditing && !clickedSomething && !choosingChitten) {
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
    unclickEditor();
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

  if (!hovered && geneEditing) {
    hovered = handleEditorMouseMove();
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

  // chittens hover label
  for (let i = 0; i < chittens.length && !hovered && !geneEditing; i++) {
    if (!chittens[i].inCatBox && chittens[i] !== experiment && detectCollisionPointerObject(chittens[i])) {
      hovered = true;
      let labelText = chittens[i].name;
      ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
      let genderSymbol = (chittens[i].sex == 'Female') ? unicodeFemale : (chittens[i].sex == 'Male') ? unicodeMale : unicodeNonBinary;
      let fullText = labelText + ' ' + genderSymbol;
      let textWidth = ctx.measureText(fullText).width;
      let shift = textWidth / 2;
      ctx.save();
      ctx.translate(chittens[i].x, chittens[i].y);
      ctx.globalAlpha = 1;
      // draw box
      ctx.fillStyle = mixTwoColours(uiColourArray[2], UI_THEME.colours.secondary, 0.5);
      ctx.fillRect(-shift - 10, - 40 - (chittens[i].size * 2.75), (shift * 2) + CONTROL_SPACING.button.padding, CONTROL_SPACING.button.padding);
      // draw label
      ctx.fillStyle = UI_THEME.colours.primary;
      ctx.fillText(fullText, -shift, - 25 - (chittens[i].size * 2.75));
      ctx.restore();
      if (!chittens[i].beingHeld) {
        updateCursor('grab');
        // hover indicator
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = mixTwoColours(uiColourArray[0], UI_THEME.colours.primary, 0.5);
        ctx.lineWidth = hoverIndicatorStroke;
        ctx.beginPath();
        ctx.arc(chittens[i].x, chittens[i].y, hoverIndicatorSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  if (!paused && !hovered && !geneEditing && !choosingChitten) {
    for (let i = 0; i < fruits.length && !hovered; i++) {
      if (!fruits[i].fumbled && fruits[i].y < trueBottom && detectCollisionPointerObject(fruits[i])) {
        hovered = true;
        updateCursor('grab');
      }
    }
  }
  if (!paused && !hovered && !geneEditing && !choosingChitten) {
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

function adoptionCentreUiOn(sex) {
  labels[0].visible = true;
  labels[1].setText(sex == 'Female' ? 'Choose a girl' : 'Choose a boy');
  labels[1].visible = true;
  buttons[0].visible = true;
  buttons[5].visible = true;
  // Show breed filter toggle button and create breed filter buttons
  buttons[13].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[11].visible = true;
  createBreedFilterButtons(sex);
}

function litterChoiceUiOn(fParentName, mParentName) {
  labels[3].setText('Choose one of ' + fParentName + ' and ' + mParentName + '\'s litter to keep');
  labels[3].visible = true;
  labels[2].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  buttons[2].visible = true;
  disableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
  disableButtons.forEach(i => buttons[i].available = false);
}

function updateChoiceTimer() {
  labels[2].setText("" + parseInt(choiceTimer / UPS));
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
      ctx.fillStyle = UI_THEME.colours.primary; // Reset to white
    } else if (text[i] === unicodeCross) {
      // Draw red cross
      ctx.fillStyle = crossColour;
      ctx.fillText(unicodeCross, currentX, y);
      currentX += ctx.measureText(unicodeCross).width;
      ctx.fillStyle = UI_THEME.colours.primary; // Reset to white
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
  ctx.font = `bold ${UI_THEME.fonts.sizes.bold14}px ${UI_THEME.fonts.primary}`;
  maxWidth = Math.max(maxWidth, ctx.measureText(chitten.name).width);

  ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
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
  maxWidth = Math.max(maxWidth, ctx.measureText('Sex: ' + chitten.sex).width);

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

  ctx.font = `bold ${UI_THEME.fonts.sizes.bold11}px ${UI_THEME.fonts.primary}`;
  maxWidth = Math.max(maxWidth, ctx.measureText('GENETICS').width);

  // Auto-generate genetics section from GENE_DATA
  let geneLines = [];
  ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;

  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    let geneSymbol = chitten[geneData.geneProp] ? unicodeTick : unicodeCross;
    let expressedSymbol = chitten[geneData.expressedProp] ? unicodeTick : unicodeCross;
    let lineText = `${geneData.tooltip}: ${geneSymbol} Expressed: ${expressedSymbol}`;

    geneLines.push(lineText);
    maxWidth = Math.max(maxWidth, ctx.measureText(lineText).width);
  }

  contentHeight = CHITTEN_TOOLTIP.padding + (lineHeight * (7 + geneLines.length)); // 7 basic lines + gene count + GENETICS spacing

  const tooltipWidth = maxWidth + CHITTEN_TOOLTIP.padding;
  const tooltipHeight = contentHeight;

  // Position tooltip near mouse
  let tooltipX, tooltipY;
  tooltipX = pointerPos.x + CHITTEN_TOOLTIP.marginX; // Offset from mouse
  tooltipY = pointerPos.y - (tooltipHeight / 2); // Above mouse
  // Keep tooltip on screen, and don't block held chittens
  if (tooltipX + tooltipWidth > canvasWidth) {
    tooltipX = pointerPos.x - CHITTEN_TOOLTIP.marginX - tooltipWidth;
  }
  if (tooltipY < 0) tooltipY = CHITTEN_TOOLTIP.marginY; // Below mouse if no room above
  if (tooltipX < 0) tooltipX = CHITTEN_TOOLTIP.marginX;
  if (tooltipY + tooltipHeight > canvasHeight) {
    tooltipY = canvasHeight - tooltipHeight - CHITTEN_TOOLTIP.marginY;
  }

  // Draw tooltip background with border
  ctx.fillStyle = UI_THEME.colours.secondary;
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
  ctx.strokeStyle = UI_THEME.colours.toolTipBorder;
  ctx.lineWidth = 1;
  ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  // Header with chitten name
  ctx.fillStyle = UI_THEME.colours.primary;
  ctx.font = `bold ${UI_THEME.fonts.sizes.bold14}px ${UI_THEME.fonts.primary}`;
  ctx.fillText(chitten.name, tooltipX + 10, tooltipY + 20);

  // Sex symbol in top right with color coding
  let sexSymbol = unicodeNonBinary;
  let sexColor = sexPurple;
  if (chitten.sex == 'Male') {
    sexSymbol = unicodeMale;
    sexColor = sexBlue;
  } else if (chitten.sex == 'Female') {
    sexSymbol = unicodeFemale;
    sexColor = sexPink;
  }

  ctx.fillStyle = sexColor;
  ctx.font = `bold ${UI_THEME.fonts.sizes.bold18}px ${UI_THEME.fonts.primary}`;
  let sexWidth = ctx.measureText(sexSymbol).width;
  ctx.fillText(sexSymbol, tooltipX + tooltipWidth - sexWidth - 10, tooltipY + 20);

  // Basic info with smaller font (moved up one line)
  ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
  ctx.fillStyle = UI_THEME.colours.primary;
  drawTextWithColoredSymbols('Breed: ' + bString, tooltipX + 10, tooltipY + 40);
  ctx.fillText('Age: ' + chitten.age, tooltipX + 10, tooltipY + 55);
  ctx.fillText('Coat: ' + cString, tooltipX + 10, tooltipY + 70);
  ctx.fillText('Eyes: ' + eString, tooltipX + 10, tooltipY + 85);
  ctx.fillText('Pattern: ' + pString, tooltipX + 10, tooltipY + 100);

  ctx.font = `bold ${UI_THEME.fonts.sizes.bold11}px ${UI_THEME.fonts.primary}`;
  ctx.fillText('GENETICS', tooltipX + 10, tooltipY + 125);

  ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;
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
  this.columns = CATBOX.columns;
  this.rows = CATBOX.rows;
  this.resize = function () {
    this.rows = Math.floor(boxes.length / this.columns);
    let halfColumns = this.columns / 2;
    let halfRows = this.rows / 2;
    let itemsAbove;
    let itemsBelow;
    let xOffset;
    let yOffset;
    if (!chosenKitten) {
      itemsAbove = 2;
      itemsBelow = 2;
      xOffset = CATBOX.size + CATBOX.padding + UI_AREAS.adoption.padding + CATBOX.thickness + UI_AREAS.adoption.padding;
      halfRows = boxes.length / 6;
    } else {
      itemsAbove = 2;
      itemsBelow = 4;
      xOffset = 0;
    }
    let yOffsetTop = (itemsAbove * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY));
    let yOffsetBelow = (itemsBelow * (CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY));
    this.x = (canvasWidth / 2) - ((CATBOX.size + CATBOX.padding) * halfColumns) + (CATBOX.thickness / 2) - (UI_AREAS.adoption.padding) - xOffset;
    this.y = trueBottom / 2 - ((CATBOX.columns * (CATBOX.size + CATBOX.padding)) / 2) - (UI_AREAS.adoption.padding) - yOffsetTop;
    this.width = CATBOX.rows * (CATBOX.size + CATBOX.padding) - CATBOX.thickness + (UI_AREAS.adoption.padding * 2) + (2 * xOffset);
    this.height = CATBOX.columns * (CATBOX.size + CATBOX.padding) - CATBOX.thickness + (UI_AREAS.adoption.padding * 2) + yOffsetTop + yOffsetBelow;
  }
  this.render = function () {
    ctx.globalAlpha = 1;
    ctx.fillStyle = UI_THEME.colours.adoptionCentreBG;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = UI_THEME.colours.border;
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
  this.colour = UI_THEME.colours.secondary;
  this.selectedColour;
  this.reinitPosition = function () {
    if (!this.parentBox && !this.editorBox) {
      this.x = (canvasWidth / 2) - (((CATBOX.size * 3) + (CATBOX.padding * 2)) / 2) + (this.column * CATBOX.padding) + (this.column * CATBOX.size);
      this.y = trueBottom / 2 - ((CATBOX.columns * (CATBOX.size + CATBOX.padding)) / 2) + (this.row * CATBOX.padding) + (this.row * CATBOX.size);
    } else if (this.parentBox) {
      this.y = trueBottom / 2 - ((CATBOX.columns * (CATBOX.size + CATBOX.padding)) / 2) - (CATBOX.size / 3);
      if (this.column == 1) {
        this.x = (canvasWidth / 2) - (CATBOX.size * 3);
      } else if (this.column == 2) {
        this.x = (canvasWidth / 2) + (CATBOX.size * 2);
      } else console.warn('CatBox reinit sent a bad column');
    } else if (this.editorBox) {
      this.x = CONTROL_SPACING.editorPreview.x;
      this.y = CONTROL_SPACING.editorPreview.y - CONTROL_SPACING.editor.noLabelOffsetY;
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
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.fillStyle = UI_THEME.colours.primary;
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
        this.selectedColour = mixTwoColours(this.colour, UI_THEME.colours.primary, 0.5);
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

function confirmAdoption() {
  // Case 1: Adopt selected chitten (adoption center) / Keep selected kitten (litter choice)
  // choosing a chitten from the adoption centre
  if (selection !== null) {
    // Common variables for both adoption center and litter choice
    let hideButtons, hideLabels, message;

    if (!chosenChittenF || !chosenChittenM || !chosenChittenNB) {
      // Adoption center logic
      if (!chosenChittenF) {
        chosenChittenF = true;
      } else if (!chosenChittenM) {
        chosenChittenM = true;
      } else {
        chosenChittenNB = true;
      }
      removeTemporaryChittens(true);
      message = selection.name + ' was adopted';
      hideButtons = [0, 1, 2, 11, 13];
      hideLabels = [0, 1];
      resetBreedFilter();
    } else if (!chosenKitten) {
      // Litter choice logic
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
      if (!selection || !selection.name) {
        console.warn('Selection became undefined during litter processing');
      }
      message = selection.name + ' joined the family';
      hideButtons = [0, 1, 2];
      hideLabels = [2, 3];
      if (selection) {
        selection.inCatBox = null;
      }
    }
    // Common adoption handling
    choosingChitten = false;
    sendMessage(message);
    adoptChitten(selection);
    recalculateChittenNumbers();
    boxes = [];
    enableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
    hideButtons.forEach(i => buttons[i].visible = false);
    hideLabels.forEach(i => labels[i].visible = false);
    enableButtons.forEach(i => buttons[i].available = true);
    selection = null;
  }
}

function rehomeLitter() {
  // Rehome entire litter
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
  hideLabels = [2, 3];
  enableButtons = [3, 4, 5, 8, 9, 10, 14, 15];
  hideButtons.forEach(i => buttons[i].visible = false);
  hideLabels.forEach(i => labels[i].visible = false);
  enableButtons.forEach(i => buttons[i].available = true);
  selection = null;
  choosingChitten = false;

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