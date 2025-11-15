/**
 * Types et données pour les startups de référence avec presets MESA + DCF
 * Basé sur le mémoire MESA et les données d'annexes
 */

// Type pour les réponses MESA : 0 ou 1
export type Bool01 = 0 | 1;

// Type pour les stades de financement (convention du mémoire)
export type MesaStage = "pre_seed_seed" | "serie_A_B" | "serie_C_plus";

// Type pour les unités de devise
export type CurrencyUnit = "EUR" | "USD" | "kEUR" | "kUSD";

/**
 * Toutes les réponses MESA (0 ou 1)
 * Convention : exactement comme dans le code Python du mémoire
 */
export type MesaCategoryAnswers = {
  // Performances financières (perf_*)
  perf_a: Bool01;
  perf_b: Bool01;
  perf_c: Bool01;
  perf_d: Bool01;
  perf_e: Bool01;

  // Taille / croissance du marché (taille_*)
  taille_a: Bool01;
  taille_b: Bool01;
  taille_d: Bool01;
  taille_e: Bool01;
  taille_g: Bool01;
  taille_h: Bool01;
  taille_i: Bool01;

  // Traction / adoption (traction_*)
  traction_a: Bool01;
  traction_b: Bool01;
  traction_c: Bool01;
  traction_d: Bool01;
  traction_e: Bool01;

  // Profil de l'équipe (profil_*)
  profil_a: Bool01;
  profil_b: Bool01;
  profil_c: Bool01;
  profil_e: Bool01;
  profil_f: Bool01;
  profil_g: Bool01;

  // Avantage concurrentiel / innovation (avantage_*)
  avantage_a: Bool01;
  avantage_b: Bool01;
  avantage_c: Bool01;
  avantage_e: Bool01;
  avantage_f: Bool01;
  avantage_g: Bool01;
};

/**
 * Interface complète pour un preset de startup
 */
export interface MesaStartupPreset {
  id: string;
  displayName: string;
  shortLabel: string;
  logoUrl?: string;
  description: string;

  // Stage de financement
  stage: MesaStage;

  // Réponses brutes (0/1) au questionnaire MESA
  answers: MesaCategoryAnswers;

  // Score MESA global attendu (pour contrôle et affichage)
  mesaScoreGlobal: number;

  // Paramètres DCF
  riskFreeRate: number; // ex: 0.03 pour 3%
  riskPremium: number; // ex: 0.2499 pour 24.99%
  discountRate: number; // riskFreeRate + riskPremium

  // Flux de trésorerie utilisés dans le mémoire
  cashflows: number[]; // année 1 → année 7 (ou moins si projection automatique)
  currencyUnit: CurrencyUnit;
  filledYears: number; // Nombre d'années vraiment renseignées (le reste sera projeté)

  // Valorisation DCF publiée dans le mémoire (pour check)
  publishedNpv?: number;
  npvUnit?: CurrencyUnit;

  notes?: string;

  // Métadonnées pour l'affichage
  logoLabel: string;
  color: string;
  tags: string[];
}

/**
 * Presets MESA complets basés sur le mémoire
 */
