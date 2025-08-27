// Version 0.01

/**
* function to return a random colour as hex
* @return {string} the hexcode for a random colour
*/
function randomColour() {
  let seedR = Math.round(Math.random() * 255);
  let seedG = Math.round(Math.random() * 255);
  let seedB = Math.round(Math.random() * 255);
  let randC = rgbToHex(seedR, seedG, seedB);
  return randC;
}

/**
* function to generate a realistic eye colour for starters
* @return {hex} - a colour
*/
function getRandomEyeColour() {
  let randSeed = Math.floor(Math.random() * 3); // 0, 1 or 2
  let seedR = 0, seedG = 0, seedB = 0;
  let colour;

  if (randSeed === 0) {
    // Blues
    seedB = 150 + Math.floor(Math.random() * 105);
    seedG = Math.floor(seedB * (0.3 + Math.random() * 0.4));
    seedR = Math.floor(seedG * (0.7 + Math.random() * 0.3));
  } else if (randSeed === 1) {
    // Greens
    seedG = 120 + Math.floor(Math.random() * 100);
    seedR = Math.floor(seedG * (0.4 + Math.random() * 0.4));
    seedB = Math.floor(seedG * (0.2 + Math.random() * 0.3));
  } else {
    // Browns (amber → golden → chocolate)
    seedR = 140 + Math.floor(Math.random() * 60);   // 140–200
    seedG = seedR - (20 + Math.floor(Math.random() * 40)); // 20–60 lower than R
    seedB = Math.floor(seedG * (0.3 + Math.random() * 0.3)); // 30–60% of G
    // Clamp just in case
    if (seedG < 60) seedG = 60;
    if (seedB < 30) seedB = 30;
  }
  colour = rgbToHex(seedR, seedG, seedB);
  return colour;
}

/**
* function to create a realistic coat for a cat
* @return {array} three hex colours
*/
function generateRealisticCoat(randSeed) {
  if (randSeed == null) {
    randSeed = Math.round(Math.random() * 3);
  }
  let coatArray = [];
  // solid colour
  if (randSeed < 3) {
    coatArray[0] = randomColourRealistic(Math.random());
    coatArray[1] = coatArray[0];
    coatArray[2] = coatArray[0];
  } else {
    // bi-colour
    coatArray[0] = trueWhite;
    coatArray[1] = randomColourRealistic(Math.random());
    coatArray[2] = coatArray[0];
  }
  return coatArray;
  // striped tabby
  // spotted tabby
  // ticked tabby
  // classic tabby
};

/**
* function to return a random realistic coat colour as hex
* @return {string} the hexcode for a random colour
*/
function randomColourRealistic(seed) {
  let seedR = 0;
  let seedG = 0;
  let seedB = 0;
  let colour = 'red'; // for debug
  if (seed <= 1 / 3) {
    // orange through peach
    seedR = Math.floor(Math.random() * 255);
    seedG = Math.floor(Math.random() * (seedR / 1.7));
    seedB = Math.floor(Math.random() * (seedG / 1.25));
    colour = rgbToHex(seedR, seedG, seedB);
  } else if (seed <= 2 / 3) {
    // russian blue
    seedB = Math.floor(Math.random() * 255);
    seedG = (seedB / 2) + Math.floor(Math.random() * 50);//Math.floor(Math.random()*(seedB));
    seedR = seedG; //Math.floor(Math.random()*(seedB));
    colour = rgbToHex(seedR, seedG, seedB);
  } else {
    // greys
    let seed = Math.floor(Math.random() * 255);
    colour = rgbToHex(seed, seed, seed);
  }
  return colour;
}

skinColourCheck = function (theColour) {
  let rgb = hexToRgb(theColour);
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  // Check for white cats (high brightness across all channels)
  if (r > skinColourBrightnessthreshold && g > skinColourBrightnessthreshold && b > skinColourBrightnessthreshold) {
    return skinPink;
  }

  // Check for ginger/orange cats (red dominance)
  if (r > 150 && r > g * 1.3 && r > b * 1.5) {
    return skinPink;
  }

  // Check for brown cats (balanced warm tones)
  if (r > 80 && g > 60 && b < 100 && r >= g && g >= b) {
    return skinPink;
  }

  // All other colors (grey, black, etc.) get grey skin
  return skinGrey;
};

noseColourCheck = function (theColour) {
  let rgb = hexToRgb(theColour);
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  // Check for white cats (high brightness across all channels)
  if (r > 200 && g > 200 && b > 175) {
    return nosePink;
  }

  // Check for ginger/orange cats (red dominance)
  if (r > 150 && r > g * 1.3 && r > b * 1.5) {
    return nosePink;
  }

  // Check for brown cats (balanced warm tones)
  if (r > 80 && g > 60 && b < 100 && r >= g && g >= b) {
    return nosePink;
  }

  // All other colors (grey, black, etc.) get black nose
  return noseBlack;
};

/** function to create a random bodypartCode
* this code is used to denote the zones of colour on a Chitten
* @return {array} - the bodypart code
*/
randomBodyPartCode = function () {
  let tmpArray = [];
  for (let i = 0; i < 13; i++) {
    tmpArray.push(Math.round(Math.random() * 2));
  }
  return tmpArray;
};

