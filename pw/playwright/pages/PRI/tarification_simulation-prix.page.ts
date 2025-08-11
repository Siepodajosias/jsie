/**
 * 
 * APPLI    : PRICING
 * PAGE     : TARIFICATION
 * ONGLET   : SIMULATION PRIX
 * 
 * @author JC CALVIERA
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SimulationPrixPage {
    //-------------Boutons du footer--------------------------------------------------------------------------------------------------------------------------------
    public readonly buttonEnregistrer                               : Locator;
    public readonly buttonRechercher                                : Locator;
    public readonly buttonExporter                                  : Locator;
    public readonly buttonCalculerMarges                            : Locator;
    public readonly buttonModifierPrixCession                       : Locator;
    public readonly buttonModifierPVCTTC                            : Locator;
    public readonly buttonAppliquerModifications                    : Locator;
    public readonly buttonModifierVentes                            : Locator;
    public readonly buttonAjouterLigne                              : Locator;
    public readonly buttonRechargerMargeMagasin                     : Locator;  // (1) bouton pour appliquer le prix achat et (2) bouton pour appliquer le PVC

    public readonly appliquerPrixAchat                              : Locator;
    public readonly appliquerPcessionPvc                            : Locator;

    //-------------Boutons du Header--------------------------------------------------------------------------------------------------------------------------------
    public readonly datePickerSimulation                            : Locator;
    public readonly datePickerTrday                                 : Locator;
    public readonly datePickerLinkPrev                              : Locator;
    public readonly datePickerFirstDayInMonth                       : Locator;
    public readonly datePickerSimulationDay                         : Locator;
    public readonly checkBoxAffUniqLignesModif                      : Locator;
    public readonly listBoxEnseigne                                 : Locator;
    public readonly inputFournisseur                                : Locator;
    public readonly buttonParametrage                               : Locator;  // (1)bouton colonnes à afficher & (2) button parametrage du calcul des marges
    public readonly buttonParametrageAppliquer                      : Locator;
    public readonly checkBoxInclurePromotion                        : Locator;  // Checkbox pour inclure les promotions dans la simulation
    public readonly checkBoxArticlesInActifs                        : Locator;  // Checkbox pour inclure uniquement les articles actifs
    //---------------------Paramétrage du calcul des marges------------------------------------------------------------------------------------------------------
    public readonly buttonAppliquerParam                            : Locator;
    public readonly selectTypeVentes                                : Locator;
    public readonly buttonInclurePromotions                         : Locator;
    public readonly selectStrategie                                 : Locator;
    public readonly inputStrategie                                  : Locator;
    public readonly listStrategie                                   : Locator;

    //--------------Datagrid--------------------------------------------------------------------------------------------------------------------------------------
    public readonly dataGridListeArticles                           : Locator;

    public readonly dataGridCheckBoxAll                             : Locator;
    public readonly dataGridCheckBoxAppliquee                       : Locator;

    public readonly dataGridInputCodeArticle                        : Locator;

    public readonly dataGridThMultiSelectStrategie                  : Locator;
    public readonly dataGridThMultiSelectItemStrategie              : Locator;
    public readonly dataGridThCloseIconMultiSelect                  : Locator;

    public readonly dataGridTrSimulation                            : Locator;
    public readonly dataGridTdSimulationStrategie                   : Locator;
    public readonly dataGridInputNouveauPrixAchat                   : Locator;
    public readonly dataGridInputNouveauPrixCession                 : Locator;
    public readonly dataGridInputNouveauPvc                         : Locator;
    public readonly dataGridInputMargeMagasin                       : Locator;
    public readonly dataGridTdIconAppliquer                         : Locator;

    public readonly labelNouvelleMarge                              : Locator;
    public readonly labelMargeActiuelle                             : Locator;

    public readonly inputCodeArticle                                : Locator;
    //--Popin Appliquer Prix achat--//----------------------------------------

    public readonly pDatePickerApplication                          : Locator;
    public readonly pDatePickerFinApplication                       : Locator;

    public readonly pTogglePermamant                                : Locator;

    public readonly pIconInformation                                : Locator;

    public readonly pButtonAppliquerModif                           : Locator;
    public readonly pButtonAnnuler                                  : Locator;

    public readonly pSpinner                                        : Locator;

    public readonly spinner                                         : Locator;
    public readonly spinnerLoading                                  : Locator;
    public readonly dataGridcodeFilter                              : Locator;
    public readonly dataGridListeArticlesLigne                      : Locator;
    public readonly dataGridEcart                                   : Locator;
    public readonly dataGridNouvelleMargeMagasin                    : Locator;

    //-------------POPIN : Calcul des marges sur une période------------------------------------------------------------------------------------------------------ 
    public readonly pCalculMargesdatagrid                           : Locator;
    public readonly pCalculMargesButtonTypesVentesLi                : Locator;
    public readonly pButtonCalculerMargesHebdom                     : Locator;
    public readonly pDivNegoceOui                                   : Locator;
    public readonly pDivNegoceNon                                   : Locator;

    public readonly pPdropdownTypeVente                             : Locator;
    public readonly pPdropdownPeriode                               : Locator;
    public readonly pPdropdownGroupeArticle                         : Locator;

    public readonly pPmultiselectGroupeMagasin                      : Locator;
    public readonly pPmultiselectEnseigne                           : Locator;
    public readonly pPmultiselectFamille                            : Locator;
    public readonly pPmultiselectSousFamille                        : Locator;

    public readonly pInputDomAnalyse                                : Locator;   
    public readonly pInputUnivers                                   : Locator;   
    public readonly pInputFournisseur                               : Locator;    
    public readonly pInputArticle                                   : Locator;
    public readonly pButtonFermer                                   : Locator;

    //---------------------POPIN : Modifications des ventes ------------------------------------------------------------------------------------------------------
    public readonly pModificationOnglet                             : Locator;
    public readonly pModificationImpact                             : Locator;
    public readonly pModificationButtonEnregistrer                  : Locator;
    public readonly pModificationLine                               : Locator;
    public readonly pModificationCoefProg                           : Locator;

    //-------------POPIN : Ajouter une ligne au simulateur ------------------------------------------------------------------------------------------------------
    public readonly pButtonAjouterLigne                             : Locator;
    public readonly pInputNomPromotion                              : Locator;
    public readonly pButtonFermerPromotion                          : Locator;
    public readonly pInputPrixAchat                                 : Locator;
    public readonly pInputPrixCession                               : Locator;
    public readonly pInputPvcTTC                                    : Locator;
    public readonly pInputDureePromotion                            : Locator;
    public readonly pInputPrixRevient                               : Locator;
    public readonly pInputTypePromotion                             : Locator;
    public readonly pDropdownItem                                   : Locator;
    public readonly pMultiselectFiltreMagasin                       : Locator;
    public readonly pInputCodeArticle                               : Locator;
    public readonly pSelectButton                                   : Locator;
    public readonly pCheckboxeMagasin                               : Locator;
    public readonly liPromotion                                     : Locator;
    public readonly pMultipleSelectSizePlateformes                  : Locator;
    public readonly pMultipleSelectSizeGroupeArticle                : Locator;
    public readonly pInputFiltrePlateformesGroupeArticle            : Locator;
    public readonly pMultipleSelectItemPlateformesGroupeArticle     : Locator;
    public readonly pTdPlateformes                                  : Locator;

    constructor(page:Page){
        
    //-------------Boutons du footer--------------------------------------------------------------------------------------------------------------------------------
        this.buttonEnregistrer                                      = page.locator('footer button').nth(0);
        this.buttonExporter                                         = page.locator('footer button').nth(1);
        this.buttonCalculerMarges                                   = page.locator('footer button').nth(2);
        this.buttonModifierPrixCession                              = page.locator('footer button').nth(3);
        this.buttonModifierPVCTTC                                   = page.locator('footer button').nth(4);
        this.buttonAppliquerModifications                           = page.locator('footer button').nth(5);
        this.buttonModifierVentes                                   = page.locator('footer button').nth(7);
        this.buttonAjouterLigne                                     = page.locator('footer button').nth(8);
        this.buttonRechargerMargeMagasin                            = page.locator('.recharger button');  // (1) bouton pour appliquer le prix achat et (2) bouton pour appliquer le PVC

        this.appliquerPrixAchat                                     = page.locator('p-tieredmenu  p-tieredmenusub  ul li').nth(0);
        this.appliquerPcessionPvc                                   = page.locator('p-tieredmenu  p-tieredmenusub  ul li').nth(1);

        this.buttonRechercher                                       = page.locator('form.formulaire-recherche > button');

        //-------------Boutons du Header--------------------------------------------------------------------------------------------------------------------------------
        this.datePickerSimulation                                   = page.locator('#recherche-date-simulation');
        this.datePickerTrday                                        = page.locator('div.p-datepicker-calendar-container table tbody tr');
        this.datePickerLinkPrev                                     = page.locator('div.p-datepicker-group-container button.p-datepicker-prev');
        this.datePickerFirstDayInMonth                              = page.locator('div.p-datepicker-calendar-container table tbody tr:nth-child(1) td:nth-child(1)')
        this.datePickerSimulationDay                                = page.locator('table > tbody > tr > td span');

        this.listBoxEnseigne                                        = page.locator('p-multiselect[inputid="recherche-enseigne"]');
        this.inputFournisseur                                       = page.locator('input[id="recherche-fournisseur"]');
        this.checkBoxAffUniqLignesModif                             = page.locator('p-checkbox[inputid="filtre-lignes-modifiees"]');
        this.buttonParametrage                                      = page.locator('.colonne-filtres-simulation div.parametrage button');
        this.buttonParametrageAppliquer                             = page.locator('.header-parametrage button');
        this.checkBoxInclurePromotion                               = page.locator('[formcontrolname="inclurePromotion"]');
        this.checkBoxArticlesInActifs                               = page.locator('[formcontrolname="uniquementArticlesActifs"] div').nth(0);

        //-----------------------Paramétrage du calcul des marges---------------------------------------------------------------------------------------------------------------------------------------------
        this.buttonAppliquerParam                                   = page.locator('div legend button');
        this.selectTypeVentes                                       = page.locator('span#typeVentes.p-element.p-dropdown-label.p-inputtext.ng-star-inserted');
        this.buttonAppliquerParam                                   = page.locator('div legend button');
        this.buttonInclurePromotions                                = page.locator('[formcontrolname="inclurePromotion"]');
        this.selectStrategie                                        = page.locator('[optionlabel="nomPourAffichage"]');
        this.inputStrategie                                         = page.locator('.p-multiselect-filter-container input');
        this.listStrategie                                          = page.locator('div > div > div > ul > p-multiselectitem > li > div > div');


        //--------------Datagrid--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        this.dataGridListeArticles                                  = page.locator('table tr:nth-child(1) th');
        this.dataGridListeArticlesLigne                             = page.locator('tbody > tr ');

        this.dataGridCheckBoxAll                                    = page.locator('table tr:nth-child(2) th p-columnfilterformelement input').nth(0);
        this.dataGridCheckBoxAppliquee                              = page.locator('table tr:nth-child(2) th > p-columnfilter[field="appliquee"]');

        this.dataGridInputCodeArticle                               = page.locator('table tr:nth-child(2) th p-columnfilterformelement input').nth(2);

        this.dataGridThMultiSelectStrategie                         = page.locator('table thead  th p-columnfilter[field="groupeMagasin"] p-columnfilterformelement p-multiselect div.p-multiselect-trigger');
        this.dataGridThMultiSelectItemStrategie                     = page.locator('div.p-multiselect-items-wrapper p-multiselectitem li');
        this.dataGridThCloseIconMultiSelect                         = page.locator('div.p-multiselect-panel div.p-multiselect-header button[aria-label="Close"]');

        this.dataGridTrSimulation                                   = page.locator('table tbody  tr');
        this.dataGridTdSimulationStrategie                          = page.locator('table tbody  tr td');
        this.dataGridInputNouveauPrixAchat                          = page.locator('table tbody  tr td .nouveau-prix-achat input');
        this.dataGridInputNouveauPrixCession                        = page.locator('table tbody  tr td input[formcontrolname="nouveauPrixCession"]');
        this.dataGridInputNouveauPvc                                = page.locator('table tbody  tr td input[formcontrolname="nouveauPvcTtc"]');
        this.dataGridInputMargeMagasin                              = page.locator('table tbody  tr td input[formcontrolname="margeMagasin"]');
        this.dataGridTdIconAppliquer                                = page.locator('table tbody  tr td em.fas.fa-check ');

        this.labelNouvelleMarge                                     = page.locator('.nouvelle-marge .somme');
        this.labelMargeActiuelle                                    = page.locator('.marge-actuelle .somme');
        this.inputCodeArticle                                       = page.locator('[field="article.code"] input');

        //--Popin Appliquer Prix achat//------------------------------------------------------------------------------------------------------------

        this.pDatePickerApplication                                 = page.locator('div.p-element p-calendar span input').nth(0);
        this.pDatePickerFinApplication                              = page.locator('div.p-element p-calendar span input').nth(1);

        this.pTogglePermamant                                       = page.locator('div.p-element p-inputswitch input');

        this.pIconInformation                                       = page.locator('i.fas.fa-info-circle.information');

        this.pButtonAppliquerModif                                  = page.locator('div.p-dialog-footer p-footer button').nth(0);
        this.pButtonAnnuler                                         = page.locator('div.p-dialog-footer p-footer button').nth(1);

        this.pSpinner                                               = page.locator('p-footer .app-spinner');

        this.spinner                                                = page.locator('p-table[formarrayname="ligneSimulations"] .app-spinner');
        this.dataGridListeArticles                                  = page.locator('table tr:nth-child(1) th');
        this.spinnerLoading                                         = page.locator('i.app-spinner');
        this.dataGridcodeFilter                                     = page.locator('.p-inputtext.p-component.p-element.ng-star-inserted').nth(0);
        this.dataGridNouvelleMargeMagasin                           = page.locator('tbody tr td').nth(29);
        this.dataGridEcart                                          = page.locator('tbody tr td').nth(30);
        //-------------POPIN : Calcul des marges sur une période-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        this.pCalculMargesdatagrid                                  = page.locator('.row-fluid.resultat-marges.ng-star-inserted p-table');
        this.pButtonCalculerMargesHebdom                            = page.locator('.form-calcul button.p-button');
        this.pCalculMargesButtonTypesVentesLi                       = page.locator('p-dropdownitem li');
        this.pDivNegoceOui                                          = page.locator('.btn-group div').nth(0);
        this.pDivNegoceNon                                          = page.locator('.btn-group div').nth(1);
        this.pPdropdownTypeVente                                    = page.locator('[formcontrolname="typeVentes"]');
        this.pPdropdownPeriode                                      = page.locator('[formcontrolname="typeMarge"]');
        this.pPdropdownGroupeArticle                                = page.locator('[formcontrolname="groupeArticle"]');

        this.pPmultiselectGroupeMagasin                             = page.locator('.control-group [formcontrolname="groupesMagasins"]');
        this.pPmultiselectEnseigne                                  = page.locator('.control-group [formcontrolname="enseignes"]');
        this.pPmultiselectFamille                                   = page.locator('.control-group [formcontrolname="familles"]');
        this.pPmultiselectSousFamille                               = page.locator('.control-group [formcontrolname="sousFamilles"]');

        this.pInputDomAnalyse                                       = page.locator('#domaine-analyse-autocomplete');
        this.pInputUnivers                                          = page.locator('#univers-autocomplete');
        this.pInputFournisseur                                      = page.locator('#fournisseur-autocomplete');
        this.pInputArticle                                          = page.locator('#article-autocomplete');
        this.pButtonFermer                                          = page.locator('p-footer p-button button');

        //---------------------POPIN : Modifications des ventes ------------------------------------------------------------------------------------------------------
        this.pModificationOnglet                                    = page.locator('div.p-tabview-nav-content ul.p-tabview-nav li.ng-star-inserted');
        this.pModificationImpact                                    = page.locator('.row-fluid.impact-autres-articles div.controls div div');
        this.pModificationButtonEnregistrer                         = page.locator('p-footer div button span').first();
        this.pModificationLine                                      = page.locator('div modification-ventes-article tbody tr');
        this.pModificationCoefProg                                  = page.locator('[formcontrolname="coefficientProgressionEnPourcentage"]');
        
        //-------------POPIN : Ajouter une ligne au simulateur ------------------------------------------------------------------------------------------------------
        this.pButtonAjouterLigne                                    = page.locator('.p-dialog-footer button').nth(0);
        this.pButtonFermerPromotion                                 = page.locator('.p-dialog-footer button').nth(1);
        this.pInputNomPromotion                                     = page.locator('#nom-promotion');
        this.pInputPrixAchat                                        = page.locator('#prix-achat');
        this.pInputPrixCession                                      = page.locator('#prix-cession');
        this.pInputPvcTTC                                           = page.locator('#pvc-ttc');
        this.pInputDureePromotion                                   = page.locator('#duree-promotion');
        this.pInputPrixRevient                                      = page.locator('#prix-revient');
        this.pInputTypePromotion                                    = page.locator('#type-promotion');
        this.pDropdownItem                                          = page.locator('p-dropdownitem');
        this.pMultiselectFiltreMagasin                              = page.locator('.p-dialog p-multiselect');
        this.pInputCodeArticle                                      = page.locator('#article-autocomplete');
        this.pSelectButton                                          = page.locator('p-selectbutton div.btn-group div');
        this.pCheckboxeMagasin                                      = page.locator('.p-dialog p-tablecheckbox .p-checkbox-box');
        this.liPromotion                                            = page.locator('li[role="presentation"]').nth(0);
        this.pMultipleSelectSizePlateformes                         = page.locator('.p-dialog .p-datatable-thead .multipleSelectSize').nth(4);
        this.pMultipleSelectSizeGroupeArticle                       = page.locator('.p-dialog .p-datatable-thead .multipleSelectSize').nth(5);
        this.pInputFiltrePlateformesGroupeArticle                   = page.locator('input.p-multiselect-filter');
        this.pMultipleSelectItemPlateformesGroupeArticle            = page.locator('p-multiselectitem li.p-multiselect-item').first();
        this.pTdPlateformes                                         = page.locator('td.text-left:nth-child(8)');
      }
}
