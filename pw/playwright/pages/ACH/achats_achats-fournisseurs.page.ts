/**
 * Appli    : ACHATS
 * Menu     : ACHATS
 * Onglet   : ACHATS FOURNISSEURS
 * 
 * 
 * @author JC CALVIERA & SIAKA KONE
 * @version 3.16
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAchAchFour {

    private readonly fonction                   : any;

    public readonly iconSupprFiltreUser         : Locator;
    public readonly iconMultiSelect             : Locator;

    public readonly inputMultiFiltre            : Locator;

    public readonly spinner                     : Locator;
    public readonly spinner2                    : Locator;
    public readonly spinner3                    : Locator;
    public readonly spinner4                    : Locator;
    public readonly spinnerLoading              : Locator;

    public readonly pPspinnerCrossdock          : Locator;

    public readonly buttonDatePicker            : Locator;    //('span.pi-calendar');    
    public readonly buttonToutAjouter           : Locator;    //('button span.fa-list');   
    
    public readonly pictoRazAcheteur            : Locator;    //('i.icon-remove');

    public readonly multiSelectAcheteur         : Locator;    //.all('[name="acheteur"]').nth(0);
    public readonly multiSelectPtfReception     : Locator;    //.all('[name="plateformeReception"]').nth(0);
    public readonly multiSelectPtfDistribution  : Locator;    //.all('[name="plateformeDistribution"]').nth(0);
    public readonly multiSelectDestinataire     : Locator;    //.all('[name="destinataire"]').nth(0);
    public readonly multiSelectTypeAchat        : Locator;    //.all('[name="typeAchat"]').nth(0);
    public readonly multiSelectStatut           : Locator;    //.all('[name="statut"]').nth(0);
    public readonly multiSelectAchat            : Locator;    //.all('.p-inputtext').nth(2);
    
    public readonly multiSelectAllChoices       : Locator;    //('div.p-multiselect-header div.p-checkbox');
    public readonly multiSelectClose            : Locator;    //('div.p-multiselect-header span.p-multiselect-close-icon');
    public readonly multiSelectTypeAchVide      : Locator;

    public readonly buttonCreerAchat            : Locator;    //('[title="Créer achat"]');
    public readonly buttonModifier              : Locator;    //('div.footer-menu button i.fa-pencil-alt');
    public readonly buttonVoirDetail            : Locator;    //('div.footer-menu button i.fa-eye');
    public readonly buttonImprimerBC            : Locator;    //('div.footer-menu button i.fa-print');
    public readonly buttonEnvoyerBCparMail      : Locator;    //('div.footer-menu button i.fa-envelope');
    public readonly buttonModifierCommAchat     : Locator;    //('[title="Modifier le commentaire de l\'achat"].btn-primary');
    public readonly buttonTousAchatsPourFourn   : Locator;    //('[title="Tous les achats pour le fournisseur"]');
    public readonly buttonBasculePrix           : Locator;    //.all('th button').nth(0);
    public readonly buttonBasculeColis          : Locator;    //.all('th button').nth(1);
    public readonly buttonFraisPrestation       : Locator;
    public readonly buttonSupprimer             : Locator;

    public readonly inputPrixAchat              : Locator;    //.all('[formcontrolname="prixAchat"]');
    public readonly inputPrixAchatVides         : Locator;    //.all('input.prix-achat:NOT(.ui-state-filled)');
    public readonly inputAcheteColisVides       : Locator;    //.all('input.achete-colis:NOT(.ui-state-filled)');
    public readonly inputColisEstime            : Locator;
    public readonly inputAcheteur               : Locator;

    public readonly dataGridAchats              : Locator;    //.all('div.datagrid th.text-center');
    public readonly dataGridAchat               : Locator;    //.all('div.datagrid th.text-center');
    public readonly tdActions                   : Locator;    //.all('td.col-actions');
    public readonly tdCalendarToday             : Locator;    //('td.ui-datepicker-today');
    public readonly tdListeDonnees              : Locator;    //.all('[formarrayname="lots"] tr.ui-selectable-row td');
    public readonly tdListAchat                 : Locator;    //.all('.p-datatable-tbody tr').nth(0);
    public readonly tdNumeroLotAchete           : Locator;
    public readonly tdLigneAchatSelected        : Locator;

    public readonly trLignesLots                : Locator;    //.all('detail-achat-fournisseur tbody tr');
    public readonly trLignesAcheteurs           : Locator;    //.all('tr.p-selectable-row');

    public readonly selectedListBoxConditio     : Locator;    //.all('[formarrayname="lots"] tr.ui-state-highlight [formcontrolname="conditionnement"]');

    public readonly listBoxConditionnement      : Locator;    //.all('[formcontrolname="conditionnement"]');
    public readonly listBoxConditionnementVides : Locator;
    public readonly listBoxCategorie            : Locator;    //.all('[formcontrolname="categorie"]');
    public readonly listBoxCategorieVides       : Locator;
    public readonly listBoxVariete              : Locator;    //.all('[formcontrolname="variete"]');
    public readonly listBoxVarieteVides         : Locator;
    public readonly listBoxOrigine              : Locator;    //.all('[formcontrolname="origine"]');
    public readonly listBoxOrigineVides         : Locator;
    public readonly listBoxCalibre              : Locator;    //.all('[formcontrolname="calibre"]');
    public readonly listBoxCalibreVide          : Locator;
    public readonly listBoxPtfDistribution      : Locator;    //.all('[formcontrolname="plateformeDistribution"]');
    public readonly listBoxIncoterm             : Locator;    //.all('[formcontrolname="incoterm"]');
    public readonly listBoxIncotermVides        : Locator;
    public readonly listBoxUniteAchat           : Locator;    //.all('[formcontrolname="uniteAchat"]');
    public readonly listBoxUniteAchatVides      : Locator;

    public readonly lignesResultatsLots         : Locator;    //.all('[formarrayname="lots"] div.ui-table-scrollable-body tr.ui-selectable-row');

    //-- Popin : Commentaire sur le bon de commande ----------------------------------------------------------------------
    public readonly pPcommButtonEnregistrer     : Locator;    //('saisie-commentaire-bon-commande-modal p-footer button:NOT(.p-button-link');

    public readonly pPcommLinkAnnuler           : Locator;    //('saisie-commentaire-bon-commande-modal p-footer a');

    public readonly pPcommInputGlobal           : Locator;    //('[formcontrolname="commentaireGlobal"]');
    public readonly pPcommInputGArticles        : Locator;    //.all('[formcontrolname="commentaire"]');

    //-- Form "Acheter" ---------------------------------------------------------------------------------------------------
    public readonly fAcheterButtonCreerAchat    : Locator;    //('[title="Créer achat"]');
    public readonly fAcheterButtonVoirDetail    : Locator;    //('button.btn-detail-lot');
    public readonly fAcheterbuttonAcheter       : Locator;    //('[title="Acheter"]');
    public readonly fAcheterbuttonAcheterConfirm: Locator;    //('[title="Acheter et confirmer"]');
    public readonly fAcheterbuttonEnregistrer   : Locator;    //('[title="Enregistrer"]');
    public readonly fAcheterButtonConfirmer     : Locator;    //('[title="Confirmer"]');
    public readonly fAcheterbuttonSupprimer     : Locator;    //('[title="Supprimer les lots"]');
    public readonly fAcheterbuttonSaisirPrixTrp : Locator;    //('[title="Saisir automatiquement les prix de transport"]');
    public readonly fAcheterbuttonRetourListe   : Locator;    //('[title="Retour à la liste"]');
    public readonly fAcheterButtonPlus          : Locator;    //('button .fa-plus');
    public readonly fAcheterButtonBasculePrix   : Locator;    //.all('th button').nth(0);

    public readonly fAcheterInputFournisseur    : Locator;    //('[formcontrolname="fournisseur"] input');
    public readonly fAcheterInputAcheteColis    : Locator;    //('[formcontrolname="acheteColis"]');
    public readonly fAcheterInputPoidsTotal     : Locator;    //('input-poids-total');
    public readonly fAcheterInputNbUnitesColis  : Locator;    //('[formcontrolname="nbUnitesParColis"]');
    public readonly fAcheterInputFiltreArticle  : Locator;    //('input.filtre-global');
    public readonly fAcheterInputAjoutArticle   : Locator;    //.all('div.form-ajout-article input.form-control');
    public readonly fAcheterInputPrixAchatError : Locator;    //.all('td.prix-achat input.ng-invalid');
    public readonly fAcheterInputNumAchat       : Locator;    //('tr th:nth-child(3) input');
    public readonly fAcheterInputColisEst       : Locator;
    public readonly fAcheterInputFourn          : Locator;


    public readonly fAcheterListBoxCalibre      : Locator;    //('[formcontrolname="calibre"]');
    public readonly fAcheterListBoxCondition    : Locator;    //('[formcontrolname="conditionnement"]');
    public readonly fAcheterListBoxAcheteur     : Locator;    //('[formcontrolname="acheteur"]');
    public readonly fAcheterListBoxCategorie    : Locator;    //('[formcontrolname="categorie"]');
    public readonly fAcheterListBoxVariete      : Locator;    //('[formcontrolname="variete"]');
    public readonly fAcheterListBoxVarDisabled  : Locator;
    public readonly fAcheterListBoxOrigine      : Locator;    //('[formcontrolname="origine"]');
    public readonly fAcheterListBoxPtfDistribut : Locator;    //('[formcontrolname="plateformeDistribution"]');
    public readonly fAcheterListBoxIncoterm     : Locator;    //('[formcontrolname="incoterm"]');
    public readonly fAcheterListBoxUniteAchat   : Locator;    //('[formcontrolname="uniteAchat"]');

    public readonly fAcheterLiinkOui            : Locator;    //.all('div.avertissement .alert a').nth(0);
    public readonly fAcheterLiinkNon            : Locator;    //.all('div.avertissement .alert a').nth(1);

    public readonly fAcheterListBoxPtfRecep     : Locator;    //('plateformeReception');

    public readonly fAcheterCheckBoxSelectAll   : Locator;    //('th div.ui-chkbox-box');
    public readonly fAcheterCheckBoxArticles    : Locator;    //.all('td div.ui-chkbox-box');

    public readonly fAcheterDopDownFilter       : Locator;    //('input.ui-dropdown-filter');
    public readonly fAcheterDropDownPtfRecep    : Locator;    //.all('#plateformeReception p-dropdownitem');
    public readonly fAcheterListAutocomplete    : Locator;    //.all('app-autocomplete button.dropdown-item');

    public readonly fAcheterPictoDateRecepPtf   : Locator;    //('div.detail-achat-fournisseur .pi-calendar');
    public readonly fAcheterPictoMoisSuivant    : Locator;    //('a.ui-datepicker-next');

    public readonly fAcheterLastDayOfMonth      : Locator;    //.all('td.ng-star-inserted:NOT(.ui-datepicker-other-month)');
    public readonly fAcheterDateToday           : Locator;    //('td.p-datepicker-today');
    public readonly fAcheterDateActive          : Locator;
    public readonly fAcheterDatePicker          : Locator;
    public readonly fAcheterNextMonth           : Locator;

    public readonly fAcheterLabelNumAchat       : Locator;    //.all('div.form-horizontal:nth-child(3) .controls label');
    public readonly fAcheterLabelNumLot         : Locator;
    public readonly fAcheterDataGridLignes      : Locator;    //.all('table tbody tr.ng-untouched');
    public readonly fAcheterDataGridTrSelected  : Locator;    //.all('tr.ng-touched.ui-state-highlight');

    public readonly fAcheterMessageErreur       : Locator;    //('[nom="detailVueFournisseurErreur"]');

    public readonly fAcheterTextAreaConsRepart  : Locator;    //('input-consignes-repartition');
    public readonly fAcheterTextAreaConsRecep   : Locator;    //('input-consignes-reception');
    public readonly fAcheterTextAreaConsprepa   : Locator;    //('input-consignes-preparation');

    public readonly fAcheterListBoxSelected     : Locator;    //.all('ngb-highlight');

    //-- Popin : Confirmation ---------------------------------------------------------------------------------------------
    public readonly pPconfirmButtonAcheter      : Locator;    //.all('p-confirmdialog button').nth(2);
    public readonly pPconfirmButtonAnnuler      : Locator;    //.all('p-confirmdialog button').nth(1);

    //-- Popin : Suppression de lots --------------------------------------------------------------------------------------
    public readonly pPsuppresButtonSupprimer    : Locator;    //.all('div.ui-dialog-footer button');

    public readonly pPsuppresLinkAnnuler        : Locator;    //.all('div.ui-dialog-footer a');

    //-- Popin : Saisie du lot: xxxx - Date d'expédition en magasin : dd / mm / yyyy --------------------------------------
    //public readonly pPsuppresButtonSupprimer    : Locator;    //.all('div.ui-dialog-footer button');
    public readonly pPsaisieButtonEnregistrer   : Locator;    //('[title="Enregistrer et fermer."]');
    public readonly pPsaisieButtonColis         : Locator;    //('[title="Recopier l\'acheté vers le confirmé"]');
    public readonly pPsaisieButtonPoids         : Locator;    //(''); 
    public readonly pPsaisiebuttonPPOui         : Locator;    //('[ng-click="$event.preventDefault(); enregistrerLot();"]');

    public readonly pPsaisieSLinkAnnuler        : Locator;    //.all('div.ui-dialog-footer a');

    public readonly pPsaisiePpopin              : Locator;    //('saisie-lot-modal');

    public readonly pPsaisieInputPrixTransport  : Locator;    //('input-prix-transport');
    public readonly pPsaisieInputBL             : Locator;    //('input-bon-de-livraison');
    public readonly pPSwitchLabel               : Locator; //('[role="switch"] .p-button-label')

    //-- Popin Saisie des informations de l'achat
    public readonly pPinputFiltreCodeArticle    : Locator;    //('input.filtre-global');
    public readonly pPbuttonBasculerColisEst    : Locator;    //('.p-datatable-thead tr th:nth-child(17)');
    public readonly pPbuttonEnregistrer         : Locator;    //('button[title="Enregistrer"]');

    //-- Popin Detail lot

    public readonly pPinputPoidsTheorique       : Locator;    //('input-poids-theorique');
    public readonly pPinputPoidsTotal           : Locator;    //('input-poids-total');

    public readonly pPbuttonDetailLot           : Locator;    //('.containerBT button.btn-detail-lot');
    public readonly pPbuttonEnregistrerDeLot    : Locator;    //.all('p-footer button:NOT([disabled])').nth(0)

    public readonly pPcheckBoxAllLot            : Locator;    //('.p-datatable-thead p-tableheadercheckbox');
    public readonly pPcheckBoxLot               : Locator;    //page.locator('p-tablecheckbox div.p-checkbox')
    public readonly pPiconConfirmerColis        : Locator;    //('.controls button span.icon-share-alt');

    public readonly buttonAchater               : Locator;    //('button[title="Acheter"]');
    public readonly buttonConfirmerAchat        : Locator;    //('.containerBT button[title="Confirmer"]');
    public readonly alertErreur                 : Locator;
    public readonly listBoxVarie                : Locator;
    public readonly listBoxEmpty                : Locator;
    public readonly pPbuttonAlertOuiNon         : Locator;
    public readonly pPSuppresButtonSupprimer    : Locator;
    public readonly selectFirstAutoComp         : Locator;

    public readonly tdDernierPrixAchat          : Locator;

    public readonly trBasculeDernierPrixAch     : Locator;
    public readonly trBasculeDernierPrixAch1    : Locator;
    public readonly trBasculerColisEstime       : Locator;
    public readonly trBasculerColisEstime1      : Locator;
    //-- Détail de la préparation de l'achat automatique
    public readonly pPtablePreparation          : Locator;
    public readonly pPlabelFournisseur          : Locator;
    public readonly pPlabelDateExpedition       : Locator;
    public readonly pPlabelPlteDistribut        : Locator;

    public readonly pPbuttonImportFichFour      : Locator;
    public readonly pPbuttonExporter            : Locator;
    public readonly pPbuttonConfirmerAchat      : Locator;
    
    public readonly tdStatutAchat               : Locator;
    public readonly labelStatutAchat            : Locator;

    public readonly labelAlerte                 : Locator;

    constructor(public readonly page: Page, fonction:any = null) {
        
        this.fonction                   = fonction;

        this.iconSupprFiltreUser        = page.locator('.p-multiselect-clear-icon');
        this.iconMultiSelect            = page.locator('.multipleSelectSize');

        this.inputMultiFiltre           = page.locator('.p-multiselect-filter');

        this.spinner                    = page.locator('div.p-datatable-loading-overlay');
        this.spinner2                   = page.locator('i.app-spinner');
        this.spinner3                   = page.locator('.app-spinner.p-datatable-loading-icon.ng-star-inserted');
        this.spinner4                   = page.locator('div[formarrayname="lots"] i.app-spinner');
        this.spinnerLoading             = page.locator('.app-spinner.p-datatable-loading-icon');

        this.pPspinnerCrossdock         = page.locator('.app-spinner');

        this.pictoRazAcheteur           = page.locator('i.icon-remove');
    
        this.multiSelectAcheteur        = page.locator('[name="acheteur"]').nth(0);
        this.multiSelectPtfReception    = page.locator('[name="plateformeReception"]').nth(0);
        this.multiSelectPtfDistribution = page.locator('[name="plateformeDistribution"]').nth(0);
        
        this.multiSelectDestinataire    = page.locator('[name="destinataire"]').nth(0);
        this.multiSelectTypeAchat       = page.locator('[name="typeAchat"]').nth(0);
        this.multiSelectStatut          = page.locator('[name="statut"]').nth(0);
        this.multiSelectAchat           = page.locator('.p-inputtext').nth(2);
        
        this.multiSelectAllChoices      = page.locator('div.p-multiselect-header div.p-checkbox');
        this.multiSelectClose           = page.locator('.p-multiselect-close .p-multiselect-close-icon');
        this.multiSelectTypeAchVide     = page.locator('p-multiselectitem li[aria-label=" "]');
    
        this.buttonDatePicker           = page.locator('span.pi-calendar');    
        this.buttonToutAjouter          = page.locator('button span.fa-list');   
        this.buttonCreerAchat           = page.locator('button[title="Créer achat"]');
        this.buttonModifier             = page.locator('div.footer-menu button i.fa-pencil-alt');
        this.buttonVoirDetail           = page.locator('div.footer-menu button i.fa-eye');
        this.buttonImprimerBC           = page.locator('div.footer-menu button i.fa-print');
        this.buttonEnvoyerBCparMail     = page.locator('div.footer-menu button i.fa-envelope');
        this.buttonSupprimer            = page.locator('div.footer-menu button i.fa-times');
        this.buttonModifierCommAchat    = page.locator('[title="Modifier le commentaire de l\'achat"].btn-primary');
        this.buttonFraisPrestation      = page.locator('div.footer-menu button i.fa-thumbtack');
        this.buttonTousAchatsPourFourn  = page.locator('[title="Tous les achats pour le fournisseur"]');
        this.buttonBasculePrix          = page.locator('th button').nth(0);
        this.buttonBasculeColis         = page.locator('th button').nth(1);
        this.buttonModifier             = page.locator('.containerBT button[title="Modifier"]');
    
        this.inputPrixAchat             = page.locator('[formcontrolname="prixAchat"]');
        this.inputPrixAchatVides        = page.locator('input.prix-achat:NOT(.ui-state-filled)');
        this.inputAcheteColisVides      = page.locator('input.achete-colis:NOT(.ui-state-filled)');
        this.inputColisEstime           = page.locator('[formcontrolname="estimeColis"]');
        this.inputAcheteur              = page.locator('#acheteur');
    
        this.dataGridAchats             = page.locator('div.datagrid th.text-center');
        this.dataGridAchat              = page.locator('.p-datatable-scrollable-table .p-datatable-tbody');

        this.tdActions                  = page.locator('td.col-actions');
        this.tdCalendarToday            = page.locator('td.ui-datepicker-today');
        this.tdListeDonnees             = page.locator('[formarrayname="lots"] tr.ui-selectable-row td');
        this.tdListAchat                = page.locator('.p-datatable-tbody tr'); //.nth(0)
        this.tdDernierPrixAchat         = page.locator('tbody tr td:nth-child(13)');
        this.tdNumeroLotAchete          = page.locator('[formcontrolname="acheteColis"]');
        this.tdLigneAchatSelected       = page.locator('tr.p-element.p-selectable-row');
    
        this.trLignesLots               = page.locator('detail-achat-fournisseur tbody tr');
        this.trLignesAcheteurs          = page.locator('tr.p-selectable-row');
        this.trBasculeDernierPrixAch    = page.locator('td .pi-arrow-right').nth(0);
        this.trBasculeDernierPrixAch1   = page.locator('.p-selectable-row td:nth-child(14) .pi-arrow-right');
        this.trBasculerColisEstime      = page.locator('td .pi-arrow-right').nth(1);
        this.trBasculerColisEstime1     = page.locator('.p-selectable-row td:nth-child(17) .pi-arrow-right');
        
        this.selectedListBoxConditio    = page.locator('[formarrayname="lots"] tr.ui-state-highlight [formcontrolname="conditionnement"]');
    
        this.listBoxConditionnement     = page.locator('[formcontrolname="conditionnement"]');
        this.listBoxConditionnementVides= page.locator('[formcontrolname="conditionnement"] label.ui-dropdown-label-empty');
        this.listBoxCategorie           = page.locator('[formcontrolname="categorie"]');
        this.listBoxCategorieVides      = page.locator('[formcontrolname="categorie"] label.ui-dropdown-label-empty');
        this.listBoxVariete             = page.locator('[formcontrolname="variete"]');
        this.listBoxVarieteVides        = page.locator('[formcontrolname="variete"] label.ui-dropdown-label-empty');
        this.listBoxOrigine             = page.locator('[formcontrolname="origine"]');
        this.listBoxOrigineVides        = page.locator('[formcontrolname="origine"] label.ui-dropdown-label-empty');
        this.listBoxCalibre             = page.locator('[formcontrolname="calibre"]');
        this.listBoxCalibreVide         = page.locator('[formcontrolname="calibre"] label.ui-dropdown-label-empty');
        this.listBoxPtfDistribution     = page.locator('[formcontrolname="plateformeDistribution"]');
        this.listBoxIncoterm            = page.locator('[formcontrolname="incoterm"]');
        this.listBoxIncotermVides       = page.locator('[formcontrolname="incoterm"] label.ui-dropdown-label-empty');
        this.listBoxUniteAchat          = page.locator('[formcontrolname="uniteAchat"]');
        this.listBoxUniteAchatVides     = page.locator('[formcontrolname="uniteAchat"] label.ui-dropdown-label-empty');
    
        this.lignesResultatsLots        = page.locator('[formarrayname="lots"] div.ui-table-scrollable-body tr.ui-selectable-row');
    
        //-- Popin : Commentaire sur le bon de commande ----------------------------------------------------------------------
        this.pPcommButtonEnregistrer    = page.locator('saisie-commentaire-bon-commande-modal p-footer button:NOT(.p-button-link)');
    
        this.pPcommLinkAnnuler          = page.locator('saisie-commentaire-bon-commande-modal p-footer a');
    
        this.pPcommInputGlobal          = page.locator('[formcontrolname="commentaireGlobal"]');
        this.pPcommInputGArticles       = page.locator('[formcontrolname="commentaire"]');
    
        //-- Form "Acheter" ---------------------------------------------------------------------------------------------------
        this.fAcheterButtonCreerAchat   = page.locator('[title="Créer achat"]');
        this.fAcheterButtonVoirDetail   = page.locator('button.btn-detail-lot');
        this.fAcheterbuttonAcheter      = page.locator('[title="Acheter"]');
        this.fAcheterbuttonAcheterConfirm= page.locator('[title="Acheter et confirmer"]');
        this.fAcheterbuttonEnregistrer  = page.locator('[title="Enregistrer"]');
        this.fAcheterButtonConfirmer    = page.locator('[title="Confirmer"]');
        this.fAcheterbuttonSupprimer    = page.locator('[title="Supprimer les lots"]');
        this.fAcheterbuttonSaisirPrixTrp= page.locator('[title="Saisir automatiquement les prix de transport"]');
        this.fAcheterbuttonRetourListe  = page.locator('[title="Retour à la liste"]');
        this.fAcheterButtonPlus         = page.locator('button .fa-plus');
        this.fAcheterButtonBasculePrix  = page.locator('th button').nth(0);
    
        this.fAcheterInputFournisseur   = page.locator('[formcontrolname="fournisseur"] input');
        this.fAcheterInputAcheteColis   = page.locator('[formcontrolname="acheteColis"]');
        this.fAcheterInputPoidsTotal    = page.locator('input-poids-total');
        this.fAcheterInputNbUnitesColis = page.locator('[formcontrolname="nbUnitesParColis"]');
        this.fAcheterInputFiltreArticle = page.locator('input.filtre-global');
        this.fAcheterInputAjoutArticle  = page.locator('div.form-ajout-article input.form-control');
        this.fAcheterInputPrixAchatError= page.locator('td.prix-achat input.ng-invalid');
        this.fAcheterInputNumAchat      = page.locator('tr th:nth-child(3) input');
        this.fAcheterInputFourn         = page.locator('tr th:nth-child(2) input');
    
        this.fAcheterListBoxCalibre     = page.locator('[formcontrolname="calibre"]');
        this.fAcheterListBoxCondition   = page.locator('[formcontrolname="conditionnement"]');
        this.fAcheterListBoxAcheteur    = page.locator('[formcontrolname="acheteur"]');
        this.fAcheterListBoxCategorie   = page.locator('[formcontrolname="categorie"]');
        this.fAcheterListBoxVariete     = page.locator('[formcontrolname="variete"]');
        this.fAcheterListBoxVarDisabled = page.locator('[formcontrolname="variete"] .p-disabled');
        this.fAcheterListBoxOrigine     = page.locator('[formcontrolname="origine"]');
        this.fAcheterListBoxPtfDistribut= page.locator('[formcontrolname="plateformeDistribution"]');
        this.fAcheterListBoxIncoterm    = page.locator('[formcontrolname="incoterm"]');
        this.fAcheterListBoxUniteAchat  = page.locator('[formcontrolname="uniteAchat"]');
        this.fAcheterInputColisEst      = page.locator('[formcontrolname="estimeColis"]');
    
        this.fAcheterLiinkOui           = page.locator('div.avertissement .alert a').nth(0);
        this.fAcheterLiinkNon           = page.locator('div.avertissement .alert a').nth(1);
    
        this.fAcheterListBoxPtfRecep    = page.locator('#plateformeReception');
    
        this.fAcheterCheckBoxSelectAll  = page.locator('th div.ui-chkbox-box');
        this.fAcheterCheckBoxArticles   = page.locator('td div.ui-chkbox-box');
    
        this.fAcheterDopDownFilter      = page.locator('input.ui-dropdown-filter');
        this.fAcheterDropDownPtfRecep   = page.locator('#plateformeReception p-dropdownitem');
        this.fAcheterListAutocomplete   = page.locator('app-autocomplete button.dropdown-item');
    
        this.fAcheterPictoDateRecepPtf  = page.locator('div.detail-achat-fournisseur .pi-calendar');
        this.fAcheterPictoMoisSuivant   = page.locator('a.ui-datepicker-next');
    
        this.fAcheterLastDayOfMonth     = page.locator('td.ng-star-inserted:NOT(.ui-datepicker-other-month)');
        this.fAcheterDateToday          = page.locator('td.p-datepicker-today');
        this.fAcheterDateActive         = page.locator('.p-datepicker-calendar tbody tr td:NOT(.p-datepicker-other-month)');
        this.fAcheterDatePicker         = page.locator('button.p-datepicker-trigger');
        this.fAcheterNextMonth          = page.locator('.p-datepicker-next-icon');
    
        this.fAcheterLabelNumAchat      = page.locator('div.form-horizontal:nth-child(3) .controls label');
        this.fAcheterLabelNumLot        = page.locator('td.text-center:nth-child(21)');
    
        this.fAcheterDataGridLignes     = page.locator('table tbody tr.ng-untouched');
        this.fAcheterDataGridTrSelected = page.locator('tr.ng-touched.ui-state-highlight');
    
        this.fAcheterMessageErreur      = page.locator('[nom="detailVueFournisseurErreur"]');
    
        this.fAcheterTextAreaConsRepart = page.locator('input-consignes-repartition');
        this.fAcheterTextAreaConsRecep  = page.locator('input-consignes-reception');
        this.fAcheterTextAreaConsprepa  = page.locator('input-consignes-preparation');
    
        this.fAcheterListBoxSelected    = page.locator('ngb-highlight');
    
        //-- Popin : Confirmation ---------------------------------------------------------------------------------------------
        this.pPconfirmButtonAcheter     = page.locator('p-confirmdialog button').nth(2);
        this.pPconfirmButtonAnnuler     = page.locator('p-confirmdialog button').nth(1);
    
        //-- Popin : Suppression de lots --------------------------------------------------------------------------------------
        this.pPsuppresButtonSupprimer   = page.locator('div.ui-dialog-footer button');
        this.pPSuppresButtonSupprimer   = page.locator('p-footer button').nth(0);
        this.pPsuppresLinkAnnuler       = page.locator('div.ui-dialog-footer a');
    
        //-- Popin : Saisie du lot: xxxx - Date d'expédition en magasin : dd / mm / yyyy --------------------------------------
        //this.pPsuppresButtonSupprimer   = page.locator('div.ui-dialog-footer button');
        this.pPsaisieButtonEnregistrer  = page.locator('[title="Enregistrer et fermer."]');
        this.pPsaisieButtonColis        = page.locator('[title="Recopier l\'acheté vers le confirmé"]');
        this.pPsaisieButtonPoids        = page.locator(''); 
        this.pPsaisiebuttonPPOui        = page.locator('[ng-click="$event.preventDefault(); enregistrerLot();"]');
    
        this.pPsuppresLinkAnnuler       = page.locator('div.ui-dialog-footer a');
    
        this.pPsaisiePpopin             = page.locator('saisie-lot-modal');
    
        this.pPsaisieInputPrixTransport = page.locator('#input-prix-transport');
        this.pPsaisieInputBL            = page.locator('#input-bon-de-livraison');
        this.pPSwitchLabel              = page.locator('[role="switch"] .p-button-label');
        //-- Popin Saisie des informations de l'achat
        this.pPinputFiltreCodeArticle   = page.locator('input.filtre-global');
        this.pPbuttonBasculerColisEst   = page.locator('.p-datatable-thead tr th:nth-child(17)');
        this.pPbuttonEnregistrer        = page.locator('button[title="Enregistrer"]');
    
        //-- Popin Detail lot
    
        this.pPinputPoidsTheorique      = page.locator('#input-poids-theorique');
        this.pPinputPoidsTotal          = page.locator('#input-poids-total');
    
        this.pPbuttonDetailLot          = page.locator('.containerBT button.btn-detail-lot');
        this.pPbuttonEnregistrerDeLot   = page.locator('p-footer button:NOT([disabled])').nth(0);
        this.pPbuttonAlertOuiNon        = page.locator('.alert.alert-error a');
            
        this.pPcheckBoxAllLot           = page.locator('.p-datatable-thead p-tableheadercheckbox .p-checkbox');
        this.pPcheckBoxLot              = page.locator('p-tablecheckbox div.p-checkbox');
        this.pPiconConfirmerColis       = page.locator('.controls button span.icon-share-alt');
    
        this.buttonAchater              = page.locator('button[title="Acheter"]');
        this.buttonConfirmerAchat       = page.locator('.containerBT button[title="Confirmer"]');

        this.alertErreur                = page.locator('.alert.alert-error');

        this.listBoxVarie               = page.locator('p-dropdownitem li');
        this.listBoxEmpty               = page.locator('.p-dropdown-empty-message');

        this.selectFirstAutoComp        = page.locator('ngb-typeahead-window button');

       //-- Détail de la préparation de l'achat automatique
        this.pPtablePreparation         = page.locator('.p-datatable-thead').nth(1).locator('tr:nth-child(1) th');

        this.pPlabelFournisseur         = page.locator('.control-label.fournisseur span');
        this.pPlabelDateExpedition      = page.locator('.control-label.date-expedition span');
        this.pPlabelPlteDistribut       = page.locator('.control-label.plateforme-distribution span');

        this.pPbuttonImportFichFour     = page.locator('p-fileupload[name="fichierFournisseur"]');
        this.pPbuttonExporter           = page.locator('.p-button-secondary');
        this.pPbuttonConfirmerAchat     = page.locator('p-footer button.p-button:NOT(.p-button-link)');

        this.tdStatutAchat              = page.locator('span.statut-achat');
        this.labelStatutAchat           = page.locator('label span.statut-achat');

        this.labelAlerte                = page.locator('.alert-dismissable div.ng-star-inserted');
    }

    /**
     * 
     * @param page 
     * @param sValue Valeur à sélécetionner dans la liste déroulante active
     */
    public async selectFilter(page:Page, sValue:string): Promise<void> {
        await this.fonction.clickElement(page.locator('p-dropdownitem li[aria-label="'+sValue+'"]'));
    }

}