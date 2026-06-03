---
title: How I Built an Offline-First Event Platform Using BLE Mesh Networking
date: 2025-11-15
tags: [BLE mesh, React Native, offline-first, JavaScript, mobile engineering, Bluetooth networking]
metaDescription: How I designed a production-grade offline-first event management app using BLE mesh networking, Kalman filtering, and hybrid transport layers — without any internet dependency.
readTime: 22
type: technical
excerpt: Most apps assume the internet exists. I built one that doesn't. This is how I architected OurStoryz — a production event platform that works fully offline using BLE mesh networking, Kalman filtering for RSSI-based positioning, and hybrid transport layers.
---

Most apps assume the internet exists. I built one that doesn't.

At Mediusware, I'm leading development of OurStoryz — an event guest management platform designed to work in environments where Wi-Fi is unreliable, cellular is congested, and every device in the room is fighting for bandwidth. Think large weddings, festival grounds, closed-campus events. Exactly the environments where every other app breaks down.

The core problem: how do you enable real-time communication and location tracking between hundreds of guests using only the devices already in their pockets?

The answer was BLE mesh.

## The Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    OurStoryz Mesh Network                │
│                                                         │
│  Device A ──── BLE ────► Device B ──── BLE ────► Device C
│     │                      │  │                      │  │
│  Wi-Fi Direct          BLE │  Wi-Fi Direct        BLE │  │
│     │                      │  │                      │  │
│  Device D ◄─── BLE ─────── E  F ──── Multipeer ──────► G │
│                                                         │
│  ┌─────────────┐    Every node: Dual Central/Peripheral  │
│  │  Realm DB   │    No central server in the signal path │
│  │  (local)    │    Messages hop peer-to-peer             │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

Each device runs in a dual Central/Peripheral BLE role simultaneously. It broadcasts its own presence while scanning for nearby peers. There's no central server in the loop — devices discover each other directly and form a mesh where messages can hop peer-to-peer across the network.

### Dual-Role BLE: The Implementation

The key insight is that iOS and Android both support concurrent advertising and scanning, but the API surface is different enough that you need a clean abstraction layer:

```typescript
interface BLENodeConfig {
  deviceId: string;
  serviceUUID: string;
  characteristicUUID: string;
  maxHops: number;
  ttl: number; // time-to-live in seconds
}

class DualRoleBLENode {
  private centralManager: CentralManager;
  private peripheralManager: PeripheralManager;
  private routingTable: Map<string, RouteEntry> = new Map();
  private messageCache: Set<string> = new Set(); // dedup by message ID

  async startMesh(config: BLENodeConfig): Promise<void> {
    // Start advertising OUR presence as peripheral
    await this.peripheralManager.startAdvertising({
      serviceUUIDs: [config.serviceUUID],
      localName: config.deviceId,
    });

    // Start scanning for OTHER nodes as central
    this.centralManager.startScanning({
      serviceUUIDs: [config.serviceUUID],
      allowDuplicates: false,
      onDiscover: (peripheral) => this.onPeerDiscovered(peripheral),
    });
  }

  private onPeerDiscovered(peripheral: Peripheral): void {
    // Update routing table with fresh RSSI reading
    this.routingTable.set(peripheral.id, {
      peripheral,
      rssi: peripheral.rssi,
      lastSeen: Date.now(),
      smoothedRssi: this.kalmanFilter(peripheral.id, peripheral.rssi),
    });
  }

  async routeMessage(msg: MeshMessage): Promise<void> {
    if (this.messageCache.has(msg.id)) return; // already seen, drop
    this.messageCache.add(msg.id);

    if (msg.targetId === this.config.deviceId) {
      this.onMessageReceived(msg);
      return;
    }

    if (msg.hopCount >= this.config.maxHops) return; // TTL expired

    const nextHop = this.selectNextHop(msg.targetId);
    if (nextHop) {
      await this.sendToPeer(nextHop, { ...msg, hopCount: msg.hopCount + 1 });
    }
  }
}
```

### RSSI Smoothing With Kalman Filtering

BLE in a crowded event space is brutal. Signal noise is everywhere. A single RSSI reading from a nearby device can swing 15 dBm between measurements due to multipath interference, body shadowing, and competing RF sources. Raw RSSI is useless for positioning.

I implemented a scalar Kalman filter per tracked device. The state is the estimated true signal strength; the observation is the raw RSSI reading. The filter separates signal from noise:

