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
  let result = null;
  let nameLogicChance = Math.random();
  if (nameLogicChance < 0.49) {
    nameLogic = 'maleParent';
  } else if (nameLogicChance < 0.98) {
    nameLogic = 'femaleParent';
  }
  if (nameLogic == 'random') {
    if (gender == 'Male' || (gender == 'Non Binary' && Math.random() < 0.5)) {
      result = getMaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
    } else {
      result = getFemaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
    }
    // male parent
  } else if (nameLogic == 'maleParent') {
    ethnic = getLibraryName(maleName, 'Male');
  } else {
    ethnic = getLibraryName(femaleName, 'Female');
  }

  // now process it
  thisSeed = Math.floor(Math.random() * namesinlib);
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
  for (let c = 0; c < chittens.length && !flagged; c++) {
    if (chittens[c].name == result) {
      flagged = true;
    }
  }
  if (flagged) {
    // console.log('Prevented from picking name that is already in the game '+result);
    result = generateBabyName(maleName, femaleName, gender);
  }
  if (result == null) {
    console.log('null name error Stop is ' + stop + ' Ethnic was ' + ethnic + ' namelogic was ' + nameLogic + ' Parents were ' + maleName + ' & ' + femaleName + ' gender was ' + gender + ' seed was ' + thisSeed);
  }
  return result;
};

