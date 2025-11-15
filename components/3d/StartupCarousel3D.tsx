"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, ThreeElements, useThree } from "@react-three/fiber";
import { Text, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { StartupPreset } from "@/lib/startup-presets";

/**
 * Props pour le composant StartupCarousel3D
 */
export interface StartupCarousel3DProps {
  startups: StartupPreset[];
  onSelectStartup?: (startupId: string) => void;
  initialStartupId?: string;
}

/**
 * Props pour une carte 3D de startup
 */
interface StartupCard3DProps {
  startup: StartupPreset;
  isSelected: boolean;
  position: [number, number, number];
  onClick: () => void;
}

/**
 * Carte 3D représentant une startup
 */
function StartupCard3D({ startup, isSelected, position, onClick }: StartupCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Charger la texture si logoUrl existe
  useEffect(() => {
    if (startup.logoUrl) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        startup.logoUrl,
        (loadedTexture) => {
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
        }
      );
    }
  }, [startup.logoUrl]);
  
  // Animation de la carte
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Scale animation pour la carte sélectionnée
    const targetScale = isSelected ? 1.2 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });
  
  // Opacité selon l'état
  const opacity = isSelected ? 1 : 0.7;
  
  return (
    <group position={position}>
      <Float
        speed={isSelected ? 2 : 1}
        rotationIntensity={isSelected ? 0.2 : 0.1}
        floatIntensity={isSelected ? 0.3 : 0.15}
      >
        {/* Carte principale */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          renderOrder={0}
        >
          <planeGeometry args={[2.5, 1.5]} />
          <meshStandardMaterial
            color={startup.color}
            transparent
            opacity={opacity}
            roughness={0.3}
            metalness={0.1}
            emissive={startup.color}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
        
        {/* Logo - Image ou Label (en haut, centré) */}
        {texture ? (
          <mesh position={[0, 0.35, 0.02]} renderOrder={1}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial 
              map={texture} 
              transparent={true}
              opacity={isSelected ? 1 : opacity}
              depthWrite={true}
              depthTest={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : (
          <Text
            position={[0, 0.35, 0.03]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            renderOrder={1}
          >
            {startup.logoLabel}
          </Text>
        )}
        
        {/* Nom de la startup (en dessous du logo) */}
        <Text
          position={[0, -0.15, 0.03]}
          fontSize={0.16}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          fontWeight="bold"
          renderOrder={2}
        >
          {startup.name}
        </Text>
        
        {/* Secteur (tout en bas) */}
        <Text
          position={[0, -0.45, 0.03]}
          fontSize={0.11}
          color="rgba(255, 255, 255, 0.9)"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          renderOrder={2}
        >
          {startup.sector}
        </Text>
        
        {/* Bord/cadre pour la carte sélectionnée */}
        {isSelected && (
          <mesh position={[0, 0, -0.01]} renderOrder={-1}>
            <planeGeometry args={[2.6, 1.6]} />
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.3}
              depthWrite={false}
              depthTest={true}
            />
          </mesh>
        )}
      </Float>
    </group>
  );
}

/**
 * Scène 3D contenant toutes les cartes avec parallaxe basée sur la souris
 */
function Scene({ startups, selectedIndex, onSelect, onCardClick, mousePosition, dragAccumulatedY, isDragging }: {
  startups: StartupPreset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onCardClick: (index: number) => void;
  mousePosition: { x: number; y: number };
  dragAccumulatedY: number;
  isDragging: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cardsGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Positionner les cartes verticalement
  const cardSpacing = 2;
  
  // Animation basée sur la position de la souris
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Désactiver les effets de parallaxe pendant le drag pour une meilleure UX
    if (!isDragging) {
      // Calcul de la distance au centre (pour l'axe Z)
      const distanceFromCenter = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
      
      // Rotation du groupe basée sur la position de la souris
      // X de la souris contrôle la rotation Y (gauche/droite)
      // Y de la souris contrôle la rotation X (haut/bas)
      const targetRotationY = mousePosition.x * 0.3; // Sensibilité gauche/droite
      const targetRotationX = -mousePosition.y * 0.2; // Sensibilité haut/bas
      
      // Axe Z : plus on s'éloigne du centre, plus on zoome (ou recule)
      const targetPositionZ = distanceFromCenter * 0.8; // Sensibilité profondeur
      
      // Interpolation fluide (lerp) pour des mouvements doux
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      
      // Translation X et Y pour accentuer l'effet de profondeur
      groupRef.current.position.x += (mousePosition.x * 0.5 - groupRef.current.position.x) * 0.03;
      groupRef.current.position.y += (-mousePosition.y * 0.3 - groupRef.current.position.y) * 0.03;
      
      // Translation Z basée sur la distance au centre
      groupRef.current.position.z += (targetPositionZ - groupRef.current.position.z) * 0.04;
    } else {
      // Pendant le drag, retour progressif à la position neutre
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1;
      groupRef.current.position.x += (0 - groupRef.current.position.x) * 0.1;
      groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.1;
      groupRef.current.position.z += (0 - groupRef.current.position.z) * 0.1;
    }
  });
  
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Environnement pour les reflets */}
      <Environment preset="city" />
      
      {/* Groupe avec parallaxe et drag */}
      <group ref={groupRef}>
        <group ref={cardsGroupRef}>
          {startups.map((startup, index) => {
            // Position Y : décalage vertical basé sur l'index et la sélection
            const offsetFromSelected = index - selectedIndex;
            
            // Ajouter l'offset du drag (convertir pixels en unités 3D)
            // Positif vers le haut = négatif en 3D, donc on inverse
            const dragOffset = -dragAccumulatedY * 0.015; // Sensibilité ajustée
            const yPos = -offsetFromSelected * cardSpacing + dragOffset;
            
            // Position Z : la carte sélectionnée est plus proche
            const zPos = index === selectedIndex ? 0.5 : 0 - Math.abs(offsetFromSelected) * 0.2;
            
            return (
              <StartupCard3D
                key={startup.id}
                startup={startup}
                isSelected={index === selectedIndex}
                position={[0, yPos, zPos]}
                onClick={() => {
                  onSelect(index);
                  onCardClick(index);
                }}
              />
            );
          })}
        </group>
      </group>
    </>
  );
}

