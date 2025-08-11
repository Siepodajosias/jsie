/**
 * 
 * FACTURATION PAGE > FACTURATION / ONGLET > LISTES DES FACTURES
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class FacturationListeFactures {

    public readonly buttonRechercher                            : Locator;
    public readonly buttonComptabiliserAcrhiver                 : Locator;
    public readonly buttonVisualiserFactures                    : Locator;
    public readonly buttonVisualiserBL                          : Locator;
    public readonly buttonGenereDEBvente                        : Locator;
    public readonly buttonGenereDEBventeFacture                 : Locator;
    public readonly buttonGenereDEBventeAvoir                   : Locator;
    public readonly buttonGenereDEBachat                        : Locator;
    public readonly buttonGenereDEBachatFacture                 : Locator;
    public readonly buttonGenereDEBachatAvoir                   : Locator;
    public readonly buttonGenereDEBFacture                      : Locator;
    public readonly buttonGenereDEBAvoir                        : Locator;
    public readonly buttonImprimerLesFactures                   : Locator;

    public readonly listBoxTypeTiers                            : Locator;
    public readonly listBoxGpeArticle                           : Locator;

    public readonly inputNumeroBL                               : Locator;
    public readonly inputNumeroFacture                          : Locator;
    public readonly inputTiers                                  : Locator;
    public readonly inputMontantMini                            : Locator;     
    public readonly inputMontantMaxi                            : Locator;   
    
    public readonly dataGridListeFactures                       : Locator;
    public readonly dataGridLigneFacture                        : Locator;
    public readonly dataGridLigneFactureEyeIcon                 : Locator;
    public readonly dataGridDateFacture                         : Locator;
    public readonly dataGridArchiveeIcon                        :Locator;
    public readonly dataGridNumeroFacture                       : Locator;
    public readonly dataGridListeParametrageConst               : Locator;

    public readonly datePickerFrom                              : Locator;
    public readonly datePickerTo                                : Locator;
    public readonly datePickerPreviousMonth                     : Locator;
    public readonly datePickerEnabledDays                       : Locator;

    public readonly spanComptabiliserAcrhiver                   : Locator;

    public readonly toggleButtonTous                            : Locator;
    public readonly toggleButtonAvoir                           : Locator;         
    public readonly toggleButtonFacture                         : Locator;

    public readonly labelNbPiecesAComptabiliser                 : Locator;

    public readonly headerDate                                  : Locator;
    public readonly headerArchivee                              : Locator;

    public readonly divAlertErreurConfirmation                  : Locator;

    //-- Popin : Confirmation de la comptabilisation et de l'archivage ----------------------------------------------------------
    public readonly pButtonComptabiliserArchiver                : Locator;
    public readonly pButtonFermer                               : Locator;

    public readonly pSpinnerImage                               : Locator;

    public readonly pDatePickerDateFactureMaxi                  : Locator;

    public readonly pLabelQuestion                              :Locator  

    public readonly pListBoxCentraleAchat                       : Locator;  
    public readonly pListBoxCentraleAchatItem                   : Locator;

    public readonly pChoixCentraleAchat                         : Locator;
    public readonly spanSpinnerLoading                          : Locator;
    public readonly imgSpinnerLoading                           : Locator;
    //-- Popin : Génération de fichier DEB vente PRO Douane de Facture ---------------------------------------------------------------

    public readonly pPopinGenerationFichierDebVPDFacture        : Locator;

    public readonly pVentFacButtonPrevisuDEB                    : Locator;
    public readonly pVentFacButtonDEBFacture                    : Locator;
    public readonly pVentFacButtonAnnuler                       : Locator;

    public readonly pVentFacInputDateMois                       : Locator;

    //-- Popin : Génération de fichier DEB vente PRO Douane des Avoirs ----------------------------------------------------------------

    public readonly pPopinGenerationFichierDebVPDAvoirs         : Locator;

    public readonly pVentAvoirButtonDEBAvoirs                   : Locator;
    public readonly pVentAvoirButtonAnnuler                     : Locator; 

    public readonly pVentAvoirInputDateMois                     : Locator;

    constructor(page:Page){

        this.buttonRechercher                                   = page.locator('[ng-click="queryFactures()"]');
        this.buttonComptabiliserAcrhiver                        = page.locator('[ng-click="popupArchivage.open = true"]');
        this.buttonVisualiserFactures                           = page.locator('[ng-click="visualiser(dg.selection, false)"]');
        this.buttonVisualiserBL                                 = page.locator('[ng-click="visualiser(dg.selection, true)"]');
        this.buttonGenereDEBvente                               = page.locator('button#popoverDebVente');
        this.buttonGenereDEBventeFacture                        = page.locator('#popoverDebVente button').nth(0);
        this.buttonGenereDEBventeAvoir                          = page.locator('#popoverDebVente button').nth(1);
        this.buttonGenereDEBachat                               = page.locator('button#popoverDebAchat');
        this.buttonGenereDEBachatFacture                        = page.locator('#popoverDebAchat button').nth(0);
        this.buttonGenereDEBachatAvoir                          = page.locator('#popoverDebAchat button').nth(1);
        this.buttonGenereDEBFacture                             = page.locator('[ng-click="options.ouvrirDebFacturePopup()"]');
        this.buttonGenereDEBAvoir                               = page.locator('[ng-click="options.ouvrirDebAvoirPopup()"]');
        this.buttonImprimerLesFactures                          = page.locator('[ng-click="ouvrirPopupImpression(dg.selection)"]');

        this.listBoxTypeTiers                                   = page.locator('#input-filter-type-facturable');
        this.listBoxGpeArticle                                  = page.locator('#input-filter-groupe-article-groupe');

        this.inputNumeroBL                                      = page.locator('[ng-model="filter.numeroBL"]');
        this.inputNumeroFacture                                 = page.locator('[ng-model="filter.numero"]');
        this.inputTiers                                         = page.locator('.recherche-facturable > input');
        this.inputMontantMini                                   = page.locator('#input-montant-min > input');       
        this.inputMontantMaxi                                   = page.locator('#input-montant-max > input');    
        
        this.dataGridListeFactures                              = page.locator('.datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridLigneFacture                               = page.locator('.datagrid-table-wrapper > table > tbody> tr ');
        this.dataGridLigneFactureEyeIcon                        = page.locator('a i.icon-eye-open');
        this.dataGridListeParametrageConst                      = page.locator('table > thead > tr > th.text-center');
        this.dataGridArchiveeIcon                               = page.locator('.datagrid-archivee span.icon-ok');
        this.dataGridDateFacture                                = page.locator('.datagrid-table-wrapper td.datagrid-dateBF');
        this.dataGridNumeroFacture                              = page.locator('.datagrid-table-wrapper td.datagrid-numeroComptabilisation');

        this.datePickerFrom                                     = page.locator('.datepicker-wrapper').nth(0);
        this.datePickerTo                                       = page.locator('.datepicker-wrapper').nth(1);
        this.datePickerPreviousMonth                            = page.locator('div.datepicker-days th.prev');
        this.datePickerEnabledDays                              = page.locator('td.day:NOT(.old):NOT(.new)');
        
        this.spanComptabiliserAcrhiver                          = page.locator('.form-btn-section span[ng-show="peutComptabiliser() && hasWriteAccess() && !loadingImpression"]');

        this.toggleButtonTous                                   = page.locator('.gfit-toggle-buttons button').nth(0);
        this.toggleButtonAvoir                                  = page.locator('.gfit-toggle-buttons button').nth(1);
        this.toggleButtonFacture                                = page.locator('.gfit-toggle-buttons button').nth(2);

        this.labelNbPiecesAComptabiliser                        = page.locator('.containerBT span.ng-binding');

        this.headerDate                                         = page.locator('th[data-attribut="dateBF"]');
        this.headerArchivee                                     = page.locator('th[data-attribut="archivee"]');

        //-- Popin : Confirmation de la comptabilisation et de l'archivage ----------------------------------------------------------
        this.pButtonComptabiliserArchiver                       = page.locator('div.p-dialog-footer p-button button:NOT(.p-button-link)');
        this.pButtonFermer                                      = page.locator('div.modal.hide.in > div.modal-footer > a');

        this.pSpinnerImage                                      = page.locator('comptabiliser-archiver-modal-wrapper .app-spinner');
        
        this.pDatePickerDateFactureMaxi                         = page.locator('#formEnvoiArchivageFactures .icon-calendar');

        this.pLabelQuestion                                     = page.locator('#formEnvoiArchivageFactures div.ng-binding');

        this.pListBoxCentraleAchat                              = page.locator('p-dropdown[formcontrolname="centraleAchat"] div.p-dropdown');
        this.pListBoxCentraleAchatItem                          = page.locator('p-dropdown[formcontrolname="centraleAchat"] div.p-dropdown p-dropdownitem li');

        this.pChoixCentraleAchat                                = page.locator('p-dropdownitem li[role="option"]');
        this.spanSpinnerLoading                                 = page.locator('span.app-spinner');
        this.imgSpinnerLoading                                  = page.locator('[ng-show="loading"] img');
        //-- Popin : Génération de fichier DEB vente PRO Douane de Facture ---------------------------------------------------------------

        this.pPopinGenerationFichierDebVPDFacture               = page.locator('div.p-dialog-header')

        this.pVentFacButtonPrevisuDEB                           = page.locator('div.p-dialog-footer button').nth(0);     // <<< Môche mais pas mieux pour le moment...
        this.pVentFacButtonDEBFacture                           = page.locator('div.p-dialog-footer button').nth(1);
        this.pVentFacButtonAnnuler                              = page.locator('div.p-dialog-footer button').nth(2);

        this.pVentFacInputDateMois                              = page.locator('button.p-datepicker-trigger');

        //-- Popin : Génération de fichier DEB vente PRO Douane des Avoirs ----------------------------------------------------------------

        this.pPopinGenerationFichierDebVPDAvoirs                = 

        this.pVentAvoirButtonDEBAvoirs                          = page.locator('div.p-dialog-footer button').nth(0);
        this.pVentAvoirButtonAnnuler                            = page.locator('div.p-dialog-footer button').nth(1);

        this.pVentAvoirInputDateMois                            = page.locator('button.p-datepicker-trigger');

        this.divAlertErreurConfirmation                         = page.locator('alert .alert.alert-danger');
    }
}
