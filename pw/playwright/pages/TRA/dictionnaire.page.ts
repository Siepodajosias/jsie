/**
 * Appli    : TRADUCTION
 * Menu     : DICTIONNAIRE
 * Onglet   : DICTIONNAIRE
 * 
 * 
 * @author SIAKA KONE
 * @version 3.3
 * 
 */

import { Locator, Page } from "@playwright/test";

export class Dictionnaire { 

    public readonly labelTextReference                    : Locator; //('td.datagrid-texteReference');       

    public readonly trListeCaracteristiques               : Locator; //('.caracteristiques table > tbody > tr');   

    public readonly dataGridListeArticles                 : Locator; //('.elements th');  
    public readonly dataGridListeCarac                    : Locator; //('.caracteristiques th');
    
   //---------DIFFERENTS DU CHECKBOX TRADUIT/VALIDE------------------------------------------------------------------------------------------

    public readonly checkboxNonScTraduitValide            : Locator; //('p-tristatecheckbox [aria-checked="false"] .p-checkbox-icon'); // sans croix
    public readonly checkboxNonTraduit                    : Locator; //('p-tristatecheckbox [aria-checked="false"] .pi-times'); // Avec croix (X)
    public readonly checkboxTraduitValide                 : Locator; //('p-tristatecheckbox [aria-checked="true"]');

   //-----------------------FIN ETATS-----------------------------------------------------------------------------------------------------------
    public readonly dataGridCaracteristiqueTextReference  : Locator; //('tr.ng-untouched td');
    public readonly daraGridElementEtatTraduction         : Locator; //('#pr_id_2-table .p-datatable-thead th.text-center');
    public readonly dataGridElementTraduction             : Locator; //('#pr_id_3-table .p-datatable-thead th');
    public readonly dataGridListBoxTypeElement            : Locator; //('.p-multiselect-trigger-icon');
    public readonly dataGridInputRechercheTypeElement     : Locator; //('.p-multiselect-filter');
    public readonly dataGridInputCode                     : Locator; //('input.p-inputtext');
    public readonly dataGridButtonFiltreCritereRecherche  : Locator; //('.p-column-filter-menu-button .pi-filter');
    public readonly dataGridListBoxCritereRecherche       : Locator; //('ul li.p-column-filter-row-item');
    public readonly dataGidCheckboxEtatTraduction         : Locator; //('p-tristatecheckbox');
    public readonly dataGridListBoxChoixElement           : Locator; //('p-multiselectitem li.p-ripple'); 
    public readonly dataGridElementAtraduire              : Locator; //('.p-element.p-selectable-row');
    public readonly dataGridUnElementAtraduire            : Locator; //('.p-element.p-selectable-row').eq(3);
    public readonly dataGridInputTraduction               : Locator; //('input[formcontrolname="texteTraduit"]');
    public readonly dataGridTableauTraduction             : Locator; //('tbody.p-datatable-tbody tr.ng-valid');

    public readonly theadFiltreCode                       : Locator; //('.p-datatable-thead [psortablecolumn="code"]');
    public readonly theadFiltreCodeAscendant              : Locator; //('.p-datatable-thead [psortablecolumn="code"][aria-sort="ascending"]');
    public readonly theadFiltreCodeDescendant             : Locator; //('.p-datatable-thead [psortablecolumn="code"][aria-sort="descending"]');
    public readonly theadFiltreType                       : Locator; //('.p-datatable-thead [psortablecolumn="type"]');
    public readonly theadFiltreTypeDescendant             : Locator; //('.p-datatable-thead [psortablecolumn="type"][aria-sort="descending"]');
    public readonly theadFiltreTypeAscendant              : Locator; //('.p-datatable-thead [psortablecolumn="type"][aria-sort="ascending"]');
    public readonly theadFiltreTraduitValider             : Locator; //('.p-datatable-thead [psortablecolumn="traduit"]'); 

