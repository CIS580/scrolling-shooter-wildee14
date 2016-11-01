"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const Enemy = require('./enemy');
const BulletPool = require('./bullet_pool');
const Particles = require('./smoke_particles');
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
  enemies.push(new Enemy(level,bulletsEnemy[i],{x:i*200+200, y:700}));
}
var exploded = [];

//1. load image
var background = new Image();
background.src = 'assets/Levels/Level1/map.png';
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
      for (var i = 0; i < enemies.length; i++) {
        enemies[i].fireBullet(player.position);
      }
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
  end = Date.now();
  var total = Math.floor((end-start)*.001);
  start = Date.now();
  player.score+=total*10;
  player.score+=level*100;
  setTimeout(function(){     document.getElementById('score').innerHTML =
                            "Level Summary:"+level+" Score: "+
                            player.score+" Health: "+player.health+
                            "</br>Time: "+total + " seconds";}, 3000);
  console.log(Math.floor((end-start)*.001) + " seconds");

  level++;
  player.position.y = 100;
  console.log(level);
  enemies = [];
  exploded = [];
  var bulletsEnemy =  [];
  for (var i = 0; i < 3*level; i++) {
    bulletsEnemy.push(new BulletPool(10));
  }

  for (var i = 0; i < 2*level; i++) {
    enemies.push(new Enemy(level,bulletsEnemy[i],{x:i*100+50, y:700}));
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

  // update the player
  player.update(elapsedTime, input);
  if(player.position.y>=2000) nextLevel();

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
    enemies[i].update();
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
