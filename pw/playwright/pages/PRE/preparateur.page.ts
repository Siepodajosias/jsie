/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : PRODUCTIVITE
 * ONGLET   : GESTION PREPARATEURS
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.3
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdGestionPreparateursPage {

    public readonly inputCodeIdentification     : Locator;   //.Locator;('#code');   
    public readonly inputNumeroSupport          : Locator;  //.Locator;('form input');
    public readonly  InputEmplacement           : Locator; //('.popin-feuille-terminee-ou-suspendue-container form p-autocomplete#emplacement input')
    public readonly   emplacementItem           : Locator;

    public readonly buttonValider               : Locator; //('.popin-feuille-terminee-ou-suspendue-container form button ')

    public readonly iconsPreparations           : Locator;

    public readonly timer                       : Locator;

    public readonly feedBackMessage             : Locator;    //.Locator;('span.ui-dialog-title');

    public readonly labelNomPreparateur         : Locator;  //.Locator;('span.nom-preparateur');

    public readonly  datagridTache              : Locator;    //('div.task-container table');
    public readonly  datgridTdStatut            : Locator;   //('div.task-container table tbody tr:nth-child(1) td.colonne-statut span');
    public readonly  datagridTdHeureDebut        : Locator;  //('div.task-container table tbody tr:nth-child(1) td.colonne-heure-debut span');
    public readonly  datagridTdHeureFin          : Locator; //('div.task-container table tbody tr:nth-child(1) td.colonne-heure-fin span');

  

    public readonly messageErreur               : Locator; 
    
    public readonly spinner                     : Locator;

    //-- Popin : Erreur de lecture Matricule ------------------------------------------------------------------------------------------
    public readonly pPbuttonErrMatriculeRetour : Locator;    //.Locator;('p-dialog button');               

    //-- Popin : Erreur de lecture Feuille  -------------------------------------------------------------------------------------------
    public readonly pPbuttonErrFeuilleRetour   : Locator;  //.Locator;('#modalBoutonRetour');  

    constructor(page: Page){

        this.inputCodeIdentification    = page.locator('#code');   
        this.inputNumeroSupport         = page.locator('form input#numeroSupport');
        this.InputEmplacement           = page.locator('.popin-feuille-terminee-ou-suspendue-container form p-autocomplete#emplacement input') //('.popin-feuille-terminee-ou-suspendue-container form p-autocomplete#emplacement input')
        this.emplacementItem            = page.locator('.popin-feuille-terminee-ou-suspendue-container form p-overlay  ul > li');             //('.popin-feuille-terminee-ou-suspendue-container form p-overlay  ul > li> span')

        this.iconsPreparations          = page.locator('.img-polaroid');

        this.timer                      = page.locator('h2.timer');

        this.feedBackMessage            = page.locator('span.ui-dialog-title');

        this.labelNomPreparateur        = page.locator('span.nom-preparateur');

        this.datagridTache              = page.locator('div.task-container table');
        this.datgridTdStatut            = page.locator('div.task-container table tbody tr:nth-child(1) td.colonne-statut      span');
        this.datagridTdHeureDebut       = page.locator('div.task-container table tbody tr:nth-child(1) td.colonne-heure-debut span');
        this.datagridTdHeureFin         = page.locator('div.task-container table tbody tr:nth-child(1) td.colonne-heure-fin   span');

        this.buttonValider              = page.locator('.popin-feuille-terminee-ou-suspendue-container form button') //('.popin-feuille-terminee-ou-suspendue-container form button ')


        this.messageErreur              = page.locator('div[role=dialog]').nth(0);

        this.spinner                    = page.locator('div.ng-star-inserted img.timer');
        //-- Popin : Erreur de lecture Matricule ------------------------------------------------------------------------------------------
        this.pPbuttonErrMatriculeRetour = page.locator('p-dialog button');               

        //-- Popin : Erreur de lecture Feuille  -------------------------------------------------------------------------------------------
        this.pPbuttonErrFeuilleRetour   = page.locator('#modalBoutonRetour');  
    }
    
    
}