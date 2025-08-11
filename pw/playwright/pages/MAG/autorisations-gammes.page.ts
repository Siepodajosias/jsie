/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : GAMMES
 * 
 * @author  JC CALVIERA
 * @version 3.1
 * @since   2024-03-20
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsGammes {

    //public readonly buttonCreer             = this.page.locator('div.form-btn-section button i.icon-plus');
    public readonly buttonCreer             = this.page.locator('div.form-btn-section button:nth-child(1)');    
    public readonly buttonModifier          = this.page.locator('div.form-btn-section button i.fa-pencil-alt');    
    public readonly buttonSupprimer         = this.page.locator('div.form-btn-section button i.fa-times');

    public readonly buttonSupprimerAction   = this.page.locator('tr.p-selectable-row td.col-actions button i.fa-times');

    public readonly dataGridListeGammes     = this.page.locator('div[ng-controller="GammesControleur"] table th'); 

    public readonly gammeRows               = this.page.locator('tr.p-selectable-row');
    public readonly gammeRowsDesignation    = this.page.locator('tr.p-selectable-row td.col-designation');

    //-- Popin : Création de gamme ----------------------------------------------------------------------------------

    public readonly pPAddButtonEnregistrer  = this.page.locator('p-footer button');

    public readonly pPAddLinkAnnuler        = this.page.locator('p-footer a');

    public readonly pPAddListBoxRayon       = this.page.locator('p-dropdown[id="rayon-select"]');

    public readonly pPAddListChoixRayons    = this.page.locator('p-dropdownitem li span');

    public readonly pPAddInputDesignation   = this.page.locator('input[id="designation-gamme"]');
    public readonly pPAddInputEnseigne      = this.page.locator('div.colonne-enseigne-magasin thead input');
    public readonly pPAddInputContient      = this.page.locator('app-autocomplete[id="magasin-inclus-autocomplete"] input');
    public readonly pPAddInputContientPas   = this.page.locator('app-autocomplete[id="magasin-exclus-autocomplete"] input');

    public readonly pPAddCheckBoxEnseigne   = this.page.locator('div.colonne-enseigne-magasin td.col-checkbox');

    public readonly pPAddTdEnseignes        = this.page.locator('div.colonne-enseigne-magasin td.col-designation');
    public readonly pPAddTdEnseignesDisabled= this.page.locator('div.colonne-enseigne-magasin td.col-designation.enseigne-disabled');

    public readonly pPAddSelecContient      = this.page.locator('div.colonne-enseigne-magasin:nth-child(2) div.p-chip-text');
    public readonly pPAddSelecContientPas   = this.page.locator('div.colonne-enseigne-magasin:nth-child(3) div.p-chip-text');

    public readonly pPRemoveIconContient    = this.page.locator('div.colonne-enseigne-magasin:nth-child(2) span.pi-times-circle');
    public readonly pPRemoveIconContientPas = this.page.locator('div.colonne-enseigne-magasin:nth-child(3) span.pi-times-circle');

    public readonly pPAlert                 = this.page.locator('.alert-dismissable');


    //-- Popin - Confirmation Suppression ----------------------------------------------------------------------------

    public readonly pPConfirmSuppressYes    = this.page.locator('div .footer-confirmation div:nth-child(1) p-button')
    public readonly pPConfirmSuppressNo     = this.page.locator('div .footer-confirmation div:nth-child(2) p-button')

    public readonly pPReConfirmSuppress     = this.page.locator('div alert button.bouton-ok')

    constructor(public readonly page: Page) {};
    
}