/**
 *
 * Paramètres propres à l'application PREPARATION
 *
 * @author SIAKA KONE
 * @version 3.4
 *
 */
 
import { TestFunctions } from "@helpers/functions";
 
export default class  LocalConfigFile {
 
    public data: any;
 
    constructor(fonction?:TestFunctions){
        this.data = {
            // Arguments
            conFileName           : __filename,                       // Paramètre réservé (Cartouche Info)
            nomPreparateur        : 'TEST-AUTO_Nom' + fonction.getToday('us'),
            nomChemin             : 'TEST-AUTO_nomCheminPicking-' + fonction.getToday(),
            codePreparateur       : '53374',
            designationPreparateur: 'BOISSY',
            codeFeuille           : '8543',
            codeListeServir       : 'A1099',
            plateforme            : 'Cremcentre',
            codeTache             : 'CCE-CODE6',
        };
    }
 
    public getData = () => {
        return this.data;
    }  
}