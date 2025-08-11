/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : STOCK
 * 
 * @author  JOSIAS SIE
 * @version 3.4
 * @since   13/01/2023
 * 
 */

import { Page} from '@playwright/test';

export class StockStock {

    //----------------------------------------------------------------------------------------------------------------    

    public readonly buttonEnregistrerInventaire= this.page.locator('[ng-click="enregistrerInventaire(false)"]');   
    public readonly buttonValiderInventaire    = this.page.locator('[ng-click="enregistrerInventaire(true)"]');
    public readonly buttonAnnulerInventaire    = this.page.locator('[ng-click="openPopupAnnulerInventaire()"]');
    public readonly buttonImprimerPourInvent   = this.page.locator('[ng-click="options.imprimerListe()"]'); 
    public readonly buttonImprimerGencods      = this.page.locator('[ng-click="options.imprimerListeGencods()"]');
    public readonly buttonDemarrerInventaire   = this.page.locator('[ng-click="demarrerInventaire()"]');         
    public readonly buttonMouvementStock       = this.page.locator('[ng-click="openPopupMouvementStock(dg.selections[0])"]');
    public readonly buttonImprimerPopover      = this.page.locator('#popover');

    public readonly messageErreur              = this.page.locator('div.feedback-error:NOT(.ng-hide)');
    public readonly messageConfirmation        = this.page.locator('[ng-show="stock.dernierInventaireValide"]');
    public readonly labelQuantiteComptee       = this.page.locator('.datagrid-quantiteComptee > input');
                
    public readonly listBoxGroupeArticle       = this.page.locator('#input-groupe');    

    public readonly inputFiltreArticle         = this.page.locator('div.entete > div.filtre > span > input');  
    public readonly inputQuantiteComptee       = this.page.locator('.datagrid-quantiteComptee > input');
    public readonly tdDernQuantiteComptee      = this.page.locator('.datagrid-derniereQuantiteComptee > span');

    public readonly dataGridStockMagasin       = this.page.locator('.stock-magasin thead th');

    public readonly tdDesignArticle            = this.page.locator('td.datagrid-article-designation');
    public readonly tdCodeArticle              = this.page.locator('td.datagrid-article-code');

    public readonly checkBoxListeArticles      = this.page.locator('.stock-magasin table td input');

    public readonly ErrorMessage               = this.page.locator('[ng-repeat="message in messagesObjectified"]');   
    
    public readonly spinner                     = this.page.locator('div.progressRingCentre:NOT(.ng-hide)');  
    public readonly pPspinner                   = this.page.locator('div.progressRingCentre'); 
    public readonly pPspinner2                  = this.page.locator('span.app-spinner'); 
    public readonly pSpinner                    = this.page.locator('div[ng-show="showProgressBarButtons"]'); 

    //-- Popin : Confirmer l'annulation de l'inventaire en cours -----------------------------------------------------
    public readonly pPbuttonOk                 = this.page.locator('p-footer > div > button');

    public readonly pPlinkAnnuler              = this.page.locator('p-footer > div > a');

    //-- Popin : Visualisation des mouvements de stock ----------------------------------------------------------------
    public readonly pPtrNatureMvt              = this.page.locator('tr.ligne-inventaire');

    public readonly pPtdNatureMvt              = this.page.locator('td.datagrid-natureDesignation span');
    public readonly pPtdDateMvt                = this.page.locator('td.datagrid-date span');

    public readonly pPlinkFermer               = this.page.locator('p-footer a');

    public readonly pPVisuDataGrid             = this.page.locator('div.visualiser-mouvements-stock-modal tr:nth-child(1) th');

    //-- Popin : Démarrage d'un inventaire ----------------------------------------------------------------------------
    public readonly popinButtonDemarrer        = this.page.locator('.popup-demarrer-inventaire.in > div.modal-footer > button');

    public readonly popinDatePicker            = this.page.locator('[ng-controller="DemarrerInventaireControleur"] i.icon-calendar');
    public readonly popinDatePickerToday       = this.page.locator('.datepicker-days table tbody tr td:NOT(.disabled)').last();
    public readonly popinLinkAnnuler           = this.page.locator('div.popup-demarrer-inventaire div.modal-footer a');

    //-----------------------------------------------------------------------------------------------------------------

    public readonly trListeArticles            = this.page.locator('.paginator > table > tbody > tr');

    public readonly divPagnination             = this.page.locator('.pagination-centered > ul > li');
    private readonly fonction                  : any;

    constructor(public readonly page: Page, fonction:any = null) {
        
        this.fonction               = fonction;

    }

    
    /**
     * 
     * @desc : Sélectionnne le groupe article
     * @param {string} article - Nom du groupe article (Exemple : 'Marée')
     * 
     */
    public async selectGroupeArticle(page:Page, article: string) {      

        const clickable  = await page.isEnabled('#input-groupe');

        if (clickable) {
            await this.fonction.clickElement(this.listBoxGroupeArticle);
            await this.listBoxGroupeArticle.selectOption({label: article});
            await this.fonction.clickElement(this.listBoxGroupeArticle);
            await this.fonction.waitTillHTMLRendered(page, 50000, false);
        }else {
            throw new Error('JS : ListBox des groupes articles non sélectionnable');
        }
    }
}