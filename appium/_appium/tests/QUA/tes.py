from appium.webdriver.webdriver import WebDriver
import pytest
#------------------------------------------------------------------------------------
"""
@author: JOSIAS SIE
@since: 2025-07-08

"""

xRefTest    = "STO_EXA_IHM"
xDescription= "IHM STOCK: Examen de l'IHM de l'application"
xIdTest     =  777
xVersion    = '4.0'; 

#------------------------------------------------------------------------------------

info = {
	'desc'       : xDescription,
	'appli'      : 'STOCK',
	'version'    : xVersion,
	'refTest'    : [xRefTest],
	'idTest'     : xIdTest,
	'help'       : [],
	'params'     : ['ville'],
	#'fileName'   : __filename
}

#------------------------------------------------------------------------------------

@pytest.fixture
def stock_actions(driver):
    def ouvrir(): print("Ouvrir stock")
    def ajouter(): print("Ajouter article")
    return {"ouvrir": ouvrir, "ajouter": ajouter}

class TestStockIHM:

    def test_un(self, driver):
        print("Test 1")

    def test_deux(self, driver):
        print("Test 2")

    def test_trois(self, driver):
        print("Test 3")
