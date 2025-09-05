// gene editing
geneEditing = false;
sliderIndex = 0;
colourBars = null; // Will be initialized in startGame()
colourPicker = null; // Will be initialized in startGame()
editorButtons = []; // Editor save/close buttons
const editorColourBitDepth = 32; // how many bits the colour pipcker uses
const nameCharacterLimit = 20;

function openEditor() {
  if (devMode) {
    if (!geneEditing) {
      if (selection !== null) {
        cloneChitten(copyChitten(selection), experiment);
        reinitEditor();
      }
      geneEditing = true;
      const showGeneButtons = [6, 7];
      disableMainButtons = [5, 9, 10];
      showGeneButtons.forEach(i => buttons[i].visible = true);
      disableMainButtons.forEach(i => buttons[i].available = false);
      buttons[8].setToolTip('Close the genetic editor')
    } else closeEditor();
  }
}

function closeEditor() {
  // Exit gene editing mode (dev mode)
  geneEditing = false;
  hideGeneButtons = [6, 7];
  enableMainButtons = [5, 8, 9, 10];
  hideGeneButtons.forEach(i => buttons[i].visible = false);
  enableMainButtons.forEach(i => buttons[i].available = true);
  buttons[8].setToolTip('Open the genetic editor');
}

// Redesigned editor layout
const EDITOR_GROUPS = [
  {
    title: "Physical Traits",
    column: 1,
    y: CONTROL_SPACING.editor.startY, spacing: 30,
    properties: [
      { prop: 'size', type: 'slider', min: 5, max: 20, label: 'Size' },
      { prop: 'maxSize', type: 'slider', min: 5, max: 20, label: 'Max Size' },
      { prop: 'thickness', type: 'slider', min: 0, max: 1, label: 'Thickness' },
      { prop: 'legLength', type: 'slider', min: 0, max: 1, label: 'leg Length' },
      { prop: 'coordination', type: 'slider', min: 0, max: 1, label: 'Coordination' },
      { prop: 'tailLength', type: 'slider', min: 0, max: 1, label: 'Tail Length' }
    ]
  },
  {
    title: "Head Features",
    column: 1,
    spacing: 30,
    properties: [
      { prop: 'headWidth', type: 'slider', min: 0, max: 1, label: 'Head Width' },
      { prop: 'headHeight', type: 'slider', min: 0, max: 1, label: 'Head Height' },
      { prop: 'earWidth', type: 'slider', min: 0, max: 1, label: 'Ear Width' },
      { prop: 'earHeight', type: 'slider', min: 0, max: 1, label: 'Ear Height' },
      { prop: 'eyeSize', type: 'slider', min: 0, max: 1, label: 'Eye Size' },
      { prop: 'eyePosX', type: 'slider', min: 0, max: 1, label: 'Eye Width' },
      { prop: 'eyePosY', type: 'slider', min: 0, max: 1, label: 'Eye Height' },
      { prop: 'nosePos', type: 'slider', min: 0, max: 1, label: 'Nose Height' },
      { prop: 'fangs', type: 'slider', min: 0, max: 1, label: 'Fang Size' },
      { prop: 'mawSize', type: 'slider', min: 0, max: 1, label: 'Maw Size' }
    ]
  },
  {
    title: "Coat & Pattern",
    column: 2,
    y: CONTROL_SPACING.editor.startY, spacing: 30,
    properties: [
      { prop: 'pattern', type: 'pattern', label: 'Pattern Type' },
      { prop: 'patternAlpha', type: 'slider', min: 0, max: 1, label: 'Pattern Opacity' },
      { prop: 'coatMod[4]', type: 'slider', min: 0, max: 1, label: 'Pattern Shift X' },
      { prop: 'coatMod[5]', type: 'slider', min: 0, max: 1, label: 'Pattern Shift Y' },
      { prop: 'coatMod[2]', type: 'slider', min: 0, max: 1, label: 'Pattern Angle' },
      { prop: 'coatMod[3]', type: 'slider', min: 0, max: 1, label: 'Coat Gradient' },
      { prop: 'coatMod[0]', type: 'slider', min: 0, max: 1, label: 'Gradient Bias' },
      { prop: 'coatMod[1]', type: 'slider', min: 0, max: 1, label: 'Gradient Strength' }
    ]
  },
  {
    title: "Body Part Colors",
    column: 2,
    spacing: 30,
    properties: [
      { prop: 'bodypartCode[2]', type: 'bodypart', label: 'Head' },
      { prop: 'bodypartCode[3]', type: 'bodypart', label: 'L Ear' },
      { prop: 'bodypartCode[4]', type: 'bodypart', label: 'R Ear' },
      { prop: 'bodypartCode[5]', type: 'bodypart', label: 'Body' },
      { prop: 'bodypartCode[6]', type: 'bodypart', label: 'Tail' },
      { prop: 'bodypartCode[0]', type: 'bodypart', label: 'L Front Foot' },
      { prop: 'bodypartCode[1]', type: 'bodypart', label: 'R Front Foot' },
      { prop: 'bodypartCode[7]', type: 'bodypart', label: 'L Back Foot' },
      { prop: 'bodypartCode[8]', type: 'bodypart', label: 'R Back Foot' },
      { prop: 'bodypartCode[9]', type: 'bodypart', label: 'L Jowl' },
      { prop: 'bodypartCode[10]', type: 'bodypart', label: 'R Jowl' },
      { prop: 'bodypartCode[11]', type: 'bodypart', label: 'Chin' },
      { prop: 'bodypartCode[12]', type: 'bodypart', label: 'Chest' }
    ]
  },
  {
    title: "Templates & Info",
    column: 4,
    y: CONTROL_SPACING.editor.startY, spacing: 30,
    properties: [
      { prop: 'breedTemplate', type: 'breed', label: 'All' },
      { type: 'rerollButton', label: 'Reroll Chitten' },
      { prop: 'sex', type: 'sex', label: 'Sex' },
      { prop: 'name', type: 'text', label: 'Name' },
      { prop: 'age', type: 'slider', min: 0, max: maxMaxAge, label: 'Age' },
      { prop: 'maxAge', type: 'slider', min: minMaxAge, max: maxMaxAge, label: 'Max Age' }
    ]
  },
  {
    title: '',
    column: 0,
    x: CONTROL_SPACING.editorPreview.x, y: CONTROL_SPACING.editorPreview.y + CONTROL_SPACING.editorPreview.Size + CONTROL_SPACING.editor.colourSystemMarginX, spacing: CONTROL_SPACING.editor.colourSystemMarginX,
    properties: [
      { type: 'colourPicker' },
      { type: 'colourBar' }
    ]
  },
  {
    title: "Genetics",
    column: 3,
    spacing: 30,
    properties: [] // Will be populated dynamically from GENE_DATA
  }
];

