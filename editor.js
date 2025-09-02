// gene editing
geneEditing = false;
spliceBox = new CatBox(20, 30, 250, 5); // Increased size by 150% (100 * 2.5) for editor preview
sliderIndex = 0;
colourBars = null; // Will be initialized in startGame()
colourPicker = null; // Will be initialized in startGame()
editorButtons = []; // Editor save/close buttons


// Dynamic layout system
const LAYOUT_CONFIG = {
  startX: 100,
  startY: 100,
  controlSpacing: 5,
  groupSpacing: 25,
  previewScale: 2.5, // 150% increase
  colorPickerScale: 1.0, // 100% increase
  // Color system positioning (left-aligned stack)
  colorSystemX: 20,
  spliceBoxY: 30,
  spliceBoxSize: 250,
  colorSystemWidth: 250,
  colorSystemGap: 20,
  columnStartX: 300,
  columnWidth: 150,
  titleHeight: 30,
  sliderHeight: 30, // slider, bodypart
  dropdownHeight: 50, // pattern, breed
  textboxHeight: 50 // text
};


// Control type dimensions
const CONTROL_DIMENSIONS = {
  slider: { width: 100, height: 25 },
  boolean: { width: 20, height: 20 },
  pattern: { width: 120, height: 25 },
  text: { width: 120, height: 25 },
  breed: { width: 120, height: 25 },
  bodypart: { width: 120, height: 25 },
  colorPicker: {
    width: LAYOUT_CONFIG.colorSystemWidth,
    height: 21 * (LAYOUT_CONFIG.colorSystemWidth / 24) * LAYOUT_CONFIG.colorPickerScale
  },
  colorBar: {
    width: LAYOUT_CONFIG.colorSystemWidth,
    height: 30 + 12 // colorHeight + text space
  }
};

