// init
// catboxes
thisCatBox = 0;

// chitten params
const baseJumpPower = 10; // the base jumping power of a chitten
const maturesAt = 2; // age the chittens turn into adults at
const chittenGrowthRate = 1 / 2000; // amount chittens grow per game tick
const elasticity = 0.5; // bounciness of chittens
const chittenMaxSize = 15;
const chittenMinSize = 7;
const chittenBaseSize = 10;
const chittenSizeVariation = chittenMaxSize - chittenBaseSize;
const chittenJumpCooldown = 60; // UPS (game logic updates at 50 UPS)
const youngChittenJumpCooldown = 15; // UPS
const chittenSittingCooldown = 60; // UPS - how long chittens must sit before standing up. This counts down
const chittenSittingSpeed = 15; // UPS 
const chittenStandingUpSpeed = 15; // UPS
const chittenMaxSeekFireflyDistance = maxDistance / 2; // maximum distance a chitten will actively seek out a firefly
const chittenFireflySwatDistanceMod = 10; // the multiple of the chitten's size  that defines how close a firefly can get before it swats at it
const chittenMouthOpenCloseSpeed = 8; // UPS - frames to fully open/close mouth
const eatingChewCycleDuration = 20; // UPS frames per chew cycle (open + close)
const eatingTotalChews = 4; // Number of chew cycles during eating
const chittenBaseCoordination = 0.999; // how coordinated the base chittens are (1 is perfect). Associated with fumbling fruits and adjusting speed in the air

// Derived eating phase durations (all based on eatingChewCycleDuration)
const eatingClosedPauseDuration = Math.max(1, Math.round(eatingChewCycleDuration * 0.1)); // 10% of cycle
const eatingOpenHoldDuration = Math.max(1, Math.round(eatingChewCycleDuration * 0.15)); // 15% of cycle
const speechDuration = 25; // time a chitten's speech lasts

// breeding requirements
const breedingLoveReq = 100;
const breedingEnergyReq = 50;
const breedingHealthReq = 50;

// skin colours
const nosePink = '#dfb2bc';
const noseBlack = '#111111';
const skinPink = '#e9bbc5';
const skinGrey = '#91868e';
const skinColourBrightnessthreshold = 175;

// gene editing
geneEditing = false;
spliceBox = new CatBox(20, 30, 100, 5);
sliderIndex = 0;
colourBars = null; // Will be initialized in startGame()
colourBlock = null; // Will be initialized in startGame()

// Performance optimization: Cache mate-finding results
let availableMates = [];
let matesCacheFrame = 0;
const MATES_CACHE_REFRESH_RATE = 30; // Refresh every 30 frames

// choosing from litter choice timer
const standardModeChoiceTimer = 5000; // 100 seconds - appears as 99
const endlessModeChoiceTimer = 300; // 6 seconds - appears as 5

// arrays
chittens = [];

