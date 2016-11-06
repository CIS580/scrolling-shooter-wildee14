(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const Enemy = require('./enemy');
const BulletPool = require('./bullet_pool');
const Particles = require('./smoke_particles');
const Powerup = require('./powerup');

/* Global variables */
//transparent pixel RGB: 191 220 191
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var reticule = {
  x: 0,
  y: 0
}
var level = 1;
var bullets = new BulletPool(10);
var bulletsEnemy =  [];
for (var i = 0; i < 2*level; i++) {
  bulletsEnemy.push(new BulletPool(10));
}
var missiles = [];
var player = new Player(bullets, missiles);
var powerups = [];

var enemies = [];
for (var i = 0; i < 2*level; i++) {
  enemies.push(new Enemy("plane",bulletsEnemy[i],{x:i*200+200, y:700}));
  console.log(enemies[i].type);
}
var exploded = [];
var explodedPowerups = [];
var powerups = [];
powerups.push(new Powerup("speed",{x:100,y:500}));
powerups.push(new Powerup("size",{x:500,y:750}));
powerups.push(new Powerup("color",{x:50,y:1000}));

//1. load image
var background = new Image();
background.src = 'assets/Levels/Level1/back.png';
var middle = new Image();
middle.src = 'assets/Levels/Level1/front.png';
var front = new Image();
front.src = 'assets/Levels/Level1/mid.png';

var background2 = new Image();
background2.src = 'assets/Levels/Level2/background.png';
var middle2 = new Image();
middle2.src = 'assets/Levels/Level2/front.png';
var front2 = new Image();
front2.src = 'assets/Levels/Level2/mid.png';

var background3 = new Image();
background3.src = 'assets/Levels/Level3/background.png';
var middle3 = new Image();
middle3.src = 'assets/Levels/Level3/middle.png';
var front3 = new Image();
front3.src = 'assets/Levels/Level3/front.png';

var date = new Date();
var start = Date.now();
var end = 0;
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
    case "e":
      event.preventDefault();
      for (var i = 0; i < enemies.length; i++) {
        console.log("fire");
        enemies[i].fireBullet(
          Vector.subtract(player.position, camera.toScreenCoordinates(enemies[i].position)));
      }
      break;
  }
}

window.onmousedown = function(event) {
  event.preventDefault();
  reticule = {x:event.offsetX , y: event.offsetY}
  player.fireBullet(Vector.subtract(reticule,
                camera.toScreenCoordinates(player.position)));
}

window.onmousemove = function(event) {
  event.preventDefault();
  reticule = {x:event.offsetX , y: event.offsetY}
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  if(player.alive){
    switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
  }
 }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

