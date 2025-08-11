/**
 * 
 * JDD - Cycle de vie de la céation d'un client dans Sigale société.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2025-06-10
 * @see E2E_SOC_CFR
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    public data :any;

    constructor(fonction: TestFunctions) {
        
        this.data = {
            raisonSociale  : '',
            designation    : 'TA_lieuV fresh. ' + fonction.getToday('FR'),
            sCodeClient    : '',
            sDirectionExp  : '',
            sRegion        : '',
            sSecteur       : '',
            tmpFilename    : fonction.getPrefixeEnvironnement() + '_E2E_SOC_CFR-' + fonction.getToday('us') + '.json'
        };

    }

    public getData () {
        return this.data;
    }

}

module.exports = Init;