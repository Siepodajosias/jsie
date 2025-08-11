/**
 * 
 * JDD - Cycle de vie de la céation d'un process de demandes d'avoir Crèmerie.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2025-06-13
 * @see E2E_MAG_DAV
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    public data :any;

    constructor(fonction: TestFunctions) {
        
        this.data = {

            iDateLivraison : '',
            iNumeroBL      : '',
            sCodeArticle   : '',
            tmpFilename    : fonction.getPrefixeEnvironnement() + '_E2E_MAG_DAV-' + fonction.getToday('us') + '.json'
        };

    }

    public getData () {
        return this.data;
    }

}

module.exports = Init;