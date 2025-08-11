/**
 * Appli    : STOCK
 * Page     : INVENTAIRE
 * Onglet   : SAISIE DE L'INVENTAIRE
 * 
 * author JOSIAS SIE
 * 
 * @version 3.2
 * 
 * 
 */

import { Page } from "@playwright/test"

export class InventaireInventaire {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonFormInventaire   = this.page.locator('[ng-click="imprimerInventaireStock(false)"]');
    public readonly buttonPalNonInvent     = this.page.locator('[ng-click="imprimerPalettesNonInventoriees()"]');
    public readonly buttonPalPartielInvent = this.page.locator('[ng-click="imprimerPalettesPourArticlesPartiellementInventories()"]');
    public readonly buttonPalDLCCourtes    = this.page.locator('[ng-click="openPopupImpressionDlcsCourtes()"]');
    public readonly buttonStock            = this.page.locator('[ng-click="imprimerInventaireStock(true)"]');
    public readonly buttonTerminerInvent   = this.page.locator('[ng-click="terminerInventaire()"]');                
    public readonly buttonDeclarerPalNum   = this.page.locator('[ng-click="ajouterPaletteAvecNumero()"]');
    public readonly buttonDeclarerPalAno   = this.page.locator('[ng-click="ajouterPaletteSansNumero()"]');    
    public readonly buttonSauvegarder      = this.page.locator('[ng-click="sauvegarder(false)"]');

    public readonly inputNumPalette        = this.page.locator('input.filter-input');
    public readonly inputListQtePalette    = this.page.locator('[ng-model="palette.quantiteInventaire"]');
    public readonly inputListEmplacement   = this.page.locator('[ng-model="palette.emplacementFiltre"]');

    public readonly tdListNumPalette       = this.page.locator('td.inventaire-colonne-palette');
    public readonly tdListArticlePalette   = this.page.locator('td.inventaire-colonne-article');

    public readonly zoneTable              = this.page.locator('table.table-striped.table-bordered.table-hover.table-condensed').nth(0);
    public readonly AlleeTable             = this.page.locator('table.table-striped.table-bordered.table-hover.table-condensed').nth(1);
    public readonly EmplacementTable       = this.page.locator('table.table-striped.table-bordered.table-hover.table-condensed').nth(2);

    public readonly dataGridZone           = this.page.locator('.zones th');
    public readonly dataGridZoneLignes     = this.page.locator('.zones td.datagrid-designation');
    public readonly dataGridAllee          = this.page.locator('.allees th');   
    public readonly dataGridAlleeLignes    = this.page.locator('.allees td.datagrid-designation');           
    public readonly dataGridEmplacement    = this.page.locator('.emplacements th'); 
    public readonly dataGridEmplaceLignes  = this.page.locator('.emplacements td.datagrid-designation'); 
    public readonly dataGridarticletable   = this.page.locator('#formSaisieInventaire > table > tbody');       
    public readonly dataGridArticle        = this.page.locator('#formSaisieInventaire th');     

    public readonly labelSaveConfirmation  = this.page.locator('.boutons-inventaire div:not(.ng-hide)');
    
    //-- Popin : Impression du formulaire d'inventaire             ---------------------------------------------------
    public readonly pButtonImprimerInvent  = this.page.locator('p-footer  button').nth(0);
    public readonly pButtonFermerInvent    = this.page.locator('p-footer  button').nth(1);

    //-- Popin : Impression du rapport des palettes à DLCs courtes ---------------------------------------------------
    public readonly pButtonImprimer        = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonFermer          = this.page.locator('div.modal.hide.in > div.modal-footer > a'); 

    public readonly pInputNbjoursInf       = this.page.locator('input[ng-model="popupImpressionDlcsCourtes.nbJoursDlcCourte"]');
    public readonly pInputNbjoursSup       = this.page.locator('input[ng-model="popupImpressionDlcsCourtes.nbJoursDlcCourteMinMagasin"]');
    public readonly pCheckBoxImprimer      = this.page.locator('input[ng-model="popupImpressionDlcsCourtes.typePdf"]').nth(0);
    public readonly pInputChoixRayon       = this.page.locator('#choix-rayon');

    //-- Popin : Déclaration d'une palette étiquetée sur {xx} --------------------------------------------------------
    public readonly pInputNumPalette       = this.page.locator('#numero-palette-input');
    public readonly pInputQuantite         = this.page.locator('input[ng-model="sauvegardePalette.quantiteInventaire"]');

    public readonly pButtonRechercher      = this.page.locator('[ng-click="rechercherPalette()"]');
    public readonly pButtonSauvegarder     = this.page.locator('#form-saisie-palette-avec-numero .modal-footer button:not(.ng-hide)');

    public readonly pLinkAnnuler           = this.page.locator('#form-saisie-palette-avec-numero .modal-footer a');

    public readonly pDataGridPalette       = this.page.locator('.resultat-palette-trouvee th');

    public readonly pDernieresauvegareMsg  = this.page.locator('.ng-binding[ng-show="derniereSauvegardeEmplacement && emplacementSelectionne"]');
    public readonly pDernierInventaireMsg  = this.page.locator('span.ng-binding[ng-show="dernierInventaireRecupere && inventaire"]');


    //--popin : Déclaration d'une palette sur l'emplacement {xx} -----------------------------------------------------
    public readonly pInputArticle          = this.page.locator('#recherche-article');
    public readonly pInputFournisseur      = this.page.locator('#recherche-fournisseur');
    public readonly pInputEmballage        = this.page.locator('#recherche-emballage');
    public readonly pInputCouleur          = this.page.locator('#recherche-couleur');
    public readonly pInputCalibre          = this.page.locator('#recherche-calibre');
    public readonly pInputMarque           = this.page.locator('#recherche-marque');
    public readonly pInputNbJours          = this.page.locator('#recherche-nb-jours-historique');
    public readonly pInputNbColis          = this.page.locator('#palette-quantite');
    public readonly pInputCouleurEmballage = this.page.locator('#palette-couleur-emballage');
    public readonly pInputColisage         = this.page.locator('#palette-colisage input');

    public readonly pDataGridArrivages     = this.page.locator('.resultat-arrivages th');

    public readonly pButtonRechercherArriv = this.page.locator('[ng-click="rechercherArrivages()"]');
    public readonly pButtonSauvegarderAno  = this.page.locator('#form-saisie-palette-sans-numero .modal-footer button:not(.ng-hide)');

    public readonly pLinkAnnulerArriv      = this.page.locator('#form-saisie-palette-sans-numero .modal-footer a');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {} 
}