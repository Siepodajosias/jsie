/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : EMBALLAGES
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefEmb {

    public readonly dataGridEmballages          : Locator;   //.all(by.css('table thead tr:nth-child(1) th');  

    public readonly buttonCreer                 : Locator;   //(by.css('footer button em.icon-plus');
    public readonly buttonModifier              : Locator;   //(by.css('footer button em.icon-pencil');
    public readonly buttonSupprimer             : Locator;   //(by.css('footer button em.fas');

    public readonly tdCodeEmballage             : Locator;

    public readonly inputLibelle                : Locator;

    public readonly toggleButtonVolumeFixe      : Locator;

    //-- Popin : Création d'un emballage -------------------------------------------------------------------------------------------
    public readonly pButtonCreer                : Locator;   //(by.css('p-footer button.btn-enregistrer');
    public readonly pButtonVider                : Locator;   //(by.css('#form-saisie-emballage .modal-footer button:not(.btn-primary)');

    public readonly pLinkAnnuler                : Locator;   //(by.css('p-footer button.p-button-link');

    public readonly pInputAbreviation           : Locator;   //(by.id('abreviation-emballage');
    public readonly pInputDesignation           : Locator;   //(by.id('designation-emballage');
    public readonly pInputFraisUnitaires        : Locator;   //(by.id('frais-unitaire-emballage');
    public readonly pInputLongueur              : Locator;
    public readonly pInputLargeur               : Locator;
    public readonly pInputHauteur               : Locator;

    public readonly pCheckBoxVolumeFixe         : Locator;   //(by.id('volume-fixe-emballage');

    public readonly pFeedBackMessage            : Locator;

    //-- Popin : Suppression d'un emballage ---------------------------------------------------------------------------
    public readonly pButtonSupprimer            : Locator;
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {
        
        this.dataGridEmballages         = page.locator('table thead tr:nth-child(1) th');  

        this.buttonCreer                = page.locator('footer button em.icon-plus');
        this.buttonModifier             = page.locator('footer button em.icon-pencil');
        this.buttonSupprimer            = page.locator('footer button em.fas');

        this.tdCodeEmballage            = page.locator('tbody tr td:nth-child(1)');

        this.inputLibelle               = page.locator('p-columnfilter[field="designation"] input');
    
        this.toggleButtonVolumeFixe     = page.locator('p-inputswitch[formcontrolname="volumeFixe"]');

        //-- Popin : Création d'un emballage -------------------------------------------------------------------------------------------
        this.pButtonCreer               = page.locator('p-footer button.btn-enregistrer');
        this.pButtonVider               = page.locator('#form-saisie-emballage .modal-footer button:not(.btn-primary)');
    
        this.pLinkAnnuler               = page.locator('p-footer button.p-button-link');
    
        this.pInputAbreviation          = page.locator('#abreviation-emballage');
        this.pInputDesignation          = page.locator('#designation-emballage');
        this.pInputFraisUnitaires       = page.locator('#frais-unitaire-emballage');
        this.pInputLongueur             = page.locator('input[id="longueur-emballage"]');
        this.pInputLargeur              = page.locator('input[id="largeur-emballage"]');
        this.pInputHauteur              = page.locator('input[id="hauteur-emballage"]');
    
        this.pCheckBoxVolumeFixe        = page.locator('#volume-fixe-emballage');
    
        this.pFeedBackMessage           = page.locator('alert[nom="emballageModalAlert"] div.alert-error');

            //-- Popin : Suppression d'un emballage ---------------------------------------------------------------------------
        this.pButtonSupprimer           = page.locator('p-footer button:NOT(.p-button-link)');
   
    }

}