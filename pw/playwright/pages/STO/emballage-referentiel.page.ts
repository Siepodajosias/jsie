/**
 * Appli    : STOCK
 * Page     : EMBALLAGE
 * Obglet   : REFERENTIEL
 * 
 * author JOSIAS SIE
 * 
 * @version 3.2
 * 
 */

import { Page } from "@playwright/test"

export class EmballageReferentiel{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly dataGridGestionnaires       = this.page.locator('sigale-table-gestionnaire tr:nth-child(1) th');
    public readonly dataGridTypesEmballages     = this.page.locator('sigale-table-type-emballage tr:nth-child(1) th');

    public readonly checkboxListeGestionnaires  = this.page.locator('datagrid[selection="dgGestionnaires.selection"] input');

    public readonly buttonCreerGestionnaire     = this.page.locator('.sigale-page-footer button').nth(0);
    public readonly buttonModifierGestionnaire  = this.page.locator('.sigale-page-footer button').nth(1);
    public readonly buttonCreerTypeEmballage    = this.page.locator('.sigale-page-footer button').nth(2);
    public readonly buttonCreerModifierEmballage= this.page.locator('.sigale-page-footer button').nth(3);

    //-- Popin : Création d'un gestionnaire --------------------------------------------------------------------------
    public readonly pPinputGestCode             = this.page.locator('#code');
    public readonly pPinputGestDesignation      = this.page.locator('#designation');
    public readonly pPinputGestRaisonSociale    = this.page.locator('#raisonSociale');
    public readonly pPinputGestTelephone        = this.page.locator('#telephone');
    public readonly pPinputGestAdresse          = this.page.locator('#adresse');
    public readonly pPinputGestComplement       = this.page.locator('#complementAdresse');
    public readonly pPinputGestCodePostal       = this.page.locator('#codePostal');
    public readonly pPinputGestVille            = this.page.locator('#ville');
    
    public readonly pPbuttonGestEnregistrer     = this.page.locator('.popup-gestionnaire .p-dialog-footer button:not(.p-button-link)');

    public readonly pPlinkGestAnnuler           = this.page.locator('.popup-gestionnaire .p-dialog-footer button.p-button-link');
    
    //-- Popin : Création d'un type d'emballage ----------------------------------------------------------------------
    public readonly pPlistBoxTypeEmbGestionnaire=this.page.locator('select[ng-model="typeEmballage.gestionnaire"]');

    public readonly pPlisteTypeEmbGestionnaires = this.pPlistBoxTypeEmbGestionnaire.locator('option[label]');

    public readonly pPinputTypeEmbCode          = this.page.locator('input[ng-model="typeEmballage.code"]');
    public readonly pPinputTypeEmbDesignation   = this.page.locator('input[ng-model="typeEmballage.designation"]');
    public readonly pPinputTypeEmbMaxPile       = this.page.locator('input[ng-model="typeEmballage.nbEmballagesParPalette"]');

    public readonly pPbuttonTypeEmbEnregistrer  = this.page.locator('.popup-saisie-type-emballage .modal-footer button:not(.ng-hide)');

    public readonly pPtoggleTypeEmbGestStock    = this.page.locator('.gfit-switch-slider');

    public readonly pPlinkTypeEmbAnnuler        = this.page.locator('.popup-saisie-type-emballage .modal-footer a:not(.ng-hide)');    

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {} 
    
}