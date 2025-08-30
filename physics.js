// universal physics constants
const gravity = 0.0980665; // constant for gravity
const speedLimit = 100; // maximum X or Y speed
const groundFriction = 0.9; // ground friction coefficient (0.9 means 10% speed loss per frame)
const airResistance = 0.999; // air resistance coefficient (0.999 means 0.001% speed loss per frame)
const dragFactor = 1 - airResistance; // factor

dummypointerPos = new DummyPointer();


/**
* function to describe the pointer, for calculating the speed.
*/
function DummyPointer() {
  this.x = pointerPos.x;
  this.y = pointerPos.y;
  this.lastX = pointerPos.x;
  this.lastY = pointerPos.y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function () {
    this.x = pointerPos.x;
    this.y = pointerPos.y;
    this.speedX = this.lastX - this.x;
    this.speedY = this.lastY - this.y;
    this.lastX = this.x;
    this.lastY = this.y;
  };
}

/**
* function to limit the speed of an object
* @param {object} what - the object
*/
function applySpeedLimit(what) {
  if (isNaN(what.speedX) || isNaN(what.speedY) || isNaN(what.x) || isNaN(what.y)) {
    console.log('2418 error - speed or coordinate is not a number - fixing');
    console.log('x ' + what.x + ' y ' + what.y + ' speedX ' + what.speedX + ' speedY ' + what.speedY);
    // Fix NaN values to prevent rendering glitches
    if (isNaN(what.x)) what.x = canvasWidth / 2;
    if (isNaN(what.y)) what.y = trueBottom / 2;
    if (isNaN(what.speedX)) what.speedX = 0;
    if (isNaN(what.speedY)) what.speedY = 0;
  }
  let thisSpeedLimit = speedLimit * 20 / what.size;
  if (what.speedX > thisSpeedLimit) {
    what.speedX = thisSpeedLimit;
  } else if (what.speedX < -thisSpeedLimit) {
    what.speedX = -thisSpeedLimit;
  }
  if (what.speedY > thisSpeedLimit) {
    what.speedY = thisSpeedLimit;
  } else if (what.speedY < -thisSpeedLimit) {
    what.speedY = -thisSpeedLimit;
  }
  if (what.spin > 1) {
    what.spin = 1;
  } else if (what.spin < -1) {
    what.spin = -1;
  }
}

/**
* function to validate and fix coordinates before rendering
* @param {object} obj - object with x,y coordinates
* @return {boolean} - true if coordinates are valid
*/
function validateCoordinates(obj) {
  let fixed = false;
  if (isNaN(obj.x) || !isFinite(obj.x) || Math.abs(obj.x) > canvasWidth * 10) {
    obj.x = canvasWidth / 2;
    fixed = true;
  }
  if (isNaN(obj.y) || !isFinite(obj.y) || Math.abs(obj.y) > canvasHeight * 10) {
    obj.y = canvasHeight / 2;
    fixed = true;
  }
  if (fixed) {
    console.log('Fixed invalid coordinates for object:', obj);
  }
  return !fixed;
}

/**
* function to check whether an object touched the sides (lol), then bounce if so
* @param {object} what - the object
*/
function checkBounceSides(what) {
  // if we bounce off a side wall
  if (what.x < what.size || what.x >= canvasWidth - what.size) {
    what.speedX *= -0.9;
    let targetangle = Math.atan2(what.y, 0);
    what.spin += elasticity * targetangle / 10;
    if (what.x < what.size) {
      what.x = what.size;
      return true;
    } else {
      what.x = canvasWidth - what.size;
      return true;
    }
  }
};
/**
* function to check whether an object touched the top, then bounce if so
* @param {object} what - the object
*/
function checkBounceTop(what) {
  if (what.y < what.size) {
    what.speedY *= -0.99;
    what.y = what.size;
    return true;
  }
};