```typescript
interface KalmanState {
  x: number;  // estimated signal (dBm)
  p: number;  // estimation error covariance
}

const Q = 0.008; // process noise — how fast the true signal can change
const R = 2.5;   // measurement noise — how noisy the sensor is

class RSSIKalmanFilter {
  private states: Map<string, KalmanState> = new Map();

  update(deviceId: string, measurement: number): number {
    if (!this.states.has(deviceId)) {
      this.states.set(deviceId, { x: measurement, p: 1.0 });
      return measurement;
    }

    const { x, p } = this.states.get(deviceId)!;

    // Predict step: propagate uncertainty forward
    const p_pred = p + Q;

    // Update step: incorporate new measurement
    const K = p_pred / (p_pred + R); // Kalman gain
    const x_new = x + K * (measurement - x);
    const p_new = (1 - K) * p_pred;

    this.states.set(deviceId, { x: x_new, p: p_new });
    return x_new;
  }
}
```

With `Q = 0.008` and `R = 2.5`, the filter heavily weights prior estimates over noisy new readings. This gives stable position estimates even in RF-hostile environments. The values were tuned empirically in a 300-person test environment.

### Trilateration: From Signal to Position

With smoothed RSSI values from three or more reference nodes, we can estimate position. The RSSI-to-distance conversion uses the log-distance path loss model:

```typescript
const PATH_LOSS_EXPONENT = 2.8; // empirically tuned; 2.0 = free space
const REFERENCE_RSSI = -59;     // RSSI at 1 metre (device-specific calibration)

function rssiToDistance(rssi: number): number {
  return Math.pow(10, (REFERENCE_RSSI - rssi) / (10 * PATH_LOSS_EXPONENT));
}

interface Anchor {
  x: number;
  y: number;
  distance: number; // metres, from rssiToDistance()
}

// Non-linear least squares solver (Gauss-Newton, 2 iterations is enough for events)
function trilaterate(anchors: Anchor[]): { x: number; y: number } | null {
  if (anchors.length < 3) return null;

  let x = 0, y = 0; // initial estimate: centroid of anchors
  anchors.forEach(a => { x += a.x; y += a.y; });
  x /= anchors.length;
  y /= anchors.length;

  for (let iter = 0; iter < 10; iter++) {
    let sumFx = 0, sumFy = 0, sumF2 = 0;
    let Jx = 0, Jy = 0;

    for (const a of anchors) {
      const dx = x - a.x;
      const dy = y - a.y;
      const est = Math.sqrt(dx * dx + dy * dy);
      const residual = est - a.distance;
      if (est < 1e-9) continue;
      sumFx += residual * (dx / est);
      sumFy += residual * (dy / est);
      sumF2 += residual * residual;
      Jx += (dx * dx) / (est * est);
      Jy += (dy * dy) / (est * est);
    }

    const denom = Jx + Jy;
    if (Math.abs(denom) < 1e-9) break;
    x -= sumFx / denom;
    y -= sumFy / denom;
  }

  return { x, y };
}
```

In practice, event venues are 2D enough that this converges in 2–3 iterations. The position error is ±2–4 metres, sufficient for "zone-level" tracking (near stage, near bar, near exit) without GPS.

## The Transport Layer

BLE alone isn't enough. I built a hybrid transport system that routes communication across three channels depending on what's available:

```
Transport Priority Stack
─────────────────────────
Priority 1: BLE (always available, low energy, short range)
Priority 2: Wi-Fi Direct (when negotiated, 250 Mbps, 200m range)
Priority 3: Apple Multipeer Connectivity (iOS fallback, ~100m)

Selection logic: capability negotiation during BLE handshake
```

```typescript
type Transport = "ble" | "wifi-direct" | "multipeer";

interface TransportCapability {
  ble: boolean;
  wifiDirect: boolean;
  multipeer: boolean; // iOS only
}

class HybridTransport {
  private activeTransport: Transport = "ble";
  private transportHealth: Record<Transport, number> = {
    "ble": 1, "wifi-direct": 0, "multipeer": 0
  };

  selectTransport(
    localCaps: TransportCapability,
    remoteCaps: TransportCapability,
    payloadSize: number
  ): Transport {
    const canUseWifi = localCaps.wifiDirect && remoteCaps.wifiDirect;
    const canUseMultipeer = localCaps.multipeer && remoteCaps.multipeer;

    // Large payloads (photos, venue maps) prefer Wi-Fi Direct
    if (payloadSize > 50_000 && canUseWifi && this.transportHealth["wifi-direct"] > 0.5) {
      return "wifi-direct";
    }

    // BLE for everything under 512 bytes (control messages, positions, pings)
    if (payloadSize <= 512 && this.transportHealth["ble"] > 0.5) {
      return "ble";
    }

    if (canUseMultipeer && this.transportHealth["multipeer"] > 0.5) {
      return "multipeer";
    }

    return "ble"; // always fall back to BLE
  }

  reportFailure(transport: Transport): void {
    // Exponential decay on failures
    this.transportHealth[transport] *= 0.5;
    if (this.transportHealth[transport] < 0.1) {
      // Silence that transport for 30 seconds
      setTimeout(() => { this.transportHealth[transport] = 0.5; }, 30_000);
    }
  }
}
```

