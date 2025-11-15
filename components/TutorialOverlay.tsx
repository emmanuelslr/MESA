"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, HelpCircle, ArrowRight } from "lucide-react";

export type TutorialStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface TutorialOverlayProps {
  currentStep: TutorialStep;
  onNext: () => void;
  onSkip: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const TUTORIAL_CONTENT = {
  1: {
    title: "Bienvenue sur le Simulateur MESA",
    description: "Cet outil te permet de valoriser une startup en combinant le scoring MESA (analyse du risque) et le modèle DCF (flux de trésorerie actualisés). Commençons par les paramètres de base.",
    action: "Clique sur 'Suivant' pour découvrir les paramètres généraux",
    emoji: "👋",
    targetId: null,
  },
  2: {
    title: "Paramètres généraux",
    description: "Définis d'abord le stade de développement de ta startup (Pre-seed, Seed, Série A, B, C...) et le taux sans risque du marché. Ces paramètres influencent directement le calcul de la prime de risque.",
    action: "Clique sur 'Suivant' pour passer au questionnaire MESA",
    emoji: "⚙️",
    targetId: "general-parameters",
  },
  3: {
    title: "Questionnaire MESA",
    description: "Réponds aux questions MESA organisées en 5 catégories : performances financières, taille du marché, traction, profil de l'équipe et avantage concurrentiel. Chaque réponse affecte ton score de risque.",
    action: "Clique sur 'Suivant' pour découvrir les flux de trésorerie",
    emoji: "📋",
    targetId: "mesa-questionnaire",
  },
  4: {
    title: "Flux de trésorerie",
    description: "Saisis tes prévisions de flux de trésorerie annuels sur 7 ans. Si tu ne remplis que les premières années, l'outil projettera automatiquement les années suivantes.",
    action: "Clique sur 'Suivant' pour voir les résultats",
    emoji: "💰",
    targetId: "cashflow-section",
  },
  5: {
    title: "Résultats et Valorisation",
    description: "Ici s'affichent ton score MESA global, la prime de risque calculée, le taux d'actualisation et la Valeur Actuelle Nette (VAN) de ta startup. C'est ici que tu vois l'impact de tes hypothèses !",
    action: "Clique sur 'Suivant' pour les startups de référence",
    emoji: "favicon",
    targetId: "results-section",
  },
  6: {
    title: "Startups de référence (optionnel)",
    description: "Gagne du temps en sélectionnant une startup d'exemple (Instagram, Snapchat, SaaS FR...). Le simulateur se pré-remplira automatiquement avec des données réelles pour t'inspirer.",
    action: "Clique sur 'Terminer' pour commencer à utiliser l'outil",
    emoji: "🚀",
    targetId: "startup-sidebar",
  },
};

export default function TutorialOverlay({
  currentStep,
  onNext,
  onSkip,
  onClose,
  isOpen,
}: TutorialOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && currentStep > 0) {
      setIsVisible(true);
      
      // Scroller vers la section ciblée
      const content = TUTORIAL_CONTENT[currentStep as keyof typeof TUTORIAL_CONTENT];
      if (content?.targetId) {
        setTimeout(() => {
          const element = document.getElementById(content.targetId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 300);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, currentStep]);

  if (!isVisible || currentStep === 0) return null;

  const content = TUTORIAL_CONTENT[currentStep as keyof typeof TUTORIAL_CONTENT];
  if (!content) return null;

  const totalSteps = 6;

  return (
    <>
      {/* Overlay avec flou léger */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none transition-all duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Spotlight sur la zone ciblée avec CSS dynamique */}
      {content.targetId && (
        <style jsx global>{`
          #${content.targetId} {
            position: relative;
            z-index: 45 !important;
            pointer-events: auto !important;
            filter: none !important;
            opacity: 1 !important;
          }
          
          #${content.targetId}::before {
            content: '';
            position: absolute;
            inset: -12px;
            border: 4px solid rgb(239, 68, 68);
            border-radius: 20px;
            box-shadow: 
              0 0 0 9999px rgba(0, 0, 0, 0.55),
              0 0 40px rgba(239, 68, 68, 0.6),
              0 0 80px rgba(239, 68, 68, 0.3),
              inset 0 0 30px rgba(239, 68, 68, 0.1);
            pointer-events: none;
            animation: pulse-spotlight 2s ease-in-out infinite;
            z-index: -1;
            backdrop-filter: blur(0px);
          }
          
          #${content.targetId}::after {
            content: '';
            position: absolute;
            inset: -12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 20px;
            pointer-events: none;
            z-index: -1;
          }
          
          @keyframes pulse-spotlight {
            0%, 100% {
              border-color: rgb(239, 68, 68);
              box-shadow: 
                0 0 0 9999px rgba(0, 0, 0, 0.55),
                0 0 40px rgba(239, 68, 68, 0.6),
                0 0 80px rgba(239, 68, 68, 0.3),
                inset 0 0 30px rgba(239, 68, 68, 0.1);
            }
            50% {
              border-color: rgb(248, 113, 113);
              box-shadow: 
                0 0 0 9999px rgba(0, 0, 0, 0.55),
                0 0 60px rgba(239, 68, 68, 0.8),
                0 0 100px rgba(239, 68, 68, 0.5),
                inset 0 0 40px rgba(239, 68, 68, 0.2);
            }
          }
          
          /* Déflouter complètement la zone ciblée */
          #${content.targetId} * {
            filter: none !important;
            backdrop-filter: none !important;
          }
        `}</style>
      )}

      {/* Panneau flottant - toujours en bas à droite */}
      <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border-2 border-primary/30 bg-card/98 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {content.emoji === "favicon" ? (
                    <Image 
                      src="/icon.svg" 
                      alt="MESA" 
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  ) : (
                    content.emoji
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" className="font-bold">
                      Étape {currentStep}/{totalSteps}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={onSkip}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.description}
            </p>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-primary mt-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-primary">
                {content.action}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onSkip}
              >
                Passer le tutoriel
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={onNext}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={onClose}
                >
                  Terminer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Composant pour le bouton "Revoir le tutoriel"
interface TutorialButtonProps {
  onClick: () => void;
}

export function TutorialButton({ onClick }: TutorialButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <HelpCircle className="h-4 w-4" />
      Revoir le tutoriel
    </Button>
  );
}