    public readonly buttonSauvegarder                     : Locator; //('.p-button-label');
    public readonly buttonPaginationDernierePage          : Locator; //('.p-paginator-icon.pi-angle-double-right');
    public readonly buttonPaginationPremierePage          : Locator; //('.p-paginator-icon.pi-angle-double-left');
    public readonly buttonPaginationValeurDernierePage    : Locator; //('.p-paginator-page.p-highlight');  
    
    constructor(page : Page) {      

        this.trListeCaracteristiques              = page.locator('.caracteristiques table > tbody > tr');   
    
        this.dataGridListeArticles                = page.locator('.elements th');  
        this.dataGridListeCarac                   = page.locator('.caracteristiques th');
        
       //---------DIFFERENTS DU CHECKBOX TRADUIT/VALIDE------------------------------------------------------------------------------------------
    
        this.checkboxNonScTraduitValide           = page.locator('p-tristatecheckbox [aria-checked="false"] .p-checkbox-icon'); // sans croix
        this.checkboxNonTraduit                   = page.locator('p-tristatecheckbox [aria-checked="false"] .pi-times'); // Avec croix (X)
        this.checkboxTraduitValide                = page.locator('p-tristatecheckbox [aria-checked="true"]');
    
       //-----------------------FIN ETATS-----------------------------------------------------------------------------------------------------------
        this.dataGridCaracteristiqueTextReference = page.locator('tr.ng-untouched td');
        this.daraGridElementEtatTraduction        = page.locator('div.datagrid:nth-child(1) tr:nth-child(1) th');
        this.dataGridElementTraduction            = page.locator('div.datagrid:nth-child(2) tr:nth-child(1) th');
        this.dataGridListBoxTypeElement           = page.locator('.p-multiselect-trigger-icon');
        this.dataGridInputRechercheTypeElement    = page.locator('.p-multiselect-filter');
        this.dataGridInputCode                    = page.locator('input.p-inputtext');
        this.dataGridButtonFiltreCritereRecherche = page.locator('.p-column-filter-menu-button');
        this.dataGridListBoxCritereRecherche      = page.locator('ul li.p-column-filter-row-item');
        this.dataGidCheckboxEtatTraduction        = page.locator('p-tristatecheckbox');
        this.dataGridListBoxChoixElement          = page.locator('p-multiselectitem li.p-ripple'); 
        this.dataGridElementAtraduire             = page.locator('.p-element.p-selectable-row');
        this.dataGridUnElementAtraduire           = page.locator('.p-element.p-selectable-row').nth(3);
        this.dataGridInputTraduction              = page.locator('input[formcontrolname="texteTraduit"]');
        this.dataGridTableauTraduction            = page.locator('tbody.p-datatable-tbody tr.ng-valid');
    
        this.theadFiltreCode                      = page.locator('.p-datatable-thead [psortablecolumn="code"]');
        this.theadFiltreCodeAscendant             = page.locator('.p-datatable-thead [psortablecolumn="code"][aria-sort="ascending"]');
        this.theadFiltreCodeDescendant            = page.locator('.p-datatable-thead [psortablecolumn="code"][aria-sort="descending"]');
        this.theadFiltreType                      = page.locator('.p-datatable-thead [psortablecolumn="type"]');
        this.theadFiltreTypeDescendant            = page.locator('.p-datatable-thead [psortablecolumn="type"][aria-sort="descending"]');
        this.theadFiltreTypeAscendant             = page.locator('.p-datatable-thead [psortablecolumn="type"][aria-sort="ascending"]');
        this.theadFiltreTraduitValider            = page.locator('.p-datatable-thead [psortablecolumn="traduit"]'); 
    
        this.buttonSauvegarder                    = page.locator('.p-button-label');
        this.buttonPaginationDernierePage         = page.locator('angledoublerighticon');
        this.buttonPaginationPremierePage         = page.locator('.p-paginator-icon.pi-angle-double-left');
        this.buttonPaginationValeurDernierePage   = page.locator('.p-paginator-page.p-highlight');
        
    }
    
}
