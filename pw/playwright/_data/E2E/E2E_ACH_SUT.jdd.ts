/**
 * 
 * JDD - Données pour la suppression des triplets et achat crossdocking.
 * 
 * @author SIAKA KONE
 * @version 3.0
 * @since 2024-10-24
 * @see E2E_ACH_SUT
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {

    public data        :any;

    constructor(fonction: TestFunctions) {

        this.data = {
            rayon                 : 'BCT',
            groupeArticle         : '-- Tous --',
            dossierAchat          : 'Bcv - julien 2025', //Bcv - joubard julien
            centraleAchat         : 'BCT 500',
            plateforme            : 'Novoris',     
            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_ACH_SUT.json'
        };

    }

    public getData() {
        return this.data;
    };
}

module.exports = Init;

