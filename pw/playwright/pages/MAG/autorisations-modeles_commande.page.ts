/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : MODELES DE COMMANDE
 * 
 * @author  JOSIAS SIE
 * @version 3.0
 * @since   15/09/2023
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsModelesCommande {

    public readonly buttonEnregistrer      = this.page.locator('[ng-click="enregistrerLignesModeleCommande()"]');
    public readonly buttonModifierArticle  = this.page.locator('[ng-click="openPopupModificationLigneModeleCommande(dgLignesModeleCommande.selection[0])"]');
    public readonly buttonSupprimerArticle = this.page.locator('[ng-click="openPopupSuppressionLignesModeleCommande(dgLignesModeleCommande.selection)"]');    
    public readonly buttonCreerModele      = this.page.locator('[ng-click="openPopupCreationModeleCommande() || modeleCommandeSelectionnee.verrouActif"]');
    public readonly buttonExporterModele   = this.page.locator('[ng-click="exporterModeleCommande(modeleCommandeSelectionnee)"]');
    public readonly buttonActiver          = this.page.locator('[ng-click="majActifModeleCommande(modeleCommandeSelectionnee,true)"]');
    public readonly buttonDesactiver       = this.page.locator('[ng-click="majActifModeleCommande(modeleCommandeSelectionnee,false)"]');
    public readonly buttonPlus             = this.page.locator('[ng-click="openPopupAjoutArticleModeleCommande(autocomplete.article)"]');

    public readonly inputModele            = this.page.locator('span.input-modele-groupe-article > input');
    public readonly inputFiltreModele      = this.page.locator('input.input-modele-article');
    public readonly inputAutoCompleteArticle=this.page.locator('[ng-model="autocomplete.display"]');
    public readonly inputLignesCommandes   = this.page.locator('.lignes-modele-commande td input');

    public readonly autocompleteArticle    = this.page.locator('.gfit-autocomplete-results li');

    public readonly checkBoxMasquerInactif = this.page.locator('#toggle-actif');
    public readonly checkBoxModeles        = this.page.locator('div.liste-modeles-commande td input');
    public readonly checkBoxAllArticles    = this.page.locator('datagrid[contenu="dgLignesModeleCommande.contenu"] thead input');
    
    public readonly labelAucuneLigneCmd    = this.page.locator('div[ng-show="!loading && !dgLignesModeleCommande.contenu.length"]')
    public readonly listBoxGroupeArticle   = this.page.locator('#input-groupe-article-modele');
    public readonly listBoxDossierAchat    = this.page.locator('#dossier-achat');

    public readonly dataGridListeCommandes = this.page.locator('.liste-modeles-commande th'); 

    //-- Popin : Création d'un modèle de commande ----------------------------------------------------------------------------------------------
    public readonly pButtonEnregistrer     = this.page.locator('.popup-saisie-modele-commande .modal-footer button');

    public readonly pInputDesignation      = this.page.locator('#input-designation');

    public readonly pListBoxGroupeArticle  = this.page.locator('#input-groupe');

    public readonly pCheckBoxActif         = this.page.locator('#input-actif');

    public readonly pLinkFermer            = this.page.locator('.popup-saisie-modele-commande .modal-footer a');

    //-- Popin : Ajout d'un article -------------------------------------------------------------------------------------------------------------
    public readonly pButtonEnregistrerArticle=this.page.locator('.popup-ajout-article-modele-commande .modal-footer button');

    public readonly pListBoxConditionnement       = this.page.locator('#input-conditionnement');
    public readonly pListBoxConditionnementOption = this.pListBoxConditionnement.locator('option');
    public readonly pListBoxCalibre               = this.page.locator('#input-calibre');
    public readonly pListBoxCalibreOption         = this.pListBoxCalibre.locator('option');

    public readonly pInputQuantite                = this.page.locator('[ng-model="popupAjoutArticleModeleCommande.quantite"]');

    //-- Popin : Confirmer la suppression -------------------------------------------------------------------------------------------------------
    public readonly pButtonOui             = this.page.locator('div.modal.hide.in > div.modal-footer > button');

    constructor(public readonly page: Page) {};
}