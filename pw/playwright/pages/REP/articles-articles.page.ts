/**
 * 
 * REPARTITION PAGE > ARTICLES / ONGLET > ARTICLES
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ArticlesArticlesPage{

    public readonly spinnerArticles           : Locator
    public readonly buttonRepartir            : Locator  // ('[ng-click="demarrerRepartition(dg.selection[0])"]');
    public readonly buttonRepartitionAuto     : Locator  // ('[ng-click="repartirAutomatiquement()"]'); 
    public readonly buttonRepartirNextDay     : Locator  // ('[ng-click="passerALaJourneeSuivante()"]');       
    public readonly buttonFilterMagasin       : Locator  // ('.dropdown-filtres .dropdown-toggle');
    public readonly buttonRepartirUneFois     : Locator  // ('.containerBT .icon-fast-forward');
    public readonly buttonSauvegarder         : Locator  // ('[ng-click="sauverRepartition()"]');
    public readonly buttonValider             : Locator  // ('[ng-click="validerRepartition()"]');
    public readonly buttonSauverEtValider     : Locator  // ('[ng-click="sauverEtValiderRepartition()"]');
    public readonly buttonTerminer            : Locator  // ('[ng-click="verifierRepartitionMagasins(false)"]');
    public readonly buttonPopinValider        : Locator  // ('.modal-valider-repartition .modal-footer > button').nth(0);
    public readonly buttonMoyenne             : Locator  // ('[ng-click="definirMoyennes(dg.selection[0])"]');
    public readonly buttonEnregistrer         : Locator  // ('[ng-click="enregistrerCommentaires()"]');
    public readonly buttonCloturer            : Locator  // ('[ng-click="popupConfirmerClotureJournee.open = true"]');

    public readonly checkBoxTousArticle       : Locator  // ('checkbox-toggle-articles');
    public readonly checkBoxArticles          : Locator  // ('.tableau-article div.datagrid-table-wrapper > table > tbody > tr').locator('td'); 
    public readonly checkBoxListToDo          : Locator  // ('.repartition-lots-a-repartir th input');     // Case à cocher "Tous"
    public readonly headerNumLots             : Locator  // ('[data-attribut="numero"]').nth(0);          // Header pour tri sur numero de lot
    public readonly checkBoxListeLots         : Locator  // ('.repartition-lots-a-repartir td input');
    public readonly dataGridNumeroLot         : Locator  // ('.repartition-lots-a-repartir .datagrid-numero >span');   // Liste des numéros de lots à répartir
    public readonly removeFieldCodeArt        : Locator  // ('.filter-remove');                                            

    public readonly inputFieldCodeArticle     : Locator  // ('.filter-input');
    public readonly inputFieldColisMagasin    : Locator  // ('colisParMagasin');
    public readonly inputFieldPrctMagasin     : Locator  // ('pourcentageRepartition');
    public readonly inputListeCommentaires    : Locator  // ('td.datagrid-commentaire input');
    

    public readonly groupeArticleListBox      : Locator  // ('input-groupe-article');

    public readonly listResults               : Locator  // ('.paginator > table > tbody > tr > td > input[type="checkbox"]');

    public readonly linkTousMagasins          : Locator  // ('.afficher-magasin-commande');
    public readonly linkMagStandards          : Locator  // ('[ng-click="afficherLesMagasinsStandards()"]');

    public readonly dataGridHeaders           : Locator  // ('.tableau-article th');

    public readonly labelSauvegarde           : Locator  // ('div.form-btn-section span.ng-binding:NOT(.ng-hide)');

    public readonly popinValiderRepart        : Locator  // ('.modal-valider-repartition');

    public readonly headerNbLots              : Locator  // ('th.datagrid-nbLotARep');
    public readonly headerQteAgree            : Locator  // ('th.datagrid-qteAgree');
    public readonly headerReparti             : Locator  // ('.repartition-lots-a-repartir th.datagrid-reparti');

    public readonly datagridRepartTdMagasin   : Locator  // ('div [ng-controller="grilleRepartitionControleur"] table tbody tr:nth-child(1) td.datagrid-nomMagasin')
    public readonly datagridCheckBoxMagasin   : Locator  // ('div [ng-controller="grilleRepartitionControleur"] table tbody tr:nth-child(1) td input');
    public readonly dateDatePicker            : Locator  // ('.datepicker-wrapper');

    public readonly consigneTab               : Locator  // ('[ng-click="$$afficherTab($index)"]');

    public readonly tableErreurRepartition    : Locator  // ('table.table-erreurs-repartition-auto');

    //-- POPIN : Répartir automatiquement -------------------------------------------------------------------------
    public readonly pPToggleButtonRepCA       : Locator  // ('.repartir-auto-gestion-ruptures .row-fluid').nth(0).locator('span.gfit-switch-left-value').nth(0);
    public readonly pPToggleButtonRepStock    : Locator  // ('.repartir-auto-gestion-ruptures .row-fluid').nth(1).locator('span.gfit-switch-left-value').nth(0);    

    public readonly pPLabelToggleButtonCA     : Locator  // ('.repartir-auto-gestion-ruptures .row-fluid').nth(0).locator('.gfit-switch-slider .cacher').nth(0);
    public readonly pPLabelToggleButtonStock  : Locator  // ('.repartir-auto-gestion-ruptures .row-fluid').nth(1).locator('.gfit-switch-slider .cacher').nth(0);

    public readonly pPButtonRepartir          : Locator  // ('div.modal.hide.in > div.modal-footer > button');
    public readonly pPButtonFermer            : Locator  // ('div.modal.hide.in > div.modal-footer > a');

    public readonly pPDropDownGestRup         : Locator
    public readonly pPListBoxGestRup          : Locator

    //-- Popin : Confirmation de clôture ---------------------------------------------------------------------------
    public readonly pModalCloture             : Locator  // ('.modal-header .modal-title');
    public readonly pButtonOui                : Locator  // ('div.modal.hide.in > div.modal-footer > button').nth(0); 
    public readonly pButtonNon                : Locator  // ('div.modal.hide.in > div.modal-footer > a');     

    //-- Popin : Alertes de répartition ----------------------------------------------------------------------------
    public readonly pPalerteButtonOui         : Locator  // ('modal[open="afficherPopupAlerteRepartition"] button[ng-click="onClickOk()"]');

    //--------------------------------------------------------------------------------------------------------------


    constructor(page:Page){

        this.spinnerArticles         = page.locator('.progressRingCentre:NOT(.ng-hide)');// ('.progressRingCentre.ng-hide')
        this.buttonRepartir          = page.locator('[ng-click="demarrerRepartition(dg.selection[0])"]');
        this.buttonRepartitionAuto   = page.locator('[ng-click="repartirAutomatiquement()"]'); 
        this.buttonRepartirNextDay   = page.locator('[ng-click="passerALaJourneeSuivante()"]');       
        this.buttonFilterMagasin     = page.locator('.dropdown-filtres .dropdown-toggle');
        this.buttonRepartirUneFois   = page.locator('.containerBT .icon-fast-forward');
        this.buttonSauvegarder       = page.locator('[ng-click="sauverRepartition()"]');
        this.buttonValider           = page.locator('[ng-click="validerRepartition()"]');
        this.buttonSauverEtValider   = page.locator('[ng-click="sauverEtValiderRepartition()"]');
        this.buttonTerminer          = page.locator('[ng-click="verifierRepartitionMagasins(false)"]');
        this.buttonPopinValider      = page.locator('.modal-valider-repartition .modal-footer > button').nth(0);
        this.buttonMoyenne           = page.locator('[ng-click="definirMoyennes(dg.selection[0])"]');
        this.buttonEnregistrer       = page.locator('[ng-click="enregistrerCommentaires()"]');
        this.buttonCloturer          = page.locator('[ng-click="popupConfirmerClotureJournee.open = true"]');

        this.checkBoxTousArticle     = page.locator('#checkbox-toggle-articles');
        this.checkBoxArticles        = page.locator('.tableau-article div.datagrid-table-wrapper > table > tbody > tr').locator('td');  
        this.checkBoxListToDo        = page.locator('.repartition-lots-a-repartir th input');     // Case à cocher "Tous"
        this.headerNumLots           = page.locator('[data-attribut="numero"]').nth(0);          // Header pour tri sur numero de lot
        this.checkBoxListeLots       = page.locator('.repartition-lots-a-repartir td input');
        this.dataGridNumeroLot       = page.locator('.repartition-lots-a-repartir .datagrid-numero >span');   // Liste des numéros de lots à répartir
        this.removeFieldCodeArt      = page.locator('.filter-remove');                                            

        this.inputFieldCodeArticle   = page.locator('.filter-input');
        this.inputFieldColisMagasin  = page.locator('#colisParMagasin');
        this.inputFieldPrctMagasin   = page.locator('#pourcentageRepartition');
        this.inputListeCommentaires  = page.locator('td.datagrid-commentaire input');
        

        this.groupeArticleListBox    = page.locator('#input-groupe-article');

        this.listResults             = page.locator('.paginator > table > tbody > tr > td > input[type="checkbox"]');

        this.linkTousMagasins        = page.locator('.afficher-magasin-commande');
        this.linkMagStandards        = page.locator('[ng-click="afficherLesMagasinsStandards()"]');

        this.dataGridHeaders         = page.locator('.tableau-article th');

        this.labelSauvegarde         = page.locator('div.form-btn-section span.ng-binding:NOT(.ng-hide)');

        this.popinValiderRepart      = page.locator('.modal-valider-repartition');

        this.headerNbLots            = page.locator('th.datagrid-nbLotARep');
        this.headerQteAgree          = page.locator('th.datagrid-qteAgree');
        this.headerReparti           = page.locator('.repartition-lots-a-repartir th.datagrid-reparti');

        this.datagridRepartTdMagasin = page.locator('div [ng-controller="grilleRepartitionControleur"] table tbody tr:nth-child(1) td.datagrid-nomMagasin')
        this.datagridCheckBoxMagasin = page.locator('div.grille-repartition-filtres-ligne.deuxieme-ligne input#checkbox-magasin-commande-ou-reliquat-ou-prevision');
        this.dateDatePicker          = page.locator('.datepicker-wrapper');

        this.consigneTab             = page.locator('[ng-click="$$afficherTab($index)"]');

        this.tableErreurRepartition  = page.locator('table.table-erreurs-repartition-auto');

        //-- POPIN : Répartir automatiquement -------------------------------------------------------------------------
        this.pPToggleButtonRepCA     = page.locator('.repartir-auto-gestion-ruptures .row-fluid').nth(0).locator('span.gfit-switch-left-value').nth(0);
        this.pPToggleButtonRepStock  = page.locator('.repartir-auto-gestion-ruptures .row-fluid').nth(1).locator('span.gfit-switch-left-value').nth(0);    

        this.pPLabelToggleButtonCA   = page.locator('.repartir-auto-gestion-ruptures .row-fluid').nth(0).locator('.gfit-switch-slider .cacher').nth(0);
        this.pPLabelToggleButtonStock= page.locator('.repartir-auto-gestion-ruptures .row-fluid').nth(1).locator('.gfit-switch-slider .cacher').nth(0);

        this.pPButtonRepartir        = page.locator('#repartir-automatiquement');
        this.pPButtonFermer          = page.locator('div.modal.hide.in > div.modal-footer > a');

        this.pPDropDownGestRup       = page.locator('.p-dialog-title > p-header');
        this.pPListBoxGestRup        = page.locator('#gestionRupture > span');

        //-- Popin : Confirmation de clôture ---------------------------------------------------------------------------
        this.pModalCloture           = page.locator('.modal-header .modal-title');
        this.pButtonOui              = page.locator('div.modal.hide.in > div.modal-footer > button').nth(0); 
        this.pButtonNon              = page.locator('div.modal.hide.in > div.modal-footer > a');     

        //-- Popin : Alertes de répartition ----------------------------------------------------------------------------
        this.pPalerteButtonOui       = page.locator('modal[open="afficherPopupAlerteRepartition"] button[ng-click="onClickOk()"]');

        //--------------------------------------------------------------------------------------------------------------

    }

}