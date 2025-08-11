/**
 * 
 * Paramètres propres à l'application FACTURATION
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
            rayon               : 'Fruits et légumes - Tous',
            plateforme          : 'Chaponnay',
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)
            rTauxRemise         : 88.888,
            rTauxRemiseModifie  : 0.008
        };
    }

    public getData = () => {
        return this.data;
    }  

};

