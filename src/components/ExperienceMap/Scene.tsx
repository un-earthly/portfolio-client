"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import projects from "@/data/projects.json";
import type { Project, VehicleType } from "./types";
import { buildTerrain, getHeight, getRouteElevation } from "./terrain";
import { VehicleSim } from "./vehiclePhysics";

// ─── Vehicle model config ────────────────────────────────────────────────────
const MODEL_CONFIG: Record<VehicleType, { url: string; targetLength: number; yaw: number }> = {
  car:  { url: "/models/ferrari.glb", targetLength: 8, yaw: Math.PI },
  bike: { url: "/models/bike.glb",    targetLength: 5, yaw: Math.PI },
};

// ─── Route spline waypoints ──────────────────────────────────────────────────
// 25 control points forming the one-way journey:
//   school (local streets) → countryside (uphill) → industrial plateau →
//   highway on-ramp → open highway → destination
// Each project POI sits on or very near one of these waypoints.
const ROUTE_XZ: [number, number][] = [
  [-440,  470],  //  0  pre-school approach (off-screen start)
  [-440,  430],  //  1  ISHQOOL — school entrance
  [-448,  378],  //  2  narrow street exiting school, slight left
  [-432,  325],  //  3  first corner, curving right
  [-400,  278],  //  4  residential street, gentle right
  [-355,  252],  //  5  leaving town, road widens
  [-310,  232],  //  6  countryside begins
  [-280,  220],  //  7  GOBADI — countryside landmark
  [-248,  192],  //  8  uphill climb starts
  [-210,  162],  //  9  steep sweep, climbing
  [-165,  130],  // 10  views open up
  [-110,   88],  // 11  approaching industrial zone
  [ -55,   62],  // 12  industrial outskirts, road widens
  [  -40,  50],  // 13  GSM — industrial peak plateau
  [   52,  18],  // 14  straight industrial road
  [  128, -15],  // 15  industrial exit, curve begins
  [  180,-130],  // 16  BODHISYS — highway on-ramp, descent starts
  [  265,-195],  // 17  ramp sweeping left, road widens fast
  [  348,-248],  // 18  merging onto highway, sweeping right
  [  400,-290],  // 19  COMMENT-FLOW — open highway
  [  488,-355],  // 20  long straight, building speed
  [  570,-420],  // 21  AGT-REALTIME — gentle sweeping right
  [  648,-490],  // 22  descending curve
  [  700,-560],  // 23  MEDIUSWARE — destination city entry
  [  760,-628],  // 24  road continues past destination
];

// Elevation assigned per control-point (matches getRouteElevation knots).
const ROUTE_ELEVATIONS = [
  4, 4, 4, 4.5, 5,          //  0-4  school / local
  5.5, 6.5, 8, 11, 15,      //  5-9  countryside / climbing
  19, 21, 22, 23, 22,       // 10-14 industrial plateau
  19, 17, 15, 13, 11,       // 15-19 descent / highway ramp
  9, 7, 6, 5, 4,            // 20-24 open highway / destination
];

// Road surface 0.38 m above terrain.
const ROAD_LIFT = 0.38;

// ─── Road section helpers ────────────────────────────────────────────────────
function roadHalfWidth(t: number): number {
  if (t < 0.18) return 4.5;                                    // local 9 m
  if (t < 0.38) return 6;                                      // country 12 m
  if (t < 0.56) return 7;                                      // industrial 14 m
  if (t < 0.68) return 7 + ((t - 0.56) / 0.12) * 4;          // ramp 14 → 22 m
  return 11;                                                    // highway 22 m
}

function isHighway(t: number) { return t >= 0.68; }
function isIndustrial(t: number) { return t >= 0.40 && t < 0.60; }
function isCountryside(t: number) { return t >= 0.13 && t < 0.43; }

// Fast seeded hash (0-1) for deterministic road jitter / tree placement.
function hash(n: number): number {
  n = ((n ^ 61) ^ (n >>> 16)) | 0;
  n = (Math.imul(n, 9)) | 0;
  n = (n ^ (n >>> 4)) | 0;
  n = (Math.imul(n, 0x27d4eb2d)) | 0;
  return ((n ^ (n >>> 15)) >>> 0) / 4294967296;
}

