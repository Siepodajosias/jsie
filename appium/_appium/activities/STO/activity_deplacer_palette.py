
"""
@author: JOSIAS SIE
@since: 2025-07-08

"""

from appium.webdriver.common.appiumby import AppiumBy

class ReceptionActivity:
    def __init__(self):
        """
        ====================================================================
                                    By XPATH
        ====================================================================
        """
        self.deplacerPaletteXPath= (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')
        self.reapproPickingXPath = (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')
        self.inventaireXPath     = (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')
        self.blocagePaletteXPath = (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')
        self.expeditionsXPath    = (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')
        self.receptionsXPath     = (AppiumBy.XPATH,'//android.widget.TextView[@text="Déplacer palette"]')

        """
        ====================================================================
                                    By ID
        ====================================================================
        """
        



        """
        ====================================================================
                                    By UIAUTOMATOR
        ====================================================================
        """

