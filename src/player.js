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
