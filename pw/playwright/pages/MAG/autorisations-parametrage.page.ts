/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : PARAMETRAGE
 * 
 * @author JOSIAS SIE
 * @version 3.10
 * 
 */
import { Locator, Page} from '@playwright/test';

export class AutorisationsParametrage {

    public readonly popinConfirmerSuppression  = this.page.locator('.modal-confirmation .modal-footer button:NOT(.ng-hide)');

    public readonly modalBackDrop              = this.page.locator('.modal-backdrop');

    public readonly inputFieldFilter           = this.page.locator('.input-assortiment > input');
    public readonly inputDesignation           = this.page.locator('#input-designation');
    public readonly inputHeureDebut            = this.page.locator('input[formcontrolname="heures"]').nth(0);
    public readonly inputHeureDebutOpport      = this.page.locator('input.time-picker-hh');
    public readonly inputMinuteDebut           = this.page.locator('input[formcontrolname="minutes"]').nth(0);
    public readonly inputMinuteDebutOpport     = this.page.locator('input.time-picker-mm');
    public readonly inputHeureFin              = this.page.locator('input[formcontrolname="heures"]').nth(1);
    public readonly inputMinuteFin             = this.page.locator('input[formcontrolname="minutes"]').nth(1);    
    
    public readonly checkBoxFirstAssort        = this.page.locator('.dg-assortiment th input');
    public readonly checkBoxListeAssortiments2 = this.page.locator('.dg-assortiment td input')
    public readonly checkBoxListeAssortiments  = this.page.locator('.parametrage td input');
    public readonly checkBoxMasquerActif       = this.page.locator('#toggle-actif');    
    public readonly checkBoxListeCommandes     = this.page.locator('.groupes-commandes input');
    public readonly checkBoxCommandesFermes    = this.page.locator('#engagement-commandes-fermes');
    public readonly checkBoxPourcentageRepart  = this.page.locator('#engagement-repartition-commande');
    public readonly checkBoxSaisieObligatoire  = this.page.locator('#input-saisie-obligatoire');

    public readonly checkBoxBloquerModifPourcen= this.page.locator('#engagement-blocage-modification-repartition');
    public readonly checkBoxBloquerModifManuel = this.page.locator('#engagement-blocage-modification-quantite');

    public readonly pCalendarPeriode           = this.page.locator('#periode');

    public readonly checkBoxEngPrioSurCmd      = this.page.locator('#engagement_prioritaire');  
    public readonly checkBoxTypeLabel          = this.page.locator('[ng-repeat="type in typesAssortiments"]')  

    public readonly tdLibelleGrpCommande       = this.page.locator('.groupes-commandes .datagrid-nom');
    public readonly tdActionsGrpCommande       = this.page.locator('.groupes-commandes .contAction');
    public readonly tdLibelleAssortiment       = this.page.locator('td.datagrid-designation');

    public readonly listBoxTypeAssortiment     = this.page.locator('select[ng-model="filtre.type"]');
    public readonly listBoxOrigine             = this.page.locator('#input-groupe').nth(0);
    public readonly listBoxGroupeArticle       = this.page.locator('#input-groupe-article-modele');    
    public readonly inputType                  = this.page.locator('input[name="typeAssortiment"]');
    public readonly selectTypeOpportunite      = this.page.locator('#input-type'); 

    public readonly buttonEnregistrer          = this.page.locator('[ng-click="enregistrer(assortiment)"]');
    public readonly buttonCreerAssort          = this.page.locator('[ng-click="nouvelAssortiment()"]');
    public readonly buttonSupprimerAssort      = this.page.locator('[ng-click="confirmerSuppressionAssortiment(assortiment)"]');
    public readonly buttonCreerGrpCmd          = this.page.locator('[ng-click="creerGroupeCommande(assortiment)"]');
    public readonly buttonAjoutFraisDePort     = this.page.locator('[ng-click="openPopupFraisPort(assortiment)"]');
    public readonly buttonParamCom             = this.page.locator('[ng-click="openPopupParametrageMailCommunication()"]');
    public readonly onglets                    = this.page.locator('.nav-tabs > li > a');
    public readonly ongletParametrage          = this.onglets.nth(3);

    public readonly dataGridListTdDesignation  = this.page.locator('table tbody > tr > td ');  

    public readonly dataGridListeAssort        = this.page.locator('.span3 div.datagrid-table-wrapper > table > thead > tr > th');     

    public readonly dataGridListGrpCmd         = this.page.locator('div.groupes-commandes table.table-striped > tbody > tr');

    public readonly pictoModifier              = this.page.locator('.icon-pencil');
    public readonly pictoGrpCmdRemove          = this.page.locator('.groupes-commandes .actiontd .icon-remove');

