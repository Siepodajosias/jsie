/**
 * 
 * JDD - Données pour la gestion des années d'exercice.
 * 
 * @author JC CALVIERA
 * @version 3.0
 * @since 2025-06-03
 * @see E2E_BUD_CNE
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    private data = {
        impactCalendaire    : 2, // Valeur par défaut pour l'impact calendaire
        tmpFilename         : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_BUD_CNE.json';
    }

    getData() {
        return this.data;
    }
    
}

module.exports = Init;
