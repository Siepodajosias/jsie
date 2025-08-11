/**
 * 
 * Paramètres propres à l'application ACHATS
 * 
 * @author SIAKA KONE
 * @version 3.3
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;
    public maDate = new Date();

    constructor(fonction?:TestFunctions){

        this.data = {
            conFileName          : __filename,                       // Paramètre réservé (Cartouche Info)    
            ville                : 'Albi',          
            fournisseur          : 'Comexa',
            environnement        : 'integration',
            codeArticle          : '5300',                           // Code article commandé par défaut  
            libelleArticle       : '5300 - Banane',                  // Libellé article commandé par défaut
            codeFournisseur      : '00015',                          // Fruidor lyon';
            codeMagasin          : '211',                            // Albi';    
            idRayon              : 4,                                // Fruits et légumes    
            gencod               : 3700551500000,                    // Gencod de référence servant de parent
            dossierAchat         : 'TA_Dossier Achat Random-' + fonction.getToday('us'),
            dossierAchatCrossdock: 'Bcv - julien 2025', //Bcv - joubard julien
            jddFournisseurFG     : '../../_data/ACH/Fournisseurs/fournisseur_FG.json',
			jddVentilArticles    : '../../_data/_tmp/ACH/ventilation_article.json',
			jddVentilMagasins    : '../../_data/_tmp/ACH/ventilation_magasin.json',
            jddUniteTransport    : '../../_data/_tmp/ACH/parametres_unite_transport.json'
        }
    }
   
    public getData = () => {
        return this.data;
    }

}
