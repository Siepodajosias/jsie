/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : DOSSIERS D'ACHAT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.4
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefDosAch {

    public readonly buttonReaffecterArticle         : Locator;
    public readonly buttonCreerDossier              : Locator;  
    public readonly buttonModifierDossier           : Locator;  
    public readonly buttonSupprimerDossierVide      : Locator;  

    public readonly listBoxDossierAchat             : Locator; 

    public readonly inputFiltreArticle              : Locator;  
    public readonly inputFiltreFournisseur          : Locator;   

    public readonly dataGridDossierAchat            : Locator;  
    public readonly dataGridDossierAchatElements    : Locator;  
    public readonly dataGridDossierAchatCode        : Locator;   

    public readonly dataGridNomDossier              : Locator;  
    public readonly dataGridDesignArticle           : Locator;  
    public readonly dataGridPtfDistrib              : Locator;  

    public readonly checkBoxListeArticles           : Locator;   

    public readonly spinner                         : Locator;   

    //-- Popin : Création d'un dossier d'achat -------------------------------------------------------------------------------------
    public readonly pInputNomDossier                : Locator;   

    public readonly pListBoxResponsable             : Locator;   
    public readonly pListBoxResponsableItem         : Locator;

    public readonly pButtonEnregistrerDossier       : Locator;   

    public readonly pLinkAnnulerDossier             : Locator;   

    public readonly pFeedBackErrorDossier           : Locator;   
    public readonly pFeedBackErrorPictoClose        : Locator;

    //-- Popin : Changement de dossier d'achat -------------------------------------------------------------------------------------
    public readonly pButtonEnregistrerChangement    : Locator;   

    public readonly pListBoxNomDossierAchat         : Locator;   

    //-- Popin : Suppression d'un dossier d'achat vide -----------------------------------------------------------------------------
    public readonly pButtonSupprimerDossierVide     : Locator;   
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {

        this.buttonReaffecterArticle        = page.locator('[ng-click="reaffecterArticles(dg.selection)"]');
        this.buttonCreerDossier             = page.locator('[ng-click="creerDossierAchat()"]');
        this.buttonModifierDossier          = page.locator('[ng-click="modifierDossierAchat(filtreDossierAchat)"]');
        this.buttonSupprimerDossierVide     = page.locator('[ng-click="supprimerDossierAchat(filtreDossierAchat)"]');        
    
        this.listBoxDossierAchat            = page.locator('select[name="designationDossier"]'); 
    
        this.inputFiltreArticle             = page.locator('.filtre-article-input > input');
        this.inputFiltreFournisseur         = page.locator('.filtre-fournisseur-input');
    
        this.dataGridDossierAchat           = page.locator('.table-dossiers-achat th');
        this.dataGridDossierAchatElements   = page.locator('.table-dossiers-achat tbody tr');
        this.dataGridDossierAchatCode       = page.locator('.table-dossiers-achat tbody tr td:nth-child(2)');
    
        this.dataGridNomDossier             = page.locator('td.datagrid-designationDossierAchat');
        this.dataGridDesignArticle          = page.locator('td.datagrid-designationArticle');
        this.dataGridPtfDistrib             = page.locator('td.datagrid-designationPlateforme');
    
        this.checkBoxListeArticles          = page.locator('.table-dossiers-achat td input');

        this.spinner                        = page.locator('div.progressRingCentre');
    
        //-- Popin : Création d'un dossier d'achat -------------------------------------------------------------------------------------
        this.pInputNomDossier               = page.locator('#designationDossierAchat');
    
        this.pListBoxResponsable            = page.locator('#acheteur');
        this.pListBoxResponsableItem        = page.locator('ul p-dropdownitem li');
    
        this.pButtonEnregistrerDossier      = page.locator('p-footer button.btn-enregistrer');
    
        this.pLinkAnnulerDossier            = page.locator('p-footer button.p-button-link');    
    
        this.pFeedBackErrorDossier          = page.locator('div.alert-danger:NOT(.ng-hide)');

        this.pFeedBackErrorPictoClose       = page.locator('alert[nom="editionDossierAchatModalAlert"] i.fa-times');
    
        //-- Popin : Changement de dossier d'achat -------------------------------------------------------------------------------------
        this.pButtonEnregistrerChangement   = page.locator('.p-dialog-footer button[type="button"]:not(.p-button-link)');
    
        this.pListBoxNomDossierAchat        = page.locator('#selection-dossier-reaffectation-articles');
    
        //-- Popin : Suppression d'un dossier d'achat vide -----------------------------------------------------------------------------
        this.pButtonSupprimerDossierVide    = page.locator('suppression-dossier-achat-modal-wrapper button.btn-enregistrer');

    }

}