window.glUtils = (function (logger) {
  'use strict';

  var glUtils = {};

  glUtils.createShader = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!didCompile) {
      logger.error(gl.getShaderInfoLog(shader));

      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  glUtils.loadProgram = function (gl, shaders) {
    var program = gl.createProgram();
    shaders.forEach(function (shader) {
      gl.attachShader(program, shader);
    });

    gl.linkProgram(program);

    var didLink = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!didLink) {
      logger.error(gl.getProgramInfoLog(program));

      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  return glUtils;
}).call(this, logger);
