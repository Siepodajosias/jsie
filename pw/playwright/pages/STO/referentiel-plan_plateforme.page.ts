/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : PLAN PLATEFORME
 * 
 * author JC CALVIERA
 * 
 * @version 3.5
 * 
 */

import { Page } from "@playwright/test";

export class ReferentielPlanPlateForme{

    //----------------------------------------------------------------------------------------------------------------    
    public readonly buttonImporterUnPlan       = this.page.locator('[ng-click="openPopupImportPlanPlateforme()"]');
    public readonly buttonExporterUnPlan       = this.page.locator('[ng-click="telechargerPlansPlateforme(dgHistoriqueImportsPlan.selection)"]');  

    public readonly dataGridHistoriqueImports  = this.page.locator('.liste-historique-imports th');
    public readonly dataGridTdCommentaires     = this.page.locator('td.datagrid-commentaire');
    public readonly dataGridTdStatut           = this.page.locator('.selectionne .datagrid-statut span > span');
    //-- Popin : Importer un plan de la plateforme -------------------------------------------------------------------
    public readonly pPtextAreaCommentaire      = this.page.locator('#commentaireInput');

    public readonly pPbuttonEnregistrer        = this.page.locator('.popup-import-plan-plateforme .modal-footer button');    

    public readonly pPlinkAnnuler              = this.page.locator('.popup-import-plan-plateforme .modal-footer a');  

    public readonly pPInputFile                = this.page.locator('input[type="file"]');
    
    public readonly pPMessageErreur            = this.page.locator('div.errors.feedback.feedback-.feedback-error');
    
    //---------------------------------------------------------------------------------------------------------------- 
    constructor(public readonly page: Page) {}      
}