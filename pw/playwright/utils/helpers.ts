/**
 * 
 * Helper dédié à l'affichage du cartouche d'informations et préparation du test
 * 
 * @author JC CALVIERA
 * @version 3.14
 *  
 */

import { CartoucheInfo }    from '@commun/types';
import { Credential }       from '@conf/credential.conf';
import { GlobalConfigFile } from '@conf/commun.conf';
import { Page, TestInfo}    from '@playwright/test';
import * as dotenv          from "dotenv"

var fs  = require('fs');

//-------------------------------------------------------------------------------------

export class Help {

    readonly oData          : CartoucheInfo;
    readonly testinfo       : TestInfo;
    readonly page           : Page;

    public config           : any;
    public profil           : any;

    private dateTest        : Date;
    private sSeparateur     : string;
    private iSeparateurLength:number;
    private globalConfig    : GlobalConfigFile;
    private globalData      : any;

    constructor(oData: CartoucheInfo, testinfo: TestInfo, page: Page) {
        this.oData              = oData;    
        this.testinfo           = testinfo;    
        this.config             = {}; 
        this.page               = page;   
        this.iSeparateurLength  = 80;
        this.sSeparateur        = "─".repeat(this.iSeparateurLength);
        this.dateTest           = new Date(testinfo["_startWallTime"]);
        this.globalConfig       = new GlobalConfigFile();
        this.globalData         = this.globalConfig.getData();
    }

