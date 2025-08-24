/**
* function to copy all of a chitten's parameters into a string for saving or cloning
* @param {object} chitten -the chitten to be cloned
* @return {string} outputbuffer - all the chitten's parameters stored as a string
*/
function copyChitten(chitten) {
  let outputbuffer =
  chitten.gender+'*'+
  chitten.secondColour+'*'+
  chitten.firstColour+'*'+
  chitten.coatMod[0]+'*'+
  chitten.coatMod[1]+'*'+
  chitten.earWidth+'*'+
  chitten.thickness+'*'+
  chitten.legginess+'*'+
  chitten.size+'*'+
  chitten.limbLength+'*'+
  chitten.maxSize+'*'+
  chitten.birthday+'*'+
  chitten.age+'*'+
  chitten.name+'*'+
  chitten.elder+'*'+
  chitten.reachedNirvana+'*'+
  chitten.tailLength+'*'+
  chitten.albino+'*'+
  chitten.albinoGene+'*'+
  chitten.bodypartCode[0]+'*'+
  chitten.bodypartCode[1]+'*'+
  chitten.bodypartCode[2]+'*'+
  chitten.bodypartCode[3]+'*'+
  chitten.bodypartCode[4]+'*'+
  chitten.bodypartCode[5]+'*'+
  chitten.bodypartCode[6]+'*'+
  chitten.bodypartCode[7]+'*'+
  chitten.bodypartCode[8]+'*'+
  chitten.bodypartCode[9]+'*'+
  chitten.bodypartCode[10]+'*'+
  chitten.bodypartCode[11]+'*'+
  chitten.thirdColour+'*'+
  chitten.nosePos+'*'+
  chitten.eyePosX+'*'+
  chitten.eyePosY+'*'+
  chitten.headWidth+'*'+
  chitten.headHeight+'*'+
  chitten.eyeColour+'*'+
  chitten.eyeSize+'*'+
  chitten.maxAge+'*'+
  chitten.fangs+'*'+
  chitten.hairlessGene+'*'+
  chitten.hairless+'*'+
  chitten.lykoiGene+'*'+
  chitten.lykoi+'*'+
  chitten.heterochromicGene+'*'+
  chitten.patternAlpha+'*'+
  chitten.pattern+'*'+
  chitten.eyeColour2+'*'+
  chitten.earHeight+'*'+
  chitten.breed+'*'+
  chitten.bodypartCode[12];
;
  // console.log(outputbuffer);
  return outputbuffer;
}

// outputbuffer is array from copyChitten. Who is target chitten to splice over
function cloneChitten(outputbuffer, who) {
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
  who.bodypartCode[12] = parseInt(attributeArray[50]);
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
  who.hairlessGene = (attributeArray[41] == 'true');
  who.hairless = (attributeArray[42] == 'true');
  who.lykoiGene = (attributeArray[43] == 'true');
  who.lykoi = (attributeArray[44] == 'true');
  who.heterochromicGene = (attributeArray[45] == 'true');
  who.patternAlpha = parseFloat(attributeArray[46]);
  who.pattern = parseFloat(attributeArray[47]);
  who.eyeColour2 = attributeArray[48];
  who.earWidth = parseFloat(attributeArray[5]);
  who.earHeight = parseFloat(attributeArray[49]);
  who.breed = attributeArray[50];
  who.reinitSizeAndColour();
}

/**
* function to read a lifeforms's parameter string and return a valid lifeform object to be instantiated in the pool
* @param {string} outputbuffer - the lifeforms' parameter string
*/
function pasteChitten(outputbuffer) {
  let attributeArray = outputbuffer.split('*');
  if (attributeArray.length !== 49) {
    alert('Old filetype detected');
  } else {
    // push a new chitten
    chittens.push(new Chitten(canvasWidth*Math.random(), parseInt(attributeArray[8]) /* ypos */, parseInt(attributeArray[8]), parseFloat(attributeArray[10]), attributeArray[0]));
    // overwrite it
    cloneChitten(outputbuffer, chittens[chittens.length-1]);
    seeds.push(new Seed(randomColourFruity(), chittens[chittens.length-1]));
    speech.push(new Speak(chittens[chittens.length-1], neutralWord()));
    sendMessage(chittens[chittens.length-1].name + ' arrived');
    selection = null;
  }
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
    let blob = new Blob([copyChitten(selection)], {type: 'text/csv'});
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

// OLD METHOD - NOT CALLED
/**
* function to upload a creature file from a local device
* @param {event} evt - the click event
*/
function uploadChitten() {
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
        pasteChitten(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert('File not supported, .chi only');
    }
  });
  fileInput.click();
}
