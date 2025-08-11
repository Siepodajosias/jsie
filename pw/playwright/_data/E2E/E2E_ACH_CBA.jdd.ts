/**
 * 
 * JDD - Données pour la modification d'un BL.
 * 
 * @author SIAKA KONE
 * @version 3.1
 * @since 2024-10-11
 * @see E2E_ACH_CBA
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    public data        :any;

    constructor(fonction: TestFunctions) {

        this.data = {
            idCodeRayon           : 'FL',
            rayon                 : 'Fruits et légumes',
            groupeArticle         : 'Fruits et légumes',
            dossierAchat          : 'Tous',
            fournisseur           : 'Capexo  sa',    //Capexo  sa 
            listeArticles         : '5070',         //5700
            listeMagasins         :  ['Toulouse'],
            listeClients          :  ['GF137FL'],                                                 // Heure de fin de commande autorisé
            tauxSaisieCmde        : 1,                                                        // % d'articles commandés lors d'une commande
            nbColisEstimes        : 100,
            rndCommandeMin        : 100,                                                       // Nombre de commande Minimal (laisser à 0 pour ignorer la randomisation)                
            rndCommandeMax        : 100,                                                       // Nombre de commande Maximal (laisser à 0 pour ignorer la randomisation)
            plateformeReception   : 'Chaponnay',
            plateformeDistribution: 'Chaponnay',
            plateformeReceptCode  : 'CHA',
            plateformeDistribCode : 'CHA',      
            tmpFilename           : fonction.getPrefixeEnvironnement() + 'E2E_ACH_CBA-' + fonction.getToday('us') + '.json'
        };

    }

    public getData() {
        return this.data;
    };
}

module.exports = Init;

