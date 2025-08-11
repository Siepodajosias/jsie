/**
 * @author JOSIAS SIE, JC CALVIERA, Vazoumana & SIAKA KONE
 * @version 3.4
 *  
 */

export class Credential {

    private datas           : any;
    private aRolesProfils   : any;
	private aTrigrammeAppli	: any;
	private profil			: string;

  // -------------------------------------------------------------------------------------
  
    constructor(profil: string = 'lunettes') {

		this.profil = profil;
    
		this.datas 			= require(`../conf/credentials.conf.json`);
		this.aRolesProfils 	= require(`../conf/roles.conf.json`);
		this.aTrigrammeAppli= require(`../conf/commun.conf.json`);

    }

  	// -------------------------------------------------------------------------------------

	public setProfil(sProfil:string) {
		this.profil = sProfil;
	}

	/**
	 * @description Retourne le login et le mot de passe pour le profil passé en paramètre
	 * @returns Un object contenant le login et le mot de passe 
	 */
    public getData(): any {
		if (this.datas[this.profil] !== undefined) {
			const credential = {
				login: this.profil,
				password: this.datas[this.profil],
			};
			return credential;
		} else {
			throw new Error('Ooops : USER [ ' + this.profil + ' ] Inconnu');
		}
    }
  
	/**
	 * @description Retourne le login et le mot de passe pour le profil passé en paramètre
	 * @param appli Le nom de l'application (Ex : MAGASIN)
	 * @param profil Le profil cible
	 * @returns Un object contenant le login et le mot de passe 
	 */
    public getProfil(appli: string, profil: string): any {

		//-- Au cas où c'est le trigramme de l'application;
		if (appli.length == 3) {
			appli = this.aTrigrammeAppli["trigramme"][appli].toUpperCase();
		}

		//-- Le profil est il connu ?
		if (this.datas[profil] !== undefined) {
			const credential = {
				login: profil,
				password: this.datas[profil],
			};
			return credential;
		} else {
			throw new Error('Ooops : PROFIL [ ' + appli + ' | ' + profil + ' ] Inconnu');
		}

    }
  
	/**
	 * @description Retourne le profil pour l'application et le Role passé en argument
	 * @param appli Nom de l'application (ou à défaut son trigramme)
	 * @param role  Le Role lié à l'application
	 * @returns Le profil de l'utilisateur ayant le Rôle cible
	 */
    public getUserByRole(appli: string, role : string): string {

		//-- A t-on bien passé le nom du projet ou son trigramme ?
		if (this.aRolesProfils[appli] === undefined) {
			//-- MAG --> MAGASIN
			const aNomApplications = require(`../conf/commun.conf.json`);
			appli = aNomApplications.trigramme[appli].toUpperCase();
		}

		if (this.aRolesProfils[appli][role] !== undefined) {
			return this.aRolesProfils[appli][role];
		} else {
			throw new Error('Ooops : ROLE [ ' + appli + ' | ' + role + ' ] Inconnu');
		}

    } 

	/**
	 * 
	 * @param appli Nom de l'application sur laquelle l'utilisateur est connecté
	 * @returns Le tableau contenant la liste des rôle de l'utilisateur connecté
	 */
	public getRolesCurrentUser(appli: string): boolean {

		appli = appli.toUpperCase();

		//-- A t-on bien passé le nom du projet ou son trigramme ?
		if (this.aRolesProfils[appli] === undefined) {
			//-- MAG --> MAGASIN
			const aNomApplications = require(`../conf/commun.conf.json`);		
			appli = aNomApplications.trigramme[appli].toUpperCase();
		}

		let aRoles:any = [];

		for (var key in this.aRolesProfils[appli]){						
			if (this.aRolesProfils[appli][key].toUpperCase() == this.profil.toUpperCase()){
				aRoles.push(key);
			}
		}

		return aRoles;	

	}

}