function nextLevel() {
  if (level < 4) {
  end = Date.now();
  var total = Math.floor((end-start)*.001);
  start = Date.now();
  player.score+=total*10;
  player.score+=level*100;
  document.getElementById('score').innerHTML = "Level Summary:"+level+" Score: "+
    player.score+" Health: "+player.health+ "</br>Time: "+total + " seconds";

  level++;
  player.position.y = 100;
  console.log(level);
  enemies = [];
  exploded = [];
  var bulletsEnemy =  [];
  if(level == 2){
    for (var i = 0; i < 3*level; i++) {
      bulletsEnemy.push(new BulletPool(10));
    }

    for (var i = 0; i < 2*level; i++) {
      enemies.push(new Enemy("robot",bulletsEnemy[i],{x:i*100+50, y:700}));
    }
    var len = enemies.length;
    for (var i = 0; i < level; i++) {
      enemies.push(new Enemy("bigRobot",bulletsEnemy[i+len],{x:i*400+50, y:1000}));
    }
  }
  else if(level == 3){
    for (var i = 0; i < 3*level; i++) {
      bulletsEnemy.push(new BulletPool(10));
    }

    for (var i = 0; i < 2*level; i++) {
      enemies.push(new Enemy("alien",bulletsEnemy[i],{x:i*100+50, y:700}));
    }
    var len = enemies.length;
    for (var i = 0; i < level; i++) {
      enemies.push(new Enemy("bigPlane",bulletsEnemy[i+len],{x:i*400+50, y:1000}));
    }
  }
  powerups = [];
  powerups.push(new Powerup("speed",{x:100,y:500}));
  powerups.push(new Powerup("size",{x:200,y:750}));
  powerups.push(new Powerup("color",{x:400,y:1000}));
  explodedPowerups = [];
  }
}


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  if(level >3) return;
  // update the player
  player.update(elapsedTime, input);
  if(player.position.y>=1200) nextLevel();

  // update the camera
  camera.update(player.position);

  // Update bullets
  bullets.update(elapsedTime, function(bullet){
    if(!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update enemy bullets
  for (var i = 0; i < bulletsEnemy.length; i++) {
    bulletsEnemy[i].update(elapsedTime, function(bullet){
      if(!camera.onScreen(bullet)) return true;
      return false;
    });
  }
  //console.log(bulletsEnemy.length);

  // Update missiles
  var markedForRemoval = [];
  missiles.forEach(function(missile, i){
    missile.update(elapsedTime);
    if(Math.abs(missile.position.y - camera.y) > camera.width * 2)
      markedForRemoval.unshift(i);
  });
  // Remove missiles that have gone off-screen
  markedForRemoval.forEach(function(index){
    missiles.splice(index, 1);
  });

  //Update enemies
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].update(camera,player);
    }

  var collisions = [];
  //Check for Enemy 2 Player collision

  for (var i = 0; i < enemies.length; i++) {
  var dist = Math.pow(enemies[i].position.x - player.position.x, 2) +
             Math.pow(enemies[i].position.y - player.position.y, 2);
//  console.log(dist + ":"+ Math.pow(enemies[i].radius + player.radius, 2));
  if(dist < Math.pow(enemies[i].radius + player.radius, 2)) {
     collisions.push(enemies[i]);
   }
 }
 //console.log(collisions);
 if(collisions.length != 0){
   for (var i = 0; i < collisions.length; i++) {
     for (var j = 0; j < enemies.length; j++) {
       if(enemies[j].position.x == collisions[i].position.x &&
          enemies[j].position.y == collisions[i].position.y){
          console.log("slice");
          var explodeEnemies = enemies[j];
          explodeEnemies.particles.emit({x: -8, y: 0});
          explodeEnemies.particles.emit({x: 8, y: -8});
          explodeEnemies.particles.emit({x: 8, y: 8});
          explodeEnemies.particles.emit({x: 0, y: 0});
          explodeEnemies.particles.emit({x: -8, y: 8});
          explodeEnemies.particles.emit({x: -8, y: -8});
          explodeEnemies.particles.update(elapsedTime);
          exploded.push(explodeEnemies);
          player.health-=5;
          enemies.splice(j,1);
     }
   }
 }
}

  var collisionsEnemies = [];
  //Check for bullet 2 enemy collision
  for (var i = 0; i < enemies.length; i++) {
  for (var j = 0; j < bullets.pool.length; j+=4) {
    var dist = Math.pow(enemies[i].position.x - bullets.pool[j], 2) +
             Math.pow(enemies[i].position.y - bullets.pool[j+1], 2);
    if(dist < Math.pow(enemies[i].radius + 15, 2)) {
     collisionsEnemies.push(enemies[i]);
    }
  }
 }

 //exploded = [];

 if(collisionsEnemies.length != 0){
   for (var i = 0; i < collisionsEnemies.length; i++) {
     for (var j = 0; j < enemies.length; j++) {
       if(enemies[j].position.x == collisionsEnemies[i].position.x &&
          enemies[j].position.y == collisionsEnemies[i].position.y){
            player.score+=50;
            var explodeEnemies = enemies[j];
            explodeEnemies.particles.emit({x: -8, y: 0});
            explodeEnemies.particles.emit({x: 8, y: -8});
            explodeEnemies.particles.emit({x: 8, y: 8});
            explodeEnemies.particles.emit({x: 0, y: 0});
            explodeEnemies.particles.emit({x: -8, y: 8});
            explodeEnemies.particles.emit({x: -8, y: -8});
            explodeEnemies.particles.update(elapsedTime);
            exploded.push(explodeEnemies);
            enemies.splice(j,1);
          }

     }
   }
 }
 for (var i = 0; i < powerups.length; i++) {
   powerups[i].update(camera,player);
 }
 for (var i = 0; i < explodedPowerups.length; i++) {
   explodedPowerups[i].update(camera,player);
 }
   var collisionsPowerups = [];
   //Check for Powerup 2 Player collision

   for (var i = 0; i < powerups.length; i++) {
   var dist = Math.pow(powerups[i].position.x - player.position.x, 2) +
              Math.pow(powerups[i].position.y - player.position.y, 2);
 //  console.log(dist + ":"+ Math.pow(enemies[i].radius + player.radius, 2));
   if(dist < Math.pow(powerups[i].radius + player.radius, 2)) {
      collisionsPowerups.push(powerups[i]);
    }
  }
  //console.log(collisions);
  if(collisionsPowerups.length != 0){
    for (var i = 0; i < collisionsPowerups.length; i++) {
      for (var j = 0; j < powerups.length; j++) {
        if(powerups[j].position.x == collisionsPowerups[i].position.x &&
           powerups[j].position.y == collisionsPowerups[i].position.y){
           console.log(player.PLAYER_SPEED);
           switch (powerups[j].type) {
             case "speed":
               player.PLAYER_SPEED+=5;
               break;
             case "size":
               player.BULLET_SPEED+=5;
               break;
             case "color":
               player.health+=5;
               break;
           }
           console.log(powerups[j]);
           var explodedPowerup = powerups[j];
           explodedPowerup.collided = true;
           explodedPowerup.particles.emit({x: 0, y: 0});
           explodedPowerup.particles.emit({x: -8, y: 8});
           explodedPowerup.particles.emit({x: -8, y: -8});
           explodedPowerup.particles.update(elapsedTime);
           explodedPowerups.push(explodedPowerup);
           console.log(player.BULLET_SPEED);
           powerups.splice(j,1);
      }
    }
  }
 }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 786);
  if(level >3) return;
  // TODO: Render background
  renderBackgrounds(elapsedTime, ctx);

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  renderWorld(elapsedTime, ctx);
  ctx.restore();

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

