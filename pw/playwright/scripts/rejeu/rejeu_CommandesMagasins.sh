#!/bin/bash

# @desc : Envoi au WS chargé d'intégrer les commandes du jour pour le magasin {VILLE} et
# récupère les temps de traitement.
#
# Fichier de données servant de template à placer dans : /opt/reports/archives/data/{xxx}.xml
# Stocké initialement dans  /_data/commandes_magasins
#
#
# @param {integer} Le lieu de vente du magasin
#
# @see Test XXX_XXX_XXX
#
# @author JOSIAS SIE
# @version 3.0
# @since 2024-06-05
#

# Paramètres optionnels passés en argument
VILLE="$1"
RAYON="$2"

# Détermination des dates du jour J, J+1,t J+2 et J+3
aujourdhui=`date '+%Y-%m-%d'`
lendemain=$((`date -d "1 day" "+%Y%m%d"`))
surlendemain=$((`date -d "2 day" "+%Y%m%d"`))
jplustrois=$((`date -d "3 day" "+%Y%m%d"`))

# Mise des dates au format attendu
sLendemain="${lendemain:0:4}-${lendemain:4:2}-${lendemain:6:2}"
sSurLendemain="${surlendemain:0:4}-${surlendemain:4:2}-${surlendemain:6:2}"
sJplusTrois="${jplustrois:0:4}-${jplustrois:4:2}-${jplustrois:6:2}"

# Chemins     
sTemplatePath="c:\\pw\\playwright\\_data\\commandes_magasins\\"
sPath="/opt/reports/archives/data/"

# Liste des fichiers (templates) de référence
declare -A aTemplateFile

aTemplateFile[FEL]="Diffuser_Commande-FruitsEtLegumes.xml"      # 00
aTemplateFile[FLD]="Diffuser_Commande-FruitsEtLegumes-FD.xml"   # 01
aTemplateFile[POT]="Diffuser_Commande-Poissonnerie-TDLM.xml"    # 02
aTemplateFile[POB]="Diffuser_Commande-Poissonnerie-BM.xml"      # 03
aTemplateFile[POC]="Diffuser_Commande-Poissonnerie-CD.xml"      # 04
aTemplateFile[CCL]="Diffuser_Commande-Cremerie-LS.xml"          # 05
aTemplateFile[CCF]="Diffuser_Commande-Cremerie-UF.xml"          # 05
aTemplateFile[CCC]="Diffuser_Commande-Cremerie-CC.xml"          # 06
aTemplateFile[FGV]="Diffuser_Commande-FraisGeneraux-VC.xml"     # 15
aTemplateFile[BCV]="Diffuser_Commande-Boucherie-VL.xml"         # 30

# Traitement du cas ou le paramètre {RAYON} est omis
if [[ $RAYON != '' ]]
then
    rayonCible=$RAYON;
else
    rayonCible="FEL"; # Fruits & Légumes
fi

# Traitement du cas ou le paramètre {VILLE} est omis
if [[ $VILLE != '' ]]
then
    villeCible=$VILLE;
else
    villeCible="211"; # Albi par défaut
fi

# Nom des fichiers exploités
sTemplateFile=${aTemplateFile[$rayonCible]}
sTempFile=`date '+%s'.xml`

# Creation d'un fichier temporaire
cp ${sTemplatePath}${sTemplateFile} ${sPath}${sTempFile}

echo --[ Integration Commandes ]--------------------------------------------------------
echo "VILLE      = ${villeCible}"
echo "RAYON      = ${rayonCible}"
echo "TEMPLATE   = ${sTemplatePath}${sTemplateFile}"
echo "TEMP FILE  = ${sPath}${sTempFile}"
echo "DATE JOUR  = ${aujourdhui}"
echo "DATE + 1   = ${sLendemain}"
echo "DATE + 2   = ${sSurLendemain}"
echo "DATE + 3   = ${sJplusTrois}"
echo ""

# Exemple :
#   <codeMagasin>187CR</codeMagasin>                                    <-- lieu de Vente (Magasin)
#   <dateReception>2020-11-23</dateReception>                           <-- J
#   <dateLivraison>2020-11-25</dateLivraison>                           <-- J+2
#   <dateExpedition>2020-11-24</dateExpedition>                         <-- J+1
#   <dateLivraisonPrevision>2020-11-26</dateLivraisonPrevision>         <-- J+3
#   <dateExpeditionPrevision>2020-11-25</dateExpeditionPrevision>       <-- J+1
#
#   <codeMagasin>ToChangeMagasinCR</codeMagasin>
#   <dateReception>ToChangeDateReception</dateReception>
#   <dateLivraison>ToChangeDateLivraison</dateLivraison>
#   <dateExpedition>ToChangeDateReelExpedition</dateExpedition>
#   <dateLivraisonPrevision>ToChangeDatelivraisonPrevision</dateLivraisonPrevision>
#   <dateExpeditionPrevision>ToChangeDateExpeditionPrevision</dateExpeditionPrevision>

# Code Magasin : Substitution chaîne "ToChangeMagasin" par ${villeCible}
sed -i "s/ToChangeMagasin/${villeCible}/g" ${sPath}${sTempFile}

# Date Réception : Substitution chaîne "ToChangeDateReception" par ${aujourdhui}
sed -i "s/ToChangeDateReception/${aujourdhui}/g" ${sPath}${sTempFile}

# Date Expédition Prévision : Substitution chaîne "ToChangeDateLivraison" par ${sSurLendemain}
sed -i "s/ToChangeDateLivraison/${sSurLendemain}/g" ${sPath}${sTempFile}

# Date Expédition : Substitution chaîne "ToChangeDateReelExpedition" par ${lendemain}
sed -i "s/ToChangeDateReelExpedition/${sLendemain}/g" ${sPath}${sTempFile}

# Date Expédition Prévision : Substitution chaîne "ToChangeDatelivraisonPrevision" par ${sJplusTrois}
sed -i "s/ToChangeDatelivraisonPrevision/${sJplusTrois}/g" ${sPath}${sTempFile}

# Date Expédition Prévision : Substitution chaîne "ToChangeDateExpeditionPrevision" par ${surlendemain}
sed -i "s/ToChangeDateExpeditionPrevision/${sSurLendemain}/g" ${sPath}${sTempFile}



echo "-- ENTETE ---------------------------";

head -n 10 ${sPath}${sTempFile}

echo "-------------------------------------";
echo ""

# Injection des données sources modifiées dans un parametre
data=$(<${sPath}${sTempFile})

# Lancement du traitement sur ACHAT (Flux : Sigale - Achat : EnvoyerCommande_Achat)
curl --data-urlencode "NomEchange=Diffuser_Commande" --data-urlencode "Donnees=${data}" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null 

# Suppression du fichier temporaire
echo "Suppression Fichier temp : ${sTempFile}";
rm ${sPath}${sTempFile}

echo "-- Fin Traitement --"
echo ""