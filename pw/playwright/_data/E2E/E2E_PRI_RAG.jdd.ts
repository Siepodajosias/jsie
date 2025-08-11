/**
 * 
 * JDD - Cycle de vie de la gestion des règles d'appartenance sur les groupes de magasins.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-09-16
 * @see E2E_PRI_RAG
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    
    private data = {
        sNomGroupe    : '',
        tmpFilename   : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_PRI_RAG-' + fonction.getToday('us') + '.json';
    }

    public getData () {
        return this.data;
    }

}

module.exports = Init;