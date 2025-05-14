"use client"

import type React from "react"
import { useCallback, useState, useRef } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string | null) => void
  currentImage: string | null
  onPositionChange: (position: { x: number; y: number }) => void
  onScaleChange: (scale: number) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  onPositionChange,
  onScaleChange,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setIsLoading(true)
      const file = acceptedFiles[0]

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        setIsLoading(false)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        onImageUpload(reader.result as string)
        setIsLoading(false)
        // Reset position and scale when uploading a new image
        setPosition({ x: 0, y: 0 })
        setScale(1)
        onPositionChange({ x: 0, y: 0 })
        onScaleChange(1)
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload, onPositionChange, onScaleChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"],
    },
  })

  const handleRemoveImage = () => {
    onImageUpload(null)
  }

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (!currentImage) return
    e.stopPropagation()
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentImage) return
    e.stopPropagation()

    const dx = (e.clientX - startPos.x) / 100
    const dy = (e.clientY - startPos.y) / 100

    const newPosition = {
      x: position.x + dx,
      y: position.y + dy,
    }

    setPosition(newPosition)
    onPositionChange(newPosition)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleImageMouseUp = () => {
    setIsDragging(false)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number.parseFloat(e.target.value)
    setScale(newScale)
    onScaleChange(newScale)
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Design Image</label>

      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${
          isDragActive ? "bg-gray-50 border-indigo-500" : ""
        }`}
      >
        <div className="space-y-1 text-center">
          <input {...getInputProps()} />

          {isLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : currentImage ? (
            <div className="flex flex-col items-center">
              <div
                ref={imageRef}
                className="relative cursor-move"
                onMouseDown={handleImageMouseDown}
                onMouseMove={handleImageMouseMove}
                onMouseUp={handleImageMouseUp}
                onMouseLeave={handleImageMouseUp}
              >
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="Uploaded design"
                  className="max-h-24 max-w-full object-contain mb-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200"></div>
              </div>
              <div className="w-full max-w-xs mt-2">
                <label className="block text-xs text-gray-500 mb-1">Image Size</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={handleScaleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex mt-2 space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Reset position
                    setPosition({ x: 0, y: 0 })
                    setScale(1)
                    onPositionChange({ x: 0, y: 0 })
                    onScaleChange(1)
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Reset Position
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs text-gray-500">Drop an image here, or click to select</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {currentImage ? "Drag the image to reposition it on the t-shirt" : "Upload an image to customize your t-shirt"}
      </p>
    </div>
  )
}
