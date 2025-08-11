/**
 * 
 * JDD - Données pour la gestion des paramètres du distancier.
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * @since 2025-06-03
 * @see E2E_STO_PDI
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    private data = {
        categorie     : 'Dynamique',
        tmpFilename   : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_STO_PDI-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