/**
* function to return a random colour as hex
* @return {string} the hexcode for a random colour
*/
function randomColourFruity() {
  let seedR = 0;
  let seedG = 0;
  let seedB = 0;
  let colour = 'red'; // for debug
  let randSeed = Math.random();
  if (randSeed <= 1 / 4) {
    // orange - yellow
    seedR = Math.floor(Math.random() * 100) + 155;
    seedG = Math.floor(Math.random() * 100) + 150;
    seedB = Math.floor(Math.random() * 100) + 50;
  } else if (randSeed <= 2 / 4) {
    // red
    seedR = Math.floor(Math.random() * 100) + 155;
    seedG = Math.floor(Math.random() * 50) + 80;
    seedB = Math.floor(Math.random() * 50) + 80;
  } else if (randSeed <= 3 / 4) {
    // green
    seedR = Math.floor(Math.random() * 60) + 100;
    seedG = Math.floor(Math.random() * 100) + 155;
    seedB = Math.floor(Math.random() * 50) + 80;
  } else {
    // blue
    seedB = Math.floor(Math.random() * 100) + 155;
    seedR = Math.floor(Math.random() * 50) + 80;
    seedG = Math.floor(Math.random() * 50) + 80;
  }
  colour = rgbToHex(seedR, seedG, seedB);
  return colour;
}

// GENERAL COLOUR OPERATIONS BELOW THIS LINE

/**
* function to turn rgb values into hexadecimal
* @param {int} r -  red
* @param {int} g -  green
* @param {int} b -  blue
* @return {string} - the hexcode for the colour
*/
function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    console.warn('rgb: ' + r + ' ' + g + ' ' + b);
  }
  if (r < 0 || g < 0 || b < 0) {
    console.warn('rgb: ' + r + ' ' + g + ' ' + b);
  }
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
* function to turn a hex colour into 3 separate r,g,b values
* @param {string} hex - the hex colour
* @return {int} [1], [2], or [3] for r, g and b respectively
*/
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
* Converts an RGB color value to HSL
* @param  {int}  r - The red color value
* @param  {int}  g - The green color value
* @param  {int}  b - The blue color value
* @return  Array           The HSL representation
*/
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

/**
* Converts an HSL color value to RGB
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

function increaseSaturationHEX(hex) {
  let rgbhsl = rgbToHsl(hexToRgb(hex).r, hexToRgb(hex).g, hexToRgb(hex).b);
  let hslrgb = hslToRgb(rgbhsl[0], 1, rgbhsl[2]);
  // console.log('returning '+hslrgb+' / '+rgbToHex(hslrgb[0], hslrgb[1], hslrgb[2]));
  return rgbToHex(Math.round(hslrgb[0]), 1, Math.round(hslrgb[2]));
}

function decreaseSaturationHEX(hex, fraction) {
  let rgbhsl = rgbToHsl(hexToRgb(hex).r, hexToRgb(hex).g, hexToRgb(hex).b);
  let hslrgb = hslToRgb(rgbhsl[0], rgbhsl[1] / fraction, rgbhsl[2]);
  // console.log('returning '+hslrgb+' / '+rgbToHex(hslrgb[0], hslrgb[1], hslrgb[2]));
  return rgbToHex(Math.round(hslrgb[0]), Math.round(hslrgb[1]), Math.round(hslrgb[2]));
}

/**
* @param {string} hex1
* @param {string} hex2
* @param {int} prop - the proportion of hex1 to hex2 (0 to 1);
*/
function mixTwoColours(hex1, hex2, prop) {
  if (typeof hex1 !== 'string' || !hex1.startsWith('#')) {
    console.warn('mixTwoColours was passed a non hex value: ' + hex1);
  }
  if (typeof hex2 !== 'string' || !hex2.startsWith('#')) {
    console.warn('mixTwoColours was passed a non hex value: ' + hex2);
  }
  if (prop > 1) {
    prop = 1;
  } else if (prop < 0) {
    prop = 0;
  }
  ri = hexToRgb(hex1).r;
  gi = hexToRgb(hex1).g;
  bi = hexToRgb(hex1).b;
  rj = hexToRgb(hex2).r;
  gj = hexToRgb(hex2).g;
  bj = hexToRgb(hex2).b;
  combr = Math.round((ri * prop) + (rj * (1 - prop)));
  combg = Math.round((gi * prop) + (gj * (1 - prop)));
  combb = Math.round((bi * prop) + (bj * (1 - prop)));
  return rgbToHex(combr, combg, combb);
}

/**
* @param {string} hex1
* @param {string} hex2
* @param {string} hex3
*/
function mixThreeColours(hex1, hex2, hex3) {
  if (typeof hex1 !== 'string' ||!hex1.startsWith('#')) {
    console.warn('mixThreeColours was passed a non hex value: ' + hex1);
  }
  if (typeof hex2 !== 'string' ||!hex2.startsWith('#')) {
    console.warn('mixThreeColours was passed a non hex value: ' + hex2);
  }
  if (typeof hex3 !== 'string' ||!hex3.startsWith('#')) {
    console.warn('mixThreeColours was passed a non hex value: ' + hex3);
  }
  ri = hexToRgb(hex1).r;
  gi = hexToRgb(hex1).g;
  bi = hexToRgb(hex1).b;
  rj = hexToRgb(hex2).r;
  gj = hexToRgb(hex2).g;
  bj = hexToRgb(hex2).b;
  rk = hexToRgb(hex3).r;
  gk = hexToRgb(hex3).g;
  bk = hexToRgb(hex3).b;
  combr = Math.round((ri + rj + rk) / 3);
  combg = Math.round((gi + gj + gk) / 3);
  combb = Math.round((bi + bj + bk) / 3);
  return rgbToHex(combr, combg, combb);
}

// Helper function to calculate color brightness (0-255 scale)
function getBrightness(color) {
  // Convert hex color to RGB and calculate brightness
  let r, g, b;

  if (color.startsWith('#')) {
    // Handle hex colors
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    }
  } else {
    // Handle named colors (limited support)
    if (color === trueWhite) return 255;
    if (color === trueBlack) return 0;
    // Default to medium brightness for unknown colors
    return 128;
  }
  // Calculate perceived brightness using luminance formula
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}
