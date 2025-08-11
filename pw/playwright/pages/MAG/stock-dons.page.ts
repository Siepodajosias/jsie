/**
 * Appli    : MAGASIN
 * Menu     : STOCK
 * Onglet   : DONS
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page,} from '@playwright/test';

export class StockDons {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonSupprimerDon         = this.page.locator('[ng-click="openSupprimerDon(donSelectionne())"]');   
    public readonly buttonTransformerCasse     = this.page.locator('[ng-click="openTransformerDonsEnCasses(donSelectionne())"]');   
    public readonly buttonImprimerBonRemise    = this.page.locator('[ng-click="checkAutorisationImpression(donSelectionne(), imprimerBonDeRemiseDeDons)"]');   
    public readonly buttonRenseignerBenef      = this.page.locator('[ng-click="ouvrirPopupRenseignerBeneficiaire()"]');   
    public readonly buttonImprimRecap          = this.page.locator('[ng-click="openPopupImprimerRecapitulatifDons()"]');   
    public readonly buttonDonSansBenef         = this.page.locator('[ng-click="onToggle($event, choice)"]');
    public readonly buttonAjouterDon           = this.page.locator('[ng-click="ajouterDon()"]');

    public readonly datePickerFrom             = this.page.locator('#datepicker-from');
    public readonly datePickerFromIcon         = this.page.locator('#datepicker-from .link i');
    public readonly calendarDatePickerFromIcon = this.page.locator('button > calendaricon');
    public readonly datePickerMonths           = this.page.locator('.p-datepicker-monthpicker > div.p-monthpicker > span');
    public readonly datePickerTo               = this.page.locator('#datepicker-to');  
    public readonly datePickerDays             = this.page.locator('.datepicker-days td:NOT(.old)');

    public readonly labelError                 = this.page.locator('[ng-controller="DonsControleur"]  .feedback-error');
    public readonly listBoxGrpArticle          = this.page.locator('#input-groupe');
    public readonly listBoxGrpArticleNewBenef  = this.page.locator('#input-groupe-article');
    public readonly listBoxBeneficiare         = this.page.locator('#input-beneficiaire');
    public readonly listBoxBeneficiareOption   = this.listBoxBeneficiare.locator('option');

    public readonly inputBeneficiare           = this.page.locator('div.control-group.filtre-groupe-article > span > input');
    public readonly inputCodeBarre             = this.page.locator('#input-gencod');
    public readonly inputArticle               = this.page.locator('.control-group > p > input');
    public readonly inputQuantite              = this.page.locator('#input-quantite');
    public readonly inputPoids                 = this.page.locator('#input-poids');    

    public readonly autocompleteArticle        = this.page.locator('.gfit-autocomplete-results li');

    public readonly checkBoxListeDons          = this.page.locator('tbody td input');    
    public readonly checkBoxFirstResponse      = this.page.locator('div.datagrid-table-wrapper > table > tbody > tr:nth-child(1) > td:nth-child(1) > input');
    public readonly checkBoxResponse           = this.page.locator('div.datagrid-table-wrapper > table > tbody > tr');
    
    public readonly dataGridListeDons          = this.page.locator('.liste-don div.datagrid-table-wrapper > table > thead > tr > th');

    public readonly tdNumeroBon                = this.page.locator('td.datagrid-numero');
    public readonly tdDateDon                  = this.page.locator('td.datagrid-date');
    public readonly tdBeneficiaireDon          = this.page.locator('td.datagrid-beneficiaire');
    public readonly tdGroupe                   = this.page.locator('td.datagrid-groupeArticle-designation');
    public readonly tdCodeArticle              = this.page.locator('td.datagrid-article-code');
    public readonly tdDesignationArticle       = this.page.locator('td.datagrid-article-designation');
    public readonly tdQuantiteUnitaire         = this.page.locator('td.datagrid-quantiteUnitaire');
    public readonly tdPoids                    = this.page.locator('td.datagrid-poids');
    public readonly tdDate                     = this.page.locator('.datagrid-date:NOT(.sortable)')
    public readonly trLigneDon                 = this.page.locator('tbody tr')

    // Popin: Imprimer un récapitulatif mensuel -----------------------------------------------------------------

    public readonly pPInputbeneficiaire        = this.page.locator('#select-beneficiaires');
    public readonly pPInputSociete             = this.page.locator('#select-societes');
    public readonly pPButtonImprimer           = this.page.locator('p-footer button');
    public readonly pPButtonAnnuler            = this.page.locator('p-footer a');

    //-- Popin : Choix de la période ----------------------------------------------------------------------------------
    public readonly pDatePickerChoixPeriode    = this.page.locator('.datepicker-wrapper > input.input-mini');

    public readonly pButtonImprimer            = this.page.locator('.popup-impression-recapitulatif button.btn');   

    public readonly pLinkFermer                = this.page.locator('.popup-impression-recapitulatif a');

    //--Popin : Confirmer la transformation des dons en casse --------------------------------------------------------
    public readonly pButtonTransformerOui      = this.page.locator('.popup-transformer-dons-en-casses button.btn'); 

    public readonly pLinktransformerNon        = this.page.locator('.popup-impression-recapitulatif a');
    
    constructor(public readonly page: Page) {}

}