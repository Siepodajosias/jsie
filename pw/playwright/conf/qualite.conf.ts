/**
 * 
 * Paramètres propres à l'application QUALITE
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions) {
        this.data = {
            // Arguments
            conFileName                  : __filename,                       // Paramètre réservé (Cartouche Info)
            jddControleMagasin           : '../../_data/QUA/controle_mag.json',
            jddControleTemperature       : '../../_data/QUA/controle_temp.json',
            jddReferentielArticle        : '../../_data/QUA/referentiel_article.json',
            jddReferentielMobilier       : '../../_data/QUA/referentiel_mobilier.json',
            jddReferentielQuestionnaire  : '../../_data/QUA/referentiel_questionnaire.json',
            jddRubrique                  : '../../_data/QUA/rubrique.json',

            aImages                      : [
                                                '../../_data/QUA/poisson.jpeg',
                                                '../../_data/QUA/acceptable.jpg',
                                                '../../_data/QUA/non_conforme.jpg'
                                            ],

            aCahierDeCharges              : [
                                                '../../_data/QUA/cahier-de-charges_arcticle.pdf',
                                                '../../_data/QUA/cahier-de-charges_famille.pdf',
                                                '../../_data/QUA/cahier-de-charges_sous_famille.pdf'
                                            ]
        };
    }

    public getData = () => {
        return this.data;
    }  
    
}