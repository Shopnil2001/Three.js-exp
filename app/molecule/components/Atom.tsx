'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export type AtomData = {
  position: [number, number, number]
  color: string
  radius: number
  label: string
  atomicNumber: number
  role: string        // biomedical role e.g. "Hydrogen bond donor"
}

export function Atom({ position, color, radius, label, atomicNumber, role }: AtomData) {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Pulse on hover — scale breathes like a living cell
  useFrame((_, delta) => {
    if (!ref.current) return
    const target = hovered ? 1.25 : 1.0
    ref.current.scale.setScalar(
      THREE.MathUtils.lerp(ref.current.scale.x, target, delta * 6)
    )
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onPointerMissed={() => setHovered(false)}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={hovered ? .6 : 0.0} 
      />

      {/* drei Html — renders a DOM div anchored to 3D position */}
      {hovered && (
        <Html distanceFactor={8} position={[0, radius + 0.6, 0]} center pointerEvents="none">
          <div className="bg-black/80 text-white text-xs rounded-lg px-3 py-2 
                          pointer-events-none whitespace-nowrap border border-white/20">
            <div className="font-bold text-sm" style={{ color }}>
              {label} <span className="text-white/50">#{atomicNumber}</span>
            </div>
            <div className="text-white/70 mt-0.5">{role}</div>
          </div>
        </Html>
      )}
    </mesh>
  )
}