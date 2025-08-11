/**
 * Appli    : ACHATS
 * Menu     : ACCUEIL
 * Onglet   : SYNTHESE ACHATS COURANTS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { expect, Locator, Page }    from "@playwright/test"

export class PageAccSynAch {

//    readonly page: Page;
    
    public readonly inputFournisseur:Locator;//            = this.page.locator('[ng-model="filtres.nomFournisseur"]');
    public readonly inputArticle:Locator;//                = this.page.locator('[ng-model="filtres.nomArticle"]');

    public readonly listBoxPlateformeDistrib:Locator;//    = this.page.locator('[ng-model="filtres.acheteur"]');
    public readonly listBoxAcheteur:Locator;//             = this.page.locator('[ng-model="filtres.dossierAchat"]');
    public readonly listBoxDossierAchat:Locator;//         = this.page.locator('[ng-model="filtres.dossierAchat"]');

    public readonly checkBoxAchatNonReceptionne:Locator;// = this.page.locator('[ng-model="achatsNonReceptionnesSeulement"]');

    public readonly buttonRechercher:Locator;//            = this.page.locator('[ng-click="rechercher()"]');
    public readonly buttonVisualiser:Locator;//            = this.page.locator('[ng-click="goToDetail(dg.selections[0])"]');

    public readonly dataGridAchats:Locator;//              = this.page.locator('.tableau th');


    constructor(public readonly page: Page) {
    
        this.page = page;

        this.inputFournisseur            = page.locator('[ng-model="filtres.nomFournisseur"]');
        this.inputArticle                = page.locator('[ng-model="filtres.nomArticle"]');
    
        this.listBoxPlateformeDistrib    = page.locator('[ng-model="filtres.acheteur"]');
        this.listBoxAcheteur             = page.locator('[ng-model="filtres.dossierAchat"]');
        this.listBoxDossierAchat         = page.locator('[ng-model="filtres.dossierAchat"]');
    
        this.checkBoxAchatNonReceptionne = page.locator('[ng-model="achatsNonReceptionnesSeulement"]');
    
        this.buttonRechercher            = page.locator('[ng-click="rechercher()"]');
        this.buttonVisualiser            = page.locator('[ng-click="goToDetail(dg.selections[0])"]');
    
        this.dataGridAchats              = page.locator('.tableau th');

    }


    //-------------------------------------------------------------------------------------------------------


}