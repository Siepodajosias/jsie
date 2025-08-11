/**
 * @description fait des appels vers une api retournant les informations liées à un numéro SIRET (injecté via un fichier csv). Génère un nouveau fichier CSV de réponses. 
 */

const fs = require('fs');
const readline = require('readline');
var fsp = require('fs/promises');
const sFileName = 'C:\\temp\\jcc.csv';

async function processLineByLine() {

  const fileStream = fs.createReadStream(sFileName);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    
    await sleep(1000);  // On ne fait pas le bourrain avec le serveur !!!

    /*
    let url = "http://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/economicref-france-sirene-v3/records?select=siren%2C%20nic%2C%20siret%2C%20denominationunitelegale%2C%20naturejuridiqueunitelegale%2C%20etatadministratifetablissement%2C%20adresseetablissement%2C%20complementadresseetablissement%2C%20libellecommuneetablissement%2C%20codepostaletablissement%2C%20regionetablissement%2C%20activiteprincipaleetablissement%2C%20datecreationetablissement%2C%20datederniertraitementunitelegale%2C%20datederniertraitementetablissement%2C%20datecreationunitelegale%2C%20datefermetureetablissement%2C%20etatadministratifunitelegale%2Cgeolocetablissement%2C%20siretsiegeunitelegale%2C%20numerovoieetablissement%2C%20typevoieetablissement%2C%20libellevoieetablissement&where=siren%3D%27" + line.replace(/[\u200B-\u200D\uFEFF]/g, '') + "%27&order_by=datecreationetablissement%20DESC%2C%20datederniertraitementetablissement%20DESC&limit=1&timezone=Europe%2FParis";
    let url = "http://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/economicref-france-sirene-v3/records?select=siren%2C%20nic%2C%20siret%2C%20denominationunitelegale%2C%20naturejuridiqueunitelegale%2C%20etatadministratifetablissement%2C%20adresseetablissement%2C%20complementadresseetablissement%2C%20libellecommuneetablissement%2C%20codepostaletablissement%2C%20regionetablissement%2C%20activiteprincipaleetablissement%2C%20datecreationetablissement%2C%20datederniertraitementunitelegale%2C%20datederniertraitementetablissement%2C%20datecreationunitelegale%2C%20datefermetureetablissement%2C%20etatadministratifunitelegale%2Cgeolocetablissement%2C%20siretsiegeunitelegale%2C%20numerovoieetablissement%2C%20typevoieetablissement%2C%20libellevoieetablissement%2C%20etablissementsiege&where=siren%3D%27" + line.replace(/[\u200B-\u200D\uFEFF]/g, '') + "%27%20and%20etablissementsiege%20%3D%20%22oui%22&limit=1&timezone=Europe%2FParis";
    let url = "http://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/economicref-france-sirene-v3/records?select=siren%2C%20nic%2C%20siret%2C%20denominationunitelegale%2C%20naturejuridiqueunitelegale%2C%20etatadministratifetablissement%2C%20adresseetablissement%2C%20complementadresseetablissement%2C%20libellecommuneetablissement%2C%20codepostaletablissement%2C%20regionetablissement%2C%20activiteprincipaleetablissement%2C%20datecreationetablissement%2C%20datederniertraitementunitelegale%2C%20datederniertraitementetablissement%2C%20datecreationunitelegale%2C%20datefermetureetablissement%2C%20etatadministratifunitelegale%2Cgeolocetablissement%2C%20siretsiegeunitelegale%2C%20numerovoieetablissement%2C%20typevoieetablissement%2C%20libellevoieetablissement%2C%20etablissementsiege&where=siren%3D%27" + line.replace(/[\u200B-\u200D\uFEFF]/g, '') + "%27&order_by=nic%20DESC&limit=1&timezone=Europe%2FParis";
    */
   
    let url  = "http://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/economicref-france-sirene-v3/records?select=siren%2C%20nic%2C%20siret%2C%20denominationunitelegale%2C%20naturejuridiqueunitelegale%2C%20etatadministratifetablissement%2C%20adresseetablissement%2C%20complementadresseetablissement%2C%20libellecommuneetablissement%2C%20codepostaletablissement%2C%20regionetablissement%2C%20activiteprincipaleetablissement%2C%20datecreationetablissement%2C%20datederniertraitementunitelegale%2C%20datederniertraitementetablissement%2C%20datecreationunitelegale%2C%20datefermetureetablissement%2C%20etatadministratifunitelegale%2Cgeolocetablissement%2C%20siretsiegeunitelegale%2C%20numerovoieetablissement%2C%20typevoieetablissement%2C%20libellevoieetablissement%2C%20etablissementsiege&where=siren%3D%27" + line.replace(/[\u200B-\u200D\uFEFF]/g, '') + "%27%20and%20etatadministratifetablissement%20%3D%20%27Actif%27&timezone=Europe%2FParis";
    //console.log(url);

    const headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });
    
    const urlencoded = new URLSearchParams({
        'ws'        : 'flux'
    });
    
    const opts = {
        method: 'GET',
        headers: headers
    };


    try {

        fetch(url, opts).then(function (response) {

            response.text().then(async(sTexte)  => {

                //console.log(sTexte);  
                var json = JSON.parse(sTexte);   
                //console.log(json);

                if (json.results) {

                    for (const iResult in json.results) {
                        
                        let aDatas = [];

                        for (const key in json.results[iResult]) {
                            if (key !== 'geolocetablissement') {
                                aDatas.push(json.results[iResult][key]);
                            }
                        }

                        if (json.results[iResult].geolocetablissement) {

                            if (json.results[iResult].geolocetablissement.lat) {
                                aDatas.push(json.results[iResult].geolocetablissement.lat);
                            }else{
                                aDatas.push('');
                            }

                            if (json.results[iResult].geolocetablissement.lon) {
                                aDatas.push(json.results[iResult].geolocetablissement.lon);
                            }else{
                                aDatas.push('');
                            }

                        } else {

                            aDatas.push('');
                            aDatas.push('');

                        }

                        try {
                            let content = aDatas.join(';');
                            await fsp.appendFile("C:\\temp\\resultat-juridique.csv", content + '\r\n', 'utf-8');
                            console.log(`${line} - ${iResult}`);
                        } catch (err) {
                            console.log(err);
                        }

                    }
                } else {
                    console.log('>>>>>>>>>>', line);    // Si on va trop vite généralement...
                }

            });

        });

    } catch (error) {
        console.error('Error calling the web service:', error);
    }
}

}

processLineByLine();