/**
 * @author Yao Francis Timothé
 * @version 3.0
 * 
 * 
 * EXEMPLE utilisation via classe fonction :
 * 
 *     test ('ListBox [RAYON] = "Marée"', async ({}, testInfo) => {         
 *           await fonction.getNetworkActivities(page, testInfo);   // mise en place de l'écoute des activités réseau
 *           await menuPage.selectRayon(sRayon, page);              // Déclenche des activités réseau
 *           await fonction.showNetworkActivities(page);            // Affiche les activités réseau
 *     })
 * 
 */

import { Page, TestInfo }   from "@playwright/test";


// ----------------------------------------------------------------------

export class NetworkActivities {

    private requests    : { 
        url: string,         
        method: string, 
        responseStatus: number | null, 
        responseBody: string | null 
    }[] = [];

    private page        : Page;
    public testInfo     : TestInfo;

    constructor(page:Page, testInfo:TestInfo) {
        this.page       = page;
        this.testInfo   = testInfo;
    }

    //----------------------------------------------------------------

    /**
     * 
     * @description : Enregistre les activités réseau de la page.
     */
    public async recordActivities() {

        // Écoute l'événement 'request' qui se déclenche chaque fois qu'une requête est envoyée depuis la page
        this.page.on("request", request => {
            this.requests.push({
                url: request.url(),             
                method: request.method(),       
                responseStatus: null,           
                responseBody: null,             
            });
        });
    
        // Écoute l'événement 'response' qui se déclenche chaque fois qu'une réponse est reçue
        this.page.on("response", async response => {
            const request = this.requests.find(
                r => r.url === response.url() && r.method === response.request().method()
            );
            // Si une requête correspondante est trouvée
            if (request) {
                //Enregistre le statut de la réponse.
                request.responseStatus = response.status();
                request.responseBody = await response.text();
            }
        });

    }
    

    /**
     * 
     * @returns : Retourne les activités réseau enregistrées.
     */
    public getResponse() {
        return this.requests;
    }

    
}
