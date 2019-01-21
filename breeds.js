function breedCrossBreed(who) {
  // who.gender = 'Female';
  // who.name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
  // randomiseGenetics(who);
  // // create a male dummy
  // chibis.push(new Chibi(0, 0, 0, 0, 'Male'));
  // father = chibis[chibis.length-1];
  // father.name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
  // randomiseGenetics(father);
  // // create a baby
  // generateBaby(father, who, generateChildBreedText(father, who));
  // chibis[chibis.length-1].name = generateBabyName(father.name, who.name, chibis[chibis.length-1].gender);
  // // splice the mother and father
  // chibis.splice(chibis.length-3, 2);
}

function breedBengal(who) {
  who.pattern = 6;
  who.size = 13 + (Math.random()*5);
  who.maxSize = who.size + 2;
  who.patternAlpha = 0.5 +(Math.random()*0.5);
  let cSway = Math.random();
  who.firstColour = mixTwoColours('#660c00', '#171523', cSway);
  who.secondColour = trueBlack;
  who.thirdColour = mixTwoColours('#ffd699', '#b4d4d8', cSway);
  who.eyeColour = mixTwoColours('#cbe06b', '#627374', Math.random());
  who.thickness = 0.7;
  who.tailLength = 1;
  who.fangs = 0.85;
  who.eyePosY = 0.8;
  who.eyeposX = 1;
  who.eyeSize = 0.26;
  who.headWidth = 0.7;
  who.headHeight = 0.6;
  who.earHeight = 0.9;
  who.earWidth = 0.63;
  who.bodypartCode = [3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3];
  who.coatMod[0] = 0.6 + (Math.random()*0.16);
  who.coatMod[1] = 0.74;
  who.legginess = 0.9;
  who.nosePos = 0.7;
  who.breed = 'Bengal';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(8);
  } else {
    who.name = getRandomFemaleEthnicName(8);
  }
}

function breedEgyptianMau(who) {
  who.pattern = 6;
  who.size = 10 + (Math.random()*5);
  who.maxSize = who.size + 2;
  who.patternAlpha = 0.5 +(Math.random()*0.5);
  who.firstColour = trueBlack;
  who.secondColour = mixTwoColours('#f2f2f2', '#474c4e', Math.random());
  who.thirdColour = mixTwoColours('#97908a', '#f1d0b1', Math.random());
  who.eyeColour = mixTwoColours('#7d9e5e', '#e0bf69', Math.random());
  who.thickness = 0.6;
  who.tailLength = 1;
  who.fangs = 0.5;
  who.eyePosY = 0.65;
  who.eyeposX = 0.6;
  who.eyeSize = 0.3;
  who.headWidth = 0.52;
  who.headHeight = 0.94;
  who.earHeight = .9;
  who.earWidth = 0.4;
  who.bodypartCode = [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
  who.coatMod[1] = 0.26;
  who.coatMod[0] = 0.4 + (Math.random()*0.25);
  who.legginess = 0.8;
  who.nosePos = 0.75;
  who.breed = 'Egyptian Mau';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(5);
  } else {
    who.name = getRandomFemaleEthnicName(5);
  }
}

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
  if (who.breed == 'None') {
    who.breed = 'Albino';
  } else {
    who.breed += ' albino';
  }
}

function breedSphynx(who) {
  who.sphynx = true;
  who.sphynxGene = true;
  who.thickness = 0.5;
  who.legginess = 0.8;
  who.headWidth = 0;
  who.headHeight = 0;
  who.earWidth = 0.5 + (Math.random()*0.5);
  who.earHeight = 0.5 + (Math.random()*0.5);
  // 50/50 chance of getting an egyptian name
  if (Math.random() < 0.5 || who.breed == 'None') {
    if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
      who.name = getRandomMaleEthnicName(5);
    } else {
      who.name = getRandomFemaleEthnicName(5);
    }
  }
  who.breed = 'Sphynx';
}

