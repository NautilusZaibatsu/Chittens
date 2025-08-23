// Optimized breed system with data-driven approach

 const mutationSuffixes = [" albino", " sphynx"];

const BREED_DATA = {
  'Bengal': {
    pattern: 6,
    size: [12, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      first: ['#660c00', '#171523'],
      second: '#000000',
      third: ['#ffd699', '#b4d4d8'],
      eye: ['#cbe06b', '#627374']
    },
    traits: {
      thickness: 0.7,
      tailLength: 1,
      fangs: 0.85,
      eyePosY: 0.8,
      eyePosX: 1,
      eyeSize: 0.26,
      headWidth: 0.7,
      headHeight: 0.6,
      earHeight: 0.9,
      earWidth: 0.63,
      legginess: 0.9,
      nosePos: 0.7
    },
    bodypartCode: [3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3],
    coatMod: [0.76, 0.74],
    nameLibrary: 8
  },

  'Egyptian Mau': {
    pattern: 6,
    size: [10, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      first: '#000000',
      second: ['#f2f2f2', '#474c4e'],
      third: ['#97908a', '#f1d0b1'],
      eye: ['#7d9e5e', '#e0bf69']
    },
    traits: {
      thickness: 0.6,
      tailLength: 1,
      fangs: 0.5,
      eyePosY: 0.65,
      eyePosX: 0.6,
      eyeSize: 0.3,
      headWidth: 0.52,
      headHeight: 0.94,
      earHeight: 0.9,
      earWidth: 0.4,
      legginess: 0.8,
      nosePos: 0.75
    },
    bodypartCode: [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    coatMod: [0.65, 0.26],
    nameLibrary: 5
  },

  'Tabby': {
    pattern: 3,
    size: [13, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      variants: [
        { first: ['#f78411', '#eac8a6'], second: ['#000000', '#291003'], third: '#ffffff' },
        { first: ['#876d4f', '#a09654'], second: ['#000000', '#2c1f02'], third: '#ffffff' },
        { first: ['#9cb4ca', '#000000'], second: ['#000000', '#160730'], third: '#ffffff' }
      ]
    },
    traits: {
      fangs: [0.4, 0.7],
      legginess: [0.5, 0.8]
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    coatMod: [0, 0.74],
    nameLibrary: 'random'
  },

  'Siamese': {
    pattern: 4,
    maxSize: 12,
    size: [8, 12], // Medium-sized, elegant breed
    patternAlpha: [0.5, 1.0],
    colors: {
      first: ['#140200', '#290019'],
      second: ['#ffd699', '#ffffff'],
      eye: ['#99e7ff', '#008cb8']
    },
    traits: {
      headHeight: 0,
      headWidth: 0.2,
      thickness: 0.5,
      fangs: [0.3, 0.8],
      legginess: [0.6, 0.85],
      eyeSize: 0,
      eyePosX: 0.2,
      eyePosY: 0.5,
      nosePos: 0.5,
      earWidth: 0.5,
      earHeight: 0.6
    },
    bodypartCode: [2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    coatMod: [null, 0.8], // null means random
    nameLibrary: 13,
    desaturate: 0.5 // 50% chance to desaturate
  },

  'Lykoi': {
    pattern: 5,
    maxSize: 14,
    size: [10, 14],
    patternAlpha: 1.0,
    colors: {
      first: ['#1a120f', '#4f4e4d'],
      second: [trueBlack, '#343434'],
      third: trueBlack,
      eye: ['#876d4f', '#f9c96c']
    },
    traits: {
      thickness: 0.5,
      legginess: 0.8,
      headWidth: 0.3,
      headHeight: 0,
      earHeight: 1,
      earWidth: 0.55,
      nosePos: 0.35,
      fangs: 0.8,
      eyePosY: 0,
      eyePosX: 0.2,
      eyeSize: 0
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    nameLibrary: 1,
    hairlessGene: true
  },

  'Burmese': {
    pattern: 4,
    maxSize: 12,
    size: [8, 12], // Compact, medium-sized breed
    patternAlpha: [0.3, 1.0],
    colors: {
      first: ['#0e0b0b', '#3e2d14'],
      second: ['#8a652e', '#ffffff'],
      eye: ['#ffe147', '#a26a45']
    },
    traits: {
      headHeight: 0,
      headWidth: 0.4,
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0],
      eyeSize: 0.25,
      eyePosX: 0.2,
      eyePosY: 0.5,
      nosePos: 0.6,
      earWidth: 0.5,
      earHeight: 0.6
    },
    bodypartCode: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0, 1],
    coatMod: ['random', 0.8],
    nameLibrary: 13,
    desaturate: 0.5
  },

  'Persian': {
    pattern: 0,
    patternAlpha: 0,
    maxSize: 13,
    size: [7, 13], // Medium-large, fluffy breed
    colors: {
      first: ['#36332f', '#ffebf2'],
      second: ['#31210c', '#290f00'],
      third: ['#000000', '#001401'],
      eye: ['#c5e93d', '#e08700']
    },
    traits: {
      thickness: 1,
      headWidth: 1,
      headHeight: 1,
      eyePosX: 0.33,
      eyePosY: 0.33,
      fangs: 0.2,
      earWidth: 0.55,
      earHeight: 0.55
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    coatMod: ['random*0.6', 0.29], // First is random multiplied by 0.6
    nameLibrary: 2
  },

  'Black and white shorthair': {
    pattern: 0,
    size: [8, chittenMaxSize],
    colors: {
      first: '#000000',
      second: '#FFFFFF',
      third: '#000000'
    },
    traits: {
      legginess: [0.4, 0.6],
      thickness: [0.5, 0.7],
      headHeight: 0,
      headWidth: [0, 0.4]
    },
    bodypartCode: 'random', // Special case for random body parts
    coatMod: [0, 0.25],
    nameLibrary: 'random'
  },

  'Scottish Fold': {
    pattern: 0, // Can be various patterns, not just tabby
    maxSize: 13, 
    size: [8, 13], // Medium-sized breed
    colors: {
      variants: [
        { first: '#8B4513', second: '#D2B48C', third: '#FFFFFF' }, // Brown tabby
        { first: '#696969', second: '#C0C0C0', third: '#FFFFFF' }, // Blue
        { first: '#FFFFFF', second: '#000000', third: '#FFFFFF' }, // Black and white
        { first: '#FFA500', second: '#FFFFFF', third: '#FFE4B5' }  // Orange and white
      ],
      eye: ['#FFD700', '#32CD32', '#4169E1'] // Gold, green, blue eyes
    },
    traits: {
      earHeight: 0, // Folded ears - key breed trait
      earWidth: 0,
      headWidth: [0.6, 0.9], // Round head
      thickness: [0.6, 0.8], // Medium build
      legginess: [0.5, 0.7], // Short to medium legs
      fangs: [0.3, 0.6]
    },
    bodypartCode: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    coatMod: [0.5, 0.8],
    nameLibrary: 3 // Celtic/Scottish names
  },

  'Manx': {
    pattern: 0, // Various coat patterns
    maxSize: 12,
    size: [8, 12], // Medium-sized, stocky breed  
    colors: {
      variants: [
        { first: '#8B4513', second: '#D2B48C', third: '#FFFFFF' }, // Brown tabby
        { first: '#000000', second: '#FFFFFF', third: '#FFFFFF' }, // Black and white
        { first: '#FFA500', second: '#FFFFFF', third: '#FFE4B5' }, // Orange tabby
        { first: '#696969', second: '#C0C0C0', third: '#FFFFFF' }  // Blue/gray
      ],
      eye: ['#FFD700', '#32CD32', '#4169E1'] // Gold, green, blue
    },
    traits: {
      headWidth: [0.7, 1.0], // Round, full head
      thickness: [0.7, 0.9], // Stocky build
      legginess: [0.6, 0.8], // Strong legs
      tailLength: 0, // Key breed trait - no tail
      eyeSize: [0.7, 1.0], // Large, round eyes
      fangs: [0.4, 0.7]
    },
    bodypartCode: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0, 1],
    coatMod: [0.5, 0.8],
    nameLibrary: 3 // Celtic/Manx names
  },

  'Bobtail': {
    pattern: 0,
    size: [10, chittenMaxSize],
    colors: {
      first: ['#876d4f', '#a09654'],
      second: ['#000000', '#2c1f02'],
      third: '#ffffff',
      eye: ['#e4ac2b', '#d3740d']
    },
    traits: {
      headWidth: 1,
      headHeight: 'proportional', // headWidth/50*35
      legginess: [0.7, 1.0],
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      tailLength: 0,
      eyeSize: [0.2, 0.5]
    },
    bodypartCode: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0, 1],
    coatMod: [0, 'random'],
    nameLibrary: 9
  },

  'Russian Blue': {
    pattern: 0, // Solid color only
    maxSize: 11,
    size: [7, 11], // Medium-sized, elegant breed
    colors: {
      first: '#4682B4', // Blue-gray color (Russian Blue signature)
      second: '#4682B4', // Same as first - solid color
      third: '#708090', // Slightly darker blue-gray
      eye: '#32CD32' // Vivid green eyes (breed standard)
    },
    traits: {
      headWidth: [0.4, 0.6], // Wedge-shaped head
      headHeight: [0.4, 0.6],
      thickness: [0.4, 0.6], // Elegant, not stocky
      legginess: [0.7, 0.9], // Long, graceful legs
      fangs: [0.3, 0.5], // Small fangs
      tailLength: [0.8, 1.0], // Long tail
      nosePos: 0.65
    },
    bodypartCode: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    coatMod: [0.3, 0.2], // Subtle variation
    nameLibrary: 11 // Russian names
  },

  'Calico': {
    pattern: 1,
    size: [8, chittenMaxSize],
    colors: {
      first: '#ffffff',
      second: [trueBlack, '#555555'], // a dark grey
      third: ['#e8831e', '#c89c7a'],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0]
    },
    bodypartCode: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0, 1],
    coatMod: ['random', 0.8],
    nameLibrary: 'random',
    genderRestriction: 'female' // Very rare in males
  },

  'Tortoiseshell': {
    pattern: 1,
    size: [8, chittenMaxSize],
    colors: {
      first: '#ffffff',
      second: [trueBlack, '#555555'], // a dark grey
      third: ['#e8831e', '#c89c7a'],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0]
    },
    bodypartCode: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 0, 1],
    coatMod: ['random', 0.8],
    nameLibrary: 'random',
    genderRestriction: 'female' // Very rare in males
  },

  'Sphynx': {
    pattern: 0, // Hairless, so pattern doesn't matter much
    maxSize: 14,
    size: [8, 14], // Medium sized breed
    colors: {
      first: ['#FDBCB4', '#F5DEB3', '#D2B48C'], // Skin tones
      second: ['#FDBCB4', '#F5DEB3', '#D2B48C'],
      third: ['#FDBCB4', '#F5DEB3', '#D2B48C'],
      eye: ['#1E90FF', '#32CD32', '#FFD700'] // Vivid eyes common in Sphynx
    },
    traits: {
      thickness: 0.5,
      legginess: 0.8,
      headWidth: 0,
      headHeight: 0,
      earWidth: [0.5, 1.0],
      earHeight: [0.5, 1.0]
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    coatMod: [0.3, 0.2],
    nameLibrary: 5, // Egyptian
    hairlessGene: true // All true Sphynx cats have the hairless gene
  }
};

