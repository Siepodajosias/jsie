/**
 * Appli    : MAGASIN
 * Page     : FACTURATION
 * Onglet   : DEMANDE D'AVOIR
 * 
 * @author JOSIAS SIE
 * @version 3.3
 * 
 */
import { Page} from '@playwright/test';

export class FaturationDemandeAvoir {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonCreer                = this.page.locator('div.demandes-avoir div.form-btn-section button i.fa-plus');   
    public readonly buttonVoirPhotos           = this.page.locator('div.demandes-avoir div.form-btn-section button i.fa-camera');   

    public readonly inputFiltreCodeArticle     = this.page.locator('p-table th input.p-component').nth(0);
    public readonly inputFiltreArticle         = this.page.locator('p-table th input.p-component').nth(1);
    public readonly inputFiltreConditionnement = this.page.locator('p-table th input.p-component').nth(2);

    public readonly dataGridListeArticles      = this.page.locator('p-table tr:nth-child(1) th');  
    public readonly datePickerPeriode          = this.page.locator('p-calendar#periode'); 

    public readonly dataGridListeCodes         = this.page.locator('td.datagrid-article-code');
    public readonly dataGridListeMotifs        = this.page.locator('td.datagrid-motif');
    public readonly spinnerLoading             = this.page.locator('i.app-spinner');
    
    //-- POPIN : Création d'une demande d'avoir ----------------------------------------------------------------------

    public readonly pPlistBoxGroupeArticle     = this.page.locator('select[ng-model="groupeArticle"]');
    public readonly pPlistBoxTypeDAV           = this.page.locator('#type');
    public readonly pPlistBoxMotifDAV          = this.page.locator('select[ng-model="motif"]');

    public readonly pPdatePickerLivraison      = this.page.locator('#date-livraison');
    public readonly pPdatePickerDay            = this.page.locator('.datepicker-days');
    public readonly pPdataGridListeDAV         = this.page.locator('.lignes-avoir th');
    public readonly pPdataGridListeBL          = this.page.locator('.lignes-bon-livraison th');

    public readonly pPbuttonRechercherBLDef    = this.page.locator('#recherche-bl-demande-avoir');
    public readonly pPbuttonAjouter            = this.page.locator('[ng-click="calculQteManquante()"]');
    public readonly pPbuttonEnregistrer        = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer             = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    public readonly pPinputQuantiteDemandee    = this.page.locator('#quantite');
    public readonly pPinputPoidReelDemandee    = this.page.locator('input#poidsReelDemande');
    public readonly pInputNumeroBLLogistique   = this.page.locator('#numero-bl-logistique');
    public readonly pInputNumeroLotfournisseur = this.page.locator('#numero-lot-fournisseur');
    public readonly pInputUnite                = this.page.locator('#demande-unite');
    public readonly pInputDemandeColis         = this.page.locator('#demande-colis');
    public readonly pPinputArticle             = this.page.locator('input[ng-model="autoCompleteArticle.display"]');

    public readonly pPtextAreaObservations     = this.page.locator('#obs');

    public readonly pSpanDateDlcfournisseur    = this.page.locator('#date-dlc-fournisseur');
    public readonly pSpanNumeroBL              = this.page.locator('td.datagrid-numeroPrefix span');

    public readonly pPDivMessageValidation     = this.page.locator('.validation-dav .alert-info div.info');
    public readonly pPDivMessageConfirmation   = this.page.locator('.confirmation-creation .alert-info div.info');
    public readonly pPDivMessageError          = this.page.locator('.feedback-error li');

    public readonly pPAValider                 = this.page.locator('.boutons-valider-annuler a').nth(0);
    public readonly pPAAnnuler                 = this.page.locator('.boutons-valider-annuler a').nth(1);

    public readonly pPTrDemandeAvoir           = this.page.locator('.lignes-avoir table > tbody > tr');
    public readonly pPTrListeDamandeAvoir      = this.page.locator('p-table.correction-scrollable-header .p-datatable-tbody tr');
    public readonly pInputCodeArticle          = this.page.locator('p-table.correction-scrollable-header .p-datatable-thead tr th input.p-inputtext').nth(0);

    constructor(public readonly page: Page) {};
}