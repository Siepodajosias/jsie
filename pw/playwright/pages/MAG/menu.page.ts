/**
 * Page MAGASIN > MENU
 * 
 * @author JOSIAS SIE & Abdoul SARBA
 * @version 3.29
 * 
 */

import { AriaSnapshot }                         from '@commun/types';

import { FunctionAria }                         from '@helpers/ariaSnapshot';
import { TestFunctions }                        from '@helpers/functions';
import { test, expect, Page, Locator, TestInfo }from '@playwright/test';

import { AltertesTraitement }                   from '@pom/MAG/alertes-traitement.page';


export class MenuMagasin {

    public  page                                : Page;
    public  menu                                : any;
    public  onglets                             : any;
    
    private readonly fonction                   : TestFunctions;
    private readonly pageAlertes                : AltertesTraitement;
    private readonly SELECTOR_VILLE             : string;
    private fonctionAria                        : FunctionAria;    
    private currentPage                         : string;
    private currentOnglet                       : string;
    private verboseMode                         : boolean;
    private bAriaSnapshot                       : boolean = false;

    private readonly linkOnglets                : Locator;
    public  readonly listBoxUser                : Locator;
    private readonly checkBoxLangueIT           : Locator;
    private readonly checkBoxLangueFR           : Locator;   
    public  readonly linkBrowserSecurity        : Locator;
    public  readonly inputVille                 : Locator;
    public  readonly listBoxVille               : Locator;
    public  readonly pPopinAlerteSanitaire      : Locator;
    public  readonly pPlabelAlerteSanitaire     : Locator;
    public  readonly pPbuttonFermer             : Locator;
    public  readonly linkMenus                  : Locator;
    public  readonly linkDeconnexion            : Locator;
    public  readonly linkDelegation             : Locator;
    public  readonly menuInMenusItem            : Locator;
    public  readonly ongletsAlertes             : Locator;
    public  readonly ongletsAuto                : Locator;
    public  readonly ongletSCFooterBtn          : Locator;
    public  readonly ongletACFooterBtn          : Locator;
    public  readonly alertVersionMessage        : Locator;

    //-- POPIN: Délégation en mon absence --------------------------------------------

    public  readonly  pPdelegButtonPlus         : Locator;
    public  readonly  pPdelegButtonEnregist     : Locator;

    public  readonly  pPdelegInputUser          : Locator;

    public  readonly  pPdelegTdLieuxVentes      : Locator;

    public  readonly  pPdelegLinkAnnuler        : Locator;

    public  readonly  pPdelegCheckBoxAllDeleg   : Locator;

   //---Message d'information--------------------------------------------------------------

    public  readonly  spanMessageInfo           : Locator;
    

   //----------------------------------------------------------------------------------------