/**
* function to return a male name, when fed a number that is between 0 and the total number of male names
*/
function getMaleName(index) {
  let seedTrans = index;
  for (let i = 0; i < numlibs; i++) {
    if (index < ((i + 1)) * namesinlib) {
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
    if (index < ((i + 1)) * namesinlib) {
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
  let index = Math.round(Math.random() * (namesinlib - 1));
  return maleNameArray[ethnicity][index];
  console.log('oops M ' + ethnicity);
}

/**
* function to return a female name, when fed a number that is between 0 and the total number of female libraries
*/
function getRandomFemaleEthnicName(ethnicity) {
  let index = Math.round(Math.random() * (namesinlib - 1));
  return femaleNameArray[ethnicity][index];
  console.log('oops F ' + ethnicity);
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
  console.log('error GLN ' + name + ' ' + gender);
};


function reportNames() {
  console.log('Initialising names database');
  if (nameArrayNames.length !== maleNameArray.length || nameArrayNames.length !== femaleNameArray.length) {
    console.log('error - library index does not match library contents');
  }
  // check for duplicates
  for (let i = 0; i < namesinlib * numlibs; i++) {
    let duplicateF = 0;
    let duplicateM = 0;
    for (let j = 0; j < namesinlib * numlibs; j++) {
      if (getFemaleName(i) == getFemaleName(j)) {
        duplicateF++;
      }
      if (getFemaleName(i) == getMaleName(j)) {
        duplicateF++;
      }
      if (getMaleName(i) == getMaleName(j)) {
        duplicateM++;
      }
      if (getMaleName(i) == getFemaleName(j)) {
        duplicateM++;
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
  return numlibs + ' name libraries succesfully loaded';
};

/**
 * Extract all breed names from a crossbreed string like "Bengal x Persian x Siamese"
 * @param {string} breedString - The breed string to parse
 * @return {string[]} Array of individual breed names
 */
function extractBreedNames(breedString) {
  if (!breedString || breedString === 'Mixed') {
    return ['Mixed'];
  }

  // Split on " x " to get individual breeds, and trim whitespace
  return breedString.split(/\s+x\s+/).map(breed => breed.trim());
}

/**
 * Get the name library index for a given breed
 * @param {string} breedName - The name of the breed
 * @return {number|null} The name library index, or null if not found
 */
function getBreedNameLibrary(breedName) {
  // First check BREED_DATA
  if (typeof BREED_DATA !== 'undefined' && BREED_DATA[breedName] && BREED_DATA[breedName].nameLibrary !== undefined) {
    const nameLib = BREED_DATA[breedName].nameLibrary;
    // If nameLibrary is 'random', return a special value to indicate random names should be used
    if (nameLib === 'random') {
      return 'random';
    }
    return nameLib;
  }

  // Fallback to hardcoded mappings for legacy breeds
  const breedNameLibraryMap = {
    'Lykoi': 1,        // American
    'Scottish Fold': 3, // Celtic  
    'Manx': 3,         // Celtic
    'Bobtail': 9,      // Japanese
    'Persian': 2,      // Arabic
    'Russian Blue': 11, // Russian
    'Burmese': 13,     // Thai
    'Sphynx': 5,       // Egyptian
    'Bengal': 8,       // Indian
    'Egyptian Mau': 5, // Egyptian
    'Siamese': 13,     // Thai
    // No default - return null for unknown breeds to trigger random names
  };
  return breedNameLibraryMap[breedName] || null;
}

/**
 * Generate a name based on breed ethnicity instead of parent names
 * @param {string} parent1Breed - First parent's breed string (can be crossbreed)
 * @param {string} parent2Breed - Second parent's breed string (can be crossbreed)  
 * @param {string} gender - The desired gender for the name
 * @return {string} Generated name
 */
function generateBreedBasedName(parent1Breed, parent2Breed, gender) {
  // Extract all breed names from both parents
  const parent1Breeds = extractBreedNames(parent1Breed);
  const parent2Breeds = extractBreedNames(parent2Breed);

  // Combine all breeds from both parents (keep duplicates for weighting)
  const allBreeds = [...parent1Breeds, ...parent2Breeds];

  // Get available name libraries from the breeds
  const availableLibraries = [];

  for (let breed of allBreeds) {
    if (breed === "Mixed") {
      // If Mixed is selected, use random ethnicity
      availableLibraries.push(Math.floor(Math.random() * numlibs));
    } else {
      // Strip known mutation suffixes
      for (const suffix of mutationSuffixes) {
        if (breed.endsWith(suffix)) {
          breed = breed.slice(0, -suffix.length);
          break; // only one suffix should apply
        }
      }

      const libraryIndex = getBreedNameLibrary(breed);

      if (libraryIndex === "random") {
        availableLibraries.push(Math.floor(Math.random() * numlibs));
      } else if (libraryIndex !== null) {
        availableLibraries.push(libraryIndex);
      } else {
        // Don't warn for Mixed breeds - this is expected behavior
        if (breed !== 'Mixed') {
          console.warn("No name library found for breed:", breed);
        }
        availableLibraries.push(Math.floor(Math.random() * numlibs));
      }
    }
  }

  if (availableLibraries.length === 0) {
    availableLibraries.push(Math.floor(Math.random() * numlibs));
  }

  // Dedupe for candidate pool, keep valid ones only
  const candidates = [...new Set(availableLibraries)].filter(
    lib => Number.isInteger(lib) && lib >= 0 && lib < numlibs
  );

  if (candidates.length === 0) {
    candidates.push(Math.floor(Math.random() * numlibs));
  }

  // Build a blacklist of names that cannot be reused
  const taken = new Set(chittens.map(c => c.name));
  // Add temporary blacklisted names during retry attempts
  const attemptBlacklist = new Set();

  const maxAttempts = Math.max(1, availableLibraries.length * 10);

  function pickFromLibrary(lib, gender) {
    if (gender === 'Male' || (gender === 'Non Binary' && Math.random() < 0.5)) {
      return getRandomMaleEthnicName(lib);
    } else {
      return getRandomFemaleEthnicName(lib);
    }
  }

  let result = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const lib = candidates[Math.floor(Math.random() * candidates.length)];
    const candidate = pickFromLibrary(lib, gender);

    if (!taken.has(candidate) && !attemptBlacklist.has(candidate)) {
      result = candidate;
      break;
    } else {
      // Mark this candidate as unusable for all future attempts
      attemptBlacklist.add(candidate);
      // Optional debug:
      // console.log(`Attempt ${attempt}/${maxAttempts}: duplicate/blacklisted "${candidate}" from library ${lib}, retrying...`);
    }
  }

  if (!result) {
    if (gender === 'Male' || (gender === 'Non Binary' && Math.random() < 0.5)) {
      result = getMaleName(Math.floor(Math.random() * totalMaleNames));
    } else {
      result = getFemaleName(Math.floor(Math.random() * totalFemaleNames));
    }
  }

  return result;
}