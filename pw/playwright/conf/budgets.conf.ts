/**
 * 
 * Paramètres propres à l'application BUDGET
 * 
 * @author ABDOUL SARBA
 * @version 3.3
 * 
 */

export default class  LocalConfigFile {

    public data: any;

    constructor(){

        this.data = {
            conFileName         : __filename,   
            pathCoutPoste       : '../../_data/BUD/Budget_cout_par_post/coutparposte',
            pathMasseSal        : '../../_data/BUD/Budget_masse_salariale/massesalariale',
            pathCoefficient     : '../../_data/BUD/Budget_coeff_progress/coefficient',
            pathTemp            : '../../_data/_tmp/BUD/',
            pathAnneeExercice   :'../../_data/{ENVIRONNEMENT}/BUD/',
        };
    }

    public getData = () => {
        return this.data
    }

}
