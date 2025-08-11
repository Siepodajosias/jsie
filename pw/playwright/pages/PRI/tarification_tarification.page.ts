/**
 * 
 * APPLI    : PRICING
 * PAGE     : TARIFICATION
 * ONGLET   : TARIFICATION
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.9
 * 
 */

import { Locator, Page } from "@playwright/test"

export class TarificationPage {
    
    public readonly buttonTarification                               : Locator;    //('[ng-click="ouvrirPopup()"]');
    public readonly buttonEnregistrer                                : Locator;    //('[ng-click="enregistrerModifications()"]');
    public readonly buttonValider                                    : Locator;    //('[ng-click="validerEtSauvegarder(dg.selection)"]').nth(0);
    public readonly buttonInvalider                                  : Locator;    //('[ng-click="validerEtSauvegarder(dg.selection)"]').nth(1);
    public readonly buttonTarifsMagasin                              : Locator;    //('[ng-click="ouvrirPopupEnvoiTarifsMagasins()"]');                
    public readonly buttonMargesGlobales                             : Locator;    //('[ng-click="ouvrirPopupCalculMargesGlobales()"]');
    public readonly buttonMargesSurPeriode                           : Locator;    //('[ng-click="ouvrirPopupCalculMargesPeriodiques()"]');    
    public readonly buttonExport                                     : Locator;    //('#popoverExport');        
    public readonly buttonExportPVC                                  : Locator;    //('[ng-click="options.exporterTarificationsCSV()"]');   
    public readonly buttonExportTarification                         : Locator;    //('[ng-click="options.exporterPrixTarificationsCSV()"]');   
    public readonly buttonDateFinValidite                            : Locator;    //('[ng-click="modifDateFinTarificationMasse()"]');        
    public readonly buttonHistorique                                 : Locator;     
    public readonly buttonColonnes                                   : Locator;     
    public readonly buttonParametrage                                : Locator;    
    public readonly buttonNextPage                                   : Locator;
    public readonly buttonNbrePage                                   : Locator;

    public readonly dropdownItem                                     : Locator;
    public readonly multiSelectItemEnseigne                          : Locator;
    public readonly multiSelectLabelGrpeMag                          : Locator;
    public readonly multiSelectItem                                  : Locator;

    public readonly IconClose                                        : Locator;
    public readonly IconAccepte                                      : Locator;

    public readonly datePickerEditionTarif                           : Locator;    //('#datepickerTarif');
    public readonly recupDateDuJour                                  : Locator;

    public readonly toogleButtonSaisieGroupee                        : Locator;

    public readonly theadNombreLigneTarifSelectionne                 : Locator;

    public readonly tdLabelGroupeMag                                 : Locator;
    public readonly tdLabelCodeArticle                               : Locator;
    public readonly tdListeBoxGpreArticle                            : Locator;
    public readonly tdPvcTtcGras                                     : Locator;
    public readonly tdPrixCessionHtGras                              : Locator;

    public readonly tdCalendarActiveDay                              : Locator;    //('td.active.day');
    public readonly tdCalendarDays                                   : Locator;    //('td.day');
    public readonly tdCalendarValideDays                             : Locator;    //('td.day:NOT(.old)');
    public readonly tdCalendarPreviousMonth                          : Locator;    //('div.datepicker-days th.prev');
    public readonly tdDgPrixCession                                  : Locator;    //('td.datagrid-prixCession');
    public readonly tdDgMargeMagasin                                 : Locator;    //('td.datagrid-margeMagasin');
    public readonly tdDgPrixVentePrecedent                           : Locator;    //('td.datagrid-prixVentePrecedent');
    public readonly tdDgPrixVenteTheorique                           : Locator;    //('td.datagrid-prixVenteTheorique');
    public readonly tdDgPrixVenteTTC                                 : Locator;    //('td.datagrid-prixVente');
    public readonly tdDgArticleCode                                  : Locator;    //('td.datagrid-article-code');
    public readonly trTarification                                   : Locator;
    public readonly statistiqueTexte                                 : Locator;
    public readonly tdDgTogglePermanant                              : Locator;
    public readonly tdDgDateFinValidite                              : Locator;

    //Colonne action
    public readonly buttonActionInvaliderSauvegarder                 : Locator;
    public readonly buttonActionArreterTarification                  : Locator;
    public readonly buttonActionHistorique                           : Locator;
    public readonly buttonActionModifier                             : Locator;
    public readonly buttonActionSupprimer                            : Locator;

