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
  chibi.ears+'*'+
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
  chibi.tailLength;
  console.log(outputbuffer);
  return outputbuffer;
}

/**
* function to read a lifeforms's parameter string and return a valid lifeform object to be instantiated in the pool
* @param {string} chibi - the lifeforms' parameter string
* @return {Chibi} copyBuffer - the buffer array for copies of lifeforms
*/
function pasteChibi(outputbuffer) {

  let attributeArray = outputbuffer.split('*');
  if (attributeArray.length !== 17) {
    sendMessage('Old filetype detected. Converting to 0.51');
    attributeArray.push(0.5);
    //return 'X';
  } if (attributeArray.length !== 17) {
    alert('Failed to load file');
  } else {
    chibis.splice(currentChibis, 9);
    boxes = [];
    buttons[0].visible = false;
    buttons[1].visible = false;
    buttons[2].visible = false;
    labels[0].visible = false;
    labels[1].visible = false;
    buttons[6].visible = false;
    choosingChibi = false;
    selection = null;
    chibis.push(new Chibi(canvasWidth*Math.random(), parseInt(attributeArray[8]) /* ypos */, parseInt(attributeArray[8]), parseFloat(attributeArray[10]), attributeArray[0], parseFloat(attributeArray[5])));
    // console.log(outputbuffer);
    chibis[chibis.length-1].secondColour = attributeArray[1];
    chibis[chibis.length-1].firstColour = attributeArray[2];
    chibis[chibis.length-1].coatMod[0] = parseFloat(attributeArray[3]);
    chibis[chibis.length-1].coatMod[1] = parseFloat(attributeArray[4]);
    chibis[chibis.length-1].thickness = parseFloat(attributeArray[6]);
    chibis[chibis.length-1].legginess = parseFloat(attributeArray[7]);
    chibis[chibis.length-1].limbLength = parseFloat(attributeArray[9]);
    chibis[chibis.length-1].birthday = parseFloat(attributeArray[11]);
    chibis[chibis.length-1].age = parseFloat(attributeArray[12]);
    chibis[chibis.length-1].name = attributeArray[13];
    chibis[chibis.length-1].elder = (attributeArray[14] == true);
    chibis[chibis.length-1].reachedNirvana = (attributeArray[15] == true);
    chibis[chibis.length-1].love = 100;
    chibis[chibis.length-1].tailLength = parseFloat(attributeArray[16]);
    seeds.push(new Seed(randomColourFruity(), chibis[chibis.length-1]));
    seeds.push(new Seed(randomColourFruity(), chibis[chibis.length-1]));
    seeds[seeds.length-1].timer = 750;

    if (chibis[chibis.length-1].gender == 'Female') {
      chosenChibiF = true;
    } else if (chibis[chibis.length-1].gender == 'Male') {
        chosenChibiM = true;
      }
    sendMessage(chibis[chibis.length-1].name+' arrived');
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
            //console.log(reader.result);
            pasteChibi(reader.result);
        };
reader.readAsText(file);
    } else {
        alert('File not supported, .chi only');
    }
});

fileInput.click();
}
