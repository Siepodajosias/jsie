/**
 * 
 * FACTURATION PAGE > LIVRAISON EFFECTUEES / ONGLET > LIVRAISON SUR PLATEFORME  
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class LivraisonsEffectuesLivraisonsDirectes {

    public readonly buttonImprimerFacture                                           : Locator
    public readonly buttonModifier                                                  : Locator
    public readonly buttonEnvoyerFacturation                                        : Locator 

    public readonly dataGridListeEcartsArticles                                     : Locator

    constructor(page:Page){

        this.buttonImprimerFacture                                                  = page.locator('[ng-click="visualiserBF(dg.selection[0])"]');
        this.buttonModifier                                                         = page.locator('[ng-click="ouvrirPopupSaisieLivraisonPlateforme(dg.selection[0])"]');
        this.buttonEnvoyerFacturation                                               = page.locator('[ng-click="popupEnvoiFacturationTiers.open = true"]');
    
        this.dataGridListeEcartsArticles                                            = page.locator('.datagrid-table-wrapper > table > thead > tr > th'); 
    }
}