function initGeneEditing() {
  // Initialize spliceBox
  spliceBox = new CatBox(false, true, 0, 0, CONTROL_SPACING.editorPreview.size, CONTROL_SPACING.editorPreview.thickness);

  // gene editing
  experiment = new Chitten(spliceBox.x + (CONTROL_SPACING.editorPreview.size / 2), spliceBox.y + (CONTROL_SPACING.editorPreview.size / 2), chittenBaseSize, chittenMaxSize, 'Female');
  experiment.name = 'Subject X';
  randomiseGeneticsBase(experiment, true, null)
  experiment.awake = true;
  experiment.onSurface = true;
  experiment.recalculateSizes();
  experiment.recalculateColours(true);
  initGeneticsEditorProperties();
  initEditor();
}

/**
* Populate genetics properties from GENE_DATA
*/
function initGeneticsEditorProperties() {
  // Find the genetics group
  const geneticsGroup = EDITOR_GROUPS.find(group => group.title === "Genetics");
  if (!geneticsGroup) return;

  // Clear existing properties
  geneticsGroup.properties = [];

  // Add properties for each gene from GENE_DATA
  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    // Add the expression property first (what the user sees)
    geneticsGroup.properties.push({
      prop: geneData.expressedProp,
      type: 'boolean',
      label: geneData.name
    });

    // Add the gene property (for debugging)
    geneticsGroup.properties.push({
      prop: geneData.geneProp,
      type: 'boolean',
      label: geneData.tooltip
    });
  }
}

/**
* Auto-generate editor controls from configuration
*/
function initEditor() {
  sliders = [];
  booleanToggles = [];
  patternSelector = null;
  breedSelector = null;
  rerollButton = null;
  sexSelector = null;
  textInputs = [];
  colourBars = null;
  colourPicker = null;
  let controlIndex = 0;
  // Track Y position for each column
  const columnYPositions = {};

  EDITOR_GROUPS.forEach(group => {
    // Calculate dynamic x position based on column property
    if (group.column !== undefined && group.column > 0) {
      group.x = CONTROL_SPACING.editor.columnStartX + CONTROL_SPACING.editor.columnWidth * (group.column - 1);

      // Calculate dynamic Y position based on what's already in this column
      if (!columnYPositions[group.column]) {
        // First group in this column
        columnYPositions[group.column] = CONTROL_SPACING.editor.startY;
      }

      group.y = columnYPositions[group.column];

      // Calculate height needed for this group
      let groupHeight = CONTROL_SPACING.editor.titleHeight; // Space for title
      group.properties.forEach(propDef => {
        switch (propDef.type) {
          case 'slider':
          case 'bodypart':
            groupHeight += (CONTROL_SPACING.editor.sliderMargin + UI_THEME.controls.slider.height);
            break;
          case 'pattern':
          case 'breed':
            groupHeight += CONTROL_SPACING.editor.dropdownHeight;
            break;
          case 'text':
            groupHeight += CONTROL_SPACING.editor.textboxHeight;
            break;
          default:
            groupHeight += (CONTROL_SPACING.editor.sliderMargin + UI_THEME.controls.slider.height); // Default fallback
            break;
        }
      });

      // Update column Y position for next group
      columnYPositions[group.column] += groupHeight + CONTROL_SPACING.editor.groupSpacing;
    }

    let currentY = group.y;

    // Draw group title
    group.titleY = currentY - CONTROL_SPACING.editor.titleHeight;

    // Adjust starting position for genetics section to reduce gap
    if (group.title === "Genetics") {
      currentY += CONTROL_SPACING.editor.noLabelOffsetY;
    }

    group.properties.forEach(propDef => {
      const control = createControl(propDef, group.x, currentY, controlIndex);

      switch (propDef.type) {
        case 'slider':
        case 'bodypart':
          sliders.push(control);
          break;
        case 'boolean':
          booleanToggles.push(control);
          break;
        case 'pattern':
          patternSelector = control;
          break;
        case 'text':
          textInputs.push(control);
          break;
        case 'breed':
          breedSelector = control;
          break;
        case 'rerollButton':
          rerollButton = control;
          // Initialize reroll button with default breed selection
          if (breedSelector) {
            rerollButton.selectedBreed = breedSelector.selectedBreed;
          }
          break;
        case 'sex':
          sexSelector = control;
          break;
        case 'colourPicker':
          colourPicker = control;
          break;
        case 'colourBar':
          colourBars = control;
          break;
      }

      // Use appropriate spacing based on control type
      switch (propDef.type) {
        case 'slider':
        case 'bodypart':
          currentY += (CONTROL_SPACING.editor.sliderMargin + UI_THEME.controls.slider.height);
          break;
        case 'pattern':
          currentY += CONTROL_SPACING.editor.dropdownHeight;
          break;
        case 'breed':
          currentY += CONTROL_SPACING.editor.dropdownHeight + CONTROL_SPACING.editor.noLabelOffsetY;
          break;
        case 'rerollButton': case 'sex':
          // Use smaller spacing for reroll button in Templates & Info group to bring it closer to breed selector
          if (group.title === "Templates & Info") {
            currentY += CONTROL_SPACING.editor.dropdownHeight;
          } else {
            currentY += CONTROL_SPACING.editor.dropdownHeight;
          }
          break;
        case 'text':
          currentY += CONTROL_SPACING.editor.textboxHeight;
          break;
        case 'boolean':
          currentY += (CONTROL_SPACING.editor.sliderMargin + UI_THEME.controls.boolean.height);
          break;
        case 'colourPicker':
        case 'colourBar':
          currentY += group.spacing; // These use custom spacing from the group
          break;
        default:
          currentY += CONTROL_SPACING.editor.sliderHeight; // Default fallback
          break;
      }

      controlIndex++;
    });
  });
  // Center the buttons in the middle of the available width
  const centerX = CONTROL_SPACING.editorPreview.x + (CONTROL_SPACING.editor.colourSystemWidth / 2);
  buttons[6].x = centerX - (buttons[7].width / 2) + (buttons[7].width / 2);
  buttons[6].y = colourBars.y + colourBars.colourHeight + CONTROL_SPACING.editor.colourSystemMarginY + 10;
  buttons[7].x = CONTROL_SPACING.editorPreview.x + (CONTROL_SPACING.editor.colourSystemWidth / 2);
  buttons[7].y = buttons[6].y + CONTROL_SPACING.button.height + CONTROL_SPACING.button.marginY;
}

