/**
 * Appli    : QUALITE
 * PAGE     : CONTROLES
 * Onglet   : ARRIVAGES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ControlesArrivages {

    public readonly checkBoxMasquerControles        : Locator;
      
    public readonly checkBoxCocherUnArrivage        : Locator; //('tr:nth-child(2) > td:nth-child(1) p-tablecheckbox > div');
    public readonly checkBoxCocherUnArrivage0       : Locator; //('tr:nth-child(1) > td:nth-child(1) p-tablecheckbox > div');

    public readonly datagridArrivages               : Locator; //('p-table .p-datatable-scrollable-wrapper'); //tableau des arrivages 
    public readonly datagridheadArrivages           : Locator; //('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier
    public readonly datagridheadGencode             : Locator; //('#header-gencod-article p-sorticon'); // les entêtes du tableau des arrivages à vérifier
    public readonly datagridArrivageStatut          : Locator; //('div.p-datatable #header-statut'); //La colonne statut pour les arrivages à gérer avec la position
    public readonly dataTableArrivages              : Locator; //('.p-datatable-scrollable-body.ng-star-inserted td');
    public readonly datagridArrivagecodeArticle     : Locator; //('#filtre-code-article [type="text"]');

    public readonly listBoxRayon                    : Locator; //('app-selection-rayon [role="button"]');
    public readonly listBoxPlateforme               : Locator; //('#plateforme [role="button"]');

    public readonly datagridArrivagecheckBoxRecep   : Locator; //('p-tristatecheckbox .p-checkbox-box');

    public readonly datagridlistBoxPlanifie         : Locator; //('#filtre-planifie [role="button"]'); 
    public readonly datagridlistBoxStatut           : Locator; //('#filtre-status [role="button"]'); 
    public readonly datagridlistBoxReception        : Locator; //('p-columnfilter[field="receptionne"]'); // ('#filtre-receptionne [role="button"]')
    public readonly datagridlistBoxResultatControle : Locator; //('#filtre-resultat-control [role="button"]'); 

    public readonly dropdownStatutAttente           : Locator; //('p-dropdownitem [aria-label="En attente de validation"]');
    public readonly dropdownStatutEncours           : Locator; //('p-dropdownitem [aria-label="En cours"]');
    public readonly dropdownStatutTermine           : Locator; //('p-dropdownitem [aria-label="Terminé"]');

    public readonly inputFiltreNumeroLot            : Locator; //('#filtre-numero-lot'); 
    public readonly inputFiltreGencod               : Locator; //('th#filtre-gencod input');
    public readonly inputFiltreCodeArticle          : Locator; //('#filtre-code-article > .table-filtre');
    public readonly inputFiltreDesignation          : Locator; //('#filtre-designation-article');
    public readonly inputFiltreFournisseur          : Locator; //('#filtre-fournisseur');
    public readonly inputFiltreAcheteur             : Locator; //('#filtre-acheteur'); 
    public readonly inputFiltreEmplacementPalette   : Locator; //('#filtre-palette');  

    public readonly datepickerArrivages             : Locator; //('.p-datepicker-trigger'); 

    public readonly buttonPlusUVC                   : Locator; //('.p-inputnumber-button-up .pi-angle-up');
    public readonly buttonMoinsUVC                  : Locator; //('.p-inputnumber-button-down .pi-angle-down');
    public readonly buttonDemarrerControle          : Locator; //('.footerBar > button > em.fas.fa-play');
    public readonly buttonReprendreControle         : Locator; //('.footerBar > button > em.fas.fa-forward'); 
    public readonly buttonVisualiserControle        : Locator; //('.footerBar > button > em.fas.fa-eye'); 
    public readonly buttonImprimerResultat          : Locator; //('.footerBar > button > em.fas.fa-print'); 
    public readonly buttonCorrigerControle          : Locator; //('.footerBar button > em.fas.fa-pencil-alt'); 
    public readonly buttonExporter                  : Locator; //('.footerBar > button.sans-icone'); 
    public readonly buttonArrivage                  : Locator; //('p-calendar button.p-datepicker-trigger'); 
    public readonly buttonMoisPrecedent             : Locator;

    public readonly datepickerArrivageDebut         : Locator; //('.p-datepicker-calendar td');
    public readonly datepickerArrivageToday         : Locator; //('.p-datepicker-calendar .p-datepicker-today span'); 

    //-- POPIN : CONTROLE EN COURS --------------------------------------------------------------------------------------//
    public readonly pPCecPopinControleEnCours       : Locator; //('.p-dialog-content');
    public readonly pPCecLabelArticle               : Locator; //('#article');
    public readonly pPCecLabelFournisseur           : Locator; //('#fournisseur');
    public readonly pPCecLabelNumLot                : Locator; //('#numero-lot');
    public readonly pPCecLabelDateReception         : Locator; //('#date-de-reception');
    public readonly pPCecLabelNomControleur         : Locator; //('.label-nom-controlleur');
    public readonly pPCecLabelBilanDuControle       : Locator; //('.label-titre-bilan-controle');

    public readonly pPCecListboxQuestionnaire       : Locator; //('div.input-questionnaire [role="button"]');
    public readonly pPCecSelectPalettes             : Locator; //('div.input-numero-palette .p-multiselect-trigger' );
    public readonly pPCecListeQuestionnaire         : Locator; //('ul li .questionnaire-item');

    public readonly pPCecCheckBoxNumeroPalette      : Locator; //('.p-multiselect-header .p-checkbox-box');
    public readonly pPCecIconClosePalette           : Locator; //('.p-multiselect-close-icon');

    public readonly pPCecInputNumeroPalette         : Locator; //('.input-numero-palette');
    public readonly pPCecInputQuestionnaire         : Locator; //('.input-questionnaire');
    public readonly pPCecInputNumlotFournisseur     : Locator; //('.p-chips > .p-inputtext');   
    public readonly pPCecButtonUpNbreUVC            : Locator; 
    public readonly pPCecButtonDownNbreUVC          : Locator; 

    public readonly pPCecDatepickerDLC              : Locator; //('.input-dlc [type="button"]');
    public readonly pPCecDatepickerDay              : Locator; //('.p-datepicker-group tbody td span:NOT(.p-disabled)');

    public readonly pPCecButtonCahierDesCharges     : Locator; //('.cahier_charge button> .fas.fa-eye');
    
    public readonly pPCecButtonDemanderValidation   : Locator; //('app-footer > button');   
    public readonly pPCecButtonCorrigerControle     : Locator; //('body  p-footer > app-footer > button');
    public readonly pPCecButtonEnregistrer          : Locator; //('app-footer > button');  
    public readonly pPCecButtonTerminer             : Locator; //('app-footer > button');  
    public readonly pPCecButtonAnnuler              : Locator; //('.p-dialog-footer button.p-button-text');
    public readonly pPCecButtonFermer               : Locator; //('p-footer > app-footer > p-button > button > span');
    public readonly pPCecButtonLoad                 : Locator; //('input[type="file"]');

    //-- Onglet:Détail ----------------------------------------------------------------------------------------//

    public readonly pPOngletDetail                  : Locator; //('#p-tabpanel-1-label > .ng-star-inserted');

    //****les Boutons du panel Emballage******//

    public readonly pPCecDetailButtonConformepcbEmb     : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformepcbEmb  : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs');

    public readonly pPCecDetailButtonConformeEmb        : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableEmb      : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeEmb     : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    
    public readonly pPCecDetailButtonConformeEmbl       : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableEmbl     : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeEmbl    : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
    
    public readonly pPCecDetailButtonParcourirpcbEmb    : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    public readonly pPCecDetailButtonParcourirEmb       : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    public readonly pPCecDetailButtonParcourirEmbl      : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    public readonly pPCecDetailButtonCommentaire        : Locator; //('div.critere-detail .commentaire button');
    public readonly pPCecDetailInputCommentaire         : Locator; //('div.critere-detail .commentaire input[type="text"]');
    public readonly pPInputCommentaire                  : Locator; //('.input-commentaire');
    public readonly pPCecDetailInputListeValeur         : Locator; //('app-critere-intervalle .p-inputtext');

    //****les Boutons du panel Etiquetage******//

    public readonly pPCecDetailButtonConformeCharteEtiq       : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformeCharteEtiq    : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonParcourirCharteEtiq      : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeAllerEtiq        : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformeAllerEtiq     : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonApplicableAllerEtiq   : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirAllerEtiq       : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeUvcEtiq          : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformeUvcEtiq       : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonParcourirUvcEtiq         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeGencEtiq         : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableGencEtiq       : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeGencEtiq      : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirGenEtiq         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
        
    public readonly pPCecDetailButtonConformeLegEtiq          : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformeLegEtiq       : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonApplicableLegEtiq     : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirLegEtiq         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //******les Boutons du panel Traçabilité******//
   
    public readonly pPCecDetailButtonConformeTraUvc          : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformeTraUvc       : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonApplicableTraUvc     : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirTraUvc         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeTraDlc          : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableTraDlc        : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeTraDlc       : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirTraDlc         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //******les Boutons du panel Contrôle Poids******//
    public readonly pPCecDetailButtonConformePoidsRapide     : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformePoidsRapide  : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonApplicablePoidsRapide: Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirPoidsRapide    : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformePoidsComp       : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonNonConformePoidsComp    : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonParcourirPoidsComp      : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    public readonly pPCecDetailButtonConformite              : Locator; //('.liste-valeurs .p-button-label');
   
   
    //******les Boutons du panel Visuel******//

    public readonly pPCecDetailButtonConformeVisExt          : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableVisExt        : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeVisExt       : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirVisExt         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeVisInt          : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableVisInt        : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeVisInt       : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonNonApplicableVisInt     : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
    public readonly pPCecDetailButtonParcourirVisInt         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailNonApplicable                 : Locator; //('.contenu .p-button.p-component.p-ripple ');

    //******les Boutons du panel Odeur******//

    public readonly pPCecDetailButtonConformeOdeur           : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableOdeur         : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeOdeur        : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonParcourirOdeur          : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //******les Boutons du panel Texture******//

    public readonly pPCecDetailButtonConformeTexture         : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableTexture       : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeTexture      : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonNonApplicableTexture    : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
    public readonly pPCecDetailButtonParcourirTexture        : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //****les Boutons du panel Goût******//

    public readonly pPCecDetailButtonConformeGoutArome           : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableGoutArome         : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeGoutArome        : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonNonApplicableGoutArome      : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
    public readonly pPCecDetailButtonParcourirGoutArome          : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPCecDetailButtonConformeGoutSaveur          : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableGoutSaveur        : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeGoutSaveur       : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonNonApplicableGoutSaveur     : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
    public readonly pPCecDetailButtonParcourirGoutSaveur         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    public readonly pPCecDetailButtonConformeTrigeminale         : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
    public readonly pPCecDetailButtonAcceptableTrigeminale       : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
    public readonly pPCecDetailButtonNonConformeTrigeminale      : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
    public readonly pPCecDetailButtonNonApplicableTrigeminale    : Locator; //('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(3);
    public readonly pPCecDetailButtonParcourirTrigeminale        : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    //******les Boutons du panel Bilan******//

    public readonly pPCecDetailButtonConformeBilan               : Locator; //('[label="Conforme"] > .p-button');
    public readonly pPCecDetailButtonAcceptableBilan             : Locator; //('[label="Acceptable"] > .p-button');
    public readonly pPCecDetailButtonNonConformeBilan            : Locator; //('[label="Non Conforme"] > .p-button');
    
    //-Onglet :Bilan Contrôle ----------------------------------------------------------------------------------------------------------//

    public readonly pPOngletBilanControle                        : Locator;

    public readonly pPCecButtonConforme                          : Locator; //('.resultat-filtre button');
    public readonly pPCecButtonAcceptable                        : Locator; //('.resultat-filtre button');
    public readonly pPCecButtonNonConforme                       : Locator; //('.resultat-filtre button');
    public readonly pPCecButtonValeurCritere                     : Locator; //('.liste-valeurs span.p-button-label'); 
    public readonly pPCecButtonParcourir                         : Locator; //('.photo-selection button'); 
    public readonly pPCecButtonOui                               : Locator; //('.bouton-resultat-controle :nth-child(1) > .p-button');
    public readonly pPCecButtonNon                               : Locator; //('.bouton-resultat-controle :nth-child(2) > .p-button');

    public readonly pPCecTableResultats                          : Locator; //('.resultat-tableau');
      
    public readonly pPCecTextareaCommentaire                     : Locator; //('#commentaire-resultat-controle');

    //-- POPIN : REPRENDRE UN CONTROLE -------------------------------------------------------------------------
    
    public readonly pPCecButtonSuppNumlotFour                    : Locator; //('li.p-chips-token.ng-star-inserted .p-chips-token-icon');

    //-----------------------------------------------------------------------------------------------------------
    public readonly dropdownQuestionnaire                        : Locator; //('.input-questionnaire > .ng-valid > .p-dropdown > .p-dropdown-label');
    public readonly dropdownItemQuestionnaire                    : Locator; //(':nth-child(1) > .p-dropdown-item');


    constructor(page: Page) {

        this.checkBoxMasquerControles          = page.locator('div.filtre-controle-planifie div.p-checkbox-box');
      
        this.checkBoxCocherUnArrivage0         = page.locator('tr:nth-child(1) > td:nth-child(1) p-tablecheckbox > div');
        this.checkBoxCocherUnArrivage          = page.locator('tr:nth-child(2) > td:nth-child(1) p-tablecheckbox > div');
    
        this.datagridArrivages                 = page.locator('p-table .p-datatable-scrollable-wrapper'); //tableau des arrivages 
        this.datagridheadArrivages             = page.locator('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier
        this.datagridheadGencode               = page.locator('#header-gencod-article p-sorticon'); // les entêtes du tableau des arrivages à vérifier
        this.datagridArrivageStatut            = page.locator('div.p-datatable #header-statut'); //La colonne statut pour les arrivages à gérer avec la position
        this.dataTableArrivages                = page.locator('.p-datatable-scrollable-body.ng-star-inserted td');
        this.datagridArrivagecodeArticle       = page.locator('#filtre-code-article [type="text"]');
    
        this.listBoxRayon                      = page.locator('app-selection-rayon [role="button"]');
        this.listBoxPlateforme                 = page.locator('#plateforme [role="button"]');
    
        this.datagridArrivagecheckBoxRecep     = page.locator('p-tristatecheckbox .p-checkbox-box');
    
        this.datagridlistBoxPlanifie           = page.locator('#filtre-planifie'); 
        this.datagridlistBoxStatut             = page.locator('#filtre-status [role="button"]'); 
        this.datagridlistBoxReception          = page.locator('p-columnfilter[field="receptionne"]'); // ('#filtre-receptionne [role="button"]')
        this.datagridlistBoxResultatControle   = page.locator('#filtre-resultat-control [role="button"]'); 
    
        this.dropdownStatutAttente             = page.locator('p-dropdownitem [aria-label="En attente de validation"]');
        this.dropdownStatutEncours             = page.locator('p-dropdownitem [aria-label="En cours"]');
        this.dropdownStatutTermine             = page.locator('p-dropdownitem [aria-label="Terminé"]');
    
        this.inputFiltreNumeroLot             = page.locator('#filtre-numero-lot'); 
        this.inputFiltreGencod                = page.locator('th#filtre-gencod input');
        this.inputFiltreCodeArticle           = page.locator('#filtre-code-article > .table-filtre');
        this.inputFiltreDesignation           = page.locator('#filtre-designation-article');
        this.inputFiltreFournisseur           = page.locator('#filtre-fournisseur');
        this.inputFiltreAcheteur              = page.locator('#filtre-acheteur'); 
        this.inputFiltreEmplacementPalette    = page.locator('#filtre-palette');  
    
        this.datepickerArrivages              = page.locator('.p-datepicker-trigger'); 
    
        this.buttonPlusUVC                    = page.locator('.p-inputnumber-button-up .pi-angle-up');
        this.buttonMoinsUVC                   = page.locator('.p-inputnumber-button-down .pi-angle-down');
        this.buttonDemarrerControle           = page.locator('.footerBar > button > em.fas.fa-play');
        this.buttonReprendreControle          = page.locator('.footerBar > button > em.fas.fa-forward'); 
        this.buttonVisualiserControle         = page.locator('.footerBar > button > em.fas.fa-eye'); 
        this.buttonImprimerResultat           = page.locator('.footerBar > button > em.fas.fa-print'); 
        this.buttonCorrigerControle           = page.locator('.footerBar button > em.fas.fa-pencil-alt'); 
        this.buttonExporter                   = page.locator('.footerBar button').nth(5); 
        this.buttonArrivage                   = page.locator('p-calendar button.p-datepicker-trigger'); 
        this.buttonMoisPrecedent              = page.locator('chevronlefticon');

        this.datepickerArrivageDebut          = page.locator('.p-datepicker-calendar td');
        this.datepickerArrivageToday          = page.locator('.p-datepicker-calendar .p-datepicker-today span'); 
    
        //-- POPIN : CONTROLE EN COURS --------------------------------------------------------------------------------------//
        this.pPCecPopinControleEnCours           = page.locator('.p-dialog-content');
        this.pPCecLabelArticle                   = page.locator('#article');
        this.pPCecLabelFournisseur               = page.locator('#fournisseur');
        this.pPCecLabelNumLot                    = page.locator('#numero-lot');
        this.pPCecLabelDateReception             = page.locator('#date-de-reception');
        this.pPCecLabelNomControleur             = page.locator('.label-nom-controlleur');
        this.pPCecLabelBilanDuControle           = page.locator('.label-titre-bilan-controle');
    
        this.pPCecListboxQuestionnaire           = page.locator('div.input-questionnaire [role="button"]');
        this.pPCecSelectPalettes                 = page.locator('div.input-numero-palette .p-multiselect-trigger' );
        this.pPCecListeQuestionnaire             = page.locator('ul li .questionnaire-item');
    
        this.pPCecCheckBoxNumeroPalette          = page.locator('.p-multiselect-header .p-checkbox-box');
        this.pPCecIconClosePalette               = page.locator('.p-multiselect-close-icon');
    
        this.pPCecInputNumeroPalette             = page.locator('.input-numero-palette');
        this.pPCecInputQuestionnaire             = page.locator('.input-questionnaire');
        this.pPCecInputNumlotFournisseur         = page.locator('.p-chips > .p-inputtext');   
        this.pPCecButtonUpNbreUVC                = page.locator('div.input-nombre-uvc angleupicon');
        this.pPCecButtonDownNbreUVC              = page.locator('div.input-nombre-uvc angledownicon');
    
        this.pPCecDatepickerDLC                  = page.locator('.input-dlc [type="button"]');
        this.pPCecDatepickerDay                  = page.locator('.p-datepicker-group tbody td span:NOT(.p-disabled)');
    
        this.pPCecButtonCahierDesCharges         = page.locator('.cahier_charge button> .fas.fa-eye');
        
        this.pPCecButtonDemanderValidation       = page.locator('app-footer > button').nth(0);   
        this.pPCecButtonCorrigerControle         = page.locator('body  p-footer > app-footer > button');
        this.pPCecButtonEnregistrer              = page.locator('app-footer > button').nth(1);  
        this.pPCecButtonTerminer                 = page.locator('app-footer > button').nth(2);  
        this.pPCecButtonAnnuler                  = page.locator('.p-dialog-footer button.p-button-text');
        this.pPCecButtonFermer                   = page.locator('p-footer > app-footer > p-button > button > span');
        this.pPCecButtonLoad                     = page.locator('input[type="file"]');
    
        //-- Onglet:Détail ----------------------------------------------------------------------------------------//
    
        this.pPOngletDetail                      = page.locator('#p-tabpanel-1-label > .ng-star-inserted');
    
        //****les Boutons du panel Emballage******//
    
        this.pPCecDetailButtonConformepcbEmb     = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformepcbEmb  = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs');
    
        this.pPCecDetailButtonConformeEmb        = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableEmb      = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeEmb     = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        
        this.pPCecDetailButtonConformeEmbl       = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableEmbl     = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeEmbl    = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
        
        this.pPCecDetailButtonParcourirpcbEmb    = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        this.pPCecDetailButtonParcourirEmb       = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        this.pPCecDetailButtonParcourirEmbl      = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        this.pPCecDetailButtonCommentaire        = page.locator('div.critere-detail .commentaire button');
        this.pPCecDetailInputCommentaire         = page.locator('div.critere-detail .commentaire input[type="text"]');
        this.pPInputCommentaire                  = page.locator('.input-commentaire');
        this.pPCecDetailInputListeValeur         = page.locator('app-critere-intervalle .p-inputtext');
    
        //****les Boutons du panel Etiquetage******//
    
        this.pPCecDetailButtonConformeCharteEtiq       = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformeCharteEtiq    = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonParcourirCharteEtiq      = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeAllerEtiq        = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformeAllerEtiq     = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonApplicableAllerEtiq   = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirAllerEtiq       = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeUvcEtiq          = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformeUvcEtiq       = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonParcourirUvcEtiq         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeGencEtiq         = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableGencEtiq       = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeGencEtiq      = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(4) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirGenEtiq         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
            
        this.pPCecDetailButtonConformeLegEtiq          = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformeLegEtiq       = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonApplicableLegEtiq     = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(5) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirLegEtiq         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //******les Boutons du panel Traçabilité******//
       
        this.pPCecDetailButtonConformeTraUvc          = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformeTraUvc       = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonApplicableTraUvc     = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirTraUvc         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeTraDlc          = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableTraDlc        = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeTraDlc       = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirTraDlc         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //******les Boutons du panel Contrôle Poids******//
        this.pPCecDetailButtonConformePoidsRapide         = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformePoidsRapide      = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonApplicablePoidsRapide    = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirPoidsRapide        = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformePoidsComp          = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonNonConformePoidsComp       = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonParcourirPoidsComp         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        this.pPCecDetailButtonConformite                 = page.locator('.liste-valeurs .p-button-label');
       
       
        //******les Boutons du panel Visuel******//
    
        this.pPCecDetailButtonConformeVisExt          = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableVisExt        = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeVisExt       = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirVisExt         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeVisInt          = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableVisInt        = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeVisInt       = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonNonApplicableVisInt     = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
        this.pPCecDetailButtonParcourirVisInt         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailNonApplicable                 = page.locator('.contenu .p-button.p-component.p-ripple ');
    
        //******les Boutons du panel Odeur******//
    
        this.pPCecDetailButtonConformeOdeur           = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableOdeur         = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeOdeur        = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonParcourirOdeur          = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //******les Boutons du panel Texture******//
    
        this.pPCecDetailButtonConformeTexture         = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableTexture       = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeTexture      = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonNonApplicableTexture    = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
        this.pPCecDetailButtonParcourirTexture        = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //****les Boutons du panel Goût******//
    
        this.pPCecDetailButtonConformeGoutArome           = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableGoutArome         = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeGoutArome        = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonNonApplicableGoutArome      = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(1) p-button.liste-valeurs').nth(3);
        this.pPCecDetailButtonParcourirGoutArome          = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPCecDetailButtonConformeGoutSaveur          = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableGoutSaveur        = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeGoutSaveur       = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonNonApplicableGoutSaveur     = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
        this.pPCecDetailButtonParcourirGoutSaveur         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        this.pPCecDetailButtonConformeTrigeminale         = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
        this.pPCecDetailButtonAcceptableTrigeminale       = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
        this.pPCecDetailButtonNonConformeTrigeminale      = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
        this.pPCecDetailButtonNonApplicableTrigeminale    = page.locator('app-groupe-rubrique > div:nth-child(8) app-critere:nth-child(3) p-button.liste-valeurs').nth(3);
        this.pPCecDetailButtonParcourirTrigeminale        = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        //******les Boutons du panel Bilan******//
    
        this.pPCecDetailButtonConformeBilan               = page.locator('[label="Conforme"] > .p-button');
        this.pPCecDetailButtonAcceptableBilan             = page.locator('[label="Acceptable"] > .p-button');
        this.pPCecDetailButtonNonConformeBilan            = page.locator('[label="Non Conforme"] > .p-button');
        
        //-Onglet :Bilan Contrôle ----------------------------------------------------------------------------------------------------------//
    
        this.pPOngletBilanControle                         = page.locator("a[role='tab']");
    
        this.pPCecButtonConforme                          = page.locator('.resultat-filtre button');
        this.pPCecButtonAcceptable                        = page.locator('.resultat-filtre button');
        this.pPCecButtonNonConforme                       = page.locator('.resultat-filtre button');
        this.pPCecButtonValeurCritere                     = page.locator('.liste-valeurs span.p-button-label'); 
        this.pPCecButtonParcourir                         = page.locator('.photo-selection button'); 
        this.pPCecButtonOui                               = page.locator('.bouton-resultat-controle :nth-child(1) > .p-button');
        this.pPCecButtonNon                               = page.locator('.bouton-resultat-controle :nth-child(2) > .p-button');
    
        this.pPCecTableResultats                          = page.locator('.resultat-tableau');
          
        this.pPCecTextareaCommentaire                     = page.locator('#commentaire-resultat-controle');
    
        //-- POPIN : REPRENDRE UN CONTROLE -------------------------------------------------------------------------
        
        this.pPCecButtonSuppNumlotFour                     = page.locator('li.p-chips-token.ng-star-inserted .p-chips-token-icon');
    
        //-----------------------------------------------------------------------------------------------------------
        this.dropdownQuestionnaire                         = page.locator('.input-questionnaire > .ng-valid > .p-dropdown > .p-dropdown-label');
        this.dropdownItemQuestionnaire                     = page.locator(':nth-child(1) > .p-dropdown-item');

    }

}

