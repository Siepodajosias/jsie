/**
 * Appli    : QUALITE
 * PAGE     : PLANIFICATION
 * Onglet   : ARRIVAGES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.3
 * 
 */

import { Locator, Page } from "@playwright/test";

export class PlanificationArrivages {

    public readonly listBoxRayon                     : Locator; //('app-selection-rayon [role="button"]');
    public readonly listBoxChoixRayon                : Locator; //('.p-dropdown-item.p-ripple');
    public readonly listBoxPlateforme                : Locator; //('#plateforme [role="button"]');

    public readonly buttonAjouterSemaine             : Locator; //('app-footer-bar .action button')  }   
    public readonly buttonEnregistrer                : Locator; //('app-footer-bar button.sans-icone').nth(0);
    public readonly buttonDuppliquer                 : Locator; //('app-footer-bar button.sans-icone').nth(2);
    public readonly buttonDuppliquerIcon             : Locator; //('p-accordiontab .div-header [icon="fas fa-copy"]');
    public readonly buttonRechercher                 : Locator; //('.tab-parametrage-planification button.p-button');

    public readonly buttonDeletePlanifSemaine1       : Locator; //('p-accordiontab .div-header [icon="fas fa-trash"]');

    public readonly datagridPlanificationSemaine     : Locator; //('.semaine-planification');  
    public readonly dataGridPlanifFamille            : Locator;
    //-----Planification Jour :Lundi----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifLundi         : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleLundi        : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderLundi               : Locator; //('div.footer button.btn-primary.valider')  }
    public readonly buttonAnnulerLundi               : Locator; //('div.footer button.p-button-text')  }
    public readonly buttonSupprimerFamilleLundi      : Locator; //('tbody button > em.fas.fa-times');

    public readonly checkBoxAjoutFamille             : Locator; //('.p-checkbox-box');

    //-----Planification Jour :Mardi----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifMardi         : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleMardi        : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderMardi               : Locator; //('div.footer button.btn-primary.valider');
    public readonly buttonAnnulerMardi               : Locator; //('div.footer button.p-button-text');
    public readonly buttonSupprimerFamilleMardi      : Locator; //('tbody button > em.fas.fa-times');
    
    //-----Planification Jour :Mercredi----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifMercredi      : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleMercredi     : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderMercredi            : Locator; //('div.footer button.btn-primary.valider');
    public readonly buttonAnnulerMercredi            : Locator; //('div.footer button.p-button-text');
    public readonly buttonSupprimerFamilleMercredi   : Locator; //('tbody button > em.fas.fa-times');
    
    //-----Planification Jour :Jeudi----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifJeudi         : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleJeudi        : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderJeudi               : Locator; //('div.footer button.btn-primary.valider');
    public readonly buttonAnnulerJeudi               : Locator; //('div.footer button.p-button-text');
    public readonly buttonSupprimerFamilleJeudi      : Locator; //('tbody button > em.fas.fa-times');
   
    //-----Planification Jour:Vendredi ----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifVendredi       : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleVendredi      : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderVendredi             : Locator; //('div.footer button.btn-primary.valider');
    public readonly buttonAnnulerVendredi             : Locator; //('div.footer button.p-button-text');
    public readonly buttonSupprimerFamilleVendredi    : Locator; //('tbody button > em.fas.fa-times');
   
    //-----Planification Jour:Samedi-----------------------------------------------------------------------------------------//      
    public readonly buttonAjouterPlanifSamedi         : Locator; //('thead #header-actions .fas.fa-plus ');
    public readonly buttonAjouterFamilleSamedi        : Locator; //('tbody button > em.fas.fa-cog');
    public readonly buttonValiderSamedi               : Locator; //('div.footer button.btn-primary.valider');
    public readonly buttonAnnulerSamedi               : Locator; //('div.footer button.p-button-text');
    public readonly buttonSupprimerFamilleSamedi      : Locator; //('tbody button > em.fas.fa-times');
   
    public readonly buttonDeletePlanifSemaine         : Locator; //('#p-accordiontab-0 > .div-header > [icon="fas fa-trash"]');

    //-Popin:Dupliquer la planification--------------------------------------------------------------------------------------//

    public readonly pPopinDupliquer                   : Locator; //('.p-dialog.p-component.p-dialog-draggable');
    public readonly pPdpListBoxPlateforme             : Locator; //('.col-9 > #plateforme > .p-dropdown > .p-dropdown-label');
    public readonly pPdpNomPlateforme                 : Locator; //('.p-dropdown-item.p-ripple');
    public readonly pPButtonDupliquer                 : Locator; //('div.p-dialog-footer button:not(.p-button-text)');
    public readonly pPButtonAnnuler                   : Locator; //('.p-button-text');

