/**
 * 
 * FACTURATION PAGE > LIVRAISON EFFECTUEES / ONGLET > REMISES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class LivraisonsEffectuesRemises {
    
    public readonly ListBoxRayon                                : Locator;  

    public readonly inputArticle                                : Locator;
    public readonly inputMagasin                                : Locator;

    public readonly datePickerFrom                              : Locator;
    public readonly datePickerTo                                : Locator;

    public readonly buttonRechercheRemise                       : Locator;
    public readonly buttonCreerRemise                           : Locator;
    public readonly buttonModifierRemise                        : Locator;
    public readonly buttonActivDesactivRemise                   : Locator;

    public readonly thTaux                                      : Locator;
    public readonly thActif                                     : Locator;

    public readonly tdListeTaux                                 : Locator;
    public readonly tdListeRemisesActives                       : Locator;
    public readonly tdListeRemises                              : Locator;

    public readonly dataGridListeRemises                        : Locator;

    //-- Popin : Création d'une remise -----------------------------------------------------------------------------------

    public readonly pPopinCreationRemise                        : Locator;

    public readonly pPcreatListBoxGrpArticle                    : Locator; 
    public readonly pPcreatListBoxType                          : Locator; 

    public readonly pPcreatInputCodeDesignMag                   : Locator; 
    public readonly pPcreatInputCodeDesignArt                   : Locator;
    public readonly pPcreatInputTaux                            : Locator;

    public readonly pPcreatRadioRemisePied                      : Locator;
    public readonly pPcreatRadioRemiseLigne                     : Locator;

    public readonly pPcreatCheckBoxActif                        : Locator;
    public readonly pPcreatCheckBoxArticles                     : Locator;
    public readonly pPcreatCheckBoxMagasins   

    public readonly pPcreatTdDesignArticles                     : Locator;
    public readonly pPcreatTdDesignMagasins                     : Locator;

    public readonly pPcreatButtonEnregistrer                    : Locator;

    public readonly pPcreatLinkFermer                           : Locator;
    public readonly pPcreatDatePickerFrom                       : Locator;
    public readonly pPcreatDatePickerTo                         : Locator;

    public readonly pPcreatHeadersMagasins                      : Locator;

    //-- Popin : Désactivation d'une remise ------------------------------------------------------------------------------

    public readonly pPdesctivButtonValider                      : Locator;

    public readonly pPdesctivLinkFermer                         : Locator;

    //--- Commun tous Date Picker ----------------------------------------------------------------------------------------

    public readonly pPcalendarDays                              : Locator;
    public readonly pPcalendarToday                             : Locator;

    constructor(page:Page){

        this.ListBoxRayon           = page.locator('[ng-model="filter.groupeArticle"]');

        this.inputArticle               = page.locator('[ng-model="autocompleteArticle.article"]');
        this.inputMagasin               = page.locator('[ng-model="autocompleteMagasin.magasin"]');

        this.datePickerFrom             = page.locator('.datepicker-wrapper.input-small').nth(0);
        this.datePickerTo               = page.locator('.datepicker-wrapper.input-small').nth(1);

        this.buttonRechercheRemise      = page.locator('[ng-click="rechercherRemises()"]');
        this.buttonCreerRemise          = page.locator('[ng-click="ouvrirPopupSaisieRemise()"]');
        this.buttonModifierRemise       = page.locator('[ng-click="ouvrirPopupSaisieRemise(dg.selection[0])"]');    
        this.buttonActivDesactivRemise  = page.locator('[ng-click="activerDesactiverRemise(dg.selection[0])"]');

        this.thTaux                     = page.locator('th.datagrid-taux');
        this.thActif                    = page.locator('th.datagrid-actif');

        this.tdListeTaux                = page.locator('td.datagrid-taux');
        this.tdListeRemisesActives      = page.locator('td.datagrid-actif i');       // Icone de "Remise Active"
        this.tdListeRemises             = page.locator('td.datagrid-actif');         // Toutes les remises

        this.dataGridListeRemises       = page.locator('.dg-remises th'); 

        //-- Popin : Création d'une remise -----------------------------------------------------------------------------------

        this.pPopinCreationRemise       = page.locator('.modal-backdrop')

        this.pPcreatListBoxGrpArticle   = page.locator('#select-groupe-article');
        this.pPcreatListBoxType         = page.locator('#select-type');

        this.pPcreatInputCodeDesignMag  = page.locator('[ng-model="dgMagasins.filters.AND[0].OR[0].codeClient.value"]');
        this.pPcreatInputCodeDesignArt  = page.locator('[ng-model="dgArticles.filters.AND[0].OR[0].code.value"]');
        this.pPcreatInputTaux           = page.locator('[ng-model="remise.taux"]');

        this.pPcreatRadioRemisePied     = page.locator('[ng-model="remise.enPiedDePage"]').nth(0);
        this.pPcreatRadioRemiseLigne    = page.locator('[ng-model="remise.enPiedDePage"]').nth(1);

        this.pPcreatCheckBoxActif       = page.locator('[ng-model="remise.actif"]');
        this.pPcreatCheckBoxArticles    = page.locator('.dg-creation-remise-article td input');
        this.pPcreatCheckBoxMagasins    = page.locator('.dg-creation-remise-magasin td input');

        this.pPcreatTdDesignArticles    = page.locator('.dg-creation-remise-article td.datagrid-designation');
        this.pPcreatTdDesignMagasins    = page.locator('.dg-creation-remise-magasin td.datagrid-designation');

        this.pPcreatButtonEnregistrer   = page.locator('.modal-footer button');

        this.pPcreatLinkFermer          = page.locator('.modal-footer a');

        this.pPcreatDatePickerFrom      = page.locator('.dateReleve.datepicker-wrapper i').nth(0);
        this.pPcreatDatePickerTo        = page.locator('.dateReleve.datepicker-wrapper i').nth(1);    

        this.pPcreatHeadersMagasins     = page.locator('datagrid.dg-creation-remise-magasin th');    

        //-- Popin : Désactivation d'une remise ------------------------------------------------------------------------------

        this.pPdesctivButtonValider     = page.locator('.modal-footer button');

        this.pPdesctivLinkFermer        = page.locator('.modal-footer a');    

        //--- Commun tous Date Picker ----------------------------------------------------------------------------------------

        this.pPcalendarDays             = page.locator('td.day');
        this.pPcalendarToday            = page.locator('td.today.day');
    }
}