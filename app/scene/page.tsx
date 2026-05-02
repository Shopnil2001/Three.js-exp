'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── Torus ─────────────────────────────
function Torus() {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.5
  })

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial
        color={hovered ? '#00ff88' : '#4f9cf9'}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

// ─── Atom ─────────────────────────────
function Atom() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta
    ref.current.rotation.x += delta * 0.5
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#ff6b6b" metalness={1} roughness={0} />
    </mesh>
  )
}

// ─── Orbiting Box ─────────────────────
function OrbitingBox() {
  const ref = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return

    time.current += delta
    const r = 2

    ref.current.position.x = Math.cos(time.current) * r
    ref.current.position.z = Math.sin(time.current) * r
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#ffd166" />
    </mesh>
  )
}

// ─── Mouse Light ──────────────────────
function FollowLight() {
  const ref = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (!ref.current) return

    const targetX = state.mouse.x * 5
    const targetY = state.mouse.y * 5

    ref.current.position.x += (targetX - ref.current.position.x) * 0.1
    ref.current.position.y += (targetY - ref.current.position.y) * 0.1
    ref.current.position.z = 2
  })

  return <pointLight ref={ref} intensity={3} />
}

// ─── Scene ────────────────────────────
export default function ScenePage() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        
        {/* Better lighting */}
        <ambientLight intensity={0.3} />
        <FollowLight />

        {/* Objects */}
        <Torus />
        <Atom />
        <OrbitingBox />

        {/* HDRI environment */}
        <Environment preset="city" />

      </Canvas>
    </div>
  )
}