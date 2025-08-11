/**
 * Appli    : QUALITE
 * PAGE     : CONTROLES
 * Onglet   : MAGASINS
 * 
 * 
 * @author SIAKA KONE
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ControlesMagasins {

    public readonly datagridControleMagasin           : Locator; //('div.p-datatable'); //tableau des arrivages 
    public readonly datagridheadMagasin               : Locator; //('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier
    
    public readonly datagridListboxStatut             : Locator; //('#filtre-statut [role="button"]');
    public readonly datagridListboxenseigne           : Locator; //('#filtre-enseigne [role="button"]');
    public readonly datagridListboxRayon              : Locator; //('#filtre-rayon [role="button"]');
    public readonly datagridListboxTypeControle       : Locator; //('#filtre-type-controleArrivage [role="button"]');

    public readonly datagridInputcodelieudeVente      : Locator; //('#filtre-code-lieu-vente');
    public readonly datagridInputDesiglieudeVente     : Locator; //('#filtre-designation-lieu-vente');
    public readonly datagridInputQuestionnaire        : Locator; //('#filtre-questionnaire');

    public readonly datepickerControleMagasin         : Locator; //('p-calendar [type="button"]'); 
    public readonly datepickerContrMoisMagasin        : Locator; //('.p-monthpicker '); 

    public readonly ListboxLieudeVente                : Locator; //('p-multiselect div.p-multiselect-label').nth(0);
    public readonly ListboxTypeControle               : Locator; //('p-multiselect div.p-multiselect-label').nth(1);
    public readonly ListboxQuestionnaire              : Locator; //('p-multiselect div.p-multiselect-label').nth(2);

    public readonly buttonRechercher                  : Locator; //('p-button.btn').nth(0);
    public readonly buttonCreerControle               : Locator; //('div.footerBar> button.sans-icone');
    public readonly buttonReprendreControle           : Locator; //('div.footerBar button>em.fas.fa-forward'); 
    public readonly buttonVisualiserControle          : Locator; //('div.footerBar button>em.fas.fa-eye'); 
    public readonly buttonCorrigerControle            : Locator; //('div.footerBar button>em.fas.fa-pencil-alt'); 
    public readonly buttonImprimerResultat            : Locator; //('div.footerBar button>em.fas.fa-print'); 
    public readonly buttonAnnuler                     : Locator; //('.p-button-text.p-button.p-component.p-ripple');

    public readonly checkBoxControlesMagasin          : Locator; //('.p-datatable-tbody [type="checkbox"]'); //checkbox  masquer les contrôles

    //--Popin: Créer un Contrôle---------------------------------------------------------------------------------------// 
    public readonly pPCecPopinControleEnCours          : Locator; //('.p-dialog-content');
    public readonly pPCecListboxLieudeVente            : Locator; //('.selection-lieu-vente > .ng-untouched > .p-dropdown' );
    public readonly pPCecListboxRayon                  : Locator; //('app-selection-rayon p-dropdown .p-dropdown-trigger');
    public readonly pPCecListboxControleur             : Locator; //('.selection-controleur > .ng-untouched > .p-dropdown');
    public readonly pDropdown                          : Locator; //('.selection-controleur > .ng-untouched > .p-dropdown');
    public readonly pDropdownElement                   : Locator; //('.p-dropdown-panel.p-component.ng-star-inserted > .p-dropdown-items-wrapper ul li');
    public readonly pPCecListboxTypedeControle         : Locator; //('.selection-type-controle-magasin > .ng-untouched > .p-dropdown');
    public readonly pPCecListboxQuestionnaire          : Locator; //('app-selection-questionnaire p-dropdown div.p-dropdown-trigger');

    public readonly pPCecdatepickerControle            : Locator; //('.informations-controle-magasin p-calendar [type="button"]'); 
    
    public readonly pPCecButtonPersPresenteRR          : Locator; //('.personnes-presentes > :nth-child(1) > .p-button');
    public readonly pPCecButtonPersPresenteSecond      : Locator; //('.personnes-presentes > :nth-child(2) > .p-button');
    public readonly pPCecButtonPersPresenteVG          : Locator; //('.personnes-presentes > :nth-child(3) > .p-button');
    public readonly pPCecButtonPersPresenteAutre       : Locator; //('.input-personnes-presentes .ng-star-inserted > .p-button');

    public readonly pPCecButtonEnregister              : Locator; //('[type="submit"] > .p-button-label');
    public readonly pPCecButtonTerminer                : Locator; //('.p-dialog-footer [type="button"]').nth(0);
    public readonly pPCecButtonAnnuler                 : Locator; //('.p-dialog-footer [type="button"]').nth(1);
    public readonly pPCecButtonLoad                    : Locator; //('input[type="file"]');


    /****Onglet: Groupe rubrique************************************************************************************** */
    public readonly pPCecongletgroupeRubrique          : Locator; //('[role="presentation"] .p-tabview-nav-link').nth(0);

    public readonly pPCecButtontyOui                   : Locator; //('.contenu .liste-valeurs [type="button"]');
    public readonly pPCecButtontyNon                   : Locator; //('.contenu .liste-valeurs [type="button"]');
    public readonly pPCecButtontyPacourir              : Locator; //('.photo-bouton > .p-button');

    public readonly pPCecButtonConformeRubrique        : Locator; //('.contenu .liste-valeurs [type="button"]');
    public readonly pPCecButtonacceptableRubrique      : Locator; //('.contenu .liste-valeurs [type="button"]');
    public readonly pPCecButtonNonConformeRubrique     : Locator; //('.contenu .liste-valeurs [type="button"]');
    public readonly pPCecButtonPacourir                : Locator; //('.photo-bouton > .p-button');
    
    public readonly pPCecButtonConforme                : Locator; //('[label="Conforme"] > .p-button');
    public readonly pPCecButtonacceptable              : Locator; //('[label="Acceptable"] > .p-button');
    public readonly pPCecButtonNonConforme             : Locator; //('[label="Non Conforme"] > .p-button');

    /****Onglet: Bilan Contrôle***********************************************************************************************/
    public readonly pPCecongletgroupeBilanControle     : Locator; //('[role="presentation"] .p-tabview-nav-link');

    public readonly pPCecTableResultatControle         : Locator; //('#table-resultat-controle').nth(1);

    public readonly pPCecTextareaCommentaire           : Locator; //('#commentaire-resultat-controle');

    public readonly pPCecButtonConformeBilan           : Locator; //('[label="Conforme"] > .p-button');
    public readonly pPCecButtonAcceptableBilan         : Locator; //('[label="Acceptable"] > .p-button');
    public readonly pPCecButtonNonConformeBilan        : Locator; //('[label="Non Conforme"] > .p-button');
   
    //--Popin: Visualiser  un Contrôle---------------------------------------------------------------------------------------// 

    public readonly pPVcButtonFermer                   : Locator; //('app-footer-controle-magasin > p-button > .p-button-text');

    //--Popin: Corriger un Contrôle-------------------------------------------------------------------------------------------//
   
    public readonly pPCocongletgroupeBilanControle     : Locator; //('#p-tabpanel-0-label > .ng-star-inserted');
    public readonly pPCocButtonCorrigerControle        : Locator; //('.p-dialog-footer .p-button.p-component.ng-star-inserted');

    //------------------------------------------------------------------------------------------------------------------------//

    public readonly pPCeInputRechercheLv               : Locator; //('.p-dropdown-filter-container .p-dropdown-filter');
    public readonly pPCeListeBoxLv                     : Locator; //('p-dropdownitem li');
    public readonly pPCeListeBoxControleur             : Locator; //('.controleur-item');
    public readonly pPCeListeBoxTypeControle           : Locator; //('.p-dropdown-item.p-ripple');

    public readonly listBoxDropDownItemQuestionnaire   : Locator;
    public readonly listeBoxDropdownItem               : Locator;


    constructor(page: Page) {

        this.datagridControleMagasin            = page.locator('div.p-datatable'); //tableau des arrivages 
        this.datagridheadMagasin                = page.locator('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier
        
        this.datagridListboxStatut              = page.locator('#filtre-statut [role="button"]');
        this.datagridListboxenseigne            = page.locator('#filtre-enseigne [role="button"]');
        this.datagridListboxRayon               = page.locator('#filtre-rayon [role="button"]');
        this.datagridListboxTypeControle        = page.locator('#filtre-type-controleArrivage [role="button"]');

        this.datagridInputcodelieudeVente       = page.locator('#filtre-code-lieu-vente');
        this.datagridInputDesiglieudeVente      = page.locator('#filtre-designation-lieu-vente');
        this.datagridInputQuestionnaire         = page.locator('#filtre-questionnaire input');//('#filtre-questionnaire');

        this.datepickerControleMagasin          = page.locator('p-calendar [type="button"]'); 
        this.datepickerContrMoisMagasin         = page.locator('.p-monthpicker '); 

        this.ListboxLieudeVente                 = page.locator('p-multiselect div.p-multiselect-label').nth(0);
        this.ListboxTypeControle                = page.locator('p-multiselect div.p-multiselect-label').nth(1);
        this.ListboxQuestionnaire               = page.locator('p-multiselect div.p-multiselect-label').nth(2);

        this.buttonRechercher                   = page.locator('p-button.btn').nth(0);
        this.buttonCreerControle                = page.locator('div.footerBar button').nth(0);
        this.buttonReprendreControle            = page.locator('div.footerBar button>em.fas.fa-forward'); 
        this.buttonVisualiserControle           = page.locator('div.footerBar button>em.fas.fa-eye'); 
        this.buttonCorrigerControle             = page.locator('div.footerBar button>em.fas.fa-pencil-alt'); 
        this.buttonImprimerResultat             = page.locator('div.footerBar button>em.fas.fa-print'); 
        this.buttonAnnuler                      = page.locator('.p-button-text.p-button.p-component.p-ripple');

        this.checkBoxControlesMagasin           = page.locator('.p-datatable-tbody .p-checkbox-box'); 

        //--Popin: Créer un Contrôle---------------------------------------------------------------------------------------// 
        this.pPCecPopinControleEnCours          = page.locator('.p-dialog-content');
        this.pPCecListboxLieudeVente            = page.locator('.selection-lieu-vente > .ng-untouched > .p-dropdown' );
        this.pPCecListboxRayon                  = page.locator('app-selection-rayon p-dropdown .p-dropdown-trigger');
        this.pPCecListboxControleur             = page.locator('.selection-controleur > .ng-untouched > .p-dropdown');
        this.pDropdown                          = page.locator('.p-element .p-dropdown-label ').nth(8);
        this.pDropdownElement                   = page.locator('.p-dropdown-panel.p-component.ng-star-inserted > .p-dropdown-items-wrapper ul li').nth(0);
        this.pPCecListboxTypedeControle         = page.locator('.selection-type-controle-magasin > .ng-untouched > .p-dropdown');
        this.pPCecListboxQuestionnaire          = page.locator('app-selection-questionnaire p-dropdown div.p-dropdown-trigger');

        this.pPCecdatepickerControle            = page.locator('.informations-controle-magasin p-calendar [type="button"]'); 
        
        this.pPCecButtonPersPresenteRR          = page.locator('.personnes-presentes > :nth-child(1) > .p-button');
        this.pPCecButtonPersPresenteSecond      = page.locator('.personnes-presentes > :nth-child(2) > .p-button');
        this.pPCecButtonPersPresenteVG          = page.locator('.personnes-presentes > :nth-child(3) > .p-button');
        this.pPCecButtonPersPresenteAutre       = page.locator('.input-personnes-presentes .ng-star-inserted > .p-button');

        this.pPCecButtonEnregister              = page.locator('[type="submit"] > .p-button-label');
        this.pPCecButtonTerminer                = page.locator('.p-dialog-footer [type="button"]').nth(0);
        this.pPCecButtonAnnuler                 = page.locator('.p-dialog-footer [type="button"]').nth(1);
        this.pPCecButtonLoad                    = page.locator('input[type="file"]');


        /****Onglet: Groupe rubrique************************************************************************************** */
        this.pPCecongletgroupeRubrique          = page.locator('[role="presentation"] .p-tabview-nav-link').nth(0);

        this.pPCecButtontyOui                   = page.locator('.contenu .liste-valeurs [type="button"]');
        this.pPCecButtontyNon                   = page.locator('.contenu .liste-valeurs [type="button"]');
        this.pPCecButtontyPacourir              = page.locator('.photo-bouton > .p-button');

        this.pPCecButtonConformeRubrique        = page.locator('.contenu .liste-valeurs [type="button"]');
        this.pPCecButtonacceptableRubrique      = page.locator('.contenu .liste-valeurs [type="button"]');
        this.pPCecButtonNonConformeRubrique     = page.locator('.contenu .liste-valeurs [type="button"]');
        this.pPCecButtonPacourir                = page.locator('.photo-bouton > .p-button');
        
        this.pPCecButtonConforme                = page.locator('[label="Conforme"] > .p-button');
        this.pPCecButtonacceptable              = page.locator('[label="Acceptable"] > .p-button');
        this.pPCecButtonNonConforme             = page.locator('[label="Non Conforme"] > .p-button');

        /****Onglet: Bilan Contrôle***********************************************************************************************/
        this.pPCecongletgroupeBilanControle     = page.locator('[role="presentation"] .p-tabview-nav-link');

        this.pPCecTableResultatControle         = page.locator('#table-resultat-controle').nth(1);

        this.pPCecTextareaCommentaire           = page.locator('#commentaire-resultat-controle');

        this.pPCecButtonConformeBilan           = page.locator('[label="Conforme"] > .p-button');
        this.pPCecButtonAcceptableBilan         = page.locator('[label="Acceptable"] > .p-button');
        this.pPCecButtonNonConformeBilan        = page.locator('[label="Non Conforme"] > .p-button');
    
        //--Popin: Visualiser  un Contrôle---------------------------------------------------------------------------------------// 

        this.pPVcButtonFermer                   = page.locator('app-footer-controle-magasin > p-button > .p-button-text');

        //--Popin: Corriger un Contrôle-------------------------------------------------------------------------------------------//
    
        this.pPCocongletgroupeBilanControle     = page.locator('.p-tabview-nav-content .ng-star-inserted .p-element').nth(1);
        this.pPCocButtonCorrigerControle        = page.locator('.p-dialog-footer .p-button.p-component.ng-star-inserted');

        //------------------------------------------------------------------------------------------------------------------------//

        this.pPCeInputRechercheLv               = page.locator('.p-dropdown-filter-container .p-dropdown-filter');
        this.pPCeListeBoxLv                     = page.locator('p-dropdownitem li');
        this.pPCeListeBoxControleur             = page.locator('.controleur-item');
        this.pPCeListeBoxTypeControle           = page.locator('.p-dropdown-item.p-ripple');

        this.listBoxDropDownItemQuestionnaire   = page.locator('p-dropdownitem li .questionnaire-item');
        this.listeBoxDropdownItem               = page.locator('p-dropdownitem li span');
    
    }

}

