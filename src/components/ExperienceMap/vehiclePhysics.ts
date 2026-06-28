import * as CANNON from "cannon-es";
import { getHeight, HALF, TERRAIN_SIZE } from "./terrain";
import type { VehicleType } from "./types";

export interface VehicleControls {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export interface VehicleTuning {
  halfExtents: CANNON.Vec3;
  mass: number;
  engineForce: number;
  maxSpeed: number;
  turnRate: number;
  linearDamping: number;
}

const TUNING: Record<VehicleType, VehicleTuning> = {
  car: {
    halfExtents: new CANNON.Vec3(2, 0.9, 3.4),
    mass: 420,
    engineForce: 9000,
    maxSpeed: 70,
    turnRate: 1.7,
    linearDamping: 0.35,
  },
  bike: {
    halfExtents: new CANNON.Vec3(0.9, 1, 2.6),
    mass: 200,
    engineForce: 6200,
    maxSpeed: 92,
    turnRate: 2.3,
    linearDamping: 0.28,
  },
};

const HF_RES = 121; // 120 cells -> elementSize = 1200/120 = 10
const ELEMENT = TERRAIN_SIZE / (HF_RES - 1);

export class VehicleSim {
  world: CANNON.World;
  chassis: CANNON.Body;
  private tuning: VehicleTuning;
  private autopilot: { active: boolean; target: CANNON.Vec3; t: number; from: CANNON.Vec3; yawFrom: number; yawTo: number } | null = null;

