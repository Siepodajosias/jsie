/**
 * 
 * APPLI    : PRICING
 * PAGE     : PLAN PROMO
 * ONGLET   : PROMOTIONS
 * 
 * @author ESLI ARIEL BAHILI
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class PlanPromoPromotions {

    // Filtres
    public readonly buttonYear                    = this.page.locator('.filtres-container button.p-ripple.p-element.p-button.p-component').nth(0);
    public readonly buttonRechercher              = this.page.locator('div.formulaire-recherche .p-button.p-element').last();
    public readonly buttonFiltreAjouterSemaine    = this.page.locator('.filtres-container button.p-ripple.p-element.p-button.p-component').nth(1);
    public readonly buttonFiltreRetirerSemaine    = this.page.locator('.filtres-container button.p-ripple.p-element.p-button.p-component').nth(2);
    public readonly buttonCreerPromotion          = this.page.locator('footer button');

    public readonly inputFiltreSemaine            = this.page.locator('input#filtre-semaine');
    public readonly inputMagasin                  = this.page.locator('div.input');

    public readonly dropDownEnseigne              = this.page.locator('p-dropdown div.dropdown-input.p-dropdown');
    
    public readonly evenementContainer            = this.page.locator('div.evenements-container');

    public readonly dataGridArticles              = this.page.locator('table.p-datatable-table thead tr:nth-child(1) th');
    

    // Popin -- Créer une promotion
    public readonly dropDownOperation             = this.page.locator('div.p-dialog .formulaire-saisie .p-dropdown').nth(0);
    public readonly dropDownTypePromotion         = this.page.locator('div.p-dialog .formulaire-saisie .p-dropdown').nth(1);
    public readonly dropDownNatureOffre           = this.page.locator('div.p-dialog .formulaire-saisie .p-dropdown').nth(2);
    public readonly dropDownGroupesDeMagasin      = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(0);
    public readonly dropDownSecteursProsol        = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(1);
    public readonly dropDownRegionsProsol         = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(2);
    public readonly dropDownEnseignes             = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(3);
    public readonly dropDownRegionGeo             = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(4);
    public readonly dropDownHabitudesAlim         = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(5);
    public readonly dropDownPlateformes           = this.page.locator('div.p-dialog .formulaire-filtres-magasins p-multiselect').nth(6);

    public readonly inputNomPromotion             = this.page.locator('div.p-dialog .formulaire-saisie #saisie-nom');
    public readonly inputArticle                  = this.page.locator('div.p-dialog .formulaire-saisie #saisie-article');
    public readonly inputPrixCession              = this.page.locator('div.p-dialog .formulaire-saisie #saisie-prix-cession');
    public readonly inputPvcTtc                   = this.page.locator('div.p-dialog .formulaire-saisie #saisie-pvc-ttc');
    public readonly inputNouveauPrixAchat         = this.page.locator('input#nouveau-prix-achat');
    public readonly inputNouveauMontantTaxes      = this.page.locator('input#nouveau-montant-taxes');
    public readonly inputNouveauPrixRevient       = this.page.locator('input#nouveau-prix-revient');

    public readonly checkboxPrixBarre             = this.page.locator('div.p-dialog .formulaire-saisie .p-checkbox-box').nth(0);
    public readonly checkboxPromotion             = this.page.locator('div.p-dialog .formulaire-saisie .p-checkbox-box').nth(1);

    public readonly datePickerPromotion           = this.page.locator('div.p-dialog .formulaire-saisie p-calendar').nth(0);
    public readonly datePickerPrixDeCession       = this.page.locator('div.p-dialog .formulaire-saisie p-calendar').nth(1);
    public readonly datePickerLancementEngagement = this.page.locator('input#saisie-date-lancement-engagement');
    public readonly datePickerPlageDateReference  = this.page.locator('input#saisie-periode-reference');

    public readonly buttonSelectionnes            = this.page.locator('div.p-dialog p-selectbutton .p-button').nth(0);
    public readonly buttonNonSelectionnes         = this.page.locator('div.p-dialog p-selectbutton .p-button').nth(1);
    public readonly buttonFermer                  = this.page.locator('div.p-dialog .p-dialog-header .p-dialog-header-icons button');
    public readonly buttonEnregistrer             = this.page.locator('div.p-dialog .p-dialog-footer p-button').first();
    public readonly buttonAnnuler                 = this.page.locator('div.p-dialog .p-dialog-footer p-button').last();

    public readonly dataGridDesignation           = this.page.locator('div.p-dialog table.p-datatable-table thead tr:nth-child(1) th');

    public readonly textAreaCommentaire           = this.page.locator('textarea#saisie-commentaire');

    public readonly ongletMagConcernes            = this.page.locator('div.saisie-promotion p-tabview li[role="presentation"] > a').nth(0);
    public readonly ongletEngagement              = this.page.locator('div.saisie-promotion p-tabview li[role="presentation"] > a').nth(1);

    constructor(public readonly page: Page) {}

}