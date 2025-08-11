/**
 * Appli    : ACHATS
 * Menu     : ACHATS
 * Onglet   : ANALYSE JOURNEE
 * 
 * 
 * @author JC CALVIERA & SIAKA KONE
 * @version 3.6
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAchAnalyse {

    public readonly spinner                     :Locator;

    public readonly buttonModifier              :Locator;    //(by.css('.footer-menu button i.fa-pencil-alt');    
    public readonly buttonExporter              :Locator;    //(by.css('.footer-menu button i.fa-file-excel');    
    public readonly buttonTransmettre           :Locator;    //(by.css('.footer-menu button i.fa-truck');    
    public readonly buttonDatePicker            :Locator;    //(by.css('span.pi-calendar');  
    public readonly buttonPlus                  :Locator;    //(by.css('button .pi-plus'))
    public readonly buttonParametrage           :Locator;
    public readonly buttonAvancerJour           :Locator;
    
    public readonly switchButton                :Locator;

    public readonly listBoxDossierAchat         :Locator;    //(by.css('.bloc-filtres-achats p-dropdown');
    public readonly listBoxDossierAchatItem     :Locator;
    public readonly listBoxFiltrePlateforme     :Locator;    //.all(by.css('[name="plateformesDistribution"]')) //.first();
    public readonly listBoxPlateforme           :Locator;    //.all(by.css('ul p-multiselectitem li span:NOT(.p-checkbox-icon)'))
    public readonly listBoxCmdesCumules         :Locator;
    public readonly listBoxPrevisionsCumules    :Locator;
    
    public readonly selectBoxPlateforme         :Locator;    //(by.css('.p-multiselect-trigger span');

    public readonly checkBoxDetailPtfDistri     :Locator;    //(by.css('[inputid="detailParPlateformeDistribution"]');
    public readonly checkBoxAfficherPrevisionnel:Locator;
    public readonly checkBoxAfficherTout        :Locator;    //(by.css('[inputid="filtreTousArticle"]');
    public readonly checkBoxAfficherConsignes   :Locator;
    public readonly checkBoxAllMultiselect      :Locator;    //(by.css('div.ui-multiselect-header div.ui-chkbox');
    public readonly checkBoxACumulCommandes     :Locator;    //(by.css('[inputid="cumulDesCommandes"]');

    public readonly dataGridDossiers            :Locator;    //.all(by.css('th.p-sortable-column');
    public readonly datePreparation             :Locator;
    public readonly trListLignesDossierAchat    :Locator;    //.all(by.css('tbody.ui-table-tbody tr');
    
    public readonly tdListLignesCodes           :Locator;
    public readonly tdListeSelectionne          :Locator;    //.all(by.css('tbody.ui-table-tbody tr.ui-state-highlight td');
    public readonly tdCodeSelectionne           :Locator;
    public readonly tdListeAchat                :Locator;    //.all(by.css('tbody tr td:nth-child(5)');

    public readonly inputFiltreIdArticle        :Locator;    //.all(by.css('input.table-filtre').nth(0);
    public readonly inputFiltreLibArticle       :Locator;    //.all(by.css('input.table-filtre').nth(1);
    public readonly inputFiltrePlateforme       :Locator;    //(by.css('.p-multiselect-filter'))
    public readonly inputFiltreFournisseur      :Locator;    //(by.css('input[role="combobox"]'))
    public readonly inputMultiselect            :Locator;    //(by.css('div.ui-multiselect-header input.ui-inputtext');
    public readonly inputDateExpeMag            :Locator;
    //-- Popin : Confirmation ------------------------------------------------------------------------------------
    public readonly pPenvoiButtonEnvoyer        :Locator;    //.all(by.css('div.p-dialog-footer button').nth(0);
    public readonly pPenvoiButtonFermer         :Locator;    //.all(by.css('div.p-dialog-footer button').nth(1);

    public readonly pPenvoiSpinner              :Locator;    //(by.css('#form-envoi-volume .timer:NOT(.ng-hide)');

    public readonly pPenvoiMessageErreur        :Locator;    //(by.css('div.alert-warning');

    //-- Popin : Détail des Achats xxxxxxxx ----------------------------------------------------------------------
    public readonly pPdetailButtonEnregistrer   :Locator;    //(by.css('detail-marchandise-modal div.ui-dialog-footer button');
    public readonly pPdetailButtonPlus          :Locator;    //(by.css('div.details button span.pi-plus');
    public readonly pPdetailButtonEnregistrers  :Locator;    //(by.css('p-footer button span.p-button-label:NOT(.ng-star-inserted)'))
    public readonly pPdetailButtonFermer        :Locator;

    public readonly pPdetailInputFournisseur    :Locator;    //(by.css('app-autocomplete.autocomplete-fournisseur input');
    public readonly pPdetailtdLigneAchat        :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine');
    public readonly pPdetailtdColFournisseur    :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(5)');
    public readonly pPdetailtdColCalibre        :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(6)');
    public readonly pPdetailtdColConditnmnt     :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(7)');
    public readonly pPdetailtdColPtfRecep       :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(8)');
    public readonly pPdetailtdColPtfDist        :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(9)');
    public readonly pPdetailtdColPrixAch        :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(12) input');
    public readonly pPdetailtdColColisEst       :Locator;    //.all(by.css('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(14) input');

    public readonly pPdetailListBoxPtfRecep     :Locator;    //.all(by.css('[formcontrolname="plateformeReception"]');

    public readonly pPlistBoxPtfRecep           :Locator;    //.all(by.css('ul li[role="option"] span'))
    public readonly pPlistBoxIconPtfRecep       :Locator;    //(by.id('plateforme-reception-ajout')) //.pi-chevron-down
    
    public readonly pPButtoncurrentPltfDistri   :Locator;

    public readonly closeListePlateforme        :Locator;    //(by.css('button .p-multiselect-close-icon');
    public readonly labelNumAchat               :Locator;

    //--

    constructor(public readonly page: Page) {
        
        this.page = page;

        this.spinner                    = page.locator('div.p-datatable-loading-overlay');

        this.buttonModifier             = page.locator('.footer-menu button i.fa-pencil-alt');    
        this.buttonExporter             = page.locator('.footer-menu button i.fa-file-excel');    
        this.buttonTransmettre          = page.locator('.footer-menu button i.fa-truck');    
        this.buttonDatePicker           = page.locator('span.pi-calendar');  
        this.buttonPlus                 = page.locator('button .pi-plus');
        this.buttonParametrage          = page.locator('button.bouton-parametrage');
        this.buttonAvancerJour          = page.locator('p-button[icon="pi pi-step-forward"] button');

        this.switchButton               = page.locator('p-inputswitch[inputid="filtreTousArticles"]');
    
        this.listBoxDossierAchat        = page.locator('.bloc-filtres-achats p-dropdown');
        this.listBoxDossierAchatItem    = page.locator('p-dropdownitem li');
        this.listBoxFiltrePlateforme    = page.locator('[name="plateformesDistribution"]');
        this.listBoxPlateforme          = page.locator('ul p-multiselectitem li span:NOT(.p-checkbox-icon)');
        this.listBoxCmdesCumules        = page.locator('[inputid="nbJoursCumulCommandes"]');
        this.listBoxPrevisionsCumules   = page.locator('[inputid="nbJoursCumulPrev"]');
        
        this.selectBoxPlateforme        = page.locator('[name="plateformesDistribution"]');// ('.p-multiselect-trigger span')
    
        this.checkBoxDetailPtfDistri    = page.locator('[inputid="detailParPlateformeDistribution"]');
        this.checkBoxAfficherPrevisionnel= page.locator('[inputid="switchPrevisionnel"]');
        this.checkBoxAfficherTout       = page.locator('[inputid="filtreTousArticles"]');
        this.checkBoxAfficherConsignes  = page.locator('[inputid="saisieConsignes"]');
        this.checkBoxAllMultiselect     = page.locator('div.ui-multiselect-header div.ui-chkbox');
        this.checkBoxACumulCommandes    = page.locator('[inputid="cumulDesCommandes"]');
    
        this.dataGridDossiers           = page.locator('th.p-sortable-column');
        this.datePreparation            = page.locator('.selection-plateforme span');
    
        this.trListLignesDossierAchat   = page.locator('tbody.ui-table-tbody tr');
        
        this.tdListLignesCodes          = page.locator('tbody.ui-table-tbody tr td').nth(1);
        this.tdListeSelectionne         = page.locator('tbody.ui-table-tbody tr.ui-state-highlight td');
        this.tdCodeSelectionne          = this.tdListeSelectionne.nth(1);
        this.tdListeAchat               = page.locator('tbody tr td:nth-child(5)');
    
        this.inputFiltreIdArticle       = page.locator('input.table-filtre').nth(0);
        this.inputFiltreLibArticle      = page.locator('input.table-filtre').nth(1);
        this.inputFiltrePlateforme      = page.locator('.p-multiselect-filter');
        this.inputFiltreFournisseur     = page.locator('input[role="combobox"]');
        this.inputMultiselect           = page.locator('div.ui-multiselect-header input.ui-inputtext');
        this.inputDateExpeMag           = page.locator('p-calendar span input[role="combobox"]');
        //-- Popin : Confirmation ------------------------------------------------------------------------------------
        this.pPenvoiButtonEnvoyer       = page.locator('div.p-dialog-footer button').nth(0);
        this.pPenvoiButtonFermer        = page.locator('div.p-dialog-footer button').nth(1);
    
        this.pPenvoiSpinner             = page.locator('#form-envoi-volume .timer:NOT(.ng-hide)');
    
        this.pPenvoiMessageErreur       = page.locator('div.alert-warning');
    
        //-- Popin : Détail des Achats xxxxxxxx ----------------------------------------------------------------------
        this.pPdetailButtonEnregistrer  = page.locator('detail-marchandise-modal div.ui-dialog-footer button');
        this.pPdetailButtonPlus         = page.locator('div.details button span.pi-plus');
        this.pPdetailButtonEnregistrers = page.locator('p-footer button span.p-button-label:NOT(.ng-star-inserted)');
        this.pPdetailButtonFermer       = page.locator('p-footer button span.p-button-label.ng-star-inserted');
    
        this.pPdetailInputFournisseur   = page.locator('app-autocomplete.autocomplete-fournisseur input');
        this.pPdetailtdLigneAchat       = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr');
        this.pPdetailtdColFournisseur   = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(5)');
        this.pPdetailtdColCalibre       = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(6)');
        this.pPdetailtdColConditnmnt    = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(7)');
        this.pPdetailtdColPtfRecep      = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(8)');
        this.pPdetailtdColPtfDist       = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(9)');
        this.pPdetailtdColPrixAch       = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(12) input');
        this.pPdetailtdColColisEst      = page.locator('[formarrayname="detailsLotsArray"] .p-datatable-tbody tr.ng-pristine td:nth-child(14) input');
    
        this.pPdetailListBoxPtfRecep    = page.locator('[formcontrolname="plateformeReception"]');

        this.pPButtoncurrentPltfDistri  = page.locator('.selection-plateforme button');
    
        this.pPlistBoxPtfRecep          = page.locator('ul li[role="option"] span');
        this.pPlistBoxIconPtfRecep      = page.locator('plateforme-reception-ajout');
        
        this.closeListePlateforme       = page.locator('button .p-multiselect-close-icon');

        this.labelNumAchat              = page.locator('.colonne-label-reduit .controls label[title]');
    
    }

}