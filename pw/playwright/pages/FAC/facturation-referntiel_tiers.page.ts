/**
 * 
 * APPLI    : FACTURATION 
 * PAGE     : FACTURATION 
 * ONGLET   : REFERENTIEL TIERS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class FacturationReferentielTiers {

    public readonly buttonCreationTiers                                     : Locator;

    public readonly listBoxTypeTiers                                        : Locator;

    public readonly inputSearch                                             : Locator;

    public readonly dataGridListeTiers                                      : Locator; 

    //-- Popin : Création d'un tiers -----------------------------------------------------------------------------------
    public readonly pButtonEnregistrer                                      : Locator;
    public readonly pButtonFermer                                           : Locator; 

    public readonly pInputAdresse1                                          : Locator;
    public readonly pInputAdresse2                                          : Locator;
    public readonly pInputCodePostal                                        : Locator;
    public readonly pInputCode                                              : Locator;
    public readonly pInputAbreviation                                       : Locator;
    public readonly pInputRaisonSociale                                     : Locator;
    public readonly pInputVille                                             : Locator;  
    public readonly pInputTelephone                                         : Locator;
    public readonly pInputFax                                               : Locator;
    public readonly pInputTvaCee                                            : Locator;
    public readonly pInputCompteTiers                                       : Locator;
    public readonly pInputJourEcheance                                      : Locator;
    public readonly pInputNbJoursEcheance                                   : Locator;
    //this.pInputEmail                = element(by.id('input-envoi-document-email'));
    public readonly pInputEmail                                             : Locator;

    public readonly pListBoxTypeTiers                                       : Locator; 
    public readonly pListBoxPays                                            : Locator;
    public readonly pListBoxCollectifTiers                                  : Locator;
    public readonly pListBoxTypeEcheance                                    : Locator;
    public readonly pListBoxTypeReglement                                   : Locator;

    public readonly pCheckBoxAvecReleveFacture                              : Locator;
    public readonly pCheckBoxExonerationTva                                 : Locator;
    public readonly pCheckBoxExonerationInterfel                            : Locator;
    public readonly pCheckBoxImpression                                     : Locator;

    public readonly pFeedBackErrorMessage                                   : Locator;

    constructor(page:Page){

        this.buttonCreationTiers                                            = page.locator('[ng-click="popupSaisieFacturable.open = true;"]');

        this.listBoxTypeTiers                                               = page.locator('#input-filter-type-facturable');
    
        this.inputSearch                                                    = page.locator('#input-filter-valeur > input');
    
        this.dataGridListeTiers                                             = page.locator('.datagrid-table-wrapper > table > thead > tr > th');
    
        //-- Popin : Création d'un tiers -----------------------------------------------------------------------------------
        this.pButtonEnregistrer                                             = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                                  = page.locator('div.modal.hide.in > div.modal-footer > a'); 
    
        this.pInputAdresse1                                                 = page.locator('#input-adresse1');
        this.pInputAdresse2                                                 = page.locator('#input-adresse2');
        this.pInputCodePostal                                               = page.locator('#input-cp');
        this.pInputCode                                                     = page.locator('#input-code');
        this.pInputAbreviation                                              = page.locator('#input-designation');
        this.pInputRaisonSociale                                            = page.locator('#input-raison-sociale');
        this.pInputVille                                                    = page.locator('#input-ville');
        this.pInputTelephone                                                = page.locator('#input-telephone');
        this.pInputFax                                                      = page.locator('#input-fax');
        this.pInputTvaCee                                                   = page.locator('#input-tvaCee');
        this.pInputCompteTiers                                              = page.locator('#input-compte-tiers');
        this.pInputJourEcheance                                             = page.locator('#input-jour-echeance');
        this.pInputNbJoursEcheance                                          = page.locator('#input-nb-jours-echeance');
        //this.pInputEmail                = element(by.id('input-envoi-document-email'));
        this.pInputEmail                                                    = page.locator('.tags input');
    
        this.pListBoxTypeTiers                                              = page.locator('#input-type');
        this.pListBoxPays                                                   = page.locator('#input-pays');
        this.pListBoxCollectifTiers                                         = page.locator('#input-collectif-tiers');
        this.pListBoxTypeEcheance                                           = page.locator('#input-type-echeance');
        this.pListBoxTypeReglement                                          = page.locator('#input-type-reglement');
    
        this.pCheckBoxAvecReleveFacture                                     = page.locator('#input-facturation-automatique');
        this.pCheckBoxExonerationTva                                        = page.locator('#input-exonere-tva');
        this.pCheckBoxExonerationInterfel                                   = page.locator('#input-exonere-interfel');
        this.pCheckBoxImpression                                            = page.locator('#input-envoi-document-impression');
    
        this.pFeedBackErrorMessage                                          = page.locator('.popup-saisie-tiers div.feedback-error:not(.ng-hide)');
    }
}