/**
 * 
 * @author Vazoumana DIARRASSOUBA  & ABDOUL SARBA
 *  Since 17 - 11 - 2023
 * 
 */
const xRefTest      = "STO_INV_PLF";
const xDescription  = "Faire un inventaire plateforme";
const xIdTest       =  262;
const xVersion      = '3.7';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Help }                     from "@helpers/helpers";
import { Log }                      from "@helpers/log";

import { Credential }               from '@conf/credential.conf';
//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { InventaireInventaire }     from "@pom/STO/inventaire-inventaire.page";
import { InventaireEcarts }         from '@pom/STO/inventaire-ecarts.page';


//----------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuStock;
let pageInventaire  : InventaireInventaire;
let pageIventaireEcart: InventaireEcarts; 

const log           = new Log();
const fonction      = new TestFunctions(log);
const profil        = 'lunettes';
const userCredential= new Credential(profil);

var profilData      = userCredential.getData();
//----------------------------------------------------------------------------------------

let oPalet:{ designation: string, quantite:number  }[] =[];

const sRayon        = fonction.getInitParam('rayon', 'Crèmerie');
const plateforme    = fonction.getInitParam('plateforme', 'Cremcentre');

const iNbjour:number    = 8;
const iNbEssais:number  = 30;
const iTimeOut:number   = 10 * 60 * 1000;
var iEssai:number       = 0;

//----------------------------------------------------------------------------------------