/**
* function to describe a Chitten
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} gender - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Chitten(x, y, bodySize, maxSize, gender) {
  this.size = bodySize;
  this.maxSize = Math.min(maxSize, chittenMaxSize);
  this.breed = mixedBreed;
  this.inCatBox = null;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.firstColour = trueWhite;
  this.secondColour = trueWhite;
  this.thirdColour = trueWhite;
  this.skinColour1 = trueWhite;
  this.skinColour2 = trueWhite;
  this.skinColour3 = trueWhite;
  this.noseColour = noseBlack;
  this.eyeColour = trueWhite;
  this.eyeColour2 = trueWhite;
  this.nosePos = 0.5;
  this.eyePosX = 0.5;
  this.eyePosY = 0.5;
  this.eyeSize = 0.5;
  this.headWidth = 0.5;
  this.headHeight = 0.5;
  this.coatMod = [1, 1]; // [0] is fade position for gradients, [1] is the angle of the gradient
  this.patternAlpha = 0.5;
  this.pattern = 0;
  this.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.fangs = 0.5; // [style, length]
  this.earWidth = 0.5; // 0.5 is average
  this.earHeight = 0.5;
  this.thickness = 0.5; // 0.5 is average
  this.legginess = 0.5;
  this.angleToFocus = Math.PI / 2; // spawn with angle to focus straight down
  this.behaviorUpdateCounter = Math.floor(Math.random() * 5); // Stagger initial updates
  this.jumpCooldown = 0; // Frames to wait before next jump
  this.cellShadeThickness = this.size / 10;
  this.cellShadeLine = '';
  this.limbLength = (this.size) + (1.5 * this.legginess * this.size); // 10 to 16 + 0 to 6 == 16 to 6
  this.tailLength = 0.5;
  this.maxAge = 14;
  this.onSurface = false;
  this.sitting = false;
  this.sittingCooldown = 0; // Frames left before chitten can stand up from sitting
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.hunger = 100; // 1000 is no hunger, 0 is starvation
  this.preparingToEat = false; // true when grabbed fruit and sitting before eating
  this.awake = true;
  this.litters = 0;
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  this.elder = false;
  this.reachedNirvana = false;
  this.focus = null;
  this.hitFocus = false;
  this.partner = null;
  this.mother = null;
  this.facingForwards = true;
  this.mawSize = 0.5;
  // physics
  this.mass = this.size * this.thickness;
  this.coordination = 0.5; // how well coordinated the chitten is (0.0 to 1.0)
  this.maxJumpPower = 0; // set in reinitsizes
  // special states
  this.snuggling = -1; // Default is -1. 0 is the snuggling state, anything above -1 is the animation length in UPS frames
  // animation states
  this.eatingChewsRemaining = 0; // 0 = not eating, >0 = chews left to do
  this.eatingChewTimer = 0; // tracks progress within current chew cycle
  this.eatingChewState = 'closed'; // 'closed', 'opening', 'open', 'closing'
  this.sittingProgress = 0; // 0 = standing, 1 = fully sitting
  this.targetSittingState = false; // Which sitting state we're lerping toward
  this.openMouthProgress = 0; // 0 = closed, 1 = fully open
  this.targetMouthOpenState = false; // Which mouth open state we're lerping toward
  // interaction
  this.beingHeld = false;
  // genetic conditions
  this.heterochromicGene = false;
  this.albinoGene = false;
  this.albino = false;
  this.lykoiGene = false;
  this.lykoi = false;
  this.hairlessGene = false;
  this.hairless = false;
  this.colourpointGene = false;
  this.colourpointExpressed = false;
  this.colourpointMap = [false, false, false, false]; // chin, ears, feet, tail
  // checks
  this.closestFirefly = null;
  this.kill = function () {
    removeFocusFrom(this);
    chittens.splice(chittens.indexOf(this, chittens), 1);
    recalculateChittenNumbers();
  };
  // function to reinitialise sizes (for growth)
  this.reinitSizeAndColour = function () {
    this.limbLength = (this.size) + (1.5 * this.legginess * this.size);
    this.cellShadeThickness = this.size / 10;
    // Calculate mass based on size and thickness
    this.mass = this.size * this.thickness;
    if (this.albino && !this.hairless && !this.lykoi) {
      this.cellShadeLine = mixTwoColours(trueWhite, trueBlack, 0.7);
    } else if (this.hairless || this.lykoi) {
      this.cellShadeLine = mixTwoColours(nosePink, noseBlack, 0.5);
    } else {
      this.cellShadeLine = mixTwoColours(mixThreeColours(this.firstColour, this.secondColour, this.thirdColour), trueBlack, 0.7);
    }
    if (this.albino) {
      this.skinColour1 = skinPink;
      this.skinColour2 = skinPink;
      this.skinColour3 = skinPink;
      this.noseColour = nosePink;
    } else {
      this.skinColour1 = skinColourCheck(this.firstColour);
      this.skinColour2 = skinColourCheck(this.secondColour);
      this.skinColour3 = skinColourCheck(this.thirdColour);
      // Set nose color based on primary fur color
      this.noseColour = noseColourCheck(this.firstColour);
    }

    // Calculate jumping range based on physical attributes
    let legPower = 1 + (this.legginess * 0.15);
    let massPower = Math.sqrt(this.mass);
    this.maxJumpPower = baseJumpPower * legPower * massPower;
    // Use calculateBallisticTrajectory to determine maximum horizontal range
    // Test with a target at ground level to get maximum distance
    let testResult = calculateBallisticTrajectory(200, 0, this.size, this.mass, this.maxJumpPower);
    if (testResult && testResult.reachable) {
      // If we can reach 200 units, try further
      let testResult2 = calculateBallisticTrajectory(400, 0, this.size, this.mass, this.maxJumpPower);
      this.jumpingRange = testResult2 && testResult2.reachable ? 400 : 200;
    } else {
      // Try shorter distances
      let testResult2 = calculateBallisticTrajectory(100, 0, this.size, this.mass, this.maxJumpPower);
      this.jumpingRange = testResult2 && testResult2.reachable ? 100 : 50;
    }

  };
  // reset jump cooldown
  this.resetJumpCoolDown = function () {
    // Wait frames before next jump, fat cats are lazier
    if (this.age < maturesAt) {
      // Kittens following mothers get much shorter cooldown to be eager followers
      this.jumpCooldown = youngChittenJumpCooldown + (youngChittenJumpCooldown * this.thickness);;
    } else {
      this.jumpCooldown = chittenJumpCooldown + (chittenJumpCooldown * this.thickness);
    }
  }
  // reset rotation
  this.resetRotation = function (fastest) {
    // Normalize rotation to [-π, π] range to prevent full spins
    while (this.rotation > Math.PI) this.rotation -= 2 * Math.PI;
    while (this.rotation < -Math.PI) this.rotation += 2 * Math.PI;

    // Always take the shortest path to 0 for natural cat behavior
    if (Math.abs(this.rotation) <= 0.1) {
      this.rotation = 0;
      this.spin = 0;
    } else {
      // Always rotate towards 0 by the shortest path
      if (this.rotation > 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }

      // If we're not in fastest mode, slow down the rotation for more natural movement
      if (!fastest) {
        // Reduce spin momentum gradually when landing
        this.spin *= 0.9;
      }
    }
  };

  // 
  this.lifeTick = function () {
    // --- SIZE / GROWTH ---
    if (this.size < this.maxSize) {
      this.size += chittenGrowthRate;
      if (this.age < maturesAt) {
        this.size += chittenGrowthRate;
      }
      this.reinitSizeAndColour();
    }

    // --- HEALTH ---
    if (this.hunger <= 0 && this.awake && this.snuggling <= 0 && this.eatingChewsRemaining == 0) {
      if (Math.random() <= 0.0005) {
        addSpeech(this, angryWord());
      }
      // Starvation
      this.health -= 0.001;
    }
    if (this.health > 0) {
      this.health -= 0.001;
    }
    if (!this.awake) {
      // regain health when sleeping
      this.health += 0.05;
    }
    if (this.health > 100) {
      this.health = 100;
    }

    // --- ENERGY ---
    // tiredness linked to temperature (30 is max temp)
    this.energy -= 0.01325 - (0.01325 / 30 * temperature);
    if (season == 1) {
      // spring: less tired, more amorous
      this.energy += 0.07;
    } else if (season == 2) {
      // summer: more energy
      this.energy += 0.04;
    }
    if (this.awake && daytimeCounter <= 250) {
      // more tired between midnight and 3am
      this.energy -= 0.03125;
    }
    if (!this.awake) {
      // regain energy while asleep
      this.energy += 0.125;
    }
    if (!this.awake && this.energy > 90) {
      // wake up if energy gets high enough
      this.awake = true;
    }
    if (this.energy > 100) {
      this.energy = 100;
    } else if (this.energy < 0) {
      this.energy = 0;
    }

    // --- LOVE ---
    if (season == 1) {
      this.love += 0.01; // spring boost
    } else if (season != 2) {
      this.love -= 0.001; // autumn/winter drop
    }
    if (this.love > 100) {
      this.love = 100;
    } else if (this.love < 0) {
      this.love = 0;
    }

    // --- HUNGER ---
    if (this.hunger > 0) {
      this.hunger -= 0.25;
    } else if (this.hunger < 0) {
      this.hunger = 0; // fixed typo: was '=='
    }
    if (this.hunger > 1000) {
      this.hunger = 1000;
    }
  }

  // function to make a chitten continue eating once they have started
  this.continueEating = function () {
    // Handle eating chew cycles
    this.eatingChewTimer++;
    // Eating chew cycle: closed -> opening -> open -> closing -> closed (repeat)
    if (this.eatingChewState === 'closed' && this.eatingChewTimer >= eatingClosedPauseDuration) {
      // Start opening mouth
      this.eatingChewState = 'opening';
      this.targetMouthOpenState = true;
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'opening' && this.openMouthProgress >= 1) {
      // Mouth is fully open, stay open briefly
      this.eatingChewState = 'open';
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'open' && this.eatingChewTimer >= eatingOpenHoldDuration) {
      // Start closing mouth
      this.eatingChewState = 'closing';
      this.targetMouthOpenState = false;
      this.eatingChewTimer = 0;
    } else if (this.eatingChewState === 'closing' && this.openMouthProgress <= 0) {
      // Mouth is fully closed, chew cycle complete
      this.eatingChewState = 'closed';
      this.eatingChewTimer = 0;
      this.eatingChewsRemaining--;
      if (this.eatingChewsRemaining <= 0) {
        // Finished all chews
        this.eatingChewState = 'closed';
        this.targetMouthOpenState = false;
      }
    }
    // Cycle the eating phases
    if (this.targetMouthOpenState && this.openMouthProgress < 1) {
      // Lerping toward mouth open
      this.openMouthProgress += (1 / chittenMouthOpenCloseSpeed);
      if (this.openMouthProgress >= 1) {
        this.openMouthProgress = 1;
      }
    } else if (!this.targetMouthOpenState && this.openMouthProgress > 0) {
      // Lerping toward mouth closed
      this.openMouthProgress -= (1 / chittenMouthOpenCloseSpeed);
      if (this.openMouthProgress <= 0) {
        this.openMouthProgress = 0;
      }
    }
  }

  // act
  this.act = function () {
    // Decrement jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

    // Decrement sitting cooldown
    if (this.sittingCooldown > 0) {
      this.sittingCooldown--;
    }

    // Update sitting animation
    // Sitting down
    if (this.targetSittingState && this.sittingProgress < 1) {
      this.resetJumpCoolDown(); // reset the jump cooldown if are trying to sit
      // Lerping toward sitting: fatter cats sit down faster
      this.sittingProgress += (1 / chittenSittingSpeed) * (1 + this.thickness);
      if (this.sittingProgress >= 1) {
        this.sittingProgress = 1;
        this.sitting = true;
        // Start sitting cooldown when fully sitting
        this.sittingCooldown = chittenSittingCooldown;
      }
    } else if (!this.targetSittingState && this.sittingProgress > 0) {
      // Lerping toward standing: fatter cats stand up slower
      // standing up
      this.sittingProgress -= (1 / chittenStandingUpSpeed) * (2 - this.thickness);
      if (this.sittingProgress <= 0) {
        this.sittingProgress = 0;
        this.sitting = false;
      }
    }
    if (choosingChitten && this.snuggling == 0 && this.gender == 'Female') {
      if (!chosenKitten) {
        if (selection == null) {
          selection = chittens[Math.round(Math.random() * (boxes.length - 1)) + currentChittens];
        }
        handleButton(1);
      } else {
        handleButton(13);
      }
    }
    // giving birth
    if (!choosingChitten && parentBoxes.length === 0 && this.snuggling == 0 && this.gender == 'Female') {
      if (this.partner !== null) {
        this.partner.snuggling = -1;
        this.partner.partner = null;
        createGlyphs((this.x - (this.x - this.partner.x) / 2), (this.y - (this.y - this.partner.y) / 2), unicodeHeart, 1);
        initLitter(this.partner, this); // this.partner = male, this = female
        // take snuggling to -1 so that it doesn't give birth forever
      } else {
        sendMessage(this.name + ' had a phantom pregnancy');
      }
      this.snuggling = -1;
      this.partner = null;
    } else if (!choosingChitten && (this.snuggling >= 0)) {
      this.snuggling--;
    } else if (this.eatingChewsRemaining == 0) {
      // Opportunistic firefly interactions happen every frame for responsiveness
      if (!this.inCatBox && this.awake && this.snuggling == -1 && this.eatingChewsRemaining == 0) {
        // Check for nearby fireflies for quick opportunistic jumps
        let closestFirefly = fireflies[this.findClosestFireFly()];
        if (closestFirefly) {
          let dx = this.x - closestFirefly.x;
          let dy = this.y - closestFirefly.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // If firefly is very close, switch focus and reset jump cooldown for immediate action
          if (distance < this.size * chittenFireflySwatDistanceMod && (!this.focus || fireflies.includes(this.focus))) {
            this.focus = closestFirefly;
            this.jumpCooldown = 0; // Allow immediate jumping at close fireflies
          }
        }
      }

      // Throttle heavy behavior updates based on cat state
      this.behaviorUpdateCounter++;
      let updateFrequency = 3; // Reduced from 5 to make cats more active

      if (this.inCatBox) {
        updateFrequency = 15; // Cats in boxes update less frequently
      } else if (!this.awake) {
        updateFrequency = 10; // Sleeping cats update less frequently
      } else if (this.age < maturesAt) {
        updateFrequency = 2; // Kittens are even more active
      }

      if (this.behaviorUpdateCounter >= updateFrequency) {
        this.behaviorUpdateCounter = 0;

        // Don't change focus while eating or preparing to eat
        if (this.eatingChewsRemaining > 0 || this.preparingToEat) {
          // Skip focus updates while eating
        } else {
          // deciding what the focus is
          let target = null;
          // if not an adult, just follow mother (unless in catbox)
          if (this.age < maturesAt && this.mother !== null && !this.inCatBox) {
            target = this.mother;
          }
          // are we hungry?
          if (target == null && this.inCatBox == null && this.hunger <= 250 && fruits.length > 0) {
            let closestFruit = this.findClosestFruit();
            if (closestFruit !== 'X') {
              target = closestFruit;
            }
          }
          // are we gonna pick a mate? (using cached mate list for performance)
          if (target == null && this.snuggling == -1 && !choosingChitten && !this.elder && this.gender == 'Male' && this.age >= maturesAt && chittens.length <= maxPop && this.health >= breedingHealthReq
            && this.energy >= breedingEnergyReq) {
            // Update mates cache periodically
            matesCacheFrame++;
            if (matesCacheFrame >= MATES_CACHE_REFRESH_RATE) {
              matesCacheFrame = 0;
              updateMatesCache();
            }

            // Use cached available mates instead of looping through all cats
            if (!choosingChitten && this.gender == "Male" && this.love >= breedingLoveReq && this.energy >= breedingEnergyReq && this.health >= breedingHealthReq) {
            }
            for (let j = 0; j < availableMates.length && target == null; j++) {
              // We can target mates beyond our jumping range to get closer to them
              // The jumping range is just for filtering other targets
              this.partner = availableMates[j];
              availableMates[j].partner = this;
              target = availableMates[j];
            }
          }

          // Check for nearby fireflies that might override other targets
          if (!this.inCatBox && target !== null && target !== this.partner) {
            let closestFireflyIndex = this.findClosestFireFly();
            if (closestFireflyIndex !== 'X') {
              let fireflyDistance = Math.sqrt(
                (this.x - fireflies[closestFireflyIndex].x) ** 2 +
                (this.y - fireflies[closestFireflyIndex].y) ** 2
              );
              // If firefly is within jumping range, consider jumping at it
              if (fireflyDistance <= this.jumpingRange) {
                // Higher chance to jump at closer fireflies
                let jumpChance = Math.max(0.1, Math.min(0.8, 1 - (fireflyDistance / this.jumpingRange)));
                if (Math.random() < jumpChance) {
                  target = fireflies[closestFireflyIndex];
                }
              }
            }
          }

          if (target == null && !this.inCatBox) {
            // default action - target firefly if we can't find anything better (only if not in adoption box)
            // This allows targeting distant fireflies occasionally
            this.focus = fireflies[this.findClosestFireFly()];
          } else if (!this.inCatBox) {
            // Check if target is too far away and we should tree-hop instead
            if (target) {
              let targetDistance = Math.sqrt((this.x - target.x) ** 2 + (this.y - target.y) ** 2);
              if (targetDistance > this.jumpingRange) {
                let helpfulTree = this.findHelpfulTree(target);
                if (helpfulTree) {
                  // Use tree as intermediate target, but remember our ultimate goal
                  this.ultimateTarget = target;
                  this.focus = helpfulTree;
                  // console.log("I'm gonna try to use a tree");
                } else {
                  // No helpful tree found, target directly (will jump to get closer)
                  this.focus = target;
                }
              } else {
                // Target is within range, go directly
                this.focus = target;
              }
            }
          }
        } // End of eating check

        // kittens sitting down near their mothers - only when very close
        if (this.age < maturesAt && this.mother !== null
          && (Math.abs(this.x - this.mother.x) < (this.size + this.mother.size) * 1.5)
          && (Math.abs(this.y - this.mother.y) < (this.size + this.mother.size) * 1.5)) {
          if (this.mother.awake) {
            // copy the mother
            this.targetSittingState = this.mother.targetSittingState;
            this.facingForwards = true;
            // kittens falling asleep near their mothers
          } else if (this.eatingChewsRemaining == 0) {
            this.energy = this.mother.energy - (Math.random() * 5);
            this.awake = false;
            this.targetSittingState = false;
            this.facingForwards = true;
          }

        } else if (this.focus) {
          // Determine if we should allow jumping down based on target type
          let isFirefly = fireflies.includes(this.focus);
          let isMother = (this.focus === this.mother && this.age < maturesAt);
          let canJumpDown = !isFirefly; // Allow jumping down for mates and food, but not fireflies

          // For regular targets, use the old cooldown system
          // For fireflies and mothers, use opportunistic distance-based probability
          let shouldJump = false;
          if (!isFirefly && !isMother && this.jumpCooldown <= 0) {
            shouldJump = true;
          } else if ((isFirefly || isMother) && this.jumpCooldown <= 0) {
            // Calculate distance-based jump probability for fireflies and mothers
            let distance = Math.sqrt(
              Math.pow(this.focus.x - this.x, 2) +
              Math.pow(this.focus.y - this.y, 2)
            );
            let jumpChance;
            if (isMother) {
              // Kittens are eager followers - high base chance, even higher when far
              // Base 60% chance when very close, up to 95% when far away
              let maxMotherDistance = this.size * 8; // Consider distances up to 8 body lengths  
              let normalizedDistance = Math.min(1, distance / maxMotherDistance);
              jumpChance = Math.max(0.6, Math.min(0.95, normalizedDistance * 0.35 + 0.6));
            } else {
              // Firefly logic: closer = higher chance to jump
              let normalizedDistance = distance / chittenMaxSeekFireflyDistance;
              jumpChance = Math.max(0.1, Math.min(0.8, 1 - normalizedDistance));
            }
            shouldJump = Math.random() < jumpChance;
          }

          // if the focus is below the Chitten OR we can jump down to any target
          if (shouldJump && (this.focus.y <= this.y + this.size || (canJumpDown && this.focus.y > this.y + this.size))) {
            // If sitting, must lerp to standing before jumping (unless eating)
            if (this.sittingProgress > 0) {
              // Don't stand up if eating or preparing to eat, or if sitting cooldown is active
              if (this.eatingChewsRemaining == 0 && !this.preparingToEat && this.sittingCooldown <= 0) {
                this.targetSittingState = false; // Start standing up
              }
              return false; // Don't jump yet, wait for sitting animation or eating to finish
            }
            // Jumping starts here
            let dx = this.focus.x - this.x;
            let dy = this.focus.y - this.y;
            let trajectory = calculateBallisticTrajectory(dx, dy, this.size, this.mass, this.maxJumpPower);
            if (trajectory && trajectory.reachable) {
              // Use the calculated optimal trajectory with coordination-based error
              let taskDifficulty = 0.3; // Precise jumping is moderately difficult
              let failureRate = (1 - (this.coordination * chittenBaseCoordination)) * taskDifficulty;
              let errorMagnitude = Math.random() * failureRate; // 0 to failureRate

              // Apply coordination errors to trajectory
              let speedXError = (Math.random() - 0.5) * 2 * errorMagnitude * this.maxJumpPower * 0.2;
              let speedYError = (Math.random() - 0.5) * 2 * errorMagnitude * this.maxJumpPower * 0.15;

              this.speedX += trajectory.speedX + speedXError;
              this.speedY += trajectory.speedY + speedYError;
              // console.log("Using ballistic trajectory: angle=" + trajectory.angle + "°, power=" + Math.round(trajectory.power));
            } else {
              // Fallback to directional jump with proper arc (target is unreachable, but jump to get closer)
              let totalDistance = Math.sqrt(dx * dx + dy * dy);
              if (totalDistance > 0) {
                // Always jump in an arc - never shuffle on ground
                let optimalAngle = Math.PI / 6; // 30 degrees default

                // If target is significantly above/below, adjust angle
                if (Math.abs(dy) > this.size * 2) {
                  let targetAngle = Math.atan2(Math.abs(dy), Math.abs(dx));
                  optimalAngle = Math.max(Math.PI / 8, Math.min(Math.PI / 3, targetAngle));
                }

                // Scale power based on distance needed (don't overjump short targets)
                let distanceScale = Math.min(1.0, totalDistance / this.jumpingRange);
                let scaledPower = this.maxJumpPower * Math.max(0.3, distanceScale); // Minimum 30% power

                // Apply coordination-based errors to fallback jumping
                let taskDifficulty = 0.4; // Fallback jumping is harder than precise trajectory
                let failureRate = (1 - (this.coordination * chittenBaseCoordination)) * taskDifficulty;
                let errorMagnitude = Math.random() * failureRate; // 0 to failureRate

                // Errors affect angle and power
                let angleError = (Math.random() - 0.5) * errorMagnitude * (Math.PI / 4); // Up to ±45° error
                let powerError = (Math.random() - 0.5) * 2 * errorMagnitude * scaledPower * 0.3; // Up to ±30% power error

                let adjustedAngle = optimalAngle + angleError;
                let adjustedPower = scaledPower + powerError;

                let horizontalDirection = dx > 0 ? 1 : -1;
                this.speedX += adjustedPower * Math.cos(adjustedAngle) * horizontalDirection;
                this.speedY += -adjustedPower * Math.sin(adjustedAngle); // Always arc upward

                // console.log("Jumping with " + Math.round(optimalAngle * 180 / Math.PI) + "° arc toward partner/target");
              }
            }

            this.resetJumpCoolDown();

            if (this.age >= maturesAt) {
              // it doesn't cost kittens energy or health to jump
              this.energy -= 7;
              this.health -= 1;
              if (this.energy <= 0) {
                this.facingForwards = false;
              }
            }
            this.y--;
            this.targetSittingState = false;
            // one in ten jumps is facing backwards
            if (Math.random() < 1 / 10) {
              this.facingForwards = false;
            }
          }
        }
      } else {
        // 1% chance to sit when behavior updates
        if (Math.random() < 0.01) {
          this.targetSittingState = true;
        }
      }
      // 0.1% chance of speaking
      if (Math.random() <= 0.001) {
        addSpeech(this, neutralWord());
      }
    }
  };

  this.findClosestFruit = function () {
    let tmp = maxDistance;
    let target = 'X';
    let reachableTarget = 'X';
    let reachableDistance = maxDistance;

    for (let f = 0; f < fruits.length; f++) {
      let tmpX = this.x - fruits[f].x;
      let tmpY = this.y - fruits[f].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));

      // Check if fruit is available and above ground
      if (fruits[f].eaterId == null && fruits[f].y <= trueBottom - fruits[f].size && distance < tmp) {
        // Check if it's within jumping range
        if (distance <= this.jumpingRange) {
          // Prefer reachable fruits
          if (distance < reachableDistance) {
            reachableTarget = fruits[f];
            reachableDistance = distance;
          }
        } else {
          // Only consider distant fruits if we're hungry and they're on the floor
          let onFloor = fruits[f].y >= trueBottom - fruits[f].size - 10; // Within 10 pixels of ground
          if (this.hunger <= 250 && onFloor) {
            tmp = distance;
            target = fruits[f];
          }
        }
      }
    }

    // Return reachable fruit if found, otherwise return distant fruit (if any)
    return reachableTarget !== 'X' ? reachableTarget : target;
  };

  // Find a tree that could help us get closer to our ultimate target
  this.findHelpfulTree = function (ultimateTarget) {
    if (!ultimateTarget) return null;

    let bestTree = null;
    let bestImprovement = 0;
    let currentDistance = Math.sqrt((this.x - ultimateTarget.x) ** 2 + (this.y - ultimateTarget.y) ** 2);

    for (let t = 0; t < trees.length; t++) {
      let treeDistance = Math.sqrt((this.x - trees[t].x) ** 2 + (this.y - trees[t].y) ** 2);

      // Only consider trees we can actually reach
      if (treeDistance <= this.jumpingRange) {
        // Calculate how much closer this tree gets us to the ultimate target
        let treeToTargetDistance = Math.sqrt((trees[t].x - ultimateTarget.x) ** 2 + (trees[t].y - ultimateTarget.y) ** 2);
        let improvement = currentDistance - treeToTargetDistance;

        // Only use tree if it gets us significantly closer (at least 50 units)
        if (improvement > 50 && improvement > bestImprovement) {
          bestTree = trees[t];
          bestImprovement = improvement;
        }
      }
    }

    return bestTree;
  };

  this.findClosestFireFly = function () {
    let tmp = maxDistance;
    let target = 'X';
    for (let i = 0; i < fireflies.length; i++) {
      let tmpX = this.x - fireflies[i].x;
      let tmpY = this.y - fireflies[i].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));
      if (distance < tmp) {
        tmp = distance;
        target = i;
      }
    }
    if (target == 'X') {
      return 0;
    }
    return target;
  };

  // Find closest firefly for eye glow (no range restrictions)
  this.findClosestFireFlyForEyes = function () {
    let tmp = maxDistance;
    let target = 'X';
    for (let i = 0; i < fireflies.length; i++) {
      let tmpX = this.x - fireflies[i].x;
      let tmpY = this.y - fireflies[i].y;
      let distance = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY));
      if (distance < tmp) {
        tmp = distance;
        target = i;
      }
    }
    if (target == 'X') {
      return 0;
    }
    return target;
  };

  // check for bounces on walls and landing on trees
  this.physicsCheck = function () {
    this.onSurface = false;
    // check if chitten hit a Tree
    let hitTree = false;
    for (let i = 0; i < trees.length && !hitTree; i++) {
      if (!this.inCatBox && this.x >= trees[i].x + (this.size / 2) - (trees[i].width / 2)
        && this.x <= trees[i].x - (this.size / 2) + (trees[i].width / 2)
        && this.y >= trees[i].y - (this.size) - (this.limbLength / 2.5) - (this.size / 2) && this.y <= trees[i].y + trees[i].height
        && this.speedY >= 0) {
        this.y = trees[i].y - (this.size) - (this.limbLength / 2.5);
        trees[i].loadthisframe += this.mass;
        hitTree = true;
        this.landedOnSurface();

        // Check if we landed on our target tree and should now go to ultimate target
        if (this.ultimateTarget && this.focus === trees[i]) {
          let ultimateDistance = Math.sqrt((this.x - this.ultimateTarget.x) ** 2 + (this.y - this.ultimateTarget.y) ** 2);
          if (ultimateDistance <= this.jumpingRange) {
            // Now we can reach our ultimate target directly
            this.focus = this.ultimateTarget;
            this.ultimateTarget = null;
          } else {
            // Still too far, look for another tree to hop to
            let nextTree = this.findHelpfulTree(this.ultimateTarget);
            if (nextTree && nextTree !== trees[i]) {
              this.focus = nextTree;
            } else {
              // No more helpful trees, go directly to ultimate target
              this.focus = this.ultimateTarget;
              this.ultimateTarget = null;
            }
          }
        }

        if (this.eatingChewsRemaining == 0 && this.snuggling <= 0) {
          this.energy -= 0.01;
        }
        if (this.y > trueBottom - (this.size) - (this.limbLength / 2.5)) {
          this.y = trueBottom - (this.size) - (this.limbLength / 2.5);
        }
      }
    }
    checkBounceSides(this);
    checkBounceTop(this);
    if (choosingChitten) {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].checkBounce(this);
      }
      if (!chosenKitten) {
        for (let i = 0; i < parentBoxes.length; i++) {
          parentBoxes[i].checkBounce(this);
        }
      }
    }

    // check if chitten hit the floor, come to a rest if so
    if (!this.onSurface && this.y >= trueBottom - (this.size) - (this.limbLength / 2.5)) {
      this.y = trueBottom - (this.size) - (this.limbLength / 2.5);
      this.landedOnSurface();
    }
  };

  this.landedOnSurface = function () {
    this.speedY = 0;
    if (this.energy <= 0 && this.eatingChewsRemaining == 0 && this.snuggling == -1) {
      // fall asleep when tired
      this.targetSittingState = false;
      this.awake = false;
      this.facingForwards = true;
      this.speedX = 0;
      this.rotation = 0;
      this.spin = 0;
    } else {
      this.onSurface = true;
      this.facingForwards = true;
      // apply ground friction
      this.speedX *= groundFriction;
      this.resetRotation(false);
      // jump occasionally
      if (!this.beingHeld && this.rotation == 0 && this.awake && !this.inCatBox) {
        this.act();
      }
    }
  };

  // Helper function to get bodypart color
  this.getBodypartColor = function (bodypartIndex, isHairless = false) {
    // Handle albino 
    if (this.albino) {
      return this.albino && this.hairless ? skinPink : trueWhite;
    }
    // Handle hairless 
    if (isHairless || this.hairless) {
      if (this.bodypartCode[bodypartIndex] == 0) {
        return this.skinColour1;
      } else if (this.bodypartCode[bodypartIndex] == 1) {
        return this.skinColour2;
      } else {
        return this.skinColour3;
      }
    }
    // Handle colorpoint - check if this bodypart should be colorpoint
    // jowls are always colourpoint
    if (!this.albino && this.colourpointExpressed
      && (bodypartIndex == 9 || bodypartIndex == 10)) {
      return this.thirdColour
    }
    // refer to colournmap for other parts
    if (!this.albino && this.colourpointExpressed && this.colourpointMap[this.bodypartcodeToColourMap(bodypartIndex)]) {
      return this.thirdColour;
    }

    // For non-hairless, non-albino, non-colorpoint cats - use normal bodypart colors
    if (this.bodypartCode[bodypartIndex] == 0) {
      return this.firstColour;
    } else if (this.bodypartCode[bodypartIndex] == 1) {
      return this.secondColour;
    } else {
      return this.thirdColour;
    }
  };

  // function to convert a bodypartcode index to a colourmap index
  this.bodypartcodeToColourMap = function (bpc) {
    if (bpc == 11) {
      return 0;
    }
    if (bpc == 3 || bpc == 4) {
      return 1;
    }
    if (bpc == 0 || bpc == 1 || bpc == 7 || bpc == 8) {
      return 2;
    }
    if (bpc == 6) {
      return 3;
    }
  };

  // Helper function to apply pattern overlay
  this.applyPatternOverlay = function (pat, drawFunction) {
    if (!this.albino && this.pattern !== 0) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = this.patternAlpha;
      drawFunction();
      ctx.globalAlpha = 1;
    }
  };

  // Helper function for animation calculations (modulo operation)
  this.getAnimationValue = function (value, modulo) {
    while (value > modulo && value > 0) {
      value -= modulo;
    }
    while (value < 0) {
      value += modulo;
    }
    return value;
  };

  // Helper function to apply bodypart code colors to gradient based on anatomical connections
  this.applyBodypartGradient = function (bodypartIndex, gradient) {

    // Define anatomical connections: [topBodypartIndex, bottomBodypartIndex]
    const connections = [
      [5, 0],   // [0] front foot left: body to front foot left
      [5, 1],   // [1] front foot right: body to front foot right  
      [2, 12],  // [2] head: head to chest
      [3, 2],   // [3] left ear: left ear to head
      [4, 2],   // [4] right ear: right ear to head
      [5, 12],  // [5] body: body to chest
      [6, 5],   // [6] tail: tail to chest
      [5, 7],   // [7] back foot left: body to back foot left
      [5, 8],   // [8] back foot right: body to back foot right
      [9, 11],  // [9] left jowl: left jowl to chin
      [10, 11], // [10] right jowl: right jowl to chin
      [2, 11],  // [11] chin: head to chin
      [5, 12]   // [12] chest: body to chest
    ];

    const [topPartIndex, bottomPartIndex] = connections[bodypartIndex];
    let topColor, bottomColor;

    if (this.colourpointExpressed) {
      // Colorpoint cats have special gradient rules
      if ([0, 1, 7, 8].includes(bodypartIndex)) {
        // Feet: body part colour to thirdColour
        topColor = this.getBodypartColor(topPartIndex);
        bottomColor = this.thirdColour;
      } else if (bodypartIndex === 6) {
        // Tail: thirdColour to body part colour  
        topColor = this.thirdColour;
        bottomColor = this.getBodypartColor(bottomPartIndex);
      } else if (bodypartIndex === 2) {
        // Face: thirdColour to body part colour
        topColor = this.thirdColour;
        bottomColor = this.getBodypartColor(bottomPartIndex);
      } else {
        // Other parts use normal anatomical connections
        topColor = this.getBodypartColor(topPartIndex);
        bottomColor = this.getBodypartColor(bottomPartIndex);
      }
    } else {
      // Normal cats use anatomical connections
      topColor = this.getBodypartColor(topPartIndex);
      bottomColor = this.getBodypartColor(bottomPartIndex);
    }

    // Create gradient
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(this.coatMod[0], mixTwoColours(topColor, bottomColor, 0.5));
    gradient.addColorStop(1, bottomColor);

    return gradient;
  };

  // Helper function to create foot gradient
  // Combined function to create gradients for body parts
  this.createBodypartGradient = function (bodypartIndex, gradientType, gradientParams) {
    // For solid colors (hairless, albino, or colorpoint), use getBodypartColor
    if (this.hairless || this.albino ||
      (!this.albino && this.colourpointExpressed && this.colourpointMap[this.bodypartcodeToColourMap(bodypartIndex)])) {
      return this.getBodypartColor(bodypartIndex, this.hairless);
    }

    // For normal cats, create the specified gradient
    if (!this.albino && !this.hairless) {
      let gradient;
      if (gradientType === 'radial') {
        gradient = ctx.createRadialGradient(...gradientParams);
      } else { // linear
        gradient = ctx.createLinearGradient(...gradientParams);
      }
      return this.applyBodypartGradient(bodypartIndex, gradient);
    }

    // Fallback
    return trueWhite;
  };

  // Helper function to create foot gradient (now uses combined function)
  this.createFootGradient = function (bodypartIndex, footSize) {
    if (this.albino) {
      return trueWhite;
    } else if (this.hairless) {
      return this.getBodypartColor(bodypartIndex);
    }
    return this.createBodypartGradient(bodypartIndex, 'radial', [
      0, 0, 1,
      0, 0, (this.size) + (this.limbLength / 2.5) + (footSize * 2)
    ]);
  };

  // Helper function to create ear gradient (now uses combined function)
  this.createEarGradient = function (bodypartIndex) {
    return this.createBodypartGradient(bodypartIndex, 'linear', [
      0, -this.size - (this.size * this.earWidth / 2),
      0, this.limbLength / 4
    ]);
  };

  // Helper function to draw a single front leg
  this.drawSingleFrontLeg = function (xPosition, startY, endY, legGradient, bodypartIndex, pat) {
    // Cell shading
    ctx.strokeStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(xPosition, startY);
    ctx.lineTo(xPosition, endY);
    ctx.stroke();

    // Real drawing with gradient
    ctx.lineWidth -= this.cellShadeThickness;
    ctx.strokeStyle = legGradient;
    ctx.beginPath();
    ctx.moveTo(xPosition, startY);
    ctx.lineTo(xPosition, endY);
    ctx.stroke();
    ctx.lineWidth += this.cellShadeThickness;
  };

  // Helper function to draw a single reaching front leg
  this.drawReachingFrontLeg = function (startX, startY, endX, endY, legGradient, bodypartIndex, pat) {
    // Cell shading
    ctx.strokeStyle = this.cellShadeLine;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.restore();
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Real drawing with gradient
    ctx.lineWidth -= this.cellShadeThickness;
    ctx.strokeStyle = legGradient;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.restore();
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.lineWidth += this.cellShadeThickness;
  };

  // Helper function to draw a single leg
  this.drawSingleBackLeg = function (xOffset, yOffset, rotation, legGradient, footColor, pat) {
    // Cell shading first
    ctx.fillStyle = this.cellShadeLine;
    ctx.strokeStyle = this.cellShadeLine;
    let originalLineWidth = ctx.lineWidth;
    ctx.lineWidth += this.cellShadeThickness;

    ctx.save();
    ctx.translate(xOffset, yOffset);
    if (!this.onSurface) {
      ctx.rotate(rotation);
    }

    ctx.beginPath();
    if (this.awake && this.sittingProgress > 0) {
      ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
    } else {
      ctx.moveTo(0, 0);
    }
    ctx.lineTo(0, this.limbLength * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, this.limbLength * 0.6, (this.size / 3.5 * this.thickness * 2) + this.cellShadeThickness, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Main drawing
    ctx.lineWidth = originalLineWidth;
    ctx.strokeStyle = legGradient;
    ctx.fillStyle = legGradient;

    ctx.save();
    ctx.translate(xOffset, yOffset);
    if (!this.onSurface) {
      ctx.rotate(rotation);
    }

    ctx.beginPath();
    if (this.awake && this.sittingProgress > 0) {
      ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
    } else {
      ctx.moveTo(0, 0);
    }
    ctx.lineTo(0, this.limbLength * 0.6);
    ctx.stroke();

    ctx.fillStyle = footColor;
    ctx.beginPath();
    ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
    ctx.fill();

    // Pattern overlay
    this.applyPatternOverlay(pat, () => {
      ctx.strokeStyle = pat;
      ctx.beginPath();
      if (this.awake && this.sittingProgress > 0) {
        ctx.moveTo(0, -(this.size / 2) * this.sittingProgress);
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength * 0.6, this.size / 3.5 * this.thickness * 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.restore();
  };

  this.drawTail = function (pat, backendShiftX, backendShiftY, sleepshift) {
    // === TAIL ANIMATION CALCULATIONS ===
    let tmp = this.getAnimationValue(Math.abs(daytimeCounter - this.birthday), 30);
    tmp = Math.abs(tmp - 15); // 0 to 15 to 0 to 15 (wagging motion)

    // === CONTEXT TRANSFORMATIONS ===
    ctx.save();
    if (this.awake && !this.facingForwards && this.sittingProgress > 0) {
      ctx.translate(0, -this.size * this.sittingProgress);
    }
    if (!this.onSurface && this.awake) {
      tmp = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
      ctx.rotate((90 * Math.PI / 180) + Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.onSurface || !this.awake) {
      ctx.translate(0, sleepshift - this.size);
    }

    // === COLOR SETUP ===
    let tailGradient;
    // Check if this should be a solid color (hairless, albino, or colorpoint)
    if (this.hairless || this.albino ||
      (!this.albino && this.colourpointExpressed && this.colourpointMap[this.bodypartcodeToColourMap(6)])) {
      tailGradient = this.getBodypartColor(6, this.hairless);
    } else if (!this.albino && !this.hairless) {
      tailGradient = ctx.createRadialGradient(0, this.size, 1, 0, 0, this.size * 4);
      tailGradient.addColorStop(0, trueBlack);
      if (this.bodypartCode[6] == 0) {
        tailGradient.addColorStop(0, this.secondColour);
        tailGradient.addColorStop(this.coatMod[0], this.firstColour);
        tailGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[6] == 1) {
        tailGradient.addColorStop(0, this.thirdColour);
        tailGradient.addColorStop(this.coatMod[0], this.secondColour);
        tailGradient.addColorStop(1, this.secondColour);
      } else {
        tailGradient.addColorStop(0, this.firstColour);
        tailGradient.addColorStop(this.coatMod[0], this.thirdColour);
        tailGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino) {
      tailGradient = trueWhite;
    } else {
      tailGradient = skinPink;
    }

    // === DRAW OUTLINE AND FILL ===
    ctx.fillStyle = tailGradient;
    ctx.lineWidth = 2 * this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(+this.size / 3, (this.size / 3));
    ctx.arc((this.size * (-tmp + 7.5) * this.tailLength / 8 * this.thickness) - (this.size / 32), (this.size / 3) - (2 * this.tailLength * this.size), (this.size / 3 * this.thickness * 2), 0, Math.PI, true);
    ctx.lineTo(-this.size / 3, this.size / 3);
    ctx.stroke();
    ctx.fill();

    // === PATTERN OVERLAY ===
    this.applyPatternOverlay(pat, () => {
      ctx.beginPath();
      ctx.moveTo(+this.size / 3, (this.size / 3));
      ctx.arc((this.size * (-tmp + 7.5) * this.tailLength / 8 * this.thickness) - (this.size / 32), (this.size / 3) - (2 * this.tailLength * this.size), (this.size / 3 * this.thickness * 2), 0, Math.PI, true);
      ctx.lineTo(-this.size / 3, this.size / 3);
      ctx.fill();
    });

    // === ADDITIONAL DETAILS ===
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(butthole, -(this.size / 3), -this.size / 3, this.size / 1.5, this.size / 1.5);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  this.drawBackLegs = function (pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle) {
    if (this.awake && this.energy > 0) {
      let footSize = this.size / 3.5 * this.thickness * 2.25;
      let leftFootColour = this.createFootGradient(7, footSize);
      let rightFootColour = this.createFootGradient(8, footSize);

      ctx.lineWidth = (this.size / 2.5) * this.thickness * 2;
      ctx.save(); // 0 open - rotated
      ctx.translate(this.x - backendShiftX, this.y - backendShiftY);
      if (!this.onSurface) {
        ctx.rotate(this.rotation);
      }

      // Calculate leg rotations
      let leftLegRotation = !this.onSurface ? (sameDirection ? this.angleToFocus + (90 * Math.PI / 180) : legAngle) : 0;
      let rightLegRotation = !this.onSurface ? (sameDirection ? this.angleToFocus + (90 * Math.PI / 180) : -legAngle) : 0;

      let gradientTotalLengthY = this.limbLength * 0.6;
      let leftBackLegGradient = ctx.createLinearGradient(-(this.size / 2.5), this.size / 2, 0, gradientTotalLengthY);
      this.applyBodypartGradient(7, leftBackLegGradient);
      let leftFrontLegGradient = ctx.createLinearGradient((this.size / 2.5), this.size / 2, 0, gradientTotalLengthY);
      this.applyBodypartGradient(8, leftFrontLegGradient);

      // Draw both legs using helper function
      this.drawSingleBackLeg(-(this.size / 2.5), (this.size / 2), leftLegRotation, leftBackLegGradient, leftFootColour, pat);
      this.drawSingleBackLeg((this.size / 2.5), (this.size / 2), rightLegRotation, leftFrontLegGradient, rightFootColour, pat);

      ctx.restore(); // 0 close
    }
  };

  this.drawIcons = function () {
    ctx.save(); // 0
    ctx.translate(this.x, this.y);
    // zzzzs
    if (!this.awake) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      let amntToMove = this.getAnimationValue(this.energy, 10);
      ctx.globalAlpha = (1 - (amntToMove / 10)) / 2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size - amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size - 7 - amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size - 14 - amntToMove);
    }

    // hearts for snuggling
    if (this.snuggling > 0) {
      ctx.fillStyle = heartsPink;
      ctx.font = '20px' + ' ' + globalFont;
      let amntToMove = this.getAnimationValue(this.snuggling, 40);
      ctx.globalAlpha = (1 - (amntToMove / 40)) / 2;
      amntToMove *= 1;
      let textXOffset = (ctx.measureText(unicodeHeart).width) / 2;
      ctx.fillText(unicodeHeart, -textXOffset, -(this.size * 4) + amntToMove);
    }

    // eating nom nom noms
    if (this.eatingChewsRemaining > 0) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      if (this.age >= maturesAt) {
        let text = '*nom*';
        let textXOffset = (ctx.measureText(text).width) / 2;
        ctx.save();
        if (this.eatingChewsRemaining === 1 || this.eatingChewsRemaining == 3) {
          ctx.rotate(0.5);
          ctx.fillText(text, -textXOffset, -this.size * 1.5);
        } else {
          ctx.rotate(-0.5);
          ctx.fillText(text, -textXOffset, -this.size * 1.5);
        }
        ctx.restore();
      } else {
        let text = '*suckle*'
        let textXOffset = (ctx.measureText(text).width) / 2;
        ctx.fillStyle = trueWhite;
        ctx.fillText(text, -textXOffset, -this.size * 2.5);
      }
    }
    ctx.restore(); // 0
  };

  this.drawBody = function (pat, backendShiftX, backendShiftY, bodyGradient) {
    // === BODY ANIMATION CALCULATIONS ===
    let tmp = this.getAnimationValue(Math.abs(daytimeCounter - this.birthday), 15);
    tmp *= 0.5;
    tmp = Math.abs(tmp - 3.75); // -0 to -3.75 to 0 to 3.75 (butt wagging)

    // === SETUP DRAWING STYLE ===
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = 2 * this.cellShadeThickness;

    if (this.awake && this.sittingProgress > 0) {
      // === SITTING POSITION - INTERPOLATED ===
      let sittingOffset = this.sittingProgress;

      // DRAW OUTLINE AND FILL - BUTT
      ctx.beginPath();
      ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // DRAW OUTLINE AND FILL - BELLY
      ctx.beginPath();
      ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // === PATTERN OVERLAY - SITTING ===
      this.applyPatternOverlay(pat, () => {
        // Pattern - butt
        ctx.beginPath();
        ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
        // Pattern - belly
        ctx.beginPath();
        ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
      });

      // Special pattern effects (outside helper since they need different styling)
      if (!this.albino && this.pattern == 3) {
        let fadeGrad = ctx.createLinearGradient(0, -(this.size + (this.thickness * this.size / 2)) / 2, 0, (this.size + (this.thickness * this.size / 2)));
        fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
        fadeGrad.addColorStop(1, this.firstColour);
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
      }
      if (!this.albino && this.pattern == 6) {
        let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
        ctx.globalAlpha = 0.5;
        bGradient.addColorStop(0, this.thirdColour);
        bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bGradient;
        ctx.arc(-backendShiftX / 4, -this.size - (this.backendShiftY / 4) * sittingOffset, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.arc(-tmp + (1.875 * sittingOffset), -this.size, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    } else if (this.awake) {
      // === STANDING POSITION ===

      // DRAW OUTLINE AND FILL - BUTT
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // DRAW OUTLINE AND FILL - BELLY
      ctx.beginPath();
      ctx.arc(-(this.size / 32) - backendShiftX / 4, - backendShiftY / 4, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // === PATTERN OVERLAY - STANDING ===
      this.applyPatternOverlay(pat, () => {
        ctx.beginPath();
        ctx.arc(-(this.size / 32) - backendShiftX / 4, - backendShiftY / 4, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
      });

      // Special pattern effects (outside helper since they need different styling)
      if (!this.albino && this.pattern == 3) {
        let fadeGrad = ctx.createLinearGradient(0, -(this.size + (this.thickness * this.size / 2)) / 2, 0, (this.size + (this.thickness * this.size / 2)));
        fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
        fadeGrad.addColorStop(1, this.firstColour);
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
      }
      if (!this.albino && this.pattern == 6) {
        let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
        ctx.globalAlpha = 0.5;
        bGradient.addColorStop(0, this.thirdColour);
        bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bGradient;
        ctx.arc(-(this.size / 32) - backendShiftX, - backendShiftY, (this.size + (this.thickness * this.size / 2)), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  };

  this.drawChest = function (pat, backendShiftX, backendShiftY, bodyGradient) {
    if (this.awake && this.sittingProgress < 1) {
      // Scale chest down to 0% when sitting
      let chestScale = 1 - this.sittingProgress; // 0 when sitting, 1 when standing
      let bgY = this.size / 2;
      let fgY = bgY + (this.size * 0.9 - bgY) * chestScale; // scale the offset
      // Chest
      ctx.globalAlpha = 1;
      // REAL DRAWING
      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = 2 * this.cellShadeThickness;
      ctx.beginPath();
      ctx.arc(0, bgY, (this.size + (this.thickness * this.size / 5)) * chestScale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // chest coloured piece
      let chestColour;
      if (this.hairless) {
        chestColour = this.getBodypartColor(12, true);
      } else if (!this.albino && !this.hairless) {
        chestColour = bodyGradient; // Use existing gradient and modify it
        if (this.bodypartCode[12] == 0) {
          chestColour.addColorStop(0, this.secondColour);
          chestColour.addColorStop(this.coatMod[0], this.firstColour);
          chestColour.addColorStop(0.5, this.firstColour);
        } else if (this.bodypartCode[12] == 1) {
          chestColour.addColorStop(0, this.thirdColour);
          chestColour.addColorStop(this.coatMod[0], this.secondColour);
          chestColour.addColorStop(0.5, this.secondColour);
        } else {
          chestColour.addColorStop(0, this.firstColour);
          chestColour.addColorStop(this.coatMod[0], this.thirdColour);
          chestColour.addColorStop(0.5, this.thirdColour);
        }
      } else {
        chestColour = bodyGradient; // Default for albino
      }
      ctx.fillStyle = chestColour;
      ctx.beginPath();
      ctx.arc(0, fgY, ((this.size + (this.thickness * this.size / 5)) / 1.5) * chestScale, 0, 2 * Math.PI);
      ctx.fill();
      // Apply pattern overlay (excluding pattern 3 which doesn't apply to chest)
      if (!this.albino && this.pattern !== 0 && this.pattern !== 3) {
        this.applyPatternOverlay(pat, () => {
          ctx.beginPath();
          ctx.arc(0, bgY, (this.size + (this.thickness * this.size / 5)) * chestScale, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
      ctx.rotate(this.rotation);
    }
  };

  this.drawHead = function (pat, sleepshift) {
    // ears
    ctx.globalAlpha = 1;
    ctx.save(); // 0
    if (this.awake) {
      ctx.translate(-this.size, -this.size / 2);
    } else {
      ctx.translate(-this.size, sleepshift);
    }
    oneq = this.size / 2;
    let leftEarGradient = this.createEarGradient(3);
    let rightEarGradient = this.createEarGradient(4);
    ctx.fillStyle = leftEarGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = this.cellShadeThickness;
    ctx.beginPath();
    ctx.moveTo(0, +this.size / 2);
    ctx.lineTo(-(this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
    ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = rightEarGradient;
    ctx.beginPath();
    ctx.moveTo(oneq * 2, -(this.size * this.earWidth) / 4);
    ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
    ctx.lineTo(oneq * 4, +this.size / 2);
    ctx.stroke();
    ctx.fill();
    // Apply pattern overlay to both ears
    this.applyPatternOverlay(pat, () => {
      ctx.beginPath();
      ctx.moveTo(0, +this.size / 2);
      ctx.lineTo(-(this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
      ctx.lineTo(oneq * 2, -(this.size * this.earWidth) / 4);
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size), -(this.thickness * this.size / 2) - this.earHeight * (this.size));
      ctx.lineTo(oneq * 4, +this.size / 2);
      ctx.fill();
    });
    // skin inside the ear
    if (this.facingForwards && this.awake) {
      ctx.fillStyle = this.skinColour1;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = this.size / 10;
      ctx.beginPath();
      ctx.moveTo(0, +(this.size / 2) + (this.earWidth * this.size / 2));
      ctx.lineTo(-(this.earWidth * this.size * 0.5), -(this.thickness * this.size / 4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq * 2, (this.earHeight * this.size * 0.25));
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(oneq * 2, (this.earHeight * this.size * 0.25));
      ctx.lineTo((oneq * 4) + (this.earWidth * this.size * 0.5), -(this.thickness * this.size / 4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq * 4, +(this.size / 2) + (this.earWidth * this.size / 2));
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore(); // 0

    // head
    if (this.awake && this.sittingProgress > 0) {
      ctx.translate(0, ((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    } else if (!this.awake) {
      ctx.translate(0, sleepshift);
    }
    let s = this.size * 6;
    let maxWidth = Math.sqrt(s * s + s * s) / 2;
    let headGradient = this.hairless ? this.getBodypartColor(2, true) : trueWhite;
    if (!this.albino && !this.hairless) {
      headGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1] * 6.3) * maxWidth, // start pos
        + Math.sin(this.coatMod[1] * 6.3) * maxWidth,
        - Math.cos(this.coatMod[1] * 6.3) * maxWidth, // end pos
        - Math.sin(this.coatMod[1] * 6.3) * maxWidth
      );
      if (this.bodypartCode[2] == 0) {
        headGradient.addColorStop(0, this.secondColour);
        headGradient.addColorStop(this.coatMod[0], this.firstColour);
        headGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[2] == 1) {
        headGradient.addColorStop(0, this.thirdColour);
        headGradient.addColorStop(this.coatMod[0], this.secondColour);
        headGradient.addColorStop(1, this.secondColour);
      } else {
        headGradient.addColorStop(0, this.firstColour);
        headGradient.addColorStop(this.coatMod[0], this.thirdColour);
        headGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      headGradient = skinPink;
    }
    if (this.awake && this.sittingProgress > 0) {
      ctx.translate(0, -((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    } else if (!this.awake) {
      ctx.translate(0, -sleepshift);
    }
    if (this.awake) {
      // awake mode
      ctx.save();
      ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.lineWidth = 2 * this.cellShadeThickness;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // colourpoint genetic mutation
      if (!this.albino && this.colourpointExpressed) {
        let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2 * this.patternAlpha, 0, 0, this.size * this.patternAlpha);
        faceGradient.addColorStop(0, this.thirdColour);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // draw the pattern image
      this.applyPatternOverlay(pat, () => {
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      });
      // additional gradient on top for tabby
      if (!this.albino && this.pattern == 3) {
        let fadeGrad = ctx.createLinearGradient(0, -this.size / 2, 0, this.size);
        fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
        fadeGrad.addColorStop(1, this.firstColour);
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // additional gradient on top for bengal / mau pattern
      if (!this.albino && this.pattern == 6) {
        let faceGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size * 3);
        ctx.globalAlpha = 0.5;
        faceGradient.addColorStop(0, this.thirdColour);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      // draw lykoi skin coloured face on top
      if (this.lykoi) {
        let faceGradient = ctx.createRadialGradient(0, 0, this.size / 2 * this.patternAlpha, 0, 0, this.size * this.patternAlpha);
        faceGradient.addColorStop(0, skinPink);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size + (this.thickness * this.size / 5), 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();

      if (this.facingForwards && this.inCatBox == null && this !== experiment) {
        // smile
        if (this.health >= 50 && !this.elder && this.energy > 0) {
          ctx.globalAlpha = this.love / 100;
          if (this.gender == 'Female') {
            ctx.drawImage(smile, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          } else if (this.gender == 'Male') {
            ctx.drawImage(smile2, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          } else if (this.gender == 'Non Binary') {
            ctx.drawImage(smile3, -(this.size) * 0.8, this.size / 8, this.size * 1.6, this.size * 0.8);
          }
          ctx.globalAlpha = 1;
        }
      }
    } else {
      // sleep mode
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, this.limbLength + (this.size / 2), this.size + this.cellShadeThickness, 3.15, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(0, this.limbLength + (this.size * 0.6), this.size, 3.15, 2 * Math.PI);
      ctx.fill();
      this.applyPatternOverlay(pat, () => {
        ctx.beginPath();
        ctx.arc(0, this.limbLength + (this.size * 0.6), this.size, 3.15, 2 * Math.PI);
        ctx.fill();
      });
    }
    ctx.globalAlpha = 1;
    // eyes
    if (this.awake && this.facingForwards) {
      let temp = daytimeCounter;
      while (temp > 100) {
        temp -= 100;
      }
      let temp2 = this.birthday;
      while (temp2 > 100) {
        temp2 -= 100;
      }
      if (((this.snuggling >= 0 || this.eatingChewsRemaining > 0) && this.age >= maturesAt) || (temp > temp2 - 1.5 && temp < temp2 + 1.5)) {
        ctx.save();
        ctx.scale(1 + (this.headWidth / 3), 1 + (this.headHeight / 5));
        ctx.drawImage(content, -this.size, -this.size, this.size * 2, this.size * 2);
        ctx.restore();
      } else {
        diffy = 0.5;
        ctx.save(); // 0 open
        if (this.energy > 0) {
          let glowingeyes = false;
          let glowalpha = 0;
          // Eyes glow when firefly is nearby (including cats in adoption boxes)
          if (this.closestFirefly) {
            let diffx = Math.abs(this.x - this.closestFirefly.x);
            let diffy = Math.abs(this.y - this.closestFirefly.y);
            if (diffx <= 100 && diffy <= 100) {
              glowingeyes = true;
              let absolute = Math.sqrt((diffy * diffy) + (diffx * diffx)); // 0 to 100
              glowalpha = 0.6 * (1 - (absolute / (Math.sqrt(20000))));
            }
          }
          // REAL DRAWING
          // left eye
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 4;
          ctx.translate(-(this.size * this.eyePosX * 0.3) - this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
          ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          if (glowingeyes) {
            ctx.globalAlpha = 1 - glowalpha;
          }
          // eye colour
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour;
          } else {
            ctx.strokeStyle = albinoRed;
          }
          ctx.beginPath();
          ctx.arc(0, 0, (this.size / 2.25) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();
          // draw highlights
          ctx.beginPath();
          ctx.fillStyle = trueWhite;
          ctx.rotate(-this.rotation);
          ctx.arc(0, -this.size / 7, this.size / 6, 0, 2 * Math.PI);
          ctx.arc(-this.size / 7, this.size / 5, this.size / 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.rotate(this.rotation);
          // glowing at night
          if (glowingeyes && this.closestFirefly) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * this.eyeSize);
            glow.addColorStop(0, this.closestFirefly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.globalAlpha = glowalpha / 2;
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * this.eyeSize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = trueWhite;
            ctx.globalAlpha = glowalpha / 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 0.6 * ((this.size / 2) + (this.eyeSize * this.size / 6)), 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.restore(); // 0 closed
          // right eye
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 4;
          ctx.save(); // 0 open
          ctx.translate((this.size * this.eyePosX * 0.3) + this.size / 1.5, - (this.size / 2) + (this.eyePosY * this.size * 0.75));
          ctx.arc(0, 0, (this.size / 2) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          // eye colour
          if (glowingeyes) {
            ctx.globalAlpha = (1 - glowalpha);
          }
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour2;
          } else {
            ctx.strokeStyle = albinoRed;
          }
          ctx.beginPath();
          ctx.arc(0, 0, (this.size / 2.25) + (this.eyeSize * this.size / 6), 0, 2 * Math.PI);
          ctx.stroke();

          // draw highlights
          ctx.beginPath();
          ctx.fillStyle = trueWhite;
          ctx.rotate(-this.rotation);
          ctx.arc(0, -this.size / 7, this.size / 6, 0, 2 * Math.PI);
          ctx.arc(this.size / 6, this.size / 5, this.size / 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.rotate(this.rotation);

          // glowing at night
          if (glowingeyes && this.closestFirefly) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
            glow.addColorStop(0, this.closestFirefly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.globalAlpha = glowalpha / 4;
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = trueWhite;
            ctx.globalAlpha = glowalpha / 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 0.6 * ((this.size / 2) + (this.eyeSize * this.size / 6)), 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        ctx.restore(); // 0 closed
      }
    }

    // chin
    if (this.awake && this.facingForwards) {
      // drawing chin / lower jaw
      let chinSize = (this.size / 3.5);
      let chinPosX = 0;
      let chinPosY = (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5;
      // for opening and closing: mouth
      let mouthInnerSize = chinSize / 1.5;
      // this controls how open/closed the mouth is
      // 0.75 is the bare minimum for drawing
      let offsetY = this.openMouthProgress * (0.75 + (2 * this.mawSize * chinSize));

      // cellshading chin
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, (this.size * (this.nosePos - 0.5) / 2) + this.size / 1.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // setting up colours:
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = skinPink;
      } else {
        ctx.fillStyle = this.getBodypartColor(11, this.hairless);
      }
      // drawing chin
      ctx.beginPath();
      ctx.arc(chinPosX, chinPosY + offsetY, chinSize, 0, 2 * Math.PI);
      // chin pattern
      ctx.fill();
      if (!this.albino && this.pattern !== 0 && this.pattern !== 3) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(chinPosX, chinPosY, chinSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // drawing inside of mouth
      // // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.rect(chinPosX - mouthInnerSize - this.cellShadeThickness, chinPosY - chinSize, (mouthInnerSize * 2) + this.cellShadeThickness, offsetY + mouthInnerSize);
      ctx.arc(0, chinPosY - chinSize + offsetY + mouthInnerSize, mouthInnerSize + this.cellShadeThickness, 0, Math.PI, false)      // semi circle
      ctx.fill();

      // fill inside of mouth
      ctx.fillStyle = skinPink; // it's always pink
      ctx.beginPath();
      ctx.rect(chinPosX - mouthInnerSize, chinPosY - chinSize, mouthInnerSize * 2, offsetY + mouthInnerSize);
      ctx.arc(0, chinPosY - chinSize + offsetY + mouthInnerSize, mouthInnerSize, 0, Math.PI, false)      // semi circle
      ctx.fill();

      // fangs
      // cellshading
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = this.size / 10;
      // real drawing
      ctx.fillStyle = trueWhite;
      ctx.beginPath();
      ctx.moveTo(-this.size / 5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.lineTo(-this.size / 4, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45) + (this.size * (this.fangs) / 2));
      ctx.lineTo(-this.size / 2.5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.moveTo(+this.size / 5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.lineTo(+this.size / 4, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45) + (this.size * (this.fangs) / 2));
      ctx.lineTo(+this.size / 2.5, (this.size * (this.nosePos - 0.5) / 2) + (this.size / 1.45));
      ctx.stroke();
      ctx.fill();

      // jowls
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, (this.size / 3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();

      // real drawing
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = nosePink;
      } else {
        ctx.fillStyle = this.getBodypartColor(9, this.hairless);
      }
      ctx.beginPath();
      ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albino && this.pattern !== 0 && this.pattern !== 3) {
        this.applyPatternOverlay(pat, () => {
          ctx.beginPath();
          ctx.arc(-(this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
      ctx.fillStyle = trueWhite;
      if (this.lykoi) {
        ctx.fillStyle = nosePink;
      } else {
        ctx.fillStyle = this.getBodypartColor(10, this.hairless);
      }
      ctx.beginPath();
      ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (!this.albino && this.pattern !== 0 && this.pattern !== 3) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc((this.size / 4), (this.size * (this.nosePos - 0.5) / 2) + this.size / 2.5, this.size / 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // === T-SHAPED NOSE (uses nose-specific colors, not skin colors) ===
      let noseY = (this.size * (this.nosePos - 0.5) / 2) + (this.size / 2.5);
      let noseWidth = this.size / 1.75;
      let noseHeight = this.size / 4;
      let noseVertWidth = this.size / 6;
      let noseVertHeight = this.size / 2.5;

      // Draw T-shaped nose outline (cellshading)
      ctx.lineWidth = this.cellShadeThickness;
      ctx.strokeStyle = this.cellShadeLine;
      // Draw T-shaped nose fill using nose-specific color
      ctx.fillStyle = this.noseColour;
      ctx.beginPath();
      // Top horizontal bar of T
      ctx.rect(-noseWidth / 2, noseY - noseHeight, noseWidth, noseHeight);
      // Vertical bar of T
      ctx.rect(-noseVertWidth / 2, noseY - noseHeight, noseVertWidth, noseVertHeight);
      ctx.stroke();
      ctx.fill();
    }
  };

  this.drawFrontFeet = function (pat) {
    let footSize = this.size / 3.5 * this.thickness * 2.25;
    let leftHandGradient = this.createFootGradient(0, footSize);
    let rightHandGradient = this.createFootGradient(1, footSize);
    ctx.lineWidth = 2 * this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;

    // if we are awake on a floor
    if (this.awake && this.onSurface) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // REAL DRAWING
      ctx.fillStyle = leftHandGradient;
      ctx.beginPath();
      ctx.arc(-(this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = rightHandGradient;
      ctx.beginPath();
      ctx.arc((this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      if (!this.albino && this.pattern !== 0) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
        ctx.arc((this.size / 1.6), (this.size) + (this.limbLength / 2.5), footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    } else if (!this.awake || !this.onSurface) {
      // if we are holding something
      if (this.focus && this.awake && this.hitFocus) {
        ctx.fillStyle = leftHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = rightHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        this.applyPatternOverlay(pat, () => {
          ctx.beginPath();
          ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
          ctx.fill();
        });
        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        // REAL DRAWING
        // left front foot
        ctx.fillStyle = leftHandGradient;
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        this.applyPatternOverlay(pat, () => {
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
        });
        // jelly beans / toe pads
        if (this.focus && this.facingForwards && this.y > this.focus.y) {
          ctx.save();
          // Position toe pads relative to the foot
          if (this.inCatBox) {
            ctx.translate(0, (footSize / 2) + this.limbLength);
          } else {
            ctx.translate(this.limbLength * Math.cos(this.angleToFocus), (footSize / 2) + (this.limbLength * Math.sin(this.angleToFocus)));
          }
          // uniformly scale the pads so that it looks like the feet are reaching towards the focus
          let scaleY = 1;
          if (this.y - (this.size * 10) < this.focus.y) {
            scaleY = (this.y - this.focus.y) / this.size / 10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize / 10, footSize / 1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore(); // closed
        // right front foot
        ctx.fillStyle = rightHandGradient;
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        this.applyPatternOverlay(pat, () => {
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
        });
        // jelly beans
        if (this.focus && this.facingForwards && this.y > this.focus.y) {
          ctx.save();
          // Position toe pads relative to the foot
          if (this.inCatBox) {
            ctx.translate(0, (footSize / 2) + this.limbLength);
          } else {
            ctx.translate(this.limbLength * Math.cos(this.angleToFocus), (footSize / 2) + (this.limbLength * Math.sin(this.angleToFocus)));
          }
          // uniformly scale the pads
          let scaleY = 1;
          if (this.y - (this.size * 10) < this.focus.y) {
            scaleY = (this.y - this.focus.y) / this.size / 10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size / 10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize / 2, -(footSize), footSize / 3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize / 10, footSize / 1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore(); // closed
      }
    }
  };

  // front legs
  this.drawFrontLegs = function (bodyGradient, pat) {
    ctx.globalAlpha = 1;
    let footSize = this.size / 3.5 * this.thickness * 2.25;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = (this.size / 2.5) * this.thickness * 2; // linewidth for drawing legs
    ctx.lineWidth += this.cellShadeThickness; // + cellshading thickness
    // if we are awake on a floor
    if (this.awake && this.onSurface && this.sittingProgress < 1) {
      // Shrink front legs from top as cat sits - bottom stays in place
      let frontLegBottom = this.limbLength - footSize / 2;
      let frontLegTop = (this.size / 4);
      let shrunkLegEnd = frontLegTop + (frontLegBottom - frontLegTop) * (1 - this.sittingProgress);
      // translate
      ctx.save();
      ctx.translate(this.x, this.y);
      // Set up gradients
      let leftFrontLegGradient, rightFrontLegGradient;
      if (this.albino) {
        leftFrontLegGradient = trueWhite;
        rightFrontLegGradient = trueWhite;
      } else {
        let gradientTotalLengthY = (this.size / 4) + shrunkLegEnd;
        leftFrontLegGradient = ctx.createLinearGradient(0, this.size / 4, 0, gradientTotalLengthY);
        this.applyBodypartGradient(0, leftFrontLegGradient);
        rightFrontLegGradient = ctx.createLinearGradient(0, this.size / 4, 0, gradientTotalLengthY);
        this.applyBodypartGradient(1, rightFrontLegGradient);
      }

      // Draw both legs using helper
      this.drawSingleFrontLeg(-this.size * 2 / 3, this.size / 4, shrunkLegEnd, leftFrontLegGradient, 0, pat);
      this.drawSingleFrontLeg(this.size * 2 / 3, this.size / 4, shrunkLegEnd, rightFrontLegGradient, 1, pat);
      // pattern
      this.applyPatternOverlay(pat, () => {
        ctx.strokeStyle = pat;
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.lineTo(-this.size * 2 / 3, this.limbLength - footSize / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.lineTo(this.size * 2 / 3, this.limbLength - footSize / 2);
        ctx.stroke();
      });
      ctx.restore();
    } else if (!this.awake || !this.onSurface) {
      // if we are holding something
      if (this.focus && this.awake && this.hitFocus) {
        // Set up gradients for reaching legs
        let ox = -this.size * 2 / 3; // origin L
        let ox2 = this.size * 2 / 3;
        let oy = this.size / 4;
        let tx = this.focus.x; // target
        let ty = this.focus.y;
        let leftFrontLegGradient, rightFrontLegGradient;
        if (this.albino) {
          leftFrontLegGradient = trueWhite;
          rightFrontLegGradient = trueWhite;
        } else {
          leftFrontLegGradient = ctx.createLinearGradient(ox, oy, tx, ty);
          this.applyBodypartGradient(0, leftFrontLegGradient);
          rightFrontLegGradient = ctx.createLinearGradient(ox2, oy, tx, ty);
          this.applyBodypartGradient(1, rightFrontLegGradient);
        }

        // Draw both reaching legs using helper
        this.drawReachingFrontLeg(ox, oy, tx, ty, leftFrontLegGradient, 0, pat);
        this.drawReachingFrontLeg(ox2, oy, tx, ty, rightFrontLegGradient, 1, pat);
        this.applyPatternOverlay(pat, () => {
          ctx.strokeStyle = pat;
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
        });

        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        ctx.lineWidth -= this.cellShadeThickness;

        // set up gradients for fill
        let x1 = 0;
        let y1 = this.size / 4;
        let x2 = this.limbLength * Math.cos(this.angleToFocus);
        let y2 = this.limbLength * Math.sin(this.angleToFocus);
        let leftFrontLegGradient, rightFrontLegGradient;
        if (this.albino) {
          leftFrontLegGradient = trueWhite;
          rightFrontLegGradient = trueWhite;
        } else {
          leftFrontLegGradient = ctx.createLinearGradient(x1, y1, x2, y2);
          this.applyBodypartGradient(0, leftFrontLegGradient);
          rightFrontLegGradient = ctx.createLinearGradient(x1, y1, x2, y2);
          this.applyBodypartGradient(1, rightFrontLegGradient);
        }
        // DRAWING NOW
        // left arm
        ctx.strokeStyle = leftFrontLegGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.strokeStyle = rightFrontLegGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size * 2 / 3, (this.size / 4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        this.applyPatternOverlay(pat, () => {
          ctx.strokeStyle = pat;
          // left arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x - this.size + (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
          // right arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size * 2 / 3, (this.size / 4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x + this.size - (this.size / 3), this.y + (this.size / 1.5) - (footSize / 2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
        });
      }
    }
  };

  this.update = function () {
    // continue eating no matter what
    if (this.inCatBox == null && this.eatingChewsRemaining > 0) {
      this.continueEating();
    }
    // Game logic for chitten AI and behavior
    // Physics are handled in window.js main game loop
  };
  this.render = function () {

    /* focus lines for debug*/
    // if (this.focus !== null) {
    //   ctx.strokeStyle = trueWhite;
    //   ctx.lineWidth = 1;
    //   ctx.beginPath();
    //   ctx.moveTo(this.x, this.y);
    //   ctx.lineTo(this.focus.x, this.focus.y);
    //   ctx.stroke();
    // }

    // update which firefly is the closest for drawing eye glow
    let closestFireflyIndex = this.findClosestFireFlyForEyes();
    if (closestFireflyIndex !== 'X' && closestFireflyIndex < fireflies.length) {
      this.closestFirefly = fireflies[closestFireflyIndex];
    } else {
      this.closestFirefly = null;
    }

    ctx.save();
    let pat = pat0;
    if (this.pattern == 1) {
      pat = pat1;
    } else if (this.pattern == 2) {
      pat = pat2;
    } else if (this.pattern == 3) {
      pat = pat3;
    } else if (this.pattern == 6) {
      pat = pat6;
    } else if (this.pattern == 7) {
      pat = pat7;
    }
    ctx.setTransform(100 / this.size, 0, 0, 100 / this.size, 0, 0);
    ctx.restore();
    /* new gradient opps */
    ctx.save();
    ctx.translate(this.x, this.y);
    let bodyGradient = trueWhite;
    // Hairless
    if (this.hairless) {
      if (this.bodypartCode[5] == 0) {
        bodyGradient = this.skinColour1;
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient = this.skinColour2;
      } else {
        bodyGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.hairless) {
      let s = this.size * 6;
      let maxWidth = Math.sqrt(s * s + s * s) / 2;
      bodyGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1] * 6) * maxWidth, // start pos
        + Math.sin(this.coatMod[1] * 6) * maxWidth,
        - Math.cos(this.coatMod[1] * 6) * maxWidth, // end pos
        - Math.sin(this.coatMod[1] * 6) * maxWidth
      );
      if (this.bodypartCode[5] == 0) {
        bodyGradient.addColorStop(0, this.secondColour);
        bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
        bodyGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient.addColorStop(0, this.thirdColour);
        bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
        bodyGradient.addColorStop(1, this.secondColour);
      } else {
        bodyGradient.addColorStop(0, this.firstColour);
        bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
        bodyGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.hairless) {
      bodyGradient = nosePink;
    }
    ctx.restore();

    this.hitFocus = this.focus ? detectCollision(this, this.focus) : false;
    let backendShiftX = this.size * this.speedX / 30;
    let backendShiftY = this.size * this.speedY / 30;
    if (backendShiftY > trueBottom - this.y) {
      backendShiftY = trueBottom - this.y;
    }
    if (this.awake && !this.onSurface && this.hitFocus) {
      backendShiftY = -this.size / 4;
    }
    // calculate angle to focus
    if (this.focus) {
      this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
      diffx = Math.cos(this.angleToFocus) * 4;
      diffy = Math.sin(this.angleToFocus) * 4;
    } else {
      // For cats without focus (like those in catboxes), use a neutral downward angle
      this.angleToFocus = Math.PI / 2;
      diffx = 0;
      diffy = 0;
    }
    // setting leg angle
    let sameDirection = false;
    let offsetX = this.focus ? Math.abs(this.focus.x - this.x) : 0;
    let legAngle = Math.atan2(this.speedY, this.speedX);
    // if a kitten collides with tis mother
    if (this.age < maturesAt && this.inCatBox == null && this.awake
      && this.mother !== null && this.onSurface && this.mother.snuggling == -1 && detectMotherCollision(this, this.mother)) {
      this.speedX = 0;
      this.speedY = 0;
      if (this.mother.awake && this.eatingChewsRemaining == 0 && this.health < 50) {
        this.mother.resetJumpCoolDown();
        this.mother.energy -= 5;
        this.mother.love += 5;
        this.mother.speedX = 0;
        this.mother.speedY = 0;
        this.mother.sitting = true;
        this.eatingChewsRemaining = eatingTotalChews; // Start suckling
        this.eatingChewTimer = 0;
        this.eatingChewState = 'closed'; // Start with mouth closed
        this.mother.facingForwards = true;
        // sendMessage(this.mother.name + ' fed '+ this.name);
        gainMeter(this);
      }
    }
    for (let f = 0; f < fireflies.length; f++) {
      if (this.inCatBox == null && this.focus == fireflies[f] && !this.onSurface && !fireflies[f].touchedThisFrame
        && this.awake && this.energy > 0 && this.snuggling == -1 && this.eatingChewsRemaining == 0 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        fireflies[f].chooseNewTarget(); // Force firefly to choose new target when touched
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX * this.size) / 1500;
        fireflies[f].speedY += (this.speedY * this.size) / 2000;// + (0.002 * this.size);
        gainMeter(this);
        this.facingForwards = true;
        if (this.health >= 100 && this.love >= 100 && this.energy >= 100) {
          // let go of the FireFly
          this.speedY = -this.size * 2;
        } else {
          let thisMiddleX = this.x;
          let thisMiddleY = this.y;
          let otherMiddleX = this.focus.x;
          let otherMiddleY = this.focus.y;
          let diffx = otherMiddleX - thisMiddleX;
          let diffy = otherMiddleY - thisMiddleY;

          if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
            // if we are going right and it's to our right
            // if we are going left and it's to our left
          } else {
            this.speedX *= 0.1;
          }
          if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
            // if we are going up and it's above
            // if we are going down and it's below
          } else {
            this.speedY *= 0.1;
          }
          let targetangle = Math.atan2(otherMiddleY - thisMiddleY, otherMiddleX - thisMiddleX);
          this.speedX += Math.cos(targetangle);
          this.speedY += Math.sin(targetangle);
          if (this.speedX < 10 && this.speedX > -10 && this.speedY < 10 & this.speedY > -10) {
            // legAngle = -1.6;
          }
        }
      }
    }
    legAngle = this.focus ? Math.atan2(this.focus.y - this.y, offsetX) : Math.atan2(this.speedY, this.speedX);
    if (legAngle < -0.2) {
      sameDirection = true;
    }

    // Preparing to draw the chitten
    ctx = myGameArea.context;
    ctx.globalAlpha = 1;
    let sleepshift = 0;
    if (!this.awake) {
      sleepshift = this.limbLength;
    }
    if (this.facingForwards) {
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
    }
    // translate before drawing again
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);
    if (this.facingForwards) {
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }
    if (this.onSurface && this.sittingProgress > 0) {
      ctx.translate(0, ((this.limbLength + (this.size / 4)) / 2) * this.sittingProgress);
    }
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
    }
    if (this.facingForwards) {
      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.translate(-this.x, -this.y);
    if (!this.facingForwards) {
      this.drawFrontFeet(pat);
    }
    this.drawFrontLegs(bodyGradient, pat);
    // move a bit before drawing head parts
    ctx.translate(this.x, this.y - (this.size / 2));
    if (this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.rotate(this.rotation);
    this.drawHead(pat, sleepshift);
    ctx.rotate(-this.rotation);
    if (!this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    if (!this.facingForwards) {
      ctx.translate(-this.x, -this.y);
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
      ctx.translate(this.x, this.y);
      bodyGradient = trueWhite;
      // sphynx
      if (this.hairless) {
        if (this.bodypartCode[5] == 0) {
          bodyGradient = this.skinColour1;
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient = this.skinColour2;
        } else {
          bodyGradient = this.skinColour3;
        }
      }
      if (!this.albino && !this.hairless) {
        let s = this.size * 6;
        let maxWidth = Math.sqrt(s * s + s * s) / 2;
        bodyGradient = ctx.createLinearGradient(
          + Math.cos(this.coatMod[1] * 6) * maxWidth, // start pos
          + Math.sin(this.coatMod[1] * 6) * maxWidth,
          - Math.cos(this.coatMod[1] * 6) * maxWidth, // end pos
          - Math.sin(this.coatMod[1] * 6) * maxWidth
        );
        if (this.bodypartCode[5] == 0) {
          bodyGradient.addColorStop(0, this.secondColour);
          bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
          bodyGradient.addColorStop(1, this.firstColour);
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient.addColorStop(0, this.thirdColour);
          bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
          bodyGradient.addColorStop(1, this.secondColour);
        } else {
          bodyGradient.addColorStop(0, this.firstColour);
          bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
          bodyGradient.addColorStop(1, this.thirdColour);
        }
      } else if (this.albino && this.hairless) {
        bodyGradient = skinPink;
      }

      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }

    ctx.restore(); // close
    if (this.facingForwards) {
      this.drawFrontFeet(pat);
    }

    this.drawIcons();
    ctx.globalAlpha = 1;

  };

  // Initialize mass and other size-dependent properties
  this.reinitSizeAndColour();
}

function updateMatesCache() {
  availableMates = [];
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].snuggling == -1 && chittens[i].partner == null && chittens[i].awake && !chittens[i].elder &&
      chittens[i].gender == 'Female' && chittens[i].age >= maturesAt &&
      chittens[i].health >= breedingHealthReq && chittens[i].energy >= breedingEnergyReq && chittens[i].love >= breedingLoveReq) {
      availableMates.push(chittens[i]);
    }
  }
}