    public readonly tableBody                                        : Locator;

    public readonly listBoxGroupeArticle                             : Locator;    //('dg.filter.AND[3][\'groupeArticle.code\'].value');
    public readonly listBoxGroupeMagasin                             : Locator;    //('.gfit-select-filter-input');
    public readonly listBoxAValider                                  : Locator;    //('span.menu-affichage-pricing a.btn');

    public readonly inputArticle                                     : Locator;
    public readonly inputDesignArticle                               : Locator;
    public readonly inputCAHebdo                                     : Locator;
    public readonly inputNbMagLivres                                 : Locator;
    public readonly inputMoyenne                                     : Locator;
    public readonly inputPrixRevHTMoyPrec                            : Locator;
    public readonly inputPrixRevHTMoy                                : Locator;
    //public readonly inputFinValidite                                 : Locator;    //('input-periode-fin');
    public readonly inputPrixCessionHT                               : Locator;    //('id-prix-session');
    public readonly inputPVCTTC                                      : Locator;    //('prix-vente');
    
    public readonly inputMargePtf                                    : Locator;
    public readonly inputMargeMag                                    : Locator;
    
    public readonly inputPVCTTCTheo                                  : Locator;
    public readonly inputMargePlateforme                             : Locator;
    public readonly inputMargeMagasin                                : Locator;    //('id-marge-magasin');
    public readonly inputDateEdition                                 : Locator;
    public readonly inputEnseigne                                    : Locator;

    public readonly checkBoxAffichageAuto                            : Locator;    //('checkbox-affichage-automatiques');
    public readonly checkBoxTarificationPerm                         : Locator;    //('tarification-renouvelable');
    public readonly checkBoxlisteTarifs                              : Locator;
    public readonly checkBoxAlertes                                  : Locator;
    public readonly checkBoxTarifeValide                             : Locator;
    public readonly checkBoxComposition                              : Locator;
    public readonly checkBoxAllTarifs                                : Locator;
    public readonly checkBoxTarifAValider                            : Locator;
    public readonly checkBoxColonneAAfficher                         : Locator;
    public readonly checkBoxColonneAffiche                           : Locator;
    public readonly checkBoxStatutTarif                              : Locator;
    public readonly checkBoxAvalider                                 : Locator;
    
    public readonly listeGroupeMagasin                               : Locator;

    public readonly dataGridListeArticles                            : Locator;    //('#dg-tarification .datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataGridArticlesSelectable                       : Locator;
    public readonly dataGridSpinner                                  : Locator;

    public readonly spinnerTarification                              : Locator;    //('upload-file-container');

    public readonly linkToutesTarifications                          : Locator;    //('[ng-click="changerAffichage()"]');

    //-- Popin : Modification de la date de fin de validité -------------------------------------------------------------------------------
    public readonly pPdateInputArticle                               : Locator;    //('div.magasins-autorises #article-id');
    public readonly pPdateInputCode                                  : Locator;    //('div.filtre-recherche-article-modif-date-tarification input');

    public readonly pPdateDatePeackerNlleDate                        : Locator;    //('div.magasins-autorises i.icon-calendar');

    public readonly pPdateDataGrid                                   : Locator;    //('div.liste-tarification-date-fin-valide datagrid th');

    public readonly pPbuttonModifier                                 : Locator;    //('div.popup-modification-datefin-tarification-masse div.modal-footer button');

    public readonly pPlinkAnnuler                                    : Locator;    //('div.popup-modification-datefin-tarification-masse div.modal-footer a');

    //-- Popin : Ajout de tarification ----------------------------------------------------------------------------------------------------
    public readonly pPopinAjouttarification                          : Locator; 
    public readonly pPbuttonSauvegarder                              : Locator;    //('.popup-tarification-magasin .modal-footer button:not(.ng-hide)');
    public readonly pButtonAnnuler                                   : Locator;    //('div.modal.hide.in > div.modal-footer > a');

    public readonly pInputArticle                                    : Locator;    //('form[name="formEditTarification"] #article-id');
    public readonly pPinputNomPromo                                  : Locator;    //('nom-groupe-promotion');
    public readonly pPinputPrixCessionHT                             : Locator;    //('id-prix-cession');
    public readonly pPinputPVCTtc                                    : Locator;    //('.saisie-promotion #id-prix-vente');
    public readonly pPinputMagasin                                   : Locator;    //('.magasins-autorises input.input-medium.ng-scope');    

