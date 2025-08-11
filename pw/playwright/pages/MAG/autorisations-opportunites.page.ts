/**
 * Appli    : MAGASIN
 * Menu     : AUTORISATIONS
 * Onglet   : OPPORTUNITES
 * 
 * @author JOSIAS SIE 
 * @version 3.1
 * 
 */

import { Page} from '@playwright/test';

export class AutorisationsOppotunites {

    public readonly buttonPlus                 = this.page.locator('button i.fa-plus');
    public readonly buttonSupprimerLigne       = this.page.locator('autorisations-opportunite-wrapper div.form-btn-section button').nth(0);
    public readonly buttonModifierLigne        = this.page.locator('autorisations-opportunite-wrapper div.form-btn-section button').nth(1);
    public readonly buttonExporterCadencier    = this.page.locator('autorisations-opportunite-wrapper div.form-btn-section button').nth(2);
    public readonly buttonTarifer              = this.page.locator('autorisations-opportunite-wrapper div.form-btn-section button').nth(3);
    public readonly buttonDiffuser             = this.page.locator('autorisations-opportunite-wrapper div.form-btn-section button').nth(4);

    public readonly inputFiltreAssortiment     = this.page.locator('p-table[id="assortimentDg"] th input');
    public readonly inputFamille               = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(0);
    public readonly inputSousFamille           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(1);
    public readonly inputCodeArticle           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(2);
    public readonly inputDesignationArticle    = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(3);
    public readonly inputArticle               = this.page.locator('div.autocomplete-ajout-article.ng-star-inserted input');
    public readonly inputAssortiment           = this.page.locator('p-table[id="assortimentDg"] input'); 

    public readonly labelNbArticles            = this.page.locator('.paginator-gauche span');
    public readonly listBoxAutoComplete        = this.page.locator('div.autocomplete-article app-autocomplete button.dropdown-item');
    public readonly listBoxDossierAchat        = this.page.locator('#assortiment');

    public readonly dataGridListeAssortiments  = this.page.locator('autorisations-assortiments tr:nth-child(1) th');
    public readonly dataGridListeFamilles      = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(1) th');

    public readonly checkBoxAssortiment        = this.page.locator('assortiments-opportunite');
    public readonly checkBoxListeArticles      = this.page.locator('table-lignes-assortiment table tbody tr');
    public readonly checkBoxCptArticle         = this.page.locator('p-tableheadercheckbox > div');

    public readonly tdListeAssortiments        = this.page.locator('.assortiments-opportunite td.datagrid-designation');

    public readonly trAssortiments             = this.page.locator('autorisations-assortiments tr.p-element td:nth-child(1)');
    public readonly trArticles                 = this.page.locator('#assortimentLigneDg tbody tr');
    public readonly  trAssortimentParRecherche = this.page.locator('autorisations-assortiments tr.p-element')

    //-- Popin : Confirmer la suppression -------------------------------------------------------------------------------------------------------
    public readonly pPconfSuppButtonOui        = this.page.locator('div.footer-confirmation button:NOT(.p-button-link)');

    //-- Popin : Enregistrement d'une ligne de l'assortiment XXXXXXXXX --------------------------------------------------------------------------
    public readonly pPenregListBoxCalibre      = this.page.locator('#input-calibre');
    public readonly pPenregListBoxConditio     = this.page.locator('#input-conditionnement');

    public readonly pPSelectCalibre         = this.page.locator('#formLigneAssortiment select[formcontrolname="calibreSelectionne"]').nth(0);
	public readonly pPSelectConditionnement = this.page.locator('#formLigneAssortiment select[formcontrolname="conditionnementSelectionne"]').nth(0);

    public readonly pPlistBoxDesignation    = this.page.locator('table-magasins table thead tr:nth-child(2) th:nth-child(3) div.p-multiselect');
    public readonly pPinputEnrFilter        = this.page.locator('div.p-multiselect-filter-container input');
    public readonly pPcheckBoxEnrFilter     = this.page.locator('p-multiselectitem li div.p-checkbox-box');
    public readonly pPpictoEnrClose         = this.page.locator('svg.p-multiselect-close-icon');
    public readonly pPcheckBoxEnrAllMag     = this.page.locator('thead p-checkbox');
    public readonly pPbuttonEnregistrer     = this.page.locator('p-footer button');
    public readonly pErrorMessage           = this.page.locator('.alert-danger div').nth(0);
    public readonly pPlinkFermer            = this.page.locator('span.pi-times');
    public readonly pPlinkEnregistrerOui    = this.page.locator('div.confirmation-conditionnement div.alert a[href="#"]').nth(0);

    public readonly pPenregInputQteDispo       = this.page.locator('input[formcontrolname="quantiteDisponible"]');
    public readonly pPenregInputMinCmde        = this.page.locator('#minimum-commande-0');
    public readonly pPenregInputMaxCmde        = this.page.locator('#maximum-commande-0');
    public readonly pPenregInputMultipleCmde   = this.page.locator('#multiple-commande-0');

    public readonly pPenregTextaAreaInfoCom    = this.page.locator('[formcontrolname="informationsMagasinValeurInput"]');

    public readonly pPenregButtonEnregistrer   = this.page.locator('.form-modification-ligne-assortiment .modal-footer button');

    public readonly pPenregCheckBoxCommande    = this.page.locator('ligneAssortiment.typeCommandeOpportunite');

    public readonly pPenregRadioButtonTypeCmde = this.page.locator('.control-typeOpportunite input[type="radio"]');

    public readonly pPdataGridListeMagasins    = this.page.locator('td.datagrid-designation');

    //-- Popin : Tarification de l'article XXXXXXXX dans l'opportunité YYYYYYYYYYY ---------------------------------------------------------------
    public readonly tableColumnLibVille        = this.page.locator('table-magasins table tbody tr td:nth-child(3)');

    public readonly pPtarifListeButtonAffGrp   = this.page.locator('.groupe-tarification button');

    public readonly pPtarifInputPrixCession    = this.page.locator('.prix-cession input[formcontrolname="prixCessionInput"]');
    public readonly pPtarifInputPVC            = this.page.locator('.pvc input[formcontrolname="pvcInput"]');

    public readonly pPtarifButtonEnregistrer   = this.page.locator('p-footer button');

    constructor(public readonly page: Page) {};
}