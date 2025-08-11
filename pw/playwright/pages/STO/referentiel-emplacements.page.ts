/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : EMPLACEMENTS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.11
 * 
 */


import { Page } from "@playwright/test";

export class ReferentielEmplacements{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonZones                = this.page.locator('button em.icon-th-large');
    public readonly buttonAllees               = this.page.locator('button em.icon-align-justify');
    public readonly buttonEmplacements         = this.page.locator('button em.icon-th');
    public readonly buttonRecalculerOrdre      = this.page.locator('button em.icon-resize-vertical');

    //-- Hover Zones
    public readonly buttonCreerZone            = this.page.locator('button em.pi-plus');
    public readonly buttonModifierZone         = this.page.locator('button em.pi-pencil');
    public readonly buttonSupprimerZone        = this.page.locator('button em.pi-times');     

    //-- Hover Allees
    public readonly buttonCreerAllee           = this.page.locator('button em.pi-plus');
    public readonly buttonModifierAllee        = this.page.locator('button em.pi-pencil');
    public readonly buttonSupprimerAllee       = this.page.locator('button em.pi-times');    
       
    //-- Hover Emplacements
    public readonly buttonCreerEmplacemt       = this.page.locator('button em.pi-plus');
    public readonly buttonModifierEmplacemt    = this.page.locator('button em.pi-pencil');
    public readonly buttonSupprimerEmplacemt   = this.page.locator('button em.pi-times');       

    public readonly dataGridZones              = this.page.locator('app-table-zones tr:nth-child(1) th');

    public readonly tdLibelleZones             = this.page.locator('td.colonne-designation');

    //-- Popin "Création d'une zone" --------------------------------------------------------------------------------
    public readonly pPopin                     = this.page.locator('.modal-backdrop');

    public readonly pButtonEnregistrer         = this.page.locator('div.p-dialog-footer p-button button:NOT(.p-button-link)');
    public readonly buttonConfirmer            = this.page.locator('.p-dialog-footer .p-confirm-dialog-accept');

    public readonly pLinkAnnuler               = this.page.locator('div.p-dialog-footer p-button button.p-button-link');

    public readonly pPdropdownZone             = this.page.locator('p-dropdown#zone');
    public readonly pPdropdownZoneAlleeItems   = this.page.locator('p-dropdownitem li[role="option"]');
    public readonly pPdropdownAllee            = this.page.locator('p-dropdown#allee');
    public readonly pDropdownOrdreAffichage    = this.page.locator('#ordreAffichage');
    public readonly pDropdownOrdreAffichItems  = this.page.locator('.p-autocomplete-item');
    public readonly pDropdownCategorie         = this.page.locator('p-dropdown#categorie');
    public readonly pDropdownUsage             = this.page.locator('p-dropdown#usage');
    public readonly pDropdownNiveau            = this.page.locator('p-dropdown#niveau');

    public readonly pSvgClear                  = this.page.locator('svg.p-dropdown-clear-icon');

    public readonly pSwitchButtonDimPerso      = this.page.locator('#dimensionsPersonnalisees .p-inputswitch'); 
    public readonly pLiCategorie               = this.page.locator('#categorie_list li');
    public readonly pLiUsage                   = this.page.locator('#usage_list li');

    public readonly pInputCategorieUsage       = this.page.locator('input.p-dropdown-filter');
    public readonly pInputDesignation          = this.page.locator('#designationZone');
    public readonly pInputDesignationAllee     = this.page.locator('#designationAlleeStockage');
    public readonly pInputEmplacement          = this.page.locator('#designationEmplacement');    
    public readonly pInputCapaciteMax          = this.page.locator('#capaciteMax');
    public readonly pInputActif                = this.page.locator('#actif');
    public readonly pInputLongueur             = this.page.locator('input#longueur');
    public readonly pInputLargeur              = this.page.locator('input#largeur');
    public readonly pInputHauteur              = this.page.locator('input#hauteur');    
    public readonly inputFiedDesignation       = this.page.locator('th.colonne-designation .sigale-input-container input');

    public readonly trListeZoneAlleeEmplacement= this.page.locator('.p-datatable-table .p-datatable-tbody tr.p-selectable-row');
    public readonly trListeEmplacement         = this.page.locator('app-table-emplacements tr.p-selectable-row');

    public readonly iconModifier               = this.page.locator('i[title="Modifier"]');
    public readonly iconSupprimer              = this.page.locator('i[title="Supprimer"]');
    public readonly iconSupprimerAllee         = this.page.locator('em[title="Supprimer"]');
    public readonly iconClear                  = this.page.locator('tr.second-line .clear-icon');
    public readonly iconModifierEm             = this.page.locator('em[title="Modifier"]');    

    public readonly pPspinner                  = this.page.locator('.app-spinner');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {} 

}