/**
* Create a control based on property definition
*/
function createControl(propDef, x, y, index) {
  const value = propDef.prop ? getPropertyValue(experiment, propDef.prop) : undefined;

  switch (propDef.type) {
    case 'slider':
      // Special case for age slider - use chitten's maxAge as upper limit
      if (propDef.prop === 'age') {
        return new Slider(propDef.min, experiment.maxAge, value, x, y, propDef.label, propDef.prop, index);
      }
      return new Slider(propDef.min, propDef.max, value, x, y, propDef.label, propDef.prop, index);

    case 'bodypart':
      return new Slider(0, 2, value, x, y, propDef.label, propDef.prop, index);

    case 'colourPicker':
      return new ColourPicker();

    case 'colourBar':
      return new ColourBar();

    case 'boolean':
      return new BooleanToggle(x, y, propDef.label, propDef.prop, value);

    case 'pattern':
      return new PatternSelector(x, y, propDef.label, value);

    case 'text':
      return new TextInput(x, y, propDef.label, propDef.prop, value, propDef.type);

    case 'breed':
      return new BreedSelector(x, y, propDef.label);

    case 'rerollButton':
      return new RerollButton(x, y, propDef.label);

    case 'sex':
      return new SexSelector(x, y, propDef.label, value);
  }
}

/**
* Get property value from object using dot notation or array notation
*/
function getPropertyValue(obj, propPath) {
  if (propPath.includes('[')) {
    // Handle array properties like 'bodypartCode[0]'
    const [arrayName, indexStr] = propPath.split('[');
    const index = parseInt(indexStr.replace(']', ''));
    return obj[arrayName][index];
  } else if (propPath.includes('.')) {
    // Handle nested properties
    return propPath.split('.').reduce((o, p) => o && o[p], obj);
  } else {
    return obj[propPath];
  }
}

/**
* Set property value on object using dot notation or array notation  
*/
function setPropertyValue(obj, propPath, value) {
  if (propPath.includes('[')) {
    // Handle array properties like 'bodypartCode[0]'
    const [arrayName, indexStr] = propPath.split('[');
    const index = parseInt(indexStr.replace(']', ''));
    obj[arrayName][index] = value;
  } else if (propPath.includes('.')) {
    // Handle nested properties
    const props = propPath.split('.');
    const lastProp = props.pop();
    const target = props.reduce((o, p) => o[p], obj);
    target[lastProp] = value;
  } else {
    obj[propPath] = value;
  }
}

/**
* Update all controls with current experiment values
*/
function reinitEditor() {
  // First ensure genetics properties are up to date
  initGeneticsEditorProperties();

  // Update sliders
  sliders.forEach(slider => {
    if (slider.property) {
      slider.currentPos = getPropertyValue(experiment, slider.property);
    }
  });


  // Update boolean toggles
  if (booleanToggles) {
    booleanToggles.forEach(toggle => {
      if (toggle.property) {
        toggle.value = getPropertyValue(experiment, toggle.property);
      }
    });
  }

  // Update pattern selector
  if (patternSelector) {
    patternSelector.selectedPattern = experiment.pattern;
  }

  // Update text inputs
  if (textInputs) {
    textInputs.forEach(input => {
      if (input.property) {
        input.value = getPropertyValue(experiment, input.property);
      }
    });
  }
}

/**
* Slider control that extends BaseControl
*/
class Slider extends BaseControl {
  constructor(lowerLimit, upperLimit, currentPos, x, y, txt, property, index) {
    super(x, y, UI_THEME.controls.slider.width, UI_THEME.controls.slider.height, txt);

    this.id = index;
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
    this.currentPos = currentPos;
    this.relativePosition = 0;
    this.proportion = 1;
    this.text = txt;
    this.property = property; // Property path like 'thickness' or 'bodypartCode[0]'
    this.sThumb = new SliderThumb(this);
  }

  handleMouseMove() {
    // Check if hovering over the slider track itself (not the value box)
    this.isHovered = (pointerPos.x >= this.x && pointerPos.x <= this.x + this.width &&
      pointerPos.y >= this.y - 10 && pointerPos.y <= this.y + 10);
  }

  update() {
    // Calculate proportion based on actual slider width
    this.proportion = this.width / (Math.abs(this.upperLimit - this.lowerLimit));
    this.relativePosition = this.proportion * (this.currentPos - this.lowerLimit);

    // Draw slider track
    ctx.lineWidth = UI_THEME.borders.medium;
    ctx.strokeStyle = UI_THEME.colours.secondary;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.stroke();

    // Draw label
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.text, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw value box for all sliders
    const valueBoxX = this.x + this.width + UI_THEME.controls.slider.valueBox.margin;
    const valueBoxSizeX = UI_THEME.controls.slider.valueBox.width;
    const valueBoxSizeY = UI_THEME.controls.slider.valueBox.height;

    // Draw value box background with hover effect
    ctx.fillStyle = this.isHovered ? UI_THEME.colours.highlight : UI_THEME.colours.background;
    ctx.fillRect(valueBoxX, this.y - valueBoxSizeY / 2, valueBoxSizeX, valueBoxSizeY);

    // Draw value box border
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(valueBoxX, this.y - valueBoxSizeY / 2, valueBoxSizeX, valueBoxSizeY);

    // Draw value text
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    const valueText = this.currentPos.toFixed(2);
    const textWidth = ctx.measureText(valueText).width;
    ctx.fillText(valueText, valueBoxX + (valueBoxSizeX - textWidth) / 2, this.y + 3);

    this.sThumb.update();
  }

  render(ctx) {
    this.update();
  }
}

