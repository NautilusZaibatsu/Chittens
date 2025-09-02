// Gene configuration is centralized in genes.js

const baseMutationRate = 0.1; // controls how often random properties are introduced into offspring
const breedStandardLeniency = 0.3;

const runtText = 'Runt of the litter';
const pickText = 'Pick of the litter';
const breedStandardText = 'Breed standard';
const notBreedStandardText = 'Not breed standard';

// function to init a kitten once it has been adopted
function initKitten(who) {
  who.health = maxHealth / 2;
  who.matureModifier = 0;
  who.birthday = daytimeCounter;
  who.size /= kittenPreviewSizeMod;
  who.recalculateSizes();
  who.recalculateColours();
}

/**
* function to generate a kiten from two parents
* @param {object} parent1 - the first parent
* @param {object} parent2 - the second parent
* @return {string} the gender of the baby
*/
function generateKitten(parent1, parent2, childBreed) {
  // male is parent1
  // female is parent2
  let kGender = randomGender();
  let kMaxSize = selectGeneInteger(parent1.maxSize, parent2.maxSize, getRandomChittenMaxSize(randomGender));
  kMaxSize = Math.min(kMaxSize, chittenMaxSize);
  let babySize = (kMaxSize / 2) + (Math.random() * 2);
  // make sure the baby is not too big for the mother
  let babySizeRandom = (Math.random() * 0.1) + 0.3;
  if (babySize > parent2.size * babySizeRandom) {
    babySize = parent2.size * babySizeRandom;
  }

  chittens.push(new Chitten(parent1.x + ((parent2.x - parent1.x) / 2), parent1.y + ((parent2.y - parent1.y) / 2), babySize, kMaxSize, kGender));
  chittens[chittens.length - 1].breed = childBreed;

  // physical traits
  chittens[chittens.length - 1].thickness = selectGeneInteger(parent1.thickness, parent2.thickness, Math.random());
  chittens[chittens.length - 1].legginess = selectGeneInteger(parent1.legginess, parent2.legginess, Math.random());
  chittens[chittens.length - 1].tailLength = selectGeneInteger(parent1.tailLength, parent2.tailLength, Math.random());
  chittens[chittens.length - 1].fangs = selectGeneInteger(parent1.fangs, parent2.fangs, Math.random());
  chittens[chittens.length - 1].mawSize = selectGeneInteger(parent1.mawSize, parent2.mawSize, Math.random());
  chittens[chittens.length - 1].nosePos = selectGeneInteger(parent1.nosePos, parent2.nosePos, Math.random());
  chittens[chittens.length - 1].eyeSize = selectGeneInteger(parent1.eyeSize, parent2.eyeSize, Math.random());
  chittens[chittens.length - 1].eyePosX = selectGeneInteger(parent1.eyePosX, parent2.eyePosX, Math.random());
  chittens[chittens.length - 1].eyePosY = selectGeneInteger(parent1.eyePosY, parent2.eyePosY, Math.random());
  chittens[chittens.length - 1].headWidth = selectGeneInteger(parent1.headWidth, parent2.headWidth, Math.random());
  chittens[chittens.length - 1].headHeight = selectGeneInteger(parent1.headHeight, parent2.headHeight, Math.random());
  chittens[chittens.length - 1].earWidth = selectGeneInteger(parent1.earWidth, parent2.earWidth, Math.random());
  chittens[chittens.length - 1].earHeight = selectGeneInteger(parent1.earHeight, parent2.earHeight, Math.random());
  // physicals abilities
  chittens[chittens.length - 1].coordination = selectGeneInteger(parent1.coordination, parent2.coordination, Math.random());
  // coat
  chittens[chittens.length - 1].pattern = selectGeneFrom([parent1.pattern, parent2.pattern]);
  chittens[chittens.length - 1].patternAlpha = selectGeneInteger(parent1.patternAlpha, parent2.patternAlpha, Math.random());
  chittens[chittens.length - 1].coatMod[0] = selectGeneInteger(parent1.coatMod[0], parent2.coatMod[0], Math.random());
  chittens[chittens.length - 1].coatMod[1] = selectGeneInteger(parent1.coatMod[1], parent2.coatMod[1], Math.random());
  chittens[chittens.length - 1].coatMod[2] = selectGeneInteger(parent1.coatMod[2], parent2.coatMod[2], Math.random());
  chittens[chittens.length - 1].coatMod[3] = selectGeneInteger(parent1.coatMod[3], parent2.coatMod[3], Math.random());
  chittens[chittens.length - 1].bodypartCode = selectGenesFromArraysInts(parent1.bodypartCode, parent2.bodypartCode, 2);
  // colours
  chittens[chittens.length - 1].firstColour = selectGeneColour(parent1.firstColour, parent2.firstColour);
  chittens[chittens.length - 1].secondColour = selectGeneColour(parent1.secondColour, parent2.secondColour);
  chittens[chittens.length - 1].thirdColour = selectGeneColour(parent1.thirdColour, parent2.thirdColour);
  chittens[chittens.length - 1].patternColour = selectGeneColour(parent1.patternColour, parent2.patternColour);
  chittens[chittens.length - 1].eyeColour = selectGeneColour(parent1.eyeColour, parent2.eyeColour);
  chittens[chittens.length - 1].eyeColour2 = selectGeneColour(parent1.eyeColour2, parent2.eyeColour2);
  // shuffle colours
  if (Math.random() < baseMutationRate) {
    let shuffledColours = shuffleGenes([chittens[chittens.length - 1].firstColour, chittens[chittens.length - 1].secondColour, chittens[chittens.length - 1].thirdColour]);
    chittens[chittens.length - 1].firstColour = shuffledColours[0];
    chittens[chittens.length - 1].secondColour = shuffledColours[1];
    chittens[chittens.length - 1].thirdColour = shuffledColours[2];
  }
  if (Math.random() < baseMutationRate) {
    let shuffledColours = shuffleGenes([chittens[chittens.length - 1].eyeColour, chittens[chittens.length - 1].eyeColour2]);
    chittens[chittens.length - 1].eyeColour = shuffledColours[0];
    chittens[chittens.length - 1].eyeColour2 = shuffledColours[1];
  }
  // genetic conditions (they are actually expressed in determineTraitExpression())
  // Auto-inherit all genes using GENE_DATA
  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    chittens[chittens.length - 1][geneData.geneProp] = inheritGenes(parent1[geneData.geneProp], parent2[geneData.geneProp]);
  }
  if (chittens[chittens.length - 1].colourpointGene) {
    chittens[chittens.length - 1].colourpointMap = selectGenesFromArraysBools(parent1.colourpointMap, parent2.colourpointMap);
  } else {
    // No colourpoint gene, set all colourpointMap to false
    chittens[chittens.length - 1].colourpointMap = [false, false, false, false];
  }
  // Determine trait expression for inherited genes
  determineTraitExpression(chittens[chittens.length - 1]);
  return kGender;
}

