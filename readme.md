#Chibis

changelog

03/02/2019 = 0.063
~ updated collision physics
~ updated tortoiseshell breed
~ tweaked fruit colours
~ changed how often Chibis sit down, and redrew front legs when standing

23/01/2019 = 0.062
~ added another body piece; the chest/torso section
~ changed ui colours
~ chibis now get slightly more tired between midnight and 3am
~ updated cloud textures and movement

21/01/2019 = 0.061
~ added pause functionality to game
~ added tooltips to all buttons
~ added touch controls. You can do everything with a touch that you could previously do with a mouse click, including dragging Chibis
~ you can now drag around the colour picker and the colour choice is now much wider
~ the parents are now displayed in boxes on the litter picking screen to make selective breeding easier to manage
~ added scrolling clouds to the background and changed the motion of stars
~ reorganised UI to make it more compact and user friendly
~ updated tabby appearance to be more realistic


20/01/2019 = 0.06
~ chibis can now be picked up and dropped
~ fireflies now go for specific fruit instead of a tree, they will eat fruit and eventually produce offspring if successful enough
~ changed the way cross breed names are created and handled
~ glyphs are now all black
~ added gender glyph to selected Chibi's label
~ changed the skybox colours and the way stars are drawn
~ glyphs no longer collide with each other, instead they start with randomised spin and speed and last twice as long. colliding with a wall causes their life to shorten
~ removed nirvana state
~ performance upgrades
~ bug fixes

19/01/2019 = 0.059
~ fireflies no longer just follow the pointer, now they try to find peace in the treetops if they can. If they can't they default back to following the pointer
~ added toe pads, aka jellybeans to Chibis
~ Chibis eyes now glow when being lit by a firefly
~ fireflies now enter from the side when not being spawned by a ghost
~ added ear height variable to compliment ear width
~ added a patch skin on the inside of Chibi's ears
~ rewrote the way the name library works to make it more efficient, and easier to add new libraries
~ added fictional names to library
~ added Lykoi, Scottish Folds, Bengals and Egyptian Mau to catteries
~ balance updates
~ fixed Siamese and Burmese breed's nose colours

17/01/2019 = 0.058
~ chibis will now face away from the player occasionally when jumping
~ tails of 0 length now appear stunted
~ added genetic heterochromia (different coloured eyes)
~ added tabby coats
~ added Manx, Bobtail, Tabby and Burmese breeds to catteries
~ gave Siamese cats their distinctive pace pattern
~ added Russian, Thai and Arabic names
~ chibis in catteries are now named according to their breed where appropriate
~ lots of performance fixes
~ fixed a bug causing obelisks to stick around forever

16/01/2019 = 0.057
~ chibis now reach elder status in the last days of their life and then die of old age a day or two later
~ the litter selector and cattery boxes are now colour coded
~ selecting a chibi and then clicking Create now lets you use that chibi as a template
~ added coat patterns
~ added fangs
~ added hairless cats
~ added templates to the catteries, they appear randomly: Persian, Siamese, Russian Blue, Calico, Tortoiseshell
~ chibis no longer try to get fruits they cannot reach
~ fixed several bugs causing catteries or chibis to glitch out when a chibi in the simulation died whilst choosing a kitten
~ fixed a bug causing front paws to disconnect from the front arms
~ loads more bug fixes

12/01/2019 = 0.056
~ alpha gene editor implemented, use it to spawn a chibi of your design. Access it through the editor tab
~ added eye colours and eye size variation
~ added buttons for loading and both catteries to top menu
~ added maximum age and dying of old age

11/01/2019 = 0.055
~ major update to way coat coloration works, tweaks across the board to allow for upcoming breeds feature
~ added more head shape, nose and eye position variation

09/01/2019 = 0.054
~ added a third colour to Chibi's coats
~ added jowls and noses. Nose colour is not genetic; lighter Chibis have pink noses. darker Chibis have black noses
~ elders no longer tend graves, they still don't breed any more
~ tweaked starting colour algorithms to be more realistic

02/01/2019 = 0.053
~ added FPS counter
~ improved performance
~ changed the way the front legs are drawn to make it smoother and more natural
~ kitten behaviour update. A Chibi will be a kitten until it is 1 day old. It will follow it's mother attempting to suckle until it becomes independent. Kittens do not pay a cost for jumping, they sleep when their mothers do. Kittens start smaller and grow faster
~ trees now regenerate only one piece of fruit per day
~ added Egyptian names
~ added albinism and backbone of gene disorder system
~ each body part is now coloured individually, allowing for 512 combinations (not including gradients / shading)
~ added a countdown when choosing a Chibi. If the timer runs out the game will chose the currently selected Chibi, if there is no selection it will choose a random one

24/11/2018 = 0.052
~ added speech bubbles
~ trees now automatically start to drop once they reach their maximum height
~ made the colour range for mutations more diverse
~ changed the way Chibis look in nirvana, now it's much more dramatic
~ tweaked some appearance values to make the most of the cell shading system

23/11/2018 = 0.051
~ added cell shading to the Chibis
~ completely rewrote the way front legs work
~ tails now vary in length
~ fruit is now eaten on the floor instead of in the air when picked, this takes a short time during which the Chibi cannot act

22/11/2018 = 0.05
~ trees produce fruit, Chibis get hungry and eat the fruit. Chibis then excrete seeds grow into trees
~ reworked the kitten generation system, litters now feel more like a group of siblings
~ added more variation between the sexes
~ reworked the jumping algorithms

21/11/2018 = 0.049
~ added length to Chibi's bodies so the back end follows the front around
~ reworked front and back legs to fit the new body look
~ if you have no male or no female Chibis left you will now be returned to the appropriate cattery instead of a random Chibi spawning
~ added a stats panel for selected Chibi, you can now give away (remove from your game) Chibis from here.
~ added saving and loading of Chibis. Loading can be done from a cattery, saving can be done from stats panel

20/11/2018 = 0.048
~ added litter mechanic
~ added German and Indian names
~ added thickness and legginess attributes to Chibis
~ incorporated ntc by Chirag Mehta - http://chir.ag/projects/ntc
~ fixed some scaling problems on mobile

19/11/2018 = 0.047
features
~ Chibis now wiggle their bums in the air while waiting to pounce
~ added the cattery, so you can choose your starting pair
~ improved variation and realism of the Chibi's coats

18/11/2018 = 0.046
~ Chibis now choose each other to mate
~ added individual colour shading to Chibis
~ added physics based symbols that emit from Chibis on certain events
~ improved messaging system
~ large performance upgrade
~ prevented Chibis from naming their children after themselves

17/11/2018 = 0.045
features
~ added trees, Chibis will plant them whilst in a nirvana
~ added Chinese names for Chibis
~ added non binary gender

16/11/2018 = 0.044
features
~ added a Chibi naming system, parents name their children according to their culture
~ added tails - they wag :3
~ made Chibis sit still when on the floor
~ improved collision physics algorithms
~ simple labelling system added
bugfixes etc.
~ fixed bugs that prevented running on IE and Safari

15/11/2018 = 0.043
features
~ improved mate individuality by adding ears, smile, and reworking the eyes
~ added a nirvana state, which triggers when love/health/energy are at max. Chibis in this state have infinite energy but cannot breed
~ reworked message history display

14/11/2018 = 0.04
features
~ implemented binary gender for breeding
~ added rotation of Chibis on collisions
~ added handling multiple fireflies, the main fly always respawns
~ ghosts now become fireflies when they exit the top of the screen
~ added clock, timestamps to messages and archiving of last 10 messages
