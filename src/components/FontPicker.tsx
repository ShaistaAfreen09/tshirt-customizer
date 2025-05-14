"use client"

import type React from "react"

interface FontPickerProps {
  value: string
  onChange: (value: string) => void
}

export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const fonts = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Impact", value: "Impact, sans-serif" },
  ]

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Font Style</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.name}
          </option>
        ))}
      </select>
      <div className="mt-2">
        <p className="text-sm" style={{ fontFamily: value }}>
          Sample Text
        </p>
      </div>
    </div>
  )
}
