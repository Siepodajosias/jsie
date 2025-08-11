/**
 * 
 * Paramètres propres à l'application STOCK
 * 
 * @author SIAKA KONE
 * @version 3.4
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){
        this.data = {
            
            idPlateforme           : 'CHA',                            // Plateforme par défaut : Chaponnay
            prefixBL               : 'TEST-AUTO-BL',
            codeArticle            : 5300,                             // code article utilisé par défaut
            defaultWeight          : 1,                                // Poids par défaut nécessaire pour certaines plateformes
            conFileName            : __filename,                       // Paramètre réservé (Cartouche Info)
            search                 : null,                             // Valeur saisie par défaut dans le champ de recherche   
            environnement          : 'integration',
            nomTransporteur        : 'TEST-AUTO_Nom Transporteur',
            nomZone                : 'TEST-AUTO_ZONE. '  + fonction.getToday('FR'),
            nomAllee               : 'TEST-AUTO_ALLE. '  + fonction.getToday('FR'),
            nomEmplacement         : 'TEST-AUTO_EMPLACEMENT. '  + fonction.getToday('FR'),
            nomZoneModifier        : 'TEST-AUTO_ALLE_MODIFIER. '  + fonction.getToday('FR'),
            nomAlleeModifier       : 'TEST-AUTO_ZONE_MODIFIER. '  + fonction.getToday('FR'),
            nomCategorieEmplacement: 'TA_CATEGORIE_EMPLACEMENT. '  + fonction.getToday('FR'),
            jddDons                : '../../_data/_tmp/STO/gestion_don.json',
            jddLitiges             : '../../_data/_tmp/STO/gestion_litige.json',
            fileToUpload           : '../../_data/STO/Plans_plateformes/Plan_plateforme_CLO.xlsx'
        };
    }

    public getData = () => {
        return this.data;
    }  

};

