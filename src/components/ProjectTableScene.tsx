"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import {
  Suspense,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

export type ScenePrint = {
  slug: string;
  href: string;
  /** Centre of the print on the mat, in CSS pixels from the mat's top left. */
  cx: number;
  cy: number;
  /** Size in CSS pixels. */
  w: number;
  h: number;
  /** Clockwise turn in degrees, as CSS rotates it. */
  turn: number;
  /** 0 for a print on the mat, 1 for one that starts on top of another. */
  layer: number;
  /** The flat print on the page that this one is painted from. */
  paper: HTMLElement;
};

export type SceneProps = {
  prints: ScenePrint[];
  /** Size of the mat in CSS pixels. */
  width: number;
  height: number;
  /** Token colours, read from the page so the scene has none of its own. */
  accent: string;
  ink: string;
  /** Raise this number to send every print back to where it started. */
  tidy: number;
  /** Slug of the print to outline, or null. */
  highlighted: string | null;
  /**
   * The visitor turned the scene on by hand. There is no opening movement and
   * no travel when tidying, and the scene is not switched off for being slow.
   */
  still: boolean;
  /** False while the mat is scrolled out of view. */
  visible: boolean;
  onReady: () => void;
  /** Called once if the device draws fewer than about 20 frames a second. */
  onSlow: () => void;
  /** Called when the visitor has put a print somewhere else. */
  onMoved: () => void;
  onOpen: (href: string) => void;
};

// The camera looks straight down, and one world unit is 100 CSS pixels at the
// height of a resting print. A print that lies flat is therefore drawn at the
// same place and size as the flat print in the page, so the two can swap
// without a jump. Depth only shows when a print is lifted, leaned or stacked.
const UNIT = 100;
const THICK = 0.045;
const CAMERA = 9;
/** How high a held print is carried above the table. */
const CARRY = 0.3;
const GRAVITY = -30;
/** How quickly a held print catches up with the pointer, per second. */
const FOLLOW = 22;
/** Lean of a held print, in radians per unit of speed, and its limit. */
const LEAN = 0.03;
const MAX_LEAN = 0.3;
const MAX_THROW = 14;
const SPIN = 0.3;
const HOP = 2.6;
/** How long a finger must rest on a print before the print is picked up. */
const HOLD_MS = 170;
const PAPER_EDGE = "#e7e9e5";

// Light. Ambient plus sun adds up to exactly one on a surface that faces up,
// so white paper is white and the screenshots keep their colours. The sun only
// shades a print that leans; shadows are drawn separately, below.
const SUN_SHARE = 0.16;
const SUN_FROM = new THREE.Vector3(-4.8, 9, -6);
const AMBIENT = Math.PI * (1 - SUN_SHARE);
const SUN = (Math.PI * SUN_SHARE) / SUN_FROM.clone().normalize().y;

// Shadows are soft pictures of a rectangle, drawn the way a browser draws a
// box-shadow (offsets and blur in CSS pixels). A print that lies flat has the
// tight one, which must stay in step with the box-shadow of .paper in
// ProjectTable.module.css. As a print rises, that fades into the wide one,
// which also slides away from the print: about 16 pixels right and 20 down at
// carrying height. Both darken the mat and other prints alike.
const CONTACT = {
  pad: 24,
  scale: 1.5,
  layers: [
    { x: 1, y: 2, blur: 3, alpha: 0.12 },
    { x: 3, y: 5, blur: 10, alpha: 0.1 },
  ],
};
const DROP = {
  pad: 56,
  scale: 0.5,
  layers: [{ x: 0, y: 0, blur: 34, alpha: 0.17 }],
};
/** The height at which the wide shadow has fully replaced the tight one. */
const DROP_FULL = 0.2;
const DROP_X = 0.53;
const DROP_Z = 0.67;

