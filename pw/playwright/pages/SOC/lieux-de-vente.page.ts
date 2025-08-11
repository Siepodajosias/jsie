/**
 * 
 * SOCIETES PAGE > LIEUX DE VENTE
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.3
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageLieuxVente {

    public readonly buttonCreerLieuVente                       : Locator;
    //Datagrid: Liste des lieux de vente---------------------------------------------------------------------------
    public readonly dataGridCodeLieuxVente                     : Locator;
    public readonly dataGridDesignLieuxVente                   : Locator;   

    public readonly dataGridTdLieuxVente                       : Locator;
    public readonly dataGridTdNbsocieLieuxVente                : Locator;
    public readonly dataGridTdActifLieuxVente                  : Locator;
    public readonly dataGridTdValideLieuxVente                 : Locator;
    //Datagrid: Liste des codes clients---------------------------------------------------------------------------
    public readonly dataGridLieuxDeVente                       : Locator;
    public readonly dataGridCodesClient                        : Locator;

    public readonly pPopinCreationLieuVente                    : Locator;
    public readonly pPcreateListBoxEnseigne                    : Locator;
    public readonly pPcreateListBoxCanaux                      : Locator;
    public readonly pPcreateListBoxPays                        : Locator;
    public readonly pPcreateListBoxPaysItem                    : Locator;
    public readonly pPcreateListBoxRegion                      : Locator;
    public readonly pPcreateInputDesign                        : Locator;  
    public readonly pPcreateInputCodeGie                       : Locator;  
    public readonly pPcreateInputAdresse                       : Locator; 
    public readonly pPcreateInputAdresseCpt                    : Locator;  
    public readonly pPcreateInputCodePostal                    : Locator; 
    public readonly pPcreateInputVille                         : Locator;
    public readonly pPcreateInputLatitude                      : Locator;  
    public readonly pPcreateInputLongitude                     : Locator;  
    public readonly pPcreateInputAbrev                         : Locator;  
    public readonly pPcreateInputCode                          : Locator;
    public readonly pPcreateInputCodeGfit                      : Locator;
    public readonly pPcreatePrefixeEnseigne                    : Locator;   
    public readonly pPcreateCheckBoxActif                      : Locator;
    public readonly pPcreateCheckBoxOuvDim                     : Locator;
    public readonly pPcreateCheckBoxGereProsol                 : Locator;
    public readonly pPcreateLinkAnnuler                        : Locator;  
    public readonly pPcreateBtnEnregistrer                     : Locator; 
    public readonly pPcreateComboBoxList                       : Locator; 
    public readonly pPcreateDatePeackerOuv                     : Locator;  
    public readonly pPcreateDatePeackerFerm                    : Locator;  
    public readonly pPcreateDateToday                          : Locator; 
    public readonly pPcreateMultiSelectList                    : Locator; 
    public readonly pErrorMessage                              : Locator;
    public readonly pPcreateListBoxTypeLieu                    : Locator;
    public readonly pPcreateCodeSigle                          : Locator;
    public readonly tableInputFiltre                           : Locator;
    public readonly tdDesignation                              : Locator;
    public readonly iValide                                    : Locator;
    public readonly tdOuverture                                : Locator;
    public readonly spinnerLoading                             : Locator;

    constructor(page: Page){

        this.pPcreateListBoxTypeLieu    = page.locator('p-dropdown[formcontrolname="typeLieu"]');
        this.pPcreateCodeSigle          = page.locator('.p-inputgroup span.p-inputgroup-addon');
        this.buttonCreerLieuVente       = page.locator('.footerBar button span.fa-plus');

        this.tableInputFiltre           = page.locator('.col-designation input');
        this.tdDesignation              = page.locator('.p-datatable-tbody .col-designation');
        this.iValide                    = page.locator('.col-valide i');
        this.tdOuverture                = page.locator('td.col-date-ouverture');
        this.spinnerLoading             = page.locator('.app-spinner');

        //Datagrid: Liste des lieux de vente---------------------------------------------------------------------------        
        this.dataGridCodeLieuxVente     = page.locator('p-table[datakey="code"]  thead tr:nth-child(2) .col-designation input');
        this.dataGridDesignLieuxVente   = page.locator('p-table[datakey="code"]  thead tr:nth-child(2) .col-designation input');

        this.dataGridTdLieuxVente       = page.locator('p-table[datakey="code"] tr.p-element.p-selectable-row.ng-star-inserted');
        this.dataGridTdNbsocieLieuxVente= page.locator('td.text-right.col-nb-societes');
        this.dataGridTdActifLieuxVente  = page.locator('td.text-center.col-actif');
        this.dataGridTdValideLieuxVente = page.locator('td.text-center.col-valide');
        //Datagrid: Liste des codes clients---------------------------------------------------------------------------
        this.dataGridLieuxDeVente       = page.locator('p-table[datakey="code"] tr:nth-child(1) th');
        this.dataGridCodesClient        = page.locator('p-table[sortfield="rayon.code"] tr:nth-child(1) th');


        // Poppin: Création d'un lieu de vente--------------------------------------------------------------------------
        this.pPcreateListBoxEnseigne    = page.locator('p-dropdown[formcontrolname="enseigne"]');
        this.pPcreateListBoxCanaux      = page.locator('p-multiselect[formcontrolname="canauxVente"]');
        this.pPcreateListBoxPays        = page.locator('p-dropdown[formcontrolname="pays"]');
        this.pPcreateListBoxPaysItem    = page.locator('li.p-dropdown-item');
        this.pPcreateListBoxRegion      = page.locator('p-dropdown[formcontrolname="region"]');
        
        this.pPcreateInputDesign        = page.locator('[formcontrolname="designation"]');
        this.pPcreateInputCodeGie       = page.locator('[formcontrolname="codeGie"]');
        this.pPcreateInputAdresse       = page.locator('[formcontrolname="adresse1"]');
        this.pPcreateInputAdresseCpt    = page.locator('[formcontrolname="adresse2"]');
        this.pPcreateInputCodePostal    = page.locator('[formcontrolname="codePostal"]');
        this.pPcreateInputVille         = page.locator('[formcontrolname="ville"]');
        this.pPcreateInputLatitude      = page.locator('[formcontrolname="latitude"]');
        this.pPcreateInputLongitude     = page.locator('[formcontrolname="longitude"]');
        this.pPcreateInputAbrev         = page.locator('[formcontrolname="abreviation"]');
        this.pPcreateInputCode          = page.locator('.autocomplete input');
        this.pPcreateInputCodeGfit      = page.locator('[formcontrolname="codeGfit"]');
        this.pPcreatePrefixeEnseigne    = page.locator('span.prefixe-enseigne');

        this.pPcreateCheckBoxActif      = page.locator('p-checkbox#actif checkicon');
        this.pPcreateCheckBoxOuvDim     = page.locator('p-checkbox#ouverture_dimanche checkicon');
        this.pPcreateCheckBoxGereProsol = page.locator('div.marge-actif p-checkbox checkicon').nth(1);

        this.pPcreateLinkAnnuler        = page.locator('p-footer button.p-button-link');

        this.pPcreateBtnEnregistrer     = page.locator('p-footer button.p-button:NOT(.p-button-link)'); 

        this.pPcreateComboBoxList       = page.locator('button.dropdown-item.ng-star-inserted');

        this.pPcreateDatePeackerOuv     = page.locator('p-calendar[formcontrolname="dateOuverture"] span.pi-calendar');
        this.pPcreateDatePeackerFerm    = page.locator('p-calendar[formcontrolname="dateFermeture"] span.pi-calendar');
        this.pPcreateDateToday          = page.locator('td.p-datepicker-today');
        
        this.pPcreateMultiSelectList    = page.locator('.p-multiselect-items-wrapper div.p-checkbox-box');
        this.pErrorMessage              = page.locator('div.alert.alert-danger.alert-dismissable.alert-error');
    }
}

