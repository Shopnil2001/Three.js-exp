'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Atom, type AtomData } from './Atom'
import { Bond } from './Bond'

// H2O — CPK coloring convention (industry standard)
const ATOMS: AtomData[] = [
  {
    position: [0, 0, 0],
    color: '#ff4444',
    radius: 0.4,
    label: 'Oxygen',
    atomicNumber: 8,
    role: 'Electron acceptor / H-bond acceptor',
  },
  {
    position: [-0.96, -0.6, 0],
    color: '#ffffff',
    radius: 0.25,
    label: 'Hydrogen',
    atomicNumber: 1,
    role: 'H-bond donor — key to DNA base pairing',
  },
  {
    position: [0.96, -0.6, 0],
    color: '#ffffff',
    radius: 0.25,
    label: 'Hydrogen',
    atomicNumber: 1,
    role: 'H-bond donor — key to DNA base pairing',
  },
]
type BondType = {
  a: number
  b: number
  order?: number // 1 = single, 2 = double, 3 = triple
}


const BONDS: BondType[] = [
  { a: 0, b: 1, order: 1 },
  { a: 0, b: 2, order: 1 },
]

const CO2_ATOMS: AtomData[] = [
  {
    position: [0, 0, 0],
    color: '#222222', // Carbon (dark gray)
    radius: 0.35,
    label: 'Carbon',
    atomicNumber: 6,
    role: 'Backbone atom',
  },
  {
    position: [-1.2, 0, 0],
    color: '#ff4444',
    radius: 0.4,
    label: 'Oxygen',
    atomicNumber: 8,
    role: 'Electron acceptor',
  },
  {
    position: [1.2, 0, 0],
    color: '#ff4444',
    radius: 0.4,
    label: 'Oxygen',
    atomicNumber: 8,
    role: 'Electron acceptor',
  },
]

const CO2_BONDS: BondType[] = [
  { a: 0, b: 1, order: 2 },
  { a: 0, b: 2, order: 2 },
]
function Molecule({ atoms, bonds }: {
  atoms: AtomData[]
  bonds: BondType[]
}) {
  return (
    <>
      {atoms.map((atom, i) => <Atom key={i} {...atom} />)}

      {bonds.map((bond, i) => (
        <Bond
          key={i}
          start={atoms[bond.a].position}
          end={atoms[bond.b].position}
          order={bond.order}
        />
      ))}
    </>
  )
}

export function MoleculeScene() {
  const groupRef = useRef<THREE.Group>(null)
  const [molecule, setMolecule] = useState<'h2o' | 'co2'>('h2o')
  // Slow auto-rotation — stops when user grabs with OrbitControls
  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3
  })

  return (
    <>
      <Html position={[0, -2, 0]} center className='flex'>
        <button
          onClick={() =>
            setMolecule((prev) => (prev === 'h2o' ? 'co2' : 'h2o'))
          }
          className="bg-white text-black px-4 py-2 rounded-md shadow"
        >
          Switch Molecule
        </button>
      </Html>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4466ff" />

      <group ref={groupRef}>
        {molecule === 'h2o' && (
          <Molecule atoms={ATOMS} bonds={BONDS} />
        )}

        {molecule === 'co2' && (
          <group >
            <Molecule atoms={CO2_ATOMS} bonds={CO2_BONDS} />
          </group>
        )}

        <Html position={[0, 1.8, 0]} center transform sprite className='text-3xl'>
          <div className="text-white text-sm whitespace-nowrap bg-black/60 px-3 py-1 rounded-md">
            {molecule === 'h2o'
              ? <>H<sub>2</sub>O — Water Molecule</>
              : <>CO<sub>2</sub> — Carbon Dioxide</>}
          </div>
        </Html>
      </group>

      

      <OrbitControls enableDamping dampingFactor={0.05} />
      <Environment preset="night" />
    </>
  )
}