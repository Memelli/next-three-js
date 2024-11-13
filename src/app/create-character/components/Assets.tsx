'use client'
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial, Skeleton } from 'three'

import useCreateCharacterStore from '../create-character.store'

export default function Asset({
  url,
  skeleton,
  categoryName,
}: {
  url: string
  categoryName: string
  skeleton: Skeleton
}) {
  const { scene } = useGLTF(url)

  const customization = useCreateCharacterStore((state) => state.customization)
  const skin = useCreateCharacterStore((state) => state.skin)

  const assetColor = customization[categoryName].color

  useEffect(() => {
    scene.traverse((child) => {
      const meshChild = child as Mesh
      if (meshChild.isMesh) {
        if (
          !Array.isArray(meshChild.material) &&
          meshChild.material?.name.includes('Color_')
        ) {
          ;(meshChild.material as MeshStandardMaterial).color.set(assetColor!)
        }
      }
    })
  }, [assetColor, scene])

  const attachedItems = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = []
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const childMesh = child as Mesh
        items.push({
          geometry: childMesh.geometry,
          material: (childMesh.material as MeshStandardMaterial).name.includes(
            'Skin_',
          )
            ? skin
            : childMesh.material,
          morphTargetDictionary: childMesh.morphTargetDictionary,
          morphTargetInfluences: childMesh.morphTargetInfluences,
        })
      }
    })
    return items
  }, [scene])

  return attachedItems.map((item, index) => (
    <skinnedMesh
      key={index + 'skinnedMesh'}
      geometry={item.geometry}
      material={item.material}
      skeleton={skeleton}
      morphTargetDictionary={item.morphTargetDictionary}
      morphTargetInfluences={item.morphTargetInfluences}
      castShadow
      receiveShadow
    />
  ))
}
