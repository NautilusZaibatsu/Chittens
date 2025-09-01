// Optimized breed system with data-driven approach

const mixedBreed = 'Mixed';

const BREED_DATA = {
  'Bengal': {
    description: "Athletic wildcats with leopard-like spotted coats. Highly coordinated hunters with muscular builds and excellent jumping ability. Known for their wild ancestry and love of climbing.",
    pattern: 6,
    size: [16, 19],
    colors: {
      variants: [
        { first: '#deb99c', second: '#c39471', third: '#361f19', patternColour: '#170f06', eye: '#ae8b33' }, // brown
        { first: '#e8dfd4', second: '#f6d8c3', third: '#b38165', patternColour: '#b39e94', eye: '#7ba2ba' }, // snow lynx
        { first: '#dbd2cb', second: '#c3beb8', third: '#c3beb8', patternColour: '#b7835b', eye: '#639bad' }, // snow mink
        { first: '#d8c8c2', second: '#9c8b84', third: '#9c8b84', patternColour: '#654f44', eye: '#b8863a' }, // snow sepia
        { first: '#d4cbca', second: '#bdbbb8', third: '#bdbbb8', patternColour: '#0f1006', eye: '#95b896' }, // silver
        { first: '#99958b', second: '#99958b', third: '#3a322b', patternColour: '#2c1716', eye: '#ad773b' }, // charcoal
        { first: '#cfced9', second: '#948c9d', third: '#948c9d', patternColour: '#322e32', eye: '#c9d9a6' }, // blue
        { first: '#331d12', second: '#261919', third: '#261919', patternColour: '#4e3b36', eye: '#a87638' }  // black
      ]
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
      nosePos: 0.7,
      mawSize: 0.6,
      coordination: 0.8
    },
    bodypartCodeVariants: [
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0]
    ],
    // coats
    patternAlpha: [0.1, 0.8],
    coatMod: [0.76, 0.25, 'random'],
    nameLibrary: 8
  },

  'Egyptian Mau': {
    description: "Ancient Egyptian breed and fastest domestic cat, reaching 30mph. Exceptionally coordinated with natural spotted coats and distinctive 'M' forehead marking.",
    pattern: 6,
    size: [8, 15],
    colors: {
      variants: [
        { first: '#f1f1f1', second: '#bfb9bb', third: '#bfb9bb', patternColour: '#645e60' }, // silver
        { first: '#f1d1ac', second: '#cb814a', third: '#cb814a', patternColour: '#535250' }, // orange
        { first: '#a09e9f', second: '#565455', third: '#565455', patternColour: '#333333' }, // grey
        { first: '#ab835d', second: '#5b4b3e', third: '#5b4b3e', patternColour: '#302624' }, // brown
        { first: '#f1d1ac', second: '#d4b48d', third: '#d4b48d', patternColour: '#e0be89' }, // cream
        { first: '#d0c6bc', second: '#a39282', third: '#a39282', patternColour: '#6d6056' } //  fawn
      ],
      eye: ['#89aa22', '#f2b732']
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
      nosePos: 0.75,
      mawSize: 0.6,
      coordination: 0.95
    },
    bodypartCodeVariants: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1], // chin, chest and jowl lighter
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //solid
    ],
    // coats    
    patternAlpha: [0.5, 1.0],
    coatMod: [0.25, 0.25, 'random', 1],
    nameLibrary: 5
  },

  'Tabby': {
    description: "Common striped cats with varied coordination and mixed genetics. Classic 'M' forehead markings come in orange, brown, and silver varieties with diverse personalities.",
    pattern: 3,
    size: [chittenMinSize, chittenMaxSize],
    colors: {
      variants: [
        { first: '#e0e0c3', second: '#bda962', third: '#bda962', patternColour: '#2c2713' }, // brown
        { first: '#86603e', second: '#754d2b', third: '#754d2b', patternColour: '#312208' }, // chocolate
        { first: '#bb894d', second: '#b07631', third: '#b07631', patternColour: '#503412' }, // cinnamon
        { first: '#ecca8f', second: '#f8ac25', third: '#f8ac25', patternColour: ['#e3811e', '#47290a'] }, // red
        { first: '#c2c2c7', second: ['#a6a6b0', '#ccd1d7'], third: ['#a6a6b0', '#ccd1d7'], patternColour: ['#3e3e4a', '#5d5c6c', '#161616'] }, // blue/lilac
        { first: '#ffffee', second: '#f0f2e4', third: '#f0f2e4', patternColour: '#e9d9ac' }, // cream
        { first: '#e4d6be', second: '#e0d7d0', third: '#e0d7d0', patternColour: ['#71695b', '#706768', '#242323'] }, // fawn
        { first: ['#d5cebe', '#f2ebdb'], second: ['#c5beae', '#e2dbcb'], third: '#f8ac25', patternColour: ['#554d41', '#544f4c', '#181717'] }, // caramel
        { first: '#f9f0e2', second: '#f9f0e2', third: '#f9f0e2', patternColour: '#eccb9c' }, // light amber
        { first: ['#525258', '#36363a'], second: '#29292b', third: '#29292b', patternColour: '#222222' } // black
      ]
    },
    traits: {
      fangs: [0.4, 0.7],
      legginess: [0.6, 0.8],
      mawSize: [0.5, 0.7],
      coordination: [0.4, 0.7],
      headWidth: [0.47, 0.53],
      headHeight: [0.45, 0.55],
      thickness: [0.45, 0.6]
    },
    bodypartCodeVariants: [
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1], // white foot and chin tabby with light chest
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // Classic tabby - mostly first color with pattern overlay
      // [0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0], // High contrast tabby - feet, ears, tail darker, head/chin/chest lighter  
      // [2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0], // Inverse tabby - face, ears, body, tail, jowls, chest darker
      // [1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1]  // Bengal-style tabby - feet, jowls, chin, chest use third color
    ],
    // coats
    patternAlpha: [0.8, 1],
    coatMod: ['random', 0.25, 'random', 1],
    nameLibrary: 'random'
  },

  'Siamese': {
    description: "Elegant colorpoint cats with brilliant blue eyes. Highly coordinated and athletic with distinctive temperature-sensitive coat coloring. Vocal and intelligent.",
    pattern: 0,
    maxSize: 12,
    size: [10.5, 17.5], // Medium-sized, elegant breed 
    colors: {
      variants: [
        { first: '#e4c5a8', second: '#e4c5a8', third: '#4d312d', patternColour: '#4d312d' }, // classic
        { first: '#a5938f', second: '#a5938f', third: '#7b6761', patternColour: '#7b6761' }, // traditional
        { first: '#e8e3dd', second: '#e8e3dd', third: '#a49381', patternColour: '#a49381' }, // modern
        { first: '#f0e3db', second: '#f0e3db', third: '#d6ad94', patternColour: '#d6ad94' }, // colourpoint
        { first: '#e5ded8', second: '#e5ded8', third: '#cac6c2', patternColour: '#cac6c2' }, // balinese light
        { first: '#b0a9a3', second: '#b0a9a3', third: '#383735', patternColour: '#383735' } // balinese dark
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
      earHeight: 0.6,
      mawSize: 0.7,
      coordination: 0.9
    },
    bodypartCodeVariants: [
      [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0], // Moderate colorpoint - face, ears, body darker  
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0]  // Face and tail focus colorpoint
    ],
    colourpointMapVariants: [
      [false, true, true, true], // Classic Siamese - ears, feet, tail only
      [true, true, true, true],  // Full colorpoint - chin, ears, feet, tail
      [false, true, false, true], // Ears and tail only
      [false, true, true, false]  // Ears and feet only
    ],
    // coats
    patternAlpha: [0.5, 1.0],
    coatMod: ['random', 0.25, 'random', 1],
    nameLibrary: 13,
    desaturate: 0.5, // 50% chance to desaturate
    breedStandardGenes: ['colourpoint']
  },

  'Lykoi': {
    description: "The 'Werewolf Cat' with sparse, wiry fur and bold personality. Poor coordination due to genetic mutations affecting their unique patchy coat and wild appearance.",
    pattern: 0,
    maxSize: 14,
    size: [13.5, 18],
    colors: {
      variants: [
        { first: '#342f2c', second: '#342f2c', third: '#342f2c', patternColour: '#342f2c' }, // brown
        { first: '#c5c3c1', second: '#c5c3c1', third: '#c5c3c1', patternColour: '#c5c3c1' }, // light grey
        { first: '#8e999e', second: '#8e999e', third: '#8e999e', patternColour: '#8e999e' }, // grey
        { first: '#41454d', second: '#41454d', third: '#41454d', patternColour: '#41454d' }, // dark grey
        { first: '#343434', second: '#343434', third: '#343434', patternColour: '#343434' }, // grey brown
        { first: '#222222', second: '#222222', third: '#222222', patternColour: '#222222' }, // black

      ],
      eye: ['#6c6b53', '#c5c473', '#e6c337', '#a38d33'],
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
      eyeSize: 0,
      mawSize: 0.8,
      coordination: 0.3
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0]
    ],
    nameLibrary: 1,
    breedStandardGenes: ['baldFaced', 'sparseCoat']
  },

  'Burmese': {
    description: "Compact muscular cats with golden eyes and solid coats. Well-coordinated with strong builds, originally from Myanmar. Friendly and people-oriented.",
    pattern: 0,
    maxSize: 12,
    size: [10.5, 17.5], // Compact, medium-sized breed
    colors: {
      variants: [
        { first: '#8a5223', second: '#8a5223', third: '#220f04', patternColour: '#220f04' }, // sable
        { first: '#dfbeab', second: '#dfbeab', third: '#8e705f', patternColour: '#8e705f' }, // champagne
        { first: '#494d52', second: '#494d52', third: '#42474d', patternColour: '#42474d' }, // blue
        { first: '#e0e0e0', second: '#e0e0e0', third: '#b6b6b6', patternColour: '#b6b6b6' } // platinum
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
      earHeight: 0.6,
      mawSize: 0.5,
      coordination: 0.7
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Classic Burmese - extremities darker, body/chin lighter 
    ],
    colourpointMapVariants: [
      [false, false, true, false], // Feet only (subtle Burmese)
      [false, true, true, false],  // Ears and feet
      [false, true, true, true],   // Ears, feet, and tail
      [false, true, true, true]     // Full colorpoint (rare)
    ],
    // coats
    patternAlpha: [0.3, 1.0],
    coatMod: [[0, 0.6], 0.25, 'random', 1],
    nameLibrary: 13,
    desaturate: 0.5,
    breedStandardGenes: ['colourpoint']
  },

  'Persian': {
    description: "Luxurious long-haired cats with flat faces and gentle temperaments. Poor coordination due to their brachycephalic features but beloved for their calm nature.",
    pattern: 0,
    maxSize: 13,
    size: [10.5, 18.5], // Medium-large, fluffy breed
    colors: {
      variants: [
        { first: '#efefef', second: '#efefef', third: '#efefef' }, // white
        { first: '#535353', second: '#535353', third: '#535353' }, // black
        { first: '#626b7c', second: '#626b7c', third: '#626b7c' }, // blue
        { first: '#f8e7d7', second: '#f8e7d7', third: '#f8e7d7' }, // cream
        { first: '#ad9e97', second: '#ad9e97', third: '#ad9e97' }, // lilac
        { first: '#765745', second: '#765745', third: '#765745' }, // chocolate
        { first: '#0e0d0d', second: '#0e0d0d', third: '#0e0d0d', eye: '#be7547' }, // black
      ],
      eye: ['#c5e93d', '#583d14']
    },
    traits: {
      thickness: 1,
      headWidth: 1,
      headHeight: 1,
      eyePosX: 0.33,
      eyePosY: 0.33,
      fangs: 0.2,
      earWidth: 0.55,
      earHeight: 0.55,
      mawSize: 0.2,
      coordination: 0.3,
      legginess: [0.5, 0.65]
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    patternAlpha: 0,
    coatMod: ['random*0.6', 0.29, 'random', 'random*0.3'],
    nameLibrary: 2,
    breedStandardGenes: ['brachycephalic']
  },

  'Black and white shorthair': {
    description: "Classic tuxedo cats with varied coordination from mixed genetics. Hardy and adaptable with distinctive black and white patterns. Common house cats.",
    pattern: 0,
    size: [8, chittenMaxSize],
    colors: {
      variants: [
        { first: '#000000', second: trueWhite, third: '#000000' }, // B-W-B
        { first: '#000000', second: trueWhite, third: trueWhite }, // B-W-W  
        { first: trueWhite, second: '#000000', third: '#000000' }, // W-B-B
        { first: trueWhite, second: '#000000', third: trueWhite }, // W-B-W
        { first: '#000000', second: '#000000', third: trueWhite }, // B-B-W
        { first: trueWhite, second: trueWhite, third: '#000000' }  // W-W-B
      ]
    },
    traits: {
      legginess: [0.4, 0.6],
      thickness: [0.5, 0.7],
      headHeight: 0,
      headWidth: [0, 0.4],
      mawSize: [0.4, 0.6],
      coordination: [0.4, 0.6]
    },
    bodypartCodeVariants: [
      'random' // Special case for random body parts
    ],
    coatMod: [0, 0.25, 'random'],
    nameLibrary: 'random'
  },

  'Scottish Fold': {
    description: "Round-faced cats with unique folded ears and sweet expressions. Moderate coordination despite ear cartilage mutation. Originally from Scottish barn cat.",
    pattern: 0, // Can be various patterns, not just tabby
    maxSize: 13,
    size: [10.5, 17.5], // Medium-sized breed
    customHeadHeight: 'proportional', // Special head height calculation
    customHeadRatio: 1.4,
    colors: {
      variants: [
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Brown tabby - gets tabby pattern
        { first: '#C0C0C0', second: '#333339', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Silver tabby - gets tabby pattern
        { first: '#D2B48C', second: '#FFA500', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Orange tabby - gets tabby pattern
        { first: '#696969', second: '#C0C0C0', third: trueWhite }, // Blue - solid
        { first: '#16100c', second: '#16100c', third: trueWhite }, // Black and white - solid 
        { first: '#16100c', second: '#16100c', third: '#16100c' }, // Solid black
        { first: trueWhite, second: trueWhite, third: trueWhite }  // Solid white
      ],
      eye: ['#c4e256', '#549e54', '#4169E1'] // Gold, green, blue
    },
    traits: {
      earHeight: 0, // Folded ears - key breed trait
      earWidth: 0,
      headWidth: [0.6, 0.9], // Round head
      thickness: [0.6, 0.8], // Medium build
      legginess: [0.5, 0.7], // Short to medium legs
      fangs: [0.3, 0.6],
      mawSize: 0.3,
      coordination: 0.6
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid Scottish Fold
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Bicolor Scottish Fold - feet, ears, tail darker
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Tabby Scottish Fold - pattern on face, ears, body, tail  
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast Scottish Fold
    ],
    coatMod: [0.5, 0.8, 'random'],
    nameLibrary: 3 // Celtic/Scottish names
  },

  'Manx': {
    description: "Tailless cats from Isle of Man with powerful hind legs and round bodies. Moderate coordination affected by spine mutation but excellent jumpers.",
    pattern: 0, // Various coat patterns
    maxSize: 12,
    size: [10.5, 9], // Medium-sized, stocky breed
    customHeadHeight: 'proportional', // Special head height calculation
    customHeadRatio: 50 / 35, // headHeight = headWidth / 50 * 35
    colors: {
      variants: [
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Brown tabby
        { first: '#C0C0C0', second: '#16100c', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Silver tabby
        { first: trueWhite, second: '#FFA500', third: '#FFE4B5', pattern: 3, patternColour: '#000000' }, // Orange tabby
        { first: '#16100c', second: trueWhite, third: trueWhite }, // Black and white
        { first: '#696969', second: '#C0C0C0', third: trueWhite }, // Blue/gray
        { first: '#16100c', second: '#16100c', third: '#16100c' } // Solid black
      ],
      eye: ['#c4e256', '#549e54', '#4169E1'] // Gold, green, blue
    },
    traits: {
      headWidth: [0.7, 1.0], // Round, full head
      thickness: [0.7, 0.9], // Stocky build
      legginess: [0.6, 0.8], // Strong legs
      tailLength: 0, // Key breed trait - no tail
      eyeSize: [0.7, 1.0], // Large, round eyes
      fangs: [0.4, 0.7],
      mawSize: 0.4,
      coordination: 0.5
    },
    bodypartCodeVariants: [
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0]
    ],
    coatMod: [0.5, 0.8, 'random'],
    nameLibrary: 3 // Celtic/Manx names
  },

  'Russian Blue': {
    description: "Elegant silver-blue cats with vivid green eyes and plush double coats. Highly coordinated and athletic with shy but affectionate personalities.",
    pattern: 0, // Solid color only
    maxSize: 11,
    size: [10.5, 16], // Medium-sized, elegant breed
    colors: {
      variants: [
        { first: '#9a9aa3', second: '#9a9aa3', third: '#9a9aa3' }, // lighter
        { first: '#747491', second: '#747491', third: '#747491' }, // classic
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
      nosePos: 0.65,
      mawSize: 0.5,
      coordination: 0.8
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // Solid blue color
    ],
    coatMod: [0.3, 0.2, 'random'],
    nameLibrary: 11 // Russian names
  },

  'Calico': {
    description: "Tri-colored females with white, black, and orange patches. Variable coordination from complex genetics. Males extremely rare due to X-chromosome linkage.",
    pattern: 0,
    size: [10.5, 17],
    colors: {
      variants: [
        { first: trueWhite, second: '#000000', third: '#e8831e' },        // W-B-O
        { first: trueWhite, second: '#222222', third: '#e8831e' },       // W-G-O
        { first: trueWhite, second: '#000000', third: '#a77047' },       // W-B-LO
        { first: trueWhite, second: '#222222', third: '#a77047' },       // W-G-LO
        { first: '#000000', second: trueWhite, third: '#e8831e' },       // B-W-O
        { first: '#222222', second: trueWhite, third: '#e8831e' },       // G-W-O
        { first: '#000000', second: trueWhite, third: '#a77047' },       // B-W-LO
        { first: '#222222', second: trueWhite, third: '#a77047' },       // G-W-LO
        { first: '#e8831e', second: trueWhite, third: '#000000' },       // O-W-B
        { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
        { first: '#a77047', second: trueWhite, third: '#000000' },       // LO-W-B
        { first: '#a77047', second: trueWhite, third: '#222222' }        // LO-W-G
      ],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0],
      mawSize: [0.5, 0.7],
      coordination: [0.3, 0.6]
    },
    bodypartCodeVariants: [
      'random'
    ],
    coatMod: [0.1, 0.1, 'random', 0],
    nameLibrary: 'random',
    genderRestriction: 'female' // Very rare in males
  },

  // note for this breed we are "hiding" the black colour in the third colour slot and using the pattern to create that black appearance
  'Tortoiseshell': {
    description: "Mottled black and orange females with fiery personalities. Variable coordination from mixed genetics. Also called 'torties' with strong-willed nature.",
    pattern: 1,
    size: [10, 17],
    colors: {
      variants: [
        { first: trueWhite, second: '#e8831e', third: '#000000' },       // W-O-B
        { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
        { first: trueWhite, second: '#c89c7a', third: '#000000' },       // W-LO-B
        { first: '#c89c7a', second: trueWhite, third: '#222222' }        // LO-W-G
      ],
      eye: 'random'
    },
    traits: {
      thickness: [0.5, 0.7],
      fangs: [0, 0.5],
      legginess: [0.8, 1.0],
      mawSize: [0.5, 0.7],
      coordination: [0.3, 0.6]
    },
    bodypartCodeVariants: [
      'random'
    ],
    // coats
    patternAlpha: [0.9, 1],
    coatMod: [0.1, 0.1, 'random'],
    nameLibrary: 'random',
    genderRestriction: 'female', // Very rare in males
    forcePatternColour: '#000000'
  },

  'Sphynx': {
    description: "Hairless cats with wrinkled skin and extroverted personalities. Moderate coordination despite unique appearance. Feel warm to touch and love attention.",
    pattern: 0, // Hairless, so pattern doesn't matter much
    maxSize: 14,
    size: [10.5, 18.5], // Medium sized breed
    colors: {
      first: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#2F2F2F'],
      second: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#2F2F2F'],
      third: ['#FAD6CF', '#F5C6AA', trueWhite, '#EEEEEE', '#DDDDDD', '#2F2F2F'],
      eye: ['#1E90FF', '#60b64f', '#e7d156'] // Vivid eyes common in Sphynx
    },
    traits: {
      thickness: 0.5,
      legginess: 0.8,
      headWidth: 0,
      headHeight: 0,
      earWidth: [0.5, 1.0],
      earHeight: [0.5, 1.0],
      coordination: 0.4
    },
    bodypartCodeVariants: [
      'random'
    ],
    coatMod: [0.3, 0.2, 'random'],
    nameLibrary: 5, // Egyptian
    breedStandardGenes: ['hairless'] // All true Sphynx cats have the hairless gene
  },

  'Abyssinian': {
    description: "Ancient athletic breed with ticked coats and alert expressions. Exceptionally coordinated and active, often called the 'athlete of the cat world'.",
    pattern: 7, // ticked pattern - each hair has multiple colors
    maxSize: 11,
    size: [10.5, 16], // Medium-sized, athletic breed
    colors: {
      variants: [
        { first: ['#a87132', '#cb734a'], second: ['#36220b', '#531d07'], third: trueWhite, patternColour: '#000000' }, // Ruddy (classic)
        { first: '#d6784c', second: '#ac4500', third: trueWhite, patternColour: '#000000' }, // Red/Sorrel
        { first: '#c7b8af', second: ['#68646b', '#252525'], third: trueWhite, patternColour: '#000000' }, // Blue
        { first: '#e6ca9d', second: '#bda47f', third: trueWhite, patternColour: '#000000' }  // Fawn
      ],
      eye: ['#ffd700', '#daa520', '#45cf45'] // Gold to green eyes
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
      tailLength: [0.8, 1.0], // Long tail
      coordination: 0.9
    },
    bodypartCodeVariants: [
      [0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 2, 0]
    ],
    // coats
    patternAlpha: [0.7, 1],
    coatMod: [[0.4, 0.6], 0.25, 'random'],
    nameLibrary: 14 // Ethiopian names
  },

  'Ragdoll': {
    description: "Large docile cats that go limp when picked up. Poor coordination due to relaxed nature and large size. Known for blue eyes and colorpoint patterns.",
    pattern: 0,
    maxSize: 15, // One of the largest breeds
    size: [16, 20],
    colors: {
      variants: [
        { first: '#f0d9cb', second: '#f0d9cb', third: '#9d7665', patternColour: '#9d7665' }, // Seal point
        { first: '#ebe7e4', second: '#ebe7e4', third: '#9c9da2', patternColour: '#9c9da2' }, // Blue point  
        { first: '#f4f2ed', second: '#f4f2ed', third: '#f7d5ba', patternColour: '#f7d5ba' }, // Red point
        { first: '#e1dcd8', second: '#e1dcd8', third: '#cab9b1', patternColour: '#cab9b1' }, // Lilac point
        { first: '#e9e6e1', second: '#e9e6e1', third: '#ddcbb7', patternColour: '#ddcbb7' }  // Cream point      
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
      tailLength: [0.9, 1.1], // Long, fluffy tail
      coordination: 0.4
    },
    bodypartCode: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0],
    bodypartCodeVariants: [
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0], // Classic Ragdoll colorpoint - extremities darker, body/chest lighter
      [0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0], // Moderate colorpoint - face focus
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Mitted pattern - feet darker, head/chin/chest lighter
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]  // Bicolor pattern - ears, body, tail, jowls, chest darker
    ],
    colourpointMapVariants: [
      [true, true, true, true],   // Full colorpoint - classic Ragdoll
      [false, true, true, true],  // Ears, feet, tail (no chin)
      [true, true, false, true],  // Chin, ears, tail (mitted feet)
      [false, false, true, true]  // Feet and tail only (bicolor)
    ],
    // coats
    patternAlpha: [0.6, 0.9],
    coatMod: [0.5, 0.8, 'random'],
    nameLibrary: 'random', // No specific cultural origin
    breedStandardGenes: ['colourpoint']
  },

  'Angora': {
    description: "Silky long-haired cats from Turkey with graceful builds. Good coordination and often odd-colored eyes. Ancient breed with flowing coats.",
    pattern: 0, // Solid or various patterns
    maxSize: 12,
    size: [9, 15], // Medium-sized, elegant
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
      tailLength: [0.9, 1.1], // Long, plumed tail
      mawSize: 0.6,
      coordination: 0.7
    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid Angora
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Two-tone Angora - all second color
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Colorpoint Angora - face, ears, body, tail, jowls, chest darker
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast Angora
    ],
    // coats
    patternAlpha: [0.2, 0.7],
    coatMod: [0.3, 0.5, 'random'],
    nameLibrary: 15, // Turkish names
    heterochromicGene: 0.25 // 25% base chance, higher for light colors
  },

  'British Shorthair': {
    description: "Stocky round cats with dense plush coats and copper eyes. Moderate coordination despite sturdy build. The classic 'British Blue' is most famous.",
    pattern: 0, // Usually solid colors
    maxSize: 15,
    size: [10, 17], // Medium to large, stocky
    colors: {
      variants: [
        { first: '#708090', second: '#708090', third: '#708090' }, // British Blue (classic)
        { first: '#16100c', second: '#16100c', third: '#16100c' }, // Black
        { first: trueWhite, second: trueWhite, third: trueWhite }, // White
        { first: '#deb887', second: '#deb887', third: '#deb887' }, // Cream
        { first: '#d2691e', second: '#d2691e', third: '#d2691e' }, // Red
        { first: '#c0c0c0', second: '#333333', third: trueWhite, pattern: 3, patternColour: '#000000' }, // Silver tabby
        { first: '#D2B48C', second: '#8B4513', third: trueWhite, pattern: 3, patternColour: '#000000' } // Brown tabby
      ],
      eye: ['#ffd700', '#ff8c00', '#4fc44f'] // Gold to green eyes  
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
      mawSize: 0.3,
      coordination: 0.5,
      breedStandardGenes: ['brachycephalic']

    },
    bodypartCodeVariants: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Solid British Shorthair
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], // Bicolor British Shorthair - feet, ears, tail darker
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // Tabby British Shorthair - face, ears, body, tail, jowls, chest use second color
      [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2]  // High contrast - feet, jowls, chin, chest use third color
    ],
    // coats
    patternAlpha: [0.1, 0.4],
    coatMod: [0.2, 0.4, 'random'],
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
  if (!breed) {
    console.warn('Error reading breed: ' + breedName);
    return;
  }

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
      if (variant.patternColour) {
        who.patternColour = mixRandomCoatColor(variant.patternColour);
      } else if (breed.colors.patternColour) {
        who.patternColour = mixRandomCoatColor(breed.colors.patternColour);
      }
      // Handle eye colors for variants - check variant first, then breed, then fallback
      if (variant.eye) {
        who.eyeColour = mixRandomEyeColor(variant.eye);
      } else if (breed.colors.eye) {
        who.eyeColour = mixRandomEyeColor(breed.colors.eye);
      } else {
        who.eyeColour = getRandomEyeColour();
      }
      who.eyeColour2 = who.eyeColour;
      // If this variant specifies its own pattern, override the breed default
      if (variant.pattern !== undefined) {
        who.pattern = variant.pattern;
      }
    } else {
      // assigning the colours, with fallbacks
      if (breed.colors.first) {
        who.firstColour = mixRandomCoatColor(breed.colors.first);
      } else {
        who.firstColour = randomColourRealistic();
      }
      if (breed.colors.second) {
        who.secondColour = mixRandomCoatColor(breed.colors.second);
      } else {
        who.secondColour = randomColourRealistic();
      }
      if (breed.colors.third) {
        who.thirdColour = mixRandomCoatColor(breed.colors.third);
      } else {
        who.thirdColour = randomColourRealistic();
      }
      if (breed.colors.patternColour) {
        who.patternColour = mixRandomCoatColor(breed.colors.patternColour);
      }
      if (breed.colors.eye) {
        who.eyeColour = mixRandomEyeColor(breed.colors.eye);
      } else {
        // Fallback: if breed has no eye color definition, use random eye color
        who.eyeColour = getRandomEyeColour();
      }
      who.eyeColour2 = who.eyeColour;
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

  // Apply bodypart code using variants system
  if (breed.bodypartCodeVariants && Array.isArray(breed.bodypartCodeVariants)) {
    const bodypartVariant = breed.bodypartCodeVariants[Math.floor(Math.random() * breed.bodypartCodeVariants.length)];
    if (bodypartVariant === 'random') {
      // Generate random bodypart codes (0, 1, or 2)
      who.bodypartCode = Array.from({ length: 13 }, () => Math.floor(Math.random() * 3));
    } else {
      who.bodypartCode = [...bodypartVariant];
    }
  }

  // Apply colourpointMap variants system
  if (breed.colourpointMapVariants && Array.isArray(breed.colourpointMapVariants)) {
    const colourpointVariant = breed.colourpointMapVariants[Math.floor(Math.random() * breed.colourpointMapVariants.length)];
    who.colourpointMap = [...colourpointVariant];
  }

  // Apply coat modifications
  if (breed.coatMod) {
    breed.coatMod.forEach((mod, index) => {
      if (mod === null || mod === 'random') {
        who.coatMod[index] = Math.random();
      } else if (Array.isArray(mod) && mod.length === 2) {
        // Handle ranges like [0.3, 0.8]
        who.coatMod[index] = randomBetween(mod[0], mod[1]);
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
  // Clear all previous genes first (for breed switching in editor)
  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    who[geneData.geneProp] = false;
    who[geneData.expressedProp] = false;
  }

  // Apply breed standard genes and their expressions (purebreds should always express their standard traits)
  if (breed.breedStandardGenes) {
    for (const geneKey of breed.breedStandardGenes) {
      const geneData = GENE_DATA[geneKey];
      if (geneData) {
        who[geneData.geneProp] = true;
        who[geneData.expressedProp] = true; // Breed standard genes should always be expressed
      }
    }
  }
  // Force pattern colour if specified by breed (e.g., tortoiseshells always have black patterns)
  if (breed.forcePatternColour) {
    who.patternColour = breed.forcePatternColour;
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

  // Apply custom breed traits
  if (breed.customHeadHeight === 'proportional' && breed.customHeadRatio) {
    who.headHeight = who.headWidth / breed.customHeadRatio;
  }
}

// Apply tortoiseshell pattern and colors
function applyTortoiseshellPattern(who) {
  who.pattern = 1; // Tortoiseshell pattern
  who.patternAlpha = randomBetween(0.5, 1);
  // Use tortoiseshell color scheme
  const tortVariants = [
    { first: trueWhite, second: '#e8831e', third: '#000000' },       // W-O-B
    { first: '#e8831e', second: trueWhite, third: '#222222' },       // O-W-G
    { first: trueWhite, second: '#c89c7a', third: '#000000' },       // W-LO-B
    { first: '#c89c7a', second: trueWhite, third: '#222222' }        // LO-W-G
  ];
  const variant = tortVariants[Math.floor(Math.random() * tortVariants.length)];
  who.firstColour = mixRandomCoatColor(variant.first);
  who.secondColour = mixRandomCoatColor(variant.second);
  who.thirdColour = mixRandomCoatColor(variant.third);
}

// Female-only tortoiseshell variants configuration
const FEMALE_TORTOISESHELL_VARIANTS = {
  'Manx': { chance: 0.15, name: 'Manx Tortoiseshell' },
  'British Shorthair': { chance: 0.15, name: 'British Shorthair Tortoiseshell' }
};


applyBreedTemplate = function (who) {
  // Get all available breed names from BREED_DATA
  const regularBreeds = Object.keys(BREED_DATA).filter(breedName => {
    const breed = BREED_DATA[breedName];
    return !breed.genderRestriction; // Exclude gender-restricted breeds from random selection
  });

  const femaleOnlyBreeds = ['Calico', 'Tortoiseshell'];
  const femaleOnlyChance = 0.15; // 15% of females get Calico/Tortoiseshell
  const maleChance = 1 / 3000; // Very rare for males

  // First, check if this should be a female-only breed
  if (who.gender !== 'Male') {
    // For females/non-binary: chance of getting female-only breed
    if (Math.random() < femaleOnlyChance) {
      const femaleBreed = femaleOnlyBreeds[Math.floor(Math.random() * femaleOnlyBreeds.length)];
      applyBreed(who, femaleBreed);
      return;
    }
  } else {
    // For males: very rare chance of female-only breeds
    for (const femaleBreed of femaleOnlyBreeds) {
      if (Math.random() < maleChance) {
        applyBreed(who, femaleBreed);
        return;
      }
    }
  }

  // Otherwise, pick from regular breeds with equal distribution
  const breedName = regularBreeds[Math.floor(Math.random() * regularBreeds.length)];
  applyBreed(who, breedName);

  // Check if this breed has female tortoiseshell variants and if this cat is female
  if (who.gender !== 'Male' && FEMALE_TORTOISESHELL_VARIANTS[breedName]) {
    const variant = FEMALE_TORTOISESHELL_VARIANTS[breedName];
    if (Math.random() < variant.chance) {
      applyTortoiseshellPattern(who);
      who.breed = variant.name;
    }
  }
};

// Apply specific breed template for adoption center filtering
applySpecificBreedTemplate = function (who, breedName) {
  const femaleOnlyBreeds = ['Calico', 'Tortoiseshell'];
  const maleChance = 1 / 3000; // Very rare for males

  // Handle 'All' filter - use normal random selection
  if (breedName === 'All') {
    applyBreedTemplate(who);
    return;
  }

  // Check if it's a female-only breed
  if (femaleOnlyBreeds.includes(breedName)) {
    // Only apply if gender allows it (respecting male chance)
    if (who.gender !== 'Male' || Math.random() < maleChance) {
      applyBreed(who, breedName);
      return;
    } else {
      // Fall back to random regular breed for males when they can't get female-only breed
      applyBreedTemplate(who);
      return;
    }
  }

  // Check if it exists in BREED_DATA
  if (BREED_DATA[breedName]) {
    applyBreed(who, breedName);

    // Check if this breed has female tortoiseshell variants and if this cat is female
    if (who.gender !== 'Male' && FEMALE_TORTOISESHELL_VARIANTS[breedName]) {
      const variant = FEMALE_TORTOISESHELL_VARIANTS[breedName];
      if (Math.random() < variant.chance) {
        applyTortoiseshellPattern(who);
        who.breed = variant.name;
      }
    }
    return;
  }

  // Fallback to random if breed not found
  applyBreedTemplate(who);
};

// Check if a chitten meets breed standard requirements
function meetsBreedStandard(chitten) {
  // First check if it's a purebred
  if (getBreedDepth(chitten.breed) !== 0) {
    return false; // Not purebred, fails breed standard
  }

  // Get the breed data
  const breed = BREED_DATA[chitten.breed];
  if (!breed) {
    return false; // Invalid breed
  }

  const allowedGenes = breed.breedStandardGenes || [];

  // Check if chitten has all required breed standard gene expressions
  for (const geneKey of allowedGenes) {
    const geneData = GENE_DATA[geneKey];
    if (geneData && !chitten[geneData.expressedProp]) {
      return false; // Missing a required breed standard expression
    }
  }

  // Check if chitten has any unwanted gene expressions not in breed standard
  for (const [geneKey, geneData] of Object.entries(GENE_DATA)) {
    if (chitten[geneData.expressedProp] && !allowedGenes.includes(geneKey)) {
      return false; // Has unwanted gene expression not in breed standard
    }
  }

  return true; // Has all required expressions and no unwanted expressions
}

// Get available breeds based on gender from BREED_DATA
function getAvailableBreeds(gender) {
  let breeds = ['All', mixedBreed]; // Always include 'All' and mixedBreed at the top

  // Get all breed names from BREED_DATA
  let breedNames = Object.keys(BREED_DATA);

  // Filter out female-only breeds if gender is not Female
  if (gender !== 'Female') {
    breedNames = breedNames.filter(breedName => {
      const breed = BREED_DATA[breedName];
      return breed.genderRestriction !== 'female';
    });
  }

  // Sort breed names alphabetically
  breedNames.sort();
  // Add sorted breeds to the list
  breeds = breeds.concat(breedNames);
  return breeds;
}