// Redesigned editor layout - WIP
const EDITOR_GROUPS = [
  {
    title: "Physical Traits",
    column: 1,
    y: LAYOUT_CONFIG.startY, spacing: 30,
    properties: [
      { prop: 'size', type: 'slider', min: 5, max: 20, label: 'Size' },
      { prop: 'thickness', type: 'slider', min: 0.5, max: 1, label: 'Thickness' },
      { prop: 'legginess', type: 'slider', min: 0, max: 1, label: 'Legginess' },
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
    y: LAYOUT_CONFIG.startY, spacing: 30,
    properties: [
      { prop: 'pattern', type: 'pattern', label: 'Pattern Type' },
      { prop: 'patternAlpha', type: 'slider', min: 0, max: 1, label: 'Pattern Opacity' },
      { prop: 'coatMod[3]', type: 'slider', min: 0, max: 1, label: 'Coat Gradient' },
      { prop: 'coatMod[0]', type: 'slider', min: 0, max: 1, label: 'Smooth Gradient' },
      { prop: 'coatMod[1]', type: 'slider', min: 0, max: 1, label: 'Coat Angle' },
      { prop: 'coatMod[2]', type: 'slider', min: 0, max: 1, label: 'Pattern Angle' },
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
    column: 3,
    y: LAYOUT_CONFIG.startY, spacing: 30,
    properties: [
      { prop: 'breedTemplate', type: 'breed', label: 'Apply Breed' },
      { prop: 'name', type: 'text', label: 'Name' },
      { prop: 'age', type: 'slider', min: 0, max: 10, label: 'Age' },
      { prop: 'maxAge', type: 'slider', min: 10, max: 25, label: 'Max Age' }
    ]
  },
  {
    title: '',
    column: 0,
    x: LAYOUT_CONFIG.colorSystemX, y: LAYOUT_CONFIG.spliceBoxY + LAYOUT_CONFIG.spliceBoxSize + LAYOUT_CONFIG.colorSystemGap, spacing: LAYOUT_CONFIG.colorSystemGap,
    properties: [
      { type: 'colorPicker' },
      { type: 'colorBar' }
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
  // gene editing
  experiment = new Chitten(LAYOUT_CONFIG.spliceBoxSize / 2, LAYOUT_CONFIG.spliceBoxSize / 2, chittenBaseSize, chittenMaxSize, 'Female');
  experiment.name = getFemaleName(Math.floor(Math.random() * numlibs * namesinlib));
  randomiseGeneticsBase(experiment, true, null)
  experiment.awake = true;
  experiment.onSurface = true;
  experiment.recalculateSizes();
  experiment.recalculateColours();
  initGeneticsEditorProperties();
  initSliders();
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
function initSliders() {
  sliders = [];
  booleanToggles = [];
  patternSelector = null;
  breedSelector = null;
  textInputs = [];
  colourBars = null;
  colourPicker = null;

  let controlIndex = 0;

  // Track Y position for each column
  const columnYPositions = {};

  EDITOR_GROUPS.forEach(group => {
    // Calculate dynamic x position based on column property
    if (group.column !== undefined && group.column > 0) {
      group.x = LAYOUT_CONFIG.columnStartX + LAYOUT_CONFIG.columnWidth * (group.column - 1);

      // Calculate dynamic Y position based on what's already in this column
      if (!columnYPositions[group.column]) {
        // First group in this column
        columnYPositions[group.column] = LAYOUT_CONFIG.startY;
      }

      group.y = columnYPositions[group.column];

      // Calculate height needed for this group
      let groupHeight = LAYOUT_CONFIG.titleHeight; // Space for title
      group.properties.forEach(propDef => {
        switch (propDef.type) {
          case 'slider':
          case 'bodypart':
            groupHeight += LAYOUT_CONFIG.sliderHeight;
            break;
          case 'pattern':
          case 'breed':
            groupHeight += LAYOUT_CONFIG.dropdownHeight;
            break;
          case 'text':
            groupHeight += LAYOUT_CONFIG.textboxHeight;
            break;
          default:
            groupHeight += LAYOUT_CONFIG.sliderHeight; // Default fallback
            break;
        }
      });

      // Update column Y position for next group
      columnYPositions[group.column] += groupHeight + LAYOUT_CONFIG.groupSpacing;
    }

    let currentY = group.y;

    // Draw group title
    group.titleY = currentY - LAYOUT_CONFIG.titleHeight;

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
        case 'gender':
          textInputs.push(control);
          break;
        case 'breed':
          breedSelector = control;
          break;
        case 'colorPicker':
          colourPicker = control;
          break;
        case 'colorBar':
          colourBars = control;
          break;
      }

      // Use appropriate spacing based on control type
      switch (propDef.type) {
        case 'slider':
        case 'bodypart':
          currentY += LAYOUT_CONFIG.sliderHeight;
          break;
        case 'pattern':
        case 'breed':
          currentY += LAYOUT_CONFIG.dropdownHeight;
          break;
        case 'text':
        case 'gender':
          currentY += LAYOUT_CONFIG.textboxHeight;
          break;
        case 'boolean':
          currentY += LAYOUT_CONFIG.sliderHeight; // Use slider height as default for booleans
          break;
        case 'colorPicker':
        case 'colorBar':
          currentY += group.spacing; // These use custom spacing from the group
          break;
        default:
          currentY += LAYOUT_CONFIG.sliderHeight; // Default fallback
          break;
      }

      controlIndex++;
    });
  });
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

    case 'colorPicker':
      return new ColourPixelBlock();

    case 'colorBar':
      return new ColourBar();

    case 'boolean':
      return new BooleanToggle(x, y, propDef.label, propDef.prop, value);

    case 'pattern':
      return new PatternSelector(x, y, propDef.label, value);

    case 'text':
    case 'gender':
      return new TextInput(x, y, propDef.label, propDef.prop, value, propDef.type);

    case 'breed':
      return new BreedSelector(x, y, propDef.label);
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
function reinitSliders() {
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
* function to describe a slider
*/
function Slider(lowerLimit, upperLimit, currentPos, x, y, txt, property, index) {
  this.id = index;
  this.lowerLimit = lowerLimit;
  this.upperLimit = upperLimit;
  this.currentPos = currentPos;
  this.relativePosition = 0;
  this.proportion = 1;
  this.x = x;
  this.y = y;
  this.text = txt;
  this.property = property; // Property path like 'thickness' or 'bodypartCode[0]'
  this.width = CONTROL_DIMENSIONS.slider.width;
  this.height = CONTROL_DIMENSIONS.slider.height;
  this.sThumb = new SliderThumb(this);

  this.update = function () {
    // Calculate proportion based on actual slider width
    this.proportion = this.width / (Math.abs(this.upperLimit - this.lowerLimit));
    this.relativePosition = this.proportion * (this.currentPos - this.lowerLimit);
    
    // Draw slider track
    ctx.lineWidth = 2;
    ctx.strokeStyle = trueBlack;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.stroke();
    
    // Draw label
    ctx.fillStyle = trueWhite;
    ctx.font = '12px' + ' ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.text, this.x, this.y - 8);
    ctx.globalAlpha = 1;
    
    this.sThumb.update();
  };
}

/**
* function to describe a slider bar
*/
function SliderThumb(parent) {
  this.parent = parent;
  this.dragged = false;
  this.colour = trueWhite;
  this.x = this.parent.x;
  this.y = this.parent.y;
  this.size = Math.max(8, this.parent.height * 0.4); // Dynamic thumb size based on slider height

  this.update = function () {
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

        // Special case for size - also update maxSize
        if (this.parent.property === 'size') {
          experiment.maxSize = value;
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

        experiment.recalculateSizes();
        experiment.recalculateColours();
      }
    } else {
      this.x = this.parent.x + this.parent.relativePosition;
    }

    // Draw thumb with dynamic sizing
    ctx.fillStyle = this.colour;
    const thumbWidth = Math.max(4, this.size * 0.4);
    const thumbHeight = this.size;
    ctx.fillRect(this.x - thumbWidth/2, this.y - thumbHeight/2, thumbWidth, thumbHeight);
  };
}

/**
* Render group titles and main editor title
*/
function renderGroupTitles() {
  // Main editor title
  ctx.fillStyle = trueWhite;
  ctx.font = 'bold 18px ' + globalFont;
  ctx.fillText('Genetic Editor', 20, 25);

  // Group titles
  ctx.fillStyle = trueWhite;
  ctx.font = 'bold 14px ' + globalFont;

  EDITOR_GROUPS.forEach(group => {
    if (group.titleY) {
      ctx.fillText(group.title, group.x, group.titleY);
    }
  });
}

// Preview box and color system positioning handled by existing spliceBox and colourBars/colourPicker

// Save/close buttons handled by existing UI system

/**
* BooleanToggle control for boolean properties
*/
function BooleanToggle(x, y, label, property, value) {
  this.x = x;
  this.y = y;
  this.label = label;
  this.property = property;
  this.value = value;
  this.width = CONTROL_DIMENSIONS.boolean.width;
  this.height = CONTROL_DIMENSIONS.boolean.height;

  this.update = function () {
    ctx.fillStyle = trueWhite;
    ctx.font = '12px ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x + 25, this.y + 15);
    ctx.globalAlpha = 1;

    // Draw checkbox
    ctx.strokeStyle = trueWhite;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    if (this.value) {
      ctx.fillStyle = trueWhite;
      ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
    }
  };

  this.handleClick = function (mousePos) {
    if (mousePos.x >= this.x && mousePos.x <= this.x + this.width &&
      mousePos.y >= this.y && mousePos.y <= this.y + this.height) {
      this.value = !this.value;
      setPropertyValue(experiment, this.property, this.value);
      experiment.recalculateSizes();
      experiment.recalculateColours();
      return true;
    }
    return false;
  };
}

/**
* PatternSelector control for pattern selection
*/
function PatternSelector(x, y, label, selectedPattern) {
  this.x = x;
  this.y = y;
  this.label = label;
  this.selectedPattern = selectedPattern;
  this.width = CONTROL_DIMENSIONS.pattern.width;
  this.height = CONTROL_DIMENSIONS.pattern.height;
  this.open = false;

  this.update = function () {
    ctx.fillStyle = trueWhite;
    ctx.font = '12px ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw dropdown box
    ctx.strokeStyle = trueWhite;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = uiDarkGrey;
    ctx.fillRect(this.x +1 , this.y +1 , this.width -2, this.height - 2);


    // Show selected pattern
    const selectedPatternData = validPatterns.find(p => p.value === this.selectedPattern);
    ctx.fillStyle = trueWhite;
    ctx.fillText(selectedPatternData ? selectedPatternData.label : 'Unknown', this.x + 5, this.y + 18);

    // Draw dropdown indicator
    ctx.fillStyle = trueWhite;
    ctx.fillText(unicodeDropdown, this.x + this.width - 15, this.y + 18);


    // Draw dropdown options if open
    if (this.open) {
      validPatterns.forEach((pattern, index) => {
        const optionY = this.y + this.height + (index * this.height);
        ctx.fillStyle = pattern.value === this.selectedPattern ? '#444444' : '#222222';
        ctx.fillRect(this.x, optionY, this.width, this.height);
        ctx.strokeStyle = trueWhite;
        ctx.strokeRect(this.x, optionY, this.width, this.height);
        ctx.fillStyle = trueWhite;
        ctx.fillText(pattern.label, this.x + 5, optionY + 18);
      });
    }
  };

  this.handleClick = function (mousePos) {
    if (mousePos.x >= this.x && mousePos.x <= this.x + this.width) {
      if (mousePos.y >= this.y && mousePos.y <= this.y + this.height) {
        this.open = !this.open;
        return true;
      } else if (this.open) {
        // Check dropdown options
        validPatterns.forEach((pattern, index) => {
          const optionY = this.y + this.height + (index * this.height);
          if (mousePos.y >= optionY && mousePos.y <= optionY + this.height) {
            this.selectedPattern = pattern.value;
            setPropertyValue(experiment, 'pattern', pattern.value);
            experiment.recalculateSizes();
            experiment.recalculateColours();
            this.open = false;
          }
        });
        return true;
      }
    }
    return false;
  };
}

/**
* TextInput control for text properties
*/
function TextInput(x, y, label, property, value, inputType) {
  this.x = x;
  this.y = y;
  this.label = label;
  this.property = property;
  this.value = value || '';
  this.inputType = inputType;
  this.width = CONTROL_DIMENSIONS.text.width;
  this.height = CONTROL_DIMENSIONS.text.height;
  this.active = false;

  this.update = function () {
    ctx.fillStyle = trueWhite;
    ctx.font = '12px ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw input box
    ctx.strokeStyle = this.active ? '#ffff00' : trueWhite;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#222222';
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Show value
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.value, this.x + 5, this.y + 18);
  };

  this.handleClick = function (mousePos) {
    if (mousePos.x >= this.x && mousePos.x <= this.x + this.width &&
      mousePos.y >= this.y && mousePos.y <= this.y + this.height) {
      this.active = true;
      // Focus logic would go here in a full implementation
      return true;
    } else {
      this.active = false;
    }
    return false;
  };
}

/**
* BreedSelector control for applying breed templates
*/
function BreedSelector(x, y, label) {
  this.x = x;
  this.y = y;
  this.label = label;
  this.width = CONTROL_DIMENSIONS.breed.width;
  this.height = CONTROL_DIMENSIONS.breed.height;
  this.open = false;
  this.breeds = Object.keys(BREED_DATA).sort(); // Get all breeds from BREED_DATA

  this.update = function () {
    ctx.fillStyle = trueWhite;
    ctx.font = '12px ' + globalFont;
    ctx.globalAlpha = 0.5;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;

    // Draw dropdown box
    ctx.strokeStyle = trueWhite;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = uiDarkGrey;
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Show "Select Breed" text
    ctx.fillStyle = trueWhite;
    ctx.fillText('Select Breed', this.x + 5, this.y + 18);

    // Draw dropdown indicator
    ctx.fillStyle = trueWhite;
    ctx.fillText(unicodeDropdown, this.x + this.width - 15, this.y + 18);

    // Draw dropdown options if open
    if (this.open) {
      this.breeds.forEach((breedName, index) => {
        const optionY = this.y + this.height + (index * this.height);
        ctx.fillStyle = '#222222';
        ctx.fillRect(this.x, optionY, this.width, this.height);
        ctx.strokeStyle = trueWhite;
        ctx.strokeRect(this.x, optionY, this.width, this.height);
        ctx.fillStyle = trueWhite;
        ctx.fillText(breedName, this.x + 5, optionY + 18);
      });
    }
  };

  this.handleClick = function (mousePos) {
    if (mousePos.x >= this.x && mousePos.x <= this.x + this.width) {
      if (mousePos.y >= this.y && mousePos.y <= this.y + this.height) {
        this.open = !this.open;
        return true;
      } else if (this.open) {
        // Check dropdown options
        this.breeds.forEach((breedName, index) => {
          const optionY = this.y + this.height + (index * this.height);
          if (mousePos.y >= optionY && mousePos.y <= optionY + this.height) {
            // Apply the selected breed to the experiment chitten
            applyBreed(experiment, breedName);
            experiment.recalculateSizes();
            experiment.recalculateColours();
            // Update all controls with new values
            reinitSliders();
            this.open = false;
          }
        });
        return true;
      }
    }

    // Close dropdown if clicked elsewhere
    if (this.open) {
      this.open = false;
    }

    return false;
  };
}

function ColourBar(x, y) {
  // Position under color picker, same width as spliceBox and color picker
  this.x = LAYOUT_CONFIG.colorSystemX;
  // Calculate color picker height: 20 rows + 1 extra row for grays, each row is pixelSize tall
  const pixelSize = LAYOUT_CONFIG.colorSystemWidth / 24; // Same as in ColourPixelBlock
  const colorPickerHeight = 21 * pixelSize; // 20 color rows + 1 gray row
  this.y = LAYOUT_CONFIG.spliceBoxY + LAYOUT_CONFIG.spliceBoxSize + LAYOUT_CONFIG.colorSystemGap + colorPickerHeight + LAYOUT_CONFIG.colorSystemGap;
  this.selected = 0;
  this.colorWidth = LAYOUT_CONFIG.colorSystemWidth / 6; // Divide total width by 6 colors
  this.colorHeight = 30; // Make them a bit taller

  // Define all 6 colors with labels
  this.colors = [
    { prop: 'firstColour', label: 'Primary' },
    { prop: 'secondColour', label: 'Secondary' },
    { prop: 'thirdColour', label: 'Tertiary' },
    { prop: 'patternColour', label: 'Pattern' },
    { prop: 'eyeColour', label: 'Left Eye' },
    { prop: 'eyeColour2', label: 'Right Eye' }
  ];

  this.update = function () {
    ctx.globalAlpha = 1;
    // Draw color swatches
    this.colors.forEach((color, index) => {
      const colorX = this.x + (index * this.colorWidth);
      ctx.fillStyle = experiment[color.prop];
      ctx.fillRect(colorX, this.y, this.colorWidth, this.colorHeight);

      // Draw selection border
      if (this.selected === index) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = trueWhite;
        ctx.strokeRect(colorX, this.y, this.colorWidth, this.colorHeight);
      }

      // Draw color label
      ctx.font = '9px' + ' ' + globalFont;
      ctx.fillStyle = trueWhite;
      ctx.globalAlpha = 0.8;
      ctx.fillText(color.label, colorX, this.y + this.colorHeight + 12);
      ctx.globalAlpha = 1;
    });

    ctx.font = '12px' + ' ' + globalFont; // Reset font
  };
}

function ColourPixelBlock() {
  // Position directly under spliceBox using constants
  this.x = LAYOUT_CONFIG.colorSystemX;
  this.y = LAYOUT_CONFIG.spliceBoxY + LAYOUT_CONFIG.spliceBoxSize + LAYOUT_CONFIG.colorSystemGap;
  // Calculate pixel size to make total picker same width as spliceBox
  this.pixelRows = 20;
  this.pixelColumns = 24;
  this.pixelSize = (LAYOUT_CONFIG.colorSystemWidth / this.pixelColumns) * LAYOUT_CONFIG.colorPickerScale;
  this.width = this.pixelColumns * this.pixelSize;
  this.height = (this.pixelRows + 1) * this.pixelSize; // +1 for grayscale row
  this.huePixels = [];
  this.clicked = false;
  // convert x axis  
  let lrInterval = (rgbMax * 6) / (this.pixelColumns - 1); // divide by columns-1 for hue spectrum
  // generate hue gradient
  for (let i = 0; i < this.pixelColumns - 1; i++) {
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
  // create all rows and populate white - transparent - black fade
  let tmpPix = [];
  for (let i = 0; i < this.pixelRows; i++) {
    tmpPix = []; // Clear array for each row
    if (i < this.pixelRows / 2) {
      for (let j = 0; j < this.huePixels.length; j++) {
        tmpPix[j] = mixTwoColours(trueWhite, this.huePixels[j], 1 - (i / this.pixelRows * 2));
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else if (i > this.pixelRows / 2) {
      for (let j = 0; j < this.huePixels.length; j++) {
        tmpPix[j] = mixTwoColours(trueBlack, this.huePixels[j], (i - (this.pixelRows / 2)) / this.pixelRows * 2);
      }
      outputPixels = outputPixels.concat(tmpPix);
    } else {
      outputPixels = outputPixels.concat(this.huePixels);
    }
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
      let midPointX = xCoord + (this.pixelSize / 2);
      let midPointY = yCoord + (this.pixelSize / 2);
      let perfectColour = this.pixels[newIndex];
      let diffx = midPointX - xPoint; // 0 to pixelSize/2
      let diffy = midPointY - yPoint;

      // now get the exact colour by combining boxes
      let newC1 = perfectColour;
      let newC2 = perfectColour;
      if (diffx < 0 && xCoord > 0 && xCoord < actualCols) {
        newC1 = mixTwoColours(perfectColour, this.pixels[newIndex - 1], Math.abs((this.pixelSize / 2) / diffx));
      } else if (diffx > 0 && xCoord > 0 && xCoord < actualCols) {
        newC1 = mixTwoColours(perfectColour, this.pixels[newIndex + 1], Math.abs((this.pixelSize / 2) / diffx));
      }

      if (diffy < 0 && yCoord > 0 && yCoord < this.pixelRows - 1) {
        newC2 = mixTwoColours(perfectColour, this.pixels[newIndex - actualCols], Math.abs((this.pixelSize / 2) / diffy));
      } else if (diffy > 0 && yCoord > 0 && yCoord < this.pixelRows - 1) {
        newC2 = mixTwoColours(perfectColour, this.pixels[newIndex + actualCols], Math.abs((this.pixelSize / 2) / diffy));
      }
      perfectColour = mixTwoColours(newC1, newC2, 0.5);

      // Update color based on selected property from ColorPicker or ColourBar
      if (colourBars && colourBars.selectedProperty) {
        setPropertyValue(experiment, colourBars.selectedProperty, perfectColour);
      } else if (colourBars && colourBars.colors) {
        // Use new 6-color system
        const selectedColor = colourBars.colors[colourBars.selected];
        if (selectedColor) {
          experiment[selectedColor.prop] = perfectColour;
        }
      }
      experiment.recalculateSizes();
      experiment.recalculateColours();
    }
  };
  this.update = function () {
    const actualCols = this.huePixels.length;
    ctx.strokeStyle = uiColourArray[3];
    ctx.strokeRect(this.x, this.y, this.pixelSize * actualCols, this.pixelSize * (this.pixelRows + 1));

    for (let i = 0; i < this.pixels.length; i++) {
      let row = Math.floor(i / actualCols);
      let col = i % actualCols;
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

  if (textInputs) {
    textInputs.forEach(input => input.update());
  }

  if (colourPicker) {
    colourPicker.update();
  }

  if (colourBars) {
    colourBars.update();
  }
}

/**
* Handle clicks for new editor controls
*/
function handleEditorControlClicks(mousePos) {
  let clickHandled = false;

  if (booleanToggles) {
    booleanToggles.forEach(toggle => {
      if (toggle.handleClick(mousePos)) clickHandled = true;
    });
  }

  if (patternSelector && patternSelector.handleClick(mousePos)) {
    clickHandled = true;
  }

  if (breedSelector && breedSelector.handleClick(mousePos)) {
    clickHandled = true;
  }

  if (textInputs) {
    textInputs.forEach(input => {
      if (input.handleClick(mousePos)) clickHandled = true;
    });
  }

  if (colourBars && colourBars.handleClick) {
    if (colourBars.handleClick(mousePos)) clickHandled = true;
  }

  return clickHandled;
}