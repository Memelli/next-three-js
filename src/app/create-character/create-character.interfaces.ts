import { MeshStandardMaterial } from 'three'

export interface IColorPalettes {
  name: string
  colors: string[]
}

export interface IAssets {
  id: string
  name: string
  thumbnail: string
  url: string
  group: string
  created: string
  collectionId: string
  collectionName: string
}

export interface ICategory {
  id: string
  name: string
  position: number
  startingAsset: string
  expand: {
    colorPalette: IColorPalettes
  } | null
  assets: IAssets[]
}

export interface ICustomizationObject {
  id?: string
  name?: string
  url?: string
  asset?: IAssets
  color?: string
}

export interface IHomeStore {
  download: () => void
  setDownload: (download: IHomeStore['download']) => void
  categories: ICategory[]
  assets: IAssets[]
  customization: {
    [key: string]: ICustomizationObject
  }
  skin: MeshStandardMaterial
  currentCategory: null | ICategory
  fetchCategories: () => Promise<void>
  setCurrentCategory: (category: ICategory) => void
  changeAsset: (category: ICategory['name'], asset: IAssets) => void
  removeAssetFromCategory: (categoryName: ICategory['name']) => void
  updateColor: (color: string) => void
  updateSkin: (color: string) => void
}
