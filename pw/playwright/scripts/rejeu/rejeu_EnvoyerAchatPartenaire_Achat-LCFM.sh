#!/bin/bash

# @desc : Intègre dans Sigale ACHAT un JDD d'achats validés et confirmés relatifs à LCFM (La Compagnie des Fruits Murs)
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/
# Stocké initialement dans  /_data/achats_partenaire_lcfm
#
# @see Test ********
#
# @author JOSIAS SIE
# @version 3.0
# @since 2024-06-05
#

# Paramètres optionnels passés en argument
ENVIRONNEMENT="$1"

# Détermination des dates du jour
aujourdhui=`date '+%Y%m%d'`
#refBl=$(cat /dev/urandom | tr -dc '1-9' | fold -w 5 | head -n 1)
refBl="98888"
TIMESTAMP=`date '+%s'`

# Chemins    
sTemplatePath="c:\\pw\\playwright\\_data\\achats_partenaire_lcfm\\"
sPath="/opt/reports/archives/data/"

# Liste des URL de l'ESB en fonction des environnements
declare -A aESB

aESB[integration]="esb1.int.sigale.prosol.pri:9092"
aESB[julien]="p0969:9092"
aESB[integration2]="esb1.int2.sigale.prosol.pri:9092"
aESB[fab]="esb1.fab.sigale.prosol.pri:9091"

# Traitement du cas ou le paramètre {ENVIRONNEMENT} est omis
if [[ $ENVIRONNEMENT != '' ]]
then
    environnementCible=$ENVIRONNEMENT;
else
    environnementCible="integration"; # INT par défaut
fi

# Nom des fichiers exploités
sIniFile="EnvoyerAchatPartenaire_Achat-LCFM.xml"
sDestFile="EnvoyerAchatPartenaire_Achat-LCFM-${TIMESTAMP}.xml"

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sIniFile} ${sDestFile}

echo --[ Envoi Achats Confirmes LCFM ]--------------------------------------------------------
echo "DATE JOUR  = ${aujourdhui}"
echo "Num BL  = ${refBl}"
echo "ESB Cible  = ${aESB[$environnementCible]}"
echo ""

# Date Expédition : Substitution chaîne 'dateToChange' par ${aujourdhui}
sed -i "s/DateToChange/${TIMESTAMP}/g" ${sDestFile}
# Numéro BL : Substitution chaîne 'dateToChange' par ${refBl}
sed -i "s/BlToChange/${refBl}/g" ${sDestFile}

echo "-- ENTETE ---------------------------";

head -n 7 ${sDestFile}

echo "-------------------------------------";

echo "Lancement Traitement : Sigale - Achat : EnvoyerAchatPartenaire_Achat"
# Lancement du traitement sur ACHAT (Flux : Sigale - Achat : EnvoyerAchatPartenaire_Achat)
curl -X PUT --data-urlencode "NomEchange=EnvoyerAchatPartenaire_Achat" --data-urlencode "Donnees@${sDestFile}" http://${aESB[$environnementCible]} -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sDestFile}";
#rm ${sDestFile}

echo ""
echo "-- Fin Traitement --"
echo ""
exit 0