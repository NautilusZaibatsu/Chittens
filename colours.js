// Version 0.01

/**
* function to return a random colour as hex
* @return {string} the hexcode for a random colour
*/
function randomColour() {
  let seedR = Math.floor(Math.random()*256);
  let seedG = Math.floor(Math.random()*256);
  let seedB = Math.floor(Math.random()*256);
  let randC = rgbToHex(seedR, seedG, seedB);
  return randC;
}

/**
* function to turn rgb values into hexadecimal
* @param {int} r -  red
* @param {int} g -  green
* @param {int} b -  blue
* @return {string} - the hexcode for the colour
*/
function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    console.log('error 1 '+debugString);
    console.log('rgb: '+r+' '+g+' '+b);
  }
  if (r < 0 || g < 0 || b < 0) {
    console.log('error 2 '+debugString);
    console.log('rgb: '+r+' '+g+' '+b);
  }
  if ( isNaN(r) || isNaN(g) || isNaN(b)) {
    console.log('error 3 '+debugString);
    console.log('rgb: '+r+' '+g+' '+b);
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
