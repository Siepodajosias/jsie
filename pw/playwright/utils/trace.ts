/**
 * 
 * Helper dédié à la création d'un fichier de trace (horodatage des actions effectuées)
 * 
 * @author JC CALVIERA
 * @version 3.3
 * @since 2025-04-17
 *  
 */

import { TestInfo } from "@playwright/test";

import * as fs      from 'fs';

export class Trace {

    private testInfo    : any;
    private bVerbose    : boolean;
    private sTraceFile  : string;
    private iStartTime  : number;
    private sLastAction : number;


    constructor(testInfo:TestInfo, bVerbose:boolean = false) {

        this.testInfo       = testInfo;
        this.bVerbose       = bVerbose;
        this.sTraceFile     = this.testInfo.project.outputDir + '/trace.html';

        const SEPARATEUR    = '─'.repeat(80);
        this.iStartTime     = performance.now();

        try{

            //-- On crée le fichier de trace
            fs.writeFileSync(this.sTraceFile, '<html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="http://testauto.prosol.pri/trace.css"></head><body>' + SEPARATEUR + '<br>', { flag: 'a' });
            fs.writeFileSync(this.sTraceFile, ('Script : ' + testInfo.titlePath[0] + "<br>"), { flag: 'a' })
            fs.writeFileSync(this.sTraceFile, ('Ref : ' + testInfo.titlePath[1] + "<br>"), { flag: 'a' })
            fs.writeFileSync(this.sTraceFile, (SEPARATEUR + "<br><table class=\"trace\"><thead><th>Démarrage</th><th>Test</th><th>Partiel (s)</th><th>Cumul (s)</th></thead>"), { flag: 'a' })

            this.sLastAction = performance.now();

            if (this.bVerbose) {
                console.log('Fichier de Trace créé : ' + this.sTraceFile);
            }   

        }
        catch(error){
            console.log('Ooops : An error has occurred while opening : ' + this.sTraceFile + '.', error);
        }

    }

    //---------------------------------------------------------------------------------------------------------------

    /**
     * @description : Ajout d'une ligne de trace dans le fichier de trace
     * @param testInfo 
     */
    public add(testInfo:TestInfo): void {

        //-- Durée cumulée
        const iEndTime 			= performance.now();
        const iDuration 		= iEndTime - this.iStartTime;	
        const iDurationSec 		= Math.floor(iDuration / 1000);

        //-- Durée de la dernière action
        const iLastDuration 	= iEndTime - this.sLastAction;
        const iLastDurationSec 	= Math.floor(iLastDuration / 1000);
        const iLastDurationMillisec = iLastDuration / 1000;

        fs.writeFileSync(this.sTraceFile, ('<tr><td>' + new Date().toLocaleString() + '</td><td>' + testInfo.title + '</td><td>' + iLastDurationMillisec.toFixed(3) + '</td><td>' + iDurationSec + '</td></tr>'), { flag: 'a' });
        this.sLastAction    = iEndTime;

    }

    /**
     * 
     * @description : fermeture propre du fichier HTML généré
     * 
    */
    public stop(): void {

        //-- On ferme le fichier de trace proprement
        try {
            fs.writeFileSync(this.sTraceFile, '</table></body></html>', { flag: 'a' });
            if (this.bVerbose) {
                console.log('Fermeture du fichier de Trace : ' + this.sTraceFile);
            }
        }catch(error){
            console.log('Ooops : An error has occurred while closing : ' + this.sTraceFile + '.', error);
        }
        
    }

}