import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { AnimationMixer, LoopRepeat, MathUtils } from "three";

function CharacterModel({ section, modelPath }) {
  const root = useRef();
  const mixer = useRef();
  const activeAction = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const [asset, setAsset] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let disposed = false;
    import("three/addons/loaders/GLTFLoader.js")
      .then(({ GLTFLoader }) => {
        new GLTFLoader().load(
          modelPath,
          (gltf) => {
            if (!disposed) setAsset(gltf);
          },
          undefined,
          (error) => {
            if (!disposed) {
              console.warn("The optional character model could not be loaded.", error);
              setLoadError(true);
            }
          },
        );
      })
      .catch((error) => {
        if (!disposed) {
          console.error("Could not initialize the GLB character loader.", error);
          setLoadError(true);
        }
      });
    return () => {
      disposed = true;
    };
  }, [modelPath]);

  useEffect(() => {
    if (!asset) return undefined;
    mixer.current = new AnimationMixer(asset.scene);
    return () => {
      mixer.current?.stopAllAction();
      mixer.current = null;
      activeAction.current = null;
    };
  }, [asset]);

  useEffect(() => {
    if (!asset || !mixer.current) return;
    const clips = asset.animations;
    const names = {
      home: /idle|stand/i,
      about: /think|idle/i,
      expertise: /look|idle/i,
      work: /type|work|idle/i,
      journey: /walk|idle/i,
      contact: /greet|wave|idle/i,
    };
    const target = clips.find((clip) => names[section]?.test(clip.name)) ?? clips[0];
    if (target && mixer.current) {
      const next = mixer.current.clipAction(target);
      if (next === activeAction.current) return;
      next.setLoop(LoopRepeat, Infinity).reset().fadeIn(0.5).play();
      activeAction.current?.fadeOut(0.5);
      activeAction.current = next;
    }
  }, [asset, section]);

  useFrame((state, delta) => {
    if (!root.current) return;
    pointer.current.x = MathUtils.lerp(pointer.current.x, state.pointer.x * 0.28, 0.035);
    pointer.current.y = MathUtils.lerp(pointer.current.y, state.pointer.y * 0.08, 0.035);
    root.current.rotation.y = pointer.current.x;
    root.current.rotation.x = pointer.current.y;
    mixer.current?.update(delta);
  });

  if (loadError) return <NeuralSculpture />;
  if (!asset) return null;

  return (
    <group ref={root} position={[0, -1.05, 0]} scale={1.7}>
      <primitive object={asset.scene} />
    </group>
  );
}

function NeuralSculpture() {
  const group = useRef();
  const core = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const nodes = useMemo(() => {
    const points = [];
    for (let i = 0; i < 13; i += 1) {
      const angle = (i / 13) * Math.PI * 2;
      points.push([Math.cos(angle) * 1.1, Math.sin(angle * 2) * 0.42, Math.sin(angle) * 0.72]);
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    pointer.current.x = MathUtils.lerp(pointer.current.x, state.pointer.x * 0.22, 0.035);
    pointer.current.y = MathUtils.lerp(pointer.current.y, state.pointer.y * 0.12, 0.035);
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.y += (pointer.current.x - group.current.rotation.y) * 0.012;
    group.current.rotation.x += (pointer.current.y - group.current.rotation.x) * 0.012;
    if (core.current) core.current.rotation.y -= delta * 0.24;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.26}>
      <group ref={group} position={[0.5, 0.05, 0]}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.48, 2]} />
          <meshStandardMaterial
            color="#d6ffa0"
            emissive="#89bd43"
            emissiveIntensity={1.45}
            roughness={0.25}
            metalness={0.42}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshBasicMaterial color="#c6ff78" wireframe transparent opacity={0.25} />
        </mesh>
        {[0, 1, 2].map((ring) => (
          <mesh key={ring} rotation={[0.55 + ring * 0.68, 0.25 + ring * 0.54, 0.28]}>
            <torusGeometry args={[1.14 + ring * 0.13, 0.003 + ring * 0.0007, 8, 120]} />
            <meshBasicMaterial
              color={ring === 1 ? "#b9f35a" : "#b3c99a"}
              transparent
              opacity={0.54 - ring * 0.1}
            />
          </mesh>
        ))}
        {nodes.map((position, index) => (
          <group key={index} position={position}>
            <mesh>
              <sphereGeometry args={[index % 4 === 0 ? 0.065 : 0.032, 12, 12]} />
              <meshBasicMaterial color={index % 3 === 0 ? "#edffd5" : "#b9f35a"} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function Lab({ section, characterModel }) {
  const desired = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    desired.current.x = state.pointer.x * 0.24;
    desired.current.y = state.pointer.y * 0.12;
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, 0.35 + desired.current.x, 0.025);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, 0.1 + desired.current.y, 0.025);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#090b10"]} />
      <fog attach="fog" args={["#090b10", 5, 11]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[2, 1.5, 2]} color="#c8ff85" intensity={26} distance={7} />
      <pointLight position={[-2.8, 0.5, -0.5]} color="#7496ff" intensity={15} distance={7} />
      <spotLight
        position={[0.5, 4, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={22}
        color="#e5f7c4"
        castShadow
      />
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#10141a" metalness={0.55} roughness={0.7} />
      </mesh>
      <gridHelper args={[12, 32, "#364832", "#1a2020"]} position={[0, -1.43, 0]} />
      <Sparkles count={70} scale={[7, 4, 5]} size={1.25} speed={0.16} color="#c6f68a" />
      {characterModel ? (
        <CharacterModel key={characterModel} section={section} modelPath={characterModel} />
      ) : (
        <NeuralSculpture />
      )}
    </>
  );
}

export default function Scene3D({ reducedMotion, characterModel }) {
  const [section, setSection] = useState("hero");

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSection(visible.target.id);
      },
      { threshold: [0.2, 0.45, 0.7] },
    );
    sections.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0.35, 0.1, 5.2], fov: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Lab section={section} characterModel={characterModel} />
    </Canvas>
  );
}
