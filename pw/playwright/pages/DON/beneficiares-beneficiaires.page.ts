/**
 * Appli    : DONS
 * Menu     : BENEFICIARES
 * Onglet   : Bénéficiaire  
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.3
 * 
 */
import { Locator, Page }    from "@playwright/test";

export class BeneficiaireDons {

     public readonly buttonCreerBeneficiaire         = this.page.locator('#listeBeneficiaire-button-creerBeneficiaire');
     public readonly buttonModifierBeneficiaire      = this.page.locator('#listeBeneficiaire-button-modifierBeneficiaire');
     public readonly buttonAssocierGroupe            = this.page.locator('#listeBeneficiaire-button-associerAuGroupe');
     public readonly buttonGererGroupe               = this.page.locator('#listeBeneficiaire-button-gererGroupe');
     public readonly buttonSupprimerBeneficiaire     = this.page.locator('#listeBeneficiaire-button-supprimer');
     public readonly buttonBloquerBeneficiaire       = this.page.locator('#listeBeneficiaire-button-bloquer');
     public readonly buttonDebloquerBeneficiaire     = this.page.locator('#listeBeneficiaire-button-debloquer');
     public readonly buttonEnvoyerAttestion          = this.page.locator('#listeBeneficiaire-button-envoyerAttestation');

     public readonly dataGridListeBeneficiaire       = this.page.locator('thead.p-datatable-thead .ng-star-inserted th.text-center');
     public readonly dataGridDonneeBeneficiaire      = this.page.locator('p-table .p-datatable-scrollable-body.ng-star-inserted .p-datatable-tbody');
     public readonly dataGridCodeBeneficiaire        = this.page.locator('.p-datatable-thead > :nth-child(2) > :nth-child(2)');
     public readonly dataGridInputNomBeneficiaire    = this.page.locator('#listeBeneficiaire-input-filtreNom');
     public readonly dataGridInputVille              = this.page.locator('#listeBeneficiaire-input-filtreVille');
     public readonly dataGridListBoxGroupeBenef      = this.page.locator('#listeBeneficiaire-pMultiSelect-nomGroupe div.p-multiselect-label-container');
     public readonly dataGridInputSociete            = this.page.locator('#listeBeneficiaire-input-filtreRaisonSociale');
     public readonly dataGridListBoxStatutBenef      = this.page.locator('#listeBeneficiaire-pDropdown-filtreDebloque span.p-inputtext');
     public readonly dataGridEnteteStatutBenef       = this.page.locator('[psortablecolumn="debloque"]');


     public readonly dataGridLabelBeneficiaire        = this.page.locator('.p-datatable-tbody > tr:nth-child(1) > td.text-left').nth(0);
     public readonly dataGridLabelVille               = this.page.locator('.p-datatable-tbody > tr:nth-child(1) > td.text-left').nth(1);
     public readonly dataGridLabelSocieteDonatrice    = this.page.locator('.p-datatable-tbody > tr:nth-child(1) > td.text-left').nth(2);



     public readonly checboxListeBeneficiaire        = this.page.locator('div.p-checkbox-box.p-component');

    //----boutons au survol de la colonne [Actions] du dataGrid ------------------------------------------------------------------------//      
     public readonly dataGridbuttonModifierBenef     = this.page.locator('#listeBeneficiaire-button-modifierBeneficiaire-1510');
     public readonly dataGridbuttonSupprimerBenef    = this.page.locator('#listeBeneficiaire-button-supprimerBeneficiaire-1510');
     public readonly dataGridbuttonBloquerBenef      = this.page.locator('#listeBeneficiaire-button-bloquerBeneficiaire-1510');

    //---Popin: Creer Bénéficiaire-----------------------------------------------------------------------------//

