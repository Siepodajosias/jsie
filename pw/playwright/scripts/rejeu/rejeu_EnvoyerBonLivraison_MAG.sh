#!/bin/bash

# @desc : Pousse un OF issue d'Informia GFM et lance son intégration immédiate
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/
# Stocké initialement dans  /_data/BL
#
# @see Test ACH_INF_AAC
#
# @author JOSIAS SIE
# @version 3.0
# @since 2024-06-05
#

# Détermination des dates du jour
aujourdhui=`date '+%Y%m%d'`
TIMESTAMP=`date '+%s'`

# Chemins 
sTemplatePath="c:\\pw\\playwright\\_data\\BL\\"
sPath="/opt/reports/archives/data/"

# Nom des fichiers exploités
sIniFile="bl.xml"
sDestFile="BL_${TIMESTAMP}.xml"

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sIniFile} ${sDestFile}

echo --[ Recuperation OF GFM ]--------------------------------------------------------
echo "DATE JOUR  = ${aujourdhui}"
echo ""

# Date Réception : Substitution chaîne RRRR par ${TIMESTAMP}
sed -i "s/DateToChange/${TIMESTAMP}/g" ${sDestFile}

echo "-- ENTETE ---------------------------";

head -n 7 ${sDestFile}

echo "-------------------------------------";

echo "Lancement Traitement : Sigale - Magasin : EnvoyerBonLivraison_MAG"
curl --data-urlencode "NomEchange=EnvoyerBonLivraison_Mag" --data-urlencode "Donnees@${sDestFile}" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sDestFile}";
#rm ${sDestFile}

echo ""
echo "-- Fin Traitement --"
echo ""
exit 0