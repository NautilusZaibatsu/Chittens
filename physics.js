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
    } else {
      what.x = canvasWidth-what.size;
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
  }
}
/**
* function to produce an explosion's physics
* @param {int} ex - the x coordinate
* @param {int} ey - the y coordinate
*/
function produceExplosion(ex, ey) {
  // blast all the guys
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].awake) {
      let diffx = ex - chibis[i].x;
      let diffy = ey - chibis[i].y;
      // as long as it's not the guy that triggered it
      if (!diffx == 0 && !diffy == 0) {
        // if the guy is within range;
        let range = 200;
        if (Math.abs(diffx) < range && Math.abs(diffy) < range) {
          chibis[i].love += 25;
          chibis[i].energy -= 50;
          chibis[i].health -= 10;
          diffx /= 5;
          diffy /= 5;
          if (diffx >= 0) {
            chibis[i].speedX -= (100-diffx)/2;
          } else if (diffx < 0) {
            chibis[i].speedX += (100-diffx)/2;
          }
          if (diffy >= 0) {
            chibis[i].speedY -= (100-diffy)/2;
          } else if (diffy <= 0) {
            chibis[i].speedY += (100-diffy)/2;
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
    if (!diffx == 0 && !diffy == 0) {
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
* function to detect a collision between two objects
* @param {Lifeform} thisobj - the first object
* @param {lifeform} otherobj - the second object
* @return {boolean} whether they collided or not
*/
function detectCollision(thisobj, otherobj) {
  let myleft = thisobj.x-5;
  let myright = thisobj.x + (thisobj.size)+5;
  let mytop = thisobj.y-5;
  let mybottom = thisobj.y + (thisobj.size)+5;
  let otherleft = otherobj.x;
  let otherright = otherobj.x + (otherobj.size);
  let othertop = otherobj.y;
  let otherbottom = otherobj.y + (otherobj.size);
  let crash = true;
  if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
    crash = false;
  }
  return crash;
}

/**
* function to collide two objects using physics
* @param {object} obj1 - the first object
* @param {object} obj2 - the second object
*/
function collide(obj1, obj2) {
  // fix the distance between the objects
  let diffx = Math.abs(obj1.x - obj2.x);
  let diffy = Math.abs(obj1.y - obj2.y);
  let currenth = Math.sqrt((diffx*diffx)+(diffy*diffy));
  let targeth = obj1.size + obj2.size;
  let newprop = targeth/currenth;
  if (diffx == 0 && diffy == 0) {
    newprop = 1;
  }
  obj1.x += (obj1.x - obj2.x)*newprop/obj1.size;
  obj2.x -= (obj1.x - obj2.x)*newprop/obj2.size;
  // detect if one of the guys is touching the floor
  if (!obj1.hitBottom && !obj2.hitBottom) {
    obj1.y += (obj1.y - obj2.y)*newprop/obj1.size;
    obj2.y -= (obj1.y - obj2.y)*newprop/obj2.size;
  }
  // calculate transfer of energy
  // energy = mass X velocity
  let myEnergy = obj1.speedX*obj1.size;
  let theirEnergy = obj2.speedX*obj2.size;
  let energyTransfer = elasticity*(myEnergy-theirEnergy)/(obj1.size+obj2.size);
  obj1.speedX += energyTransfer;
  obj2.speedX += energyTransfer;
  myEnergy = obj1.speedY*obj1.size;
  theirEnergy = obj2.speedY*obj2.size;
  energyTransfer = elasticity*(myEnergy-theirEnergy)/(obj1.size+obj2.size);
  obj1.speedY += energyTransfer;
  obj2.speedY += energyTransfer;
  // calculate rotation on collision
  let targetangle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  if (!obj1.hitBottom) {
    obj1.spin += targetangle/20;
  }
  if (!obj2.hitBottom) {
    obj2.spin -= targetangle/20;
  }
  applySpeedLimit(obj1);
  applySpeedLimit(obj2);
}