     public readonly pPcbInputNomBenef               = this.page.locator('#editionBeneficiaireModal-input-nom');
     public readonly pPcbInputAdresseBenef           = this.page.locator('#editionBeneficiaireModal-input-adresse1');
     public readonly pPcbInputComplementAdresse      = this.page.locator('#editionBeneficiaireModal-input-adresse2');
     public readonly pPcbInputCodePostal             = this.page.locator('#editionBeneficiaireModal-input-codePostal');
     public readonly pPcbInputVille                  = this.page.locator('#editionBeneficiaireModal-input-ville');
     public readonly pPcbInputNumero                 = this.page.locator('#editionBeneficiaireModal-input-numeroDecret');
     public readonly pPcbInputEmail                  = this.page.locator('#editionBeneficiaireModal-pChips-emails div');
     public readonly pPcbInputNomContact             = this.page.locator('#editionBeneficiaireModal-input-nomContact');
     public readonly pPcbInputTelephone              = this.page.locator('#editionBeneficiaireModal-input-telephone');
     public readonly pPcbInputNumSIREN               = this.page.locator('#editionBeneficiaireModal-input-siren');
     public readonly pPcbInputNumNRA                 = this.page.locator('#editionBeneficiaireModal-input-rna');
     public readonly pPcbInputCodeDesignation        = this.page.locator('#editionBeneficiaireModal-appAutocomplete-codeDesignationSociete input');
     public readonly pPcbInputOperepourleCompte      = this.page.locator('#editionBeneficiaireModal-appAutocomplete-beneficiaire-proprietaire input');
     public readonly pPcbInputBeneficiaireEmailRecap = this.page.locator('div.form-group.row .p-inputtext.p-component').nth(10);
     public readonly pPcbInputBeneficiaireEmailAttes = this.page.locator('div.form-group.row .p-inputtext.p-component').nth(11);

     public readonly pPcbListBoxPays                 = this.page.locator('#editionBeneficiaireModal-pDropdown-pays span.p-inputtext');
     public readonly pPcbListBoxItem                 = this.page.locator('.p-dropdown-item');
     public readonly pPcbListBoxGroupe               = this.page.locator('#editionBeneficiaireModal-pDropdown-groupeBeneficiaire > .p-dropdown > .p-dropdown-label');

     public readonly pPcbdataGridZoneSoc             = this.page.locator('.zone-societe th.text-center');

     public readonly pPcbdatePicker                  = this.page.locator('#editionBeneficiaireModal-pCalendar-dateDecret button');
     public readonly datePickercbButtonAjourdhui     = this.page.locator('div.p-datepicker-buttonbar button').nth(0);

     public readonly pPcbRadiobuttonOeuvreOrgGeneral     = this.page.locator('#editionBeneficiaireModal-pRadiobutton-oeuvreOrganismeGeneral div.p-radiobutton-box');
     public readonly pPcbRadiobuttonAssociatAideAliment  = this.page.locator('#editionBeneficiaireModal-pRadiobutton-associationFournissantAideAlimentaire div.p-radiobutton-box');
     public readonly pPcbRadiobuttonOeuvreBoiTvaDed      = this.page.locator('#editionBeneficiaireModal-pRadiobutton-oeuvreDansCadreBoiTvaDed div.p-radiobutton-box');

     public readonly pPcbCheckboxDebloquer           = this.page.locator('#editionBeneficiaireModal-pCheckbox-debloque');
     public readonly pPcbCheckboxgenererDocFiscaux   = this.page.locator('#editionBeneficiaireModal-pCheckbox-genererDocumentsFiscaux');
     public readonly pPcbCheckboxAttestatAvecMontant = this.page.locator('#editionBeneficiaireModal-pCheckbox-attestationAvecMontant');

     public readonly pPcbButtonPacourirDocument  = this.page.locator('#editionBeneficiaireModal-pFileUpload-documentBeneficiaire div').nth(0);
     public readonly pPcbButtonEnregistrer       = this.page.locator('#editionBeneficiaireModal-button-enregistrer');
     public readonly pPcbButtonAnnuler           = this.page.locator('#editionBeneficiaireModal-pButton-annuler');