// Helper function to safely remove temporary chittens while preserving endless mode chittens
function removeTemporaryChittens(keepSelection = false) {
  // Work backwards to avoid index shifting issues
  for (let i = chittens.length - 1; i >= currentChittens; i--) {
    const chitten = chittens[i];

    // Skip if this is the selected chitten and we want to keep it
    if (keepSelection && chitten === selection) {
      continue;
    }

    // Skip if this chitten is NOT in a catbox (endless mode chittens are adopted and free)
    if (chitten.inCatBox === null) {
      continue;
    }

    // Remove temporary chitten (those in catboxes)
    chittens.splice(i, 1);
  }
}

function initChoiceBoxes() {
  choosingChitten = true;
  currentChittens = chittens.length;
  boxes = [];
  // drop any held chittens when we init the boxes
  if (selection !== null && selection.beingHeld) {
    selection.beingHeld = false;
  }
  selection = null;
}

// function to adopt a specified chitten
function adoptChitten(who) {
  who.onSurface = false;
  who.love = 100;
  addSpeech(who, neutralWord());
  who.sitting = false;
  createGlyphs(who.x, who.y, unicodeHeart, 1);
  seeds.push(new Seed(randomColourFruity(), who));
  seeds[seeds.length - 1].timer = 750;
  who.inCatBox = null;
  // Update mates cache so new chittens can find partners immediately
  updateMatesCache();
}

