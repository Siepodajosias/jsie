/**
 * 
 * JDD -Création d'un engagement et transformation en commande
 * 
 * @author Abdoul SARBA
 * @version 3.0
 * @since 2025-02-07
 * @see E2E_MAG_ENG
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    public data :any;
    constructor(fonction: TestFunctions) {
        this.data = {
            quantites: [],      
            tmpFilename    : fonction.getPrefixeEnvironnement() + '_E2E_MAG_ENG-' + fonction.getToday('us') + '.json'
        };
    }
    public getData () {
        return this.data;
    }
}
module.exports = Init;