    public readonly pPlistBoxTypePromo                               : Locator;    //('type-promo-id');
    public readonly pDatePickerPromo                                 : Locator;
    public readonly pTdDatePickerPromo                               : Locator;    //page.locator('.datepicker-days .day:NOT(.disabled)').nth(0);

    public readonly pPautoCompleteArticle                            : Locator;    //('.popup-tarification-magasin .gfit-autocomplete-results li');
    public readonly pPautoCompleteMagasins                           : Locator;    //('.popup-tarification-magasin .gfit-autocomplete-results li');    

    public readonly pPcheckBoxThListeMagasin                         : Locator;    //('.liste-magasin table th input');

    public readonly pLinkPromotion                                   : Locator;    //('[ng-click="promotion()"]');
    public readonly pLinkTarification                                : Locator;    //('[ng-click="tarification()"]');
    public readonly pLinkBaisseTarification                          : Locator;    //('[ng-click="baisseTarification()"]');

    //-- Popin / Bloc Promotion -----------------------------------------------------------------------------------------------------------
    public readonly pInputNom                                        : Locator;    //('nom-groupe-promotion');
    public readonly pInputPrixCession                                : Locator;    //('id-prix-cession');
    public readonly pInputPVC                                        : Locator;    //('id-prix-vente').nth(0);
    public readonly pInputPVCDetailHorsLots                          : Locator;    //('newTarification.venteDetail.pvc');    
    public readonly pInputNbOffert                                   : Locator;    //('newTarification.conditionTarifaire.quantiteOfferte');
    public readonly pInputNbAchete                                   : Locator;    //('newTarification.conditionTarifaire.quantiteAchetee');    

    public readonly pListBoxTypePromo                                : Locator;    //('type-promo-id');
    public readonly pListBoxNatureDetail                             : Locator;    //('newTarification.venteDetail.natureDetail');

    public readonly pDatePickerFinPromo                              : Locator;    //('input-date-fin');

    public readonly pCheckBoxConditionsTarif                         : Locator;    //('condition-tarifaire-cb');
    public readonly pCheckBoxVenteDetail                             : Locator;    //('vente-detail-cb');

    //-- Popin / Bloc Sélection des magasins ----------------------------------------------------------------------------------------------
    public readonly pInputMagasin                                    : Locator;    //('autocomplete.display');

    public readonly pListBoxSecteurProsol                            : Locator;    //('filterValues.secteur.value');
    public readonly pListBoxRegionProsol                             : Locator;    //('filterValues.regionProsol.value');
    public readonly pListBoxRegionGeographique                       : Locator;    //('filterValues.regionGeographique.value');    

    public readonly pToggleStrategie                                 : Locator;    //('[ng-click="dgMagasins.filters.updateStrategieFilter(strategie)"]');
    public readonly pTogglePlateforme                                : Locator;    //('[ng-click="dgMagasins.filters.updatePlateformeFilter(plateforme)"]');
    public readonly pToggleGroupeMagasins                            : Locator;    //('[ng-click="dgMagasins.filters.updateGroupeMagasinFilter(groupeMagasin)"]');
    public readonly pToggleSelectionnes                              : Locator;    //('[ng-click="onToggle($event, choice)"]').nth(0);
    public readonly pToggleNonSelectionnes                           : Locator;    //('[ng-click="onToggle($event, choice)"]').nth(1);
 
    public readonly dataGridListeMagasins                            : Locator;    //('.liste-magasin .datagrid-table-wrapper > table > thead > tr > th');

    //-- Popin : Confirmation de l'envoi des tarifications -------------------------------------------------------------------------------
    public readonly pPopinConfirmationEnvoieTarification            : Locator;
    public readonly pButtonEnvoiPartiel                             : Locator;    //('envoi-tarifs-magasin-modal-wrapper button.p-button:NOT(.p-button-link)').nth(0);
    public readonly pButtonEnvoiDefinitif                           : Locator;    //('envoi-tarifs-magasin-modal-wrapper button.p-button:NOT(.p-button-link)').nth(1);
    public readonly pButtonEnvoiAnnuler                             : Locator;    //('envoi-tarifs-magasin-modal-wrapper button.p-button-link');    

