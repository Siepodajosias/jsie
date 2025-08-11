/**
 * 
 * JDD - Données pour E2E Scan PREPA pour préparateur
 * @author ABDOUL SARBA
 * @version 3.3
 * @since 2025-06-11
 * @see E2E_PRE_SPP
 */

import { TestFunctions } from "@helpers/functions";


export class Init {
  public data: any;

  constructor(fonction: TestFunctions) {
    this.data = {
      rayon                 : 'Crèmerie',
      groupeArticle         : 'Frais LS',
      listeArticles         : 'L0W5,L1EA', //<--------- L0W5  article type eclatement, L1EA article type picking 
      fournisseur           : 'ecaillon',
      tauxSaisieCmde        : 1,                                          
      nbColisEstimes        : 10,
      rndCommandeMin        : 10,                                         
      rndCommandeMax        : 10,
      plateformeReception   : 'Cremcentre',
      plateformeDistribution: 'Cremcentre',
      plateformeReceptCode  : 'CCE',
      plateformeDistribCode : 'CCE',
      nbMagExterne          : 1,
      tmpFilename           : fonction.getPrefixeEnvironnement() + '_E2E_PRE_SPP-' + fonction.getToday('us') + '.json'
    };
  }

  public getData() {
    return this.data;
  }
}
module.exports = Init;