var checkConditions = async (iEssai:number) => {

    ++iEssai;
    log.set('-- Essai ' + iEssai + ' / ' + iNbEssais + ' ----------------');

    if (iEssai >= iNbEssais) {

        return 'Sortie de boucle après ' + iNbEssais + ' essais';

    } else {

        try {

            if(await pageInventaire.dataGridZoneLignes.first().isVisible()){

                var NbZones = await pageInventaire.dataGridZoneLignes.count();
                log.set('Nombre de zones : ' + NbZones);                
//console.log('Nombre de zones : ' + NbZones);                

                for(let i = 0; i < NbZones; i++){

                    await fonction.clickAndWait(pageInventaire.dataGridZoneLignes.nth(i), page, iTimeOut);
                    
                    const sNomZone = await pageInventaire.dataGridZoneLignes.nth(i).textContent();
                    log.separateur();
                    log.set('Zone sélectionnée : ' + sNomZone?.trim()); 
//console.log('Zone sélectionnée : ' + sNomZone?.trim());                    

                    if( await pageInventaire.dataGridEmplaceLignes.first().isVisible()){
    
                        var NbEmplacements = await pageInventaire.dataGridEmplaceLignes.count();
                        log.set('Nombre d\'emplacements : ' + NbEmplacements);
//console.log('Nombre d\'emplacements : ' + NbEmplacements);
                    
                        for(let j=0; j<NbEmplacements; j++){

                            await fonction.clickAndWait(pageInventaire.dataGridEmplaceLignes.nth(j), page, iTimeOut);

                            const sNomEmplacement = await pageInventaire.dataGridEmplaceLignes.nth(j).textContent();
                            log.set('Emplacement sélectionné : ' + sNomEmplacement?.trim());    
//console.log('Emplacement sélectionné : ' + sNomEmplacement?.trim());

                            if (await pageInventaire.inputListQtePalette.first().isVisible()){                            
            
                                var iNbInput     = await pageInventaire.inputListQtePalette.count();
                                log.set('Nombre de champs input : ' + iNbInput);
//console.log('Nombre de champs input : ' + iNbInput);

                                for(let i = 0; i < iNbInput; i++){
                                    
                                    var iQtePalette = Number(await pageInventaire.inputListQtePalette.nth(i).inputValue()) + 1;
                                    await fonction.sendKeys(pageInventaire.inputListQtePalette.nth(i), iQtePalette.toString());  
                                    var sDesignationArticle = await pageInventaire.tdListArticlePalette.nth(i).textContent();
                                    
                                    oPalet.push({
                                        designation: sDesignationArticle?.trim(), 
                                        quantite: iQtePalette }
                                    );

                                }
                                
                                await fonction.clickAndWait(pageInventaire.buttonSauvegarder, page, iTimeOut);
                                // vérification du message apparu
                                const sEmplacement  = await pageInventaire.inputListEmplacement.first().inputValue();
                                const sMsgContainer = (await pageInventaire.pDernieresauvegareMsg.textContent()).trim();
                                const sFormattedMsg = sMsgContainer.replace(/(\d+)\s*:\s*(\d+)/g, '$1:$2').replace(/\s+/g, ' '); // Supprime les sauts de ligne et les espaces dans l'heure recu.
                                
                                let sMessageAfficher= "Dernière sauvegarde sur " + sEmplacement + " à " +fonction.getHeure()+ ".";

                                //-- Vérification du message affiché (on ne regarde pas pour autant les minutes)
                                expect(sFormattedMsg.substring(0, -3)).toContain(sMessageAfficher.substring(0, -3));
                                
                                return;

                            }else{            
                                log.set('Pas de Palette trouvée pour cette configuration !');
//console.log('Pas de Palette trouvée pour cette configuration !');

                                log.set(' ');
                                //await checkConditions(iNbEssai);
                            }
                        }
                                
                    } else {        
                        log.set('Aucun Emplacement sélectionnable');
                        log.set(' ');
                        //await checkConditions(iNbEssai);
                    }

                }
                
            } else {    
                log.set('Aucune zone existante');
            }

        }catch(erreur){
            console.log(erreur)
        }
                        
    }

};

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuStock(page, fonction);
    pageInventaire      = new InventaireInventaire(page);
    pageIventaireEcart  = new InventaireEcarts(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    // Sélection d'une plateforme par défaut
    test ('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       
    })

    test.describe('Page [INVENTAIRE]', () =>  {    

        var sCurrentPage     :string   = 'inventaire';
        var sPopinInventName :string   = 'Formulaire d\'inventaire';
        var sPopinDLCName    :string   = 'IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES';

        test ('Page [INVENTAIRE] - Click', async () => {
            await menu.click(sCurrentPage, page); 
        })

        test ('** Traitement **', async () => {
            test.setTimeout(iTimeOut);
            await checkConditions(iEssai);            
        });

        // Imprimession du fichier pdf dans un nouvel onglet avec la liste des article à inventorier
        
        test ('Button [FORMULAIRE D\'INVENTARE] - Click ', async () => {            
            await fonction.clickAndWait(pageInventaire.buttonFormInventaire, page);   
        });

        test ('Popin [FORMULAIRE D\'INVENTAIRE] - Is Visible', async () => {
            await fonction.popinVisible(page, sPopinInventName, true);
        });

        test ('Button [IMPRIMER] - Click', async () => {
            await fonction.noHtmlInNewTab(page, pageInventaire.pButtonImprimerInvent);
        })

        test ('Button [FERMER] - Click', async () => {
            await fonction.clickAndWait(pageInventaire.pButtonFermerInvent, page);
        })

        // Impression du fichier pdf dans un nouvel onglet avec la liste des palettes non inventoriées

        test ('Button [PALLETES NON INVENTORIEES] - Click ', async () => {
            await fonction.noHtmlInNewTab(page, pageInventaire.buttonPalNonInvent);
        });

        // Impression du fichier pdf dans un nouvel onglet avec la liste des palettes à DLC courtes 

        test ('Button [PALETTES A DLC COURTES] - Click ', async () => {
            await fonction.clickAndWait(pageInventaire.buttonPalDLCCourtes,page);
        });
        
        test ('Popin [IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES] - Is Visible', async () => {
            await fonction.popinVisible(page,sPopinDLCName, true);
        });
        
        test ('Listbox [CHOIX RAYON] - Click ', async () => {
            await menu.selectRayonByName(sRayon, page);
        });

        test ('Radio [IMPRIMER] - Click', async () => {
            await fonction.clickElement(pageInventaire.pCheckBoxImprimer);
        });

        test ('Input [NOMBRE DE JOUR]= "'+iNbjour+'"', async () => {
            await fonction.sendKeys(pageInventaire.pInputNbjoursInf, iNbjour);
        });

        test ('Button [IMPRIMER PALETTE A DLC COURTES] - Click', async () => {
            await fonction.noHtmlInNewTab(page, pageInventaire.pButtonImprimer);
        });

        test ("Button [TERMINER INVENTAIRE] - Click",async ()=>{
            await fonction.clickAndWait(pageInventaire.buttonTerminerInvent,page)
        })

        test ('Label [VERIFICATION HEURE INVENTAIRE]',async ()=>{
            const sMsgContainer = (await pageInventaire.pDernierInventaireMsg.textContent()).trim();
            const sFormattedMsg = sMsgContainer.replace(/(\d+)\s*:\s*(\d+)/g, '$1:$2').replace(/\s+/g, ' '); // Supprime les sauts de ligne et les espaces dans l'heure recu.
            if(profilData.login === "lunettes"){
               var  userprofil="Kevin lunettes";
            }
          
            let sMessageAfficher = "Dernier inventaire terminé par " + userprofil + " à "+fonction.getHeure()+ ".";
             expect(sFormattedMsg).toContain(sMessageAfficher);
        })

        test.describe('Onglet [ANALYSE DES ECARTS]', () => {

           test ('Onglet [ANALYSE DES ECARTS] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'ecarts', page);
          })  

          test ('DataGrid [VERIFICATION DES PALETTES ] - Check', async () => {

            var ligneTableauDesignation   = pageIventaireEcart.dataGridEcartsLignes               // td de la  désignation 
            var ligneTableauCode          = pageIventaireEcart.dataGridEcartsLignesCode          //  td du code article
            var ligneTableauQtethrique    = pageIventaireEcart.dataGridEcartsLignesQtethrique   //   td de la quantité théorique 
            var ligneTableauEcart         = pageIventaireEcart.dataGridEcartsLignesEcart       //  td de l'ecart 

            var iDataGridTdLength          = await pageIventaireEcart.dataGridEcartsLignes.count(); 
            
            for(let i=0; i<iDataGridTdLength; i++){
                // je récupère les td suivant i
                var ligne               = ligneTableauDesignation.nth(i);             
                var ligneCode           = ligneTableauCode.nth(i);
                var ligneQteTh          = ligneTableauQtethrique.nth(i);
                var ligneEcart          = ligneTableauEcart.nth(i);

                var sCurrentDesignation  = await ligne.textContent();
                var sCurrentCodeArticle  = await ligneCode.textContent();      //Récupération des valeurs contenues
                var sCurrentQtethrique   = await ligneQteTh.textContent();
                var sCurrentecart        = await ligneEcart.textContent();


                // il y a une difference d'affichage le tableau de la saisie de l'inventaire et celui de l'analyse des ecarts.
                var designationArticleDatagrid = `${sCurrentCodeArticle.trim()} - ${sCurrentDesignation.trim()}`;

                for (const element of oPalet) {
                    if(designationArticleDatagrid.trim()=== element.designation){
                        // calcul de l'écart 
                        let qtTheorique = parseInt(sCurrentQtethrique.trim());
                        let qtInventaire = element.quantite;
                        let ecartCalcule = qtInventaire - qtTheorique;
                     
                        // Vérification de la valeur de l'ecart
                        expect(parseInt(sCurrentecart.trim())).toBe(
                            ecartCalcule,
                        );
                    } 
                }                           
            }      
          });

        
        });

        // vérification d\'un eventuel message d\'erreur

        test ('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        // Déconnexion

        test ('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });

    })

});