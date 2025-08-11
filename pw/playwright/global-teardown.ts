/**
 * 
 * @description Traitement effectué juste avant la fin du processus ET après le dernier test réalisé
 * @version : 3.3
 * 
 */

import * as path from 'path';
import * as fs from 'fs';


async function globalTeardown() {
  
    //-- Appel depuis jenkins ?
    if (process.env.JOB_NAME != undefined && process.env.BUILD_NUMBER != undefined) {

        var jsonData:any = {};
        var fileName:string;

        //-- Emplacement où sont stockés les fichiers en attente de transmission vers gfiTest
        const pathTmp = path.join(__dirname + '/test-results/');

        //-- Export Erreurs logs----------------------------------------------------------------------------------
        try {

            fileName = process.env.JOB_NAME + '-' + process.env.BUILD_NUMBER + '.errorLogs.json';

            try {

                //-- Si le test a échoué, le json n'a pas été généré. Inutile de le chercher...
                if (fs.existsSync(pathTmp + fileName)) {

                    jsonData = require(pathTmp + fileName);

                    if (process.env.VERBOSE_MOD === 'true') {
                        console.log('Extraction du fichier ErrorLogs : ', pathTmp + fileName);
                    }

                    if (process.env.ID_SQUASH === undefined) {
                        process.env.ID_SQUASH = '';
                    }

                    const headers = new Headers({
                        "Content-Type": "application/x-www-form-urlencoded"
                    });
                    
                    const urlencoded = new URLSearchParams({
                        'ws'        : 'errorLogs',
                        'ta'        : process.env.JOB_NAME,
                        'idBuild'   : process.env.BUILD_NUMBER,
                        'idSquash'  : process.env.ID_SQUASH,
                        'json'      : JSON.stringify(jsonData, null, 4)
                    });
                    
                    const opts = {
                        method: 'POST',
                        headers: headers,
                        body: urlencoded,
                    };
                
                    try {
                        const response = await fetch('http://recette.prosol.pri/WS/', opts);
                        const responseData = await response.json();
                        //console.log('Réponse du webservice :', responseData);
                        if (response.status === 200){
                            console.log("│ \x1b[32mdataSheet\x1b[0m     : " + responseData);
                        } else {
                            console.log("│ \x1b[31mdataSheet\x1b[0m     : " + responseData);
                        }
                    } catch (error) {
                        console.log("│ \x1b[31mdataSheet\x1b[0m     : " + error);
                    }

                }

            } catch(error) {
                console.log('Ooops : An error has occurred on: ' + pathTmp + fileName, error);
            }

        } catch (e) {
            console.log(`Error in globalTeardown: ${e}`);
        } finally {
            // NOP
        }

    }
    
}
  
export default globalTeardown;