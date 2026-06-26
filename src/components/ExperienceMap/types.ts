export type ProjectStatus = "SHIPPED" | "ONGOING" | "ARCHIVED";
export type RoadCondition = "smooth" | "broken";
export type AudioAmbienceId = "forest" | "plains" | "industrial" | "urban" | "digital";
export type TimelineEventType = "milestone" | "issue";

export interface TimelineEvent {
  t: number;
  label: string;
  type: TimelineEventType;
}

export interface WorldPosition {
  x: number;
  z: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  date: string;
  tech: string[];
  stats: string[];
  position: WorldPosition;
  regionColor: string;
  fogColor: string;
  fogDensity: number;
  roadCondition: RoadCondition;
  audioAmbienceId: AudioAmbienceId;
  timeline: TimelineEvent[];
  issues: string[];
  meetings: string[];
}

export type VehicleType = "jeep" | "harley";

export interface VehicleState {
  type: VehicleType;
  speed: number;
  position: { x: number; y: number; z: number };
}

export interface ProximityTrigger {
  projectId: string;
  distance: number;
}

export interface RegionState {
  activeProjectId: string | null;
  fogColor: string;
  fogDensity: number;
}
