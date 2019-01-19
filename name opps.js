// Version 0.05
/**
* function generate a baby name from two parents
* @param {string} maleName - the male parent's name
* @param {string} femaleName - the female parent's name
* @param {string} gender - the desired gender
*/
function generateBabyName(maleName, femaleName, gender) {
  // console.log('generate '+gender+' baby for '+maleName+' & '+femaleName);
  let stop = false;
  let ethnic = null;
  let thisSeed = null;
  let nameLogic = 'random';
  let nameLogicChance = Math.random();
  if (nameLogicChance < 0.49) {
    nameLogic = 'maleParent';
  } else if (nameLogicChance < 0.98) {
    nameLogic = 'femaleParent';
  }
  if (nameLogic == 'random') {
    if (gender == 'Male' || (gender == 'Non Binary' && Math.random() < 0.5)) {
      result = getMaleName(Math.floor(Math.random()*((numlibs * namesinlib))));
    } else {
      result = getFemaleName(Math.floor(Math.random()*((numlibs * namesinlib))));
    }
    // male parent
  } else if (nameLogic == 'maleParent') {
    ethnic = getLibraryName(maleName, 'Male');
  } else {
    ethnic = getLibraryName(femaleName, 'Female');
  }

  // now process it
  thisSeed = Math.floor(Math.random()*namesinlib);
  for (let i = 0; i < numlibs; i++) {
    if (ethnic == nameArrayNames[i]) {
      if (gender == 'Male' || (gender == 'Non Binary' && Math.random() < 0.5)) {
        result = maleNameArray[i][thisSeed];
      } else {
        result = femaleNameArray[i][thisSeed];
      }
    }
  }
  // check if this name already exists in the game
  let flagged = false;
  for (let c = 0; c < chibis.length && !flagged; c++) {
    if (chibis[c].name == result) {
      flagged = true;
    }
  }
  if (flagged) {
    // console.log('Prevented from picking name that is already in the game '+result);
    result = generateBabyName(maleName, femaleName, gender);
  }
  if (result == null) {
    console.log('null name error Stop is '+stop+' Ethnic was '+ethnic+' namelogic was '+nameLogic+' Parents were '+maleName+' & '+femaleName+' gender was '+gender+' seed was '+thisSeed);
  }
  return result;
};

/**
* function to return a male name, when fed a number that is between 0 and the total number of male names
*/
function getMaleName(index) {
  let seedTrans = index;
  for (let i = 0; i < numlibs; i++) {
    if (index < ((i+1)) * namesinlib) {
      seedTrans = (index - (i * namesinlib));
      return maleNameArray[i][seedTrans];
    }
  }
  console.log('error m');
};

/**
* function to return a male name, when fed a number that is between 0 and the total number of female names
*/
function getFemaleName(index) {
  let seedTrans = index;
  for (let i = 0; i < numlibs; i++) {
    if (index < ((i+1)) * namesinlib) {
      seedTrans = (index - (i * namesinlib));
      return femaleNameArray[i][seedTrans];
    }
  }
  console.log('error f');
};

/**
* function to return a male name, when fed a number that is between 0 and the total number of male libraries
*/
function getRandomMaleEthnicName(ethnicity) {
  let index = Math.round(Math.random()*(namesinlib-1));
  return maleNameArray[ethnicity][index];
  console.log('oops M '+ethnicity);
}

/**
* function to return a female name, when fed a number that is between 0 and the total number of female libraries
*/
function getRandomFemaleEthnicName(ethnicity) {
  let index = Math.round(Math.random()*(namesinlib-1));
  return femaleNameArray[ethnicity][index];
  console.log('oops F '+ethnicity);
}

/**
* function to return the Library name for a given name and gender
*/
function getLibraryName(name, gender) {
  if (gender == 'Male') {
    for (let l = 0; l < numlibs; l++) {
      for (let i = 0; i < namesinlib; i++) {
        if (name == maleNameArray[l][i]) {
          return nameArrayNames[l];
        }
      }
    }
  } else if (gender == 'Female') {
    for (let l = 0; l < numlibs; l++) {
      for (let i = 0; i < namesinlib; i++) {
        if (name == femaleNameArray[l][i]) {
          return nameArrayNames[l];
        }
      }
    }
  }
  console.log('error GLN '+name+' '+gender);
};


function reportNames() {
  console.log('Initialising names database');
  if (nameArrayNames.length !== maleNameArray.length || nameArrayNames.length !== femaleNameArray.length) {
    console.log('error - library index does not match library contents');
  }
  /* HARDCORE DATABASE INTEGRITY TESTING */
  // let stop = false;
  // let t = 0;
  // let gname = getFemaleName(Math.round(Math.random()*totalFemaleNames));
  // let bname = getMaleName(Math.round(Math.random()*totalMaleNames));
  //   gname = generateBabyName(bname, gname, 'Female');
  //   bname = generateBabyName(bname, gname, 'Male');
  //   if (gname == null) {
  //     console.log('null name after '+t+' parents were '+myGuys[1].name+' and '+gname);
  //     stop = true;
  //   }
  //   if (bname == null) {
  //     console.log('null name after '+t+' parents were '+bname+' and '+myGuys[0].name);
  //     stop = true;
  //   }
  // gname = getRandomFemaleEthnicName(Math.round(Math.random()*(numlibs-1)));
  // bname = getRandomMaleEthnicName(Math.round(Math.random()*(numlibs-1)));
  // for (t = 0; t < 1000000 && !stop; t++) {
  //   gname = generateBabyName(bname, gname, 'Female');
  //   bname = generateBabyName(bname, gname, 'Male');
  //   if (gname == null) {
  //     console.log('null name after '+t+' parents were '+myGuys[1].name+' and '+gname);
  //     stop = true;
  //   }
  //   if (bname == null) {
  //     console.log('null name after '+t+' parents were '+bname+' and '+myGuys[0].name);
  //     stop = true;
  //   }
  // }
  // console.log('passed test '+t+' times');
  // check for duplicates
  for (let i = 0; i < namesinlib * numlibs; i++) {
    let duplicateF = 0;
    let duplicateM = 0;
    for (let j = 0; j < namesinlib * numlibs; j++) {
      if (getFemaleName(i) == getFemaleName(j)) {
        duplicateF ++;
      }
      if (getFemaleName(i) == getMaleName(j)) {
        duplicateF ++;
      }
      if (getMaleName(i) == getMaleName(j)) {
        duplicateM ++;
      }
      if (getMaleName(i) == getFemaleName(j)) {
        duplicateM ++;
      }
    }
    if (duplicateF > 1 || duplicateM > 1) {
      console.log('Duplicate name found in dictionary');
      if (duplicateF > 1) {
        console.log(getFemaleName(i));
      } else {
        console.log(getMaleName(i));
      }
    }
  }
  // let lString = '';
  // for (let i = 0; i < numlibs; i++) {
  //   lString += ' '+getLibraryName(getMaleName(i*namesinlib), 'Male');
  // }
  // console.log(lString);
  return numlibs+' name libraries succesfully loaded';
};
