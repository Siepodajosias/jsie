/**
 * 
 * JDD pour l'exploitation des Dossiers d'Achats
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init{

    public data:any;

    constructor(fonction: TestFunctions) {

        this.data = {
            sDossierAchat   : '',
            sNomResponsable : '',
            tmpFilename     : fonction.getPrefixeEnvironnement() + '_DossierAchatRandom-' + fonction.getToday('us') + '.json'
        };

    }

    public getData() {
        return this.data;
    };

};

module.exports = Init;