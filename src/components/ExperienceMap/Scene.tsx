"use client";
import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import projects from "@/data/projects.json";
import type { Project } from "./types";

const TERRAIN_SIZE = 1200;
const TERRAIN_SEGS = 128;
const ROAD_WIDTH = 12;

function buildTerrain(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(
    TERRAIN_SIZE,
    TERRAIN_SIZE,
    TERRAIN_SEGS,
    TERRAIN_SEGS
  );
  geo.rotateX(-Math.PI / 2);

  const noise = createNoise2D();
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const n =
      noise(x * 0.005, z * 0.005) * 18 +
      noise(x * 0.02, z * 0.02) * 5 +
      noise(x * 0.08, z * 0.08) * 1.5;
    pos.setY(i, n);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const mat = new THREE.MeshToonMaterial({
    color: new THREE.Color("#0d1a0f"),
    side: THREE.FrontSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

function buildRoad(sortedProjects: Project[]): THREE.Mesh[] {
  const points = sortedProjects.map(
    (p) => new THREE.Vector3(p.position.x, 0.5, p.position.z)
  );
  if (points.length < 2) return [];

  const meshes: THREE.Mesh[] = [];

  sortedProjects.forEach((project, i) => {
    if (i === 0) return;
    const prev = sortedProjects[i - 1];
    const segPoints = [
      new THREE.Vector3(prev.position.x, 0.5, prev.position.z),
      new THREE.Vector3(project.position.x, 0.5, project.position.z),
    ];
    const curve = new THREE.CatmullRomCurve3(segPoints);
    const isBroken = project.roadCondition === "broken";
    const numDivisions = 20;

    for (let d = 0; d < numDivisions; d++) {
      const t0 = d / numDivisions;
      const t1 = (d + 1) / numDivisions;
      const p0 = curve.getPointAt(t0);
      const p1 = curve.getPointAt(t1);
      const tangent = p1.clone().sub(p0).normalize();
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x);

      const halfW = ROAD_WIDTH / 2;
      const verts = [
        p0.clone().addScaledVector(right, -halfW),
        p0.clone().addScaledVector(right, halfW),
        p1.clone().addScaledVector(right, halfW),
        p1.clone().addScaledVector(right, -halfW),
      ];

      if (isBroken) {
        verts[0].y += (Math.random() - 0.5) * 1.2;
        verts[3].y += (Math.random() - 0.5) * 1.2;
      }

      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(
        verts.flatMap((v) => [v.x, v.y, v.z])
      );
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setIndex([0, 2, 1, 0, 3, 2]);
      geo.computeVertexNormals();

      const color = isBroken ? "#1a0e0e" : "#1a1a2a";
      const mat = new THREE.MeshToonMaterial({ color: new THREE.Color(color) });
      meshes.push(new THREE.Mesh(geo, mat));
    }
  });

  return meshes;
}

function buildPOI(project: Project): THREE.Group {
  const group = new THREE.Group();
  group.position.set(project.position.x, 0, project.position.z);

  const cylGeo = new THREE.CylinderGeometry(3, 3, 0.4, 24);
  const cylMat = new THREE.MeshToonMaterial({
    color: new THREE.Color("#00ffcc"),
    emissive: new THREE.Color("#00ffcc"),
    emissiveIntensity: 0.8,
  });
  const cyl = new THREE.Mesh(cylGeo, cylMat);
  cyl.position.y = 0.6;
  cyl.userData.isPOI = true;
  cyl.userData.projectId = project.id;
  group.add(cyl);

  const ringGeo = new THREE.RingGeometry(4, 4.6, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshToonMaterial({
    color: new THREE.Color("#00ffcc"),
    emissive: new THREE.Color("#00ffcc"),
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.3;
  group.add(ring);

  return group;
}

function buildRoadsideSigns(sortedProjects: Project[]): THREE.Group[] {
  const signs: THREE.Group[] = [];
  if (sortedProjects.length < 2) return signs;

  const allPoints = sortedProjects.map(
    (p) => new THREE.Vector3(p.position.x, 0.5, p.position.z)
  );
  const fullCurve = new THREE.CatmullRomCurve3(allPoints);
  const totalLength = fullCurve.getLength();
  const signEvery = 40;
  const numSigns = Math.floor(totalLength / signEvery);

  for (let i = 1; i < numSigns; i++) {
    const t = (i * signEvery) / totalLength;
    if (t >= 1) break;
    const pt = fullCurve.getPointAt(t);
    const tan = fullCurve.getTangentAt(t);
    const right = new THREE.Vector3(-tan.z, 0, tan.x);

    const closestProject = sortedProjects.reduce((best, p) => {
      const d = new THREE.Vector3(p.position.x, 0, p.position.z).distanceTo(pt);
      const bd = new THREE.Vector3(best.position.x, 0, best.position.z).distanceTo(pt);
      return d < bd ? p : best;
    });

    const group = new THREE.Group();
    group.position.copy(pt.clone().addScaledVector(right, 9));
    group.position.y = 0;

    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 6);
    const postMat = new THREE.MeshToonMaterial({ color: new THREE.Color("#334") });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 2.5;
    group.add(post);

    const boardGeo = new THREE.BoxGeometry(8, 1.8, 0.1);
    const boardMat = new THREE.MeshToonMaterial({ color: new THREE.Color("#0a1a2a") });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 5.5;
    board.userData.signTech = closestProject.tech.slice(0, 3).join(" · ");
    group.add(board);

    const angle = Math.atan2(tan.x, tan.z);
    group.rotation.y = angle;

    signs.push(group);
  }

  return signs;
}

function buildRegionZone(project: Project): THREE.Mesh {
  const geo = new THREE.CircleGeometry(150, 48);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(project.regionColor),
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(project.position.x, 0.1, project.position.z);
  mesh.userData.projectId = project.id;
  return mesh;
}

export interface SceneRef {
  getVehiclePosition: () => THREE.Vector3;
  getPOIMeshes: () => THREE.Mesh[];
  panToProject: (projectId: string) => void;
}

export type SceneProps = {
  onProximity: (projectId: string | null) => void;
  onRegionChange: (projectId: string | null) => void;
  onSpeedChange: (speed: number) => void;
  vehicleType: "jeep" | "harley";
  externalJoystick?: { forward: number; turn: number } | null;
};

export default function Scene({
  onProximity,
  onRegionChange,
  onSpeedChange,
  vehicleType,
  externalJoystick,
}: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    vehicle: null as THREE.Group | null,
    vehicleBody: { velocity: new THREE.Vector3(), yaw: 0 },
    poiMeshes: [] as THREE.Mesh[],
    keys: { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false },
    frameCount: 0,
    lastProximityId: null as string | null,
    lastRegionId: null as string | null,
    fogLerpTarget: { color: new THREE.Color("#061a10"), density: 0.007 },
    animId: 0,
    panTarget: null as THREE.Vector3 | null,
    isPanning: false,
  });

  const onProximityRef = useRef(onProximity);
  const onRegionChangeRef = useRef(onRegionChange);
  const onSpeedChangeRef = useRef(onSpeedChange);
  onProximityRef.current = onProximity;
  onRegionChangeRef.current = onRegionChange;
  onSpeedChangeRef.current = onSpeedChange;

  const externalJoystickRef = useRef(externalJoystick);
  externalJoystickRef.current = externalJoystick;

  const vehicleTypeRef = useRef(vehicleType);
  vehicleTypeRef.current = vehicleType;

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const s = stateRef.current;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    s.renderer = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#061a10", 0.007);
    scene.background = new THREE.Color("#020a06");
    s.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.5,
      2000
    );
    camera.position.set(0, 22, 45);
    camera.lookAt(0, 0, 0);
    s.camera = camera;

    // Lighting
    const ambient = new THREE.AmbientLight("#334455", 1.2);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight("#aaccee", 2.0);
    sun.position.set(200, 300, 100);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1500;
    sun.shadow.camera.left = -600;
    sun.shadow.camera.right = 600;
    sun.shadow.camera.top = 600;
    sun.shadow.camera.bottom = -600;
    scene.add(sun);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 3000;
      starPositions[i + 1] = Math.random() * 500 + 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 3000;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: "#ffffff", size: 0.8, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // Terrain
    const terrain = buildTerrain();
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Sort projects by date
    const sorted = [...(projects as Project[])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Region zones
    sorted.forEach((p) => {
      scene.add(buildRegionZone(p));
    });

    // Road
    const roadMeshes = buildRoad(sorted);
    roadMeshes.forEach((m) => { m.receiveShadow = true; scene.add(m); });

    // Roadside signs
    const signs = buildRoadsideSigns(sorted);
    signs.forEach((g) => scene.add(g));

    // POIs
    const poiMeshes: THREE.Mesh[] = [];
    sorted.forEach((p) => {
      const g = buildPOI(p);
      scene.add(g);
      g.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.userData.isPOI) {
          poiMeshes.push(child as THREE.Mesh);
        }
      });
    });
    s.poiMeshes = poiMeshes;

    // Vehicle placeholder
    const vGeo =
      vehicleTypeRef.current === "jeep"
        ? new THREE.BoxGeometry(4, 2, 6)
        : new THREE.BoxGeometry(2, 1.5, 5);
    const vMat = new THREE.MeshToonMaterial({ color: new THREE.Color("#22aaff") });
    const vehicle = new THREE.Group();
    const body = new THREE.Mesh(vGeo, vMat);
    body.castShadow = true;
    body.position.y = 1;
    vehicle.add(body);

    // Headlights
    const hl = new THREE.PointLight("#aaddff", 3, 60);
    hl.position.set(0, 2, -4);
    vehicle.add(hl);

    vehicle.position.set(sorted[0].position.x, 2, sorted[0].position.z);
    scene.add(vehicle);
    s.vehicle = vehicle;

    // Key listeners
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key as keyof typeof s.keys;
      if (k in s.keys) { s.keys[k] = down; e.preventDefault(); }
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const camOffset = new THREE.Vector3(0, 22, 45);
    const camTarget = new THREE.Vector3();

    function animate(time: number) {
      s.animId = requestAnimationFrame(animate);
      s.frameCount++;
      const t = time * 0.001;
      const dt = Math.min(0.05, 1 / 60);

      if (!s.isPanning) {
        // Vehicle physics
        const maxSpeed = vehicleTypeRef.current === "harley" ? 28 : 18;
        const accel = vehicleTypeRef.current === "harley" ? 0.9 : 0.6;
        const friction = 0.88;
        const turnSpeed = 0.03;

        const joy = externalJoystickRef.current;
        const fwd = s.keys.w || s.keys.ArrowUp || (joy ? joy.forward > 0.2 : false);
        const bwd = s.keys.s || s.keys.ArrowDown || (joy ? joy.forward < -0.2 : false);
        const lft = s.keys.a || s.keys.ArrowLeft || (joy ? joy.turn < -0.2 : false);
        const rgt = s.keys.d || s.keys.ArrowRight || (joy ? joy.turn > 0.2 : false);

        if (fwd) s.vehicleBody.velocity.z -= accel;
        if (bwd) s.vehicleBody.velocity.z += accel * 0.6;
        if (lft) s.vehicleBody.yaw += turnSpeed * (s.vehicleBody.velocity.z < 0 ? -1 : 1);
        if (rgt) s.vehicleBody.yaw -= turnSpeed * (s.vehicleBody.velocity.z < 0 ? -1 : 1);

        s.vehicleBody.velocity.z = Math.max(-maxSpeed, Math.min(maxSpeed, s.vehicleBody.velocity.z));
        s.vehicleBody.velocity.z *= friction;

        const yaw = s.vehicleBody.yaw;
        const dx = Math.sin(yaw) * s.vehicleBody.velocity.z * dt;
        const dz = Math.cos(yaw) * s.vehicleBody.velocity.z * dt;

        if (s.vehicle) {
          s.vehicle.position.x = Math.max(-600, Math.min(600, s.vehicle.position.x + dx));
          s.vehicle.position.z = Math.max(-600, Math.min(600, s.vehicle.position.z + dz));
          s.vehicle.rotation.y = yaw;
          const speed = Math.abs(s.vehicleBody.velocity.z);
          if (s.frameCount % 4 === 0) onSpeedChangeRef.current(Math.round(speed * 10));
        }

        // Spring-arm camera
        const idealOffset = new THREE.Vector3(
          Math.sin(yaw) * camOffset.z,
          camOffset.y,
          Math.cos(yaw) * camOffset.z
        );
        const idealPos = s.vehicle!.position.clone().add(idealOffset);
        camera.position.lerp(idealPos, 0.08);
        camTarget.lerp(s.vehicle!.position.clone().setY(s.vehicle!.position.y + 3), 0.12);
        camera.lookAt(camTarget);
      } else if (s.panTarget) {
        camera.position.lerp(s.panTarget.clone().add(new THREE.Vector3(0, 120, 0)), 0.04);
        camTarget.lerp(s.panTarget, 0.04);
        camera.lookAt(camTarget);
      }

      // Animate POI emissive
      s.poiMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshToonMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + mesh.position.x * 0.1) * 0.4;
      });

      // Proximity check (every 10 frames)
      if (s.frameCount % 10 === 0 && s.vehicle && !s.isPanning) {
        let nearest: string | null = null;
        let nearestDist = Infinity;
        for (const p of projects as Project[]) {
          const dx = s.vehicle.position.x - p.position.x;
          const dz = s.vehicle.position.z - p.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < nearestDist) { nearestDist = dist; nearest = p.id; }
        }
        const inRegion = nearestDist < 150 ? nearest : null;
        if (inRegion !== s.lastRegionId) {
          s.lastRegionId = inRegion;
          onRegionChangeRef.current(inRegion);
          const p = (projects as Project[]).find((proj) => proj.id === inRegion);
          if (p) {
            s.fogLerpTarget.color = new THREE.Color(p.fogColor);
            s.fogLerpTarget.density = p.fogDensity;
          } else {
            s.fogLerpTarget.color = new THREE.Color("#061a10");
            s.fogLerpTarget.density = 0.007;
          }
        }

        const popupTrigger = nearestDist < 40 ? nearest : null;
        if (popupTrigger !== s.lastProximityId) {
          s.lastProximityId = popupTrigger;
          onProximityRef.current(popupTrigger);
        }
      }

      // Lerp fog
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(s.fogLerpTarget.color, 0.02);
        scene.fog.density +=
          (s.fogLerpTarget.density - scene.fog.density) * 0.02;
        scene.background = scene.fog.color.clone().multiplyScalar(0.3);
      }

      renderer.render(scene, camera);
    }

    s.animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener("keydown", (e) => onKey(e, true));
      window.removeEventListener("keyup", (e) => onKey(e, false));
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry.dispose();
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
