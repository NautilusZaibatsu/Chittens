ᓚᘏᗢ Chittens changelog 

03/08/2025 = 0.075
~ A new pattern type has been added: piebald.
-- Black and White shorthairs and Calicos have this pattern by default, and some Ragdoll variants have it too.
~ Patterns now have a lot more variation from chitten to chitten, and there is a lot less pattern symmetry.
~ The Brachycephalic condition has been added, all Persians and British Shorthairs have this by default.
~ Abyssinian, Persian and Black and White Shorthair breeds have been completely reworked.
~ Adjusted the Manx, Scottish Fold, Calico, Tortoiseshell, Ragdoll and British Shorthair breeds. All breeds are now up-to-date.
~ Added a symbol to denote a crossbreed in the adoption centre and litter picker.
~ Improved the presentation of the adoption centre.
~ Performance upgrade focusing on increased caching of chitten data.
~ Ticked coat is now a gene, not a pattern.
~ The game should be more touchscreen friendly.

Bug Fixes
-- Fixed a bug that prevented the game from starting in very rare cases.
-- Rehoming a chitten no longer makes it look like you killed them.
-- Resizing the window whilst picking a chitten from the adoption or litter screens now works properly.

02/09/2025 = 0.074
~ Firefly update:
-- Now have wings that they beat in order to fly, giving more realistic motion.
-- Can decide to land on a tree or a sleeping chitten.
-- Can now be clicked, causing them to buzz off!
-- Chittens now gleefully hang onto the fireflies if they catch them.
~ Colourpoint colours are now temperature sensitive: more pronounced in winter and less so in summer.
~ Elderly chitten's eyes become foggy and their colours desaturate the older they get
~ Added dwarfism mutation:
-- Chittens with this condition have very short legs and poor jumping ability.
~ Added melanism.
-- Chittens with this condition are pure black or very dark with black skin.
-- Melanistic chitten's eyes have no blue present in them.
~ Improved detection of whether a chitten meets the breed standard, and adoption boxes now have a symbol if the chitten is purebred to denote whether it meets the breed standard or not.
~ There is more purebreed variation in the adoption centre.

~ Bug Fixes
-- Fixed a bug that prevented chittens from having a different coloured body and chest.
-- Fixed a bug preventing fruit from colliding properly with each other.
-- Fixed a bug that soft locked the firefly.

01/09/2025 = 0.073
~ Redesigned genetics system to make gene inheritance and expression more realistic for both pure and cross breds.
~ Breeds now have basic standards, you can see whether a purebred chitten meets the breed standard in the chitten tooltip.
~ The sparse coat genetic condition has been added. 
-- Chittens with a sparse coat have sunlight sensitive skin that changes from pink to brown depending on the season.
-- The Lykoi breed has this genetic condition by default. 
~ Chittens now have different animations depending on whether they are asleep in a tree or asleep on the ground.
~ Picked up chittens now look like they're being held by the scruff of their necks.
~ The nutritional value of a fruit scales now with its size.
~ You can now click a fruit that is in a tree to make it fall to the ground.
~ Fruit now bounces on each other and chittens.
~ Added contextual cursors to help the user understand what they can do while hovering.
~ Improvements and bugfixes for tree collisions.
~ Fixed some issues relating to bald faces when crossbreeding.
~ Temperature now falls and rises from the midpoint of the season rather than the start of it.

30/08/2025 = 0.072
~ Big graphical update, chittens now look and animate much better
-- This has however "broken" some breeds as they haven't been updated yet.
-- Updated breeds include Bengal, Egyptian Mau, Siamese, Burmese and Tabby.
 ~ Age based colours and patterns:
 -- All kittens are born with blue eyes, like real cats. Their true eye colours develop as they mature.
 -- Colourpoint kittens are born in creamy white colours, and their true coat colours develop as they mature.
 -- Tabby kitten markings start off subtle but get darker and their coats start darker and get lighter as they mature.
 -- Ticked markings don't appear in newborn kittens but express over time.
 ~ Coat / markings:
 -- Can now be in all manner of colours, and are genetically inherited.
 -- Are more varied in terms of pattern placement.
 -- Vary by Chitten size.
 -- New pattern for tortoiseshell coats.
 -- More variation between solid colour body parts and those with smooth gradients.
 ~ Foot pad and toe colours are now defined by the colour of the paw.
 ~ Chittens will now not automatically die when they reach their maximum age.
 ~ Chittens are now slightly larger.
 ~ Jumping:
 -- Jumping ability has been recalculated, you should see better jumps for all sizes.
 -- Chittens now prepare to land by bringing their feet back around.
 ~ Fruits:
 -- Now rot on the ground if untouched for 24 hours.
 -- Can now be seen in achitten's grasp when being eaten.
 ~ It's now easier to hover on and pick up a chitten to inspect them.
 ~ Changed saving and loading to use JSON.

 
 ~ Bug fixes:
  -- Fixed a few bugs relating to window resizing and fruits