// Utility functions
function randomBetween(min, max) {
  if (Array.isArray(min)) {
    return min[0] + Math.random() * (min[1] - min[0]);
  }
  return min + Math.random() * (max - min);
}

function mixRandomCoatColor(colorArray) {
  if (Array.isArray(colorArray)) {
    return mixTwoColours(colorArray[0], colorArray[1], Math.random());
  }
  if (colorArray === 'random') {
    return randomColourRealistic(Math.random());
  }
  // Add subtle variation to single hardcoded colors for adoptable cats
  if (typeof colorArray === 'string' && colorArray.startsWith('#')) {
    // Subtle variation (2-4%) - noticeable for choice but preserves breed characteristics
    const variation = 0.02 + (Math.random() * 0.02); // 2% to 4% variation
    return mixTwoColours(colorArray, randomColourRealistic(Math.random()), 1 - variation);
  }
  return colorArray;
}

function mixRandomEyeColor(colorArray) {
  if (Array.isArray(colorArray)) {
    return mixTwoColours(colorArray[0], colorArray[1], Math.random());
  }
  if (colorArray === 'random') {
    return getRandomEyeColour();
  }
  // Add subtle variation to single hardcoded colors for adoptable cats
  if (typeof colorArray === 'string' && colorArray.startsWith('#')) {
    // Subtle variation (2-4%) - noticeable for choice but preserves breed characteristics
    const variation = 0.02 + (Math.random() * 0.02); // 2% to 4% variation
    return mixTwoColours(colorArray, getRandomEyeColour(), 1 - variation);
  }
  return colorArray;
}