function renderBackgrounds(elapsedTime, ctx) {
  ctx.save();

  // The background scrolls at 2% of the foreground speed
  ctx.translate(0,-camera.y * 0.2);
  if(level ==1) ctx.drawImage(background, 0, 0);
  else if(level ==2) ctx.drawImage(background2, 0, 0);
  else ctx.drawImage(background3, 0, 0);
  ctx.restore();

  // The midground scrolls at 60% of the foreground speed
  ctx.save();
  ctx.translate(0,-camera.y * 0.6);
  ctx.drawImage(middle, 0, 0);
  ctx.restore();

  // The foreground scrolls in sync with the camera
  ctx.save();
  ctx.translate(0,-camera.y);
  ctx.drawImage(front, 0, 0);
  ctx.restore();
}


/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
    // Render the bullets
    bullets.render(elapsedTime, ctx);

    for (var i = 0; i < bulletsEnemy.length; i++) {
      bulletsEnemy[i].render(elapsedTime, ctx);
    }

    // Render the missiles
    missiles.forEach(function(missile) {
      missile.render(elapsedTime, ctx);
    });

    // Render the player
    player.render(elapsedTime, ctx);
    // Create gradient
    ctx.font="20px Verdana";
    var gradient=ctx.createLinearGradient(0,0,700,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    // Fill with gradient
    ctx.fillStyle=gradient;
    ctx.fillText("HP:"+player.health,player.position.x-23,player.position.y+35);
    ctx.fillText("Score:"+player.score,player.position.x-23,player.position.y+55);
    if( (Math.floor((start)*.001))<5 && level > 1){
      ctx.fillText("Level Summary:"+level+" Score: "+
        player.score+" Health: "+player.health+ "Time: "+total + " seconds",
        player.position.x-23,player.position.y+85);
    }
    //Render enemies
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].render(elapsedTime, ctx);
    }
    if(exploded){
      for (var i = 0; i < exploded.length; i++) {
        var offset = exploded[i].angle * 23;
        ctx.save();
        ctx.translate(exploded[i].position.x, exploded[i].position.y);
        exploded[i].particles.render(elapsedTime, ctx);
        ctx.restore();
      }
    }
    if(explodedPowerups){
      for (var i = 0; i < explodedPowerups.length; i++) {
        var offset = explodedPowerups[i].angle * 23;
        ctx.save();
        ctx.translate(explodedPowerups[i].position.x, explodedPowerups[i].position.y);
        explodedPowerups[i].particles.render(elapsedTime, ctx);
        ctx.restore();
      }
    }
    for (var i = 0; i < powerups.length; i++) {
      powerups[i].render(elapsedTime, ctx);
    }

}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
  ctx.save();
  ctx.translate(reticule.x, reticule.y);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2*Math.PI);
  ctx.moveTo(0, 15);
  ctx.lineTo(0, -15);
  ctx.moveTo(15, 0);
  ctx.lineTo(-15, 0);
  ctx.strokeStyle = '#00ff00';
  ctx.stroke();
  ctx.restore();
}

},{"./bullet_pool":2,"./camera":3,"./enemy":4,"./game":5,"./player":7,"./powerup":8,"./smoke_particles":9,"./vector":10}],2:[function(require,module,exports){
"use strict";

/**
 * @module BulletPool
 * A class for managing bullets in-game
 * We use a Float32Array to hold our bullet info,
 * as this creates a single memory buffer we can
 * iterate over, minimizing cache misses.
 * Values stored are: positionX, positionY, velocityX,
 * velocityY in that order.
 */
module.exports = exports = BulletPool;

/**
 * @constructor BulletPool
 * Creates a BulletPool of the specified size
 * @param {uint} size the maximum number of bullets to exits concurrently
 */
function BulletPool(maxSize) {
  this.pool = new Float32Array(2 * maxSize);
  this.end = 0;
  this.max = maxSize;
}

/**
 * @function add
 * Adds a new bullet to the end of the BulletPool.
 * If there is no room left, no bullet is created.
 * @param {Vector} position where the bullet begins
 * @param {Vector} velocity the bullet's velocity
*/
BulletPool.prototype.add = function(position, velocity) {
  if(this.end < this.max) {
    this.pool[4*this.end] = position.x;
    this.pool[4*this.end+1] = position.y;
    this.pool[4*this.end+2] = velocity.x;
    this.pool[4*this.end+3] = velocity.y;
    this.end++;
  }
}

/**
 * @function update
 * Updates the bullet using its stored velocity, and
 * calls the callback function passing the transformed
 * bullet.  If the callback returns true, the bullet is
 * removed from the pool.
 * Removed bullets are replaced with the last bullet's values
 * and the size of the bullet array is reduced, keeping
 * all live bullets at the front of the array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {function} callback called with the bullet's position,
 * if the return value is true, the bullet is removed from the pool
 */
BulletPool.prototype.update = function(elapsedTime, callback) {
  for(var i = 0; i < this.end; i++){
    // Move the bullet
    this.pool[4*i] += this.pool[4*i+2];
    this.pool[4*i+1] += this.pool[4*i+3];
    // If a callback was supplied, call it
    if(callback && callback({
      x: this.pool[4*i],
      y: this.pool[4*i+1]
    })) {
      // Swap the current and last bullet if we
      // need to remove the current bullet
      this.pool[4*i] = this.pool[4*(this.end-1)];
      this.pool[4*i+1] = this.pool[4*(this.end-1)+1];
      this.pool[4*i+2] = this.pool[4*(this.end-1)+2];
      this.pool[4*i+3] = this.pool[4*(this.end-1)+3];
      // Reduce the total number of bullets by 1
      this.end--;
      // Reduce our iterator by 1 so that we update the
      // freshly swapped bullet.
      i--;
    }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
BulletPool.prototype.render = function(elapsedTime, ctx) {
  // Render the bullets as a single path
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "black";
  for(var i = 0; i < this.end; i++) {
    ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
    ctx.arc(this.pool[4*i], this.pool[4*i+1], 15, 0, 2*Math.PI);
  }
  ctx.fill();
  ctx.restore();
}

},{}],3:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/**
 * @module Camera
 * A class representing a simple camera
 */
module.exports = exports = Camera;

/**
 * @constructor Camera
 * Creates a camera
 * @param {Rect} screen the bounds of the screen
 */
function Camera(screen) {
  this.x = 0;
  this.y = 0;
  this.width = screen.width;
  this.height = screen.height;
}

/**
 * @function update
 * Updates the camera based on the supplied target
 * @param {Vector} target what the camera is looking at
 */
Camera.prototype.update = function(target) {
  // TODO: Align camera with player
  this.y = target.y - 10;
}

/**
 * @function onscreen
 * Determines if an object is within the camera's gaze
 * @param {Vector} target a point in the world
 * @return true if target is on-screen, false if not
 */
Camera.prototype.onScreen = function(target) {
  return (
     target.x > this.x &&
     target.x < this.x + this.width &&
     target.y > this.y &&
     target.y < this.y + this.height
   );
}

/**
 * @function toScreenCoordinates
 * Translates world coordinates into screen coordinates
 * @param {Vector} worldCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toScreenCoordinates = function(worldCoordinates) {
  return Vector.subtract(worldCoordinates, this);
}

/**
 * @function toWorldCoordinates
 * Translates screen coordinates into world coordinates
 * @param {Vector} screenCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toWorldCoordinates = function(screenCoordinates) {
  return Vector.add(screenCoordinates, this);
}

},{"./vector":10}],4:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const Particles = require('./smoke_particles');
/* Constants */
const Enemy_SPEED = 3;
const BULLET_SPEED = 5;

/**
 * @module Enemy
 * A class representing a Enemy's helicopter
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates a Enemy
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy(type,bullets,position) {
  this.bullets = bullets;
  this.type = type;
  this.angle = 0;
  this.start = {x: position.x, y: position.y}
  this.left = true;
  this.up = true;
  this.particles = new Particles(100);
  this.position = position;
  this.velocity = {x: 0, y: 0};
  this.plane = new Image()
  this.plane.src = 'assets/plane.png';
  this.bigPlane = new Image()
  this.bigPlane.src = 'assets/plane.png';
  this.alien = new Image()
  this.alien.src = 'assets/newsh0.shp.000000.png';
  this.robot = new Image()
  this.robot.src = 'assets/newsht.shp.000000.png';
  this.bigRobot = new Image()
  this.bigRobot.src = 'assets/newsho.shp.000000.png';

  this.radius = 40;
  this.types = ["plane", "bigPlane", "alien", "robot", "hugeRobot"];
}

/**
 * @function update
 * Updates the Enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function(camera, player) {

  switch (this.type) {
    case "plane":
      if(60 < (this.start.x - this.position.x ) ) this.left = false;
      else if(60 < (this.position.x - this.start.x) ) this.left = true;

      if(this.left) this.position.x--;
      else this.position.x++;
      break;
    case "bigPlane":
      if(60 < (this.start.y - this.position.y ) ) this.up = false;
      else if(60 < (this.position.y - this.start.y) ) this.up = true;
      if(this.up) this.position.y--;
      else this.position.y++;
      break;
      break;
    case "alien":
      if(60 < (this.start.x - this.position.x ) ) this.left = false;
      else if(60 < (this.position.x - this.start.x) ) this.left = true;
      if(this.left) this.position.x--;
      else this.position.x++;
      break;
      break;
    case "robot":
      console.log("FIRE");
      this.fireBullet(Vector.subtract(player.position,
                  camera.toScreenCoordinates(this.position)));
      break;
    case "bigRobot":
      if(60 < (this.start.y - this.position.y ) ) this.up = false;
      else if(60 < (this.position.y - this.start.y) ) this.up = true;
      if(this.up) this.position.y--;
      else this.position.y++;
      break;
   }

}

/**
 * @function render
 * Renders the Enemy helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy.prototype.render = function(elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  switch (this.type) {
    case "plane":
      ctx.drawImage(this.plane, 15,15);
      break;
    case "bigPlane":
      ctx.drawImage(this.bigPlane, 15,15, 100,100);
      break;
    case "alien":
      ctx.drawImage(this.alien,0,0,228,50, 15,15, 100,50);
      break;
    case "robot":
      ctx.drawImage(this.robot, 0,0,228,50, 15,15, 100,50);
      break;
    case "bigRobot":
      ctx.drawImage(this.bigRobot,0,0,228,150, 15,15, 100,80);
      break;
  }
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:30, y:30});
  var velocity = Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

},{"./missile":6,"./smoke_particles":9,"./vector":10}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],6:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/* Constants */
const MISSILE_SPEED = 8;

/**
 * @module Missile
 * A class representing a player's missile
 */
module.exports = exports = Missile;

/**
 * @constructor Missile
 * Creates a missile
 * @param {Vector} position the position of the missile
 * @param {Object} target the target of the missile
 */
function Missile(position, target) {
  this.position = {x: position.x, y:position.y}
  this.target = target;
  this.img = new Image();
  this.img.src = 'assets/helicopter.png';
  this.angle = 0;
}

/**
 * @function update
 * Updates the missile, steering it towards a locked
 * target or straight ahead
 * @param {DOMHighResTimeStamp} elapedTime
 */
Missile.prototype.update = function(elapsedTime) {

  // set the velocity
  var velocity = {x: MISSILE_SPEED, y: 0}
  if(this.target) {
    var direction = Vector.subtract(this.position, this.target);
    velocity = Vector.scale(Vector.normalize(direction), MISSILE_SPEED);
  }

  // determine missile angle
  this.angle = Math.atan2(velocity.y, velocity.x);

  // move the missile
  this.position.x += velocity.x;
  this.position.y += velocity.y;
}

/**
 * @function render
 * Renders the missile in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Missile.prototype.render = function(elapsedTime, ctx) {
  // Draw Missile
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(this.angle);
  ctx.drawImage(this.img, 76, 56, 16, 8, 0, -4, 640, 320);
  ctx.restore();
}

},{"./vector":10}],7:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const Partices = require('./smoke_particles');
/* Constants */


/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(bullets, missiles) {
  this.PLAYER_SPEED = 5;
  this.BULLET_SPEED = 10;
  this.missiles = missiles;
  this.particle = new Partices(100);
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.score = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/tyrian.shp.007D3C.png';
  this.health = 10;
  this.radius = 20;
  this.alive = true;
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  if(this.health <= 0){
    this.particle.emit({x: -8, y: 0});
    this.particle.emit({x: 8, y: -8});
    this.particle.emit({x: 8, y: 8});
    this.particle.emit({x: 0, y: 0});
    this.particle.emit({x: -8, y: 8});
    this.particle.emit({x: -8, y: -8});
    this.particle.update(elapsedTime);
    this.alive = false;
    this.velocity = {x:0,y:0};
  }

  // set the velocity
  this.velocity.x = 0;
  if(input.left) this.velocity.x -= this.PLAYER_SPEED;
  if(input.right) this.velocity.x += this.PLAYER_SPEED;
  this.velocity.y = 0;
  if(input.up) this.velocity.y -= this.PLAYER_SPEED / 2;
  if(input.down) this.velocity.y += this.PLAYER_SPEED / 2;

  // determine player angle
  this.angle = 0;
  if(this.velocity.x < 0) this.angle = -1;
  if(this.velocity.x > 0) this.angle = 1;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // don't let the player move off-screen
  if(this.position.x < 0) this.position.x = 0;
  if(this.position.x > 1024) this.position.x = 1024;
  if(this.position.y > 2000) this.position.y = 2000;
  if(this.position.y < 300) this.position.y = 300;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if(this.health <= 0) this.particle.render(elapsedTime, ctx);
  else ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Player.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:30, y:30});
  var velocity = Vector.scale(Vector.normalize(direction), this.PLAYER_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
Player.prototype.fireMissile = function() {
  if(this.missileCount > 0){
    var position = Vector.add(this.position, {x:0, y:30})
    var missile = new Missile(position);
    this.missiles.push(missile);
    this.missileCount--;
  }
}

},{"./missile":6,"./smoke_particles":9,"./vector":10}],8:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Particles = require('./smoke_particles');
/* Constants */
const Powerup_SPEED = 3;

