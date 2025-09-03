/**
* function to copy all of a chitten's parameters into a JSON string for saving or cloning
* @param {object} chitten -the chitten to be cloned
* @return {string} outputbuffer - all the chitten's parameters stored as a JSON string
*/
function copyChitten(chitten) {
  // Properties to exclude from saving (runtime-only or temporary data)
  const excludeProps = [
    'x', 'y', 'speedX', 'speedY', 'love', 'energy', 'health',
    'awake', 'onSurface', 'facingForwards', 'sittingProgress', 'sitting',
    'rotation', 'skinColour', 'skinColour1', 'skinColour2', 'skinColour3',
    'outlineColour', 'outlineThickness', 'noseColour', 'mouthOpen',
    'speech', 'speechCounter', 'jumpCooldown', 'sittingCooldown',
    'partner', 'snuggling', 'holding', 'matureModifier','oldAgeModifier', 
    'flaggedForDeath', 'originalAngleToFocus', 'angleToFocus', 'jumpHeight', 'onTree', 'tailThickness',
    'focus', 'ultimateTarget', 'target', 'bodyToFeetDistance', 'thicknessModL', 'thicknessModS', 'tailLengthY',
    'legWidth', 'frontLegLength', 'frontLegOriginX', 'frontLegOriginY', 'backLegLength', 'backLegOriginX',
    'backLegOriginY', 'footSize', 'frontFootOriginX', 'frontFootOriginY', 'backFootOriginX', 'backFootOriginY',
    'treeSleepPosProgress', 'hitFocus', 'mother', 'bodypartColours', 'specialColours', 'bodypartGradients',
    'patternColours', 'cachedPatternImage', 'cachedPatternRotation', 'cachedPatternScale'
  ];

  const saveData = {};

  // Copy all properties except excluded ones and functions
  for (let prop in chitten) {
    if (!excludeProps.includes(prop) && typeof chitten[prop] !== 'function') {
      saveData[prop] = chitten[prop];
    }
  }

  return JSON.stringify(saveData);
}

// outputbuffer is JSON string from copyChitten. Who is target chitten to splice over
function cloneChitten(outputbuffer, who) {
  const saveData = JSON.parse(outputbuffer);
  selection = null;
  // Copy all saved properties
  for (let prop in saveData) {
    if (saveData.hasOwnProperty(prop)) {
      who[prop] = saveData[prop];
    }
  }
  // Regenerate runtime properties
  who.recalculateSizes();
  who.recalculateColours(true);
}

/**
* function to read a lifeforms's parameter string and return a valid lifeform object to be instantiated in the pool
* @param {string} outputbuffer - the lifeforms' parameter string (JSON format)
*/
function pasteChitten(outputbuffer) {
  const saveData = JSON.parse(outputbuffer);

  // Create new chitten with saved data
  chittens.push(new Chitten(
    canvasWidth * Math.random(),
    saveData.size || 15, // ypos 
    saveData.size || 15,
    saveData.maxSize || 20,
    saveData.gender || 'Female'
  ));

  // Clone the saved data
  cloneChitten(outputbuffer, chittens[chittens.length - 1]);
  seeds.push(new Seed(randomColourFruity(), chittens[chittens.length - 1]));
  speak(chittens[chittens.length - 1], neutralWord());
  sendMessage(chittens[chittens.length - 1].name + ' arrived');
  selection = null;
}

/**
* function to save the selected chittens's parameter string as a file on the users device
*/
function saveToFile() {
  let txt = '';
  let chosenname = prompt('Name your file:', selection.name);
  console.log('saving to file');
  if (chosenname == null || chosenname == '') {
    chosenname = selection.name;
  } else {
    let blob = new Blob([copyChitten(selection)], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, txt);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = chosenname + '.chi';
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
}

function openUploadDialog() {
  let element = document.createElement('div');
  element.innerHTML = '<input type="file">';
  let fileInput = element.firstChild;
  fileInput.addEventListener('change', function () {
    let file = fileInput.files[0];
    if (file.name.match(/\.(chi)$/)) {
      let reader = new FileReader();
      reader.onload = function () {
        pasteChitten(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert('File not supported, .chi only');
    }
  });
  fileInput.click();
}
