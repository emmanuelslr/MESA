// Types pour les stages (UI utilise les noms français, logique utilise noms du mémoire)
export type Stage = "pre-seed" | "seed" | "série a" | "série b" | "série c ou plus";
export type MesaStageInternal = "pre_seed_seed" | "serie_A_B" | "serie_C_plus";

export interface MesaRawScores {
  perf: number;
  taille: number;
  traction: number;
  profil: number;
  avantage: number;
}

export interface MesaWeightedScores extends MesaRawScores {}

export interface MesaResult {
  raw: MesaRawScores;
  weighted: MesaWeightedScores;
  scoreMesa: number;
  primeRisque: number;
  tauxSansRisque: number;
  tauxActualisation: number;
}

export interface QuestionConfig {
  key: string;
  points: number;
}

// Configuration des questions MESA
export const MESA_QUESTIONS = {
  perf: [
    { key: "perf_a", points: 2, label: "La startup a généré des revenus au cours des 12 derniers mois ?" },
    { key: "perf_b", points: 2, label: "La startup a enregistré une croissance des revenus d'au moins 120% d'une année sur l'autre ?" },
    { key: "perf_c", points: 2, label: "La startup a atteint la rentabilité ?" },
    { key: "perf_d", points: 2, label: "Les prévisions financières montrent une croissance des revenus d'au moins 120% par an pour les 3 prochaines années ?" },
    { key: "perf_e", points: 2, label: "Les prévisions financières montrent une rentabilité soutenue pour les 3 prochaines années ?" },
  ],
  taille: [
    { key: "taille_a", points: 2, label: "Le marché cible a une taille supérieure à 1 milliard de dollars ?" },
    { key: "taille_b", points: 2, label: "Le marché cible affiche une croissance annuelle supérieure à 15% ?" },
    { key: "taille_d", points: 1, label: "La startup a clairement identifié un segment de marché cible avec un besoin spécifique et non satisfait ?" },
    { key: "taille_e", points: 1, label: "La startup a effectué des tests ou obtenu des retours de clients potentiels pour valider que le produit ou service répond aux besoins de ce segment de marché spécifique ?" },
    { key: "taille_g", points: 1, label: "La startup s'aligne sur au moins une tendance majeure du marché (numérisation, durabilité, personnalisation, IA, mobilité, etc.) ?" },
    { key: "taille_h", points: 1, label: "La startup a déjà généré des preuves tangibles (études de marché, rapports d'analystes, témoignages clients) qui valident que les tendances du marché soutiennent sa proposition de valeur ?" },
    { key: "taille_i", points: 2, label: "La startup a un potentiel d'expansion internationale ?" },
  ],
  traction: [
    { key: "traction_a", points: 2, label: "La startup a plus de 1000 utilisateurs actifs ?" },
    { key: "traction_b", points: 2, label: "Le taux de croissance mensuel des utilisateurs est supérieur à 10% ?" },
    { key: "traction_c", points: 2, label: "Le taux de rétention des clients est supérieur à 30% ?" },
    { key: "traction_d", points: 2, label: "Le Net Promoter Score (NPS) est supérieur à 30 ?" },
    { key: "traction_e", points: 2, label: "La startup a des clients payants ?" },
  ],
  profil: [
    { key: "profil_a", points: 2, label: "Les fondateurs ont une expérience antérieure en tant qu'entrepreneur ?" },
    { key: "profil_b", points: 2, label: "Les fondateurs ont une expertise dans le secteur cible ?" },
    { key: "profil_c", points: 2, label: "Les fondateurs ont une expérience en gestion d'équipe ?" },
    { key: "profil_e", points: 1, label: "Les fondateurs possèdent des compétences variées couvrant les domaines clés (technologie, opérations, stratégie, vente, marketing) ?" },
    { key: "profil_f", points: 1, label: "Les fondateurs ont démontré leur capacité à travailler ensemble efficacement et à se répartir les responsabilités en fonction de leurs compétences respectives ?" },
    { key: "profil_g", points: 2, label: "Les fondateurs ont un réseau solide dans l'industrie ?" },
  ],
  avantage: [
    { key: "avantage_a", points: 2, label: "La startup détient des brevets ou a déposé des demandes de brevet ?" },
    { key: "avantage_b", points: 2, label: "La startup a développé une technologie propriétaire ?" },
    { key: "avantage_c", points: 2, label: "La startup a des partenariats stratégiques avec des acteurs clés du secteur ?" },
    { key: "avantage_e", points: 1, label: "Le produit ou service offre des fonctionnalités uniques et différenciées par rapport aux concurrents ?" },
    { key: "avantage_f", points: 1, label: "Le produit ou service présente des avantages prouvés en termes de coût, de qualité, de performance ou d'expérience utilisateur par rapport aux concurrents ?" },
    { key: "avantage_g", points: 2, label: "La startup a reçu des prix ou des reconnaissances pour son innovation ?" },
  ],
};

