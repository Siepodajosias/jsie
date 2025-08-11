/**
 * Appli    : MAGASIN
 * Page     : PRIX
 * Onglet   : GESTION DES PRIX
 * 
 * @author JOSIAS SIE
 * @version 3.5
 *  
 */

import { Page} from '@playwright/test';

export class PrixGestion {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImrpimerListe        = this.page.locator('[ng-click="options.imprimerPrix(false)"]');
    public readonly buttonImprimerChangement   = this.page.locator('[ng-click="options.imprimerPrix(true)"]');
    public readonly buttonImprimerCodeBalance  = this.page.locator('[ng-click="options.imprimerCodesBalances()"]');    
    public readonly buttonImprimer             = this.page.locator('#popover');
    public readonly buttonImprimerConcurrence  = this.page.locator('[ng-click="options.imprimerConcurrences()"]');
    public readonly buttonImprimerEtiquette    = this.page.locator('[ng-click="options.openPopupImpressionEtiquettePlateau()"]');
    public readonly buttonConcurrence          = this.page.locator('[ng-click="openPopup(TypesChangementsPrix.CONCURRENCE)"]');
    public readonly buttonOuvrirCaisse         = this.page.locator('[ng-click="openPopup(TypesChangementsPrix.OUVERTURE)"]');
    public readonly buttonCasseFrais           = this.page.locator('[ng-click="openPopup(TypesChangementsPrix.CASSE_FRAIS)"]');
    public readonly buttonOffre                = this.page.locator('[ng-click="openPopup(TypesChangementsPrix.OFFRE)"]');
    public readonly buttonFermerCaisse         = this.page.locator('[ng-click="openPopupFermerArticleEnCaisse(dgPrix.selections[0])"]');
    public readonly buttonActiver              = this.page.locator('[ng-click="toggleVenteAuColis(dgPrix.selections[0])"]');   
    public readonly buttonTransmettreBalTest   = this.page.locator('[ng-click="openPopupTransmettrePrixBalanceTest()"]');
    public readonly buttonVenteAuDetail        = this.page.locator('[ng-click="openPopup(TypesChangementsPrix.PVC_DETAIL_LD)"]');
    public readonly buttonSupprimerChgtPrix    = this.page.locator('[ng-click="openPopupSuppressionChangementsPrix(dgPrix.selections[0])"]');
    public readonly pictoClearArticle          = this.page.locator('[ng-click="clearFilter()"]').nth(1);

    public readonly listBoxGrpArticle          = this.page.locator('#input-groupe');                

    public readonly inputArticle               = this.page.locator('.filtre > span > input');//('[ng-model="article"] input.filter-input')

    public readonly checkBoxDataGrid           = this.page.locator('.prix td input');
    public readonly checkBoxHistorique         = this.page.locator('.prix div.datagrid-table-wrapper > table > tbody > tr > td > input');  

    public readonly tdDesignationArticle       = this.page.locator('td.datagrid-article-designation');
    public readonly tdCodeArticle              = this.page.locator('td.datagrid-article-code');
    public readonly tdUVArticle                = this.page.locator('td.datagrid-uniteVente-designation');
    public readonly tdPrixUnitaireArticle      = this.page.locator('td.datagrid-venteDetail-prixVente');  
    public readonly tdPvcMagasin               = this.page.locator('td.datagrid-pvcEnCaisse');    
    public readonly tdDésignationMagasin       = this.page.locator('td.datagrid-article-designationEnMagasin'); 
    public readonly tdDateMajPrixCentral       = this.page.locator('td.datagrid-dateApplicabilite'); 
    public readonly tdPvcCentral               = this.page.locator('td.datagrid-pvcCentrale');  

    public readonly dataGridHistorique         = this.page.locator('.prix div.datagrid-table-wrapper > table > thead > tr > th');     

    //-- POPIN : Changement de prix de type concurrence ----------------------------------------------------------------
    public readonly pPinputNomEnseigne         = this.page.locator('input[ng-model="enseigneConcurrente"]');
    public readonly pPinputArticle             = this.page.locator('.autocomplete-article > input');
    public readonly pPinputNouveauPvc          = this.page.locator('#nouveauPvc');
    public readonly pPinputPvcCentrale         = this.page.locator('#pvcCentral');
    public readonly pPinputQualite             = this.page.locator('#qualite');
    public readonly pPinputPvcEnseigne         = this.page.locator('input[id="pvcEnseigne"]');  

    public readonly pPtdCodeArticle            = this.page.locator('#table-prix-article td.datagrid-article-code');
    public readonly pPdataGridArticle          = this.page.locator('#table-prix-article tbody tr');
    
    public readonly pPlabelInfosHausPrix       = this.page.locator('.infos-hausse-prix');

    public readonly pPautoCompleteArticle      = this.page.locator('ul.gfit-autocomplete-results li');

    public readonly pPdataGridConcurrence      = this.page.locator('#table-prix-article th');

    public readonly pPbuttonEnregistrer        = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer             = this.page.locator('div.modal.hide.in > div.modal-footer > a');
    public readonly pPbuttonPlus               = this.page.locator('[ng-click="ajouterArticle(autocomplete.article)"]');

