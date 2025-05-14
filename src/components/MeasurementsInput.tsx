"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface MeasurementsInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}

export const MeasurementsInput: React.FC<MeasurementsInputProps> = ({ label, value, onChange, min, max }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startValue, setStartValue] = useState(value)
  const [displayValue, setDisplayValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartY(e.clientY)
    setStartValue(value)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "ns-resize"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaY = startY - e.clientY
      const sensitivity = 0.5 // Lower value for smoother scrolling
      const newValue = Math.min(max, Math.max(min, startValue + Math.round(deltaY * sensitivity)))
      onChange(newValue)
      setDisplayValue(newValue)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "default"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (!isNaN(newValue)) {
      const clampedValue = Math.min(max, Math.max(min, newValue))
      onChange(clampedValue)
      setDisplayValue(clampedValue)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const direction = e.deltaY > 0 ? -1 : 1
    const newValue = Math.min(max, Math.max(min, value + direction))
    onChange(newValue)
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`mt-1 relative rounded-md shadow-sm cursor-ns-resize ${isDragging ? "bg-gray-100" : ""}`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <input
          ref={inputRef}
          type="number"
          value={displayValue}
          onChange={handleInputChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md cursor-ns-resize"
          min={min}
          max={max}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{label.includes("Height") ? "cm" : "kg"}</span>
        </div>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="mt-1 h-1 w-full bg-gray-200 rounded">
        <div
          className="h-1 bg-indigo-600 rounded transition-all duration-200"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
