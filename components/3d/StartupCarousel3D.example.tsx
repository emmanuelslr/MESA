/**
 * Exemple d'utilisation du composant StartupCarousel3D
 * 
 * Ce fichier montre comment utiliser le carrousel 3D de manière isolée
 * pour les tests, le développement ou l'intégration dans d'autres pages.
 */

"use client";

import { useState } from "react";
import StartupCarousel3D from "./StartupCarousel3D";
import { STARTUP_PRESETS, getStartupById, STAGE_LABELS } from "@/lib/startup-presets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Exemple 1 : Utilisation basique
 */
export function BasicExample() {
  return (
    <div className="w-full h-[600px] bg-background">
      <StartupCarousel3D
        startups={STARTUP_PRESETS}
        onSelectStartup={(id) => console.log("Startup sélectionnée :", id)}
      />
    </div>
  );
}

/**
 * Exemple 2 : Avec gestion d'état
 */
export function StatefulExample() {
  const [selectedId, setSelectedId] = useState(STARTUP_PRESETS[0].id);
  const selectedStartup = getStartupById(selectedId);

  return (
    <div className="p-8 space-y-6">
      <div className="h-[500px] bg-background rounded-lg overflow-hidden">
        <StartupCarousel3D
          startups={STARTUP_PRESETS}
          onSelectStartup={setSelectedId}
          initialStartupId={selectedId}
        />
      </div>

      {selectedStartup && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedStartup.displayName}</CardTitle>
            <CardDescription>{selectedStartup.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Stade :</strong> {STAGE_LABELS[selectedStartup.stage]}</p>
              <p><strong>Tags :</strong> {selectedStartup.tags.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Exemple 3 : Avec un sous-ensemble de startups
 */
export function FilteredExample() {
  // Filtrer uniquement les startups B2C
  const b2cStartups = STARTUP_PRESETS.filter(s => 
    s.tags.includes("B2C")
  );

  return (
    <div className="w-full h-[600px] bg-background">
      <StartupCarousel3D
        startups={b2cStartups}
        onSelectStartup={(id) => console.log("Startup B2C sélectionnée :", id)}
      />
    </div>
  );
}

/**
 * Exemple 4 : Avec callback personnalisé
 */
export function CustomCallbackExample() {
  const handleSelect = (startupId: string) => {
    const startup = getStartupById(startupId);
    if (startup) {
      // Simuler un pré-remplissage de formulaire
      console.log("Pré-remplissage du formulaire avec :", {
        stage: startup.stage,
        displayName: startup.displayName,
        tags: startup.tags,
      });
      
      // Dans une vraie application, vous appelleriez des setters d'état ici
      // setStage(startup.stage);
      // setTags(startup.tags);
      // etc.
    }
  };

  return (
    <div className="w-full h-[600px] bg-background">
      <StartupCarousel3D
        startups={STARTUP_PRESETS}
        onSelectStartup={handleSelect}
      />
    </div>
  );
}

/**
 * Exemple 5 : Page complète de démonstration
 */
export default function StartupCarousel3DDemo() {
  const [selectedId, setSelectedId] = useState(STARTUP_PRESETS[0].id);
  const selectedStartup = getStartupById(selectedId);
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Carrousel 3D de Startups</h1>
          <p className="text-muted-foreground">
            Démo interactive du composant StartupCarousel3D
          </p>
        </div>

        {/* Contrôles */}
        <Card>
          <CardHeader>
            <CardTitle>Contrôles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRotate"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRotate" className="text-sm">
                Rotation automatique
              </label>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                💡 <strong>Interactions :</strong>
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Cliquez sur une carte pour la sélectionner</li>
                <li>Utilisez les boutons ⬅️ ➡️ pour naviguer</li>
                <li>Cliquez sur les indicateurs (dots) pour aller directement à une startup</li>
                <li>Faites glisser la scène pour la faire pivoter (contrôles limités)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Canvas 3D */}
        <Card>
          <CardContent className="p-0">
            <div className="h-[600px] w-full">
              <StartupCarousel3D
                startups={STARTUP_PRESETS}
                onSelectStartup={setSelectedId}
                initialStartupId={selectedId}
              />
            </div>
          </CardContent>
        </Card>

        {/* Détails de la startup sélectionnée */}
        {selectedStartup && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedStartup.displayName}</CardTitle>
                    <CardDescription className="mt-2">
                      {selectedStartup.description}
                    </CardDescription>
                  </div>
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                    style={{ backgroundColor: selectedStartup.color }}
                  >
                    {selectedStartup.logoLabel}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">ID</div>
                    <div className="font-mono text-sm">{selectedStartup.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Stade</div>
                    <div className="font-medium">{STAGE_LABELS[selectedStartup.stage]}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tags</div>
                    <div className="font-medium">{selectedStartup.tags.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Couleur</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: selectedStartup.color }}
                      />
                      <span className="font-mono text-sm">{selectedStartup.color}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedStartup.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Données JSON</CardTitle>
                <CardDescription>Structure de données de la startup</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(selectedStartup, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste de toutes les startups */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les startups disponibles</CardTitle>
            <CardDescription>
              {STARTUP_PRESETS.length} startups dans la base de données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STARTUP_PRESETS.map((startup) => (
                <button
                  key={startup.id}
                  onClick={() => setSelectedId(startup.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                    selectedId === startup.id
                      ? "border-primary shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: startup.color }}
                    >
                      {startup.logoLabel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{startup.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {startup.sector}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

