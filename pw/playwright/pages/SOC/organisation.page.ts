/**
 * 
 * SOCIETES PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class PageOrganisation {

    public readonly buttonGererDirection                            : Locator
    public readonly buttonGererRegion                               : Locator
    public readonly buttonGererSecteur                              : Locator
    public readonly buttonCreerDirection                            : Locator
    public readonly buttonCreerRegion                               : Locator
    public readonly buttonCreerSecteur                              : Locator

    public readonly inputAccederA                                   : Locator

    public readonly iconChevronDown                                 : Locator
    public readonly iconAjouterLieuDeVente                          : Locator
    public readonly boutonPlus                                      : Locator
    public readonly secterIconChevronDown                           : Locator
    public readonly pTreenodeLabel                                  : Locator
    //-- Popin : Création d'une direction d'exploitation ------------------------------------------------------------
    public readonly pPinputCode                                     : Locator
    public readonly pPinputDesignation                              : Locator
    public readonly pPinputNomResponsable                           : Locator
    public readonly pPinputListeAdjoints                            : Locator

    public readonly pPcheckBoxAllGrpArticle                         : Locator

    public readonly pPlinkAnnuler                                   : Locator

    public readonly pPbuttonEnregistrer                             : Locator

    //-- Popin : Création d'une région -------------------------------------------------------------------------------
    public readonly pPregListBoxDirExploit                          : Locator
    public readonly pPregListBoxTechOuvert                          : Locator

    public readonly pPregInputCodeRegion                            : Locator
    public readonly pPregInputDesignRegion                          : Locator

    public readonly pPregAutoCompleteDirReg                         : Locator

    public readonly pPregLinkAnnuler                                : Locator

    public readonly pPregButtonEnregistrer                          : Locator

    //-- Popin : Création d'un secteur -------------------------------------------------------------------------------
    public readonly pPseclistBoxRegion                              : Locator

    public readonly pPsecInputCodeSecteur                           : Locator

    public readonly pPsecInputDesignRegion                          : Locator

    public readonly pPsecAutoCompleteResp                           : Locator

    public readonly pPsecLinkAnnuler                                : Locator

    public readonly pPsecButtonEnregistrer                          : Locator

    //-- Popin : Ajout d'un lieu de vente ---------------------------------------------------------------------------
    public readonly pPalvAutoCompleteLDV                            : Locator

    public readonly pPalvCheckBoxAllGrpArt                          : Locator

    public readonly pPalvButtonEnregistrer                          : Locator

    public readonly pCheckBoxgpeArticleClde                         : Locator
    public readonly pTrGroupeArticleClde                            : Locator
    public readonly pTdGroupeArticle                                : Locator
    public readonly pTdPourEntite                                   : Locator
    public readonly pErrorMessage                                   : Locator
    public readonly pListBoxRegion                                  : Locator
    public readonly buttonCreer                                     : Locator
    public readonly pAutocompleteDirectionRegion                    : Locator

    constructor(page: Page){

    this.boutonPlus                                                 = page.locator('.toggler .pi-plus').nth(0);
    this.buttonGererDirection                                       = page.locator('footerbar p-splitbutton button.p-splitbutton-defaultbutton').nth(0);
    this.buttonGererRegion                                          = page.locator('footerbar p-splitbutton button.p-splitbutton-defaultbutton').nth(1);
    this.buttonGererSecteur                                         = page.locator('footerbar p-splitbutton button.p-splitbutton-defaultbutton').nth(2);
    this.buttonCreerDirection                                       = page.locator('footerbar a span')
    this.buttonCreerRegion                                          = page.locator('footerbar a span')
    this.buttonCreerSecteur                                         = page.locator('footerbar a span')
    this.buttonCreer                                                = page.locator('footerbar a span')
    this.inputAccederA                                              = page.locator('p-tree input');

    this.iconChevronDown                                            = page.locator('td button span.pi-chevron-down');
    this.secterIconChevronDown                                      = page.locator('.p-treenode-children-container').nth(2);
    this.iconAjouterLieuDeVente                                     = page.locator('span.fa-plus-circle');

    this.pTreenodeLabel                                             = page.locator('.p-treenode-children-container .entete .contenu > div:nth-child(2) > b');
    //-- Popin : Création d'une direction d'exploitation ------------------------------------------------------------
    this.pPinputCode                                                = page.locator('input[formcontrolname="code"]');
    this.pPinputDesignation                                         = page.locator('input[formcontrolname="designation"]');
    this.pPinputNomResponsable                                      = page.locator('app-autocomplete input');
    this.pPinputListeAdjoints                                       =  page.locator('p-autocomplete[formcontrolname="adjoints"] input');

    this.pPcheckBoxAllGrpArticle                                    = page.locator('p-tableheadercheckbox .p-checkbox');

    this.pPlinkAnnuler                                              = page.locator('p-footer button.p-button-link');

    this.pPbuttonEnregistrer                                        = page.locator('p-footer button.p-button:NOT(.p-button-link)');

    //-- Popin : Création d'une région -------------------------------------------------------------------------------
    this.pPregListBoxDirExploit                                     = page.locator('p-dropdown[formcontrolname="organisationDirection"]');
    this.pPregListBoxTechOuvert                                     = page.locator('p-multiselect[formcontrolname="techniciensOuvertures"]');

    this.pPregInputCodeRegion                                       = page.locator('input[formcontrolname="code"]');
    this.pPregInputDesignRegion                                     = page.locator('input[formcontrolname="designation"]');

    this.pPregAutoCompleteDirReg                                    = page.locator('app-autocomplete[formcontrolname="responsable"] input');

    this.pPregLinkAnnuler                                           = page.locator('p-footer button.p-button-link');

    this.pPregButtonEnregistrer                                     = page.locator('p-footer button.p-button:NOT(.p-button-link)');

    //-- Popin : Création d'un secteur -------------------------------------------------------------------------------
    this.pPseclistBoxRegion                                         = page.locator('p-dropdown[formcontrolname="organisationRegion"]');

    this.pPsecInputCodeSecteur                                      = page.locator('input[formcontrolname="code"]');

    this.pPsecInputDesignRegion                                     = page.locator('input[formcontrolname="designation"]');

    this.pPsecAutoCompleteResp                                      = page.locator('app-autocomplete[formcontrolname="responsable"] input');

    this.pPsecLinkAnnuler                                           = page.locator('p-footer button.p-button-link');

    this.pPsecButtonEnregistrer                                     = page.locator('p-footer button.p-button:NOT(.p-button-link)');

    //-- Popin : Ajout d'un lieu de vente ---------------------------------------------------------------------------
    this.pPalvAutoCompleteLDV                                       = page.locator('app-autocomplete[formcontrolname="organisationLieu"] input');

    this.pPalvCheckBoxAllGrpArt                                     = page.locator('thead div[role="checkbox"]');

    this.pPalvButtonEnregistrer                                     = page.locator('p-footer button.p-button:NOT(.p-button-link)');

    this.pCheckBoxgpeArticleClde                                    = page.locator('tr.p-selectable-row:nth-child(1) .p-checkbox-box')
    this.pTdGroupeArticle                                           = page.locator('[scope="col"]:NOT(.text-center) input').nth(1)
    this.pTdPourEntite                                              = page.locator('[scope="col"]:NOT(.text-center) input').nth(2)

    this.pErrorMessage                                              = page.locator('div.alert.alert-danger.alert-dismissable.alert-error');
    this.pListBoxRegion                                             = page.locator('p-dropdownitem');
    this.pAutocompleteDirectionRegion                               = page.locator('ngb-typeahead-window button').first();
    this.pTrGroupeArticleClde                                       = page.locator('.p-datatable-tbody tr.p-selectable-row');
    }
}