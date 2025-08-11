/**
 * 
 * Paramètres propres à l'application CONCURRENCE
 * 
 * @author CALVIERA Jean Christophe
 * @version 3.0
 * 
 */

export default class  LocalConfigFile {

    public data: any;

    constructor(){

        this.data = {

        };
    }

    public getData = () => {
        return this.data
    }
    
}