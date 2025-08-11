/**
 * Appli    : QUALITE
 * PAGE     : REFERENTIEL
 * Onglet   : DETAIL QUESTIONNAIRE
 * 
 * 
 * @author SIAKA KONE
 * @version 3.5
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ReferentielDetailQuestion {

    public readonly inputFieldNomQuestionnaire       : Locator; //('#nom-questionnaire');

    public readonly textAreaDescription              : Locator; //('#description');

    public readonly checkboxActif                    : Locator; //('.p-checkbox-icon.pi.pi-check');
    public readonly checkboxCocherCritere            : Locator; //(' tr:nth-child(1) > td p-tablecheckbox > div');  // les chechbox dans le datagrid
    
    public readonly listBoxRayon                     : Locator; //('#rayon > .p-dropdown > .p-dropdown-label');
    public readonly listBoxObjet                     : Locator; //('#objet > .p-dropdown > .p-dropdown-label');
    public readonly listTypeControle                 : Locator; //('.p-multiselect-label');
    public readonly listBoxMultiSelect               : Locator;
    public readonly commentaireGeneral               : Locator; //('p-inputswitch div.p-inputswitch').nth(1);
    public readonly ordreMobile                      : Locator; //('p-inputswitch div.p-inputswitch').nth(2);
    public readonly afficherNote                     : Locator; //('p-inputswitch div.p-inputswitch').nth(3);

    public readonly datagridDetailsQuestionnaire     : Locator; //('div.dg-critere');
    public readonly datagridheadDetailsQuestionnaire  : Locator; //('div.dg-critere th.text-center');  // Les entêtes du tableau des détails questionnaires
    public readonly datagridListBox                  : Locator; //('.p-datatable-thead p-dropdown');  // Les listBox dans le datagrid
    public readonly datagridFiltreCodecritere        : Locator; //('#critere-code-filtre input');
    public readonly datagridGroupeRubrique           : Locator; //('tr td:nth-child(3)');  
    public readonly datagridRubrique                 : Locator; //('tr td:nth-child(4)');  
    public readonly datagridCodecritere              : Locator; //('tr td:nth-child(5)');
    public readonly datagridDesignationcritere       : Locator; //('tr td:nth-child(6)');  
    public readonly datagridTypeCritere              : Locator; //('tr td:nth-child(7)');
    public readonly datagridValeurPossible           : Locator; //('tr td:nth-child(8)');
 
    public readonly buttonEnregistrer                : Locator; //('app-footer-bar button.sans-icone').nth(0);
    public readonly buttonAjouterCritere             : Locator; //('.footerBar > :nth-child(2)');
    public readonly buttonModifierCritere            : Locator; //('app-footer-bar button ').nth(2); 
    public readonly buttonDupliquerCritere           : Locator; //('app-footer-bar button ').nth(3);        
    public readonly buttonSupprimerCritere           : Locator; //('app-footer-bar button ').nth(4);
    
    //-- POPIN: AJOUTER CRITERE -------------------------------------------------------------------------------
    public readonly pPAcLabelInfosgenerales          : Locator; //('.row h4').nth(0);
    public readonly pPAcLabelValeurspossibles        : Locator; //('.row h4').nth(1);   
    
    public readonly pPAcInputCodeCritere             : Locator; //(':nth-child(4) > .col-7 > #code');
    public readonly pPAcInputDesignationCritere      : Locator; //('#designation');
    
    public readonly pPAcListBoxType                   : Locator; //('#typeCritere');
    public readonly pPAcListBoxRubriques              : Locator; //('#selectionRubrique > .p-dropdown > .p-dropdown-label');
    public readonly pPAcListBoxGroupeRubriques        : Locator; //('#selectionGroupeRubrique > .p-dropdown > .p-dropdown-trigger');
    public readonly pPAcListBoxTypeIntervalgauche     : Locator; //('.intervalle .p-dropdown-trigger .pi-chevron-down').nth(0);
    public readonly pPAcListBoxTypeIntervaldroite     : Locator; //('.intervalle .p-dropdown-trigger .pi-chevron-down').nth(1);
    public readonly pPAcListeBoxEchelle               : Locator;
    public readonly pPAcListBoxChoixIntervalleInf     : Locator;
    public readonly pPAcListBoxChoixIntervalleSup     : Locator;

    public readonly pPAcRadioButtonObligatoire        : Locator; //('.container.information-generale span').nth(4);

    public readonly pPAcRadioButtonConforme           : Locator; //('.conforme > .ng-valid > .p-radiobutton > .p-radiobutton-box');
    public readonly pPAcRadioButtonAcceptable         : Locator; //('.acceptable > .ng-valid > .p-radiobutton > .p-radiobutton-box');
    public readonly pPAcRadioButtonNonConforme        : Locator; //('.nonConforme > .ng-valid > .p-radiobutton > .p-radiobutton-box');

    public readonly pPcheckboxPhotorequis            : Locator; //('.photoRequise > .ng-valid > .p-checkbox > .p-checkbox-box');
    public readonly pPcheckboxCommentObligatoire     : Locator; //('.commentaireObligatoire >');
    public readonly pPcheckboxEliminatoire           : Locator; //('.eliminatoire > ');

    public readonly pPAcTextareaDescription          : Locator; //('.container.information-generale textarea');
    
    public readonly pPAcInputajouterValeurs           : Locator; //('#ajouterUneValeur');
    public readonly pPAcInputEchelleValeurs1          : Locator; //('#echelle-de-valeurs > .p-inputnumber > .p-inputnumber-input');
    public readonly pPAcInputEchelleValeurs2          : Locator; //('#echelle-a > .p-inputnumber > .p-inputnumber-input');
    public readonly pPAcInputIntervallegauche         : Locator; //('#intervalle-gauche');
    public readonly pPAcInputIntervalledroite         : Locator; //('#intervalle-droite');


    public readonly pPAcDatagridPhotosCrietere       : Locator; //('.p-accordion '); // tableau des photos des criteres, le div qui contient le tableau et le bouton marque "+"

    public readonly pPAcButtonAjouterEchelle         : Locator; //('.container > :nth-child(1) > .p-button'); 
    public readonly pPAcButtonAjouterValeur          : Locator; //('.justify-content-end > .p-button'); 
    public readonly pPAcButtonAjouterIntervalle      : Locator; //('.but-intervalle > .p-button'); 

    public readonly pPAcButtonValider                : Locator; //('.p-dialog-footer button:not(.p-button-text)');  
    public readonly pPAcButtonAnnuler                : Locator; //('.p-dialog-footer button.p-button-text'); 
    public readonly pPAcButtonOnglet                 : Locator; //('.p-tabview-nav li'); // le bouton permettant d'accéder à l'onglet photo du popin est à la 6ème position nth(6)
    public readonly pPAcButtonAjouterPhotos          : Locator; //('.button-add-photo button'); // le bouton marqué "+" pour importer des photos

    //-- POPIN: MODIFIER CRITERE ------------------------------------------------------------------------------
    public readonly pPMcLabelInfosgenerales          : Locator; //('.container.information-generale h4').nth(0);
    public readonly pPMcLabelValeurspossibles        : Locator; //('.container.information-generale h4').nth(1);
    
    public readonly pPMcInputCodeCritere             : Locator; //('.container.information-generale input').nth(2);
    public readonly pPMcInputDesignationCritere      : Locator; //('.container.information-generale input').nth(3);   
    
    public readonly pPMcListBoxType                  : Locator; //('#typeCritere');
    public readonly pPMcListBoxRubriques             : Locator; //('#selectionRubrique');
    public readonly pPMcListBoxGroupeRubrique        : Locator; //('#selectionGroupeRubrique');
    
    public readonly pPMcRadioButtonObligatoire       : Locator; //('.container.information-generale span').nth(6); // ('.container.information-generale #estObligatoire')

    public readonly pPMcTextareaDescription          : Locator; //('.container.information-generale textarea');

    public readonly pPMcDatagridPhotosCrietere       : Locator; //('.p-accordion '); // tableau des photos des criteres, le div qui contient le tableau et le bouton marque "+" on en a 3 dans ce cas précis
   
    public readonly pPMcButtonValider                : Locator; //('.p-dialog-footer button:NOT(.p-button-text)');  
    public readonly pPMcButtonAnnuler                : Locator; //('.p-dialog-footer button.p-button-text');  
    public readonly pPMcButtonOnglet                 : Locator; //('.p-tabview-nav li'); // le bouton permettant d'accéder à l'onglet photo du popin est à la 6ème position nth(6)
    public readonly pPMcButtonAjouterPhotos          : Locator; //('.button-add-photo button'); // les boutons marqué "+" pour importer des photos, on en a 3 à repérer avec les positions

    public readonly pPMcDatagridValeurconformite     : Locator; //('.col app-table-des-valeurs');

    //-- POPIN: DUPLIQUER CRITERE -----------------------------------------------------------------------------
    public readonly pPDcLabelCritereaDupliquer       : Locator; //('.titre h6').nth(0);
    public readonly pPDcLabelNouveauCritere          : Locator; //('.titre h6').nth(1);
    public readonly pPDcLabelCode                    : Locator; //('.container .row').nth(2);
    public readonly pPDcLabelDesignation             : Locator; //('.container .row').nth(3);
    public readonly pPDcLabelMessagephotos           : Locator; //('.message-photo ');

    public readonly pPDcInputCode                    : Locator; //('#code');
    public readonly pPDcInputDesignation             : Locator; //('#designation');

    public readonly pPDcButtonDupliquer              : Locator; //('.p-dialog-footer button:NOT(.p-button-text)'); 
    public readonly pPDcButtonAnnuler                : Locator; //('.p-dialog-footer button.p-button-text'); 

    //-- POPIN: CONFIRMATION-----------------------------------------------------------------------------------
    public readonly pPConfirmationButtonOui          : Locator; //(':nth-child(1) > .ng-star-inserted > .p-button');
    public readonly pPConfirmationButtonNon          : Locator; //('.p-dialog-footer button').nth(1);

    constructor(page: Page) {
        
        this.inputFieldNomQuestionnaire       = page.locator('#nom-questionnaire');

        this.textAreaDescription              = page.locator('#description');
    
        this.checkboxActif                    = page.locator('.p-checkbox-icon.pi.pi-check');
        this.checkboxCocherCritere            = page.locator(' tr:nth-child(1) > td p-tablecheckbox > div');  // les chechbox dans le datagrid
        
        this.listBoxRayon                     = page.locator('#rayon > .p-dropdown > .p-dropdown-label');
        this.listBoxObjet                     = page.locator('#objet > .p-dropdown > .p-dropdown-label');
        this.listTypeControle                 = page.locator('.p-multiselect-label');
        this.listBoxMultiSelect               = page.locator('.p-multiselect-item');
        this.commentaireGeneral               = page.locator('p-inputswitch div.p-inputswitch').nth(1);
        this.ordreMobile                      = page.locator('p-inputswitch div.p-inputswitch').nth(2);
        this.afficherNote                     = page.locator('p-inputswitch div.p-inputswitch').nth(3);
    
        this.datagridDetailsQuestionnaire     = page.locator('div.dg-critere');
        this.datagridheadDetailsQuestionnaire  = page.locator('div.dg-critere th.text-center');  // Les entêtes du tableau des détails questionnaires
        this.datagridListBox                  = page.locator('.p-datatable-thead p-dropdown');  // Les listBox dans le datagrid
        this.datagridFiltreCodecritere        = page.locator('#critere-code-filtre input');
        this.datagridGroupeRubrique           = page.locator('tr td:nth-child(3)');  
        this.datagridRubrique                 = page.locator('tr td:nth-child(4)');  
        this.datagridCodecritere              = page.locator('tr td:nth-child(5)');
        this.datagridDesignationcritere       = page.locator('tr td:nth-child(6)');  
        this.datagridTypeCritere              = page.locator('tr td:nth-child(7)');
        this.datagridValeurPossible           = page.locator('tr td:nth-child(8)');
     
        this.buttonEnregistrer                = page.locator('footerbar button').nth(0);
        this.buttonAjouterCritere             = page.locator('footerbar button').nth(1);
        this.buttonModifierCritere            = page.locator('footerbar button').nth(2);
        this.buttonDupliquerCritere           = page.locator('footerbar button').nth(3);        
        this.buttonSupprimerCritere           = page.locator('footerbar button').nth(4);
        
        //-- POPIN: AJOUTER CRITERE -------------------------------------------------------------------------------
        this.pPAcLabelInfosgenerales          = page.locator('.row h4').nth(0);
        this.pPAcLabelValeurspossibles        = page.locator('.row h4').nth(1);   
        
        this.pPAcInputCodeCritere             = page.locator(':nth-child(4) > .col-7 > #code');
        this.pPAcInputDesignationCritere      = page.locator('#designation');
        
        this.pPAcListBoxType                   = page.locator('#typeCritere > .p-dropdown');
        this.pPAcListBoxRubriques              = page.locator('#selectionRubrique > .p-dropdown > .p-dropdown-label');//('#selectionRubrique > .p-dropdown > .p-dropdown-label');
        this.pPAcListBoxGroupeRubriques        = page.locator('#selectionGroupeRubrique > .p-dropdown > .p-dropdown-trigger');
        this.pPAcListBoxTypeIntervalgauche     = page.locator('.intervalle .p-dropdown-trigger .pi-chevron-down').nth(0);
        this.pPAcListBoxTypeIntervaldroite     = page.locator('.intervalle .p-dropdown-trigger .pi-chevron-down').nth(1);
        this.pPAcListeBoxEchelle               = page.locator('div.ng-trigger-overlayContentAnimation li');
        this.pPAcListBoxChoixIntervalleInf     = page.locator('div.information-generale .container p-dropdown:NOT(.p-inputwrapper-filled)')
        this.pPAcListBoxChoixIntervalleSup     = page.locator('div.information-generale .container p-dropdown').nth(1)
// 
        this.pPAcRadioButtonObligatoire        = page.locator('.container.information-generale span').nth(4);
    
        this.pPAcRadioButtonConforme           = page.locator('.conforme > .ng-valid > .p-radiobutton > .p-radiobutton-box');
        this.pPAcRadioButtonAcceptable         = page.locator('.acceptable > .ng-valid > .p-radiobutton > .p-radiobutton-box');
        this.pPAcRadioButtonNonConforme        = page.locator('.nonConforme > .ng-valid > .p-radiobutton > .p-radiobutton-box');
    
        this.pPcheckboxPhotorequis            = page.locator('.photoRequise > .ng-valid > .p-checkbox > .p-checkbox-box');
        this.pPcheckboxCommentObligatoire     = page.locator('.commentaireObligatoire .p-checkbox');//('.commentaireObligatoire >');
        this.pPcheckboxEliminatoire           = page.locator('.eliminatoire .p-checkbox');//('.eliminatoire > ');
    
        this.pPAcTextareaDescription          = page.locator('.container.information-generale textarea');
        
        this.pPAcInputajouterValeurs           = page.locator('#ajouterUneValeur');
        this.pPAcInputEchelleValeurs1          = page.locator('#echelle-de-valeurs input.p-inputnumber-input');//('#echelle-de-valeurs > .p-inputnumber > .p-inputnumber-input');
        this.pPAcInputEchelleValeurs2          = page.locator('#echelle-a input.p-inputnumber-input');//('#echelle-a > .p-inputnumber > .p-inputnumber-input');
        this.pPAcInputIntervallegauche         = page.locator('#intervalle-gauche');
        this.pPAcInputIntervalledroite         = page.locator('#intervalle-droite');

        
        
    
        this.pPAcDatagridPhotosCrietere       = page.locator('.p-accordion '); // tableau des photos des criteres, le div qui contient le tableau et le bouton marque "+"
    
        this.pPAcButtonAjouterEchelle         = page.locator('app-echelle button[label="Ajouter"]'); //('.container > :nth-child(1) > .p-button'); //; 
        this.pPAcButtonAjouterValeur          = page.locator('.justify-content-end > .p-button'); 
        this.pPAcButtonAjouterIntervalle      = page.locator('.but-intervalle > .p-button'); 
    
        this.pPAcButtonValider                = page.locator('.p-dialog-footer button:not(.p-button-text)');  
        this.pPAcButtonAnnuler                = page.locator('.p-dialog-footer button.p-button-text'); 
        this.pPAcButtonOnglet                 = page.locator('.p-tabview-nav li'); // le bouton permettant d'accéder à l'onglet photo du popin est à la 6ème position nth(6)
        this.pPAcButtonAjouterPhotos          = page.locator('.button-add-photo button'); // le bouton marqué "+" pour importer des photos
    
        //-- POPIN: MODIFIER CRITERE ------------------------------------------------------------------------------
        this.pPMcLabelInfosgenerales          = page.locator('.container.information-generale h4').nth(0);
        this.pPMcLabelValeurspossibles        = page.locator('.container.information-generale h4').nth(1);
        
        this.pPMcInputCodeCritere             = page.locator('.container.information-generale input').nth(2);
        this.pPMcInputDesignationCritere      = page.locator('.container.information-generale input').nth(3);   
        
        this.pPMcListBoxType                  = page.locator('#typeCritere');
        this.pPMcListBoxRubriques             = page.locator('#selectionRubrique');
        this.pPMcListBoxGroupeRubrique        = page.locator('#selectionGroupeRubrique');
        
        this.pPMcRadioButtonObligatoire       = page.locator('.container.information-generale span').nth(6); // ('.container.information-generale #estObligatoire')
    
        this.pPMcTextareaDescription          = page.locator('.container.information-generale textarea');
    
        this.pPMcDatagridPhotosCrietere       = page.locator('.p-accordion '); // tableau des photos des criteres, le div qui contient le tableau et le bouton marque "+" on en a 3 dans ce cas précis
       
        this.pPMcButtonValider                = page.locator('.p-dialog-footer button:NOT(.p-button-text)');  
        this.pPMcButtonAnnuler                = page.locator('.p-dialog-footer button.p-button-text');  
        this.pPMcButtonOnglet                 = page.locator('.p-tabview-nav li'); // le bouton permettant d'accéder à l'onglet photo du popin est à la 6ème position nth(6)
        this.pPMcButtonAjouterPhotos          = page.locator('.button-add-photo button'); // les boutons marqué "+" pour importer des photos, on en a 3 à repérer avec les positions
    
        this.pPMcDatagridValeurconformite     = page.locator('.col app-table-des-valeurs');
    
        //-- POPIN: DUPLIQUER CRITERE -----------------------------------------------------------------------------
        this.pPDcLabelCritereaDupliquer       = page.locator('.titre h6').nth(0);
        this.pPDcLabelNouveauCritere          = page.locator('.titre h6').nth(1);
        this.pPDcLabelCode                    = page.locator('.container .row').nth(2);
        this.pPDcLabelDesignation             = page.locator('.container .row').nth(3);
        this.pPDcLabelMessagephotos           = page.locator('.message-photo ');
    
        this.pPDcInputCode                    = page.locator('#code');
        this.pPDcInputDesignation             = page.locator('#designation');
    
        this.pPDcButtonDupliquer              = page.locator('.p-dialog-footer button:NOT(.p-button-text)'); 
        this.pPDcButtonAnnuler                = page.locator('.p-dialog-footer button.p-button-text'); 
    
        //-- POPIN: CONFIRMATION-----------------------------------------------------------------------------------
        this.pPConfirmationButtonOui          = page.locator('.p-dialog-footer .p-confirm-dialog-accept');//(':nth-child(1) > .ng-star-inserted > .p-button');
        this.pPConfirmationButtonNon          = page.locator('.p-dialog-footer .p-confirm-dialog-reject');//('.p-dialog-footer button').nth(1);
    
    }

}

