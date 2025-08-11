/**
 * 
 * SOCIETES PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageClients {

    public readonly buttonCreerClient                     :Locator
    public readonly buttonModifierClient                  :Locator
    public readonly buttonModifierEnMasse                 :Locator
    public readonly dataGridClients                       :Locator
    public readonly spinnerLoading                        :Locator;

    //--- Popin : Création d'un client ------------------------------------------------------------------------------------
        //--- Sous Onglet : Client -----------------------
    public readonly pPcreateCheckBoxLieSoc                :Locator
    public readonly pPcreateCheckBoxLieLCV                :Locator
    public readonly pPcreateCheckBoxExoTVA                :Locator
    public readonly pPcreateCheckBoxINTERFEL              :Locator
    public readonly pPcreateCheckBoxReleve                :Locator
    public readonly pPcreateCheckBoxImpres                :Locator

    public readonly pPcreateInputCodeCLient               :Locator
    public readonly pPcreateInputAncienCodeCLient         :Locator
    public readonly pPcreateInputRaisonSoc                :Locator
    public readonly pPcreateInputCplAdresse               :Locator
    public readonly pPcreateInputTVACEE                   :Locator
    public readonly pPcreateInputAxeAna                   :Locator
    public readonly pPcreateInputJoursEch                 :Locator
    public readonly pPcreateInputNbJoursEch               :Locator
    public readonly pPcreateInputCptTiers                 :Locator  
    public readonly pPcreateInputLieuVente                :Locator
    public readonly pPcreateInputEmails                   :Locator

    public readonly pPcreateAutoCompDesiLDV               :Locator
    public readonly pPcreateAutoCompSociete               :Locator

    public readonly pPcreateListBoxTypeCli                :Locator
    public readonly pPcreateListBoxPays                   :Locator
    public readonly pPcreateListBoxRegion                 :Locator
    public readonly pPcreateListBoxColTiers               :Locator
    public readonly pPcreateListBoxTypeEch                :Locator
    public readonly pPcreateListBoxTypeReg                :Locator

    public readonly pPcreateLinkAnnuler                   :Locator

    public readonly pPcreateBtnEnregistrer                :Locator

    public readonly pPcreateOngletClient                  :Locator

    public readonly pPcreateInputAdresse                  :Locator               
    public readonly pPcreateInputAdresseComplete          :Locator 
    public readonly pPcreateInputCodePostal               :Locator    
    public readonly pPcreateInputVille                    :Locator  

        //--- Sous Onglet : Centrale d'Achat -----------------------

    public readonly pPcreateOngletCentrale                :Locator
    public readonly pPcreateOngletPlus                    :Locator

    public readonly pPcreateListBoxRayon                  :Locator
    public readonly pPcreateListBoxFournis                :Locator

    public readonly pPcreateListBoxAbrev                  :Locator

    public readonly pPcreateDatePickerRep                 :Locator

    public readonly pPcreateTdDateToday                   :Locator
    public readonly pPcreateTdDateDispo                   :Locator

    public readonly pPcreateInputCodeUVACRegion           :Locator
    public readonly pPcreateInputCodeUVACCommune          :Locator
    public readonly pPcreateInputNumeroEnregistrement     :Locator

    public readonly pPcreateDateApplicabilitePlateForme   :Locator

    public readonly pPcreateListBoxPreparation            :Locator  
    public readonly pPcreateListBoxPlateforme             :Locator
    public readonly pPcreateListBox                       :Locator
    public readonly pPcreateButtonPlus                    :Locator
    public readonly pPcreateButtonActif                   :Locator
    public readonly pPcreateButtonLabel                   :Locator
    public readonly pPcreateAutoCompItem                  :Locator
    public readonly pErrorMessage                         :Locator 
    public readonly pPbuttonAjouterCentraleAchat          :Locator
    public readonly pDatePickerDateApplicabilitePlateForme:Locator
    
    public readonly datagridInputFiltre                   : Locator
    public readonly dataGridTrClient                      : Locator


    constructor(page:Page){

        this.buttonCreerClient                          = page.locator('.footerBar button span.fa-plus');
        this.buttonModifierClient                       = page.locator('.footerBar button span.fa-pencil-alt');
        this.buttonModifierEnMasse                      = page.locator('.footerBar p-button.btn-no-icon');
        this.dataGridClients                            = page.locator('table th.text-center');

        this.datagridInputFiltre                        = page.locator('.p-treetable-thead tr input');
        this.dataGridTrClient                           = page.locator('.p-treetable-tbody tr.row-child');
        this.spinnerLoading                             = page.locator('.app-spinner');
    
        //--- Popin : Création d'un client ------------------------------------------------------------------------------------
            //--- Sous Onglet : Client -----------------------
        this.pPcreateCheckBoxLieSoc                     = page.locator('p-tabpanel:nth-child(1) p-checkbox[inputid="lieSociete"]');
        this.pPcreateCheckBoxLieLCV                     = page.locator('p-tabpanel:nth-child(1) p-checkbox[inputid="lieLieuVente"]');
        this.pPcreateCheckBoxExoTVA                     = page.locator('p-tabpanel:nth-child(1) p-checkbox[formcontrolname="exonereTva"]');
        this.pPcreateCheckBoxINTERFEL                   = page.locator('p-tabpanel:nth-child(1) p-checkbox[formcontrolname="exonereInterfel"]');
        this.pPcreateCheckBoxReleve                     = page.locator('p-tabpanel:nth-child(1) p-checkbox[formcontrolname="avecReleveFacture"]');
        this.pPcreateCheckBoxImpres                     = page.locator('#avecImpression');
        
        this.pPcreateInputRaisonSoc                     = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="raisonSociale"]');
        this.pPcreateInputCodeCLient                    = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="code"]');
        this.pPcreateInputAncienCodeCLient              = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="ancienCode"]');
        this.pPcreateInputAdresse                       = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="adresse1"]');
        this.pPcreateInputCplAdresse                    = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="adresse2"]');
        this.pPcreateInputCodePostal                    = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="codePostal"]');
        this.pPcreateInputVille                         = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="ville"]');
        this.pPcreateInputTVACEE                        = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="tvaCEE"]');
        this.pPcreateInputAxeAna                        = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="axeAnalytique"]');
        this.pPcreateInputJoursEch                      = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="jourEcheance"]');
        this.pPcreateInputNbJoursEch                    = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="nbJourEcheance"]');
        this.pPcreateInputCptTiers                      = page.locator('p-tabpanel:nth-child(1) input[formcontrolname="numeroCompteTiers"]');
        this.pPcreateInputLieuVente                     = page.locator('p-tabpanel:nth-child(1) app-autocomplete[formcontrolname="lieuVente"]');
        this.pPcreateInputEmails                        = page.locator('p-tabpanel:nth-child(1) p-chips[formcontrolname="emails"]');
        
        this.pPcreateAutoCompDesiLDV                    = page.locator('p-tabpanel:nth-child(1) app-autocomplete[formcontrolname="lieuVente"]');
        this.pPcreateAutoCompSociete                    = page.locator('p-tabpanel:nth-child(1) app-autocomplete[formcontrolname="societe"]');
        
        this.pPcreateButtonPlus                         = page.locator('li[role="presentation"] a');
        this.pPcreateButtonActif                        = page.locator('li[role="presentation"] a[aria-selected="true"]');
        this.pPcreateButtonLabel                        = page.locator('tr.row-child td:NOT(.col-expand )');
        this.pPcreateListBoxTypeCli                     = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="typeClient"]');
        this.pPcreateListBoxPays                        = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="codePaysIso"]');
        this.pPcreateListBoxRegion                      = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="region"]');
        this.pPcreateListBoxColTiers                    = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="collectifTiers"]');
        this.pPcreateListBoxTypeEch                     = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="typeEcheance"]');
        this.pPcreateListBoxTypeReg                     = page.locator('p-tabpanel:nth-child(1) p-dropdown[formcontrolname="typeReglement"]');
        
        this.pPcreateLinkAnnuler                        = page.locator('p-footer button.p-button-link');
        
        this.pPcreateBtnEnregistrer                     = page.locator('p-footer button.p-button:NOT(.p-button-link)'); 
        
        this.pPcreateOngletClient                       = page.locator('li[role="presentation"] a').nth(0);
        
        this.pPcreateInputAdresse                       = page.locator('input[formcontrolname="adresse1"]');
        this.pPcreateInputAdresseComplete               = page.locator('input[formcontrolname="adresse2"]');
        this.pPcreateInputCodePostal                    = page.locator('input[formcontrolname="codePostal"]');
        this.pPcreateInputVille                         = page.locator('input[formcontrolname="ville"]');
    
            //--- Sous Onglet : Centrale d'Achat -----------------------

        this.pPcreateOngletCentrale                     = page.locator('li[role="presentation"] a').nth(1);
        this.pPcreateOngletPlus                         = page.locator('.ajout-relation #p-tabpanel-3-label');
        
        this.pPcreateListBoxRayon                       = page.locator('p-tabpanel:nth-child(2) p-dropdown[formcontrolname="rayon"]');
        this.pPcreateListBoxFournis                     = page.locator('p-tabpanel:nth-child(2) p-dropdown[formcontrolname="fournisseur"]');
        this.pPcreateListBoxAbrev                       = page.locator('p-tabpanel:nth-child(2) p-dropdown[formcontrolname="abreviationRayon"]');
        
        this.pPcreateDatePickerRep                      = page.locator('p-tabpanel:nth-child(2) p-calendar[formcontrolname="datePremiereRepartition"]');
        
        this.pPcreateTdDateToday                        = page.locator('td.p-datepicker-today');
        this.pPcreateTdDateDispo                        = page.locator('td.ng-star-inserted:NOT(.p-datepicker-other-month):NOT(.text-center)');
        
        this.pPcreateInputCodeUVACRegion                = page.locator('#client-code-uvac-regional');
        this.pPcreateInputCodeUVACCommune               = page.locator('#client-code-uvac-commune');
        this.pPcreateInputNumeroEnregistrement          = page.locator('#client-numero-enregistrement');
        
        this.pPcreateDateApplicabilitePlateForme        = page.locator('.p-datepicker-calendar span:NOT(.p-disabled).ng-star-inserted');
        
        this.pPcreateListBoxPreparation                 = page.locator('p-dropdownitem li').nth(0);  
        this.pPcreateListBoxPlateforme                  = page.locator('p-dropdownitem li'); 
        this.pPcreateListBox                            = page.locator('p-dropdownitem li');
        
        this.pErrorMessage                              = page.locator('div.alert.alert-danger.alert-dismissable.alert-error');
        this.pPcreateAutoCompItem                       = page.locator('ngb-typeahead-window button');
        this.pPbuttonAjouterCentraleAchat               = page.locator('li[role="presentation"] a');
        this.pDatePickerDateApplicabilitePlateForme     = page.locator('.p-datepicker-next');
    }
}