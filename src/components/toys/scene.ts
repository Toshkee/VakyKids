import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* 3D toys drawn in the site's sticker style: toon shading and a dark purple
   outline. Toys sit at the page edges (on wide screens they scroll past at
   their own speed); a bunch of balloons carrying a gift waits at the bottom of
   the hero. Balloons pop when clicked.
   Everything is built from simple shapes, so there are no models to download. */

export type ToyKind = "balloons" | "balloon" | "star" | "blocks" | "ball" | "rocket" | "rings" | "teddy";

type Placement = {
  /* CSS selector of the section the toy belongs to, and where in it (0 to 1). */
  anchor: string;
  at: number;
  side: "left" | "right";
  kind: ToyKind;
  /* Height in px on a desktop screen. */
  size: number;
  /* Below 1 the toy scrolls slower than the page, above 1 faster. */
  depth: number;
  /* Shown on phones too. There the toy sits in the empty gap at the top of
     its section (on the wave), never over text, and does not drift. */
  phone?: boolean;
  color?: string;
};

const C = {
  sun: "#FFD84D",
  coral: "#FF8A7A",
  red: "#E5483A",
  sky: "#7FD3F7",
  blue: "#3E8FE0",
  mint: "#7ED9A6",
  bubble: "#FFB3C1",
  lilac: "#C9B8FF",
  grape: "#3A2A6B",
  cream: "#FFF8E1",
  white: "#FFFFFF",
  brown: "#C98A55",
};

const PLACEMENTS: Placement[] = [
  { anchor: "section[aria-labelledby='hero-title']", at: 0.82, side: "left", kind: "star", size: 64, depth: 1.25 },
  { anchor: "#deda-mraz", at: 0.82, side: "right", kind: "teddy", size: 92, depth: 0.85 },
  { anchor: "#primjer", at: 0.12, side: "right", kind: "rocket", size: 100, depth: 1.3, phone: true },
  { anchor: "#kako", at: 0.2, side: "left", kind: "blocks", size: 88, depth: 0.8, phone: true },
  { anchor: "#paketi", at: 0.08, side: "right", kind: "balloon", size: 96, depth: 0.75, color: C.coral, phone: true },
  { anchor: "#paketi", at: 0.86, side: "left", kind: "star", size: 58, depth: 1.2 },
  { anchor: "#naruci", at: 0.4, side: "left", kind: "ball", size: 76, depth: 1.15, phone: true },
  { anchor: "section[aria-labelledby='prica-title']", at: 0.18, side: "right", kind: "rings", size: 92, depth: 0.85, phone: true },
  { anchor: "#pitanja", at: 0.3, side: "left", kind: "balloon", size: 90, depth: 0.8, color: C.mint, phone: true },
];

/* ---------- materials ---------- */

function makeGradient() {
  const tones = new Uint8Array([90, 170, 255]);
  const tex = new THREE.DataTexture(tones, tones.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

type Kit = {
  toon: (color: string, map?: THREE.Texture) => THREE.MeshToonMaterial;
  outline: THREE.ShaderMaterial;
  ink: THREE.MeshBasicMaterial;
  font: string;
};

function makeKit(font: string): Kit {
  const gradientMap = makeGradient();
  const cache = new Map<string, THREE.MeshToonMaterial>();
  return {
    toon: (color, map) => {
      if (map) return new THREE.MeshToonMaterial({ color, gradientMap, map });
      let m = cache.get(color);
      if (!m) {
        m = new THREE.MeshToonMaterial({ color, gradientMap });
        cache.set(color, m);
      }
      return m;
    },
    // Inverted hull: the back faces, pushed out along the normals, in ink.
    outline: new THREE.ShaderMaterial({
      uniforms: { thickness: { value: 0.045 }, color: { value: new THREE.Color(C.grape) } },
      vertexShader:
        "uniform float thickness; void main(){ vec3 p = position + normal * thickness; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }",
      fragmentShader: "uniform vec3 color; void main(){ gl_FragColor = vec4(color, 1.0); }",
      side: THREE.BackSide,
    }),
    ink: new THREE.MeshBasicMaterial({ color: C.grape }),
    font,
  };
}

/* A mesh plus its outline. */
function part(kit: Kit, geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], outline = true) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  if (outline) g.add(new THREE.Mesh(geo, kit.outline));
  return g;
}

