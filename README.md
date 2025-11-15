# Simulateur MESA + DCF

Interface web interactive de simulation de valorisation de startup basée sur la méthode **MESA + DCF**.

## 🚀 Fonctionnalités

- **Questionnaire MESA** : 5 catégories de scoring (Performances, Taille du marché, Traction, Profil équipe, Avantage concurrentiel)
- **Pondération par stade** : Pre-seed, Seed, Série A, Série B, Série C+
- **Calcul automatique** : Score MESA, prime de risque, taux d'actualisation
- **Projection de flux** : Complétion automatique des flux de trésorerie jusqu'à 7 ans
- **Valorisation DCF** : Calcul de la Valeur Actuelle Nette (VAN)

## 🛠️ Technologies

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (composants UI)

## 📦 Installation

```bash
npm install
```

## 🏃 Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Build

```bash
npm run build
npm start
```

## 📋 Utilisation

1. **Sélectionnez le stade** de la startup (Pre-seed, Seed, Série A, etc.)
2. **Indiquez le taux sans risque** (en pourcentage, ex: 3)
3. **Répondez aux questions MESA** en cochant les cases correspondantes
4. **Saisissez les flux de trésorerie** (au moins 1 année, jusqu'à 7)
5. Les **résultats s'affichent automatiquement** en temps réel :
   - Score MESA par catégorie (brut et pondéré)
   - Score MESA global
   - Prime de risque et taux d'actualisation
   - Valorisation DCF (VAN)

## 📁 Structure

```
├── app/
│   ├── page.tsx          # Page principale du simulateur
│   ├── layout.tsx         # Layout Next.js
│   └── globals.css        # Styles globaux + variables shadcn/ui
├── components/
│   └── ui/                # Composants shadcn/ui
├── lib/
│   ├── mesa.ts            # Logique métier MESA + DCF (fonctions pures)
│   └── utils.ts           # Utilitaires (cn, etc.)
└── components.json        # Configuration shadcn/ui
```

## 🧮 Logique métier

Toute la logique de calcul est isolée dans `lib/mesa.ts` :

- `computeCategoryRawScore()` : Calcul du score brut d'une catégorie
- `computeMesaScore()` : Calcul du score MESA pondéré
- `computeRiskPremium()` : Calcul de la prime de risque
- `projectCashflows()` : Projection automatique des flux
- `computeNPV()` : Calcul de la Valeur Actuelle Nette (DCF)

## 📝 Notes

- Tous les calculs sont effectués **côté client** (aucune API)
- Les données ne sont **pas persistées**
- Interface entièrement en **français**
- Design **responsive** (desktop et mobile)

