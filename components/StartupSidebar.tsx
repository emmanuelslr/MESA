"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StartupCarousel3D from "@/components/3d/StartupCarousel3D";
import { STARTUP_PRESETS, STAGE_LABELS, getStartupById } from "@/lib/startup-presets";

/**
 * Props pour le composant StartupSidebar
 */
interface StartupSidebarProps {
  onSelectStartup?: (startupId: string) => void;
}

/**
 * Colonne de gauche : Sélection de startups avec carrousel 3D
 */
export default function StartupSidebar({ onSelectStartup }: StartupSidebarProps) {
  const [selectedStartupId, setSelectedStartupId] = useState<string>(STARTUP_PRESETS[0].id);
  
  // Récupérer les détails de la startup sélectionnée
  const selectedStartup = getStartupById(selectedStartupId);
  
  // Callback quand une startup est sélectionnée (mémorisé)
  const handleSelectStartup = useCallback((startupId: string) => {
    setSelectedStartupId(startupId);
    
    // Notifier le parent
    if (onSelectStartup) {
      onSelectStartup(startupId);
    }
  }, [onSelectStartup]);
  
  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Exemples de startups</CardTitle>
          <CardDescription>
            Sélectionnez une startup de référence. Dans une future version, ce choix pourra pré-remplir automatiquement le simulateur MESA.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Carrousel 3D */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[500px] w-full">
            <StartupCarousel3D
              startups={STARTUP_PRESETS}
              onSelectStartup={handleSelectStartup}
              initialStartupId={selectedStartupId}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Détails de la startup sélectionnée */}
      {selectedStartup && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{selectedStartup.displayName}</CardTitle>
                <CardDescription>{selectedStartup.description}</CardDescription>
              </div>
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden shadow-sm"
                style={{ backgroundColor: selectedStartup.color }}
              >
                {selectedStartup.logoUrl ? (
                  <Image 
                    src={selectedStartup.logoUrl} 
                    alt={selectedStartup.displayName}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  selectedStartup.logoLabel
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Informations principales */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Stade</div>
                <div className="font-medium">{STAGE_LABELS[selectedStartup.stage]}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Score MESA</div>
                <div className="font-medium">{selectedStartup.mesaScoreGlobal}</div>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {selectedStartup.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Message informatif */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium">Fonctionnalité à venir :</span> Cliquez sur une startup pour pré-remplir automatiquement le simulateur MESA avec ses données de référence.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

