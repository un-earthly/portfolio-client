"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Howl } from "howler";
import projects from "@/data/projects.json";
import type { Project, VehicleType, AudioAmbienceId } from "./types";
import Popup from "./Popup";

const Scene = dynamic(() => import("./Scene"), { ssr: false });
const Minimap = dynamic(() => import("./Minimap"), { ssr: false });

const AMBIENCES: Record<AudioAmbienceId, string> = {
  forest: "/audio/ambience-forest.mp3",
  plains: "/audio/ambience-plains.mp3",
  industrial: "/audio/ambience-industrial.mp3",
  urban: "/audio/ambience-urban.mp3",
  digital: "/audio/ambience-digital.mp3",
};

export default function HUD() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("jeep");
  const [speed, setSpeed] = useState(0);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const vehiclePositionRef = useRef({ x: 0, z: 0 });
  const joystickRef = useRef<{ forward: number; turn: number } | null>(null);
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const currentHowlRef = useRef<Howl | null>(null);
  const currentAmbienceRef = useRef<AudioAmbienceId | null>(null);

  // Load localStorage vehicle preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("xmap-vehicle") as VehicleType | null;
    if (saved === "jeep" || saved === "harley") setVehicleType(saved);
  }, []);

  const handleVehicleChange = useCallback((type: VehicleType) => {
    setVehicleType(type);
    localStorage.setItem("xmap-vehicle", type);
  }, []);

  // Spatial audio
  useEffect(() => {
    if (!audioEnabled) {
      currentHowlRef.current?.stop();
      return;
    }

    const project = (projects as Project[]).find((p) => p.id === activeProjectId);
    const ambienceId: AudioAmbienceId = project?.audioAmbienceId ?? "forest";

    if (ambienceId === currentAmbienceRef.current) return;

    currentHowlRef.current?.fade(currentHowlRef.current.volume(), 0, 1000);
    const prev = currentHowlRef.current;
    setTimeout(() => prev?.stop(), 1100);

    currentAmbienceRef.current = ambienceId;
    const src = AMBIENCES[ambienceId];
    const howl = new Howl({ src: [src], loop: true, volume: 0, autoplay: true });
    howl.fade(0, 0.4, 1500);
    currentHowlRef.current = howl;
  }, [activeProjectId, audioEnabled]);

  // Nipplejs virtual joystick (mobile only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("ontouchstart" in window)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let manager: any = null;
    const container = joystickContainerRef.current;
    if (!container) return;

    import("nipplejs").then(({ default: nipplejs }) => {
      manager = nipplejs.create({
        zone: container,
        mode: "static",
        position: { left: "50%", top: "50%" },
        color: "#00ffcc",
        size: 80,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      manager.on("move", (_evt: any, data: any) => {
        const angle = data.angle?.radian ?? 0;
        const force = Math.min(data.force ?? 0, 1);
        joystickRef.current = {
          forward: Math.sin(angle) * force,
          turn: Math.cos(angle) * force,
        };
      });

      manager.on("end", () => {
        joystickRef.current = { forward: 0, turn: 0 };
      });
    });

    return () => {
      manager?.destroy();
    };
  }, []);

  const activeProject =
    (projects as Project[]).find((p) => p.id === activeProjectId) ?? null;
  const popupProject =
    (projects as Project[]).find((p) => p.id === popupProjectId) ?? null;

  const handleEnterRegion = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setPopupProjectId(null);
  }, []);

  return (
    <>
      {/* 3D Scene */}
      <Scene
        onProximity={setPopupProjectId}
        onRegionChange={setActiveProjectId}
        onSpeedChange={setSpeed}
        vehicleType={vehicleType}
        externalJoystick={joystickRef.current}
      />

      {/* Popup */}
      <Popup
        project={popupProject}
        onClose={() => setPopupProjectId(null)}
        onEnterRegion={handleEnterRegion}
      />

      {/* Speed readout — bottom center */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          fontSize: 11,
          color: "#00ffcc",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          pointerEvents: "none",
          textShadow: "0 0 12px rgba(0,255,204,0.5)",
          zIndex: 30,
        }}
      >
        {speed} km/h &nbsp;·&nbsp;{vehicleType.toUpperCase()}
      </div>

      {/* Active region label — top center */}
      {activeProject && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: 9,
            color: "#00ffcc88",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          ◈ REGION: {activeProject.name}
        </div>
      )}

      {/* Vehicle switcher — top right */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          gap: 8,
          zIndex: 30,
        }}
      >
        {(["jeep", "harley"] as VehicleType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleVehicleChange(type)}
            style={{
              background: vehicleType === type ? "rgba(0,255,204,0.15)" : "transparent",
              border: `1px solid ${vehicleType === type ? "#00ffcc" : "rgba(0,255,204,0.25)"}`,
              color: vehicleType === type ? "#00ffcc" : "#00ffcc66",
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {type}
          </button>
        ))}

        {/* Audio toggle */}
        <button
          onClick={() => setAudioEnabled((v) => !v)}
          style={{
            background: audioEnabled ? "rgba(0,255,204,0.15)" : "transparent",
            border: `1px solid ${audioEnabled ? "#00ffcc" : "rgba(0,255,204,0.25)"}`,
            color: audioEnabled ? "#00ffcc" : "#00ffcc66",
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          title="Toggle spatial audio"
        >
          {audioEnabled ? "SFX ON" : "SFX OFF"}
        </button>
      </div>

      {/* Minimap — bottom left */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <Minimap vehiclePosition={vehiclePositionRef} />
      </div>

      {/* Controls hint — bottom right */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 16,
          fontFamily: "monospace",
          fontSize: 8,
          color: "#00ffcc44",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          lineHeight: 1.8,
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
        <div>WASD / ARROWS — move</div>
        <div>Drive to POI — open log</div>
      </div>

      {/* Mobile joystick zone */}
      <div
        ref={joystickContainerRef}
        style={{
          position: "fixed",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 120,
          zIndex: 30,
          opacity: 0.7,
        }}
      />
    </>
  );
}
