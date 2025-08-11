import os

class Help:
    def __init__(self):
        self.sSeparateur ="-" * 80
        pass

    def init(self,info, oInfo):

        print(self.sSeparateur)
        print('| Appllication    : ' + str(info['appli']))
        print('| Reference       : ' + str(info['refTest']) + ' - ' + str(info['desc']))
        print('| ID Squash       : ' + str(info['idTest']))
        print('| Script          : ' + str(oInfo.nomScript))
        print('| Version         : ' + str(info['version']))
        print('| Date de création: ' + str(oInfo.dateCreation))
        print(self.sSeparateur)
        print('| Date de tire    : ' + str(oInfo.dateTire))
        print('| Parametre       : ' + str(info['params']))
        print(self.sSeparateur)
        print('|--- Consolidation des données  ---------------------')
        print('| Url serveur     : ' + os.getenv("APPIUM_SERVER_URL"))
        print('| APK             : ' + os.getenv("APP_NAME"))
        print('|--- Consolidation des données  ---------------------')
        
    # param {number} valeur;  desc 1 -> 01 ; 12 -> 12
    def addZero(valeur):
        if(valeur<10):
            return '0' + valeur
        else:
            return valeur