/**
 * 
 * Paramètres propres à l'application MAGASIN
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */

export default class  LocalConfigFile {

    public data: any;

    constructor(){

        this.data = {
            jddRecaptitulatif   : '../../_data/DON/recapitulatif_don.json',
            jddBeneficiaire     : '../../_data/DON/beneficiaire_don.json',
            jddDetailDon        : '../../_data/DON/detail_don.json'
        };
    }

    public getData = () => {
        return this.data
    }
}