function breedAlbino(who) {
  who.albino = true;
  who.pattern = 0;
}

function breedSphynx(who) {
  who.sphynx = true;
  who.sphynxGene = true;
  who.thickness = 0.5;
  who.headWidth = 0;
  who.headHeight = 0;
}

function breedPersian(who) {
  who.patternAlpha = 0;
  who.pattern = 0;
  cSway = Math.random();
  if (Math.random() < 0.5) {
    cSway /= 2;
  } else {
    cSway *= 2
    if (cSway > 1) {
      cSway = 1;
    }
  }
  who.thickness = 1;
  who.headWidth = 1;
  who.headHeight = 1;
  who.size = (Math.random()*9) + 7;
  who.maxSize = who.size + (Math.random()*4);
  who.eyePosX = 0.33;
  who.eyePosY = 0.33;
  who.fangs = 0.2;
  who.firstColour = mixTwoColours ('#a78a68', '#ffebf2', cSway);
  who.secondColour = mixTwoColours ('#271f14', '#290f00', cSway);
  who.thirdColour = mixTwoColours ('#000000', '#001401', cSway);
  who.eyeColour = mixTwoColours ('#ecd73e', '#e08700', Math.random());
  who.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  who.coatMod[0] = 0.58;
  who.coatMod[1] = 0.29;
}

function breedRussianBlue(who) {
  who.patternAlpha = 0;
  who.pattern = 0;
  who.firstColour = '#25252c';
  who.secondColour = '#b6d4ff';
  who.thirdColour = '#25252c';
  who.coatMod[1] = 0.21;
  who.headHeight = 0;
  who.headWidth = 0;
  who.thickness = (Math.random()*0.5) + 0.5;
  who.fangs = Math.random()*0.6;
  who.bodypartCode = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  who.tailLength = 0.5 + (Math.random()*0.5);
  who.eyeColour = (mixTwoColours('#60a277', '#8dd86a', Math.random()));
}

function breedCalico(who) {
  who.firstColour = trueWhite;
  who.secondColour = mixTwoColours(trueBlack, randomColourRealistic((2/3) + (Math.random()/3)), (Math.random()*0.3) + 0.7); // a dark grey
  who.thirdColour = mixTwoColours('#e8831e', '#c89c7a', Math.random());
}

function breedTortoiseShell(who) {
  breedCalico(who);
  who.patternAlpha = 1;
  who.pattern = 1;
}

function breedSiamese(who) {
  who.patternAlpha = 0;
  who.pattern = 0;
  let cSway = Math.random();
  who.headHeight = 0;
  who.headWidth = 0;
  who.thickness = (Math.random()*0.5) + 0.5;
  who.fangs = 0.3 + (Math.random()*0.5);
  who.bodypartCode = [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1];
  who.coatMod[1] = 0.21;
  who.legginess = Math.random()*0.6;
  who.firstColour = mixTwoColours('#ffd699', '#ffffff', cSway);
  who.secondColour = mixTwoColours('#140200', '#290019', cSway);
  who.thirdColour = mixTwoColours('#ffd6db', '#291800', cSway);
  who.eyeColour = mixTwoColours('#99e7ff', '#008cb8', Math.random());
  who.coatMod[0] = Math.random();
  who.nosePos = 0.5;
  who.reinitSizes();
  if (Math.random() < 0.5) {
    who.firstColour = decreaseSaturationHEX(who.firstColour, 1 + (Math.random()*9));
    who.secondColour = decreaseSaturationHEX(who.secondColour, 1 + (Math.random()*9));
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, 1 + (Math.random()*9));
  }
}
