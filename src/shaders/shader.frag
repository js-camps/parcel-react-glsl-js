precision mediump float;
varying vec2 vUv;
uniform float uTime;

vec3 rainbow(float t) {
    float r = 0.5 + 0.5 * cos(6.28318 * (t + 0.0 / 3.0));
    float g = 0.5 + 0.5 * cos(6.28318 * (t + 1.0 / 3.0));
    float b = 0.5 + 0.5 * cos(6.28318 * (t + 2.0 / 3.0));
    return vec3(r, g, b);
}

void main() {
    float timeOffset = uTime * 0.1; // Control the speed of animation
    gl_FragColor = vec4(rainbow(vUv.x + timeOffset), 1.0);
}
