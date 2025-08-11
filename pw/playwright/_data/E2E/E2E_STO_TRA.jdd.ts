/**
 * 
 * JDD - Données E2E pour la traçabilité .
 * 
 * @author SIAKA KONE
 * @version 3.0
 * @since 2024-11-04
 * @see E2E_STO_TRA
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    public data        :any;

    constructor(fonction: TestFunctions) {

        this.data = {

            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_STO_TRA-' + fonction.getToday('us') + '.json'
        };

    }

    public getData() {
        return this.data;
    };
}

module.exports = Init;

