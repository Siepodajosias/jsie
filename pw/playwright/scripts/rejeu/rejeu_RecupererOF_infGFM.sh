#!/bin/bash

# @desc : Pousse un OF issue d'Informia GFM et lance son intégration immédiate
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/
# Stocké initialement dans  /_data/OF_infGFM
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
HOST='int-informia'
USER="ftp_gfm_int"
PASSWD="B4mKSwR"

# Chemins
sTemplatePath="c:\\pw\\playwright\\_data\\OF_infGFM\\"
sPath="/opt/reports/archives/data/"
REMOTEPATH='/ECHANGES/OUT/OF'

# Nom des fichiers exploités
sIniFile="OF_125622_M04O_006547_1544437713005.csv"
sDestFile="OF_125622_M04O_006547_${TIMESTAMP}.csv"

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sIniFile} ${sDestFile}

echo --[ Recuperation OF GFM ]--------------------------------------------------------
echo "DATE JOUR  = ${aujourdhui}"
echo ""

# Date Réception : Substitution chaîne RRRR par ${aujourdhui}
sed -i "s/ToChangeDateOF/${aujourdhui}/g" ${sDestFile}

echo "-- ENTETE ---------------------------";

head -n 7 ${sDestFile}

echo "-- FTP ------------------------------";
echo "Host : $HOST"
echo "Export de : ${sDestFile}"
echo "Export vers : ${REMOTEPATH}"

ftp -n $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
cd $REMOTEPATH
put  $sDestFile
quit
END_SCRIPT

echo "Lancement Traitement : Sigale - Achat : RecupererOF_InfGFM"
# Lancement du traitement sur ACHAT (Flux : Sigale - Achat : RecupererOF_InfGFM)
curl --data-urlencode "NomEchange=RecupererOF_InfGFM" --data-urlencode "Donnees=AutomatedTesting" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sDestFile}";
#rm ${sDestFile}

echo ""
echo "-- Fin Traitement --"
echo ""
exit 0