/**
* SliderThumb control that extends BaseControl
*/
class SliderThumb extends BaseControl {
  constructor(parent) {
    const size = Math.max(8, parent.height * 0.4); // Dynamic thumb size based on slider height
    const thumbWidth = Math.max(4, size * 0.4);
    super(parent.x, parent.y, thumbWidth, size, '');

    this.parent = parent;
    this.dragged = false;
    this.colour = UI_THEME.colours.primary;
    this.size = size;
  }

  update() {
    if (this.dragged) {
      let correctMouseX = pointerPos.x;
      // Constrain to slider bounds
      if (correctMouseX < this.parent.x) {
        correctMouseX = this.parent.x;
      } else if (correctMouseX > this.parent.x + this.parent.width) {
        correctMouseX = this.parent.x + this.parent.width;
      }

      let score = (correctMouseX - this.parent.x);
      this.parent.currentPos = (score / this.parent.proportion) + this.parent.lowerLimit;
      this.x = correctMouseX;

      // Update the experiment property using the property path
      if (this.parent.property) {
        let value = this.parent.currentPos;

        // Round integer values for bodypart codes and patterns
        if (this.parent.property.includes('bodypartCode') || this.parent.property === 'pattern') {
          value = Math.round(value);
        }

        setPropertyValue(experiment, this.parent.property, value);

        // Round bodypart sliders to whole numbers (0, 1, 2)
        if (this.parent.property && this.parent.property.includes('bodypartCode')) {
          this.parent.currentPos = Math.round(this.parent.currentPos);
          setPropertyValue(experiment, this.parent.property, Math.round(value));
        }
        // Handle maxAge slider - update age slider's upper limit and constrain age if needed
        if (this.parent.property === 'maxAge') {
          // Find the age slider and update its upper limit
          const ageSlider = sliders.find(slider => slider.property === 'age');
          if (ageSlider) {
            ageSlider.upperLimit = value;
            // If current age exceeds new max age, reduce it
            if (ageSlider.currentPos > value) {
              ageSlider.currentPos = value;
              setPropertyValue(experiment, 'age', value);
            }
          }
        }
        // Handle maxSize slider - update size slider's upper limit and constrain age if needed
        if (this.parent.property === 'maxSize') {
          // Find the age slider and update its upper limit
          const sizeSlider = sliders.find(slider => slider.property === 'size');
          if (sizeSlider) {
            sizeSlider.upperLimit = value;
            // If current age exceeds new max age, reduce it
            if (sizeSlider.currentPos > value) {
              sizeSlider.currentPos = value;
              setPropertyValue(experiment, 'size', value);
            }
          }
        }
        experiment.recalculateSizes();
        experiment.recalculateColours(true);
      }
    } else {
      this.x = this.parent.x + this.parent.relativePosition;
    }
    // Draw thumb with dynamic sizing
    ctx.fillStyle = this.colour;
    const thumbWidth = Math.max(4, this.size * 0.4);
    const thumbHeight = this.size;
    ctx.fillRect(this.x - thumbWidth / 2, this.y - thumbHeight / 2, thumbWidth, thumbHeight);
  }

  render(ctx) {
    this.update();
  }
}

/**
* Render group titles and main editor title
*/
function renderGroupTitles() {
  // Main editor title
  ctx.fillStyle = UI_THEME.colours.text.primary;
  ctx.font = `bold ${UI_THEME.fonts.sizes.bold18}px ${UI_THEME.fonts.primary}`;
  ctx.fillText('Genetic Editor', CONTROL_SPACING.editorPreview.x, CONTROL_SPACING.editorPreview.y);

  // Group titles
  ctx.fillStyle = UI_THEME.colours.text.primary;
  ctx.font = `bold ${UI_THEME.fonts.sizes.bold14}px ${UI_THEME.fonts.primary}`;

  EDITOR_GROUPS.forEach(group => {
    if (group.titleY) {
      ctx.fillText(group.title, group.x, group.titleY);
    }
  });
}

/**
* Base dropdown functionality shared by PatternSelector and BreedSelector
*/
class BaseDropdown extends BaseControl {
  constructor(x, y, label, options, selectedValue, width, height) {
    super(x, y, width, height, label);

    this.options = options; // Array of {value, label} or just strings
    this.selectedValue = selectedValue;
    this.open = false;
    this.hoveredIndex = -1;

    // Calculate dropdown width based on longest option
    this.dropdownWidth = this.width;
    if (this.options.length > 0) {
      ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
      let maxWidth = this.width;
      this.options.forEach(option => {
        const optionLabel = typeof option === 'string' ? option : option.label;
        const textWidth = ctx.measureText(optionLabel).width + 10;
        if (textWidth > maxWidth) maxWidth = textWidth;
      });
      this.dropdownWidth = maxWidth;
    }
  }

  update() {
    // Update hover state based on current mouse position
    if (this.open && pointerPos) {
      this.handleMouseMove();
    }

    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw dropdown box with hover effect
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.isHovered ? UI_THEME.colours.highlight : UI_THEME.colours.background;
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Show selected option or default text
    ctx.fillStyle = UI_THEME.colours.text.primary;
    const displayText = this.getDisplayText();
    ctx.fillText(displayText, this.x + 5, this.y + 18);

    // Draw dropdown indicator
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.fillText(unicodeDropdown, this.x + this.width - 15, this.y + 18);
  }

  getDisplayText() {
    if (this.selectedValue != null) {
      const selectedOption = this.options.find(opt =>
        (typeof opt === 'string' ? opt : opt.value) === this.selectedValue
      );
      if (selectedOption) {
        return typeof selectedOption === 'string' ? selectedOption : selectedOption.label;
      }
    }
    return this.getDefaultText();
  }

  getDefaultText() {
    return 'Select...'; // Override in subclasses
  }

