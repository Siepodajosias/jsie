/**
 * 
 * Appli    : SOCIETES 
 * Menu     : Societes
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.8
 * 
 */
import { Locator, Page } from "@playwright/test"

export class PageSocietes {

    public readonly buttonCreerSociete                            : Locator;
    public readonly buttonModifierSociete                         : Locator;
    public readonly buttonModifierEnMasse                         : Locator;

    public readonly dataGridSocietesGest                          : Locator;
    public readonly dataGridCodesClients                          : Locator;
    public readonly spinnerLoading                                : Locator;

    //--- Popin : Création d'une societe ------------------------------------------------------------------------------------
    public readonly pPcreateInputRaisonSoc                        : Locator;
    public readonly pPcreateInputAdresse                          : Locator;
    public readonly pPcreateInputCplAdresse                       : Locator;
    public readonly pPcreateInputCodePostal                       : Locator;
    public readonly pPcreateInputVille                            : Locator;
    public readonly pPcreateInputLatitude                         : Locator;
    public readonly pPcreateInputLongitude                        : Locator;
    public readonly pPcreateInputCodeSite                         : Locator;
    public readonly pPcreatePrefixeCode                           : Locator;
    public readonly pPcreateInputCodeSociete                      : Locator;
    public readonly pPcreateInputTVACEE                           : Locator;
    public readonly pPcreateInputSiren                            : Locator;
    public readonly pPcreateInputSiret                            : Locator;
    public readonly pPcreateInputCodeAPE                          : Locator;
    public readonly pPcreateInputDpt                              : Locator;
    public readonly pPcreateInputLieuRCS                          : Locator;
    public readonly pPcreateInputNbrParts                         : Locator;
    public readonly pPcreateInputCapital                          : Locator;
    public readonly pPcreateInputDelaiEncai                       : Locator;

    public readonly pPcreateInputEmails                           : Locator;

    public readonly pPcreateCheckBoxImpres                        : Locator;
    public readonly pPcreateCheckBoxExoTVA                        : Locator;
    public readonly pPcreateCheckBoxINTERFEL                      : Locator;
    public readonly pPcreateCheckBoxRecRece                       : Locator;
    public readonly pPcreateCheckBoxFluxEnc                       : Locator;
    public readonly pCheckBoxAll                                  : Locator;

    public readonly pPcreateAutoCompDesiLDV                       : Locator;
    public readonly pPcreateLieLieu                               : Locator;
    public readonly pPcreateInputAbreviation                      : Locator;

    public readonly pPcreateListBoxEnseigne                       : Locator;
    public readonly pPcreateListBoxProduits                       : Locator;
    public readonly pPcreateListBoxUniversMetier                  : Locator;
    public readonly pPcreateListBoxPays                           : Locator;
    public readonly pPcreateListBoxRegion                         : Locator;
    public readonly pPcreateListBoxFormJuri                       : Locator;
    public readonly pListBoxItem                                  : Locator;
    public readonly pPcreateListBoxCptBanq                        : Locator;
    public readonly pPcreateListBoxCptAtten                       : Locator;
    public readonly pPcreateListBoxBaseCpt                        : Locator;

    public readonly pPcreateLinkAnnuler                           : Locator;

    public readonly pPcreateBtnEnregistrer                        : Locator; 
    public readonly pPcreateSpanSpinner                           : Locator; 
    public readonly pPcreateDatePickerExer                        : Locator;

    public readonly pPcreateTdDateDispo                           : Locator;
    public readonly pPcreateAutocompleteLieuVente                 : Locator;
    public readonly pPcreateListBoxItem                           : Locator;
    public readonly pPcreateButtonAlert                           : Locator;
    public readonly tableInputFiltre                              : Locator;
    public readonly iconNonValide                                 : Locator;
    public readonly iconCodeSociete                               : Locator;
    public readonly dataTdLieuVenteRaisonSociale                  : Locator;
    public readonly dataTrSocietesGest                            : Locator;
    public readonly pPcreateDatePickerToday                       : Locator;
    public readonly pPcreateInputEmail                            : Locator;
    public readonly pErrorMessage                                 : Locator;
    public readonly pPErrorMessage                                : Locator;
    public readonly pIconSuccess                                  : Locator;
    public readonly pIconError                                    : Locator;
    public readonly pLabelleRequired                              : Locator;

