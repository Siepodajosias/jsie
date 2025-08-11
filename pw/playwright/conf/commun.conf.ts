/**
 * 
 * Paramètres propres à toutes les applications SIGALE
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
export class  GlobalConfigFile {

    public data: any;

    constructor(){

        this.data = {
        
            defaultUser         : 'lunettes',
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)
            sAbecedaire         : 'abcdefghijklmnopqrstuvwxyz',
            joursSemaine        : [
                'Dimanche', 
                'Lundi', 
                'Mardi', 
                'Mercredi', 
                'Jeudi', 
                'Vendredi', 
                'Samedi'
            ],
            idGroupeArticle     : {
                '15'    : 'Consommable',
                '06'    : 'Coupe / Corner',
                '05'    : 'Frais LS',
                '01'    : 'Fraîche découpe',
                '00'    : 'Fruits et légumes',
                '03'    : 'Marée',
                '04'    : 'Négoce',
                '02'    : 'Traiteur de la mer',
            },
            idPlateforme     : {
                'CHA'   : 'Chaponnay',
                'CCE'   : 'Cremcentre',
                'CLO'   : 'Cremlog',
                'SCY'   : 'St-Cyr-en-Val',
                'SFG'   : 'St-Cyr-en-Val FG',
                'STI'   : 'Stock informatique',
                'TOR'   : 'Torino',
                'COR'   : 'Zone 2° Chaponnay',
                'SCF'   : 'Zone 2°C St-Cyr-en-Val'
            },        
            aGroupesArticles    : {
                'CC'    : '06',
                'FD'    : '01',
                'FL'    : '00',
                'FLS'   : '05',
                'maree' : '03',
                'negoce': '04',
                'TDLM'  : '02',
                'tous'  : ''
            },        
            idRayon     : {
                '0' : 'BCT',
                '1' : 'Crèmerie',
                '2' : 'Epicerie',
                '3' : 'Frais Généraux',
                '4' : 'Fruits et légumes',
                '5' : 'Poissonnerie'
            },    
            aTriRayon   : {
                'BCT'               : 'BCT',
                'Crèmerie'          : 'CRM',
                'Epicerie'          : 'EPI',
                'Frais Généraux'    : 'FGE',
                'Fruits et légumes' : 'FEL',
                'Poissonnerie'      : 'POI'
            },
            jddAlignementConcu      : '../../_data/_tmp/MAG_ACH_Alignement_Concurrence.json',
            jddEmballage            : '../../_data/_tmp/Mag_Emballage_Creation_.json'
        };
    }

    public getData() {
        return this.data;
    }
}
