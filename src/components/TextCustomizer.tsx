"use client"

import type React from "react"

interface TextCustomizerProps {
  value: string
  onChange: (value: string) => void
}

export const TextCustomizer: React.FC<TextCustomizerProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    // Limit to 3 lines
    const lines = text.split("\n")
    if (lines.length <= 3) {
      onChange(text)
    } else {
      onChange(lines.slice(0, 3).join("\n"))
    }
  }

  const linesUsed = value.split("\n").length
  const maxCharsPerLine = 30
  const lines = value.split("\n")
  const isAnyLineOverLimit = lines.some((line) => line.length > maxCharsPerLine)

  return (
    <div className="mt-4">
      <label htmlFor="text-customizer" className="block text-sm font-medium text-gray-700">
        Custom Text (max 3 lines)
      </label>
      <div className="mt-1">
        <textarea
          id="text-customizer"
          rows={3}
          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
            isAnyLineOverLimit ? "border-yellow-500" : ""
          }`}
          placeholder="Enter text to print on your t-shirt"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="mt-1 flex justify-between">
        <p className={`text-xs ${linesUsed === 3 ? "text-amber-600 font-medium" : "text-gray-500"}`}>
          {linesUsed}/3 lines used
        </p>
        {isAnyLineOverLimit && (
          <p className="text-xs text-yellow-600">Some lines are too long and may not display well on the t-shirt</p>
        )}
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500">Tips:</p>
        <ul className="text-xs text-gray-500 list-disc pl-5">
          <li>Keep text short for better readability</li>
          <li>Press Enter to create a new line</li>
          <li>Maximum 3 lines of text</li>
        </ul>
      </div>
    </div>
  )
}
