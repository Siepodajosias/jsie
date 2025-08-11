/**
 * Appli    : DONS
 * Menu     : BENEFICIARES
 * Onglet   : Suivi des attestations  
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page }    from "@playwright/test"

export class  SuiviAttestationsDons  { 

    public readonly buttonRelancer              = this.page.locator('#suiviAttestation-button-relancer');
    public readonly buttonEnregistrerReception  = this.page.locator('#suiviAttestation-button-enregistrerReception');
    public readonly buttonAttestationSigne      = this.page.locator('#suiviAttestation-button-voirAttestationSignee');
    public readonly buttonAnnulerReception      = this.page.locator('#suiviAttestation-button-annulerReception');
    public readonly buttonDeclarerJamaisRecu    = this.page.locator('#suiviAttestation-button-declarationAttestationJamaisRecue');
    public readonly buttonExporterValorisation  = this.page.locator('#suiviAttestation-button-exporterValorisations');
    public readonly buttonImprimerAttestation   = this.page.locator('#suiviAttestation-button-imprimerAttestation');  
    public readonly buttonRechercherAttestation = this.page.locator('#suiviAttestation-button-rechercherAttestation');
    public readonly buttonPeriodeDons           = this.page.locator('#suiviAttestation-pCalendar-periodeRecherche button');
    
    public readonly datePickerDebutPeriode      = this.page.locator('#suiviAttestation-pCalendar-dateDebut button');
    public readonly datePickerFinPeriode        = this.page.locator('#suiviAttestation-pCalendar-datefin button');

    public readonly inputBeneficiaireAttestation= this.page.locator('#suiviAttestation-appAutocomplete-beneficiaire input');
    public readonly inputSocieteDonatriceAttestation= this.page.locator('#suiviAttestation-appAutocomplete-societe input');
  
    public readonly dataGridAttestations        = this.page.locator('.p-datatable-thead tr.ng-star-inserted th.text-center') ;
    public readonly dataGridInputBenef          = this.page.locator('#suiviAttestation-input-filtreNomBeneficiaire');
    public readonly dataGridInputVille          = this.page.locator('#suiviAttestation-input-filtreVilleBeneficiaire');
    public readonly dataGridInputSocDonatrice   = this.page.locator('#suiviAttestation-input-filtreSocieteDonatrice');
    public readonly dataGridStatut              = this.page.locator('[psortablecolumn="statutActuel"]');
    public readonly dataGridDataRelance         = this.page.locator('[psortablecolumn="dateRelance"]');
    public readonly dataGridListBoxValorisation = this.page.locator('#suiviAttestation-pMultiSelect-filtreStatutActuel span');

    public readonly dataGridListBoxStatut       = this.page.locator('.p-datatable-thead > :nth-child(2) > :nth-child(9)');

    public readonly checkBoxStatutEnvoye        = this.page.locator(':nth-child(1) > .p-multiselect-item > .p-checkbox > .p-checkbox-box');
    public readonly checkBoxAttestations        = this.page.locator('tr td p-tablecheckbox .p-checkbox-box.p-component');
    public readonly checkBoxSelectAllAttest     = this.page.locator('th span.p-checkbox-icon');
    
    //---datepicker: pour choisir la période du Don {dd/mm/yyyy;-------------------------------------------------------------//

    public readonly datePickerPeriodeDon        = this.page.locator('div.ng-trigger');

    public readonly datePickerListBoxMois       = this.page.locator('div.p-datepicker-header select.p-datepicker-month');
    public readonly datePickerListBoxAnnee      = this.page.locator('div.p-datepicker-header select.p-datepicker-year');
    public readonly datePickerListBoxJour       = this.page.locator('table.p-datepicker-calendar td span:NOT(.p-disabled)');
    
    public readonly datePickerButtonAjourdhui   = this.page.locator('div.p-datepicker-buttonbar button').nth(0);
    public readonly datePickerButtonAnnuler     = this.page.locator('div.p-datepicker-buttonbar button').nth(1);

    //-- Popin : Confirmation de relance ------------------------------------------------------------------------//

    public readonly pPopinConfirmationRelance= this.page.locator('div.ng-trigger.ng-trigger-animation');
    
    public readonly pPcrButtonConfirmer         = this.page.locator('#relancerAttestationModal-button-enregistrer');
    public readonly pPcrButtonAnnuler           = this.page.locator('#relancerAttestationModal-pButton-annuler');

    public readonly pPcrSpinner                 = this.page.locator('p-footer span.app-spinner');

    //-- Popin : Enregistrer Réception --------------------------------------------------------------------------//
    public readonly pPopinEnregistrerReception  = this.page.locator('div.ng-trigger.ng-trigger-animation');
    
    public readonly pPerButtonAtestationSigne   = this.page.locator('div.ng-trigger div.p-fileupload span');
    public readonly pPerButtonEnregisterRecep   = this.page.locator('#receptionAttestationModal-button-enregistrer');
    public readonly pPerButtonAnnulerRecep      = this.page.locator('#receptionAttestationModal-pButton-annuler');

    //-- Popin :  Déclarer l'attestation jamais reçue  --------------------------------------------------------------//
    public readonly pPopinDeclarerjamaisrecu    = this.page.locator('div.ng-trigger.ng-trigger-animation');
    
    public readonly pPdajrButtonConfirmer       = this.page.locator('#declarationJamaisRecuModal-button-confirmer');
    public readonly pPdajrButtonAnnuler         = this.page.locator('#declarationJamaisRecuModal-pButton-annuler');
    
    //--Annullation de la Réception-------------------------------------------------------------------------------//
    public readonly pPopinAnnullerReception     = this.page.locator('div.ng-trigger.ng-trigger-animation');
    
    public readonly pParButtonConfirmer         = this.page.locator('#annulationReceptionModal-button-confirmer');
    public readonly pParButtonAnnuler           = this.page.locator('#annulationReceptionModal-pButton-annuler');

    //-----------------------------------------------------------------------------------------------------//

    constructor(public readonly page: Page) {}

}