/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : UTILISATEURS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class ReferentielUtilisateurs{

    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercherUtilisateur()"]');
    public readonly buttonEnregistrer          = this.page.locator('[ng-click="enregistrer()"]');

    public readonly inputIdentifiant           = this.page.locator('#rechercheUtilisateur');

    public readonly tdListeGrpArticle          = this.page.locator('.groupes td.datagrid-designation');

    public readonly thInputCptGrp              = this.page.locator('.groupes th input');
    public readonly thCpt                      = this.page.locator('.groupes th').nth(0);

    constructor(public readonly page: Page) {}
    
}