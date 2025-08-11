/**
 * Appli    : MAGASIN 
 * Page     : COMMANDES 
 * Onglet   : COMMANDE
 * 
 * @author JOSIAS SIE
 * @version 3.10
 * 
 */
import { Page }            from '@playwright/test';

import { TestFunctions }   from '@helpers/functions';

export class CommandesCommande {
    
    public fonction                         = new TestFunctions();

    public readonly messageErreur           = this.page.locator('.feedback-error:NOT(.ng-hide) li');

    public readonly buttonSaisirStockEmb    = this.page.locator('[ng-click="saisirStockEmballage()"]');
    public readonly buttonAFaire            = this.page.locator('#btn-statut-commande-A_FAIRE');//('.statut-commandes button');
    public readonly buttonImprimer          = this.page.locator('[ng-click="imprimerPourCommande(commandeSelectionnee)"]');
    public readonly buttonSaisieEmb         = this.page.locator('[ng-click="saisirStockEmballage()"]');
    public readonly buttonSynthese          = this.page.locator('[ng-click="syntheseGlobale()"]');    
    public readonly buttonEnregistrer       = this.page.locator('[ng-click="enregistrer()"]');
    public readonly buttonEnvoyer           = this.page.locator('[ng-click="envoyer()"]');    
    public readonly buttonEmballageEnregistrer  = this.page.locator('.popup-saisir-stock-emballage.in > div.modal-footer > button');