// ─── Road builder ────────────────────────────────────────────────────────────
// Returns [road mesh, shoulder mesh, centre-dash mesh, edge-line mesh].
function buildRoad(curve: THREE.CatmullRomCurve3): THREE.Mesh[] {
  const DIVS = 560;
  const MARK_RAISE = 0.05;
  const SH_EXTRA = 7; // shoulder extends this far beyond road edge

  const rv: number[] = [], ri: number[] = [];  // road verts / indices
  const sv: number[] = [], si: number[] = [];  // shoulder

  for (let d = 0; d <= DIVS; d++) {
    const t = d / DIVS;
    const pt = curve.getPointAt(t);
    const groundY = getHeight(pt.x, pt.z);
    const roadY   = groundY + ROAD_LIFT;

    const tan = new THREE.Vector3();
    curve.getTangentAt(t, tan);
    tan.y = 0;
    if (tan.lengthSq() < 1e-6) tan.set(1, 0, 0);
    tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);

    const hw  = roadHalfWidth(t);
    const shw = hw + SH_EXTRA;

    // Optional vertex jitter for the broken industrial section.
    const jitter = isIndustrial(t) && hash(d * 7) > 0.82
      ? (hash(d * 13) - 0.5) * 0.9 : 0;

    const Lx = pt.x - right.x * hw, Lz = pt.z - right.z * hw;
    const Rx = pt.x + right.x * hw, Rz = pt.z + right.z * hw;
    rv.push(Lx, roadY + jitter, Lz, Rx, roadY + jitter, Rz);

    const sy = groundY + ROAD_LIFT * 0.4; // shoulder sits lower than road
    rv.push(); // (already pushed above; shoulders are a separate buffer)
    sv.push(
      pt.x - right.x * shw, sy - 0.12, pt.z - right.z * shw,
      Lx, roadY - 0.04, Lz,
      Rx, roadY - 0.04, Rz,
      pt.x + right.x * shw, sy - 0.12, pt.z + right.z * shw,
    );

    if (d > 0) {
      const b = (d - 1) * 2;
      ri.push(b, b + 2, b + 1,  b + 1, b + 2, b + 3);
      const sb = (d - 1) * 4;
      si.push(sb, sb + 4, sb + 1,  sb + 1, sb + 4, sb + 5); // left shoulder
      si.push(sb + 2, sb + 6, sb + 3,  sb + 3, sb + 6, sb + 7); // right shoulder
    }
  }

  // Centre-line dashes (yellow, 15 m on / 10 m off, estimated by div index).
  const DASH_CYCLE = 10, DASH_ON = 6;
  const dv: number[] = [], di: number[] = [];
  const dashW = 0.38;
  for (let d = 1; d <= DIVS; d++) {
    if (d % DASH_CYCLE >= DASH_ON) continue;
    const t = d / DIVS;
    const pt = curve.getPointAt(t);
    const roadY = getHeight(pt.x, pt.z) + ROAD_LIFT + MARK_RAISE;
    const tan = new THREE.Vector3(); curve.getTangentAt(t, tan); tan.y = 0; tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);
    const base = dv.length / 3;
    dv.push(
      pt.x - right.x * dashW, roadY, pt.z - right.z * dashW,
      pt.x + right.x * dashW, roadY, pt.z + right.z * dashW,
    );
    if (base >= 2) di.push(base - 2, base, base - 1,  base - 1, base, base + 1);
  }

  // Highway edge lines (continuous white strips along road edges).
  const ev: number[] = [], ei: number[] = [];
  const edgeW = 0.3;
  let prevWasHwy = false;
  for (let d = 0; d <= DIVS; d++) {
    const t = d / DIVS;
    if (!isHighway(t)) { prevWasHwy = false; continue; }
    const pt = curve.getPointAt(t);
    const roadY = getHeight(pt.x, pt.z) + ROAD_LIFT + MARK_RAISE;
    const tan = new THREE.Vector3(); curve.getTangentAt(t, tan); tan.y = 0; tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);
    const hw = roadHalfWidth(t);
    const base = ev.length / 3;
    ev.push(
      pt.x - right.x * (hw + edgeW), roadY, pt.z - right.z * (hw + edgeW), // left outer
      pt.x - right.x * (hw - edgeW), roadY, pt.z - right.z * (hw - edgeW), // left inner
      pt.x + right.x * (hw - edgeW), roadY, pt.z + right.z * (hw - edgeW), // right inner
      pt.x + right.x * (hw + edgeW), roadY, pt.z + right.z * (hw + edgeW), // right outer
    );
    if (prevWasHwy && base >= 4) {
      const b = base - 4;
      ei.push(b, b + 4, b + 1,  b + 1, b + 4, b + 5); // left edge strip
      ei.push(b + 2, b + 6, b + 3,  b + 3, b + 6, b + 7); // right edge strip
    }
    prevWasHwy = true;
  }

  function makeGeo(verts: number[], idx: number[]): THREE.BufferGeometry | null {
    if (!idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  const out: THREE.Mesh[] = [];

  const roadGeo = makeGeo(rv, ri);
  if (roadGeo) {
    const m = new THREE.Mesh(roadGeo, new THREE.MeshStandardMaterial({
      color: "#111320", roughness: 0.88, metalness: 0.06,
      emissive: "#070816", emissiveIntensity: 0.12,
    }));
    m.receiveShadow = true;
    out.push(m);
  }

  const shGeo = makeGeo(sv, si);
  if (shGeo) {
    const m = new THREE.Mesh(shGeo, new THREE.MeshStandardMaterial({
      color: "#1a1c18", roughness: 0.97, metalness: 0,
    }));
    m.receiveShadow = true;
    out.push(m);
  }

  const dashGeo = makeGeo(dv, di);
  if (dashGeo) out.push(new THREE.Mesh(dashGeo, new THREE.MeshBasicMaterial({ color: "#c8c822", depthWrite: false })));

  const edgeGeo = makeGeo(ev, ei);
  if (edgeGeo) out.push(new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({ color: "#cccccc", depthWrite: false })));

  return out;
}

