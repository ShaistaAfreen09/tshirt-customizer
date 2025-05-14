"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface TShirtViewerProps {
  color: string
  image: string | null
  text: string
  textColor: string
  font: string
  imagePosition: { x: number; y: number }
  imageScale: number
}

export const TShirtViewer: React.FC<TShirtViewerProps> = ({
  color,
  image,
  text,
  textColor,
  font,
  imagePosition,
  imageScale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const tshirtRef = useRef<THREE.Mesh | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf9fafb)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.minDistance = 3
    controls.maxDistance = 10
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 1.5

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
    backLight.position.set(-5, 5, -5)
    scene.add(backLight)

    // Create a canvas for dynamic texture
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    textureRef.current = texture

    // Create a simple t-shirt model
    const geometry = new THREE.BoxGeometry(2, 3, 0.2)
    geometry.translate(0, 0, 0)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })

    const tshirt = new THREE.Mesh(geometry, material)
    scene.add(tshirt)
    tshirtRef.current = tshirt
    setModelLoaded(true)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update t-shirt texture whenever props change
  useEffect(() => {
    updateTshirtTexture()
  }, [color, image, text, textColor, font, modelLoaded, imagePosition, imageScale])

  // Function to update the t-shirt texture
  const updateTshirtTexture = () => {
    if (!modelLoaded || !tshirtRef.current || !textureRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas and set background color
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw image if available
    if (image) {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          // Calculate dimensions to maintain aspect ratio
          const aspectRatio = img.width / img.height
          const baseWidth = canvas.width * 0.4
          const baseHeight = baseWidth / aspectRatio

          // Apply position and scale adjustments
          const scaledWidth = baseWidth * imageScale
          const scaledHeight = baseHeight * imageScale

          // Center the image with position offset
          const x = (canvas.width - scaledWidth) / 2 + (imagePosition.x * canvas.width) / 4
          const y = canvas.height / 3 + (imagePosition.y * canvas.height) / 4

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

          // Draw text if available
          if (text) {
            drawText(ctx, canvas, text, textColor, font)
          }

          // Important: Update the texture
          if (textureRef.current) {
            textureRef.current.needsUpdate = true
          }

          setError(null)
        } catch (err) {
          console.error("Error drawing image on canvas:", err)
          setError("Failed to apply image to 3D model")
        }
      }

      img.onerror = () => {
        console.error("Failed to load image")
        setError("Failed to load image for 3D model")

        // Still draw text if available
        if (text) {
          drawText(ctx, canvas, text, textColor, font)
          if (textureRef.current) {
            textureRef.current.needsUpdate = true
          }
        }
      }

      img.src = image
    } else if (text) {
      // Draw only text if no image
      drawText(ctx, canvas, text, textColor, font)
      if (textureRef.current) {
        textureRef.current.needsUpdate = true
      }
    } else {
      // Just update the texture with the background color
      if (textureRef.current) {
        textureRef.current.needsUpdate = true
      }
    }
  }

  const drawText = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    color: string,
    fontFamily: string,
  ) => {
    ctx.fillStyle = color

    // Extract font family name
    const fontName = fontFamily.split(",")[0].trim()

    ctx.font = `bold 48px ${fontName}`
    ctx.textAlign = "center"

    const lines = text.split("\n")
    const lineHeight = 60
    const startY = canvas.height * 0.7

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
    })
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-4 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
