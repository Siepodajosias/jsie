/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : CASSE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class StockCasse {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonSupprimerCasse       = this.page.locator('[ng-click="openSupprimerCasse(dgCasses.selections[0])"]');   
    public readonly buttonAjouter              = this.page.locator('[ng-click="ajouterCasse()"]');

    public readonly datePickerFrom             = this.page.locator('#datepicker-from');
    public readonly datePickerTo               = this.page.locator('#datepicker-to');    

    public readonly labelFeedBackError         = this.page.locator('.feedback-error li')
    public readonly listBoxGrpArticle          = this.page.locator('#input-groupe');
    public readonly listBoxNature              = this.page.locator('#input-nature');
    public readonly listBoxNatureOpt           = this.listBoxNature.locator('option')

    public readonly inputArticle               = this.page.locator('.filtre-groupe-article > span > input');
    public readonly inputGencod                = this.page.locator('#input-gencod');
    public readonly inputCodeArticle           = this.page.locator('#input-codeArticle');
    public readonly inputQuantite              = this.page.locator('#input-quantite');
    public readonly inputPoids                 = this.page.locator('#input-poids');

    public readonly dataGridListeCasse         =  this.page.locator('.liste-casse  th');    

    public readonly tdQuantiteEnUD             = this.page.locator('td.datagrid-quantiteUd');
    public readonly tdDesignation              = this.page.locator('td.datagrid-article-designation');
    public readonly tdListeInfoCasseLigneFirst = this.page.locator('div.liste-casse table tbody tr:nth-child(1) td');

    public readonly thHeaderDate               = this.page.locator('th[data-attribut="date"]');

    public readonly labelMontantTotalCasse     = this.page.locator('div.total-casse-don span.gras');

    //-- Popin : Confirmer suppression de la casse -------------------------------------------------------------------
    public readonly pButtonOui                 = this.page.locator('.popup-confirmer-suppression .modal-footer button');   
    
    public readonly pLinkFermer                = this.page.locator('.popup-confirmer-suppression a');

    constructor(public readonly page: Page) {};
}