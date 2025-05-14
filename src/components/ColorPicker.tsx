"use client"

import type React from "react"
import { useState } from "react"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [showCustom, setShowCustom] = useState(false)

  const colors = [
    { name: "White", value: "#FFFFFF", textClass: "text-gray-800 border border-gray-300" },
    { name: "Black", value: "#000000", textClass: "text-white" },
    { name: "Navy", value: "#1E3A8A", textClass: "text-white" },
    { name: "Red", value: "#DC2626", textClass: "text-white" },
    { name: "Green", value: "#059669", textClass: "text-white" },
    { name: "Yellow", value: "#F59E0B", textClass: "text-white" },
    { name: "Purple", value: "#7C3AED", textClass: "text-white" },
    { name: "Pink", value: "#EC4899", textClass: "text-white" },
  ]

  // Check if current value is one of the predefined colors
  const isCustomColor = !colors.some((color) => color.value.toLowerCase() === value.toLowerCase())

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          {showCustom ? "Hide Custom" : "Custom Color"}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              value.toLowerCase() === color.value.toLowerCase() ? "ring-2 ring-offset-2 ring-indigo-500" : ""
            } ${color.textClass}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onChange(color.value)}
            title={color.name}
          >
            {value.toLowerCase() === color.value.toLowerCase() && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mx-auto"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}

        {(showCustom || isCustomColor) && (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            <span className="text-xs text-gray-500">{value.toUpperCase()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
