/**
 * Appli    : MAGASIN
 * Menu     : ALERTES
 * Onglet   : TRAITEMENT MAGASIN
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * @since 12/09/2023
 */

import { Page,} from '@playwright/test';

export class AltertesTraitement {

    public readonly toggleStatut           = this.page.locator('.btn-group > button');

    public readonly listBoxGroupeArticle   = this.page.locator('#input-groupe');

    public readonly dataGridListeAlertes   = this.page.locator('div.form-section div.datagrid-table-wrapper th');  
    public readonly dataGridListeLotsSigale= this.page.locator('td.datagrid-numerosLotsSigale');
    public readonly dataGridListeCodesArt  = this.page.locator('td.datagrid-article-code span');

    public readonly toggleATraiter         = this.page.locator('[ng-click="dg.filters.updateFiltersStatut(statutTraitementsAlerte)"]').nth(0);    
    public readonly toggleEnCours          = this.page.locator('[ng-click="dg.filters.updateFiltersStatut(statutTraitementsAlerte)"]').nth(1);    
    public readonly toggleTraitee          = this.page.locator('[ng-click="dg.filters.updateFiltersStatut(statutTraitementsAlerte)"]').nth(2);    

    public readonly buttonImpFeuilleBlocage= this.page.locator('[ng-click="imprimerFeuilleBlocageAlerte(dg.selections[0])"]');
    public readonly buttonImpPJ            = this.page.locator('[ng-click="imprimerPieceJointeAlerte(dg.selections[0])"]');
    public readonly buttonTraiter          = this.page.locator('[ng-click="openPopupTraitementAlerte(dg.selections[0])"]');
    public readonly buttonGenererDAV       = this.page.locator('[ng-click="genererDemandeAvoir(dg.selections[0])"]');

    public readonly checkBoxSelected       = this.page.locator('.selectionne td input');
    public readonly checkBoxAlertes        = this.page.locator('table td input');

    public readonly tdQualifSelectionnee   = this.page.locator('.selectionne td.datagrid-qualification-designation span');

    //-- popin : Traitement de l'alerte -------------------------------------------------------------------------------------------------
    public readonly pPbuttonTraitRecord    = this.page.locator('.popup-traitement-alerte .modal-footer button').nth(0);
    public readonly pPbuttonTraitFinaliser = this.page.locator('.popup-traitement-alerte .modal-footer button').nth(1);

    public readonly pPtextAreaTraitComm    = this.page.locator('#commentaires-magasin');

    public readonly pPinputTraitQuantite   = this.page.locator('td.datagrid-quantite input');

    //-----------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {}
}