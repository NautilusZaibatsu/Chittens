BODYPART CODES
bodypartCode[0]  = 'front foot left'
bodypartCode[1]  = 'front foot right'
bodypartCode[2]  = 'head'
bodypartCode[3]  = 'left ear'
bodypartCode[4]  = 'right ear'
bodypartCode[5]  = 'body'
bodypartCode[6]  = 'tail'
bodypartCode[7]  = 'back foot left'
bodypartCode[8]  = 'back foot right'
bodypartCode[9]  = 'jowl left'
bodypartCode[10] = 'jowl right'
bodypartCode[11] = 'chin'
bodypartCode[12] = 'chest'

SPECIAL COLOURS (const in cattery)
~These can be called by accessing specialColours[]
0: 'firstColour' 
1: 'secondColour' 
2: 'thirdColour' 
3: 'baldFaced' 
4: 'colourpoint'
5: 'pupil'
6: 'leftEye'
7: 'rightEye'

PATTERNS
0 - no pattern
1 - tortoiseshell 
2 - NOT USED
3 - tabby
4 - NOT USED
5 - NOT USED
6 - rosette
SPECIAL PATTERNS
sparseCoat for sparseCoat gene
tickedCoat for tickedCoat gene

COATMOD
[0] = gradient bias (y midpoint position of gradient)
[1] = rotation of the gradient
[2] = rotation of the pattern
[3] = gradient strength (0 = none, 1 = max)
[4] = Pattern shift X
[5] = Pattern shift Y

MUTATIONS
albino
hairless
baldFaced
sparseCoat
colourpoint
brachycephalic - inheritable but not implemented
heterochromic
dwarfism

ADDING MUTATIONS
- add to chittens class
- make inheritable in generateKitten
- add mutation chance constant
- add gene expression constant
- add to mutate() function
- add to determineTraitExpression() function
- add to applyBreed() function
- add to tool tip
- add to editor

ADDING MUTATIONS
- add to GENE_DATA 
- add matching gene and expression booleans to chittens class
They are then automatically added to:
- mutate() function
- inheritability in generateKitten()
- chitten tool tip
- editor

Also, please confirm heterochromia is no longer a special case

COATMOD ANGLES
0 vector points right.
0.25 vector points down.
0.5 →vector points left.
0.75 vector points up.
1 same as 0

SPECIAL FEATURES
Colourpoint gene expression:
~ always affects jowls
~ Turns the affected area .thirdColour
~ .secondColour overrides the effect everywhere except jowls
~ Adds a gradient to the face
~ If the gene is expressed, firstColour, secondColour and thirdColour get sorted from lightest to darkest
~ colourpointMap:
[0] chin
[1] ears
[2] feet
[3] tail

Albino gene:
~ Eyes glow a faint red instead of the normal glow colour if the albino gene is present

Adding animations:
~ Linear:
1. add a state variable to the chittens class where 0 = no animation and 1 = end animation state
2. use getAnimationValue and correctly select one shot and linear bools if required