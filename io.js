/**
* function to copy all of a chibi's parameters into a string for saving or cloning
* @param {object} chibi -the chibi to be cloned
* @return {string} outputbuffer - all the chibi's parameters stored as a string
*/
function copyChibi(chibi) {
  let outputbuffer =
  chibi.gender+'*'+
  chibi.secondColour+'*'+
  chibi.firstColour+'*'+
  chibi.coatMod[0]+'*'+
  chibi.coatMod[1]+'*'+
  chibi.earWidth+'*'+
  chibi.thickness+'*'+
  chibi.legginess+'*'+
  chibi.size+'*'+
  chibi.limbLength+'*'+
  chibi.maxSize+'*'+
  chibi.birthday+'*'+
  chibi.age+'*'+
  chibi.name+'*'+
  chibi.elder+'*'+
  chibi.reachedNirvana+'*'+
  chibi.tailLength+'*'+
  chibi.albino+'*'+
  chibi.albinoGene+'*'+
  chibi.bodypartCode[0]+'*'+
  chibi.bodypartCode[1]+'*'+
  chibi.bodypartCode[2]+'*'+
  chibi.bodypartCode[3]+'*'+
  chibi.bodypartCode[4]+'*'+
  chibi.bodypartCode[5]+'*'+
  chibi.bodypartCode[6]+'*'+
  chibi.bodypartCode[7]+'*'+
  chibi.bodypartCode[8]+'*'+
  chibi.bodypartCode[9]+'*'+
  chibi.bodypartCode[10]+'*'+
  chibi.bodypartCode[11]+'*'+
  chibi.thirdColour+'*'+
  chibi.nosePos+'*'+
  chibi.eyePosX+'*'+
  chibi.eyePosY+'*'+
  chibi.headWidth+'*'+
  chibi.headHeight+'*'+
  chibi.eyeColour+'*'+
  chibi.eyeSize+'*'+
  chibi.maxAge+'*'+
  chibi.fangs+'*'+
  chibi.sphynx+'*'+
  chibi.sphynxGene+'*'+
  chibi.patternAlpha+'*'+
  chibi.pattern+'*'+
  chibi.eyeColour2+'*'+
  chibi.earWidth+'*'+
  chibi.breed+'*'+
  chibi.bodypartCode[12];
;
  // console.log(outputbuffer);
  return outputbuffer;
}

// outputbuffer is array from copyChibi. Who is target chibi to splice over
function cloneChibi(outputbuffer, who) {
  let attributeArray = outputbuffer.split('*');
  selection = null;
  who.age = 3;
  who.elder = false;
  who.reachedNirvana = false;
  who.secondColour = attributeArray[1];
  who.firstColour = attributeArray[2];
  who.coatMod[0] = parseFloat(attributeArray[3]);
  who.coatMod[1] = parseFloat(attributeArray[4]);
  who.thickness = parseFloat(attributeArray[6]);
  who.legginess = parseFloat(attributeArray[7]);
  who.limbLength = parseFloat(attributeArray[9]);
  who.birthday = parseFloat(attributeArray[11]);
  who.name = attributeArray[13];
  who.love = 100;
  who.tailLength = parseFloat(attributeArray[16]);
  who.albino = (attributeArray[17] == 'true');
  who.albinoGene = (attributeArray[18] == 'true');
  who.skinColour = skinColourCheck(who.firstColour);
  for (let i = 0; i < 12; i ++) {
    who.bodypartCode[i] = parseInt(attributeArray[i+19]);
  }
  who.bodypartCode[12] = parseInt(attributeArray[48]);
  who.thirdColour = attributeArray[31];
  who.nosePos = parseFloat(attributeArray[32]);
  who.eyePosX = parseFloat(attributeArray[33]);
  who.eyePosY = parseFloat(attributeArray[34]);
  who.headWidth = parseFloat(attributeArray[35]);
  who.headHeight = parseFloat(attributeArray[36]);
  who.eyeColour = attributeArray[37];
  who.eyeSize = parseFloat(attributeArray[38]);
  who.maxAge = parseFloat(attributeArray[39]);
  who.fangs = parseFloat(attributeArray[40]);
  who.sphynx = (attributeArray[41] == 'true');
  who.sphynxGene = (attributeArray[42] == 'true');
  who.patternAlpha = parseFloat(attributeArray[43]);
  who.pattern = parseFloat(attributeArray[44]);
  who.eyeColour2 = attributeArray[45];
  who.earWidth = parseFloat(attributeArray[5]);
  who.earHeight = parseFloat(attributeArray[46]);
  who.breed = attributeArray[47];
  who.reinitSizeAndColour();
}

/**
* function to read a lifeforms's parameter string and return a valid lifeform object to be instantiated in the pool
* @param {string} outputbuffer - the lifeforms' parameter string
*/
function pasteChibi(outputbuffer) {
  let attributeArray = outputbuffer.split('*');
  if (attributeArray.length !== 49) {
    alert('Old filetype detected');
  } else {
    // push a new chibi
    chibis.push(new Chibi(canvasWidth*Math.random(), parseInt(attributeArray[8]) /* ypos */, parseInt(attributeArray[8]), parseFloat(attributeArray[10]), attributeArray[0]));
    // overwrite it
    cloneChibi(outputbuffer, chibis[chibis.length-1]);
    seeds.push(new Seed(randomColourFruity(), chibis[chibis.length-1]));
    speech.push(new Speak(chibis[chibis.length-1], neutralWord()));
    sendMessage(chibis[chibis.length-1].name + ' arrived');
    selection = null;
  }
}

/**
* function to save the selected chibis's parameter string as a file on the users device
*/
function saveToFile() {
  let txt = '';
  let chosenname = prompt('Name your file:', selection.name);
  console.log('saving to file');
  if (chosenname == null || chosenname == '') {
    chosenname = selection.name;
  } else {
    let blob = new Blob([copyChibi(selection)], {type: 'text/csv'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, txt);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = chosenname+'.chi';
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
}


/**
* function to upload a creature file from a local device
* @param {event} evt - the click event
*/
function uploadChibi() {
  let f = evt.target.files[0];
  if (f) {
    let r = new FileReader();
    r.onload = function(e) {
      let contents = e.target.result;
      loadFromFile(contents);
    };
    r.readAsText(f);
  } else {
    alert('Failed to load file');
  }
}

function openUploadDialog() {
  let element = document.createElement('div');
  element.innerHTML = '<input type="file">';
  let fileInput = element.firstChild;
  fileInput.addEventListener('change', function() {
    let file = fileInput.files[0];
    if (file.name.match(/\.(chi)$/)) {
      let reader = new FileReader();
      reader.onload = function() {
        pasteChibi(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert('File not supported, .chi only');
    }
  });
  fileInput.click();
}
