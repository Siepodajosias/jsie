/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-01
 * @version 3.2
 * 
 */

//------------------------------------------------------------------------------------

import { test, expect }     from '@playwright/test';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import fs                   from 'fs';

//------------------------------------------------------------------------------------

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sUrl                  = 'http://recette.prosol.pri/WS/?ws=authors';
const aTrigrammes:string[]  = [];

//------------------------------------------------------------------------------------


test.describe.serial ('** TECH : Check Authors ** ' , () => {

    var aFiles  = [];
    var obj     = {};
    var json    = {};

    test ('Récupération de la liste des automaticiens', async ({ page }) => {
        const response = await page.request.get('http://recette.prosol.pri/WS/?ws=automaticiens');
        const responseData = await response.json();
        responseData.forEach((automaticien) => {
            if (typeof automaticien.signature === 'string') {
                aTrigrammes[automaticien.trigramme] = automaticien.signature.toLowerCase();
            }
        })
        console.log('Liste des Automaticiens : ');
        console.log(aTrigrammes);
    });

    test.describe ('Page [PARAMETRAGE]', async () => {

        test ('Examen Contenu Répertoires', async () => {
            const oDatas = {
                sPath : 'C:\\pw\\playwright\\specs\\',
                sExtension : '.ts',
                bVerbose : false,
                bRecursive : true,
                aExcludeDirs : ['TRANSVERSE']
            }
            aFiles = fonction.readDirectoryContent(oDatas);
        });

        test ('Examen Contenu Fichiers', async () => {

            aFiles.forEach((sFile)=> {

                if (sFile !== undefined) {

                    let file = fs.readFileSync(sFile, "utf8");
                    let arr = file.split(/\r?\n/);
                    const endForEach = {};

                    try{
                        arr.forEach((line)=> {
                            
                            /*
                            if(line.includes("@author")){
                                console.log('>>>>>>>>>>>>>>>>>>>>' + line);
                                throw endForEach;
                            }
                            */

                            if(line.includes("* @author")){
                                //console.log(line + ' - File : ' + sFile);
                                var bAutomaticienTrouve = false;

                                var aSegmnets = sFile.split("\\");
                                sFile = aSegmnets[aSegmnets.length - 2] + '/' + aSegmnets[aSegmnets.length - 1];

                                Object.keys(aTrigrammes).forEach(key => {                        

                                    if (line.toLowerCase().includes(aTrigrammes[key])) {     

                                        if (obj[key] === undefined) {
                                            obj[key] = [sFile];
                                        } else {
                                            obj[key].push(sFile);
                                        }       
                                        //console.log(key + ' -------------- File : ' + sFile);
                                        bAutomaticienTrouve = true;                         

                                    }

                                });

                                if (bAutomaticienTrouve === false){
                                    console.log('----> File : ' + sFile + ' Automaticien non Trouvé ! (' + line + ')');
                                }

                                //throw endForEach;
                            }
                        });
                        //console.log('====> Absent dans Fichier : ' + sFile);
                    } catch (err) {
                        if (err !== endForEach) throw err;
                    }
                }

            })

            // Converting the object to JSON...
            json = JSON.stringify(obj, null, 4);
            //console.log(json);

        });

        test ('Synchronisation données avec GFItest', async ({request}) => {

            const response = await request.post(sUrl,{
                form: {
                    auteurs: json
                }
            })

            //console.log(response);

            console.log('REPONSE : ' + (await response.body()));

            expect(response.status()).toBe(200)

        });

    })

})