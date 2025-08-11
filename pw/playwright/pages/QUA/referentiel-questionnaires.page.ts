/**
 * Appli    : QUALITE
 * PAGE     : REFERENTIEL
 * Onglet   : QUESTIONNAIRES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.5
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ReferentielQuestionnaires {

    public readonly listBoxRayon                        : Locator; //('.rayon > .ng-pristine > .p-dropdown > .p-dropdown-label');

    public readonly datagridQuestionnaires              : Locator; //('div.p-datatable.p-component.p-datatable-hoverable-rows');
    public readonly datagridheadQuestionnaires          : Locator; //('div.p-datatable th.text-center');  // Les entêtes du tableau à vérifier ('.p-datatable-thead tr')('div.tab-liste-questionnaire th')
    public readonly datagridinputnomquestionnaire       : Locator; //('#filtre-nom-questionnaire input[type="text"]');
    public readonly datagridinputDescription            : Locator; //('#filtre-description-questionnaire input[type="text"]');
    public readonly datagridlistBoxObjet                : Locator; //('#filtre-objet-controle-arrivage [role="button"]');
    public readonly datagridlistBoxActif                : Locator; //('#filtre-actif [role="button"]');

    public readonly datagridObjet                       : Locator; //('.p-datatable-tbody > :nth-child(1) > :nth-child(2)');
    public readonly datagridQuestionnaire               : Locator; //('.p-datatable-tbody > :nth-child(1) > :nth-child(3)');
    public readonly datagridDescription                 : Locator; //('.p-datatable-tbody > :nth-child(1) > :nth-child(4)');
    
    public readonly listBoxdatagrid                     : Locator; //('.p-datatable-thead p-dropdown');   // les listbox dans le datagrid

    public readonly buttonCreerQuestionnaire            : Locator; //('.footerBar > :nth-child(1)'); 
    public readonly buttonModifier                      : Locator; //('.footerBar > :nth-child(2)');   
    public readonly buttonDupliquer                     : Locator; //('.footerBar > :nth-child(3)');
    public readonly buttonGererRubrique                 : Locator; //('.footerBar > :nth-child(4)'); 
    public readonly buttonImprimer                      : Locator; //('.footerBar > :nth-child(5)');
    public readonly buttonRechercherQuestionnaire       : Locator; //('.tab-liste-questionnaire button.p-button:NOT(.p-ripple)');

    public readonly checkboxCocherQuestionnaire         : Locator; //('[role="checkbox"]'); 

    //-- POPIN: GERER LES RUBRIQUES -------------------------------------------------------------------------
    public readonly pPGrListBoxRayon                    : Locator; //('#selectionRubrique .pi-chevron-down');
    public readonly pPGrListBoxRayonQuest               : Locator; //('#rayon .pi-chevron-down');
    public readonly pPGrListBoxObjet                    : Locator; //('#selectionObject');
    public readonly pPGrListBoxObjetSelected            : Locator; //('#selectionObject span')
    public readonly pPGrListRayon                       : Locator; //('.p-dropdown-items-wrapper ul li');

    public readonly pPGrTableRubrique                   : Locator; //('p-table.table-des-rubriques p-celleditor');

    public readonly pPGrInputNouvelleRubrique           : Locator; //('.groupe-rubrique-input input'); 

    public readonly pPGrInputAjouterSousRubrique        : Locator; //('.designation-input '); 

    public readonly pPGrButtonAjouterRubrique           : Locator; //('.groupe-rubrique-input button');
    public readonly pPGrButtonAjouterSousRubrique       : Locator; //('.p-button.p-component.p-button-icon-only.ng-star-inserted');
    public readonly pPGrButtonEnregistrer               : Locator; //('.p-dialog-footer button:NOT(.p-button-text)');  
    public readonly pPGrButtonAnnuler                   : Locator; //('.p-dialog-footer button.p-button-text');   
    //pPGrIconDeplierRubrique             : Locator; //('[aria-posinset="3"] > .p-tree-toggler > .p-tree-toggler-icon'); 
    public readonly pPGrIconDeplierRubrique             : Locator; //('.p-tree-wrapper p-treenode .p-tree-toggler-icon'); 
    

    public readonly pPGrButtonSupprimerRubrique         : Locator; //('button[icon="fa fa-trash"]');  
    public readonly pPGrButtonSupprimerRubrique1        : Locator; //('.p-button-icon.fa.fa-trash');  


    //-- POPIN: DUPLICATION D'UN QUESTIONNAIRE ----------------------------------------------------------------
    public readonly pPDqLabelQuestionnaireAdupliquer    : Locator; //('.titre .font-weight-bold ').nth(0);
    public readonly pPDqLabelNouveauQuestionnaire       : Locator; //('.titre .font-weight-bold ').nth(0);
    public readonly pPDqLabelMessagePhotos              : Locator; //('.message-photo ');
    public readonly pPDqLabelNomQuestionnaire           : Locator; //('.container .row').nth(2);
    public readonly pPDqLabelDescription                : Locator; //('.container .row').nth(3);

    public readonly pPDqButtonDuppliquer                : Locator; //('.p-dialog-footer button:NOT(.p-button-text)'); 
    public readonly pPDqButtonAnnuler                   : Locator; //('.p-dialog-footer button.p-button-text');   

    public readonly pPDqInputNomQuestionnaire           : Locator; //('#designation');
    public readonly pPDqTextareaDescription             : Locator; //('#description');

    constructor(page: Page) {

        this.listBoxRayon                        = page.locator('.rayon > .ng-pristine > .p-dropdown > .p-dropdown-label');

        this.datagridQuestionnaires              = page.locator('div.p-datatable.p-component.p-datatable-hoverable-rows');
        this.datagridheadQuestionnaires          = page.locator('div.p-datatable th.text-center');  // Les entêtes du tableau à vérifier ('.p-datatable-thead tr')('div.tab-liste-questionnaire th')
        this.datagridinputnomquestionnaire       = page.locator('#filtre-nom-questionnaire input[type="text"]');
        this.datagridinputDescription            = page.locator('#filtre-description-questionnaire input[type="text"]');
        this.datagridlistBoxObjet                = page.locator('#filtre-objet-controle-arrivage [role="button"]');
        this.datagridlistBoxActif                = page.locator('#filtre-actif [role="button"]');
     
        this.datagridObjet                       = page.locator('.p-datatable-tbody > :nth-child(1) > :nth-child(2)');
        this.datagridQuestionnaire               = page.locator('.p-datatable-tbody > :nth-child(1) > :nth-child(3)');
        this.datagridDescription                 = page.locator('.p-datatable-tbody > :nth-child(1) > :nth-child(4)');
        
        this.listBoxdatagrid                     = page.locator('.p-datatable-thead p-dropdown');   // les listbox dans le datagrid
     
        this.buttonCreerQuestionnaire            = page.locator('.footerBar > :nth-child(1)'); 
        this.buttonModifier                      = page.locator('.footerBar > :nth-child(2)');   
        this.buttonDupliquer                     = page.locator('.footerBar > :nth-child(3)');
        this.buttonGererRubrique                 = page.locator('.footerBar > :nth-child(4)'); 
        this.buttonImprimer                      = page.locator('.footerBar > :nth-child(5)');
        this.buttonRechercherQuestionnaire       = page.locator('.tab-liste-questionnaire button.p-button:NOT(.p-ripple)');
     
        this.checkboxCocherQuestionnaire         = page.locator('p-tablecheckbox div.p-checkbox-box'); 
     
        //-- POPIN: GERER LES RUBRIQUES -------------------------------------------------------------------------
        this.pPGrListBoxRayonQuest               = page.locator('.p-element .p-dropdown-label ').nth(0);
        this.pPGrListBoxRayon                    = page.locator('#selectionRubrique div[aria-label="dropdown trigger"]');
        this.pPGrListBoxObjet                    = page.locator('#selectionObject div[aria-label="dropdown trigger"]');
        this.pPGrListBoxObjetSelected            = page.locator('#selectionObject span');
        this.pPGrListRayon                       = page.locator('.p-dropdown-items-wrapper ul li');
     
        this.pPGrTableRubrique                   = page.locator('p-table.table-des-rubriques p-celleditor');
     
        this.pPGrInputNouvelleRubrique           = page.locator('.groupe-rubrique-input input'); 
     
        this.pPGrInputAjouterSousRubrique        = page.locator('.designation-input input');//('.designation-input '); 
     
        this.pPGrButtonAjouterRubrique           = page.locator('.groupe-rubrique-input button');
        this.pPGrButtonAjouterSousRubrique       = page.locator('.p-button.p-component.p-button-icon-only.ng-star-inserted');
        this.pPGrButtonEnregistrer               = page.locator('.p-dialog-footer button:NOT(.p-button-text)');  
        this.pPGrButtonAnnuler                   = page.locator('.p-dialog-footer button.p-button-text');   
        //pPGrIconDeplierRubrique             = page.locator('[aria-posinset="3"] > .p-tree-toggler > .p-tree-toggler-icon'); 
        this.pPGrIconDeplierRubrique             = page.locator('.p-tree-wrapper p-treenode .p-tree-toggler-icon'); 
        
     
        this.pPGrButtonSupprimerRubrique         = page.locator('button[icon="fa fa-trash"]');  
        this.pPGrButtonSupprimerRubrique1        = page.locator('.p-button-icon.fa.fa-trash');  
     
     
        //-- POPIN: DUPLICATION D'UN QUESTIONNAIRE ----------------------------------------------------------------
        this.pPDqLabelQuestionnaireAdupliquer    = page.locator('.titre .font-weight-bold ').nth(0);
        this.pPDqLabelNouveauQuestionnaire       = page.locator('.titre .font-weight-bold ').nth(0);
        this.pPDqLabelMessagePhotos              = page.locator('.message-photo ');
        this.pPDqLabelNomQuestionnaire           = page.locator('.container .row').nth(2);
        this.pPDqLabelDescription                = page.locator('.container .row').nth(3);
     
        this.pPDqButtonDuppliquer                = page.locator('.p-dialog-footer button:NOT(.p-button-text)'); 
        this.pPDqButtonAnnuler                   = page.locator('.p-dialog-footer button.p-button-text');   
     
        this.pPDqInputNomQuestionnaire           = page.locator('#designation');
        this.pPDqTextareaDescription             = page.locator('#description');
        
    }

}

