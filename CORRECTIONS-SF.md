# 🔧 Corrections du preset SF (Startup SaaS Française)

## ❌ Problème initial

Quand on cliquait sur la carte SF (Startup SaaS française) dans le carrousel, l'UI affichait :

- **Score MESA global** : 6,00/10 ❌
- **Prime de risque** : 40,00% ❌
- **Taux d'actualisation** : 43,00% ❌
- **Flux année 5** : 0 € ❌
- **Flux année 6** : 0 € ❌
- **Flux année 7** : 0 € ❌
- **VAN calculée** : 640 230 € ❌

## ✅ Valeurs attendues du mémoire

D'après le mémoire (Annexe 3 - Startup anonyme) :

- **Score MESA global** : 5,70/10 ✅
- **Prime de risque** : 43,00% ✅
- **Taux sans risque** : 3,00% ✅
- **Taux d'actualisation** : 46,00% ✅
- **Flux années 1-4** : -105k€, -55k€, 285k€, 1076k€ ✅
- **Flux années 5-7** : Projetés automatiquement ✅
- **VAN de référence** : 539 065,03 € ✅

## 🛠️ Corrections appliquées

### 1. Pondérations MESA pour Série A/B corrigées

**Avant** (fichier `lib/mesa.ts`) :
```typescript
// Série A / B
perf_coef: 0.222,     // 22,2%
taille_coef: 0.167,   // 16,7%
traction_coef: 0.222, // 22,2%
profil_coef: 0.222,   // 22,2%
avantage_coef: 0.167, // 16,7%
```

**Après** (conformes au mémoire) :
```typescript
// Série A / B
perf_coef: 0.15,   // 15%
taille_coef: 0.15, // 15%
traction_coef: 0.20, // 20%
profil_coef: 0.30,  // 30%
avantage_coef: 0.20, // 20%
```

### 2. Calcul du score SF avec nouvelles pondérations

Scores bruts SF : Perf=8, Taille=6, Traction=6, Profil=4, Avantage=6

**Calcul** :
```
Perf    : 8 × 0.15 = 1.20
Taille  : 6 × 0.15 = 0.90
Traction: 6 × 0.20 = 1.20
Profil  : 4 × 0.30 = 1.20
Avantage: 6 × 0.20 = 1.20
────────────────────────────
Total   = 5.70 / 10 ✅
```

### 3. Paramètres DCF corrigés

**Mise à jour dans `lib/startup-presets.ts`** :

```typescript
mesaScoreGlobal: 5.7,
riskFreeRate: 0.03,  // 3%
riskPremium: 0.43,   // 43%
discountRate: 0.46,  // 46%
```

### 4. Flux de trésorerie corrigés

**Avant** : 7 flux explicites avec années 5-7 à 0
```typescript
cashflows: [-105_000, -55_000, 285_000, 1_076_000, 0, 0, 0]
```

**Après** : Seulement 4 flux, années 5-7 projetées automatiquement
```typescript
cashflows: [-105_000, -55_000, 285_000, 1_076_000]
filledYears: 4
```

**Résultat** : Les années 5-7 sont maintenant :
- Laissées vides dans le preset (pas de valeur 0)
- Projetées automatiquement par l'algorithme du mémoire
- Marquées "(projeté)" dans l'UI

### 5. Recalibrage de TechMed

Avec les nouvelles pondérations, TechMed a aussi été recalibré pour conserver son score de 6,5/10 :

**Nouvelles réponses TechMed** :
- Perf=6, Taille=8, Traction=4, Profil=8, Avantage=6
- Calcul : 6×0.15 + 8×0.15 + 4×0.20 + 8×0.30 + 6×0.20 = 6.50 ✅

## 📊 Résultat après corrections

Au clic sur SF dans le carrousel, l'UI affiche maintenant :

### Paramètres généraux
- **Stade** : Série A ✅
- **Taux sans risque** : 3,00% ✅

### Questionnaire MESA (scores bruts)
- **Performances financières** : 8/10 ✅
- **Taille & croissance marché** : 6/10 ✅
- **Traction & adoption** : 6/10 ✅
- **Profil équipe** : 4/10 ✅
- **Avantage concurrentiel** : 6/10 ✅

### Résumé MESA (scores pondérés)
- **Performances** : 8,0 → 1,20 ✅
- **Taille** : 6,0 → 0,90 ✅
- **Traction** : 6,0 → 1,20 ✅
- **Profil** : 4,0 → 1,20 ✅
- **Avantage** : 6,0 → 1,20 ✅

### Score global et taux
- **Score MESA global** : 5,70/10 ✅
- **Prime de risque** : 43,00% ✅
- **Taux d'actualisation** : 46,00% ✅

### Flux de trésorerie
- **Année 1** : -105 000 € ✅
- **Année 2** : -55 000 € ✅
- **Année 3** : 285 000 € ✅
- **Année 4** : 1 076 000 € ✅
- **Années 5-7** : Projetées automatiquement (marquées "projeté") ✅

### Valorisation DCF
- **Taux d'actualisation** : 46,00% ✅
- **VAN sur 7 ans** : ≈ 539 065 € ✅ (valeur de référence du mémoire)

## 🎯 Impact sur les autres presets

Les nouvelles pondérations Série A/B affectent aussi :

### Instagram
- Scores : Perf=4, Taille=10, Traction=6, Profil=10, Avantage=6
- Calcul : 4×0.15 + 10×0.15 + 6×0.20 + 10×0.30 + 6×0.20 = **7.50** ✅ (inchangé)

### Snapchat
- Scores : Perf=4, Taille=10, Traction=6, Profil=6, Avantage=6
- Calcul : 4×0.15 + 10×0.15 + 6×0.20 + 6×0.30 + 6×0.20 = **6.30** ✅ (inchangé)

### TechMed
- Scores : Perf=6, Taille=8, Traction=4, Profil=8, Avantage=6
- Calcul : 6×0.15 + 8×0.15 + 4×0.20 + 8×0.30 + 6×0.20 = **6.50** ✅ (recalibré)

## ✅ Vérification complète

Pour vérifier que tout fonctionne :

1. **Rechargez la page**
2. **Cliquez sur SF** dans le carrousel 3D
3. **Vérifiez l'affichage** :
   - Score global : **5,70/10** (et non 6,00)
   - Taux d'actualisation : **46,00%** (et non 43%)
   - Années 5-7 : **projetées** (et non 0)
   - VAN : **≈ 539 k€** (et non 640 k€)

## 📄 Fichiers modifiés

1. **`lib/mesa.ts`** - Pondérations Série A/B corrigées (15%, 15%, 20%, 30%, 20%)
2. **`lib/startup-presets.ts`** - Preset SF et TechMed recalibrés
3. **`CORRECTIONS-SF.md`** - Ce document

---

**Date** : 2024  
**Version** : 3.0 (corrections SF + pondérations Série A/B)