/**
 * Determine trait expression for cats that carry genes
 * Should be called after genes are set but before trait expression is determined
 */
function determineTraitExpression(who) {
  // Process gene expression using centralized GENE_DATA
  const breed = BREED_DATA[who.breed];

  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    // Check if chitten has gene but not expression
    if (who[geneData.geneProp] && !who[geneData.expressedProp]) {
      let expressionChance = geneData.baseExpressionChance;

      // Check if this is a breed standard (95%+ expression for purebreds)
      if (breed?.breedStandardGenes?.includes(geneKey)) {
        expressionChance = geneData.breedStandardChance;
      }

      // Skip bald faced / sparse coat expression if already hairless
      if ((geneKey === 'baldFaced' || geneKey === 'sparseCoat') && who.hairlessExpressed) {
        continue;
      }

      if (Math.random() <= expressionChance) {
        who[geneData.expressedProp] = true;
      }
    }
    // melanism and albinism cannot be present together
    if (who.melanismExpressed && who.albinoExpressed) {
      if (Math.random() < 0.5) {
        who.melanismExpressed = false;
      } else {
        who.albinismExpressed = false;
      }
    }
  }

  // Ensure colourpointMap is false when colorpoint gene is not present
  if (!who.colourpointGene) {
    who.colourpointMap = [false, false, false, false];
  }

  // Sort colors by brightness
  let colors = [
    { color: who.firstColour, brightness: getBrightness(who.firstColour) },
    { color: who.secondColour, brightness: getBrightness(who.secondColour) },
    { color: who.thirdColour, brightness: getBrightness(who.thirdColour) }
  ];
  // Sort by brightness (lightest first)
  colors.sort((a, b) => b.brightness - a.brightness);
  who.firstColour = colors[0].color;   // lightest
  who.secondColour = colors[1].color;  // medium
  who.thirdColour = colors[2].color;   // darkest
}

