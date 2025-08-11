/**
 * 
 * PRICING PAGE > GESTION DES MAGASINS
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.5
 * 
 */

import { Locator, Page }    from "@playwright/test";
import { TestFunctions }    from '@helpers/functions';

export class GestionsMagasinPage {

    private readonly fonction                                   : TestFunctions;
    private readonly page                                       : Page;

    public readonly buttonCreerGroupeMagasin                    : Locator;
    public readonly buttonCreerMagasin                          : Locator;
    public readonly buttonAssocierMagasin                       : Locator; 
    public readonly buttonSelectionnes                          : Locator;
    public readonly buttonNonSelectionnes                       : Locator;
    public readonly buttonGroupeMagasin                         : Locator;
    public readonly pPaginatorGroupeMagasin                     : Locator;

    public readonly buttonModifGrpMagasin                       : Locator;
    public readonly buttonModifMagasin                          : Locator;

    public readonly inputSearch                                 : Locator;
    public readonly inputNomGroupeMag                           : Locator;

    public readonly checkBoxStrategie                           : Locator; 
    public readonly checkBoxVille                               : Locator; 
    public readonly checkBoxHabitudesAlim                       : Locator; 
    public readonly checkBoxProximiteGeo                        : Locator; 

    public readonly dataGridListeArticles                       : Locator; 
    public readonly dataGridListeMagasins                       : Locator; 
    public readonly dataListeMagasinSelectable                  : Locator;
    public readonly dataListeGroupeMagSelectable                : Locator;
    public readonly dataGridlisteActions                        : Locator; 

    public readonly tdNomMagasinSelectionnable                  : Locator;
    public readonly tdCodeClient                                : Locator;
    public readonly thAbreviation                               : Locator;

    public readonly theadNombreMagasinSelectionne               : Locator;

    public readonly theadCheckBoxAllMagasin                     : Locator;
    public readonly theadCheckBoxTarifAuto                      : Locator;
    public readonly theadIconTarifAuto                          : Locator;

    public readonly theadInputCodeMagasin                       : Locator;

    public readonly dataGridlinksActions                        : Locator;

    public readonly checkBoxMagasins                            : Locator;

    //-- Popin : Edition / Création d'un groupe ---------------------------------------------------------------------------------------------
    public readonly pPopinCreationGroupe                        : Locator;

    public readonly pButtonGroupeEnregistrer                    : Locator;
    public readonly pButtonGroupeAnnuler                        : Locator; 
    public readonly pPButtonSelectionManuelle                   : Locator;
    public readonly pPButtonRegleAppartenance                   : Locator;
    public readonly pButtonAjouterCritere                       : Locator;

    public readonly pInputGroupeNom                             : Locator;
    public readonly pInputGroupeDescription                     : Locator;
    public readonly pInputGroupeTauxCalculPVC                   : Locator;
    public readonly pInputPaysPourCalculPVC                     : Locator;
    public readonly pInputPaysItemPourCalculPVC                 : Locator;
    public readonly pInputGroupeMargePlateforme                 : Locator;
    public readonly pInputGroupeFraisLivraison                  : Locator;
    public readonly pInputPmultiselectFiltre                    : Locator;
    public readonly pInputMagasinInclus                         : Locator; 
    public readonly pInputMagasinExclu                          : Locator; 

    public readonly pLabelPaysPourCalculPVC                     : Locator;

    public readonly pDropdownCritere                            : Locator; 
    public readonly pDropdownReglesAppart                       : Locator; 
    public readonly pDropdownitemCritere                        : Locator; 

    public readonly pPmultiselectRegle                          : Locator;
    public readonly pPmultiselectFiliere                        : Locator;
    public readonly pPmultiselectItemFiliere                    : Locator;
    public readonly pPmultiselectItemRegle                      : Locator;
    public readonly pPmultiselectClose                          : Locator;
    public readonly pPmultiSelectChoix                          : Locator;
    public readonly pPmultiSelectChoixSelected                  : Locator;

    public readonly pPdropdownCritereTypeComparaison            : Locator; 
    public readonly pPdropdownCritereLabel                      : Locator; 
    public readonly pPdropdownItemCritereType                   : Locator;

    public readonly pAlertReglesAppartenance                    : Locator;

    public readonly pTrLignesAppartenance                       : Locator;

