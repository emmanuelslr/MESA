"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  runMonteCarloSimulation,
  runSensitivityAnalysis,
  type MonteCarloSimulation,
  type SensitivityAnalysis,
  type MesaResult,
} from "@/lib/mesa";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

interface DetailsPageData {
  mesaResult: MesaResult;
  npv: number;
  cashflows: number[];
}

export default function DetailsPage() {
  const router = useRouter();
  const [data, setData] = useState<DetailsPageData | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloSimulation | null>(null);
  const [sensitivityResults, setSensitivityResults] = useState<SensitivityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données du localStorage
    const savedData = localStorage.getItem("mesaDetailsData");
    if (!savedData) {
      router.push("/");
      return;
    }

    const parsedData: DetailsPageData = JSON.parse(savedData);
    setData(parsedData);

    // Créer une promesse pour le délai minimum de 5 secondes
    const minimumDelay = new Promise(resolve => setTimeout(resolve, 5000));

    // Lancer les simulations
    const mcResult = runMonteCarloSimulation(
      parsedData.npv,
      parsedData.mesaResult.tauxActualisation,
      parsedData.cashflows,
      10000
    );
    setMonteCarloResult(mcResult);

    const sensResults = runSensitivityAnalysis(
      parsedData.npv,
      parsedData.mesaResult.tauxActualisation,
      parsedData.cashflows
    );
    setSensitivityResults(sensResults);

    // Attendre au minimum 2 secondes avant d'afficher les résultats
    minimumDelay.then(() => {
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading || !data || !monteCarloResult) {
    return (
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
        <div className="relative z-10 text-center px-4 w-full max-w-2xl mx-auto">
          <h1 className="logo-mesa text-6xl md:text-8xl lg:text-9xl tracking-tight mb-8">
            <span className="text-black dark:text-white">MESA</span>
            <span className="text-red-600">.</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg md:text-xl text-black/80 dark:text-white/80">
              Chargement en cours
            </p>
          </div>
          
          {/* Barre de progression horizontale */}
          <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-black dark:bg-white rounded-full animate-loading-progress"></div>
          </div>
        </div>
        
        {/* Theme toggle - position fixe en haut à droite */}
        <div className="fixed top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Animation de la barre de progression */}
        <style jsx>{`
          @keyframes loading-progress {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-loading-progress {
            animation: loading-progress 5s ease-in-out infinite;
          }
        `}</style>
      </section>
    );
  }

  // Préparer les données pour les graphiques
  const cashflowChartData = data.cashflows.map((cf, idx) => ({
    année: `Année ${idx + 1}`,
    flux: cf,
    actualisé: cf / Math.pow(1 + data.mesaResult.tauxActualisation, idx + 1),
  }));

  const mesaRadarData = [
    { category: "Perf. financières", score: data.mesaResult.raw.perf, pondéré: data.mesaResult.weighted.perf },
    { category: "Taille marché", score: data.mesaResult.raw.taille, pondéré: data.mesaResult.weighted.taille },
    { category: "Traction", score: data.mesaResult.raw.traction, pondéré: data.mesaResult.weighted.traction },
    { category: "Profil équipe", score: data.mesaResult.raw.profil, pondéré: data.mesaResult.weighted.profil },
    { category: "Avantage concurrentiel", score: data.mesaResult.raw.avantage, pondéré: data.mesaResult.weighted.avantage },
  ];

  const distributionData = monteCarloResult.distribution.map((item, idx) => ({
    id: idx,
    range: item.range,
    count: item.count,
    percentage: item.percentage,
  }));

  const percentilesData = [
    { label: "Min", value: monteCarloResult.min },
    { label: "P5", value: monteCarloResult.percentile5 },
    { label: "P25", value: monteCarloResult.percentile25 },
    { label: "Médiane", value: monteCarloResult.median },
    { label: "Moyenne", value: monteCarloResult.mean },
    { label: "P75", value: monteCarloResult.percentile75 },
    { label: "P95", value: monteCarloResult.percentile95 },
    { label: "Max", value: monteCarloResult.max },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  return (
    <>
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header style Metalab */}
        <div className="mb-12 flex items-center justify-between py-6 border-b">
          {/* Logo HEC à gauche */}
          <div className="flex items-center gap-4">
            <Image 
              src="/images/HEC_Paris.svg (1).png" 
              alt="HEC Paris"
              width={100}
              height={48}
              className="h-12 w-auto brightness-0 dark:invert"
            />
          </div>
          
          {/* MESA au centre - style Metalab */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="logo-mesa text-2xl md:text-3xl lg:text-4xl tracking-tight text-center">
                MESA<span className="text-red-600">.</span>
              </h1>
            </Link>
          </div>
          
          {/* Bouton retour et ThemeToggle à droite */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </div>

        {/* Sous-titre */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Analyse détaillée - MESA + DCF</h2>
          <p className="text-muted-foreground">
            Visualisations avancées, simulation Monte Carlo et analyse de sensibilité
          </p>
        </div>

        {/* Section 1: Résumé des résultats principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Score MESA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(data.mesaResult.scoreMesa, 2)}/10</div>
              <p className="text-xs text-muted-foreground mt-1">
                Prime de risque: {formatPercent(data.mesaResult.primeRisque)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valorisation DCF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(data.npv)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                VAN à 7 ans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valorisation moyenne (MC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(monteCarloResult.mean)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                10 000 simulations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Intervalle de confiance 90%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {formatCurrency(monteCarloResult.percentile5)}
              </div>
              <div className="text-xs text-muted-foreground">à</div>
              <div className="text-sm font-bold">
                {formatCurrency(monteCarloResult.percentile95)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Analyse MESA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Scores MESA par catégorie</CardTitle>
              <CardDescription>Comparaison scores bruts vs pondérés</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mesaRadarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-15} textAnchor="end" height={100} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Score brut" fill="#8884d8" />
                  <Bar dataKey="pondéré" name="Score pondéré" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Composition du score pondéré</CardTitle>
              <CardDescription>Contribution de chaque catégorie au score final</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={mesaRadarData}
                    dataKey="pondéré"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${formatNumber(entry.value as number, 2)}`}
                  >
                    {mesaRadarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Flux de trésorerie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyse des flux de trésorerie</CardTitle>
            <CardDescription>
              Flux bruts vs flux actualisés (taux: {formatPercent(data.mesaResult.tauxActualisation)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="année" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="flux"
                  name="Flux de trésorerie"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="actualisé"
                  name="Flux actualisé"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Section 4: Simulation Monte Carlo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Simulation Monte Carlo</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribution des valorisations</CardTitle>
                <CardDescription>10 000 simulations avec variations aléatoires</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="id" 
                      tickFormatter={(value) => distributionData[value]?.range.slice(0, 10) || ""}
                    />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.range}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.count} simulations ({formatNumber(data.percentage, 1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="percentage" name="Fréquence (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques clés</CardTitle>
                <CardDescription>Percentiles et mesures de dispersion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {percentilesData.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-3 rounded ${
                        item.label === "Moyenne" || item.label === "Médiane"
                          ? "bg-primary/10 font-semibold"
                          : "bg-muted/50"
                      }`}
                    >
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center p-3 rounded bg-accent">
                    <span className="text-sm font-semibold">Écart-type</span>
                    <span className="text-sm font-medium">{formatCurrency(monteCarloResult.stdDev)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 5: Analyse de sensibilité */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Analyse de sensibilité</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sensitivityResults.map((result, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{result.variable}</CardTitle>
                  <CardDescription>Impact sur la valorisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.variations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="change" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="npv"
                        name="VAN"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {result.variations.map((variation, vIdx) => (
                      <div
                        key={vIdx}
                        className={`flex justify-between items-center p-2 rounded text-sm ${
                          variation.change === "+0%" ? "bg-primary/10 font-semibold" : "bg-muted/50"
                        }`}
                      >
                        <span>{variation.change}</span>
                        <span className="font-medium">{formatCurrency(variation.npv)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 6: Interprétation et recommandations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Interprétation des résultats</CardTitle>
            <CardDescription>Recommandations basées sur l&apos;analyse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Score MESA</h4>
              <p className="text-sm text-muted-foreground">
                {data.mesaResult.scoreMesa >= 7
                  ? "✅ Excellent score! La startup présente un profil de risque faible avec des fondamentaux solides."
                  : data.mesaResult.scoreMesa >= 5
                  ? "⚠️ Score moyen. La startup présente un potentiel intéressant mais nécessite des améliorations dans certaines catégories."
                  : "❌ Score faible. La startup présente un profil de risque élevé. Une attention particulière est requise."}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Simulation Monte Carlo</h4>
              <p className="text-sm text-muted-foreground">
                La valorisation moyenne simulée est de {formatCurrency(monteCarloResult.mean)} avec un écart-type de {formatCurrency(monteCarloResult.stdDev)}.
                L&apos;intervalle de confiance à 90% se situe entre {formatCurrency(monteCarloResult.percentile5)} et {formatCurrency(monteCarloResult.percentile95)}.
                {Math.abs(monteCarloResult.mean - data.npv) / data.npv > 0.2 &&
                  " ⚠️ L'écart important entre la VAN déterministe et la moyenne Monte Carlo suggère une forte sensibilité aux hypothèses."}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Analyse de sensibilité</h4>
              <p className="text-sm text-muted-foreground">
                Les graphiques montrent l&apos;impact des variations du taux d&apos;actualisation et des flux de trésorerie sur la valorisation.
                Une pente plus raide indique une plus grande sensibilité à ce paramètre.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={() => window.print()} variant="outline">
            Imprimer le rapport
          </Button>
          <Button onClick={() => router.push("/")} variant="default">
            Nouvelle analyse
          </Button>
        </div>
      </div>
    </div>

    {/* Footer Section - Style Singular.vc */}
    <footer className="relative py-12 overflow-hidden">
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
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <span className="logo-mesa text-2xl text-black dark:text-white">
                MESA<span className="text-red-600">.</span>
              </span>
            </Link>
          </div>

          {/* Copyright au centre */}
          <div className="flex-1 text-center">
            <p className="text-black/80 dark:text-white/80 text-sm">
              MESA - All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

