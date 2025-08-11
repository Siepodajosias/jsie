/**
 * Appli    : MAGASIN
 * Menu     : COMMANDES
 * Onglet   : COMMANDE SELON MODELE
 * 
 * @author  JOSIAS SIE 
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class CommandesCommandeSelonModele {

    public readonly buttonCreer                = this.page.locator('[ng-click="openPopupCreationCommandeModele()"]');
    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercherCommandesSelonModeles()"]');

    public readonly datePickerFrom             = this.page.locator('#datepicker-from input');
    public readonly datePickerTo               = this.page.locator('#datepicker-to input');

    public readonly listBoxMagasin             = this.page.locator('#input-lieu-vente');
    public readonly listBoxGroupeArticle       = this.page.locator('#input-groupe');

    public readonly checkBoxListeCommandes     = this.page.locator('div.datagrid-table-wrapper > table > tbody > tr > td > input');

    public readonly dataGridCommandes          = this.page.locator('.bloc-datagrid .datagrid-wrapper th');
    public readonly dataGridLignesCommandes    = this.page.locator('.lignes-commande-modele .datagrid-wrapper th');

    //-- Popin : Création d'une commande selon modèle -------------------------------------------------------------------------
    public readonly pDatePickerExpedition      = this.page.locator('#date-expedition input');
    public readonly pDatePickerEvalableDays    = this.page.locator('.day:not(.disabled)');

    public readonly pButtonCreeCommande        = this.page.locator('#creer-commande-modele');

    public readonly pButtonEnregistrer         = this.page.locator('.popup-creation-commande-modele .modal-footer button').nth(0);
    public readonly pButtonEnvoyer             = this.page.locator('.popup-creation-commande-modele .modal-footer button').nth(1);

    public readonly pLinkAnnuler               = this.page.locator('.popup-creation-commande-modele .modal-footer a');

    public readonly pListBoxModele             = this.page.locator('#modeles-commandes');
    public readonly pListBoxSociete            = this.page.locator('#societes');

    public readonly pInputFieldMagasin         = this.page.locator('.autocomplete-lieux-vente input');
    public readonly pInputFieldArticle         = this.page.locator('.dg-commande-modele input');

    public readonly pPautocompleteArticle      = this.page.locator('.gfit-autocomplete-results > li');

    constructor(public readonly page: Page) {};
}