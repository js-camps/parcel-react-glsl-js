# js-parcel-react-3d_glsl

Project structure

```
/js-parcel-react-glsl
├── src 
│  ├── components
│  │   ├── App.js 
│  │   ├── glUtils.js
│  │   └── renderScene.js
│  ├── shaders
│  │   ├── shader.frag
│  │   └── shader.vert
│  ├── index.html 
│  └── index.js
├── .gitignore 
├── package.json 
└── Readme.md
```

install `gl-matrix`

```
npm i gl-matrix 
```

`src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Parcel App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

`src/index.js`
```js
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
```

`src/components/App.js`
```js
import { useEffect, useRef } from "react";
import fragShaderSource from "../shaders/shader.frag";
import vertShaderSource from "../shaders/shader.vert";
import { createShader, createProgram } from "./glUtils";
import { renderScene } from "./renderScene";

export function App() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");

        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        renderScene(gl, program);
    }, []);

    return <canvas ref={canvasRef} width="400" height="400"></canvas>;
}
```

`src/components/glUtils.js`
```js
export const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

export const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
};
```

`src/components/renderScene.js`
```js
import { mat4 } from 'gl-matrix';

export const renderScene = (gl, program) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
        // Back face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
    ]), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        // Front face
        0, 1, 2,  1, 3, 2,
        // Back face
        4, 5, 6,  5, 7, 6,
        // Top face
        2, 3, 6,  3, 7, 6,
        // Bottom face
        0, 1, 4,  1, 5, 4,
        // Right face
        1, 3, 5,  3, 7, 5,
        // Left face
        0, 2, 4,  2, 6, 4,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);  // Ensure the program is set before retrieving uniform locations

    const uMatrixLocation = gl.getUniformLocation(program, "uMatrix");
    const uTimeLocation = gl.getUniformLocation(program, "uTime");

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const fieldOfView = Math.PI / 4;
    const zNear = 0.1;
    const zFar = 100.0;

    let rotation = 0;

    const render = (time) => {
        rotation += 0.01;
        const projectionMatrix = mat4.perspective(mat4.create(), fieldOfView, aspect, zNear, zFar);
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -2]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 1, 0]);

        const finalMatrix = mat4.multiply(mat4.create(), projectionMatrix, modelViewMatrix);

        gl.uniformMatrix4fv(uMatrixLocation, false, finalMatrix);
        gl.uniform1f(uTimeLocation, time * 0.001); // Convert milliseconds to seconds

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};
```

`src/shaders/shader.frag`
```
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
```

`src/shaders/shader.vert`
```
precision mediump float;
attribute vec3 position;
uniform mat4 uMatrix;
varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = uMatrix * vec4(position, 1.0);
}
```

```package.json```
```json
{
  "scripts": {
    "start": "parcel src/index.html"
  },
  "devDependencies": {
    "@parcel/transformer-glsl": "^2.12.0",
    "parcel": "^2.12.0",
    "process": "^0.11.10"
  },
  "dependencies": {
    "gl-matrix": "^3.4.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```