26/08/2025 = 0.071
~ Complete rework of the jumping system:
-- Chittens will now calculate their jumps, and use multijump strategies.
-- Chittens will try to use trees to get near things they want to reach.
~ Chitten mouths now open and close to speak and eat, the amount they can open their mouths is determined genetically.
~ Chittens now have a coordination trait, defining how clumsy they are. This is determined genetically too.
~ Colourpoint is now a gene expression not a coat pattern
~ Chitten's coat colours now fade more smoothly across their bodies
~ Flora updates:
-- Chittens can now eat fruits from the tree they are sitting in.
-- Chittens in trees now exert less force on them, causing them to drop a lot less.
-- Trees will now not spawn too close to the edge of the game area, which was preventing chittens from reaching some fruits.
-- Fireflies can now accidentally knock fruit out of trees (and so can chittens!).
~ Tweaked some firefly logic.
~ Better handling of speed physics.
~ Hover indicator to help selecting chittens.

~ Bug fixes:
-- Fixed several bugs related to the new endless mode.
-- Fixed a bug that prevented loading chittens from file.

24/08/2025 = 0.070
~ Game performance is no longer framerate dependent, UPS is now 50 and FPS is unlimited.
~ Implemented endless mode - sit back and relax and let the game play itself.
~ Hid devmode from the user for now, we might bring it back via cheats.
~ Basic support for window resizing.
~ Trees and seeds rework, trees should no longer die out.

24/08/2025 = 0.069
~ Allowed filtering by breed in the adoption centre.
~ Crossbreeds can now appear in the adoption centre.
~ Reworked the gene inheritance and expression systems.

23/08/2025 = 0.068
~ Added the Lykoi gene, it is now completely separate from the hairless gene. Both genes interact realistically.
~ Sphynxes now come in pink, grey or a mix of both.
~ Albinos can now inherit fur patterns, but never express them.
~ Added gene expression to chitten tooltip.
~ A chitten's tooltip appears when it is being held.
~ Reworked the way breeding behaviour to make males initiate it.
~ Changed eye colour defaults to be more realistic.
~ Chittens can now jump down from trees for food and mating.
~ Removed Bobtail - it isn't a breed.
~ Added Abyssinian, Ragdoll, Angora and British Shorthair breeds.
~ Added Ethiopian, Turkish and British names.
~ Every breed has had their appearances tweaked.
~ Improved the physics of chitten air collisions.
~ Reworked firefly behaviour to make it more interesting.

22/08/2025 = 0.067
~ Massive performance improvements.
~ Jumping and air movement now scale with genetics:
-- Longer legs boost jump power.
-- Body size affects air resistance. 
-- Youngsters are less coordinated. 
-- Fatter chittens jump less often.
~ Chittens now smoothly sit and stand up. Fatter chittens sit down faster and stand up slower than thin ones.
~ Collision logic fixes.
~ Fixed cattery selection hover issue.
~ Crossbreeds are now available for adoption.
~ Redesigned name generation to use breed presets instead of parent names.
~ Restructured the breeds system to make it modular.
~ Updated all breeds and included colour variations within them.
~ Reworked albinism to be a true mutation, not a breed. Any breed can now spawn as an albino, not just mixed breeds.
~ Reworked both hairless genes and the Sphynx and Lykoi breeds so that they work more intuitively.
~ Reworked heterochromia genes/mutation to be more realistic.
~ Fixed an issue where attributes were getting mixed up on file save and load.
~ Newborns can no longer be too big for their mother to give birth to.
~ Resized butts to be smaller.

