'use client'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { Group, SkinnedMesh } from 'three'
import { Suspense, useEffect, useRef } from 'react'
import { GLTFExporter } from 'three-stdlib'

import useHomeStore from '../create-character.store'
import { pb } from '../../../utils/pocketbase'
import Asset from './Assets'

export default function Avatar({ ...props }) {
  const group = useRef<Group>()

  const customization = useHomeStore((state) => state.customization)
  const setDownload = useHomeStore((state) => state.setDownload)

  const { nodes } = useGLTF('/models/Armature.glb')
  const { animations } = useFBX('/models/Idle.fbx')
  const { actions } = useAnimations(animations, group)

  const plane = nodes.Plane as SkinnedMesh

  useEffect(() => {
    function download() {
      const exporter = new GLTFExporter()
      exporter.parse(
        group.current!,
        function (result) {
          save(
            new Blob([result as ArrayBuffer], {
              type: 'application/octet-stream',
            }),
            `avatar_${+new Date()}.glb`,
          )
        },
        (error) => console.log(error),
        { binary: true },
      )
    }
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)

    function save(blob: Blob, fileName: string) {
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    }

    setDownload(download)
  }, [])

  useEffect(() => {
    actions['mixamo.com']?.play()
  }, [actions])

  return (
    <group ref={group as React.Ref<Group>} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.url && (
                <Suspense key={customization[key].asset.id}>
                  <Asset
                    categoryName={key}
                    url={String(
                      pb.files.getUrl(
                        customization[key].asset,
                        customization[key].asset.url,
                      ),
                    )}
                    skeleton={plane.skeleton}
                  />
                </Suspense>
              ),
          )}
        </group>
      </group>
    </group>
  )
}
