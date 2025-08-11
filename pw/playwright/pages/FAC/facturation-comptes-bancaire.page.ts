/**
 * 
 * FACTURATION PAGE > FACTURATION / ONGLET > COMPTES BANCAIRES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class FacturationCompteBancaire {

    public readonly dataGridComptesBancaires                    : Locator;

    constructor(page:Page){
        this.dataGridComptesBancaires                           = page.locator('table th');
    }
}