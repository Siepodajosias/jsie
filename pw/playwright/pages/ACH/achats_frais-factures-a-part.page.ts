/**
 * Appli    : ACHATS 
 * Page     : ACHATS
 * Onglet   : FRAIS FACTURES A PART
 * 
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAchFraiFac {

    public readonly spinner                     : Locator;

    public readonly buttonRechercher            : Locator;   //('vue-prestation-wrapper div.filtres-container button:NOT(.p-button-icon-only):NOT(.btn-link)');    
    public readonly buttondatePicker            : Locator;   //('vue-prestation-wrapper div.filtres-container button.p-button-icon-only');    
    public readonly buttonAcheterDesFrais       : Locator;   //('footer button').nth(0);    
    public readonly buttonModifierDesFrais      : Locator;   //('footer button i.fa-pencil-alt');    
    public readonly buttonRepartirLesFrais      : Locator;   //('footer button i.fa-sliders-h');  

    public readonly listBoxAcheteurs            : Locator;   //('p-dropdown.acheteurs');

    public readonly inputDesignFournisseur      : Locator;   //('app-autocomplete');
    public readonly inputNumFacture             : Locator;   //('numero-bl');
    //public readonly inputFiltreBL               : Locator;   //('th input.ng-dirty');
    public readonly inputFiltreBL               : Locator;   //('th input').nth(7);

    public readonly dataGridAchats              : Locator;   //('table thead tr:nth-child(1) th');

    public readonly trLignesFrais               : Locator;   //('div.p-datatable-scrollable-body tr');

    public readonly thHeaderNumAchat            : Locator;   //('th[psortablecolumn="numero"]');

    //-- Popin : Création d'un achat de prestation --------------------------------------------------------------------------------
    public readonly pPcreachaButtonCreerAchat   : Locator;   //('achat-prestation-modal p-footer button:NOT(.p-button-link)');
    public readonly pPcreachaButtonAjouter      : Locator;   //('achat-prestation-modal div.fieldset-saisie-frais button');
    public readonly pPcreachaButtonValider      : Locator;   //('button span.fa-check');

    public readonly pPcreachaLinkAnnuler        : Locator;   //('achat-prestation-modal p-footer button.p-button-link');

    public readonly pPcreachaDatePicker         : Locator;   //('achat-prestation-modal button.p-datepicker-trigger');

    public readonly pPcreachaInputFournisseur   : Locator;   //('achat-prestation-modal app-autocomplete input');
    public readonly pPcreachaInputNumBL         : Locator;   //('input[formcontrolname="numeroBL"]');
    public readonly pPcreachaInputMontant       : Locator;   //('input[formcontrolname="montant"]');
    public readonly pPcreachaInputMontantModif  : Locator;   //('div.tableau-frais input[formcontrolname="montant"]');

    public readonly pPcreachaListBoxAcheteur    : Locator;   //('p-dropdown[formcontrolname="acheteur"]');
    public readonly pPcreachaListBoxPtfRecep    : Locator;   //('p-dropdown[formcontrolname="plateformeReception"]');
    public readonly pPcreachaListBoxTypeFrais   : Locator;   //('p-dropdown[formcontrolname="typeFrais"]');

    public readonly pPcreachaTdToday            : Locator;   //('td.p-datepicker-today');
    public readonly pPcreachaTdListeDatas       : Locator;   //('div.tableau-frais tbody td');
    public readonly pPcreachaTdActions          : Locator;   //('div.tableau-frais td.col-actions');

    public readonly pPcreachaPictoModifier      : Locator;   //('div.tableau-frais td.col-actions i.fa-pencil-alt');

    //--

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.spinner                    = page.locator('div.p-datatable-loading-overlay');

        this.buttonRechercher           = page.locator('vue-prestation-wrapper div.filtres-container button:NOT(.p-button-icon-only):NOT(.btn-link)');    
        this.buttondatePicker           = page.locator('vue-prestation-wrapper div.filtres-container button.p-button-icon-only');    
        this.buttonAcheterDesFrais      = page.locator('footer button').nth(0);    
        this.buttonModifierDesFrais     = page.locator('footer button i.fa-pencil-alt');    
        this.buttonRepartirLesFrais     = page.locator('footer button i.fa-sliders-h');  
    
        this.listBoxAcheteurs           = page.locator('p-dropdown.acheteurs');
    
        this.inputDesignFournisseur     = page.locator('app-autocomplete');
        this.inputNumFacture            = page.locator('#numero-bl');
        this.inputFiltreBL              = page.locator('th input').nth(7);
    
        this.dataGridAchats             = page.locator('table thead tr:nth-child(1) th');
    
        this.trLignesFrais              = page.locator('tbody.p-datatable-tbody tr');// //('div.p-datatable-scrollable-body tr')
    
        this.thHeaderNumAchat           = page.locator('th[psortablecolumn="numero"]');
    
        //-- Popin : Création d'un achat de prestation --------------------------------------------------------------------------------
        this.pPcreachaButtonCreerAchat  = page.locator('achat-prestation-modal p-footer button:NOT(.p-button-link)');
        this.pPcreachaButtonAjouter     = page.locator('achat-prestation-modal div.fieldset-saisie-frais button');
        this.pPcreachaButtonValider     = page.locator('button span.fa-check');
    
        this.pPcreachaLinkAnnuler       = page.locator('achat-prestation-modal p-footer button.p-button-link');
    
        this.pPcreachaDatePicker        = page.locator('achat-prestation-modal button.p-datepicker-trigger');
    
        this.pPcreachaInputFournisseur  = page.locator('achat-prestation-modal app-autocomplete input');
        this.pPcreachaInputNumBL        = page.locator('input[formcontrolname="numeroBL"]');
        this.pPcreachaInputMontant      = page.locator('input[formcontrolname="montant"]');
        this.pPcreachaInputMontantModif = page.locator('div.tableau-frais input[formcontrolname="montant"]');
    
        this.pPcreachaListBoxAcheteur   = page.locator('p-dropdown[formcontrolname="acheteur"]');
        this.pPcreachaListBoxPtfRecep   = page.locator('p-dropdown[formcontrolname="plateformeReception"]');
        this.pPcreachaListBoxTypeFrais  = page.locator('p-dropdown[formcontrolname="typeFrais"]');
    
        this.pPcreachaTdToday           = page.locator('td.p-datepicker-today');
        this.pPcreachaTdListeDatas      = page.locator('div.tableau-frais tbody td');
        this.pPcreachaTdActions         = page.locator('div.tableau-frais td.col-actions');
    
        this.pPcreachaPictoModifier     = page.locator('div.tableau-frais td.col-actions i.fa-pencil-alt');

    }

}