export const MESA_PRESETS: Record<string, MesaStartupPreset> = {
  instagram_2012: {
    id: "instagram_2012",
    displayName: "Instagram – 2012 (avant rachat par Facebook)",
    shortLabel: "Instagram",
    description: "Plateforme de partage de photos en forte croissance, rachetée par Facebook pour 1 Md$",
    logoLabel: "IG",
    logoUrl: "/images/Instagram_logo_2022.svg.webp",
    color: "#E4405F",
    tags: ["B2C", "Social Media", "Hyper Growth"],
    stage: "serie_A_B",

    // Données exactes de l'Annexe 4 du mémoire
    answers: {
      // Performances financières (4/10)
      perf_a: 0, // pas de revenus sur 12 derniers mois
      perf_b: 0, // pas de croissance ≥ 120% YoY
      perf_c: 0, // pas rentable
      perf_d: 1, // croissance ≥ 120% sur 3 ans à venir
      perf_e: 1, // rentabilité soutenue sur 3 ans

      // Taille & croissance du marché (10/10)
      taille_a: 1, // marché > 1 Md$
      taille_b: 1, // croissance marché > 15%
      taille_d: 1, // segment cible identifié
      taille_e: 1, // tests / retours clients
      taille_g: 1, // aligné sur tendance majeure
      taille_h: 1, // preuves tangibles / analystes
      taille_i: 1, // potentiel international

      // Traction & adoption (6/10)
      traction_a: 1, // > 1000 utilisateurs actifs
      traction_b: 1, // croissance mensuelle > 10%
      traction_c: 1, // rétention > 30%
      traction_d: 0, // NPS > 30 (pas d'info)
      traction_e: 0, // clients payants

      // Profil équipe (10/10)
      profil_a: 1, // expérience entrepreneuriale
      profil_b: 1, // expertise secteur
      profil_c: 1, // gestion d'équipe
      profil_e: 1, // compétences variées
      profil_f: 1, // bonne collaboration
      profil_g: 1, // réseau solide

      // Avantage concurrentiel & innovation (6/10)
      avantage_a: 0, // pas de brevets
      avantage_b: 1, // technologie propriétaire
      avantage_c: 1, // partenariats stratégiques
      avantage_e: 1, // fonctionnalités uniques
      avantage_f: 1, // avantages prouvés
      avantage_g: 0, // pas de prix / reconnaissances
    },

    mesaScoreGlobal: 7.5,
    riskFreeRate: 0.03,
    riskPremium: 0.2499,
    discountRate: 0.2799,

    // Flux basés sur ARPU Facebook 2012 (en dollars)
    cashflows: [
      266_000_000,
      798_000_000,
      359_100_000,
      161_595_000,
      72_717_750,
      32_722_987.5,
      14_725_344.38,
    ],
    currencyUnit: "USD",
    filledYears: 7,
    publishedNpv: 957_523_842.19,
    npvUnit: "USD",

    notes: "Instagram : flux basés sur ARPU Facebook 2012 (5,32$ × 50M puis 150M utilisateurs). Score MESA 7.5/10, taux d'actualisation 27.99%.",
  },

  snapchat_2013: {
    id: "snapchat_2013",
    displayName: "Snapchat – 2013 (pré-IPO, croissance forte)",
    shortLabel: "Snapchat",
    description: "Application de messagerie éphémère en forte croissance, utilisée par les jeunes",
    logoLabel: "SC",
    logoUrl: "/images/Snapchat.png",
    color: "#FFFC00",
    tags: ["B2C", "Mobile-first", "Social Media"],
    stage: "serie_A_B",

    // Données exactes de l'Annexe 5 du mémoire
    answers: {
      // Performances financières (4/10)
      perf_a: 0,
      perf_b: 0,
      perf_c: 0,
      perf_d: 1,
      perf_e: 1,

      // Taille & croissance du marché (10/10)
      taille_a: 1,
      taille_b: 1,
      taille_d: 1,
      taille_e: 1,
      taille_g: 1,
      taille_h: 1,
      taille_i: 1,

      // Traction (6/10) - différence avec Instagram
      traction_a: 1, // > 1000 users
      traction_b: 1, // croissance > 10%
      traction_c: 1, // rétention > 30%
      traction_d: 0, // NPS (pas d'info)
      traction_e: 0, // clients payants

      // Profil équipe (6/10) - différence avec Instagram
      profil_a: 1, // exp entrepreneuriale
      profil_b: 0, // expertise secteur limitée
      profil_c: 1, // gestion d'équipe
      profil_e: 1, // compétences variées
      profil_f: 1, // bonne collaboration
      profil_g: 0, // réseau moins solide

      // Avantage concurrentiel (6/10)
      avantage_a: 0,
      avantage_b: 1,
      avantage_c: 1,
      avantage_e: 1,
      avantage_f: 1,
      avantage_g: 0,
    },

    mesaScoreGlobal: 6.3,
    riskFreeRate: 0.03,
    riskPremium: 0.37,
    discountRate: 0.40,

    // Flux basés sur ARPU Facebook 2013 (6,32$) puis projection
    cashflows: [
      632_000_000,
      1_896_000_000,
      853_200_000,
      383_940_000,
      172_773_000,
      77_747_850,
      34_986_532.5,
    ],
    currencyUnit: "USD",
    filledYears: 7,
    publishedNpv: 1_875_420_332.72,
    npvUnit: "USD",

    notes: "Snapchat : années 1-2 calculées via ARPU Facebook 2013 (6,32$), années 3-7 projetées. Score MESA 6,3/10, taux d'actualisation 40%.",
  },

  saas_fr_serieA: {
    id: "saas_fr_serieA",
    displayName: "Startup SaaS française (anonyme, Série A)",
    shortLabel: "SaaS FR",
    description: "Startup française B2B/B2C en SaaS, levée de fonds Série A",
    logoLabel: "SF",
    color: "#0066FF",
    tags: ["B2B", "SaaS", "France"],
    stage: "serie_A_B",

    // Données exactes de l'Annexe 3 du mémoire
    // Scores bruts: Perf=8, Taille=6, Traction=6, Profil=4, Avantage=6
    // Avec pondérations Série A/B (0.15, 0.15, 0.20, 0.30, 0.20):
    // 8×0.15 + 6×0.15 + 6×0.20 + 4×0.30 + 6×0.20 = 1.20 + 0.90 + 1.20 + 1.20 + 1.20 = 5.70
    answers: {
      // Performances financières (8/10)
      perf_a: 1, // revenus sur 12 derniers mois
      perf_b: 1, // croissance ≥ 120% YoY
      perf_c: 0, // pas rentable
      perf_d: 1, // croissance ≥ 120% sur 3 ans
      perf_e: 1, // rentabilité soutenue sur 3 ans

      // Taille & croissance du marché (6/10)
      taille_a: 1, // marché > 1 Md$
      taille_b: 0, // croissance marché < 15%
      taille_d: 1, // segment identifié
      taille_e: 1, // tests / retours clients
      taille_g: 0, // pas alignée tendance majeure
      taille_h: 0, // pas de preuves tangibles fortes
      taille_i: 1, // potentiel international

      // Traction (6/10)
      traction_a: 1,
      traction_b: 1,
      traction_c: 0, // rétention pas > 30%
      traction_d: 0, // NPS inconnu
      traction_e: 1, // clients payants

      // Profil équipe (4/10)
      profil_a: 0, // pas d'exp entrepreneuriale
      profil_b: 0, // expertise secteur limitée
      profil_c: 1, // gestion d'équipe
      profil_e: 1, // compétences variées
      profil_f: 1, // bonne collaboration
      profil_g: 0, // réseau limité

      // Avantage concurrentiel (6/10)
      avantage_a: 0,
      avantage_b: 1,
      avantage_c: 1,
      avantage_e: 1,
      avantage_f: 1,
      avantage_g: 0,
    },

    mesaScoreGlobal: 5.7,
    riskFreeRate: 0.03,  // 3%
    riskPremium: 0.43,   // 43%
    discountRate: 0.46,  // 46%

    // IMPORTANT : Ne mettre QUE 4 années
    // Les années 5-7 seront projetées automatiquement par le moteur
    cashflows: [-105_000, -55_000, 285_000, 1_076_000],
    currencyUnit: "EUR",
    filledYears: 4,
    publishedNpv: 539_065.03,
    npvUnit: "EUR",

    notes: "Startup SaaS FR : flux réels années 1-4 du mémoire (-105k€, -55k€, 285k€, 1076k€). Années 5-7 projetées automatiquement par l'algorithme du mémoire. Score MESA 5,7/10 avec pondérations Série A/B, taux d'actualisation 46%.",
  },

  techmed: {
    id: "techmed",
    displayName: "TechMed – Startup fictive de télémédecine (exemple du mémoire)",
    shortLabel: "TechMed",
    description: "Startup fictive de télémédecine, exemple pédagogique du mémoire",
    logoLabel: "TM",
    color: "#00CC88",
    tags: ["HealthTech", "B2B2C", "Télémédecine"],
    stage: "serie_A_B",

    // Réponses calibrées pour obtenir 6,5/10 avec pondérations Série A/B
    // Pondérations: perf 15%, taille 15%, traction 20%, profil 30%, avantage 20%
    // Scores bruts: Perf=6, Taille=8, Traction=4, Profil=8, Avantage=6
    // 6×0.15 + 8×0.15 + 4×0.20 + 8×0.30 + 6×0.20 = 0.90 + 1.20 + 0.80 + 2.40 + 1.20 = 6.50
    answers: {
      // Performances (6/10)
      perf_a: 1,
      perf_b: 1,
      perf_c: 0,
      perf_d: 1,
      perf_e: 0,

      // Taille marché (8/10)
      taille_a: 1,
      taille_b: 1,
      taille_d: 1,
      taille_e: 1,
      taille_g: 1,
      taille_h: 0,
      taille_i: 1,

      // Traction (4/10)
      traction_a: 1,
      traction_b: 1,
      traction_c: 0,
      traction_d: 0,
      traction_e: 0,

      // Profil équipe (8/10)
      profil_a: 1,
      profil_b: 1,
      profil_c: 1,
      profil_e: 1,
      profil_f: 1,
      profil_g: 0,

      // Avantage (6/10)
      avantage_a: 0,
      avantage_b: 1,
      avantage_c: 1,
      avantage_e: 1,
      avantage_f: 1,
      avantage_g: 0,
    },

    mesaScoreGlobal: 6.5,
    riskFreeRate: 0.02, // 2%
    riskPremium: 0.35, // 35%
    discountRate: 0.37, // 37%

    // Flux explicites du mémoire (en milliers de dollars)
    cashflows: [100, 200, 400, 600, 1_000, 1_400, 2_000],
    currencyUnit: "kUSD",
    filledYears: 7,
    publishedNpv: 1_145.17,
    npvUnit: "kUSD",

    notes: "TechMed : exemple fictif du mémoire avec flux explicites sur 7 ans (en k$). Score MESA global 6,5/10 (prime 35%, taux sans risque 2%, taux d'actualisation 37%). VAN publiée : 1 145,17 k$.",
  },
};

