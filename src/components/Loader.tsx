"use client"

import type React from "react"

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="mt-4 text-sm text-gray-500">Loading 3D model...</p>
    </div>
  )
}
