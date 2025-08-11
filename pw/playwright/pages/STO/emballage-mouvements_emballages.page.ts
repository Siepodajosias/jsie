/**
 * Appli    : STOCK
 * Page     : EMBALLAGE
 * Obglet   : MOUVEMENTS DES EMBALLAGES
 * 
 * author JOSIAS SIE
 * 
 * @version 3.3
 * 
 */

import { Page } from "@playwright/test"

export class EmballageMouvementsEmballages {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly datePickerFrom             = this.page.locator('p-calendar input').nth(0);
    public readonly datePickerTo               = this.page.locator('p-calendar input').nth(1);

    public readonly buttonRechercher           = this.page.locator('button span.pi-search');     
    public readonly buttonExporter             = this.page.locator('div.form-btn-section button.btn-primary').nth(0);  
    public readonly buttonCreatRegEmballage    = this.page.locator('div.form-btn-section button.btn-primary').nth(1);
    public readonly buttonLieuVente            = this.page.locator('button .LIEU_DE_VENTE');    

    public readonly datagridColumnDate         = this.page.locator('.table-mouvements-emballage table tbody td.colonne-date');
    public readonly datagridColumnTypeMvt      = this.page.locator('.table-mouvements-emballage table tbody td.colonne-designationTypeMouvement');
    public readonly datagridColumnExpediteur   = this.page.locator('.table-mouvements-emballage table tbody td.colonne-designationExpediteur');
    public readonly datagridColumnDestinataire = this.page.locator('.table-mouvements-emballage table tbody td.colonne-designationDestinataire');
    public readonly datagridColumnNumeroBl     = this.page.locator('.table-mouvements-emballage table tbody td.colonne-numeroBl');
    public readonly datagridColumnQuantite     = this.page.locator('.table-mouvements-emballage table tbody td.colonne-quantite');

    public readonly inputExpDestinataire       = this.page.locator('sigale-autocomplete-expediteur-destinataire  input ');
    public readonly inputFiltreFournisseur     = this.page.locator('#filtre-designationFournisseur');
    public readonly inputFiltreRefAchat        = this.page.locator('#filtre-referencesAchat');
    public readonly inputFiltreNumeroBL        = this.page.locator('#filtre-numeroBl');
    public readonly inputFiltreDestinataire    = this.page.locator('#filtre-destinataire');
    public readonly inputFiltreTransporteur    = this.page.locator('#filtre-transporteur');

    public readonly multiSelectItem            = this.page.locator('p-multiselectitem li');

    public readonly spanNumeroBl               = this.page.locator('tbody > tr .colonne-numeroBl span');
    public readonly spanTransporteur           = this.page.locator('tbody > tr .colonne-transporteur span');

    public readonly listBoxPalteformeClearIcon = this.page.locator('sigale-multiselect .clear-icon');
    public readonly listBoxPlateforme          = this.page.locator('p-multiselect.filtre-plateformes');

    public readonly multiSelectMouvement       = this.page.locator('th.colonne-designationTypeMouvement p-multiselect');    
    public readonly multiSelectPlateforme      = this.page.locator('th.colonne-designationPlateforme p-multiselect');
    public readonly listBoxGestionnaire        = this.page.locator('th.colonne-designationGestionnaire p-multiselect');
    public readonly listBoxTypeEmballage       = this.page.locator('th.colonne-designationTypeEmballage p-multiselect');

    public readonly dataGridMouvements         = this.page.locator('tr.first-line th');

    public readonly labelTotalPalettes         = this.page.locator('.synthese-titre').nth(0);
    public readonly labelNbTotalPalettes       = this.page.locator('div.synthese-valeur').nth(0);

    public readonly checkBoxAllDatas           = this.page.locator('p-tableheadercheckbox input');

    //-- Popin : Création d'une entrée d'emballage pour {xxxx} --------------------------------------------------
    public readonly pDatePickerEntree          = this.page.locator('input[name="dateEntree"]');

    public readonly pTdTodayDateEntree         = this.page.locator('td.p-datepicker-today');

    public readonly pInputEntreeNumBL          = this.page.locator('#numero-bl');
    public readonly pInputEntreeChauffeur      = this.page.locator('#chauffeur');
    public readonly pInputDestinataire         = this.page.locator('#recherche-destinataire');
    public readonly pInputEntreeTransporteur   = this.page.locator('div.popup-saisie-entree-type-emballage #transporteur input');
    public readonly pInputReceptionnaire       = this.page.locator('#receptionnaire');
    public readonly pInputEntreeHeureArrivee   = this.page.locator('#heureArrivee input');
    public readonly pInputEntreeHeureDepart    = this.page.locator('#heureDepart input');
    
    public readonly pInputListeTypeEmbEntree   = this.page.locator('td.colonne-quantite input');

    public readonly pTextAreaEntreeObservations= this.page.locator('#observations');

    public readonly pButtonEntreeEnregistrer   = this.page.locator('#enregisterEE');

    public readonly pLinkEntreeAnnuler         = this.page.locator('div.p-dialog-footer button.btn-link');   

    public readonly pChoixPlaterformes         = this.page.locator('div.PLATEFORME ngb-highlight');

    //-- Popin : Création d'une sortie d'emballage pour {xxxx} --------------------------------------------------
    public readonly pDatePickerSortie          = this.page.locator('input[name="dateSortie"]');

    public readonly pTdTodayDateSortie         = this.page.locator('td.p-datepicker-today');  
    public readonly pTdDesignTypeEmbSortie     = this.page.locator('.lignes-sortie-emballage td.datagrid-typeEmballage-designation');  

    public readonly pAutoCompleteFournSortie   = this.page.locator('ul.gfit-autocomplete-results li');    

    public readonly pInputFournisseur          = this.page.locator('#recherche-destinataire');
    public readonly pInputSortieNumBL          = this.page.locator('#numero-bl');
    public readonly pInputSortieChauffeur      = this.page.locator('#chauffeur');
    public readonly pInputSortieTransporteur   = this.page.locator('#transporteur input');
    public readonly pInputChargeur             = this.page.locator('#chargeur');
    public readonly pInputSortieHeureArrivee   = this.page.locator('#heureArrivee input');
    public readonly pInputSortieHeureDepart    = this.page.locator('#heureDepart input');
    public readonly pInputListeTypeEmbSortie   = this.page.locator('td.colonne-quantite input');    

    public readonly pTextAreaSortieObservations= this.page.locator('#observations');

    public readonly pButtonSortieEnregistrer   = this.page.locator('#enregisterSE');

    public readonly pLinkSortieAnnuler         = this.page.locator('.p-dialog-footer button.btn-link');      

    public readonly pChoixFournisseurs         = this.page.locator('div.FOURNISSEUR ngb-highlight');

    public readonly spinnerMvtEmballage        = this.page.locator('.app-spinner');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {}

}