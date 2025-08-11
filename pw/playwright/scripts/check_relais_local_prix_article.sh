#!/bin/bash
#
# @desc   : Juste après la fermeture ou l'ouverture d'un article en caisse, s'assure que les données ont bien été transmises au Relais Local.
#           Doit être exécuté dans la minute du lancement de traitement (Recherche fichier horodaté).
#
# @param1 : Le code article qui doit se trouver dans les fichiers transmis au relai local
#           
# @param2 : Le prix de l'article qui doit se trouver dans les fichiers transmis au relai local
#
# @param3 : Le temps d'attente afin que le fichier generé soit sur le relai local
#
# version 3.4

CODE_ARTICLE=$1
PRIX_ARTICLE=$2
TEMPS_ATTENTE=$3

sleep ${TEMPS_ATTENTE} # Attendre que que le fichier generé soit sur le relai local

# Correspond à la maquette Fresh. 
HOST="F999SM.prosol.pri"    
USER="prosol"
PASSWD="prosat"

# Mise au bon format de la donnée si nécessaire
PRIX_ARTICLE=$(echo ${PRIX_ARTICLE} | sed 's/,/;/g')

echo "Prix remplacé $PRIX_ARTICLE "

MOIS_JOUR=$(date +"%m%d.%H")
NOM_FICHIER="999CR1${MOIS_JOUR}*.csv"
LOCAL_PATH="c:\\pw\\playwright\\_data\\_downloads"
REMOTE_PATH="Archivage"
iStatut=0 # Par défaut le Test est OK
PREF=";"
SUF=";"
PRIX_CONCAT=${PREF}${PRIX_ARTICLE}${SUF} 
LINE_FILE=fichierInter.csv  # Fichier tempoiraire pour vérifier la présence des code et prix article dans chaque ligne du fichier

ftp -n -v $HOST <<EOT
user $USER $PASSWD
prompt
lcd ${LOCAL_PATH}
mget ${NOM_FICHIER}
EOT

echo "";
echo "|--[ Examen Fichiers Déposés sur Relais Local ]----------------------------------"
echo "| Host : ${HOST}";
echo "| Code Article Cible : ${CODE_ARTICLE}";
echo "| Prix Article Cible : ${PRIX_ARTICLE}";
echo "| Masque Fichier  : ${NOM_FICHIER}";
echo "| Repertoire Local : ${LOCAL_PATH}";
echo "| Listing Rep Local :";
ls ${LOCAL_PATH}

# Recheche en se basant sur la date de création du fichier infructueuse avec le wild car *
# lastFileName=`ls -Art  ${LOCAL_PATH}/${NOM_FICHIER} | tail -n 1`;

echo "";
echo "Recherche nom fichier contenant : 999CR1${MOIS_JOUR}"
lastFileName=`ls -Art  ${LOCAL_PATH} | grep 999CR1${MOIS_JOUR}`;
echo "Nom fichier -G ${nomFichier}"
echo "| Candidat : ${lastFileName}";

if [[ $lastFileName == '' ]]
then
    echo "| ### Fichier Introuvable : ${NOM_FICHIER} ###";
    exit 1
else 
	echo "| ### Fichier Trouvé : ${lastFileName} ";
fi

iCpt=0
while IFS= read -r line; do
	echo $line >> ${LINE_FILE}
    nbFoundArt=`awk -F "${CODE_ARTICLE}" 'NF>0 { count += NF-1 } END { print 0+count }' ${LINE_FILE}`
	echo "> Ligne #${line} | Recherche Code Article : '${CODE_ARTICLE}' => ${LINE_FILE}"
	nbFoundPrix=`awk -F "${PRIX_CONCAT}" 'NF>0 { count += NF-1 } END { print 0+count }' ${LINE_FILE}`
	echo "> Ligne #${line} | Recherche Prix : '${PRIX_CONCAT}' => ${LINE_FILE}"
	echo " " > ${LINE_FILE}
	if [[ $nbFoundArt -gt 0 && $nbFoundPrix -gt 0 ]]
	then 
		((iCpt=iCpt+1))
		echo "Position $iCpt"
	fi
	echo $line
done < "${LOCAL_PATH}\\${lastFileName}"

# echo "| Nombre de lignes trouvées qui contient à la fois le code, le prix et le prix Moyen de l'article : ${iCpt}"
echo "| Nombre de lignes trouvées qui contiennent à la fois le code, le prix de l'article : ${iCpt}"

if [[ $iCpt -gt 1 ]]
then
	echo "| ${iCpt} Codes Articles Trouvés dans le fichier : ${lastFileName} (attendu 1) [OK]"
elif [[ $iCpt -gt 0 ]]
then
	echo "| ${iCpt} Code Article et prix de l'article Trouvés dans le fichier : ${lastFileName} [OK]"
else
	echo "| Code Article '${CODE_ARTICLE}' et/ou Prix Article '${PRIX_ARTICLE}' Absent du fichier : ${lastFileName} (attendu 2) [ko]"
	iStatut=1
fi

# echo "Suppression du fichier : ${LOCAL_PATH}\\${lastFileName}";
# rm "${LOCAL_PATH}\\${lastFileName}";

if [[ $iStatut == 1 ]]
then
	exit ${iStatut}
fi