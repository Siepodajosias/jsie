/**
 * 
 * JDD - Données pour le E2E en passant par la vue Analyse journée.
 * 
 * @author SIAKA KONE
 * @version 3.1
 * @since 2023-12-27
 * @see E2E_ACH_FLS-ANJ
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    private data = {
        sNumLot         : '',
        sNumAchatLong   : '',
        tmpFilename     : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_ACH_FLS-ANJ-' + fonction.getToday('us') + '.json';
    }

    getData() {
        return this.data;
    }
}

module.exports = Init;