    //-- Popin : Création d'un magasin ---------------------------------------------------------------------------------------------------
    public readonly pButtonMagSauvegarder                       : Locator; //('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonMagAnnuler                           : Locator; //('#formSaisieMagasin div.modal-footer > a'); 

    public readonly pInputCode                                  : Locator; //('input-code');
    public readonly pInputAbreviation                           : Locator; //('input-abreviation');
    public readonly pInputRaisonSociale                         : Locator; //('input-raison-sociale');
    public readonly pInputNomEnseigne                           : Locator; //('input-nom-enseigne');
    public readonly pInputDateOuverture                         : Locator; //('input-date-ouverture');
    public readonly pInputDatePremRepart                        : Locator; //('input-date-premiere-repartition');
    public readonly pInputDateFermeture                         : Locator; //('input-date-fermeture');
    public readonly pInputMaregLissage                          : Locator; //('input-marge-lissage');
    public readonly pInputFraisLivraison                        : Locator; //('input-frais-livraison');
    public readonly pInputMargePlateforme                       : Locator; //('input-marge-plateforme');
    public readonly pInputAdresse                               : Locator; //('input-adresse');
    public readonly pInputAdresseComplement                     : Locator; //('input-complement-adresse');
    public readonly pInputCodePostal                            : Locator; //('input-code-postal');
    public readonly pInputVille                                 : Locator; //('input-ville');
    public readonly pInputNomResponsable                        : Locator; //('input-nom-responsable');
    public readonly pInputPrenomResponsable                     : Locator; //('input-prenom-responsable');
    public readonly pInputTelephoneResponsable                  : Locator; //('input-telephone-responsable');

    public readonly pDatePickerOuverture                        : Locator; //('.icon-calendar').nth(0);
    public readonly pDatePickerRepartition                      : Locator; //('.icon-calendar').nth(1);
    public readonly pDatePickerFermeture                        : Locator; //('.icon-calendar').nth(2);        
    public readonly pDatePickerFilieres                         : Locator; //('.table-date-applicabilite .icon-calendar');
    public readonly pDatePickerDaysFiliere                      : Locator; //('.datepicker-days td.day:not(.disabled)');

    public readonly pCalendarDay                                : Locator; //('.datepicker-days td');

    public readonly pLabelCalendarFilierePrepa                  : Locator; //('label.label-datepicker-filiere-preparation');

    public readonly pListBoxStrategie                           : Locator; //('select-strategie');
    public readonly pListBoxRegionGeo                           : Locator; //('select-region-geographique');
    public readonly pListBoxPays                                : Locator; //('select-pays');
    public readonly pListBoxSecteurProsol                       : Locator; //('select-secteur-prosol');
    public readonly pListBoxRegionProsol                        : Locator; //('select-region-prosol');
    public readonly pListBoxPlateformeFL                        : Locator; //('input-plateforme-00');
    public readonly pListBoxPlateformeFD                        : Locator; //('input-plateforme-01');
    public readonly pListBoxPlateformeIT                        : Locator; //('input-plateforme-21');       
    public readonly pListBoxPrepaSamedi                         : Locator; //('chargement-samedi');    
    public readonly pListBoxFilieres                            : Locator; //('div.table-plateforme-distribution select');
    public readonly pListBoxProchainePtfExp                     : Locator; //('div.table-prochaine-plateforme-expedition select');
    public readonly pListBoxProchainePtf                        : Locator; //('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-plateforme-distribution option');

    public readonly pListBoxChoixPrepaSamedi                    : Locator; //('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-chargement-samedi option');
    
    public readonly pCheckBoxMagasinExterne                     : Locator; //('input-externe');
    public readonly pCheckBoxTarifAuto                          : Locator; //('input-tarification_automatique');
    public readonly pCheckBoxOuvertDimanche                     : Locator; //('input-ouverture-dimanche');
    public readonly pCheckBoxPvcInterne                         : Locator; //('input-pvc-interne');
    public readonly pCheckBoxTypeClientele                      : Locator; //('caract-Clientèle-AIS');
    public readonly pCheckBoxConcurence                         : Locator; //('caract-Concurrence-AND');
    public readonly pCheckBoxHabitudeAlim                       : Locator; //('caract-Habitude alimentaire-AFR');
    public readonly pCheckBoxProximiteGeo                       : Locator; //('caract-Proximité géographique-LIT');
    public readonly pCheckBoxTailleSMEVA                        : Locator; //('caract-Taille SMEVA CR-SM4');
    public readonly pCheckBoxTailleMeuble                       : Locator; //('caract-Taille meuble UF-MU4');
    public readonly pCheckBoxTypoTraitMer                       : Locator; //('caract-Typo. trait. de la mer-T1');
    public readonly pChecBoxCaracteristiques                    : Locator; //('.caracteristiques-magasin input');       // la liste des toutes les caractéristiques !

