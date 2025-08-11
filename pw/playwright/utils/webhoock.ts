/**
 * 
 * Helper dédié à la l'utilisation des WebHoocks de Microsoft Teams
 * 
 * @author JC CALVIERA
 * @version 3.1
 * @since 2025-01-10
 *  
 */

import * as fs              from 'fs';
import { TestFunctions }    from './functions';

const TEAMS_CANAL_ENVIRONNEMENT	= 'https://gfit1.webhook.office.com/webhookb2/252db9a8-9f58-4362-aee0-bfbf3a1e08df@982ac323-188a-4f5f-9029-037751c5acd0/IncomingWebhook/bf335648d1014c2b844e8c1f857a573a/22e4484b-ccc6-4f0b-8cd8-6fa94d45e0b5/V2buNmJFnuSgnBx7AdRp5QWp9S3-Tk7DPK6H58GE-00Do1';

export class WebHoock {

    private sUrlWebHoock    : string;
    private bVerboseMode    : boolean = false;
    private sHttpRequest    : string = 'POST';
    private sPathCards      : string = '_data/cards/';
    private sNomCard        : string;
    private aAllowedCards   : any;
    private fonction        : TestFunctions;

    constructor(fonction:TestFunctions){

        this.fonction = fonction;

        //-- Par défaut, on utilise le WebHoock Teams du canal "Environnements"
        this.sUrlWebHoock = TEAMS_CANAL_ENVIRONNEMENT;

        //-- Liste des cartes admises ainsi que leur nom
        this.aAllowedCards = {
            'status'    : 'status.json',
            'down'      : 'appli_down.json'
        }

        //-- Nom de la carte par défaut
        this.sNomCard = 'status';

    }


    /**
     * @description setter : permet d'activer ou non le mode "Verbose"
     * @param bValue 
     */
    public setVerboseMod(bValue: boolean) {
        this.bVerboseMode = bValue;
    }

    /**
     * @description setter : permet de sélectionner le mode d'envoi de la requête (POST, GET, etc.)
     * @param sModHttpRequest 
     */
    public setHttpRequestMod(sModHttpRequest:string){
        this.sHttpRequest = sModHttpRequest;
    }

    /**
     * @description Setter
     * @param sNomCard 
     */
    public setTypeCard(sNomCard:string = 'status'){
        this.sNomCard = sNomCard;
    }

    /**
     * @description appel du WebHoock
     * @param oCard La carte à afficher sur le canal
     */
    public async send(oDatas:any):Promise<void>{

		const headers = new Headers({
			"Content-Type": "application/json"
		});
		
		//-- Hydratation de la carte devant être penvoyée
        const jsonDatas = JSON.stringify(this.hydrateJson(oDatas)); //JSON.stringify(oCard);
		
		const options = {
			method	: this.sHttpRequest,
			headers	: headers,
			body	: jsonDatas,
		};

        if (this.bVerboseMode) {
            console.log('| Webhoock : ' + this.sUrlWebHoock);
        }

        try {
            const response = await fetch(this.sUrlWebHoock, options);
            const responseData = await response.json();
            //console.log('Réponse du webservice :', responseData);

            this.fonction.addWebServiceInfo({'WS'	: 'WebHoock', 'status' : response.status, 'response' : responseData});

        } catch (error) {
            this.fonction.addWebServiceInfo({'WS'	: 'WebHoock', 'status' : '500', 'response' : error});
        }

    }

    /**
     * 
     * @description Fonction récursive pour substituer les valeurs
     * @param obj 
     * @param oDatas 
     * @returns 
     */
    private substituteValues(obj: any, oDatas:any): any {
        if (typeof obj === 'string') {
            //-- Substitution des valeurs entre accolades par les données réelles
            return obj.replace(/\{(\w+)\}/g, (match, key) => {
                return oDatas.hasOwnProperty(key) ? oDatas[key] : match;
            });
        } else if (typeof obj === 'object' && obj !== null) {
            //-- Parcourir récursif des objets et des tableaux
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] = this.substituteValues(obj[key], oDatas);
                }
            }
        }
        return obj;
    }

    /**
     * @description Hydratation à la volée du JSON template
     * @param sCardName Le nom de la carte devant être chargée
     * @param oDatas Les données devant être injectées
     */
    public hydrateJson(oDatas: { [key: string]: any }): any {

        //-- On sécurise à minima pour éviter de pouvoir travailler sur n'importe quel fichier...
        if (this.aAllowedCards[this.sNomCard] !== undefined) {

            //-- Lecture du fichier JSON template
            const templateContent: string = fs.readFileSync(this.sPathCards + this.aAllowedCards[this.sNomCard], 'utf-8');
            const template: any = JSON.parse(templateContent);

            //-- Substituer les valeurs dans le template
            const hydratedTemplate = this.substituteValues(template, oDatas);
            console.log(hydratedTemplate);

            return hydratedTemplate;

        } else{
            console.log('Ooops : Carte inconnue !');
        }

    }

}