/**
 * 
 * QUALITE PAGE > MENU
 * 
 * @author SIAKA KONE
 * @version 3.5
 * 
 */

import { TestFunctions }            from "@helpers/functions";
import { Locator, Page, expect }    from "@playwright/test";

export class MenuQualite {

    private readonly menu                   : any;
    public readonly onglets                 : any;
    public readonly page                    : Page;
    private verboseMode                     : boolean;

    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;

    public readonly listeBoxPlateforme      : Locator;
    public readonly listeBoxRayon           : Locator;
    public readonly listeBoxDropdowItem     : Locator;
    public readonly linkOnglets             : Locator;
    public readonly listeBoxMultiple        : Locator;
    public readonly inputMultiple           : Locator;
    public readonly inputQuestionnaire      : Locator;

    public readonly checkBoxQuestionnaire   : Locator;
    public readonly checkBoxLieuVente       : Locator;
    public readonly checkBoxMultiple        : Locator;
    public readonly alertVersionMessage     : Locator;

    private readonly linkPages              : Locator

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            home            : 0,
            controles       : 1,
            planification   : 2,
            referentiel     : 3,      
            admin           : 4
        };

        this.onglets = {
            controles       : {
                arrivages                   : page.locator('a[href="/controles/arrivages"]'),
                historiquesControles        : page.locator('a[href="/controles/historique-controles"]'),
                magasins                    : page.locator('a[href="/controles/magasins"]'),
                temperatures                : page.locator('a[href="/controles/temperatures"]')
            },

            planification   : {
                arrivages                   : page.locator('a[href="/planification/arrivages"]')
            },

            referentiel     : {
                questionnaires              : page.locator('a[aria-label="Questionnaires"]'),
                detailQuestionnaire         : page.locator('a[aria-label="Détail d\'un questionnaire"]'),
                articles                    : page.locator('a[aria-label="Articles"]'),
                mobiliers                   : page.locator('a[aria-label="Mobiliers"]')
            },

            admin           : {
                administration              : page.locator('a[href="/admin/administration"]'),
                gestionUtilisateurs         : page.locator('a[href="/admin/gestion"]'),
                communicationUtilisateurs   : page.locator('a[href="/admin/communication"]'),
                changelog                   : page.locator('a[href="/admin/changelog"]')
            }
        };

        this.linkPages          = page.locator('a.nav-link');
        this.listBoxUser        = page.locator('#utilisateurDropdown');
        this.linkDeconnexion    = page.locator('div.utilisateur-drop-down button.btn-link');
        this.linkOnglets        = page.locator('ul.p-tabmenu-nav li a');
        
        this.listeBoxPlateforme = page.locator('#plateforme chevrondownicon');
        this.listeBoxRayon      = page.locator('.navbar-nav p-dropdown');
        this.listeBoxDropdowItem= page.locator('.p-dropdown-item.p-ripple');
        this.listeBoxMultiple   = page.locator('p-multiselect div.p-multiselect-label');

        this.inputMultiple      = page.locator('.p-multiselect-filter');
        this.inputQuestionnaire = page.locator('.selection-questionnaire input.p-multiselect-filter');

        this.checkBoxQuestionnaire  = page.locator('.selection-questionnaire .p-multiselect-item');
        this.checkBoxLieuVente  = page.locator('.selection-lieu-vente .p-multiselect-item');
        this.checkBoxMultiple   = page.locator('.selection-filtre .p-multiselect-item');
        this.alertVersionMessage= page.locator('.app-update');

        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }

    }

    /**
     * 
     * @param {string} cible L'identifiant du menu
     * @param {Page} page
     * @description Click sur le bouton {cible} du menu
     * 
     */
    public async click(cible: string, page: Page) {     

        if (this.verboseMode) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }
        // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.setAttribute('hidden',""));
            console.log('Ajout de l\'attribut hidden');          
        }

        if (typeof(this.menu[cible]) === 'number' ) {  
            await this.fonction.clickElement(this.linkPages.nth(this.menu[cible]));
            await this.fonction.waitTillHTMLRendered(page, 50000, this.verboseMode);
        } else {
            throw new Error('TypeError: Elément du menu "' + cible + '" inconnu');
        }

    } 

    
    /**
    *  
    * @param {string} pageName    
    * @param {string} ongletName 
    * @description Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }
        try{  
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(await this.onglets[pageName][ongletName].textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } catch(erreor) {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }

    /**
     * @description Sélectionner la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string}  sLibellePlateforme - élément de la liste déroulante devant être sélectionnée
     */
    public async selectPlateformeByName(sLibellePlateforme:string, page:Page) {
        await this.fonction.clickElement(this.listeBoxPlateforme);
        await this.fonction.clickElement(this.listeBoxDropdowItem.filter({hasText:sLibellePlateforme}));
        await this.fonction.addDataSheet('ListBox', 'Plateforme', sLibellePlateforme);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * @description Sélectionner la rayon (Liste déroulante située dans le menu)
     * 
     * @param {string}  sLibelleRayon - élément de la liste déroulante devant être sélectionnée
    */
    public async selectRayonByName(sLibelleRayon:string, page:Page) {
        await this.fonction.clickElement(this.listeBoxRayon);
        await this.fonction.clickElement(this.listeBoxDropdowItem.filter({hasText:sLibelleRayon}));
        await this.fonction.addDataSheet('ListBox', 'Rayon', sLibelleRayon);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * @description Sélectionner le lieu de vente (Liste déroulante située dans le menu)
     * 
     * @param {string}  sLibelleLieuDeVente - élément de la liste déroulante devant être sélectionnée
    */

    public async selectLieuDeVenteByName(sLibelleLieuDeVente:string, page:Page) {
        await this.fonction.clickElement(this.listeBoxMultiple.nth(0));
        await this.fonction.sendKeys(this.inputMultiple,sLibelleLieuDeVente, false, 'Lieu De Vente');
        await this.fonction.wait(page, 250);
        await this.fonction.clickElement(this.checkBoxLieuVente.filter({hasText:sLibelleLieuDeVente}));
    }

    /**
     * @description Sélectionner le type de contrôle (Liste déroulante située dans le menu)
     * 
     * @param {string}  sLibelleTypeDeContrôle - élément de la liste déroulante devant être sélectionnée
    */

    public async selectTypeDeControleByName(sLibelleTypeDeContrôle:string,  page:Page) {
        await this.fonction.clickElement(this.listeBoxMultiple.nth(1));
        await this.fonction.sendKeys(this.inputMultiple.nth(1),sLibelleTypeDeContrôle, false, 'Lieu De Vente');
        await this.fonction.wait(page, 250);
        await this.fonction.clickElement(this.checkBoxMultiple.filter({hasText:sLibelleTypeDeContrôle}));
        await this.fonction.clickElement(this.listeBoxMultiple.nth(1));
    }

    /**
     * @description Sélectionner un questionnaire (Liste déroulante située dans le menu)
     * 
     * @param {string}  sLibelleQuestionnaire - élément de la liste déroulante devant être sélectionnée
    */
    public async selectQuestionnaireByName(sLibelleQuestionnaire:string, page:Page) {
        await this.fonction.clickElement(this.listeBoxMultiple.nth(2));
        await this.fonction.sendKeys(this.inputQuestionnaire, sLibelleQuestionnaire, false, 'Questionnaire');
        await this.fonction.wait(page, 250);
        await this.fonction.clickElement(this.checkBoxQuestionnaire.filter({hasText:sLibelleQuestionnaire}).last());
    }

    /**
     * 
     * @desc vérifie si un onglet est visible
     * 
     * @param {string} cible Libellé de l'onglet
     * @param {bool} present Visible or not...
     */
    public async isOngletPresent(cible: string, present: boolean = true) {
        if (present) {
            var aItemList = await this.linkOnglets.allTextContents(); //textContent()
            expect(aItemList).toContain(cible);
        } else {
            var aItemList = await this.linkOnglets.allTextContents();
            expect(aItemList).not.toContain(cible);
        }
    }

    /**
     * @description Vérifie qu'un liste déroulante est bien présente, contient des valeurs et vérifie qu'elles sont triées (option)
     * @param selector 
     * @param bDisabled 
     */
    public async checkListBox(selector:Locator, bDisabled:boolean = true) {

        // Dans tous les cas l'élément doit être visible...
        await this.fonction.isDisplayed(selector);

        // Si la listeBox n'est pas grisée (Un élement déjà selectionné)
        if (await selector.locator('.p-disabled').count() === 0) {

            bDisabled = false;

            //on click sur la liste déroulante de façon à exposer son contenu
            await this.fonction.clickElement(selector);

            expect(await this.listeBoxDropdowItem.count()).toBeGreaterThan(0);

            // On referme la liste déroulante en clickant une nouvelle fois sur la liste déroulante pour ne pas géner les traitements suivants.
            await this.fonction.clickElement(selector); 

        } else {
            this.fonction.log.set('Un élement déjà selectionné (ListeBox grisée)');
        }

    }

    
}