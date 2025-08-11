/**
 * Apli     : MAGASIN 
 * Page     : REFERENTIEL
 * Onglet   : Comm. Magasin
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class Communication {
    

    public readonly textareaMessageFr       = this.page.locator('textarea').nth(0);        
    public readonly textareaMessageIt       = this.page.locator('textarea').nth(1);  

    public readonly pSelectCouleurMessage   = this.page.locator('p-selectbutton');  
    public readonly pSelectCouleurBleue     = this.page.locator('p-selectbutton div[aria-labelledby="Bleu"]');  
    public readonly pSelectCouleurOrange    = this.page.locator('p-selectbutton div[aria-labelledby="Orange"]');  

    public readonly buttonTraduireMessage   = this.page.locator('.bouton-traduction button');      
    public readonly buttonCommuniquer       = this.page.locator('button[icon="icon-white icon-bullhorn fas fa-bullhorn"]');
    public readonly buttonSupprimer         = this.page.locator('button[icon="icon-remove fas fa-times"]');

    public readonly toastMessage            = this.page.locator('.p-toast-message');
    public readonly toastMessageInfo        = this.page.locator('div.p-toast-detail');

    public readonly communicationForm       = this.page.locator('.communication-form');

    constructor(public readonly page: Page) {};
}