/**
 * Composant principal : Canvas 3D avec carrousel de startups
 */
export default function StartupCarousel3D({
  startups,
  onSelectStartup,
  initialStartupId,
}: StartupCarousel3DProps) {
  // État : index de la startup sélectionnée
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (initialStartupId) {
      const index = startups.findIndex(s => s.id === initialStartupId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  
  // État : position de la souris normalisée (-1 à 1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // État : drag pour la navigation
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragAccumulatedY, setDragAccumulatedY] = useState(0);
  
  // Ref pour éviter d'appeler onSelectStartup au premier render
  const isFirstRender = useRef(true);
  const lastNotifiedId = useRef<string | null>(null);
  
  // Notifier le parent quand la sélection change (mais pas au premier render)
  useEffect(() => {
    // Skip le premier render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastNotifiedId.current = startups[selectedIndex]?.id || null;
      return;
    }
    
    const currentId = startups[selectedIndex]?.id;
    
    // Ne notifier que si l'ID a changé
    if (onSelectStartup && currentId && currentId !== lastNotifiedId.current) {
      lastNotifiedId.current = currentId;
      onSelectStartup(currentId);
    }
  }, [selectedIndex, startups, onSelectStartup]);
  
  // Handler pour le mouvement de la souris
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Normaliser les coordonnées entre -1 et 1
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePosition({ x, y });
    
    // Si on est en train de drag, calculer le delta
    if (isDragging) {
      const deltaY = event.clientY - dragStartY;
      setDragAccumulatedY(deltaY);
      
      // Changement automatique et fluide pendant le drag
      const threshold = 80; // Distance pour changer de startup
      
      if (deltaY > threshold) {
        // Glissé vers le bas → défiler vers la gauche (précédent)
        handlePrevious();
        setDragStartY(event.clientY); // Reset le point de départ
        setDragAccumulatedY(0);
      } else if (deltaY < -threshold) {
        // Glissé vers le haut → défiler vers la droite (suivant)
        handleNext();
        setDragStartY(event.clientY); // Reset le point de départ
        setDragAccumulatedY(0);
      }
    }
  };
  
  // Reset de la position quand la souris sort
  const handlePointerLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };
  
  // Début du drag
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStartY(event.clientY);
    setDragAccumulatedY(0);
  };
  
  // Fin du drag
  const handlePointerUp = () => {
    setIsDragging(false);
    setDragAccumulatedY(0);
  };
  
  // Navigation
  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % startups.length);
  };
  
  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + startups.length) % startups.length);
  };
  
  // Handler pour le clic sur une carte - toujours notifier même si déjà sélectionnée
  const handleCardClick = (index: number) => {
    const clickedId = startups[index]?.id;
    if (onSelectStartup && clickedId) {
      onSelectStartup(clickedId);
      lastNotifiedId.current = clickedId;
    }
  };
  
  return (
    <div 
      className="relative w-full h-full cursor-grab active:cursor-grabbing"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Canvas Three.js */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="touch-none"
      >
        <Scene
          startups={startups}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onCardClick={handleCardClick}
          mousePosition={mousePosition}
          dragAccumulatedY={dragAccumulatedY}
          isDragging={isDragging}
        />
      </Canvas>
      
      {/* Boutons de navigation (overlay) - Vertical */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col justify-between py-8 pointer-events-none z-10">
        <button
          onClick={handlePrevious}
          className="pointer-events-auto w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center shadow-lg"
          aria-label="Startup précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        
        <button
          onClick={handleNext}
          className="pointer-events-auto w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center shadow-lg"
          aria-label="Startup suivante"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

