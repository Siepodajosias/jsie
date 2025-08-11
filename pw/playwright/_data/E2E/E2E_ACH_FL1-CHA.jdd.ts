/**
 * 
 * JDD - Données pour le E2E d'agréage de toute la marchandise reçue d'un fournisseur.
 * 
 * @author SIAKA KONE
 * @version 3.1
 * @since 2023-12-12
 * @see E2E_ACH_FL1-CHA
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    private data = {
        listeVilles         : 'Ahuy,Albertville',
        listeArticles       : '5700,5800',
        sNumLot             : '',
        sNumAchatLong       : '',
        tmpFilename         : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_ACH_FL1-CHA-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
