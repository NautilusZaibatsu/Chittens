// Centralized gene configuration for the Chittens genetics system
// This defines all genetic traits including mutation rates, expression chances, and breed standards

const GENE_DATA = {
  // Completely white coat with totallu red eyes. If the gene is present only, eye pupils are slightly red
  albino: {
    name: 'Albino',
    geneProp: 'albinoGene',
    expressedProp: 'albinoExpressed',
    mutationChance: 0.04,
    baseExpressionChance: 0.25,
    breedStandardChance: 0.98,
    tooltip: 'Albino Gene'
  },
  hairless: {
    // Completely bald
    name: 'Hairless',
    geneProp: 'hairlessGene',
    expressedProp: 'hairlessExpressed',
    mutationChance: 0.0001,
    baseExpressionChance: 0.5,
    breedStandardChance: 0.95,
    tooltip: 'Hairless Gene'
  },
  baldFaced: {
    // Bald face like a Lykoi
    name: 'Bald Faced',
    geneProp: 'baldFacedGene',
    expressedProp: 'baldFacedExpressed',
    mutationChance: 0.0001,
    baseExpressionChance: 0.5,
    breedStandardChance: 0.95,
    tooltip: 'Bald Faced Gene'
  },
  sparseCoat: {
    // Sparse coat like a Lykoi
    name: 'Sparse Coat',
    geneProp: 'sparseCoatGene',
    expressedProp: 'sparseCoatExpressed',
    mutationChance: 0.0001,
    baseExpressionChance: 0.3,
    breedStandardChance: 0.90,
    tooltip: 'Sparse Coat Gene'
  },
  colourpoint: {
    // Temperature sensitive extremities like siamese and burmese
    name: 'Colourpoint',
    geneProp: 'colourpointGene',
    expressedProp: 'colourpointExpressed',
    mutationChance: 0.0001,
    baseExpressionChance: 0.3,
    breedStandardChance: 0.95,
    tooltip: 'Colorpoint Gene'
  },
  brachycephalic: {
    // Shortened head like a persian
    name: 'Brachycephalic',
    geneProp: 'brachycephalicGene',
    expressedProp: 'brachycephalicExpressed',
    mutationChance: 0.01,
    baseExpressionChance: 0.3,
    breedStandardChance: 0.85,
    tooltip: 'Brachycephalic Gene'
  },
  heterochromic: {
    // Differently coloured eyes
    name: 'Heterochromic',
    geneProp: 'heterochromicGene',
    expressedProp: 'heterochromicExpressed',
    mutationChance: 0.01,
    baseExpressionChance: 0.5,
    breedStandardChance: 0.75, // Even for breeds like Angora, not 100% guaranteed
    tooltip: 'Heterochromic Gene'
  }
};