"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// Constants
// ============================================================================

const NODE_COUNT = 180;
const SPHERE_RADIUS = 3.2;
const EDGE_MAX_DIST = 1.6; // max distance between nodes to form an edge
const ARC_DURATION = 2.5; // seconds for an arc to travel A→B
const ARC_FADE = 0.8; // seconds to fade out after arriving
const MAX_ACTIVE_ARCS = 2;
const ARC_SPAWN_INTERVAL_MIN = 2.0; // seconds
const ARC_SPAWN_INTERVAL_MAX = 5.0;

// ============================================================================
// Helpers — distribute points on a sphere via golden‐spiral
// ============================================================================

function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;
    positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(theta);
  }
  return positions;
}

// ============================================================================
// Sub‐component: Globe Nodes (InstancedMesh)
// ============================================================================

function GlobeNodes({ positions }: { positions: Float32Array }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = positions.length / 3;

  // Assign random phase offsets for pulsing
  const phases = useMemo(() => {
    const p = new Float32Array(count);
    for (let i = 0; i < count; i++) p[i] = Math.random() * Math.PI * 2;
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 1.2 + phases[i]);
      const s = 0.018 * pulse;
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// ============================================================================
// Sub‐component: Globe Edges (LineSegments)
// ============================================================================

function GlobeEdges({ positions }: { positions: Float32Array }) {
  const lineSegmentsObj = useMemo(() => {
    const count = positions.length / 3;
    const verts: number[] = [];

    for (let i = 0; i < count; i++) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        if (dx * dx + dy * dy + dz * dz < EDGE_MAX_DIST * EDGE_MAX_DIST) {
          verts.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verts, 3)
    );
    const mat = new THREE.LineBasicMaterial({
      color: "#1e40af",
      transparent: true,
      opacity: 0.12,
    });
    return new THREE.LineSegments(geo, mat);
  }, [positions]);

  return <primitive object={lineSegmentsObj} />;
}

// ============================================================================
// Sub‐component: Attack Arcs
// ============================================================================

interface ArcData {
  id: number;
  startIdx: number;
  endIdx: number;
  startTime: number;
}

function AttackArcs({ positions }: { positions: Float32Array }) {
  const [arcs, setArcs] = useState<ArcData[]>([]);
  const nextSpawn = useRef(1.5);
  const arcId = useRef(0);
  const nodeCount = positions.length / 3;

  const spawnArc = useCallback(
    (time: number) => {
      const a = Math.floor(Math.random() * nodeCount);
      let b = Math.floor(Math.random() * nodeCount);
      while (b === a) b = Math.floor(Math.random() * nodeCount);
      arcId.current += 1;
      return { id: arcId.current, startIdx: a, endIdx: b, startTime: time };
    },
    [nodeCount]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Remove expired arcs
    setArcs((prev) => {
      const alive = prev.filter(
        (arc) => t - arc.startTime < ARC_DURATION + ARC_FADE
      );

      // Spawn new arc?
      if (alive.length < MAX_ACTIVE_ARCS && t > nextSpawn.current) {
        nextSpawn.current =
          t +
          ARC_SPAWN_INTERVAL_MIN +
          Math.random() * (ARC_SPAWN_INTERVAL_MAX - ARC_SPAWN_INTERVAL_MIN);
        return [...alive, spawnArc(t)];
      }
      if (alive.length !== prev.length) return alive;
      return prev;
    });
  });

  return (
    <>
      {arcs.map((arc) => (
        <SingleArc key={arc.id} arc={arc} positions={positions} />
      ))}
    </>
  );
}

// ============================================================================
// Sub‐component: SingleArc (animated Bezier)
// ============================================================================

function SingleArc({
  arc,
  positions,
}: {
  arc: ArcData;
  positions: Float32Array;
}) {
  const curvePoints = useMemo(() => {
    const s = new THREE.Vector3(
      positions[arc.startIdx * 3],
      positions[arc.startIdx * 3 + 1],
      positions[arc.startIdx * 3 + 2]
    );
    const e = new THREE.Vector3(
      positions[arc.endIdx * 3],
      positions[arc.endIdx * 3 + 1],
      positions[arc.endIdx * 3 + 2]
    );

    // Control point: midpoint pushed outward
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const pushDir = mid.clone().normalize();
    const dist = s.distanceTo(e);
    const cp = mid.clone().add(pushDir.multiplyScalar(dist * 0.5));

    const curve = new THREE.QuadraticBezierCurve3(s, cp, e);
    return curve.getPoints(48);
  }, [arc, positions]);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        new Float32Array(curvePoints.length * 3),
        3
      )
    );
    const mat = new THREE.LineBasicMaterial({
      color: "#f97316",
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geo, mat);
  }, [curvePoints]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() - arc.startTime;

    // Progress: 0→1 over ARC_DURATION
    const drawProgress = Math.min(elapsed / ARC_DURATION, 1);

    // Fade: 1→0 after ARC_DURATION
    const fade =
      elapsed > ARC_DURATION
        ? Math.max(0, 1 - (elapsed - ARC_DURATION) / ARC_FADE)
        : 1;

    // Fill positions up to drawProgress
    const totalPts = curvePoints.length;
    const visiblePts = Math.max(2, Math.floor(drawProgress * totalPts));

    // Trail effect: only show last ~20 points for a "comet" look
    const trailLen = 22;
    const trailStart = Math.max(0, visiblePts - trailLen);

    const posArr = new Float32Array((visiblePts - trailStart) * 3);
    for (let i = trailStart; i < visiblePts; i++) {
      const idx = (i - trailStart) * 3;
      posArr[idx] = curvePoints[i].x;
      posArr[idx + 1] = curvePoints[i].y;
      posArr[idx + 2] = curvePoints[i].z;
    }

    const geo = lineObj.geometry as THREE.BufferGeometry;
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(posArr, 3)
    );
    geo.setDrawRange(0, visiblePts - trailStart);
    geo.computeBoundingSphere();

    const mat = lineObj.material as THREE.LineBasicMaterial;
    mat.opacity = fade * 0.85;
  });

  return <primitive object={lineObj} />;
}

// ============================================================================
// Sub‐component: Arc Glow Dots (endpoint flashes)
// ============================================================================
// Orchestrator: Globe system (rotation + children)
// ============================================================================

function GlobeSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(
    () => fibonacciSphere(NODE_COUNT, SPHERE_RADIUS),
    []
  );

  // Slow continuous Y rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.8, 0]} rotation={[0.3, 0, 0.1]}>
      <GlobeEdges positions={positions} />
      <GlobeNodes positions={positions} />
      <AttackArcs positions={positions} />
    </group>
  );
}

// ============================================================================
// Outer atmosphere ring
// ============================================================================

function AtmosphereRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * 0.02;
  });

  return (
    <mesh ref={ref} position={[0, -2.8, 0]} rotation={[0.3, 0, 0.1]}>
      <ringGeometry args={[SPHERE_RADIUS + 0.05, SPHERE_RADIUS + 0.08, 120]} />
      <meshBasicMaterial
        color="#1e40af"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ============================================================================
// Export: ThreatMapBackground
// ============================================================================

export function ThreatMapBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      {/* Fog / gradient overlays for smooth blending */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0f172a] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0f172a]/80 via-transparent to-[#0f172a]/80" />

      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        style={{ background: "transparent" }}
      >
        {/* Minimal ambient light — we use MeshBasicMaterial so light isn't critical */}
        <ambientLight intensity={0.3} />
        <GlobeSystem />
        <AtmosphereRing />
      </Canvas>
    </div>
  );
}
