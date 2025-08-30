// constants

// arrays for these objects 
trees = [];
fruits = [];
seeds = [];
glyphs = [];

let fruitSet = new Set(fruits);

// tree parameters
let minTrees;
let maxTrees;
let startingTrees;
const treeGrowthRate = 1.5;
const treeWitherRate = 1;
const treeStrength = 40; // how strong a tree is, how much it resists being pushed down by chittens

// seed parameters
const minSeeds = 10;

// glyph parameters
const glyphTimer = 75;

/**
* function to describe a Tree
* @param {int} x - the x coordinate
* @param {int} y - the y coordinate
* @param {int} width - the width
* @param {int} height - the height of the Tree base
* @param {int} maxHeight - the maximum height the Tree can reach;
*/
function Tree(x, y, width, height, maxHeight, fruitColour) {
    this.reachedMaxHeight = false;
    this.dead = false;
    this.loadthisframe = 0;
    this.circleCenterX = x;
    this.circleCenterY = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxHeight = maxHeight;
    this.fruitColour = fruitColour;
    this.fruitCount = 0;
    this.birthday = daytimeCounter;
    this.imageFlipped = (Math.random() < 0.5); // whether the image of the tree is flipped horizontally
    this.spawnFruit = function () {
        // find out how many fruits are on this tree
        let fruitsOnTree = 0;
        let positions = [];
        for (let i = 0; i < fruits.length; i++) {
            if (fruits[i].parent == this) {
                fruitsOnTree++;
                positions.push(fruits[i].treePos);
            }
        }
        if (fruitsOnTree < 4) {
            // add a fruit in a random position
            let target = fruitsOnTree + 1;
            while (fruitsOnTree < target) {
                let posTemp = Math.round(Math.random() * 3);
                if (!positions.includes(posTemp)) {
                    fruits.push(new Fruit(this.fruitColour, this, posTemp));
                    fruitsOnTree++;
                }
            }
        }
        // check that all fruits are on screen
        for (let i = fruits.length - 1; i >= 0; i--) {
            if (fruits[i].x < 0 || fruits[i].x > canvasWidth) {
                removeFocusFrom(fruits[i]);
                fruits.splice(i, 1);
            }
        }
    };
    this.update = function () {
        // respawning fruit twice a day
        if (this.birthday == daytimeCounter || Math.abs(this.birthday - daytimeCounter) == ticksPerDay/2) {
            this.spawnFruit();
        }
        // Update position and growth logic
        // don't go below the floor
        if (this.y < floorLevel) {
            this.y = floorLevel;
            //stop growing when reach max height
        } else if (this.y < trueBottom - this.maxHeight) {
            this.y = trueBottom - this.maxHeight;
            this.reachedMaxHeight = true;
        }
        // tree dies if it reaches the bottom after hitting it's max height
        if (this.reachedMaxHeight && this.y > trueBottom) {
            // mark tree for removal
            this.dead = true;
        } else {
            // growth logic
            // trees grow until they reach their max height and then wither
            // loadThisFrame is how much weight is on the tree (chittens.mass)
            if (this.reachedMaxHeight) {
                this.y += treeWitherRate * (((this.loadthisframe / treeStrength) / this.width) + (0.0125 * (75 / this.width)));
            } else if (this.y <= canvasHeight && this.y >= trueBottom - this.maxHeight) {
                this.y += treeGrowthRate * (((this.loadthisframe / treeStrength) / this.width) - (0.025 * (75 / this.width)));
            }
        }
        this.loadthisframe = 0;
    };
    this.render = function () {
        ctx.globalAlpha = 0.9;
        ctx.save();
        // Move origin to the horizontal center of the image
        ctx.translate(this.x, 0);
        // Flip horizontally if needed
        if (this.imageFlipped) ctx.scale(-1, 1);
        // Draw image relative to the new origin
        ctx.drawImage( acacia, -this.width * 0.5, this.y - 10, this.width, 200 / (300 / this.width));
        ctx.restore();
        ctx.fillStyle = trueBlack;
        ctx.fillRect(this.x - (this.width / 30), this.y + (this.width / 4.5), this.width / 12.5, trueBottom - this.y - this.height);
    };
}

/**
* function to describe a piece of fruit on a tree
*/
function Fruit(colour, parent, treePos) {
    this.colour = colour;
    this.parent = parent;
    this.treePos = treePos; // 0 to 3
    this.size = this.parent.width / 20;
    this.x = 0;
    this.y = 0;
    this.eater = null;
    this.fumbled = false;
    this.rotTimer = -1; // Timer for rotting when on surface (-1 = not started)
    //physics
    this.mass = 2;
    this.update = function () {
        // Update position in tree if not fumbled
        if (!this.fumbled) {
            if (this.eater !== null) {
                // stick to the chitten that has grabbed it
                this.x = this.eater.x;
                this.y = this.eater.y + this.eater.bodyToFeetDistance;
            } else {
                this.x = this.parent.x - (this.size * 2.5) + ((treePos - 1) * this.parent.width) / 4;
                this.y = this.parent.y + this.size + (this.parent.width / 10);
            }
        }
        // If fumbled, position is controlled by physics system in the main loop
    };
    this.render = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colour;
        // ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 0.025;
        let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 100);
        glow.addColorStop(0, this.colour);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        // Fill with gradient
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    };
    // fucntion to fumble a fruit
    this.fumbleFruit = function (spdX, spdY) {
        // Fumble! Fruit falls to ground with physics
        // Store current position as starting point for physics
        let currentX = this.x;
        let currentY = this.y;
        this.fumbled = true; // Mark as fumbled
        this.onSurface = false; // Enable physics
        this.x = currentX; // Set fixed position for physics
        this.y = currentY;
        this.speedX = spdX +  ((Math.random() - 0.5) * 2); // Small random horizontal velocity
        this.speedY = spdY + (Math.random() * 1); // Small downward velocity
        // Remove fruit from tree slot (if it has a parent tree)
        if (this.parent && this.treePos !== undefined) {
            this.treePos = null;
            this.parent = null;
        }
        removeFocusFrom(this);
    }
};

