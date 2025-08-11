/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : RECOMMANDATIONS D'OUVERTURE
 * 
 * @author  JC CALVIERA
 * @version 3.5
 * @since   2024-03-20
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsRecomOuverture {

    public readonly buttonEnregistrer               = this.page.locator('div.form-btn-section button:nth-child(1)');
    public readonly buttonRegionaliser              = this.page.locator('div.form-btn-section button:nth-child(2)');    

    public readonly dataGridListeRecom              = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tr:nth-child(1) th');
    public readonly dataGridListeRecomSub           = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table th.th-type-critere'); //sub-headers
    public readonly dataGridListeRecomInputCode     = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tr:nth-child(3) th.p-frozen-column input').nth(2); //sub-sub-headers...
    public readonly dataGridListeRecomElements      = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tbody tr');

    public readonly dataGridTdCheckBox              = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tr:nth-child(1) td.center p-checkbox')//td
    public readonly dataGridTdcheckboxRegionaliser  = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tr:nth-child(1) td.center:Not(.ng-untouched) p-checkbox') //checkbox regionaliser

    public readonly listBoxGroupeArticle            = this.page.locator('p-dropdown[id="groupe-article-select"]');
    public readonly listBoxChoixGroupeArticle       = this.page.locator('p-dropdownitem li span');

    public readonly multiSelectDossierAchat         = this.page.locator('p-multiselect[id="dossier-achat-select"]'); 
    public readonly multiSelectDossierAchatItem     = this.page.locator('div.p-multiselect-panel p-multiselectitem > li > span');

 

    //--Poppin: Regionalisation ---------------------------------------------------------------------------------
    public readonly pButtonEnregistrerRegionalisat  = this.page.locator('p-footer button');
    public readonly pListBoxTypeRegionalisation     = this.page.locator('div#type-regionalisation-select');
    public readonly pListBoxTypeRegionalisationItem = this.page.locator('ul#type-regionalisation-select_list.p-dropdown-items.ng-star-inserted li ');

    public readonly pDataGridInputCodeRegionalisa   = this.page.locator('div[role="dialog"]:Not(.modal.hide)  table tr:nth-child(2)  th:Not(.ng-star-inserted) input ').nth(2); //input code
    public readonly pDataGridThCriteresRegionalisa  = this.page.locator('div[role="dialog"]:Not(.modal.hide)  table tr:nth-child(1)  th.th-type-critere  ') //sub-headers
   public readonly  pDataGridTrRegionalisaNonGrise  = this.page.locator('div[role="dialog"]:not(.modal.hide)  table tr.ng-star-inserted:not(.ligne-regionalisee)'); //rows without gray background
   public readonly  pDataGridTrRegionalisation      = this.page.locator('div[role="dialog"]:not(.modal.hide)  table tbody tr'); // all rows 
    public readonly pDataGridTdCheickBoxRegional    = this.page.locator('div[role="dialog"]:Not(.modal.hide)  table tr:first-child   td.center.ng-star-inserted p-checkbox') //td


    public readonly pChevronIconRegionalisation     = this.page.locator('div#type-regionalisation-select chevrondownicon '); //chevron icon

    public readonly spinner                         = this.page.locator('.app-spinner '); //spinner

    //--

    constructor(public readonly page: Page) {};
    
}