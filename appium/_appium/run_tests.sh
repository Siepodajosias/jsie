#!/bin/bash

# === CONFIGURATION ===
TEST_DIR="tests"                              # Dossier contenant tes tests
RESULT_DIR="reports/allure-results"           # Où stocker les résultats Allure
REPORT_DIR="reports/allure-report"            # Où générer le rapport HTML

# === ÉTAPE 1 : Nettoyer les anciens rapports ===
echo "🧹 Nettoyage des anciens résultats..."
rm -rf "$RESULT_DIR" "$REPORT_DIR"
mkdir -p "$RESULT_DIR"

# === ÉTAPE 2 : Exécution des tests Pytest avec Allure ===
echo "🚀 Lancement des tests avec Pytest..."
pytest "$TEST_DIR" --alluredir="$RESULT_DIR" -s

# Vérification que des résultats ont été générés
if [ -z "$(ls -A $RESULT_DIR 2>/dev/null)" ]; then
  echo "❌ Aucun résultat trouvé dans $RESULT_DIR. Vérifie ton code et que allure-pytest est bien installé."
  exit 1
fi

# === ÉTAPE 3 : Génération du rapport Allure ===
echo "📊 Génération du rapport Allure..."
allure generate "$RESULT_DIR" -o "$REPORT_DIR" --clean

# === ÉTAPE 4 : Ouverture du rapport ===
echo "🌐 Ouverture du rapport dans le navigateur..."
allure open "$REPORT_DIR"