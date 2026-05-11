import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Float } from "@react-three/drei"

function StarMesh({
    isExploding,
    triggerExplosion
}) {

    const ref = useRef(null)

    const shakeIntensity =
        isExploding
            ? 0.08
            : 0.01

    useFrame((state) => {

        if (!ref.current) return

        ref.current.rotation.z =
            Math.sin(state.clock.elapsedTime * 10)
            * shakeIntensity

        const targetScale = isExploding ? 12 : 1

        ref.current.scale.x +=
            (targetScale - ref.current.scale.x)
            * 0.08

        ref.current.scale.y +=
            (targetScale - ref.current.scale.y)
            * 0.08

        ref.current.scale.z +=
            (targetScale - ref.current.scale.z)
            * 0.08

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
                    onClick={triggerExplosion}
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
    const [isExploding, setIsExploding] = useState(false)
    const [finished, setFinished] = useState(false)

    function triggerExplosion() {

        setIsExploding(true)

        setTimeout(() => {

            onReveal()

        }, 700)

        setTimeout(() => {

            setIsExploding(false)
            setFinished(true)

        }, 1200)
    }
    if (finished) return (<h1 className="mt-16
        text-center
        text-white
        uppercase
        tracking-[0.50em]
        [text-shadow:0_0_20px_rgba(125,211,252,0.8)]
        animate-floating">Thanks your visit!</h1>)
    return (
        <div className="relative 
            w-full h-[250px] 
            mt-[50px] mx-auto">
            <div
                className={`
                    fixed
                    inset-0
                    z-20
                    pointer-events-none
                    transition-all
                    duration-700
                    ${isExploding ? "opacity-100 scale-100" : "opacity-0 scale-150"}
                `}
            >

                <div
                    className="
                        absolute
                        inset-0
                        bg-white
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-cyan-400/40
                        blur-[120px]
                    "
                />

            </div>

            <h1 onClick={triggerExplosion}
                className="
                    text-center
                    text-white
                    text-sm
                    tracking-[0.25em]
                    uppercase
                    [text-shadow:0_0_20px_rgba(125,211,252,0.8)]
                    cursor-pointer
                    hover:scale-105
                "
            >
                Click To Reveal My Stats
            </h1>

            <Canvas className="cursor-pointer z-30">

                <ambientLight intensity={0.15} />

                <StarMesh
                    isExploding={isExploding}
                    triggerExplosion={triggerExplosion}
                />

            </Canvas>

        </div>
    )
}

export default StarTrigger