    //-- Popin : Calcul des marges -------------------------------------------------------------------------------------------------------
    public readonly pPcalcMargeListBoxEnseigne                      : Locator;    //('[formcontrolname="enseignes"]').nth(0);
    public readonly pPcalcMargeListBoxGrArticle                     : Locator;    //('[formcontrolname="groupeArticle"]');

    public readonly pPcalcMargeCheckBoxChoix                        : Locator;    //('[formcontrolname="enseignes"] div.p-checkbox-box');
    public readonly pPcalcMargeCheckBoxAll                          : Locator;

    public readonly pPcalcMargeIconClose                            : Locator;

    public readonly pPcalcMargeButtonCalculer                       : Locator;    //('div.zone-recherche button.p-button');

    public readonly pPcalcMargeSwitchLiensExt                       : Locator;    //('.zone-recherche span.p-inputswitch-slider');

    public readonly pPcalcMargeLinkFermer                           : Locator;    //('p-footer button');

    public readonly pPcalcMargeSpinner                              : Locator;    //('i.app-spinner');

    public readonly pPcalcTdMarges                                  : Locator;    //('td.valeur-marge-globale');

    public readonly pPcalcMargeInputFamille                         : Locator;    //('div.autocomplete-famille input');
    public readonly pPcalcMargeInputSousFamille                     : Locator;    //('div.autocomplete-sous-famille input');

    //-- Popin : Calcul des marges sur une période ---------------------------------------------------------------------------------------
    public readonly pPopinCalculMArgeSurPeriode                      : Locator;
    public readonly pPspinnerMargePeriode                            : Locator;    //('.popup-marges-periodes .progressRing:not(.ng-hide)');

    public readonly pPlinkFermerMargePeriode                         : Locator;    //('calcul-marges-periodes-modal-wrapper button.p-button-link');

    public readonly pPbuttonCalculerMarges                           : Locator;    //('calcul-marges-periodes-modal-wrapper button.p-component:NOT(.p-button-link)');
    public readonly pPtableResultatMarges                            : Locator;    //('.resultat-marges p-table');

    //-- Popin : Historiqu des prix (hors promotion) ---------------------------------------------------------------------------------------

    public readonly pPInputArticle                                   : Locator;    
    public readonly pPDatePickerDebut                                : Locator;   
    public readonly pPDatePickerFin                                  : Locator;    

    public readonly pPlinkFermer                                     : Locator; 
    public readonly pPopinHistoriqueDesPrix                          : Locator;
    public readonly pPButtonAfficher                                 : Locator;

    //-- Popoin : Parametrage -------------------------------------------------------------------------------------------------------------
    public readonly pPGroueMagFavoris                                : Locator;

    public readonly pPCheckBoxAllGroupeFav                           : Locator;
    public readonly pPcheckBoxGroupeFav                              : Locator;

    public readonly pPButtonClose                                    : Locator;
    public readonly pPButtonAppliquer                                : Locator;

    public readonly pPInputGroupeMagFav                              : Locator;
    public readonly spanMessageTransmission                          : Locator;
    