    public readonly pDataGridGroupePlateforme                   : Locator; //('.groupes-article-table > thead > tr > th');
    public readonly pDataGridNomGroupe                          : Locator; //('.lignes-groupes-magasins table > thead > tr > th');
    public readonly pDataGridLignes                             : Locator; //('table.table-configuration-filieres tr.ng-scope');
    public readonly pDataGridListeFilieres                      : Locator; //('div.table-filiere-preparation');
    public readonly pDataGridListePtfCourantes                  : Locator; //('div.table-plateforme-courante');
    public readonly pDataGridListePtfExpCourant                 : Locator; //('div.table-plateforme-expedition-courante');
    public readonly pDataGridListePtfPrepa                      : Locator; //('div.table-plateforme-preparation');
    public readonly pDataGridListeFilieresPtf                   : Locator; //('div.table-plateforme-distribution');
    public readonly pDataGridListePrepaSamedi                   : Locator; //('div.table-chargement-samedi');

    public readonly pFeedBackErrorMessage                       : Locator; //('div.feedback-error:not(.ng-hide)');

    //-- Popin : Modification du magasin ----------------------------------------------------------------------------------------------------
    public readonly pCheckBoxTarifAutomatique                   : Locator;
    public readonly pCheckBoxTarifNonAutomatique                : Locator;

    public readonly pButtonMagasinEnregistrer                   : Locator;
    public readonly pButtonMagasinAnnuler                       : Locator;

    public readonly pSpinnerOn                                  : Locator;

