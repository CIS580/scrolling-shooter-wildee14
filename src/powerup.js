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
