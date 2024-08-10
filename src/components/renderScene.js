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
