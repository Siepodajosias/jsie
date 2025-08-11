/**
 * 
 * PREPARATION PAGE > REFERENTIEL / ONGLET > CHEMIN D'ECLATEMENT
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.3
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefCheminEclatementPage {

    public readonly buttonEnregistrer           : Locator;  // .locator('button em.icon-hdd');    
    public readonly buttonCloner                : Locator;  // .locator('button em.icon-plus');    
    public readonly buttonDesactiver            : Locator;  // .locator('button em.icon-minus');    
    public readonly buttonExporter              : Locator;
    public readonly buttonImporter              : Locator;

    public readonly dataGridListesChemins       : Locator;  // .locator('p-table.chemin-eclatement thead tr:nth-child(1) th'); 

    public readonly inputFiltreDesignation      : Locator;  // .locator('#filtre-designation');

    public readonly tdCheminsNonClones          : Locator;  // .locator('td.colonne-designation span:NOT(.bis)');
    public readonly tdCheminsClones             : Locator;  // .locator('td.colonne-designation span.bis');
    public readonly tdChemins                   : Locator;

    //-- Popin : Activer la double préparation d'un magasin ----------------------------------------------------------------------
    public readonly pPActiverButtonConfirmer    : Locator;  // .locator('div.p-dialog-footer button');
    public readonly pPActiverButtonAnnuler      : Locator;

    //-- Popin : Désactiver la double préparation d'un magasin -------------------------------------------------------------------
    public readonly pPdesactiverButtonConfirmer : Locator;  // .locator('div.p-dialog-footer button');  
    public readonly pPdesactiverButtonAnnuler   : Locator;

    constructor(page:Page){

        this.buttonEnregistrer              = page.locator('.sigale-page-footer button:NOT([title])').nth(0);    
        this.buttonCloner                   = page.locator('button em.icon-plus');    
        this.buttonDesactiver               = page.locator('button em.icon-minus');
        this.buttonExporter                 = page.locator('.sigale-page-footer button:NOT([title]):NOT(.ng-star-inserted)').nth(0);
        this.buttonImporter                 = page.locator('.sigale-page-footer button:NOT([title]):NOT(.ng-star-inserted)').nth(1);
    
        this.dataGridListesChemins          = page.locator('p-table.chemin-eclatement thead tr:nth-child(1) th'); 
    
        this.inputFiltreDesignation         = page.locator('#filtre-designation input');
    
        this.tdCheminsNonClones             = page.locator('td.colonne-designation span:NOT(.bis)');
        this.tdCheminsClones                = page.locator('td.colonne-designation span.bis');
        this.tdChemins                      = page.locator('td.colonne-designation');
    
        //-- Popin : Activer la double préparation d'un magasin ----------------------------------------------------------------------
        this.pPActiverButtonConfirmer       = page.locator('div.p-dialog-footer button').nth(0);
        this.pPActiverButtonAnnuler         = page.locator('div.p-dialog-footer button').nth(1);
    
        //-- Popin : Désactiver la double préparation d'un magasin -------------------------------------------------------------------
        this.pPdesactiverButtonConfirmer    = page.locator('div.p-dialog-footer button').nth(0);//pPdesactiverButtonAnnuler
        this.pPdesactiverButtonAnnuler      = page.locator('div.p-dialog-footer button').nth(1);
    }
}