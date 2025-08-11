/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : REFERENTIEL 
 * ONGLET   : CHEMIN DE PICKING
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefCheminPickingPage {

    public readonly  inputSearchEmplacement     : Locator;  // .locator('[ng-model="ngModel"]');  
    public readonly  inputOrdre                 : Locator;  // .locator('[ng-model="nouvellePosition.ordre"]');
    public readonly  inputAllee                 : Locator;  // .locator('#autocomplete-emplacement'); 
    public readonly  inputCodeArticle           : Locator;  // .locator('#autocomplete-article');   
    public readonly  inputSearchChemin          : Locator;

    public readonly  buttonCreerChemin          : Locator;  // .locator('[ng-click="popupCreationModificationCheminPicking()"]');
    public readonly  buttonAjouterEmplacement   : Locator;  // .locator('[ng-click="ajouterPosition(nouvellePosition)"]');    
    public readonly  buttonRecalculerOrdre      : Locator;  // .locator('[ng-click="recalculerOrdre()"]');
    public readonly  trListesChemin             : Locator;  // .locator('sigale-tab-chemin-picking .p-selectable-row td.colonne-icone sigale-checkbox') 
    public readonly  trListesArticleChemin      : Locator; 
    public readonly  dataGridListesTaches       : Locator;  // .locator('.chemin-picking .datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly  dataGridListesChemin       : Locator;  // .locator('tr.first-line > th'); 

    //-- Popin : Créer un chemin -------------------------------------------------------------------------------------------------------
    public readonly  pPopinCreerChemin          : Locator;
    public readonly  pPinputNomChemDesignation  : Locator;  // .locator('#chemin-designation');
    public readonly  pPinputNomChemOrdre        : Locator;  // .locator('#chemin-ordre');

    public readonly  pCheckBoxFusionClient      : Locator;
    
    public readonly  pPbuttonNomChemCreer       : Locator;  // .locator('.form-modifier-chemin-picking .modal-footer button:not(.ng-hide)');
    public readonly  pPbuttonAnnuler            : Locator;

    //-- Popin : Ajout d'un emplacement sur le chemin ------------------------------------------------------------------------------
    public readonly  pPautocompleteEmplacement  : Locator;    // .locator('p-autocomplete[name="emplacement"] input');
    public readonly  pPinputOrdre               : Locator;    // .locator('p-inputnumber[name="ordre"] input');
    public readonly  pPautocompleteArticle      : Locator     // .locatr('p-autocomplete[name="article"] input')

    public readonly  pPbuttonCreer              : Locator;    // .locator('div.p-dialog-footer .sigale-button');
    public readonly  pErrorMessage              : Locator;  // .locator('div.alert-error div')
    public readonly  pButtonAnnuler             : Locator;  //.locator('div.p-dialog-footer .close-link')

    constructor(page:Page) {

        this.inputSearchEmplacement     = page.locator('#filtre-designationEmplacement input');  
        this.inputOrdre                 = page.locator('#filtre-ordre input').nth(1);
        this.inputAllee                 = page.locator('#filtre-designationAllee input'); 
        this.inputCodeArticle           = page.locator('#filtre-article input');   
        this.inputSearchChemin          = page.locator('#filtre-designation input');

        this.buttonCreerChemin          = page.locator('.sigale-page-footer button').nth(0);
        this.buttonAjouterEmplacement   = page.locator('.sigale-page-footer button').nth(1);    
        this.buttonRecalculerOrdre      = page.locator('.sigale-page-footer button').nth(2);
    
        this.dataGridListesTaches       = page.locator('sigale-tab-chemin-picking tr.first-line > th'); 
        this.dataGridListesChemin       = page.locator('sigale-tab-position-article-chemin tr.first-line > th'); 

        this.trListesChemin             = page.locator('sigale-tab-chemin-picking .p-selectable-row'); 
        this.trListesArticleChemin      = page.locator('sigale-tab-position-article-chemin .p-selectable-row');

        //-- Popin : Créer un chemin -------------------------------------------------------------------------------------------------------
        this.pPopinCreerChemin          = page.locator('.modal-backdrop');
        this.pPinputNomChemDesignation  = page.locator('#designation');
        this.pPinputNomChemOrdre        = page.locator('#ordre');

        this.pCheckBoxFusionClient      = page.locator('#fusionClients');
    
        this.pPbuttonNomChemCreer       = page.locator('p-footer p-button').nth(0); //('p-footer .sigale-button');
        this.pPbuttonAnnuler            = page.locator('p-footer p-button').nth(1); //('p-footer .close-link');
        
        //-- Popin : Ajout d'un emplacement sur le chemin ------------------------------------------------------------------------------
        this.pPautocompleteEmplacement  = page.locator('p-autocomplete[name="emplacement"] input');
        this.pPinputOrdre               = page.locator('p-inputnumber[name="ordre"] input');
        this.pPautocompleteArticle      = page.locator('p-autocomplete[name="article"] input');

        this.pPbuttonCreer              = page.locator('div.p-dialog-footer p-button button:NOT(.p-button-link)');
        this.pErrorMessage              = page.locator('div.alert-error div');
        this.pButtonAnnuler             = page.locator('div.p-dialog-footer button.p-button-link');
    }
    
}