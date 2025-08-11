/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * onglet   : GROUPES DE MAGASINS
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from '@playwright/test';

export class AutorisationsGroupeMagasins {

    public readonly buttonCreerGroupe      = this.page.locator('.form-btn-section .containerBT > button').nth(0);
    public readonly buttonModifierGroupe   = this.page.locator('.form-btn-section .containerBT > button').nth(1);
    public readonly buttonEnregistrer      = this.page.locator('.form-btn-section .containerBT > button').nth(2);
    public readonly buttonRenseignerType   = this.page.locator('div.form-btn-section button:nth-child(4)');

    public readonly listBoxRayon           = this.page.locator('#input-groupe');
    public readonly listBoxFiltreSecteur   = this.page.locator('.filtres-list p-multiselect.secteur-prosol');
    public readonly listBoxFiltreRegProsol = this.page.locator('.filtres-list p-multiselect.region-prosol');
    public readonly listBoxFiltreRegGeo    = this.page.locator('.filtres-list p-multiselect.region-geographique');
    public readonly listBoxFiltreEnseigne  = this.page.locator('p-multiselect.enseigne');

    public readonly inputCodeArticle       = this.page.locator('.filtres > span > input');
    public readonly inputFiltreMagasin     = this.page.locator('autocomplete.display');

    public readonly dataGridListeGroupes   = this.page.locator('div.selection-groupe-magasin th');      
    public readonly dataGridlistMagasin    = this.page.locator('div.liste-magasin th');     
    
    public readonly checkBoxMasquerInactif = this.page.locator('#toggle-actif');
    public readonly checkBoxGroupeMagasins = this.page.locator('div.selection-groupe-magasin tbody > tr');
    public readonly checkBoxListeMagasins  = this.page.locator('#dg-magasins-assortiments td input');
    public readonly checkBoxListMagasins   = this.page.locator('#magasins-dg tbody tr');

    public readonly spinner                = this.page.locator('div.p-datatable-loading-overlay');

    //-- POPIN : Création d'un groupe de magasins --------------------------------------------------------------------
    public readonly pPinputDesignation     = this.page.locator('form .control-group input[type="text"]');
    public readonly pPlistBoxType          = this.page.locator('form .control-group select[id="input-type"]');

    public readonly pPcheckBoxActif        = this.page.locator('#input-actif');

    public readonly pPbuttonEnregistrer    = this.page.locator('div.p-dialog-footer button');
    public readonly pPbuttonFermer         = this.page.locator('div.p-dialog-footer a');
    //-----------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {};

}