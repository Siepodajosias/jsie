/**
 * 
 *  FACTURATION PAGE > FACTURATION / ONGLET > RECETTES MAGASINS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class FacturationRecettesMagasins {

    public readonly buttonComptabiliser                             : Locator
    public readonly buttonAffRecettesManquantes                     : Locator
    public readonly buttonCreerRecette                              : Locator
    public readonly buttonModifier                                  : Locator
    public readonly buttonVisualiser                                : Locator
    public readonly buttonRechercher                                : Locator

    public readonly linkComptabiliseOui                             : Locator
    public readonly linkComptabiliseNon                             : Locator
    public readonly linkCreationManuelleOui                         : Locator
    public readonly linkCreationManuelleNon                         : Locator
    
    public readonly inputSearchNomScte                              : Locator

    public readonly datePickerFrom                                  : Locator
    public readonly datePickerTo                                    : Locator

    public readonly dataGridListeReleves                            : Locator 

    public readonly labelNbPiecesAComptabiliser                     : Locator 

    //-- popin : Confirmation de la comptabilisation -------------------------------------------------------------------------

    public readonly pPopinConfirmationComptabilisation              : Locator

    public readonly pButtonComptabiliser                            : Locator
    public readonly pButtonFermer                                   : Locator 

    public readonly pDatePickerDateRecetteMaxi                      : Locator

    public readonly pLabelQuestion                                  : Locator    

    //-- Popin : Recettes manquantes sur la période du ... au ... ------------------------------------------------------------

    public readonly pPopinRecettesManquantesSurPeriodeDu            : Locator

    public readonly pButtonFermerRecette                            : Locator

    public readonly pDataGridListesRecettes                         : Locator 

    //-- Popin : Création d'une recette --------------------------------------------------------------------------------------

    public readonly pPopinCreationRecette                           : Locator

    public readonly pButtonEnregistrerRecette                       : Locator
    public readonly pButtonFermerCreation                           : Locator 

    public readonly pInputSociete                                   : Locator
    public readonly pInputNbClients                                 : Locator
    public readonly pInputRecetteGIE                                : Locator 
    public readonly pInputDateRecette                               : Locator

    public readonly pListBoxGroupeComptable                         : Locator 
    public readonly pListBoxTauxTVA                                 : Locator
    public readonly pTextAreaCommentaireRecette                     : Locator
    public readonly pDataGridListesGrpComptable                     : Locator

    constructor(page:Page){

        this.buttonComptabiliser                                    = page.locator('[ng-click="ouvrirPopupComptabilisation()"]');
        this.buttonAffRecettesManquantes                            = page.locator('[ng-click="popupRecettesManquantes.open = true;"]');
        this.buttonCreerRecette                                     = page.locator('[ng-click="ouvrirPopupSaisieRecette()"]');
        this.buttonModifier                                         = page.locator('[ng-click="ouvrirPopupSaisieRecette(recettesSelectionnes[0])"]');
        this.buttonVisualiser                                       = page.locator('[ng-click="ouvrirPopupVisualiserRecettes(recettesSelectionnes[0])"]');
        this.buttonRechercher                                       = page.locator('[ng-click="queryRecettes()"]');
    
        this.linkComptabiliseOui                                    = page.locator('[ng-click="dg.filters.onChangeComptabilisee(true)"]');
        this.linkComptabiliseNon                                    = page.locator('[ng-click="dg.filters.onChangeComptabilisee(false)"]');
        this.linkCreationManuelleOui                                = page.locator('[ng-click="dg.filters.onChangeCreationManuelleOuModification(true)"]');
        this.linkCreationManuelleNon                                = page.locator('[ng-click="dg.filters.onChangeCreationManuelleOuModification(false)"]');
        
        this.inputSearchNomScte                                     = page.locator('.autocomplete-societe > input');
    
        this.datePickerFrom                                         = page.locator('[ng-click="toggleDatepicker($event)"]').nth(0);
        this.datePickerTo                                           = page.locator('[ng-click="toggleDatepicker($event)"]').nth(1);
    
        this.dataGridListeReleves                                   = page.locator('.datagrid-table-wrapper > table > thead > tr > th');
    
        this.labelNbPiecesAComptabiliser                            = page.locator('.containerBT span.ng-binding');    
    
        //-- popin : Confirmation de la comptabilisation -------------------------------------------------------------------------

        this.pPopinConfirmationComptabilisation                     = page.locator('.modal-backdrop')

        this.pButtonComptabiliser                                   = page.locator('div.modal-footer button');
        this.pButtonFermer                                          = page.locator('div.modal.hide.in > div.modal-footer > a'); 
    
        this.pDatePickerDateRecetteMaxi                             = page.locator('#formComptabilisationRecettes .datepicker-wrapper');
    
        this.pLabelQuestion                                         = page.locator('#formComptabilisationRecettes div strong');    
    
        //-- Popin : Recettes manquantes sur la période du ... au ... ------------------------------------------------------------
        this.pPopinRecettesManquantesSurPeriodeDu                   = page.locator('.modal-backdrop')

        this.pButtonFermerRecette                                   = page.locator('div.modal.hide.in > div.modal-footer > a');
    
        this.pDataGridListesRecettes                                = page.locator('.popup-recette-manquante table > thead > tr > th');
    
        //-- Popin : Création d'une recette --------------------------------------------------------------------------------------

        this.pPopinCreationRecette                                  = page.locator('.modal-backdrop')
        this.pButtonEnregistrerRecette                              = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermerCreation                                  = page.locator('div.modal.hide.in > div.modal-footer > a'); 
    
        this.pInputSociete                                          = page.locator('#autocomplete-societe-comptable');
        this.pInputNbClients                                        = page.locator('#input-nb-clients');
        this.pInputRecetteGIE                                       = page.locator('#input-recette-gie');
        this.pInputDateRecette                                      = page.locator('#input-date-recette input');
    
        this.pListBoxGroupeComptable                                = page.locator('#select-groupe-comptable');
        this.pListBoxTauxTVA                                        = page.locator('#select-type-tva');
    
        this.pTextAreaCommentaireRecette                            = page.locator('#input-commentaire');
    
        this.pDataGridListesGrpComptable                            = page.locator('#formSaisieRecette table > thead > tr > th'); 
    }
}