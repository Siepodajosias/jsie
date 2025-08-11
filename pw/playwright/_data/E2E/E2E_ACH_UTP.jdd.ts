/**
 * 
 * JDD - Données pour la gestion des paramètres d'unite de transport.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-10-15
 * @see E2E_ACH_UTP
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    private data = {
        iNbElem        : '',
        iPos           : '',
        bActif         : '',
        sGroupe        : '',
        sPlateforme    : '',
        sUniteTransport: '',
        rCoef          : '',
        sNature        : '',
        tmpFilename    : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_ACH_UTP-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
