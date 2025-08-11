/**
 * Appli    : MAGASIN 
 * Page     : STOCK
 * Onglet   : Implantation
 * 
 * @author JC CALVIERA
 * @version 3.3
 * 
 */
import { Page} from '@playwright/test';

export class Stockimplantation {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonEnregistrer          = this.page.locator('[ng-click="enregistrer()"]');   
    public readonly buttonPlus                 = this.page.locator('[ng-click="ajouterArticle(autocompleteArticle.article)"]');   
    public readonly buttonImprimerImplantation = this.page.locator('[ng-click="imprimer()"]');   
    public readonly buttonMonter               = this.page.locator('[ng-click="deplacerHaut()"]');   
    public readonly buttonDescendre            = this.page.locator('[ng-click="deplacerBas()"]');   
    public readonly buttonZoneCreer            = this.page.locator('[ng-click="openPopupSaisieZoneImplantation(true)"]');
    public readonly buttonZoneRenommer         = this.page.locator('[ng-click="openPopupSaisieZoneImplantation(false)"]');
    public readonly buttonZoneChanger          = this.page.locator('[ng-click="openPopupChangementZoneImplantation()"]');
    public readonly buttonZoneSupprimer        = this.page.locator('[ng-click="openPopupSuppressionZoneImplantation()"]');
    public readonly buttonDeplacerAvant        = this.page.locator('[ng-click="deplacerAvantArticleReference()"]');
    public readonly buttonDeplacerApres        = this.page.locator('[ng-click="deplacerApresArticleReference()"]');

    public readonly inputArticle               = this.page.locator('#input-article');
    public readonly inputCibleImplantation     = this.page.locator('input[ng-model="autocompleteArticleReference.display"]');
    public readonly inputPage                  = this.page.locator('input[ng-model="rechercheArticle.display"]') ;

    public readonly checkboxArticleSeul        = this.page.locator('#input-filtre-stock-obligatoire');
        
    public readonly dataGridListeImplantations = this.page.locator('.implantation-magasin th');

    public readonly tdLibelleDesignation       = this.page.locator('td.datagrid-article-designation');

    public readonly listBoxRayon               = this.page.locator('select[id="input-rayon"]'); 

    public readonly liAutocomplete             = this.page.locator('li.gfit-autocomplete-result');

    //-- POPIN : Création d'une zone d'implantation --------------------------------------------------------------------
    //-- POPIN : Renommage d'une zone d'implantation -------------------------------------------------------------------
    public readonly pPinputCreatDesignation    = this.page.locator('#zoneImplantation');

    public readonly pPbuttonCreatConfirmer     = this.page.locator('p-footer button');

    public readonly pPlinkCreatAnnuler         = this.page.locator('p-footer a');

    public readonly pPradioButtonCreatPosition = this.page.locator('div.p-radiobutton-box');

    public readonly pPlistBoxCreatPosition     = this.page.locator('#input-position-zone');

    //-- POPIN : Suppression d'une zone d'implantation -----------------------------------------------------------------
    public readonly pPbuttonSupprConfirmer     = this.page.locator('p-footer button:NOT(.p-button-link)');

    //-- POPIN : Changement de zone ------------------------------------------------------------------------------------
    public readonly pPlistBoxChangeZone        = this.page.locator('select[id="input-position-zone"]');

    public readonly pPbuttonChangeEnregistrer  = this.page.locator('div.popup-changement-zone-implantation .modal-footer button');

    public readonly popinLinkAnnuler           = this.page.locator('div.popup-demarrer-inventaire div.modal-footer a');
    
    constructor(public readonly page: Page) {};

}