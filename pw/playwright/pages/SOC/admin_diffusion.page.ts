/**
 * 
 * APPLICATION  : SOCIETES 
 * PAGE         : Admin
 * ONGLET       : Diffusion
 * 
 * @author CALVIERA Jean Christophe
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageAdminDif {

    public buttonDifOrganisation    : Locator;
    public buttonDifClients         : Locator;
    public buttonDifLieuxDeVente    : Locator;
    public buttonDifCptBancaires    : Locator;

    public listBoxOrganisations     : Locator;
    public listBoxClients           : Locator;
    public listBoxRayons            : Locator;

    //---------------------------------------------------------------------------------------------------------

    constructor(page: Page){

        this.buttonDifOrganisation  = page.locator('diffusion-organisations button');
        this.buttonDifClients       = page.locator('diffusion-clients button');
        this.buttonDifLieuxDeVente  = page.locator('button#diffuser-client-btn').nth(1);
        this.buttonDifCptBancaires  = page.locator('diffusion-comptes-bancaires button');

        this.listBoxOrganisations   = page.locator('#organisations');
        this.listBoxClients         = page.locator('#clients');
        this.listBoxRayons          = page.locator('#rayons');

    }

}