    public readonly radioTypeEng               = this.page.locator('typeAssortiment');
    public readonly radioButtonachatCentrale   = this.page.locator('.type-assortiment input').nth(0);
    public readonly radioButtonEngagement      = this.page.locator('.type-assortiment input').nth(2);

    public readonly labelTypeEngagement        = this.page.locator('.type-assortiment label');    
    
    public readonly datePickerDebutEng         = this.page.locator('p-calendar[name="date-debut-commande"]');
    public readonly datePickerFinEng           = this.page.locator('p-calendar[name="date-fin-commande"]');   
    public readonly datePickerOppFinSaisie     = this.page.locator('.fin-de-saisie-opportunite .datepicker-wrapper input');
    public readonly datePickerFinSaisieIcon    = this.page.locator('.champs-informations-opportunite .datepicker-wrapper i.icon-calendar')    
    public readonly datePickerOppExpedition    = this.page.locator('.date-expedition-opportunite .datepicker-wrapper input');  
    public readonly datePickerExpeditionIcon   = this.page.locator('.champs-informations-opportunite .datepicker-wrapper i.icon-calendar')   

    public readonly datePickerDay              = this.page.locator('table.p-datepicker-calendar td:NOT(.p-datepicker-other-month):NOT(.p-datepicker-weeknumber)');
    public readonly datePickerSemaine          = this.page.locator('table.p-datepicker-calendar');
    public readonly datePickerDaySpan          = this.page.locator('table.p-datepicker-calendar .p-datepicker-today span');
    public readonly datePickerNext             = this.page.locator('button.p-datepicker-next');

    public readonly buttonAjouterExpedition    = this.page.locator('button.btn-ajout-expedition');
    public readonly inputDateExpedition        = this.page.locator('input[formcontrolname="pourcentageRepartition"]');

    public readonly datePickerToday            = this.page.locator('td.ui-datepicker-today');
    public readonly datePickerTodayOpport      = this.page.locator('td.today');
    public readonly datePickerActiveDay        = this.page.locator('.datepicker-days td:NOT(.old ):NOT(.new)')

    public readonly columnActionsGrpCmd        = this.page.locator('.groupes-commandes .actiontd');

    public readonly spinner                    = this.page.locator('div.progressRingCentre:NOT(.ng-hide)');

    public readonly divFeedbackInfo            = this.page.locator('.parametrage div.feedback-info');

    //--POPIN : Modification / Création d'un groupe de commande ------------------------------------------------------------------    
    public readonly pInputNom                  = this.page.locator('#nom-groupe-commande');

    public readonly pDatePickerHeureDebut      = this.page.locator('input[formcontrolname="heures"]').nth(0);
    public readonly pDatePickerMinuteDebut     = this.page.locator('input[formcontrolname="minutes"]').nth(0);
    public readonly pDatePickerHeureFin        = this.page.locator('input[formcontrolname="heures"]').nth(1);
    public readonly pDatePickerMinuteFin       = this.page.locator('input[formcontrolname="minutes"]').nth(1);    

    public readonly pCheckBoxAllMagasin        = this.page.locator('.liste-magasin th input');
    public readonly pCheckBoxAllSelectMag      = this.page.locator('.p-datatable-thead p-checkbox');

    public readonly pPcheckBoxEnrFilter         = this.page.locator('p-multiselectitem li div.p-checkbox-box');
    public readonly pPcheckBoxEnrAllMag         = this.page.locator('thead p-checkbox');


    public readonly pButtonEnregistrer         = this.page.locator('p-footer button');

    public readonly pListBoxExpedition         = this.page.locator('p-dropdown[formcontrolname="journeeExpedition"]');
    public readonly pPlistBoxDesignation       = this.page.locator('table-magasins table thead tr:nth-child(2) th:nth-child(3) div.p-multiselect');

    public readonly pListeChoix                = this.page.locator('p-dropdownitem li span');
    public readonly pPdropdownitemJourSemaine  = this.page.locator('p-dropdownitem li');

    public readonly pPalerteTop                = this.page.locator('alert.alerte.alerte-top');
    public readonly pPalerteIncoherenceDate    = this.page.locator('.p-element.ng-trigger');
    public readonly pPalertButtonIncoConfirmer = this.page.locator('.p-element.ng-trigger  button.p-element.p-button.p-component').nth(1);
    public readonly pPalertConditionMessageOui = this.page.locator('div.confirmation-minmaxmultiple.ng-star-inserted .alert.alert-warning a ').nth(0);
    public readonly pPalertConditionMessageNon = this.page.locator('div.confirmation-minmaxmultiple.ng-star-inserted .alert.alert-warning a ').nth(1);
    //-- POPIN : Confirmer la suppression ----------------------------------------------------------------------------------------    
    public readonly pPictoClose                = this.page.locator('.modal-header .close').nth(0);

