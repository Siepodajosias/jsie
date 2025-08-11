/**
 * 
 * Classe dédiée aux appels à la base Elasticsearch
 * 
 * @author Mathis NGUYEN & Yannick BOLY
 * @version 3.6
 * @description Récupère les logs d'erreur côté serveur
 *  
 */

import { Client }       from '@elastic/elasticsearch';

import { TestInfo }     from '@playwright/test';
import { TestFunctions }from './functions';
import * as path        from 'path';

const pathConf          = path.join(__dirname + '/../conf/elk.conf.json');

export class ElkFunctions {

    public url      : string;
    private client  : Client;

    //-- Liste des codes recherchés
    static codeExceptions = [
        { value: 9999, type: "CodeException 9999" }
    ];

    //-- Liste des libellés recherché dans les lignes de Log
    static otherExceptions = [
        { value: "*org.hibernate.LazyInitializationException*", type: "LazyInitializationException" },
        //{ value: "*org.hibernate.exception.SQLGrammarException*", type: "SQLGrammarException" },
        { value: "*java.lang.NullPointerException*", type: "NullPointerException" }
    ];

     //-- Chargement des identifiants (username et password)
    private authJdd = require(pathConf);

    constructor() {
        this.url   = this.authJdd.urlElk;
        this.client = new Client({ 
            node: this.url, 
            auth:{username:this.authJdd.username, password:this.authJdd.password},
            ssl: {rejectUnauthorized: false},
    });
    }

    /**
     * 
     * @param search_index Environnement (INT, INT2, etc.)
     * @param app Nom de l'application
     * @param startDate Date de début de l'examane des logs
     * @param endDate Date de fin de l'examen des logs
     * @param codeValue L'erreur recherchée
     * @returns Réponse du serveur
     */
    public async searchCodeExceptions(search_index: string, app: string, startDate: string, endDate: string, codeValue: any):Promise<any|null> {
        try {
            const response = await this.client.search({
                index: search_index,
                body: {
                    query: {
                        bool: {
                            filter: [
                                {
                                    range: {
                                        "@timestamp": {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    }
                                },
                                {
                                    term: {
                                        application: app
                                    }
                                }
                            ],
                            should: [
                                {
                                     term: {
                                        codeException: codeValue
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            return response.body.hits.hits.length > 0 ? response.body.hits.hits : null;
        } catch (error) {
            console.error(`Error occurred during the search for codeException: ${codeValue}`, error);
            return null;
        }
    }

    /**
     * 
     * @param search_index Environnement (INT, INT2, etc.)
     * @param app Nom de l'application
     * @param startDate Date de début de l'examane des logs
     * @param endDate Date de fin de l'examen des logs
     * @param codeValue L'erreur recherchée
     * @returns Réponse du serveur
     */
    public async searchOtherExceptions(search_index: string, app: string, startDate: string, endDate: string, exceptionType: string):Promise<any|null> {
        try {
            const response = await this.client.search({
                index: search_index,
                body: {
                    query: {
                        bool: {
                            filter: [
                                {
                                    range: {
                                        "@timestamp": {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    }
                                },
                                {
                                    term: {
                                        application: app
                                    }
                                }
                            ],
                            should: [
                                {
                                    query_string: {
                                        default_field: "messageLog",
                                        query: exceptionType
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            return response.body.hits.hits.length > 0 ? response.body.hits.hits : null;
        } catch (error) {
            console.error(`Error occurred during the search for ${exceptionType}:`, error);
            return null;
        }

    }


    /**
     * @description Récupération des logs côté serveur 
     * @param testInfo 
     * @param environnement 
     * @param fonction 
     * @param dStartTime 
     */
    public async getLogServeur(testInfo:TestInfo,fonction: TestFunctions){
        if (['integration', 'integration2'].includes(fonction.environnement)) {
    
            const index     = fonction.environnement === 'integration' ? 'sigale-int*' : 'sigale-int2*';
            const startDate = fonction.formatDateToISO(fonction.getdStartTime());
            const endDate   = fonction.formatDateToISO(new Date());
            
            const logByType: { [type: string]: string[] } = {};

                   
            let allExceptions: { type: string, result: any }[] = [];

            // Check for code exception errors
            for (const { value, type } of ElkFunctions.codeExceptions) {
                        
                try{
                    const result = await this.searchCodeExceptions(index, fonction.appliFullName.toLowerCase(), startDate, endDate, value);					
                    if (result) {
                        allExceptions.push({ type, result });
                    }
                } catch(e){
                    console.log('Erreur récupération info environnement "' + fonction.environnement + '" - ' + value);
                }
            
            }
        
            // Check for other exceptions
            for (const { value, type } of ElkFunctions.otherExceptions) {
                
                try {
                    const result = await this.searchOtherExceptions(index, fonction.appliFullName.toLowerCase(), startDate, endDate, value);
                    if (result) {
                        allExceptions.push({ type, result });
                    }
                } catch(e){
                    console.log('Erreur récupération info environnement "' + fonction.environnement + '" - ' + value);
                }
                
            }
            //Display results
            if (allExceptions.length > 0) {
        
                allExceptions.forEach(({ type, result }) => {
                    if (result.length > 0) {

                        console.log(`Found ${result.length} error${result.length === 1 ? '' : 's'} of type: ${type}`);

                        let messageCounter = 1;

                        result.forEach((hit: any) => {

                            if (hit._source.message) {
                                const message = hit._source.message;
                                const maxCharacters = 1000;
                                const limitedMessage = message.length > maxCharacters ? message.slice(0, maxCharacters) + "..." : message; //displaying only the first 1000 characters
                                 //-- Ajout dans le tableau spécifique au type
                                if (!logByType[type]) {
                                    logByType[type] = [];
                                }
                                logByType[type].push(limitedMessage);

                                } else {
                                    if (!logByType[type]) {
                                        logByType[type] = [];
                                    }
                                    logByType[type].push("No message Exception Found");
                                }
                            messageCounter++;

                        });
                    }
                });
                    return logByType;
            } else {
                return null;
            }
        } else {    
            console.log("│ Environment '" + fonction.environnement + "' non pris en charge pour l'analyse des logs");
        }
    }

}