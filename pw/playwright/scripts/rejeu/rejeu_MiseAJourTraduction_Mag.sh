#!/bin/bash

# @desc : Déclenche la mise à jour des données traduites dans TRADUCTION
#
# @see TRA_MAG_MAJ
#
# @author JC CALVIERA
# @version 1.0
#

echo "Lancement Traitement : Sigale - Magasin : MiseAJourTraduction_Mag"
curl --data-urlencode "NomEchange=MiseAJourTraduction_Mag" --data-urlencode "Donnees=AutomatedTesting" http://esb1.int.sigale.prosol.pri:9092 -w "@/opt/TA/data/curl_time_spent_format.txt" -o /dev/null
echo ""
echo "-- Fin Traitement --"
echo ""
exit 0