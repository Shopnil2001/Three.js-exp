'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ScenePage() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current!
    const w = mount.clientWidth, h = mount.clientHeight

    // 1. SCENE — the "world"
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0a0f')

    // 2. CAMERA — PerspectiveCamera(fov, aspect, near, far)
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.z = 5

    // 3. RENDERER — draws scene+camera to a <canvas>
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // 4. MESH = Geometry + Material (your first "atom")
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
    const material = new THREE.MeshStandardMaterial({
      color: '#4f9cf9',
      roughness: 0.3,
      metalness: 0.7,
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    // 5. LIGHTS — MeshStandardMaterial needs light to be visible
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    const point = new THREE.PointLight(0xffffff, 1)
    point.position.set(5, 5, 5)
    scene.add(ambient, point)

     const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16) 
     const sphere = new THREE.Mesh(sphereGeometry, material)
     sphere.position.set(2, 0, 0)
     scene.add(sphere)

    // 6. ANIMATION LOOP — like requestAnimationFrame
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      torus.rotation.y += 0.005   // rotate ~0.3°/frame
      sphere.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
    
    // 7. CLEANUP — critical in Next.js (React StrictMode runs effects twice)
    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-screen" />
}