function breedLykoi(who) {
  who.sphynxGene = true;
  who.legginess = 0.8;
  who.thickness = 0.5;
  who.pattern = 5;
  who.patternAlpha = 1;
  who.size = 10 + (Math.random()*2);
  who.maxSize = 14;
  who.headWidth = 0.5;
  who.patternAlpha = 1;
  who.earHeight = 1;
  who.earWidth = 0.55;
  who.nosePos = 0.35;
  who.fangs = 0.8;
  who.headWidth = 0.3;
  who.headHeight = 0;
  who.eyePosY = 0;
  who.eyePosX = 0.2;
  who.eyeSize = 0;
  who.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  who.firstColour = mixTwoColours('#1a120f', '#4f4e4d', Math.random());
  who.secondColour = mixTwoColours(trueBlack, '#343434', Math.random());
  who.thirdColour = trueBlack;
  who.eyeColour = mixTwoColours('#876d4f', '#f9c96c', Math.random());
  who.breed = 'Lykoi';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(1);
  } else {
    who.name = getRandomFemaleEthnicName(1);
  }
}

function breedTabby(who) {
  who.fangs = 0.4 + Math.random()*0.3;
  who.pattern = 3;
  who.patternAlpha = 0.5 + (Math.random()*0.5);
  who.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  who.firstColour = trueWhite;
  who.coatMod[1] = 0.74;
  who.size = 13 + (Math.random()*4);
  who.maxSize = 18;
  let coatSwitch = Math.random();
  if (coatSwitch < 1/3) {
    // orange
    who.firstColour = mixTwoColours('#f78411', '#eac8a6', Math.random());
    who.secondColour = mixTwoColours(trueBlack, '#291003', Math.random());
    who.thirdColour = trueWhite;
  } else if (coatSwitch < 2/3) {
    // brown
    who.firstColour = mixTwoColours('#876d4f', '#a09654', Math.random());
    who.secondColour = mixTwoColours(trueBlack, '#2c1f02', Math.random());
    who.thirdColour = trueWhite;
  } else {
    // greys
    who.firstColour = mixTwoColours(mixTwoColours(trueWhite, trueBlack, Math.random()), '#9cb4ca', Math.random());
    who.secondColour = mixTwoColours(trueBlack, '#160730', Math.random());
    who.thirdColour = trueWhite;
  }
  who.breed = 'Tabby';
}

function breedScottishFold(who) {
  who.earHeight = 0;
  who.earWidth = 0;
  who.eyePosY = 0.75 + (Math.random()*0.25);
  who.eyeSize = 0.5 + (Math.random()*0.5);
  who.maxSize = 17;
  who.size = 12 + (Math.random()*4);
  who.thickness = 0.5;
  who.legginess = Math.random()*0.5;
  who.headWidth = 0.5;
  who.headHeight = who.headWidth/1.4;
  who.breed = 'Scottish Fold';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(3);
  } else {
    who.name = getRandomFemaleEthnicName(3);
  }
}

function breedManx(who) {
  who.headWidth = 1;
  who.headHeight = who.headWidth/50*35;
  who.legginess = 0.7 + (Math.random()*0.3);
  who.pattern = 3;
  who.patternAlpha = 0.5 + (Math.random()*0.5);
  who.tailLength = 0;
  who.eyeSize = 0.7 + (Math.random()*0.3);
  who.eyeColour = mixTwoColours('#e4ac2b', '#d3740d', Math.random());
  who.breed = 'Manx';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(3);
  } else {
    who.name = getRandomFemaleEthnicName(3);
  }
}

