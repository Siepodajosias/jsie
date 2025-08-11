/**
 * Appli    : STOCK
 * Menu     : ADMINISTRATION
 * Onglet   : CATEGORIE EMPLACEMENT
 * 
 * author JOSIAS SIE
 * 
 * @version 3.4
 * 
 */
import { Page } from "@playwright/test"

export class AdminCategorieEmplacement {
    
    public readonly buttonCreer          = this.page.locator('.sigale-page-footer button[title="Créer"]');
    public readonly buttonModifier       = this.page.locator('.sigale-page-footer button[title="Modifier"]');
    public readonly buttonClose           = this.page.locator('button.p-multiselect-close');

    public readonly dataGridCategorieEmpl= this.page.locator('sigale-table-categorie-emplacement-plateforme tr:nth-child(1) th');
    public readonly trCategorieEmpl      = this.page.locator('.p-datatable-tbody tr.p-selectable-row');

    public readonly inputFieldPlateCateg = this.page.locator('input.p-multiselect-filter');
    public readonly mutiselectPlateCateg = this.page.locator('.second-line p-multiselect');
    public readonly checkboxPlateCateg   = this.page.locator('p-multiselectitem .p-checkbox-box');
    public readonly svgClosePlateCateg   = this.page.locator('.p-multiselect-clear-icon');

    public readonly spanPlateforme       = this.page.locator('td.content-colonne-plateforme-designation span');
    public readonly spanCategorie        = this.page.locator('td.content-colonne-categorieEmplacement-designation span');
    public readonly spanLongueur         = this.page.locator('td.content-colonne-longueur span');
    public readonly spanLargeur          = this.page.locator('td.content-colonne-largeur span');
    public readonly spanHauteur          = this.page.locator('td.content-colonne-hauteur span');
    //----------------------------------------------------------------------------------------------------------------------------------
    public readonly pDropdownPlateforme  = this.page.locator('p-dropdown#plateforme');
    public readonly pDropdownCategorie   = this.page.locator('p-dropdown#categorie');
    public readonly pInputLongueur       = this.page.locator('input#longueur');
    public readonly pInputLargeur        = this.page.locator('input#largeur');
    public readonly pInputHauteur        = this.page.locator('input#hauteur');
    public readonly pInputFieldPlateCateg= this.page.locator('.p-dropdown-filter-container input');

    public readonly pCheckBoxUsagesAutorises= this.page.locator('div.usages-autorises .p-checkbox-box');
    public readonly pSpanRackDynamique      = this.page.locator('p-inputswitch#rack-dynamique span');
    public readonly pButtonEnregistrer      = this.page.locator('.p-dialog-footer button').nth(0);
    public readonly pLiPlateformeAndCateg   = this.page.locator('p-dropdownitem li.p-dropdown-item');
    constructor(public readonly page: Page) {}    
    
}
