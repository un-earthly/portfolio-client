"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, ChevronRight } from "lucide-react";
import type { Project } from "./types";

interface PopupProps {
  project: Project | null;
  onClose: () => void;
  onEnterRegion: (projectId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  SHIPPED: "#00ffaa",
  ONGOING: "#ffcc00",
  ARCHIVED: "#ff6666",
};

export default function Popup({ project, onClose, onEnterRegion }: PopupProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevProjectId = useRef<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (tlRef.current) tlRef.current.kill();

    if (project) {
      gsap.set(el, { display: "flex", opacity: 0, y: 120 });
      tlRef.current = gsap.timeline();
      tlRef.current.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      prevProjectId.current = project.id;
    } else if (prevProjectId.current) {
      tlRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
      tlRef.current.to(el, {
        opacity: 0,
        y: 120,
        duration: 0.35,
        ease: "power2.in",
      });
      prevProjectId.current = null;
    } else {
      gsap.set(el, { display: "none" });
    }
  }, [project]);

  if (!project) return <div ref={wrapRef} style={{ display: "none" }} />;

  const statusColor = STATUS_COLORS[project.status] ?? "#aaaaaa";

  return (
    <div
      ref={wrapRef}
      style={{ display: "none" }}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div
        className="pointer-events-auto relative flex flex-col gap-4 w-full max-w-lg mx-4"
        style={{
          background: "linear-gradient(135deg, #050d14 0%, #0a1a2a 100%)",
          border: "1px solid rgba(0,255,204,0.25)",
          boxShadow: "0 0 40px rgba(0,255,204,0.08), 0 0 0 1px rgba(0,255,204,0.06) inset",
          borderRadius: "2px",
          padding: "24px",
          fontFamily: "monospace",
        }}
      >
        {/* Corner accents */}
        <span style={{ position: "absolute", top: -1, left: -1, width: 12, height: 12, borderTop: "2px solid #00ffcc", borderLeft: "2px solid #00ffcc" }} />
        <span style={{ position: "absolute", top: -1, right: -1, width: 12, height: 12, borderTop: "2px solid #00ffcc", borderRight: "2px solid #00ffcc" }} />
        <span style={{ position: "absolute", bottom: -1, left: -1, width: 12, height: 12, borderBottom: "2px solid #00ffcc", borderLeft: "2px solid #00ffcc" }} />
        <span style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderBottom: "2px solid #00ffcc", borderRight: "2px solid #00ffcc" }} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 9, color: "#00ffcc", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                POI // {project.date}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "#000",
                  background: statusColor,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "1px 6px",
                  borderRadius: 1,
                  fontWeight: 700,
                }}
              >
                {project.status}
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#e0f7ff", letterSpacing: "0.02em", margin: 0 }}>
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(0,255,204,0.2)",
              color: "#00ffcc",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: "#8aabb8", lineHeight: 1.6, margin: 0 }}>
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                color: "#00ffcc",
                border: "1px solid rgba(0,255,204,0.3)",
                background: "rgba(0,255,204,0.05)",
                padding: "2px 8px",
                borderRadius: 1,
                letterSpacing: "0.05em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          {project.stats.map((stat) => (
            <span
              key={stat}
              style={{ fontSize: 11, color: "#e0f7ff", opacity: 0.7 }}
            >
              ◈ {stat}
            </span>
          ))}
        </div>

        {/* Timeline bar */}
        <div style={{ position: "relative", paddingTop: 6 }}>
          <div style={{ height: 2, background: "rgba(0,255,204,0.15)", borderRadius: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "100%",
                background: "linear-gradient(90deg, #00ffcc22, #00ffcc66)",
                borderRadius: 1,
              }}
            />
            {project.timeline.map((ev, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${ev.t * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: ev.type === "issue" ? "#ff4444" : "#00ffcc",
                    border: "2px solid #050d14",
                    position: "relative",
                  }}
                  title={ev.label}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 8,
                    color: ev.type === "issue" ? "#ff8888" : "#00ffcc99",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.05em",
                  }}
                >
                  {ev.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues (if any) */}
        {project.issues.length > 0 && (
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: 9, color: "#ff6666", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              Issues resolved
            </span>
            {project.issues.map((issue) => (
              <span key={issue} style={{ fontSize: 10, color: "#ff9999", opacity: 0.8 }}>
                ⚠ {issue}
              </span>
            ))}
          </div>
        )}

        {/* Enter region button */}
        <button
          onClick={() => onEnterRegion(project.id)}
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid #00ffcc",
            color: "#00ffcc",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "8px 16px",
            borderRadius: 2,
            cursor: "pointer",
            fontFamily: "monospace",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,204,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          Enter region <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