// ─── Procedural forest ───────────────────────────────────────────────────────
// Countryside section only (t ≈ 0.13 → 0.45).
// All tree trunks are merged into one mesh; all canopy cones into another.
function buildForest(curve: THREE.CatmullRomCurve3): THREE.Mesh[] {
  const trunkGeos: THREE.BufferGeometry[] = [];
  const canopyGeos: THREE.BufferGeometry[] = [];

  const T_START = 0.13, T_END = 0.45;
  const ROWS = [14, 26, 42]; // distance from road edge for each tree row

  let seed = 0;

  for (let d = 0; d <= 280; d++) {
    const t = T_START + (T_END - T_START) * (d / 280);
    const pt = curve.getPointAt(t);
    const tan = new THREE.Vector3(); curve.getTangentAt(t, tan);
    tan.y = 0; tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);
    const hw = roadHalfWidth(t);

    for (const side of [-1, 1]) {
      for (const rowDist of ROWS) {
        seed++;
        if (hash(seed) > 0.62) continue; // random thinning

        const jitterR = (hash(seed * 2) - 0.5) * 10;
        const dist = (hw + rowDist + jitterR) * side;
        const tx = pt.x + right.x * dist;
        const tz = pt.z + right.z * dist;
        const ty = getHeight(tx, tz);

        const sc = 0.65 + hash(seed * 3) * 0.85;
        const leanX = (hash(seed * 4) - 0.5) * 0.04;
        const leanZ = (hash(seed * 5) - 0.5) * 0.04;

        // Trunk
        const tg = new THREE.CylinderGeometry(0.28 * sc, 0.42 * sc, 2.8 * sc, 5);
        tg.applyMatrix4(new THREE.Matrix4()
          .makeRotationFromEuler(new THREE.Euler(leanZ, 0, leanX))
          .setPosition(tx, ty + 1.4 * sc, tz));
        trunkGeos.push(tg);

        // Lower canopy
        const c1 = new THREE.ConeGeometry(2.1 * sc, 3.4 * sc, 6);
        c1.applyMatrix4(new THREE.Matrix4().makeTranslation(tx, ty + 4.4 * sc, tz));
        // Upper canopy (tighter, lighter green)
        const c2 = new THREE.ConeGeometry(1.5 * sc, 2.7 * sc, 6);
        c2.applyMatrix4(new THREE.Matrix4().makeTranslation(tx, ty + 6.5 * sc, tz));
        canopyGeos.push(c1, c2);
      }
    }
  }

  if (!trunkGeos.length) return [];

  const trunkMat = new THREE.MeshStandardMaterial({ color: "#2a1908", roughness: 0.95, flatShading: true });
  const canopyMat = new THREE.MeshStandardMaterial({ color: "#1a4a1e", roughness: 0.85, flatShading: true });

  const out: THREE.Mesh[] = [];

  const mergedTrunks = mergeGeometries(trunkGeos);
  if (mergedTrunks) {
    const m = new THREE.Mesh(mergedTrunks, trunkMat);
    m.castShadow = true;
    out.push(m);
  }
  trunkGeos.forEach((g) => g.dispose());

  const mergedCanopy = mergeGeometries(canopyGeos);
  if (mergedCanopy) {
    const m = new THREE.Mesh(mergedCanopy, canopyMat);
    m.castShadow = true;
    m.receiveShadow = true;
    out.push(m);
  }
  canopyGeos.forEach((g) => g.dispose());

  return out;
}

