import { useRef, useCallback } from "react";
import type { Project } from "./types";

export function useProximity(projects: Project[]) {
  const lastTriggeredRef = useRef<string | null>(null);

  const check = useCallback(
    (
      vehicleX: number,
      vehicleZ: number,
      onTrigger: (projectId: string | null) => void,
      triggerRadius = 40
    ) => {
      let nearest: string | null = null;
      let nearestDist = Infinity;

      for (const p of projects) {
        const dx = vehicleX - p.position.x;
        const dz = vehicleZ - p.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < triggerRadius && dist < nearestDist) {
          nearestDist = dist;
          nearest = p.id;
        }
      }

      if (nearest !== lastTriggeredRef.current) {
        lastTriggeredRef.current = nearest;
        onTrigger(nearest);
      }
    },
    [projects]
  );

  return { check };
}
