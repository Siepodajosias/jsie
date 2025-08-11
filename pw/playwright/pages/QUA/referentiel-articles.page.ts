/**
 * Appli    : QUALITE
 * PAGE     : REFERENTIEL
 * Onglet   : ARTICLES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ReferentielArticles {

    public readonly buttonModifierArticle                : Locator; //('.footerBar > button'); 

    public readonly datagridArticles                     : Locator; //('div.p-datatable.p-component.p-datatable-hoverable-rows');
    public readonly datagridheadArticles                 : Locator; //('thead .ng-star-inserted th.text-center');  // Les entêtes du tableau à vérifier ('.p-datatable-thead tr')('div.tab-liste-questionnaire th')
    public readonly datagridListeArticles                : Locator;

    public readonly listBoxRayon                         : Locator; //('.rayon span.pi-chevron-down');
    public readonly datagridInputCodeArticle             : Locator; //('th#filtre-code-article input');
    public readonly datagridInputDesignationArticle      : Locator; //('#filtre-designation-article > .table-filtre');  
    public readonly datagridListBoxRayon                 : Locator; //('#filtre-rayon-article [role="button"]');  // Les listBox dans le datagrid
    public readonly datagridListBoxGroupeArticle         : Locator; //('#filtre-groupe-article [role="button"]');  // Les listBox dans le datagrid
    public readonly datagridListBoxCahierdesCharges      : Locator; //('#filtre-cahier-des-charges-article [role="button"]');  // Les listBox dans le datagrid
    public readonly datagridListBoxQuestionnaires        : Locator; //('#filtre-questionnaire [role="button"]');  // Les listBox dans le datagrid
    public readonly datagridListBoxPrioritaire           : Locator; //('#filtre-prioritaire [role="button"]');  // Les listBox dans le datagrid
    public readonly datagridListBoxActif                 : Locator; //('#filtre-actif [role="button"]');  // Les listBox dans le datagrid

    public readonly datagridLabelCodeArticle             : Locator; //('.p-selectable-row > :nth-child(1)');
    public readonly datagridLabelDesignationArticle      : Locator; //('.p-selectable-row > :nth-child(2)');  
    public readonly datagridLabelListBoxGroupeArticle    : Locator; //('.p-selectable-row > :nth-child(3)');  // Les listBox dans le datagrid
    public readonly datagridLabelFamille                 : Locator; //('.p-selectable-row > :nth-child(4)');  
    public readonly datagridLabelsousFamille             : Locator; //('.p-selectable-row > :nth-child(5)');  
    
    public readonly listBoxdatagrid                      : Locator; //('.p-datatable-thead p-dropdown');   // les listbox dans le datagrid
 
    //-- POPIN: MODIFIFER ARTICLE -------------------------------------------------------
    public readonly pPMaLabelCahierdesCharges            : Locator; //('.row.article-container-div h6').nth(0);
    public readonly pPMaLabelQuestionnaire               : Locator; //('.row.article-container-div h6').nth(1);
    public readonly pPMaLabelGroupePrioritaire           : Locator; //('.row.article-container-div h6').nth(2);
    public readonly pPMaLabelArticle                     : Locator; //('.label label').nth(0);
    public readonly pPMaLabelFamille                     : Locator; //('.label label').nth(1);
    public readonly pPMaLabelSousfamille                 : Locator; //('.label label').nth(2);
    public readonly pPMaLabelMessageGroupePrio           : Locator; //('.label label').nth(6);
    public readonly pPMaLabelCompteArticles              : Locator; //('.label label').nth(7);

    public readonly pPMaButtonVoirArticle                : Locator; //('.row.article-container-div button').nth(0);
    public readonly pPMaButtonSupprimerArticle           : Locator; //('.row.article-container-div button').nth(1);
    public readonly pPMaButtonVoirFamille                : Locator; //('.row.article-container-div button').nth(2);
    public readonly pPMaButtonSupprimerFamille           : Locator; //('.row.article-container-div button').nth(3);
    public readonly pPMaButtonVoirSousFamille            : Locator; //('.row.article-container-div button').nth(4);
    public readonly pPMaButtonSupprimerSousFamille       : Locator; //('.row.article-container-div button').nth(5);
    public readonly pPMaButtonParcourirArticle           : Locator; //('p-fileupload#cahier-charge-article[name="myfile[]"]');
    public readonly pPMaButtonParcourirFamille           : Locator; //('#cahier-charge-famille > .p-fileupload > .p-button');
    public readonly pPMaButtonParcourirSousFamille       : Locator; //('#cahier-charge-sous-famille > .p-fileupload > .p-button');
    public readonly pPMaButtonEnregistrer                : Locator; //('.p-dialog-footer button:NOT(.p-button-text)');   
    public readonly pPMaButtonAnnuler                    : Locator; //('.p-dialog-footer button.p-button-text');  
    public readonly pPMaSpinner                          : Locator;  

    public readonly pPMaListBoxArticle                   : Locator; //(':nth-child(1) >>> .p-multiselect-label-container');
    public readonly pPMaListBoxFamille                   : Locator; //(':nth-child(2) >>> .p-multiselect-label-container');
    public readonly pPMaListBoxSousFamille               : Locator; //(':nth-child(3) >>> .p-multiselect-label-container');

    public readonly pPCheckBoxArticle                    : Locator; //('.p-multiselect-item.p-ripple .p-checkbox-box');
    public readonly pPCheckBoxFamille                    : Locator; //('.p-multiselect-item.p-ripple .p-checkbox-box');
    public readonly pPCheckBoxSousFamille                : Locator; //('.p-multiselect-item.p-ripple .p-checkbox-box');

    public readonly pPMaInputParcourirArticle            : Locator; //('p-fileupload#cahier-charge-article input[type="file"]');
    public readonly pPMaInputParcourirFamille            : Locator; //('p-fileupload#cahier-charge-famille input[type="file"]');
    public readonly pPMaInputParcourirSousFamille        : Locator; //('p-fileupload#cahier-charge-sous-famille input[type="file"]');

    public readonly pPMaRadioButtonGroupePrio            : Locator; //('div.bloc-principal-groupe_prio .p-inputswitch-slider');

    constructor(page: Page) {

        this.buttonModifierArticle                 = page.locator('.footerBar > button'); 

        this.datagridArticles                      = page.locator('div.p-datatable.p-component.p-datatable-hoverable-rows');
        this.datagridheadArticles                  = page.locator('thead .ng-star-inserted th.text-center');  // Les entêtes du tableau à vérifier ('.p-datatable-thead tr')('div.tab-liste-questionnaire th')
        this.datagridListeArticles                 = page.locator('tbody.p-datatable-tbody tr.p-selectable-row');
        
        this.listBoxRayon                          = page.locator('.rayon chevrondownicon');
        this.datagridInputCodeArticle              = page.locator('th#filtre-code-article input');
        this.datagridInputDesignationArticle       = page.locator('#filtre-designation-article > .table-filtre');  
        this.datagridListBoxRayon                  = page.locator('#filtre-rayon-article [role="button"]');  // Les listBox dans le datagrid
        this.datagridListBoxGroupeArticle          = page.locator('#filtre-groupe-article [role="button"]');  // Les listBox dans le datagrid
        this.datagridListBoxCahierdesCharges       = page.locator('#filtre-cahier-des-charges-article [role="button"]');  // Les listBox dans le datagrid
        this.datagridListBoxQuestionnaires         = page.locator('#filtre-questionnaire [role="button"]');  // Les listBox dans le datagrid
        this.datagridListBoxPrioritaire            = page.locator('#filtre-prioritaire [role="button"]');  // Les listBox dans le datagrid
        this.datagridListBoxActif                  = page.locator('#filtre-actif [role="button"]');  // Les listBox dans le datagrid
        
        
        this.datagridLabelCodeArticle              = page.locator('.p-selectable-row > :nth-child(1)');
        this.datagridLabelDesignationArticle       = page.locator('.p-selectable-row > :nth-child(2)');  
        this.datagridLabelListBoxGroupeArticle     = page.locator('.p-selectable-row > :nth-child(3)');  // Les listBox dans le datagrid
        this.datagridLabelFamille                  = page.locator('.p-selectable-row > :nth-child(4)');  
        this.datagridLabelsousFamille              = page.locator('.p-selectable-row > :nth-child(5)');  
        
        this.listBoxdatagrid                       = page.locator('.p-datatable-thead p-dropdown');   // les listbox dans le datagrid

        //-- POPIN: MODIFIFER ARTICLE -------------------------------------------------------
        this.pPMaLabelCahierdesCharges             = page.locator('.row.article-container-div h6').nth(0);
        this.pPMaLabelQuestionnaire                = page.locator('.row.article-container-div h6').nth(1);
        this.pPMaLabelGroupePrioritaire            = page.locator('.row.article-container-div h6').nth(2);
        this.pPMaLabelArticle                      = page.locator('.label label').nth(0);
        this.pPMaLabelFamille                      = page.locator('.label label').nth(1);
        this.pPMaLabelSousfamille                  = page.locator('.label label').nth(2);
        this.pPMaLabelMessageGroupePrio            = page.locator('.label label').nth(6);
        this.pPMaLabelCompteArticles               = page.locator('.label label').nth(7);

        this.pPMaButtonVoirArticle                 = page.locator('.row.article-container-div button').nth(0);
        this.pPMaButtonSupprimerArticle            = page.locator('.row.article-container-div button').nth(1);
        this.pPMaButtonVoirFamille                 = page.locator('.row.article-container-div button').nth(2);
        this.pPMaButtonSupprimerFamille            = page.locator('.row.article-container-div button').nth(3);
        this.pPMaButtonVoirSousFamille             = page.locator('.row.article-container-div button').nth(4);
        this.pPMaButtonSupprimerSousFamille        = page.locator('.row.article-container-div button').nth(5);
        this.pPMaButtonParcourirArticle            = page.locator('p-fileupload#cahier-charge-article[name="myfile[]"]');
        this.pPMaButtonParcourirFamille            = page.locator('#cahier-charge-famille > .p-fileupload > .p-button');
        this.pPMaButtonParcourirSousFamille        = page.locator('#cahier-charge-sous-famille > .p-fileupload > .p-button');
        this.pPMaButtonEnregistrer                 = page.locator('.p-dialog-footer button:NOT(.p-button-text)');   
        this.pPMaButtonAnnuler                     = page.locator('.p-dialog-footer button.p-button-text');   
        this.pPMaSpinner                           = page.locator('.spinner-border'); 

        this.pPMaListBoxArticle                    = page.locator('.p-element .p-multiselect-label-container').nth(0);//(':nth-child(1) >>> .p-multiselect-label-container');
        this.pPMaListBoxFamille                    = page.locator('.p-element .p-multiselect-label-container').nth(1);//(':nth-child(2) >>> .p-multiselect-label-container');
        this.pPMaListBoxSousFamille                = page.locator('.p-element .p-multiselect-label-container').nth(2);//(':nth-child(3) >>> .p-multiselect-label-container');

        this.pPCheckBoxArticle                     = page.locator('.p-multiselect-item.p-ripple .p-checkbox-box');
        this.pPCheckBoxFamille                     = page.locator('.p-multiselect-item.p-ripple .p-checkbox-box');
        this.pPCheckBoxSousFamille                 = page.locator('.p-multiselect-item.p-ripple .p-checkbox-box');

        this.pPMaInputParcourirArticle             = page.locator('p-fileupload#cahier-charge-article input[type="file"]');
        this.pPMaInputParcourirFamille             = page.locator('p-fileupload#cahier-charge-famille input[type="file"]');
        this.pPMaInputParcourirSousFamille         = page.locator('p-fileupload#cahier-charge-sous-famille input[type="file"]');

        this.pPMaRadioButtonGroupePrio             = page.locator('.input-groupe-prio');//('div.bloc-principal-groupe_prio .p-inputswitch-slider');

    }

}