  renderDropdown() {
    if (this.open) {
      this.options.forEach((option, index) => {
        const optionY = this.y + this.height + (index * this.height);
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;

        // Determine background color based on state
        let bgColor = UI_THEME.colours.background;
        if (optionValue === this.selectedValue) {
          bgColor = UI_THEME.colours.selected;
        } else if (index === this.hoveredIndex) {
          bgColor = UI_THEME.colours.highlight;
        }

        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, optionY, this.dropdownWidth, this.height);
        ctx.strokeStyle = UI_THEME.colours.border;
        ctx.strokeRect(this.x, optionY, this.dropdownWidth, this.height);
        ctx.fillStyle = UI_THEME.colours.text.primary;
        ctx.fillText(optionLabel, this.x + 5, optionY + 18);
      });
    }
  }

  handleMouseMove() {
    // Update base hover state
    this.isHovered = this.containsPoint(pointerPos);

    if (!this.open) {
      this.hoveredIndex = -1;
      return;
    }

    this.hoveredIndex = -1; // Reset hover index

    // Check if mouse is over dropdown area
    if (pointerPos.x >= this.x && pointerPos.x <= this.x + this.dropdownWidth) {
      this.options.forEach((option, index) => {
        const optionY = this.y + this.height + (index * this.height);
        if (pointerPos.y >= optionY && pointerPos.y <= optionY + this.height) {
          this.hoveredIndex = index;
        }
      });
    }
  }

  handleClick() {
    // Check main button click using BaseControl's containsPoint
    if (this.containsPoint(pointerPos)) {
      this.open = !this.open;
      return true;
    }

    // Check dropdown options if open
    if (this.open && pointerPos.x >= this.x && pointerPos.x <= this.x + this.dropdownWidth) {
      this.options.forEach((option, index) => {
        const optionY = this.y + this.height + (index * this.height);
        if (pointerPos.y >= optionY && pointerPos.y <= optionY + this.height) {
          const optionValue = typeof option === 'string' ? option : option.value;
          this.selectedValue = optionValue;
          this.onSelection(optionValue);
          this.open = false;
        }
      });
      return true; // Always return true if clicking in dropdown area when open
    }

    // Close dropdown if clicked elsewhere
    if (this.open) {
      this.open = false;
    }

    return false;
  }

  onSelection(value) {
    // Override in subclasses
  }

  // Override BaseControl render method
  render(ctx) {
    this.update();
    this.renderDropdown();
  }
}

/**
* BooleanToggle control for boolean properties
*/
class BooleanToggle extends BaseControl {
  constructor(x, y, label, property, value) {
    super(x, y, UI_THEME.controls.boolean.width, UI_THEME.controls.boolean.height, label);
    this.property = property;
    this.value = value;
  }

  update() {
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x + 25, this.y + 15);
    ctx.globalAlpha = 1;

    // Draw checkbox
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (this.value) {
      ctx.fillStyle = UI_THEME.colours.primary;
      ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    } else if (this.isHovered) {
      // Show highlight background for empty checkboxes when hovered
      ctx.fillStyle = UI_THEME.colours.highlight;
      ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    }
  }

  handleClick() {
    if (this.containsPoint(pointerPos)) {
      this.value = !this.value;
      setPropertyValue(experiment, this.property, this.value);
      experiment.recalculateSizes();
      experiment.recalculateColours(true);
      return true;
    }
    return false;
  }

  render(ctx) {
    this.update();
  }
}

/**
* PatternSelector control for pattern selection
*/
class PatternSelector extends BaseDropdown {
  constructor(x, y, label, selectedPattern) {
    super(x, y, label, validPatterns, selectedPattern,
      UI_THEME.controls.dropdown.width, UI_THEME.controls.dropdown.height);

    // Ensure we have the selectedPattern property for backwards compatibility
    this.selectedPattern = selectedPattern;
  }

  getDefaultText() {
    return 'Select Pattern';
  }

  onSelection(value) {
    this.selectedPattern = value;
    setPropertyValue(experiment, 'pattern', value);
    experiment.recalculateSizes();
    experiment.recalculateColours(true);
  }
}

/**
* TextInput control for text properties
*/
class TextInput extends BaseControl {
  constructor(x, y, label, property, value, inputType) {
    super(x, y, UI_THEME.controls.textInput.width, UI_THEME.controls.textInput.height, label);

    this.property = property;
    this.value = value || '';
    this.inputType = inputType;
    this.active = false;
  }

  refreshName() {
    // Empty function for compatibility
  }

  update() {
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw input box with hover effect
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.isHovered || this.active ? UI_THEME.colours.highlight : UI_THEME.colours.background;
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Show value
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.fillText(this.value, this.x + 5, this.y + 18);
  }

  handleClick() {
    if (this.containsPoint(pointerPos)) {
      // Deactivate all other text inputs
      if (textInputs) {
        textInputs.forEach(input => input.active = false);
      }
      this.active = true;
      return true;
    } else {
      this.active = false;
    }
    return false;
  }

  handleKeyInput(key) {
    if (!this.active) return false;

    if (key === 'Backspace') {
      this.value = this.value.slice(0, -1);
    } else if (key === 'Enter') {
      this.active = false;
      // Update the experiment property
      if (this.property) {
        setPropertyValue(experiment, this.property, this.value);
      }
    } else if (key.length === 1 && this.value.length < nameCharacterLimit) {
      // Only add printable characters, limit to 20 characters
      this.value += key;
    }

    // Update the experiment property in real-time for name
    if (this.property === 'name') {
      setPropertyValue(experiment, this.property, this.value);
    }

    return true;
  }

  render(ctx) {
    this.update();
  }
}

/**
* BreedSelector control for applying breed templates
*/
class BreedSelector extends BaseDropdown {
  constructor(x, y, label) {
    const breeds = ['All', 'Mixed'].concat(Object.keys(BREED_DATA).sort()); // Add filters at top
    super(x, y, label, breeds, 'All', UI_THEME.controls.dropdown.width, UI_THEME.controls.dropdown.height);

    this.breeds = breeds; // Backwards compatibility
    this.selectedBreed = 'All'; // Track selected breed for highlighting - default to 'All'
  }

  getDefaultText() {
    return 'All';
  }

  onSelection(value) {
    this.selectedBreed = value;
    if (value === 'All' || value === 'Mixed') {
      // Generate random chitten for 'All' or 'Mixed'
      randomiseGeneticsBase(experiment, true, null);
      // Update reroll button 
      if (rerollButton) {
        rerollButton.selectedBreed = value;
      }
    } else {
      // Apply the selected breed to the experiment chitten
      applyBreed(experiment, value);
      // Update reroll button with selected breed
      if (rerollButton) {
        rerollButton.selectedBreed = value;
      }
    }
    experiment.recalculateSizes();
    experiment.recalculateColours(true);
    experiment.name = generateBreedBasedName(experiment.breed, experiment.breed, experiment.sex);

    // Update name textbox directly
    if (textInputs) {
      const nameInput = textInputs.find(input => input.property === 'name');
      if (nameInput) {
        nameInput.value = experiment.name;
        nameInput.active = false; // Deactivate if it was active
      }
    }
    // Update all controls with new values
    reinitEditor();
  }
}

