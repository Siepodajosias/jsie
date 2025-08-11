/**
 * 
 * Paramètres propres à l'application REPARTITION
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){
        this.data = {
            // Arguments
            idPlateforme        : 'CHA',                            // Chaponnay
            idRayon             : '00',                             // Fruit et Légumes
            idGroupeArticle     : '05',
            codeArticle         : 5300,
            groupeArticle       : 'FLS',
            villesCibles        : ['Bergerac', 'Bron', 'Compiègne', 'Gaillarde', 'Mérignac', 'Toulouse'],
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)
            jddPlateformes      : '../../_data/_tmp/REP/liste_plateforme.json'
        };
    }

    public getData = () => {
        return this.data;
    }  
    
}