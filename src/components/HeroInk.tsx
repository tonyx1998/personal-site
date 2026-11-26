"use client";

import { useEffect, useRef, type RefObject } from "react";
import styles from "./Exhibition.module.css";

/**
 * Draws the heading as ink that the pointer can push around.
 *
 * At rest the canvas shows the heading exactly where the text is, so nothing
 * changes until someone moves across it. Then the letters are carried along
 * like wet ink, a second layer in the page's yellow shows from under them,
 * and both flow back. The heading stays real text in the page: without
 * JavaScript, without WebGL 2 or with reduced motion it is simply the text.
 *
 * No library is used. The whole effect is a small fluid simulation on a
 * coarse grid (a few thousand cells) and one pass that draws the text through
 * it, so it adds a few kilobytes and runs only while the ink is moving.
 */

const VERTEX = `#version 300 es
in vec2 corner;
out vec2 uv;
void main() {
  uv = corner * 0.5 + 0.5;
  gl_Position = vec4(corner, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 result;
uniform vec2 texel;
`;

// Carries a field along the flow, and lets it fade.
const ADVECT =
  HEAD +
  `uniform sampler2D velocity;
uniform sampler2D source;
uniform float dt;
uniform float keep;
void main() {
  vec2 from = uv - dt * texture(velocity, uv).xy * texel;
  result = keep * texture(source, from);
}`;

// Adds one push of the pointer to the flow.
const SPLAT =
  HEAD +
  `uniform sampler2D base;
uniform vec2 point;
uniform vec2 push;
uniform float radius;
uniform float aspect;
void main() {
  vec2 d = uv - point;
  d.x *= aspect;
  result = texture(base, uv) + vec4(push, 0.0, 0.0) * exp(-dot(d, d) / radius);
}`;

// The next three keep the flow from piling up or thinning out, which is what
// makes it curl like a liquid instead of smearing in a straight line.
const DIVERGENCE =
  HEAD +
  `uniform sampler2D velocity;
void main() {
  float l = texture(velocity, uv - vec2(texel.x, 0.0)).x;
  float r = texture(velocity, uv + vec2(texel.x, 0.0)).x;
  float b = texture(velocity, uv - vec2(0.0, texel.y)).y;
  float t = texture(velocity, uv + vec2(0.0, texel.y)).y;
  result = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}`;

const PRESSURE =
  HEAD +
  `uniform sampler2D pressure;
uniform sampler2D divergence;
void main() {
  float l = texture(pressure, uv - vec2(texel.x, 0.0)).x;
  float r = texture(pressure, uv + vec2(texel.x, 0.0)).x;
  float b = texture(pressure, uv - vec2(0.0, texel.y)).x;
  float t = texture(pressure, uv + vec2(0.0, texel.y)).x;
  result = vec4((l + r + b + t - texture(divergence, uv).x) * 0.25, 0.0, 0.0, 1.0);
}`;

const RELEASE =
  HEAD +
  `uniform sampler2D pressure;
uniform sampler2D velocity;
void main() {
  float l = texture(pressure, uv - vec2(texel.x, 0.0)).x;
  float r = texture(pressure, uv + vec2(texel.x, 0.0)).x;
  float b = texture(pressure, uv - vec2(0.0, texel.y)).x;
  float t = texture(pressure, uv + vec2(0.0, texel.y)).x;
  result = vec4(texture(velocity, uv).xy - 0.5 * vec2(r - l, t - b), 0.0, 1.0);
}`;

// How far the ink has been carried from its place. It follows the flow and
// relaxes back to nothing, which is the letters returning.
const DRIFT =
  HEAD +
  `uniform sampler2D velocity;
uniform sampler2D drift;
uniform float dt;
uniform float keep;
uniform float gain;
uniform float limit;
void main() {
  vec2 v = texture(velocity, uv).xy;
  vec2 d = keep * texture(drift, uv - dt * v * texel).xy + v * dt * gain;
  float far = length(d);
  if (far > limit) d *= limit / far;
  result = vec4(d, 0.0, 1.0);
}`;

// Draws the text through the drift: the ink, and under it the same letters in
// the second colour, carried further so they show at the edges.
const SHOW =
  HEAD +
  `uniform sampler2D drift;
uniform sampler2D words;
uniform vec3 ink;
uniform vec3 under;
uniform float spread;
void main() {
  vec2 d = texture(drift, uv).xy * texel;
  float top = texture(words, uv - d).a;
  float below = texture(words, uv - d * spread).a;
  // The second colour only shows where it has got out from under the ink,
  // so at rest the edges of the letters are exactly the text's own.
  float out_ = max(below - top, 0.0);
  result = vec4(ink * top + under * out_, top + out_);
}`;

