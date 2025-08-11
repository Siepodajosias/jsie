/**
 * 
 * JDD pour les alertes sanitaires du Groupe "Frais LS".
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
export class Init{
    
    private data = {
        groupeArticle       : 'Frais LS',
        codeArticle         : 'L745',
        fournisseur         : 'St denis hotel',
        pilote              : 'lunettes',
        tmpFile             : 'alertes.txt',
        qualifAlerte        : 'Blocage',    // Valeur par défaut mais peut être injectée
        niveauAlerte        : 'Alerte qualité',    // Valeur par défaut mais peut être injectée
        idPlateforme        : 'CCE'         // 'Cremcentre'
    };

    public getData() {
        return this.data;
    };
};

module.exports = Init;