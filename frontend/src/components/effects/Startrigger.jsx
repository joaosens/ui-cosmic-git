import { Canvas } from "@react-three/fiber" // Fiber's the comunicator between React and Three.js
import { Sphere, Float, Html } from "@react-three/drei" 


function StarTrigger({ onClick }) {
    return (
        <div className="relative w-full h-[250px] mt-[50px] mx-auto">
            <Canvas className="cursor-pointer"> {/* Canvas is 3D world of graphical computing in frontend */}  
                <ambientLight intensity={0.15} />
                <Float speed={2}
                rotationIntensity={1}
                floatIntensity={2}> 
                    <group>
                        <pointLight
                        color="#7dd3fc"
                        intensity={25}
                        distance={20}
                        />

                        <Html center position={[0,3.2,0]}>
                            <div className="w-[240px] text-center">
                                <h1 className="
                                text-white
                                text-sm
                                tracking-[0.25em]
                                uppercase
                                inline-block
                                transition-transform
                                duration-300
                                hover:scale-105
                                [text-shadow:0_0_20px_rgba(125,211,252,0.8)]
                                ">
                                Click To Reveal My Stats
                                </h1>
                            </div>
                        </Html>
                        <Sphere args={[2.4,64,64]}>
                            <meshBasicMaterial
                            transparent
                            opacity={0.06}
                            color="#7dd3fc"
                            />
                        </Sphere>
                        <Sphere args={[1.8,64,64]}>
                            <meshStandardMaterial
                                color="#2563eb"
                                emissive="#60a5fa"
                                emissiveIntensity={3}
                            />
                        </Sphere>
                        <Sphere args={[0.7,64,64]}>
                            <meshBasicMaterial
                                color="#f8fafc"
                            />
                        </Sphere>
                    </group>
                </Float>
            </Canvas>
        </div>
    );
}

export default StarTrigger;