function initLitter(mParent, fParent) {
  parentBoxes = [];
  parentBoxes.push(new CatBox((canvasWidth / 2) - (boxSize * 3), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2), boxSize, boxThickness));
  parentBoxes.push(new CatBox((canvasWidth / 2) + (boxSize * 2), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) - (boxSize / 2), boxSize, boxThickness));
  fParent.inCatBox = parentBoxes[0];
  mParent.inCatBox = parentBoxes[1];

  // Reset sitting state for parents when moved to boxes
  fParent.sitting = false;
  fParent.sittingProgress = 0;
  fParent.targetSittingState = false;
  fParent.sittingCooldown = 0;
  mParent.sitting = false;
  mParent.sittingProgress = 0;
  mParent.targetSittingState = false;
  mParent.sittingCooldown = 0;

  // Set the parent box IDs to point to the correct chittens
  parentBoxes[0].id = chittens.indexOf(fParent);
  parentBoxes[1].id = chittens.indexOf(mParent);
  fParent.x = parentBoxes[0].x + (boxSize / 2);
  fParent.y = parentBoxes[0].y + (boxSize / 2);
  mParent.x = parentBoxes[1].x + (boxSize / 2);
  mParent.y = parentBoxes[1].y + (boxSize / 2);
  fParent.speedX = 0;
  fParent.speedY = 0;
  mParent.speedX = 0;
  mParent.speedY = 0;
  // Parent cats should not target fireflies during litter selection
  fParent.focus = null;
  mParent.focus = null;
  parentBoxes[0].colour = genderPink;
  parentBoxes[1].colour = genderBlue;
  initChoiceBoxes();
  if (endlessMode) {
    choiceTimer = endlessModeChoiceTimer;
  } else {
    choiceTimer = standardModeChoiceTimer;
  }
  sendMessage(unicodeHeart + ' ' + fParent.name + ' gave birth to ' + mParent.name + '\'s chittens');
  maleParent = mParent;
  femaleParent = fParent;
  litterChoiceUiOn(fParent.name, mParent.name);
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  // random number of chittens (6-9)
  let numberInLitter = Math.round(6 + (Math.random() * 3));
  let count = 0;
  for (let j = 0; j < boxRows; j++) {
    for (let i = 0; i < boxColumns && count < numberInLitter; i++) {
      boxes.push(new CatBox((canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize), (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize), boxSize, boxThickness));
      generateKitten(maleParent, femaleParent, generateChildBreedText(maleParent, femaleParent));
      thisCatBox = (j * 3) + i;
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      chittens[thisCatBox + currentChittens].inCatBox = boxes[thisCatBox];
      chittens[thisCatBox + currentChittens].name = generateBreedBasedName(maleParent.breed, femaleParent.breed, chittens[thisCatBox + currentChittens].gender);
      chittens[thisCatBox + currentChittens].mother = fParent;
      chittens[thisCatBox + currentChittens].size *= 2;
      chittens[thisCatBox + currentChittens].reinitSizeAndColour();
      chittens[thisCatBox + currentChittens].x = (canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize) + (boxSize / 2);
      chittens[thisCatBox + currentChittens].y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize) + (boxSize / 2);
      count++;
      initKitten(chittens[thisCatBox + currentChittens]);
      // setting the box colour
      if (chittens[thisCatBox + currentChittens].gender == 'Female') {
        boxes[thisCatBox].colour = genderPink;
      } else if (chittens[thisCatBox + currentChittens].gender == 'Male') {
        boxes[thisCatBox].colour = genderBlue;
      } else {
        boxes[thisCatBox].colour = genderPurple;
      }
      // don't mutate the pick of the litter, or the runt
      if (thisCatBox !== 0 && thisCatBox !== boxes.length - 1) {
        mutate(chittens[thisCatBox + currentChittens]);
        determineTraitExpression(chittens[thisCatBox + currentChittens], true, maleParent, femaleParent);
      }
    }
  }
  // Pick of litter
  chittens[currentChittens].size *= 1.2;
  chittens[currentChittens].reinitSizeAndColour();
  boxes[0].text = 'Pick';
  // Runt of litter
  chittens[chittens.length - 1].size *= 0.85;
  chittens[chittens.length - 1].maxSize *= 0.85;
  chittens[chittens.length - 1].health *= 0.85;
  chittens[chittens.length - 1].firstColour = mixTwoColours(chittens[chittens.length - 1].firstColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  chittens[chittens.length - 1].secondColour = mixTwoColours(chittens[chittens.length - 1].secondColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  chittens[chittens.length - 1].thirdColour = mixTwoColours(chittens[chittens.length - 1].thirdColour, randomColourRealistic(Math.random()), 1 - (Math.random() * 0.15));
  boxes[boxes.length - 1].text = 'Runt';
  chittens[chittens.length - 1].reinitSizeAndColour();
}

// Main adoption cat generator based on filter
function generateAdoptionCat(who, breedFilter) {
  if (breedFilter === mixedBreed) {
    // Mixed filter: 50% mixed, 50% crossbreed
    if (Math.random() < 0.5) {
      randomiseGeneticsBase(who, false, null); // Pure mixed
    } else {
      generateCrossbreed(who); // Crossbreed
    }
  } else if (breedFilter !== 'All') {
    // Specific breed filter: 100% that purebred
    randomiseGeneticsBase(who, true, breedFilter);
  } else {
    // All/Unfiltered filter: 40% purebred, 30% mixed, 30% crossbreed
    let rand = Math.random();
    if (rand < 0.4) {
      randomiseGeneticsBase(who, true, null); // Random purebred
    } else if (rand < 0.7) {
      randomiseGeneticsBase(who, false, null); // Pure mixed
    } else {
      generateCrossbreed(who); // Crossbreed
    }
  }
}

// Legacy wrapper function for backward compatibility (used only by experimental kittens in devmode)
function randomiseGenetics(who) {
  randomiseGeneticsBase(who, true, null); // Random purebred with mutations
}

// function to generate a random size for a new chitten
function getRandomChittenSize(gender) {
  const scale = ((Math.random() * chittenMinSize) + (chittenMaxSize - chittenMinSize)) * (gender === 'Female' ? 1 / 1.1 : 1);
  return scale;
}

// Function to generate a random max size for a new chitten 
function getRandomChittenMaxSize(gender) {
  const scale = ((Math.random() * chittenBaseSize) + chittenSizeVariation) * (gender === 'Female' ? 1 / 1.1 : 1);
  return scale;
}

function initCattery(gender) {
  adoptionCentreUiOn(gender);
  initChoiceBoxes();
  if (gender === 'Female') {
    chosenChittenF = false;
  } else {
    chosenChittenM = false;
  }

  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      const x = (canvasWidth / 2) - (((boxSize * 3) + (boxPadding * 2)) / 2) + (i * boxPadding) + (i * boxSize);
      const y = (trueBottom / 2) - ((boxColumns * (boxSize + boxPadding)) / 2) + (j * boxPadding) + (j * boxSize);

      boxes.push(new CatBox(x, y, boxSize, boxThickness));

      // Gender-specific size scaling
      const currentSize = getRandomChittenSize(gender);
      const maximumSize = getRandomChittenMaxSize(gender);

      chittens.push(new Chitten(x + (boxSize / 2), y + (boxSize / 2), currentSize, maximumSize, gender));

      thisCatBox = (i * 3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChittens;
      boxes[thisCatBox].colour = (gender === 'Female' ? genderPink : genderBlue);

      // Set the cat's catbox reference BEFORE generating adoption cat
      chittens[thisCatBox + currentChittens].inCatBox = boxes[thisCatBox];

      // Generate adoption cat based on breed filter
      generateAdoptionCat(chittens[thisCatBox + currentChittens], selectedBreedFilter);

      const chit = chittens[thisCatBox + currentChittens];
      chit.speedX = 0;
      chit.speedY = 0;
      chit.awake = false;

      generateBreedAppropiateName(chit);
    }
  }
}

