/**
 * Appli    : ACHATS
 * Menu     : HISTORIQUE
 * Onglet   : LOTS RECPTIONNES NON FACTURES
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageHisLotRec {

    public readonly listBoxGroupeArticle    : Locator;   //(by.id('select-groupe');

    public readonly datePickerRecepFrom     : Locator;   //(by.id('input-date-debut-plage');
    public readonly datePickerRecepTo       : Locator;   //(by.id('input-date-fin-plage');

    public readonly inputCodeDesignation    : Locator;
    public readonly inputFournFacture       : Locator;   
    public readonly inputFiltreArticle      : Locator;   
    public readonly inputFournissseur       : Locator;   
    public readonly inputFournFactureLot    : Locator;   
    public readonly inputAchat              : Locator;   

    public readonly buttonRechercher        : Locator; 
    public readonly buttonSolderLots        : Locator;  

    public readonly dataGridAchats          : Locator;   //.all(by.css('.tableau th');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.listBoxGroupeArticle   = page.locator('#select-groupe');

        this.datePickerRecepFrom    = page.locator('div.date-debut span i.icon-calendar');
        this.datePickerRecepTo      = page.locator('div.date-fin span i.icon-calendar');
    
        this.inputCodeDesignation   = page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur_lot');
        this.inputFournFacture      = page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur_facturant');
        this.inputFiltreArticle     = page.locator('[ng-model="filtre.article"]');
        this.inputFournissseur      = page.locator('[ng-model="filtre.fournisseur"]');
        this.inputFournFactureLot   = page.locator('[ng-model="filtre.numero"]');
        this.inputAchat             = page.locator('[ng-model="filtre.numeroAchat"]');

        this.buttonRechercher       = page.locator('[ng-click="recupererLotsReceptionnes()"]');
        this.buttonSolderLots       = page.locator('[ng-click="openPopupSolderManuellementLotsWithSelection()"]'); 
    
        this.dataGridAchats         = page.locator('datagrid thead th');


    }

}