/**
 * Type pour l'affichage des startups dans le carrousel (rétrocompatibilité)
 */
export interface StartupPreset {
  id: string;
  name: string;
  stage: string; // On garde string pour le moment pour rétrocompatibilité UI
  sector: string;
  logoLabel: string;
  logoUrl?: string;
  color: string;
  tags: string[];
  description?: string;
}

/**
 * Mapping des stages pour l'affichage
 */
const STAGE_DISPLAY_MAP: Record<MesaStage, string> = {
  pre_seed_seed: "Pre-seed / Seed",
  serie_A_B: "Série A / B",
  serie_C_plus: "Série C+",
};

/**
 * Labels pour les stades (pour affichage)
 */
export const STAGE_LABELS: Record<string, string> = {
  pre_seed_seed: "Pre-seed / Seed",
  serie_A_B: "Série A / B",
  serie_C_plus: "Série C+",
};

/**
 * Labels pour les unités de devise
 */
export const CURRENCY_LABELS: Record<CurrencyUnit, string> = {
  EUR: "€",
  USD: "$",
  kEUR: "k€",
  kUSD: "k$",
};

/**
 * Labels longs pour les unités de devise
 */
export const CURRENCY_LABELS_LONG: Record<CurrencyUnit, string> = {
  EUR: "euros",
  USD: "dollars",
  kEUR: "milliers d'euros",
  kUSD: "milliers de dollars",
};

