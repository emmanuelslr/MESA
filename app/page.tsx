"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MESA_QUESTIONS,
  computeCategoryRawScore,
  computeMesaScore,
  computeRiskPremium,
  projectCashflows,
  computeNPV,
  formatCurrency,
  formatNumber,
  formatPercent,
  type Stage,
  type MesaRawScores,
  type MesaResult,
} from "@/lib/mesa";
import StartupSidebar from "@/components/StartupSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { applyMesaPreset, getStartupById, CURRENCY_LABELS } from "@/lib/startup-presets";
import TutorialOverlay, { TutorialButton, type TutorialStep } from "@/components/TutorialOverlay";

export default function Home() {
  const router = useRouter();
  
  // État pour le stade
  const [stage, setStage] = useState<Stage | "">("");
  
  // État pour le taux sans risque (en pourcentage)
  const [tauxSansRisque, setTauxSansRisque] = useState<string>("3");
  
  // État pour les réponses MESA
  const [mesaAnswers, setMesaAnswers] = useState<Record<string, boolean>>({});
  
  // État pour les flux de trésorerie (1 à 7 ans)
  const [cashflows, setCashflows] = useState<string[]>(["", "", "", "", "", "", ""]);
  
  // État pour l'unité de devise des flux
  const [currencyUnit, setCurrencyUnit] = useState<"EUR" | "USD" | "kEUR" | "kUSD">("EUR");
  
  // État pour les accordéons MESA (fermés par défaut)
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  
  // État pour le nom de la startup sélectionnée
  const [selectedStartupName, setSelectedStartupName] = useState<string | null>(null);
  
  // États pour le tutoriel
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  
  // Initialisation du tutoriel - se lance uniquement sur la section simulateur
  useEffect(() => {
    // Observer quand on arrive sur la section #simulator
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCompletedTutorial && tutorialStep === 0) {
            // Lancer le tutoriel après un court délai
            setTimeout(() => {
              setTutorialStep(1);
              setIsTutorialOpen(true);
            }, 800);
          }
        });
      },
      { threshold: 0.3 }
    );

    const simulatorSection = document.getElementById('simulator');
    if (simulatorSection) {
      observer.observe(simulatorSection);
    }

    return () => {
      if (simulatorSection) {
        observer.unobserve(simulatorSection);
      }
    };
  }, [hasCompletedTutorial, tutorialStep]);
  
  // Calcul des scores bruts MESA
  const rawScores = useMemo<MesaRawScores>(() => {
    try {
      if (!MESA_QUESTIONS || !MESA_QUESTIONS.perf) {
        console.error("MESA_QUESTIONS is not properly loaded");
        return { perf: 0, taille: 0, traction: 0, profil: 0, avantage: 0 };
      }
      return {
        perf: computeCategoryRawScore(mesaAnswers, MESA_QUESTIONS.perf),
        taille: computeCategoryRawScore(mesaAnswers, MESA_QUESTIONS.taille),
        traction: computeCategoryRawScore(mesaAnswers, MESA_QUESTIONS.traction),
        profil: computeCategoryRawScore(mesaAnswers, MESA_QUESTIONS.profil),
        avantage: computeCategoryRawScore(mesaAnswers, MESA_QUESTIONS.avantage),
      };
    } catch (error) {
      console.error("Error computing raw scores:", error);
      return { perf: 0, taille: 0, traction: 0, profil: 0, avantage: 0 };
    }
  }, [mesaAnswers]);
  
  // Calcul du score MESA pondéré
  const mesaResult = useMemo(() => {
    if (!stage) return null;
    
    try {
      const { scoreMesa, weighted } = computeMesaScore(rawScores, stage as Stage);
      const primeRisque = computeRiskPremium(scoreMesa);
      const tsr = parseFloat(tauxSansRisque) || 0;
      const tauxActualisation = tsr / 100 + primeRisque;
      
      return {
        raw: rawScores,
        weighted,
        scoreMesa,
        primeRisque,
        tauxSansRisque: tsr,
        tauxActualisation,
      };
    } catch (error) {
      console.error("Error computing MESA result:", error);
      return null;
    }
  }, [rawScores, stage, tauxSansRisque]);
  
  // Traitement des flux de trésorerie
  const processedCashflows = useMemo(() => {
    try {
      const initialFlux = cashflows
        .map((cf, idx) => {
          const val = parseFloat(cf);
          // Accepter les valeurs négatives (pour SaaS FR) et non-NaN
          return isNaN(val) ? null : { year: idx + 1, value: val };
        })
        .filter((cf): cf is { year: number; value: number } => cf !== null)
        .map(cf => cf.value);
      
      if (initialFlux.length === 0) return null;
      
      const projected = projectCashflows(initialFlux, 7);
      return {
        initial: initialFlux,
        projected,
        isProjected: (idx: number) => idx >= initialFlux.length,
      };
    } catch (error) {
      console.error("Error processing cashflows:", error);
      return null;
    }
  }, [cashflows]);
  
  // Calcul de la VAN
  const npv = useMemo(() => {
    if (!mesaResult || !processedCashflows) return null;
    try {
      return computeNPV(processedCashflows.projected, mesaResult.tauxActualisation);
    } catch (error) {
      console.error("Error computing NPV:", error);
      return null;
    }
  }, [mesaResult, processedCashflows]);
  
  // Gestion des réponses MESA
  const handleMesaAnswer = (key: string, checked: boolean) => {
    setMesaAnswers(prev => ({ ...prev, [key]: checked }));
  };
  
  // Gestion des flux
  const handleCashflowChange = (index: number, value: string) => {
    const newCashflows = [...cashflows];
    newCashflows[index] = value;
    setCashflows(newCashflows);
  };
  
  // Reset
  const handleReset = () => {
    setStage("");
    setTauxSansRisque("3");
    setMesaAnswers({});
    setCashflows(["", "", "", "", "", "", ""]);
    setCurrencyUnit("EUR");
    setSelectedStartupName(null);
  };
  
  // Gestion du tutoriel
  const handleTutorialNext = () => {
    if (tutorialStep < 6) {
      setTutorialStep((prev) => (prev + 1) as TutorialStep);
    }
  };
  
  const handleTutorialSkip = () => {
    setIsTutorialOpen(false);
    setTutorialStep(0);
    setHasCompletedTutorial(true);
  };
  
  const handleTutorialClose = () => {
    setIsTutorialOpen(false);
    setTutorialStep(0);
    setHasCompletedTutorial(true);
  };
  
  const handleRestartTutorial = () => {
    setTutorialStep(1);
    setIsTutorialOpen(true);
    setHasCompletedTutorial(false);
  };
  
  // Fonction pour formater la monnaie selon l'unité
  const formatCurrencyWithUnit = (value: number): string => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    
    switch (currencyUnit) {
      case "USD":
        return sign + new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(absValue);
      case "EUR":
        return sign + new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(absValue);
      case "kUSD":
        // Convertir en dollars complets (multiplier par 1000)
        const fullValueUSD = absValue * 1000;
        return sign + new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(fullValueUSD);
      case "kEUR":
        // Convertir en euros complets (multiplier par 1000)
        const fullValueEUR = absValue * 1000;
        return sign + new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(fullValueEUR);
      default:
        return sign + formatCurrency(absValue);
    }
  };

  // Callback quand une startup est sélectionnée (mémorisé pour éviter les boucles infinies)
  const handleSelectStartup = useCallback((startupId: string) => {
    console.log("Startup sélectionnée :", startupId);
    
    // Récupérer les infos de la startup
    const startup = getStartupById(startupId);
    if (!startup) {
      console.warn(`Startup non trouvée : ${startupId}`);
      return;
    }
    
    // Pré-remplir le simulateur avec les données de la startup
    applyMesaPreset(startupId, (values) => {
      if (values.stage !== undefined) {
        setStage(values.stage);
      }
      if (values.tauxSansRisque !== undefined) {
        setTauxSansRisque(values.tauxSansRisque);
      }
      if (values.mesaAnswers !== undefined) {
        setMesaAnswers(values.mesaAnswers);
      }
      if (values.cashflows !== undefined) {
        setCashflows(values.cashflows);
      }
      if (values.currencyUnit !== undefined) {
        setCurrencyUnit(values.currencyUnit);
      }
    });
    
    // Afficher le message de confirmation
    setSelectedStartupName(startup.displayName);
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      setSelectedStartupName(null);
    }, 3000);
  }, []); // Pas de dépendances car on utilise des setters de state stables
  
  // Naviguer vers la page de détails
  const handleViewDetails = () => {
    console.log("Button clicked!");
    console.log("mesaResult:", mesaResult);
    console.log("npv:", npv);
    console.log("processedCashflows:", processedCashflows);
    
    if (!mesaResult || npv === null || !processedCashflows) {
      console.log("Conditions not met, returning early");
      return;
    }
    
    try {
      // Sauvegarder les données dans le localStorage
      const dataToSave = {
        mesaResult,
        npv,
        cashflows: processedCashflows.projected,
      };
      console.log("Saving data:", dataToSave);
      localStorage.setItem("mesaDetailsData", JSON.stringify(dataToSave));
      console.log("Data saved successfully");
      
      // Naviguer vers la page de détails
      console.log("Navigating to /details");
      router.push("/details");
    } catch (error) {
      console.error("Error in handleViewDetails:", error);
    }
  };
  
  const categoryLabels = {
    perf: "Performances financières",
    taille: "Taille et croissance du marché",
    traction: "Traction et adoption",
    profil: "Profil de l'équipe",
    avantage: "Avantage concurrentiel",
  };
  
  // Calcul de la progression du questionnaire
  const totalQuestions = useMemo(() => {
    if (!MESA_QUESTIONS) return 0;
    return Object.values(MESA_QUESTIONS).reduce((sum, questions) => sum + questions.length, 0);
  }, []);
  
  const answeredQuestions = useMemo(() => {
    return Object.keys(mesaAnswers).filter(key => mesaAnswers[key]).length;
  }, [mesaAnswers]);
  
  const progressPercentage = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100) 
    : 0;
  
  // Plus de passage automatique aux étapes - tout est manuel maintenant
  
  // Vérification que MESA_QUESTIONS est disponible (après les hooks)
  if (!MESA_QUESTIONS || !MESA_QUESTIONS.perf) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Erreur de configuration</h1>
          <p className="text-muted-foreground">
            Les questions MESA ne sont pas disponibles. Veuillez vérifier la configuration.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Hero Section - Style Singular.vc */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://singular.vc/wp-content/uploads/2021/03/bck-black-min-scaled.jpg"
            alt="Background"
            fill
            className="object-cover dark:block hidden"
            priority
          />
          <Image
            src="https://singular.vc/wp-content/uploads/2021/03/bck-white-min-scaled.jpg"
            alt="Background"
            fill
            className="object-cover dark:hidden block"
            priority
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 text-center px-4">
          <h1 className="logo-mesa text-6xl md:text-8xl lg:text-9xl tracking-tight">
            <span className="text-black dark:text-white">MESA</span>
            <span className="text-red-600">.</span>
          </h1>
          
          {/* Scroll indicator */}
          <button
            onClick={() => {
              const simulator = document.getElementById('simulator');
              simulator?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-16 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors flex flex-col items-center gap-2 mx-auto group"
          >
            <span className="text-sm uppercase tracking-widest">Découvrir</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
        </div>
        
        {/* Theme toggle - position fixe en haut à droite */}
        <div className="fixed top-6 right-6 z-20">
          <ThemeToggle />
        </div>
      </section>

      {/* Simulateur Section */}
      <div id="simulator" className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Header style Metalab */}
          <div className="mb-12 flex items-center justify-between py-6 border-b">
            {/* Logo HEC à gauche avec animation spin */}
            <div className="flex items-center gap-4">
              <Image 
                src="/images/HEC_Paris.svg (1).png" 
                alt="HEC Paris"
                width={100}
                height={48}
                className="h-12 w-auto animate-spin-slow brightness-0 dark:invert"
                style={{ animationDuration: '3s' }}
              />
            </div>
            
            {/* MESA au centre - style Metalab - taille réduite */}
            <div className="flex-1 flex justify-center">
              <h1 className="logo-mesa text-2xl md:text-3xl lg:text-4xl tracking-tight text-center">
                MESA<span className="text-red-600">.</span>
              </h1>
            </div>
            
            {/* Bouton "Revoir le tutoriel" à droite */}
            <div className="flex items-center gap-2">
              {hasCompletedTutorial && (
                <TutorialButton onClick={handleRestartTutorial} />
              )}
            </div>
          </div>
          
          {/* Sous-titre */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground text-lg">
              Valorisation de startup basée sur la méthode MESA et le modèle DCF
            </p>
          </div>
        
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Colonne gauche : Sélection de startups (30%) */}
          <div id="startup-sidebar" className="w-full xl:w-[30%] xl:max-w-[450px]">
            <div className="xl:sticky xl:top-4">
              <StartupSidebar onSelectStartup={handleSelectStartup} />
            </div>
          </div>
          
          {/* Colonne centrale et droite : Simulateur existant */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne centrale : Inputs (2/3 de la largeur) */}
            <div className="lg:col-span-2 space-y-6">
            {/* Notification de sélection de startup */}
            {selectedStartupName && (
              <Card className="bg-primary/10 border-primary">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-medium">✓</span>
                    <span>
                      Preset <strong>{selectedStartupName}</strong> chargé avec succès
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Stade et taux sans risque */}
            <Card id="general-parameters">
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stade de la startup</Label>
                  <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="Sélectionner un stade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="série a">Série A</SelectItem>
                      <SelectItem value="série b">Série B</SelectItem>
                      <SelectItem value="série c ou plus">Série C ou plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tsr">Taux sans risque (%)</Label>
                  <Input
                    id="tsr"
                    type="number"
                    step="0.1"
                    min="0"
                    value={tauxSansRisque}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0)) {
                        setTauxSansRisque(val);
                      }
                    }}
                    placeholder="3"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Questionnaire MESA */}
            <Card id="mesa-questionnaire">
              <div className="sticky top-4 z-10 bg-card border-b shadow-sm">
                <CardHeader>
                  <CardTitle>Questionnaire MESA</CardTitle>
                  <CardDescription>
                    Répondez aux questions pour chaque catégorie (score max 10 par catégorie)
                  </CardDescription>
                  {/* Barre de progression */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progression: {answeredQuestions}/{totalQuestions} questions</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent>
                <Accordion
                  type="multiple"
                  value={openAccordions}
                  onValueChange={setOpenAccordions}
                  className="space-y-2"
                >
                  {(Object.keys(MESA_QUESTIONS) as Array<keyof typeof MESA_QUESTIONS>).map((category) => {
                    const categoryQuestions = MESA_QUESTIONS[category];
                    const answeredInCategory = categoryQuestions.filter(
                      q => mesaAnswers[q.key]
                    ).length;
                    const categoryProgress = categoryQuestions.length > 0
                      ? Math.round((answeredInCategory / categoryQuestions.length) * 100)
                      : 0;
                    
                    return (
                      <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between flex-1 mr-4">
                            <div className="text-left">
                              <div className="font-semibold text-sm">
                                {categoryLabels[category]}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Score: {rawScores[category]}/10 • {answeredInCategory}/{categoryQuestions.length} répondues
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                              <div className="w-16 bg-muted rounded-full h-1.5">
                                <div
                                  className="h-full bg-primary transition-all duration-300"
                                  style={{ width: `${categoryProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2 pb-2">
                            {categoryQuestions.map((q) => (
                              <div key={q.key} className="flex items-start space-x-2 py-1.5">
                                <Checkbox
                                  id={q.key}
                                  checked={mesaAnswers[q.key] || false}
                                  onCheckedChange={(checked) =>
                                    handleMesaAnswer(q.key, checked === true)
                                  }
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={q.key}
                                  className="text-sm font-normal leading-relaxed cursor-pointer flex-1"
                                >
                                  {q.label} <span className="text-muted-foreground">({q.points} pts)</span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
            
            {/* Flux de trésorerie */}
            <Card id="cashflow-section">
              <CardHeader>
                <CardTitle>Flux de trésorerie (années 1 à 7)</CardTitle>
                <CardDescription>
                  Saisissez au moins un flux. Les années manquantes seront projetées automatiquement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cashflows.map((cf, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`cf-${idx}`} className="text-sm">
                        Année {idx + 1} ({CURRENCY_LABELS[currencyUnit]})
                      </Label>
                      <Input
                        id={`cf-${idx}`}
                        type="number"
                        step="1000"
                        value={cf}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Permettre les valeurs négatives pour la startup SaaS FR
                          if (val === "" || !isNaN(parseFloat(val))) {
                            handleCashflowChange(idx, val);
                          }
                        }}
                        placeholder="0"
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleReset} variant="outline" className="w-full">
              Réinitialiser
            </Button>
          </div>
          
          {/* Colonne droite : Résultats - STICKY */}
          <div id="results-section" className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Résumé MESA */}
              {mesaResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé MESA</CardTitle>
                    <CardDescription>Score global: {formatNumber(mesaResult.scoreMesa, 2)}/10</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {(Object.keys(mesaResult.raw) as Array<keyof MesaRawScores>).map((cat) => (
                        <div key={cat} className="flex justify-between items-center text-sm">
                          <span>{categoryLabels[cat]}:</span>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatNumber(mesaResult.raw[cat], 1)} → {formatNumber(mesaResult.weighted[cat], 2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              (brut → pondéré)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Score MESA global:</span>
                        <span className="font-bold text-lg">{formatNumber(mesaResult.scoreMesa, 2)}/10</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Prime de risque:</span>
                        <span className="font-medium">{formatPercent(mesaResult.primeRisque)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Taux sans risque:</span>
                        <span className="font-medium">{formatNumber(mesaResult.tauxSansRisque, 2)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Taux d&apos;actualisation:</span>
                        <span className="font-medium">{formatPercent(mesaResult.tauxActualisation)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Valorisation DCF */}
              {npv !== null && processedCashflows && (
                <Card>
                  <CardHeader>
                    <CardTitle>Valorisation DCF</CardTitle>
                    <CardDescription>Valeur actuelle nette sur 7 ans</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrencyWithUnit(npv)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Taux d&apos;actualisation: {mesaResult ? formatPercent(mesaResult.tauxActualisation) : "N/A"}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Flux de trésorerie utilisés:</h4>
                      <div className="space-y-1 text-sm">
                        {processedCashflows.projected.map((cf, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2 rounded bg-muted/50"
                          >
                            <span>
                              Année {idx + 1}
                              {processedCashflows.isProjected(idx) && (
                                <span className="text-xs text-muted-foreground ml-2">(projeté)</span>
                              )}
                            </span>
                            <span className="font-medium">{formatCurrencyWithUnit(cf)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div id="details-button-container" className="space-y-2 relative">
                      <Link 
                        href="/details"
                        onClick={(e) => {
                          if (!mesaResult || npv === null || !processedCashflows) {
                            e.preventDefault();
                            alert("Veuillez remplir tous les champs requis");
                            return;
                          }
                          try {
                            const dataToSave = {
                              mesaResult,
                              npv,
                              cashflows: processedCashflows.projected,
                            };
                            localStorage.setItem("mesaDetailsData", JSON.stringify(dataToSave));
                            console.log("Data saved successfully:", dataToSave);
                          } catch (error) {
                            console.error("Error saving data:", error);
                            e.preventDefault();
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full"
                      >
                        <Image src="/icon.svg" alt="MESA" width={20} height={20} className="w-5 h-5" />
                        Voir l&apos;analyse détaillée
                      </Link>
                      <p className="text-xs text-center text-muted-foreground">
                        Graphiques Monte Carlo et analyses approfondies
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Message si données incomplètes */}
              {(!mesaResult || npv === null) && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>Remplissez les paramètres et au moins un flux de trésorerie pour voir les résultats.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Section - Style Singular.vc */}
    <footer className="relative mt-16 py-12 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://singular.vc/wp-content/uploads/2021/03/bck-black-min-scaled.jpg"
          alt="Background"
          fill
          className="object-cover dark:block hidden"
        />
        <Image
          src="https://singular.vc/wp-content/uploads/2021/03/bck-white-min-scaled.jpg"
          alt="Background"
          fill
          className="object-cover dark:hidden block"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo MESA à gauche */}
          <div className="flex items-center flex-1">
            <span className="logo-mesa text-2xl text-black dark:text-white">
              MESA<span className="text-red-600">.</span>
            </span>
          </div>

          {/* All rights reserved au centre */}
          <div className="flex-1 text-center">
            <p className="text-black/80 dark:text-white/80 text-sm">
              MESA - All Rights reserved
            </p>
          </div>

          {/* Noms à droite */}
          <div className="flex-1 text-right">
            <p className="text-black/80 dark:text-white/80 text-sm">
              © Anton Jego et Emmanuel Schmidt le Roi
            </p>
          </div>
        </div>
      </div>
    </footer>
    
    {/* Style pour le bouton "Voir l'analyse détaillée" quand disponible */}
    {mesaResult && npv !== null && processedCashflows && (
      <style jsx global>{`
        #details-button-container::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 2px solid rgb(239, 68, 68);
          border-radius: 12px;
          box-shadow: 
            0 0 20px rgba(239, 68, 68, 0.4),
            0 0 40px rgba(239, 68, 68, 0.2),
            inset 0 0 20px rgba(239, 68, 68, 0.05);
          pointer-events: none;
          animation: pulse-details-button 2.5s ease-in-out infinite;
          z-index: 0;
        }
        
        #details-button-container > * {
          position: relative;
          z-index: 1;
        }
        
        @keyframes pulse-details-button {
          0%, 100% {
            border-color: rgb(239, 68, 68);
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 0.4),
              0 0 40px rgba(239, 68, 68, 0.2),
              inset 0 0 20px rgba(239, 68, 68, 0.05);
            opacity: 0.8;
          }
          50% {
            border-color: rgb(248, 113, 113);
            box-shadow: 
              0 0 30px rgba(239, 68, 68, 0.6),
              0 0 60px rgba(239, 68, 68, 0.3),
              inset 0 0 25px rgba(239, 68, 68, 0.1);
            opacity: 1;
          }
        }
      `}</style>
    )}
    
    {/* Tutoriel guidé */}
    <TutorialOverlay
      currentStep={tutorialStep}
      onNext={handleTutorialNext}
      onSkip={handleTutorialSkip}
      onClose={handleTutorialClose}
      isOpen={isTutorialOpen}
    />
    </>
  );
}

