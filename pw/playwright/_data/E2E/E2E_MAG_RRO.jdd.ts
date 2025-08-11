/**
 * 
 * JDD - Données pour la regionalisation des recommandations d'ouverture
 * @author ABDOUL SARBA
 * @version 3.2
 * @since 2025-05-23
 * @see E2E_MAG_RRO
 */


export class Init {
  public data: any;

  constructor() {
    this.data = {
      rayon                 : 'crèmerie',
      groupeArticle         : 'Coupe / Corner',
      listeArticles         : 'C074,C1CO,C196',
      designationAssortiment: 'Crèmerie CPE (Coupe / Corner)'
    };
  }

  public getData() {
    return this.data;
  }
}
module.exports = Init;