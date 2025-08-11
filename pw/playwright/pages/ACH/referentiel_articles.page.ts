/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : ARTICLES
 * 
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefArt {

    public readonly buttonModifier              : Locator;   //(by.css('[ng-click="modifierArticle(dg.selection[0])"]');
    public readonly buttonRechercher            : Locator;   //(by.css('[ng-click="recupererArticles()"]');

    public readonly inputFiltreArticle          : Locator;   //(by.model('autocompleteArticle.display');
    public readonly inputFiltreFournisseur      : Locator;   //(by.model('autocompleteFournisseur.display');
    public readonly inputFiltreGencod           : Locator;   //(by.model('autocompleteGencod.display');    

    public readonly toggleButtonActif           : Locator;   //(by.model('recherche.actif').all(by.css('.btn-group button');
    public readonly toggleButtonAchetable       : Locator;   //(by.model('recherche.achetable').all(by.css('.btn-group button');
    
    public readonly dataGridArticles            : Locator;   //.all(by.css('.table-articles th');

    public readonly listBoxGroupeArticle        : Locator;   //(by.model('recherche.groupeArticle');        

    public readonly checkBoxArticleIncomplet    : Locator;   //(by.model('showArticleIncomplet');
    public readonly checkBoxListeArticles       : Locator;   //.all(by.css('datagrid td input');

    public readonly thDgFournisseurs            : Locator;   //(by.css('th.datagrid-fournisseurs');
    public readonly thDgCodesArticle            : Locator;
    public readonly tdDgCodesArticles           : Locator;   //.all(by.css('td.datagrid-code');
    public readonly tdDgDesignationsArticles    : Locator;   //.all(by.css('td.datagrid-designation');
    public readonly tdDgFournisseur             : Locator;
    public readonly tdDgRefArticleFournisseur   : Locator;
    public readonly tdDgActions                 : Locator;

    public readonly tdActiveDays                : Locator;   //.all(by.css('td.day:NOT(.disabled)');
    public readonly tdToday                     : Locator;   //(by.css('td.today');

    public readonly autoCompleteArticles        : Locator;   //.all(by.css('.gfit-autocomplete-results li');
    public readonly autoCompleteArts            : Locator;
    public readonly autoCompleteFournisseur     : Locator;


    //-- Popin : Modification de l'article XXXXXXXXXXXXX ----------------------------------------------------------

    public readonly pPmodifButtonEnregEtFermer  : Locator;   //.all(by.css('.modal-footer button').nth(0);
    public readonly pPmodifButtonEnregSansFermer: Locator;   //.all(by.css('.modal-footer button').nth(1);

    public readonly pPmodifLinkFermer           : Locator;   //(by.css('.modal-footer a');

    //---- Bloc : Informations d'identification 
    //---- ToDo
    public readonly pPmodifInputFournisseur     : Locator;   //(by.id('fournisseur');

    public readonly pPmodifHeaderIdentif        : Locator;   //.all(by.css('.info-identification .icon-chevron-down');
    public readonly pPmodifHeaderConditionnement: Locator;   //.all(by.css('.conditionnement .icon-chevron-down');

    //---- Bloc : Conditionnement
    public readonly pPmodifTdDesignation        : Locator;   //.all(by.css('datagrid.conditionnement-datagrid td.datagrid-designation');
    public readonly pPmodifTdPaletisation       : Locator;   //.all(by.css('datagrid.conditionnement-datagrid td.datagrid-palettisation');

    public readonly pPmodifPictoEtagesPalettes  : Locator;   //(by.css('span.icon-resize-full');

    public readonly pPmodifButtonAjouter        : Locator;   //(by.css('div.sous-emballage button.ng-binding');

    //---- Bloc Conditionnement > Popover : Saisie des étages
    public readonly pPmodifCondSaisiPopover     : Locator;   //(by.css('div.p-overlaypanel-content');

    public readonly pPmodifCondSaisiPButtAjout  : Locator;   //(by.css('button.btn-ajout-etage');
    public readonly pPmodifCondSaisiButtValider : Locator;   //(by.css('div.popover-footer button:NOT(.p-button-link)');

    public readonly pPmodifCondSaisiInputCPC    : Locator;   //.all(by.css('[formcontrolname="colisParCouche"]');
    public readonly pPmodifCondSaisiInputCouche : Locator;   //.all(by.css('[formcontrolname="couchesParEtage"]');

    //---- ToDo
        
    //---- Bloc : Prix et remises 
    public readonly pPmodifInputPrixCatalogueHT : Locator;   //(by.model('articleFournisseur.remises.prixCatalogue.prixCatalogue');
    public readonly pPmodifInputNextPrixCatHT   : Locator;   //(by.model('articleFournisseur.remises.prixCatalogue.prochainPrixCatalogue');
    public readonly pPmodifInputValeurRemise    : Locator;   //(by.model('remise.valeur');

    public readonly pPmodifDatePickerApplicabilite   : Locator;   //(by.css('.remise-article-add-panel .icon-calendar');
    public readonly pPmodifDatePickerPrixRemise : Locator;   //.all(by.css('.span5 .icon-calendar').nth(0);
    public readonly pPmodifDatePickerDebut      : Locator;   //.all(by.css('.span5 .icon-calendar').nth(1);
    public readonly pPmodifDatePickerFin        : Locator;   //.all(by.css('.span5 .icon-calendar').nth(2);

    public readonly pPmodifTextAreaCommentaire  : Locator;   //(by.id('input-commentaire-remise-article');

    public readonly pPmodifButtonAjouterRemise  : Locator;   //(by.css('[ng-click="modifierAjouterRemiseArticle(remise)"]');
    public readonly pPmodifButtonCalculerPrix   : Locator;   //(by.css('[ng-click="$event.preventDefault();calculerPrixCataloguesRemises()"]');

    public readonly pPmodifListBoxTypeRemise    : Locator;   //(by.model('remise.typeRemise');
    public readonly pPmodifListBoxApplication   : Locator;   //(by.model('remise.typeApplication');

    public readonly pPmodifListBoxChoixApp      : Locator;   //.all(by.css('#select-type-application option');

    public readonly pPmodifLabelPrixRemise      : Locator;   //(by.css('.span5 label.ng-binding');

    // Popin : Données saisies automatiquement lors d'un achat pour l'article XXXX ----------------------------------------
    public readonly pPButtonSupprimerEtFermer     : Locator;
    public readonly pPButtonSupprimerSansFermer   : Locator;
    public readonly pPButtonFermer                : Locator;

    public readonly pPButtonAnnuler               : Locator;

    public readonly pPDatagridTdDesignFournisseur : Locator;
    public readonly pPDatagridDonneeSaisiAuto     : Locator;

    public readonly pPInputDesignationFournisseur : Locator;
    public readonly pPInputFieldPlateformeRecep   : Locator;
    public readonly pPInputFieldPlateformeDist    : Locator;
    public readonly pPInputFieldCloseIcon         : Locator;

    public readonly pPlistBoxPlateFormeRecep      : Locator;
    public readonly pPlistBoxPlateformeDist       : Locator;
    public readonly pPlistBoxPlateformeReceptem   : Locator;
    public readonly pPlistBoxPlateformeDistItem   : Locator;

    //-----------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonModifier             = page.locator('[ng-click="modifierArticle(dg.selection[0])"]');
        this.buttonRechercher           = page.locator('[ng-click="recupererArticles()"]');
    
        this.inputFiltreArticle         = page.locator('input[ng-model="autocompleteArticle.display"]');
        this.inputFiltreFournisseur     = page.locator('input[ng-model="autocompleteFournisseur.display"]');
        this.inputFiltreGencod          = page.locator('input[ng-model="autocompleteGencod.display"]');    
    
        this.toggleButtonActif          = page.locator('[ng-model="recherche.actif"] .btn-group button');
        this.toggleButtonAchetable      = page.locator('[ng-model="recherche.achetable"] .btn-group button');
        
        this.dataGridArticles           = page.locator('.table-articles th');
    
        this.listBoxGroupeArticle       = page.locator('[ng-model="recherche.groupeArticle"]');        
    
        this.checkBoxArticleIncomplet   = page.locator('[ng-model="showArticleIncomplet"]');
        this.checkBoxListeArticles      = page.locator('datagrid td input');
    
        this.thDgFournisseurs           = page.locator('th.datagrid-fournisseurs');
        this.thDgCodesArticle           = page.locator('th.datagrid-code');
        this.tdDgCodesArticles          = page.locator('td.datagrid-code');
        this.tdDgDesignationsArticles   = page.locator('td.datagrid-designation');
        this.tdDgFournisseur            = page.locator('td.datagrid-fournisseurs');
        this.tdDgRefArticleFournisseur  = page.locator('td.datagrid-refArticleFournisseur-referenceArticleFournisseur');
        this.tdDgActions                = page.locator('.actiontd');

        this.tdActiveDays               = page.locator('td.day:NOT(.disabled)');
        this.tdToday                    = page.locator('td.today');
    
        this.autoCompleteArticles       = page.locator('.gfit-autocomplete-results li');
        this.autoCompleteArts           = page.locator('.articles-input-article input[gfit-autocomplete]');
        this.autoCompleteFournisseur    = page.locator('.articles-input-fournisseur input[gfit-autocomplete]');
    
    
        //-- Popin : Modification de l'article XXXXXXXXXXXXX ----------------------------------------------------------
    
        this.pPmodifButtonEnregEtFermer = page.locator('.modal-footer button').nth(0);
        this.pPmodifButtonEnregSansFermer= page.locator('.modal-footer button').nth(1);
    
        this.pPmodifLinkFermer          = page.locator('.modal-footer a');
    
        //---- Bloc : Informations d'identification 
        //---- ToDo
        this.pPmodifInputFournisseur    = page.locator('#fournisseur');
    
        this.pPmodifHeaderIdentif       = page.locator('.info-identification .icon-chevron-down');
        this.pPmodifHeaderConditionnement= page.locator('.conditionnement .icon-chevron-down');
    
        //---- Bloc : Conditionnement
        this.pPmodifTdDesignation       = page.locator('datagrid.conditionnement-datagrid td.datagrid-designation');
        this.pPmodifTdPaletisation      = page.locator('datagrid.conditionnement-datagrid td.datagrid-palettisation');
    
        this.pPmodifPictoEtagesPalettes = page.locator('span.icon-resize-full');
    
        //this.pPmodifButtonAjouter       = page.locator('[ng-click="enregistrerConditionnement()"]');
        this.pPmodifButtonAjouter       = page.locator('div.sous-emballage button.ng-binding');
    
        //---- Bloc Conditionnement > Popover : Saisie des étages
        this.pPmodifCondSaisiPopover    = page.locator('div.p-overlaypanel-content');
    
        this.pPmodifCondSaisiPButtAjout = page.locator('button.btn-ajout-etage');
        this.pPmodifCondSaisiButtValider= page.locator('div.popover-footer button:NOT(.p-button-link)');
    
        this.pPmodifCondSaisiInputCPC   = page.locator('[formcontrolname="colisParCouche"]');
        this.pPmodifCondSaisiInputCouche= page.locator('[formcontrolname="couchesParEtage"]');
    
        //---- ToDo
            
        //---- Bloc : Prix et remises 
        this.pPmodifInputPrixCatalogueHT= page.locator('[ng-model="articleFournisseur.remises.prixCatalogue.prixCatalogue"]');
        this.pPmodifInputNextPrixCatHT  = page.locator('[ng-model="articleFournisseur.remises.prixCatalogue.prochainPrixCatalogue"]');
        this.pPmodifInputValeurRemise   = page.locator('[ng-model="remise.valeur');
    
        this.pPmodifDatePickerApplicabilite  = page.locator('.remise-article-add-panel .icon-calendar');
        this.pPmodifDatePickerPrixRemise= page.locator('.span5 .icon-calendar').nth(0);
        this.pPmodifDatePickerDebut     = page.locator('.span5 .icon-calendar').nth(1);
        this.pPmodifDatePickerFin       = page.locator('.span5 .icon-calendar').nth(2);
    
        this.pPmodifTextAreaCommentaire = page.locator('#input-commentaire-remise-article');
    
        this.pPmodifButtonAjouterRemise = page.locator('[ng-click="modifierAjouterRemiseArticle(remise)"]');
        this.pPmodifButtonCalculerPrix  = page.locator('[ng-click="$event.preventDefault();calculerPrixCataloguesRemises()"]');
    
        this.pPmodifListBoxTypeRemise   = page.locator('[ng-model="remise.typeRemise"]');
        this.pPmodifListBoxApplication  = page.locator('[ng-model="remise.typeApplication"]');
    
        this.pPmodifListBoxChoixApp     = page.locator('#select-type-application option');
    
        this.pPmodifLabelPrixRemise     = page.locator('.span5 label.ng-binding');

        // Popin : Données saisies automatiquement lors d'un achat pour l'article XXXX ----------------------------------------
        this.pPButtonSupprimerEtFermer     = page.locator('p-footer p-button:not([styleclass="p-button-link"]) button').nth(0);
        this.pPButtonSupprimerSansFermer   = page.locator('p-footer p-button:not([styleclass="p-button-link"]) button').nth(1);
        this.pPButtonFermer                = page.locator('p-footer p-button[styleclass="p-button-link"] button');        
        this.pPButtonAnnuler               = page.locator('div.p-dialog-footer button.p-button-link');

        this.pPDatagridTdDesignFournisseur = page.locator('p-table tbody tr td:nth-child(3)');
        this.pPDatagridDonneeSaisiAuto     = page.locator('p-table tbody tr');

        this.pPInputDesignationFournisseur = page.locator('p-table thead th input[type="text"]').nth(1);
        this.pPInputFieldPlateformeRecep   = page.locator('.p-multiselect-filter-container input').nth(0);
        this.pPInputFieldPlateformeDist    =this.pPInputFieldPlateformeRecep;
        this.pPInputFieldCloseIcon         = page.locator('button.p-multiselect-close timesicon');

        this.pPlistBoxPlateFormeRecep      = page.locator('p-multiselect chevrondownicon svg').nth(0);
        this.pPlistBoxPlateformeDist       = page.locator('p-multiselect chevrondownicon svg').nth(1);
        this.pPlistBoxPlateformeReceptem   = page.locator('p-multiselectitem li');
        this.pPlistBoxPlateformeDistItem   = this.pPlistBoxPlateformeReceptem;
        

        // --------------------------------------------------------------------------------------------------------------------
    }
}