    public readonly pButtonOui                 = this.page.locator('div.modal.hide.in > div.modal-footer > button.btn.btn-primary.modal-btn-primary');
    public readonly pButtonNon                 = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    //-- POPIN : Ajout des frais de port -----------------------------------------------------------------------------------------
    public readonly pPradioFdpQuantitePoids    = this.page.locator('[ng-model="qtePoids"]');
    public readonly pPradioFdpQuantiteColis    = this.page.locator('[ng-model="qteColis"]');
    public readonly pPradioFdpFixe             = this.page.locator('[ng-model="fixe"]');
    public readonly pPradioFdpTranche          = this.page.locator('[ng-model="qteTranche"]');
    public readonly pPpictoEnrClose            = this.page.locator('svg.p-multiselect-close-icon');
    public readonly pPinputEnrFilter           = this.page.locator('div.p-multiselect-filter-container input');
    public readonly pPinputDesignation         = this.page.locator('input.p-multiselect-filter')
    public readonly pPinputFdpQuantitePoidsPrix= this.page.locator('input[ng-model="fraisPort.montantQtePoids"]');
    public readonly pPinputFdpQuantitePoidsQte = this.page.locator('input[ng-model="fraisPort.quantitePoids"]');
    public readonly pPinputFdpQuantiteColisPrix= this.page.locator('input[ng-model="fraisPort.montantQteColis"]');
    public readonly pPinputFdpQuantiteColisQte = this.page.locator('input[ng-model="fraisPort.quantiteColis"]');
    public readonly pPinputFdpFixePrix         = this.page.locator('input[ng-model="fraisPort.montantFixe"]');
    public readonly pPinputFdpTrancheUne       = this.page.locator('input[ng-model="tranche.montant"]');
    public readonly pPinputFdpTrancheHt        = this.page.locator('input[ng-model="tranche.seuil"]');
    public readonly pMutipleSelection          = this.page.locator('p-multiselectitem span:NOT(.p-checkbox-icon)')

    public readonly pPdataGridDesignation       = this.page.locator('.container-magasins-dg .p-datatable-wrapper > table > tbody > tr > td:nth-child(3)');
    public readonly pPdataGridFdp              = this.page.locator('.liste-magasin th');

    public readonly pPcheckBoxFdpListeMagasins = this.page.locator('.liste-magasin td input');

    public readonly pPbuttonFdpEnregistrer     = this.page.locator('.popup-frais-port .modal-footer button');

    public readonly pPlinkFdpFermer            = this.page.locator('.popup-frais-port .modal-footer a');
    public readonly pTdDesignationMag          = this.page.locator('#magasins-dg table .multi-select-full-width .p-multiselect');	
    public readonly pIconspinner               = this.page.locator('.modal-confirmation .modal-footer .timer');

    // --POPIN : Paramétrage de la communication
    public readonly buttonFermer               = this.page.locator('button.p-dialog-header-close');
    public readonly selectGroupeArticle        = this.page.locator('p-dropdown[name="groupeArticle"]');
    public readonly radioManuel                = this.page.locator('.p-radiobutton-box').nth(0);
    public readonly radioAutomatique           = this.page.locator('.p-radiobutton-box').nth(1);
    public readonly inputAutHH                 = this.page.locator('#saisie-heure-envoie-mail-auto .champs-saisie-heure input').nth(0);
    public readonly inputAutMM                 = this.page.locator('#saisie-heure-envoie-mail-auto .champs-saisie-heure input').nth(1);
    public readonly inputHeureEnvoiActHH       = this.page.locator('#saisie-heure-envoie-mail-actualites-auto .champs-saisie-heure input').nth(0);
    public readonly inputHeureEnvoiActMM       = this.page.locator('#saisie-heure-envoie-mail-actualites-auto .champs-saisie-heure input').nth(1);
    public readonly selectEnseigne             = this.page.locator('p-dropdown[name="enseigne"]');
    public readonly inputEmail                 = this.page.locator('form.form-creation .input-creation-mail input');
    public readonly buttonAjouter              = this.page.locator('form.form-creation .bouton-creation-mail button');
    public readonly dataGridMail               = this.page.locator('table.p-datatable-table thead tr:nth-child(1) th');
    public readonly buttonParamEnregistrer     = this.page.locator('p-footer button');
    public readonly buttonParamAnnuler         = this.page.locator('p-footer a');
    
    constructor(public readonly page: Page) {};

    public choixJour (sJour:string):Locator{
        return this.page.locator('li[aria-label="' + sJour + '"]');
    }

}