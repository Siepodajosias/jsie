"""
@author: JOSIAS SIE
@since: 2025-07-08

"""
import time
from appium.webdriver.common.appiumby import AppiumBy

class ActvityMenuStock:
    def __init__(self):

        self.menuStock = {
            'deplacerPalette'        : (AppiumBy.ID,'fr.gfit.stock:id/layoutDeplacerPalette'),
            'reapprovisionnerPicking': (AppiumBy.ID,'fr.gfit.stock:id/layoutReapproPicking'),
            'inventaire'             : (AppiumBy.ID,'fr.gfit.stock:id/layoutInventairePalette'),
            'blocageDeblocagePalette': (AppiumBy.ID,'fr.gfit.stock:id/layoutBlocageDeblocagePalette'),
            'expeditions'            : (AppiumBy.XPATH,'//android.widget.LinearLayout[@resource-id="fr.gfit.stock:id/layoutExpedition"]'),
            'receptions'             : (AppiumBy.XPATH,'//android.widget.LinearLayout[@resource-id="fr.gfit.stock:id/layoutReceptions"]'),
            'situationPalette'       : (AppiumBy.XPATH,'//android.widget.LinearLayout[@resource-id="fr.gfit.stock:id/layoutSituationPalette"]')
        }

        self.editTextUtilisateur     = (AppiumBy.ID,'fr.gfit.stock:id/champ_login')
        self.editTextMotDePasse      = (AppiumBy.ID,'fr.gfit.stock:id/champ_mot_de_passe')

        self.buttonConnexion         = (AppiumBy.ID,'fr.gfit.stock:id/bouton_connecter')
        self.buttonAllow             = (AppiumBy.ID,'com.android.permissioncontroller:id/permission_allow_button')
        self.buttonDontAllow         = (AppiumBy.ID,'com.android.permissioncontroller:id/permission_deny_button')

        self.listViewPlateforme      = (AppiumBy.ID,'fr.gfit.stock:id/select_dialog_listview')

    #-------------------------------------------------------------------------------------------------------------
    """
    @Args: 
          param (self)       :
          param (ativityName): Nom de l'activity sur lequel cliqué.
          param (driver)     :

    @Description             : Click sur l'activity {ativityName} du menu
    @Returns                 : None

    """
    def clickActivity(self, ativityName, driver):
        if isinstance(self.menuStock[ativityName], tuple):
           driver.find_element(*self.menuStock[ativityName]).click()
           time.sleep(5)

    #-------------------------------------------------------------------------------------------------------------
    """
    @Args: 
          param (self)           :
          param (sPlateformeName): Nom de la plateforme sur la lequelle cliqué.
          param (driver)         :

    @Description                 : Click sur la plateforme {sPlateformeName} de la listView
    @Returns                     : None

    """
    def selectPlateformeByName(self, sPlateformeName, driver):
           driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, f'new UiSelector().text("{sPlateformeName}")').click()
           time.sleep(5)
       
    #-------------------------------------------------------------------------------------------------------------
    """
    @Args: 
          param (self)           :
          param (driver)         :

    @Description                 : Click sur l'alerte d'autorisation avant la connexion
    @Returns                     : None

    """
    def removeAlerteMessage(self, driver):
            driver.find_element(*self.buttonAllow).click()
            time.sleep(5)

    # def clickTableView(menuName, locator, timeout=10):
    #     print("")


