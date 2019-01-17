function breedHeteroChromia(who, seed) {
  // heterochromia
  if (seed <= 0.03) {
    let blue = 192 + Math.floor(Math.random()*63);
    let red = 128 + Math.floor(Math.random()*52);
    let green = 99 + Math.floor(Math.random()*red/2);
    let blue2 = Math.round(green/2);
    let greenRed = Math.floor(Math.random()*(blue-64));
    // if the first eye is mostly blue
    if (hexToRgb(who.eyeColour).b > hexToRgb(who.eyeColour).r && hexToRgb(who.eyeColour).g) {
      who.eyeColour2 = rgbToHex(red, green, blue2);
    } else {
      who.eyeColour2 = rgbToHex(greenRed, greenRed, blue);
    }
  }
}

function breedAlbino(who) {
  who.albino = true;
  who.pattern = 0;
  if (boxes[thisCatBox].text == '') {
    boxes[thisCatBox].text = 'Albino';
  } else {
    boxes[thisCatBox].text += ' albino';
  }
}

function breedSphynx(who) {
  who.sphynx = true;
  who.sphynxGene = true;
  who.thickness = 0.5;
  who.headWidth = 0;
  who.headHeight = 0;
  if (boxes[thisCatBox].text == '') {
    boxes[thisCatBox].text = 'Sphynx';
  } else {
    boxes[thisCatBox].text += ' sphynx';
  }
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(9);
  } else {
    who.name = getRandomFemaleEthnicName(9);
  }
}

function breedTabby(who) {
  who.fangs = 0.4 + Math.random()*0.3;
  who.pattern = 3;
  who.patternAlpha = 0.25 + (Math.random()*0.75);
  who.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  who.firstColour = trueWhite;
  let coatSwitch = Math.random();
  if (coatSwitch < 1/3) {
    // orange
    who.secondColour = mixTwoColours('#f78411', '#dab896', Math.random());
    who.firstColour = mixTwoColours(trueWhite, who.secondColour, Math.random());
  } else if (coatSwitch < 2/3) {
    // brown
    who.firstColour = mixTwoColours(trueWhite, mixTwoColours('#1c0f02', '#d3c16f', Math.random()), Math.random());
    who.secondColour = mixTwoColours(who.firstColour, '#1c0f02', Math.random());
  } else {
    // greys
    who.secondColour = mixTwoColours(mixTwoColours(trueWhite, trueBlack, Math.random()), '#2c2f44', Math.random());
    who.firstColour = mixTwoColours(trueWhite, who.secondColour, Math.random());
  }
  who.thirdColour = trueBlack;
  boxes[thisCatBox].text = 'Tabby';
}

function breedManx(who) {
  who.headWith = 1;
  who.headHeight = 0.75;
  who.legginess = 0.7 + (Math.random()*0.3);
  who.pattern = 3;
  who.patternAlpha = 0.5 + (Math.random()*0.5);
  who.tailLength = 0;
  who.eyeSize = 0.7 + (Math.random()*0.3);
  who.eyeColour = mixTwoColours('#e4ac2b', '#d3740d', Math.random());
  boxes[thisCatBox].text = 'Manx';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(0);
  } else {
    who.name = getRandomFemaleEthnicName(0);
  }
}

function breedBobtail(who) {
  who.headWith = 1;
  who.headHeight = 0.75;
  who.legginess = 0.7 + (Math.random()*0.3);
  this.thickness = 0.3;
  who.pattern = 0;
  who.patternAlpha = 0;
  who.tailLength = 0;
  who.eyeSize = 0.2;
  who.bodypartCode[2] = 0;
  who.bodypartCode[5] = 0;
  if (who.gender == 'Male') {
    who.firstColour = trueWhite;
    who.secondColour = who.thirdColour;
  } else {
    who.firstColour = trueWhite;
    who.secondColour = trueBlack;
  }
  who.coatMod[0] = 0;
  boxes[thisCatBox].text = 'Bobtail';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(2);
  } else {
    who.name = getRandomFemaleEthnicName(2);
  }
}

function breedPersian(who) {
  who.patternAlpha = 0;
  who.pattern = 0;
  cSway = Math.random();
  who.thickness = 1;
  who.headWidth = 1;
  who.headHeight = 1;
  who.size = (Math.random()*9) + 7;
  who.maxSize = who.size + (Math.random()*4);
  who.eyePosX = 0.33;
  who.eyePosY = 0.33;
  who.fangs = 0.2;
  who.firstColour = mixTwoColours('#36332f', '#ffebf2', cSway);
  who.secondColour = mixTwoColours('#31210c', '#290f00', cSway);
  who.thirdColour = mixTwoColours('#000000', '#001401', cSway);
  who.eyeColour = mixTwoColours('#c5e93d', '#e08700', Math.random());
  who.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  who.coatMod[0] = Math.random()*0.6;
  who.coatMod[1] = 0.29;
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(10);
  } else {
    who.name = getRandomFemaleEthnicName(10);
  }
  boxes[thisCatBox].text = 'Persian';
}

