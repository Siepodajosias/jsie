/**
 * Appli    : MAGASIN
 * Menu     : FACTURATION
 * Onglet   : BL DEFINITIFS
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */
import { Page} from '@playwright/test';

export class FacturationBlDefinitif {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerBl           = this.page.locator('[ng-click="imprimerBL(bonLivraisonSelectionne)"]');   

    public readonly datePickerFrom             = this.page.locator('#datepicker-from');
    public readonly datePickerTo               = this.page.locator('#datepicker-to');  
    public readonly datePickerPrevious         = this.page.locator('.datepicker-days tr');

    public readonly inputCritereArticle        = this.page.locator('#input-article');
    public readonly inputFiltreArticle         = this.page.locator('.filtre > span > input');
    public readonly inputLotFournBlLogistique  = this.page.locator('.filtreBonLivraison-lotOuBl > input');
    public readonly inputDLCFournisseur        = this.page.locator('#filtreBonLivraison-datepicker-dlc');
    public readonly spinnerLoading             = this.page.locator('.progressRingCentre img');
    public readonly toggleGroupe               = this.page.locator('.btn-group > button');       // 3 boutons "Tous", "Avoirs" et "Factures"
    
    public readonly listBoxGrpArticle          = this.page.locator('#input-groupe');

    public readonly dataGridListeBL            = this.page.locator('.bons-livraison div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridListeBlJournee     = this.page.locator('td.datagrid-journee'); 
    public readonly dataGridListeArticles      = this.page.locator('.lignes div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridListeArticlesQteFac= this.page.locator('td.datagrid-quantiteFacturee');        
    public readonly dataGridListeGroupeArticles= this.page.locator('.bl-definitifs .datagrid-table-wrapper tbody'); 

    constructor(public readonly page: Page) {};

}