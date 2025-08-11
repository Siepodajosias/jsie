/**
 * 
 * JDD - Cycle de vie d'article FL sans transit sur prévisions de commande.
 * 
 * @author Vazoumana DIARRASSOUBA
 * @version 3.5
 * @since 2024-01-16
 * @see E2E_FL10_SUD
 * 
 */
import { TestFunctions } from "@helpers/functions";

export class Init {
    
    public dateVeille  :string;
    public data        :any;

    constructor(fonction: TestFunctions) {
    
        this.dateVeille         = fonction.getToday('us', -1);

        this.data = {
            typeAssortiment       : 'Achats centrale',
            idCodeRayon           : 'FL',
            rayon                 : 'Fruits et légumes',
            groupeArticle         : 'Fruits et légumes',
            dossierAchat          : 'TA_Dossier_Recette1' + '-' + fonction.getToday('US'),
            responsable           : 'Recette',
            fournisseur           : 'TA_Fournisseur_Recette1',
            nomAssortiment        : 'TA_AchCentrale - FL10 - Sudlog10',                     // §§§-1 Ref Inter Scénarios (nom de l'assortiment créé pour la semaine)
            nomAssortimentVeille  : 'TA_AchCentrale - FL10 - Sudlog10 - ' + this.dateVeille,     // §§§-2 Ref Inter Scénarios (Nom de l'assortiment créé la veille)
            listeMagasins         :  ['Toulouse', 'Perpignan', 'Montpellier', 'Mérignac', 'Garonne', 'Boé Agen', 'La Teste De Buch', 'Fréjus', 'Pau', 'Albi', 'Semeac', 'Bizanos'],
            listeClients          :  ['GF137FL', 'GF163FL', 'GF164FL', 'GF166FL', 'GF167FL', 'GF169FL', 'GF179FL', 'GF541FL', 'GF192FL', 'GF211FL', 'GF213FL', 'GF217FL'],
            listeArticles         : '5600,5800,5900,6000,6100,9200,6300,6400,6600,7100,7300,7600',
            heureDebut            : '01:10',                                                  // Heure de début de commande autorisé
            heureFin              : '21:59',                                                  // Heure de fin de commande autorisé
            tauxSaisieCmde        : 1,                                                        // % d'articles commandés lors d'une commande
            nbColisEstimes        : 10,
            rndCommandeMin        : 10,                                                       // Nombre de commande Minimal (laisser à 0 pour ignorer la randomisation)                
            rndCommandeMax        : 10,                                                       // Nombre de commande Maximal (laisser à 0 pour ignorer la randomisation)
            plateformeReception   : 'Sudlog 10°',
            plateformeDistribution: 'SudLog 10°',
            plateformeReceptCode  : 'NME',
            plateformeDistribCode : 'NME',
            nbMagExterne          : 0,
            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_FL10_SUD-' + fonction.getToday('us') + '.json',
        };

    }

    public getData() {
        return this.data;
    };

};

module.exports = Init;
