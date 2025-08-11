/**
 * 
 * Paramètres propres à l'application PRICING
 * 
 * @author JOSIA SIE
 * @version 3.1
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;
                                                
    constructor(fonction?:TestFunctions){

        this.data = {
            regleAppartenance: {
                'Enseigne'      : ['Grand Frais'],
                'Pays'          : ['France'],
                'Plateforme'    : ['Cremlog'],
                'Région Prosol' : ['ARTAUD Lionel'],
                'Secteur Prosol': ['AREND Damien'],
                'Stratégie'     : ['Standard','Discount'],
                'filière'       : ['2°']
            },
            critere : ['Enseigne','Pays','Plateforme','Région Prosol','Secteur Prosol','Stratégie']
        }
    }

    public getData = () => {
        return this.data
    }
}