/** function to apply genetics and disorders to Chittens
* @param {Chitten} who - the chitten
*/
mutate = function (who) {
  // Apply mutations based on centralized GENE_DATA
  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    if (Math.random() <= geneData.mutationChance) {
      who[geneData.geneProp] = true;
    }
  }
};

// Gene inheritence section
/**
* function to determine inheritence of genes using mendellian logic
 * @param {boolean} parent1Gene - the first parent's gene
 * @param {boolean} parent2Gene - the first parent's gene
 * @return {boolean} whether the offspring inherits the gene
 * */
function inheritGenes(parent1Gene, parent2Gene) {
  let hasGene = false;
  // If both parents carry the gene → 75% chance to inherit
  if (parent1Gene && parent2Gene) {
    hasGene = Math.random() < 0.75;
    // If one parent carries the gene → 50% chance to inherit
  } else if (parent1Gene || parent2Gene) {
    hasGene = Math.random() < 0.5;
    // If neither → no gene inherited
  } else {
    hasGene = false;
  }
  return hasGene;
}

/**
* function to return a random gender
* @return {string} the gender
*/
function randomGender() {
  if (Math.random() < 0.004) {
    return 'Non Binary';
  } else {
    let base = Math.round(Math.random());
    if (base == 0) {
      return 'Male';
    }
    return 'Female';
  }
}

// Consolidated random genetics function for all adoption cats
function randomiseGeneticsBase(who, shouldApplyBreedTemplate, specificBreed) {
  // Set basic physical properties
  who.size = (who.maxSize * 0.75) + (Math.random() * 0.25 * who.maxSize);
  who.coatMod[0] = Math.random();
  who.coatMod[1] = Math.random();
  who.coatMod[2] = Math.random();
  who.coatMod[3] = Math.random();
  who.thickness = (Math.random() * 0.5) + 0.5;
  who.legginess = (Math.random() * 0.5) + 0.5;
  who.coordination = Math.random(); // Random coordination from 0.0 to 1.0
  who.pattern = validPatterns[Math.floor(Math.random() * validPatterns.length)].value;
  who.patternAlpha = Math.random();

  // Set default colors (will be overridden by breed if applicable)
  who.firstColour = randomColourRealistic();
  who.secondColour = randomColourRealistic();
  who.thirdColour = randomColourRealistic();
  who.patternColour = randomColourRealistic();

  // Set basic properties
  who.inCatBox = boxes[thisCatBox];
  who.birthday = Math.floor(Math.random() * ticksPerDay);
  who.tailLength = (Math.random() * 0.75) + 0.25;
  who.bodypartCode = randomBodyPartCode();
  who.nosePos = Math.random();
  who.eyePosX = Math.random();
  who.eyePosY = Math.random();
  who.headWidth = Math.random();
  who.headHeight = Math.random();
  who.eyeColour = getRandomEyeColour();
  who.eyeColour2 = who.eyeColour;
  who.eyeSize = Math.random();
  who.maxAge = minMaxAge + (ageVariance * Math.random());
  who.age = Math.round(Math.random() * 5) + maturesAt;
  who.fangs = Math.random();
  who.earHeight = 0.25 + (Math.random() * 0.75);
  who.earLength = 0.25 + (Math.random() * 0.75);
  who.mawSize = Math.random();

  // Handle breed application
  if (who !== experiment && shouldApplyBreedTemplate) {
    if (specificBreed) {
      // Apply specific breed
      applySpecificBreedTemplate(who, specificBreed);
      // Only apply allowed mutations for purebreds
      mutate(who);
    } else {
      // Apply random breed template
      applyBreedTemplate(who);
      mutate(who);
    }
  } else if (who !== experiment) {
    // Mixed breed - set explicitly and apply all mutations
    who.breed = mixedBreed;
    mutate(who);
  }

  // Apply trait expression for all adoption cats
  if (who !== experiment) {
    determineTraitExpression(who);
  }

  // Ensure heterochromia produces visible different eye colors
  if (who.heterochromicGene && who.eyeColour === who.eyeColour2) {
    if (Math.random() < 0.5) {
      who.eyeColour = getRandomEyeColour();
    } else {
      who.eyeColour2 = getRandomEyeColour();
    }
  } else if (!who.heterochromicGene) {
    who.eyeColour2 = who.eyeColour;
  }
}

