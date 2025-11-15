"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  life: number;
  hue: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const particleIdCounter = useRef(0);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    // Suivre la position de la souris
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Créer des particules au mouvement
      const now = Date.now();
      if (now - lastParticleTime.current > 40) {
        lastParticleTime.current = now;
        createParticle(e.clientX, e.clientY);
      }
    };

    // Détecter le hover sur des éléments interactifs
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Animation du curseur et des particules
    const animate = () => {
      // Smooth suivie du curseur (effet de traînée)
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }

      // Mettre à jour les particules
      setParticles((prev) => {
        return prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            life: p.life - 1,
            opacity: p.opacity * 0.96,
            speedY: p.speedY + 0.1, // Gravité
          }))
          .filter((p) => p.life > 0 && p.opacity > 0.01);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const createParticle = (x: number, y: number) => {
      const particle: Particle = {
        id: particleIdCounter.current++,
        x,
        y,
        size: Math.random() * 1.5 + 0.5,
        opacity: 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        life: 50,
        hue: Math.random() * 20 + 0, // Rouge vif (0-20)
      };

      setParticles((prev) => [...prev.slice(-25), particle]);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Curseur principal (cercle extérieur) */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
        style={{
          position: "fixed",
          width: isHovering ? "24px" : "18px",
          height: isHovering ? "24px" : "18px",
          border: "2px solid rgba(220, 38, 38, 0.8)",
          borderRadius: "50%",
          pointerEvents: "none",
          left: "-9px",
          top: "-9px",
          zIndex: 9999,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
          borderColor: isHovering ? "rgba(239, 68, 68, 1)" : "rgba(220, 38, 38, 0.8)",
          boxShadow: isHovering
            ? "0 0 15px rgba(239, 68, 68, 0.6), 0 0 5px rgba(239, 68, 68, 0.8)"
            : "0 0 10px rgba(220, 38, 38, 0.5), 0 0 3px rgba(220, 38, 38, 0.7)",
        }}
      />

      {/* Point central du curseur */}
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          width: isHovering ? "4px" : "3px",
          height: isHovering ? "4px" : "3px",
          backgroundColor: isHovering ? "rgba(239, 68, 68, 1)" : "rgba(220, 38, 38, 1)",
          borderRadius: "50%",
          pointerEvents: "none",
          left: "-1.5px",
          top: "-1.5px",
          zIndex: 10000,
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease",
          boxShadow: isHovering
            ? "0 0 12px rgba(239, 68, 68, 0.9), 0 0 4px rgba(239, 68, 68, 1)"
            : "0 0 8px rgba(220, 38, 38, 0.8), 0 0 3px rgba(220, 38, 38, 1)",
        }}
      />

      {/* Particules */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "fixed",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: `hsla(${particle.hue}, 80%, 65%, ${particle.opacity})`,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 9998,
            boxShadow: `0 0 ${particle.size * 3}px hsla(${particle.hue}, 80%, 65%, ${
              particle.opacity * 0.7
            }), 0 0 ${particle.size}px hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <style jsx global>{`
        body,
        body * {
          cursor: none;
        }

        a,
        button,
        input,
        select,
        textarea,
        [role="button"],
        label {
          cursor: none;
        }

        @media (max-width: 768px) {
          .custom-cursor,
          .custom-cursor-dot {
            display: none;
          }
          body,
          body * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}

