/**
 * 
 * Paramètres propres à l'application SOCIETE
 * 
 * @author JOSIAS SIE
 * @version 3.4
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){
        this.data = {
            filiere : {
                'Frais Généraux'   : ['Consommable','Sac'],
                'Poissonnerie'     : ['2°','10° Noel','Traiteur'],
                'Fruits et légumes': ['10°','Italie','2°', 'Stock Cremlog'],
                'Traiteur'         : ['2°','2° Exception Prep. Clo','Stock Cremlog'], 
                'Crèmerie'         : ['2°','2° Eclatement','2° Exception Prep. Cce','2° Exception Prep. Clo'],
                'Boulangerie'      : ['2°'],
                'Boucherie'        : ['2°'],
            },
            fournisseur : {
                'Frais Généraux'   : 'Prosol Gestion',
                'Poissonnerie'     : 'World Maréchal',
                'Fruits et légumes': 'Prosol SAS',
                'Traiteur'         : 'World Maréchal',
                'Crèmerie'         : 'Le Fromager des Halles',
                'Boulangerie'      : 'BDM Achats',
                'Boucherie'        : 'BCT500'
            },
            plateforme : {
               'Stockandco': ['Consommable'],
               'Chaponnay' : ['Italie','10°','Sac'],
               'Cremlog'   : ['2°','Stock Cremlog','10° Noel','Traiteur','2° Exception Prep. Clo','2° Eclatement','2° Exception Prep. Cce']
            },
            pays : {
               'Italie': ['Banco Fresco', 'Fresh by Banco fresco', 'Pane de la volta'],
               'France': ['Grand Frais','Fresh']
            }  
        };
    }

    public getData = () => {
        return this.data
    }
}