function breedBobtail(who) {
  who.headWidth = 1;
  who.headHeight = who.headWidth/50*35;
  who.legginess = 0.7 + (Math.random()*0.3);
  who.thickness = 0.5 + (Math.random()*0.2);
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
  who.breed = 'Bobtail';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(9);
  } else {
    who.name = getRandomFemaleEthnicName(9);
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
  who.earWidth = 0.55;
  who.earHeight = 0.55;
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(2);
  } else {
    who.name = getRandomFemaleEthnicName(2);
  }
  who.breed = 'Persian';
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
  who.nosePos = 0.65;
  who.headWidth = 0.3;
  who.headHeight = 0.16;
  who.thickness = (Math.random()*0.5) + 0.5;
  who.fangs = Math.random()*0.6;
  who.bodypartCode = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  who.tailLength = 0.5 + (Math.random()*0.5);
  who.eyeColour = (mixTwoColours('#60a277', '#8dd86a', Math.random()));
  who.breed = 'Russian Blue';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(11);
  } else {
    who.name = getRandomFemaleEthnicName(11);
  }
}

function breedCalico(who) {
  who.firstColour = trueWhite;
  who.secondColour = mixTwoColours(trueBlack, randomColourRealistic((2/3) + (Math.random()/3)), (Math.random()*0.3) + 0.7); // a dark grey
  who.thirdColour = mixTwoColours('#e8831e', '#c89c7a', Math.random());
  who.breed = 'Calico';
}

function breedTortoiseShell(who) {
  breedCalico(who);
  who.patternAlpha = 1;
  who.pattern = 1;
  who.breed = 'Tortoiseshell';
}

function breedSiamese(who) {
  who.patternAlpha = Math.random();
  who.pattern = 4;
  let cSway = Math.random();
  who.headHeight = 0;
  who.headWidth = 0.2;
  who.thickness = 0.5;
  who.fangs = 0.3 + (Math.random()*0.5);
  who.bodypartCode = [2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2];
  who.coatMod[1] = 0.21;
  who.legginess = 0.6 + (Math.random()*0.25);
  who.firstColour = mixTwoColours('#140200', '#290019', cSway);
  who.secondColour = mixTwoColours('#ffd699', '#ffffff', cSway);
  who.thirdColour = who.firstColour;
  who.eyeColour = mixTwoColours('#99e7ff', '#008cb8', Math.random());
  who.eyeSize = 0;
  who.eyePosX = 0.2;
  who.eyePosY = 0.5;
  who.coatMod[0] = Math.random();
  who.nosePos = 0.5;
  who.earWidth = 0.5;
  who.earHeight = 0.6;
  if (Math.random() < 0.5) {
    who.firstColour = decreaseSaturationHEX(who.firstColour, 1 + (Math.random()*9));
    who.secondColour = decreaseSaturationHEX(who.secondColour, 1 + (Math.random()*9));
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, 1 + (Math.random()*9));
  }
  who.breed = 'Siamese';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(13);
  } else {
    who.name = getRandomFemaleEthnicName(13);
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
  who.bodypartCode = [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0];
  who.coatMod[0] = 0.6 + (Math.random()*0.4);
  who.coatMod[1] = 0.21;
  who.legginess = 0.8 + (Math.random()*0.2);
  who.firstColour = mixTwoColours('#0e0b0b', '#3e2d14', cSway);
  who.secondColour = mixTwoColours('#8a652e', '#ffffff', cSway);
  who.thirdColour = who.firstColour;
  who.eyeColour = mixTwoColours('#ffe147', '#a26a45', Math.random());
  who.eyeSize = 0.25;
  who.eyePosX = 0.2;
  who.eyePosY = 0.5;
  who.nosePos = 0.6;
  who.earWidth = 0.5;
  who.earHeight = 0.6;
  if (Math.random() < 0.5) {
    who.firstColour = decreaseSaturationHEX(who.firstColour, 1 + (Math.random()*9));
    who.secondColour = decreaseSaturationHEX(who.secondColour, 1 + (Math.random()*9));
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, 1 + (Math.random()*9));
  }
  who.breed = 'Burmese';
  if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
    who.name = getRandomMaleEthnicName(13);
  } else {
    who.name = getRandomFemaleEthnicName(13);
  }
}