function initFemaleCattery() {
  initCattery('Female');
}

function initMaleCattery() {
  initCattery('Male');
}

/**
* function to describe a box
*/
function CatBox(x, y, size, thickness) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.thickness = thickness;
  this.selected = false;
  this.highlighted = false;
  this.id = 0;
  this.text = '';
  this.colour = trueBlack;
  this.update = function () {
    ctx.globalAlpha = 1;
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.text, this.x + 5, this.y + 15);
    ctx.lineWidth = this.thickness;
    ctx.save();
    if (!this.selected) {
      ctx.globalAlpha = 0.5;
    }
    if (this.highlighted || this.selected) {
      ctx.strokeStyle = mixTwoColours(this.colour, trueWhite, 0.5);
    } else {
      ctx.strokeStyle = this.colour;
    }
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  };
  // function to check if we have hit the edge of the catbox
  this.checkBounce = function (who) {
    if (who.inCatBox == this) {
      // if we bounce off a side wall
      if (who.x < this.x + who.size || who.x >= this.x + this.size - who.size) {
        who.speedX *= -0.9;
        let targetangle = Math.atan2(who.y, this.y);
        who.spin += elasticity * targetangle / 10;
        if (who.x < this.x + who.size) {
          who.x = this.x + who.size;
        } else {
          who.x = this.x + this.size - who.size;
        }
      }
      if (who.y < this.y + who.size) {
        who.speedY *= -0.99;
        who.y = this.y + who.size;
      }
      if (who.y >= this.y + this.size - (who.size) - (who.limbLength / 2.5)) {
        who.y = this.y + this.size - (who.size) - (who.limbLength / 2.5);
        who.landedOnSurface();
      }
    }
  };
}