// Generate a crossbreed cat (two breeds mixed together)
function generateCrossbreed(who, specifiedBreed1 = null) {
  // Store the original adoption cat data
  const originalWho = { ...who };

  // Pick two different breeds to mix
  const availableBreeds = Object.keys(BREED_DATA);

  let breed1, breed2;

  if (specifiedBreed1) {
    // If breed is specified, use it directly (can be same as original chitten's breed)
    breed1 = who.breed;
    breed2 = specifiedBreed1;
  } else {
    // If no breed specified, pick two different random breeds
    breed1 = availableBreeds[Math.floor(Math.random() * availableBreeds.length)];
    do {
      breed2 = availableBreeds[Math.floor(Math.random() * availableBreeds.length)];
    } while (breed2 === breed1);
  }

  // Create temporary parent cats
  const tempParent1 = new Chitten(0, 0, 6, 10, 'Male');
  const tempParent2 = new Chitten(0, 0, 6, 10, 'Female');

  // Apply breeds to temp parents
  randomiseGeneticsBase(tempParent1, true, breed1);
  randomiseGeneticsBase(tempParent2, true, breed2);

  // Generate baby using the existing breeding system
  const crossbreedName = generateChildBreedText(tempParent1, tempParent2);
  generateKitten(tempParent1, tempParent2, crossbreedName);


  // Replace who entirely with the baby
  const baby = chittens[chittens.length - 1];
  Object.assign(who, baby);

  // Restore only the adoption-specific properties from original
  who.inCatBox = originalWho.inCatBox;
  who.x = originalWho.x;
  who.y = originalWho.y;
  who.gender = originalWho.gender;
  who.awake = originalWho.awake;
  who.speedX = originalWho.speedX;
  who.speedY = originalWho.speedY;
  who.onSurface = originalWho.onSurface;

  // Make this an adult cat, not a baby
  who.age = Math.round(Math.random() * 5) + maturesAt;
  who.size = (who.maxSize * 0.75) + (Math.random() * 0.25 * who.maxSize) * (who.gender === 'Female' ? 1 / 1.1 : 1);
  // Remove the temporary baby from the chittens array
  chittens.splice(chittens.length - 1, 1);
}

// Improved crossbreeding with generation limits
function generateChildBreedText(parent1, parent2) {
  // If either parent is mixed, offspring should be mixed
  if (parent1.breed === mixedBreed || parent2.breed === mixedBreed) {
    return mixedBreed;
  }

  // Extract all breeds from both parents
  const parent1Breeds = parent1.breed.split(/\s+x\s+/);
  const parent2Breeds = parent2.breed.split(/\s+x\s+/);
  const allBreeds = [...parent1Breeds, ...parent2Breeds];

  // Remove duplicates
  const uniqueBreeds = [...new Set(allBreeds)].filter(breed => breed !== mixedBreed);

  // If more than 2 unique breeds total, result is mixed
  if (uniqueBreeds.length > 2) {
    return mixedBreed;
  }

  // If only one unique breed, it's purebred
  if (uniqueBreeds.length === 1) {
    return uniqueBreeds[0];
  }

  // Count generation depth for complexity check
  const depth1 = getBreedDepth(parent1.breed);
  const depth2 = getBreedDepth(parent2.breed);
  const maxDepth = Math.max(depth1, depth2);

  // Too mixed - revert to "Mixed" after 3 generations
  if (maxDepth >= 3) {
    return mixedBreed;
  }

  // Create cross name (alphabetical order for consistency)
  const breeds = uniqueBreeds.sort();
  splitCrossbreedNames(`${breeds[0]} x ${breeds[1]}`);
  return `${breeds[0]} x ${breeds[1]}`;
}

