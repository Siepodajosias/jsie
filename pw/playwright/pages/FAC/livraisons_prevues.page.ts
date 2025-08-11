/**
 * 
 * APPLI    : FACTURATION 
 * PAGE     : LIVRAISON PREVUES
 * 
 * @authors Vazoumana Diarrassouba && Siaka KONE
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class LivraisonPrevuePage {

    public readonly datePickerExpeditionMag                     : Locator;

    public readonly buttonEnvoyerLivraisons                     : Locator;
    public readonly buttonSynthesePreparations                  : Locator;
    public readonly buttonImprimerBLPrev                        : Locator;
    public readonly buttonTransmettreBLPrev                     : Locator;
    public readonly buttonRechercher                            : Locator;  

    public readonly inputSearchMagasin                          : Locator;
    public readonly inputSearchArticle                          : Locator;

    public readonly checkboxAfficherEcartPrep                   : Locator;

    public readonly dataGridListeLivraisons                     : Locator; 
    public readonly dataGridListeBL                             : Locator;   

    public readonly messageConfirmation                         : Locator;   

    //-- Popin : Imprimer les bons de livraison prévisionnels ----------------------------------------------------------------------------
    public readonly pPopinImprimerBLPrevisionnels               : Locator;
    public readonly pPimprimerBlInputCodeMag                    : Locator;
    public readonly pPimprimerBlInputDesMag                     : Locator;

    public readonly pPimprimerBlDatagridMag                     : Locator;

    public readonly pPimprimerBlButtonImprimer                  : Locator;

    public readonly pPimprimerBlLinkFermer                      : Locator;

    //-- Popin : Confirmation de l'envoi des livraisons ----------------------------------------------------------------------------
    public readonly pPconfirmationAlertMess                     : Locator;
    public readonly pPbuttonConfirmOui                          : Locator;
    public readonly pPbuttonConfirmFermer                       : Locator;

    //-- Popin : Confirmation de la transmission des BL prévisionnels ----------------------------------------------------------------------------

    public readonly pPcheckboxAll                               : Locator;
    public readonly pPbuttonTransmettre                         : Locator;
    public readonly pPmessageAlerte                             : Locator;

    constructor(page:Page){

        this.datePickerExpeditionMag            = page.locator('p-calendar span.pi-calendar');

        this.buttonEnvoyerLivraisons            = page.locator('button em.icon-envelope');
        this.buttonSynthesePreparations         = page.locator('button em.icon-list-alt');
        this.buttonImprimerBLPrev               = page.locator('button em.icon-print');
        this.buttonTransmettreBLPrev            = page.locator('button em.icon-share-alt');
        this.buttonRechercher                   = page.locator('p-button[icon="pi pi-search"]');        
    
        this.inputSearchMagasin                 = page.locator('input[formcontrolname="codeMagasin"]');
        this.inputSearchArticle                 = page.locator('[formcontrolname="codeArticle"]');
    
        this.checkboxAfficherEcartPrep          = page.locator('div.p-checkbox-box');
    
        this.dataGridListeLivraisons            = page.locator('table th[role="columnheader"]'); 
        this.dataGridListeBL                    = page.locator('.p-datatable-tbody tr.ng-star-inserted'); 
    
        this.messageConfirmation                = page.locator('.containerBT .ng-star-inserted');
    
        //-- Popin : Imprimer les bons de livraison prévisionnels ----------------------------------------------------------------------------
        this.pPopinImprimerBLPrevisionnels      = page.locator('div.p-dialog-header')
        this.pPimprimerBlInputCodeMag           = page.locator('p-columnfilter[field="codeClient"] input');
        this.pPimprimerBlInputDesMag            = page.locator('p-columnfilter[field="designation"] input');
    
        this.pPimprimerBlDatagridMag            = page.locator('impression-bl-previsionnels thead tr:nth-child(1) th');
    
        this.pPimprimerBlButtonImprimer         = page.locator('div.p-dialog-footer button.p-button:NOT(.p-button-link)');
    
        this.pPimprimerBlLinkFermer             = page.locator('div.p-dialog-footer button.p-button-link');
    
        //-- Popin : Confirmation de l'envoi des livraisons ----------------------------------------------------------------------------

        this.pPconfirmationAlertMess            = page.locator('.p-dialog-content .ng-star-inserted .text-center');
        this.pPbuttonConfirmOui                 = page.locator('.p-dialog-footer button.p-button').nth(0);
        this.pPbuttonConfirmFermer              = page.locator('.p-dialog-footer button.p-button').nth(1);

        //-- Popin : Confirmation de la transmission des BL prévisionnels ----------------------------------------------------------------------------

        this.pPcheckboxAll                     = page.locator('p-tableheadercheckbox .p-checkbox');
        this.pPbuttonTransmettre               = page.locator('.p-dialog-footer p-button').nth(0);
        this.pPmessageAlerte                   = page.locator('alert[nom="transmissionBLPrevModaleAlert"]');
        
    }

}