    //-- POPIN : Ouverture en caisse ----------------------------------------------------------------------------------
    public readonly pPinputArticleOEC          = this.page.locator('.autocomplete-article > input');
    public readonly pPinputNouveauPvcOEC       = this.page.locator('#nouveauPvc');
    public readonly pPinputPvcActuel           = this.page.locator('#pvcEnCaisse');

    public readonly pPdataGridConcurrenceOEC   = this.page.locator('#table-prix-article th');

    public readonly pPautoCompleteArticleOEC   = this.page.locator('ul.gfit-autocomplete-results li');    

    public readonly pPbuttonEnregistrerOEC     = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermerOEC          = this.page.locator('div.modal.hide.in > div.modal-footer > a');
    public readonly pPbuttonPlusOEC            = this.page.locator('[ng-click="ajouterArticle(autocomplete.article)"]');    

    public readonly pPlistBoxOrigine           = this.page.locator('select[ng-model="ligneArticle.origine"]');
    public readonly pPlistBoxVariete           = this.page.locator('select[ng-model="ligneArticle.variete"]');
    public readonly pPlistBoxCategorie         = this.page.locator('select[ng-model="ligneArticle.categorie"]');

    public readonly pPspinner                  = this.page.locator('.progressRingCentre img');

    //-- POPIN : Changement de prix de type cassé frais --------------------------------------------------------------
    public readonly pPinputArticleCasseF       = this.page.locator('.autocomplete-article > input');
    public readonly pPinputArticleCasseFNewPrix= this.page.locator('#nouveauPvc');
    public readonly pPinputArticleCasseFNbColis= this.page.locator('#input-nb-colis-casses');

    public readonly pPdataGridConcurrenceCasseF= this.page.locator('#table-prix-article th');

    public readonly pPbuttonEnregistrerCasseF  = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermerCasseF       = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    //-- POPIN : Confirmer la fermeture d'un article en caisse -------------------------------------------------------
    public readonly pPbuttonFermerOui          = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermerNon          = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    //-- POPIN : Transmettre les prix à la balance de test -----------------------------------------------------------
    public readonly pPButtonBalTestPlus        = this.page.locator('.autocomplete-article button');
    public readonly pPButtonBalTestTransmettre = this.page.locator('.popup-diffusion-tarif-balance .modal-footer button');
    public readonly pPMessageConfirmTransmis   = this.page.locator('div.gfit-success.true');

    //-- POPIN : Changement de prix de type vente au détail livraison directe ----------------------------------------
    public readonly pPinputFieldArticleVenteLD = this.page.locator('#formChangementPrix .autocomplete-article input');

    public readonly pPdataGridVenteLD          = this.page.locator('#table-prix-article th');

    public readonly pPbuttonPlusVenteLD        = this.page.locator('[ng-click="ajouterArticle(autocomplete.article)"]');
    public readonly pPbuttonEnregistrerVenteLD = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermerVenteLD      = this.page.locator('div.modal.hide.in > div.modal-footer > a'); 

    //-- POPIN : Changement de prix de type Offre --------------------------------------------------------------------
    public readonly pPoffreInputArticle        = this.page.locator('#formCreationOffre .autocomplete-article input');

    public readonly pPoffreDataGrid            = this.page.locator('#table-prix-article th');

    public readonly pPoffreButtonPlus          = this.page.locator('[ng-click="ajouterArticle(autocomplete.article)"]');
    public readonly pPoffreButtonEnregistrer   = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPoffreButtonFermer        = this.page.locator('div.modal.hide.in > div.modal-footer > a'); 

    public readonly pPoffreRadioButtonOffre    = this.page.locator('#typeOffre');    

    public readonly pPoffreLibelleOffre        = this.page.locator('div[data-ng-repeat="typeOffre in typesOffresAutorises"]');    

    public readonly pPoffreTextAreaCommentaire = this.page.locator('#input-motif');

    public readonly pPoffreAutoCompleteArticle = this.page.locator('ul.gfit-autocomplete-results li');

    public readonly pPoffreTdCodearticle       = this.page.locator('#table-prix-article td.datagrid-article-code');
    public readonly pPoffreTdDesignation       = this.page.locator('#table-prix-article td.datagrid-article-designation');

    public readonly pPoffreInputNbColis        = this.page.locator('#input-nb-colis-offres');

    public readonly pPoffreMessageErreur       = this.page.locator('.feedback-error:NOT(.ng-hide)');
    private readonly fonction                  : any;
    private verboseMode                        : boolean;
    
    //-- POPIN : Changement de prix de type cassé frais ----------------------------------------------------------------
    public readonly pPInputArticle             = this.page.locator('[ng-item="autocomplete.article"]');
    
    constructor(public readonly page: Page, fonction:any = null) {

        this.fonction               = fonction;
        
        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }
    };


    /**
     * 
     * @desc : Sélectionnne une ville de la liste déroulante située dans le menu
     * @param {string} article - Nom de la ville (Exemple : 'Bergerac (550)')
     * @param {Dom Object} selector 
     * 
     */
    public async selectGroupeArticle(article: string, page:Page) {      

        const clickable  = await page.isEnabled('#input-groupe');

        if (clickable) {
            await this.listBoxGrpArticle.click();
            await this.listBoxGrpArticle.selectOption({label: article});
            await this.listBoxGrpArticle.click();
            await this.fonction.waitTillHTMLRendered(page, 50000, false);
        }else {
            throw new Error('JS : ListBox des groupes articles non sélectionnable');
        }
    }
}