  constructor(type: VehicleType, startX: number, startZ: number) {
    this.tuning = TUNING[type];

    const world = new CANNON.World();
    world.gravity.set(0, -30, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    (world.solver as CANNON.GSSolver).iterations = 8;
    world.defaultContactMaterial.friction = 0.4;
    this.world = world;

    // Ground heightfield matching the visual terrain exactly.
    const matrix: number[][] = [];
    for (let i = 0; i < HF_RES; i++) {
      const row: number[] = [];
      const wx = -HALF + i * ELEMENT;
      for (let j = 0; j < HF_RES; j++) {
        const wz = HALF - j * ELEMENT;
        row.push(getHeight(wx, wz));
      }
      matrix.push(row);
    }
    const hfShape = new CANNON.Heightfield(matrix, { elementSize: ELEMENT });
    const hfBody = new CANNON.Body({ mass: 0 });
    hfBody.addShape(hfShape);
    hfBody.position.set(-HALF, 0, HALF);
    hfBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(hfBody);

    // Chassis — a dynamic rigid body. We lock pitch/roll so it stays
    // upright (arcade feel) while gravity keeps it planted on the hills.
    const shape = new CANNON.Box(this.tuning.halfExtents);
    const chassis = new CANNON.Body({ mass: this.tuning.mass });
    chassis.addShape(shape);
    chassis.linearDamping = this.tuning.linearDamping;
    chassis.angularDamping = 0.9;
    chassis.angularFactor.set(0, 1, 0); // yaw only
    const startY = getHeight(startX, startZ) + this.tuning.halfExtents.y + 1.5;
    chassis.position.set(startX, startY, startZ);
    world.addBody(chassis);
    this.chassis = chassis;
  }

  setType(type: VehicleType) {
    this.tuning = TUNING[type];
    // Swap collision shape in place, keep position/velocity.
    this.chassis.shapes.length = 0;
    this.chassis.shapeOffsets.length = 0;
    this.chassis.shapeOrientations.length = 0;
    this.chassis.addShape(new CANNON.Box(this.tuning.halfExtents));
    this.chassis.mass = this.tuning.mass;
    this.chassis.linearDamping = this.tuning.linearDamping;
    this.chassis.updateMassProperties();
    this.chassis.updateBoundingRadius();
  }

  get chassisHalfY(): number {
    return this.tuning.halfExtents.y;
  }

  get yaw(): number {
    const q = this.chassis.quaternion;
    // yaw around Y
    return Math.atan2(
      2 * (q.w * q.y + q.x * q.z),
      1 - 2 * (q.y * q.y + q.z * q.z)
    );
  }

  get speed(): number {
    const v = this.chassis.velocity;
    return Math.sqrt(v.x * v.x + v.z * v.z);
  }

  navigateTo(x: number, z: number) {
    const from = this.chassis.position.clone();
    const target = new CANNON.Vec3(x, getHeight(x, z) + this.tuning.halfExtents.y + 1.5, z);
    const dx = x - from.x;
    const dz = z - from.z;
    const yawTo = Math.atan2(dx, dz);
    this.chassis.type = CANNON.Body.KINEMATIC;
    this.chassis.velocity.setZero();
    this.chassis.angularVelocity.setZero();
    this.autopilot = { active: true, target, t: 0, from, yawFrom: this.yaw, yawTo };
  }

  get isAutopiloting(): boolean {
    return !!this.autopilot?.active;
  }

  step(controls: VehicleControls, dt: number) {
    if (this.autopilot?.active) {
      const ap = this.autopilot;
      ap.t = Math.min(1, ap.t + dt / 1.8);
      const e = ap.t < 0.5 ? 2 * ap.t * ap.t : 1 - Math.pow(-2 * ap.t + 2, 2) / 2; // easeInOut
      const arc = Math.sin(ap.t * Math.PI) * 12; // gentle hop arc
      this.chassis.position.set(
        ap.from.x + (ap.target.x - ap.from.x) * e,
        ap.from.y + (ap.target.y - ap.from.y) * e + arc,
        ap.from.z + (ap.target.z - ap.from.z) * e
      );
      let dyaw = ap.yawTo - ap.yawFrom;
      while (dyaw > Math.PI) dyaw -= Math.PI * 2;
      while (dyaw < -Math.PI) dyaw += Math.PI * 2;
      this.chassis.quaternion.setFromEuler(0, ap.yawFrom + dyaw * e, 0);
      this.world.step(1 / 60, dt, 3);
      if (ap.t >= 1) {
        this.autopilot = null;
        this.chassis.type = CANNON.Body.DYNAMIC;
        this.chassis.velocity.setZero();
        this.chassis.angularVelocity.setZero();
        this.chassis.wakeUp();
      }
      return;
    }

    const t = this.tuning;
    const yaw = this.yaw;
    // Forward unit vector in world space (chassis faces -Z locally).
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);

    let drive = 0;
    if (controls.forward) drive += 1;
    if (controls.back) drive -= 0.55;

    if (drive !== 0) {
      const f = t.engineForce * drive;
      this.chassis.applyForce(new CANNON.Vec3(fx * f, 0, fz * f), this.chassis.position);
    }

    // Steering — yaw velocity proportional to ground speed, sign flips in reverse.
    const speed = this.speed;
    const steerInput = (controls.left ? 1 : 0) - (controls.right ? 1 : 0);
    if (steerInput !== 0 && speed > 1.5) {
      const dir = drive < 0 ? -1 : 1;
      const grip = Math.min(1, speed / 25);
      this.chassis.angularVelocity.y = steerInput * t.turnRate * grip * dir;
    } else {
      this.chassis.angularVelocity.y *= 0.85;
    }

    if (controls.brake) {
      this.chassis.velocity.x *= 0.9;
      this.chassis.velocity.z *= 0.9;
    }

    // Clamp horizontal speed.
    const hs = this.speed;
    if (hs > t.maxSpeed) {
      const s = t.maxSpeed / hs;
      this.chassis.velocity.x *= s;
      this.chassis.velocity.z *= s;
    }

    // Keep within world bounds.
    const p = this.chassis.position;
    const lim = HALF - 20;
    if (p.x > lim) { p.x = lim; this.chassis.velocity.x = 0; }
    if (p.x < -lim) { p.x = -lim; this.chassis.velocity.x = 0; }
    if (p.z > lim) { p.z = lim; this.chassis.velocity.z = 0; }
    if (p.z < -lim) { p.z = -lim; this.chassis.velocity.z = 0; }

    this.world.step(1 / 60, dt, 3);
  }

  dispose() {
    // cannon-es has no global teardown; drop references.
    this.world.bodies.length = 0;
  }
}
