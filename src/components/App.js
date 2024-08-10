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
