/**
 * Appli    : MAGASIN
 * Menu     : COMMANDES
 * Onglet   : COMMANDE DIRECTE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class CommandesCommandeDirecte  {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimer             = this.page.locator('[ng-click="imprimer(commandeSelectionnee.id)"]');   
    public readonly buttonImprimerLaCommande   = this.page.locator('[ng-click="imprimerBonCommande()"]');   
    public readonly buttonValiderEtEnvoyer     = this.page.locator('button[ng-click="envoyer()"]:NOT(.ng-hide)');
    public readonly buttonSupprimerCommande    = this.page.locator('[ng-click="openPopupConfirmerSuppressionCommandeLD()"]');
    public readonly ButtonPlus                 = this.page.locator('[ng-click="genererCommande()"]');
    public readonly ButtonEnregister           = this.page.locator('[ng-click="enregistrer()"]');
           
    public readonly datePickerCommande         = this.page.locator('#datepicker-date-commande');    
    public readonly datePickerLivraison        = this.page.locator('#periode span.p-calendar-w-btn');

    public readonly inputFamilleArticle        = this.page.locator('.filtres > span > input.filter-input');

    public readonly listBoxFoursisseur         = this.page.locator('#select-assortiment');
    public readonly listBoxFournisseurOpt      = this.listBoxFoursisseur.locator('option')

    public readonly dataGridListesCmd          = this.page.locator('.liste-commandes th');
    public readonly dataGridLignesCmd          = this.page.locator('.lignes-commandes th');

    public readonly tdLibellesCommandes        = this.page.locator('td.datagrid-designation');

    public readonly messageErreur              = this.page.locator('div.feedback-error:NOT(.ng-hide)');
    public readonly messageWarning             = this.page.locator('div.feedback-warning:NOT(.ng-hide)');

    constructor(public readonly page: Page) {};
}