11/12/2019 = 0.066
~ added a chest piece to the Chittens, so that coloured bellies are possible
~ added the black and white shorthair breed
~ made improvements to the Siamese and Burmese breeds.
~ improved efficiency of albino colour variation

10/12/2019 = 0.065
~ added seasons, the season changes each day. Chittens get more tired in winter, less tired and more amorous in spring and have more energy in summer
~ added rudimentary temperature system
~ day of the week is now tracked
~ the simulation now starts with a small number of young trees of a random species
~ improved efficiency of the pattern system

27/10/2019 = 0.064
~ fixed a bug in the way that clouds scroll
~ when fps is below 30 glyphs now will not spawn and will be culled

03/02/2019 = 0.063
~ updated collision physics
~ updated tortoiseshell breed
~ tweaked fruit colours
~ changed how often Chittens sit down, and redrew front legs when standing

23/01/2019 = 0.062
~ added another body piece; the chest/torso section
~ changed ui colours
~ Chittens now get slightly more tired between midnight and 3am
~ updated cloud textures and movement

21/01/2019 = 0.061
~ added pause functionality to game
~ added tooltips to all buttons
~ added touch controls. You can do everything with a touch that you could previously do with a mouse click, including dragging Chittens
~ you can now drag around the colour picker and the colour choice is now much wider
~ the parents are now displayed in boxes on the litter picking screen to make selective breeding easier to manage
~ added scrolling clouds to the background and changed the motion of stars
~ reorganised UI to make it more compact and user friendly
~ updated tabby breed appearance to be more realistic

20/01/2019 = 0.06
~ Chittens can now be picked up and dropped
~ fireflies now go for specific fruit instead of a tree, they will eat fruit and eventually produce offspring if successful enough
~ changed the way cross breed names are created and handled
~ glyphs are now all black
~ added gender glyph to selected Chitten's label
~ changed the skybox colours and the way stars are drawn
~ glyphs no longer collide with each other, instead they start with randomised spin and speed and last twice as long. colliding with a wall causes their life to shorten
~ removed nirvana state
~ performance upgrades
~ bug fixes

19/01/2019 = 0.059
~ fireflies no longer just follow the pointer, now they try to find peace in the treetops if they can. If they can't they default back to following the pointer
~ added toe pads, aka jellybeans to Chittens
~ Chittens eyes now glow when being lit by a firefly
~ fireflies now enter from the side when not being spawned by a ghost
~ added ear height variable to compliment ear width
~ added a patch of skin on the inside of Chitten's ears
~ rewrote the way the name library works to make it more efficient, and easier to add new libraries
~ added fictional names to library
~ added Lykoi, Scottish Fold, Bengal and Egyptian Mau breeds to catteries
~ balance updates
~ fixed Siamese and Burmese breed's nose colours

17/01/2019 = 0.058
~ Chittens will now face away from the player occasionally when jumping
~ tails of 0 length now appear stunted
~ added genetic heterochromia (different coloured eyes)
~ added tabby coats
~ added Manx, Bobtail, Tabby and Burmese breeds to catteries
~ gave Siamese chittens their distinctive face pattern
~ added Russian, Thai and Arabic names
~ Chittens in catteries are now named according to their breed where appropriate
~ lots of performance fixes
~ fixed a bug causing obelisks to stick around forever

16/01/2019 = 0.057
~ Chittens now reach elder status in the last days of their life and then die of old age a day or two later
~ the litter selector and cattery boxes are now colour coded
~ selecting a Chitten and then clicking Create now lets you use that Chitten as a template
~ added coat patterns
~ added fangs
~ added hairless chittens
~ added templates to the catteries, they appear randomly: Persian, Siamese, Russian Blue, Calico, Tortoiseshell
~ Chittens no longer try to get fruits they cannot reach
~ fixed several bugs causing catteries or Chittens to glitch out when a Chitten in the simulation died whilst choosing a kitten
~ fixed a bug causing front paws to disconnect from the front arms
~ loads more bug fixes

12/01/2019 = 0.056
~ alpha gene editor implemented, use it to spawn a Chitten of your design. Access it through the editor tab
~ added eye colours and eye size variation
~ added buttons for loading and both catteries to top menu
~ added maximum age and dying of old age