const UP = new THREE.Vector3(0, 1, 0);
const carryPlane = new THREE.Plane(UP, 0);
const point = new THREE.Vector3();
const quat = new THREE.Quaternion();
const homeQuat = new THREE.Quaternion();
const euler = new THREE.Euler(0, 0, 0, "YXZ");

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

/**
 * Paints a print from the page onto a canvas: the paper, the picture and the
 * caption, each measured from the flat print so both versions look the same.
 */
function paint(paper: HTMLElement, scale: number) {
  const w = paper.offsetWidth;
  const h = paper.offsetHeight;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const g = canvas.getContext("2d");
  if (!g) return canvas;
  g.scale(canvas.width / w, canvas.height / h);
  const sheet = getComputedStyle(paper);
  g.fillStyle = sheet.backgroundColor;
  g.fillRect(0, 0, w, h);
  g.lineWidth = 1;
  g.strokeStyle = sheet.outlineColor;
  g.strokeRect(0.5, 0.5, w - 1, h - 1);

  const img = paper.querySelector("img");
  if (img && img.naturalWidth > 0) {
    g.drawImage(
      img,
      img.offsetLeft,
      img.offsetTop,
      img.offsetWidth,
      img.offsetHeight
    );
    g.strokeStyle = getComputedStyle(img).outlineColor;
    g.strokeRect(
      img.offsetLeft + 0.5,
      img.offsetTop + 0.5,
      img.offsetWidth - 1,
      img.offsetHeight - 1
    );
  }

  // The caption is drawn word by word, each at the place the page gave it, so
  // line breaks and spacing are the browser's own. A hidden line has no width.
  g.textBaseline = "alphabetic";
  for (const word of paper.querySelectorAll<HTMLElement>("[data-print-word]")) {
    const text = word.textContent;
    if (!text || !word.offsetWidth) continue;
    const style = getComputedStyle(word);
    g.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    g.fillStyle = style.color;
    const metrics = g.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    const top = word.offsetTop + (word.offsetHeight - ascent - descent) / 2;
    g.fillText(text, word.offsetLeft, top + ascent);
  }
  return canvas;
}

