"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { TShirtViewer } from "./components/TShirtViewer"
import { ImageUploader } from "./components/ImageUploader"
import { TextCustomizer } from "./components/TextCustomizer"
import { ColorPicker } from "./components/ColorPicker"
import { MeasurementsInput } from "./components/MeasurementsInput"
import { FontPicker } from "./components/FontPicker"
import { Loader } from "./components/Loader"
import "./App.css"

type FormValues = {
  height: number
  weight: number
  build: "lean" | "regular" | "athletic" | "big"
  color: string
  textColor: string
  font: string
  text: string
}

const App: React.FC = () => {
  const [showThreeJS, setShowThreeJS] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [imageScale, setImageScale] = useState(1)

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: "athletic",
      color: "#3B82F6",
      textColor: "#FFFFFF",
      font: "Arial",
      text: "",
    },
  })

  const currentValues = watch()

  useEffect(() => {
    // Simulate loading the 3D model
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "q") {
        setShowThreeJS((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your backend
    alert("T-shirt customization saved! Ready for production.")
  }

  const handleImagePositionChange = (newPosition: { x: number; y: number }) => {
    setImagePosition(newPosition)
  }

  const handleImageScaleChange = (newScale: number) => {
    setImageScale(newScale)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">T-Shirt Customizer</h1>
              <p className="text-sm text-gray-500">Press Alt + Q to toggle between 2D and 3D view</p>
            </div>
            <button
              type="button"
              onClick={() => setShowThreeJS(!showThreeJS)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Switch to {showThreeJS ? "2D" : "3D"} View
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Measurements</h3>
                      <p className="mt-1 text-sm text-gray-500">Enter your body measurements for a perfect fit.</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Controller
                        name="height"
                        control={control}
                        render={({ field }) => (
                          <MeasurementsInput
                            label="Height (cm)"
                            value={field.value}
                            onChange={field.onChange}
                            min={150}
                            max={220}
                          />
                        )}
                      />

                      <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                          <MeasurementsInput
                            label="Weight (kg)"
                            value={field.value}
                            onChange={field.onChange}
                            min={40}
                            max={150}
                          />
                        )}
                      />

                      <Controller
                        name="build"
                        control={control}
                        render={({ field }) => (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Build</label>
                            <select
                              {...field}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="lean">Lean</option>
                              <option value="regular">Regular</option>
                              <option value="athletic">Athletic</option>
                              <option value="big">Big</option>
                            </select>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Design</h3>
                      <p className="mt-1 text-sm text-gray-500">Customize your t-shirt design.</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                          <ColorPicker label="T-Shirt Color" value={field.value} onChange={field.onChange} />
                        )}
                      />

                      <ImageUploader
                        onImageUpload={setUploadedImage}
                        currentImage={uploadedImage}
                        onPositionChange={handleImagePositionChange}
                        onScaleChange={handleImageScaleChange}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Controller
                          name="textColor"
                          control={control}
                          render={({ field }) => (
                            <ColorPicker label="Text Color" value={field.value} onChange={field.onChange} />
                          )}
                        />

                        <Controller
                          name="font"
                          control={control}
                          render={({ field }) => <FontPicker value={field.value} onChange={field.onChange} />}
                        />
                      </div>

                      <Controller
                        name="text"
                        control={control}
                        render={({ field }) => <TextCustomizer value={field.value} onChange={field.onChange} />}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add to Cart
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">T-Shirt Preview</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {showThreeJS ? "3D View (Rotate with mouse)" : "2D View"}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="h-96 flex items-center justify-center relative">
                    {isLoading ? (
                      <Loader />
                    ) : showThreeJS ? (
                      <TShirtViewer
                        color={currentValues.color}
                        image={uploadedImage}
                        text={currentValues.text}
                        textColor={currentValues.textColor}
                        font={currentValues.font}
                        imagePosition={imagePosition}
                        imageScale={imageScale}
                      />
                    ) : (
                      <div
                        className="relative w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <div
                          className="w-3/4 h-full max-h-80 relative flex items-center justify-center"
                          style={{ backgroundColor: currentValues.color }}
                        >
                          {uploadedImage && (
                            <div
                              className="absolute"
                              style={{
                                transform: `translate(${imagePosition.x * 100}px, ${imagePosition.y * 100}px) scale(${imageScale})`,
                                maxWidth: "28%",
                              }}
                            >
                              <img
                                src={uploadedImage || "/placeholder.svg"}
                                alt="Custom design"
                                className="max-w-full max-h-40 object-contain"
                              />
                            </div>
                          )}
                          {currentValues.text && (
                            <div
                              className="absolute bottom-10 text-center font-bold text-lg"
                              style={{ color: currentValues.textColor, fontFamily: currentValues.font }}
                            >
                              {currentValues.text.split("\n").map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Size Recommendation</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Based on your measurements:</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currentValues.height > 190
                          ? "XL"
                          : currentValues.height > 180
                            ? "L"
                            : currentValues.height > 170
                              ? "M"
                              : "S"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500">Build type:</p>
                      <p className="text-lg font-bold text-gray-900">{currentValues.build}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">&copy; 2023 T-Shirt Customizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
