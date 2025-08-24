// universal physics constants
const gravity = 0.02; // constant for gravity
const speedLimit = 100; // maximum X or Y speed
const groundFriction = 0.9; // ground friction coefficient (0.9 means 10% speed loss per frame)
const airResistance = 0.999; // air resistance coefficient (0.999 means 0.001% speed loss per frame)

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
  this.update = function() {
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
    console.log('2418 error - speed or coordinate is not a number');
    console.log('x '+what.x+' y '+what.y+' speedX '+what.speedX+' speedY '+what.speedY);
  }
  let thisSpeedLimit = speedLimit*20/what.size;
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
* function to check whether an object touched the sides (lol), then bounce if so
* @param {object} what - the object
*/
function checkBounceSides(what) {
  // if we bounce off a side wall
  if (what.x < what.size || what.x >= canvasWidth - what.size) {
    what.speedX *= -0.9;
    let targetangle = Math.atan2(what.y, 0);
    what.spin += elasticity*targetangle/10;
    if (what.x < what.size) {
      what.x = what.size;
      return true;
    } else {
      what.x = canvasWidth-what.size;
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
  if (what.y > trueBottom-what.size) {
    what.speedY *= -0.99;
    what.y = trueBottom-what.size;
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
            chittens[i].speedX -= (100-Math.abs(diffx))/2;
          } else {
            chittens[i].speedX += (100-Math.abs(diffx))/2;
          }
          if (diffy >= 0) {
            chittens[i].speedY -= (100-Math.abs(diffy))/2;
          } else {
            chittens[i].speedY += (100-Math.abs(diffy))/2;
          }
        }
      }
    }
  }
  // now blast the Ghosts
  for (let i = 0; i < myGhosts.length; i++) {
    let diffx = ex - myGhosts[i].x;
    let diffy = ey - myGhosts[i].y;
    // if the Ghost is within range;
    let range = 300;
    if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
      diffx /= range;
      diffy /= range;
      if (diffx >= 0) {
        myGhosts[i].speedX -= (1-diffx);
      } else if (diffx < 0) {
        myGhosts[i].speedX += (1-diffx);
      }
      if (diffy >= 0) {
        myGhosts[i].speedY -= (1-diffy);
      } else if (diffy < 0) {
        myGhosts[i].speedY += (1-diffy);
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
          fireflies[i].speedX -= (diffx)*10;
        } else if (diffx < 0) {
          fireflies[i].speedX += (diffx)*10;
        }
        if (diffy >= 0) {
          fireflies[i].speedY -= (diffy)*10;
        } else if (diffy < 0) {
          fireflies[i].speedY += (diffy)*10;
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
  
  // calculate collision point (still use size for positioning)
  let colPointX = ((obj1.x * obj2.size) + (obj2.x * obj1.size)) / (obj1.size + obj2.size);
  let colPointY = ((obj1.y * obj2.size) + (obj2.y * obj1.size)) / (obj1.size + obj2.size);
  
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
  if (!obj1.hitBottom) {
    obj1.spin += Math.atan2(ny, nx) / 20;
  }
  if (!obj2.hitBottom) {
    obj2.spin -= Math.atan2(ny, nx) / 20;
  }
  
  applySpeedLimit(obj1);
  applySpeedLimit(obj2);
}
