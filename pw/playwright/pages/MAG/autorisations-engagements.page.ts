/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : ENGAGEMENTS
 * 
 * @author JOSIAS SIE
 * @version 3.4
 * 
 */

import { Page } from '@playwright/test';

export class AutorisationsEngagements {

    public readonly buttonSupprimerLigne   = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(0);
    public readonly buttonModifierLigne    = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(1);
    public readonly buttonCloner           = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(2);
    public readonly buttonSupprimerMagasins= this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(3);    
    public readonly buttonReinitLignes     = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(4);    
    public readonly buttonReinitGlobale    = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(5);    
    public readonly buttonTransfertQantite = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(6);    
    public readonly buttonBasculeCmdeFerme = this.page.locator('div.form-btn-section button:NOT(.bouton-overlay)').nth(7);    
    public readonly buttonClonerAssort     = this.page.locator('div.my-overlay-panel button').nth(0);
    public readonly buttonClonerMagasin    = this.page.locator('div.my-overlay-panel button').nth(1);
    public readonly buttonClonerEngagement = this.page.locator('div.my-overlay-panel button').nth(2);

    public readonly buttonPlus             = this.page.locator('div.autocomplete-ajout-article button i.fa-plus').nth(1);

    public readonly inputAssortiment       = this.page.locator('p-table[id="assortimentDg"] input');
    public readonly inputArticle           = this.page.locator('div.autocomplete-ajout-article.ng-star-inserted input').nth(1);
    public readonly inputReferenceDeGamme  = this.page.locator('div.autocomplete-ajout-article.ng-star-inserted input').nth(0);
    //public readonly inputAssortiment       = this.page.locator('p-table[id="assortimentDg"] th input');
    public readonly inputFamille           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(0);
    public readonly inputSousFamille       = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(1);
    public readonly inputCodeArticle       = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(2);
    public readonly inputDesignationArticle= this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(3);    

    public readonly listBoxDossierAchat    = this.page.locator('#assortiment');

    public readonly dataGridListeAssort    = this.page.locator('.assortiments-engagement th');     
    public readonly dataGridLignesAssort   = this.page.locator('p-table[id="assortimentLigneDg"] thead tr:nth-child(1) th');  

    public readonly spinner                = this.page.locator('i.app-spinner');
    public readonly spanSpinner            = this.page.locator('span.app-spinner');

    public readonly checkBoxListeAssort    = this.page.locator('p-table[id="assortimentDg"] tr.p-element');
    public readonly checkBoxListeArticles  = this.page.locator('.lignes-assortiments-engagement td input');
    public readonly checkBoxAllArticles    = this.page.locator('p-tableheadercheckbox div.p-checkbox');

    public readonly labelNbArticles        = this.page.locator('.paginator-gauche span');

    public readonly autoCompleteArticle    = this.page.locator('div.autocomplete-article app-autocomplete button.dropdown-item');

    public readonly popin                  = this.page.locator('p-dialog timesicon');

    public readonly trAssortiments         = this.page.locator('p-table[id="assortimentDg"] tr.p-element');

    //-- POPIN : Confirmer la suppression --------------------------------------------------------------------------------------------
    public readonly pPButtonOui            = this.page.locator('p-footer button:NOT(.p-button-link)');

    //-- POPIN : Copie d'un assortiment de type "centrale" vers un engagement --------------------------------------------------------
    public readonly dataGridEngagements    = this.page.locator('.engagement th');
    public readonly dataGridAutorisations  = this.page.locator('.assortiment th');

    public readonly pPbuttonCopier         = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer         = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    //-- POPIN : Enregistrement d'une ligne de l'assortiment {NomAssortiment} --------------------------------------------------------
    public readonly pPtableCeckboxArticle  = this.page.locator('p-table#assortimentLigneDg tbody tr p-tablecheckbox ');
    public readonly pPListBoxCalibre       = this.page.locator('#formLigneAssortiment select[formcontrolname="calibreSelectionne"]');    
    public readonly pPListBoxCond          = this.page.locator('#formLigneAssortiment select[formcontrolname="conditionnementSelectionne"]');

    public readonly pPCheckBoxAllMag       = this.page.locator('table-magasins thead p-checkbox');

    public readonly pDatagridIncoherence   = this.page.locator('app-contenu-alerte-engagement-transformation-impossible-en-commande');
    public readonly pButtonConfirmDataGrid = this.page.locator('div.popover-body p-footer.right button');

    public readonly pPButtonEnregsitrer    =  this.page.locator('div.p-dialog-footer button');
    //-- POPIN : Clonage des autorisations ------------------------------------------------------------------------------------------
    public readonly pPClAutButtonClonerAut = this.page.locator('p-footer button');

    public readonly pPClAutLinkAnnuler     = this.page.locator('p-footer a');
    
    public readonly pPClAutInputAssortiment= this.page.locator('div.p-dialog-content thead th input.ng-valid.ng-untouched');
    public readonly pPClAutInputLDVfrom    = this.page.locator('#lieuDeVenteSource input');
    public readonly pPClAutInputLDVto      = this.page.locator('#lieuDeVenteDestination input');

    public readonly pPClAutDataGrid        = this.page.locator('div[role="dialog"]:not(.hide) tr:nth-child(1) th.p-element');

    //-- POPIN : Clonage d'un engagement vers un autre ------------------------------------------------------------------------------
    public readonly pPClEngButtonClonerAut = this.page.locator('p-footer button');

    public readonly pPClEngLinkAnnuler     = this.page.locator('p-footer a');    

    public readonly pPClEngInputAssortiment= this.page.locator('div.p-dialog-content thead th input.ng-valid.ng-touched');
    
    public readonly pPClEngDataGrid        = this.page.locator('div[role="dialog"]:not(.hide) table:nth-child(1) tr:nth-child(1) th.p-element');

    constructor(public readonly page: Page) {}

}