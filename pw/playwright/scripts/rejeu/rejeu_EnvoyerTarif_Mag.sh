#!/bin/bash

# @desc : Envoi au WS chargé d'exporter les tarifs de PRICING vers le magasin {VILLE} pour la date du jour
# récupère les temps de traitement.
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/{xxx}.xml
# Stocké initialement dans  /_data/tarifs/
#
#
# @param {string} Le code du lieu de vente du magasin (Ex : 211PO)
# @param {string} Le rayon (Ex : PO)
# @param {string} Le nom du lieu de vente du magasin (Ex : Albi)
#
# @see Test XXX_XXX_XXX
#
# @author JOSAS SIE 
# @version 3.0
# @since 2024-06-05
#

# Paramètres optionnels passés en argument
VILLE="$1"
RAYON="$2"
ABREVIATION="$3"

# Détermination des dates du jour J, J+1 et J+2
aujourdhui=`date '+%s'`
veille=$((`date -d "1 day ago" "+%s"`))

# Mise des dates au format attendu
sVeille="${veille:0:4}-${veille:4:2}-${veille:6:2}"

# Chemins     
sTemplatePath="c:\\pw\\playwright\\_data\\tarifs\\"
sPath="/opt/reports/archives/data/"

# Liste des fichiers (templates) de référence
declare -A aTemplateFile

aTemplateFile[FL]="tarifs_FL.xml"
aTemplateFile[PO]="tarifs_PO.xml"

# Traitement du cas ou le paramètre {RAYON} est omis
if [[ $RAYON != '' ]]
then
    rayonCible=$RAYON;
else
    rayonCible="FL"; # Fruits & Légumes
fi

# Traitement du cas ou le paramètre {VILLE} est omis
if [[ $VILLE != '' ]]
then
    villeCible=$VILLE;
else
    villeCible="211"; # Albi par défaut
fi

# Traitement du cas ou le paramètre {ABREVIATION} est omis
if [[ $ABREVIATION != '' ]]
then
    abreviation=$ABREVIATION;
else
    abreviation="Albi"; # Albi par défaut
fi

# Nom des fichiers exploités
sTemplateFile=${aTemplateFile[$rayonCible]}
sTempFile=`date '+%s'.xml`

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sTemplateFile} ${sPath}${sTempFile}

echo --[ Integration Tarifs ]--------------------------------------------------------
echo "VILLE       = ${villeCible}"
echo "RAYON       = ${rayonCible}"
echo "ABREVIATION = ${abreviation}"
echo "TEMPLATE    = ${sTemplatePath}${sTemplateFile}"
echo "TEMP FILE   = ${sPath}${sTempFile}"
echo "DATE JOUR   = ${aujourdhui}"
echo "DATE VEILLE = ${sVeille}"
echo ""

# Code Magasin : Substitution chaîne ToChangeMagasin par ${villeCible}
sed -i "s/ToChangeMagasin/${villeCible}/g" ${sPath}${sTempFile}

# Date Réception : Substitution chaîne ToChangeDateApplicabilite par ${aujourdhui}
sed -i "s/ToChangeDateApplicabilite/${aujourdhui}/g" ${sPath}${sTempFile}

# Date Expédition : Substitution chaîne ToChangeDateExpedition par ${veille}
sed -i "s/ToChangeDateExpedition/${veille}/g" ${sPath}${sTempFile}

# Date Expédition : Substitution chaîne ToChangeAbreviation par ${abreviation}
sed -i "s/ToChangeAbreviation/${abreviation}/g" ${sPath}${sTempFile}

echo "-- ENTETE ---------------------------";

head -n 8 ${sPath}${sTempFile}

echo "-------------------------------------";
echo ""

# Injection des données sources modifiées dans un parametre
data=$(<${sPath}${sTempFile})

# Lancement du traitement sur ACHAT (Flux : Sigale - Achat : EnvoyerCommande_Achat)
echo "Lancement Traitement : Sigale - Magasin : EnvoyerTarif_Mag"
curl --data-urlencode "NomEchange=EnvoyerTarif_Mag" --data-urlencode "Donnees=${data}" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null 

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sTempFile}";
rm ${sPath}${sTempFile}

echo "-- Fin Traitement --"
echo ""