// ─── Guardrails ──────────────────────────────────────────────────────────────
// Steel-beam guardrails along the highway section (t ≈ 0.62 → 0.92).
// Left and right rails are TubeGeometry curves; posts are merged cylinders.
function buildGuardrails(curve: THREE.CatmullRomCurve3): THREE.Mesh[] {
  const T_START = 0.62, T_END = 0.92;
  const DIVS = 260;
  const POST_EVERY = 9; // post every N samples
  const RAIL_CLEARANCE = 1.5; // how far beyond road edge

  const lPts: THREE.Vector3[] = [];
  const rPts: THREE.Vector3[] = [];
  const postGeos: THREE.BufferGeometry[] = [];

  for (let d = 0; d <= DIVS; d++) {
    const t = T_START + (T_END - T_START) * (d / DIVS);
    const pt = curve.getPointAt(t);
    const groundY = getHeight(pt.x, pt.z);
    const railY = groundY + ROAD_LIFT + 0.85;

    const tan = new THREE.Vector3(); curve.getTangentAt(t, tan);
    tan.y = 0; tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);
    const hw = roadHalfWidth(t) + RAIL_CLEARANCE;

    lPts.push(new THREE.Vector3(pt.x - right.x * hw, railY, pt.z - right.z * hw));
    rPts.push(new THREE.Vector3(pt.x + right.x * hw, railY, pt.z + right.z * hw));

    if (d % POST_EVERY === 0) {
      for (const side of [-1, 1]) {
        const pg = new THREE.CylinderGeometry(0.1, 0.1, 1.7, 4);
        pg.applyMatrix4(new THREE.Matrix4().makeTranslation(
          pt.x + right.x * hw * side,
          groundY + ROAD_LIFT + 0.85,
          pt.z + right.z * hw * side,
        ));
        postGeos.push(pg);
      }
    }
  }

  const railMat = new THREE.MeshStandardMaterial({ color: "#747974", roughness: 0.25, metalness: 0.75 });
  const postMat = new THREE.MeshStandardMaterial({ color: "#555855", roughness: 0.55, metalness: 0.5 });
  const out: THREE.Mesh[] = [];

  const lCurve = new THREE.CatmullRomCurve3(lPts);
  const rCurve = new THREE.CatmullRomCurve3(rPts);
  const lTube = new THREE.TubeGeometry(lCurve, 260, 0.065, 4, false);
  const rTube = new THREE.TubeGeometry(rCurve, 260, 0.065, 4, false);
  const railGeo = mergeGeometries([lTube, rTube]);
  lTube.dispose(); rTube.dispose();
  if (railGeo) out.push(new THREE.Mesh(railGeo, railMat));

  if (postGeos.length) {
    const merged = mergeGeometries(postGeos);
    postGeos.forEach((g) => g.dispose());
    if (merged) {
      const m = new THREE.Mesh(merged, postMat);
      m.castShadow = true;
      out.push(m);
    }
  }

  return out;
}

