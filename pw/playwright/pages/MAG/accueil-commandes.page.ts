/**
 * Appli    : MAGASIN
 * Page     : ACCUEIL
 * Onglet   : Etat des commandes
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class AccueilCommandes {

    public readonly LabelWelcomeMessage     = this.page.locator('H3');

    public readonly datePicker              = this.page.locator('div.etat-commandes p-calendar button');

    public readonly buttonActualiser        = this.page.locator('button.bouton-actualiser');

    public readonly tdListeAssortiments     = this.page.locator('td.datagrid-assortiment-designation');
    public readonly tdListeStatuts          = this.page.locator('td.datagrid-statut-designation');
    public readonly tdNombreMagasin         = this.page.locator('td.datagrid-nbMagasins');
    public readonly tdDesignationsLieuxVents= this.page.locator('td.datagrid-designation');

    public readonly lignesAssortiments      = this.page.locator('div.dg-groupes-articles tbody tr');
    public readonly lignesLieuxVents        = this.page.locator('div.magasins tbody tr');

    public readonly thHeaderAssortiments    = this.page.locator('div.table-commande th.center');
    public readonly thHeaderlieuxDeVentes   = this.page.locator('div.table-magasin th.center');


    //-- Popin ---------------------------------------------------------------------------------------------
    public readonly pPspinner               = this.page.locator('div.modal-footer img.timer:NOT(.ng-hide)');

    constructor(public readonly page: Page) {}
}