// Fonction pour calculer le score brut d'une catégorie
export function computeCategoryRawScore(
  answers: Record<string, boolean>,
  questions: QuestionConfig[]
): number {
  const raw = questions.reduce((sum, q) => {
    return sum + (answers[q.key] ? q.points : 0);
  }, 0);
  return Math.min(10, raw);
}

// Coefficients de pondération par stade (selon le mémoire MESA)
export function getStageCoefficients(stage: Stage) {
  const normalized = stage.toLowerCase();
  
  if (normalized === "pre-seed" || normalized === "seed" || normalized === "pre_seed_seed") {
    return {
      perf_coef: 0.10,
      taille_coef: 0.20,
      traction_coef: 0.15,
      profil_coef: 0.40,
      avantage_coef: 0.15,
    };
  } else if (normalized === "série a" || normalized === "série b" || normalized === "serie_a_b") {
    // Pondérations EXACTES du mémoire pour Série A/B (total = 100%)
    return {
      perf_coef: 0.15,    // 15%
      taille_coef: 0.15,  // 15%
      traction_coef: 0.20, // 20%
      profil_coef: 0.30,  // 30%
      avantage_coef: 0.20, // 20%
    };
  } else {
    // Série C ou plus (serie_c_plus)
    return {
      perf_coef: 0.30,
      taille_coef: 0.10,
      traction_coef: 0.25,
      profil_coef: 0.10,
      avantage_coef: 0.25,
    };
  }
}

// Calcul du score MESA complet
export function computeMesaScore(
  rawScores: MesaRawScores,
  stage: Stage
): { scoreMesa: number; weighted: MesaWeightedScores } {
  const coefs = getStageCoefficients(stage);
  
  const weighted: MesaWeightedScores = {
    perf: rawScores.perf * coefs.perf_coef,
    taille: rawScores.taille * coefs.taille_coef,
    traction: rawScores.traction * coefs.traction_coef,
    profil: rawScores.profil * coefs.profil_coef,
    avantage: rawScores.avantage * coefs.avantage_coef,
  };
  
  const scoreMesa = 
    weighted.perf +
    weighted.taille +
    weighted.traction +
    weighted.profil +
    weighted.avantage;
  
  return { scoreMesa, weighted };
}

// Calcul de la prime de risque
export function computeRiskPremium(scoreMesa: number): number {
  return 1 - (scoreMesa / 10);
}

// Projection automatique des flux de trésorerie
// Conforme au code Python du mémoire (Annexe 2)
export function projectCashflows(initial: number[], horizon: number = 7): number[] {
  if (initial.length === 0) {
    throw new Error("Au moins un flux requis");
  }
  
  const flux = [...initial];
  
  if (flux.length >= horizon) {
    return flux.slice(0, horizon);
  }
  
  let dernier_ca = flux[flux.length - 1];
  
  while (flux.length < horizon) {
    let pourcentage: number;
    
    // Logique exacte du code Python du mémoire
    if (dernier_ca < 1_000_000) {
      pourcentage = 1.44; // +44%
    } else if (dernier_ca >= 1_000_000 && dernier_ca < 3_000_000) {
      pourcentage = 0.93; // -7% (décroissance)
    } else if (dernier_ca >= 3_000_000 && dernier_ca < 5_000_000) {
      pourcentage = 0.8; // -20%
    } else if (dernier_ca >= 5_000_000 && dernier_ca < 10_000_000) {
      pourcentage = 0.59; // -41%
    } else if (dernier_ca >= 10_000_000 && dernier_ca < 20_000_000) {
      pourcentage = 0.43; // -57%
    } else {
      pourcentage = 0.45; // -55%
    }
    
    const nouveau_ca = dernier_ca * pourcentage;
    flux.push(nouveau_ca);
    dernier_ca = nouveau_ca;
  }
  
  return flux;
}