// ─── Road-side signs ─────────────────────────────────────────────────────────
function buildSigns(curve: THREE.CatmullRomCurve3): THREE.Group[] {
  const groups: THREE.Group[] = [];
  const length = curve.getLength();
  const spacing = 60;
  const count = Math.floor(length / spacing);

  const postMat = new THREE.MeshStandardMaterial({ color: "#252f3a", roughness: 0.8 });
  const boardMatLocal   = new THREE.MeshStandardMaterial({ color: "#0a1a2a", emissive: "#0a2a33", emissiveIntensity: 0.45 });
  const boardMatHighway = new THREE.MeshStandardMaterial({ color: "#0a1a14", emissive: "#0a2a1a", emissiveIntensity: 0.45 });

  for (let i = 1; i < count; i++) {
    const t = (i * spacing) / length;
    if (t >= 1) break;

    const pt = curve.getPointAt(t);
    const tan = new THREE.Vector3(); curve.getTangentAt(t, tan);
    tan.y = 0; tan.normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x);

    const hw = roadHalfWidth(t);
    const sideOff = hw + 4;
    const gx = pt.x + right.x * sideOff;
    const gz = pt.z + right.z * sideOff;
    const gy = getHeight(gx, gz);

    const g = new THREE.Group();
    g.position.set(gx, gy, gz);
    g.rotation.y = Math.atan2(tan.x, tan.z);

    const hwy = isHighway(t);
    const postH = hwy ? 8 : 6;

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, postH, 6), postMat);
    post.position.y = postH / 2;
    post.castShadow = true;
    g.add(post);

    const bw = hwy ? 10 : 8;
    const board = new THREE.Mesh(new THREE.BoxGeometry(bw, 2.2, 0.2), hwy ? boardMatHighway : boardMatLocal);
    board.position.y = postH + 1.1;
    board.castShadow = true;
    g.add(board);

    groups.push(g);
  }
  return groups;
}

