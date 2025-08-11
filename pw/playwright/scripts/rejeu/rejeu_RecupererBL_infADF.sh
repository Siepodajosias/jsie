#!/bin/bash

# @desc : Récupère les BL issus d'Informia ADF et lance leur intégration immédiate
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/
# Stocké initialement dans  /_data/BL_infADF
#
# @see Test ********
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
sTemplatePath="c:\\pw\\playwright\\_data\\BL_infADF\\"
sPath="/opt/reports/archives/data/"
REMOTEPATH='/ECHANGES/OUT/BL'

# Nom des fichiers exploités
sIniFile="BL_821_1544619669316.csv"
sDestFile="BL_821__${TIMESTAMP}.csv"

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sIniFile} ${sDestFile}

echo --[ Recuperation OF GFM ]--------------------------------------------------------
echo "DATE JOUR  = ${aujourdhui}"
echo ""

# Date Réception : Substitution chaîne dateToChangeX par ${aujourdhui}
sed -i "s/dateToChange1/${aujourdhui}/g" ${sDestFile}
sed -i "s/dateToChange2/${aujourdhui}/g" ${sDestFile}

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
curl --data-urlencode "NomEchange=RecupererBL_InfADF" --data-urlencode "Donnees=AutomatedTesting" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sDestFile}";
#rm ${sDestFile}

echo ""
echo "-- Fin Traitement --"
echo ""
exit 0