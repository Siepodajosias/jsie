/**
 * 
 * FACTURATION PAGE > LIVRAISONS EFFECTUEES / ONGLET > ECARTS DE LIVRAISON 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class LivraisonsEcartsLivraison {

    public readonly datePickerExpeditionMag                                                 : Locator                           

    public readonly buttonConsulterCRLivraison                                              : Locator
    public readonly buttonReporterJustification                                             : Locator
    public readonly buttonJustifierEcarts                                                   : Locator
    public readonly buttonModifier                                                          : Locator
    public readonly buttonRefuserEcarts                                                     : Locator       

    public readonly inputSearchCodeArticle                                                  : Locator
    public readonly inputSearchMagasin                                                      : Locator

    public readonly listBoxArticles                                                         : Locator

    public readonly dataGridListeEcartsArticles                                             : Locator
    public readonly dataGridListeEcartsArtCodeA                                             : Locator
    public readonly dataGridListeEcartsArtIcoOk                                             : Locator

    public readonly dataGridListeEcartsConstates                                            : Locator
    public readonly dataGridListeEcartsConMag                                               : Locator
    public readonly dataGridListeEcartsConQteTh                                             : Locator
    public readonly dataGridListeEcartsConEcart                                             : Locator
    public readonly dataGridListeEcartsConIcoOk                                             : Locator
    public readonly dataGridListeEcartsConMotif                                             : Locator
    
    public readonly listeBoxEcartsConMotif                                                  : Locator

    //-- Popin : Comptes-Rendus de livraison du ... ----------------------------------------------------------------------------------
    public readonly pPopinComptesRendusLivraison                                            : Locator

    public readonly pPbuttonFermer                                                          : Locator

    public readonly pPdataGridCRLivraisaon                                                  : Locator

    public readonly checkBoxEcartNegatifs                                                   : Locator
    
    public readonly listeBoxItemEcartsConMotif                                              : Locator

    constructor(page:Page){

        this.datePickerExpeditionMag                                                        = page.locator('[ng-click="toggleDatepicker($event)"]');

        this.buttonConsulterCRLivraison                                                     = page.locator('[ng-click="popupCr.open = true"]');
        this.buttonReporterJustification                                                    = page.locator('[ng-click="reporterJustification(data.ecartsSelectionnes)"]');
        this.buttonJustifierEcarts                                                          = page.locator('[ng-click="justifierEcarts(data.ecartsSelectionnes)"]');  
        this.buttonModifier                                                                 = page.locator('[ng-click="ouvrirPopupSaisieEcart(data.ecartsSelectionnes[0])"]');  
        this.buttonRefuserEcarts                                                            = page.locator('[ng-click="ouvrirPopupRefusEnMasse(data.ecartsSelectionnes)"]'); 

        this.inputSearchCodeArticle                                                         = page.locator('.filter-input');
        this.inputSearchMagasin                                                             = page.locator('#recherche-magasin');

        this.listBoxArticles                                                                = page.locator('div.control-group.pull-right > select');
        this.checkBoxEcartNegatifs                                                          = page.locator('#masquer-article-petit-ecart');

        this.dataGridListeEcartsArticles                                                    = page.locator('.ecarts-articles .datagrid-table-wrapper > table > thead > tr > th'); 
        this.dataGridListeEcartsArtCodeA                                                    = page.locator('.ecarts-articles .datagrid-table-wrapper td.datagrid-code');
        this.dataGridListeEcartsArtIcoOk                                                    = page.locator('.ecarts-articles .datagrid-table-wrapper td.datagrid-traite .icon-ok');

        this.dataGridListeEcartsConstates                                                   = page.locator('.ecarts-constates .datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridListeEcartsConMag                                                      = page.locator('.ecarts-constates .datagrid-table-wrapper td.datagrid-source-designation');
        this.dataGridListeEcartsConQteTh                                                    = page.locator('.ecarts-constates .datagrid-table-wrapper td.datagrid-quantiteTheorique');
        this.dataGridListeEcartsConEcart                                                    = page.locator('.ecarts-constates .datagrid-table-wrapper td.datagrid-ecart');
        this.dataGridListeEcartsConIcoOk                                                    = page.locator('.ecarts-constates .datagrid-table-wrapper td.datagrid-statutEcart .icon-ok');
        this.dataGridListeEcartsConMotif                                                    = page.locator('.ecarts-constates .datagrid-table-wrapper td.datagrid-justification-motif-code');
        
        this.listeBoxItemEcartsConMotif                                                     = page.locator('.ecarts-constates .motif .input-large > option');

        this.listeBoxEcartsConMotif                                                         = page.locator('.motif select.input-large');
        
        //-- Popin : Comptes-Rendus de livraison du ... ----------------------------------------------------------------------------------
        this.pPopinComptesRendusLivraison                                                   = page.locator('.modal-backdrop')

        this.pPbuttonFermer                                                                 = page.locator('div.popup-comptes-rendus > div > a');

        this.pPdataGridCRLivraisaon                                                         = page.locator('.popup-comptes-rendus thead > tr > th');
    }
}
