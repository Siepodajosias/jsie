/**
 * 
 * PREPARATION PAGE > SUIVI ECLATEMENT / ONGLET > FEUILLE A PREPARER
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviEclatfeuilleAPreparerPage {

    
    public readonly buttonImprimer                          : Locator   // .locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser                        : Locator   // .locator('[ng-click="visualiserSelection()"]');
    public readonly buttonScinder                           : Locator   // .locator('[ng-click="ouvrirPopupScission(dg.selection)"]');
    public readonly buttonAnnulerScission                   : Locator   // .locator('[ng-click="confirmerAnnulerScission(dg.selection[0])"]');
    public readonly buttonPreparerVocal                     : Locator   // .locator('[ng-click="preparerEnVocal(dg.selection)"]');
    public readonly buttonPreparerManuellement              : Locator   // .locator('[ng-click="preparerManuellement(dg.selection)"]');
    public readonly buttonImprimerListeServir               : Locator   // .locator('[ng-click="imprimerListeAServir()"]');
    public readonly buttonFusionner                         : Locator 
    public readonly buttonAnnulerFusion                     : Locator  
    public readonly buttonVisualiserListeServir             : Locator   // .locator('[ng-click="imprimerListeAServir(true)"]');
    public readonly buttonEnvoyerListeServir                : Locator   // .locator('[ng-click="envoyerListeAServir()"]');
    public readonly buttonFilters                           : Locator   // .locator('.filters-container button');
    public readonly contAction                              : Locator   // .locator('.contAction');
    public readonly iconPencil                              : Locator   // .locator('.icon-pencil');

    public readonly linkFermer                              : Locator   // .locator('[ng-click="close($event);"]');

    public readonly inputSearchMagasin                      : Locator   // .locator('[ng-model="filtreMagasin"]');
    public readonly inputSearchAll                          : Locator   // .locator('[ng-model="ngModel"]');
    
    public readonly listBoxMagasin                          : Locator   // .locator('.feuilles-apreparer input#magasin-id');
    public readonly listBoxVague                            : Locator   // .locator('#filtre-vague');
    public readonly listBoxGroupeArticle                    : Locator   // .locator('#filtre-groupe-article');

    public readonly checkBoxNumFeuille                      : Locator   // .locator('#filter-0');
    public readonly checkBoxArticle                         : Locator   // .locator('#filter-1');
    public readonly checkBoxFournisseur                     : Locator   // .locator('#filter-2');
    public readonly checkBoxNumBL                           : Locator   // .locator('#filter-3');
    public readonly checkBoxNumPalette                      : Locator   // .locator('#filter-4');
    public readonly checkBoxNumLot                          : Locator   // .locator('#filter-5');
    public readonly checkBoxMasquerFeuilleMere              : Locator   // .locator('#checkbox-toggle-feuilles-meres');
    public readonly checkBoxMasquerFeuilleImp               : Locator   // .locator('#checkbox-toggle-feuilles-imprimees');
    public readonly checkBoxMasquerFeuilleSansMarchandise   : Locator   // .locator('#checkbox-toggle-feuilles-sansEmplacement');

    public readonly dataGridTableAPreparer                  : Locator   // .locator('#table-a-preparer .datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataTableFeuillesAPrepareer             : Locator
    public readonly dataTableCodeFuillesAPrepareer          : Locator

    //Pop up Modification de la feuille
    public readonly pListBoxStatut                          : Locator   // .locator('[ng-model="feuilleAModifier.statut"]');
    public readonly pListBoxPreparateur                     : Locator   // .locator('[ng-model="feuilleAModifier.preparateur"]');
    public readonly pInputHoraireDebHeure                   : Locator   // .locator('.horaire').nth(0);
    public readonly pInputHoraireDebMin                     : Locator   // .locator('.horaire').nth(1);
    
    public readonly pButtonValiderModif                     : Locator   // .locator('#btn-valider-modification');

    constructor(page:Page){

        this.buttonImprimer                          = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser                        = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonScinder                           = page.locator('[ng-click="ouvrirPopupScission(dg.selection)"]');
        this.buttonAnnulerScission                   = page.locator('[ng-click="confirmerAnnulerScission(dg.selection[0])"]');
        this.buttonPreparerVocal                     = page.locator('[ng-click="preparerEnVocal(dg.selection)"]');
        this.buttonPreparerManuellement              = page.locator('[ng-click="preparerManuellement(dg.selection)"]');
        this.buttonImprimerListeServir               = page.locator('[ng-click="imprimerListeAServir()"]');
        this.buttonFusionner                         = page.locator('[ng-click="afficherConfirmationFusion()"]')
        this.buttonAnnulerFusion                     = page.locator('[ng-click="afficherAnnulationFusion()"]')
        this.buttonVisualiserListeServir             = page.locator('[ng-click="imprimerListeAServir(true)"]');
        this.buttonEnvoyerListeServir                = page.locator('[ng-click="envoyerListeAServir()"]');
        this.buttonFilters                           = page.locator('.filters-container button');
        this.contAction                              = page.locator('.contAction');
        this.iconPencil                              = page.locator('.icon-pencil');
    
        this.linkFermer                              = page.locator('[ng-click="close($event);"]');
    
        this.inputSearchMagasin                      = page.locator('[ng-model="filtreMagasin"]');
        this.inputSearchAll                          = page.locator('[ng-model="ngModel"]');
        
        this.listBoxMagasin                          = page.locator('.feuilles-apreparer input#magasin-id');
        this.listBoxVague                            = page.locator('#filtre-vague');
        this.listBoxGroupeArticle                    = page.locator('#filtre-groupe-article');
    
        this.checkBoxNumFeuille                      = page.locator('#filter-0');
        this.checkBoxArticle                         = page.locator('#filter-1');
        this.checkBoxFournisseur                     = page.locator('#filter-2');
        this.checkBoxNumBL                           = page.locator('#filter-3');
        this.checkBoxNumPalette                      = page.locator('#filter-4');
        this.checkBoxNumLot                          = page.locator('#filter-5');
        this.checkBoxMasquerFeuilleMere              = page.locator('#checkbox-toggle-feuilles-meres');
        this.checkBoxMasquerFeuilleImp               = page.locator('#checkbox-toggle-feuilles-imprimees');
        this.checkBoxMasquerFeuilleSansMarchandise   = page.locator('#checkbox-toggle-feuilles-sansEmplacement');
    
        this.dataGridTableAPreparer                  = page.locator('#table-a-preparer .datagrid-table-wrapper > table > thead > tr > th');
        this.dataTableFeuillesAPrepareer             = page.locator('#table-a-preparer tbody tr');
        this.dataTableCodeFuillesAPrepareer          = page.locator('#table-a-preparer tbody tr td[data-field="numeroSupportPrepa"]');

    
        //Pop up Modification de la feuille
        this.pListBoxStatut                          = page.locator('[ng-model="feuilleAModifier.statut"]');
        this.pListBoxPreparateur                     = page.locator('[ng-model="feuilleAModifier.preparateur"]');
        this.pInputHoraireDebHeure                   = page.locator('.horaire').nth(0);
        this.pInputHoraireDebMin                     = page.locator('.horaire').nth(1);
        
        this.pButtonValiderModif                     = page.locator('#btn-valider-modification');
    }
}