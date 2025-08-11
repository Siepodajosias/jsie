/**
 * Appli    : DONS
 * Menu     : DONS
 * Onglet   : Récapitulatifs 
 *  
 * @author JOSIAS SIE
 * @version 3.4
 * 
 */
import { Page }    from "@playwright/test"

export class  RecapitulatifsDons{ 

    public readonly buttonAttestNonRenseigne             = this.page.locator('#listeRecapitulatif-pSelectbutton-attestation div.p-button').nth(0); 
    public readonly buttonAttestEnvoyerOui               = this.page.locator('#listeRecapitulatif-pSelectbutton-attestation div.p-button').nth(1); 
    public readonly buttonAttestEnvoyerNon               = this.page.locator('#listeRecapitulatif-pSelectbutton-attestation div.p-button').nth(2);  
    public readonly buttonRechercherRecapitulatif        = this.page.locator('#listeRecapitulatif-button-rechercherRecapitulatifs'); 
    public readonly buttonCorrigerpoids                  = this.page.locator('#listeRecapitulatif-button-corrigerPoids');
    public readonly buttonVisualiserDetail               = this.page.locator('#listeRecapitulatif-button-visualiserDetailRecap');
    public readonly buttonAjouterValorisation            = this.page.locator('#listeRecapitulatif-button-ajoutValorisation');
    public readonly buttonRenvoyerRecapitulatif          = this.page.locator('#listeRecapitulatif-button-envoyerRecapitulatif');
    public readonly buttonImprimerRecapitulatif          = this.page.locator('#listeRecapitulatif-button-imprimerRecapitulatif');
    public readonly buttonAnnulerRecapitulatif           = this.page.locator('#listeRecapitulatif-button-annuler');
    public readonly buttondatePickerPeriodeDonsRecap     = this.page.locator('#listeRecapitulatif-pCalendar-periodeSelectionnee button');
    
    public readonly inputBeneficiaireRecapitulatif       = this.page.locator('#listeRecapitulatif-appAutocomplete-beneficiaire input');
    public readonly inputSocieteDonatriceRecapitulatif   = this.page.locator('#listeRecapitulatif-appAutocomplete-donateur input');

    public readonly dataGridListeRecapitulatif           = this.page.locator('div.p-datatable.p-component th');
    public readonly dataGridListeRecapDonnee             = this.page.locator('p-table .p-datatable-scrollable-body.ng-star-inserted .p-datatable-tbody');
    public readonly dataGridAttestationEnvoye            = this.page.locator('[psortablecolumn="attestationEnvoyee"]');
    public readonly dataGridlieuDeRamasse                = this.page.locator('[psortablecolumn="lieuDeRamasse"]');
    public readonly dataGridValorisationCorrigee         = this.page.locator('[psortablecolumn="valorisationCorrigee"]');
    public readonly dataGridheaders                      = this.page.locator('table thead th');

    public readonly checkboxListeRecapitulatif           = this.page.locator('p-tablecheckbox > .p-checkbox > .p-checkbox-box');
    public readonly tdListeRecapitulatif                 = this.page.locator('tr.p-highlight td');
    public readonly iconListeRecapitulatif               = this.page.locator('span.pi-check');
    public readonly trListeRecapitulatif                 = this.page.locator('tr.p-highlight');
//---Datepicker: pour choisir la période du Don {mm/yyyy;------------------------------------------- //
   
    public readonly datePickerPeriodeDonsRecap  = this.page.locator('div.ng-trigger.ng-trigger-overlayAnimation');
    public readonly datePickerMonth             = this.page.locator('.p-monthpicker-month');
    public readonly datePickerListBoxAnnee      = this.page.locator('div.ng-trigger select.p-datepicker-year');
    
    public readonly datePickerButtonAjourdhui   = this.page.locator('div.p-datepicker-buttonbar button').nth(0);
    public readonly datePickerButtonAnnuler     = this.page.locator('div.p-datepicker-buttonbar button').nth(1);
 
//---Popin Corriger Poids---------------------------------------------------------------------------- //
    
    public readonly pPopinCorrectionduPoids   = this.page.locator('div.ng-trigger.ng-trigger-animation');    
    
    public readonly pPcpInputNouveauPoids     = this.page.locator('#correctionPoidsModal-pInputNumber-nouveauPoids');
    
    public readonly pPcpButtonAnnuler         = this.page.locator('#correctionPoidsModal-pButton-annuler');
    public readonly pPcpButtonEnregister      = this.page.locator('#correctionPoidsModal-button-enregistrer');    
 
//---Popin Visualiser le Detail---------------------------------------------------------------------------- //
    
    public readonly pPopinVisualiserleDetail    = this.page.locator('div.ng-trigger.ng-trigger-animation');

    public readonly pPvrDataGridListeDetail     = this.page.locator('div.modale-visualisation-recapitulatif thead tr:nth-child(1) th');

    public readonly pPvrButtonFermer            = this.page.locator('#visualisationDetailRecapitulatif-fermer');

//---Popin Ajouter une valorisation ---------------------------------------------------------------------------- //
    
    public readonly pPopinAjouterValorisation   = this.page.locator('div.ng-trigger');
    
    public readonly pPavButtonGroupeArticle     = this.page.locator('#ajoutValorisationModal-button-ajoutGroupeArticle');
    public readonly pPavButtonEnregistrer       = this.page.locator('#ajoutValorisationModal-button-enregistrer');
    public readonly pPavButtonAnnuler           = this.page.locator('#ajoutValorisationModal-pButton-annuler');

    
    public readonly dataGridPoidsInitial        = this.page.locator('[formcontrolname="poidsInitial"]');
    public readonly dataGridValorisationInitial = this.page.locator('[formcontrolname="valorisationInitiale"]');
//---Popin  Renvoyer récapitulatif(s) des Dons ---------------------------------------------------------------------------- //

    public readonly pPopinRenvoiRecapDon    = this.page.locator('div.ng-trigger.ng-trigger-animation');
    
    public readonly pPrrdButtonConfirmer    = this.page.locator('#renvoiRecapitulatifModal-button-enregistrer');
    public readonly pPrrdButtonAnnuler      = this.page.locator('#renvoiRecapitulatifModal-pButton-annuler');

    public readonly pPrrdAlerteDetail       = this.page.locator('alert[nom="detailRecapModalAlert"]');

    public readonly pPspinner               = this.page.locator('p-footer span.app-spinner') ;
    public readonly pPspinner2              = this.page.locator('span.app-spinner') ;

//---------------------------------------------------------------------------------------------------------// 
   constructor(public readonly page: Page) {}
   
}
    