/**
* RerollButton control for generating new chittens
*/
class RerollButton extends BaseControl {
  constructor(x, y, label) {
    super(x, y, UI_THEME.controls.dropdown.width, UI_THEME.controls.dropdown.height, label);

    this.selectedBreed = null; // Track the currently selected breed
  }

  update() {
    // Draw button
    ctx.lineWidth = UI_THEME.borders.medium;
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.isHovered ? UI_THEME.colours.highlight : UI_THEME.colours.background;
    ctx.fillRect(this.x + UI_THEME.borders.medium, this.y + UI_THEME.borders.medium, this.width - (UI_THEME.borders.medium * 2), this.height - (UI_THEME.borders.medium * 2));

    // Show button text
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    const textWidth = ctx.measureText(this.label).width;
    ctx.fillText(this.label, this.x + (this.width - textWidth) / 2, this.y + 18);
  }

  handleMouseMove() {
    this.isHovered = this.containsPoint(pointerPos);
  }

  handleClick() {
    if (this.containsPoint(pointerPos)) {

      // Check if a breed is currently selected
      if (this.selectedBreed) {
        if (this.selectedBreed === 'All' || this.selectedBreed === 'Mixed') {
          // Generate random chitten for 'All' or 'Mixed'
          randomiseGeneticsBase(experiment, true, null);
        } else {
          // Generate a new chitten of the selected breed
          applyBreed(experiment, this.selectedBreed);
        }
      } else {
        // Generate a completely random chitten
        randomiseGeneticsBase(experiment, true, null);
        // Clear the selected breed since we're going random
        this.selectedBreed = null;
      }

      experiment.recalculateSizes();
      experiment.recalculateColours(true);
      reinitEditor();

      return true;
    }
    return false;
  }

  render(ctx) {
    this.update();
  }
}

/**
* SexSelector control for selecting sex with three buttons
*/
class SexSelector extends BaseControl {
  constructor(x, y, label, selectedSex) {
    super(x, y, UI_THEME.controls.dropdown.width, UI_THEME.controls.dropdown.height, label);

    this.buttonWidth = (UI_THEME.controls.dropdown.width - (UI_THEME.spacing.sm * 2)) / 3; // 3 buttons with 2 margins between
    this.selectedSex = selectedSex || 'Female';
    this.sexOptions = ['Male', 'Female', 'Non Binary'];
    this.hoveredIndex = -1;
  }

  update() {
    // Draw label
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw three buttons
    this.sexOptions.forEach((sex, index) => {
      const buttonX = this.x + (index * (this.buttonWidth + CONTROL_SPACING.button.marginX));
      let bgColor = UI_THEME.colours.background;

      // Determine button color
      if (sex === this.selectedSex) {
        bgColor = UI_THEME.colours.selected;
      } else if (index === this.hoveredIndex) {
        bgColor = UI_THEME.colours.highlight;
      }

      // Draw button background
      ctx.fillStyle = bgColor;
      ctx.fillRect(buttonX + UI_THEME.borders.medium, this.y + UI_THEME.borders.medium,
        this.buttonWidth - (UI_THEME.borders.medium * 2), this.height - (UI_THEME.borders.medium * 2));

      // Draw button border
      ctx.lineWidth = UI_THEME.borders.medium;
      ctx.strokeStyle = UI_THEME.colours.border;
      ctx.strokeRect(buttonX, this.y, this.buttonWidth, this.height);

      ctx.fillStyle = UI_THEME.colours.text.primary;
      ctx.font = `${UI_THEME.fonts.sizes.tiny}px ${UI_THEME.fonts.primary}`;
      let sexSymbol = unicodeFemale;
      if (sex == 'Male') {
        sexSymbol = unicodeMale
      } else if (sex == 'Non Binary') {
        sexSymbol = unicodeNonBinary;
      }
      const textWidth = ctx.measureText(sexSymbol).width;
      ctx.fillText(sexSymbol, buttonX + (this.buttonWidth - textWidth) / 2, this.y + 18);
    });
  }

  handleMouseMove() {
    this.hoveredIndex = -1;

    // Check which button is being hovered
    if (pointerPos.y >= this.y && pointerPos.y <= this.y + this.height) {
      this.sexOptions.forEach((sex, index) => {
        const buttonX = this.x + (index * (this.buttonWidth + CONTROL_SPACING.button.marginX));
        if (pointerPos.x >= buttonX && pointerPos.x <= buttonX + this.buttonWidth) {
          this.hoveredIndex = index;
        }
      });
    }
  }

