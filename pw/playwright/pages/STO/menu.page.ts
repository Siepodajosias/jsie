/**
 * Page STOCK > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.11
 * 
 */
import { TestFunctions }    from '@helpers/functions';
import { Page, Locator }    from '@playwright/test';

export class MenuStock{

    public  menu                            : any;
    public  onglets                         : any;

    public  readonly listBoxUser            : Locator;
    public  readonly linkDeconnexion        : Locator;

    public  readonly buttonEnregistrerProfil: Locator;
    public  readonly pictoToasterClose      : Locator;
    public  readonly pictoLangueFR          : Locator;
    public  readonly pictoLangueIT          : Locator;
    public  readonly linkParametrage        : Locator;
    public  readonly listBoxPlateforme      : Locator;
    public  readonly alertVersionMessage    : Locator;

    private verboseMode                     : boolean;

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : '#main-navbar .item0 a',
            reception       : '#main-navbar .item1 a',
            expedition      : '#main-navbar .item2 a',
            stock           : '#main-navbar .item3 a',
            inventaire      : '#main-navbar .item4 a',
            reappro         : '#main-navbar .item5 a',
            emballage       : '#main-navbar .item6 a',
            referentiel     : '#main-navbar .item7 a',       
            admin           : '#main-navbar .item8 a'       
        };

        this.onglets = {
            //-----------------------Page reception----------------------------------
            reception: {
                livraisonsAttendues : page.locator('a[href="#attendues"]'),
                receptionsEnCours   : page.locator('a[href="#encours"]'),
                ReceptionsTerminees : page.locator('a[href="#terminees"]'),
                LotsAAgreer         : page.locator('a[href="#agreagelots"]')
            },

            //-----------------------Page expedition----------------------------------
            expedition: {
                palettesExpedier    : page.locator('a[href="#prevues"]'),
                expeditionsEnCours  : page.locator('a[href="#encours"]'),
                expeditionsTerminees: page.locator('a[href="#terminees"]')
            },

            //-----------------------Page stock---------------------------------------
            stock: {
                stock               : page.locator('a[href="#stock"]'),
                situation           : page.locator('a[href="#situationPalettes"]'),
                refus               : page.locator('a[href="#refus"]'),
                dons                : page.locator('a[href="#dons"]'),
                alertesEtBlocages   : page.locator('a[href="#alerteSanitaire"]'),
                historique          : page.locator('a[href="#mouvements"]'),
                emplacements        : page.locator('a[href="#occupationEmplacements"]')
            },

            //-----------------------Page inventaire-----------------------------------
            inventaire: {
                inventaire          : page.locator('a[href="#inventaire"]'),
                ecarts              : page.locator('a[href="#ecarts"]')
            },

            //-----------------------Page reapprovisinement----------------------------
            reappro: {
                supervision         : page.locator('.p-tabview-nav > li > a').nth(0),
                aFaire              : page.locator('.p-tabview-nav > li > a').nth(1),
                enCours             : page.locator('.p-tabview-nav > li > a').nth(2),
                termine             : page.locator('.p-tabview-nav > li > a').nth(3),
                annule              : page.locator('.p-tabview-nav > li > a').nth(4)
            },

            //-----------------------Page emballage-----------------------------------
            emballage: {
                reception           : page.locator('li[role="presentation"] a').nth(0),
                livraison           : page.locator('li[role="presentation"] a').nth(1),
                mouvementsEmballages: page.locator('li[role="presentation"] a').nth(2),
                referentiel         : page.locator('li[role="presentation"] a').nth(3)
            },

            //-----------------------Page referentiel---------------------------------
            referentiel: {
                articles            : page.locator('a[href="#article"]'),
                parametres          : page.locator('a[href="#impression"]'),
                emplacements        : page.locator('a[href="#emplacements"]'),
                planPlateforme      : page.locator('a[href="#planPlateforme"]'),
                paramRefusAgreage   : page.locator('a[href="#parametrageRefusAgreage"]'),
                dimensionColis      : page.locator('a[href="#dimensionsColisAValider"]'),
                rangement           : page.locator('a[href="#rangement"]')
            },

            //-----------------------Page administration-------------------------------
            admin: {
                administration      : page.locator('a[href="#administration"]'),
                transit             : page.locator('a[href="#mobilite"]'),
                stockMobile         : page.locator('a[href="#stockMobile"]'),
                parametre           : page.locator('a[href="#GroupeArticlePlateforme"]'),
                changelog           : page.locator('a[href="#changelog"]'),
                commuUtilisateur    : page.locator('a[href="#communicationUtilisateur"]'),
                categorieEmplacement: page.locator('a[href="#categorieEmplacementPlateforme"]')
            }
        }                

        this.listBoxPlateforme          = page.locator('[ng-model="plateforme"]');
        this.listBoxUser                = page.locator('menu-utilisateur-wrapper a');

        this.linkDeconnexion            = page.locator('span.pi-sign-out');     
        this.linkParametrage            = page.locator('span.pi-cog');

        this.pictoLangueIT              = page.locator('span.flag-icon-it');
        this.pictoLangueFR              = page.locator('span.flag-icon-fr');
        this.pictoToasterClose          = page.locator('timesicon');

        this.buttonEnregistrerProfil    = page.locator('div.p-sidebar-footer p-button button:NOT(.p-button-link)');

        this.alertVersionMessage        = page.locator('.app-update');

        this.fonction                   = fonction;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }
        
    }

    //------------------------------------------------------------------------------------------

    /**
     * 
     * Click sur l'onglet {ongletName} situé sur la page {pageName}
     * 
     * @param {string} pageName      
     * @param {string} ongletName 
     */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ", ongletName);
        }

        if (this.onglets[pageName][ongletName]) {
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());                                        
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".');
        } 
    }

    /**
     * 
     * Click sur le bouton situé dans le menu
     * 
     * @param {string} cible 
     */
    public async click(cible: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {
        
        // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.classList.add('ng-hide'));
            console.log('Ajout de l\'attribut hidden');           
        }

        if (typeof(this.menu[cible]) === 'string' )
        {
            var target =  page.locator(this.menu[cible]);
            this.fonction.checkTraductions(await page.locator(this.menu[cible]).textContent());              
            await target.click();
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu');
        }
    }

    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string(3)} idPlateforme 
     */
    public async selectPlateforrme(page: Page, idPlateforme: string) {
        await this.listBoxPlateforme.click();
        await this.listBoxPlateforme.selectOption({label: idPlateforme });
        await this.fonction.addDataSheet('ListBox', 'Plateforme', idPlateforme);
        await this.fonction.highlightSelector(this.listBoxPlateforme);
        await this.listBoxPlateforme.click();
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }


     /**
     * Sélectionne le rayon (Liste déroulante située dans le menu)
     * 
     * @param {string}  cible - élément de la liste déroulante devant être sélectionnée
     */
    public async selectRayonByName(cible:string, page:Page) {
        this.fonction.highlightSelector(page.locator('#choix-rayon'));
        await this.fonction.addDataSheet('ListBox', 'Menu Rayon', cible);
        await page.selectOption('#choix-rayon', cible);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * @desc : Sélectionnne une Plateforme de la liste déroulante située dans le menu
     * @param {string} plateforme - Nom de la Plateforme (Exemple : 'Cremilan')
     * 
     */
    public async selectPlateformeByLabel(page: Page, plateforme:string, selector = this.listBoxPlateforme) {
        await selector.click();
        await selector.selectOption({label: plateforme });
        await this.fonction.addDataSheet('ListBox', 'Plateforme', plateforme);
        await this.fonction.highlightSelector(selector);
        await selector.click();
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * @desc : Sélectionnne une Plateforme de la liste déroulante située dans le menu
     * @param {string} plateforme - Identifiant de la Plateforme (Exemple : 'CHA')
     * 
     */
    public async selectPlateformeByValue(page: Page, plateforme: string, selector = this.listBoxPlateforme) {
        await selector.click();
        await selector.selectOption({label: plateforme });
        await this.fonction.addDataSheet('ListBox', 'Plateforme', plateforme);
        await this.fonction.highlightSelector(selector);        
        await selector.click();
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * @desc : selectionne la langue dans le menu utilisateur 
     * @param {string} sLang - Code pays
     * 
     */
    public async selectLang(sLang = 'it', page:Page):Promise<void> {

        await this.listBoxUser.click();
        await this.linkParametrage.isEnabled().then( async () => {
            await this.linkParametrage.click().then( async ()=> {
                if (sLang == 'it') {
                    await this.pictoLangueIT.click();
                } else {
                    await this.pictoLangueFR.click();            
                }
                this.fonction.log.set('Langue : ' + sLang);
                await this.buttonEnregistrerProfil.click().then( async () => {
                    await this.pictoToasterClose.isEnabled().then( async () => {
                     await this.pictoToasterClose.click();
                    })                    
                })
                await this.fonction.waitTillHTMLRendered(page, 30000, false);
            })
        });
    }

    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string} idPlateforme - Nom de la plateforme
     */
    public async selectPlateformeByName(page: Page, idPlateforme: string) {
        await this.listBoxPlateforme.click();
        await this.listBoxPlateforme.selectOption({label: idPlateforme });
        await this.listBoxPlateforme.click();
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }    

    public async getSelectedPlateforme () {
        this.listBoxPlateforme.locator('option:checked').textContent().then( async (selectedPlateformeName) => {           
            return selectedPlateformeName;            
        })
    }
};