    constructor(page:Page){

        this.buttonCreerSociete                                    = page.locator('.footerBar button span.fa-plus');
        this.buttonModifierSociete                                 = page.locator('.footerBar button span.fa-pencil-alt');
        this.buttonModifierEnMasse                                 = page.locator('.footerBar button span.fa-random');

        this.dataGridSocietesGest                                  = page.locator('div.container-fluid > div > div:nth-child(1) table th.text-center');
        this.dataGridCodesClients                                  = page.locator('div.container-fluid > div > div:nth-child(2) table th.text-center');
        this.spinnerLoading                                        = page.locator('.app-spinner');

        //--- Popin : Création d'une societe ------------------------------------------------------------------------------------
        this.pPcreateInputRaisonSoc                                = page.locator('input[formcontrolname="raisonSociale"]');
        this.pPcreateInputAdresse                                  = page.locator('input[formcontrolname="adresse1"]');
        this.pPcreateInputCplAdresse                               = page.locator('input[formcontrolname="adresse2"]');
        this.pPcreateInputCodePostal                               = page.locator('input[formcontrolname="codePostal"]');
        this.pPcreateInputVille                                    = page.locator('input[formcontrolname="ville"]');
        this.pPcreateInputLatitude                                 = page.locator('input[formcontrolname="latitude"]');
        this.pPcreateInputLongitude                                = page.locator('input[formcontrolname="longitude"]');
        this.pPcreateInputCodeSite                                 = page.locator('input[formcontrolname="codeSiteComptable"]');
        this.pPcreatePrefixeCode                                   = page.locator('.prefixe-code');
        this.pPcreateInputCodeSociete                              = page.locator('input[formcontrolname="suffixeCodeSocieteComptable"]');
        this.pPcreateInputTVACEE                                   = page.locator('input[formcontrolname="tvaCEE"]');
        this.pPcreateInputSiren                                    = page.locator('input[formcontrolname="siren"]');
        this.pPcreateInputSiret                                    = page.locator('input[formcontrolname="cleSiret"]');
        this.pPcreateInputCodeAPE                                  = page.locator('input[formcontrolname="codeAPE"]');
        this.pPcreateInputDpt                                      = page.locator('input[formcontrolname="departement"]');
        this.pPcreateInputLieuRCS                                  = page.locator('input[formcontrolname="lieuRCS"]');
        this.pPcreateInputNbrParts                                 = page.locator('input[formcontrolname="nombreDeParts"]');
        this.pPcreateInputCapital                                  = page.locator('input[formcontrolname="capital"]');
        this.pPcreateInputDelaiEncai                               = page.locator('input[formcontrolname="delaiEncaissement"]');

        this.pPcreateInputEmails                                   = page.locator('p-chips[formcontrolname="emails"]');

        this.pPcreateCheckBoxImpres                                = page.locator('p-checkbox[formcontrolname="imprimerDocument"]');
        this.pPcreateCheckBoxExoTVA                                = page.locator('p-checkbox[formcontrolname="exonereTva"]');
        this.pPcreateCheckBoxINTERFEL                              = page.locator('p-checkbox[formcontrolname="exonereInterfel"]');
        this.pPcreateCheckBoxRecRece                               = page.locator('p-checkbox[formcontrolname="recevoirRecettes"]');
        this.pPcreateCheckBoxFluxEnc                               = page.locator('p-checkbox[formcontrolname="fluxEncaissement"]');
        this.pCheckBoxAll                                          = page.locator('p-tableheadercheckbox .p-checkbox-box');
        this.pPcreateAutoCompDesiLDV                               = page.locator('app-autocomplete[formcontrolname="lieu"]');
        this.pPcreateLieLieu                                       = page.locator('#actif[formcontrolname="lieLieu"]');
        this.pPcreateInputAbreviation                              = page.locator('input[formcontrolname="abreviation"]');

        this.pPcreateListBoxEnseigne                               = page.locator('p-dropdown[formcontrolname="enseigne"]');
        this.pPcreateListBoxProduits                               = page.locator('p-dropdown[formcontrolname="produits"]');
        this.pPcreateListBoxUniversMetier                          = page.locator('p-dropdown[formcontrolname="universMetier"]');
        this.pPcreateListBoxPays                                   = page.locator('p-dropdown[formcontrolname="pays"]');
        this.pPcreateListBoxRegion                                 = page.locator('p-dropdown[formcontrolname="region"]');
        this.pPcreateListBoxFormJuri                               = page.locator('p-dropdown[formcontrolname="formeJuridique"]');
        this.pPcreateListBoxCptBanq                                = page.locator('p-dropdown[formcontrolname="compteBancaire"]');
        this.pPcreateListBoxCptAtten                               = page.locator('p-dropdown[formcontrolname="compteAttente"]');
        this.pPcreateListBoxBaseCpt                                = page.locator('p-dropdown[formcontrolname="baseComptable"]');

        this.pPcreateLinkAnnuler                                   = page.locator('p-footer button.p-button-link');

        this.pPcreateBtnEnregistrer                                = page.locator('p-footer button.p-button:NOT(.p-button-link)'); 
        this.pPcreateSpanSpinner                                   = page.locator('span.app-spinner');

        this.pPcreateDatePickerExer                                = page.locator('p-calendar[formcontrolname="datePremierExercice"]');

        this.pPcreateTdDateDispo                                   = page.locator('td.ng-star-inserted:NOT(.p-datepicker-other-month):NOT(.text-center)');
        this.pPcreateAutocompleteLieuVente                         = page.locator('ngb-typeahead-window button');
        this.pPcreateListBoxItem                                   = page.locator('.p-dropdown-items > p-dropdownitem');
        this.pPcreateButtonAlert                                   = page.locator('.alert.alert-warning p-button');
        this.tableInputFiltre                                      = page.locator('.p-datatable-thead input.table-filtre');
        this.iconNonValide                                         = page.locator('i.fa-exclamation-triangle');
        this.iconCodeSociete                                       = page.locator('.groupe-code-societe-comptable i.fa-exclamation-triangle');
        this.dataTdLieuVenteRaisonSociale                          = page.locator('.p-datatable-tbody td.text-left');
        this.pListBoxItem                                          = page.locator('p-dropdownitem');
        this.dataTrSocietesGest                                    = page.locator('.p-datatable-tbody tr');
        this.pPcreateDatePickerToday                               = page.locator('.p-datepicker-today');
        this.pPcreateInputEmail                                    = page.locator('li.p-chips-input-token input[type="text"]');
        this.pErrorMessage                                         = page.locator('div.alert.alert-danger.alert-dismissable.alert-error');
        this.pPErrorMessage                                        = page.locator('small.p-error[style="visibility: visible;"]');
        this.pIconSuccess                                          = page.locator('em.success');
        this.pIconError                                            = page.locator('em.error');
        this.pLabelleRequired                                      = page.locator('[formgroupname="informationsJuridiques"] label.label-required');
    }
    
}