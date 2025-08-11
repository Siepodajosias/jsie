/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : ACTUALITE
 * 
 * @author  JOSIAS SIE
 * @version 3.3
 * @since   13/08/2024
 * 
 */
import { Page } from '@playwright/test';

export class AutorisationsActualite {

    public readonly buttonCreer                 = this.page.locator('.form-btn-section .containerBT button').nth(0);
    public readonly buttonModifier              = this.page.locator('.form-btn-section .containerBT button').nth(1);
    //Ajout des boutons de diffusion (diffuser et annuler diffusion)
    public readonly buttonDiffuser              = this.page.locator('.form-btn-section .containerBT button').nth(2);
    public readonly buttonAnnuler               = this.page.locator('.form-btn-section .containerBT button').nth(3);

    public readonly selectbutton                = this.page.locator('.p-selectbutton');

    public readonly inputFiltreTitre            = this.page.locator('table[role="table"] th input.ng-valid');

    public readonly sListboxArticle             = this.page.locator('p-dropdownitem li span'); 

    public readonly dataGridListeActualite      = this.page.locator('div.p-datatable-wrapper > table > thead > tr:nth-child(1) > th');

    public readonly calendarPeriodeDiffusion    = this.page.locator('#filtre-periode');
    public readonly sTagsAutocomplete           = this.page.locator('p-autocomplete#tags');
    public readonly sGrpeArticle                = this.page.locator('div.p-dropdown-trigger');
    
    // Filtre des boutons "Diffusées" et "Non diffusées"
    public readonly buttonDiffusees = this.page.locator('.p-selectbutton .p-button').nth(0)
    public readonly buttonNonDiffusees = this.page.locator('.p-selectbutton .p-button').nth(1);

    // Heure d'annulation 
	public readonly tdDateHeureAnnulation              = this.page.locator('.p-datatable-tbody.p-element > tr > td').nth(5);

    //-- Popin : Création d'une actualité -------------------------------------------------------------------------------------------------------------
    public readonly pButtonEnregistrerArticle   = this.page.locator('.popup-ajout-article-modele-commande .modal-footer button');
    public readonly inputTitre                  = this.page.locator('input#titre');
    public readonly checkBoxImportant           = this.page.locator('.padding-label').nth(1);
    public readonly containertext               = this.page.locator('div.ql-editor');
	public readonly inputTitreAcutalite         = this.page.locator('#pn_id_44-table > thead > tr:nth-child(2) > th:nth-child(3)');
	public readonly Listeactualite              = this.page.locator('.p-datatable-tbody.p-element');
	public readonly spanTags                    = this.page.locator('#tags_multiple_option_0 span');

	public readonly pSspinner                   = this.page.locator('span.app-spinner');

    public readonly pCheckBoxMagasins           = this.page.locator('table-magasins p-tablecheckbox');

    public readonly pTdLibeleMagasin            = this.page.locator('table-magasins table tbody tr td:nth-child(3)');

    //-- Popin : Confirmer la suppression -------------------------------------------------------------------------------------------------------
    // public readonly pButtonOui                  = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pButtonOui                  = this.page.locator('.modale-small .p-dialog-footer .footer-confirmation div').nth(0);
    public readonly pPspinner                   = this.page.locator('p-footer span.app-spinner') ;
    // popin afficher le message d'annulation de diffusion
    public readonly messageAnnulation           = this.page.locator('div.infos-diffusion');
    public readonly fermerPopin                 = this.page.locator('span.p-button-label').last();
    // parent des boutons enrégistrer...
    public readonly parentButtonAcutalitesDiffusees     = this.page.locator('.bloc-bouton .boutons-actualites-diffusees');
    
    public readonly pPlinkFdpFermer             = this.page.locator('.p-dialog-footer a');
    public readonly pButtonEnregistrerActualite = this.page.locator('span.p-button-label').nth(4);
    
    constructor(public readonly page: Page) {};
}
