/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : AUTORISATION ACHATS CENTRALE
 * 
 * @author JOSIAS SIE
 * @version 3.15
 * 
 */

import { Page } from '@playwright/test';

export class AutorisationsAchatsCentrale {

    public readonly buttonPreparerComm     = this.page.locator('div.form-btn-section button').nth(0);
    public readonly buttonCloner           = this.page.locator('div.form-btn-section button').nth(1);
    public readonly buttonDeplacerVers     = this.page.locator('div.form-btn-section button').nth(2);
    public readonly buttonInitialiserEng   = this.page.locator('div.form-btn-section button').nth(3);
    public readonly buttonSupprimerLigne   = this.page.locator('div.form-btn-section button').nth(4);
    public readonly buttonModifierLigne    = this.page.locator('div.form-btn-section button').nth(5);
    public readonly buttonExporter         = this.page.locator('div.form-btn-section button').nth(6);
    public readonly buttonReinitLignes     = this.page.locator('div.form-btn-section button').nth(7);
    public readonly buttonReinitGlobale    = this.page.locator('div.form-btn-section button').nth(8);
    public readonly buttonPlus             = this.page.locator('button i.fa-plus');
    public readonly buttonConsulterLigne   = this.page.locator('div.form-btn-section button i.fa-eye');
    public readonly buttondropdownItem     = this.page.locator('button.dropdown-item');
 
    public readonly inputAssortiment        = this.page.locator('p-table[id="assortimentDg"] input'); 
    public readonly inputArticle            = this.page.locator('div.autocomplete-ajout-article input');

    public readonly toggleCommande          = this.page.locator('.btn-group').nth(0).locator('button');
    public readonly togglePrevision         = this.page.locator('.btn-group').nth(1).locator('button');

    public readonly dataGridListeAssort     = this.page.locator('.assortiments-ace th');    
    public readonly dataGridLignesAssort    = this.page.locator('.lignes-assortiments-ace th');     
    public readonly dataGridHeaderNbMag     = this.page.locator('th.datagrid-nombreMagasins p span');
    public readonly dataGridHeaderCdeArt    = this.page.locator('thead.p-datatable-thead th input').nth(4);
    public readonly dataGridHeaders         = this.page.locator('table-lignes-assortiment thead tr:nth-child(1) th');

    public readonly listBoxAutoComplete     = this.page.locator('div.autocomplete-article app-autocomplete button.dropdown-item');
    public readonly listBoxGroupeArticle    = this.page.locator('autorisations-assortiments .p-multiselect-trigger');
    public readonly listBoxDossierAchat     = this.page.locator('div.filtre-dossier-achat select#assortiment');

    public readonly listBoxGrpeArtInput     = this.page.locator('.p-multiselect-filter-container input');
    public readonly listBoxGrpeArtItem      = this.page.locator('ul p-multiselectitem');
    public readonly listBoxGrpeArtIcon      = this.page.locator('.p-multiselect-close-icon');

    public readonly trLignesAssortiments    = this.page.locator('#assortimentDg table.p-datatable-table tr td');
    public readonly trAssortimentParRech    = this.page.locator('autorisations-assortiments tr.p-element')
    public readonly trLignesArticles        = this.page.locator('p-table[id="assortimentLigneDg"] tr.p-element');
    public readonly trLignesLieuxVente      = this.page.locator('#dg-magasins-assortiments tr.selectionne');

    public readonly tdListeCodesArticles    = this.page.locator('td.datagrid-article-code span');
    public readonly tdListeLieuxVentes      = this.page.locator('#dg-magasins-assortiments tr.selectionne td.datagrid-code');

    public readonly labelInformations       = this.page.locator('.informations span');
    public readonly labelNbMagasins         = this.page.locator('div.selection.resume');

