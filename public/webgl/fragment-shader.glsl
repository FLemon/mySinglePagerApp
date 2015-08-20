precision mediump float;

varying vec4 v_color;
varying highp vec2 v_texture_coord;

uniform sampler2D u_sampler;

void main() {
  vec4 tex_color = texture2D(u_sampler, v_texture_coord.xy);

  gl_FragColor = tex_color * v_color;
}
