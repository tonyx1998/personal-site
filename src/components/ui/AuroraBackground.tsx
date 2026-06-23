"use client";

import { useEffect, useRef } from "react";

/**
 * Aurora drift — a single full-screen WebGL fragment shader rendering slow,
 * domain-warped fbm noise in the site's indigo→violet palette. No 3D scene,
 * no Three.js: one triangle, a few KB of GLSL. Replaces the Aceternity
 * Spotlight. Honors prefers-reduced-motion (renders one static frame), caps
 * device-pixel-ratio, and pauses its rAF loop when the tab is hidden.
 */

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.05;

  // domain warp for flowing, organic bands
  vec2 q = vec2(
    fbm(p * 1.5 + vec2(0.0, t)),
    fbm(p * 1.5 + vec2(5.2, t * 1.3))
  );
  float n = fbm(p * 2.0 + q * 1.6 + vec2(t * 0.5, 0.0));

  float bands = smoothstep(0.2, 0.9, n);

  vec3 indigo = vec3(0.310, 0.275, 0.898); // #4f46e5
  vec3 violet = vec3(0.659, 0.333, 0.969); // #a855f7
  vec3 lightIndigo = vec3(0.506, 0.549, 0.972); // #818cf8
  vec3 col = mix(indigo, violet, bands);
  col = mix(col, lightIndigo, smoothstep(0.6, 1.0, n) * 0.5);

  // brighter toward the top, dimmed through the center so text stays legible
  float topGlow = smoothstep(1.0, 0.15, uv.y);
  float radial = smoothstep(0.0, 0.55, distance(uv, vec2(0.5, 0.58)));
  float centerFade = mix(0.3, 1.0, radial);

  float intensity = bands * topGlow * centerFade;
  float alpha = clamp(intensity * 0.6 * u_intensity, 0.0, 0.85);

  // premultiplied alpha (context created with premultipliedAlpha: true)
  gl_FragColor = vec4(col * alpha, alpha);
}`;

export default function AuroraBackground({
  intensity = 1,
}: {
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return; // graceful no-op if WebGL is unavailable

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // single full-screen triangle
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uInt = gl.getUniformLocation(program, "u_intensity");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (seconds: number) => {
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uInt, intensityRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      resize();
      draw((now - start) / 1000);
      if (running) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(8.0);
    });
    ro.observe(canvas);

    if (reduceMotion) {
      draw(8.0); // one settled static frame
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduceMotion && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
