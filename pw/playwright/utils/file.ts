/**
 * 
 * Helper dédié à la manipulation de fichiers JSON
 * 
 * @author JC CALVIERA
 * @version 3.0
 * @since 2024-02-28
 *  
 */

import { TestInfo } from "@playwright/test";

import * as fs      from 'fs';
import * as path    from 'path';

export class JddFile {

    private testInfo            : any;
    private bVerbose            : boolean;

    constructor(testInfo:TestInfo) {
        this.testInfo       = testInfo;
        this.bVerbose       = false;
    }

    //---------------------------------------------------------------------------------------------------------------

    /**
     * 
     * @returns Chemin absolu vers la racine du projet
     */
    private getPah():string{
        return this.testInfo.config.rootDir;
    }

    /**
     * 
     * @returns Chemin absolu vers le fichier de versions
     */
    private getVersionsFilePath(env:string):string{
        return `_data/_tmp/versions/${env}.versions.json`
    }

    //---------------------------------------------------------------------------------------------------------------

    /**
     * @description Affiche les données de debuggage
     * @param bVerbose
     */
    public debug(bVerbose:boolean = true){
        this.bVerbose = bVerbose;
    }


    /**
     * @description Essaye de lire un fichier json et retourne l'objet json si le fichier existe
     * @param sFileName 
     * @returns json
     */
    public readJson(sFileName:string):any {
        var jsonData:any = {};

        try {
            jsonData = require(this.getPah() + sFileName);

            if (this.bVerbose) {
                console.log('Lecture du fichier  : ', path.join(this.getPah() + sFileName));
            }

        } catch(error) {
            console.log('Ooops : An error has occurred on: ' + path.join(this.getPah() + sFileName), error);
        }

        return jsonData;
    }


    /**
     * @description Enregistre l'objet json à l'emplacement indiqué et sous le nom de fichier indiqué
     * @param sFileName Nom du fichier à sauvegarder
     * @param jsonFile  Json à sauvegarder
     */
    public writeJson(sFileName:string, jsonFile:any):any {

        fs.writeFile(this.getPah() + sFileName, JSON.stringify(jsonFile, null, 4), (error) => {
            if (error) {
                console.log('Ooops : An error has occurred ', error);
                return;
            }
        });

        if (this.bVerbose) {
            console.log('Ecriture du fichier  : ', path.join(this.getPah() + sFileName));
        }

    }

    /**
     * @description Ecrit l'objet json enregistrant les données (dans test-results)
     * @param jsonFile  Json à sauvegarder
     */
    public writeJsonInfo(jsonContent:any): { fileName: string, filePath: string } {

        let fileName:string;
        let filePath:string;

        //-- Appel depuis jenkins ?
        if (process.env.JOB_NAME != undefined && process.env.BUILD_NUMBER != undefined) {
            fileName = process.env.JOB_NAME + '-' + process.env.BUILD_NUMBER + '.json';
            filePath = path.join(__dirname + '/../test-results/', fileName);
        } else {
            fileName = path.basename(this.testInfo.file).split('.')[0] + '.json';
            filePath = path.join(this.testInfo.project.outputDir, fileName);
        }

        fs.writeFile(filePath, JSON.stringify(jsonContent, null, 4), (error) => {
            if (error) {
                console.log('Ooops : An error has occurred ', error);
                return;
            }
        });

        if (this.bVerbose) {
            console.log('Ecriture du fichier  : ', filePath);
        }

        return { fileName, filePath };
    }

    /**
     * @description Lit le fichier de version et retourne l'objet json 
     * @returns json
     */
    public readJsonVersions(env:string):any {
        var jsonData:any = {};

        try {
            const fileContents = fs.readFileSync(this.getVersionsFilePath(env), 'utf-8');
            jsonData = JSON.parse(fileContents);

            if (this.bVerbose) {
                console.log('Lecture du fichier  : ', this.getVersionsFilePath(env));
            }

        } catch(error) {
            console.log('Ooops : An error has occurred on: ' + this.getVersionsFilePath(env), error);
        }

        return jsonData;
    }

    /**
     * @description Ecrit l'objet json dans le fichier de version
     * @param jsonContent  Json à sauvegarder
     */
    public writeJsonVersions(env:string, jsonContent: any): void {
        try {
            fs.writeFileSync(this.getVersionsFilePath(env), JSON.stringify(jsonContent, null, 4));
            if (this.bVerbose) {
                console.log('Ecriture dans le fichier  : ', this.getVersionsFilePath(env));
            }
        } catch (error) {
            console.log('Ooops : An error has occurred ', error);
        }
    }

    /**
     * @description Récupère la dernière date de modification d'un fichier
     * @param sFilePath Chemin vers le fichier
     */
    public getLastModifiedTime(sFilePath: string): Date {
        try {
            var stats = fs.statSync(sFilePath);
            return new Date(stats.mtime);
        } catch (error) {
            console.log('Error getting last modified time: ', error);
            return new Date(0);
        }
    }

    /**
     * @description Retourne si le fichier existe ou non
     * @param sFilePath Chemin vers le fichier
     */
    public fileExists(sFilePath: string): boolean {
        return fs.existsSync(sFilePath);
      }


}