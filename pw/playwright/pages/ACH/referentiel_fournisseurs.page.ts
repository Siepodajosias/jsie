/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : FOURNISSEURS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.5
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefFou {

    public readonly buttonCreer                 : Locator;   //(by.css('[ng-click="openSaisieFournisseur()"]');
    public readonly buttonModifier              : Locator;   //(by.css('[ng-click="openSaisieFournisseur(dg.selection[0])"]');
    public readonly buttonRemise                : Locator;   //(by.css('[ng-click="openSaisieRemiseFournisseur(dg.selection[0])"]');    
    public readonly buttonReferenceArticle      : Locator;   //(by.css('[ng-click="openSaisieReferenceArticle(dg.selection[0])"]');
    public readonly buttonSaisieAuto            : Locator;  // <-- Ta ToDo
    public readonly buttonCalendrier            : Locator;  // <-- Ta ToDo
    public readonly buttonExportFournisseurs    : Locator;  // <-- Ta ToDo

    public readonly inputFiltreArticle          : Locator;   //(by.css('input.filter-input');

    public readonly checkBoxListeFournisseurs   : Locator;   //.all(by.css('.table-fournisseurs td input');

    public readonly tdDesignationFournisseur    : Locator;   //.all(by.css('td.datagrid-designation');
    public readonly tdFournisseursActifs        : Locator;
    public readonly tdFournisseursEmails        : Locator;
    public readonly tdFournisseursEmailsAchats  : Locator;

    public readonly dataGridArticles            : Locator;   //.all(by.css('.table-fournisseurs div.datagrid-table-wrapper > table > thead > tr > th');  

    //-- Popin : Saisie des prix catalogue, remises & taxes pour le fournisseur XXXXXX ---------------------------------------------------------
    public readonly pButtonPlusRemise           : Locator;   //(by.css('[ng-click="ajouterRemiseGlobale()"]');
    public readonly pButtonPlusCatalogue        : Locator;   //(by.css('[ng-click="ajouterPrixCatalogue()"]');
    public readonly pButtonCalculerPrixRemise   : Locator;   //(by.css('[ng-click="$event.preventDefault();calculerPrixCataloguesRemises()"]');
    public readonly pButtonAppliquerLignes      : Locator;   //(by.css('[ng-click="$event.preventDefault();appliquerDateProchainPrix()"]');
    public readonly pButtonEnregsitrerFermer    : Locator;   //.all(by.css('.modal-saisie-remise-fournisseur .modal-footer button').nth(0);
    public readonly pButtonEnregsitrer100Fermer : Locator;   //.all(by.css('.modal-saisie-remise-fournisseur .modal-footer button').nth(1);

    public readonly pLinkAnnuler                : Locator;   //(by.css('#form-saisie-remise-fournisseur .modal-footer a');

    public readonly pListBoxTypeRemiseTaxe      : Locator;   //(by.id('select-type-remise-ajout');
    public readonly pListBoxMarques             : Locator;   //(by.id('select-marque-ajout');
    public readonly pListBoxApplications        : Locator;   //(by.id('select-type-application-ajout');
    public readonly pListBoxUniteAchat          : Locator;

    public readonly pInputPourcentage           : Locator;   //(by.model('ajoutRemiseGlobale.valeur');
    public readonly pInputFiltreArticle         : Locator;   //(by.model('filtreArticle.codeDesignation');     
    public readonly pInputCodeOuDesignation     : Locator;   //(by.id('autocomplete-article-remise-article-ajout');
    public readonly pInputPrixCatalogue         : Locator;   //(by.model('ajoutPrixCatalogue.prixCatalogue');
    public readonly pInputProchainPrix          : Locator;   //(by.model('ajoutPrixCatalogue.prochainPrixCatalogue');
    public readonly pInputDelaiLivraison        : Locator;   //(by.model('ajoutPrixCatalogue.delaiLivraison');
    public readonly pInputMinCommande           : Locator;   //(by.model('ajoutPrixCatalogue.minimumCommande');

    public readonly pCheckBoxAjoutAlaLigne      : Locator;   //(by.id('checkbox-toggle-a-la-ligne-ajout');

    public readonly pDatePickerFrom             : Locator;   //.all(by.css('.vue-date-debut input.taille-input-date').nth(0);
    public readonly pDatePickerTo               : Locator;   //.all(by.css('.vue-date-fin input.taille-input-date').nth(0);
    public readonly pDatePickerFromIcon         : Locator;   //.all(by.css('.vue-date-debut i').nth(0);
    public readonly pDatePickerToIcon           : Locator;   //.all(by.css('.vue-date-fin i').nth(0);
    public readonly pDatePickerTaxeRemise       : Locator;   //(by.css('.remise-article-add-panel input.taille-input-date');
    public readonly pDatePickerDaysList         : Locator;   //.all(by.css('td.day');

    public readonly pDataGridRemiseGlobale      : Locator;   //.all(by.css('.table-remise-fournisseur-globale th');
    public readonly pDataGridRemiseArticle      : Locator;   //.all(by.css('.table-remise-article th');
    public readonly pDataGridRemiseFournisseur  : Locator;   //.all(by.css('.table-remise-fournisseur-article th');

    public readonly tdDesignationArticle        : Locator;   //.all(by.css('td.vue-remise-article');
    public readonly tdPrixCatalogue             : Locator;   //.all(by.css('td.vue-remise-prix-catalogue');

    //-- Popin : Création d'un fournisseur -----------------------------------------------------------------------------------------------------
    public readonly pInputNomSocieteFourn       : Locator;   //(by.id('fournisseur-designation');
    public readonly pInputAdresseFourn          : Locator;   //(by.id('fournisseur-adresse');
    public readonly pInputTelFourn              : Locator;   //(by.id('fournisseur-telephone');
    public readonly pInputCodePostalFourn       : Locator;   //(by.id('fournisseur-cp');
    public readonly pInputCommune               : Locator;
    public readonly pInputEmailFourn            : Locator;   //(by.id('fournisseur-email');
    public readonly pInputEmailEnvAchats        : Locator;
    public readonly pInputFaxFourn              : Locator;   //(by.id('fournisseur-fax');
    public readonly pInputCodeFourn             : Locator;   //(by.id('fournisseur-code');
    public readonly pInputComplementFourn       : Locator;   //(by.id('fournisseur-complement-adresse');
    public readonly pInputVilleFourn            : Locator;   //(by.id('fournisseur-ville');
    public readonly pInputEdiFourn              : Locator;   //(by.id('fournisseur-ean-edi');
    public readonly pInputTvaIntraFourn         : Locator;   //(by.id('fournisseur-tva-intracommunautaire');
    public readonly pInputSirenFourn            : Locator;   //(by.id('fournisseur-siren');

    public readonly plistBoxPaysFourn           : Locator;   //(by.id('fournisseur-pays');
    public readonly pListBoxLangueFourn         : Locator;   //(by.id('fournisseur-langue');
    public readonly pListBoxDeviseFourn         : Locator;   //(by.id('fournisseur-devise');
    public readonly pListBoxMarchandiseFourn    : Locator;   //(by.id('fournisseur-pays-introduction-marchandise');
    public readonly pListBoxCollectifFourn      : Locator;   //(by.id('fournisseur-collectif');
    public readonly pListBoxRegimeTvaFourn      : Locator;   //(by.id('fournisseur-regime');
    public readonly pListBoxCentraleAchat       : Locator;   //(by.id('centrale-achat');
    public readonly pListBoxModeEnvCmde         : Locator;

    public readonly pTextAreaComFourn           : Locator;   //(by.id('fournisseur-commentaire');

    public readonly pButtonEnregistrerFourn     : Locator;   //(by.css('#form-saisie-fournisseur .modal-footer button:not(.ng-hide)');
    
    public readonly pLinkAnnulerFourn           : Locator;   //(by.css('#form-saisie-fournisseur .modal-footer a');

    public readonly pToggleActif                : Locator;
    public readonly pToggleControleDimColis     : Locator;
    public readonly pToggleAgreageAuto          : Locator;
    public readonly pToggleRapprocherFactures   : Locator;


    // POPIN : Référentiel articles du fournisseur xxxx ----------------------------------------------------------------------------------------
    public readonly pPrefArtInputDesignation   : Locator;   //(by.css('app-autocomplete[formcontrolname="article"] input');
    public readonly pPrefArtInputReference     : Locator;   //(by.css('div.p-datatable-header input[formcontrolname="referenceArticle"]');
    public readonly pPrefArtinputEanEdi        : Locator;   //(by.css('div.p-datatable-header input[formcontrolname="eanEdi"]');


    public readonly pPrefArtFiltreCodeArticle  : Locator;   //(by.css('p-columnfilter[field="article.code"] input');
    public readonly pPrefArtFiltreDesignation  : Locator;   //(by.css('p-columnfilter[field="article.designation"] input');
    public readonly pPrefArtFiltreRefArticle   : Locator;   //(by.css('p-columnfilter[field="referenceArticle"] input');
    public readonly pPrefArtFiltreCommentaire  : Locator;   //(by.css('p-columnfilter[field="commentaireCommande"] input');
    public readonly pPrefArtFiltreEanEdi       : Locator;   //(by.css('p-columnfilter[field="eanEdi"] input');

    public readonly pPrefArtListBoxMarque      : Locator;   //(by.css('div.p-datatable-header p-dropdown[formcontrolname="marque"]');
    public readonly pPrefArtListBoxCalendrier  : Locator;   //(by.css('div.p-datatable-header p-dropdown[formcontrolname="calendrier"]');

    public readonly pPrefArtListBoxMultiMarque : Locator;   //(by.css('p-columnfilter[field="marque.marque"]');
    public readonly pPrefArtListBoxMultiCalend : Locator;   //(by.css('p-columnfilter[field="calendrier.nom"]');

    public readonly pPrefArtButtonPlus         : Locator;   //(by.css('span.pi-plus');
    public readonly pPrefArtButtonAjoutListe   : Locator;   //(by.css('span.pi-list');
    public readonly pPrefArtButtonAnregistrer  : Locator;   //(by.css('div.p-dialog-footer button.p-button:not(.p-button-link)');

    public readonly pPrefArtlinkAnnuler        : Locator;   //(by.css('div.p-dialog-footer button.p-button-link');

    public readonly pPrefArtDataGrid           : Locator;   //.all(by.css('div.datagrid thead tr:nth-child(1) th');

    public readonly pPrefArtDataGridCode       : Locator;   //.all(by.css('div.datagrid tbody tr td:nth-child(2)');

    
    public readonly pButtonCreerFourn          : Locator;   
        
    public readonly plistBoxTypologieFourn     : Locator;
    public readonly plistBoxItem               : Locator;
    //-----------------------------------------------------------------------------------------------------------------------

    public async selectListBox(page:Page, selector:Locator, sCible:string = ''):Promise<void>{
        await selector.scrollIntoViewIfNeeded();                            
        await selector.click();
        await page.waitForTimeout(125);
        await page.locator('p-dropdownitem li span:text-is("' + sCible + '")').click();
    }

    //-----------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;

        this.plistBoxItem               = page.locator('.p-dropdown-items-wrapper .p-dropdown-items > p-dropdownitem li > span');

        this.pButtonCreerFourn          = page.locator('#form-saisie-fournisseur .modal-footer button:not(.ng-hide)');
        this.buttonCreer                = page.locator('[ng-click="openSaisieFournisseur()"]');
        this.buttonModifier             = page.locator('[ng-click="openSaisieFournisseur(dg.selection[0])"]');
        this.buttonRemise               = page.locator('[ng-click="openSaisieRemiseFournisseur(dg.selection[0])"]');    
        this.buttonReferenceArticle     = page.locator('[ng-click="openSaisieReferenceArticle(dg.selection[0])"]');
        this.buttonSaisieAuto           = page.locator('[ng-click="openSuppressionSaisiesAutomatiques(dg.selection[0])"]');
        this.buttonCalendrier           = page.locator('[ng-click="openCalendrierCommandeFournisseur(dg.selection[0])"]');
        this.buttonExportFournisseurs   = page.locator('[ng-click="imprimerFournisseurs()"]');
    
        this.inputFiltreArticle         = page.locator('input.filter-input');
    
        this.checkBoxListeFournisseurs  = page.locator('.table-fournisseurs td input');
    
        this.tdDesignationFournisseur   = page.locator('td.datagrid-designation');
        this.tdFournisseursActifs       = page.locator('td.datagrid-actif span.icon-ok');
        this.tdFournisseursEmails       = page.locator('td.datagrid-contactPrincipal-email');
        this.tdFournisseursEmailsAchats = page.locator('td.datagrid-emailsAchat');
    
        this.dataGridArticles           = page.locator('.table-fournisseurs div.datagrid-table-wrapper > table > thead > tr > th');  
    
        //-- Popin : Saisie des prix catalogue, remises & taxes pour le fournisseur XXXXXX ---------------------------------------------------------
        this.pButtonPlusRemise          = page.locator('[ng-click="ajouterRemiseGlobale()"]');
        this.pButtonPlusCatalogue       = page.locator('[ng-click="ajouterPrixCatalogue()"]');
        this.pButtonCalculerPrixRemise  = page.locator('[ng-click="$event.preventDefault();calculerPrixCataloguesRemises()"]');
        this.pButtonAppliquerLignes     = page.locator('[ng-click="$event.preventDefault();appliquerDateProchainPrix()"]');
        this.pButtonEnregsitrerFermer   = page.locator('.modal-saisie-remise-fournisseur .modal-footer button').nth(0);
        this.pButtonEnregsitrer100Fermer= page.locator('.modal-saisie-remise-fournisseur .modal-footer button').nth(1);
    
        this.pLinkAnnuler               = page.locator('#form-saisie-remise-fournisseur .modal-footer a');
    
        this.pListBoxTypeRemiseTaxe     = page.locator('#select-type-remise-ajout');
        this.pListBoxMarques            = page.locator('#select-marque-ajout');
        this.pListBoxApplications       = page.locator('#select-type-application-ajout');
        this.pListBoxUniteAchat         = page.locator('[ng-model="ajoutPrixCatalogue.uniteAchatPrixCatalogue"]');

        this.pInputPourcentage          = page.locator('[ng-model="ajoutRemiseGlobale.valeur"]');
        this.pInputFiltreArticle        = page.locator('[ng-model="filtreArticle.codeDesignation"]');     
        this.pInputCodeOuDesignation    = page.locator('#autocomplete-article-remise-article-ajout');
        this.pInputPrixCatalogue        = page.locator('[ng-model="ajoutPrixCatalogue.prixCatalogue"]');
        this.pInputProchainPrix         = page.locator('[ng-model="ajoutPrixCatalogue.prochainPrixCatalogue"]');
        this.pInputDelaiLivraison       = page.locator('[ng-model="ajoutPrixCatalogue.delaiLivraison"]');
        this.pInputMinCommande          = page.locator('[ng-model="ajoutPrixCatalogue.minimumCommande"]');
    
        this.pCheckBoxAjoutAlaLigne     = page.locator('#checkbox-toggle-a-la-ligne-ajout');
    
        this.pDatePickerFrom            = page.locator('.vue-date-debut input.taille-input-date').nth(0);
        this.pDatePickerTo              = page.locator('.vue-date-fin input.taille-input-date').nth(0);
        this.pDatePickerFromIcon        = page.locator('.vue-date-debut i').nth(0);
        this.pDatePickerToIcon          = page.locator('.vue-date-fin i').nth(0);
        this.pDatePickerTaxeRemise      = page.locator('.remise-article-add-panel input.taille-input-date');
        this.pDatePickerDaysList        = page.locator('td.day');
    
        this.pDataGridRemiseGlobale     = page.locator('.table-remise-fournisseur-globale th');
        this.pDataGridRemiseArticle     = page.locator('.table-remise-article th');
        this.pDataGridRemiseFournisseur = page.locator('.table-remise-fournisseur-article th');

        this.tdDesignationArticle       = page.locator('td.vue-remise-article');
        this.tdPrixCatalogue            = page.locator('td.vue-remise-prix-catalogue');
    
        //-- Popin : Création d'un fournisseur -----------------------------------------------------------------------------------------------------
        this.pInputNomSocieteFourn      = page.locator('#fournisseur-designation');
        this.pInputAdresseFourn         = page.locator('#fournisseur-adresse');
        this.pInputTelFourn             = page.locator('#fournisseur-telephone');
        this.pInputCodePostalFourn      = page.locator('input[formcontrolname="codePostal"]');
        this.pInputEmailFourn           = page.locator('#fournisseur-email');
        this.pInputEmailEnvAchats       = page.locator('p-chips[formcontrolname="emailsAchat"] input');
        this.pInputFaxFourn             = page.locator('#fournisseur-fax');
        this.pInputCodeFourn            = page.locator('#fournisseur-code');
        this.pInputCommune              = page.locator('input[formcontrolname="ville"]');
        this.pInputComplementFourn      = page.locator('#fournisseur-complement-adresse');
        this.pInputVilleFourn           = page.locator('input[formcontrolname="ville"]');
        this.pInputEdiFourn             = page.locator('#fournisseur-eanEdi');
        this.pInputTvaIntraFourn        = page.locator('#fournisseur-tvaIntracommunautaire');
        this.pInputSirenFourn           = page.locator('#fournisseur-siren');
    
        this.plistBoxPaysFourn          = page.locator('p-dropdown#fournisseur-pays');// ('p-dropdown[formcontrolname="pays"]')
        this.pListBoxLangueFourn        = page.locator('p-dropdown#fournisseur-langues');//('#fournisseur-langues:NOT(.p-dropdown)')
        this.pListBoxDeviseFourn        = page.locator('p-dropdown[id="fournisseur-devise"]');
        this.pListBoxMarchandiseFourn   = page.locator('#fournisseur-paysIntroductionMarchandise:NOT(.p-dropdown)');
        this.pListBoxCollectifFourn     = page.locator('#fournisseur-collectifFournisseur:NOT(.p-dropdown)');//('#fournisseur-collectifFournisseur')
        this.pListBoxRegimeTvaFourn     = page.locator('p-dropdown[formcontrolname="regimeTva"]');
        this.pListBoxCentraleAchat      = page.locator('p-dropdown[formcontrolname="centraleAchat"]');
        this.plistBoxTypologieFourn     = page.locator('#fournisseur-typologieFournisseur:NOT(.p-dropdown)');//('#fournisseur-typologieFournisseur')
        this.pListBoxModeEnvCmde        = page.locator('#modeEnvoiCommande:NOT(.p-dropdown)');

        this.pTextAreaComFourn          = page.locator('#fournisseur-commentaire');
    
        this.pButtonEnregistrerFourn    = page.locator('edition-fournisseur-modal-wrapper button.btn-enregistrer');
        
        this.pLinkAnnulerFourn          = page.locator('edition-fournisseur-modal-wrapper p-button[styleclass="p-button-link"]');

        this.pToggleActif               = page.locator('p-inputswitch[formcontrolname="actif"] > div');
        this.pToggleControleDimColis    = page.locator('p-inputswitch[formcontrolname="controleDimensionColis"] > div');
        this.pToggleAgreageAuto         = page.locator('p-inputswitch[formcontrolname="agreageAutomatique"] > div');
        this.pToggleRapprocherFactures  = page.locator('p-inputswitch[formcontrolname="rapprocherFactures"] > div');

    
        // POPIN : Référentiel articles du fournisseur xxxx ----------------------------------------------------------------------------------------
        this.pPrefArtInputDesignation   = page.locator('app-autocomplete[formcontrolname="article"] input');
        this.pPrefArtInputReference     = page.locator('div.p-datatable-header input[formcontrolname="referenceArticle"]');
        this.pPrefArtinputEanEdi        = page.locator('div.p-datatable-header input[formcontrolname="eanEdi"]');
    
    
        this.pPrefArtFiltreCodeArticle  = page.locator('p-columnfilter[field="article.code"] input');
        this.pPrefArtFiltreDesignation  = page.locator('p-columnfilter[field="article.designation"] input');
        this.pPrefArtFiltreRefArticle   = page.locator('p-columnfilter[field="referenceArticle"] input');
        this.pPrefArtFiltreCommentaire  = page.locator('p-columnfilter[field="commentaireCommande"] input');
        this.pPrefArtFiltreEanEdi       = page.locator('p-columnfilter[field="eanEdi"] input');
    
        this.pPrefArtListBoxMarque      = page.locator('div.p-datatable-header p-dropdown[formcontrolname="marque"]');
        this.pPrefArtListBoxCalendrier  = page.locator('div.p-datatable-header p-dropdown[formcontrolname="calendrier"]');
    
        this.pPrefArtListBoxMultiMarque = page.locator('p-columnfilter[field="marque.marque"]');
        this.pPrefArtListBoxMultiCalend = page.locator('p-columnfilter[field="calendrier.nom"]');
    
        this.pPrefArtButtonPlus         = page.locator('span.pi-plus');
        this.pPrefArtButtonAjoutListe   = page.locator('span.pi-list');
        this.pPrefArtButtonAnregistrer  = page.locator('div.p-dialog-footer button.p-button:not(.p-button-link)');
    
        this.pPrefArtlinkAnnuler        = page.locator('div.p-dialog-footer button.p-button-link');
    
        this.pPrefArtDataGrid           = page.locator('div.datagrid thead tr:nth-child(1) th');
        this.pPrefArtDataGridCode       = page.locator('div.datagrid tbody tr td:nth-child(2)');
    
    }

}