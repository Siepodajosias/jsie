/**
 * Appli    : ACHATS
 * Menu     : ACHATS SUR PLACE
 * Onglet   : GROUPES DE LIVRAISON DIRECTE
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAspGld {

    public readonly buttonCreerGroupe              : Locator;   //(by.css('[ng-click="openPopupSaisieGroupeLivraisonDirecte()"]');
    public readonly buttonModifierGroupe           : Locator;   //(by.css('[ng-click="openPopupSaisieGroupeLivraisonDirecte(groupeSelectionne)"]');
    public readonly buttonEnregistrer              : Locator;   //(by.css('[ng-click="enregistrerMagasinsGroupeSelectionne()"]');

    public readonly inputCodeMagasin               : Locator;   //(by.model('filtreMagasin.value');

    public readonly dataGridGroupeLivraisonDirecte : Locator;   //.all(by.css('.groupes-livraison-directe div.datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataGridListeMagasins          : Locator;   //.all(by.css('.magasins div.datagrid-table-wrapper > table > thead > tr > th'); 

    public readonly tdDesignationMagasins          : Locator;   //.all(by.css('.magasins td.datagrid-designation');    

    //--- POPIN : Création d'un groupe de livraison directe -----------------------------------------------------------------------------------------------
    public readonly pPbuttonFermer                 : Locator;   //(by.css('div.popup-saisie-groupe-livraison-directe > div > a');
    public readonly pPbuttonEnregistrer            : Locator;   //(by.css('.modal-footer > button');

    public readonly pPinputDesignation             : Locator;   //(by.model('popupSaisieGroupeLivraisonDirecte.groupeLivraisonDirecte.designation');

    public readonly pPCheckBoxActif                : Locator;   //(by.id('input-actif');

    public readonly pPtdNomGroupe                  : Locator;   //.all(by.css('.groupes-livraison-directe td.datagrid-designation'); 

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonCreerGroupe              = page.locator('[ng-click="openPopupSaisieGroupeLivraisonDirecte()"]');
        this.buttonModifierGroupe           = page.locator('[ng-click="openPopupSaisieGroupeLivraisonDirecte(groupeSelectionne)"]');
        this.buttonEnregistrer              = page.locator('[ng-click="enregistrerMagasinsGroupeSelectionne()"]');
    
        this.inputCodeMagasin               = page.locator('[ng-model="filtreMagasin.value"]');
    
        this.dataGridGroupeLivraisonDirecte = page.locator('.groupes-livraison-directe div.datagrid-table-wrapper > table > thead > tr > th'); 
        this.dataGridListeMagasins          = page.locator('.magasins div.datagrid-table-wrapper > table > thead > tr > th'); 
    
        this.tdDesignationMagasins          = page.locator('.magasins td.datagrid-designation');    
    
        //--- POPIN : Création d'un groupe de livraison directe -----------------------------------------------------------------------------------------------
        this.pPbuttonFermer                 = page.locator('div.popup-saisie-groupe-livraison-directe > div > a');
        this.pPbuttonEnregistrer            = page.locator('.modal-footer > button');
    
        this.pPinputDesignation             = page.locator('[ng-model="popupSaisieGroupeLivraisonDirecte.groupeLivraisonDirecte.designation"]');
    
        this.pPCheckBoxActif                = page.locator('[ng-model="popupSaisieGroupeLivraisonDirecte.groupeLivraisonDirecte.actif"]');
    
        this.pPtdNomGroupe                  = page.locator('.groupes-livraison-directe td.datagrid-designation');

    }

}