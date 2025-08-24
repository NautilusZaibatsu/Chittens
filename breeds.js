// Optimized breed system with data-driven approach

const mixedBreed = 'Mixed';

const BREED_DATA = {
  'Bengal': {
    pattern: 6,
    size: [12, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      first: ['#660c00', '#171523'],
      second: trueBlack,
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
    bodypartCode: [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    coatMod: [0.76, 0.74],
    nameLibrary: 8
  },

  'Egyptian Mau': {
    pattern: 6,
    size: [10, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      first: trueBlack,
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
    size: [chittenBaseSize, chittenMaxSize],
    patternAlpha: [0.5, 1.0],
    colors: {
      variants: [
        { first: ['#f78411', '#eac8a6'], second: '#eac8a6', third: trueWhite }, // orange tabby classic
        { first: ['#5f4931', '#968058'], second: '#968058', third: trueWhite }, // brown tabby
        { first: ['#9cb4ca', '#666666'], second: '#666666', third: trueWhite } // silver tabby
      ]
    },
    traits: {
      fangs: [0.4, 0.7],
      legginess: [0.5, 0.8]
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bodypartCodeVariants: [
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 1], // white foot and chin tabby with light chest
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Classic tabby - mostly first color with pattern overlay
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1], // High contrast tabby - feet, ears, tail darker, head/chin/chest lighter  
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Inverse tabby - face, ears, body, tail, jowls, chest darker
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // Bengal-style tabby - feet, jowls, chin, chest use third color
    ],
    coatMod: [0, 0.74],
    nameLibrary: 'random'
  },

  'Siamese': {
    pattern: 4,
    maxSize: 12,
    size: [8, 12], // Medium-sized, elegant breed 
    patternAlpha: [0.5, 1.0],
    colors: {
      variants: [
        { first: '#4d312d', second: '#e4c5a8', third: '#4d312d' }, // classic
        { first: '#7b6761', second: '#a5938f', third: '#7b6761' }, // traditional
        { first: '#a49381', second: '#e8e3dd', third: '#a49381' }, // modern
        { first: '#d6ad94', second: '#f0e3db', third: '#d6ad94' }, // colourpoint
        { first: '#cac6c2', second: '#e5ded8', third: '#cac6c2' }, // balinese light
        { first: '#383735', second: '#b0a9a3', third: '#383735' } // balinese dark
      ],
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
    bodypartCode: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    bodypartCodeVariants: [
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1], // Moderate colorpoint - face, ears, body darker  
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1], // Strong colorpoint - extremities darker, body lighter
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]  // Face and tail focus colorpoint
    ],
    coatMod: [null, 0.8], // null means random
    nameLibrary: 13,
    desaturate: 0.5 // 50% chance to desaturate
  },

  'Lykoi': {
    pattern: 0,
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
    lykoiGene: true
  },

  'Burmese': {
    pattern: 4,
    maxSize: 12,
    size: [8, 12], // Compact, medium-sized breed
    patternAlpha: [0.3, 1.0],
    colors: {
      variants: [
        { first: '#220f04', second: '#8a5223', third: '#220f04' }, // sable
        { first: '#8e705f', second: '#dfbeab', third: '#8e705f' }, // champagne
        { first: '#42474d', second: '#42474d', third: '#42474d' }, // blue
        { first: '#b9a79e', second: '#e3cfc1', third: '#b9a79e' } // platinum
      ],
      eye: ['#ffe147', '#a26a45', '#32cd32', '#4169e1'] // Golden, amber, green, blue
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
    bodypartCode: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    bodypartCodeVariants: [
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Classic Burmese - extremities darker, body/chin lighter
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1], // Moderate Burmese - face and tail focus
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0]  // Light body Burmese - head and body lighter
    ],
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
      variants: [
        { first: '#efefef', second: '#efefef', third: '#efefef' }, // white
        { first: '#535353', second: '#535353', third: '#535353' }, // black
        { first: '#626b7c', second: '#626b7c', third: '#626b7c' }, // blue
        { first: '#f8e7d7', second: '#f8e7d7', third: '#f8e7d7' }, // cream
        { first: '#ad9e97', second: '#ad9e97', third: '#ad9e97' }, // lilac
        { first: '#765745', second: '#765745', third: '#765745' } // chocolate
      ],
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
      variants: [
        { first: trueBlack, second: trueWhite, third: trueBlack }, // B-W-B
        { first: trueBlack, second: trueWhite, third: trueWhite }, // B-W-W  
        { first: trueWhite, second: trueBlack, third: trueBlack }, // W-B-B
        { first: trueWhite, second: trueBlack, third: trueWhite }, // W-B-W
        { first: trueBlack, second: trueBlack, third: trueWhite }, // B-B-W
        { first: trueWhite, second: trueWhite, third: trueBlack }  // W-W-B
      ]
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
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3 }, // Brown tabby - gets tabby pattern
        { first: '#C0C0C0', second: trueBlack, third: trueWhite, pattern: 3 }, // Silver tabby - gets tabby pattern
        { first: '#D2B48C', second: '#FFA500', third: trueWhite, pattern: 3 }, // Orange tabby - gets tabby pattern
        { first: '#696969', second: '#C0C0C0', third: trueWhite }, // Blue - solid
        { first: trueWhite, second: trueBlack, third: trueWhite }, // Black and white - solid 
        { first: trueBlack, second: trueBlack, third: trueBlack }, // Solid black
        { first: trueWhite, second: trueWhite, third: trueWhite }  // Solid white
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
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid Scottish Fold
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Bicolor Scottish Fold - feet, ears, tail darker
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Tabby Scottish Fold - pattern on face, ears, body, tail  
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast Scottish Fold
    ],
    coatMod: [0.5, 0.8],
    nameLibrary: 3 // Celtic/Scottish names
  },

  'Manx': {
    pattern: 0, // Various coat patterns
    maxSize: 12,
    size: [8, 12], // Medium-sized, stocky breed  
    colors: {
      variants: [
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3 }, // Brown tabby
        { first: '#C0C0C0', second: trueBlack, third: trueWhite, pattern: 3 }, // Silver tabby
        { first: trueWhite, second: '#FFA500', third: '#FFE4B5', pattern: 3 }, // Orange tabby
        { first: trueBlack, second: trueWhite, third: trueWhite }, // Black and white
        { first: '#696969', second: '#C0C0C0', third: trueWhite }, // Blue/gray
        { first: trueBlack, second: trueBlack, third: trueBlack } // Solid black
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
    bodypartCode: [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    coatMod: [0.5, 0.8],
    nameLibrary: 3 // Celtic/Manx names
  },

  'Russian Blue': {
    pattern: 0, // Solid color only
    maxSize: 11,
    size: [7, 11], // Medium-sized, elegant breed
    colors: {
      variants: [
        { first: '#9a9aa3', second: '#9a9aa3', third: '#9a9aa3' }, // classic
        { first: '#c6c4c5', second: '#c6c4c5', third: '#c6c4c5' }, // lighter
        { first: '#708090', second: '#708090', third: '#708090' } // darker
      ],
      eye: '#b8d297', // Vivid green eyes (breed standard)
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
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid blue color
    coatMod: [0.3, 0.2], // Subtle variation
    nameLibrary: 11 // Russian names
  },

  'Calico': {
    pattern: 0,
    size: [8, chittenMaxSize],
    colors: {
      variants: [
        { first: trueWhite, second: trueBlack, third: '#e8831e' },        // W-B-O
        { first: trueWhite, second: '#555555', third: '#e8831e' },       // W-G-O
        { first: trueWhite, second: trueBlack, third: '#c89c7a' },       // W-B-LO
        { first: trueWhite, second: '#555555', third: '#c89c7a' },       // W-G-LO
        { first: trueBlack, second: trueWhite, third: '#e8831e' },       // B-W-O
        { first: '#555555', second: trueWhite, third: '#e8831e' },       // G-W-O
        { first: trueBlack, second: trueWhite, third: '#c89c7a' },       // B-W-LO
        { first: '#555555', second: trueWhite, third: '#c89c7a' },       // G-W-LO
        { first: '#e8831e', second: trueWhite, third: trueBlack },       // O-W-B
        { first: '#e8831e', second: trueWhite, third: '#555555' },       // O-W-G
        { first: '#c89c7a', second: trueWhite, third: trueBlack },       // LO-W-B
        { first: '#c89c7a', second: trueWhite, third: '#555555' }        // LO-W-G
      ],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0]
    },
    bodypartCode: 'random',
    coatMod: [0.1, 0.1], // Minimal gradient for distinct color patches
    nameLibrary: 'random',
    genderRestriction: 'female' // Very rare in males
  },

  // note for this breed we are "hiding" the black colour in the third colour slot and using the pattern to create that black appearance
  'Tortoiseshell': {
    pattern: 1,
    patternAlpha: [0.5, 1],
    size: [8, chittenMaxSize],
    colors: {
      variants: [
        { first: trueWhite, second: '#e8831e', third: trueBlack },       // W-O-B
        { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
        { first: trueWhite, second: '#c89c7a', third: trueBlack },       // W-LO-B
        { first: '#c89c7a', second: trueWhite, third: '#222222' }        // LO-W-G
      ],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0]
    },
    bodypartCode: 'random',
    coatMod: [0.1, 0.1], // Minimal gradient for distinct color patches
    nameLibrary: 'random',
    genderRestriction: 'female' // Very rare in males
  },

  'Sphynx': {
    pattern: 0, // Hairless, so pattern doesn't matter much
    maxSize: 14,
    size: [8, 14], // Medium sized breed
    colors: {
      first: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#FF8C00', '#654321', '#2F2F2F', trueBlack],
      second: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#FF8C00', '#654321', '#2F2F2F', trueBlack],
      third: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#FF8C00', '#654321', '#2F2F2F', trueBlack],
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
    bodypartCode: 'random',
    coatMod: [0.3, 0.2],
    nameLibrary: 5, // Egyptian
    hairlessGene: true // All true Sphynx cats have the hairless gene
  },

  'Abyssinian': {
    pattern: 7, // ticked pattern - each hair has multiple colors
    maxSize: 11,
    size: [8, 11], // Medium-sized, athletic breed
    patternAlpha: [0.8, 1.0],
    colors: {
      variants: [
        { first: '#3b2c1b', second: '#3b2c1b', third: trueWhite }, // Ruddy (classic)
        { first: '#c26d38', second: '#c26d38', third: trueWhite }, // Red/Sorrel
        { first: '#9b9380', second: '#9b9380', third: trueWhite }, // Blue
        { first: '#bda57f', second: '#bda57f', third: trueWhite }  // Fawn
      ],
      eye: ['#ffd700', '#daa520', '#32cd32'] // Gold to green eyes
    },
    traits: {
      thickness: [0.4, 0.6], // Lean, athletic build
      legginess: [0.7, 0.9], // Long, slender legs
      headWidth: [0.3, 0.5], // Wedge-shaped head
      headHeight: [0.4, 0.6],
      earWidth: [0.6, 0.8], // Large ears
      earHeight: [0.7, 0.9],
      eyeSize: [0.6, 0.8], // Large, almond eyes
      fangs: [0.3, 0.5],
      tailLength: [0.8, 1.0] // Long tail
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    coatMod: [0.8, 0.6],
    nameLibrary: 14 // Ethiopian names
  },

  'Ragdoll': {
    pattern: 4, // Color-point pattern like Siamese
    maxSize: 15, // One of the largest breeds
    size: [12, 15],
    patternAlpha: [0.6, 0.9],
    colors: {
      variants: [
        { first: '#9d7665', second: '#f0d9cb', third: '#f0d9cb' }, // Seal point
        { first: '#9c9da2', second: '#ebe7e4', third: '#ebe7e4' }, // Blue point  
        { first: '#f7d5ba', second: '#f4f2ed', third: '#f4f2ed' }, // Red point
        { first: '#cab9b1', second: '#e1dcd8', third: '#e1dcd8' }, // Lilac point
        { first: '#ddcbb7', second: '#e9e6e1', third: '#e9e6e1' }  // Cream point      
      ],
      eye: '#4169e1' // Always blue eyes
    },
    traits: {
      thickness: [0.7, 0.9], // Large, sturdy build
      legginess: [0.5, 0.7], // Medium legs, sturdy
      headWidth: [0.6, 0.8], // Broad, round head
      headHeight: [0.6, 0.8],
      earWidth: [0.4, 0.6], // Medium ears
      earHeight: [0.5, 0.7],
      eyeSize: [0.7, 0.9], // Large, oval eyes
      fangs: [0.2, 0.4], // Gentle expression
      tailLength: [0.9, 1.1] // Long, fluffy tail
    },
    bodypartCode: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0],
    bodypartCodeVariants: [
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0], // Classic Ragdoll colorpoint - extremities darker, body/chest lighter
      [0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0], // Moderate colorpoint - face focus
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Mitted pattern - feet darker, head/chin/chest lighter
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]  // Bicolor pattern - ears, body, tail, jowls, chest darker
    ],
    coatMod: [0.5, 0.8],
    nameLibrary: 'random' // No specific cultural origin
  },

  'Angora': {
    pattern: 0, // Solid or various patterns
    maxSize: 12,
    size: [7, 12], // Medium-sized, elegant
    patternAlpha: [0.2, 0.7],
    colors: {
      variants: [
        { first: trueWhite, second: trueWhite, third: trueWhite }, // Classic white
        { first: '#1c1714', second: '#1c1714', third: '#1c1714' }, // Black
        { first: '#d2bbad', second: '#d2bbad', third: '#d2bbad' }, // Red
        { first: '#6d7580', second: '#6d7580', third: '#6d7580' }, // Blue
        { first: trueWhite, second: trueWhite, third: trueWhite, }, // white
        { first: '#f8e7d7', second: '#f8e7d7', third: '#f8e7d7' }  // Cream
      ],
      eye: ['#7b8867', '#6b8da6', '#967749'] // Often odd-eyed
    },
    traits: {
      thickness: [0.4, 0.6], // Slender, elegant
      legginess: [0.6, 0.8], // Medium-long legs
      headWidth: [0.4, 0.6], // Small to medium wedge head
      headHeight: [0.5, 0.7],
      earWidth: [0.5, 0.7], // Medium ears, well-tufted
      earHeight: [0.6, 0.8],
      eyeSize: [0.6, 0.8], // Large, almond eyes
      fangs: [0.3, 0.5],
      tailLength: [0.9, 1.1] // Long, plumed tail
    },
    bodypartCode: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid Angora
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Two-tone Angora - all second color
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Colorpoint Angora - face, ears, body, tail, jowls, chest darker
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast Angora
    ],
    coatMod: [0.3, 0.5],
    nameLibrary: 15, // Turkish names
    heterochromicGene: 0.25 // 25% base chance, higher for light colors
  },

  'British Shorthair': {
    pattern: 0, // Usually solid colors
    maxSize: 15,
    size: [9, 15], // Medium to large, stocky
    patternAlpha: [0.1, 0.4],
    colors: {
      variants: [
        { first: '#708090', second: '#708090', third: '#708090' }, // British Blue (classic)
        { first: trueBlack, second: trueBlack, third: trueBlack }, // Black
        { first: trueWhite, second: trueWhite, third: trueWhite }, // White
        { first: '#deb887', second: '#deb887', third: '#deb887' }, // Cream
        { first: '#d2691e', second: '#d2691e', third: '#d2691e' }, // Red
        { first: '#c0c0c0', second: trueBlack, third: trueWhite, pattern: 3 }, // Silver tabby
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3 } // Brown tabby
      ],
      eye: ['#ffd700', '#ff8c00', '#32cd32'] // Gold to green eyes  
    },
    traits: {
      thickness: [0.8, 1.0], // Very stocky, cobby build
      legginess: [0.3, 0.5], // Short, sturdy legs
      headWidth: [0.8, 1.0], // Very round, broad head
      headHeight: [0.7, 0.9], // Round face
      earWidth: [0.3, 0.5], // Small, round ears
      earHeight: [0.4, 0.6],
      eyeSize: [0.7, 0.9], // Large, round eyes
      fangs: [0.2, 0.4], // Gentle expression
      tailLength: [0.6, 0.8], // Medium tail, thick
      nosePos: 0.4 // Short nose
    },
    bodypartCode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid British Shorthair
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Bicolor British Shorthair - feet, ears, tail darker
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Tabby British Shorthair - face, ears, body, tail, jowls, chest use second color
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast - feet, jowls, chin, chest use third color
    ],
    coatMod: [0.2, 0.4],
    nameLibrary: 16 // British names
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
      // If this variant specifies its own pattern, override the breed default
      if (variant.pattern !== undefined) {
        who.pattern = variant.pattern;
      }
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
    if (breed.bodypartCode === 'random') {
      // Generate random bodypart codes (0, 1, or 2)
      who.bodypartCode = Array.from({ length: 13 }, () => Math.floor(Math.random() * 3));
    } else if (Array.isArray(breed.bodypartCode)) {
      who.bodypartCode = [...breed.bodypartCode];
    }
  }

  // Handle bodypartCode variants (similar to color variants)
  if (breed.bodypartCodeVariants && Array.isArray(breed.bodypartCodeVariants)) {
    const bodypartVariant = breed.bodypartCodeVariants[Math.floor(Math.random() * breed.bodypartCodeVariants.length)];
    who.bodypartCode = [...bodypartVariant];
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

  // Apply lykoi gene if specified by breed
  if (breed.lykoiGene) {
    who.lykoiGene = true;
    who.lykoi = true; // Lykoi breeds always express the trait
  }

  // Apply heterochromic gene chance if specified by breed
  if (breed.heterochromicGene && Math.random() < breed.heterochromicGene) {
    who.heterochromicGene = true;
  }

  // Special case: Angora cats have higher heterochromia rates for light colors
  if (breedName === 'Angora' && !who.heterochromicGene) {
    // Calculate brightness of the coat color (0-255 scale)
    let brightness = getBrightness(who.firstColour);

    // Light colors (brightness > 180) get higher heterochromia chance
    if (brightness > 180 && Math.random() < 0.15) { // Additional 15% chance for light colors
      who.heterochromicGene = true;
    }
  }

  // Apply cultural names
  if (breed.nameLibrary !== undefined) {
    if (breed.nameLibrary == 'random') {
      if (who.gender == 'Male' || (who.gender == 'Non Binary' && Math.random() < 0.5)) {
        who.name = getMaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
      } else {
        who.name = getFemaleName(Math.floor(Math.random() * ((numlibs * namesinlib))));
      }
      // male parent
    } else if (who.gender === 'Male' || (who.gender === 'Non Binary' && Math.random() < 0.5)) {
      who.name = getRandomMaleCulturalName(breed.nameLibrary);
    } else {
      who.name = getRandomFemaleCulturalName(breed.nameLibrary);
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

function breedPersian(who) { applyBreed(who, 'Persian'); }

function breedRussianBlue(who) { applyBreed(who, 'Russian Blue'); }

function breedCalico(who) { applyBreed(who, 'Calico'); }

function breedTortoiseShell(who) { applyBreed(who, 'Tortoiseshell'); }

function breedBurmese(who) { applyBreed(who, 'Burmese'); }

function breedAbyssinian(who) { applyBreed(who, 'Abyssinian'); }

function breedRagdoll(who) { applyBreed(who, 'Ragdoll'); }

function breedAngora(who) { applyBreed(who, 'Angora'); }

function breedBritishShorthair(who) { applyBreed(who, 'British Shorthair'); }

function breedManxTortoiseshell(who) {
  // Apply base Manx characteristics
  applyBreed(who, 'Manx');
  // Override with tortoiseshell pattern and colors
  who.pattern = 1; // Tortoiseshell pattern
  who.patternAlpha = randomBetween(0.5, 1);
  // Use tortoiseshell color scheme
  const tortVariants = [
    { first: trueWhite, second: '#e8831e', third: trueBlack },       // W-O-B
    { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
    { first: trueWhite, second: '#c89c7a', third: trueBlack },       // W-LO-B
    { first: '#c89c7a', second: trueWhite, third: '#222222' }        // LO-W-G
  ];
  const variant = tortVariants[Math.floor(Math.random() * tortVariants.length)];
  who.firstColour = mixRandomCoatColor(variant.first);
  who.secondColour = mixRandomCoatColor(variant.second);
  who.thirdColour = mixRandomCoatColor(variant.third);
}

function breedBritishShorthairTortoiseshell(who) {
  // Apply base British Shorthair characteristics
  applyBreed(who, 'British Shorthair');
  // Override with tortoiseshell pattern and colors
  who.pattern = 1; // Tortoiseshell pattern
  who.patternAlpha = randomBetween(0.5, 1);
  // Use tortoiseshell color scheme
  const tortVariants = [
    { first: trueWhite, second: '#e8831e', third: trueBlack },       // W-O-B
    { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
    { first: trueWhite, second: '#c89c7a', third: trueBlack },       // W-LO-B
    { first: '#c89c7a', second: trueWhite, third: '#222222' }        // LO-W-G
  ];
  const variant = tortVariants[Math.floor(Math.random() * tortVariants.length)];
  who.firstColour = mixRandomCoatColor(variant.first);
  who.secondColour = mixRandomCoatColor(variant.second);
  who.thirdColour = mixRandomCoatColor(variant.third);
}

// Special breed functions that need custom logic

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

  if (!who.breed || who.breed === mixedBreed) {
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

// Breed spawn configuration - easily extensible
const BREED_SPAWN_CONFIG = {
  // Regular breeds (any gender)
  regularBreeds: [
    {
      name: 'Siamese',
      func: breedSiamese
    },
    {
      name: 'Burmese',
      func: breedBurmese
    },
    {
      name: 'Russian Blue',
      func: breedRussianBlue
    },
    {
      name: 'Persian',
      func: breedPersian
    },
    {
      name: 'Manx',
      func: breedManx,
      femaleVariants: [
        { name: 'Manx Tortoiseshell', func: breedManxTortoiseshell, chance: 0.15 }
      ]
    },
    {
      name: 'Tabby',
      func: breedTabby
    },
    {
      name: 'Scottish Fold',
      func: breedScottishFold
    },
    {
      name: 'Lykoi',
      func: breedLykoi
    },
    {
      name: 'Sphynx',
      func: breedSphynx
    },
    {
      name: 'Bengal',
      func: breedBengal
    },
    {
      name: 'Egyptian Mau',
      func: breedEgyptianMau
    },
    {
      name: 'Black and white shorthair',
      func: breedTwoTone
    },
    {
      name: 'Abyssinian',
      func: breedAbyssinian
    },
    {
      name: 'Ragdoll',
      func: breedRagdoll
    },
    {
      name: 'Angora',
      func: breedAngora
    },
    {
      name: 'British Shorthair',
      func: breedBritishShorthair,
      femaleVariants: [
        { name: 'British Shorthair Tortoiseshell', func: breedBritishShorthairTortoiseshell, chance: 0.15 }
      ]
    }
  ],

  // Female-only breeds with rare male occurrence (discrete breeds, not variants)
  femaleOnlyBreeds: [
    { name: 'Calico', func: breedCalico, maleChance: 1 / 3000 },
    { name: 'Tortoiseshell', func: breedTortoiseShell, maleChance: 1 / 3000 }
  ],

  // What percentage of cats should get female-only breeds (when female)
  femaleOnlyChance: 0.15 // 15% of females get Calico/Tortoiseshell
};

applyBreedTemplate = function (who) {
  const config = BREED_SPAWN_CONFIG;
  // First, check if this should be a female-only breed
  if (who.gender !== 'Male') {
    // For females/non-binary: chance of getting female-only breed
    if (Math.random() < config.femaleOnlyChance) {
      const femaleBreed = config.femaleOnlyBreeds[Math.floor(Math.random() * config.femaleOnlyBreeds.length)];
      femaleBreed.func(who);
      return;
    }
  } else {
    // For males: very rare chance of female-only breeds
    for (const femaleBreed of config.femaleOnlyBreeds) {
      if (Math.random() < femaleBreed.maleChance) {
        femaleBreed.func(who);
        return;
      }
    }
  }
  // Otherwise, pick from regular breeds with equal distribution
  const regularBreed = config.regularBreeds[Math.floor(Math.random() * config.regularBreeds.length)];

  // Check if this breed has female variants and if this cat is female
  if (who.gender !== 'Male' && regularBreed.femaleVariants) {
    for (const variant of regularBreed.femaleVariants) {
      if (Math.random() < variant.chance) {
        variant.func(who);
        return;
      }
    }
  }

  // Apply the base breed
  regularBreed.func(who);
};

// Apply specific breed template for adoption center filtering
applySpecificBreedTemplate = function (who, breedName) {
  const config = BREED_SPAWN_CONFIG;

  // Handle 'All' filter - use normal random selection
  if (breedName === 'All') {
    applyBreedTemplate(who);
    return;
  }

  // Check if it's a female-only breed
  const femaleOnlyBreed = config.femaleOnlyBreeds.find(breed => breed.name === breedName);
  if (femaleOnlyBreed) {
    // Only apply if gender allows it (respecting male chance)
    if (who.gender !== 'Male' || Math.random() < femaleOnlyBreed.maleChance) {
      femaleOnlyBreed.func(who);
      return;
    } else {
      // Fall back to random regular breed for males when they can't get female-only breed
      applyBreedTemplate(who);
      return;
    }
  }

  // Check regular breeds
  const regularBreed = config.regularBreeds.find(breed => breed.name === breedName);
  if (regularBreed) {
    // Check if this breed has female variants and if this cat is female
    if (who.gender !== 'Male' && regularBreed.femaleVariants) {
      for (const variant of regularBreed.femaleVariants) {
        if (Math.random() < variant.chance) {
          variant.func(who);
          return;
        }
      }
    }

    // Apply the base breed
    regularBreed.func(who);
    return;
  }

  // Fallback to random if breed not found
  applyBreedTemplate(who);
};