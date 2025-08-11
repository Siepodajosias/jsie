/**
 * 
 * Helper dédié au débuggage
 * 
 * @author JC CALVIERA
 * @version 3.4
 *  
 */
'use strict';
var fs          = require('fs');
var util        = require('util');

export class Log {

    private count               : number;
    private lineLength          : number;    
    private sSeparateur         : string;
    private path                : string;
    private bVerbose            : boolean;                           // Pour afficher immédiatement des infos sans attendre l'affichage final
    private fileName            : string | undefined;                // Si un nom de fichier est défini, les logs sont enregistrés au fil de l'eau dans ce fichier...

    public oLog                 : any;

    constructor(verbose:boolean = false) {
        this.bVerbose       = verbose;
        this.count          = 0;
        this.lineLength     = 80;
        this.sSeparateur    = "-".repeat(this.lineLength);
        this.path           = __dirname + '/../_data/_tmp/';
        this.oLog           = { aData : [] } ;
    }

    //---------------------------------------------------------------------------------------------------------------

    /**
     * @description Affiche une information (passé en argument) ainsi qu'un compteur au cas ou la méthode serait appelée plusieurs fois.
     * @param info L'information à afficher
     */
    public debug = function(info:string) {  
        console.log('------------------[ ' + this.count + ' ]-------------------------');
        console.log(info);
        console.log('-------------------------------------------------');  
        this.count++;     
    }


    /**
     * 
     * @description Affiche une info de type "clef / valeur)"
     * @param titre Le nom de la clef
     * @param info La valeur
     */
    public info = function(titre:string|null = null, info:string) {
        if (titre == null) {
            console.log(this.sSeparateur); 
        } else {
            console.log('--[ ' + titre + ' ]' +  this.sSeparateur.substr(0, (this.sSeparateur.length - 6 - titre.length)));
        }
        console.log(info);        
        console.log(this.sSeparateur);        
    }

    
    /**
     * 
     * @desc Petite moulinette interne qui retourne le texte contenu dans tous les entêtes d'un tableau (ou de tout autre élément)
     * 
     * @param {object} selector - Element sous la forme : element.all(by.x())
     */
    public getHeaders = function(selector) {

        try {

            selector.count().then(function(nbElements){
                console.log('------------------[ ' + nbElements + ' ]-------------------------');
                for (var x=0; x<nbElements; x++) {
                    selector.get(x).getText().then(function(header) {
                        console.log('\'' + header.replace(/'/g, "\\'") + '\',');
                    })
                }               
            })  

        } catch(error) {
            throw new Error('JCC : Comme d\'hab ! T\'as encore oublié le "element.all"...')
        }           

    }


    /**
     * @description retourne le chemin dans lequel les fichiers de log sont créés (optionnel)
     */
    public getFilePath = function() {
        return this.path;
    }

    //-------------------------------------------------------------------------------------------------------------------------------

    /**
     * @param {string} sData - Données à enregistrer 
     */
    public set = function(sData:string) {

        // Sortie immédiate écran
        if (this.verbose === true) {
            console.log('§ ' + sData); 
        }
        
        // Sortie immédiate fichier 
        if (this.fileName !== undefined) {                                     // Ecriture en temps réel des infos dans le fichier

            var outputFilename = this.path + this.filename + '.log.txt';

            fs.writeFile(outputFilename, this.texte, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }

        this.oLog.aData.push(sData);     
    }


    /**
     * @param {bool} bMode - activation ou non de l'affichage immédiat des données 
     */
    public verbose = function(bMode:boolean = true): boolean {
        this.verbose = bMode;
        return bMode;
    }


    /**
     * @description - insère un séparateur dans les logs 
     */
    public separateur = function() {
        if (this.verbose === true) {
            console.log('§ ' + this.sSeparateur); 
        }
        this.oLog.aData.push(this.sSeparateur);     
    }


    /**
     * @param {string} filename - Nom du chichier
     * @param {string} texte - Données à enregistrer dans le fichier
     */
    public write = function(texte = '', filename = 'tmp.txt') {

        var outputFilename = this.path + filename;

        fs.writeFile(outputFilename, texte, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                this.set("File Added   : " + outputFilename);
            }
        });

    }


    /**
     * @param {string} filename - Lit le contenu du fichier
     */
    public read = function(filename:string = 'tmp.txt') {

        var outputFilename = this.path + filename;

        fs.readFile(outputFilename, function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                this.set("File Opened   : " + outputFilename);
                this.set("Data   : " + data.toString());
                return data.toString();
            }
        });

    }


    /**
     * @param {string} filename - Nom du chichier
     */
    public delete = function(filename:string) {

        var outputFilename = this.path + filename;

        fs.unlink(outputFilename, (err) => {
            if (err) {
                //throw err;
            } else {
                this.set("File Deleted : " + outputFilename);
            }
        });
    }


    /**
     * 
     * @param {string} sFileName - Nom du fichier servant à stocker le slogs en temps réel
     */
    public setRecordFileName = function(sFileName:string) {
        this.fileName = sFileName;
    }

    
    /**
     * @param {void} data - La donnée à afficher
     * @param {integer} depth - The depth argument is the number of levels deep into a nested object to recurse - it defaults to 2. Setting it to null will cause it to recurse 'all the way', showing every level
     * @param {boolean} showAll - A boolean that determines whether or not the 'non-enumerable' properties of an object will be displayed - it defaults to false, which tends to result in vastly more readable output.
     */
    public show = function(data, depth=2, showAll=false) {
        console.log(util.inspect(data, true, depth, showAll));
    }
    //-------------------------------------------------------------------------------------------------------------------------------

};