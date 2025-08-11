/**
 * Appli    : MAGASIN
 * Page     : EMBALLAGES
 * Onglet   : STOCK ET BONS
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page} from '@playwright/test';

export class EmballagesStock {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonCreerBon             = this.page.locator('[ng-click="openPopupAjoutBonEmballage()"]');  
    public readonly buttonImprimerBon          = this.page.locator('[ng-click="imprimerBonEmballage(dgBonsEmballage.selections[0])"]');  
    public readonly buttonAnnuler              = this.page.locator('[ng-click="confirmerAnnulation(dgBonsEmballage.selections[0])"]');   

    public readonly datePickerPeriodeFrom      = this.page.locator('span.datepicker-wrapper > span').nth(0);
    public readonly datePickerPeriodeTo        = this.page.locator('span.datepicker-wrapper > span').nth(1);     
    public readonly datePickerLinkPrev         = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                        // bouton mois précédent du calendrier
    public readonly datePickerFirstDay         = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');   // premier jour du calendrier
    
    public readonly datagridHeaderDate         = this.page.locator('th[data-attribut="dateRetour"]');

    public readonly dataGridListeBons          = this.page.locator('.bons-emballage th');    
    public readonly dataGridLigneBon           = this.page.locator('.bons-emballage tbody tr');
    
    public readonly tdNumBon                   = this.page.locator('td.datagrid-numero');

    //-- POPIN: Confirmer l'annulation d'un bon d'emballage ----------------------------------------------------------
    public readonly pPbuttonOui                = this.page.locator('modal .modal-footer button[ng-click="onClickOk()"]').nth(0);
    public readonly pPbuttonNon                = this.page.locator('modal .modal-footer a[ng-click="onClickClose($event)"]').nth(0);

    //-- POPIN : Création d'un bon d'emballage -----------------------------------------------------------------------
    public readonly pPdataPickerRetour         = this.page.locator('#datepicker-date-proceed > input');

    public readonly pPinputTransporteur        = this.page.locator('input[ng-model="autocompleteTransporteur.display"]');
    public readonly pPinputRespChargement      = this.page.locator('input[ng-model="bonEmballage.redacteur"]');
    public readonly pPinputNomChauffeur        = this.page.locator('input[ng-model="bonEmballage.chauffeur"]');

    public readonly pPinputHeureArrivee        = this.page.locator('time-picker[ng-model="bonEmballage.heureArrivee"] input.time-picker-hh');
    public readonly pPinputMinuteArrivee       = this.page.locator('time-picker[ng-model="bonEmballage.heureArrivee"] input.time-picker-mm');
    public readonly pPinputHeureDepart         = this.page.locator('time-picker[ng-model="bonEmballage.heureDepart"] input.time-picker-hh');
    public readonly pPinputMinuteDepart        = this.page.locator('time-picker[ng-model="bonEmballage.heureDepart"] input.time-picker-mm');

    public readonly pPinputNombrePiles         = this.page.locator('#input-nombre-piles');
    public readonly pPinputNombreEmballages    = this.page.locator('#input-nombre-emballages');

    public readonly pPtextAreaObservationsEmb  = this.page.locator('textarea[ng-model="bonEmballage.observations"]');
    public readonly pPtextAreaObservationsLigne= this.page.locator('textarea[ng-model="ligneCourante.observations"]');    

    public readonly pPlistBoxTypeEmballage     = this.page.locator('#input-emballage');

    public readonly pPdataGridListeEmballages  = this.page.locator('#formAjoutLigneBonEmballage th');
    public readonly pPdataGridTypeEmballage    = this.page.locator('#formAjoutLigneBonEmballage tbody td.datagrid-typeEmballage');
    public readonly pPdataGridLigneEmballage   = this.page.locator('#formAjoutLigneBonEmballage tbody tr');
    public readonly pPdataGridActionSupprime   = this.page.locator('#formAjoutLigneBonEmballage tbody td.actiontd .contAction a i.icon-remove');

    public readonly pPcheckBoxListeBons        = this.page.locator('datagrid[contenu="dgBonsEmballage.contenu"] td input');

    public readonly pPbuttonValiderImprimer    = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer             = this.page.locator('div.modal.hide.in > div.modal-footer > a');  
    public readonly pPbuttonAjouter            = this.page.locator('[ng-click="insererEmballage()"]');  

    constructor(public readonly page: Page) {};
    
}