If a guest's device loses one channel, the system silently promotes the next available one. Messages queue locally in Realm DB with conflict resolution logic, so nothing is lost during handovers.

## Offline Queue: Realm DB

Every outgoing message — regardless of transport — goes through a persistent queue:

```typescript
class MessageSchema extends Realm.Object {
  _id!: string;
  payload!: string;          // JSON-serialized, AES-encrypted
  targetId!: string;
  transport!: string;
  queuedAt!: number;
  attempts!: number;
  maxAttempts!: number;
  status!: "pending" | "sent" | "failed";

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "string",
      payload: "string",
      targetId: "string",
      transport: "string",
      queuedAt: "int",
      attempts: { type: "int", default: 0 },
      maxAttempts: { type: "int", default: 5 },
      status: { type: "string", default: "pending" },
    },
  };
}

// The retry worker runs every 5 seconds when the app is foregrounded
async function processQueue(realm: Realm): Promise<void> {
  const pending = realm.objects<MessageSchema>("Message")
    .filtered("status == 'pending' AND attempts < maxAttempts");

  for (const msg of pending) {
    try {
      await transmit(JSON.parse(msg.payload), msg.transport as Transport);
      realm.write(() => { msg.status = "sent"; });
    } catch {
      realm.write(() => {
        msg.attempts += 1;
        if (msg.attempts >= msg.maxAttempts) msg.status = "failed";
      });
    }
  }
}
```

The queue survives app restarts. Messages with `attempts >= maxAttempts` are marked failed and surfaced to the user ("couldn't reach that guest").

## Security

This platform handles guest identity and private communications. The encryption stack:

- **AES-256-GCM** for message encryption (authenticated encryption — tampering is detectable)
- **ECDH on P-256** for peer-to-peer key exchange (no preshared secrets)
- Keys are device-ephemeral and rotated per session

```typescript
import { webcrypto } from "crypto";
const subtle = webcrypto.subtle;

async function deriveSharedKey(
  localPrivateKey: CryptoKey,
  remotePubKeyBytes: ArrayBuffer
): Promise<CryptoKey> {
  const remotePubKey = await subtle.importKey(
    "raw", remotePubKeyBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false, []
  );

  const rawShared = await subtle.deriveBits(
    { name: "ECDH", public: remotePubKey },
    localPrivateKey, 256
  );

  // HKDF to derive a proper AES key from the raw shared secret
  const hkdfKey = await subtle.importKey("raw", rawShared, "HKDF", false, ["deriveKey"]);
  return subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: new Uint8Array() },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false, ["encrypt", "decrypt"]
  );
}

async function encryptMessage(key: CryptoKey, plaintext: string): Promise<ArrayBuffer> {
  const iv = webcrypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  // Prepend IV to ciphertext for transport
  const result = new Uint8Array(12 + ciphertext.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(ciphertext), 12);
  return result.buffer;
}
```

Every message is end-to-end encrypted across every transport layer. Whether it hops over BLE or Wi-Fi Direct, the payload is opaque to any relay node.

## What This Taught Me

Most engineers don't touch this layer of the stack. BLE mesh isn't in any bootcamp curriculum. The closest reference material is academic papers on sensor networks, Zigbee mesh specifications, and robotics SLAM literature. I pulled from distributed systems theory (CAP theorem applies to mesh networks too), RF signal processing, and mobile OS internals simultaneously.

The performance results in a 300-person closed-venue test:

```
Metric                    Target    Achieved
──────────────────────────────────────────────
Message delivery latency  < 500ms   ~180ms avg
Position update rate      2 Hz      2.1 Hz
Queue drain after outage  < 10s     6.8s avg
Battery overhead          < 8%      ~5.5%
Encryption overhead       < 5ms     ~1.8ms
```

The result: a production platform that works fully offline, handles dense guest crowds, and maintains encrypted communication regardless of network state.

If you're building anything in the offline-first, edge computing, or BLE space — this is the problem set I've lived inside.
