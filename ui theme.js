// UI areas
const UI_AREAS = {
  topBar: {
    x: 0,
    y: 5,
    rightMargin: 5,
    textBottom: 7.5
  },
  bottomBar: {
    x: 10,
    y: 20, // up from canvasHeight
    rowHeight: 25
  },
  adoption: {
    padding: 20,
    filterMarginX: 40
  }
}

const CONTROL_SPACING = {
  button: {
    marginX: 5,
    marginY: 7.5,
    padding: 20,
    height: 25
  },
  toolTip: {
    paddingX: 20,
    paddingY: 10,
    y: 20,
  },
  editorPreview: {
    x: 20,
    y: 60,
    thickness: 5,
    size: 250 // Use literal values since we can't reference the object while defining it
  },
  editor: {
    startY: 100,
    controlSpacing: 5,
    groupSpacing: 25,
    // Color system positioning (left-aligned stack)
    column0Width: 250,
    colourSystemWidth: 250, // Use literal value instead of column0Width
    colourSystemMarginX: 20,
    colourSystemMarginY: 10,
    columnStartX: 300,
    columnWidth: 175,
    titleHeight: 30,
    sliderMargin: 5, // slider, bodypart
    dropdownHeight: 50, // pattern, breed
    textboxHeight: 50, // text
    noLabelOffsetY: -15 // offset for items under dropdowns with no title
  }
}

const SPEECH = {
  padding: 10,
  height: 13
}

const CATBOX = {
  size: 170,
  padding: 20,
  thickness: 10,
  columns: 3,
  rows: 3
}

const CHITTEN_TOOLTIP = {
  marginX: 60,
  marginY: 10,
  padding: 20
}

// Centralized UI Constants and Theme System
const UI_THEME = {
  // Colours
  colours: {
    primary: trueWhite,
    secondary: trueBlack,
    adaptive: trueWhite,
    background: '#333333',
    highlight: '#555555',
    selected: '#888888',
    unavailable: '#111111',
    border: trueWhite,
    adoptionCentreBG: 'rgba(34, 34, 34, 0.7)',
    toolTipBorder: 'rgba(255, 255, 255, 0.3)',
    text: {
      primary: trueWhite,
      highlight: trueBlack,
      unavailable: '#333333'
    }
  },

  // Typography
  fonts: {
    primary: 'Consolas',
    sizes: {
      large: 20,      // heart size
      normal: 15,     // from fontSize
      small: 12,      // from fontSizeSmall  
      tiny: 10,       // smallest font size
      glyph: 14,      // glyph size
      bold11: 11,     // genetics headers
      bold14: 14,     // group titles
      bold18: 18      // main editor title
    }
  },

  // Spacing
  spacing: {
    xs: 2,
    sm: 5,
    md: 10,
    lg: 20,
    xl: 25
  },

  // Control dimensions
  controls: {
    button: { height: 25, padding: 20 },
    slider: { width: 100, height: 25, valueBox: { width: 40, height: 25, margin: 10 } },
    boolean: { width: 20, height: 20 },
    dropdown: { width: 145, height: 25 },
    textInput: { width: 145, height: 25 }
  },

  // Borders and strokes
  borders: {
    thin: 1,
    medium: 2,
    thick: 3
  }
};

// Shared styling functions
const UI_STYLES = {
  getControlBackground: (isHovered, isSelected, isUnavailable) => {
    if (isUnavailable) return UI_THEME.colours.unavailable;
    if (isSelected) return UI_THEME.colours.selected;
    if (isHovered) return UI_THEME.colours.highlight;
    return UI_THEME.colours.background;
  },

  getTextColour: (isHovered, isUnavailable) => {
    if (isUnavailable) return UI_THEME.colours.text.unavailable;
    if (isHovered) return UI_THEME.colours.text.highlight;
    return UI_THEME.colours.text.primary;
  }
};

