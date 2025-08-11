/**
 * 
 * JDD - Données pour le cycle de vie de ...
 * 
 * @author SIAKA KONE
 * @version 3.0
 * @since 2024-07-19
 * @see E2E_LIT_DAV
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    public data        :any;

    constructor(fonction: TestFunctions) {

        this.data = {
            rayon                 : 'Traiteur',
            groupeArticle         : 'Elaborés',
            dossierAchat          : 'Tous',
            fournisseur           : 'SOLEANE',
            listeArticles         : 'V393',
            listeMagasins         :  ['Toulouse'],
            listeClients          :  ['GF137FL'],
            heureDebut            : '01:10',                                                  // Heure de début de commande autorisé
            heureFin              : '21:59',                                                  // Heure de fin de commande autorisé
            tauxSaisieCmde        : 1,                                                        // % d'articles commandés lors d'une commande
            nbColisEstimes        : 100,
            rndCommandeMin        : 100,                                                       // Nombre de commande Minimal (laisser à 0 pour ignorer la randomisation)                
            rndCommandeMax        : 100,                                                       // Nombre de commande Maximal (laisser à 0 pour ignorer la randomisation)
            plateformeReception   : 'Cremcentre',
            plateformeDistribution: 'Cremcentre',
            nbMagExterne          : 0,         
            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_LIT_DAV-' + fonction.getToday('us') + '.json'
        };

    }

    public getData() {
        return this.data;
    };
}

module.exports = Init;
