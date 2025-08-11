/**
 * Appli    : MAGASIN
 * Page     : ACCUEIL
 * Onglet   : Actualités
 * 
 * @author Esli Ariel BAHILI
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class AccueilActualites {

    //recherche
    public readonly inputRecherche          = this.page.locator('[name="rechercherActualiteTexte"]');
    public readonly datePickerActSpecifique = this.page.locator('input[name="filtrePeriode"]');
    public readonly selectTags              = this.page.locator('.p-multiselect.p-inputwrapper');
    public readonly buttonNonArchivees      = this.page.locator('#filtre-etat-archive .p-selectbutton .p-button').first();     
    public readonly buttonArchivees         = this.page.locator('#filtre-etat-archive .p-selectbutton .p-button').last();     
    public readonly buttonRechercher        = this.page.locator('#bouton-rechercher');

    public readonly selectMagasin           = this.page.locator('select[ng-show="menuCourant.lieuxVentesVisibles && utilisateurConnecte.lieuxAutorises.length"]');

    //cadre actualité
    public readonly titreActualite          = this.page.locator('.actualite .entete-actualite .gauche-entete h3');
    public readonly buttonArchiver          = this.page.locator('#bouton-archiver');
    
    //message d'actualité annulée
    public readonly overlayMessageAnnulee   = this.page.locator('.actualite .corps-actualite .overlay-annulee');

    
    
    constructor(public readonly page: Page) {}
}