// Main breed application function
function applyBreed(who, breedName) {
  const breed = BREED_DATA[breedName];
  if (!breed) return;

  // Apply pattern
  if (breed.pattern !== undefined) who.pattern = breed.pattern;

  // Apply size
  if (breed.size) {
    who.size = randomBetween(breed.size[0], breed.size[1]);
  }
  if (breed.maxSize) {
    who.maxSize = breed.maxSize;
  }

  // Apply pattern alpha
  if (breed.patternAlpha !== undefined) {
    if (Array.isArray(breed.patternAlpha)) {
      // If it's [min, max], random between them
      who.patternAlpha = randomBetween(breed.patternAlpha[0], breed.patternAlpha[1]);
    } else {
      // If it's just a single number, use it directly
      who.patternAlpha = breed.patternAlpha;
    }
  }

  // Apply colors
  if (breed.colors) {
    if (breed.colors.variants) {
      // Handle color variants (like Tabby)
      const variant = breed.colors.variants[Math.floor(Math.random() * breed.colors.variants.length)];
      who.firstColour = mixRandomCoatColor(variant.first);
      who.secondColour = mixRandomCoatColor(variant.second);
      who.thirdColour = mixRandomCoatColor(variant.third);
    } else {
      if (breed.colors.first) who.firstColour = mixRandomCoatColor(breed.colors.first);
      if (breed.colors.second) who.secondColour = mixRandomCoatColor(breed.colors.second);
      if (breed.colors.third) who.thirdColour = mixRandomCoatColor(breed.colors.third);
      if (breed.colors.eye) who.eyeColour = mixRandomEyeColor(breed.colors.eye);
    }
  }

  // Apply traits
  if (breed.traits) {
    Object.keys(breed.traits).forEach(trait => {
      const value = breed.traits[trait];
      if (Array.isArray(value)) {
        who[trait] = randomBetween(value[0], value[1]);
      } else {
        who[trait] = value;
      }
    });
  }

  // Apply bodypart code
  if (breed.bodypartCode) {
    who.bodypartCode = [...breed.bodypartCode];
  }

  // Apply coat modifications
  if (breed.coatMod) {
    breed.coatMod.forEach((mod, index) => {
      if (mod === null || mod === 'random') {
        who.coatMod[index] = Math.random();
      } else if (typeof mod === 'string' && mod.startsWith('random*')) {
        // Handle random multipliers like 'random*0.6'
        const multiplier = parseFloat(mod.substring(7));
        who.coatMod[index] = Math.random() * multiplier;
      } else if (typeof mod === 'number') {
        who.coatMod[index] = mod;
      } else {
        console.warn('Invalid coatMod value:', mod, 'using random');
        who.coatMod[index] = Math.random();
      }
    });
  }

  // Apply desaturation
  if (breed.desaturate && Math.random() < breed.desaturate) {
    const factor = 1 + (Math.random() * 9);
    who.firstColour = decreaseSaturationHEX(who.firstColour, factor);
    who.secondColour = decreaseSaturationHEX(who.secondColour, factor);
    who.thirdColour = decreaseSaturationHEX(who.thirdColour, factor);
  }

  // Set breed name
  who.breed = breedName;
  
  // Apply hairless gene if specified by breed
  if (breed.hairlessGene) {
    who.hairlessGene = true;
    who.hairless = true; // Hairless breeds always express the trait
  }

  // Apply ethnic names
  if (breed.nameLibrary !== undefined) {

    if (breed.nameLibrary == 'random') {
      if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
        who.name = getMaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
      } else {
        who.name = getFemaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
      }
      // male parent
    } else if (who.gender === 'Male' || (who.gender === 'Non Binary' && Math.random() < 0.5)) {
      who.name = getRandomMaleEthnicName(breed.nameLibrary);
    } else {
      who.name = getRandomFemaleEthnicName(breed.nameLibrary);
    }
  }
}

