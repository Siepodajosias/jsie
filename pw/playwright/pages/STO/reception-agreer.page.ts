/**
 * Appli    : STOCK
 * Page     : RECEPTION
 * Onglet   : LOTS A AGREER
 * 
 * authors JOSIAS SIE & SIAKA KONE
 * 
 * @version 3.0
 * 
 */

import { Page } from '@playwright/test';
import { TestFunctions } from '../../utils/functions.js';

export class ReceptionAgreer{

    public fonction                            = new TestFunctions();
    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly ongletLotsAgreer           = this.page.locator('.nav-tabs > li > a').nth(3);
    
    public readonly buttonAgreer               = this.page.locator('[ng-click="openSaisieAgreage(dg.selection[0])"]');
    public readonly buttonAgreerTousLesLots    = this.page.locator('[ng-click="openAgreageParFournisseur(dg.contenu)"]');
    public readonly buttonImprimer             = this.page.locator('[ng-click="imprimerPalettesAAgreer()"]');        

    public readonly inputFiltreAcheteur        = this.page.locator('input.filter-input');

    public readonly listBoxFournisseurs        = this.page.locator('#fournisseurs');

    //public readonly checkBoxLotAgreer        = this.page.locator('div.datagrid-table-wrapper > table').nth(0).all(by.css('tbody > tr > td');
    public readonly checkBoxLotAgreer          = this.page.locator('.datagrid-wrapper td input');

    public readonly dataGridReceptions         = this.page.locator('.tab-pane div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');

    public readonly listNumeroAchat            = this.page.locator('td.datagrid-numeroAchat > span');
    public readonly listNumeroLot              = this.page.locator('td.datagrid-numero > span');
    public readonly listArticleCode            = this.page.locator('td.datagrid-article-code > span');
    

    //-- Popin : Agréage du lot XXXXXXX ------------------------------------------------------------------------------
    public readonly pButtonSauvegarder         = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonAnnuler             = this.page.locator('div.modal.hide.in > div.modal-footer > a');
    public readonly pButtonAppliquerSelection  = this.page.locator('[ng-click="appliquerRefus()"]');
    public readonly pButtonAppliquerRefus      = this.page.locator('[ng-click="appliquerRefus(true)"]');
    public readonly pButtonConfSauvOui         = this.page.locator('[ng-click="$event.preventDefault(); enregistrer();"]');
    public readonly pButtonConfirmeSauv        = this.page.locator('.confirmation-agreage a');

    public readonly pListBoxMotif              = this.page.locator('motifGlobal.selectionne');

    public readonly pTextAreaCommentaire       = this.page.locator('agreage.commentaire');

    public readonly pDataGridListeArrivage     = this.page.locator('.arrivages table > thead > tr > th');
    public readonly pDataGridPaletteRefus      = this.page.locator('.palettes-pour-refus-agreage table > thead > tr > th');
    public readonly trLotAagreer               = this.page.locator('tbody tr[data-id]');
    public readonly tdLotAagreer               = this.page.locator('tbody tr[data-id] td.datagrid-numero span');

    constructor(public readonly page: Page) {} 
    //----------------------------------------------------------------------------------------------------------------    

    public setAcheteur(idAcheteur: string) {       
        this.inputFiltreAcheteur.clear();
        this.inputFiltreAcheteur.fill(idAcheteur);
    }

    public clickOngletLotAgreer() {
        this.fonction.clickElement(this.ongletLotsAgreer);
    }
}