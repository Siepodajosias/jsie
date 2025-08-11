/**
 * 
 * Paramètres propres à l'application NOMENCLATURE
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){

        this.data = {

            codeArticle   : 'M0AH',

        };
    }

    public getData = () => {
        return this.data;
    }  

};