    public readonly checkBoxAssortiments    = this.page.locator('p-table[id="assortimentDg"] tr.p-element');
    public readonly checkBoxListeArticles   = this.page.locator('.lignes-assortiments-ace .datagrid-table-wrapper.paginator > table > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
    public readonly checkBoxCommande        = this.page.locator('td.datagrid-ouvertCommande input');
    public readonly checkBoxPrevision       = this.page.locator('td.datagrid-ouvertPrevision input');
    public readonly checkBoxAllAssortiments = this.page.locator('p-tableheadercheckbox div[role="checkbox"]');

    public readonly pictoModiferLigne       = this.page.locator('p-table[id="assortimentLigneDg"] tr.p-element td.col-actions button').nth(1);

    public readonly aLiensPagination        = this.page.locator('.pagination li:NOT(.ng-hide):NOT(.disabled) a');
    public readonly spinner                 = this.page.locator('.app-spinner'); //Datagrid Spinner 

    // -- POPIN : Préparer Communication ------------------------------------------------------------------------------------------------------

    public readonly pPlinkAnnuler               = this.page.locator('div.contenu-footer a'); 

    public readonly pPbuttonDiffuserCom         = this.page.locator('div.contenu-footer button').nth(0); 
    public readonly pPbuttonEnregistrerCom      = this.page.locator('div.contenu-footer button').nth(1); 
    public readonly pPbuttonFiltrePromo         = this.page.locator('button.button-rubrique').nth(0); 
    public readonly pPbuttonFiltreChgtPrix      = this.page.locator('button.button-rubrique').nth(1); 
    public readonly pPbuttonFiltreInfoLivraison = this.page.locator('button.button-rubrique').nth(2); 
    public readonly pPbuttonFiltreOuvertures    = this.page.locator('button.button-rubrique').nth(3); 
    public readonly pPbuttonFiltreFermetures    = this.page.locator('button.button-rubrique').nth(4); 
    public readonly pPbuttonFiltreInfoGal       = this.page.locator('button.button-rubrique').nth(5); 

    public readonly pPinputFitreArticleCom      = this.page.locator('div.filtre-article input'); 

    public readonly pPmultiSelectEnseigneCom    = this.page.locator('div.filtre-multiselect div.p-multiselect-label').nth(0); 
    public readonly pPmultiSelectPtfCom         = this.page.locator('div.filtre-multiselect div.p-multiselect-label').nth(1); 

    //-- POPIN : Enregistrement / Modification d'une ligne de l'assortiment {Nom Assortiment} --------------------------------------------------
    public readonly pPSelectCalibre             = this.page.locator('#formLigneAssortiment select[formcontrolname="calibreSelectionne"]').nth(0);
	public readonly pPSelectConditionnement     = this.page.locator('#formLigneAssortiment select[formcontrolname="conditionnementSelectionne"]').nth(0);
		
    public readonly pPlistBoxCalibre            = this.page.locator('#input-calibre');
    public readonly pPlistBoxConditionnement    = this.page.locator('#input-conditionnement');
    public readonly pPlistBoxCode               = this.page.locator('table-magasins table thead tr:nth-child(2) th:nth-child(2) div.p-multiselect');
    public readonly pPlistBoxDesignation        = this.page.locator('table-magasins table thead tr:nth-child(2) th:nth-child(3) div.p-multiselect');

    public readonly pPdataGridListeMagasins     = this.page.locator('table-magasins table tbody tr td:nth-child(3)');
    public readonly pPdataGridListeRecordIcon   = this.page.locator('table-magasins table tbody tr td:nth-child(12) i');
    public readonly pPdataGridListeRecord       = this.page.locator('table-magasins table tbody tr td:nth-child(12) ');
    public readonly pPDataGridMagasin           = this.page.locator('table-magasins').nth(0);

    public readonly pPbuttonEnregistrer         = this.page.locator('p-footer button');
    public readonly pPbuttonFermer              = this.page.locator('p-footer a');
    
    public readonly pFiltreStrategies           = this.page.locator('div.filtres-list div.control-group:nth-child(10)').nth(0);
    public readonly pFiltrePlatformes           = this.page.locator('div.filtres-list div.control-group:nth-child(12)').nth(0);
    public readonly pFiltreGammes               = this.page.locator('div.filtres-list div.control-group:nth-child(13)').nth(0);
    public readonly pFiltreGroupeMagasins       = this.page.locator('div.type-groupe-magasin:nth-child(6) ').nth(0);

    public readonly pPlinkEnregistrerOui        = this.page.locator('div.confirmation-conditionnement div.alert a[href="#"]').nth(0);
    public readonly pPlinkMinMaxEnregOui        = this.page.locator('div.confirmation-minmaxmultiple div.alert a[href="#"]').nth(0);
    public readonly pPlinkEnregistrerNon        = this.page.locator('div.confirmation-conditionnement div.alert a').nth(1);
    public readonly pPlinkMinMaxEnregNon        = this.page.locator('div.confirmation-minmaxmultiple div.alert a[href="#"]').nth(1);
    public readonly pPlinkFermer                = this.page.locator('span.pi-times');
    public readonly pErrorMessage               = this.page.locator('.alert-danger div').nth(0);

    public readonly pPinputEnrMinColis          = this.page.locator('input[formcontrolname="minimumCommandeValeurInput"]').nth(0);
    public readonly pPinputEnrMaxColis          = this.page.locator('input[formcontrolname="maximumCommandeValeurInput"]').nth(0);
    public readonly pPinputEnrMultipleColis     = this.page.locator('#multiple-commande');
    public readonly pPinputEnrFilter            = this.page.locator('div.p-multiselect-filter-container input');

    public readonly pPcheckBoxEnrFilter         = this.page.locator('p-multiselectitem li div.p-checkbox-box');
    public readonly pPcheckBoxEnrAllMag         = this.page.locator('thead p-checkbox');

    public readonly pPpictoEnrClose             = this.page.locator('svg.p-multiselect-close-icon');
    public readonly pPPictoRecom                = this.page.locator('i.pi-bookmark-fill.ng-star-inserted');

	public readonly pPtextAreaEnrComment        = this.page.locator('textarea[name="informationsMagasinValeurInput"]').nth(0);

    public readonly pPToggleGamme               = this.page.locator('div.control-group:nth-child(12) > div.filtres-magasins button');
    
    public readonly pFooterSpinner              = this.page.locator('.app-spinner'); //Footer spinner

    public readonly pPalertMessage              = this.page.locator('div.confirmation-conditionnement');
    public readonly pPalertMessageOui           = this.page.locator('div.confirmation-conditionnement a').nth(0);
    public readonly pPalertMessageNon           = this.page.locator('div.confirmation-conditionnement a').nth(1);

    //-- POPIN : Déplacer des articles depuis l'assortiment {Origine} ---------------------------------------------------------------------------
    public readonly pListBoxAssortiment     = this.page.locator('select[ng-model="assortimentCible"]');
    public readonly pListBoxSecteur         = this.page.locator('p-multiselect.secteur-prosol');
    public readonly pListBoxRegionProsol    = this.page.locator('p-multiselect.region-prosol');
    public readonly pListBoxRegionGeo       = this.page.locator('p-multiselect.region-geographique');
    public readonly pListBoxEnseigne        = this.page.locator('p-multiselect.enseigne');
    
    public readonly pAllcheckboxMultiselect = this.page.locator('.p-multiselect-panel .p-multiselect-header .p-checkbox')
    public readonly pCheckboxMultiselectItem= this.page.locator('.p-multiselect-panel .p-multiselect-items-wrapper ul li span');

    public readonly pToggleButtons          = this.page.locator('button[data-active-class="caracteristique-toggled"]');
    public readonly pToggleHabitudes        = this.page.locator('div.control-group:nth-child(5):NOT(.type-groupe-magasin) button');
    public readonly pToggleSmeva            = this.page.locator('div.control-group:nth-child(6):NOT(.type-groupe-magasin) button');
    public readonly pToggleMeubleUF         = this.page.locator('div.control-group:nth-child(7):NOT(.type-groupe-magasin) button');
    public readonly pToggleStrategie        = this.page.locator('div.control-group:nth-child(8):NOT(.type-groupe-magasin) button');
    public readonly pToggleinterneExterne   = this.page.locator('div.control-group:nth-child(9) > div.filtres-magasins button');
    public readonly pTogglePlaterforme      = this.page.locator('div.control-group:nth-child(10) > div.filtres-magasins button');
    public readonly pToggleGroupeMagasins   = this.page.locator('div.type-groupe-magasin:nth-child(6) button');
    public readonly pToggleSelectUnselect   = this.page.locator('p-selectbutton span.p-button-label');

    public readonly pDataGridActicles       = this.page.locator('.dg-articles-a-deplacer th');
    public readonly pDataGridMagasins       = this.page.locator('table-magasins tr:nth-child(1) th');    

    public readonly pButtonDeplacerArticle  = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pButtonFermer           = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    //-- POPIN : Export du cadencier ------------------------------------------------------------------------------------------------------------
    public readonly pInputMagasin           = this.page.locator('app-autocomplete#autoCompleteExportCadencier input');

    public readonly pAutoCompleteMagasin    = this.page.locator('ul.gfit-autocomplete-results li');

    public readonly pPbuttonExporter        = this.page.locator('p-footer button');
    public readonly pExportButtonFermer     = this.page.locator('p-footer a');

    //-- POPIN : Initialiser des engagements à partir de l'assortiment xxx ----------------------------------------------------------------------
    public readonly pInputInitAssortiment   = this.page.locator('.articles-assortiment span.input-large input');
    public readonly pInputInitEngagements   = this.page.locator('.engagements span.input-large input');
    public readonly pInputInitBascule       = this.page.locator('.articles-a-basculer span.input-large input');

    public readonly pCheckBoxInitNonOuvert  = this.page.locator('#toggle-actif');

    public readonly pButtonInitArrowRight   = this.page.locator('button.button-right');
    public readonly pButtonInitArrowLeft    = this.page.locator('button.button-left');
    public readonly pButtonInitValider      = this.page.locator('.form-initialiser-engagements .modal-footer button');

    public readonly pLinkInitFermer         = this.page.locator('.form-initialiser-engagements .modal-footer a');

    public readonly pDataGridInitAssort     = this.page.locator('.dg-articles-assortiment th');
    public readonly pDataGridInitEngagement = this.page.locator('.dg-engagements-initialisation th');
    public readonly pDataGridInitBascule    = this.page.locator('.dg-articles-a-basculer th');

    //-- POPIN : Réinitialisation globale des autorisations à partir d'un modèle --------------------------------------------------------------
    public readonly pListBoxModelAssort     = this.page.locator('[ng-model="modelesAssortimentChoisis"]');

    public readonly pButtonReinitGlobale    = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pButtonFermerglobale    = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    //-- POPIN : Clonage des autorisations ----------------------------------------------------------------------------------------------------
    public readonly pInputClonageFrom       = this.page.locator('#lieuDeVenteSource input');
    public readonly pInputClonageTo         = this.page.locator('#lieuDeVenteDestination input');

    public readonly pButtonClonerAuto       = this.page.locator('div.p-dialog-footer button');
    public readonly pButtonClonerFermer     = this.page.locator('div.p-dialog-footer a');  
    
    //-- POPIN : Suppression article ----------------------------------------------------------------------------------------------------
    public readonly pButtonConfirmOui       = this.page.locator('.p-dialog-footer button').nth(0);
    public readonly pButtonConfirmNon       = this.page.locator('.p-dialog-footer button').nth(1);
    public readonly pPspinner               = this.page.locator('p-footer span.app-spinner');

    // -- POPIN: Enregistrement d'une ligne de l'assortiment XXXX -------------------------------------------------------------------------------------------------------
    public readonly pPopinEnregLAssortFL    = this.page.locator('div.p-dialog-header');
    public readonly pPCarte                 = this.page.locator('p-dialog carte #carte');
    public readonly pPbuttonCarte           = this.page.locator('.fonctionnalite-carte  button').nth(0);
    public readonly pPButtonFermer          = this.page.locator('.p-dialog-footer button');
    public readonly pPIconCroix             = this.page.locator('.p-dialog-header-close-icon');

    //-----------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {}

}