    //-Popin:Confirmation--------------------------------------------------------------------------------------//

    public readonly pPConfbuttonSupprimerOui          : Locator; //('p-confirmdialog .pi.pi-check');
    public readonly pPConfbuttonSupprimerNon          : Locator; //('p-confirmdialog .p-dialog-footer .pi.pi-times');

    //--------------------------------------------------------------------------------------------------------//

    public readonly pPcheckBoxFamille                 : Locator; //('.p-treenode.p-treenode-leaf .p-checkbox-box');
    public readonly pPinputFamille                    : Locator; //('.p-tree-filter');

    constructor(page: Page) {

        this.listBoxRayon                   = page.locator('app-selection-rayon [role="button"]');
        this.listBoxChoixRayon              = page.locator('.p-dropdown-item.p-ripple');
        this.listBoxPlateforme              = page.locator('#plateforme [role="button"]');
     
        this.buttonEnregistrer              = page.locator('footerbar button').nth(0);
        this.buttonAjouterSemaine           = page.locator('footerbar button').nth(1);
        this.buttonDuppliquer               = page.locator('footerbar button').nth(2);
        this.buttonDuppliquerIcon           = page.locator('p-accordiontab .div-header [icon="fas fa-copy"]');
        this.buttonRechercher               = page.locator('.tab-parametrage-planification button.p-button');
    
        this.buttonDeletePlanifSemaine1     = page.locator('p-accordiontab .div-header [icon="fas fa-trash"]');
    
        this.datagridPlanificationSemaine   = page.locator('.semaine-planification');  
        this.dataGridPlanifFamille          = page.locator('.table-planification tbody');
        //-----Planification Jour :Lundi----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifLundi         = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleLundi        = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderLundi               = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerLundi               = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleLundi      = page.locator('tbody button > em.fas.fa-times');
    
        this.checkBoxAjoutFamille             = page.locator('.p-checkbox-box');
    
        //-----Planification Jour :Mardi----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifMardi         = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleMardi        = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderMardi               = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerMardi               = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleMardi      = page.locator('tbody button > em.fas.fa-times');
        
        //-----Planification Jour :Mercredi----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifMercredi      = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleMercredi     = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderMercredi            = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerMercredi            = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleMercredi   = page.locator('tbody button > em.fas.fa-times');
        
        //-----Planification Jour :Jeudi----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifJeudi         = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleJeudi        = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderJeudi               = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerJeudi               = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleJeudi      = page.locator('tbody button > em.fas.fa-times');
       
        //-----Planification Jour:Vendredi ----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifVendredi       = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleVendredi      = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderVendredi             = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerVendredi             = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleVendredi    = page.locator('tbody button > em.fas.fa-times');
       
        //-----Planification Jour:Samedi-----------------------------------------------------------------------------------------//      
        this.buttonAjouterPlanifSamedi         = page.locator('thead #header-actions .fas.fa-plus ');
        this.buttonAjouterFamilleSamedi        = page.locator('tbody button > em.fas.fa-cog');
        this.buttonValiderSamedi               = page.locator('div.footer button.btn-primary.valider');
        this.buttonAnnulerSamedi               = page.locator('div.footer button.p-button-text');
        this.buttonSupprimerFamilleSamedi      = page.locator('tbody button > em.fas.fa-times');
       
        this.buttonDeletePlanifSemaine         = page.locator('#p-accordiontab-0 > .div-header > [icon="fas fa-trash"]');
    
        //-Popin:Dupliquer la planification--------------------------------------------------------------------------------------//
    
        this.pPopinDupliquer                  = page.locator('.p-dialog.p-component.p-dialog-draggable');
        this.pPdpListBoxPlateforme            = page.locator('.col-9 > #plateforme > .p-dropdown > .p-dropdown-label');
        this.pPdpNomPlateforme                = page.locator('.p-dropdown-item.p-ripple');
        this.pPButtonDupliquer                = page.locator('div.p-dialog-footer button:not(.p-button-text)');
        this.pPButtonAnnuler                  = page.locator('.p-button-text');
    
        //-Popin:Confirmation--------------------------------------------------------------------------------------//
    
        this.pPConfbuttonSupprimerOui         = page.locator('p-confirmdialog .pi.pi-check');
        this.pPConfbuttonSupprimerNon         = page.locator('p-confirmdialog .p-dialog-footer .pi.pi-times');
    
        //--------------------------------------------------------------------------------------------------------//
    
        this.pPcheckBoxFamille                = page.locator('.p-treenode.p-treenode-leaf .p-checkbox-box');
        this.pPinputFamille                   = page.locator('.p-tree-filter');
        
    }

}

