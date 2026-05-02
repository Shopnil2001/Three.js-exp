'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

type BondProps = {
  start: [number, number, number]
  end: [number, number, number]
  order?: number // single, double, triple bond (not implemented here)
}

export function Bond({ start, end, order = 1 }: BondProps) {
  // Calculate midpoint, length, and orientation from two 3D points
  const { position, quaternion, length, normal } = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const midpoint = s.clone().add(e).multiplyScalar(0.5)
    const direction = e.clone().sub(s)
    const len = direction.length()
    const dirNorm = direction.clone().normalize()

    // Align cylinder (default Y-axis) to direction vector
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dirNorm
    )
    const up = new THREE.Vector3(0, 1, 0)
    let normal = new THREE.Vector3().crossVectors(dirNorm, up)
    if (normal.length() < 0.01) {
      normal = new THREE.Vector3().crossVectors(dirNorm, new THREE.Vector3(1, 0, 0))
    }

    normal.normalize()
    return { position: midpoint, quaternion, length: len, normal }
  }, [start, end])

  // distance between parallel bonds
  const offsetAmount = 0.12
  const offsets =
    order === 1
      ? [0]
      : order === 2
        ? [-offsetAmount, offsetAmount]
        : [-offsetAmount, 0, offsetAmount]


  return (
    <>
      {offsets.map((offset, i) => (

        <mesh
          key={i}
          position={position.clone().add(normal.clone().multiplyScalar(offset))}
          quaternion={quaternion}
        >
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial color="#888889" metalness={0.1} />
        </mesh>
      ))}
    </>
  )
}