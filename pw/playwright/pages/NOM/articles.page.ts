/**
 * Appli    : NOMENCLATURE
 * Page     : ARTICLES
 * Onglet   : ---
 * 
 * @author  JOSIAS SIE
 * @version 3.8
 * 
 */

import { Page } from "@playwright/test"

export class Article {

    public readonly inputArticle            = this.page.locator('#codeDesignationArticle input');
    public readonly inputCodeCaisse         = this.page.locator('#codeCaisse');
    public readonly inputFamille            = this.page.locator('#famille input');
    public readonly inputSousFamille        = this.page.locator('#sousFamille input');
    public readonly inputCaracteristique1   = this.page.locator('#caracteristique1 input');
    public readonly inputCaracteristique2   = this.page.locator('#caracteristique2 input');
    public readonly inputValeur1            = this.page.locator('#valeur1 input');
    public readonly inputValeur2            = this.page.locator('#valeur2 input');

    public readonly listBoxRayon            = this.page.locator('#rayon');
    public readonly listBoxGroupe           = this.page.locator('#groupe');

    public readonly checkBoxFirstArticle    = this.page.locator('checkbox0');
    public readonly checkBoxListeArticles   = this.page.locator('td.col-checkbox input');
    public readonly checkBoxValeurNonRens1  = this.page.locator('#valeur1NonRenseignee');
    public readonly checkBoxValeurNonRens2  = this.page.locator('#valeur2NonRenseignee');

    public readonly toggleArticleAnoNonRens = this.page.locator('#articleAnomalieIndefini');
    public readonly toggleArticleAnoOui     = this.page.locator('#articleAnomalieTrue');
    public readonly toggleArticleAnoNon     = this.page.locator('#articleAnomalieFalse');
    public readonly toggleArticleNonRens    = this.page.locator('#articleActifIndefini');
    public readonly toggleArticleOui        = this.page.locator('#articleActifTrue');
    public readonly toggleArticleNon        = this.page.locator('#articleActifFalse');

    public readonly buttonCreer             = this.page.locator('button span.fa-plus');
    public readonly buttonModifier          = this.page.locator('button span.fa-edit');
    public readonly buttonCopier            = this.page.locator('button span.fa-copy');
    public readonly buttonExporter          = this.page.locator('button span.fa-share');
    public readonly buttonImporter          = this.page.locator('button span.fa-file-upload');
    public readonly buttonActiver           = this.page.locator('button i.fa-check-circle');
    public readonly buttonDesactiver        = this.page.locator('button i.fa-times-circle');
    public readonly buttonRechercher        = this.page.locator('#btnRechercher');
    public readonly buttonVider             = this.page.locator('#btnVider');

    public readonly pictoResetInputArticle  = this.page.locator('#codeDesignationArticle span.fa-times');

    public readonly dataGridArticles        = this.page.locator('table th');

    public readonly tdListeResultats        = this.page.locator('td.col-article-designation');

    //-- Popin : Création d'un article -------------------------------------------------------------------------
    public readonly pPcreationModalDialog   = this.page.locator('.modal-dialog .modal-content');

    public readonly pPcreationLinkAnnuler   = this.page.locator('#footer button.btn-link');

    public readonly pPcreationButtonInitEti = this.page.locator('#footer button.btn-primary').nth(0);
    public readonly pPcreationButtonEnrNouv = this.page.locator('#footer button.btn-primary').nth(1);
    public readonly pPcreationButtonEnrCopy = this.page.locator('#footer button.btn-primary').nth(2);
    public readonly pPcreationButtonEnreg   = this.page.locator('#footer button.btn-primary').nth(3);

    public readonly pPcreationInputSearchNom= this.page.locator('filter-tree input').nth(0);
    public readonly pPcreationInputSearchDir= this.page.locator('filter-tree input').nth(1);

    //-- Popin : Modification de l'article xxxx ----------------------------------------------------------------
    public readonly pPmodifArtButtonActif   = this.page.locator('label[for=actif]');
    public readonly pPmodifArtButtonAchat   = this.page.locator('label[for=achetable]');
    public readonly pPmodifArtButtonCommand = this.page.locator('label[for=commandable]');
    public readonly pPmodifArtButtonVend    = this.page.locator('label[for=vendable]');
    public readonly pPmodifArtButtonEnreg   = this.page.locator('.modal-footer button').nth(3);
    public readonly pPmodifArtButtonOui     = this.page.locator('div.alert-warning button:NOT(.btn-link)');
    public readonly pPmodifArtButtonOk      = this.page.locator('.footer button.btn-primary.btn-md');
    public readonly pPmodifArtButtonValArt  = this.page.locator('.valeur-article button.btn-popover');

    public readonly pPmodifArtInputGlobFilt = this.page.locator('[name="globalFilter"]');
    public readonly pModifInputValeurArticle= this.page.locator('.valeur-article input');
    public readonly pPmodifClear            = this.page.locator('.global-filter button.btn-link');
    public readonly pPmodifArtRadioButton   = this.page.locator('.p-overlaypanel-content input[type="radio"]');

    public readonly pPmodifArtLinkAnnuler   = this.page.locator('.modal-footer button.btn-link');

    public readonly pPmodifArtBreadCrumb    = this.page.locator('#familleSousFamilleBreadcrumb li');

    public readonly pPmodifArtInputCodeArt  = this.page.locator('#codeArticle input');
    public readonly pPmodifArtInputLibArt   = this.page.locator('#designationArticle');
    public readonly pInputFieldRechercher   = this.page.locator('#filtre');

    public readonly pModifArtRadioButton    = this.page.locator('.p-overlaypanel-content div.selection:NOT([hidden]) input');
    public readonly pModifArtRadioButtonAll = this.page.locator('#selectAll');

    constructor(public readonly page: Page) {}
}