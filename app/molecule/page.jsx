'use client'
import { Canvas } from '@react-three/fiber'
import { MoleculeScene } from './components/MoleculeScene'

export default function MoleculePage() {
  return (
    <div className="w-full h-screen bg-[#050510]">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <MoleculeScene />
      </Canvas>

      {/* HUD overlay */}
      <div className="absolute top-4 left-4 text-white/60 text-sm font-mono">
        <div className="text-white font-bold text-lg">Molecule Viewer</div>
        <div>Drag to rotate · Scroll to zoom</div>
        <div className="mt-1 text-xs">Hover atoms for biomedical info</div>
      </div>
    </div>
  )
}