/**
* function to check whether an object touched the bottom, then bounce if so
* @param {object} what - the object
*/
function checkBounceBottom(what) {
  if (what.y > trueBottom - what.size) {
    what.speedY *= -0.99;
    what.y = trueBottom - what.size;
    return true;
  }
}
/**
* function to produce an explosion's physics
* @param {int} ex - the x coordinate
* @param {int} ey - the y coordinate
*/
function produceExplosion(ex, ey) {
  // blast all the guys
  for (let i = 0; i < chittens.length; i++) {
    if (chittens[i].awake) {
      let diffx = ex - chittens[i].x;
      let diffy = ey - chittens[i].y;
      // as long as it's not the guy that triggered it
      if (!(diffx == 0 && diffy == 0)) {
        // if the guy is within range;
        let range = 200;
        if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
          chittens[i].love += 25;
          chittens[i].energy -= 50;
          chittens[i].health -= 10;
          diffx /= 5;
          diffy /= 5;
          if (diffx >= 0) {
            chittens[i].speedX -= (100 - Math.abs(diffx)) / 2;
          } else {
            chittens[i].speedX += (100 - Math.abs(diffx)) / 2;
          }
          if (diffy >= 0) {
            chittens[i].speedY -= (100 - Math.abs(diffy)) / 2;
          } else {
            chittens[i].speedY += (100 - Math.abs(diffy)) / 2;
          }
        }
      }
    }
  }
  // now blast the Ghosts
  for (let i = 0; i < ghosts.length; i++) {
    let diffx = ex - ghosts[i].x;
    let diffy = ey - ghosts[i].y;
    // if the Ghost is within range;
    let range = 300;
    if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
      diffx /= range;
      diffy /= range;
      if (diffx >= 0) {
        ghosts[i].speedX -= (1 - diffx);
      } else if (diffx < 0) {
        ghosts[i].speedX += (1 - diffx);
      }
      if (diffy >= 0) {
        ghosts[i].speedY -= (1 - diffy);
      } else if (diffy < 0) {
        ghosts[i].speedY += (1 - diffy);
      }
    }
  }
  // blast the other fireflies
  for (let i = 0; i < fireflies.length; i++) {
    let diffx = ex - fireflies[i].x;
    let diffy = ey - fireflies[i].y;
    // as long as it's not the fly that triggered it
    if (!(diffx == 0 && diffy == 0)) {
      // if the firefly is within range;
      let range = 200;
      if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
        diffx /= range;
        diffy /= range;
        if (diffx >= 0) {
          fireflies[i].speedX -= (diffx) * 10;
        } else if (diffx < 0) {
          fireflies[i].speedX += (diffx) * 10;
        }
        if (diffy >= 0) {
          fireflies[i].speedY -= (diffy) * 10;
        } else if (diffy < 0) {
          fireflies[i].speedY += (diffy) * 10;
        }
      }
    }
  }
}

/**
* function to detect a collision between two circular objects
* @param {Lifeform} thisobj - the first object
* @param {lifeform} otherobj - the second object
* @return {boolean} whether they collided or not
*/
function detectCollision(thisobj, otherobj) {
  let dx = thisobj.x - otherobj.x;
  let dy = thisobj.y - otherobj.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let minDistance = (thisobj.size + otherobj.size) / 2;
  return distance < minDistance;
}

function detectCollisionPointerChitten(chitten) {
  let dx = pointerPos.x - chitten.x;
  let dy = pointerPos.y - chitten.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let minDistance = ((pointerPos.size * 2) + chitten.size) / 2;
  return distance < minDistance;
}

// more forgiving collision detection for kittens trying to touch their mothers
function detectMotherCollision(thisobj, otherobj) {
  let dx = thisobj.x - otherobj.x;
  let dy = thisobj.y - otherobj.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let minDistance = thisobj.size + otherobj.size;
  return distance < minDistance;
}

/**
* function to detect rectangular collision (for UI elements)
* @param {object} point - object with x, y coordinates
* @param {object} rect - object with x, y, size properties
* @return {boolean} whether point is inside rectangle
*/
function detectRectCollision(point, rect) {
  return point.x >= rect.x &&
    point.x <= rect.x + rect.size &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.size;
}

/**
 * function to detect collision between chitten and fruit (accounts for floor positioning)
 * @param {object} chitten - the chitten object
 * @param {object} fruit - the fruit object
 * @return {boolean} whether chitten can eat the fruit
 */
function detectFruitCollision(chitten, fruit) {
  // If fruit is in a tree and the chitten is airborne (not settled), use standard circular collision
  if (!fruit.onSurface && !chitten.onSurface) {
    return detectCollision(chitten, fruit);
  }

  // For fruits on surfaces (floor or tree branches), use vertical range detection
  let dx = Math.abs(chitten.x - fruit.x);
  let dy = chitten.y - fruit.y; // Vertical distance (fruit should be below chitten)
  let horizontalRange = chitten.size + fruit.size;
  let verticalRange = chitten.size + chitten.frontLegLength;

  let horizontalOK = dx < horizontalRange;
  let verticalOK = dy > -verticalRange && dy < verticalRange;
  let result = horizontalOK && verticalOK;
  // Chitten can eat fruit if horizontally close and fruit is at their feet/surface level
  return result;
}

