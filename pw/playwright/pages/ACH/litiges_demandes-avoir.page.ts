/**
 * APPLI    : ACHATS
 * MENU     : Litiges
 * ONGLET   : Demandes d'avoir
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageLitDemAvo {

    public readonly buttonApprouver                : Locator;   //(by.css('[ng-click="approuverDemande(demandeSelectionnee)"]');
    public readonly buttonImprimerUneDAV           : Locator;   //(by.css('[ng-click="imprimerDemandeAvoir(demandeSelectionnee)"]');
    public readonly buttonAbandonnerUneDAV         : Locator;   //(by.css('[ng-click="abandonnerDemande(demandeSelectionnee)"]');
    public readonly buttonRetablirUneDAV           : Locator;   //(by.css('[ng-click="retablirDemande(demandeSelectionnee)"]');

    public readonly checkBoxToutAfficher           : Locator;   //(by.id('checkbox-toggle-demandes');
    public readonly checkBoxListeDemandesAvoir     : Locator;   //.all(by.css('div.datagrid-table-wrapper > table > tbody > tr > td > input');

    public readonly inputFieldFiltreCodeArticle    : Locator;   //(by.model('filtre.article');
    public readonly inputFieldFiltreFournisseur    : Locator;   //(by.model('filtre.fournisseur');
    public readonly inputFieldFiltrePlateforme     : Locator;   //(by.model('filtre.plateforme');
    public readonly inputFieldFiltreLot            : Locator;   //(by.model('filtre.numeroLot');
    public readonly inputFieldFiltreDemandeAvoir   : Locator;   //(by.model('filtre.code');
    public readonly inputFieldDateDebut            : Locator;
    public readonly inputFieldDateFin              : Locator;

    public readonly dataGridlisteDemandesAvoir     : Locator;   //.all(by.css('.demandes-avoir-liste .datagrid-table-wrapper th');

    public readonly tdNumLot                       : Locator;   //.all(by.css('td.datagrid-numeroLot span');
    public readonly tdNumDemandeAvoir              : Locator;   //.all(by.css('td.datagrid-code span');
    public readonly tdDateDemandeAvoir             : Locator;
    public readonly tdPlateformeReception          : Locator;
    public readonly tdCodeArticle                  : Locator;
    public readonly tdDesignationArticle           : Locator;
    public readonly tdCodeFournisseur              : Locator;
    public readonly tdDesignFournisseur            : Locator;
    public readonly tdMontant                      : Locator;
    public readonly tdQteLitige                    : Locator;
    public readonly tdType                         : Locator;
    public readonly tdRaison                       : Locator;
    public readonly tdStatut                       : Locator;
    public readonly tdBlConcernes                  : Locator;


    //-- Popin : Approbation de la demande d'avoir n° XXXXXXXXXXX -----------------------------------------------------------------
    public readonly pTexteAreaCommentaire          : Locator;   //(by.id('creer-demande-avoir-observation');

    public readonly pButtonApprouver               : Locator;   //(by.css('.modal-creation-demande-avoir button.btn-primary');   

    public readonly pLinkFermer                    : Locator;   //(by.css('.modal-creation-demande-avoir a');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonApprouver                = page.locator('[ng-click="approuverDemande(demandeSelectionnee)"]');
        this.buttonImprimerUneDAV           = page.locator('[ng-click="imprimerDemandeAvoir(demandeSelectionnee)"]');
        this.buttonAbandonnerUneDAV         = page.locator('[ng-click="abandonnerDemande(demandeSelectionnee)"]');
        this.buttonRetablirUneDAV           = page.locator('[ng-click="retablirDemande(demandeSelectionnee)"]');
    
        this.checkBoxToutAfficher           = page.locator('[ng-model="toutesLesDemandes"]');
        this.checkBoxListeDemandesAvoir     = page.locator('div.datagrid-table-wrapper > table > tbody > tr > td > input');
    
        this.inputFieldFiltreCodeArticle    = page.locator('span[ng-model="filtre.article"] input');
        this.inputFieldFiltreFournisseur    = page.locator('span[ng-model="filtre.fournisseur"] input');
        this.inputFieldFiltrePlateforme     = page.locator('span[ng-model="filtre.plateforme"] input');
        this.inputFieldFiltreLot            = page.locator('span[ng-model="filtre.numeroLot"] input');
        this.inputFieldFiltreDemandeAvoir   = page.locator('span[ng-model="filtre.code"] input');
        this.inputFieldDateDebut            = page.locator('#litiges-input-date-debut');
        this.inputFieldDateFin              = page.locator('#litiges-input-date-fin');
    
        this.dataGridlisteDemandesAvoir     = page.locator('.demandes-avoir-liste .datagrid-table-wrapper th');
    
        this.tdNumLot                       = page.locator('td.datagrid-numeroLot span');
        this.tdNumDemandeAvoir              = page.locator('td.datagrid-code span');
        this.tdDateDemandeAvoir             = page.locator('tbody tr td.datagrid-dateDemande');
        this.tdPlateformeReception          = page.locator('tbody tr td.datagrid-plateforme-designation');
        this.tdCodeArticle                  = page.locator('tbody tr td.datagrid-article-code');
        this.tdDesignationArticle           = page.locator('tbody tr td.datagrid-article-designation');
        this.tdCodeFournisseur              = page.locator('tbody tr td.datagrid-fournisseur-code');
        this.tdDesignFournisseur            = page.locator('tbody tr td.datagrid-fournisseur-designation');
        this.tdMontant                      = page.locator('tbody tr td.datagrid-montant');
        this.tdQteLitige                    = page.locator('tbody tr td.datagrid-qteColis');
        this.tdType                         = page.locator('tbody tr td.datagrid-type');
        this.tdRaison                       = page.locator('tbody tr td.datagrid-raison');
        this.tdStatut                       = page.locator('tbody tr td.datagrid-statut');
        this.tdBlConcernes                  = page.locator('tbody tr td.datagrid-bonsLivraison');

        //-- Popin : Approbation de la demande d'avoir n° XXXXXXXXXXX -----------------------------------------------------------------
        this.pTexteAreaCommentaire          = page.locator('textarea id="creer-demande-avoir-observation"');
    
        this.pButtonApprouver               = page.locator('.modal-creation-demande-avoir button.btn-primary');   
    
        this.pLinkFermer                    = page.locator('.modal-creation-demande-avoir a');

    }

}