/* ---------- toys (each roughly 2 units tall, centred) ---------- */

function balloon(kit: Kit, color: string, stringTo = new THREE.Vector3(0.05, -2.9, 0)) {
  const g = new THREE.Group();
  const body = new THREE.SphereGeometry(1, 40, 30);
  body.scale(1, 1.18, 1);
  const b = part(kit, body, kit.toon(color));
  b.userData.balloonBody = true;
  g.add(b);
  const knot = part(kit, new THREE.ConeGeometry(0.17, 0.24, 16), kit.toon(color));
  knot.position.y = -1.24;
  g.add(knot);
  const shine = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: C.white, transparent: true, opacity: 0.6 }),
  );
  shine.scale.set(0.6, 1.1, 0.3);
  shine.position.set(-0.42, 0.5, 0.86);
  shine.rotation.z = 0.5;
  g.add(shine);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.34, 0),
    new THREE.Vector3(stringTo.x * 0.3 + 0.14, -1.34 + (stringTo.y + 1.34) * 0.35, 0),
    new THREE.Vector3(stringTo.x * 0.7 - 0.1, -1.34 + (stringTo.y + 1.34) * 0.7, 0),
    stringTo,
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.028, 6), kit.ink));
  g.userData.balloon = true;
  return g;
}

function balloonBunch(kit: Kit, withGift: boolean) {
  const g = new THREE.Group();
  const tie = new THREE.Vector3(0, -2.4, 0);
  const spots: [number, number, number, string][] = [
    [-1.05, 0.25, -0.2, C.sky],
    [1.0, 0.45, -0.3, C.sun],
    [0, 1.35, 0.1, C.coral],
  ];
  for (const [x, y, z, color] of spots) {
    const b = balloon(kit, color, tie.clone().sub(new THREE.Vector3(x, y, z)));
    b.position.set(x, y, z);
    b.userData.rest = b.position.clone();
    g.add(b);
  }
  if (withGift) {
    const gift = giftBox(kit);
    gift.scale.setScalar(0.62);
    gift.position.set(0, -2.95, 0);
    gift.userData.gift = true;
    g.add(gift);
  }
  g.position.y = 0.6;
  return g;
}

function giftBox(kit: Kit) {
  const g = new THREE.Group();
  g.add(part(kit, new RoundedBoxGeometry(1.4, 1.1, 1.4, 4, 0.1), kit.toon(C.red)));
  const ribbon = kit.toon(C.sun);
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.13, 1.43), ribbon);
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(1.43, 1.13, 0.26), ribbon);
  g.add(r1, r2);
  for (const s of [-1, 1]) {
    const loop = part(kit, new THREE.TorusGeometry(0.26, 0.09, 10, 24), ribbon);
    loop.position.set(s * 0.24, 0.72, 0);
    loop.rotation.set(0, Math.PI / 2, s * 0.6);
    g.add(loop);
  }
  return g;
}

function star(kit: Kit) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.48 : 1;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 4,
  });
  geo.center();
  geo.computeVertexNormals();
  const g = new THREE.Group();
  g.add(part(kit, geo, kit.toon(C.sun)));
  const front = 0.29;
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), kit.ink);
    eye.position.set(s * 0.17, 0.06, front);
    g.add(eye);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 8, 20, Math.PI), kit.ink);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.08, front);
  g.add(smile);
  g.scale.setScalar(1.05);
  return g;
}

