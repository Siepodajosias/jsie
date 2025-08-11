/**
 * 
 * JDD - Données pour la gestion des litiges.
 * 
 * @author SIAKA KONE
 * @version 3.3
 * @since 2024-07-09
 * @see E2E_ACH_ANJ
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    public dateVeille  :string;
    public data        :any;

    constructor(fonction: TestFunctions) {

        this.dateVeille         = fonction.getToday('us', -1);

        this.data = {
            idCodeRayon           : 'FL',
            rayon                 : 'Fruits et légumes',
            groupeArticle         : 'Fruits et légumes',
            dossierAchat          : 'Tous',
            fournisseur           : 'Blue Whale',
            listeArticles         : '7448',
            listeMagasins         :  ['Toulouse'],
            listeClients          :  ['GF137FL'],
            heureDebut            : '01:10',                                                  // Heure de début de commande autorisé
            heureFin              : '21:59',                                                  // Heure de fin de commande autorisé
            tauxSaisieCmde        : 1,                                                        // % d'articles commandés lors d'une commande
            nbColisEstimes        : 100,
            rndCommandeMin        : 100,                                                       // Nombre de commande Minimal (laisser à 0 pour ignorer la randomisation)                
            rndCommandeMax        : 100,                                                       // Nombre de commande Maximal (laisser à 0 pour ignorer la randomisation)
            plateformeReception   : 'Chaponnay',
            plateformeDistribution: 'Chaponnay',
            plateformeReceptCode  : 'CHA',
            plateformeDistribCode : 'CHA',      
            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_ACH_ANJ-' + fonction.getToday('us') + '.json'
        };

    }

    public getData() {
        return this.data;
    };
}

module.exports = Init;