// ─── POI marker ──────────────────────────────────────────────────────────────
function buildPOI(project: Project): { group: THREE.Group; disc: THREE.Mesh; beam: THREE.Mesh } {
  const group = new THREE.Group();
  const baseY = getHeight(project.position.x, project.position.z);
  group.position.set(project.position.x, baseY, project.position.z);

  const discMat = new THREE.MeshStandardMaterial({ color: "#00ffcc", emissive: "#00ffcc", emissiveIntensity: 0.9, roughness: 0.4 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.5, 28), discMat);
  disc.position.y = 0.7;
  disc.userData.isPOI = true;
  disc.userData.projectId = project.id;
  group.add(disc);

  const beamMat = new THREE.MeshBasicMaterial({ color: "#00ffcc", transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.3, 80, 12, 1, true), beamMat);
  beam.position.y = 40;
  group.add(beam);

  const ringMat = new THREE.MeshBasicMaterial({ color: "#00ffcc", transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(4.4, 5.2, 40), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.5;
  group.add(ring);

  const light = new THREE.PointLight("#00ffcc", 30, 90, 2);
  light.position.y = 6;
  group.add(light);

  return { group, disc, beam };
}

// ─── Region colour zone ───────────────────────────────────────────────────────
function buildRegionZone(project: Project): THREE.Mesh {
  const geo = new THREE.CircleGeometry(150, 56);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(project.regionColor), transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(project.position.x, getHeight(project.position.x, project.position.z) + 0.15, project.position.z);
  return mesh;
}

// ─── Scene component props ────────────────────────────────────────────────────
export type SceneProps = {
  onProximity: (projectId: string | null) => void;
  onRegionChange: (projectId: string | null) => void;
  onSpeedChange: (speed: number) => void;
  vehicleType: VehicleType;
  externalJoystick?: { forward: number; turn: number } | null;
  navTarget?: { id: string; seq: number } | null;
  positionRef?: React.MutableRefObject<{ x: number; z: number }>;
};

export default function Scene({
  onProximity, onRegionChange, onSpeedChange,
  vehicleType, externalJoystick, navTarget, positionRef,
}: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ onProximity, onRegionChange, onSpeedChange, externalJoystick, navTarget, positionRef });
  propsRef.current = { onProximity, onRegionChange, onSpeedChange, externalJoystick, navTarget, positionRef };
  const vehicleTypeRef = useRef(vehicleType);
  const modelSwapRef = useRef<{ apply: (t: VehicleType) => void } | null>(null);
  const navHandlerRef = useRef<{ go: (id: string) => void } | null>(null);
  const lastNavSeq = useRef(-1);

  useEffect(() => {
    vehicleTypeRef.current = vehicleType;
    modelSwapRef.current?.apply(vehicleType);
  }, [vehicleType]);

  useEffect(() => {
    if (navTarget && navTarget.seq !== lastNavSeq.current) {
      lastNavSeq.current = navTarget.seq;
      navHandlerRef.current?.go(navTarget.id);
    }
  }, [navTarget]);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;
    const canvas = canvasRef.current;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ── Scene / camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#0a1c14", 0.006);
    scene.background = new THREE.Color("#04100a");

    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 3000);
    camera.position.set(0, 30, -55);

    // ── Lighting ───────────────────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight("#3a5a7a", "#0a1a10", 1.1));
    scene.add(new THREE.AmbientLight("#223344", 0.5));
    const sun = new THREE.DirectionalLight("#cfe6ff", 2.2);
    sun.position.set(300, 400, 200);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1800;
    const sc = sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -700; sc.right = 700; sc.top = 700; sc.bottom = -700;
    scene.add(sun);

    // ── Stars ──────────────────────────────────────────────────────────────────
    const starPos = new Float32Array(4500);
    for (let i = 0; i < 4500; i += 3) {
      starPos[i]   = (Math.random() - 0.5) * 3800;
      starPos[i+1] = Math.random() * 700 + 120;
      starPos[i+2] = (Math.random() - 0.5) * 3800;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: "#bcd4ff", size: 1.1, sizeAttenuation: true, fog: false })));

    // ── Terrain ────────────────────────────────────────────────────────────────
    scene.add(buildTerrain());

    // ── Route spline ───────────────────────────────────────────────────────────
    // Control-point y is computed from the elevation profile so that the curve
    // itself interpolates height smoothly — road mesh then follows terrain + 0.38.
    const routePoints = ROUTE_XZ.map(([x, z], i) =>
      new THREE.Vector3(x, ROUTE_ELEVATIONS[i] + ROAD_LIFT, z)
    );
    const routeCurve = new THREE.CatmullRomCurve3(routePoints, false, "centripetal", 0.5);
    routeCurve.arcLengthDivisions = 1200; // accurate arc-length for long route

    // ── Road system ────────────────────────────────────────────────────────────
    const sorted = [...(projects as Project[])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    buildRoad(routeCurve).forEach((m) => scene.add(m));
    buildForest(routeCurve).forEach((m) => scene.add(m));
    buildGuardrails(routeCurve).forEach((m) => scene.add(m));
    buildSigns(routeCurve).forEach((g) => scene.add(g));

    // ── Project POIs ───────────────────────────────────────────────────────────
    sorted.forEach((p) => scene.add(buildRegionZone(p)));
    const poiDiscs: THREE.Mesh[] = [];
    const poiBeams: THREE.Mesh[] = [];
    sorted.forEach((p) => {
      const { group, disc, beam } = buildPOI(p);
      scene.add(group);
      poiDiscs.push(disc);
      poiBeams.push(beam);
    });

    // ── Vehicle physics ────────────────────────────────────────────────────────
    const start = sorted[0];
    const sim = new VehicleSim(vehicleTypeRef.current, start.position.x, start.position.z);

    // ── Vehicle visual ─────────────────────────────────────────────────────────
    const vehicleHolder = new THREE.Group();
    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.8, 7),
      new THREE.MeshStandardMaterial({ color: "#22aaff", roughness: 0.4, metalness: 0.3 })
    );
    placeholder.castShadow = true;
    placeholder.position.y = 0.9;
    vehicleHolder.add(placeholder);

    const headlight = new THREE.SpotLight("#dff0ff", 60, 120, Math.PI / 6, 0.4, 1.5);
    headlight.position.set(0, 3, 4);
    const headTarget = new THREE.Object3D();
    headTarget.position.set(0, 0, 30);
    vehicleHolder.add(headlight, headTarget);
    headlight.target = headTarget;
    scene.add(vehicleHolder);

    // ── GLTF model loading ─────────────────────────────────────────────────────
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    const modelCache: Partial<Record<VehicleType, THREE.Object3D>> = {};
    let currentModel: THREE.Object3D | null = null;
    let disposed = false;

    function fitModel(obj: THREE.Object3D, type: VehicleType) {
      const cfg = MODEL_CONFIG[type];
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); box.getSize(size);
      const scale = cfg.targetLength / (Math.max(size.x, size.z) || 1);
      obj.scale.setScalar(scale);
      const box2 = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3(); box2.getCenter(center);
      obj.position.x -= center.x;
      obj.position.z -= center.z;
      obj.position.y -= box2.min.y;
      obj.rotation.y = cfg.yaw;
      obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).castShadow = true; });
    }

    function applyModel(type: VehicleType) {
      if (disposed) return;
      const show = (obj: THREE.Object3D) => {
        if (disposed) return;
        if (currentModel) vehicleHolder.remove(currentModel);
        placeholder.visible = false;
        currentModel = obj;
        vehicleHolder.add(obj);
      };
      if (modelCache[type]) { show(modelCache[type]!.clone()); return; }
      loader.load(MODEL_CONFIG[type].url, (gltf) => {
        const root = gltf.scene;
        fitModel(root, type);
        const wrap = new THREE.Group(); wrap.add(root);
        modelCache[type] = wrap;
        show(wrap.clone());
      }, undefined, () => { placeholder.visible = true; });
    }
    applyModel(vehicleTypeRef.current);

    modelSwapRef.current = { apply: (t) => { sim.setType(t); applyModel(t); } };
    navHandlerRef.current = {
      go: (id) => {
        const p = (projects as Project[]).find((x) => x.id === id);
        if (p) sim.navigateTo(p.position.x, p.position.z);
      },
    };

    // ── Input ──────────────────────────────────────────────────────────────────
    const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, " ": false };
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key as keyof typeof keys;
      if (k in keys) { keys[k] = down; if (k === " ") e.preventDefault(); }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ────────────────────────────────────────────────────────────────
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frame = 0;
    let lastRegion: string | null = null;
    let lastProx: string | null = null;
    const fogTarget = { color: new THREE.Color("#0a1c14"), density: 0.006 };
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;

      const joy = propsRef.current.externalJoystick;
      const controls = {
        forward: keys.w || keys.ArrowUp    || (joy ? joy.forward >  0.25 : false),
        back:    keys.s || keys.ArrowDown  || (joy ? joy.forward < -0.25 : false),
        left:    keys.a || keys.ArrowLeft  || (joy ? joy.turn    < -0.25 : false),
        right:   keys.d || keys.ArrowRight || (joy ? joy.turn    >  0.25 : false),
        brake:   keys[" "],
      };
      sim.step(controls, dt);

      const cp = sim.chassis.position;
      vehicleHolder.position.set(cp.x, cp.y - sim.chassisHalfY, cp.z);
      vehicleHolder.quaternion.set(
        sim.chassis.quaternion.x, sim.chassis.quaternion.y,
        sim.chassis.quaternion.z, sim.chassis.quaternion.w
      );

      if (propsRef.current.positionRef) {
        propsRef.current.positionRef.current.x = cp.x;
        propsRef.current.positionRef.current.z = cp.z;
      }

      // Spring-arm chase camera
      const yaw = sim.yaw;
      const overhead = sim.isAutopiloting;
      const dist = overhead ? 90 : 48;
      const height = overhead ? 70 : 26;
      const behind = new THREE.Vector3(-Math.sin(yaw) * dist, height, -Math.cos(yaw) * dist);
      camPos.copy(vehicleHolder.position).add(behind);
      camera.position.lerp(camPos, overhead ? 0.05 : 0.09);
      camLook.lerp(vehicleHolder.position.clone().setY(vehicleHolder.position.y + 4), 0.12);
      camera.lookAt(camLook);

      // POI pulse
      const pulse = 0.6 + Math.sin(t * 2.2) * 0.4;
      for (let i = 0; i < poiDiscs.length; i++) {
        (poiDiscs[i].material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
        (poiBeams[i].material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.08;
      }

      // Proximity / region check (every 10 frames)
      if (frame % 10 === 0 && !overhead) {
        let nearest: string | null = null;
        let nd = Infinity;
        for (const p of projects as Project[]) {
          const dx = cp.x - p.position.x, dz = cp.z - p.position.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d < nd) { nd = d; nearest = p.id; }
        }
        const region = nd < 150 ? nearest : null;
        if (region !== lastRegion) {
          lastRegion = region;
          propsRef.current.onRegionChange(region);
          const p = (projects as Project[]).find((x) => x.id === region);
          fogTarget.color = new THREE.Color(p ? p.fogColor : "#0a1c14");
          fogTarget.density = p ? p.fogDensity : 0.006;
        }
        const prox = nd < 42 ? nearest : null;
        if (prox !== lastProx) { lastProx = prox; propsRef.current.onProximity(prox); }
      }

      if (frame % 4 === 0) propsRef.current.onSpeedChange(Math.round(sim.speed * 3.6));

      // Fog / sky lerp
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(fogTarget.color, 0.025);
        scene.fog.density += (fogTarget.density - scene.fog.density) * 0.025;
        (scene.background as THREE.Color).copy(scene.fog.color).multiplyScalar(0.35);
      }

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("resize", onResize);
      modelSwapRef.current = null;
      navHandlerRef.current = null;
      sim.dispose();
      draco.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.isMesh) {
          m.geometry?.dispose();
          const mat = m.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}
