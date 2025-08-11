/**
 * 
 * JDD - Données pour la gestion des réceptions d'emballages.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-07-01
 * @see E2E_STO_EMB
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    private data = {
        sChauffeur      : '',
        sExpediteur     : '',
        sTransporteur   : '',
        sNumeroBl       : '',
        sReceptionnaire : '',
        tmpFilename     : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_STO_EMB-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