/**
 * Draws a tooltip for any chitten at specified coordinates
 * @param {Chitten} chitten - The chitten to show tooltip for
 */
function drawChittenTooltip(chitten) {
  ctx.save();

  // Calculate dynamic tooltip size based on content
  let maxWidth = 200; // Minimum width
  let lineHeight = 15;
  let contentHeight = 20; // Top padding

  // Measure text widths to find max width needed
  ctx.font = 'bold 14px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText(chitten.name).width);

  ctx.font = '12px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText('Breed: ' + chitten.breed).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Age: ' + chitten.age).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Gender: ' + chitten.gender).width);

  // Pre-calculate coat string for width measurement
  let cString = '';
  if (chitten.albino || chitten.sphynx) {
    if (chitten.albino) {
      cString = 'Albino White';
    } else if (chitten.hairless) {
      let c1 = ntc.name(chitten.skinColour1)[1];
      let c2 = ntc.name(chitten.skinColour2)[1];
      let c3 = ntc.name(chitten.skinColour3)[1];
      cString = c1 + ', ' + c2 + ' & ' + c3;
    }
  } else {
    let c1 = ntc.name(chitten.firstColour)[1];
    let c2 = ntc.name(chitten.secondColour)[1];
    let c3 = ntc.name(chitten.thirdColour)[1];
    if (chitten.secondColour == chitten.thirdColour) {
      cString = c1 + ' & ' + c2;
    } else {
      cString = c1 + ', ' + c2 + ' & ' + c3;
    }
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Coat: ' + cString).width);

  // Pre-calculate eye string for width measurement
  let eString = '';
  if (chitten.eyeColour == chitten.eyeColour2 && !chitten.albino) {
    eString = ntc.name(chitten.eyeColour)[1];
  } else if (chitten.albino) {
    eString = 'Pink';
  } else {
    let color1Name = ntc.name(chitten.eyeColour)[1];
    let color2Name = ntc.name(chitten.eyeColour2)[1];
    eString = 'Heterochromic ' + color1Name + ' & ' + color2Name;
  }
  maxWidth = Math.max(maxWidth, ctx.measureText('Eyes: ' + eString).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Size: ' + Math.round(chitten.maxSize)).width);

  ctx.font = 'bold 11px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText('GENETICS').width);

  // Gene strings with unicode symbols
  let ag = chitten.albinoGene ? unicodeTick : unicodeCross;
  let ae = chitten.albino ? unicodeTick : unicodeCross;
  let hg = chitten.hairlessGene ? unicodeTick : unicodeCross;
  let he = chitten.hairless ? unicodeTick : unicodeCross;
  let lg = chitten.lykoiGene ? unicodeTick : unicodeCross;
  let le = chitten.lykoi ? unicodeTick : unicodeCross;
  let htg = chitten.heterochromicGene ? unicodeTick : unicodeCross;
  let hte = (chitten.eyeColour !== chitten.eyeColour2) ? unicodeTick : unicodeCross;
  let cg = chitten.colourpointGene ? unicodeTick : unicodeCross;
  let ce = chitten.colourpointExpressed ? unicodeTick : unicodeCross;

  ctx.font = '10px ' + globalFont;
  maxWidth = Math.max(maxWidth, ctx.measureText('Albino Gene: ' + ag + ' Expressed: ' + ae).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Hairless Gene: ' + hg + ' Expressed: ' + he).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Lykoi Gene: ' + lg + ' Expressed: ' + le).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Heterochromic Gene: ' + htg + ' Expressed: ' + hte).width);
  maxWidth = Math.max(maxWidth, ctx.measureText('Colorpoint Gene: ' + cg + ' Expressed: ' + ce).width);

  contentHeight = 20 + (lineHeight * 12); // 12 lines + GENETICS spacing

  const tooltipWidth = maxWidth + 20; // Add padding
  const tooltipHeight = contentHeight;

  // Position tooltip near mouse
  let tooltipX, tooltipY;
  tooltipX = pointerPos.x + 15; // Offset from mouse
  tooltipY = pointerPos.y - tooltipHeight - 15; // Above mouse
  // Keep tooltip on screen
  if (tooltipX + tooltipWidth > canvasWidth) tooltipX = canvasWidth - tooltipWidth - 10;
  if (tooltipY < 0) tooltipY = pointerPos.y + 15; // Below mouse if no room above
  if (tooltipX < 0) tooltipX = 10;

  // Draw tooltip background with border
  ctx.fillStyle = trueBlack;
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  // Header with cat name
  ctx.fillStyle = trueWhite;
  ctx.font = 'bold 14px ' + globalFont;
  ctx.fillText(chitten.name, tooltipX + 10, tooltipY + 20);

  // Gender symbol in top right with color coding
  let genderSymbol = unicodeNonBinary;
  let genderColor = genderPurple;
  if (chitten.gender == 'Male') {
    genderSymbol = unicodeMale;
    genderColor = genderBlue;
  } else if (chitten.gender == 'Female') {
    genderSymbol = unicodeFemale;
    genderColor = genderPink;
  }

  ctx.fillStyle = genderColor;
  ctx.font = 'bold 18px ' + globalFont;
  let genderWidth = ctx.measureText(genderSymbol).width;
  ctx.fillText(genderSymbol, tooltipX + tooltipWidth - genderWidth - 10, tooltipY + 20);

  // Basic info with smaller font (moved up one line)
  ctx.font = '12px ' + globalFont;
  ctx.fillStyle = trueWhite;
  ctx.fillText('Breed: ' + chitten.breed, tooltipX + 10, tooltipY + 40);
  ctx.fillText('Age: ' + chitten.age, tooltipX + 10, tooltipY + 55);
  ctx.fillText('Coat: ' + cString, tooltipX + 10, tooltipY + 70);
  ctx.fillText('Eyes: ' + eString, tooltipX + 10, tooltipY + 85);
  ctx.fillText('Size: ' + Math.round(chitten.size), tooltipX + 10, tooltipY + 100);

  ctx.font = 'bold 11px ' + globalFont;
  ctx.fillText('GENETICS', tooltipX + 10, tooltipY + 125);

  ctx.font = '10px ' + globalFont;
  ctx.fillText('Albino Gene: ' + ag + ' Expressed: ' + ae, tooltipX + 10, tooltipY + 140);
  ctx.fillText('Hairless Gene: ' + hg + ' Expressed: ' + he, tooltipX + 10, tooltipY + 153);
  ctx.fillText('Lykoi Gene: ' + lg + ' Expressed: ' + le, tooltipX + 10, tooltipY + 166);
  ctx.fillText('Heterochromic Gene: ' + htg + ' Expressed: ' + hte, tooltipX + 10, tooltipY + 179);
  ctx.fillText('Colorpoint Gene: ' + cg + ' Expressed: ' + ce, tooltipX + 10, tooltipY + 192);

  ctx.restore();
}

/**
* function to add health, love and energy to a chitten (for eating etc)
* @param {Chitten} who - the chitten
*/
gainMeter = function (who) {
  if (who.energy < 100) {
    who.energy += 1;
  }
  if (who.love < 100) {
    who.love += 3;
  }
  if (who.health < 100) {
    who.health += 3;
  }
};

/**
* function to remove relationships from a chitten and compensate for death
* @param {Chitten} who - the chitten
*/
removeRelationships = function (who) {
  // remove mother and partner
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].mother == who) {
      chittens[i].mother = null;
    }
    if (chittens[i].partner == who) {
      chittens[i].partner = null;
      // remove any snuggling status
      chittens[i].snuggling = -1;
    }
  }
  // kill fruit that is being consumed
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == who) {
      fruits.splice(i, 1);
      i--;
    }
  }
  // decrease currentchittens if chosing a chitten to compensate for losing this one
  if (choosingChitten) {
    currentChittens--;
    // shift all catbox IDs down by 1
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].id--;
    }
  }
  // make sure this chitten is no longer selected
  if (selection == who) {
    selection = null;
  }
  removeFocusFrom(who);
};

