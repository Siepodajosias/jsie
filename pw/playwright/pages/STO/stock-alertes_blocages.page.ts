/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : ALERTES SANITAIRES
 * 
 * author JC CALVIERA
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class StockAlertesBlocages{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercherAlertes()"]');
    public readonly buttonCreer                = this.page.locator('[ng-click="openPopupCreationAlerte()"]');
    public readonly buttonTraiter              = this.page.locator('[ng-click="openPopupTraitementAlerte(dgAlerteSanitaire.selection[0])"]');
    public readonly buttonImprimerBilan        = this.page.locator('[ng-click="imprimerBilanAlerte(dgAlerteSanitaire.selection[0])"]');
    public readonly buttonDonnerSuite          = this.page.locator('[ng-click="donnerSuiteAlerte(dgAlerteSanitaire.selection[0])"]');
    public readonly buttonSupprimer            = this.page.locator('[ng-click="openConfirmationSuppression(dgAlerteSanitaire.selection[0])"]');

    public readonly toggleATraiter             = this.page.locator('[ng-click="switchStatut(\'A_TRAITER\')"]');
    public readonly togglEnCours               = this.page.locator('[ng-click="switchStatut(\'EN_COURS\')"]');
    public readonly toggleTraitee              = this.page.locator('[ng-click="switchStatut(\'TRAITE\')"]');    

    public readonly datePickerFrom             = this.page.locator('.datepicker-wrapper').nth(0);
    public readonly datePickerTo               = this.page.locator('.datepicker-wrapper').nth(1);    

    public readonly listBoxGroupeArticle       = this.page.locator('#filtre-groupe-article');

    public readonly dataGridListeLotsSigale    = this.page.locator('td.datagrid-numerosLotsSigale');

    public readonly dataGridAlertes            = this.page.locator('div.alerte-sanitaire-resultats th');

    //-- popin : Traitement de l'alerte ------------------------------------------------------------------------------
    public readonly pPtextAreaTraitCommentaire = this.page.locator('traitementAlerte.commentairePlateforme');

    public readonly pPbuttonTraitEnregistrer   = this.page.locator('.popup-traitement-alerte .modal-footer button').nth(0);
    public readonly pPbuttonTraitFinaliser     = this.page.locator('.popup-traitement-alerte .modal-footer button').nth(1);

    public readonly pPinputTraitQteColis       = this.page.locator('.datagrid-quantiteEnColis input');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}