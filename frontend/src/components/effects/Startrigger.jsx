import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Float, Html } from "@react-three/drei"

function StarMesh({ clickCount, isExploding }) {

    const ref = useRef(null)

    const intensity =
        clickCount === 0
            ? 1
            : clickCount === 1
            ? 1.3
            : 1.7

    const shakeIntensity =
        isExploding
            ? 0.08
            : 0.01 * clickCount

    useFrame((state) => {

        if (!ref.current) return

        ref.current.rotation.z =
            Math.sin(state.clock.elapsedTime * 10)
            * shakeIntensity

    })

    return (
        <Float
            speed={2}
            rotationIntensity={1}
            floatIntensity={2}
        >
            <group>

                <pointLight
                    color="#7dd3fc"
                    intensity={25}
                    distance={20}
                />

                <group
                    scale={isExploding ? 2 : intensity}
                    ref={ref}
                >

                    <Sphere args={[2.4, 64, 64]}>
                        <meshBasicMaterial
                            transparent
                            opacity={0.06}
                            color="#7dd3fc"
                        />
                    </Sphere>

                    <Sphere args={[1.8, 64, 64]}>
                        <meshStandardMaterial
                            color="#2563eb"
                            emissive="#60a5fa"
                            emissiveIntensity={
                                isExploding ? 15 : 3
                            }
                        />
                    </Sphere>

                    <Sphere args={[0.7, 64, 64]}>
                        <meshBasicMaterial
                            color="#f8fafc"
                        />
                    </Sphere>

                </group>

            </group>
        </Float>
    )
}

function StarTrigger({ onReveal }) {

    const [clickCount, setClickCount] = useState(0)
    const [isExploding, setIsExploding] = useState(false)

    function handleClicks() {

        if (isExploding) return

        const next = clickCount + 1

        setClickCount(next)

        if (next >= 3) {
            triggerExplosion()
        }
    }

    function triggerExplosion() {

        setIsExploding(true)

        setTimeout(() => {

            onReveal()

            setIsExploding(false)

        }, 600)
    }

    return (
        <div className="relative w-full h-[250px] mt-[50px] mx-auto">

            <div
                className={`
                    fixed
                    inset-0
                    bg-white
                    transition-opacity
                    duration-700
                    pointer-events-none
                    ${isExploding ? "opacity-90" : "opacity-0"}
                `}
            />

            <Canvas className="cursor-pointer">

                <ambientLight intensity={0.15} />

                <Html center position={[0, 3.2, 0]}>

                    <div className="w-[240px] text-center">

                        <h1
                            onClick={handleClicks}
                            className="
                                text-white
                                text-sm
                                tracking-[0.25em]
                                uppercase
                                inline-block
                                transition-transform
                                duration-300
                                hover:scale-105
                                [text-shadow:0_0_20px_rgba(125,211,252,0.8)]
                            "
                        >
                            Click To Reveal My Stats
                        </h1>

                    </div>

                </Html>

                <StarMesh
                    clickCount={clickCount}
                    isExploding={isExploding}
                />

            </Canvas>

        </div>
    )
}

export default StarTrigger