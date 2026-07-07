import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { nailDesigns } from '../data/nailDesigns';
import nailBaseUrl from '../../nail-base.glb?url';

type ScrollNailWindow = Window & {
  __updateNail?: (progress: number) => void;
};

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

/**
 * Extract the real nail mesh from the supplied GLB and normalize it to the
 * hero's coordinate system without changing its authored silhouette or depth.
 */
function extractNailGeometry(scene: THREE.Group) {
  scene.updateMatrixWorld(true);

  let sourceMesh: THREE.Mesh | null = null;
  scene.traverse((object) => {
    if (!sourceMesh && object instanceof THREE.Mesh) sourceMesh = object;
  });

  if (!sourceMesh) throw new Error('nail-base.glb does not contain a mesh');

  const mesh = sourceMesh as THREE.Mesh;
  const geometry = mesh.geometry.clone();
  geometry.applyMatrix4(mesh.matrixWorld);
  geometry.computeBoundingBox();

  const bounds = geometry.boundingBox;
  if (!bounds) throw new Error('Unable to measure nail-base.glb');

  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 3.25 / size.y;

  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(scale, scale, scale);

  // The authored UV island uses only the central portion of UV space. Expand
  // it to 0..1 so each supplied design crop fills the GLB's complete surface.
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute | undefined;
  if (uv) {
    let minU = Infinity;
    let maxU = -Infinity;
    let minV = Infinity;
    let maxV = -Infinity;

    for (let index = 0; index < uv.count; index += 1) {
      minU = Math.min(minU, uv.getX(index));
      maxU = Math.max(maxU, uv.getX(index));
      minV = Math.min(minV, uv.getY(index));
      maxV = Math.max(maxV, uv.getY(index));
    }

    const width = maxU - minU;
    const height = maxV - minV;
    for (let index = 0; index < uv.count; index += 1) {
      uv.setXY(index, (uv.getX(index) - minU) / width, (uv.getY(index) - minV) / height);
    }
    uv.needsUpdate = true;
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function NailScene() {
  const turntableRef = useRef<THREE.Group>(null);
  const nailRefs = useRef<Array<THREE.Mesh | null>>([]);
  const scrollProgress = useRef(0);
  const targetRotation = useRef(-0.04);
  const targetLift = useRef(0);
  const { size } = useThree();
  const isMobile = size.width < 768;

  const { scene } = useGLTF(nailBaseUrl);
  const geometry = useMemo(() => extractNailGeometry(scene), [scene]);
  const loadedTextures = useTexture(nailDesigns.map((design) => design.image));

  const textures = useMemo(
    () => loadedTextures.map((source, index) => {
      const texture = source.clone();
      const crop = nailDesigns[index].textureCrop;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.anisotropy = 8;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(crop.width, crop.height);
      texture.offset.set(crop.x, crop.y);
      texture.needsUpdate = true;
      return texture;
    }),
    [loadedTextures],
  );

  const materials = useMemo(
    () => textures.map((texture, index) => new THREE.MeshPhysicalMaterial({
      map: texture,
      color: '#ffffff',
      metalness: index === 3 ? 0.58 : 0,
      roughness: index === 3 ? 0.1 : 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.07,
      envMapIntensity: index === 3 ? 1.05 : 0.62,
      side: THREE.DoubleSide,
    })),
    [textures],
  );

  useEffect(() => {
    const browserWindow = window as ScrollNailWindow;

    browserWindow.__updateNail = (progress: number) => {
      const safeProgress = THREE.MathUtils.clamp(progress, 0, 1);
      scrollProgress.current = safeProgress;

      const journey = safeProgress * (nailDesigns.length - 1);
      const fromIndex = Math.min(Math.floor(journey), nailDesigns.length - 1);
      const localProgress = journey - fromIndex;
      const enteringNext = localProgress >= 0.5 && fromIndex < nailDesigns.length - 1;
      const visibleIndex = enteringNext ? fromIndex + 1 : fromIndex;

      nailRefs.current.forEach((nail, index) => {
        if (nail) nail.visible = index === visibleIndex;
      });

      if (enteringNext) {
        const turn = smoothstep((localProgress - 0.5) * 2);
        targetRotation.current = THREE.MathUtils.lerp(-Math.PI / 2, -0.04, turn);
      } else if (fromIndex < nailDesigns.length - 1) {
        const turn = smoothstep(localProgress * 2);
        targetRotation.current = THREE.MathUtils.lerp(-0.04, Math.PI / 2, turn);
      } else {
        targetRotation.current = -0.04;
      }

      targetLift.current = Math.sin(localProgress * Math.PI) * 0.055;
    };

    browserWindow.__updateNail(0);
    return () => {
      delete browserWindow.__updateNail;
    };
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
  }, [geometry, materials, textures]);

  useFrame((state, delta) => {
    if (!turntableRef.current) return;

    const group = turntableRef.current;
    const idle = Math.sin(state.clock.elapsedTime * 1.05) * 0.022;
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotation.current, 8, delta);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      -0.08 + Math.sin(scrollProgress.current * Math.PI * 2) * 0.065,
      7,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      Math.PI - 0.035 + Math.sin(scrollProgress.current * Math.PI * 5) * 0.03,
      7,
      delta,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetLift.current + idle + (isMobile ? -0.16 : 0),
      6,
      delta,
    );
  });

  return (
    <>
      <Environment resolution={128} environmentIntensity={0.68}>
        <Lightformer form="rect" intensity={3.4} color="#fffdf8" position={[0, 4, 4]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffe3df" position={[-4, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 1.4, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[4, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 1, 1]} />
      </Environment>
      <ambientLight intensity={0.48} color="#fff6f0" />
      <directionalLight position={[3.8, 5, 4.5]} intensity={1.9} color="#fffaf5" />
      <directionalLight position={[-4, 1.5, 2]} intensity={0.85} color="#ffd9d5" />
      <spotLight position={[-2.5, 4, -4]} intensity={1.25} color="#fff0df" penumbra={0.95} />

      <group
        ref={turntableRef}
        rotation={[-0.08, -0.04, Math.PI - 0.035]}
        scale={isMobile ? 0.56 : 0.74}
      >
        {nailDesigns.map((design, index) => (
          <mesh
            key={design.id}
            ref={(node) => { nailRefs.current[index] = node; }}
            geometry={geometry}
            material={materials[index]}
            visible={index === 0}
            castShadow
            receiveShadow
          />
        ))}
      </group>

      <ContactShadows position={[0, -2.05, 0]} opacity={0.2} scale={5} blur={2.8} far={4} />
    </>
  );
}

useGLTF.preload(nailBaseUrl);