/** Size of one simulation cell, in CSS pixels. */
const CELL = 6;
/** Seconds the simulation keeps running after the last push. */
const SETTLE = 3;

type Target = { texture: WebGLTexture; buffer: WebGLFramebuffer };
type Pair = { read: Target; write: Target };
type Push = { x: number; y: number; vx: number; vy: number; size: number };

/** Turns any CSS colour into three numbers from 0 to 1. */
function colour(value: string): [number, number, number] {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const g = probe.getContext("2d");
  if (!g) return [0, 0, 0];
  g.fillStyle = value;
  g.fillRect(0, 0, 1, 1);
  const [r, green, b] = g.getImageData(0, 0, 1, 1).data;
  return [r / 255, green / 255, b / 255];
}

function startInk(title: HTMLElement, canvas: HTMLCanvasElement) {
  const letters = title.firstChild;
  if (!(letters instanceof Text) || !letters.data.trim()) return null;
  // The ink is only worth having where a graphics card draws it. A browser
  // that would fall back to drawing in software (many remote desktops, test
  // machines) keeps the plain heading, so the page costs it nothing.
  const maybe = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!maybe) return null;
  const names = maybe.getExtension("WEBGL_debug_renderer_info");
  const renderer = names
    ? String(maybe.getParameter(names.UNMASKED_RENDERER_WEBGL))
    : "";
  // The flow is stored as small half-float pictures, which the browser must
  // be able to draw into.
  if (
    /swiftshader|llvmpipe|software|basic render/i.test(renderer) ||
    !(
      maybe.getExtension("EXT_color_buffer_float") ||
      maybe.getExtension("EXT_color_buffer_half_float")
    )
  ) {
    maybe.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  const gl: WebGL2RenderingContext = maybe;

  const style = getComputedStyle(title);
  const inkColour = colour(style.color);
  const underColour = colour(
    style.getPropertyValue("--exhibition-yellow").trim() || "#f5fa00"
  );

  // --- shaders ---------------------------------------------------------
  function program(fragment: string) {
    const made = gl.createProgram();
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("no shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(made, shader);
    }
    gl.bindAttribLocation(made, 0, "corner");
    gl.linkProgram(made);
    if (!gl.getProgramParameter(made, gl.LINK_STATUS)) {
      throw new Error("shader did not link");
    }
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(made, gl.ACTIVE_UNIFORMS) as number;
    for (let index = 0; index < count; index++) {
      const name = gl.getActiveUniform(made, index)?.name;
      if (name) uniforms[name] = gl.getUniformLocation(made, name);
    }
    return { made, uniforms };
  }
  const advect = program(ADVECT);
  const splat = program(SPLAT);
  const divergence = program(DIVERGENCE);
  const pressure = program(PRESSURE);
  const release = program(RELEASE);
  const drift = program(DRIFT);
  const show = program(SHOW);
  // One triangle that covers the whole target.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // --- state that depends on the heading's size ------------------------
  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let margin = 0;
  let velocity: Pair | null = null;
  let carried: Pair | null = null;
  let squeeze: Pair | null = null;
  let spreadOut: Target | null = null;
  let words: WebGLTexture | null = null;
  let owned: (WebGLTexture | WebGLFramebuffer)[] = [];

  function target(format: number, layout: number): Target | null {
    const texture = gl.createTexture();
    const buffer = gl.createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format,
      cols,
      rows,
      0,
      layout,
      gl.HALF_FLOAT,
      null
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    const ready =
      gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    owned.push(texture, buffer);
    return ready ? { texture, buffer } : null;
  }
  function pair(format: number, layout: number): Pair | null {
    const read = target(format, layout);
    const write = target(format, layout);
    return read && write ? { read, write } : null;
  }

  /** Measures the heading, paints its letters and sizes everything to it. */
  function measure() {
    for (const item of owned) {
      if (item instanceof WebGLTexture) gl.deleteTexture(item);
      else gl.deleteFramebuffer(item);
    }
    owned = [];
    const text = letters as Text;
    const box = title.getBoundingClientRect();
    const type = getComputedStyle(title);
    margin = Math.round(parseFloat(type.fontSize) * 0.8);
    width = Math.ceil(box.width) + margin * 2;
    height = Math.ceil(box.height) + margin * 2;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    canvas.style.left = title.offsetLeft - margin + "px";
    canvas.style.top = title.offsetTop - margin + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    cols = Math.max(16, Math.ceil(width / CELL));
    rows = Math.max(8, Math.ceil(height / CELL));

    // Each character is drawn where the browser placed it, so spacing and
    // kerning are the page's own.
    const sheet = document.createElement("canvas");
    sheet.width = canvas.width;
    sheet.height = canvas.height;
    const g = sheet.getContext("2d");
    if (!g) return false;
    g.scale(density, density);
    g.font = `${type.fontWeight} ${type.fontSize} ${type.fontFamily}`;
    g.fillStyle = "#fff";
    g.textBaseline = "alphabetic";
    const metrics = g.measureText("H");
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    const range = document.createRange();
    for (let index = 0; index < text.data.length; index++) {
      const character = text.data[index];
      if (!character.trim()) continue;
      range.setStart(text, index);
      range.setEnd(text, index + 1);
      const at = range.getBoundingClientRect();
      g.fillText(
        character,
        at.left - box.left + margin,
        at.top - box.top + margin + (at.height - ascent - descent) / 2 + ascent
      );
    }
    words = gl.createTexture();
    owned.push(words);
    gl.bindTexture(gl.TEXTURE_2D, words);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sheet);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    velocity = pair(gl.RG16F, gl.RG);
    carried = pair(gl.RG16F, gl.RG);
    squeeze = pair(gl.R16F, gl.RED);
    spreadOut = target(gl.R16F, gl.RED);
    return Boolean(velocity && carried && squeeze && spreadOut);
  }

  // --- drawing ---------------------------------------------------------
  type Program = ReturnType<typeof program>;
  function run(
    step: Program,
    into: Target | null,
    inputs: Record<string, WebGLTexture>,
    numbers: Record<string, number | number[]>
  ) {
    gl.useProgram(step.made);
    gl.bindFramebuffer(gl.FRAMEBUFFER, into ? into.buffer : null);
    if (into) gl.viewport(0, 0, cols, rows);
    else gl.viewport(0, 0, canvas.width, canvas.height);
    let unit = 0;
    for (const [name, texture] of Object.entries(inputs)) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(step.uniforms[name], unit++);
    }
    gl.uniform2f(step.uniforms.texel, 1 / cols, 1 / rows);
    for (const [name, value] of Object.entries(numbers)) {
      const place = step.uniforms[name];
      if (typeof value === "number") gl.uniform1f(place, value);
      else if (value.length === 2) gl.uniform2f(place, value[0], value[1]);
      else gl.uniform3f(place, value[0], value[1], value[2]);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  const flip = (both: Pair) => {
    const kept = both.read;
    both.read = both.write;
    both.write = kept;
  };

  function draw() {
    if (!carried || !words) return;
    gl.clearColor(0, 0, 0, 0);
    run(
      show,
      null,
      { drift: carried.read.texture, words },
      { ink: inkColour, under: underColour, spread: 1.8 }
    );
  }

  const pushes: Push[] = [];

  // --- the loop: it runs only while there is something to see ----------
  let frame = 0;
  let previous = 0;
  let quietAt = 0;
  let stopped = false;
  function tick(now: number) {
    frame = 0;
    if (stopped) return;
    const dt = Math.min(0.033, Math.max(0.001, (now - previous) / 1000));
    previous = now;
    advance(dt);
    draw();
    if (now < quietAt) frame = requestAnimationFrame(tick);
    else rest();
  }
  /** One step of the flow, and of the ink it carries. */
  function advance(dt: number) {
    if (!velocity || !spreadOut || !squeeze || !carried) return;
    run(
      advect,
      velocity.write,
      { velocity: velocity.read.texture, source: velocity.read.texture },
      { dt, keep: Math.exp(-3.2 * dt) }
    );
    flip(velocity);
    for (const push of pushes.splice(0, 10)) {
      run(
        splat,
        velocity.write,
        { base: velocity.read.texture },
        {
          point: [push.x, push.y],
          push: [push.vx, push.vy],
          radius: push.size * push.size,
          aspect: width / height,
        }
      );
      flip(velocity);
    }
    run(divergence, spreadOut, { velocity: velocity.read.texture }, {});
    for (let round = 0; round < 14; round++) {
      run(
        pressure,
        squeeze.write,
        { pressure: squeeze.read.texture, divergence: spreadOut.texture },
        {}
      );
      flip(squeeze);
    }
    run(
      release,
      velocity.write,
      { pressure: squeeze.read.texture, velocity: velocity.read.texture },
      {}
    );
    flip(velocity);
    run(
      drift,
      carried.write,
      { velocity: velocity.read.texture, drift: carried.read.texture },
      { dt, keep: Math.exp(-2.4 * dt), gain: 0.46, limit: 9.5 }
    );
    flip(carried);
  }
  /** Puts the ink exactly back and stops drawing. */
  function rest() {
    for (const both of [velocity, carried, squeeze]) {
      if (!both) continue;
      for (const one of [both.read, both.write]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, one.buffer);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    draw();
  }
  function wake() {
    quietAt = performance.now() + SETTLE * 1000;
    if (!frame && !stopped) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  // --- what moves the ink ----------------------------------------------
  let last: { x: number; y: number; at: number } | null = null;
  function moved(event: PointerEvent) {
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const near =
      x > -60 && y > -60 && x < box.width + 60 && y < box.height + 60;
    if (near && last && event.timeStamp - last.at < 120) {
      const dt = Math.max(0.008, (event.timeStamp - last.at) / 1000);
      pushes.push({
        x: x / box.width,
        y: 1 - y / box.height,
        vx: ((x - last.x) / dt / CELL) * 0.5,
        vy: (-(y - last.y) / dt / CELL) * 0.5,
        size: Math.max(0.16, 46 / box.height),
      });
      wake();
    }
    last = near ? { x, y, at: event.timeStamp } : null;
  }
  // Scrolling drags the whole name a little, so it also lives on a phone.
  let scrolledTo = window.scrollY;
  let scrolledAt = performance.now();
  function scrolled() {
    const now = performance.now();
    const dt = Math.max(0.016, (now - scrolledAt) / 1000);
    const speed = (window.scrollY - scrolledTo) / dt;
    scrolledTo = window.scrollY;
    scrolledAt = now;
    const box = canvas.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return;
    for (const x of [0.2, 0.45, 0.7]) {
      pushes.push({
        x,
        y: 0.5,
        vx: 0,
        vy: Math.max(-90, Math.min(90, (speed / CELL) * 0.2)),
        size: 0.5,
      });
    }
    wake();
  }

  if (!measure()) return null;
  draw();
  canvas.style.visibility = "visible";
  title.dataset.ink = "on";

  // One light stroke across the name when it first appears, so it is clear
  // that the letters are loose.
  const strokes: number[] = [];
  for (let index = 0; index < 16; index++) {
    strokes.push(
      window.setTimeout(
        () => {
          pushes.push({
            x: 0.08 + index * 0.04,
            y: 0.5 + Math.sin(index * 0.7) * 0.08,
            vx: 55,
            vy: Math.cos(index * 0.7) * 16,
            size: 0.22,
          });
          wake();
        },
        500 + index * 22
      )
    );
  }

  let again: number | undefined;
  const sizes = new ResizeObserver(() => {
    window.clearTimeout(again);
    again = window.setTimeout(() => {
      if (stopped) return;
      canvas.style.visibility = "hidden";
      if (measure()) draw();
      canvas.style.visibility = "visible";
    }, 150);
  });
  sizes.observe(title);
  const lost = (event: Event) => {
    event.preventDefault();
    stop();
  };
  canvas.addEventListener("webglcontextlost", lost);
  window.addEventListener("pointermove", moved, { passive: true });
  window.addEventListener("scroll", scrolled, { passive: true });

  function stop() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(again);
    strokes.forEach((timer) => window.clearTimeout(timer));
    sizes.disconnect();
    canvas.removeEventListener("webglcontextlost", lost);
    window.removeEventListener("pointermove", moved);
    window.removeEventListener("scroll", scrolled);
    delete title.dataset.ink;
    canvas.style.visibility = "hidden";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return { stop };
}

export default function HeroInk({
  heading,
}: {
  heading: RefObject<HTMLElement | null>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const title = heading.current;
    const view = canvas.current;
    if (!title || !view) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ink: { stop: () => void } | null = null;
    let cancelled = false;
    const begin = () => {
      if (cancelled) return;
      try {
        ink = startInk(title, view);
      } catch {
        // A browser that cannot build the shaders keeps the plain heading.
        delete title.dataset.ink;
      }
    };
    void document.fonts.ready.then(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(begin, { timeout: 2000 });
      } else {
        setTimeout(begin, 300);
      }
    });
    return () => {
      cancelled = true;
      ink?.stop();
    };
  }, [heading]);
  return <canvas ref={canvas} className={styles.ink} aria-hidden="true" />;
}