    //---Popin: Modifier Bénéficiaire-----------------------------------------------------------------------------//

     public readonly pPopinModifierUnBeneficiaire    = this.page.locator('div.ng-trigger.ng-trigger-animation');

     public readonly pPmbInputNomBeneficiaire        = this.page.locator('#editionBeneficiaireModal-input-nom');
     public readonly pPmbInputAdresseBeneficiaire    = this.page.locator('#editionBeneficiaireModal-input-adresse1');
     public readonly pPmbInputComplementAdresse      = this.page.locator('#editionBeneficiaireModal-input-adresse2');
     public readonly pPmbInputCodePostal             = this.page.locator('#editionBeneficiaireModal-input-codePostal');
     public readonly pPmbInputVille                  = this.page.locator('#editionBeneficiaireModal-input-ville');
     public readonly pPmbInputNumero                 = this.page.locator('#editionBeneficiaireModal-input-numeroDecret');
     public readonly pPmbInputEmail                  = this.page.locator('#editionBeneficiaireModal-pChips-emails div');
     public readonly pPmbIconEmail                   = this.page.locator('.p-chips-token.ng-star-inserted .p-chips-token-icon');
     public readonly pPmbInputNomContact             = this.page.locator('#editionBeneficiaireModal-input-nomContact');
     public readonly pPmbInputTelephone              = this.page.locator('#editionBeneficiaireModal-input-telephone');
     public readonly pPmbInputNumSIREN               = this.page.locator('#editionBeneficiaireModal-input-siren');
     public readonly pPmbInputNumNRA                 = this.page.locator('#editionBeneficiaireModal-input-rna');
     public readonly pPmbInputCodeDesign             = this.page.locator('#editionBeneficiaireModal-appAutocomplete-codeDesignationSociete input');
     public readonly pPmbInputOperepourleCompte      = this.page.locator('#editionBeneficiaireModal-appAutocomplete-beneficiaire-proprietaire input');

     public readonly pPmbListBoxPays     = this.page.locator('#editionBeneficiaireModal-pDropdown-pays');
     public readonly pPmbListBoxGroupe   = this.page.locator('#editionBeneficiaireModal-pDropdown-groupeBeneficiaire span.p-inputtext');

     public readonly pPmddataGridZoneSociete          = this.page.locator('.zone-societe th.text-center');

     public readonly pPmbPdialogModifierBeneficiaire  = this.page.locator('.p-dialog'); 
     public readonly pPmbDivAlertErreur               = this.page.locator('.alert');

     public readonly pPmbdatePicker                   = this.page.locator('#editionBeneficiaireModal-pCalendar-dateDecret button');
     public readonly datePickermbButtonAjourdhui      = this.page.locator('div.p-datepicker-buttonbar button').nth(0)


     public readonly pPmbRadiobuttonOeuvreOrgGeneral      = this.page.locator('#editionBeneficiaireModal-pRadiobutton-oeuvreOrganismeGeneral div.p-radiobutton-box');
     public readonly pPmbRadiobuttonAssociatAideAliment   = this.page.locator('#editionBeneficiaireModal-pRadiobutton-associationFournissantAideAlimentaire div.p-radiobutton-box');
     public readonly pPmbRadiobuttonOeuvreBoiTvaDed       = this.page.locator('#editionBeneficiaireModal-pRadiobutton-oeuvreDansCadreBoiTvaDed div.p-radiobutton-box');

     public readonly pPmbCheckboxDebloquer            = this.page.locator('#editionBeneficiaireModal-pCheckbox-debloque');
     public readonly pPmbCheckboxGenererDocFiscaux    = this.page.locator('#editionBeneficiaireModal-pCheckbox-genererDocumentsFiscaux');
     public readonly pPmbCheckboxAttestAvecMontant    = this.page.locator('#editionBeneficiaireModal-pCheckbox-attestationAvecMontant');

