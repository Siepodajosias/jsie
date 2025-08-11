/**
 * Page STOCK > RECEPTION > REFUS
 * 
 * @author JOSIAS SIE
 * 
 * @version 3.0
 * 
 * 
 */

import { Page }          from "@playwright/test";
import { TestFunctions } from '../../utils/functions.js';

export class AgreerMarchandisePartielle {

public fonction                             = new TestFunctions();
 //----------------------------------------------------------------------------------------------------------------    
 public readonly ongletLotsAgreer           = this.page.locator('a[href="#agreagelots"]');
 public readonly buttonAgreer               = this.page.locator('[ng-click="openSaisieAgreage(dg.selection[0])"]');
 public readonly buttonAgreerTousLesLots    = this.page.locator('[ng-click="openAgreageParFournisseur(dg.contenu)"]');
 public readonly buttonImprimer             = this.page.locator('[ng-click="imprimerPalettesAAgreer()"]');        

 public readonly inputFiltreAcheteur        = this.page.locator('input.filter-input');

 public readonly listBoxFournisseurs        = this.page.locator('#fournisseurs');

 public readonly listNumeroAchat            = this.page.locator('td.datagrid-numeroAchat > span');
 public readonly listNumeroLot              = this.page.locator('td.datagrid-numero > span');
 public readonly listArticleCode            = this.page.locator('td.datagrid-article-code > span');
 
 public readonly trNumeroLot                = this.page.locator('div.datagrid-table-wrapper > table > tbody > tr > td.datagrid-numero');
 public readonly dataGridLotsAgreerDuLot    = this.page.locator('div.datagrid-table-wrapper > table').nth(1);
 public readonly checkBoxLotAgreer          = this.page.locator('.datagrid-wrapper td input');

 //-- Popin : Agréage du lot XXXXXXX ------------------------------------------------------------------------------
 public readonly pButtonSauvegarder         = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
 public readonly pButtonAnnuler             = this.page.locator('div.modal.hide.in > div.modal-footer > a');
 public readonly pButtonAppliquerSelection  = this.page.locator('[ng-click="appliquerRefus()"]');
 public readonly pButtonAppliquerRefus      = this.page.locator('[ng-click="appliquerRefus(true)"]');

 public readonly pListBoxMotif              = this.page.locator('motifGlobal.selectionne');

 public readonly pTextAreaCommentaire       = this.page.locator('agreage.commentaire');

 public readonly pDataGridHeader            = this.page.locator('.arrivages table > thead > tr > th');
 public readonly pDataGridListeArrivage     = this.page.locator('div.refus-palettes table > tbody > tr');

 public readonly pDataGridPaletteRefus      = this.page.locator('.palettes-pour-refus-agreage table > thead > tr > th');

 public readonly pInputColisRefuses         = this.page.locator('div.refus-palettes table > tbody > tr > td:NOT(.table-checkbox) > input').nth(0);
 public readonly pInputMotif                = this.page.locator('select[ng-model="motifGlobal.selectionne"]');
 public readonly pInputMotifItem            = this.page.locator('select[ng-model="motifGlobal.selectionne"] option');
 //public readonly pButtonAppliquerSelection  = this.page.locator('div.palettes-actions button').nth(0);
 public readonly pCheckBoxSelectionMultiple = this.page.locator('div.refus-palettes table > thead > tr > th > input');
 public readonly pCheckBoxSaisieRefus       = this.page.locator('.form-left tbody tr td input[type="checkbox"]');

 constructor(public readonly page: Page) {}  

 //----------------------------------------------------------------------------------------------------------------    

    public async setAcheteur(idAcheteur: string) {       
        await this.inputFiltreAcheteur.clear();
        await this.inputFiltreAcheteur.fill(idAcheteur);
    }

    public async clickOngletLotAgreer() {
        await this.fonction.clickElement(this.ongletLotsAgreer);
    }
}