function printTexture(paper: HTMLElement, scale: number) {
  const texture = new THREE.CanvasTexture(paint(paper, scale));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * A soft shadow of a rectangle. The rectangle itself is drawn off the canvas,
 * so only its shadow lands on it.
 */
function shadowTexture(
  w: number,
  h: number,
  kind: typeof CONTACT,
  ink: string
) {
  const { pad, scale, layers } = kind;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((w + pad * 2) * scale));
  canvas.height = Math.max(1, Math.round((h + pad * 2) * scale));
  const g = canvas.getContext("2d");
  if (g) {
    const rgb = /^#[0-9a-f]{6}$/i.test(ink)
      ? [1, 3, 5].map((at) => parseInt(ink.slice(at, at + 2), 16)).join(", ")
      : "23, 32, 31";
    const far = canvas.width * 2;
    g.fillStyle = "#000";
    for (const layer of layers) {
      g.shadowColor = `rgba(${rgb}, ${layer.alpha})`;
      g.shadowBlur = layer.blur * scale;
      g.shadowOffsetX = far + layer.x * scale;
      g.shadowOffsetY = layer.y * scale;
      g.fillRect(pad * scale - far, pad * scale, w * scale, h * scale);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A pointer that has gone down on a print. */
type Press = {
  index: number;
  pointerId: number;
  target: Element;
  ray: THREE.Ray;
  /** Where on the table the pointer met the print. */
  px: number;
  pz: number;
  clientX: number;
  clientY: number;
  since: number;
  touch: boolean;
};

type Held = {
  index: number;
  pointerId: number;
  touch: boolean;
  ray: THREE.Ray;
  /** Where on the print it was taken hold of, from its centre. */
  grabX: number;
  grabZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vz: number;
  yaw: number;
  /** How far the centre may go before an edge reaches the mat's margin. */
  reachX: number;
  reachZ: number;
  downX: number;
  downY: number;
  travel: number;
  since: number;
};

type Returning = {
  time: number;
  from: ({ x: number; y: number; z: number; q: THREE.Quaternion } | null)[];
};

type Loop = "always" | "demand" | "never";

function Table({
  prints,
  width,
  height,
  accent,
  ink,
  tidy,
  highlighted,
  still,
  visible,
  onReady,
  onSlow,
  onMoved,
  onOpen,
  scale,
  onCursor,
}: SceneProps & { scale: number; onCursor: (cursor: string) => void }) {
  const { rapier } = useRapier();
  const gl = useThree((state) => state.gl);
  const setFrameloop = useThree((state) => state.setFrameloop);
  const bodies = useRef<(RapierRigidBody | null)[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const contactShades = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  const dropShades = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const held = useRef<Held | null>(null);
  const waiting = useRef<(Press & { timer: number }) | null>(null);
  const returning = useRef<Returning | null>(null);
  const quiet = useRef(0);
  const loop = useRef<Loop>("always");
  const pace = useRef({ frames: 0, seconds: 0 });

  const halfW = width / UNIT / 2;
  const halfD = height / UNIT / 2;
  // Prints stop where the mat's printed grid ends, not at its very edge.
  const margin = Math.min(0.2, (width / UNIT) * 0.04);
  const edgeX = halfW - margin;
  const edgeZ = halfD - margin;
  const homes = useMemo(
    () =>
      prints.map((print) => ({
        x: (print.cx - width / 2) / UNIT,
        y: THICK / 2 + print.layer * (THICK + 0.004),
        z: (print.cy - height / 2) / UNIT,
        yaw: THREE.MathUtils.degToRad(-print.turn),
        w: print.w / UNIT,
        d: print.h / UNIT,
      })),
    [prints, width, height]
  );
  const textures = useMemo(
    () => prints.map((print) => printTexture(print.paper, scale)),
    [prints, scale]
  );
  const shadows = useMemo(
    () =>
      prints.map((print) => ({
        contact: shadowTexture(print.w, print.h, CONTACT, ink),
        drop: shadowTexture(print.w, print.h, DROP, ink),
      })),
    [prints, ink]
  );
  useEffect(
    () => () => {
      textures.forEach((texture) => texture.dispose());
      shadows.forEach((pair) => {
        pair.contact.dispose();
        pair.drop.dispose();
      });
    },
    [textures, shadows]
  );

  // The scene only draws while something moves. Everything that starts a
  // movement calls wake() first; the frame loop goes back to sleep on its own.
  const run = (mode: Loop) => {
    if (loop.current === mode) return;
    loop.current = mode;
    setFrameloop(mode);
  };
  const wake = () => {
    quiet.current = 0;
    run("always");
  };

  const announce = useEffectEvent(() => onReady());
  const hop = useEffectEvent((index: number) => {
    const body = bodies.current[index];
    if (!body || held.current || returning.current) return;
    wake();
    const mass = body.mass();
    const side = index % 2 ? 1 : -1;
    body.applyImpulse({ x: 0, y: mass * HOP, z: 0 }, true);
    body.applyTorqueImpulse(
      { x: mass * 0.05 * side, y: 0, z: mass * -0.04 * side },
      true
    );
  });
  const rest = useEffectEvent(() => {
    bodies.current.forEach((body) => body?.sleep());
  });
  // Two frames after the prints exist they have been drawn once, and the page
  // can swap its flat prints for these. Then each print gives a small hop, so
  // it is clear that they are loose. A scene that was turned on by hand starts
  // at rest instead.
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(announce);
    });
    if (still) rest();
    const timers = still
      ? []
      : prints.map((_, index) =>
          window.setTimeout(() => hop(index), 450 + index * 70)
        );
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [prints, still]);

  const settle = (body: RapierRigidBody, index: number) => {
    const home = homes[index];
    if (!home) return;
    body.setBodyType(rapier.RigidBodyType.Dynamic, true);
    body.setTranslation({ x: home.x, y: home.y, z: home.z }, true);
    body.setRotation(homeQuat.setFromAxisAngle(UP, home.yaw), true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };
  const sendHome = useEffectEvent(() => {
    const letGo = held.current;
    held.current = null;
    if (letGo) onCursor("");
    wake();
    if (still) {
      bodies.current.forEach((body, index) => {
        if (body) settle(body, index);
      });
      return;
    }
    returning.current = {
      time: 0,
      from: bodies.current.map((body) => {
        if (!body) return null;
        const at = body.translation();
        const turn = body.rotation();
        body.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
        return {
          x: at.x,
          y: at.y,
          z: at.z,
          q: new THREE.Quaternion(turn.x, turn.y, turn.z, turn.w),
        };
      }),
    };
  });
  useEffect(() => {
    if (tidy > 0) sendHome();
  }, [tidy]);

  const pause = useEffectEvent((shown: boolean) => {
    if (shown) wake();
    else run("never");
  });
  useEffect(() => {
    pause(visible);
  }, [visible]);

  // Takes hold of a print: it becomes a body the pointer moves, lifted off the
  // table.
  const take = (press: Press) => {
    const body = bodies.current[press.index];
    const home = homes[press.index];
    if (!body || !home || held.current || returning.current) return;
    try {
      press.target.setPointerCapture(press.pointerId);
    } catch {
      return; // The pointer has already gone.
    }
    const at = body.translation();
    const turn = body.rotation();
    euler.setFromQuaternion(quat.set(turn.x, turn.y, turn.z, turn.w));
    const yaw = euler.y;
    const cos = Math.abs(Math.cos(yaw));
    const sin = Math.abs(Math.sin(yaw));
    body.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
    held.current = {
      index: press.index,
      pointerId: press.pointerId,
      touch: press.touch,
      ray: press.ray,
      grabX: press.px - at.x,
      grabZ: press.pz - at.z,
      x: at.x,
      y: at.y,
      z: at.z,
      vx: 0,
      vz: 0,
      yaw,
      reachX: edgeX - (cos * home.w + sin * home.d) / 2,
      reachZ: edgeZ - (sin * home.w + cos * home.d) / 2,
      downX: press.clientX,
      downY: press.clientY,
      travel: 0,
      since: press.since,
    };
    onCursor("grabbing");
    if (press.touch) navigator.vibrate?.(8);
    wake();
  };

  const press = (index: number, event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button > 0) return;
    event.stopPropagation();
    const start: Press = {
      index,
      pointerId: event.pointerId,
      target: event.target as unknown as Element,
      ray: event.ray.clone(),
      px: event.point.x,
      pz: event.point.z,
      clientX: event.nativeEvent.clientX,
      clientY: event.nativeEvent.clientY,
      since: event.nativeEvent.timeStamp,
      touch: event.nativeEvent.pointerType === "touch",
    };
    if (!start.touch) {
      take(start);
      return;
    }
    // A finger waits a moment first, so that a swipe which happens to begin
    // on a print still scrolls the page. Lifting the finger sooner is a tap.
    window.clearTimeout(waiting.current?.timer);
    waiting.current = {
      ...start,
      timer: window.setTimeout(() => {
        const due = waiting.current;
        waiting.current = null;
        if (due) take(due);
      }, HOLD_MS),
    };
  };

  const follow = (event: ThreeEvent<PointerEvent>) => {
    const hold = held.current;
    if (!hold || hold.pointerId !== event.pointerId) return;
    hold.ray.copy(event.ray);
    hold.travel = Math.max(
      hold.travel,
      Math.hypot(
        event.nativeEvent.clientX - hold.downX,
        event.nativeEvent.clientY - hold.downY
      )
    );
  };

  const drop = (event: ThreeEvent<PointerEvent>, cancelled: boolean) => {
    const hold = held.current;
    if (!hold || hold.pointerId !== event.pointerId) return;
    held.current = null;
    const target = event.target as unknown as Element;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    onCursor(cancelled || hold.touch ? "" : "grab");
    const body = bodies.current[hold.index];
    if (!body) return;
    const clicked =
      !cancelled &&
      !hold.touch &&
      hold.travel < 6 &&
      event.nativeEvent.timeStamp - hold.since < 600;
    const speed = Math.hypot(hold.vx, hold.vz);
    const keep = clicked ? 0 : speed > MAX_THROW ? MAX_THROW / speed : 1;
    body.setBodyType(rapier.RigidBodyType.Dynamic, true);
    body.setLinvel({ x: hold.vx * keep, y: 0, z: hold.vz * keep }, true);
    body.setAngvel(
      {
        x: 0,
        y: clamp(
          (hold.grabZ * hold.vx - hold.grabX * hold.vz) * SPIN * keep,
          5
        ),
        z: 0,
      },
      true
    );
    wake();
    if (clicked) onOpen(prints[hold.index].href);
    else if (hold.travel >= 6) onMoved();
  };

  // What the canvas itself listens for: the end of a finger's wait (a tap
  // opens the print, a swipe gives the touch back to the page), and finger
  // movement while a print is held, which must not scroll the page.
  const tapped = useEffectEvent((index: number) => onOpen(prints[index].href));
  useEffect(() => {
    const canvas = gl.domElement;
    const moved = (event: PointerEvent) => {
      const due = waiting.current;
      if (!due || event.pointerId !== due.pointerId) return;
      const far = Math.hypot(
        event.clientX - due.clientX,
        event.clientY - due.clientY
      );
      if (far > 8) {
        window.clearTimeout(due.timer);
        waiting.current = null;
      }
    };
    const ended = (event: PointerEvent) => {
      const due = waiting.current;
      if (!due || event.pointerId !== due.pointerId) return;
      window.clearTimeout(due.timer);
      waiting.current = null;
      if (event.type === "pointerup") tapped(due.index);
    };
    const guard = (event: TouchEvent) => {
      if (held.current?.touch && event.cancelable) event.preventDefault();
    };
    canvas.addEventListener("pointermove", moved);
    canvas.addEventListener("pointerup", ended);
    canvas.addEventListener("pointercancel", ended);
    canvas.addEventListener("touchmove", guard, { passive: false });
    return () => {
      canvas.removeEventListener("pointermove", moved);
      canvas.removeEventListener("pointerup", ended);
      canvas.removeEventListener("pointercancel", ended);
      canvas.removeEventListener("touchmove", guard);
      window.clearTimeout(waiting.current?.timer);
      waiting.current = null;
    };
  }, [gl]);

  useBeforePhysicsStep((world) => {
    const dt = world.timestep;

    const hold = held.current;
    const carried = hold ? bodies.current[hold.index] : null;
    if (hold && carried) {
      carryPlane.constant = -(CARRY + THICK);
      let tx = hold.x;
      let tz = hold.z;
      if (hold.ray.intersectPlane(carryPlane, point)) {
        tx = clamp(point.x - hold.grabX, Math.max(0, hold.reachX));
        tz = clamp(point.z - hold.grabZ, Math.max(0, hold.reachZ));
      }
      const pull = 1 - Math.exp(-dt * FOLLOW);
      const x = hold.x + (tx - hold.x) * pull;
      const z = hold.z + (tz - hold.z) * pull;
      const y = hold.y + (CARRY + THICK / 2 - hold.y) * pull;
      hold.vx += ((x - hold.x) / dt - hold.vx) * 0.4;
      hold.vz += ((z - hold.z) / dt - hold.vz) * 0.4;
      hold.x = x;
      hold.y = y;
      hold.z = z;
      // The leading edge dips a little, in proportion to speed.
      euler.set(
        clamp(hold.vz * LEAN, MAX_LEAN),
        hold.yaw,
        clamp(-hold.vx * LEAN, MAX_LEAN)
      );
      carried.setNextKinematicTranslation({ x, y, z });
      carried.setNextKinematicRotation(quat.setFromEuler(euler));
    }

    const back = returning.current;
    if (back) {
      back.time += dt;
      let done = true;
      bodies.current.forEach((body, index) => {
        const from = back.from[index];
        const home = homes[index];
        if (!body || !from || !home) return;
        const progress = Math.min(
          1,
          Math.max(0, (back.time - index * 0.035) / 0.5)
        );
        if (progress < 1) done = false;
        const eased = 1 - Math.pow(1 - progress, 3);
        body.setNextKinematicTranslation({
          x: from.x + (home.x - from.x) * eased,
          y:
            from.y +
            (home.y - from.y) * eased +
            Math.sin(Math.PI * progress) * (0.2 + index * 0.05),
          z: from.z + (home.z - from.z) * eased,
        });
        homeQuat.setFromAxisAngle(UP, home.yaw);
        body.setNextKinematicRotation(quat.copy(from.q).slerp(homeQuat, eased));
      });
      if (done) {
        returning.current = null;
        bodies.current.forEach((body, index) => {
          if (body) settle(body, index);
        });
      }
    }
  });

  useFrame((_, delta) => {
    // After the first few frames (they compile shaders) the next forty are
    // timed. A scene that started on its own and cannot hold about 20 frames
    // a second hands the page back to the flat prints.
    const timed = pace.current;
    if (!still && timed.frames < 44) {
      timed.frames++;
      // One long gap (a hidden tab, a scroll away) counts as a second at most.
      if (timed.frames > 4) timed.seconds += Math.min(delta, 1);
      if (timed.seconds > 2) {
        timed.frames = 44;
        onSlow();
      }
    }

    // Each print's shadow follows its height: the tight shadow at rest, the
    // wide one, moved off to the side, once it is in the air.
    meshes.current.forEach((mesh, index) => {
      const drop = drops.current[index];
      const contactShade = contactShades.current[index];
      const dropShade = dropShades.current[index];
      if (!mesh || !drop || !contactShade || !dropShade) return;
      mesh.getWorldPosition(point);
      mesh.getWorldQuaternion(quat);
      const lift = Math.max(0, point.y - THICK / 2);
      const air = Math.min(1, lift / DROP_FULL);
      contactShade.opacity = 1 - air;
      dropShade.opacity = air;
      drop.visible = air > 0.01;
      drop.position.set(
        point.x + lift * DROP_X,
        point.y - THICK / 2 - 0.004,
        point.z + lift * DROP_Z
      );
      drop.rotation.set(-Math.PI / 2, 0, euler.setFromQuaternion(quat).y);
    });

    if (held.current || returning.current) {
      quiet.current = 0;
      return;
    }
    const moving = bodies.current.some((body) => body && !body.isSleeping());
    quiet.current = moving ? 0 : quiet.current + 1;
    if (quiet.current > 20) run("demand");
  });

  return (
    <>
      {prints.map((print, index) => {
        const home = homes[index];
        return (
          <RigidBody
            key={print.slug}
            ref={(body) => {
              bodies.current[index] = body;
            }}
            position={[home.x, home.y, home.z]}
            rotation={[0, home.yaw, 0]}
            colliders={false}
            ccd
            friction={0.6}
            restitution={0.05}
            linearDamping={0.6}
            angularDamping={1.4}
          >
            <CuboidCollider args={[home.w / 2, THICK / 2, home.d / 2]} />
            <mesh
              ref={(mesh) => {
                meshes.current[index] = mesh;
              }}
              onPointerDown={(event) => press(index, event)}
              onPointerMove={follow}
              onPointerUp={(event) => drop(event, false)}
              onPointerCancel={(event) => drop(event, true)}
              onLostPointerCapture={(event) => drop(event, true)}
              onPointerOver={() => {
                if (!held.current) onCursor("grab");
              }}
              onPointerOut={() => {
                if (!held.current) onCursor("");
              }}
            >
              <boxGeometry args={[home.w, THICK, home.d]} />
              <meshLambertMaterial attach="material-0" color={PAPER_EDGE} />
              <meshLambertMaterial attach="material-1" color={PAPER_EDGE} />
              <meshLambertMaterial attach="material-2" map={textures[index]} />
              <meshLambertMaterial attach="material-3" color={PAPER_EDGE} />
              <meshLambertMaterial attach="material-4" color={PAPER_EDGE} />
              <meshLambertMaterial attach="material-5" color={PAPER_EDGE} />
            </mesh>
            {/* The tight shadow: a little above the print's underside, so it
                shows on the mat and on any print this one lies on. */}
            <mesh
              position={[0, -THICK / 2 + 0.003, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry
                args={[
                  home.w + (CONTACT.pad * 2) / UNIT,
                  home.d + (CONTACT.pad * 2) / UNIT,
                ]}
              />
              <meshBasicMaterial
                ref={(shade) => {
                  contactShades.current[index] = shade;
                }}
                map={shadows[index].contact}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh
              visible={highlighted === print.slug}
              position={[0, -THICK / 2 + 0.006, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[home.w + 0.08, home.d + 0.08]} />
              <meshBasicMaterial color={accent} />
            </mesh>
          </RigidBody>
        );
      })}
      {prints.map((print, index) => (
        <mesh
          key={print.slug}
          ref={(mesh) => {
            drops.current[index] = mesh;
          }}
          visible={false}
        >
          <planeGeometry
            args={[
              homes[index].w + (DROP.pad * 2) / UNIT,
              homes[index].d + (DROP.pad * 2) / UNIT,
            ]}
          />
          <meshBasicMaterial
            ref={(shade) => {
              dropShades.current[index] = shade;
            }}
            map={shadows[index].drop}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      <RigidBody type="fixed" colliders={false} friction={0.6}>
        <CuboidCollider
          args={[halfW + 2, 0.5, halfD + 2]}
          position={[0, -0.5, 0]}
        />
        <CuboidCollider
          args={[halfW + 2, 0.5, halfD + 2]}
          position={[0, 3.5, 0]}
        />
        <CuboidCollider
          args={[0.5, 2, halfD + 2]}
          position={[-edgeX - 0.5, 1.5, 0]}
        />
        <CuboidCollider
          args={[0.5, 2, halfD + 2]}
          position={[edgeX + 0.5, 1.5, 0]}
        />
        <CuboidCollider
          args={[halfW + 2, 2, 0.5]}
          position={[0, 1.5, -edgeZ - 0.5]}
        />
        <CuboidCollider
          args={[halfW + 2, 2, 0.5]}
          position={[0, 1.5, edgeZ + 0.5]}
        />
      </RigidBody>
    </>
  );
}

export default function ProjectTableScene(props: SceneProps) {
  const { height } = props;
  const [cursor, setCursor] = useState("");
  // A turned print is resampled when it is drawn, which softens small text.
  // Drawing above the screen's own density, up to three times, keeps it crisp.
  const scale = Math.min(Math.max((window.devicePixelRatio || 1) * 1.25, 2), 3);
  const fov = THREE.MathUtils.radToDeg(
    2 * Math.atan(height / UNIT / 2 / CAMERA)
  );
  return (
    <Canvas
      flat
      dpr={scale}
      camera={{
        fov,
        near: 0.5,
        far: 30,
        position: [0, CAMERA + THICK, 0],
        up: [0, 0, -1],
      }}
      onCreated={({ camera }) => camera.lookAt(0, THICK, 0)}
      style={{ touchAction: "pan-y", cursor }}
    >
      <ambientLight intensity={AMBIENT} />
      <directionalLight position={SUN_FROM} intensity={SUN} />
      <Suspense fallback={null}>
        <Physics gravity={[0, GRAVITY, 0]}>
          <Table {...props} scale={scale} onCursor={setCursor} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
