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

PATTERNS
0 - no pattern
1 - tortoiseshell (image)
2 - NOT USED
3 - tabby (image)
4 - NOT USED
5 - NOT USED
6 - bengal / mau (image)
7 - tick / abyssinian (image)

COATMOD
[0] = y midpoint position for gradients
[1] = angle of the gradient

COATMOD ANGLES
0 vector points right.
0.25 vector points down.
0.5 →vector points left.
0.75 vector points up.
1 same as 0

SPECIAL FEATURES
Colourpoint gene:
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
