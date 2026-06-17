"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, useGLTF, Environment } from "@react-three/drei"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function DishModelViewer({ url }: { url: string }) {
  return (
    <div className="relative h-[60vh] max-h-[520px] w-full overflow-hidden rounded-xl border border-border bg-card glow-amber">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment={null} intensity={0.6} adjustCamera={1.1}>
            <Model url={url} />
          </Stage>
          <Environment preset="warehouse" />
        </Suspense>
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 8, 5]} angle={0.3} penumbra={1} intensity={1.2} color="#ffcf6b" />
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        Arrastra para rotar
      </span>
    </div>
  )
}
