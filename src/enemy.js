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