     public readonly pPmbButtonPacourirDocument   = this.page.locator('#editionBeneficiaireModal-pFileUpload-documentBeneficiaire div').nth(0);
     public readonly pPmbButtonEnregistrer        = this.page.locator('#editionBeneficiaireModal-button-enregistrer');
     public readonly pPmbButtonAnnuler            = this.page.locator('#editionBeneficiaireModal-pButton-annuler');

    //---Popin: Gérer Groupe -----------------------------------------------------------------------------//

     public readonly pPopinGestiondesGroupes     = this.page.locator('div.ng-trigger.ng-trigger-animation');

     public readonly pPggInputNomGroupeBenef     = this.page.locator('input#groupeBeneficiaireModal-input-nomGroupe');
     public readonly pPggLigneGroupeBenef        = this.page.locator('.ligne-groupe-beneficiaire');

     public readonly pPggButtonEnregistrer       = this.page.locator('#groupeBeneficiaireModal-button-enregistrer');
     public readonly pPggButtonAnnuler           = this.page.locator('#groupeBeneficiaireModal-pButton-annuler');

     public readonly pPggSupprimerGroupe         = this.page.locator('#groupeBeneficiaireModal-i-supprimer');

    //---Popin: Supprimer Bénéficiaire-----------------------------------------------------------------------------------//

     public readonly pPopinSupprimerUnBeneficiaire   = this.page.locator('div.ng-trigger.ng-trigger-animation');

     public readonly pPsbButtonSupprimer   = this.page.locator('#suppressionBeneficiaireModal-button-supprimer');
     public readonly pPsbButtonAnnuler     = this.page.locator('#suppressionBeneficiaire-button-annuler');

    //---Popin: Envoyer Attestations-----------------------------------------------------------------------------------//

     public readonly pPopinEnvoiAttestation  = this.page.locator('div.ng-trigger.ng-trigger-animation');

     public readonly pPeadatePicker       = this.page.locator('.periode-attestation > .p-button');
     public readonly pPeaButtonEnvoyer    = this.page.locator('#envoiAttestationBeneficiaireModal-button-envoyer');
     public readonly pPeaButtonAnnuler    = this.page.locator('#envoiAttestationBeneficiaireModal-pButton-annuler');

     public readonly pPeadatePickerAujourdhui   = this.page.locator('.p-datepicker-buttonbar > :nth-child(1) > .p-button-label');
     public readonly pPeadatePickerEffacer      = this.page.locator('.p-button-link > .p-button-label');
     public readonly pPmbDivAlert               = this.page.locator('.position-absolute > .alert');
    //-----Popin: Associer au Groupe------------------------------------------------------------------------------//
    
     public readonly pPopinAssocierAuGroupe   = this.page.locator('div.ng-trigger.ng-trigger-animation');
    
     public readonly pPagListBoxGroupe        = this.page.locator('#associationBeneficiaireGroupeModal-pDropdown-groupeBeneficiaire > .p-dropdown');
     public readonly pPagListBoxItemGroupe    = this.page.locator('div.groupeBeneficiaire-item > div');
     public readonly pTdGroupe                = this.page.locator('tr td:nth-child(5)');

     public readonly pPagButtonEnregistrer    = this.page.locator('#associationBeneficiaireGroupeModal-button-enregistrer');
     public readonly pPagButtonAnnuler        = this.page.locator('.p-button-link > .p-button-label');
    
    //-----------------------------------------------------------------------------------------------------------//
    constructor(public readonly page: Page) {}

    public getInputNomGroupeDansLigneGroupeBenef(group: Locator) {
        return group.locator('input[formcontrolname="nomGroupe"]');
    }
    
    public getBtnSupprimerDansLigneGroupeBenef(group: Locator) {
        return group.locator('i.btn-supprimer-groupe');
    }
  
}