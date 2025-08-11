/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : UNITES DE TRANSPORT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.5
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefUniTrp {

    public readonly buttonCreerUniteTransport       : Locator;   //(by.css('[ng-click="openSaisieUniteTransport()"]');
    public readonly buttonModifierUniteTransport    : Locator;   //(by.css('[ng-click="openSaisieUniteTransport(dgUnitesTransport.selection[0])"]');
    public readonly buttonSupprimerUniteTransport   : Locator;   //(by.css('[ng-click="confirmerSupprimerUniteTransport(dgUnitesTransport.selection[0])"]');
    public readonly buttonCreerParametrage          : Locator;   //(by.css('[ng-click="openSaisieParamPlateformeGroupe()"]');
    public readonly buttonModifierParametrage       : Locator;   //(by.css('[ng-click="openSaisieParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');
    public readonly buttonSupprimerParametrage      : Locator;   //(by.css('[ng-click="confirmerSupprimerParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');

    public readonly dataGridUniteTransport          : Locator;   //.all(by.css('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridUniteTransportParam     : Locator;   //.all(by.css('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');      
    
    public readonly trUniteTransportParam           : Locator;

    public readonly dataGridListeActif              : Locator;
    public readonly dataGridListeNomsUnites         : Locator;
    public readonly dataGridListeParamGroupe        : Locator;   //.all(by.css('td.datagrid-groupe-designation');
    public readonly dataGridListeParamPlateforme    : Locator;   //.all(by.css('td.datagrid-plateforme-designation');
    public readonly dataGridListeParamUniteTransp   : Locator;   //.all(by.css('td.datagrid-uniteTransport-nom');
    public readonly dataGridListeParamCoef          : Locator;   //.all(by.css('td.datagrid-coefficientFoisonnement');
    public readonly dataGridListeParamMarchandise   : Locator;   //.all(by.css('td.datagrid-natureMarchandise-designation');

    public readonly pictogramErrorMessageClose      : Locator;   //(by.css('.feedback-error button');

    public readonly errorMessage                    : Locator;

    public readonly headerCoef                      : Locator;


    //-- Popin : Création d'une unité de transport --------------------------------------------------------------------------------------------
    public readonly pPinputAddNom                   : Locator;   //(by.model('popupCreationUnite.unite.nom');
    public readonly pPinputAddVolume                : Locator;   //(by.model('popupCreationUnite.unite.volumeEnM3');

    public readonly pPbuttonAddOk                   : Locator;   //(by.css('.popup-creation-unite-transport .modal-footer button');

    public readonly pPlinkAddAnnuler                : Locator;   //(by.css('.popup-creation-unite-transport .modal-footer a');


    //-- Popin : Supprimer une unité de transport --------------------------------------------------------------------------------------------
    public readonly pPbuttonDelOk                   : Locator;   //(by.css('.popup-supprimer-unite-transport .modal-footer button');

    public readonly pPlinkDelAnnuler                : Locator;   //(by.css('.popup-supprimer-unite-transport .modal-footer a');


    //-- Popin : Suppression d'un paramétrage d'unité de transport ---------------------------------------------------------------------------
    public readonly pPbuttonDelParamOk              : Locator;   //(by.css('.popup-supprimer-param-plateforme-groupe .modal-footer button');


    //-- Popin : Création d'un paramétrage d'unité de transport ------------------------------------------------------------------------------
    public readonly pPbuttonAddParamCreer           : Locator;    

    public readonly pPLinkAddParamAnnuler           : Locator;    

    
    public readonly pPlistBoxAddItems               : Locator;
    public readonly pPlistBoxAddParamGroupe         : Locator;
    public readonly pPlistBoxAddParamUniteTransp    : Locator;
    public readonly pPlistBoxAddParamPlateforme     : Locator;
    public readonly pPlistBoxAddParamNature         : Locator;

    public readonly pPinputAddParamCoef             : Locator;

    public readonly pPcheckBoxAddParamActif         : Locator;

    //------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.buttonCreerUniteTransport      = page.locator('[ng-click="openSaisieUniteTransport()"]');
        this.buttonModifierUniteTransport   = page.locator('[ng-click="openSaisieUniteTransport(dgUnitesTransport.selection[0])"]');
        this.buttonSupprimerUniteTransport  = page.locator('[ng-click="confirmerSupprimerUniteTransport(dgUnitesTransport.selection[0])"]');
        this.buttonCreerParametrage         = page.locator('[ng-click="openSaisieParamPlateformeGroupe()"]');
        this.buttonModifierParametrage      = page.locator('[ng-click="openSaisieParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');
        this.buttonSupprimerParametrage     = page.locator('[ng-click="confirmerSupprimerParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');

        this.dataGridUniteTransport         = page.locator('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridUniteTransportParam    = page.locator('.tab-unite-transport-div-droite div.datagrid-table-wrapper > table > thead > tr > th');     

        this.trUniteTransportParam          = page.locator('.tab-unite-transport-div-droite div.datagrid-table-wrapper > table > tbody > tr');          

        this.dataGridListeActif             = page.locator('td.datagrid-actif');
        this.dataGridListeNomsUnites        = page.locator('td.datagrid-nom');
        this.dataGridListeParamGroupe       = page.locator('td.datagrid-groupe-designation');
        this.dataGridListeParamPlateforme   = page.locator('td.datagrid-plateforme-designation');
        this.dataGridListeParamUniteTransp  = page.locator('td.datagrid-uniteTransport-nom');
        this.dataGridListeParamCoef         = page.locator('td.datagrid-coefficientFoisonnement');
        this.dataGridListeParamMarchandise  = page.locator('td.datagrid-natureMarchandise-designation');

        this.pictogramErrorMessageClose     = page.locator('.feedback-error button');

        this.errorMessage                   = page.locator('div.alert:NOT(.ng-hide)');

        this.headerCoef                     = page.locator('th[data-attribut="coefficientFoisonnement"]');


        //-- Popin : Création d'une unité de transport --------------------------------------------------------------------------------------------
        this.pPinputAddNom                  = page.locator('input[formcontrolname="nom"]');
        this.pPinputAddVolume               = page.locator('input[formcontrolname="volumeEnM3"]');

        this.pPbuttonAddOk                  = page.locator('div.p-dialog-footer button.btn-enregistrer');

        this.pPlinkAddAnnuler               = page.locator('div.p-dialog-footer button.p-button-link');


        //-- Popin : Supprimer une unité de transport --------------------------------------------------------------------------------------------
        this.pPbuttonDelOk                  = page.locator('p-footer > div > button.p-button');

        this.pPlinkDelAnnuler               = page.locator('p-footer > div > p-button > button.p-button');


        //-- Popin : Suppression d'un paramétrage d'unité de transport ---------------------------------------------------------------------------
        this.pPbuttonDelParamOk             = page.locator('.p-dialog-footer button:NOT(.p-button-link)');


        //-- Popin : Création d'un paramétrage d'unité de transport ------------------------------------------------------------------------------
        this.pPbuttonAddParamCreer          = page.locator('div.p-dialog-footer p-footer button:NOT(.p-button-link)');    

        this.pPLinkAddParamAnnuler          = page.locator('div.p-dialog-footer p-footer button.p-button-link');    

        this.pPlistBoxAddItems              = page.locator('p-dropdownitem li');
        this.pPlistBoxAddParamGroupe        = page.locator('p-dropdown#groupes');
        this.pPlistBoxAddParamUniteTransp   = page.locator('p-dropdown#unitesTransport');
        this.pPlistBoxAddParamPlateforme    = page.locator('p-dropdown#plateformes');
        this.pPlistBoxAddParamNature        = page.locator('p-dropdown#natureMarchandises');

        this.pPinputAddParamCoef            = page.locator('input#coefficientFoisonnement');

        this.pPcheckBoxAddParamActif        = page.locator('p-checkbox#actif');

    }

}