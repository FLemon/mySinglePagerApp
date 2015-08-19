window.ParticleSystem = (function (noise) {
  'use strict';

  function Particle(lifespan) {
    this.x = 1e32;
    this.y = 1e32;

    this.vx = 0.0;
    this.vy = 0.0;

    this.width = 10;
    this.height = 10;

    this.r = 1.0;
    this.g = 0.27;
    this.b = 0.07;
    this.a = 0.8;

    this.lifespan = lifespan;
  }

  function ParticleSystem(inputOptions) {
    var options = inputOptions || {};

    this._particles = [];

    this._particleSize = options.particleSize || 0.1;
    this._xBounds = options.xBounds || [-1, 1];
    this._yBounds = options.yBounds || [-1, 1];
    this._maxLifespan = 70;
    this._startTime = (new Date()).getTime();

    var i = 0;
    var count = options.particleCount || 100;
    for (i = 0; i < count; i++) {
      this._particles[i] = new Particle(Math.floor(this._maxLifespan * i / count));
    }
  }


  ParticleSystem.prototype.particles = function () {
    return this._particles;
  };


  ParticleSystem.prototype.genX = function () {
    return this._xBounds[0] + (this._xBounds[1] - this._xBounds[0]) * (0.2 + 0.6 * Math.random());
  };


  ParticleSystem.prototype.genY = function () {
    return this._yBounds[0] + (this._yBounds[1] - this._yBounds[0]) * (-0.1 + 0.1 * Math.random());
  };


  ParticleSystem.prototype.genVelX = function () {
    return 0.0002 * (Math.random() - 0.5) * (this._xBounds[1] - this._xBounds[0]);
  };


  ParticleSystem.prototype.genVelY = function () {
    return (0.001 + 0.005*Math.random()) * (this._yBounds[1] - this._yBounds[0]);
  };


  ParticleSystem.prototype.normalizeX = function (x) {
    return (x - this._xBounds[0]) / (this._xBounds[1] - this._xBounds[0]);
  };


  ParticleSystem.prototype.normalizeY = function (y) {
    return (y - this._yBounds[0]) / (this._yBounds[1] - this._yBounds[0]);
  };


  ParticleSystem.prototype.update = function () {
    var particles = this.particles();
    var maxLifespan = this._maxLifespan;
    var particleSize = this._particleSize;

    var t = Math.PI * (1.0 + 0.003 * ((new Date()).getTime() - this._startTime));
    var particle = null;
    var i = particles.length;
    var size = 0;
    var multiplier = 0;
    var angle = 0;
    while (i--) {
      particle = particles[i];

      particle.lifespan -= 1;
      if (particle.lifespan < 0) {
        particle.width = particleSize;
        particle.height = particleSize;

        particle.x = this.genX();
        particle.y = this.genY();

        particle.vx = 0.0;
        particle.vy = 0.8;

        particle.r = 1.0;
        particle.g = 0.27;
        particle.b = 0.07;
        particle.a = 0.8;

        particle.lifespan = maxLifespan;
      } else {
        angle = Math.PI/2 + noise.simplex3(10*this.normalizeX(particle.x), 10*this.normalizeY(particle.y), t);
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx += 0.1 * Math.cos(angle);
        particle.vy += 0.1 * Math.sin(angle);
      }

      multiplier = Math.pow(particle.lifespan / maxLifespan, 0.5);
      size = particleSize * multiplier;
      particle.width = size;
      particle.height = size;
      particle.a = 0.8 * multiplier;
    }
  };


  return ParticleSystem;
}).call(this, noise);
