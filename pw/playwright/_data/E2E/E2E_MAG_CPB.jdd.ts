/**
 * 
 * JDD - Données pour la gestion des paramètres d'unite de transport.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-11-04
 * @see E2E_MAG_CPB
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    private data = {
        iNbCommande    : '',
        iNbPrevision   : '',
        sArticle       : {},
        sDateLivraison : '',
        tmpFilename    : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_MAG_CPB-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
