/**
 * 
 * FACTURATION PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba & JOSIAS SIE
 * @version 3.8
 * 
 */

import { TestFunctions }                    from "@helpers/functions";
import { FunctionAria }                     from "@helpers/ariaSnapshot";

import { Locator, Page, TestInfo }          from "@playwright/test"
import { AriaSnapshot }                     from '@commun/types';


export class MenuFacturation {

    private menu                        : any;
    private onglets                     : any;
    private verboseMode                 : boolean;
    private bAriaSnapshot               : boolean = false; 

    public readonly page                : Page;
    public readonly listBoxPlateforme   : Locator;
    public readonly listBoxRayon        : Locator;
    public readonly listBoxUser         : Locator;
    public readonly linkDeconnexion     : Locator;

    private readonly fonction           : TestFunctions;
    private fonctionAria                : FunctionAria;

    //------------------------------------------------------------------------------------------

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : '#main-navbar .item0 a',
            livPrevues      : '#main-navbar .item1 a',
            livEffectuees   : '#main-navbar .item2 a',
            regularisation  : '#main-navbar .item3 a',
            facturation     : '#main-navbar .item4 a',
            archivage       : '#main-navbar .item5 a',
            admin           : '#main-navbar .item6 a'
        }

        this.onglets = {
            //-----------------------Page livraison effectuees------------------------
            livEffectuees: {
                ecartsLivraison          : page.locator('a[href="#ecarts"]'),
                livraisonsRelles         : page.locator('a[href="#livraisons_reelles"]'),
                livraisonsDirectes       : page.locator('a[href="#livraisons_plateformes"]'),
                remises                  : page.locator('a[href="#remises"]')
            },

            //-----------------------Page regularisation------------------------------
            regularisation: {
                ecartsEnAttente          : page.locator('a[href="#ecarts-en-attente"]'),
                demandesAvoirClient      : page.locator('a[href="#demandes-avoir-en-attente"]'),
                echangesMarchandises     : page.locator('a[href="#demandes-echange-en-attente"]'),
                regularisationsEffectuees: page.locator('a[href="#regularisations-effectuees"]'),
                avoirsComplementaires    : page.locator('a[href="#avoirs-manuels"]')
            },

            //-----------------------Page facturation---------------------------------
            facturation: {
                listeFactures            : page.locator('a[href="#factures"]'),
                listeReleves             : page.locator('a[href="#refeleve-facture"]'),
                recettesMagasins         : page.locator('a[href="#recette-magasin"]'),
                referentielTiers         : page.locator('a[href="#referentiel-facturables"]'),
                comptesBancaires         : page.locator('a[href="#comptes-bancaires"]')
            },

            //-----------------------Page administration------------------------------
            admin: {
                administration           : page.locator('a[href="#admin"]'),
                parametrage              : page.locator('a[href="#parametrage"]'),
                parametrageConstantes    : page.locator('a[href="#parametrage-constantes"]'),
                communicationUtilisateurs: page.locator('a[href="#communicationUtilisateur"]'),
                changelog                : page.locator('a[href="#changelog"]')
            }
        }

        this.listBoxPlateforme  = page.locator('.plateforme');
        this.listBoxRayon       = page.locator('select[ng-model="groupeAvecRayon"]');
        this.listBoxUser        = page.locator('div.login-utilisateur a.dropdown-toggle');       
        this.linkDeconnexion    = page.locator('[ng-click="deconnexion();"]');

        this.fonction           = fonction;
        this.page               = page;
        
        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }

    }

    
    /**
     * 
     * Click sur l'onglet {ongletName} situé sur la page {pageName}
     * 
     * @param {string} pageName L'identifiant du menu     
     * @param {string} ongletName L'identifiant de l'Onglet
     * @param {Page} page
     * 
     */
    public async clickOnglet(pageName:string, ongletName:string, page:Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (this.onglets[pageName][ongletName]) {

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Onglet : ",ongletName);
            }

            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, ongletName)
            }

        } else {
            throw new Error('NotFoundError : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".');
        }
    }

    /**
     * 
     * Sélectionne le rayon (Liste déroulante située dans le menu)
     * 
     * @param {string} nomRayon 
     * @param {Page}   page
     * 
     */
    public async selectRayon(nomRayon:string, page:Page){
        const options = await page.locator('[ng-model="groupeAvecRayon"] optgroup option').all()
        let optionTrouvee = false;
        for(let option of options){
            const optionContent = await option.textContent()
            if(optionContent?.trim() === nomRayon){
                option.click();
                optionTrouvee = true;
                break;
            }
        }
        if (!optionTrouvee){
            throw new Error(`NotFoundError: Option ${nomRayon} non trouvée dans la liste déroulante`)
        }
    }

    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string} sPlateforme 
     * @param {Page} page
     * 
     */
    public async selectPlateformeByLabel(sPlateforme:string, page:Page) {
        await this.listBoxPlateforme.selectOption({label: sPlateforme});
        await this.listBoxPlateforme.selectOption({label: sPlateforme});

        await this.fonction.highlightSelector(this.listBoxPlateforme);
        await this.fonction.addDataSheet('ListBox', 'Plateforme', sPlateforme);

        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * @param {string} sRayon
     * @param {Page} page
     * 
     * Sélectionne le couple rayon/gpe art (Liste déroulante située dans le menu)
     * 
     */
    public async selectRayonByLabel(sRayon:string, page: Page) {
        await this.listBoxRayon.click();
        await this.listBoxRayon.locator('option').selectOption({label : sRayon});

        await this.fonction.highlightSelector(this.listBoxRayon);
        await this.fonction.addDataSheet('ListBox', 'Plateforme', sRayon);

        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * Click sur le bouton {pageName} du menu
     * 
     * @param {string} pageName L'identifiant du menu
     * @param {Page} page
     * 
     */
    public async click(pageName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode) {        

        if (typeof(this.menu[pageName]) === 'string' ) {  

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Page : ", pageName);
            }

            //-- Détermination du nom de l'onglet par défaut
            var sNomOnglet = 'NotExists';
            if(this.onglets[pageName] !== undefined) {
                sNomOnglet = Object.keys(this.onglets[pageName])[0];
            }

            await page.locator(this.menu[pageName]).click();
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, sNomOnglet);
            }

            //-- On click sur le premier onglet afin d'activer la coloration de l'onglet
            if (sNomOnglet !== 'NotExists')   {
                await this.fonction.clickElement(this.onglets[pageName][sNomOnglet]);
            }

        } else {
            throw new Error('Ooops : Elément du menu "' + pageName + '" inconnu');
        }
    } 
    
    /**
     * @description Sélectionne le couple rayon/gpe art (Liste déroulante située dans le menu)
     * 
     * @param {string} sRayon
     * @param {string} sGroupeArticle
     * @param {Page} page
     * 
     *  /!\ Alerte môcherie /!\
     * La liste déroulante étant condidéré comme NON visible PAR PLAYWRIGHT, le choix ne peut pas être cliqué
     * D'où l'accès via les touches clavier...
     * :-(
     *  
     */
    public async selectRayonGroupeArticle(sRayon:string, sGroupeArticle: string, page:Page) {

        const sSelection = sRayon + ' - ' + sGroupeArticle;
        
        let aChoix:any=[];

        //-- On déplie la liste déroulante
        await this.fonction.clickElement(this.listBoxRayon);

        //-- On récupère la liste exhaustive des choix
        var iNbChoix = await this.listBoxRayon.locator('option').count();

        //-- On détermine la valeur du texte actuellement sélectionné
        var sSelected = await this.listBoxRayon.locator('option[selected="selected"]').textContent();
        
        //-- On place tous les choix présents dans un tableau
        aChoix = await this.listBoxRayon.locator('option').allTextContents();

        //-- On détermine la position de la cible
        var iPosCible = aChoix.indexOf(sSelection);

        //-- On détermine la position du choix actuel
        var iPosCurrent = aChoix.indexOf(sSelected);

        await this.fonction.highlightSelector(this.listBoxRayon);

        await this.fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);
        await this.fonction.addDataSheet('ListBox', 'Rayon', sRayon);

        //-- En fonction de l'écart, on monte oudescend dans la liste à l'aide des touches clavier
        if (iPosCible < iPosCurrent) {
            for (let iCpt = iPosCible; iCpt < iPosCurrent; iCpt++) {
                await page.keyboard.press('ArrowUp');
            }
        } else {
            for (let iCpt = iPosCurrent; iCpt < iPosCible; iCpt++) {
                await page.keyboard.press('ArrowDown');
            }
        }

        await this.fonction.waitTillHTMLRendered(page, 30000, false);
 
 
    }
    
    /**
     * 
     * @param tesTinfo 
     * @description : Recherche les nouveaux éléments de la page (ListBox, button, Input, etc.)
     */
    public async searchNewElements(tesTinfo:TestInfo ) {

        //-- On souhaite exploiter les fonctionnalités de la classe "FunctionAria"
        this.bAriaSnapshot  = true;

        const oData:AriaSnapshot = {
            page        : this.page,
            oTestInfo   : tesTinfo,
            fonction    : this.fonction
        }

        this.fonctionAria   = new FunctionAria(oData);

        //-- Propagation de l'information dans la classe "FunctionAria"
        if (this.verboseMode) {
            this.fonctionAria.verboseMod(true);
        }        

        //this.fonctionAria.verboseMod(true);

    }

    /**
     * 
     * @description : Affiche les nouveaux éléments de la page (ListBox, button, Input, etc.)
     */
    public async showNewElements(){
        return this.fonctionAria.showNewElements();
    }
    
}