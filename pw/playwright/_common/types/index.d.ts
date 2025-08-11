import { TestFunctions } from '@helpers/functions';
import { Page, Locator, TestInfo } from '@playwright/test';

/**
 * @description 
 * @version 3.0
 */
type AutoComplete = {
    libelle?        : string,
    inputLocator    : Locator;
    clear?          : boolean;
    inputValue      : string;
    choiceSelector? : string;   
    choicePosition? : number;
    selectRandom?   : boolean;
    verbose?        : boolean;
    typingDelay?    : number;
    waitBefore?     : number;
    page            : Page;
}

/**
 * @description Structure de l'objet attendu par la méthode readDirectoryContent()
 */
type TypeSearchFile = {
    sPath           : string,
    sExtension?     : string,
    bVerbose?       : boolean,
    bRecursive?     : boolean,
    aExcludeDirs?   : any
}

/**
 * @description Structure de l'objet attendu par la méthode selectRandomListBox()
 */
type TypeListBox = {
    sLibelle?       :string,
    sInput          :Locator,
    sSelectorChoice :string,
    bVerbose?       :boolean,
    bIgnoreFirstline?:boolean,
    iWaitFor?       :number,
    page            :Page,
    bChained?       :boolean
}

/**
 * @description Structure de l'objet attendu par la méthode esb.checkFlux()
 */
type TypeEsb = {
    FLUX            : object[];
    WAIT_BEFORE?    : number;
    START_TIME?     : number;
    VERBOSE_MOD?    : boolean;   
    STOP_ON_FAILURE?: boolean;
    STATUS?: boolean;
}

/**
 * @description Structure de l'objet attendu par le constructeur de la classe Help
 */
type CartoucheInfo = {
    desc    : string;
    appli   : string;
    version : string;
    refTest : Array<string>;
    idTest  : number;
    help    : Array<string>;
    params  : Array<string>;
    fileName: string;
}

/**
 * @description Lié à la méthode elementInList()
 */
type TypeListOfElements = {
    element : Locator,
    desc    : any,            
    column  : any,      
    verbose?: boolean 
}


/**
 * @description Type d'authentification pour les appel d'API
 */
type AuthMethod = 'No Auth' | 'Basic Auth' | 'Bearer Token';


/**
 * @description Structure de l'objet attendu par le constructeur de la classe API
 */
type APIRequestObject = {
    baseUrl     : string;
    authMethod  : AuthMethod;
    username?   : string;
    password?   : string;
    token?      : string; 
}

type TypeDonneEnregistrable = 'InitParam' | 'ImportJdd' | 'InputField' | 'TextArea' | 'ListBox' | 'AutoComplete' | 'CheckBox' | 'Profil' | 'Role' | 'File';


/**
 * @description Structure de l'objet attendu par la classe AriaSnapshot
 */
type AriaSnapshot = {
    page            : Page,
    oTestInfo       : TestInfo,
    fonction        : TestFunctions
}
