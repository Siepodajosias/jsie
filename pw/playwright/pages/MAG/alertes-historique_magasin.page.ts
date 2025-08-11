/**
 * Appli    : MAGASIN
 * Page     : ALERTES
 * Onglet   : HISTORIQUE MAGASIN
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Page } from "@playwright/test"

export class AlertesHistoriqueMagasin {

    public readonly buttonImpFeuilleBlocage  = this.page.locator('[ng-click="imprimerFeuilleBlocageAlerte(dg.selections[0])"]');
    public readonly buttonImpBonDestruction  = this.page.locator('[ng-click="imprimerBonDestructionAlerte(dg.selections[0])"]');
    public readonly buttonModifierQuantites  = this.page.locator('[ng-click="openPopupModificationTraitementAlerte(dg.selections[0])"]');
    public readonly buttonConsulterQuantites = this.page.locator('[ng-click="openPopupConsultationTraitementAlerte(dg.selections[0])"]');

    public readonly buttonRechercher         = this.page.locator('[ng-click="rechercherLignesTraitementAlerte()"]');

    public readonly datePickerFrom           = this.page.locator('.periode-debut .datepicker-wrapper > input');
    public readonly datePickerTo             = this.page.locator('.periode-fin .datepicker-wrapper > input');
    public readonly datePickerDLC            = this.page.locator('.date-dlc .datepicker-wrapper > input');

    public readonly tdQualification          = this.page.locator('td.datagrid-qualification-designation');

    public readonly listBoxGroupeArticle     = this.page.locator('input-groupe');
    public readonly listBoxPilote            = this.page.locator('input-login');
    
    public readonly inputFiltreArticle       = this.page.locator('input[ng-model="codeArticle"]');
    public readonly inputFiltreFourn         = this.page.locator('input[ng-model="designationFournisseur"]');
    public readonly inputFiltreNumLot        = this.page.locator('input[ng-model="numeroLotSigale"]');
    public readonly inputFiltreNumFourn      = this.page.locator('input[ng-model="numeroLotFournisseur"]');

    public readonly dataGridListeAlertes     = this.page.locator('.bloc-datagrid th');

    //-- popin Modification de l'alerte ---------------------------------------------------------------------------------------------

    public readonly pPModifAlerteLinkAnnuler = this.page.locator('div.modal-footer a[data-modal-action="close"]');

    constructor(public readonly page: Page) {}
}