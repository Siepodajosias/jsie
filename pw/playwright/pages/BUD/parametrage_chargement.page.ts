/**
 * Appli    : BUDGET
 * Page     : PARAMETRAGE
 * Onglet   : CHARGEMENT
 * 
 * 
 * @author SIAKA KONE
 * @version 3.2
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageChargement {

    
    public readonly listboxbmAnneeExercice                           : Locator; //('#anneeExercice');;

    public readonly buttonExportCoutParPoste                         : Locator; //('chargement-couts-par-poste');
    public readonly buttonMasseSalarialeHeuresTravaillées            : Locator; //('chargement-masse-salariale-et-heures-travaillees');
    public readonly buttonBudgetValideClients                        : Locator; //('chargement-budget-valide');      
    public readonly buttonUpload                                     : Locator; //('.p-fileupload input');
    public readonly buttonExporterTemplateCout                       : Locator; //('button .p-button-label').eq(0);
    public readonly buttonExporterTemplateMsEtHt                     : Locator; //('button .p-button-label').eq(1);
    public readonly buttonExporterTemplateMargeTheorique             : Locator; //('button .p-button-label').eq(1);
    public readonly buttonRecapitulatifCode                          : Locator;
    public readonly buttonParcourir                                  : Locator; //('p-fileupload');

    // -- Fichiers chargés recemment --------------------------------------------------------------------------------------------------
    public readonly fichierChargerRecementCoutPoste                  : Locator; //('div.row.dernier-imports-corrects ul').nth(0);                                  
    public readonly fichierChargerRecementMassSalariale              : Locator; //('div.row.dernier-imports-corrects ul').nth(1);                                  
    public readonly fichierChargerRecementBudgetClientEcart          : Locator; //('div.row.dernier-imports-corrects ul').nth(2);                                  
    public readonly fichierChargerRecementMargeTheorique             : Locator; //('div.row.dernier-imports-corrects ul').nth(3);
    public readonly iconeSuccessChargement                           : Locator; //('i.succes');
    //-- Popin Codes utilisés dans les chargements de fichier -------------------------------------------------------------------------

    public readonly pDataGridDE                                      : Locator;
    public readonly pDataGridGroupeArticles                          : Locator;
    public readonly pDataGridPostes                                  : Locator;
    public readonly pDataGridContrats                                : Locator;
    public readonly pDataGridRegroupements                           : Locator;
    public readonly pDataGridLieuxVente                              : Locator;

    public readonly pInputFiltreCodeDE                               : Locator;
    public readonly pInputFiltreDesignationDE                        : Locator;
    public readonly pInputFiltreCodeGroupeArticle                    : Locator;
    public readonly pInputFiltreDesignGroupeArticle                  : Locator;
    public readonly pInputFiltreCodePoste                            : Locator;
    public readonly pInputFiltreDesignationPoste                     : Locator;
    public readonly pInputFiltreCodeContrats                         : Locator;
    public readonly pInputFiltreDesignationContrats                  : Locator;
    public readonly pInputFiltreCodeRegroupements                    : Locator;
    public readonly pInputFiltreDesignationRegroupements             : Locator;
    public readonly pInputFiltreDesignationGrpeArticle               : Locator;
    public readonly pInputFiltreCodeLieuxVente                       : Locator;
    public readonly pInputFiltreDesignationLieuxVente                : Locator;

    public readonly pButtonFiltreCodeDE                              : Locator;
    public readonly pButtonFiltreDesignationDE                       : Locator;
    public readonly pButtonFiltreCodePoste                           : Locator;
    public readonly pButtonFiltreDesignationPoste                    : Locator;
    public readonly pButtonFiltreCodeContrats                        : Locator;
    public readonly pButtonFiltreDesignationContrats                 : Locator;
    public readonly pButtonFiltreCodeRegroupements                   : Locator;
    public readonly pButtonFiltreDesignationRegroupements            : Locator;
    public readonly pButtonFiltreDesignationGrpeArticle              : Locator;
    public readonly pButtonFiltreCodeLieuxVente                      : Locator;
    public readonly pButtonFiltreDesignationLieuxVente               : Locator;

    public readonly pButtonFermer                                    : Locator;

    public readonly pInputRegroupementDE                             : Locator;

    public readonly pListeBoxEnseigne                                : Locator;
    public readonly pListeBoxRegroupementDE                          : Locator;

    public readonly pCheckBoxRegroupementDE                          : Locator;
    public readonly pCheckBoxAllRegroupementDE                       : Locator;

    constructor(page:Page) {

        this.listboxbmAnneeExercice                                 = page.locator('#anneeExercice');

        this.buttonExportCoutParPoste                               = page.locator('chargement-couts-par-poste');
        this.buttonMasseSalarialeHeuresTravaillées                  = page.locator('chargement-masse-salariale-et-heures-travaillees');
        this.buttonBudgetValideClients                              = page.locator('chargement-budget-valide');      
        this.buttonUpload                                           = page.locator('.p-fileupload input');
        this.buttonExporterTemplateCout                             = page.locator('button .p-button-label').nth(0);
        this.buttonExporterTemplateMsEtHt                           = page.locator('button .p-button-label').nth(1);
        this.buttonExporterTemplateMargeTheorique                   = page.locator('button .p-button-label').nth(2);
        this.buttonRecapitulatifCode                                = page.locator('button .p-button-label').nth(4);
        this.buttonParcourir                                        = page.locator('p-fileupload');
        
        // -- Fichiers chargés recemment --------------------------------------------------------------------------------------------------
        this.fichierChargerRecementCoutPoste                        = page.locator('div.row.dernier-imports-corrects ul').nth(0);
        this.fichierChargerRecementMassSalariale                    = page.locator('div.row.dernier-imports-corrects ul').nth(1);
        this.fichierChargerRecementBudgetClientEcart                = page.locator('div.row.dernier-imports-corrects ul').nth(2);
        this.fichierChargerRecementMargeTheorique                   = page.locator('div.row.dernier-imports-corrects ul').nth(2);
        this.iconeSuccessChargement                                 = page.locator('i.succes');
        //-- Popin Codes utilisés dans les chargements de fichier -------------------------------------------------------------------------

        this.pDataGridDE                                            = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(0);
        this.pDataGridGroupeArticles                                = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(1);
        this.pDataGridPostes                                        = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(2);
        this.pDataGridContrats                                      = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(3);
        this.pDataGridRegroupements                                 = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(4);
        this.pDataGridLieuxVente                                    = page.locator('.p-datatable-scrollable-view thead tr:nth-child(1)').nth(5);

        this.pInputFiltreCodeDE                                     = page.locator('p-columnfilterformelement input.p-inputtext').nth(0);
        this.pInputFiltreDesignationDE                              = page.locator('p-columnfilterformelement input.p-inputtext').nth(1);        
        this.pInputFiltreCodeGroupeArticle                          = page.locator('p-columnfilterformelement input.p-inputtext').nth(2);
        this.pInputFiltreDesignGroupeArticle                        = page.locator('p-columnfilterformelement input.p-inputtext').nth(3);                
        this.pInputFiltreCodePoste                                  = page.locator('p-columnfilterformelement input.p-inputtext').nth(4);
        this.pInputFiltreDesignationPoste                           = page.locator('p-columnfilterformelement input.p-inputtext').nth(5);
        this.pInputFiltreCodeContrats                               = page.locator('p-columnfilterformelement input.p-inputtext').nth(6);
        this.pInputFiltreDesignationContrats                        = page.locator('p-columnfilterformelement input.p-inputtext').nth(7);
        this.pInputFiltreCodeRegroupements                          = page.locator('p-columnfilterformelement input.p-inputtext').nth(8);
        this.pInputFiltreDesignationRegroupements                   = page.locator('p-columnfilterformelement input.p-inputtext').nth(9);
        this.pInputFiltreDesignationGrpeArticle                     = page.locator('p-columnfilterformelement input.p-inputtext').nth(10);
        this.pInputFiltreCodeLieuxVente                             = page.locator('p-columnfilterformelement input.p-inputtext').nth(11);
        this.pInputFiltreDesignationLieuxVente                      = page.locator('p-columnfilterformelement input.p-inputtext').nth(12);

        this.pInputRegroupementDE                                   = page.locator('input.p-multiselect-filter');

        this.pButtonFiltreCodeDE                                    = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(0);
        this.pButtonFiltreDesignationDE                             = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(1);
        this.pButtonFiltreCodePoste                                 = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(2);
        this.pButtonFiltreDesignationPoste                          = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(3);
        this.pButtonFiltreCodeContrats                              = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(4);
        this.pButtonFiltreDesignationContrats                       = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(5);
        this.pButtonFiltreCodeRegroupements                         = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(6);
        this.pButtonFiltreDesignationRegroupements                  = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(7);
        this.pButtonFiltreDesignationGrpeArticle                    = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(8);
        this.pButtonFiltreCodeLieuxVente                            = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(9);
        this.pButtonFiltreDesignationLieuxVente                     = page.locator('button.p-column-filter-menu-button .pi-filter-icon').nth(10);

        this.pButtonFermer                                          = page.locator('p-footer button.btn-link');

        this.pListeBoxEnseigne                                      = page.locator('[inputid="filtre-enseigne"]');
        this.pListeBoxRegroupementDE                                = page.locator('p-multiselect .p-multiselect-trigger-icon');

        this.pCheckBoxRegroupementDE                                = page.locator('p-multiselectitem .p-checkbox-box');
        this.pCheckBoxAllRegroupementDE                             = page.locator('.p-multiselect-header .p-checkbox-box');


    }
            
}