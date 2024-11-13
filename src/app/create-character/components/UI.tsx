'use client'
import { useEffect } from 'react'

import useHomeStore from '../create-character.store'
import { pb } from '../../../utils/pocketbase'
import Image from 'next/image'

function AssetsBox() {
  const {
    categories,
    currentCategory,
    fetchCategories,
    setCurrentCategory,
    changeAsset,
    removeAssetFromCategory,
    customization,
  } = useHomeStore()

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-t-lg bg-gradient-to-br from-black/30 to-indigo-900/20 drop-shadow-md p-6 gap-6 flex flex-col">
      <div className="flex items-center gap-8 pointer-events-auto overflow-x-auto noscrollbar px-6 pb-2">
        {categories.map((category, index) => (
          <button
            key={category.id + 'category' + index}
            onClick={() => setCurrentCategory(category)}
            className={`transition-colors duration-200 font-medium 
              ${
                currentCategory?.name === category.name
                  ? 'text-white shadow-purple-100 border-b-white'
                  : 'text-gray-400 hover:text-gray-500 border-b-transparent'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap px-6">
        {currentCategory?.assets.map((asset, index) => (
          <button
            key={asset.id + 'asset' + index}
            onClick={() => changeAsset(currentCategory.name, asset)}
            className={`w-20 h-20 rounded-xl overflow-hidden bg-gray-200 pointer-events-auto hover:opacity-100 transition-all border-2 duration-300 ${customization[currentCategory.name]?.asset?.id === asset.id ? 'border-indigo-600 opacity-100' : 'opacity-80 border-transparent'}`}
          >
            <Image
              className="object-cover w-full h-full"
              width={40}
              height={40}
              src={pb.files.getUrl(asset, asset.thumbnail)}
              alt={asset.name}
            />
          </button>
        ))}
        {currentCategory && (
          <button
            onClick={() =>
              removeAssetFromCategory(String(currentCategory?.name))
            }
            className={`w-20 h-20 rounded-md overflow-hidden bg-gray-200 pointer-events-auto hover:opacity-100 transition-all border-2 duration-500`}
          >
            Remover Molde
          </button>
        )}
      </div>
    </div>
  )
}

function DownloadButton() {
  const { download } = useHomeStore()
  return (
    <button
      onClick={() => download()}
      className="rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white font-medium px-4 py-3 pointer pointer-events-auto"
    >
      Download Model
    </button>
  )
}

export default function UI() {
  const currentCategory = useHomeStore((state) => state.currentCategory)
  const customization = useHomeStore((state) => state.customization)

  return (
    <main className="pointer-events-none fixed z-10 inset-0 select-none">
      <div className="mx-auto h-full max-w-screen-xl w-full flex flex-col justify-between">
        <div className="flex justify-between items-center p-10">
          <p>Melvs</p>
          <DownloadButton />
        </div>
        <div className="px-10 flex flex-col">
          {currentCategory?.expand?.colorPalette &&
            customization[currentCategory.name] && <ColorPicker />}
          <AssetsBox />
        </div>
      </div>
    </main>
  )
}

export function ColorPicker() {
  const updateColor = useHomeStore((state) => state.updateColor)
  const currentCategory = useHomeStore((state) => state.currentCategory)
  const customization = useHomeStore((state) => state.customization)

  function handleColorChange(color: string) {
    updateColor(color)
  }

  if (!customization[currentCategory?.name ?? '']?.asset) {
    console.log('teste')
    return null
  }

  return (
    <div className="pointer-events-auto relative flex gap-2 max-w-full overflow-x-auto backdrop-blur-sm py-2 drop-shadow-md">
      {currentCategory?.expand?.colorPalette.colors.map((color, index) => (
        <button
          key={`${index}-${color}`}
          className={`w-10 h-10 p-1 5 drop-shadow-md bg-black/20 shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 
              ${customization[currentCategory.name].color === color ? 'border-white' : 'border-transparent'}
            `}
          onClick={() => handleColorChange(color)}
        >
          <div
            className="w-full h-full rounded-md"
            style={{ backgroundColor: color }}
          ></div>
        </button>
      ))}
    </div>
  )
}
