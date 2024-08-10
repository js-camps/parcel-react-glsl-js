precision mediump float;
attribute vec3 position;
uniform mat4 uMatrix;
varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = uMatrix * vec4(position, 1.0);
}
