/**
 * @author ABDOUL SARBA
 * @version 3.3
 *  
 */
import { AriaSnapshot }     from "@commun/types";
import { Page, TestInfo }   from "@playwright/test";
import * as fs              from 'fs';

// ----------------------------------------------------------------------

const oElementsCible: Record<string, string> = {
    "button"    : "Bouton",
    "combobox"  : "Liste déroulante",
    "radio"     : "Bouton Radio",
    //"link"      : "Lien",
    //"row"       : "Ligne de tableau (tr)",
    //"textbox"   : "Input",
    "searchbox" : "Input type recherche",
    "grid"      : "Tableau",
    //"cell"      : "Cellule de tableau (td)",
    "checkbox"  : "Cas à cocher"
}

// ----------------------------------------------------------------------

export class FunctionAria{
    
    private readonly data       : any;
    private readonly page       : Page;
    private readonly testInfo   : TestInfo;
    private readonly fonction   : any;
    private readonly sFileName  : string;
    private readonly sPath      : string;
    private readonly oDataPrev  : any;

    private bVerbose            : boolean = false;    
    private bRecordData         : boolean = false;
    private aDataNew            : string[] = [];
    private aDataRow            : string[][] = [];
        
    constructor(oData:AriaSnapshot) {        

        this.data       = {};
        this.page       = oData.page;          
        this.testInfo   = oData.oTestInfo;
        this.fonction   = oData.fonction;

        //-- Détermination du nom du fichier de sauvegarde théorique
        const aSplitScript = this.testInfo.file.split("\\");
        this.sFileName  = aSplitScript[aSplitScript.length - 1] + '.json'; 
        this.sPath      = '_data/_tmp/' + this.fonction.getEnvironnement() + '/aria_snaphot/' + aSplitScript[aSplitScript.length - 2] + '/';
        
        //-- Préparation de l'affichage du tableau de sortie
        this.aDataRow.push(["PAGE", "ONGLET", "ELEMENT", "NEW"]);

        //-- Lecture du snapshot précédemment sauvegardé s'il existe
        if (fs.existsSync(this.sPath + this.sFileName)) {
            this.oDataPrev = JSON.parse(fs.readFileSync(this.sPath + this.sFileName, 'utf8'));
        } else {
            this.oDataPrev = {};    
            this.bRecordData = true;    //-- Si le fichier de sauvegarde précédent n'existe pas, il s'agit probablement de la première utilisation de la fonctionnalité. On créera donc le fichier
        }

    }


    /**
    * Parcourt le snapshot de la page et compte le nombre d'éléments pour chaque type d'élément (button, checkbox, combobox, radio, link, textbox, row, grid, searchbox, cell)
    * @param sPageName nom de la page
    * @param sOngletName nom de l'onglet
    */
    public async searchNewElements(sPageName:string, sOngletName:string) {

        //-- Création d'une entrée pour la page si elle n'existe pas
        if (!this.data[sPageName]) {
            this.data[sPageName] = {};
        }

        //-- Création d'une entrée pour l'onglet si elle n'existe pas
        if (sOngletName && !this.data[sPageName][sOngletName]) {
            this.data[sPageName][sOngletName] = {};
        }

        //-- Collecteur des éléments de page courante
        const oDataCurrent  : Record<string, number> = {};

        //-- Récupération des infos Aria Snapshot
        const sNapshot  = await this.page.locator("body").ariaSnapshot();

        const oJson:any = JSON.stringify(sNapshot);

        Object.entries(oElementsCible).forEach(([sDomElement, slibelle]) => {  
            
            //-- Recherche et comptage du mot cible dans le JSON snapshot
            const regex     = new RegExp(`\\b${sDomElement}\\b`, 'g');
            const matches   = oJson.match(regex);
            const iCompteur = matches ? matches.length : 0;

            //-- Si au moins un élément cible est présent, on l'enregistre
            if (iCompteur >0) {

                //-- Capitalisation de l'information
                oDataCurrent[sDomElement] = iCompteur;

                //-- Récupération de la valeur précédente pour le même élément
                const iPreviousValue:number = this.oDataPrev[sPageName] && this.oDataPrev[sPageName][sOngletName] && this.oDataPrev[sPageName][sOngletName][sDomElement] ? this.oDataPrev[sPageName][sOngletName][sDomElement] : 0;

                if (iCompteur > iPreviousValue) {           //-- Nouveauté détectée
                    this.aDataNew.push(`Page : ${sPageName} | Onglet :  ${sOngletName} | +${iCompteur - iPreviousValue} ${sDomElement}`); 
                    this.aDataRow.push([sPageName, sOngletName, slibelle, (iCompteur - iPreviousValue).toString()]);
                }

                if (this.bVerbose) {
                    console.log(`  [${sPageName} | ${sOngletName}] - ${slibelle} : ${iCompteur} / (éléments précédents : ${iPreviousValue})`);
                }

            }

        });

        //-- Enregistrement des données
        this.data[sPageName][sOngletName] = { ...oDataCurrent };  

    }


    /**
    * Enregistre le snapshot complet dans un fichier _data/_tmp/<environnement>/<Trigramme_appli>/<Nom_script>.json 
    */
    private async saveAriaSnaphot() {

        try {

            //-- Création du chemin vers le fichier à sauvegarder lors du premier appel si celui-ci n'existe pas encore
            if (fs.existsSync(this.sPath) === false) {
                fs.mkdirSync(this.sPath, {recursive: true});
            }

            fs.writeFile(this.sPath + this.sFileName, JSON.stringify(this.data, null, 4), function(err) {
                if(err) {
                    console.log(err);
                }
            });

            console.log(`[i] Sauvegarde Aria Snapshot : ${this.sPath + this.sFileName}`);

        } catch (err) {
            console.error(`Erreur lors de la lecture ou écriture du fichier : ${err}`);
        }

    }

    
    /**
     * @description Active ou désactive le mode verbose
     * @param bVerboseMod Valeur passée en paramètre
     */
    public async verboseMod(bVerboseMod:boolean = true) {
        this.bVerbose = bVerboseMod;
        if (bVerboseMod) {
            console.log(`[i] AriaSnapshot - Lecture du snapshot précédent : ${this.sPath + this.sFileName} - ${Object.keys(this.oDataPrev).length} éléments`);
        }
    }


    /**
     * @description Affiche les nouveaux éléments détectés et enregistre le snapshot si nécessaire
     */
    public async showNewElements() {

        console.log("── Aria Snapshot (+" + this.aDataNew.length +") " + "─".repeat(58));

        if (this.aDataNew.length > 0) {
            this.fonction.drawAsciiTable(this.aDataRow);
        } else {
            console.log("| Pas de changement détecté.");
        }        

        //-- Si on souhaite enregistrer le fichier de sauvegarde OU si il s'agit du premier appel de cette fonctionnalité
        if((process.env.RECORD_ARIA !== undefined && process.env.RECORD_ARIA === 'true') || this.bRecordData){
            this.saveAriaSnaphot();
        }

    }

}