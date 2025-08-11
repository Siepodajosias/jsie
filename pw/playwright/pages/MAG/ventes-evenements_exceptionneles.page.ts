/**
 * Appli    : MAGASIN
 * Menu     : VENTES
 * Onglet   : EVENEMENTS EXCEPTIONNELS
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * @since 12/09/2023
 * 
 * 
 */
import { Page,} from '@playwright/test';

export class VentesEvenementsExceptionneles {

    public readonly buttonAjouter              = this.page.locator('div.bottom-fixed button').nth(0);
    public readonly buttonModifier             = this.page.locator('div.bottom-fixed button').nth(1);
    public readonly buttonSupprimer            = this.page.locator('div.bottom-fixed button').nth(2);

    public readonly datePickerPeriode          = this.page.locator('span.pi-calendar');

    public readonly dataGreadHeaders           = this.page.locator('div.lignes-evenement-exceptionnel tr:nth-child(1) th');

    public readonly inputFiltreCodeArticle     = this.page.locator('#listeEvenementsExceptionnels thead tr:nth-child(2) input.filter-style').nth(0);
    public readonly inputFiltreArticle         = this.page.locator('#listeEvenementsExceptionnels thead tr:nth-child(2) input.filter-style').nth(1);
    public readonly inputFiltreCommentaire     = this.page.locator('#listeEvenementsExceptionnels thead tr:nth-child(2) input.filter-style').nth(2);

    public readonly listBoxFiltreGroupeArticle = this.page.locator('p-multiselect[name="multiGroupeArticle"]');
    public readonly listBoxFiltreTypeEvenement = this.page.locator('p-multiselect[name="multiTypeEvenement"]');

    public readonly checkBoxAll                = this.page.locator('input[id="checkboxHeader"]');

    //-- Popin : Créer un événement exceptionnel --------------------------------------------------------------------
    //-- Popin : Modifier un événement exceptionnel -----------------------------------------------------------------
    public readonly pPCreaEvRadioArticle       = this.page.locator('[for="radioArticle"]');
    public readonly pPCreaEvRadioGroupeArticle = this.page.locator('[for="radioGroupeArticle"]');
    public readonly pPCreaEvRadioTousGroupes   = this.page.locator('[for="radioTousArticle"]');
    
    public readonly pPCreaEvInputArticle       = this.page.locator('div.autocomplete-evenement-style input');

    public readonly pPCreaEvListBoxGroupeArti  = this.page.locator('select[name="groupeArticle"]');
    public readonly pPCreaEvListBoxType        = this.page.locator('select[name="typeEvenementExceptionnel"]');

    public readonly pPCreaEvTextAreaCommentaire= this.page.locator('textarea[name="commentaire"]');

    public readonly pPCreaEvButtonEnregistrer  = this.page.locator('p-footer button');

    public readonly pPCreaEvLinkAnnuler        = this.page.locator('p-footer a');

    public readonly pPCreaEvDatePickerPeriode  = this.page.locator('p-calendar#dateOuPeriode');

    public readonly pPCreaEvTdJoursActifs      = this.page.locator('table.p-datepicker-calendar td:NOT(.p-datepicker-other-month):NOT(.p-datepicker-weeknumber)');
    
    //-- Popin : Confirmation de suppression -----------------------------------------------------------------    

    public readonly pPConfSupButtonSupprimer   = this.page.locator('p-footer button');

    public readonly pPConfSupLinkAnnuler       = this.page.locator('p-footer a');

    public readonly pictoMoisPrecedent         = this.page.locator('div.datepicker th.prev').nth(0);

    public readonly pPspinner                  = this.page.locator('span.app-spinner');

    constructor(public readonly page: Page) {}

}