/**
 * Liste de toutes les startups pour l'affichage dans le carrousel
 */
export const STARTUP_PRESETS: StartupPreset[] = Object.values(MESA_PRESETS).map((preset) => ({
  id: preset.id,
  name: preset.displayName,
  stage: STAGE_DISPLAY_MAP[preset.stage],
  sector: preset.tags[0] || "Tech",
  logoLabel: preset.logoLabel,
  logoUrl: preset.logoUrl,
  color: preset.color,
  tags: preset.tags,
  description: preset.description,
}));

/**
 * Trouve une startup par son ID (retourne le preset complet)
 */
export function getStartupById(id: string): MesaStartupPreset | undefined {
  return MESA_PRESETS[id];
}

/**
 * Applique un preset MESA + DCF au formulaire
 * @param presetId - ID de la startup
 * @param setFormValues - Fonction pour mettre à jour les valeurs du formulaire
 */
export function applyMesaPreset(
  presetId: string,
  setFormValues: (values: {
    stage?: "pre-seed" | "seed" | "série a" | "série b" | "série c ou plus";
    tauxSansRisque?: string;
    mesaAnswers?: Record<string, boolean>;
    cashflows?: string[];
    currencyUnit?: CurrencyUnit;
  }) => void
): void {
  const preset = MESA_PRESETS[presetId];
  if (!preset) {
    console.warn(`Preset non trouvé pour l'ID: ${presetId}`);
    return;
  }

  // Convertir les réponses MESA de 0/1 vers boolean pour le formulaire
  const mesaAnswersBoolean: Record<string, boolean> = {};
  Object.entries(preset.answers).forEach(([key, value]) => {
    mesaAnswersBoolean[key] = value === 1;
  });

  // Convertir les cashflows en strings pour le formulaire (remplir jusqu'à 7 ans)
  const cashflowsArray: string[] = [...Array(7)].map((_, idx) => {
    const value = preset.cashflows?.[idx];
    return value !== undefined ? String(value) : "";
  });

  // Taux sans risque en pourcentage
  const tauxSansRisqueStr = String(preset.riskFreeRate * 100);

  // Convertir le stage du mémoire vers le format UI
  const stageForForm = mapMesaStageToUIStage(preset.stage);

  setFormValues({
    stage: stageForForm,
    tauxSansRisque: tauxSansRisqueStr,
    mesaAnswers: mesaAnswersBoolean,
    cashflows: cashflowsArray,
    currencyUnit: preset.currencyUnit,
  });
}

/**
 * Convertit un stage du mémoire (format interne) vers le format UI
 */
function mapMesaStageToUIStage(
  mesaStage: MesaStage
): "pre-seed" | "seed" | "série a" | "série b" | "série c ou plus" {
  switch (mesaStage) {
    case "pre_seed_seed":
      return "seed"; // ou "pre-seed"
    case "serie_A_B":
      return "série a"; // les pondérations série A/B sont les mêmes
    case "serie_C_plus":
      return "série c ou plus";
    default:
      return "série a";
  }
}
