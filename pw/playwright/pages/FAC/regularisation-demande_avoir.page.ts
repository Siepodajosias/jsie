/**
 * 
 * FACTURATION PAGE > REGULATION / ONGLET > DEMANDE D'AVOIR CLIENT
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.5
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RegulationDemandeAvoirPage  {

    public readonly buttonCreer                                         : Locator
    public readonly buttonModifier                                      : Locator
    public readonly buttonRegulariser                                   : Locator
    public readonly buttonAccepterEnMasse                               : Locator
    public readonly buttonConsulter                                     : Locator

    public readonly listBoxDossierAchat                                 : Locator  
    public readonly listBoxDemandes                                     : Locator
    public readonly listBoxTypeDemande                                  : Locator   

    public readonly inputSearchClient                                   : Locator 
    public readonly inputSearchArticle                                  : Locator 
    public readonly dataGridClients                                     : Locator      
    public readonly dataGridDemandedAvoir                               : Locator 
    public readonly tdDateDemande                                       : Locator 
    public readonly spinnerLoading                                      : Locator
    public readonly iVider                                              : Locator
    //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
    public readonly pButtonEnregsitrer                                  : Locator   
    public readonly pButtonFermer                                       : Locator   
    public readonly pButtonRechercher                                   : Locator   
    public readonly pButtonMagasin                                      : Locator   

    public readonly pInputArticle                                       : Locator 
    public readonly pInputMagasin                                       : Locator 
    public readonly pInputNbJours                                       : Locator        

    public readonly pListBoxTypeDemande                                 : Locator
    public readonly pDatePickerDateDemande                              : Locator

    public readonly pDataGridListeLots                                  : Locator 

    public readonly pTextAreaObservations                               : Locator  

    //-- Popin : Régularisation d'une demande d'avoir ------------------------------------------------------------------------------------

    public readonly pInputQuantiteAcceptee                              : Locator 
    public readonly pInputNouveauPrixCession                            : Locator 
    public readonly pInputPoidsAcceptee                                 : Locator

    public readonly pPRadiobuttonResponsabilite                         : Locator 
    public readonly pPRadiobuttonAcceptationDemande                     : Locator  
   
    public readonly pSpanTypeDemande                                    : Locator
    public readonly pSpanConsigne                                       : Locator

    public readonly pButtonEnregsitrerTypeMof                           : Locator
    public readonly pButtonRegulariser                                  : Locator
    public readonly pButtonAnnuler                                      : Locator
    public readonly pDivMessageInfo                                     : Locator
    public readonly pDivMotif                                           : Locator

    public readonly pTextareaCommentaire                                : Locator
    public readonly trDemandedAvoir                                     : Locator
    public readonly trClientDemandedAvoir                               : Locator

    constructor(page:Page){
        

        this.buttonCreer                                                = page.locator('[ng-click="ouvrirPopupNewDemandeAvoir()"]');
        this.buttonModifier                                             = page.locator('[ng-click="ouvrirPopupNewDemandeAvoir(data.demandesSelectionnees[0])"]');
        this.buttonRegulariser                                          = page.locator('[ng-click="ouvrirPopupRegularisationDemandeAvoir(data.demandesSelectionnees[0])"]');
        this.buttonAccepterEnMasse                                      = page.locator('[ng-click="ouvrirPopupRegularisationEnMasseDemandeAvoir(data.demandesSelectionnees)"]');
        this.buttonConsulter                                            = page.locator('[ng-click="ouvrirPopupVisualisationDemandeAvoir(data.demandesSelectionnees[0])"]');
    
        this.listBoxDossierAchat                                        = page.locator('[ng-model="dossierAchat"]');
        this.listBoxDemandes                                            = page.locator('[ng-model="dg.filters.AND[0].traite.value"]');
        this.listBoxTypeDemande                                         = page.locator('#input-type-demande');
    
        this.inputSearchClient                                          = page.locator('[ng-model="filterClient"]').locator('[ng-model="ngModel"]');
        this.inputSearchArticle                                         = page.locator('[ng-model="filterArticle"]');    
    
        this.dataGridClients                                            = page.locator('.ecarts-articles .datagrid-table-wrapper > table > thead > tr > th');    
        this.dataGridDemandedAvoir                                      = page.locator('.dg-demandes-avoir-clients .datagrid-table-wrapper > table > thead > tr > th');     
        this.tdDateDemande                                              = page.locator('thead .datagrid-date');
        this.trClientDemandedAvoir                                      = page.locator('.ecarts-articles .datagrid-table-wrapper > table > tbody > tr > td.datagrid-codeClient'); 
        this.trDemandedAvoir                                            = page.locator('.dg-demandes-avoir-clients .datagrid-table-wrapper > table > tbody > tr');

        this.spinnerLoading                                             = page.locator('[ng-show="loading"] img');
        this.iVider                                                     = page.locator('i.icon-remove').nth(1); 
        //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
        this.pButtonEnregsitrer                                         = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                              = page.locator('div.modal.hide.in > div.modal-footer > a');
        this.pButtonRechercher                                          = page.locator('[ng-click="rechercherLots();"]');
        this.pButtonMagasin                                             = page.locator('[ng-click="demande.$type = \'magasin\'; viderAutocompleteTiers()"]');
    
        this.pInputArticle                                              = page.locator('#input-article');
        this.pInputMagasin                                              = page.locator('#input-magasin');
        this.pInputNbJours                                              = page.locator('#input-jours');      
    
        this.pListBoxTypeDemande                                        = page.locator('#formSaisieDemande select#input-type-demande');
    
        this.pDatePickerDateDemande                                     = page.locator('[ng-model="formattedDate"]');
    
        this.pDataGridListeLots                                         = page.locator('.recherche-lots table > thead > tr > th');
    
        this.pTextAreaObservations                                      = page.locator('#observations');

        //-- Popin : Régularisation d'une demande d'avoir ---------------------------------------------------------------------------------------------
        this.pButtonEnregsitrerTypeMof                                  = page.locator('p-footer button').nth(0);
        this.pButtonRegulariser                                         = page.locator('p-footer button').nth(1);
        this.pButtonAnnuler                                             = page.locator('p-footer button').nth(2);

        this.pInputQuantiteAcceptee                                     = page.locator('#quantite-acceptee');
        this.pInputNouveauPrixCession                                   = page.locator('#nouveau-prix-cession');
        this.pInputPoidsAcceptee                                        = page.locator('#poids-accepte');
    
        this.pPRadiobuttonResponsabilite                                = page.locator('[formcontrolname="responsable"]');
        this.pPRadiobuttonAcceptationDemande                            = page.locator('[formcontrolname="acceptation"]');
        
        this.pSpanTypeDemande                                           = page.locator('[formcontrolname="typeDemande"] #type-demande');
        this.pSpanConsigne                                              = page.locator('[formcontrolname="consigne"] #consigne');

        this.pDivMotif                                                  = page.locator('[formcontrolname="motif"] > div');
        this.pDivMessageInfo                                            = page.locator('div.message-en-cas-de-regularisation');

        this.pTextareaCommentaire                                       = page.locator('#commentaire');
        
    }
}