    constructor(page:Page, fonction?:TestFunctions){

        this.fonction                                           = fonction;
        this.page                                               = page;

        this.buttonCreerGroupeMagasin                           = page.locator('button i.fa-plus');
        this.buttonCreerMagasin                                 = page.locator('[ng-click="editerMagasin()"]');
        this.buttonAssocierMagasin                              = page.locator('button span.icon-fast-backward');
        this.buttonSelectionnes                                 = page.locator('p-selectbutton [aria-labelledby="Sélectionnés"]');
        this.buttonNonSelectionnes                              = page.locator('p-selectbutton [aria-labelledby="Non sélectionnés"]');
        this.buttonGroupeMagasin                                = page.locator('button[title="Modifier"].text-dark');
        this.pPaginatorGroupeMagasin                            = page.locator('p-paginator span.p-paginator-pages button');

        this.buttonModifGrpMagasin                              = page.locator('button[title="Modifier"] i.fa-pencil-alt');
        this.buttonModifMagasin                                 = page.locator('button[title="Modifier"] em.fa-pencil-alt');

        this.inputSearch                                        = page.locator('div.barre-recherche input');
        this.inputNomGroupeMag                                  = page.locator('[field="nom"] p-columnfilterformelement input.p-inputtext');

        this.checkBoxStrategie                                  = page.locator('div.filtres-magasin p-checkbox').nth(0);
        this.checkBoxVille                                      = page.locator('div.filtres-magasin p-checkbox').nth(1);
        this.checkBoxHabitudesAlim                              = page.locator('div.filtres-magasin p-checkbox').nth(2);
        this.checkBoxProximiteGeo                               = page.locator('div.filtres-magasin p-checkbox').nth(3);

        this.dataGridListeArticles                              = page.locator('div.groupes-magasins-dg th.text-center');
        this.dataGridListeMagasins                              = page.locator('div.magasins-dg th.text-center');
        this.dataListeMagasinSelectable                         = page.locator('div.magasins-dg tbody tr.p-selectable-row');
        this.dataListeGroupeMagSelectable                       = page.locator('div.groupes-magasins-dg tbody tr.p-selectable-row');
        this.dataGridlisteActions                               = page.locator('#dgMagasins .contAction');
        
        this.tdNomMagasinSelectionnable                         = page.locator('tbody tr.p-selectable-row td:nth-child(1):NOT(.text-center)');
        this.tdCodeClient                                       = page.locator('td.col-code-client');
        this.thAbreviation                                      = page.locator('th.col-abreviation input');

        this.theadNombreMagasinSelectionne                      = page.locator('thead[role="rowgroup"] th.col-selection.text-center');

        this.theadCheckBoxAllMagasin                            = page.locator('thead p-tableheadercheckbox .p-checkbox-box');
        this.theadCheckBoxTarifAuto                             = page.locator('.col-automatique [field="tarificationAutomatique"] p-tristatecheckbox');
        this.theadIconTarifAuto                                 = page.locator('.col-automatique .fa-check');
        this.theadInputCodeMagasin                              = page.locator('thead p-columnfilter[field="codeClient"] input');

        this.dataGridlinksActions                               = page.locator('#dgMagasins .contAction a');
        this.checkBoxMagasins                                   = page.locator('p-tablecheckbox checkicon');

        //-- Popin : Création d'un groupe ----------------------------------------------------------------------------------------------------
        this.pPopinCreationGroupe                               = page.locator('div.p-dialog-heade');

        this.pButtonGroupeEnregistrer                           = page.locator('button.btn-enregistrer');
        this.pButtonGroupeAnnuler                               = page.locator('button.p-button-link'); 
        this.pPButtonRegleAppartenance                          = page.locator('#type-selection-magasins .p-button').nth(0);
        this.pPButtonSelectionManuelle                          = page.locator('#type-selection-magasins .p-button').nth(1);      
        this.pButtonAjouterCritere                              = page.locator('div.ajout-critere p-button > button');

        this.pInputGroupeNom                                    = page.locator('[formcontrolname="nom"]');
        this.pInputGroupeDescription                            = page.locator('[formcontrolname="description"]');
        this.pInputGroupeTauxCalculPVC                          = page.locator('[formcontrolname="tauxCalculPvCTheorique"]');
        this.pInputPaysPourCalculPVC                            = page.locator('p-dropdown[formcontrolname="pays"]');
        this.pInputPaysItemPourCalculPVC                        = page.locator('p-dropdownitem li');
        this.pInputGroupeMargePlateforme                        = page.locator('[formcontrolname="margePlateforme"]');
        this.pInputGroupeFraisLivraison                         = page.locator('[formcontrolname="fraisLivraisonParKg"]');
        this.pInputPmultiselectFiltre                           = page.locator('input.p-multiselect-filter');
        this.pInputMagasinInclus                                = page.locator('#saisie-groupe-magasin-input-magasins-inclus');
        this.pInputMagasinExclu                                 = page.locator('#saisie-groupe-magasin-input-magasins-exclu');

        this.pLabelPaysPourCalculPVC                            = page.locator('span#input-pays-groupe-magasin');

        this.pTrLignesAppartenance                              = page.locator('div.saisie');

        this.pDropdownCritere                                   = page.locator('div.ajout-critere p-dropdown');
        this.pDropdownReglesAppart                              = page.locator('div.selection-ajout-critere p-dropdown');
        this.pDropdownitemCritere                               = page.locator('p-dropdownitem li');
        this.pPdropdownCritereTypeComparaison                   = page.locator('p-dropdown[formcontrolname="critereTypeComparaison"]');
        this.pPdropdownItemCritereType                          = page.locator('.p-dropdown-items p-dropdownitem li');
        this.pPdropdownCritereLabel                             = page.locator('[formarrayname="critereAppartenanceGroupeMagasins"] .saisie');

        this.pPmultiselectRegle                                 = page.locator('p-multiselect[formcontrolname="valeurs"]');
        this.pPmultiselectFiliere                               = page.locator('p-dropdown[formcontrolname="valeurs"]');
        this.pPmultiselectItemFiliere                           = page.locator('p-dropdownitem li');
        this.pPmultiselectItemRegle                             = page.locator('p-multiselectitem');
        this.pPmultiselectClose                                 = page.locator('.p-multiselect-close');
        this.pPmultiSelectChoix                                 = page.locator('p-multiselectitem li');
        this.pPmultiSelectChoixSelected                         = page.locator('p-multiselectitem li.p-highlight');

        this.pAlertReglesAppartenance                           = page.locator('div.alert-info.regles-appartenance span');

        //-- Popin : Création d'un magasin ---------------------------------------------------------------------------------------------------
        this.pButtonMagSauvegarder                              = page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
        this.pButtonMagAnnuler                                  = page.locator('#formSaisieMagasin div.modal-footer > a'); 

        this.pInputCode                                         = page.locator('input-code');
        this.pInputAbreviation                                  = page.locator('input-abreviation');
        this.pInputRaisonSociale                                = page.locator('input-raison-sociale');
        this.pInputNomEnseigne                                  = page.locator('input-nom-enseigne');
        this.pInputDateOuverture                                = page.locator('input-date-ouverture');
        this.pInputDatePremRepart                               = page.locator('input-date-premiere-repartition');
        this.pInputDateFermeture                                = page.locator('input-date-fermeture');
        this.pInputMaregLissage                                 = page.locator('input-marge-lissage');
        this.pInputFraisLivraison                               = page.locator('input-frais-livraison');
        this.pInputMargePlateforme                              = page.locator('input-marge-plateforme');
        this.pInputAdresse                                      = page.locator('input-adresse');
        this.pInputAdresseComplement                            = page.locator('input-complement-adresse');
        this.pInputCodePostal                                   = page.locator('input-code-postal');
        this.pInputVille                                        = page.locator('input-ville');
        this.pInputNomResponsable                               = page.locator('input-nom-responsable');
        this.pInputPrenomResponsable                            = page.locator('input-prenom-responsable');
        this.pInputTelephoneResponsable                         = page.locator('input-telephone-responsable');

        this.pDatePickerOuverture                               = page.locator('.icon-calendar').nth(0);
        this.pDatePickerRepartition                             = page.locator('.icon-calendar').nth(1);
        this.pDatePickerFermeture                               = page.locator('.icon-calendar').nth(2);        
        this.pDatePickerFilieres                                = page.locator('.table-date-applicabilite .icon-calendar');
        this.pDatePickerDaysFiliere                             = page.locator('.datepicker-days td.day:not(.disabled)');

        this.pCalendarDay                                       = page.locator('.datepicker-days td');

        this.pLabelCalendarFilierePrepa                         = page.locator('label.label-datepicker-filiere-preparation');

        this.pListBoxStrategie                                  = page.locator('select-strategie');
        this.pListBoxRegionGeo                                  = page.locator('select-region-geographique');
        this.pListBoxPays                                       = page.locator('select-pays');
        this.pListBoxSecteurProsol                              = page.locator('select-secteur-prosol');
        this.pListBoxRegionProsol                               = page.locator('select-region-prosol');
        this.pListBoxPlateformeFL                               = page.locator('input-plateforme-00');
        this.pListBoxPlateformeFD                               = page.locator('input-plateforme-01');
        this.pListBoxPlateformeIT                               = page.locator('input-plateforme-21');       
        this.pListBoxPrepaSamedi                                = page.locator('chargement-samedi');    
        this.pListBoxFilieres                                   = page.locator('div.table-plateforme-distribution select');
        this.pListBoxProchainePtfExp                            = page.locator('div.table-prochaine-plateforme-expedition select');
        this.pListBoxProchainePtf                               = page.locator('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-plateforme-distribution option');

        this.pListBoxChoixPrepaSamedi                           = page.locator('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-chargement-samedi option');
        
        this.pCheckBoxMagasinExterne                            = page.locator('input-externe');
        this.pCheckBoxTarifAuto                                 = page.locator('input-tarification_automatique');
        this.pCheckBoxOuvertDimanche                            = page.locator('input-ouverture-dimanche');
        this.pCheckBoxPvcInterne                                = page.locator('input-pvc-interne');
        this.pCheckBoxTypeClientele                             = page.locator('caract-Clientèle-AIS');
        this.pCheckBoxConcurence                                = page.locator('caract-Concurrence-AND');
        this.pCheckBoxHabitudeAlim                              = page.locator('caract-Habitude alimentaire-AFR');
        this.pCheckBoxProximiteGeo                              = page.locator('caract-Proximité géographique-LIT');
        this.pCheckBoxTailleSMEVA                               = page.locator('caract-Taille SMEVA CR-SM4');
        this.pCheckBoxTailleMeuble                              = page.locator('caract-Taille meuble UF-MU4');
        this.pCheckBoxTypoTraitMer                              = page.locator('caract-Typo. trait. de la mer-T1');
        this.pChecBoxCaracteristiques                           = page.locator('.caracteristiques-magasin input');       // la liste des toutes les caractéristiques !

        this.pDataGridGroupePlateforme                          = page.locator('.groupes-article-table > thead > tr > th');
        this.pDataGridNomGroupe                                 = page.locator('.lignes-groupes-magasins table > thead > tr > th');
        this.pDataGridLignes                                    = page.locator('table.table-configuration-filieres tr.ng-scope');
        this.pDataGridListeFilieres                             = page.locator('div.table-filiere-preparation');
        this.pDataGridListePtfCourantes                         = page.locator('div.table-plateforme-courante');
        this.pDataGridListePtfExpCourant                        = page.locator('div.table-plateforme-expedition-courante');
        this.pDataGridListePtfPrepa                             = page.locator('div.table-plateforme-preparation');
        this.pDataGridListeFilieresPtf                          = page.locator('div.table-plateforme-distribution');
        this.pDataGridListePrepaSamedi                          = page.locator('div.table-chargement-samedi');

        this.pFeedBackErrorMessage                              = page.locator('div.feedback-error:not(.ng-hide)');

        //-- Popin : Modification du magasin 
        this.pCheckBoxTarifAutomatique                          = page.locator('p-checkbox[formcontrolname="tarificationAutomatique"] .p-checkbox-icon');
        this.pCheckBoxTarifNonAutomatique                       = page.locator('p-checkbox[formcontrolname="tarificationAutomatique"] .p-checkbox');

        this.pButtonMagasinEnregistrer                          = page.locator('p-footer button span.p-button-label').nth(0);
        this.pButtonMagasinAnnuler                              = page.locator('p-footer button span.p-button-label').nth(1);

        this.pSpinnerOn                                         = page.locator('span.app-spinner');
    }

