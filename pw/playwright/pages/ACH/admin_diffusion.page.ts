/**
 * Appli    : ACHATS
 * Page     : ADMIN
 * Onglet   : DIFFUSION
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */

import { Locator, Page }    from "@playwright/test"

export class PageAdmDif {

    public readonly buttonDifGencods           : Locator;    //('[ng-click="diffuserGencods()"]');  
    public readonly buttonDifCond              : Locator;    //('[ng-click="diffuserConditionnements()"]');   
    public readonly buttonDifFournisseurs      : Locator;    //('[ng-click="diffuserFournisseurs()"]');   
    public readonly buttonDifEmballages        : Locator;    //('[ng-click="diffuserEmballages()"]');   
    public readonly buttonDifDossierAchat      : Locator;    //('[ng-click="diffuserDossiersAchat()"]');   
    public readonly buttonDifTradEmballages    : Locator;    //('[ng-click="exporterElementsTraduisibles()"]');   
    public readonly buttonDifTradCond          : Locator;    //('[ng-click="exporterConditionnementsTraduisibles()"]');  
    
    public readonly listeBoxRayon              : Locator;
    public readonly listeBoxFournisseur        : Locator;

    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {
        
        //-- version insensible aux variations de clé de traduction mais sensible à la modification du DOM
        //this.buttonDifGencods           = page.locator('div.diffusion-generale button').nth(0);
        //this.buttonDifCond              = page.locator('div.diffusion-generale button').nth(1);    
        //this.buttonDifFournisseurs      = page.locator('div.diffusion-generale button').nth(2);   
        //this.buttonDifEmballages        = page.locator('div.diffusion-generale button').nth(3);        
        //this.buttonDifDossierAchat      = page.locator('div.diffusion-generale button').nth(4); 
        //this.buttonDifTradEmballages    = page.locator('div.diffusion-generale button').nth(5); 
        //this.buttonDifTradCond          = page.locator('div.diffusion-generale button').nth(6);  

        //-- version sensible aux variations de clé de traduction mais insensible à la modification du DOM
        this.buttonDifGencods           = page.locator('button:has-text("Diffuser gencods")');      
        this.buttonDifCond              = page.locator('button:has-text("Diffuser conditionnements")');       
        this.buttonDifFournisseurs      = page.locator('button:has-text("Diffuser fournisseurs")');    
        this.buttonDifEmballages        = page.locator('div.diffusion-generale button').nth(3);     
        this.buttonDifDossierAchat      = page.locator('button:has-text("Diffuser dossiers achats")');       
        this.buttonDifTradEmballages    = page.locator('div.diffusion-generale button').nth(5);      
        this.buttonDifTradCond          = page.locator('button:has-text("Diffuser tous les conditionnements")');
        
        this.listeBoxRayon              = page.locator('#rayons');
        this.listeBoxFournisseur        = page.locator('#fournisseurs');
    }

}