    public readonly gridCmdesChkBox         = this.page.locator('.datagrid-table-wrapper > table > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
    public readonly gridCmdes               = this.page.locator('.datagrid-table-wrapper > table > tbody > tr');    

    public readonly totaux                  = this.page.locator('.total-previsions').nth(0);

    public readonly inputQteCmdee           = this.page.locator('.datagrid-quantiteCommandee > input');
    public readonly inputQtiePrev           = this.page.locator('td.datagrid-quantitePrevisionnelle > input')
    public readonly inputQtePrevSuiv        = this.page.locator('td.datagrid-quantitePrevisionnelleSuivante > input')
    public readonly inputNbEmballage        = this.page.locator('#input-stockEmballage');
    public readonly inputFamilleArticle     = this.page.locator('.filtres > span > input.filter-input');
    
    public readonly listArticle             = this.page.locator('.datagrid-conditionnement-designation');

    public readonly labelDernierEnvoi       = this.page.locator('.containerBT > span');
    public readonly labelCommandeMinimum    = this.page.locator('.minimum-commande');
    public readonly labelConditionnementD   = this.page.locator('td.datagrid-conditionnement-designation > span');
    public readonly labelCodetD             = this.page.locator('td.datagrid-article-code > span');

    public readonly lineArticle             = this.page.locator('#dg-lignes-commandes-AC tbody tr')
    public readonly listBoxGrpArticle       = this.page.locator('#input-groupe');

    public readonly datePickerCommande      = this.page.locator('#datepicker-date-commande .link');
    public readonly datePickerLinkPrev      = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                          // bouton mois précédent du calendrier
    public readonly dateTrPickerDay         = this.page.locator('div.datepicker-days > table > tbody > tr ');                                  // bouton mois précédent du calendrier
    public readonly datePickerFirstDay      = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');   // premier jour du calendrier

    public readonly toggleStatut            = this.page.locator('div.statut-commandes button');               // 5 Boutons : "A faire" / "En cours" / Etc.

    public readonly dataGridListesCmd       = this.page.locator('.liste-commandes th.sortable');
    public readonly dataGridLignesCmd       = this.page.locator('.lignes-commandes th');

    public readonly dataGridLibelleCmd      = this.page.locator('td.datagrid-designation');
    public readonly dataGridStatus          = this.page.locator('td.datagrid-statut-designation');
    public readonly dataGridSpinner         = this.page.locator('.datagrid-statut-designation .timer');

    public readonly labelStockEmballage     = this.page.locator('.stock-emballage');

    public readonly tdCommandes             = this.page.locator('.liste-commandes td');

    public readonly lignesArticles          = this.page.locator('#dg-lignes-commandes-AC > div > div.datagrid-table-wrapper > table > tbody > tr');
    public readonly tdCodeArticle           = this.page.locator('td.datagrid-article-code > span');
    public readonly dataGridTdquantitePrev  = this.page.locator('table tbody tr td.datagrid-quantiteCommandee');
    public readonly dataGridTdquantiteRef   = this.page.locator('table tbody tr td.datagrid-quantitePrevisionnelle'); 

    public readonly tdDateLivraison         = this.page.locator('th.center.datagrid-quantiteCommandee span');

    public readonly pPspinnerEnvoiCommande  = this.page.locator('i.app-spinner.loading');
    public readonly pPMessageSuccess        = this.page.locator('i.success');
    public readonly pPspinnerFooterMenu     = this.page.locator('div[ng-show="showProgressBarButtons"]:NOT(.ng-hide)');

    //-- POPIN : Saisir le stock d'emballages -----------------------------------------------------------------------
    public readonly pPinputStock            = this.page.locator('p-inputnumber[formcontrolname="nouvelleQuantiteStockEmballage"] input');

    public readonly pPbuttonEnregistrer     = this.page.locator('div.p-dialog-footer  button');

    public readonly pPlinkFermer            = this.page.locator('div.p-dialog-footer  a');


    //-- POPIN : Synthèse des commandes de la journée ---------------------------------------------------------------
    public readonly dataGridSyntheseCmd     = this.page.locator('p-table[sortfield="groupeArticle.designation"] th');

    public readonly pPlinkFermerSynthese    = this.page.locator('div.p-dialog-footer > p-footer a');


    //-- POPIN : erreur probable de quantité -----------------------------------------------------------------------------
    public readonly pPalerteErrQte          = this.page.locator('.warning-poids-icone');

    public readonly pPbuttonErrConfirmer    = this.page.locator('.alerte-articles-saisie-commande .ui-button .ui-clickable');
    public readonly pPerrProbaQteButConf    = this.page.locator('.alerte-articles-saisie-commande button');

    public readonly pPspinner               = this.page.locator('table tbody tr td.datagrid-statut-designation span img.timer').last();

    //-- POPIN : articles non commandés -----------------------------------------------------------------------------
    public readonly pPconfArtNonComButConf  = this.page.locator('alerte-articles-non-commandes-wrapper button:NOT(.p-link)');
    
    //-- POPIN : Promotion -----------------------------------------------------------------------------
    public readonly pPpromotion             = this.page.locator('div.p-element.ng-trigger.ng-trigger-animation');
    public readonly pPbuttonImprimPromotion = this.page.locator('div.p-element.ng-trigger.ng-trigger-animation p-footer button').nth(0);
    public readonly pPbuttonfermerPromotion = this.page.locator('div.p-element.ng-trigger.ng-trigger-animation p-footer button').nth(1);

    //---------------------------------------------------------------------------------------------------------------
    public readonly  elistBoxGrpArticle = this.listBoxGrpArticle;
    //---------------------------------------------------------------------------------------------------------------


    public async clickButtonAFaire (){

        await this.fonction.selectorToBeCharged(this.buttonAFaire.nth(0));

        var isEnabled = await this.buttonAFaire.isEnabled(); 
        if(isEnabled){
            
            await this.fonction.clickAndWait(this.buttonAFaire,this.page);

            var isVisibleLibelle = await this.dataGridLibelleCmd.first().isVisible();
            if(isVisibleLibelle){ // On verifie si il y a au moins une ligne de commande et si oui on ettendra que que la dernière commande soit charger pour eviter des confusion de selection

                await this.fonction.selectorToBeCharged(this.dataGridLibelleCmd.last())
            }
            return true
        }else{

            return false
        }
    }

    public async selectGroupeArticle(groupeArticle:string) {

        var bPresentAndVisible = await this.elistBoxGrpArticle.locator('option[label="' + groupeArticle + '"]').isVisible();
        var bPresentAndHidden  = await this.elistBoxGrpArticle.locator('option[label="' + groupeArticle + '"]').isHidden();

        if (bPresentAndVisible || bPresentAndHidden) {                 // Choix Présente dans la LB  
            await this.elistBoxGrpArticle.selectOption({label: groupeArticle});
        } else {
            if(groupeArticle != 'Tous'){
                console.log('[!] Groupe Article "' + groupeArticle + '" Absent de la liste de choix !');
            }                 
        }

    }

    constructor(public readonly page: Page) {};
};