/**
 * Appli    : MAGASIN
 * Menu     : AUTORISATIONS
 * Onglet   : ECHANGES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from '@playwright/test';

export class AutorisationsEchanges {

    public readonly inputMagasinCedant     = this.page.locator('.autocomplete-magasin-cedant input');
    public readonly inputMagasinCible      = this.page.locator('.autocomplete-magasin-autorise input');

    public readonly buttonSupprimer        = this.page.locator('[ng-click="supprimerAutorisation(dgAutorisationDemandeEchange.selections[0])"]');
    public readonly buttonPlus             = this.page.locator('[ng-click="ajouterAutorisation(autocomplete.magasinAutorise)"]');

    public readonly tdListeCodeMagCible    = this.page.locator('td.datagrid-codeClient');

    public readonly autoCompleteMag        = this.page.locator('li.gfit-autocomplete-result');

    constructor(public readonly page: Page) {}

}