function breedRussianBlue(who) {
  who.patternAlpha = 0;
  who.pattern = 0;
  who.firstColour = '#15151c';
  who.secondColour = mixTwoColours('#a6c4ef', trueBlack, 1 - (Math.random()*0.8));
  who.thirdColour = '#25252c';
  who.coatMod[0] = 0.5;
  who.coatMod[1] = 0.21;
  who.headHeight = 0;
  who.headWidth = 0;
  who.thickness = (Math.random()*0.5) + 0.5;
  who.fangs = Math.random()*0.6;
  who.bodypartCode = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  who.tailLength = 0.5 + (Math.random()*0.5);
  who.eyeColour = (mixTwoColours('#60a277', '#8dd86a', Math.random()));
  boxes[thisCatBox].text = 'Russian Blue';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(12);
  } else {
    who.name = getRandomFemaleEthnicName(12);
  }
}

function breedCalico(who) {
  who.firstColour = trueWhite;
  who.secondColour = mixTwoColours(trueBlack, randomColourRealistic((2/3) + (Math.random()/3)), (Math.random()*0.3) + 0.7); // a dark grey
  who.thirdColour = mixTwoColours('#e8831e', '#c89c7a', Math.random());
  boxes[thisCatBox].text = 'Calico';
}

function breedTortoiseShell(who) {
  breedCalico(who);
  who.patternAlpha = 1;
  who.pattern = 1;
  boxes[thisCatBox].text = 'Tortoiseshell';
}

function breedSiamese(who) {
  who.patternAlpha = Math.random();
  who.pattern = 4;
  let cSway = Math.random();
  who.headHeight = 0;
  who.headWidth = 0.2;
  who.thickness = 0.5;
  who.fangs = 0.3 + (Math.random()*0.5);
  who.bodypartCode = [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1];
  who.coatMod[1] = 0.21;
  who.legginess = 0.6 + (Math.random()*0.25);
  who.firstColour = mixTwoColours('#ffd699', '#ffffff', cSway);
  who.secondColour = mixTwoColours('#140200', '#290019', cSway);
  who.thirdColour = who.secondColour;
  who.eyeColour = mixTwoColours('#99e7ff', '#008cb8', Math.random());
  who.eyeSize = 0;
  who.eyePosX = 0.2;
  who.eyePosY = 0.5;
  who.coatMod[0] = Math.random();
  who.nosePos = 0.5;
  who.reinitSizes();
  if (Math.random() < 0.5) {
    who.firstColour = decreaseSaturationHEX(who.firstColour, 1 + (Math.random()*9));
    who.secondColour = decreaseSaturationHEX(who.secondColour, 1 + (Math.random()*9));
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, 1 + (Math.random()*9));
  }
  boxes[thisCatBox].text = 'Siamese';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(11);
  } else {
    who.name = getRandomFemaleEthnicName(11);
  }
}

function breedBurmese(who) {
  who.patternAlpha = Math.random();
  who.pattern = 4;
  let cSway = Math.random();
  who.headHeight = 0;
  who.headWidth = 0.4;
  who.thickness = 0.5 + (Math.random()*0.2);
  who.fangs = Math.random()*0.5;
  who.bodypartCode = [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 2];
  who.coatMod[1] = 0.21;
  who.legginess = 0.8 + (Math.random()*0.2);
  who.firstColour = mixTwoColours('#8a652e', '#ffffff', cSway);
  who.secondColour = mixTwoColours('#0e0b0b', '#3e2d14', cSway);
  who.thirdColour = mixTwoColours('#3e2d14', who.secondColour, cSway);
  who.eyeColour = mixTwoColours('#ffe147', '#a26a45', Math.random());
  who.eyeSize = 0.25;
  who.eyePosX = 0.2;
  who.eyePosY = 0.5;
  who.coatMod[0] = 0.6 + (Math.random()*0.2);
  who.nosePos = 0.6;
  who.reinitSizes();
  if (Math.random() < 0.5) {
    who.firstColour = decreaseSaturationHEX(who.firstColour, 1 + (Math.random()*9));
    who.secondColour = decreaseSaturationHEX(who.secondColour, 1 + (Math.random()*9));
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, 1 + (Math.random()*9));
  }
  boxes[thisCatBox].text = 'Burmese';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(11);
  } else {
    who.name = getRandomFemaleEthnicName(11);
  }
}