function splitCrossbreedNames(breedName) {
  if (!breedName || breedName === mixedBreed) return [];

  // Remove trailing " cross" if present
  breedName = breedName.replace(/\s+cross$/, '');

  // Split by " x " and trim any stray spaces
  const breeds = breedName.split(/\s+x\s+/).map(b => b.trim());
  return breeds;
}

function getBreedDepth(breedName) {
  if (!breedName || breedName === mixedBreed) return 2;
  // Count ' x ' patterns (with spaces) to determine crossing depth
  const crossCount = (breedName.match(/\s+x\s+/g) || []).length;
  if (crossCount === 0) return 0; // Pure breed
  if (crossCount === 1) return 1; // First generation cross
  return 2; // Complex cross (simplified to avoid infinite complexity)
}

// helpers 
function selectGeneInteger(gene1, gene2, randomGene) {
  // chance to include a random gene 
  let includeRandom = Math.random() < baseMutationRate;
  let selectGene;
  // pick a random proportion between parents
  let weight1 = Math.random();
  let weight2 = 1 - weight1;
  if (includeRandom) {
    // give randomGene some random weight too
    let weightR = Math.random();  // 0–1
    // renormalize so weights sum to 1
    let total = weight1 + weight2 + weightR;
    weight1 /= total;
    weight2 /= total;
    weightR /= total;
    selectGene = (gene1 * weight1) + (gene2 * weight2) + (randomGene * weightR);
  } else {
    // just the two parents
    selectGene = (gene1 * weight1) + (gene2 * weight2);
  }
  return selectGene;
}

function selectGeneColour(colour1, colour2) {
  // Random weights for parents (0–1)
  let prop = Math.random();
  // Decide whether to include a random colour
  if (Math.random() < baseMutationRate) { // 30% chance of random gene
    let rand = randomColour();
    // Three-way mixing: pick random split between parents and random
    let r = 1 - (Math.random() * 0.1);
    // Blend parents first, then blend with random
    let parentMix = mixTwoColours(colour1, colour2, prop);
    return mixTwoColours(parentMix, rand, r);
  }
  // Otherwise just blend parents
  return mixTwoColours(colour1, colour2, prop);
}

function selectGeneFrom(selectFrom) {
  const index = Math.floor(Math.random() * selectFrom.length);
  return selectFrom[index];
}

function shuffleGenes(selectFrom) {
  const result = [...selectFrom]; // copy the array
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // swap
  }
  return result;
}

function selectGenesFromArraysInts(one, two, max) {
  let maximum = max + 1;
  if (one.length !== two.length) {
    console.warn('Error: array lengths don\'t match');
  } else {
    let tmpArray = [];
    for (let i = 0; i < one.length; i++) {
      let seed = Math.random()
      if (seed <= 0.45) {
        tmpArray.push(one[i]);
      } else if (seed <= 0.9) {
        tmpArray.push(two[i]);
      } else {
        tmpArray.push(Math.floor(Math.random() * maximum));
      }
    }
    return tmpArray;
  }
}

function selectGenesFromArraysBools(one, two) {
  if (one.length !== two.length) {
    console.warn('Error: array lengths don\'t match');
  } else {
    let tmpArray = [];
    for (let i = 0; i < one.length; i++) {
      let seed = Math.random()
      if (seed <= 0.45) {
        tmpArray.push(one[i]);
      } else if (seed <= 0.9) {
        tmpArray.push(two[i]);
      } else {
        tmpArray.push(Math.random() < 0.5);
      }
    }
    return tmpArray;
  }
}