// Calcul de la VAN (DCF)
export function computeNPV(flux: number[], tauxActualisation: number): number {
  return flux.reduce((acc, cash, index) => {
    const t = index + 1;
    return acc + cash / Math.pow(1 + tauxActualisation, t);
  }, 0);
}

// Formatage des nombres
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${formatNumber(value * 100, decimals)}%`;
}

// =============================================
// Simulation Monte Carlo
// =============================================

export interface MonteCarloSimulation {
  simulations: number[];
  mean: number;
  median: number;
  percentile5: number;
  percentile25: number;
  percentile75: number;
  percentile95: number;
  stdDev: number;
  min: number;
  max: number;
  distribution: Array<{ range: string; count: number; percentage: number }>;
}

// Génère un nombre aléatoire suivant une distribution normale (Box-Muller)
function generateNormalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

// Simulation Monte Carlo de la valorisation
export function runMonteCarloSimulation(
  baseNPV: number,
  baseTauxActualisation: number,
  cashflows: number[],
  iterations: number = 10000
): MonteCarloSimulation {
  const simulations: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Variation du taux d'actualisation (±20% avec distribution normale)
    const tauxVariation = generateNormalRandom(0, 0.1);
    const simulatedTaux = baseTauxActualisation * (1 + tauxVariation);
    
    // Variation des flux de trésorerie (±30% avec distribution normale pour chaque flux)
    const simulatedCashflows = cashflows.map(cf => {
      const cfVariation = generateNormalRandom(0, 0.15);
      return Math.max(0, cf * (1 + cfVariation));
    });
    
    // Calcul de la VAN avec les valeurs simulées
    const simulatedNPV = computeNPV(simulatedCashflows, Math.max(0.01, simulatedTaux));
    simulations.push(simulatedNPV);
  }
  
  // Tri pour calculer les statistiques
  const sorted = [...simulations].sort((a, b) => a - b);
  
  const mean = simulations.reduce((sum, val) => sum + val, 0) / simulations.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const percentile5 = sorted[Math.floor(sorted.length * 0.05)];
  const percentile25 = sorted[Math.floor(sorted.length * 0.25)];
  const percentile75 = sorted[Math.floor(sorted.length * 0.75)];
  const percentile95 = sorted[Math.floor(sorted.length * 0.95)];
  
  const variance = simulations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / simulations.length;
  const stdDev = Math.sqrt(variance);
  
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Créer la distribution pour l'histogramme (20 bins)
  const binCount = 20;
  const binWidth = (max - min) / binCount;
  const distribution: Array<{ range: string; count: number; percentage: number }> = [];
  
  for (let i = 0; i < binCount; i++) {
    const rangeStart = min + i * binWidth;
    const rangeEnd = rangeStart + binWidth;
    const count = simulations.filter(val => val >= rangeStart && val < rangeEnd).length;
    
    distribution.push({
      range: `${formatCurrency(rangeStart)}`,
      count,
      percentage: (count / simulations.length) * 100,
    });
  }
  
  return {
    simulations,
    mean,
    median,
    percentile5,
    percentile25,
    percentile75,
    percentile95,
    stdDev,
    min,
    max,
    distribution,
  };
}

// Analyse de sensibilité
export interface SensitivityAnalysis {
  variable: string;
  variations: Array<{
    change: string;
    value: number;
    npv: number;
  }>;
}

export function runSensitivityAnalysis(
  baseNPV: number,
  baseTauxActualisation: number,
  cashflows: number[]
): SensitivityAnalysis[] {
  const results: SensitivityAnalysis[] = [];
  
  // Analyse de sensibilité sur le taux d'actualisation
  const tauxVariations = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3];
  results.push({
    variable: "Taux d'actualisation",
    variations: tauxVariations.map(change => {
      const newTaux = baseTauxActualisation * (1 + change);
      const npv = computeNPV(cashflows, Math.max(0.01, newTaux));
      return {
        change: `${change >= 0 ? '+' : ''}${formatNumber(change * 100, 0)}%`,
        value: newTaux,
        npv,
      };
    }),
  });
  
  // Analyse de sensibilité sur les flux de trésorerie
  const cfVariations = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3];
  results.push({
    variable: "Flux de trésorerie",
    variations: cfVariations.map(change => {
      const newCashflows = cashflows.map(cf => cf * (1 + change));
      const npv = computeNPV(newCashflows, baseTauxActualisation);
      return {
        change: `${change >= 0 ? '+' : ''}${formatNumber(change * 100, 0)}%`,
        value: change,
        npv,
      };
    }),
  });
  
  return results;
}