/**
 * @module Powerup
 * A class representing a Powerup's helicopter
 */
module.exports = exports = Powerup;

/**
 * @constructor Powerup
 * Creates a Powerup
 * @param {type} type the type
 */
function Powerup(type,position) {
  this.type = type;
  this.collided = false;
  this.particles = new Particles(100);
  this.angle = 0;
  this.start = {x: position.x, y: position.y}
  this.left = true;
  this.up = true;
  this.position = position;
  this.velocity = {x: 0, y: 0};
  this.power = new Image();
  this.power.src = 'assets/newsh@.shp.000000.png';
  this.radius = 40;
}

/**
 * @function update
 * Updates the Powerup based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Powerup.prototype.update = function(camera, player) {
 if(this.collided) return;
  switch (this.type) {
    case "speed":
      if(60 < (this.start.x - this.position.x ) ) this.left = false;
      else if(60 < (this.position.x - this.start.x) ) this.left = true;

      if(this.left) this.position.x--;
      else this.position.x++;
      break;
    case "size":
      if(60 < (this.start.y - this.position.y ) ) this.up = false;
      else if(60 < (this.position.y - this.start.y) ) this.up = true;
      if(this.up) this.position.y--;
      else this.position.y++;
      break;
      break;
    case "color":
      break;
   }

}

/**
 * @function render
 * Renders the Powerup helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Powerup.prototype.render = function(elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if(!this.collided){
    switch (this.type) {
    case "speed":
      ctx.drawImage(this.power,0,0,25,25, 15,15, 25,25);
      break;
    case "size":
      ctx.drawImage(this.power,0,25,25,25, 15,15, 25,25);
      break;
    case "color":
      ctx.drawImage(this.power,25,50,25,25, 15,15, 25,25);
      break;
  }
} else this.particle.render(elapsedTime, ctx);

  ctx.restore();
}

},{"./smoke_particles":9,"./vector":10}],9:[function(require,module,exports){
"use strict";

/**
 * @module SmokeParticles
 * A class for managing a particle engine that
 * emulates a smoke trail
 */
