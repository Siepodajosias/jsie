/**
 * Appli    : STOCK
 * Page     : EMBALLAGE
 * Obglet   : LIVRAISON
 * 
 * author JOSIAS SIE
 * 
 * @version 3.4
 * 
 */

import { Page } from "@playwright/test"

export class EmballageRestitution{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly dataGridRestitution        = this.page.locator('tr.first-line th');

    public readonly buttonRechercher           = this.page.locator('button span.pi-search');
    public readonly buttonStatMultiselectClose = this.page.locator('button.p-multiselect-close');
    public readonly buttonCreer                = this.page.locator('div.form-btn-section button').nth(0);
    public readonly buttonModifier             = this.page.locator('div.form-btn-section button').nth(1);
    public readonly buttonAnnuler              = this.page.locator('div.form-btn-section button').nth(2);
    public readonly buttonVisualiserRecept     = this.page.locator('div.form-btn-section button').nth(3);
    public readonly buttonImprimerRecept       = this.page.locator('div.form-btn-section button').nth(4);
    public readonly buttonCreerUnBL            = this.page.locator('div.boutons-pied-page button').nth(0);
    public readonly buttonModifierUnBL         = this.page.locator('div.form-btn-section button em.icon-pencil');
    public readonly buttonVisualiser           = this.page.locator('div.form-btn-section button em.icon-eye-open');
    public readonly buttonAnnulerBl            = this.page.locator('div.form-btn-section button em.icon-ban-circle');
    public readonly buttonImprimer             = this.page.locator('div.form-btn-section button em.icon-print');

    public readonly multiSelectStatut          = this.page.locator('p-multiselect');
    public readonly multiSelectStatutItem      = this.page.locator('p-multiselectitem');

    public readonly listBoxGestionnaire        = this.page.locator('#filtre-gestionnaire');

    public readonly datePickerFrom             = this.page.locator('p-calendar input').nth(0);
    public readonly datePickerTo               = this.page.locator('p-calendar input').nth(1);

    public readonly tdNumCommande              = this.page.locator('td.numeroCommande');
    public readonly tdStatut                   = this.page.locator('td.designationStatut');    
    public readonly tdListeJours               = this.page.locator('td.day:not(.old):not(.new)');
    public readonly tdListeMois                = this.page.locator('span.month');

    public readonly inputDateDebut             = this.page.locator('#datepickerRestitutionDebut input');

    public readonly thDate                     = this.page.locator('th.dateDuBon');
    public readonly thDatePeackerMonth         = this.page.locator('.datepicker-days th.datepicker-switch');
    
    public readonly toastMessage               = this.page.locator('p-toast p-toastitem .p-toast-message-content');

    //-- Popin : Création d'un bon de restitution --------------------------------------------------------------------
    public readonly pPdatePickerRestitut       = this.page.locator('[name="dateBonRestitution"] input');

    public readonly pPdatePickerEntree         = this.page.locator('[name="dateEntree"] input');
    public readonly pPinputNumeroBl            = this.page.locator('#numero-bl');
    public readonly pPinputRechercheExpediteur = this.page.locator('input#recherche-expediteur');
    public readonly pPinputReceptonnaire       = this.page.locator('input#receptionnaire');

    public readonly pPtdTodayRestitut          = this.page.locator('td.today');
    public readonly pPtdDesignEmbRestitut      = this.page.locator('.datagrid-typeEmballage-designation');

    public readonly pPinputChauffeurRestitut   = this.page.locator('#chauffeur');
    public readonly pPinputDestinatRestitut    = this.page.locator('#recherche-destinataire');
    public readonly pPinputTransporteurRestitut= this.page.locator('#transporteur input');
    public readonly pPinputNumCommandeRestitut = this.page.locator('#numero-commande');
    public readonly pPinputChargeurRestitut    = this.page.locator('#chargeur');
    public readonly pPinputHeureStartRestitut  = this.page.locator('#heureArrivee input');
    public readonly pPinputHeureEndRestitut    = this.page.locator('#heureDepart input');
    public readonly pPinputDestinataireRestitut= this.page.locator('#recherche-destinataire');
    public readonly pPinputQantitesRestitut    = this.page.locator('td.colonne-quantite input');

    public readonly pPlabelTypeEmbRestitut     = this.page.locator('td.colonne-type-emballage');

    public readonly pPinputFiltreDestiRestitut = this.page.locator('#filtre-destinataire');
    public readonly pPinputFiltreNumComRestitut= this.page.locator('#filtre-numeroCommande');
    public readonly pPinputFiltreNumBLRestitut = this.page.locator('#filtre-numeroBL');
    public readonly pPinputFiltreTranspRestitut= this.page.locator('#filtre-transporteur');//
    public readonly pPinputFiltreChargeRestitut= this.page.locator('#filtre-chargeur');

    public readonly pPinputFiltreReceptionnaire= this.page.locator('#filtre-receptionnaire');

    public readonly pPinputQuantiteRestitut    = this.page.locator('.datagrid-quantite input');

    public readonly pPListeDestiRestitut       = this.page.locator('.PLATEFORME span.ngb-highlight');

    //public readonly pPlistBoxGestionnaireRest  = element(by.model('restitution.gestionnaire');
    public readonly pPlistBoxGestionnaireRest  = this.page.locator('restitution.gestionnaire');

    public readonly pPtextAreaObsRestitut      = this.page.locator('#observations');

    public readonly pPbuttonEnregistrerRestitut= this.page.locator('#enregisterBL');
    public readonly pPbuttonEnregistrer        = this.page.locator('#enregistrer');
    public readonly pPlinkAnnulerRestitut      = this.page.locator('div.p-dialog-footer button.p-button-link'); 

    //-- Popin : Annulation d'un bon de restitution ------------------------------------------------------------------
    public readonly pPbuttonConfirmerAnnulation= this.page.locator('div.p-dialog-footer .p-element').nth(1);

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {}  

}