    constructor(page:Page){
        this.buttonTarification                                     = page.locator('button i.icon-plus-sign');
        this.buttonEnregistrer                                      = page.locator('button i.icon-hdd');
        this.buttonValider                                          = page.locator('button i.fa-check-square');
        this.buttonInvalider                                        = page.locator('button i.icon-ban-circle');
        this.buttonTarifsMagasin                                    = page.locator('button i.icon-share-alt');                
        this.buttonMargesGlobales                                   = page.locator('button i.icon-tasks');
        this.buttonMargesSurPeriode                                 = page.locator('.containerBT .btn-primary').nth(5); //('[ng-click="ouvrirPopupCalculMargesPeriodiques()"]')
        this.buttonExport                                           = page.locator('p-splitbutton');        
        this.buttonExportPVC                                        = page.locator('p-splitbutton button').nth(0);   
        this.buttonExportTarification                               = page.locator('p-splitbutton button').nth(1);   
        this.buttonDateFinValidite                                  = page.locator('button i.icon-pencil');        
        this.buttonHistorique                                       = page.locator('button i.fa-clock');        
        this.buttonColonnes                                         = page.locator('button span.fa-th');        
        this.buttonParametrage                                      = page.locator('button span.fa-cog');   
        this.buttonNextPage                                         = page.locator('.p-paginator-bottom button.p-paginator-next');
        this.buttonNbrePage                                         = page.locator('span.p-paginator-pages button');

        // Colonne actions
        this.buttonActionInvaliderSauvegarder                       = page.locator('button em.fas.fa-ban');
        this.buttonActionArreterTarification                        = page.locator('button em.fas.fa-times');
        this.buttonActionHistorique                                 = page.locator('button em.far.fa-clock');
        this.buttonActionModifier                                   = page.locator('button em.far.fa-edit');
        this.buttonActionSupprimer                                  = page.locator('button em.far.fa-trash-alt');
        
        this.dropdownItem                                           = page.locator('p-dropdownitem li');
        this.multiSelectItemEnseigne                                = page.locator('.p-multiselect-items-wrapper ul');
        this.multiSelectLabelGrpeMag                                = page.locator('p-columnfilterformelement div.p-multiselect-label').nth(0);
        this.multiSelectItem                                        = page.locator('div.p-multiselect-panel div.p-multiselect-items-wrapper p-multiselectitem li ')

        this.IconClose                                              = page.locator('button.p-multiselect-close');
        this.IconAccepte                                            = page.locator('td em.fa-check');
         
        this.datePickerEditionTarif                                 = page.locator('p-calendar[formcontrolname="dateExpedition"]');
        this.recupDateDuJour                                        = page.locator('div[ng-show="newTarification.type === \'promotion\'"] label.ng-binding:has-text("du :")');    
        this.tdPvcTtcGras                                           = page.locator('td.prix-vente span b');
        this.tdPrixCessionHtGras                                    = page.locator('td.prix-cession span b');
        this.tdListeBoxGpreArticle                                  = page.locator('p-columnfilter[field="groupeMagasin"]');// ('p-columnfilterformelement chevrondownicon.p-icon-wrapper')
        this.tdLabelCodeArticle                                     = page.locator('tbody tr td.text-center.sticky-column:NOT(.no-padding-inline)');
        this.tdLabelGroupeMag                                       = page.locator('tbody tr td.text-left.sticky-column.text-ellipsis');
        this.tdCalendarActiveDay                                    = page.locator('td.active.day');
        this.tdCalendarDays                                         = page.locator('td.day');
        this.tdCalendarValideDays                                   = page.locator('.p-datepicker-calendar td:NOT(.p-datepicker-other-month)');// 'td.day:NOT(.old)'
        this.tdCalendarPreviousMonth                                = page.locator('.p-datepicker-prev');// div.datepicker-days th.prev
        this.tdDgPrixCession                                        = page.locator('table tbody tr td:nth-child(13)');
        this.tdDgMargeMagasin                                       = page.locator('td.datagrid-margeMagasin');
        this.tdDgPrixVentePrecedent                                 = page.locator('table tbody tr td:nth-child(15)');
        this.tdDgPrixVenteTheorique                                 = page.locator('table tbody tr td:nth-child(16)');
        this.tdDgPrixVenteTTC                                       = page.locator('table tbody tr td:nth-child(17)');
        this.tdDgArticleCode                                        = page.locator('table tbody tr td:nth-child(6)');
        this.trTarification                                         = page.locator('saisie-simple-tarification .p-datatable-scrollable-body tbody tr');
        this.statistiqueTexte                                       = page.locator('.p-paginator .statistiques');
        this.tdDgTogglePermanant                                    = page.locator('table tbody tr td p-inputswitch[inputid="input-switch-permanent"] input');
        this.tdDgDateFinValidite                                    = page.locator('table tbody tr td:nth-child(23)');

        this.tableBody                                              = page.locator('saisie-simple-tarification tbody tr');

        this.listBoxGroupeArticle                                   = page.locator('p-dropdown[formcontrolname="groupeArticle"]');
        this.listBoxGroupeMagasin                                   = page.locator('p-multiselect[formcontrolname="enseignes"]');
    
        this.inputArticle                                           = page.locator('p-columnfilter[field="article.code"] input');
        this.inputDesignArticle                                     = page.locator('p-columnfilter[field="article.designation"] input');
        this.inputCAHebdo                                           = page.locator('p-columnfilter[field="chiffreAffaire"] input');                                         
        this.inputNbMagLivres                                       = page.locator('p-columnfilter[field="nombreMagasinsLivres"] input');
        this.inputMoyenne                                           = page.locator('p-columnfilter[field="moyenne.designation"] input');
        this.inputPrixRevHTMoyPrec                                  = page.locator('p-columnfilter[field="prixRevientPrecedent"] input');
        this.inputPrixRevHTMoy                                      = page.locator('p-columnfilter[field="prixRevient"] input');
        this.inputPrixCessionHT                                     = page.locator('input[appnavigationtableinput="prixCession"]');
        this.inputPVCTTC                                            = page.locator('input[appnavigationtableinput="prixVente"]');

        this.inputMargePtf                                          = page.locator('input[appnavigationtableinput="margePlateforme"]')
        this.inputMargeMag                                          = page.locator('input[appnavigationtableinput="margeMagasin"]')


        this.inputPVCTTCTheo                                        = page.locator('p-columnfilter[field="prixVenteTheorique"] input');
        this.inputMargePlateforme                                   = page.locator('p-columnfilter[field="margePlateforme"] input');
        this.inputMargeMagasin                                      = page.locator('p-columnfilter[field="margeMagasin"] input');
        this.inputDateEdition                                       = page.locator('#champ-date-edition');
        this.inputEnseigne                                          = page.locator('.p-multiselect-filter-container input.p-multiselect-filter')
    
        this.checkBoxAffichageAuto                                  = page.locator('p-checkbox[formcontrolname="tarificationsAutomatiques"]');
        this.checkBoxTarificationPerm                               = page.locator('p-columnfilter[field="renouvelable"]');
        this.checkBoxAlertes                                        = page.locator('p-columnfilter[field="hasAlertes"]');
        this.checkBoxTarifeValide                                   = page.locator('p-columnfilter[field="validee"]');
        this.checkBoxComposition                                    = page.locator('p-columnfilter[field="estUneComposition"]');
        this.checkBoxAllTarifs                                      = page.locator('th.sticky-column div.p-checkbox-box');
        this.checkBoxlisteTarifs                                    = page.locator('td.box-shadow-right div.p-checkbox-box');       // Liste de CB du tableau de résultats
        this.checkBoxTarifAValider                                  = page.locator('.p-checkbox-box.p-highlight[aria-checked="false"]');
        this.checkBoxColonneAAfficher                               = page.locator('p-listbox .p-listbox-header .p-checkbox .p-highlight');
        this.checkBoxColonneAffiche                                 = page.locator('p-listbox .p-listbox-header .p-checkbox');
        this.checkBoxStatutTarif                                    = page.locator('[field="validee"] .p-checkbox-box');
        this.checkBoxAvalider                                       = page.locator('timesicon[data-pc-section="uncheckIcon"]');

        this.listeGroupeMagasin                                     = page.locator('p-multiselectitem li span');

        this.toogleButtonSaisieGroupee                              = page.locator('p-inputswitch[inputid="saisie-groupee"]');

        this.theadNombreLigneTarifSelectionne                       = page.locator('thead[role="rowgroup"] th.no-padding-inline');
        
        this.dataGridListeArticles                                  = page.locator('saisie-simple-tarification tr:nth-child(1) th'); 
        this.dataGridArticlesSelectable                             = page.locator('saisie-simple-tarification tr.p-selectable-row');
        this.dataGridSpinner                                        = page.locator('form p-table .p-datatable .app-spinner');

        this.spinnerTarification                                    = page.locator('upload-file-container ');
    
        this.linkToutesTarifications                                = page.locator('[ng-click="changerAffichage()"]');
    
        //-- Popin : Modification de la date de fin de validité -------------------------------------------------------------------------------
        this.pPdateInputArticle                                     = page.locator('div.magasins-autorises #article-id');
        this.pPdateInputCode                                        = page.locator('div.filtre-recherche-article-modif-date-tarification input');
    
        this.pPdateDatePeackerNlleDate                              = page.locator('div.magasins-autorises i.icon-calendar');
    
        this.pPdateDataGrid                                         = page.locator('div.liste-tarification-date-fin-valide datagrid th');
    
        this.pPbuttonModifier                                       = page.locator('div.popup-modification-datefin-tarification-masse div.modal-footer button');
    
        this.pPlinkAnnuler                                          = page.locator('div.popup-modification-datefin-tarification-masse div.modal-footer a');
    
        //-- Popin : Ajout de tarification ----------------------------------------------------------------------------------------------------
        this.pPopinAjouttarification                                = page.locator('.modal-backdrop')
        this.pPbuttonSauvegarder                                    = page.locator('.popup-tarification-magasin .modal-footer button:not(.ng-hide)');
        this.pButtonAnnuler                                         = page.locator('div.modal.hide.in > div.modal-footer > a');
    
        this.pInputArticle                                          = page.locator('form[name="formEditTarification"] #article-id');
        this.pPinputNomPromo                                        = page.locator('#nom-groupe-promotion');
        this.pPinputPrixCessionHT                                   = page.locator('#id-prix-cession');
        this.pPinputPVCTtc                                          = page.locator('.saisie-promotion #id-prix-vente');
        this.pPinputMagasin                                         = page.locator('.magasins-autorises input.input-medium.ng-scope');    
    
        this.pPlistBoxTypePromo                                     = page.locator('#type-promo-id');
        this.pDatePickerPromo                                       = page.locator('#datepickerDateFin');
        this.pTdDatePickerPromo                                     = page.locator('.datepicker-days .day:NOT(.disabled)').nth(0);
        this.pPautoCompleteArticle                                  = page.locator('.popup-tarification-magasin .gfit-autocomplete-results li');
        this.pPautoCompleteMagasins                                 = page.locator('.popup-tarification-magasin .gfit-autocomplete-results li');    
    
        this.pPcheckBoxThListeMagasin                               = page.locator('.liste-magasin table th input');
    
        this.pLinkPromotion                                         = page.locator('[ng-click="promotion()"]');
        this.pLinkTarification                                      = page.locator('[ng-click="tarification()"]');
        this.pLinkBaisseTarification                                = page.locator('[ng-click="baisseTarification()"]');
    
        //-- Popin / Bloc Promotion -----------------------------------------------------------------------------------------------------------
        this.pInputNom                                              = page.locator('#nom-groupe-promotion');
        this.pInputPrixCession                                      = page.locator('#id-prix-cession');
        this.pInputPVC                                              = page.locator('#id-prix-vente').nth(0);
        this.pInputPVCDetailHorsLots                                = page.locator('[ng-model="newTarification.venteDetail.pvc"]');    
        this.pInputNbOffert                                         = page.locator('[ng-model="newTarification.conditionTarifaire.quantiteOfferte"]');
        this.pInputNbAchete                                         = page.locator('[ng-model ="newTarification.conditionTarifaire.quantiteAchetee"]');    
    
        this.pListBoxTypePromo                                      = page.locator('#type-promo-id');
        this.pListBoxNatureDetail                                   = page.locator('[ng-model ="newTarification.venteDetail.natureDetail"]');
    
        this.pDatePickerFinPromo                                    = page.locator('[for="input-date-fin"]');
    
        this.pCheckBoxConditionsTarif                               = page.locator('#condition-tarifaire-cb');
        this.pCheckBoxVenteDetail                                   = page.locator('#vente-detail-cb');
    
        //-- Popin / Bloc Sélection des magasins ----------------------------------------------------------------------------------------------
        this.pInputMagasin                                          = page.locator('[ng-model="autocomplete.display"]');
    
        this.pListBoxSecteurProsol                                  = page.locator('[ng-model="filterValues.secteur.value"]');
        this.pListBoxRegionProsol                                   = page.locator('[ng-model="filterValues.regionProsol.value"]');
        this.pListBoxRegionGeographique                             = page.locator('[ng-model="filterValues.regionGeographique.value"]');    
    
        this.pToggleStrategie                                       = page.locator('[ng-click="dgMagasins.filters.updateStrategieFilter(strategie)"]');
        this.pTogglePlateforme                                      = page.locator('[ng-click="dgMagasins.filters.updatePlateformeFilter(plateforme)"]');
        this.pToggleGroupeMagasins                                  = page.locator('[ng-click="dgMagasins.filters.updateGroupeMagasinFilter(groupeMagasin)"]');
        this.pToggleSelectionnes                                    = page.locator('[ng-click="onToggle($event, choice)"]').nth(0);
        this.pToggleNonSelectionnes                                 = page.locator('[ng-click="onToggle($event, choice)"]').nth(1);
    
        this.dataGridListeMagasins                                  = page.locator('.liste-magasin .datagrid-table-wrapper > table > thead > tr > th');
    
        //-- Popin : Confirmation de l'envoi des tarifications -------------------------------------------------------------------------------
        this.pPopinConfirmationEnvoieTarification                   = page.locator('div.p-dialog-header')
        this.pButtonEnvoiPartiel                                    = page.locator('div.p-dialog-footer button.p-button:NOT(.p-button-link)').nth(0);
        this.pButtonEnvoiDefinitif                                  = page.locator('div.p-dialog-footer button.p-button:NOT(.p-button-link)').nth(1);
        this.pButtonEnvoiAnnuler                                    = page.locator('div.p-dialog-footer button.p-button-link');    
    
        //-- Popin : Calcul des marges -------------------------------------------------------------------------------------------------------
        this.pPopinCalculMArgeSurPeriode                            = page.locator('div.p-dialog-header')
        this.pPcalcMargeListBoxEnseigne                             = page.locator('[formcontrolname="enseignes"]').nth(0);
        this.pPcalcMargeListBoxGrArticle                            = page.locator('[formcontrolname="groupeArticle"]');
    
        this.pPcalcMargeCheckBoxChoix                               = page.locator('[formcontrolname="enseignes"] div.p-checkbox-box');
        this.pPcalcMargeCheckBoxAll                                 = page.locator('[formcontrolname="enseignes"]');

        this.pPcalcMargeIconClose                                   = page.locator('.p-multiselect-close-icon');
    
        this.pPcalcMargeButtonCalculer                              = page.locator('div.zone-recherche button.p-button');
    
        this.pPcalcMargeSwitchLiensExt                              = page.locator('.zone-recherche span.p-inputswitch-slider');
    
        this.pPcalcMargeLinkFermer                                  = page.locator('p-footer button');
    
        this.pPcalcMargeSpinner                                     = page.locator('i.app-spinner');
    
        this.pPcalcTdMarges                                         = page.locator('tbody td.valeur-marge-globale');
    
        this.pPcalcMargeInputFamille                                = page.locator('div.autocomplete-famille input');
        this.pPcalcMargeInputSousFamille                            = page.locator('div.autocomplete-sous-famille input');
    
        //-- Popin : Calcul des marges sur une période ---------------------------------------------------------------------------------------
        this.pPspinnerMargePeriode                                  = page.locator('.popup-marges-periodes .progressRing:not(.ng-hide)');
        
        this.pPlinkFermerMargePeriode                               = page.locator('calcul-marges-periodes-modal button.p-button-link');//('calcul-marges-periodes-modal-wrapper button.p-button-link')
    
        this.pPbuttonCalculerMarges                                 = page.locator('calcul-marges-periodes-modal .form-horizontal.form-calcul p-button');// //('calcul-marges-periodes-modal-wrapper button.p-component:NOT(.p-button-link)')
        this.pPtableResultatMarges                                  = page.locator('.resultat-marges p-table');
        
        //-- Popin : Historiqu des prix (hors promotion) ---------------------------------------------------------------------------------------
        this.pPInputArticle                                         = page.locator('#article-autocomplete');
        this.pPDatePickerDebut                                      = page.locator('#date-debut-periode');
        this.pPDatePickerFin                                        = page.locator('#date-fin-periode');
        this.pPlinkFermer                                           = page.locator('.p-dialog-footer button.p-button-link');
        this.pPopinHistoriqueDesPrix                                = page.locator('div.p-dialog-header');
        this.pPButtonAfficher                                       = page.locator('.form-historique .bloc button.p-ripple:not(.p-button-icon-only)');

        //-- Popin : Parametrage-----------------------------------------------------------------------------------------------------------------

        this.pPGroueMagFavoris                                     = page.locator('[formcontrolname="groupesMagasinsFavoris"]');

        this.pPCheckBoxAllGroupeFav                                = page.locator('.p-multiselect-header .p-checkbox-box');
        this.pPcheckBoxGroupeFav                                   = page.locator('p-multiselectitem .p-checkbox-box');

        this.pPButtonClose                                         = page.locator('button.p-multiselect-close .p-multiselect-close-icon');
        this.pPButtonAppliquer                                     = page.locator('.header-parametrage button.p-button');

        this.pPInputGroupeMagFav                                   = page.locator('input.p-multiselect-filter');
        this.spanMessageTransmission                               = page.locator('footer.form-btn-section span');
    }

}