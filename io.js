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
  chitten.coordination+'*'+
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
  chitten.colourpointGene+'*'+
  chitten.colourpointExpressed+'*'+
  chitten.colourpointMap[0]+'*'+
  chitten.colourpointMap[1]+'*'+
  chitten.colourpointMap[2]+'*'+
  chitten.colourpointMap[3]+'*'+
  chitten.patternAlpha+'*'+
  chitten.pattern+'*'+
  chitten.eyeColour2+'*'+
  chitten.earHeight+'*'+
  chitten.breed+'*'+
  chitten.bodypartCode[12]+'*'+
  chitten.mawSize;
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
  who.coordination = parseFloat(attributeArray[8]);
  who.limbLength = parseFloat(attributeArray[10]);
  who.birthday = parseFloat(attributeArray[12]);
  who.name = attributeArray[14];
  who.love = 100;
  who.tailLength = parseFloat(attributeArray[17]);
  who.albino = (attributeArray[18] == 'true');
  who.albinoGene = (attributeArray[19] == 'true');
  who.skinColour = skinColourCheck(who.firstColour);
  for (let i = 0; i < 12; i ++) {
    who.bodypartCode[i] = parseInt(attributeArray[i+20]);
  }
  who.bodypartCode[12] = parseInt(attributeArray[52]);
  who.thirdColour = attributeArray[32];
  who.nosePos = parseFloat(attributeArray[33]);
  who.eyePosX = parseFloat(attributeArray[34]);
  who.eyePosY = parseFloat(attributeArray[35]);
  who.headWidth = parseFloat(attributeArray[36]);
  who.headHeight = parseFloat(attributeArray[37]);
  who.eyeColour = attributeArray[38];
  who.eyeSize = parseFloat(attributeArray[39]);
  who.maxAge = parseFloat(attributeArray[40]);
  who.fangs = parseFloat(attributeArray[41]);
  who.hairlessGene = (attributeArray[42] == 'true');
  who.hairless = (attributeArray[43] == 'true');
  who.lykoiGene = (attributeArray[44] == 'true');
  who.lykoi = (attributeArray[45] == 'true');
  who.heterochromicGene = (attributeArray[46] == 'true');
  who.colourpointGene = (attributeArray[47] == 'true');
  who.colourpointExpressed = (attributeArray[48] == 'true');
  who.colourpointMap[0] = (attributeArray[49] == 'true'); // chin
  who.colourpointMap[1] = (attributeArray[50] == 'true'); // ears
  who.colourpointMap[2] = (attributeArray[51] == 'true'); // feet
  who.colourpointMap[3] = (attributeArray[52] == 'true'); // tail
  who.patternAlpha = parseFloat(attributeArray[53]);
  who.pattern = parseFloat(attributeArray[54]);
  who.eyeColour2 = attributeArray[55];
  who.earWidth = parseFloat(attributeArray[5]);
  who.earHeight = parseFloat(attributeArray[56]);
  who.breed = attributeArray[57];
  who.bodypartCode[12] = attributeArray[58];
  who.mawSize = attributeArray[59];
  who.reinitSizeAndColour();
}

/**
* function to read a lifeforms's parameter string and return a valid lifeform object to be instantiated in the pool
* @param {string} outputbuffer - the lifeforms' parameter string
*/
function pasteChitten(outputbuffer) {
  let attributeArray = outputbuffer.split('*');
  if (attributeArray.length !== 60) {
    alert('Old filetype detected');
  } else {
    // push a new chitten
    chittens.push(new Chitten(canvasWidth*Math.random(), parseInt(attributeArray[9]) /* ypos */, parseInt(attributeArray[9]), parseFloat(attributeArray[11]), attributeArray[0]));
    // overwrite it
    cloneChitten(outputbuffer, chittens[chittens.length-1]);
    seeds.push(new Seed(randomColourFruity(), chittens[chittens.length-1]));
    addSpeech(chittens[chittens.length-1], neutralWord());
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