/**
* function to collide two objects using physics
* @param {object} obj1 - the first object
* @param {object} obj2 - the second object
*/
function collide(obj1, obj2) {
  // calculate distance once and reuse
  let distX = obj1.x - obj2.x;
  let distY = obj1.y - obj2.y;
  let d = Math.sqrt(distX * distX + distY * distY);

  // prevent division by zero
  if (d === 0) return;

  let nx = distX / d;
  let ny = distY / d;

  // Use mass for chittens if available, otherwise fall back to size for other objects
  let mass1 = obj1.mass !== undefined ? obj1.mass : obj1.size;
  let mass2 = obj2.mass !== undefined ? obj2.mass : obj2.size;

  // Prevent zero mass
  if (mass1 === 0) mass1 = obj1.size;
  if (mass2 === 0) mass2 = obj2.size;

  let p = 2 * (obj1.speedX * nx + obj1.speedY * ny - obj2.speedX * nx - obj2.speedY * ny) / (mass1 + mass2);

  // separate overlapping objects (still use size for collision detection)
  let overlap = (obj1.size + obj2.size) / 2 - d;
  if (overlap > 0) {
    // Separate based on mass ratio - heavier objects move less
    let totalMass = mass1 + mass2;
    let separation1 = overlap * (mass2 / totalMass);
    let separation2 = overlap * (mass1 / totalMass);

    obj1.x += nx * separation1;
    obj1.y += ny * separation1;
    obj2.x -= nx * separation2;
    obj2.y -= ny * separation2;
  }

  // update velocities using mass for more realistic physics
  obj1.speedX -= p * mass1 * nx * elasticity;
  obj1.speedY -= p * mass1 * ny * elasticity;
  obj2.speedX += p * mass2 * nx * elasticity;
  obj2.speedY += p * mass2 * ny * elasticity;

  // calculate rotation (reuse calculated angle components)
  if (!obj1.onSurface) {
    obj1.spin += Math.atan2(ny, nx) / 40;
  }
  if (!obj2.onSurface) {
    obj2.spin -= Math.atan2(ny, nx) / 40;
  }
  applySpeedLimit(obj1);
  applySpeedLimit(obj2);
}

// Estimate extra height gained above the launch point until apex (speedY ~ 0)
function estimateApexHeight(jumpPower, gravity, dragFactor, size, mass) {
  // Simulate the actual physics from window.js
  let speedY = -jumpPower; // negative because upward
  let height = 0;
  let frames = 0;
  const maxFrames = 200; // safety limit

  while (speedY < 0 && frames < maxFrames) {
    let totalMass = gravity * mass;
    // e.g. 0.001 if airResistance = 0.999
    // Apply drag proportional to velocity and size
    let dragY = speedY * dragFactor * (size / 15);

    // Subtract drag in the direction of motion
    speedY -= dragY;

    // Gravity/mass force only applies vertically
    speedY += totalMass;
    // apply y speed (negative speedY means moving up, so subtract from height to go up)
    height -= speedY / 4;  // Don't modify speedY itself    
    frames++;
  }

  return height;
}

/**
 * Calculate required jump velocities to reach target coordinates using ballistic trajectory
 * @param {number} targetX - horizontal distance to target
 * @param {number} targetY - vertical distance to target (negative = up, positive = down)
 * @param {number} size - object size
 * @param {number} mass - object mass
 * @param {number} maxPower - maximum available jump power
 * @return {object} - {speedX, speedY, reachable} velocities needed
 */
function calculateBallisticTrajectory(targetX, targetY, size, mass, maxPower) {
  const maxFrames = 400;
  const tolerance = 2; // pixels

  // Try different launch angles to find one that works
  let bestResult = null;
  let bestError = Infinity;

  // Test launch angles from -80° to +45°
  for (let angleDeg = -80; angleDeg <= 45; angleDeg += 5) {
    let angle = (angleDeg * Math.PI) / 180;

    // Try different power levels
    for (let powerPercent = 0.3; powerPercent <= 1.0; powerPercent += 0.1) {
      let testPower = maxPower * powerPercent;

      // Calculate initial velocities for this angle and power
      let initialSpeedX = testPower * Math.cos(angle);
      let initialSpeedY = testPower * Math.sin(angle);

      // Simulate the trajectory
      let speedX = initialSpeedX;
      let speedY = initialSpeedY;
      let x = 0;
      let y = 0;
      let frames = 0;

      while (frames < maxFrames) {
        // Apply drag exactly like window.js
        let dragX = speedX * dragFactor * (size / 15);
        let dragY = speedY * dragFactor * (size / 15);
        speedX -= dragX;
        speedY -= dragY;

        // Apply gravity
        let massGravity = gravity * mass;
        speedY += massGravity;

        // Update position exactly like window.js
        x += speedX / 4;
        y += speedY / 4;

        frames++;

        // Check if we're close to the target
        let distanceToTarget = Math.sqrt((x - targetX) * (x - targetX) + (y - targetY) * (y - targetY));

        if (distanceToTarget < tolerance) {
          // Found a trajectory that works!
          return {
            speedX: initialSpeedX,
            speedY: initialSpeedY,
            reachable: true,
            power: testPower,
            angle: angleDeg
          };
        }

        if (distanceToTarget < bestError) {
          bestError = distanceToTarget;
          bestResult = {
            speedX: initialSpeedX,
            speedY: initialSpeedY,
            reachable: false,
            power: testPower,
            angle: angleDeg,
            error: distanceToTarget
          };
        }

        // Stop if we've clearly overshot or are moving away from target
        if (Math.abs(x) > Math.abs(targetX) * 2 || y > targetY + 50) {
          break;
        }
      }
    }
  }

  // Return best attempt even if not perfect
  return bestResult || { speedX: 0, speedY: 0, reachable: false };
}
