/**
 * Appli    : STOCK
 * Page     : EXPEDITION
 * onglet   : EXPEDITIONS PREVUES
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 * 
 */

import { Page } from '@playwright/test';

export class ExpeditionPrevue{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerBordereau    = this.page.locator('[ng-click="imprimer(dg.selection)"]');
    public readonly buttonExpedier             = this.page.locator('[ng-click="expedier(dg.selection)"]');
    public readonly buttonNlleExpedition       = this.page.locator('[ng-click="creerExpedition()"]');
    public readonly buttonDetailPalette        = this.page.locator('[ng-click="openDetailPalette(dg.selection)"]');

    public readonly listBoxPlateforme          = this.page.locator('#filtre-plateforme');

    public readonly inputFiltreArticle         = this.page.locator('input.filter-input');

    public readonly checkBoxFiltreArticle      = this.page.locator('#checkbox-toggle-filtre-article');
    public readonly checkBoxFiltreFournisseur  = this.page.locator('#checkbox-toggle-filtre-fournisseur');
    public readonly checkBoxFiltreExpeFutures  = this.page.locator('#checkbox-toggle-expeditions-futures');
    public readonly checkBoxFiltreExpeVides    = this.page.locator('#checkbox-toggle-expeditions-vides');        
    public readonly checkBoxExpeditions        = this.page.locator('.tableau-expeditions-prevues div.datagrid-table-wrapper > table').nth(0).locator('tbody > tr > td > input');     

    public readonly dataGridExpePrevues        = this.page.locator('datagrid[defaultsorter="palettePreparee"] th');     
    
    //-- Popin : Expédition pour la plateforme xxx -------------------------------------------------------------------
    public readonly pButtonSauvegarder         = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonFinirChargement     = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(1);    
    public readonly pButtonAnnuler             = this.page.locator('div.modal.hide.in > div.modal-footer > a');    
    public readonly pButtonAjouterLot          = this.page.locator('[ng-click="ajouterPalettesLot()"]');
    public readonly pButtonAjouterPalette      = this.page.locator('[ng-click="ajouterPaletteAuTableau()"]');

    public readonly pInputHeureArrivee         = this.page.locator('hh').nth(0);
    public readonly pInputHeureDepart          = this.page.locator('hh').nth(1);
    public readonly pInputMinuteArrivee        = this.page.locator('mm').nth(0);
    public readonly pInputMinuteDepart         = this.page.locator('mm').nth(1);
    public readonly pInputConsigneTemperature  = this.page.locator('#consigne-temperature-camion');
    public readonly pInputLot                  = this.page.locator('#lot');
    public readonly pInputPalette              = this.page.locator('#palette');
    public readonly pInputNomChauffeur         = this.page.locator('#chauffeur-nom-input');
    public readonly pInputPrenomChauffeur      = this.page.locator('#chauffeur-prenom-input');
    public readonly pInputTelephone            = this.page.locator('#telephone-input');
    public readonly pInputImmatriculation      = this.page.locator('#immatriculation-input');
    public readonly pInputDateDepart           = this.page.locator('#input-start-date');
    
    public readonly pTextAreaCommentaire       = this.page.locator('#observation');
    
    public readonly pListBoxTransporteur       = this.page.locator('#transporteurs');
    public readonly pListBoxQuai               = this.page.locator('#quai');
    public readonly pListBoxChargeur1          = this.page.locator('#chargeur1');
    public readonly pListBoxChargeur2          = this.page.locator('#chargeur2');    
    
    public readonly pDataGridListeExpeditions  = this.page.locator('.palettes div.datagrid-table-wrapper > table > thead > tr > th');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {}  
}