function letterTexture(letter: string, bg: string, font: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  x.fillStyle = bg;
  x.fillRect(0, 0, 256, 256);
  x.font = `800 190px ${font}`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.lineJoin = "round";
  x.lineWidth = 18;
  x.strokeStyle = C.grape;
  x.strokeText(letter, 128, 148);
  x.fillStyle = C.white;
  x.fillText(letter, 128, 148);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function block(kit: Kit, letter: string, color: string) {
  const side = kit.toon(color);
  const face = kit.toon(C.white, letterTexture(letter, color, kit.font));
  // Box face order: +x, -x, +y, -y, +z, -z. The letter goes on the front.
  const mats = [side, side, side, side, face, face];
  return part(kit, new RoundedBoxGeometry(1, 1, 1, 4, 0.13), mats);
}

function blocks(kit: Kit) {
  const g = new THREE.Group();
  const a = block(kit, "A", C.coral);
  a.position.set(-0.56, -0.5, 0);
  a.rotation.y = 0.18;
  const b = block(kit, "B", C.sky);
  b.position.set(0.56, -0.5, 0.05);
  b.rotation.y = -0.2;
  const v = block(kit, "V", C.mint);
  v.position.set(0.02, 0.52, 0);
  v.rotation.set(0, 0.1, 0.12);
  g.add(a, b, v);
  return g;
}

function beachBall(kit: Kit) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const x = c.getContext("2d")!;
  const stripes = [C.red, C.white, C.blue, C.white, C.sun, C.white];
  stripes.forEach((col, i) => {
    x.fillStyle = col;
    x.fillRect((i * 512) / stripes.length, 0, 512 / stripes.length + 1, 256);
  });
  x.fillStyle = C.white;
  x.fillRect(0, 0, 512, 22);
  x.fillRect(0, 234, 512, 22);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const g = part(kit, new THREE.SphereGeometry(1, 48, 32), kit.toon(C.white, tex));
  g.rotation.z = 0.4;
  return g;
}

function rocket(kit: Kit) {
  const g = new THREE.Group();
  const body = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.0, -1.0),
      new THREE.Vector2(0.42, -1.0),
      new THREE.Vector2(0.56, -0.5),
      new THREE.Vector2(0.58, 0.2),
      new THREE.Vector2(0.48, 0.62),
    ].map((v) => v),
    32,
  );
  g.add(part(kit, body, kit.toon(C.white)));
  const nose = new THREE.LatheGeometry(
    [new THREE.Vector2(0.48, 0.6), new THREE.Vector2(0.36, 0.95), new THREE.Vector2(0.17, 1.2), new THREE.Vector2(0, 1.3)],
    32,
  );
  g.add(part(kit, nose, kit.toon(C.red)));
  const window = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), kit.toon(C.sky));
  window.scale.z = 0.4;
  window.position.set(0, 0.12, 0.55);
  g.add(window);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.05, 10, 28), kit.ink);
  rim.position.set(0, 0.12, 0.57);
  g.add(rim);
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.55, -0.45);
  finShape.lineTo(0.55, -0.85);
  finShape.lineTo(0, -0.55);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
  finGeo.translate(0.45, -0.15, -0.04);
  for (let i = 0; i < 3; i++) {
    const fin = part(kit, finGeo, kit.toon(C.red));
    fin.rotation.y = (i * Math.PI * 2) / 3 + Math.PI / 2;
    g.add(fin);
  }
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 20), new THREE.MeshBasicMaterial({ color: "#FFB547" }));
  flame.rotation.x = Math.PI;
  flame.position.y = -1.42;
  flame.userData.flame = true;
  const core = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 16), new THREE.MeshBasicMaterial({ color: "#FFF3C4" }));
  core.rotation.x = Math.PI;
  core.position.y = -1.22;
  core.userData.flame = true;
  g.add(flame, core);
  g.rotation.z = -0.5;
  return g;
}