  handleClick() {
    if (pointerPos.y >= this.y && pointerPos.y <= this.y + this.height) {
      for (let i = 0; i < this.sexOptions.length; i++) {
        const buttonX = this.x + (i * (this.buttonWidth + CONTROL_SPACING.button.marginX));
        if (pointerPos.x >= buttonX && pointerPos.x <= buttonX + this.buttonWidth) {
          const newSex = this.sexOptions[i];
          if (newSex !== this.selectedSex) {
            this.selectedSex = newSex;
            experiment.sex = newSex;

            // Reroll name when sex changes
            experiment.name = generateBreedBasedName(experiment.breed, experiment.breed, experiment.sex);

            // Update name textbox directly
            if (textInputs) {
              const nameInput = textInputs.find(input => input.property === 'name');
              if (nameInput) {
                nameInput.value = experiment.name;
                nameInput.active = false;
              }
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  render(ctx) {
    this.update();
  }
}

class ColourBar extends BaseControl {
  constructor() {
    // Position under color picker, same width as spliceBox and color picker
    const x = CONTROL_SPACING.editorPreview.x;
    // Calculate color picker height: 20 rows + 1 extra row for grays, each row is pixelSize tall
    const y = colourPicker.y + colourPicker.height + CONTROL_SPACING.editor.colourSystemMarginY;
    const colourHeight = 30; // Make them a bit taller

    super(x, y, CONTROL_SPACING.editor.colourSystemWidth, colourHeight, '');

    this.selected = 0;
    this.hoveredIndex = -1;

    // Define all 6 colours with labels
    this.colours = [
      { prop: 'firstColour', label: '1st' },
      { prop: 'secondColour', label: '2nd' },
      { prop: 'thirdColour', label: '3rd' },
      { prop: 'patternColour', label: 'Pat' },
      { prop: 'eyeColour', label: 'Eye L' },
      { prop: 'eyeColour2', label: 'Eye R' }
    ];
    // Calculate width so bars fill the entire width with equal spacing
    const totalMarginSpace = UI_THEME.spacing.sm * (this.colours.length - 1);
    this.colourWidth = (CONTROL_SPACING.editor.colourSystemWidth - totalMarginSpace) / this.colours.length;
    this.colourHeight = colourHeight;
  }

  update() {
    ctx.globalAlpha = 1;
    // Draw color swatches
    this.colours.forEach((color, index) => {
      const colorX = this.x + (index * (this.colourWidth + UI_THEME.spacing.sm));
      ctx.fillStyle = experiment[color.prop];
      ctx.fillRect(colorX, this.y, this.colourWidth, this.colourHeight);

      // Draw selection or hover border
      if (this.selected === index) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = UI_THEME.colours.selected;
        ctx.strokeRect(colorX, this.y, this.colourWidth, this.colourHeight);
      } else if (this.hoveredIndex === index) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = UI_THEME.colours.highlight;
        ctx.strokeRect(colorX, this.y, this.colourWidth, this.colourHeight);
      }

      // Draw color label centered under each box
      ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`;
      ctx.fillStyle = UI_THEME.colours.text.primary;
      ctx.globalAlpha = 0.8;
      const labelWidth = ctx.measureText(color.label).width;
      const labelX = colorX + (this.colourWidth - labelWidth) / 2;
      ctx.fillText(color.label, labelX, this.y + this.colourHeight + 12);
      ctx.globalAlpha = 1;
    });

    ctx.font = `${UI_THEME.fonts.sizes.small}px ${UI_THEME.fonts.primary}`; // Reset font
  }

  handleMouseMove() {
    this.hoveredIndex = -1;

    // Check which color bar is being hovered
    if (pointerPos.y >= this.y && pointerPos.y <= this.y + this.colourHeight) {
      this.colours.forEach((color, index) => {
        const colorX = this.x + (index * (this.colourWidth + UI_THEME.spacing.sm));
        if (pointerPos.x >= colorX && pointerPos.x <= colorX + this.colourWidth) {
          this.hoveredIndex = index;
        }
      });
    }
  }

  render(ctx) {
    this.update();
  }
}

function ColourPicker() {
  // Position directly under spliceBox using constants
  this.x = CONTROL_SPACING.editorPreview.x;
  this.y = CONTROL_SPACING.editorPreview.y + CONTROL_SPACING.editorPreview.size + (CONTROL_SPACING.editorPreview.thickness * 2) + (CONTROL_SPACING.editor.colourSystemMarginY * 2);
  // Calculate pixel size to make total picker same width as spliceBox
  this.pixelRows = editorColourBitDepth;
  this.pixelColumns = editorColourBitDepth;
  this.pixelSize = CONTROL_SPACING.editor.colourSystemWidth / this.pixelColumns;
  this.width = CONTROL_SPACING.editor.colourSystemWidth; // Force exact width to match other elements
  this.height = (this.pixelRows + 1) * this.pixelSize; // +1 to account for the grayscale row
  this.huePixels = [];
  this.dragging = false;
  // convert x axis  
  // 6 is the hue spectrum in HSL
  let lrInterval = (rgbMax * 6) / this.pixelColumns; // divide by full columns for hue spectrum
  // generate hue gradient
  for (let i = 0; i < this.pixelColumns; i++) {
    this.huePixels.push((i * lrInterval) + (lrInterval / 2));
  }
  // convert gradient positions to hex values
  for (let i = 0; i < this.huePixels.length; i++) {
    if (this.huePixels[i] < rgbMax) {
      let tmp = [rgbMax, 0, Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < rgbMax * 2) {
      let tmp = [rgbMax + 256 - Math.round(this.huePixels[i]), 0, rgbMax];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < rgbMax * 3) {
      let tmp = [0, Math.round(this.huePixels[i] - (256 * 2)), rgbMax];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < rgbMax * 4) {
      let tmp = [0, rgbMax, rgbMax + (rgbMax * 3) - Math.round(this.huePixels[i])];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < rgbMax * 5) {
      let tmp = [Math.round(this.huePixels[i]) - (256 * 4), rgbMax, 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    } else if (this.huePixels[i] < rgbMax * 6) {
      let tmp = [rgbMax, rgbMax + (rgbMax * 5) - Math.round(this.huePixels[i]), 0];
      this.huePixels[i] = rgbToHex(tmp[0], tmp[1], tmp[2]);
    }
  }
  let outputPixels = [];
  // create all rows with proper HSV lightness gradient
  let tmpPix = [];
  const halfRows = this.pixelRows / 2;

  for (let i = 0; i < this.pixelRows; i++) {
    tmpPix = []; // Clear array for each row

    if (i < halfRows) {
      // Top half: white at top to pure hue at middle
      const whiteFactor = 1 - ((i + 0.5) / halfRows); // Offset to center the gradient
      for (let j = 0; j < this.huePixels.length; j++) {
        tmpPix[j] = mixTwoColours(UI_THEME.colours.text.primary, this.huePixels[j], whiteFactor);
      }
    } else {
      // Bottom half: pure hue to black at bottom
      const hueFactor = 1 - ((i - halfRows + 0.5) / halfRows); // Offset to center the gradient
      for (let j = 0; j < this.huePixels.length; j++) {
        tmpPix[j] = mixTwoColours(this.huePixels[j], UI_THEME.colours.secondary, hueFactor);
      }
    }

    outputPixels = outputPixels.concat(tmpPix);
  }

  // make a set of pixels that are greys (black to white)
  let factor = 256 / this.huePixels.length;
  for (let i = 0; i < this.huePixels.length; i++) {
    let tmp = Math.round(i * factor);
    outputPixels.push(rgbToHex(tmp, tmp, tmp));
  }

  this.pixels = outputPixels;

  this.detectPointer = function () {
    if (pointerPos.x >= this.x && pointerPos.x < this.x + this.width
      && pointerPos.y >= this.y && pointerPos.y < this.y + this.height) {
      return true;
    }
    else return false;
  }

  this.updateColour = function () {
    const actualCols = this.huePixels.length;
    let xPoint = pointerPos.x - this.x;
    let yPoint = pointerPos.y - this.y;
    let xCoord = Math.floor(xPoint / this.pixelSize);
    let yCoord = Math.floor(yPoint / this.pixelSize);
    let newIndex = (yCoord * actualCols) + xCoord;
    if (newIndex < this.pixels.length) {
      let selectedColour = this.pixels[newIndex];
      // Update color based on selected property from ColourBar
      if (colourBars && colourBars.colours) {
        // Use the 6-color system
        const selectedColor = colourBars.colours[colourBars.selected];
        if (selectedColor) {
          experiment[selectedColor.prop] = selectedColour;
        }
      }
      experiment.recalculateSizes();
      experiment.recalculateColours(true);
    }
  };
  this.update = function () {
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    for (let i = 0; i < this.pixels.length; i++) {
      let row = Math.floor(i / this.pixelColumns);
      let col = i % this.pixelColumns;
      ctx.fillStyle = this.pixels[i];
      ctx.fillRect(this.x + (col * this.pixelSize), this.y + (row * this.pixelSize), this.pixelSize, this.pixelSize);
    }
  };
}

/**
* Render all new editor controls
*/
function renderEditorControls() {
  // Render group titles
  renderGroupTitles();

  if (booleanToggles) {
    booleanToggles.forEach(toggle => toggle.update());
  }

  if (patternSelector) {
    patternSelector.update();
  }

  if (breedSelector) {
    breedSelector.update();
  }

  if (rerollButton) {
    rerollButton.update();
  }

  if (sexSelector) {
    sexSelector.update();
  }

  if (textInputs) {
    textInputs.forEach(input => input.update());
  }

  if (colourPicker) {
    colourPicker.update();
  }

  if (colourBars) {
    colourBars.update();
  }

  // Render dropdowns on top of everything else
  if (patternSelector) {
    patternSelector.renderDropdown();
  }
  if (breedSelector) {
    breedSelector.renderDropdown();
  }
}

/**
* Handle mouse movement for editor controls
*/
function handleEditorMouseMove() {
  // colour picker
  if (colourPicker.dragging && colourPicker.detectPointer()) {
    colourPicker.dragging = true;
    colourPicker.updateColour();
  }

  // Handle dropdown mouse moves
  if (breedSelector) {
    breedSelector.handleMouseMove();
  }

  if (patternSelector) {
    patternSelector.handleMouseMove();
  }

  if (sexSelector) {
    sexSelector.handleMouseMove();
  }

  // Handle button mouse moves
  if (rerollButton) {
    rerollButton.handleMouseMove();
  }

  if (textInputs) {
    textInputs.forEach(input => {
      if (input.handleMouseMove) {
        input.handleMouseMove();
      }
    });
  }

  // Handle slider mouse moves
  if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i];
      if (slider.handleMouseMove) {
        slider.handleMouseMove();
        if (detectCollision(slider.sThumb, pointerPos)) {
          updateCursor('grab');
          return true;
        }
      }
    }
  }

  // Handle boolean toggle mouse moves
  if (booleanToggles) {
    booleanToggles.forEach(toggle => {
      if (toggle.handleMouseMove) {
        toggle.handleMouseMove();
      }
    });
  }

  // Handle colour bar mouse moves
  if (colourBars) {
    colourBars.handleMouseMove();
  }
}

/**
* Handle keyboard input for editor controls
*/
function handleEditorKeyInput(key) {
  let keyHandled = false;

  if (textInputs) {
    textInputs.forEach(input => {
      if (input.handleKeyInput(key)) keyHandled = true;
    });
  }

  return keyHandled;
}

/**
* Handle clicks for new editor controls
*/
function handleEditorControlClicks() {

  // Check sliders
  if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
      if (detectCollision(sliders[i].sThumb, pointerPos)) {
        sliders[i].sThumb.dragged = true;
        return true;
      } else {
        sliders[i].sThumb.dragged = false;
      }
    }
  }

  // colour bar - now supports 6 colors
  if (colourBars && pointerPos.x >= colourBars.x &&
    pointerPos.x <= colourBars.x + (colourBars.colours.length * (colourBars.colourWidth + UI_THEME.spacing.sm)) &&
    pointerPos.y >= colourBars.y &&
    pointerPos.y <= colourBars.y + colourBars.colourHeight) {
    const colourIndex = Math.floor((pointerPos.x - colourBars.x) / (colourBars.colourWidth + UI_THEME.spacing.sm));
    if (colourIndex >= 0 && colourIndex < colourBars.colours.length) {
      colourBars.selected = colourIndex;
      return true;
    }
  }

  // colour picker
  if (colourPicker && colourPicker.detectPointer()) {
    colourPicker.updateColour();
    colourPicker.dragging = true;
    return true;
  }

  // Handle dropdown selectors first (they need priority when open)
  if (breedSelector && breedSelector.handleClick()) {
    return true; // Return immediately if breed selector handled the click
  }

  if (rerollButton && rerollButton.handleClick()) {
    return true; // Return immediately if reroll button handled the click
  }

  if (sexSelector && sexSelector.handleClick()) {
    return true; // Return immediately if sex selector handled the click
  }

  if (patternSelector && patternSelector.handleClick()) {
    return true; // Return immediately if pattern selector handled the click
  }

  if (booleanToggles) {
    booleanToggles.forEach(toggle => {
      if (toggle.handleClick()) clickHandled = true;
    });
  }

  // Handle text inputs - ensure all are deactivated first, then activate the clicked one
  let textInputClicked = false;
  if (textInputs) {
    textInputs.forEach(input => {
      if (input.handleMouseMove) {
        input.handleMouseMove();
      }
      if (input.handleClick()) {
        textInputClicked = true;
        return true;
      }
    });
  }

  // If no text input was clicked, make sure all are deactivated
  if (!textInputClicked && textInputs) {
    textInputs.forEach(input => {
      input.active = false;
    });
  }

  if (colourBars && colourBars.handleClick) {
    if (colourBars.handleClick()) return true;
  }

}

function unclickEditor() {
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

function updateEditor() {
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