// Legacy function wrappers for backward compatibility
function breedBengal(who) { applyBreed(who, 'Bengal'); }
function breedEgyptianMau(who) { applyBreed(who, 'Egyptian Mau'); }
function breedTabby(who) { applyBreed(who, 'Tabby'); }
function breedSiamese(who) { applyBreed(who, 'Siamese'); }
function breedLykoi(who) { applyBreed(who, 'Lykoi'); }

function breedTwoTone(who) {
  applyBreed(who, 'Black and white shorthair');
  // Special random bodypart code
  who.bodypartCode = [Math.round(Math.random()), Math.round(Math.random()), 0, Math.round(Math.random()), Math.round(Math.random()), 0,
  Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), 1];
}

function breedScottishFold(who) {
  applyBreed(who, 'Scottish Fold');
  // Special proportional head height
  who.headHeight = who.headWidth / 1.4;
}

function breedManx(who) {
  applyBreed(who, 'Manx');
  // Special proportional head height
  who.headHeight = who.headWidth / 50 * 35;
}

function breedBobtail(who) { applyBreed(who, 'Bobtail'); }

function breedPersian(who) { applyBreed(who, 'Persian'); }

function breedRussianBlue(who) { applyBreed(who, 'Russian Blue'); }

function breedCalico(who) { applyBreed(who, 'Calico'); }

