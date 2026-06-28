import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

export const TERRAIN_SIZE = 1600;
export const TERRAIN_SEGS = 180;
export const HALF = TERRAIN_SIZE / 2;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const noise2D = createNoise2D(mulberry32(1337));

// Route diagonal: school (−440, 430) → destination (700, −560).
// This straight-line approximation is used for terrain elevation influence;
// the actual spline in Scene.tsx adds curvature on top.
const RA = { x: -440, z: 430 };
const RB = { x: 700, z: -560 };
const RDX = RB.x - RA.x; // 1140
const RDZ = RB.z - RA.z; // −990
const RLEN2 = RDX * RDX + RDZ * RDZ; // ≈ 2 279 700
const RLEN = Math.sqrt(RLEN2);        // ≈ 1510

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// Elevation profile along the journey (t = 0 → school, t = 1 → destination).
// School is flat, the land climbs steeply through the countryside, plateaus at
// the industrial zone, then descends gradually onto the open highway.
export function getRouteElevation(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  const K: [number, number][] = [
    [0.00,  4],  // school (flat)
    [0.17,  7],  // gobadi — first rise
    [0.28, 14],  // climbing countryside
    [0.36, 22],  // approaching industrial peak
    [0.42, 24],  // plateau (GSM)
    [0.52, 21],  // post-peak, still high
    [0.60, 17],  // ramp begins (bodhisys)
    [0.67, 13],  // highway merge
    [0.73, 10],  // open highway (comment-flow)
    [0.87,  7],  // agt-realtime
    [1.00,  4],  // destination (mediusware)
  ];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, h0] = K[i];
    const [t1, h1] = K[i + 1];
    if (c <= t1) return h0 + (h1 - h0) * smoothstep((c - t0) / (t1 - t0));
  }
  return 4;
}

// Perpendicular distance from the route diagonal.
function routePerp(x: number, z: number): number {
  const dx = x - RA.x, dz = z - RA.z;
  // |cross product| / |direction unit|
  return Math.abs(dx * (RDZ / RLEN) - dz * (RDX / RLEN));
}

// Approximate t along route from world position.
function routeT(x: number, z: number): number {
  const dx = x - RA.x, dz = z - RA.z;
  return Math.max(0, Math.min(1, (dx * RDX + dz * RDZ) / RLEN2));
}

export function getHeight(x: number, z: number): number {
  // Multi-scale noise: large rolling hills + medium undulation + fine surface.
  const bigNoise  = noise2D(x * 0.0022, z * 0.0022) * 9;
  const midNoise  = noise2D(x * 0.009,  z * 0.009)  * 2.5;
  const fineNoise = noise2D(x * 0.04,   z * 0.04)   * 0.4;

  // Within the road corridor, suppress low/mid noise so the driving surface
  // is smooth.  Beyond it, full noise returns for a natural landscape.
  const perp = routePerp(x, z);
  const INNER = 22, OUTER = 280;
  const noiseGate = smoothstep(Math.max(0, Math.min(1, (perp - INNER) / (OUTER - INNER))));

  // Route elevation anchors the base height; noise rides on top with influence
  // proportional to distance from the route.
  const routeH = getRouteElevation(routeT(x, z));
  const noisePart = (bigNoise + midNoise) * noiseGate + fineNoise;
  return routeH + noisePart;
}

// Height-based vertex colours for a stylised, readable world.
function colorForHeight(y: number, target: THREE.Color) {
  const valley = new THREE.Color("#061610");
  const plains = new THREE.Color("#102618");
  const hills  = new THREE.Color("#1c3a26");
  const ridge  = new THREE.Color("#26473a");
  const peak   = new THREE.Color("#2e4e56");
  if (y < 2)       target.copy(valley).lerp(plains, THREE.MathUtils.clamp((y + 14) / 16, 0, 1));
  else if (y < 10) target.copy(plains).lerp(hills,  (y - 2) / 8);
  else if (y < 18) target.copy(hills).lerp(ridge,   (y - 10) / 8);
  else             target.copy(ridge).lerp(peak,    THREE.MathUtils.clamp((y - 18) / 10, 0, 1));
}

export function buildTerrain(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = getHeight(x, z);
    pos.setY(i, y);
    colorForHeight(y, c);
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  pos.needsUpdate = true;
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}
