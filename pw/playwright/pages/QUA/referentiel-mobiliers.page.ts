/**
 * Appli    : QUALITE
 * PAGE     : REFERENTIEL
 * Onglet   : QUESTIONNAIRES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ReferentielMobiliers {

    public readonly listBoxLieuVente                : Locator; //('.selection-lieu-vente [role="button"]');

    public readonly inputLieuVente                  : Locator; //('div.p-dropdown-header div.p-dropdown-filter-container');
    public readonly pdropdownLieuVente              : Locator; //('p-dropdownitem');
   
    public readonly datagridMobiliers               : Locator; //('.p-datatable-scrollable');
    public readonly datagridheadMobiliers           : Locator; 
    public readonly datagridInputEquipe             : Locator; //('#filtre-equipe');
    public readonly datagridInputUnivers            : Locator; //('#filtre-univers');
    public readonly datagridInputMobiliers          : Locator; //('#filtre-mobilier');
    public readonly datagridInputNbreElement        : Locator; //('#filtre-nb-elements');

    public readonly buttonGererlesUnivers           : Locator; //('.footerBar > :nth-child(1)'); 
    public readonly buttonGererlesElement           : Locator; //('.footerBar > :nth-child(2)');   
  
    public readonly checkboxMobiliers               : Locator; 

    //-- POPIN: GERER LES UNIVERS -------------------------------------------------------------------------//
    public readonly pPGuvPopinGestiondesUnivers      : Locator; //('.p-dialog-content');
    
    public readonly pPGuvListboxEquipe               : Locator; //('#selectionEquipe [role="button"]');
    
    public readonly pPGuvInputNouvelUnivers          : Locator; //('.univers-input input[type="text"]');

    public readonly pPGuvbuttonAjouterUnivers        : Locator; //('.univers-input > button[icon="pi pi-plus"]');
    public readonly pPGuvbuttonEnregistrerUnivers    : Locator; //('div.p-dialog-footer button:not(.p-button-text)').nth(0);
    public readonly pPGuvbuttonEnregistreFermer      : Locator; //('div.p-dialog-footer button:not(.p-button-text)').nth(1);
    public readonly pPGuvbuttonAnnuler               : Locator; //('div.p-dialog-footer .p-button-text');

    public readonly pPGuvTreeContainerUnivers        : Locator; //('div.tree-container p-tree');
    
    //-- POPIN: GERER LES ELEMENTS--------------------------------------------------------------------------//
    public readonly pPGelPopinGestiondesElements     : Locator; //('.p-dialog-content');
    
    public readonly pPGelbuttonAjouterElements       : Locator; //('div.element-node button[icon="pi pi-plus"]');
    
    public readonly pPGelbuttonEnregistrer           : Locator; //('div.p-dialog-footer button:not(.p-button-text)');
    public readonly pPGelbuttonAnnuler               : Locator; //('div.p-dialog-footer .p-button-text');

    public readonly pPGelListboxEquipe               : Locator; //('#selectionEquipe [role="button"]');

    constructor(page: Page) {

        this.listBoxLieuVente                = page.locator('.selection-lieu-vente [role="button"]');

        this.inputLieuVente                   = page.locator('.p-dropdown-header input.p-dropdown-filter');//('div.p-dropdown-header div.p-dropdown-filter-container');
        this.pdropdownLieuVente               = page.locator('p-dropdownitem');
        
        this.datagridMobiliers               = page.locator('.p-datatable-scrollable');
        this.datagridheadMobiliers           = page.locator('table thead tr:nth-child(1) th');
        this.datagridInputEquipe             = page.locator('#filtre-equipe');
        this.datagridInputUnivers            = page.locator('#filtre-univers');
        this.datagridInputMobiliers          = page.locator('#filtre-mobilier');
        this.datagridInputNbreElement         = page.locator('#filtre-nb-elements');
     
        this.buttonGererlesUnivers           = page.locator('.footerBar > :nth-child(1)'); 
        this.buttonGererlesElement           = page.locator('.footerBar > :nth-child(2)');   
       
        this.checkboxMobiliers               = page.locator('p-tablecheckbox div.p-checkbox-box'); 
     
        //-- POPIN: GERER LES UNIVERS -------------------------------------------------------------------------//
        this.pPGuvPopinGestiondesUnivers      = page.locator('.p-dialog-content');
        
        this.pPGuvListboxEquipe               = page.locator('#selectionEquipe [role="button"]');
        
        this.pPGuvInputNouvelUnivers          = page.locator('.univers-input input[type="text"]');
     
        this.pPGuvbuttonAjouterUnivers        = page.locator('.univers-input > button[icon="pi pi-plus"]');
        this.pPGuvbuttonEnregistrerUnivers    = page.locator('div.p-dialog-footer button:not(.p-button-text)').nth(0);
        this.pPGuvbuttonEnregistreFermer      = page.locator('div.p-dialog-footer button:not(.p-button-text)').nth(1);
        this.pPGuvbuttonAnnuler               = page.locator('div.p-dialog-footer .p-button-text');
     
        this.pPGuvTreeContainerUnivers        = page.locator('div.tree-container p-tree');
        
        //-- POPIN: GERER LES ELEMENTS--------------------------------------------------------------------------//
        this.pPGelPopinGestiondesElements     = page.locator('.p-dialog-content');
        
        this.pPGelbuttonAjouterElements       = page.locator('div.element-node button[icon="pi pi-plus"]');
        
        this.pPGelbuttonEnregistrer           = page.locator('div.p-dialog-footer button:not(.p-button-text)');
        this.pPGelbuttonAnnuler               = page.locator('div.p-dialog-footer .p-button-text');
     
        this.pPGelListboxEquipe               = page.locator('#selectionEquipe [role="button"]');
        
    }

}

