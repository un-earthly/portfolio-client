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

// Projects sorted chronologically — the order you travel through them.
const NAV_PROJECTS = [...(projects as Project[])].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

export default function HUD() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [speed, setSpeed] = useState(0);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [navTarget, setNavTarget] = useState<{ id: string; seq: number } | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const vehiclePositionRef = useRef({ x: 0, z: 0 });
  const navSeqRef = useRef(0);
  const joystickRef = useRef<{ forward: number; turn: number } | null>(null);
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const currentHowlRef = useRef<Howl | null>(null);
  const currentAmbienceRef = useRef<AudioAmbienceId | null>(null);

  // Load localStorage vehicle preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("xmap-vehicle") as VehicleType | null;
    if (saved === "car" || saved === "bike") setVehicleType(saved);
  }, []);

  const navigateTo = useCallback((id: string) => {
    navSeqRef.current += 1;
    setNavTarget({ id, seq: navSeqRef.current });
    setNavOpen(false);
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
    setPopupProjectId(null);
    navigateTo(projectId);
  }, [navigateTo]);

  return (
    <>
      {/* 3D Scene */}
      <Scene
        onProximity={setPopupProjectId}
        onRegionChange={setActiveProjectId}
        onSpeedChange={setSpeed}
        vehicleType={vehicleType}
        externalJoystick={joystickRef.current}
        navTarget={navTarget}
        positionRef={vehiclePositionRef}
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

      {/* Fast-travel NAV selector — top left (below "Exit map") */}
      <div
        style={{
          position: "fixed",
          top: 44,
          left: 16,
          zIndex: 35,
          fontFamily: "monospace",
          width: 220,
        }}
      >
        <button
          onClick={() => setNavOpen((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: navOpen ? "rgba(0,255,204,0.12)" : "rgba(5,13,20,0.7)",
            border: `1px solid ${navOpen ? "#00ffcc" : "rgba(0,255,204,0.3)"}`,
            color: "#00ffcc",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "8px 12px",
            borderRadius: 2,
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          <span>⊹ Navigate to</span>
          <span style={{ opacity: 0.6 }}>{navOpen ? "▲" : "▼"}</span>
        </button>
        {navOpen && (
          <div
            style={{
              marginTop: 4,
              background: "rgba(5,13,20,0.92)",
              border: "1px solid rgba(0,255,204,0.25)",
              borderRadius: 2,
              overflow: "hidden",
              backdropFilter: "blur(6px)",
            }}
          >
            {NAV_PROJECTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => navigateTo(p.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: activeProjectId === p.id ? "rgba(0,255,204,0.1)" : "transparent",
                  border: "none",
                  borderTop: i === 0 ? "none" : "1px solid rgba(0,255,204,0.08)",
                  color: activeProjectId === p.id ? "#00ffcc" : "#8aabb8",
                  fontSize: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,204,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = activeProjectId === p.id ? "rgba(0,255,204,0.1)" : "transparent"; }}
              >
                <span style={{ letterSpacing: "0.05em" }}>
                  {String(i + 1).padStart(2, "0")} · {p.name}
                </span>
                <span style={{ fontSize: 8, opacity: 0.5, letterSpacing: "0.15em" }}>
                  {p.date} · {p.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

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
        {(["car", "bike"] as VehicleType[]).map((type) => (
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
        <div>WASD / ARROWS — drive</div>
        <div>SPACE — brake</div>
        <div>NAV ▼ — fast-travel</div>
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
