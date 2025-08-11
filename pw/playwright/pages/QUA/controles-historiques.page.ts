/**
 * Appli    : QUALITE
 * PAGE     : CONTROLES
 * Onglet   : HISTORIQUE DES CONTROLES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ControlesHistoriques {

    public readonly datagridHistArrivages            : Locator; //('.p-datatable.p-component'); //tableau des arrivages 
    public readonly datagridheadHistArrivages        : Locator; //('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier

    public readonly listBoxRayon                     : Locator; //('p-dropdown [role="button"]').nth(0);
    public readonly listBoxPlateforme                : Locator; //('p-dropdown [role="button"]').nth(1);
  
    public readonly inputFiltreArticle               : Locator; //('#autocomplete-article .p-autocomplete-input')  }
    public readonly inputFiltreFournisseur           : Locator; //('#autocomplete-fournisseur .p-autocomplete-input')  }
    public readonly inputFiltreNumlotfournisseur     : Locator; //('#lot-fournisseur'); 

    public readonly datepickerHistArrivages          : Locator; //('.p-inputwrapper-filled [type="button"]'); 
    public readonly datepickerHistArrivagesDLC       : Locator; //('.p-calendar-dlc [type="button"]'); 
    public readonly datepickerHistAujourdhui         : Locator; //('.p-calendar-dlc .p-button-label').nth(1);

    public readonly buttonRechercherHistorique       : Locator; //('.btn > .p-button');
    public readonly buttonVisualiserControle         : Locator; //('.footerBar > button > em.fas.fa-eye');
    public readonly buttonImprimerResultat           : Locator; //('.footerBar > button > em.fas.fa-print'); 
    
    public readonly checkBoxCocherUnArrivage          : Locator; //('.p-datatable-tbody [type="checkbox"]').nth(0);

    public readonly pPChistButtonFermer               : Locator; //('p-footer > app-footer > p-button > button > span');
    
    
    //-- POPIN : Visualiser Controle  --------------------------------------------------------------------------------------//
    public readonly pPVcPopinControleEnCours            : Locator; //('.p-dialog-content');
    public readonly pPVcLabelArticle                   : Locator; //('#article');
    public readonly pPVcLabelFournisseur               : Locator; //('#fournisseur');
    public readonly pPVcLabelNumLot                    : Locator; //('#numero-lot');
    public readonly pPVcLabelDateReception             : Locator; //('#date-de-reception');
    public readonly pPVcLabelNomControleur             : Locator; //('.label-nom-controlleur');
    public readonly pPVcLabelBilanDuControle           : Locator; //('.label-titre-bilan-controle');

    public readonly pPVcSelectQuestionnaire            : Locator; //('.input-questionnaire > .ng-untouched > .p-dropdown ');
    public readonly pPVcSelectPalettes                 : Locator; //('.p-multiselect-label');

    public readonly pPVcInputNumlotFournisseur         : Locator; //('.p-chips > .p-inputtext');   
    public readonly pPVcButtonUpNbreUVC                : Locator; //('.p-inputnumber-button-up > .p-button-icon');
    public readonly pPVcButtonDownNbreUVC              : Locator; //('.p-inputnumber-button-down > .p-button-icon');

    public readonly pPVcDatepickerDLC                  : Locator; //('.p-calendar-dlc [type="button"]');
    public readonly pPVcDatepickerDay                  : Locator; //('.p-datepicker-group tbody td span:NOT(.p-disabled)');

    public readonly pPVcButtonCahierDesCharges         : Locator; //('.btn > .p-button')  }
    
    public readonly pPVcButtonFermer                    : Locator; //('app-footer > p-button > .p-button-text');

    //-- Onglet:Détail ----------------------------------------------------------------------------------------//

    public readonly pPOngletDetail                     : Locator; //('li .ng-star-inserted').nth(9)

    //****les Boutons du panel Emballage******//

    public readonly pPVcDetailButtonConformeEmb        : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableEmb      : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeEmb     : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonConformeEmbl       : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableEmbl     : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeEmbl    : Locator; //('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    
    public readonly pPVcDetailButtonParcourirEmb       : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    public readonly pPVcDetailButtonParcourirEmbl      : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    public readonly pPVcDetailButtonCommentaire        : Locator; //('div.critere-detail .commentaire button');
    public readonly pPVcDetailInputCommentaire         : Locator; //('div.critere-detail .commentaire input[type="text"]');

    //****les Boutons du panel Etiquetage******//

    public readonly pPVcDetailButtonConformeEtiq       : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonNonConformeEtiq    : Locator; //('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonParcourirEtiq      : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    //******les Boutons du panel Traçabilité******//

    public readonly pPVcDetailButtonConformeTraDlc          : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableTraDlc        : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeTraDlc       : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonParcourirTraDlc         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPVcDetailButtonConformeTraUvc          : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonNonConformeTraUvc       : Locator; //('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonParcourirTraUvc         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //******les Boutons du panel Visuel******//

    public readonly pPVcDetailButtonConformeVisExt          : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableVisExt        : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeVisExt       : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonParcourirVisExt         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPVcDetailButtonConformeVisInt          : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableVisInt        : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeVisInt       : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonNonApplicableVisInt     : Locator; //('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
    public readonly pPVcDetailButtonParcourirVisInt         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPVcDetailNonApplicable                 : Locator; //('.contenu .p-button.p-component.p-ripple ');

    //******les Boutons du panel Odeur******//

    public readonly pPVcDetailButtonConformeOdeur           : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableOdeur         : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeOdeur        : Locator; //('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonParcourirOdeur          : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //******les Boutons du panel Texture******//

    public readonly pPVcDetailButtonConformeTexture         : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableTexture       : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeTexture      : Locator; //('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonParcourirTexture        : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    //****les Boutons du panel Goût******//

    public readonly pPVcDetailButtonConformeGoutArome           : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableGoutArome         : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeGoutArome        : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonParcourirGoutArome          : Locator; //('app-selecteur-images button[icon="far fa-copy"]');

    public readonly pPVcDetailButtonConformeGoutSaveur          : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableGoutSaveur        : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeGoutSaveur       : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonNonApplicableGoutSaveur     : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
    public readonly pPVcDetailButtonParcourirGoutSaveur         : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    public readonly pPVcDetailButtonConformeTrigeminale         : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
    public readonly pPVcDetailButtonAcceptableTrigeminale       : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
    public readonly pPVcDetailButtonNonConformeTrigeminale      : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
    public readonly pPVcDetailButtonNonApplicableTrigeminale    : Locator; //('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(3);
    public readonly pPVcDetailButtonParcourirTrigeminale        : Locator; //('app-selecteur-images button[icon="far fa-copy"]');
    
    //******les Boutons du panel Bilan******//

    public readonly pPVcDetailButtonConformeBilan               : Locator; //('[label="Conforme"] > .p-button');
    public readonly pPVcDetailButtonAcceptableBilan             : Locator; //('[label="Acceptable"] > .p-button');
    public readonly pPVcDetailButtonNonConformeBilan            : Locator; //('[label="Non Conforme"] > .p-button');
    
    //-Onglet :Bilan Contrôle ----------------------------------------------------------------------------------------------------------//

    public readonly pPOngletBilanControle                       : Locator; //('div.p-tabview-nav-content li a').nth(1);

    public readonly pPVcButtonConforme                          : Locator; //('.resultat-filtre button');
    public readonly pPVcButtonAcceptable                        : Locator; //('.resultat-filtre button');
    public readonly pPVcButtonNonConforme                       : Locator; //('.resultat-filtre button');
    public readonly pPVcButtonValeurCritere                     : Locator; //('.liste-valeurs span.p-button-label'); 
    public readonly pPVcButtonParcourir                         : Locator; //('.photo-selection button'); 
    public readonly pPVcButtonOui                               : Locator; //('.bouton-resultat-controle :nth-child(1) > .p-button');
    public readonly pPVcButtonNon                               : Locator; //('.bouton-resultat-controle :nth-child(2) > .p-button');

    public readonly pPVcTableResultats                          : Locator; //('.resultat-tableau');
      
    public readonly pPVcTextareaCommentaire                     : Locator; //('#commentaire-resultat-controle');

    constructor(page: Page) {

        this.datagridHistArrivages            = page.locator('.p-datatable.p-component'); //tableau des arrivages 
        this.datagridheadHistArrivages        = page.locator('div.p-datatable th.text-center'); // les entêtes du tableau des arrivages à vérifier
    
        this.listBoxRayon                     = page.locator('p-dropdown [role="button"]').nth(0);
        this.listBoxPlateforme                = page.locator('p-dropdown [role="button"]').nth(1);
      
        this.inputFiltreArticle               = page.locator('#autocomplete-article .p-autocomplete-input');
        this.inputFiltreFournisseur           = page.locator('#autocomplete-fournisseur .p-autocomplete-input');
        this.inputFiltreNumlotfournisseur     = page.locator('#lot-fournisseur'); 
    
        this.datepickerHistArrivages          = page.locator('.p-inputwrapper-filled [type="button"]'); 
        this.datepickerHistArrivagesDLC       = page.locator('.p-calendar-dlc [type="button"]'); 
        this.datepickerHistAujourdhui         = page.locator('.p-calendar-dlc .p-button-label').nth(1);
    
        this.buttonRechercherHistorique       = page.locator('app-option-recherche p-button button');
        this.buttonVisualiserControle         = page.locator('.footerBar > button > em.fas.fa-eye');
        this.buttonImprimerResultat           = page.locator('.footerBar > button > em.fas.fa-print'); 
        
        this.checkBoxCocherUnArrivage         = page.locator('.p-datatable-tbody .p-checkbox-box').nth(0); // ('.p-datatable-tbody [type="checkbox"]')
    
        this.pPChistButtonFermer              = page.locator('p-footer > app-footer > p-button > button > span');
        
        
        //-- POPIN : Visualiser Controle  --------------------------------------------------------------------------------------//
        this.pPVcPopinControleEnCours            = page.locator('.p-dialog-content');
        this.pPVcLabelArticle                   = page.locator('#article');
        this.pPVcLabelFournisseur               = page.locator('#fournisseur');
        this.pPVcLabelNumLot                    = page.locator('#numero-lot');
        this.pPVcLabelDateReception             = page.locator('#date-de-reception');
        this.pPVcLabelNomControleur             = page.locator('.label-nom-controlleur');
        this.pPVcLabelBilanDuControle           = page.locator('.label-titre-bilan-controle');
    
        this.pPVcSelectQuestionnaire            = page.locator('.input-questionnaire > .ng-untouched > .p-dropdown ');
        this.pPVcSelectPalettes                 = page.locator('.p-multiselect-label');
    
        this.pPVcInputNumlotFournisseur         = page.locator('.p-chips > .p-inputtext');   
        this.pPVcButtonUpNbreUVC                = page.locator('button angleupicon');
        this.pPVcButtonDownNbreUVC              = page.locator('button angledownicon');
    
        this.pPVcDatepickerDLC                  = page.locator('.p-calendar-dlc [type="button"]');
        this.pPVcDatepickerDay                  = page.locator('.p-datepicker-group tbody td span:NOT(.p-disabled)');
    
        this.pPVcButtonCahierDesCharges         = page.locator('.cahier_charge .p-button');//('.btn > .p-button');
        
        this.pPVcButtonFermer                    = page.locator('app-footer > p-button > .p-button-text');
    
        //-- Onglet:Détail ----------------------------------------------------------------------------------------//
    
        this.pPOngletDetail                     = page.locator('li .ng-star-inserted').nth(9);
    
        //****les Boutons du panel Emballage******//
    
        this.pPVcDetailButtonConformeEmb        = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableEmb      = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeEmb     = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonConformeEmbl       = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableEmbl     = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeEmbl    = page.locator('app-groupe-rubrique > div:nth-child(1) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        
        this.pPVcDetailButtonParcourirEmb       = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        this.pPVcDetailButtonParcourirEmbl      = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        this.pPVcDetailButtonCommentaire        = page.locator('div.critere-detail .commentaire button');
        this.pPVcDetailInputCommentaire         = page.locator('div.critere-detail .commentaire input[type="text"]');
    
        //****les Boutons du panel Etiquetage******//
    
        this.pPVcDetailButtonConformeEtiq       = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonNonConformeEtiq    = page.locator('app-groupe-rubrique > div:nth-child(2) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonParcourirEtiq      = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        //******les Boutons du panel Traçabilité******//
    
        this.pPVcDetailButtonConformeTraDlc          = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableTraDlc        = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeTraDlc       = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonParcourirTraDlc         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPVcDetailButtonConformeTraUvc          = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonNonConformeTraUvc       = page.locator('app-groupe-rubrique > div:nth-child(3) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonParcourirTraUvc         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //******les Boutons du panel Visuel******//
    
        this.pPVcDetailButtonConformeVisExt          = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableVisExt        = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeVisExt       = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonParcourirVisExt         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPVcDetailButtonConformeVisInt          = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableVisInt        = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeVisInt       = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonNonApplicableVisInt     = page.locator('app-groupe-rubrique > div:nth-child(4) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
        this.pPVcDetailButtonParcourirVisInt         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPVcDetailNonApplicable                 = page.locator('.contenu .p-button.p-component.p-ripple ');
    
        //******les Boutons du panel Odeur******//
    
        this.pPVcDetailButtonConformeOdeur           = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableOdeur         = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeOdeur        = page.locator('app-groupe-rubrique > div:nth-child(5) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonParcourirOdeur          = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //******les Boutons du panel Texture******//
    
        this.pPVcDetailButtonConformeTexture         = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableTexture       = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeTexture      = page.locator('app-groupe-rubrique > div:nth-child(6) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonParcourirTexture        = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        //****les Boutons du panel Goût******//
    
        this.pPVcDetailButtonConformeGoutArome           = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableGoutArome         = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeGoutArome        = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(1) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonParcourirGoutArome          = page.locator('app-selecteur-images button[icon="far fa-copy"]');
    
        this.pPVcDetailButtonConformeGoutSaveur          = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableGoutSaveur        = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeGoutSaveur       = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonNonApplicableGoutSaveur     = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(2) p-button.liste-valeurs').nth(3);
        this.pPVcDetailButtonParcourirGoutSaveur         = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        this.pPVcDetailButtonConformeTrigeminale         = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(0);
        this.pPVcDetailButtonAcceptableTrigeminale       = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(1);
        this.pPVcDetailButtonNonConformeTrigeminale      = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(2);
        this.pPVcDetailButtonNonApplicableTrigeminale    = page.locator('app-groupe-rubrique > div:nth-child(7) app-critere:nth-child(3) p-button.liste-valeurs').nth(3);
        this.pPVcDetailButtonParcourirTrigeminale        = page.locator('app-selecteur-images button[icon="far fa-copy"]');
        
        //******les Boutons du panel Bilan******//
    
        this.pPVcDetailButtonConformeBilan               = page.locator('[label="Conforme"] > .p-button');
        this.pPVcDetailButtonAcceptableBilan             = page.locator('[label="Acceptable"] > .p-button');
        this.pPVcDetailButtonNonConformeBilan            = page.locator('[label="Non Conforme"] > .p-button');
        
        //-Onglet :Bilan Contrôle ----------------------------------------------------------------------------------------------------------//
    
        this.pPOngletBilanControle                         = page.locator('div.p-tabview-nav-content li a').nth(1);
    
        this.pPVcButtonConforme                          = page.locator('.resultat-filtre button');
        this.pPVcButtonAcceptable                        = page.locator('.resultat-filtre button');
        this.pPVcButtonNonConforme                       = page.locator('.resultat-filtre button');
        this.pPVcButtonValeurCritere                     = page.locator('.liste-valeurs span.p-button-label'); 
        this.pPVcButtonParcourir                         = page.locator('.photo-selection button'); 
        this.pPVcButtonOui                               = page.locator('.bouton-resultat-controle :nth-child(1) > .p-button');
        this.pPVcButtonNon                               = page.locator('.bouton-resultat-controle :nth-child(2) > .p-button');
    
        this.pPVcTableResultats                          = page.locator('.resultat-tableau');
          
        this.pPVcTextareaCommentaire                     = page.locator('#commentaire-resultat-controle');
    
        
    }

}