function rings(kit: Kit) {
  const g = new THREE.Group();
  const base = part(kit, new THREE.CylinderGeometry(0.95, 1.0, 0.24, 32), kit.toon(C.lilac));
  base.position.y = -1.1;
  g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.0, 16), kit.toon(C.cream));
  pole.position.y = -0.1;
  g.add(pole);
  const sizes: [number, string][] = [
    [0.78, C.red],
    [0.66, C.sun],
    [0.55, C.mint],
    [0.45, C.blue],
  ];
  sizes.forEach(([r, col], i) => {
    const ring = part(kit, new THREE.TorusGeometry(r, 0.21, 16, 40), kit.toon(col));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.82 + i * 0.4;
    g.add(ring);
  });
  const top = part(kit, new THREE.SphereGeometry(0.28, 20, 16), kit.toon(C.bubble));
  top.position.y = 0.9;
  g.add(top);
  return g;
}

function teddy(kit: Kit) {
  const g = new THREE.Group();
  const fur = kit.toon(C.brown);
  const light = kit.toon("#F2D3A8");
  const ball = (r: number, mat: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, outline = true) => {
    const geo = new THREE.SphereGeometry(r, 28, 20);
    geo.scale(sx, sy, sz);
    const p = part(kit, geo, mat, outline);
    p.position.set(x, y, z);
    g.add(p);
    return p;
  };
  ball(0.78, fur, 0, -0.55, 0, 1, 1.05, 0.9);
  ball(0.42, light, 0, -0.5, 0.48, 1, 1.15, 0.5, false);
  for (const s of [-1, 1]) {
    ball(0.26, fur, s * 0.72, -0.35, 0.2, 1, 1.4, 1);
    ball(0.3, fur, s * 0.45, -1.25, 0.3, 1, 0.8, 1.2);
    ball(0.22, fur, s * 0.5, 1.18, -0.05);
    ball(0.12, light, s * 0.5, 1.18, 0.12, 1, 1, 0.5, false);
  }
  ball(0.62, fur, 0, 0.62, 0.05);
  ball(0.27, light, 0, 0.5, 0.55, 1.2, 0.9, 0.6, false);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), kit.ink);
  nose.scale.set(1.3, 1, 1);
  nose.position.set(0, 0.6, 0.7);
  g.add(nose);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), kit.ink);
    eye.position.set(s * 0.22, 0.8, 0.58);
    g.add(eye);
  }
  const bow = kit.toon(C.red);
  for (const s of [-1, 1]) {
    const wing = part(kit, new THREE.ConeGeometry(0.15, 0.3, 12), bow);
    wing.rotation.z = (s * Math.PI) / 2;
    wing.position.set(s * 0.16, 0.08, 0.55);
    g.add(wing);
  }
  g.position.y = 0.1;
  return g;
}

function build(kit: Kit, kind: ToyKind, color?: string): THREE.Group {
  switch (kind) {
    case "balloons":
      return balloonBunch(kit, true);
    case "balloon": {
      const b = balloon(kit, color ?? C.coral);
      b.position.y = 0.7;
      b.userData.rest = b.position.clone();
      const g = new THREE.Group();
      g.add(b);
      return g;
    }
    case "star":
      return star(kit);
    case "blocks":
      return blocks(kit);
    case "ball":
      return beachBall(kit);
    case "rocket":
      return rocket(kit);
    case "rings":
      return rings(kit);
    case "teddy":
      return teddy(kit);
  }
}


/* ---------- the world ---------- */

/* Each toy gets its own small 2D canvas, placed in the page like an image, so
   it scrolls with the page natively. One hidden WebGL renderer draws every
   visible toy and copies it into its canvas. Phones never wait on script to
   move a toy, and resizing the address bar never wipes anything. */

type Sprite = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  root: THREE.Group;
  inner: THREE.Group;
  /* Model height in world units, used to fit it in its box. */
  units: number;
  p?: Placement;
  seed: number;
  spin: number;
  on: boolean;
  docY: number;
  depth: number;
  dev: number;
  offset: number;
  near: boolean;
  balloons: boolean;
};

type Popping = { obj: THREE.Object3D; t: number; back: number };

const FOV = 30;
const CAM_Z = 30;
const VIEW = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const CONTENT = 1152;