    /**
     * 
     * @param sRegle Le nom de la règle d'appartenance à ajouter
     * @param sCible La valeur cible de la règle d'appartenance à ajouter
     */
    public async setRegleAppartenance(sRegle: string, sCible: string): Promise<void> {

        this.fonction.log.separateur();

        //-- On déroule la liste des règles d'appartenance afin d'en afficher le contenu
        await this.fonction.clickElement(this.pDropdownReglesAppart);

        //-- Si la règle d'appartenance figure dans le liste de choix, c'est qu'elle n'a pas déjà été ajoutée
        const bRegleAbsente:boolean = await this.pDropdownitemCritere.filter({hasText:sRegle}).count() === 1;

        if (bRegleAbsente) {
            this.fonction.log.set('Règle d\'appartenance "' + sRegle + '" absente, on l\'ajoute');
            //-- On sélectionne la règle d'appartenance "sRegle" dans la liste déroulante
            await this.fonction.clickElement(this.pDropdownitemCritere.filter({hasText:sRegle}).nth(0));

            //-- On clique sur le bouton pour ajouter la règle d'appartenance
            await this.fonction.clickElement(this.pButtonAjouterCritere);
            await this.fonction.waitForDomStable(this.page);              // On attend que la règle soit ajoutée
        } else {
            this.fonction.log.set('Règle d\'appartenance "' + sRegle + '" déjà présente');

            //-- On replis la liste déroulante des règles d'appartenance
            await this.fonction.clickElement(this.pDropdownReglesAppart);
        }

        const iNbRegles = await this.pTrLignesAppartenance.count();
        const aRegles   = await this.pTrLignesAppartenance.locator('.label-critere').allTextContents();

        for(let iLigne = 0; iLigne < iNbRegles; iLigne++){ 

            if(aRegles[iLigne].includes(sRegle)) {

                this.fonction.log.set('Critère "' + aRegles[iLigne] + '" trouvé ligne #' + iLigne);                        

                //-- L'affichage des choix dans le champ input pouvant être condensé, il faut déplier la liste déroulante en cliquant dessus
                await this.fonction.clickElement(this.pTrLignesAppartenance.nth(iLigne).locator('div.p-multiselect-label-container'));        
                
                //-- On recherche parmi les options de la liste déroulante si la cible y est déjà sélectionnée
                const aChoix = await this.pPmultiSelectChoixSelected.allTextContents();
                if(!aChoix.includes(sCible)) {
                    this.fonction.log.set('Option "' + sCible + '" non trouvée, on l\'ajoute');
                    await this.fonction.clickElement(this.pPmultiSelectChoix.filter({hasText:sCible}).nth(0)); // On clique sur la première option qui est "AUTRES"
                } else {
                    this.fonction.log.set('Option "' + sCible + '" déjà présente');
                }

            } else {
                this.fonction.log.set('Critère "' + aRegles[iLigne] + '" ignoré');
            }

        }
        
    }

}