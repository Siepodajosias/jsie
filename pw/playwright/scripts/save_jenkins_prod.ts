const path = require("path");
const fs   = require("fs");

let today = new Date();

const directoryPath = "D:/Reports/TA/jobs";
const saveDirPath 	= "D:\\save\\Jobs-Jenkins\\" + today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2);
const filetToSave = 'config.xml';

/**
 * Fonction récursive pour lister les fichiers dans un répertoire
 * @param dir Le chemin du répertoire de départ
 * @param fileCible Le fichier cible fichiers à rechercher
 */
function listFilesWithfileCible(dir, fileCible) {
    let results = [];
	let sPathCible = '';

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            //-- Appel récursif si c'est un répertoire
            results = results.concat(listFilesWithfileCible(filePath, fileCible));
	
		} else if (stat.isFile() && path.basename(filePath) == fileCible) {			

			//-- Répertoire cible théorique
			sPathCible = saveDirPath + path.dirname(filePath).substring(directoryPath.length);
			console.log(sPathCible);
			
			//-- Création du répertoire cible complet
			fs.mkdirSync(sPathCible, { recursive: true });
			
			fs.writeFileSync(sPathCible + '/' + fileCible, fs.readFileSync(filePath));
			
			
        }
    }

    return results;
}

const files = listFilesWithfileCible(directoryPath, filetToSave);