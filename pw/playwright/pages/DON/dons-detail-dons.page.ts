/**
 * Appli    : DONS
 * Menu     : DONS
 * Onglet   : Detail des dons 
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page }    from "@playwright/test"

export class  DetailDons  { 

    public readonly buttonCreerDon                 = this.page.locator('#listeDon-button-creerDon'); 
    public readonly buttonModifierDon              = this.page.locator('#listeDon-button-modifierDon');   
    public readonly buttonSupprimerDon             = this.page.locator('#listeDon-button-supprimer'); 
    public readonly buttonRechercherlesDons        = this.page.locator('#listeDon-button-rechercherDon'); 
    public readonly buttondatePickerPeriodeDons    = this.page.locator('#listeDon-pCalendar-periodeSelectionnee button'); 

    public readonly inputNumeroduBonDetailDon      = this.page.locator('#listeDon-input-numero');  
    public readonly inputBeneficiaireDetailDon     = this.page.locator('#listeDon-appAutocomplete-beneficiaire input'); 
    public readonly inputSocieteDonatriceDetailDon = this.page.locator('#listeDon-appAutocomplete-donateur input'); 

    public readonly listBoxGroupeArticle          = this.page.locator('#listeDon-pDropdown-groupeArticle div.p-dropdown-trigger');
    
    public readonly dataGridListeDetailDon        = this.page.locator('div.p-datatable.p-component th');
    public readonly dataGridListeBenefVille       = this.page.locator('tbody tr td:nth-child(3)');       // <<< Le DOM ne permet pas de faire plus propre pour le moment
    public readonly dataGridListeSctDonatrices    = this.page.locator('tbody tr td:nth-child(4)');       // <<< Le DOM ne permet pas de faire plus propre pour le moment
    public readonly dataGridListeDates            = this.page.locator('tbody tr td:nth-child(5)');       // <<< Le DOM ne permet pas de faire plus propre pour le moment
    public readonly dataGridListeMontants         = this.page.locator('tbody tr td:nth-child(7)');       // <<< Le DOM ne permet pas de faire plus propre pour le moment
    public readonly dataGridListeDesDonnee        = this.page.locator('p-table .p-datatable-scrollable-body.ng-star-inserted .p-datatable-tbody');
    public readonly dataGridDate                  = this.page.locator('[psortablecolumn="date"]');
    public readonly dataGridTypeDon               = this.page.locator('[psortablecolumn="typeDon"]');

    public readonly checboxListedesDons           = this.page.locator('div.p-checkbox-box.p-component');

    
//---datepicker: pour choisir la période du Don {dd/mm/yyyy;-------------------------------------------------------//
    
    public readonly datePickerPeriodeDon           = this.page.locator('div.ng-trigger.p-datepicker');
    
    public readonly datePickerListBoxMois          = this.page.locator('div.p-datepicker-header select.p-datepicker-month');
    public readonly datePickerListBoxAnnee         = this.page.locator('div.p-datepicker-header select.p-datepicker-year');
    public readonly datePickerListBoxJour          = this.page.locator('table.p-datepicker-calendar td span:NOT(.p-disabled)');

    public readonly datePickerButtonAjourdhui      = this.page.locator('div.p-datepicker-buttonbar button').nth(0);
    public readonly datePickerButtonAnnuler        = this.page.locator('div.p-datepicker-buttonbar button').nth(1) ;

//---Popin: Creer un Don --------------------------------------------------------------------------------------//
    
    public readonly pPopinCreerUnDon               = this.page.locator('div.ng-trigger.ng-trigger-animation');

    public readonly pPcdInputSocieteDonatrice      = this.page.locator('#editionDonModal-appAutocomplete-donateur input');
    public readonly pPcdInputBeneficiaire          = this.page.locator('#editionDonModal-appAutocomplete-beneficiaire input');
    public readonly pPcdInputMontantduDon          = this.page.locator('#editionDonModal-input-valorisation');

    public readonly pPcddatePickerCreerDon         = this.page.locator('#editionDonModal-pCalendar-date button');
    
    public readonly pPcdButtonEnregistrer          = this.page.locator('#editionDonModal-button-enregistrer');
    public readonly pPcdButtonAnnuler              = this.page.locator('#editionDonModal-pButton-annuler') ;

    public readonly pPtextAreaCommentaire          = this.page.locator('#editionDonModal-textarea-commentaire');

//---datepicker: pour choisir la période du Don sur le pop-up Creer Don {dd/mm/yyyy;----------------------------//
    
    public readonly datePickerCreerDon            = this.page.locator('div.ng-trigger.p-datepicker');
    
    public readonly datePickercdListBoxMois        = this.page.locator('div.p-datepicker-header select.p-datepicker-month');
    public readonly datePickercdListBoxAnnee       = this.page.locator('div.p-datepicker-header select.p-datepicker-year');
    public readonly datePickercdListBoxJour        = this.page.locator('table.p-datepicker-calendar td span:NOT(.p-disabled)');
    
    public readonly datePickercdButtonAjourdhui    = this.page.locator('div.p-datepicker-buttonbar button').nth(0);
    public readonly datePickercdButtonAnnuler      = this.page.locator('div.p-datepicker-buttonbar button').nth(1);

    
//---Popin: Modifier un Don --------------------------------------------------------------------------------------//
    
    public readonly pPopinModifierUnDon               = this.page.locator('div.ng-trigger.ng-trigger-animation');

    public readonly pPmdInputSocieteDonatrice         = this.page.locator('#editionDonModal-appAutocomplete-donateur input');
    public readonly pPmdInputBeneficiaire             = this.page.locator('#editionDonModal-appAutocomplete-beneficiaire input');
    public readonly pPmdInputMontantduDon             = this.page.locator('#editionDonModal-input-valorisation');
    public readonly pPmdInputCommentaireModifierDon   = this.page.locator('#editionDonModal-textarea-commentaire');

    public readonly pPmddatePickerModifierDon        = this.page.locator('#editionDonModal-pCalendar-date button');
    
    public readonly pPmdButtonEnregistrer            = this.page.locator('#editionDonModal-button-enregistrer');
    public readonly pPmdButtonAnnuler                = this.page.locator('#editionDonModal-pButton-annuler') ;
  
//---datepicker: pour choisir la période du Don sur le pop-up Modifier Don {dd/mm/yyyy;----------------------------//
    
    public readonly datePickerModifierDon          = this.page.locator('div.ng-trigger.p-datepicker');
    
    public readonly datePickermdListBoxMois        = this.page.locator('div.p-datepicker-header select.p-datepicker-month');
    public readonly datePickermdListBoxAnnee       = this.page.locator('div.p-datepicker-header select.p-datepicker-year');
    public readonly datePickermdListBoxJour        = this.page.locator('table.p-datepicker-calendar td span:NOT(.p-disabled)');
    
    public readonly datePickermdButtonAjourdhui    = this.page.locator('div.p-datepicker-buttonbar button').nth(0);
    public readonly datePickermdButtonAnnuler      = this.page.locator('div.p-datepicker-buttonbar button').nth(1);

//---Popin: Supprimer un Don --------------------------------------------------------------------------------------//

    public readonly pPopinSupprimerUnDon    = this.page.locator('div.ng-trigger.ng-trigger-animation');

    public readonly pPsdButtonSupprimer     = this.page.locator('#suppressionDonModal-button-supprimer') ;
    public readonly pPsdButtonAnnuler       = this.page.locator('#suppressionDonModal-pButton-annuler') ;

    public readonly pPspinner               = this.page.locator('p-footer span.app-spinner') ;
//------------------------------------------------------------------------------------------------------------------//
    constructor(public readonly page: Page) {}
}