function breedTortoiseShell(who) { applyBreed(who, 'Tortoiseshell'); }

function breedBurmese(who) { applyBreed(who, 'Burmese'); }

// Special breed functions that need custom logic
/**
 * Determine trait expression for cats that carry genes
 * Should be called after genes are set but before trait expression is determined
 */
function determineTraitExpression(who) {
  // Albino expression: 25% of gene carriers express albinism
  if (who.albinoGene && !who.albino) {
    if (Math.random() <= 0.25) {
      who.albino = true;
      who.pattern = 0; // Albino pattern
    }
  }
  
  // Hairless expression: 30% of gene carriers express hairlessness
  // Exception: hairless breeds like Sphynx always express it
  if (who.hairlessGene && !who.hairless) {
    if (who.breed === 'Sphynx' || who.breed === 'Lykoi' || Math.random() <= 0.3) {
      who.hairless = true;
    }
  }
  
  // Heterochromic expression: 40% of gene carriers express heterochromia
  if (who.heterochromicGene && who.eyeColour === who.eyeColour2) {
    if (Math.random() <= 0.4) {
      // Create different eye colors
      let secondEyeColor = getRandomEyeColour();
      // Ensure the second eye color is different
      while (secondEyeColor === who.eyeColour) {
        secondEyeColor = getRandomEyeColour();
      }
      who.eyeColour2 = secondEyeColor;
    }
  }
}

function mutateHeterochromia(who, seed) {
  who.heterochromicGene = true;
  if (seed <= 0.03) {
    let blue = 192 + Math.floor(Math.random() * 63);
    let red = 128 + Math.floor(Math.random() * 52);
    let green = 99 + Math.floor(Math.random() * red / 2);
    let blue2 = Math.round(green / 2);
    let greenRed = Math.floor(Math.random() * (blue - 64));

    if (hexToRgb(who.eyeColour).b > hexToRgb(who.eyeColour).r && hexToRgb(who.eyeColour).g) {
      who.eyeColour2 = rgbToHex(red, green, blue2);
    } else {
      who.eyeColour2 = rgbToHex(greenRed, greenRed, blue);
    }
  }
}

function mutateAlbino(who) {
  who.albinoGene = true;
  // Don't automatically set albino trait - that should be determined by expression logic
  // Always append ' albino' to existing breed, never replace it
  if (who.breed === 'Mixed' || !who.breed) {
    who.breed = 'Mixed albino';
  } else if (!who.breed.includes('albino')) {
    who.breed += ' albino';
  }
}

function mutateHairless(who) {
  who.hairlessGene = true;
  // Don't automatically set hairless trait - that should be determined by expression logic
  // Don't modify breed name - hairless is a gene, not a breed suffix
}

function breedSphynx(who) { 
  applyBreed(who, 'Sphynx'); 
  // Sphynx breed automatically gets hairless gene via BREED_DATA
}

/**
 * Generate a name for a cat based on its breed
 * @param {Chitten} who - The cat to generate a name for
 */
function generateBreedAppropiateName(who) {
  // Defensive check - ensure name library is loaded
  if (typeof totalMaleNames === 'undefined' || typeof totalFemaleNames === 'undefined') {
    console.warn('Name library not loaded, using fallback name');
    who.name = 'Unnamed';
    return;
  }

  if (!who.breed || who.breed === 'Mixed') {
    // For mixed or unspecified breeds, use completely random name
    if (who.gender === 'Male' || (who.gender === 'Non Binary' && Math.random() < 0.5)) {
      who.name = getMaleName(Math.floor(Math.random() * totalMaleNames));
    } else {
      who.name = getFemaleName(Math.floor(Math.random() * totalFemaleNames));
    }
  } else {
    // Use the breed-based name generation system
    who.name = generateBreedBasedName(who.breed, who.breed, who.gender);
  }
}