11/01/2019 = 0.055
~ major update to way coat coloration works, tweaks across the board to allow for upcoming breeds feature
~ added more head shape, nose and eye position variation

09/01/2019 = 0.054
~ added a third colour to Chitten's coats
~ added jowls and noses. Nose colour is not genetic; lighter Chittens have pink noses. darker Chittens have black noses
~ elders no longer tend graves, they still don't breed any more
~ tweaked starting colour algorithms to be more realistic

02/01/2019 = 0.053
~ added FPS counter
~ improved performance
~ changed the way the front legs are drawn to make it smoother and more natural
~ kitten behaviour update. A Chitten will be a kitten until it is 1 day old. It will follow it's mother attempting to suckle until it becomes independent. Kittens do not pay a cost for jumping, they sleep when their mothers do. Kittens start smaller and grow faster
~ trees now regenerate only one piece of fruit per day
~ added Egyptian names
~ added albinism and the backbone of a mutated gene system
~ each body part is now coloured individually, allowing for 512 combinations (not including gradients / shading)
~ added a countdown when choosing a Chitten. If the timer runs out the game will chose the currently selected Chitten, if there is no selection it will choose a random one

24/11/2018 = 0.052
~ added speech bubbles
~ trees now automatically start to drop once they reach their maximum height
~ made the colour range for mutations more diverse
~ changed the way Chittens look in nirvana, now it's much more dramatic
~ tweaked some appearance values to make the most of the cell shading system

23/11/2018 = 0.051
~ added cell shading to the Chittens
~ completely rewrote the way front legs work
~ tails now vary in length
~ fruit is now eaten on the floor instead of in the air when picked, this takes a short time during which the Chitten cannot act

22/11/2018 = 0.05
~ trees produce fruit, Chittens get hungry and eat the fruit. Chittens then excrete seeds that grow into trees
~ reworked the kitten generation system, litters now feel more like a group of siblings
~ added more variation between the sexes
~ reworked the jumping algorithms

21/11/2018 = 0.049
~ added length to Chitten's bodies so the back end follows the front around
~ reworked front and back legs to fit the new body look
~ if you have no male or no female Chittens left you will now be returned to the appropriate cattery instead of a random Chitten spawning
~ added a stats panel for selected Chitten, you can now give away (remove from your game) Chittens from here.
~ added saving and loading of Chittens. Loading can be done from a cattery, saving can be done from stats panel

20/11/2018 = 0.048
~ added litter mechanic
~ added German and Indian names
~ added thickness and legLength attributes to Chittens
~ incorporated ntc by Chirag Mehta - http://chir.ag/projects/ntc
~ fixed some scaling problems on mobile

19/11/2018 = 0.047
features
~ Chittens now wiggle their bums in the air while waiting to pounce
~ added the cattery, so you can choose your starting pair
~ improved variation and realism of the Chitten's coats

18/11/2018 = 0.046
~ Chittens now choose each other to mate
~ added individual colour shading to Chittens
~ added physics based symbols that emit from Chittens on certain events
~ improved messaging system
~ large performance upgrade
~ prevented Chittens from naming their children after themselves

17/11/2018 = 0.045
features
~ added trees, Chittens will plant them whilst in a nirvana
~ added Chinese names for Chittens
~ added non binary gender

16/11/2018 = 0.044
features
~ added a Chitten naming system, parents name their children according to their culture
~ added tails - they wag :3
~ made Chittens sit still when on the floor
~ improved collision physics algorithms
~ simple labelling system added
bugfixes etc.
~ fixed bugs that prevented running on IE and Safari

15/11/2018 = 0.043
features
~ improved mate individuality by adding ears, smile, and reworking the eyes
~ added a nirvana state, which triggers when love/health/energy are at max. Chittens in this state have infinite energy but cannot breed
~ reworked message history display

14/11/2018 = 0.04
features
~ implemented binary gender for breeding
~ added rotation of Chittens on collisions
~ added handling multiple fireflies, the main fly always respawns
~ ghosts now become fireflies when they exit the top of the screen
~ added clock, timestamps to messages and archiving of last 10 messages
