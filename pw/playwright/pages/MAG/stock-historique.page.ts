/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : HISTORIQUE INVENTAIRE
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */

import { Page} from '@playwright/test';


export class StockHistorique {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonModifierInventaire   = this.page.locator('[ng-click="corrigerInventaire()"]');   
    public readonly buttonImprimerEcartsInv    = this.page.locator('[ng-click="imprimerEcartInventaire(inventaireSelectionne.id)"]');
    public readonly buttonImprimerContreInv    = this.page.locator('[ng-click="openPopupImprimerContreInventaire(inventaireSelectionne.id)"]');
    public readonly buttonComptagesMobiles     = this.page.locator('[ng-click="openPopupHistoriqueComptagesInventaires(inventaireSelectionne)"]');
    public readonly buttonMouvementsStock      = this.page.locator('[ng-click="openPopupMouvementStock(dgLignes.selections[0])"]');

    public readonly datePickerInventaireFrom   = this.page.locator('#datepicker-from > input');          
    public readonly datePickerInventaireTo     = this.page.locator('#datepicker-to > input');          
    public readonly datePickerLinkPrev         = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                           // bouton mois précédent du calendrier
    public readonly datePickerFirstDay         = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');      // premier jour du calendrier    

    public readonly inputGrpArticle            = this.page.locator('.filtre-groupe-article-ou-zone-input input');
    public readonly inputFiltreArticle         = this.page.locator('.filtre-articles-input input');

    public readonly dataGridInventaires        = this.page.locator('.liste-inventaires th');    
    public readonly dataGridHistorique         = this.page.locator('.lignes-inventaire th');    

    public readonly tdListeInventaires         = this.page.locator('td.datagrid-designationGroupeArticleOuZone');
    public readonly tdListeDatesInventaires    = this.page.locator('td.datagrid-dateInventaire');
    public readonly tdListeDatesValidInventaire= this.page.locator('td.datagrid-dateDerniereValidation');
    public readonly tdListeArticle             = this.page.locator('td.datagrid-article-code');

    public readonly thHeaderDatesInventaires   = this.page.locator('th.datagrid-dateInventaire');

    //----Popin Visualisation des comptages mobiles du dernier inventaire;

    public readonly pPButtonFermer             = this.page.locator('[data-modal-action="close"]');

    public readonly pPInputNomResponsableInv   = this.page.locator('input.filtre-responsable-inventaire');
    public readonly pPInputArticle             = this.page.locator('input.filtre-article');

    public readonly pPDataGrideRespoInventaire = this.page.locator('[attributs="dgComptageInventaire.attributs"] thead th');
    public readonly pPDataGridArticle          = this.page.locator('[attributs="dgLigneComptageInventaire.attributs"] thead th');

    public readonly pPTdListeRespoInventaire   = this.page.locator('td.datagrid-nomChargeInventaire');

    //----Popin Mouvement de stock

    public readonly pPListeBoxConditionnement  = this.page.locator('.info-ligne-stock select');

    public readonly pPDataGridMvtStock         = this.page.locator('#mouvementsStockTreeTable thead th.center');

    public readonly pPButtonToutDeplier        = this.page.locator('button.bouton-deplier');
    public readonly pPButtonToutReplier        = this.page.locator('div.boutons-deplier-replier button').nth(1);
    public readonly pPButtonRafraichir         = this.page.locator('.rafraichir-tableau button');

    public readonly pPDatePickerBonLivraison   = this.page.locator('th #filtre-date-bon-livraison');

    public readonly pPMultiselectListBoxNature = this.page.locator('p-multiselect .p-multiselect-label-container');

    public readonly pPInputNature              = this.page.locator('.p-multiselect-filter-container input.p-multiselect-filter');

    public readonly pPCheckBoxAllNatures       = this.page.locator('.p-multiselect-header .p-checkbox-box');
    public readonly pPCheckBoxNature           = this.page.locator('p-multiselectitem .p-checkbox-box');

    
    
    constructor(public readonly page: Page) {};

}