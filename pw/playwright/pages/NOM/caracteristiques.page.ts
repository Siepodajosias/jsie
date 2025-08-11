/**
 * Appli    : NOMENCLATURE
 * Page     : CARACTERISTIQUES
 * Onglet   :
 * 
 * @author  JOSIAS SIE
 * @version 3.10
 * 
 */

import { Page } from "@playwright/test"

export class Caracteristique {

    public readonly dataGridCarac           = this.page.locator('table th');
    public readonly trCaracteristique       = this.page.locator('table tr.p-selectable-row');
    public readonly inputCode               = this.page.locator('.section-ajout-carac input[name="code"]');
    public readonly inputDesignation        = this.page.locator('.section-ajout-carac input[name="designation"]');
    public readonly buttonPlus              = this.page.locator('.section-ajout-carac form button');
    public readonly buttonCreerCaracterist  = this.page.locator('.footerBar.btn-toolbar button').nth(0);
    public readonly buttonModifCaracterist  = this.page.locator('.footerBar.btn-toolbar button').nth(1);
    public readonly tdCode                  = this.page.locator('.section-ajout-carac .col-code').nth(1);
    public readonly tdDesignation           = this.page.locator('.section-ajout-carac .col-designation').nth(1);
    public readonly tdActions               = this.page.locator('.section-ajout-carac .col-actions [title="Supprimer valeur"]').nth(0);

    public readonly inputCodeDesignation    = this.page.locator('#inputFiltre');
    public readonly inputSearchDesignation  = this.page.locator('.global-filter input');
    public readonly buttonCreerCarac        = this.page.locator('.footerBar button span.fa-plus');
    public readonly buttonModifierCarac     = this.page.locator('.footerBar button span.fa-edit');
    public readonly buttonSupprimerCarac    = this.page.locator('.footerBar button span.fa-trash-alt');
    public readonly buttonSupprimerValeur   = this.page.locator('.footerBar button span.fa-times');
    public readonly buttonConfirmer0        = this.page.locator('#footerAjoutCaracteristique button');
    public readonly buttonActionsSup        = this.page.locator('.col-actions button.btn-link .fa-trash-alt');
    public readonly buttonConfirmerSup      = this.page.locator('.modal-footer button');
    public readonly buttonClear             = this.page.locator('.p-datatable-header button.btn-link');
    public readonly pErrorMessage           = this.page.locator('.alert-dismissable div');
    //-- Popin : Création d'une caractéristique -------------------------------------------------------------------------------------
    public readonly pInputDesignation       = this.page.locator('#designation');
    public readonly pListBoxTypeCarac       = this.page.locator('#type');
    public readonly pTexteAreaDescription   = this.page.locator('#caracDescription');
    public readonly pButtonCreer            = this.page.locator('#footerAjoutCaracteristique button.btn-md');
    public readonly pButtonAnnuler          = this.page.locator('#footerAjoutCaracteristique button.btn-link');
    public readonly pInputTypeAffichage     = this.page.locator('#affichageListe');
    public readonly pInputValeurATraduire   = this.page.locator('#nonTraductible');
    public readonly pInputValeurUsageUnique = this.page.locator('#valeurUsageUnique');
    public readonly pInputSeuleValeurArticle= this.page.locator('#valeurUniqueParArticle');
    public readonly pSelectModeSaisie       = this.page.locator('#saisie');
    public readonly pInputValeurMin         = this.page.locator('#valCaracMin');
    public readonly pInputValeurMax         = this.page.locator('#valCaracMax');

    public readonly pInputValeurTraduireNon  = this.page.locator('#nonTraductible');
    public readonly pInputValeurTraduireOui  = this.page.locator('#traductionIndependante');
    public readonly pInputValeurTraduireOui_2= this.page.locator('#tradEnRelation');
    public readonly pInputLongueurMax        = this.page.locator('#longueurCarac');
    public readonly pInputAutocomplete       = this.page.locator('#affichageAutocomplete');
    public readonly pInputPopover            = this.page.locator('#affichagePopOver');

    constructor(public readonly page: Page) {}
}