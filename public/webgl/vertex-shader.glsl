uniform vec2 u_resolution;

attribute vec2 a_position;
attribute vec4 a_color;
attribute vec2 a_texture_coord;

varying vec4 v_color;
varying vec2 v_texture_coord;

void main() {
  vec2 clipSpace = 2.0 * (a_position / u_resolution) - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);
  v_color = a_color;
  v_texture_coord = a_texture_coord;
}