module.exports = exports = SmokeParticles;

/**
 * @constructor SmokeParticles
 * Creates a SmokeParticles engine of the specified size
 * @param {uint} size the maximum number of particles to exist concurrently
 */
function SmokeParticles(maxSize) {
  this.pool = new Float32Array(3 * maxSize);
  this.start = 0;
  this.end = 0;
  this.wrapped = false;
  this.max = maxSize;
}

/**
 * @function emit
 * Adds a new particle at the given position
 * @param {Vector} position
*/
SmokeParticles.prototype.emit = function(position) {
  if(this.end != this.max) {
    this.pool[3*this.end] = position.x;
    this.pool[3*this.end+1] = position.y;
    this.pool[3*this.end+2] = 0.0;
    this.end++;
  } else {
    this.pool[3] = position.x;
    this.pool[4] = position.y;
    this.pool[5] = 0.0;
    this.end = 1;
  }
}

/**
 * @function update
 * Updates the particles
 * @param {DOMHighResTimeStamp} elapsedTime
 */
SmokeParticles.prototype.update = function(elapsedTime) {
  function updateParticle(i) {
    this.pool[3*i+2] += elapsedTime;
    if(this.pool[3*i+2] > 2000) this.start = i;
  }
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      updateParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      updateParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      updateParticle.call(this, i);
    }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
SmokeParticles.prototype.render = function(elapsedTime, ctx) {
  function renderParticle(i){
    var alpha = 1 - (this.pool[3*i+2] / 1000);
    var radius = 0.1 * this.pool[3*i+2];
    if(radius > 5) radius = 5;
    ctx.beginPath();
    ctx.arc(
      this.pool[3*i],   // X position
      this.pool[3*i+1], // y position
      radius, // radius
      0,
      2*Math.PI
    );
    ctx.fillStyle = 'rgba(160, 160, 160,' + alpha + ')';
    ctx.fill();
  }

  // Render the particles individually
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      renderParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      renderParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      renderParticle.call(this, i);
    }
  }
}

},{}],10:[function(require,module,exports){
"use strict";

/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

/**
 * @function add
 * Computes the sum of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed sum
*/
function add(a, b) {
 return {x: a.x + b.x, y: a.y + b.y};
}

/**
 * @function subtract
 * Computes the difference of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed difference
 */
function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[1]);
