/**
 * Appli    : CONCURRENCE
 * Menu     : RELEVES
 * Onglet   : RELEVES
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page }    from "@playwright/test"

export class Releves { 

    public readonly  buttonDateReleve                    = this.page.locator('button.p-datepicker-trigger');//('button .pi-calendar') 
    public readonly  buttonRechercheReleve               = this.page.locator('.option-recherche button[data-pc-name="button"]');//('.btn.btn-gray-disable') 
    public readonly  buttonSupprimerReleve               = this.page.locator('.footerBar [icon="fas fa-trash"]');
    public readonly  buttonCorrigerReleve                = this.page.locator('.footerBar [icon="fas fa-pencil-alt"]');

    public readonly  listBoxRechercheChoixArticle        = this.page.locator('ul li') 

    public readonly  inputLieuVente                      = this.page.locator('#autocomplete-lieu-vente input.p-autocomplete-input');//('input[role="searchbox"]').nth(0) 
    public readonly  inputArticle                        = this.page.locator('#autocomplete-article input.p-autocomplete-input');//('input[role="searchbox"]').nth(1) 
    public readonly  inputPrixKiloSup                    = this.page.locator('input[type="number"]').nth(0) 
    public readonly  inputPrixKiloInf                    = this.page.locator('input[type="number"]').nth(1) 
    
    public readonly  dataGridEnteteReleve                = this.page.locator('thead th[role="columnheader"]')  // 'thead tr.ng-star-inserted th'
    public readonly  dataGridCheckBox                    = this.page.locator('p-tablecheckbox') 
    public readonly  dataGridReleve                      = this.page.locator('.p-datatable-scrollable-view')
    public readonly  dataGridDesignationCategorie        = this.page.locator('tbody tr td')
    
    //Après avoir cliqué sur le bouton supprimer
    public readonly  pPbuttonSupprimerRelever            = this.page.locator('.p-dialog-footer button').nth(1) 
    public readonly  pPbuttonAnnuleSuppressionRelever    = this.page.locator('.p-dialog-footer button').nth(0) 

    //Plage de date des relevés
    public readonly  selectMois                          = this.page.locator('select.p-datepicker-month') 
    public readonly  selectChoixMois                     = this.page.locator('select.p-datepicker-month option') 
    public readonly  selectDateToday                     = this.page.locator('tr td.p-datepicker-today') 
    public readonly  calendarTable                       = this.page.locator('td span:NOT(.p-disabled)')  //'tr td span[pripple]'

    //Après avoir cliqué sur le bouton corriger

    public readonly  pPinputField                        = this.page.locator('div[pfocustrap] input[pinputtext]:NOT(.p-disabled)')  //retourne la liste des inputField sur le relevé
    public readonly  pPinputFieldNumber                  = this.page.locator('div[pfocustrap] input[type="number"]') 
    public readonly  pPinputFieldText                    = this.page.locator('div[pfocustrap] input[type="text"]') 
    public readonly  pPtextAreaFieldCommentaire          = this.page.locator('div[pfocustrap] textarea') 
    public readonly  pPbuttonEnregistrer                 = this.page.locator('div[pfocustrap] p-footer button').nth(0) 
    public readonly  pPbuttonAnnuler                     = this.page.locator('div[pfocustrap] p-footer button').nth(1) 
    public readonly  pPlabelPromotionTypeVente           = this.page.locator('label.col-form-label') 
    public readonly  pPbuttonPromotionTypeVente          = this.page.locator('div[pfocustrap] button.btn') 
    public readonly  pPbuttonPromotionTypeVenteNonActif  = this.page.locator('div[pfocustrap] button.btn:NOT(.active)') 
    public readonly  pPbuttonPromotionOui                = this.page.locator('div[pfocustrap] button.btn').nth(0) 
    public readonly  pPbuttonPromotionNon                = this.page.locator('div[pfocustrap] button.btn').nth(1) 
    public readonly  pPinputFilterOrigine                = this.page.locator('input.p-dropdown-filter') 
    public readonly  pPmodal                             = this.page.locator('div[pfocustrap]') 
    public readonly  pPqualite                           = this.page.locator('div em.far') 
    public readonly  pPqualiteNotActif                   = this.page.locator('div em.far:NOT(.active)') 

    constructor(public readonly page: Page) {}

}