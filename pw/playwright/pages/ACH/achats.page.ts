/**
 * Appli    : ACHATS
 * Menu     : ACHATS
 * Onglet   : CALENDRIER APPROVISIONNEMENT
 * 
 * @author Vazoumana DIARRASSOUBA
 * @version 3.1
 * 
 */
import { Page }    from "@playwright/test"

export class PageAchat {

    
    public readonly selectorAutoComplete     = this.page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur');

    public readonly toggleVueArticle         = this.page.locator('.btn-group > button').nth(0);
    public readonly toggleVueFournisseur     = this.page.locator('.btn-group > button').nth(1);

    public readonly datePickerExpedition     = this.page.locator('#input-date-expedition');

    public readonly listBoxAcheteur          = this.page.locator('#select-acheteur');
    public readonly listBoxAutoCompFourn     = this.selectorAutoComplete;     // Liste de tous les FOURNISSEURS proposée par l'autocomplétion
    public readonly listBoxAutoCompFournItem = this.page.locator('li.gfit-autocomplete-result');
    public readonly listBoxDossierAchat      = this.page.locator('#select-dossier-achat-calendrier');
    public readonly listBoxDossierAchatCal   = this.page.locator('#select-dossier-achat');

    public readonly inputFournisseur         = this.page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur');
    public readonly inputAchete              = this.page.locator('.sous-vue-calendrier input.ng-valid-min:not(.vue-calendrier-estime-input)');
    public readonly inputAAcheter            = this.page.locator('input.ng-valid-min:not([disabled="disabled"])');

    public readonly tdListPlateformes        = this.page.locator('.plateformes td.datagrid-designation');
    public readonly tdListFournisseurs       = this.page.locator('div.fournisseurs-avec-commande td.datagrid-designation');   
    public readonly tdListArticles           = this.page.locator('div.libelle-article');
    public readonly tdListActions            = this.page.locator('td.actiontd');
    public readonly trListActionsSelected    = this.page.locator('tr.selectionne');
    public readonly tdListActionsSelected    = this.page.locator('tr.selectionne td.actiontd');

    public readonly pictoBasculerCrossDock   = this.page.locator('td a.actions i.icon-resize-horizontal');

    public readonly spinnerOn                = this.page.locator('div.progressRingCentre:not(.ng-hide)');
    public readonly imgSpinner               = this.page.locator('.progressRingCentre img');

    public readonly buttonEnregistrer        = this.page.locator('[ng-click="verifierTripletsArticles(creerDonneesAEnregistrerPourVerifierTriplets, plateformeSelectionnee, plateformeSelectionnee, callbackEnregistrerCalendrier)"]');
    public readonly buttonAcheterConfirmer   = this.page.locator('[ng-click="verifierTripletsArticles(recupererDonneesAEnregistrer, plateformeSelectionnee, plateformeSelectionnee, verifierFournisseurEdiPvc)"]');
 
    //-- Popin : Acheter et Confirmer ------------------------------------------------------------------------------
    
    public readonly pPbuttonAcheterConfOk    = this.page.locator('.acheter-et-confirmer .modal-footer button:not(.ng-hide)');

    //-- Popin : Date de récupération des PVC ----------------------------------------------------------------------

    public readonly pBbuttonRecupDlcConf     = this.page.locator('transmission-pvc-modal-wrapper div.p-dialog-footer button:NOT(.p-ripple)');

    //--------------------------------------------------------------------------------------------------------------
    constructor(public readonly page: Page) {}
}