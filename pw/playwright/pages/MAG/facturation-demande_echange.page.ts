/**
 * Appli    : MAGASIN
 * Page     : FACTURATION
 * Onglet   : DEMANDE D'ECHANGE
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page} from '@playwright/test';

export class FacturationDemandeEchange {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimer             = this.page.locator('[ng-click="imprimerDemandeEchange(dgDemandesEchangeOrigine.selections)"]');   
    public readonly buttonCreer                = this.page.locator('[ng-click="creationDemandeEchange()"]');   

    public readonly datePickerFrom             = this.page.locator('#datepicker-from');
    public readonly datePickerTo               = this.page.locator('#datepicker-to');  

    public readonly inputArticleFromMag        = this.page.locator('.filtre-origine > span > input'); 
    public readonly inputArticleToMag          = this.page.locator('.filtre > span > input');    

    public readonly dataGridArticleFromMag     = this.page.locator('.dg-origine div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridArticleToMag       = this.page.locator('.datagrid-table-wrapper > table').nth(2).locator('thead > tr > th');         


    //-- POPIN : Création d'une demande d'échange ---------------------------------------------------------------------
    public readonly pPlistBoxGroupeArticle     = this.page.locator('#groupes-articles');
    public readonly pPlistBoxDestinataire      = this.page.locator('p-dropdown-wrapper[ng-model="destinataire"]');

    public readonly pPinputArticle             = this.page.locator('#article');
    public readonly pPinputQuantiteCedee       = this.page.locator('#quantite');

    public readonly pPdataPickerLivraison      = this.page.locator('.popup-demande-echange .datepicker-wrapper input').nth(0);

    public readonly pPbuttonRechercherBL       = this.page.locator('#recherche-bl-echange');
    public readonly pPbuttonAjouter            = this.page.locator('[ng-click="creerDemandeEchange()"]');
    public readonly pPbuttonEnregistrer        = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer             = this.page.locator('div.modal.hide.in > div.modal-footer > a');    
    
    public readonly pPdataGridListeDemEchange  = this.page.locator('.lignes-echange th');

    constructor(public readonly page: Page) {};

}