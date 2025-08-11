/**
 * 
 * Paramètres propres à l'application MAGASIN
 * 
 * @author Vazoumana DIARRASSOUBA
 * @version 3.11
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){

        this.data = {
            URL : {
                integration : 'http://magasin.int.sigale.prosol.pri/',
                integration2: 'http://app1.int2.sigale.prosol.pri:9087/',
                formation   : 'http://app1.form.sigale.prosol.pri:9087/',
                fab         : 'http://app1.fab.sigale.prosol.pri:9087/',
                demo        : 'http://magasin-app.demo.sigale.prosol.pri:9087/',
                preprod     : 'http://magasin-app1.prep.sigale.prosol.pri:80/',
                REC1        : 'http://10.147.100.192:9087/',
                AVS         : 'http://magasin-app.prep.sigale.prosol.pri:80'
            },
            defaultUser             : 'lunettes',
            designationGroupe       : 'TEST-AUTO',
            nomGroupeCommande       : 'TEST-GroupeCommande',
            assortimentEngagement   : 'TEST-AUTO_engagement-',
            assortimentRegionalise  : 'Crèmerie CPE (Coupe / Corner)',
            groupeArticleEngagement : 'Frais LS',
            dossierAchatRegionalise : 'Jean-Michel Launay',
            assortimentCentraleAch  : 'TEST-AUTO_centraleAchat-' + fonction.getToday('FR'),
            gammeToRecomm           : ['TA_Designation2', 'TA_Designation3', 'TA_Designation4'],
            gammeToUpdate           : 'TA_Designation1',
            gammesToDelete          : ['TA_Designation1', 'TA_Designation2', 'TA_Designation3',  'TA_Designation4', 'TA_Designation5'],
            listeVilles             : ['Viriat','Voiron','Albi'],
            ville                   : 'Malemort (G914)',                    // Ville exploitée par défaut si cet argument n'est pas transmis au navigateur
            groupeArticleRegionalise: 'Coupe / Corner',
            articleRegionalise      : ['C22L','C228','C21Y'],             // Article régionalisé par défaut si cet argument n'est pas transmis au navigateur
            articlesCibles          : ["L834","L835","L838","L839"],     // Liste d'articles
            codeArticle             : 5700,                             // Article par défaut
            stockEmballage          : 4,
            actualiteCategories      : ['Frais LS', 'Coupe / Corner'],
            actualiteMagasin        : 'Albi',
            conFileName             : __filename,                        // Paramètre réservé (Cartouche Info)
            groupeArticle           : 'FL',                             // Code groupe Article par défaut si info non transmise au navigateur
            environnement           : 'integration',
            designActualite         : 'TA_Actualité',
            categoriesActualites    : ['Fruits et légumes', 'Frais LS', 'Coupe / Corner', 'Marée', 'Elaborés'],
            aGroupesArticles        : {
                'CC'    : 'Coupe / Corner',
                'FD'    : 'Fraîche découpe',
                'FL'    : 'Fruits et légumes',
                'FLS'   : 'Frais LS',
                'maree' : 'Marée',
                'negoce': 'Négoce',
                'TDLM'  : 'Traiteur de la mer',
                'tous'  : 'Tous'
            },
            aAutoriEchanges     : [ 
                ['GF234PO', 'GF153PO', 'GF153PO'], 
                ['GF144FL', 'GF202FL', 'GF202FL'], 
                ['GC912CR', 'GC105CR', 'GC105CR'] 
            ],
            aGroupes : {
                'BC' : [''],
                'CR' : ['Coupe / Corner', 'Frais LS', 'IT - Coupe / Corner', 'IT - Frais LS'],
                'FL' : ['Fraîche découpe', 'Fruits et légumes'],
                'PO' : ['Marée', 'IT - Négoce', 'IT - Traiteur DM'],
                'TR' : ['Elaborés']
            },
            aFamilles: {
                'BC' : [''],
                'FL' : ['Fruits à noyau', 'Ananas'],
                'CR' : ['PMCF (Coupe / Corner)','PMCL (Frais LS)'],
                'PO' : ['Marée', 'IT - Négoce', 'IT - Traiteur DM'],
                'TR' : ['Apéritifs']
            },
            urlStatique     : '../../_data/_tmp/MAG/vente_statique.xml',
            urlJournee      : '../../_data/_tmp/MAG/vente_journee.xml',
            jddLieuxVente   : '../../conf/lieu_vente.conf.json',
            jddGammeRecom   : '../../_data/_tmp/MAG/gamme_recommandation_ouverture.json'
        };
    }

    public getData = () => {
        return this.data
    }
}
