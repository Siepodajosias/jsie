/**
 * 
 * PRICING PAGE > ALIGNEMENTS
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.5
 * 
 */

import { Locator, Page } from "@playwright/test"

export class AlignementsPage {

    public readonly buttonAccorder                                  : Locator  //'button em.icon-thumbs-up');

    public readonly datePickerAlignementRecus                       : Locator  //'input-date-alignements');
    public readonly datePickerNextMonth                             : Locator  //'span.p-datepicker-next-icon');
    public readonly datePickerAvailableDay                          : Locator  //'table.p-datepicker-calendar tbody td:NOT(.p-datepicker-other-month');

    public readonly inputCodeMagasinMagasin                         : Locator  //'div.alignements-magasin th input.p-inputtext').nth(0);
    public readonly inputCodeMagasinArticle                         : Locator  //'div.demandes-alignement th input.p-inputtext').nth(0);
    public readonly inputCodeArticleMagasin                         : Locator  //'div.alignements-magasin th input.p-inputtext').nth(1);
    public readonly inputCodeArticleArticle                         : Locator  //'div.demandes-alignement th input.p-inputtext').nth(1);
    public readonly inputDatePicker                                 : Locator; 

    public readonly checkBoxMasquerMagSansAlign                     : Locator  //'[inputid="toggle-masquer-magasins"]');
    public readonly checkBoxMasquerAlignRepondu                     : Locator  //'[inputid="toggle-masquer-alignements"]');    
    public readonly checkBoxMagasin                                 : Locator  //'td div[role="checkbox"]');

    public readonly dataGridListeMagasins                           : Locator  //'div.alignements-magasin th.text-center'); 
    public readonly dataGridListeArticles                           : Locator  //'div.demandes-alignement th.text-center'); 
    public readonly dataGridTrListeArticles                         : Locator;
    public readonly dataGridTrListeAlignement                       : Locator;

    public readonly tdColActionDdeAlign                             : Locator  //'div.demandes-alignement td.col-actions');
    public readonly tdCodeMagasin                                   : Locator;
    public readonly tdPvcDemandeUnite                               : Locator;
    public readonly tdPvcApplicableUnite                            : Locator;

    public readonly tdIconAccepte                                   : Locator;
    public readonly tdIconRefuse                                    : Locator;

    public readonly pictogramAlignementRefuser                      : Locator  //'em.fa-thumbs-down');
    public readonly pictogramAlignementAccepeter                    : Locator;

    public readonly pictogramMagasinAccepter                        : Locator;

    //--- Popin Refus de l'alignement sur article
    public readonly pPListBoxMotif                                  : Locator;
    public readonly pPListeMotif                                    : Locator;
    public readonly pPTextAreaCommentaireRefus                      : Locator;
    public readonly pPButtonEnregistrer                             : Locator;
    public readonly pPButtonAnnuler                                 : Locator;
    public readonly pSpinnerOn                                      : Locator;
    constructor(page:Page){

        this.buttonAccorder                                         = page.locator('button em.icon-thumbs-up');

        this.datePickerAlignementRecus                              = page.locator('[for="input-date-alignements"]');
        this.datePickerNextMonth                                    = page.locator('svg.p-datepicker-next-icon');//('span.p-datepicker-next-icon')
        this.datePickerAvailableDay                                 = page.locator('table.p-datepicker-calendar tbody td:NOT(.p-datepicker-other-month)');
    
        this.inputCodeMagasinMagasin                                = page.locator('div.alignements-magasin th input.p-inputtext').nth(0);
        this.inputCodeMagasinArticle                                = page.locator('div.demandes-alignement th input.p-inputtext').nth(0);
        this.inputCodeArticleMagasin                                = page.locator('div.alignements-magasin th input.p-inputtext').nth(1);
        this.inputCodeArticleArticle                                = page.locator('div.demandes-alignement th input.p-inputtext').nth(1);
        this.inputDatePicker                                        = page.locator('#input-date-alignements');
    
        this.checkBoxMasquerMagSansAlign                            = page.locator('[inputid="toggle-masquer-magasins"] .p-checkbox-box');
        this.checkBoxMasquerAlignRepondu                            = page.locator('[inputid="toggle-masquer-alignements"] .p-checkbox-box');    
        this.checkBoxMagasin                                        = page.locator('td p-tablecheckbox div.p-checkbox');//('td div[role="checkbox"]')
    
        this.dataGridListeMagasins                                  = page.locator('div.alignements-magasin th.text-center'); 
        this.dataGridListeArticles                                  = page.locator('div.demandes-alignement th.text-center');
        this.dataGridTrListeArticles                                = page.locator('.demandes-alignement tr:nth-child(1)');
        this.dataGridTrListeAlignement                              = page.locator('.demandes-alignement tr');
    
        this.tdColActionDdeAlign                                    = page.locator('div.demandes-alignement td.col-actions');
        this.tdCodeMagasin                                          = page.locator('tbody tr td.text-center.ellipse');
        this.tdPvcDemandeUnite                                      = page.locator('.demandes-alignement td.text-right:nth-child(10)');
        this.tdPvcApplicableUnite                                   = page.locator('.demandes-alignement td.text-right:nth-child(12) input');

        this.tdIconAccepte                                          = page.locator('td.text-center span.icon-ok');
        this.tdIconRefuse                                           = page.locator('td.text-center span.icon-remove');
    
        this.pictogramAlignementRefuser                             = page.locator('em.fa-thumbs-down.actions-accorder-refuser');
        this.pictogramAlignementAccepeter                           = page.locator('em.fa-thumbs-up.actions-accorder-refuser');

        this.pictogramMagasinAccepter                               = page.locator('button em.actions-accorder-magasin');

        //--- Popin Refus de l'alignement sur article
        this.pPListBoxMotif                                        = page.locator('[formcontrolname="motifRefus"]');
        this.pPListeMotif                                          = page.locator('ul p-dropdownitem li');
        this.pPTextAreaCommentaireRefus                            = page.locator('[formcontrolname="commentaireRefus"]');
        this.pPButtonEnregistrer                                   = page.locator('.p-dialog-footer button:NOT(.p-button-link)');
        this.pPButtonAnnuler                                       = page.locator('.p-dialog-footer button.p-button-link');
        this.pSpinnerOn                                            = page.locator('span.app-spinner');
    }   
}