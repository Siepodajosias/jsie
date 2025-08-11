/**
 * Appli    : MAGASIN
 * Page     : ALERTES
 * Onglet   : SUIVI CENTRALE
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * @since 11/09/2023
 * 
 */
import { Page} from '@playwright/test';
import { TestFunctions } from '../../utils/functions';

export class AlertesSuivi {

    public fonction                          = new TestFunctions();
    //----------------------------------------------------------------------------------------------------------------
    public readonly toggleStatut             = this.page.locator('.btn-group > button');
    public readonly toggleInitialisee        = this.toggleStatut.nth(0);
    public readonly toggleDiffusee           = this.toggleStatut.nth(1);
    public readonly toggleEnCours            = this.toggleStatut.nth(2);

    public readonly buttonCreer              = this.page.locator('[ng-click="openPopupCreationAlerte()"]');
    public readonly buttonModifier           = this.page.locator('[ng-click="openPopupModificationAlerte(dg.selections[0])"]');
    public readonly buttonDiffuser           = this.page.locator('[ng-click="diffuser(dg.selections[0])"]');
    public readonly buttonDebloquerPartiel   = this.page.locator('[ng-click="openPopupDeblocagePartiel(dg.selections[0])"]');
    public readonly buttonChangerQualif      = this.page.locator('[ng-click="openPopupChangerQualification(dg.selections[0])"]');
    public readonly buttonVoirSuivi          = this.page.locator('[ng-click="openPopupSuiviGeneral(dg.selections[0])"]');
    public readonly buttonSupprimer          = this.page.locator('[ng-click="openPopupSuppressionAlerte(dg.selections[0])"]');
    public readonly buttonTerminer           = this.page.locator('[ng-click="ouvrirPopupConfirmationCloture(dg.selections[0])"]');
    public readonly buttonImprimerBilan      = this.page.locator('[ng-click="imprimerBilanFinAlerte(dg.selections[0])"]'); 

    public readonly listBoxGroupeArticle     = this.page.locator('#input-groupe');

    public readonly inputFiltreArticle       = this.page.locator('.filter-input.filtre-recherche');

    public readonly checkBoxSelected         = this.page.locator('.selectionne td input');
    public readonly checkBoxListeAlertes     = this.page.locator('.suivi-centrale table td input');

    public readonly dataGridListearticles    = this.page.locator('.span12 div.datagrid-table-wrapper > table > thead > tr > th');   
    public readonly dataGridListeArticleElmt = this.page.locator('.span12 div.datagrid-table-wrapper > table > tbody > tr');
    public readonly dataGridListePilotes     = this.page.locator('td.datagrid-pilotes');

    //-- Popin : Création d'une alerte pour le groupe article xxxx  -----------------------------------------------
    public readonly pPinputAddArticle        = this.page.locator('.autocomplete-articles input');
    public readonly pPinputAddOrigine        = this.page.locator('alerte.origine');
    public readonly pPinputAddFournisseur    = this.page.locator('autocompleteFournisseur.display');
    public readonly pPinputAddRefExterne     = this.page.locator('alerte.referenceExterne');
    public readonly pPinputAddPilote         = this.page.locator('autocompletePilote.display');

    public readonly pPlistBoxAddNiveau       = this.page.locator('alerte.niveau');
    public readonly pPlistBoxAddQualif       = this.page.locator('alerte.qualification');

    public readonly pPtextAreaAddActionMag   = this.page.locator('alerte.actions');
    public readonly pPtextAreaAddActionPltf  = this.page.locator('alerte.actionsPlateforme');
    public readonly pPtextAreaAddComInterne  = this.page.locator('textarea[ng-model="alerte.contexte"]');
    public readonly pPtextAreaActionMagasin  = this.page.locator('div.ql-editor').nth(0);
    public readonly pPtextAreaActionPtf      = this.page.locator('div.ql-editor').nth(1);
    public readonly pPtextAreaAddComNonDif   = this.page.locator('div.commentaires textarea');

    public readonly pPbuttonAddRechercher    = this.page.locator('[ng-click="rechercherLots()"]');
    public readonly pPbuttonAddAjouter       = this.page.locator('[ng-click="ajouterLignesAlerte()"]');
    public readonly pPbuttonAddEnregistrer   = this.page.locator('div.modal-footer button:NOT(.modal-btn-primary)');

    public readonly pPautocompleteAddArticle = this.page.locator('ul.gfit-autocomplete-results li');

    public readonly pPlinkAddAnnuler         = this.page.locator('.popup-saisie-alerte .modal-footer a');
    
    public readonly pPcheckBoxAddEtendre     = this.page.locator('alerte.etendreAutresMagasins');

    public readonly pPtdAddListeArticles     = this.page.locator('.lignes-choix-lots td.datagrid-numeroLot');
    public readonly pPtdAddListeNumlLot      = this.page.locator('.lignes-alerte td.datagrid-numeroLot');

    public readonly pPongletInfoAlertes      = this.page.locator('a[href="#infosGenerales"]');
    public readonly pPongletActionsComment   = this.page.locator('a[href="#actions"]');

    //-- Popin : Suivi de l'alerte --------------------------------------------------------------------------------------

    public readonly pPopinSuiviAlerte        = this.page.locator('.modal-backdrop');
    
    public readonly pPtdSuiviListMagasin     = this.page.locator('td.datagrid-magasin-designation');

    public readonly pPlinkSuiviFermer        = this.page.locator('.popup-suivi-general .modal-footer [data-modal-action="fermer"]');

    public readonly pPbuttonSuiviRelancer    = this.page.locator('.popup-suivi-general .modal-footer button');

    //-- Popin : Sélection du type d'export -----------------------------------------------------------------------------
    public readonly pPLinkTerminerAnnuler    = this.page.locator('.popup-choix-type-bilan .modal-footer a');

    //-- Popin : Confirmation de la suppression d'une alerte ------------------------------------------------------------
    public readonly pPbuttonSupprimerOui     = this.page.locator('.popup-confirmer-suppression .modal-footer button');

    public readonly selectedGroupeArticle    = this.listBoxGroupeArticle.locator('option[selected="selected"]');

    //-------------------------------------------------------------------------------------------------------------------

    public async selectGroupeArticle(page: Page, idGroupeArticle: string) {
        await this.fonction.clickElement(this.listBoxGroupeArticle);
        await this.listBoxGroupeArticle.selectOption({label: idGroupeArticle});
        await this.fonction.clickElement(this.listBoxGroupeArticle);
        await this.fonction.waitTillHTMLRendered(page, 50000, false);
    };

    public getSelectedGroupeArticle() {
        return this.listBoxGroupeArticle.locator('option[selected="selected"]');
    };


    constructor(public readonly page: Page) {}
}