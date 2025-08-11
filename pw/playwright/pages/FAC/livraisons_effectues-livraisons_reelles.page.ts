/**
 * 
 * APPLI    : FACTURATION 
 * PAGE     : LIVRAISON EFFECTUEES 
 * ONGLET   : LIVRAISON REELLES 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.2
 * 
 */

import { Locator, Page } from "@playwright/test"

export class EffectuesLivraisonRelles {
    public readonly buttonResultatLissage                           : Locator;
    public readonly buttonEnvoyerFacturation                        : Locator;  
    public readonly buttonModifierPrixCession                       : Locator;
    public readonly buttonModifierPoidsLot                          : Locator;
    public readonly buttonRechercher                                : Locator;         
    public readonly buttonReadresserLivraisons                      : Locator;         

    public readonly inputSearchMagasin                              : Locator;      
    public readonly inputSearchArticle                              : Locator;     
    public readonly inputFiltreMagasin                              : Locator;      
    public readonly inputFiltreArticle                              : Locator;     
    public readonly inputFiltreNumeroLot                            : Locator;       
    public readonly inputFiltreNumeroBF                             : Locator;    
    public readonly inputFiltreQteColis                             : Locator;    
    public readonly inputFiltreQteUC                                : Locator;    
    public readonly inputFiltrePrixCession                          : Locator;    
    public readonly inputFiltreTotal                                : Locator;    
    public readonly inputFiltreQteUE                                : Locator;    

    public readonly listBoxTypes                                    : Locator;      

    public readonly dataGridListeLivraisons                         : Locator;   
    public readonly dataGridListeEcartsArticles                     : Locator;   
    public readonly dataGridListeBlArticles                         : Locator;   
    public readonly dataGridListeBlNumeroBF                         : Locator;   

    //-- Popin : Confirmation de l'envoi des factures ----------------------------------------------------------------------------
    public readonly pPconfirmationEnvoi                             : Locator;   
    public readonly pPbuttonConfirmOui                              : Locator;   
    public readonly pPbuttonConfirmAnnuler                          : Locator;   

    public readonly pPspinner                                       : Locator;

    //-- Popin : Résultat du lissage ----------------------------------------------------------------------------
    public readonly pPlissageResultat                               : Locator;   
    public readonly pPlissageButtonFermer                           : Locator;   
    public readonly pPlissageDesignMagasins                         : Locator;   

    constructor(page:Page){
        this.buttonResultatLissage                                  = page.locator('button em.icon-list');
        this.buttonEnvoyerFacturation                               = page.locator('button em.icon-envelope');
        this.buttonModifierPrixCession                              = page.locator('.form-btn-section .containerBT button').nth(2);
        this.buttonModifierPoidsLot                                 = page.locator('.form-btn-section .containerBT button').nth(3);
        this.buttonRechercher                                       = page.locator('button span.pi-search');

        this.buttonReadresserLivraisons                             = page.locator('button em.icon-pencil');
          
    
        this.inputSearchMagasin                                     = page.locator('input[id="codeMagasin"]');
        this.inputSearchArticle                                     = page.locator('input[id="codeArticle"]');    
        this.inputFiltreNumeroBF                                    = page.locator('p-columnfilter[field="numeroBF"] input');
        this.inputFiltreNumeroLot                                   = page.locator('p-columnfilter[field="lot.numero"] input');
        this.inputFiltreMagasin                                     = page.locator('p-columnfilter[field="facturable"] input');
        this.inputFiltreArticle                                     = page.locator('p-columnfilter[field="article"] input');
        this.inputFiltreQteColis                                    = page.locator('p-columnfilter[field="quantiteFacturee"] input');
        this.inputFiltreQteUC                                       = page.locator('p-columnfilter[field="quantiteFactureeUC"] input');
        this.inputFiltrePrixCession                                 = page.locator('p-columnfilter[field="prixCession"] input');
        this.inputFiltreTotal                                       = page.locator('p-columnfilter[field="totalFacture"] input');
        this.inputFiltreQteUE                                       = page.locator('p-columnfilter[field="quantiteFactureeUE"] input');  
    
        this.listBoxTypes                                           = page.locator('#type-select');
    
        this.dataGridListeLivraisons                                = page.locator('table tr:nth-child(1) th'); 

        this.dataGridListeEcartsArticles                            = page.locator('.table-livraisons-reelles th'); 
        this.dataGridListeBlArticles                                = page.locator('td.datagrid-article-code');
        this.dataGridListeBlNumeroBF                                = page.locator('td.datagrid-numeroBF');

        //-- Popin : Confirmation de l'envoi des factures ----------------------------------------------------------------------------
        this.pPconfirmationEnvoi                                    = page.locator('p-button[title="Envoyer la facturation"] button');
        this.pPbuttonConfirmOui                                     = page.locator('.modal-footer button.btn-primary');
        this.pPbuttonConfirmAnnuler                                 = page.locator('p-button .p-button-link');

        this.pPspinner                                              = page.locator('span.app-spinner');

        //-- Popin : Résultat du lissage ----------------------------------------------------------------------------
        this.pPlissageResultat                                      = page.locator('.resultat-lissage').nth(1);
        this.pPlissageButtonFermer                                  = page.locator('p-button .p-button-link');
        this.pPlissageDesignMagasins                                = page.locator('resultat-lissage-modal table tbody tr td:nth-child(2)');

    }

}