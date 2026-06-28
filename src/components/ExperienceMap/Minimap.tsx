"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import projects from "@/data/projects.json";
import type { Project } from "./types";

const MAP_SIZE = 160;
const WORLD_RANGE = 800;

interface MinimapProps {
  vehiclePosition: React.MutableRefObject<{ x: number; z: number }>;
}

export default function Minimap({ vehiclePosition }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(MAP_SIZE, MAP_SIZE);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030d0a");

    const camera = new THREE.OrthographicCamera(
      -WORLD_RANGE, WORLD_RANGE,
      WORLD_RANGE, -WORLD_RANGE,
      0.1, 2000
    );
    camera.position.set(0, 500, 0);
    camera.lookAt(0, 0, 0);

    // Road line
    const sorted = [...(projects as Project[])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const points = sorted.map((p) => new THREE.Vector3(p.position.x, 1, p.position.z));
    if (points.length >= 2) {
      const curve = new THREE.CatmullRomCurve3(points);
      const linePoints = curve.getPoints(80);
      const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const mat = new THREE.LineBasicMaterial({ color: "#334466", linewidth: 1 });
      scene.add(new THREE.Line(geo, mat));
    }

    // POI dots
    (projects as Project[]).forEach((p) => {
      const geo = new THREE.CircleGeometry(12, 8);
      geo.rotateX(-Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({ color: "#00ffcc" });
      const dot = new THREE.Mesh(geo, mat);
      dot.position.set(p.position.x, 2, p.position.z);
      scene.add(dot);
    });

    // Player dot
    const playerGeo = new THREE.CircleGeometry(16, 6);
    playerGeo.rotateX(-Math.PI / 2);
    const playerMat = new THREE.MeshBasicMaterial({ color: "#ffcc00" });
    const playerDot = new THREE.Mesh(playerGeo, playerMat);
    playerDot.position.y = 3;
    scene.add(playerDot);

    let frameCount = 0;
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      frameCount++;
      if (frameCount % 3 !== 0) return;
      playerDot.position.x = vehiclePosition.current.x;
      playerDot.position.z = vehiclePosition.current.z;
      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry.dispose();
          const m = (obj as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
    };
  }, [vehiclePosition]);

  return (
    <div
      style={{
        position: "relative",
        width: MAP_SIZE,
        height: MAP_SIZE,
        border: "1px solid rgba(0,255,204,0.25)",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(0,255,204,0.06)",
      }}
    >
      {/* Corner accents */}
      <span style={{ position: "absolute", top: 0, left: 0, width: 8, height: 8, borderTop: "2px solid #00ffcc", borderLeft: "2px solid #00ffcc", zIndex: 1 }} />
      <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderTop: "2px solid #00ffcc", borderRight: "2px solid #00ffcc", zIndex: 1 }} />
      <span style={{ position: "absolute", bottom: 0, left: 0, width: 8, height: 8, borderBottom: "2px solid #00ffcc", borderLeft: "2px solid #00ffcc", zIndex: 1 }} />
      <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderBottom: "2px solid #00ffcc", borderRight: "2px solid #00ffcc", zIndex: 1 }} />
      <canvas ref={canvasRef} style={{ display: "block", width: MAP_SIZE, height: MAP_SIZE }} />
      <div style={{ position: "absolute", top: 4, left: 0, right: 0, textAlign: "center", fontSize: 7, color: "#00ffcc88", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "monospace", pointerEvents: "none" }}>
        MINIMAP
      </div>
    </div>
  );
}