export function createToyWorld(layer: HTMLElement, opts: { font: string; onPop: (x: number, y: number) => void }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  let bufferPx = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 100);
  camera.position.z = CAM_Z;
  scene.add(new THREE.HemisphereLight("#ffffff", "#c9b8ff", 1.4));
  const sun = new THREE.DirectionalLight("#ffffff", 1.8);
  sun.position.set(4, 6, 8);
  scene.add(sun);

  const kit = makeKit(opts.font);
  const sprites: Sprite[] = [];

  function addSprite(inner: THREE.Group, units: number, seed: number, spin: number, p?: Placement) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;display:none;pointer-events:none";
    layer.appendChild(canvas);
    const root = new THREE.Group();
    root.add(inner);
    root.visible = false;
    scene.add(root);
    const s: Sprite = {
      canvas,
      ctx: canvas.getContext("2d")!,
      root,
      inner,
      units,
      p,
      seed,
      spin,
      on: false,
      docY: 0,
      depth: 1,
      dev: 0,
      offset: 0,
      near: false,
      balloons: p?.kind === "balloon" || !p,
    };
    sprites.push(s);
    return s;
  }

  PLACEMENTS.forEach((p, i) =>
    addSprite(build(kit, p.kind, p.color), 2.4, i * 1.7 + 0.3, p.kind === "ball" || p.kind === "star" ? 1 : 0.35, p),
  );

  // A balloon bunch with a gift, waiting at the bottom of the hero.
  const bunch = balloonBunch(kit, true);
  const traveller = addSprite(bunch, 5.2, 0, 0);
  const travelBalloons = bunch.children.filter((c) => c.userData.balloon);
  const gift = bunch.children.find((c) => c.userData.gift)!;
  let giftFall: { v: number; y: number } | null = null;
  let giftGrow = 1;

  const flames: THREE.Object3D[] = [];
  scene.traverse((o) => {
    if (o.userData.flame) flames.push(o);
  });

  let vw = 1;
  let vh = 1;

  function place(s: Sprite, x: number, y: number, size: number, factor: number, layerLeft: number, layerTop: number, dpr: number) {
    const box = Math.round(size * factor);
    // Keep the whole box on screen, so nothing sticks out sideways.
    const cx = THREE.MathUtils.clamp(x, box / 2, vw - box / 2);
    const st = s.canvas.style;
    st.display = "block";
    st.left = `${Math.round(cx - box / 2 - layerLeft)}px`;
    st.top = `${Math.round(y - box / 2 - layerTop)}px`;
    st.width = st.height = `${box}px`;
    const dev = Math.round(box * dpr);
    // Setting a canvas size wipes it, so only do it when the size changes.
    if (s.dev !== dev) {
      s.canvas.width = s.canvas.height = dev;
      s.dev = dev;
    }
    s.docY = y;
    s.root.scale.setScalar(((size / box) * VIEW) / s.units);
    s.on = true;
  }

  function measure() {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    const phone = vw < 768;
    // When the margins beside the content are narrower than 80px, toys sit in
    // the gaps between sections instead, never over text.
    const gutter = Math.max((vw - CONTENT) / 2, 0);
    const compact = gutter < 80;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sy = window.scrollY;
    const lr = layer.getBoundingClientRect();
    const layerTop = lr.top + sy;
    const layerLeft = lr.left;

    for (const s of sprites) {
      if (s === traveller) continue;
      const p = s.p!;
      const el = document.querySelector<HTMLElement>(p.anchor);
      if (!el || (compact && !p.phone)) {
        s.on = false;
        s.canvas.style.display = "none";
        continue;
      }
      const r = el.getBoundingClientRect();
      const docY = compact ? r.top + sy - 6 : r.top + sy + r.height * p.at;
      // Wide screens: as big as the margin allows, centred in it.
      const size = phone ? 58 : compact ? 72 : Math.min(p.size, gutter * 1.1);
      const fromEdge = compact ? vw * (phone ? 0.13 : 0.08) : gutter / 2;
      s.depth = compact ? 1 : p.depth;
      place(s, p.side === "left" ? fromEdge : vw - fromEdge, docY, size, 1.7, layerLeft, layerTop, dpr);
    }

    const hero = document.querySelector<HTMLElement>("section[aria-labelledby='hero-title']");
    const heroBottom = hero ? hero.getBoundingClientRect().bottom + sy : vh;
    // Phones: it floats on the edge into the next section, clear of the hero text.
    place(traveller, vw * 0.8, heroBottom - (compact ? 8 : 70), phone ? 104 : 130, 1.45, layerLeft, layerTop, dpr);

    const need = Math.max(...sprites.map((s) => (s.on ? s.dev : 0)), 1);
    if (need > bufferPx) {
      bufferPx = need;
      renderer.setSize(need, need, false);
    }
    // A resize may have wiped a canvas: redraw now, before the browser paints.
    drawAll(window.scrollY);
  }

  // Pointer: toys lean towards it; balloons pop on click.
  const pointer = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const popping: Popping[] = [];

  function balloonAt(x: number, y: number) {
    for (const s of sprites) {
      if (!s.on || !s.near || !s.balloons) continue;
      const r = s.canvas.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      s.root.updateMatrixWorld(true);
      for (const h of ray.intersectObject(s.root, true)) {
        let o: THREE.Object3D | null = h.object;
        while (o && !o.userData.balloon) o = o.parent;
        if (o && o.scale.x > 0.5) return o;
      }
    }
    return null;
  }

  const isControl = (el: EventTarget | null) =>
    el instanceof Element && !!el.closest("a, button, input, textarea, select, label, summary, [role='button']");

  const onMove = (e: PointerEvent) => {
    pointer.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
    if (e.pointerType !== "mouse") return;
    const over = !isControl(e.target) && balloonAt(e.clientX, e.clientY);
    document.documentElement.style.cursor = over ? "pointer" : "";
  };
  const onDown = (e: PointerEvent) => {
    if (isControl(e.target)) return;
    const b = balloonAt(e.clientX, e.clientY);
    if (!b) return;
    popping.push({ obj: b, t: 0, back: 4 });
    opts.onPop(e.clientX, e.clientY);
    if (travelBalloons.includes(b) && travelBalloons.every((x) => x === b || popping.some((p) => p.obj === x))) {
      giftFall = { v: 0, y: 0 };
    }
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown);

  let lastScroll = window.scrollY;
  let velocity = 0;
  let lean = 0;
  // Timer (not the old Clock): with connect() it ignores the time the tab was
  // hidden, so toys don't jump after you come back.
  const timer = new THREE.Timer();
  timer.connect(document);
  let raf = 0;

  function animate(time: number, dt: number) {
    for (const s of sprites) {
      if (!s.near || s === traveller) continue;
      s.inner.position.y = Math.sin(time * 1.3 + s.seed) * 0.12;
      s.inner.rotation.y = Math.sin(time * 0.6 * s.spin + s.seed) * 0.6 + pointer.x * 0.35;
      s.inner.rotation.x = -pointer.y * 0.2 + lean * 0.6;
      s.inner.rotation.z = Math.sin(time * 0.9 + s.seed) * 0.08 - lean * 0.5;
      if (s.p?.kind === "ball") s.inner.rotation.x += time * 0.8;
    }

    if (traveller.near) {
      bunch.position.y = 0.6 + Math.sin(time * 1.1) * 0.25;
      bunch.rotation.z = THREE.MathUtils.lerp(bunch.rotation.z, Math.sin(time * 0.7) * 0.05 - lean * 0.6, 0.08);
      bunch.rotation.y = Math.sin(time * 0.5) * 0.4 + pointer.x * 0.2;
      travelBalloons.forEach((b, i) => {
        const rest = b.userData.rest as THREE.Vector3;
        b.position.y = rest.y + Math.sin(time * 1.6 + i * 2) * 0.12;
        b.rotation.z = Math.sin(time * 1.2 + i) * 0.08;
      });
    }
    if (giftGrow < 1) {
      giftGrow = Math.min(giftGrow + dt / 0.6, 1);
      gift.scale.setScalar(0.62 * easeOutBack(giftGrow));
    }
    if (giftFall) {
      giftFall.v += 18 * dt;
      giftFall.y -= giftFall.v * dt;
      gift.position.y = -2.95 + giftFall.y;
      gift.rotation.z += dt * 2;
      // Shrinks as it falls, so it is gone before it reaches the box edge.
      gift.scale.setScalar(0.62 * Math.max(0, 1 + giftFall.y / 1.6));
    }

    for (const f of flames) f.scale.y = 0.8 + Math.random() * 0.45;

    // Popping balloons: a quick puff, then they grow back.
    for (let i = popping.length - 1; i >= 0; i--) {
      const p = popping[i];
      p.t += dt;
      if (p.t < 0.12) p.obj.scale.setScalar(1 + p.t * 3);
      else if (p.t < p.back) p.obj.scale.setScalar(0.0001);
      else {
        const k = Math.min((p.t - p.back) / 0.6, 1);
        p.obj.scale.setScalar(easeOutBack(k));
        // The gift comes back with the first balloon that grows back.
        if (giftFall && travelBalloons.includes(p.obj)) {
          giftFall = null;
          gift.position.y = -2.95;
          gift.rotation.z = 0;
          giftGrow = 0;
        }
        if (k >= 1) popping.splice(i, 1);
      }
    }
  }

  /* Works out which toys are on screen (with their parallax drift on wide
     screens) and draws them. */
  function drawAll(sy: number) {
    for (const s of sprites) {
      if (!s.on) {
        s.near = false;
        continue;
      }
      // Below 1 the toy scrolls slower than the page, above 1 faster.
      const offset = s.depth === 1 ? 0 : Math.round((s.depth - 1) * (s.docY - sy - vh / 2));
      const y = s.docY - sy + offset;
      s.near = y > -s.dev && y < vh + s.dev;
      if (!s.near) continue;
      if (offset !== s.offset) {
        s.offset = offset;
        s.canvas.style.transform = offset ? `translate3d(0,${offset}px,0)` : "";
      }
      for (const o of sprites) o.root.visible = o === s;
      renderer.setViewport(0, 0, s.dev, s.dev);
      renderer.setScissor(0, 0, s.dev, s.dev);
      renderer.render(scene, camera);
      // WebGL draws from the bottom-left corner of its buffer.
      s.ctx.clearRect(0, 0, s.dev, s.dev);
      s.ctx.drawImage(renderer.domElement, 0, bufferPx - s.dev, s.dev, s.dev, 0, 0, s.dev, s.dev);
    }
  }

  function frame(now?: number) {
    raf = requestAnimationFrame(frame);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05);
    const time = timer.getElapsed();
    const sy = window.scrollY;
    velocity += ((sy - lastScroll) / Math.max(dt, 0.001) - velocity) * 0.1;
    lastScroll = sy;
    lean = THREE.MathUtils.clamp(velocity / 3000, -0.35, 0.35);
    animate(time, dt);
    drawAll(sy);
  }

  // Only a change in page width or layout moves toys. The phone address bar
  // changing the height does not need a new layout.
  let lastWidth = 0;
  const onResize = () => {
    vh = window.innerHeight;
    if (document.documentElement.clientWidth !== lastWidth) {
      lastWidth = document.documentElement.clientWidth;
      measure();
    }
  };
  measure();
  lastWidth = vw;
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  window.addEventListener("resize", onResize);
  frame();

  return () => {
    cancelAnimationFrame(raf);
    timer.dispose();
    ro.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    document.documentElement.style.cursor = "";
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m: THREE.Material & { map?: THREE.Texture | null }) => {
          m.map?.dispose();
          m.dispose();
        });
      }
    });
    renderer.dispose();
    for (const s of sprites) s.canvas.remove();
  };
}

function easeOutBack(k: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
}