    public async init() {

        //-- Injection de la référence ID_SQUASH sous forme d'annotation pour mise à disposition des autres classes
        this.testinfo.annotations.push({ type: "ID_SQUASH",         description: this.oData.idTest.toString()});
        this.testinfo.annotations.push({ type: "REF_SQUASH",        description: this.oData.refTest.toString()});
        this.testinfo.annotations.push({ type: "TEST_DESCRIPTION",  description: this.oData.desc.toString().trim()});

        //-- Environnement par défaut si non précisé au lancement du test
        const environnement = process.env.ENVIRONNEMENT.toLowerCase() || 'integration';     // Mise en minuscule pour être certain de trouver les fichiers de configuration associés (Ex : "TA.conf.json" au lieu de "ta.conf.json" )

        //-- Utilisateur par défaut
        var login = process.env.USER || 'lunettes';      

        //-- Si on se connecte avec un ROLE au lieu d'un USER...
        if(process.env.ROLE !== undefined && process.env.ROLE != ''){
            const credential = new Credential(login);
            process.env.USER = credential.getUserByRole(this.oData.appli, process.env.ROLE);
            login = process.env.USER;
        }

        this.config.environnement = environnement;
        this.config.login = login;
        this.config.datas = require(`../conf/environnements/${environnement}.conf.json`);
        this.config.commun= require(`../conf/commun.conf.json`);

        console.log(this.sSeparateur); 
        console.log('| Application  : ' + this.oData.appli);
        console.log('| Reference    : [' + this.oData.refTest + '] - ' + this.oData.desc);
        
        //console.log('| Description  : ' + this.oData.desc);
        if (this.oData.idTest != undefined) {
        console.log('| ID Squash    : ' + this.oData.idTest);  
        console.log('| Sénario      : ' + 'http://squash.prosol.pri:8080/squash/test-case-workspace/test-case/' + this.oData.idTest + '/content');  
        }

        const aSplitScript = this.testinfo.file.split("\\");
        console.log('| Script       : ' + aSplitScript[aSplitScript.length - 2] + '/' + aSplitScript[aSplitScript.length - 1]); 
        console.log('| Code         : http://happybox.sigale.prosol.pri/gitlab/-/ide/project/recette/playwright/edit/master/-/specs/' + aSplitScript[aSplitScript.length - 2] + '/' + aSplitScript[aSplitScript.length - 1]); 
        console.log('| Version      : ' + this.oData.version);
                             
        var stats = fs.statSync(this.oData.fileName);                                   // Date de modification du fichier de tests
        var mtime = new Date(stats.mtime);
        var aRev  = mtime.toString().split(' ');
        console.log('| Crée le      : ' + aRev[2] + ' ' + aRev[1] + ' ' + aRev[3] + ' à ' + aRev[4]); 

        console.log(this.sSeparateur);
        console.log('| Date Tir     : ' + this.addZero(this.dateTest.getDate()) + '-' + this.addZero(this.dateTest.getMonth() + 1) + '-' + this.dateTest.getFullYear() + ' à ' + this.addZero(this.dateTest.getHours()) + ':' + this.addZero(this.dateTest.getMinutes()) + ':' + this.addZero(this.dateTest.getSeconds()) + ':' + this.addZero(this.dateTest.getDay()) + ' (' + this.globalData.joursSemaine[this.dateTest.getDay()] + ')');
        console.log('| Profil       : ' + login);
        console.log('| Browser      : ' + this.page.context().browser()?.browserType().name() +'/' + this.page.context().browser()?.version());      
    
		//-- Lien cliquable si appel depuis jenkins
		if (process.env.JOB_NAME != undefined && process.env.BUILD_NUMBER != undefined) {
		var sUrl =  'http://testauto.prosol.pri/' + process.env.JOB_NAME + '/builds/' + process.env.BUILD_NUMBER + '/html/index.html'
		console.log("| Rapport HTML : " + encodeURI(sUrl));
		}

        console.log('| Environnement: ' + environnement); 

        //-- Liste des paramètres admis par le test
        if (this.oData.params.length > 0) {
        console.log('| Param. Admis : ' + this.oData['params'].join(' - '));             
        }

        //-- Affichage du fichier d'aide si il existe
        if (this.oData.help.length > 0) {
            for (let iCpt:number = 0; iCpt < this.oData.help.length; iCpt++) {
                //-- Première ligne
                if (iCpt === 0) {
        console.log('| Aide         : ' + this.oData.help[iCpt]); 
                //-- Lignes suivantes
                } else {
        console.log('|              : ' + this.oData.help[iCpt]);                    
                }
            }            
        }

        //-- liste des paramètres effectivement transmis
        console.log("── Paramètres " + "─".repeat(this.iSeparateurLength - "── Paramètres ".length));

        const output = dotenv.config();    
        var iNbParams:number = 0;

        for(var key in output.parsed) {
            if (process.env[key] != '') {
                //-- Données non affichées car déjà publiées
                if (key != 'ENVIRONNEMENT' && key != 'PROJET') {
        console.log('| ' + key.substring(0,12) + " ".repeat(12 - key.substring(0,12).length) + ' : ' + process.env[key]);
                    iNbParams++;        // Au moins paramètre figure dans la liste
                }
            }
        }

        if (iNbParams === 0) {
        console.log('|');
        }

        //-- Liste des version des autres applications sigale installées
        console.log("── Versions " + "─".repeat(this.iSeparateurLength - "── Versions ".length));

        let jsonResponse:any;

        //-- On interroge l'URL du WS des versions
        try{
            const response = await fetch(this.config.datas.SIGALE_VERSIONS, {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                },
            });
            if (!response.ok) {
                console.log(`| Erreur Récupération WS Version : ${response.status}`);
            }

            //-- Récupération Données du WS
            jsonResponse = (await response.json());

            //-- Mise au format JSON 
            var jsonVersions = JSON.parse(JSON.stringify(jsonResponse));

            //-- Détermination de la structure du JSON retourné (diffère selon le WS appelé)
            if (jsonVersions[0]?.appName !== undefined) {        //-- Format Ancien WS Sigale VERSION

                //-- Tri par ordre alphébétique des applications
                var aJsonVersions:any = [];
                jsonVersions.forEach(jsonVersion => {
                    aJsonVersions.push({"app" : jsonVersion.appName, "value" : jsonVersion});
                })
                aJsonVersions.sort((a,b) => {
                    return a.app.localeCompare(b.app);
                });

                //-- Affichage du tableau
                aJsonVersions.forEach(jsonVersion => {
                
                    var jsonDomaine     = jsonVersion.value.appName;

                    //-- S'agit t-il d'une application SIGALE connue ?
                    if (this.config.commun.LIBELLES_VERSIONS.includes(jsonDomaine.toUpperCase())) {

                        let jsonSha1:string, testedVersion:string, selected:string;
                        let iTotalLenght:number;

                        if (jsonDomaine.toUpperCase() == this.oData.appli || jsonDomaine == this.config.commun.trigramme[this.oData.appli] || this.config.commun.EXCEPTIONS_NOMMAGE[this.oData.appli] == jsonDomaine.toUpperCase()) {
                            selected = ' <-----';
                        } else {
                            selected = '';
                        }

                        if (jsonVersion.value.current !== null) {
                            testedVersion   = jsonVersion.value.current.version.versionComplete;
                            jsonSha1        = jsonVersion.value.current.sha1.substring(0,4) + '...' + jsonVersion.value.current.sha1.substring(36) + ' |';                    
                            iTotalLenght    = testedVersion.length + selected.length + 30;
                        } else {
                            testedVersion   = '?';
                            jsonSha1        = '|';                    
                            iTotalLenght    = 19;
                        }                    

                        jsonDomaine = jsonDomaine.substring(0,12);

                        console.log('| ' + jsonDomaine + " ".repeat(12 - jsonDomaine.length) + ' : ' + testedVersion + selected + " ".repeat(80 - iTotalLenght) + jsonSha1);                        

                    }

                });

            } else {                                              //-- Format Nouveau WS Sigale VERSION              

                let aAppliFound:any = [];

                //-- Affichage du tableau
                jsonVersions.forEach(jsonVersion => {
                
                    var jsonDomaine             = jsonVersion.application.toUpperCase();
                    var jsonDomaineCapitalized  = jsonVersion.application.replace(/^./, jsonVersion.application[0].toUpperCase());

                    //-- S'agit t-il d'une application SIGALE connue ?
                    if (this.config.commun.LIBELLES_VERSIONS.includes(jsonDomaine)) {

                        var selected = '';
                        var jsonSha1;

                        if (jsonDomaine == this.oData.appli || jsonDomaine == this.config.commun.trigramme[this.oData.appli].toUpperCase()) {
                            selected = ' <-----';
                        }

                        var testedVersion   = jsonVersion.version;
                        jsonSha1            = jsonVersion.sha1.substring(0,4) + '...' + jsonVersion.sha1.substring(36) + ' |';                    
                        var totalLenght     = testedVersion.length + selected.length + 30;

                        console.log('| ' + jsonDomaineCapitalized + " ".repeat(12 - jsonDomaine.length) + ' : ' + testedVersion + selected + " ".repeat(80 - totalLenght) + jsonSha1);                        
                        aAppliFound.push(jsonDomaine);
                    }

                })

                //-- Affichage des applications qui n'auraient pas été trouvées
                this.config.commun.LIBELLES_VERSIONS.forEach(sNomApplication => {
                    if (!aAppliFound.includes(sNomApplication)) {
                        console.log('| ' + sNomApplication + " ".repeat(12 - sNomApplication.length) + ' : ?' + " ".repeat(61) + "|");
                    }
                })

            }

        } catch(error){
            console.log("|");
            console.log("| Récupération des informations des versions IMPOSSIBLE !");
            console.log("| Source : " + this.config.datas.SIGALE_VERSIONS);
            console.log("|");
        }
                 
        console.log(this.sSeparateur); 
    }

    public async close() {
        console.log('--- Consolidation des données  ---------------------');
        console.log('URL : ' + this.config.datas.URL[this.oData.appli.substring(0,3)]);
        console.log('--- Consolidation des données  ---------------------');
    }

    /**
     * 
     * @param {number} valeur 
     * @desc 1 -> 01 ; 12 -> 12
     * 
    */
    private addZero(valeur: number) {
        if (valeur < 10) {
            return '0' + valeur;
        } else{
            return valeur;
        }
    }
    
}