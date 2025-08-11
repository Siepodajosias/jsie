/**
 * Appli    : STOCK
 * Page     : RECEPTION
 * Onglet   : LIVRAISONS ATTENDUES ET RECEPTIONS TERMINEES
 * 
 * @author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test";

export class ReceptionLivraisonPartielle {

    //---------------------------------------------------------------------------------------------------------------- 

    public readonly ongletLivraisonsAttendues           = this.page.locator('a[href="#attendues"]'); 
    public readonly ongletReceptionTerminer             = this.page.locator('a[href="#terminees"]');        

    public readonly dataGridReception                   = this.page.locator('datagrid tbody tr');

    public readonly inputNumeroAchat                    = this.page.locator('.filter-receptions-attendues input.filter-input');
    public readonly inputNumeroAchatReceptionTerminees  = this.page.locator('.filter-receptions-terminees input.filter-input');

    public readonly buttonDeclarerNouvelleReception     = this.page.locator('.containerBT button.btn').nth(1);
    public readonly buttonReceptionner                  = this.page.locator('popup-reception-wrapper .btn');

    public readonly spanStatutReceptionAchat            = this.page.locator('.selectionne .datagrid-statutFournisseur span');

    //-- Popin : Receptions attendues de l'achat XXXX ------------------------------------------------------------------------------
    public readonly pInputHeureArrivee          = this.page.locator('#heureArriveeCamion');
    public readonly pInputReferenceBl           = this.page.locator('.p-dropdown input.p-dropdown-label');
    public readonly pInputHeureDebutDechargement= this.page.locator('#heureDebutDechargement input');
    public readonly pInputQuantite              = this.page.locator('.quantite');
    public readonly pInputQuantiteRecu          = this.page.locator('.p-treetable-tbody > tr > td.colonne-colisRecus input');
    public readonly pInputDLC                   = this.page.locator('#dlcGlobal');
    public readonly pInputLotFournisseur        = this.page.locator('#lotFournisseurGlobal')
    public readonly pInputEmplacementGlobal     = this.page.locator('#emplacementGlobal input');
    public readonly pInputItemEmplacementGlobal = this.page.locator('.p-autocomplete-items .p-autocomplete-item').nth(0);
    public readonly pPInputArriere              = this.page.locator('#temperatureArriereCamion');
    public readonly pPInputMilieu               = this.page.locator('#temperatureMilieuCamion');
    public readonly pPInputFond                 = this.page.locator('#temperatureFondCamion');

    public readonly pListBoxTransporteur        = this.page.locator('.p-autocomplete-dropdown').nth(0);
    public readonly pListBoxQuaiAffecte         = this.page.locator('p-dropdown#quai');
    public readonly pListBoxItemQuaiAffecte     = this.page.locator('.p-dropdown-items p-dropdownitem li[role="option"]:NOT(.p-highlight)');
    public readonly pListBoxReceptionnaire1     = this.page.locator('.p-autocomplete-dropdown').nth(1);
    public readonly pListBoxItemReceptionnaire1 = this.page.locator('.p-autocomplete-items li.p-autocomplete-item').nth(0);
    public readonly pListBoxReceptionnaire2     = this.page.locator('.p-autocomplete-dropdown').nth(2);

    public readonly pTextAreaCommentaire        = this.page.locator('#commentaire');

    public readonly pOngletPaletteFournisseur   = this.page.locator('p-tabview .p-tabview .p-tabview-nav li[role="presentation"]');

    public readonly pCheckBoxSaisieEnMax        = this.page.locator('.p-checkbox-box').nth(0);

    public readonly pButtonAppliquer            = this.page.locator('#btn-appliquer');
    public readonly pButtonTerminer             = this.page.locator('#terminer-reception');
    public readonly pPbuttonRadioConformeBL     = this.page.locator('.p-radiobutton-box');
    public readonly pPbuttonImprimerTerminer    = this.page.locator('div.popover-footer p-button').nth(0);
    public readonly pPbuttonTerminer            = this.page.locator('div.popover-footer p-button').nth(1);

    public readonly pPopupTerminerReception     = this.page.locator('div.sigale-popover');

    //----------------------------------------------------------------------------------------------------------------  
    constructor(public readonly page: Page) {}   

}