    constructor (page: Page, fonction:TestFunctions = null) {
        
        this.SELECTOR_VILLE = '[ng-model="lieuVenteSelectionneInScope"]';

        this.menu = {
            accueil         : '#main-navbar .item0 a',
            commandes       : '#main-navbar .item1 a',
            stock           : '#main-navbar .item2 a',
            prix            : '#main-navbar .item3 a',
            facturation     : '#main-navbar .item4 a',
            ventes          : '#main-navbar .item5 a',
            emballages      : '#main-navbar .item6 a',        
            access          : '#main-navbar .item11 a',
            alertes         : '#main-navbar .item10 a',  
            preparation     : '#main-navbar .item12 a',     
            tableauBord     : '#main-navbar .item13 a',
            autorisations   : '#main-navbar .item7 a',                 
            referentiel     : '#main-navbar .item9 a',         
        };

        //------------------------------------------------------------------------------------------

        this.onglets = {

            //-----------------------Page accueil------------------------

            accueil: {
                commandes               : page.locator('a[href="#etat-commandes"]'),
                etatEngagements         : page.locator('a[href="#etat-engagements"]'),
                actualites              : page.locator('a[href="#app-affichage-actualite"]'),
                suiviEngagements        : page.locator('a[href="#suivi-engagements"]'),
                meteo                   : page.locator('a[href="#meteo"]')
            },

            //-----------------------Page commandes------------------------

            commandes: {
                commande                : page.locator('a[href="#commande"]').nth(0),
                achatSurPlace           : page.locator('a[href="#commande"]').nth(1),
                engagements             : page.locator('a[href="#commande"]').nth(2),
                opportunites            : page.locator('a[href="#opportunite"]'),
                commandeSelonModele     : page.locator('a[href="#commande"]').nth(3)
            },

            //-----------------------Page stock----------------------------

            stock: {
                livraisons              : page.locator('a[href="#livraisons"]'),
                stock                   : page.locator('a[href="#stock"]'),
                stockASurveiller        : page.locator('a[href="#stockASurveiller"]'),
                casse                   : page.locator('a[href="#casse"]'),
                dons                    : page.locator('a[href="#dons"]'),
                histoInventaire         : page.locator('a[href="#historiqueInventaires"]'),
                implantation            : page.locator('a[href="#implatationMagasin"]'),
                stockFinJournee         : page.locator('a[href="#stock-fin-journee"]')
            },

            //-----------------------Page Prix----------------------------

            prix: {
                gestionPrix             : page.locator('a[href="#gestionPrix"]'),
                impressionEtiquettes    : page.locator('a[href="#impressionEtiquettes"]')
            },

            //-----------------------Page facturation----------------------

            facturation: {
                blDefinitifs            : page.locator('a[href="#bons-livraisons"]'),
                demandeAvoir            : page.locator('a[href="#demandes-avoir"]'),
                demandeEchange          : page.locator('a[href="#demandes-echange"]')
            },

            //-----------------------Page ventes----------------------------

            ventes: {
                venteJournee            : page.locator('a[href="#analyse-ventes"]'),
                evenementsExceptionnels : page.locator('a[href="#evenement-exceptionnel"]')
            },

            //-----------------------Page emballages-----------------------

            emballages: {
                stockBons               : page.locator('a[href="#emballages"]'),
                suiviBons               : page.locator('a[href="#suiviDesbons"]')
            },

            //-----------------------Page alertes--------------------------

            alertes: {
                suiviCentrale           : page.locator('a[href="#suiviGeneral"]'),
                historiqueCentrale      : page.locator('a[href="#HistoriqueGeneral"]'),
                modeleAlertes           : page.locator('a[href="#modeleAlerte"]'),
                infosQualite            : page.locator('a[href="#suiviInfoQualite"]'),
                traitementMagasin       : page.locator('a[href="#traitementMagasin"]'),
                historiqueMagasin       : page.locator('a[href="#HistoriqueTraitementAlerte"]'),
                infoQualiteMagasin      : page.locator('a[href="#infoQualiteMagasin"]')
            },

            //-----------------------Page access---------------------------

            access: {
                lienExterne1            : page.locator('a[href="#lienExterne1"]'),
                lienExterne2            : page.locator('a[href="#lienExterne2"]')
            },

            //-----------------------Page autorisations--------------------

            autorisations: {
                autorisationAchatCentrale     : page.locator('a[href="#autorisations-ace"]'),
                modelesAssortiment            : page.locator('a[href="#autorisations-modele-assortiment"]'),
                autorisationLivraisonsDirectes: page.locator('a[href="#autorisations-asp"]'),
                engagements                   : page.locator('a[href="#autorisations-engagement"]'),
                opportunites                  : page.locator('a[href="#autorisations-opportunite"]'),
                modelesCommande               : page.locator('a[href="#modeles-commande"]'),
                actualite                     : page.locator('a[href="#actualites"]'),
                parametrage                   : page.locator('a[href="#parametrage"]'),
                blocage                       : page.locator('a[href="#blocage"]'),
                echanges                      : page.locator('a[href="#echanges"]'),
                groupeMagasins                : page.locator('a[href="#groupes-magasins"]'),
                gammes                        : page.locator('a[href="#gammes"]'),
                recomOuverture                : page.locator('a[href="#recommandations-ouverture"]'),
                prixLocaux                    : page.locator('a[href="#prix-locaux"]')
            },

            //-----------------------Page referentiel----------------------

            referentiel: {
                admin                         : page.locator('a[href="#admin"]'),
                communication                 : page.locator('a[href="#communicationUtilisateur"]'),
                renvoyer                      : page.locator('a[href="#renvoyerCommandes"]'),
                suppimer                      : page.locator('a[href="#supprimerCommandes"]'),
                modifEngagement               : page.locator('a[href="#modifierEngagements"]'),
                GenerAuto                     : page.locator('a[href="#generationsAutomatiques"]'),
                suiviGener                    : page.locator('a[href="#suiviGenerationsAc"]'),
                executor                      : page.locator('a[href="#executors"]'),
                changelog                     : page.locator('a[href="#changelog"]'),
                parametrage                   : page.locator('a[href="#parametrage"]'),
                LDV                           : page.locator('a[href="#lieuxVente"]'),
                stockDLC                      : page.locator('a[href="#stockDlc"]'),
                utilisateurs                  : page.locator('a[href="#utilisateurs"]'),
                verrous                       : page.locator('a[href="#verrous"]')
            }

        };

        this.pageAlertes            = new AltertesTraitement(page);

        this.linkOnglets            = page.locator('ul.nav-tabs li a');
        this.listBoxUser            = page.locator('div.login-utilisateur a.dropdown-toggle');
        this.linkDeconnexion        = page.locator('[ng-click="deconnexion();"]');
        this.linkDelegation         = page.locator('[ng-click="delegation();"]');
        this.linkMenus              = page.locator('ul.nav');
        this.linkBrowserSecurity    = page.locator('[ng-click="$event.preventDefault(); navigateurNonSupporte = false;"]');

        this.checkBoxLangueIT       = page.locator('input[id="it"]');
        this.checkBoxLangueFR       = page.locator('input[id="fr"]');

        this.inputVille             = page.locator('[ng-model="autocompleteLieuDeVente.codeLieuDeVente"]');

        this.listBoxVille           = page.locator(this.SELECTOR_VILLE);

        this.pPopinAlerteSanitaire  = page.locator('div[pfocustrap].p-dialog-draggable');// //('.modal[data-backdrop="static"]').nth(2)

        this.pPlabelAlerteSanitaire = page.locator('div[pfocustrap] .p-dialog-header span.p-dialog-title');// ('div.popup-information H3.modal-title')  ('div[pfocustrap] .p-dialog-header')

        this.pPbuttonFermer         = page.locator('.p-dialog-footer button span.p-button-label');// ('.popup-information > div.modal-footer > a')

        this.menuInMenusItem        = page.locator('#main-navbar li a[ng-click="$event.preventDefault();"] span:nth-child(1)') ;

        this.ongletsAlertes         = page.locator('[ng-controller="AlerteControleur"] ul li a[ng-click="$event.preventDefault();"]');
        this.ongletSCFooterBtn      = page.locator('div.form-btn-section div.containerBT button:NOT([ng-show="!estLectureSeule()"])');
        this.ongletsAuto            = page.locator('[ng-controller="AutorisationsControleur"] ul li a[ng-click="$event.preventDefault();"]');
        this.ongletACFooterBtn      = page.locator('div.form-btn-section div.containerBT button');

        //-- POPIN: Délégation en mon absence --------------------------------------------

        this.pPdelegButtonPlus      = page.locator('[title="Ajouter le délégué au lieu de vente."]');
        this.pPdelegButtonEnregist  = page.locator('.modal-footer button[ng-click="onClickOk()"]').nth(1)
        
        this.pPdelegInputUser       = page.locator('#autocompleteUser');

        this.pPdelegTdLieuxVentes   = page.locator('tbody .datagrid-designation');

        this.pPdelegLinkAnnuler     = page.locator('.modal-footer a[ng-click="onClickClose($event)"]').nth(1);

        this.pPdelegCheckBoxAllDeleg= page.locator('modal[titre="Délégation en mon absence"] .modal-body datagrid thead input[type="checkbox"]');

        // ----Message d'information---------------------------------------------------------

        this.spanMessageInfo        = page.locator('.texte-message-information ')
        this.alertVersionMessage    = page.locator('.app-update');

        // -------------------------------------------------------------------------------------
       
        this.fonction               = fonction;
        this.page                   = page;
        
        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }

    }

    /**
     * 
     * @description : selectionne la langue dans le menu utilisateur 
     * @param {string} lang - Code pays
     * 
     */
    public async selectLang(lang:string = 'it') {
        await this.listBoxUser.click();
        if (lang == 'it') {
            await this.checkBoxLangueIT.click();
        } else {
            await this.checkBoxLangueFR.click();            
        }
    }

    /**
     * 
     * @desc : Sélectionnne une ville de la liste déroulante située dans le menu
     * @param {string} ville - Nom de la ville (Exemple : 'Bergerac (550)')
     * @param {Page} page
     * 
     */
    public async selectVille(ville: string, page:Page) {      

        const clickable  = await page.isEnabled(this.SELECTOR_VILLE);

        if (clickable) {

            //-- Résilience à la fluctuation des libellés des lieux de vente...
            const jddLDV = require('../../conf/lieu_vente.conf.json');

            let regex = new RegExp(/\([a-zA-Z]\d{3}\)/g, "i");      // The "i" flag makes the regex case-insensitive

            if (this.fonction.isRoleAssignated('ADMIN') || this.fonction.isRoleAssignated('GESTIONNAIRE COMMANDE') || this.fonction.isRoleAssignated('REPARTITEUR')) {           
                const aMatch = regex.exec(ville);                   //-- Le code exemple : "(F702)"
                for (const key in jddLDV) {
                    var value = jddLDV[key];
                    if (value.includes(aMatch[0])) {
                        ville = value;
                        break;
                    }
                }
            } else {
                ville = ville.replace(regex,'').trim();             //-- On enlève le code du lieu de vente quand on n'est pas connecté en tant que Admin
            }

            this.fonction.addDataSheet('ListBox', 'Lieu de Vente', ville);
            await this.listBoxVille.selectOption({label: ville});
            await this.fonction.highlightSelector(page.locator(this.SELECTOR_VILLE));
            await this.fonction.waitTillHTMLRendered(page, 30000, false);
            await this.removeArlerteMessage(page);                  // Peut être qu'une alerte Sanitaire est apparue ?
        }else {
            throw new Error('Ooops : ListBox des Lieux de vente non sélectionnable');
        }
        
    }

    /**
     * 
     * @desc : Suppression du message d'alerte si celui-ci s'affiche ET traite l'alerte si nécessaire
     * 
     */
    public async removeArlerteMessage(page:Page) {          

        //-- Un message de type "Alerte Sanitaire" est il affiché ?
        if (await this.pPlabelAlerteSanitaire.isVisible()) { 

            //-- Quel type de message d'alerte s'affiche t-il ?
            const sTypeMessage = await this.pPbuttonFermer.textContent();

            //-- On ferme le message (qui antraîne ou non une redirection vers la page "alertes", onglet "Traitement Magasin")
            await this.fonction.clickAndWait(this.pPbuttonFermer, page);

            //-- Si il s'agit d'une alerte de type bloquante
            if (sTypeMessage == "Traiter l'alerte"){
                
                const sCommentaire:string   = 'TA_Traitement Alerte Commentaire ' + this.fonction.getToday('FR') + this.fonction.getHMS();   

                //-- Filtre sur les alertes à traiter uniquement
                await this.fonction.clickAndWait(this.pageAlertes.toggleATraiter, page);

                //-- Combien d'alertes sont à traiter ? Normalement au moins 1...
                const iNbAlertes = await this.pageAlertes.checkBoxAlertes.count();

                if (this.verboseMode) {
                    this.fonction.cartouche("-- Nombre d'Alertes Bloquantes à Traiter : ",iNbAlertes.toString());
                }

                //-- Le temps de traitement des alertes sanitaire risque de dépasser le timeout par défaut
                test.setTimeout(300000);  

                //-- Traitement de toutes les alertes
                for(let iCpt=0; iCpt < iNbAlertes; iCpt++) {

                    //-- On sélectionne une alerte (ici la dernière de la liste)
                    await this.fonction.clickElement(this.pageAlertes.checkBoxAlertes.last());

                    //-- Le bouton "Traiter" est il actif ?
                    var isActive  = await this.pageAlertes.buttonTraiter.isEnabled();

                    //-- Si oui, on traite l'alerte...
                    if(isActive){
                        await this.fonction.clickAndWait(this.pageAlertes.buttonTraiter, page);
                    }

                    //-- La popin "Traitement de l'alerte" s'ouvre et affiche un formulaire contenant plusieurs champs (dont un champ commentaire)
                    var isVisible = await this.pageAlertes.pPtextAreaTraitComm.isVisible();

                    //-- Si le champ commentaire est présent, on le rempli
                    if(isVisible){
                        await this.fonction.sendKeys(this.pageAlertes.pPtextAreaTraitComm, sCommentaire + " #" + (iCpt + 1) + "/" + iNbAlertes, false, 'Commentaire Alerte');
                    }

                    //-- On clique sur le bouton "Finaliser" qui vas fermer la poin et ouvrir un nouvel onglet
                    await this.fonction.noHtmlInNewTab(page, this.pageAlertes.pPbuttonTraitFinaliser);

                }

                //-- Une fois les alertes traitées, on retourne sur la page sur laquelle nous souhaitions accéder initialement
                this.click(this.currentPage, page);

                //-- Si on était sur un onglet spécifique, on y retourne également
                if (this.currentOnglet !== undefined && this.currentOnglet !== '') {
                    this.clickOnglet(this.currentPage, this.currentOnglet, page);
                } 
                
            } 

        } 

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
     * 
     * @desc vérifie si un menu est visible
     * 
     * @param {string} cible Libellé du menu
     * @param {bool} present Visible or not...
     */
    public async isMenuPresent(cible: string, present: boolean = true) {
        if (present) {
            var aItemList = await this.linkMenus.allTextContents();
            expect(aItemList).toContain(cible);
        } else {
            var aItemList = await this.linkMenus.allTextContents();
            expect(aItemList).not.toContain(cible);
        }
    }

    /**
    * 
    * Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    * @param {string} pageName   Le nom de la page
    * @param {string} ongletName Le nom de l'onglet
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (this.onglets[pageName][ongletName]) {

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Onglet : ",ongletName);
            }

            //-- Click effectif sur le lien de l'onglet
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            
            this.currentPage    = pageName;                 // On mémorise la page sur laquelle on se trouve
            this.currentOnglet  = ongletName;               // On mémorise l'onglet sur lequel on se trouve

            //-- Potentiellement on examin eles clefs de traduction
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());

            //-- attente du chargement de la page
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Suppression des messages d'alerte sanitaire si iles sont présents
            await this.removeArlerteMessage(page);                             // Peut être qu'une alerte Sanitaire est apparue ?

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(this.currentPage, this.currentOnglet)
            }

        } else {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }
            
    }  

    /**
    * 
    * Click sur le bouton {cible} du menu
    * 
    * @param {string} cible 
    */
    public async click(pageName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {

             // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
                console.log('Alerte visible');
                const element = page.locator('.app-update');              
                await element.evaluate((node) => node.classList.add('ng-hide'));
                console.log('Ajout de l\'attribut hidden');        
        }

        if (typeof(this.menu[pageName]) === 'string' ) {  
            
            //-- Détermination du nom de l'onglet par défaut
            var sNomOnglet = 'NotExists';
            if(this.onglets[pageName] !== undefined) {
                sNomOnglet = Object.keys(this.onglets[pageName])[0];
            }

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Page : ", pageName + " (Onglet par défaut : " + sNomOnglet +")");
            }
            
            const target = page.locator(this.menu[pageName]);
            //--On bascule sur la nouvelle page
            //await target.click();
            await this.fonction.clickElement(target);

            this.currentPage = pageName;                                        // On mémorise la page sur laquelle on se trouve
           
            //-- Potentiellement on examin eles clefs de traduction
            this.fonction.checkTraductions(await target.textContent());

            //-- attente du chargement de la page
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Suppression des messages d'alerte sanitaire si iles sont présents
            await this.removeArlerteMessage(page);

            //-- On click sur le premier onglet afin d'activer la coloration de l'onglet
            if (sNomOnglet !== 'NotExists')   {
                //await this.fonction.clickElement(this.onglets[pageName][sNomOnglet]);
            }

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, sNomOnglet);
            }

        } else {
            throw new Error('Ooops : Elément du menu "' + pageName + '" inconnu');
        }
            
    } 

     /**
     * 
     * @param {string} pageName       : Nom du menu
     * @param {string} ongletName     : Nom de l'Onglet (optionnel)
     * @param {Page} page
     * @returns Nombre pastilles
     * @description Retourle le nombre de pastilles visibles dans le menu ou l'onglet
     * 
     **/
    public async getPastilles (pageName:string,  page: Page, ongletName: string = '') {
        if (ongletName !== '') {
            // On souhaite afficher le nombre de pastilles contenues dans l'ONGLET
            const tbOngletName = Object.keys(this.onglets[pageName]);
            const index        = tbOngletName.indexOf(ongletName);

            if (index > -1) {
                const ePastille = page.locator(`ul.nav-tabs li:nth-child(${index + 1}) span.badge-important:not(.ng-hide)`);
                
                if (await ePastille.isVisible()) {
                    const iNbPastilles = await ePastille.innerText();
                    return parseInt(iNbPastilles, 10);
                } else {
                    return 0;
                }
            } else {
                throw new Error(`NotFoundError : Onglet "${ongletName}" inconnu dans la page "${pageName}".`);
            }
        } else {
            // On souhaite afficher le nombre de pastilles contenues dans le MENU
            if (typeof this.menu[pageName] === 'string') {
                const ePastille = page.locator(`${this.menu[pageName]} span.badge-important:not(.ng-hide)`);
    
                if (await ePastille.isVisible()) {
                    const iNbPastilles = await ePastille.innerText();
                    return parseInt(iNbPastilles, 10);
                } else {
                    return 0;
                }
            } else {
                throw new Error(`NotFoundError : Élément du menu "${pageName}" inconnu.`);
            }
        }
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