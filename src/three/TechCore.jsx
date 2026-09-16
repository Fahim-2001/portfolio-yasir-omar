import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Billboard, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

const AVATAR_URL = '/avatar/omar-avatar-3d.png';

const TECH_LOGOS = [
  { id: 'react', name: 'React', url: '/logos/react.png' },
  { id: 'nodejs', name: 'Node.js', url: '/logos/nodejs.png' },
  { id: 'python', name: 'Python', url: '/logos/python.png' },
  { id: 'golang', name: 'Golang', url: '/logos/golang.png' },
  { id: 'aws', name: 'AWS', url: '/logos/aws.png' },
  { id: 'postgres', name: 'PostgreSQL', url: '/logos/postgres.png' },
];

// Preload assets for instant visual rendering
useTexture.preload(AVATAR_URL);
TECH_LOGOS.forEach((tech) => useTexture.preload(tech.url));

// Interactive 3D Tech Badge Component
function TechBadge({
  texture,
  name,
  badgeRef,
  colors,
  setIsHoveredGlobal,
}) {
  const [hovered, setHovered] = useState(false);
  const meshGroupRef = useRef();

  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;
    const targetScale = hovered ? 1.25 : 1.0;
    meshGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 10
    );
  });

  return (
    <group ref={badgeRef}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group
          ref={meshGroupRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            setIsHoveredGlobal(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            setIsHoveredGlobal(false);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Badge 3D Disc Body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
            <meshStandardMaterial
              color={colors.core}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Front Face: High-Res Logo Texture */}
          <mesh position={[0, 0, 0.024]}>
            <planeGeometry args={[0.52, 0.52]} />
            <meshBasicMaterial
              map={texture}
              transparent={true}
              toneMapped={false}
            />
          </mesh>

          {/* Glowing / Accent Rim Border */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.26, 0.008, 16, 32]} />
            <meshBasicMaterial
              color={hovered ? colors.packetsAndPoints : colors.edges}
              transparent={true}
              opacity={hovered ? 0.95 : 0.6}
            />
          </mesh>

          {/* Interactive Tooltip Name on Hover */}
          {hovered && (
            <Html
              position={[0, -0.38, 0]}
              center
              distanceFactor={8}
              style={{ pointerEvents: 'none' }}
            >
              <div className="px-2.5 py-1 rounded-md border border-border bg-surface/95 text-text font-mono text-[11px] font-semibold tracking-wider uppercase shadow-xl whitespace-nowrap select-none backdrop-blur-sm">
                {name}
              </div>
            </Html>
          )}
        </group>
      </Billboard>
    </group>
  );
}

