/**
 * Appli    : ACHATS
 * Menu     : BESOINS MAGAINS
 * Onglet   : Besoins Consolides Fournisseur
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageBesConFou {

    public readonly buttonCreerBesoinConsolFourn    : Locator;    //(by.css('besoin-consolides-fournisseur-wrapper button i.fa-plus');
    public readonly buttonModifBesoinConsolFourn    : Locator;    //(by.css('footer i.fa-pencil-alt');
         
    public readonly dataGridListeBesoins            : Locator;    //.all(by.css('thead tr:nth-child(1) th'); 

    //-- POPIN : Création d'un besoin consolidé fournisseur ---------------------------------------------------------------------------------------------    
    public readonly pPinputLibelle                  : Locator;    //(by.id('input-libelle');    
    public readonly pPinputIdentifiantClient        : Locator;    //(by.id('input-identifiant-client');
    public readonly pPinputFoursisseur              : Locator;    //(by.css('#input-fournisseur input');
    public readonly pPinputDureeReceptionAnticipe   : Locator;    //(by.id('input-duree-reception');
    public readonly pPinputGLNclient                : Locator;    //(by.id('input-gln-client');

    public readonly pPlistBoxCEntraleAchat          : Locator;    //(by.css('[inputid="input-centrale-achat"]');
    public readonly pPlistBoxPlateforme             : Locator;    //(by.css('[inputid="input-plateforme-distribution"]');
    public readonly pPlistBoxVentilationArticle     : Locator;    //(by.css('[inputid="input-ventilation-articles"]');
    public readonly pPlistBoxVentilationMagasins    : Locator;    //(by.css('[inputid="input-ventilation-magasins"]');
    public readonly pPlistBoxTypeEnvoi              : Locator;    //(by.css('[inputid="input-type-envoi"]');

    public readonly pToggleSwitchActif              : Locator;    //(by.css('[inputid="input-actif"]');
    public readonly pToggleSwitchStockPlateforme    : Locator;    //(by.css('[inputid="input-stock-plateforme"]');
    public readonly pToggleSwitchTransmissionPVC    : Locator;    //(by.css('[inputid="input-transmission-pvc"]');
    public readonly pToggleSwitchStrategieSansPrix  : Locator;    //(by.css('[inputid="input-strategie-sans-prix"]');
    public readonly pToggleSwitchCrossDock          : Locator;    //(by.css('[inputid="input-cross-dock"]');

    public readonly pToggleTransmissionEDI          : Locator;    //.all(by.css('div.btn-group button.btn').nth(0);
    public readonly pToggleTransmissionFlux         : Locator;    //.all(by.css('div.btn-group button.btn').nth(1);
    public readonly pToggleTransmissionEmail        : Locator;    //.all(by.css('div.btn-group button.btn').nth(2);        

    public readonly pButtonEnregistrer              : Locator;    //(by.css('p-footer div > button span');
    public readonly pButtonAnnuler                  : Locator;    //(by.css('p-footer p-button span')

    public readonly pMessageErreur                  : Locator;
    public readonly pMessageWarning                 : Locator;

    public readonly sListeChoix                     : string;

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonCreerBesoinConsolFourn   = page.locator('besoin-consolides-fournisseur-wrapper button i.fa-plus');
        this.buttonModifBesoinConsolFourn   = page.locator('footer i.fa-pencil-alt');
             
        this.dataGridListeBesoins           = page.locator('thead tr:nth-child(1) th'); 
    
        //-- POPIN : Création d'un besoin consolidé fournisseur ---------------------------------------------------------------------------------------------    
        this.pPinputLibelle                 = page.locator('#input-libelle');    
        this.pPinputIdentifiantClient       = page.locator('#input-identifiant-client');
        this.pPinputFoursisseur             = page.locator('#input-fournisseur input');
        this.pPinputDureeReceptionAnticipe  = page.locator('input[formcontrolname="dureeReceptionAnticipee"]');
        this.pPinputGLNclient               = page.locator('#input-gln-client');
    
        this.pPlistBoxCEntraleAchat         = page.locator('[inputid="input-centrale-achat"]');
        this.pPlistBoxPlateforme            = page.locator('[inputid="input-plateforme-distribution"]');
        this.pPlistBoxVentilationArticle    = page.locator('[inputid="input-ventilation-articles"]');
        this.pPlistBoxVentilationMagasins   = page.locator('[inputid="input-ventilation-magasins"]');
        this.pPlistBoxTypeEnvoi             = page.locator('[inputid="input-type-envoi"]');
    
        this.pToggleSwitchActif             = page.locator('[inputid="input-actif"]');
        this.pToggleSwitchStockPlateforme   = page.locator('[inputid="input-stock-plateforme"]');
        this.pToggleSwitchTransmissionPVC   = page.locator('[inputid="input-transmission-pvc"]');
        this.pToggleSwitchStrategieSansPrix = page.locator('[inputid="input-strategie-sans-prix"]');
        this.pToggleSwitchCrossDock         = page.locator('[inputid="input-cross-dock"]');
    
        this.pToggleTransmissionEDI         = page.locator('div.btn-group button.btn').nth(0);
        this.pToggleTransmissionFlux        = page.locator('div.btn-group button.btn').nth(1);
        this.pToggleTransmissionEmail       = page.locator('div.btn-group button.btn').nth(2);        
    
        this.pButtonEnregistrer             = page.locator('p-footer div > button span');
        this.pButtonAnnuler                 = page.locator('p-footer p-button span');

        this.pMessageErreur                 = page.locator('div.alert-error:NOT(.ng-hide)');
        this.pMessageWarning                = page.locator('div.alert-warning:NOT(.ng-hide)');

        this.sListeChoix                    = 'p-dropdownitem li span';

    }

}