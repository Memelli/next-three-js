import { create } from 'zustand'
import { MeshStandardMaterial } from 'three'

import { pb } from '@/utils/pocketbase'
import { IAssets, ICategory, IHomeStore } from './create-character.interfaces'

const useHomeStore = create<IHomeStore>((set, get) => ({
  categories: [],
  currentCategory: null,
  assets: [],
  skin: new MeshStandardMaterial({
    color: 0xffcc99,
    roughness: 1,
  }),
  customization: {},
  download: () => {},

  setDownload: (download: () => void) => set({ download }),

  updateColor: (color: string) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [state.currentCategory?.name ?? '']: {
          ...state.customization[state.currentCategory?.name ?? ''],
          color,
        },
      },
    }))

    if (get().currentCategory?.name === 'Head') {
      get().updateSkin(color)
    }
  },

  updateSkin: (color: string) => {
    get().skin.color.set(color)
  },

  fetchCategories: async () => {
    const categories = await pb
      .collection<ICategory>('CustomizationGroups')
      .getFullList({
        sort: '+position',
        expand: 'colorPalette',
      })

    const assets = await pb
      .collection<IAssets>('CustomizationAssets')
      .getFullList({
        sort: '-created',
      })

    const custom: IHomeStore['customization'] = {}
    categories.forEach((category) => {
      category.assets = assets.filter((asset) => asset.group === category.id)
      custom[category.name] = {
        color: category.expand?.colorPalette.colors[0] ?? '',
      }
      if (category.startingAsset) {
        custom[category.name].asset = category.assets.find(
          (asset) => asset.id === category.startingAsset,
        )
      }
    })

    set({
      categories,
      currentCategory: categories[0],
      assets,
      customization: custom,
    })
  },

  removeAssetFromCategory: (categoryName: ICategory['name']) =>
    set((state) => {
      return {
        customization: {
          ...state.customization,
          [categoryName]: {},
        },
      }
    }),

  setCurrentCategory: (category: ICategory) => {
    console.log(category)
    set({ currentCategory: category })
  },

  changeAsset: (category: ICategory['name'], asset: IAssets) => {
    set((state) => {
      return {
        customization: {
          ...state.customization,
          [category]: {
            ...state.customization[category],
            asset,
          },
        },
      }
    })
  },
}))

export default useHomeStore