function recalculateChittenNumbers() {
  femaleCount = 0;
  maleCount = 0;
  nonbinaryCount = 0;
  let fertileFemales = 0;
  let fertileMales = 0;
  for (let i = 0; i < chittens.length; i++) {
    const c = chittens[i];
    if (c.inCatBox != null) continue;
    // Count sexes
    if (c.gender === 'Female') femaleCount++;
    else if (c.gender === 'Male') maleCount++;
    else nonbinaryCount++;

    // Fertility check
    if (!c.elder && c.age >= maturesAt) {
      if (c.gender === 'Female') fertileFemales++;
      if (c.gender === 'Male') fertileMales++;
    }
  }
  // Parents in catboxes count as present and fertile
  if (parentBoxes.length === 2) {
    maleCount++;
    femaleCount++;
    fertileMales++;
    fertileFemales++;
  }
  if (endlessMode) {
    if (fertileFemales === 0) spawnRandomChitten('Female');
    if (fertileMales === 0) spawnRandomChitten('Male');
  }
}

// function to spawn a random chitten of a specific gender in endless mode
function spawnRandomChitten(gender) {
  const currentSize = getRandomChittenSize(gender);
  const maximumSize = getRandomChittenMaxSize(gender);
  let offsetX = 0;
  if (gender == 'Male') {
    offsetX = canvasWidth - 20;
  } else if (gender == 'Female') {
    offsetX = 20;
  } else {
    console.warn('Incorrect gender specified in spawnRandomChitten')
  }
  const tempChitten = new Chitten(offsetX, trueBottom - 20, currentSize, maximumSize, gender);
  generateAdoptionCat(tempChitten, 'All');
  chittens.push(tempChitten);
  generateBreedAppropiateName(chittens[chittens.length - 1]);
  // Adoption handling
  sendMessage(chittens[chittens.length - 1].name + ' wandered in');
  adoptChitten(chittens[chittens.length - 1]);
}

// Function to add speech and trigger mouth animation
function addSpeech(chitten, word) {
  // Don't allow speech while eating
  if (chitten.eatingChewsRemaining > 0) {
    return;
  }

  // Check if chitten is already speaking
  for (let i = 0; i < speech.length; i++) {
    if (speech[i].who === chitten && !speech[i].flagged) {
      return; // Don't add new speech if already speaking
    }
  }

  speech.push(new Speak(chitten, word));
  // Trigger mouth opening animation
  chitten.targetMouthOpenState = true;
}