export function TechCore({ isMobile = false, prefersReducedMotion = false }) {
  const { colors, isDark } = useTheme();

  // Load avatar and logo textures
  const avatarTexture = useTexture(AVATAR_URL);
  const reactTexture = useTexture('/logos/react.png');
  const nodejsTexture = useTexture('/logos/nodejs.png');
  const pythonTexture = useTexture('/logos/python.png');
  const golangTexture = useTexture('/logos/golang.png');
  const awsTexture = useTexture('/logos/aws.png');
  const postgresTexture = useTexture('/logos/postgres.png');

  const logoTextures = useMemo(
    () => [
      reactTexture,
      nodejsTexture,
      pythonTexture,
      golangTexture,
      awsTexture,
      postgresTexture,
    ],
    [
      reactTexture,
      nodejsTexture,
      pythonTexture,
      golangTexture,
      awsTexture,
      postgresTexture,
    ]
  );

  // Configure texture color spaces
  useEffect(() => {
    avatarTexture.colorSpace = THREE.SRGBColorSpace;
    logoTextures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
    });
  }, [avatarTexture, logoTextures]);

  const orbitGroupRef = useRef();
  const avatarMeshRef = useRef();
  const pedestalTicksRef = useRef();
  const timeRef = useRef(0);

  const [isHoveredGlobal, setIsHoveredGlobal] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  // Badge refs for orbit animation
  const badgeRef0 = useRef();
  const badgeRef1 = useRef();
  const badgeRef2 = useRef();
  const badgeRef3 = useRef();
  const badgeRef4 = useRef();
  const badgeRef5 = useRef();
  const badgeRefs = useMemo(
    () => [badgeRef0, badgeRef1, badgeRef2, badgeRef3, badgeRef4, badgeRef5],
    []
  );

  // Detect fine pointer vs touch device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.matchMedia('(pointer: fine)');
      setIsFinePointer(match.matches);
      const handler = (e) => setIsFinePointer(e.matches);
      match.addEventListener('change', handler);
      return () => match.removeEventListener('change', handler);
    }
  }, []);

  // Tighter orbit radius so rotating logos hug the larger avatar closely
  const orbitRadius = isMobile ? 1.45 : 1.72;
  const orbitSpeed = 0.55;

  // Background constellation dust particles
  const particles = useMemo(() => {
    const count = isMobile ? 18 : 32;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.8 + (i % 5) * 0.2;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }
    return pts;
  }, [isMobile]);

  // Main animation frame loop
  useFrame((_, delta) => {
    const activeSpeedMult = isHoveredGlobal ? 0.3 : 1.0;

    if (!prefersReducedMotion) {
      timeRef.current += delta * orbitSpeed * activeSpeedMult;
    }

    // Animate 6 orbiting badges closely around the avatar
    badgeRefs.forEach((bRef, index) => {
      if (!bRef.current) return;
      const angle = timeRef.current + (index * Math.PI * 2) / 6;
      const x = orbitRadius * Math.cos(angle);
      const y = prefersReducedMotion
        ? 0
        : 0.06 * Math.sin(timeRef.current * 2.2 + index);
      const z = orbitRadius * Math.sin(angle);
      bRef.current.position.set(x, y, z);
    });

    // Pedestal ticks subtle rotation
    if (pedestalTicksRef.current && !prefersReducedMotion) {
      pedestalTicksRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <>
      {/* Dynamic Monochrome Scene Lighting */}
      <ambientLight intensity={isDark ? 1.1 : 1.5} color="#FFFFFF" />
      <directionalLight
        position={[4, 5, 4]}
        intensity={isDark ? 2.2 : 1.8}
        color="#FFFFFF"
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={isDark ? 1.4 : 0.9}
        color="#FFFFFF"
      />

      {/* OrbitControls: Allows user to rotate the orbital scene; zoom/pan disabled to prevent scroll lock */}
      {isFinePointer && !prefersReducedMotion && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isHoveredGlobal}
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.7}
        />
      )}

      {/* Main 3D Centered Group */}
      <group position={[0, 0, 0]}>
        {/* Background ambient constellation particles */}
        <group>
          {particles.map((pt, i) => (
            <mesh key={i} position={pt}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial
                color={colors.packetsAndPoints}
                transparent={true}
                opacity={0.35}
              />
            </mesh>
          ))}
        </group>

        {/* Central 3D Avatar - Larger in size, crossed arms, ALWAYS looking directly toward the user */}
        <group position={[0, 0.16, 0]}>
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <mesh ref={avatarMeshRef} position={[0, 0, 0]}>
              {/* Aspect ratio 839 / 992 ~ 0.8457; height 2.92, width 2.47 */}
              <planeGeometry args={[2.47, 2.92]} />
              <meshStandardMaterial
                map={avatarTexture}
                transparent={true}
                alphaTest={0.02}
                roughness={0.7}
                metalness={0.1}
                side={THREE.DoubleSide}
                depthWrite={true}
              />
            </mesh>
          </Billboard>
        </group>

        {/* Tech Pedestal Platform underneath Avatar */}
        <group position={[0, -1.28, 0]}>
          {/* Outer Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.32, 0.012, 16, 64]} />
            <meshStandardMaterial
              color={colors.edges}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Inner Accent Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.98, 0.008, 16, 64]} />
            <meshBasicMaterial
              color={colors.ringsAndLines}
              transparent={true}
              opacity={0.4}
            />
          </mesh>

          {/* Semi-transparent Pedestal Floor Disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <circleGeometry args={[1.3, 48]} />
            <meshBasicMaterial
              color={colors.core}
              transparent={true}
              opacity={0.5}
            />
          </mesh>

          {/* Rotating Pedestal Ticks */}
          <group ref={pedestalTicksRef}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const tx = 1.32 * Math.cos(rad);
              const tz = 1.32 * Math.sin(rad);
              return (
                <mesh key={deg} position={[tx, 0.01, tz]}>
                  <boxGeometry args={[0.035, 0.01, 0.07]} />
                  <meshBasicMaterial
                    color={colors.packetsAndPoints}
                    transparent={true}
                    opacity={0.75}
                  />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* Tilted Orbital Plane Group with smaller radius closely circling avatar */}
        <group ref={orbitGroupRef} rotation={[0.34, 0, 0.12]}>
          {/* Orbital Guide Torus */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbitRadius, 0.007, 16, 120]} />
            <meshBasicMaterial
              color={colors.ringsAndLines}
              transparent={true}
              opacity={0.32}
            />
          </mesh>

          {/* 6 Rotating Tech Badges */}
          {TECH_LOGOS.map((tech, index) => (
            <TechBadge
              key={tech.id}
              name={tech.name}
              texture={logoTextures[index]}
              badgeRef={badgeRefs[index]}
              colors={colors}
              setIsHoveredGlobal={setIsHoveredGlobal}
            />
          ))}
        </group>
      </group>
    </>
  );
}

export default TechCore;