/**
* function to handle chittens
* @param {Set} fruitSet - Set of fruits for O(1) lookups
*/

/** function to describe a seed for a tree
*/
function Seed(colour, owner) {
    this.colour = colour;
    this.owner = owner;
    this.timer = Math.random() * 750;
    this.planted = false;
    this.kill = false;
    this.update = function () {
        if (this.timer > 0) {
            this.timer--;
        }
        // if a chitten is digesting this seed and all conditions are met, plant a tree
        let eaten = chittens.includes(this.owner);
        if (trees.length < maxTrees && eaten) {
            if (this.timer <= 0) {
                if (this.owner.snuggling <= 0 && this.owner.eatingChewsRemaining == 0
                    && this.owner.y >= trueBottom - this.owner.size - this.owner.frontLegLength
                    && tryToPlantaTree(this.owner.x, this.colour)) {
                    this.planted = true;
                    // sendMessage(this.owner.name + ' planted a seed');
                }
            }
            if (!eaten) {
                // cheap way to tag the seed to be killed
                this.kill = true;
            }
        }
    };
}

/**
* function to describe glyphs
* @param {int} x - the x position
* @param {int} y - the y position
* @param {int} speedX - the x speed
* @param {int} speedY - the y speed
* @param {string} symbol - the symbol of the glyph
*/
function Glyph(x, y, speedX, speedY, symbol, alpha) {
    this.mass = 0.1;
    this.speedX = speedX;
    this.speedY = speedY;
    this.alpha = alpha;
    this.size = fontWidth;
    this.timer = glyphTimer;
    this.x = x;
    this.y = y;
    this.spin = 0;
    this.rotation = 0;
    this.step = 0.1;
    this.colour = trueBlack;
    this.symbol = symbol;
    this.spin = (Math.random() * 2) - 1;
    this.speedX += (Math.random() * 2) - 1;
    this.speedY += (Math.random() * 2) - 1;
    this.update = function () {
        this.speedY += gravity * this.mass;
        if (checkBounceSides(this) || checkBounceTop(this) || checkBounceBottom(this)) {
            this.timer -= 1;
        }
        // drift to middle (hopefully not enough to counteract gravity);
        if (this.y > trueBottom / 2) {
            this.speedY -= 0.0125;
        } else if (this.y < trueBottom / 2) {
            this.speedY += 0.0125;
        }
        applySpeedLimit(this);
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.spin;
        this.spin *= 0.9;
        while (this.rotation > 6) {
            this.rotation -= 6;
        }
        while (this.rotation < -6) {
            this.rotation += 6;
        }
        this.timer -= this.step;
    };
    this.render = function () {
        // draw glyph
        ctx.globalAlpha = this.alpha * (this.timer / glyphTimer / 2);
        ctx.fillStyle = this.colour;
        ctx.font = '14px' + ' ' + globalFont;
        ctx.save();
        ctx.translate(this.x - (this.size / 2), this.y + (this.size / 2));
        ctx.rotate(this.rotation);
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
    };
}

/**
* function to attempt to plant a tree
* @param {int} x - the x coordinate where the mate is trying to place a tree
* @param {hex} fruitColour - the colour of the fruit
* @return {boolean} - whether the tree was planted or not
*/
function tryToPlantaTree(x, fruitColour) {
    let allow = true;
    let maxHeight = trueBottom * 0.30 + (Math.random() * (trueBottom * 0.30));
    let treeWidth = 35 + (Math.random() * 45);
    for (let j = 0; j < trees.length; j++) {
        if (trees[j].x == x
            || ((x - (treeWidth / 4) < trees[j].x + (trees[j].width / 4) && trees[j].x - (trees[j].width / 4) < x + (treeWidth / 4)))
            || (x < 0 + (treeWidth / 2) || x > canvasWidth - (treeWidth / 2))) {
            allow = false;
        }
    }
    if (allow) {
        trees.push(new Tree(x, canvasHeight, treeWidth, 1, maxHeight, fruitColour));
        return true;
    }
    return false;
}

/**
* function to create a glyph
* @param {int} x -  the x coordinate
* @param {int} y -  the y coordinate
* @param {string} symbol - the symbol of the glyph
* @param {int} alpha - the alpha for drawing the glyph
* @return {int} - the number of glyphs created
*/
function createGlyphs(x, y, symbol, alpha) {
    if (isNaN(x) || isNaN(y)) {
        console.warn('createGlyphs called with invalid coordinates:', { x, y });
        return 0;
    }

    const speed = 1;
    const directions = [
        [0, -speed],
        [0, speed],
        [speed, 0],
        [-speed, 0],
        [speed / 1.5, speed / 1.5],
        [speed / 1.5, -speed / 1.5],
        [-speed / 1.5, speed / 1.5],
        [-speed / 1.5, -speed / 1.5]
    ];

    directions.forEach(([dx, dy]) => {
        glyphs.push(new Glyph(x, y, dx, dy, symbol, alpha));
    });

    return 8;
}