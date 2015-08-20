window.flames = (function (window, logger, glUtils, jQuery, ParticleSystem) {
  'use strict';

  var flames = {};

  flames._enabled = false;

  flames.enable = function () {
    flames._enabled = true;
  };

  flames.disable = function () {
    flames._enabled = false;
  };

  jQuery.ajax({
    async: false,
    url: 'webgl/vertex-shader.glsl',
    success: function (source) {
      flames._vertexShaderSource = source;
      logger.info('Successfully loaded vertex shader source');
    }
  });

  jQuery.ajax({
    async: false,
    url: 'webgl/fragment-shader.glsl',
    success: function (source) {
      flames._fragmentShaderSource = source;
      logger.info('Successfully loaded fragment shader source');
    }
  });

  flames.genYPoint = function () {
    return 0.0;
  };

  flames.genXPoint = function () {
    return 200.0*(Math.random() - 0.5) + 250.0;
  };

  flames.loadTextures = function () {
    flames._textures = [];
    flames._images = [];

    var gl = flames._glContext;
    var textures = flames._textures;
    var images = flames._images;
    var imagePath = 'assets/images/flame.png';

    textures[0] = gl.createTexture();
    images[0] = new Image();
    images[0].onload = function () {
      // do something
      logger.info('Successfully loaded image: "' + imagePath + '"');

      gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[0]);

      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);

      flames.animate();
    };

    images[0].onerror = function () {
      logger.error(imagePath + ' could not be loaded!');
    };

    images[0].src = imagePath;
    logger.info('Loading up image: "' + imagePath + '"');
  };

  flames.loadShaders = function () {
    flames._glProgram = {
      attrs: {},
      arrayBuffers: {},
      uniforms: {}
    };

    var gl = flames._glContext;
    var glProgram = flames._glProgram;
    var attrs = glProgram.attrs;
    var uniforms = glProgram.uniforms;
    var arrayBuffers = glProgram.arrayBuffers;

    var vertexShader = glUtils.createShader(gl, gl.VERTEX_SHADER, flames._vertexShaderSource);
    var fragmentShader = glUtils.createShader(gl, gl.FRAGMENT_SHADER, flames._fragmentShaderSource);
    var program = glUtils.loadProgram(gl, [vertexShader, fragmentShader]);

    gl.useProgram(program);

    glProgram.ref = program;

    arrayBuffers.position = gl.createBuffer();
    arrayBuffers.color = gl.createBuffer();
    arrayBuffers.uv = gl.createBuffer();

    attrs.position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(attrs.position);

    attrs.color = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(attrs.color);

    attrs.uv = gl.getAttribLocation(program, 'a_texture_coord');
    gl.enableVertexAttribArray(attrs.uv);

    uniforms.resolution = gl.getUniformLocation(program, 'u_resolution');
    uniforms.sampler = gl.getUniformLocation(program, 'u_sampler');
  };

  flames.renderParticles = function (particles) {
    var buffers = flames._buffers;
    var positions = buffers.position;
    var colors = buffers.color;
    var uvs = buffers.uv;

    var particle = null;
    var x1 = 0.0;
    var x2 = 0.0;
    var y1 = 0.0;
    var y2 = 0.0;
    var index = 0;
    var idx = 0;

    var len = particles.length;
    var i = len;
    var j = 0;
    while (i--) {
      particle = particles[i];
      x1 = particle.x - particle.width/2;
      x2 = particle.x + particle.width/2;
      y1 = particle.y - particle.height/2;
      y2 = particle.y + particle.height/2;

      index = 6 * 2 * i;
      positions[index +  0] = x1; positions[index +  1] = y1;
      positions[index +  2] = x2; positions[index +  3] = y1;
      positions[index +  4] = x1; positions[index +  5] = y2;
      positions[index +  6] = x1; positions[index +  7] = y2;
      positions[index +  8] = x2; positions[index +  9] = y1;
      positions[index + 10] = x2; positions[index + 11] = y2;

      uvs[index +  0] = 0.0; uvs[index +  1] = 0.0;
      uvs[index +  2] = 1.0; uvs[index +  3] = 0.0;
      uvs[index +  4] = 0.0; uvs[index +  5] = 1.0;
      uvs[index +  6] = 0.0; uvs[index +  7] = 1.0;
      uvs[index +  8] = 1.0; uvs[index +  9] = 0.0;
      uvs[index + 10] = 1.0; uvs[index + 11] = 1.0;

      for (j = 0; j < 6; j++) {
        idx = 4 * j + 6 * 4 * i;

        colors[idx + 0] = particle.r;
        colors[idx + 1] = particle.g;
        colors[idx + 2] = particle.b;
        colors[idx + 3] = particle.a;
      }
    }

    var gl = flames._glContext;
    var texture = flames._textures[0];

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    var attrs = flames._glProgram.attrs;
    var arrayBuffers = flames._glProgram.arrayBuffers;

    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffers.uv);
    gl.vertexAttribPointer(attrs.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffers.position);
    gl.vertexAttribPointer(attrs.position, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffers.color);
    gl.vertexAttribPointer(attrs.color, 4, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 6*particles.length);

    gl.bindTexture(gl.TEXTURE_2D, null);
  };

  flames.render = function () {
    var gl = flames._glContext;
    var glProgram = flames._glProgram;
    var uniforms = glProgram.uniforms;
    var canvas = flames._canvas;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1i(uniforms.sampler, 0);

    flames.renderParticles(flames._particleCollection.particles());
  };

  flames.animate = function () {
    window.requestAnimationFrame(flames.animate);

    if (!flames._enabled) {
      return;
    }

    flames._particleCollection.update();
    flames.render();
  };

  flames.init = function (canvas) {
    var gl = canvas.getContext('experimental-webgl');

    if (!gl) {
      logger.info('Your browser does not support WebGL, please go away');
      return;
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    flames._canvas = canvas;
    flames._glContext = gl;
    flames._buffers = {
      position: [],
      color: [],
      uv: []
    };

    flames._particleCollection = new ParticleSystem({
      particleCount: 300,
      particleSize: 100,
      xBounds: [0, canvas.width],
      yBounds: [0, canvas.height]
    });

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);

    flames.loadTextures();
    flames.loadShaders();
  };

  return flames;
}).call(this, window, logger, glUtils, jQuery, ParticleSystem);
