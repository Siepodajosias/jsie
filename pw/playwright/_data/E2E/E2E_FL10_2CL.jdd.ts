/**
 * 
 * JDD - Cycle de vie d'article FL sans transit 
 * 
 * @author GUY CHASSANG
 * @version 1.0
 * @since 2024-12-02
 * @see E2E_FL10_2CL
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
            nomAssortiment        : 'TA_AchCentrale - FL10 - Chalons',         // §§§-1 Ref Inter Scénarios (nom de l'assortiment créé aujourd'hui)
            nomAssortimentVeille  : 'TA_AchCentrale - FL10 - ' + this.dateVeille,// §§§-2 Ref Inter Scénarios (Nom de l'assortiment créé la veille)
            listeMagasins         : ['Lexy', 'Compiègne', 'Soissons', 'Arras', 'Beauvais', 'Borny', 'Bruay', 'Compiègne', 'Epernay', 'Forbach', 'Hem', 'Reims'],
            listeClients          : ['GF276FL', 'GF203FL', 'GF151FL', 'GF101FL', 'GF162FL', 'GF544FL', 'GF161FL', 'GF203FL', 'GF204FL', 'GF131FL', 'GF993FL', 'GF409FL'],
            listeArticles         : '5600,5800,5900,6000,6100,9200,6300,6400,6600,7100,7300,7600',
            heureDebut            : '01:10',                                    // Heure de début de commande autorisé
            heureFin              : '22:50',                                    // Heure de fin de commande autorisé
            tauxSaisieCmde        : 1,                                          // % d'articles commandés lors d'une commande
            nbColisEstimes        : 10,
            rndCommandeMin        : 10,                                         // Nombre de commande Minimal (laisser à 0 pour ignorer la randomisation)                
            rndCommandeMax        : 10,                                         // Nombre de commande Maximal (laisser à 0 pour ignorer la randomisation)
            plateformeReception   : '2c Log 10°',
            plateformeDistribution: '2C Log 10°',
            plateformeReceptCode  : '2C1',
            plateformeDistribCode : '2C1',
            nbMagExterne          : 0,
            tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_FL10_2C1-' + fonction.getToday('us') + '.json',
        };

    }

    public getData () {
        return this.data;
    }

};

module.exports = Init;