/**
 * 
 * REPARTITION PAGE > ARTICLES / ONGLET > MOYENNES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ArticleMoyennePage {

    //--------------------------------------------------------------------------------------------------------------
    public readonly linkSelectArticle      : Locator  //(by.css('[ng-click="choisirArticle($event)"]');

    public readonly listMoyennes           : Locator  //(by.css('.tab-moyennes-datagrid');

    public readonly headerMoyenneList      : Locator  //.all(by.css('.datagrid-table-wrapper > table > thead > tr > th');

    public readonly buttonsAffecterA	   : Locator  //.all(by.css('.pull-left.ng-scope > button');
    public readonly buttonEnregistrer      : Locator  //(by.css('[ng-click="enregistrer()"]');

    public readonly textareaCommentaire	   : Locator  //.all(by.css('.pull-left.ng-scope > textarea');

    public readonly sortableQteAgree	   : Locator  //(by.css('th.datagrid-qteAgree');

    public readonly checkboxLigneArticle   : Locator  //.all(by.css('div .table > tbody > tr > td > input').nth(0);

    public readonly textAreaCommentaires   : Locator  //.all(by.css('textarea.tab-moyennes-commentaire');

    //--------------------------------------------------------------------------------------------------------------

    constructor (page: Page){

        //--------------------------------------------------------------------------------------------------------------

        this.linkSelectArticle     = page.locator('[ng-click="choisirArticle($event)"]');

        this.listMoyennes          = page.locator('.tab-moyennes-datagrid');

        this.headerMoyenneList     = page.locator('.datagrid-table-wrapper > table > thead > tr > th');

        this.buttonsAffecterA	   = page.locator('.pull-left.ng-scope > button');
        this.buttonEnregistrer     = page.locator('[ng-click="enregistrer()"]');

        this.textareaCommentaire   = page.locator('.pull-left.ng-scope > textarea');

        this.sortableQteAgree	   = page.locator('th.datagrid-qteAgree');

        this.checkboxLigneArticle  = page.locator('div .table > tbody > tr > td > input').nth(0);

        this.textAreaCommentaires  = page.locator('textarea.tab-moyennes-commentaire');

        //--------------------------------------------------------------------------------------------------------------
    }
}