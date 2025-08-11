/**
 * Appli    : ACHATS 
 * Page     : BESOINS MAGASIN
 * Onglet   : BESOINS MAGASIN
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageBesBesMag {

    public readonly spinner                         : Locator;

    public readonly buttonMagasinsSansCommande      : Locator;    //(by.css('button[icon="icon-eye-open icon-white"]');
    public readonly buttonAjouter                   : Locator;    //(by.css('div.ajouter-filtre-caracteristique button');
    public readonly buttonExporterBesoins           : Locator;    //(by.css('footer.form-btn-section button i.icon-file');
    public readonly buttonTransmettreBesoins        : Locator;    //(by.css('footer.form-btn-section button i.icon-share-alt');

    public readonly inputReferenceGamme             : Locator;    //.all(by.css('app-autocomplete input').nth(0);
    public readonly inputCodeArticle                : Locator;    //.all(by.css('app-autocomplete input').nth(1);
    public readonly iconClearArticle                : Locator;    //.all(by.css('app-autocomplete input').nth(1);
    public readonly inputFiltreMagasin              : Locator;    //.all(by.css('app-autocomplete input').nth(1);
    public readonly autoCompleteArticle             : Locator;    //.all(by.css('ul.gfit-autocomplete-results li');
    
    public readonly datePickerExpedition            : Locator;    //(by.id('besoins-magasin-input-date-expedition');
    public readonly datePickerSelectDay             : Locator;    //.locator('.p-datepicker-calendar-container tbody > tr > td');

    public readonly listBoxRegionGeographique       : Locator;    //(by.css('[inputid="besoins-magasin-filtre-region-geographique"]');
    public readonly listBoxRegionProsol             : Locator;    //(by.css('[inputid="besoins-magasin-filtre-region-prosol"]');
    public readonly listBoxSecteurProsol            : Locator;    //(by.css('[inputid="besoins-magasin-filtre-secteur-prosol"]');
    public readonly listBoxCaracteristiqueMag       : Locator;    //(by.css('div.ajouter-filtre-caracteristique p-dropdown');
    public readonly listBoxStrategie                : Locator;

    public readonly listBoxVentilMag                : Locator;    //(by.css('[inputid="besoins-magasin-filtre-ventilation-magasin"]'); 

    public readonly pictoViderArticle               : Locator;    //(by.css('[ng-click="viderArticle()"]');
    public readonly pictoViderMagasin               : Locator;    //(by.css('[ng-click="clearFilter()"]');

    public readonly checkBoxFiltreExterneOui        : Locator;    //.all(by.css('div.externe div.p-checkbox').nth(0);
    public readonly checkBoxFiltreExterneNon        : Locator;    //.all(by.css('div.externe div.p-checkbox').nth(1);

    public readonly dataGridBesoinMagasin           : Locator;    //.all(by.css('div.datagrid thead tr:nth-child(1) th');
    public readonly dataGridListeBesoin             : Locator;    //.all(by.css('div.datagrid thead tr:nth-child(1) th');
    public readonly iconPlateformeDistribution      : Locator;    //.chevronrighticon
    public readonly dataGridListeBesoinTotal        : Locator;    //.all(by.css('div.datagrid thead tr:nth-child(1) th');
    public readonly dataGridBesoinMagasinTotal      : Locator;    //.all(by.css('div.datagrid thead tr:nth-child(1) th'); 

    public readonly tdCommande                      : Locator;    //.all(by.css('td.datagrid-commande span');
    public readonly tdPrevision                     : Locator;    //.all(by.css('td.datagrid-previsionDeCommandeJPlus1 span');
    public readonly tdStock                         : Locator;    //.all(by.css('td.datagrid-stockMagasin span');        

    //--- Popin [Magasins n'ayant pas commandé pour la date d'expédition du {dd/mm/yyyy}] ----------------------------------------
    public readonly buttonPPFermer                  : Locator;    //(by.css('p-footer button span');

    public readonly pPspinner                       : Locator;

    //-- Popin [Choix des besoins consolidés fournisseur à transmettre] ----------------------------------------------------------
    public readonly pDataGridBesoinsConsolidesFour  : Locator;    //.all(by.css('.popup-selection-bcf th');

    public readonly pCheckBoxAllClients             : Locator;    //(by.css('thead th div.p-checkbox-box');
    public readonly pCheckBoxListeClients           : Locator;    //.all(by.css('tbody tr div.p-checkbox-box');

    public readonly pButtonEnvoyer                  : Locator;    //(by.css('p-footer button.p-button:NOT(.p-button-link)');   

    public readonly pLinkAnnuler                    : Locator;    //(by.css('p-footer button.p-button-link');

    public readonly pErrorMessage                   : Locator;    //(by.css('.alert-error');

    //--

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.spinner                        = page.locator('div.p-datatable-loading-overlay');

        this.buttonMagasinsSansCommande     = page.locator('button[icon="icon-eye-open icon-white"]');
        this.buttonAjouter                  = page.locator('div.ajouter-filtre-caracteristique button');
        this.buttonExporterBesoins          = page.locator('footer.form-btn-section button i.icon-file');
        this.buttonTransmettreBesoins       = page.locator('footer.form-btn-section button i.icon-share-alt');
    
        this.inputReferenceGamme            = page.locator('app-autocomplete input').nth(0);
        this.inputCodeArticle               = page.locator('app-autocomplete input').nth(1);
        this.iconClearArticle               = page.locator('#btn-vider-autocomplete').nth(1);
        this.inputFiltreMagasin             = page.locator('th input.p-inputtext');
        this.autoCompleteArticle            = page.locator('ul.gfit-autocomplete-results li');
        
        this.datePickerExpedition           = page.locator('#besoins-magasin-input-date-expedition');
        this.datePickerSelectDay            = page.locator('.p-datepicker-calendar-container tbody > tr > td:NOT(.p-datepicker-other-month)');
    
        this.listBoxRegionGeographique      = page.locator('[inputid="besoins-magasin-filtre-region-geographique"]');
        this.listBoxRegionProsol            = page.locator('[inputid="besoins-magasin-filtre-region-prosol"]');
        this.listBoxSecteurProsol           = page.locator('[inputid="besoins-magasin-filtre-secteur-prosol"]');
        this.listBoxCaracteristiqueMag      = page.locator('div.ajouter-filtre-caracteristique p-dropdown');
        this.listBoxStrategie               = page.locator('[inputid="besoins-magasin-filtre-strategie"]');
    
        this.listBoxVentilMag               = page.locator('[inputid="besoins-magasin-filtre-ventilation-magasin"]');
    
        this.pictoViderArticle              = page.locator('[ng-click="viderArticle()"]');
        this.pictoViderMagasin              = page.locator('[ng-click="clearFilter()"]');
    
        this.checkBoxFiltreExterneOui       = page.locator('div.externe div.p-checkbox').nth(0);
        this.checkBoxFiltreExterneNon       = page.locator('div.externe div.p-checkbox').nth(1);
    
        this.dataGridBesoinMagasin          = page.locator('div.datagrid thead tr:nth-child(1) th');
        this.dataGridListeBesoin            = page.locator('.p-treetable-tbody tr.p-element:Not(.row-parent)');
        this.iconPlateformeDistribution     = page.locator('p-treetabletoggler chevronrighticon');
        
        this.dataGridListeBesoinTotal       = page.locator('.p-treetable-tfoot td.text-end'); 
        this.dataGridBesoinMagasinTotal     = page.locator('div.datagrid thead tr:nth-child(1) th'); 
    
        this.tdCommande                     = page.locator('td.datagrid-commande span');
        this.tdPrevision                    = page.locator('td.datagrid-previsionDeCommandeJPlus1 span');
        this.tdStock                        = page.locator('td.datagrid-stockMagasin span');        
    
        //--- Popin [Magasins n'ayant pas commandé pour la date d'expédition du {dd/mm/yyyy}] ----------------------------------------
        this.buttonPPFermer                 = page.locator('p-footer button span');

        this.pPspinner                      = page.locator('span.app-spinner');
    
        //-- Popin [Choix des besoins consolidés fournisseur à transmettre] ----------------------------------------------------------
        this.pDataGridBesoinsConsolidesFour = page.locator('.popup-selection-bcf th');
    
        this.pCheckBoxAllClients            = page.locator('thead th div.p-checkbox-box');
        this.pCheckBoxListeClients          = page.locator('tbody tr div.p-checkbox-box');
    
        this.pButtonEnvoyer                 = page.locator('p-footer button.p-button:NOT(.p-button-link)');   
    
        this.pLinkAnnuler                   = page.locator('p-footer button.p-button-link');
    
        this.pErrorMessage                  = page.locator('.alert-error');

    }

}