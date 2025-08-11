"""
@author: JOSIAS SIE
@since: 2025-07-08

"""

import time
import pytest
import os
import datetime
import allure

from activities.STO.activity_menu import ActvityMenuStock
from utils.helpers                import Help
from utils.types                  import Info
from pytest_steps                 import test_steps
#------------------------------------------------------------------------------------

xRefTest    = "STO_EXA_IHM"
xDescription= "IHM STOCK : Examen de l'IHM de l'application"
xIdTest     =  777
xVersion    = '4.0'; 

#------------------------------------------------------------------------------------

infos = {
	'desc'       : xDescription,
	'appli'      : 'STOCK',
	'version'    : xVersion,
	'refTest'    : [xRefTest],
	'idTest'     : xIdTest,
	'help'       : [],
	'params'     : ['ville'],
	#'fileName'   : __filename
}



# def step(description):
#     def decorator(func):
#         def wrapper(*args, **kwargs):
#             start = time.time()
#             print(f">>> {description} ...", end="")
#             with allure.step(description):
#                 result = func(*args, **kwargs)
#             duration = int((time.time() - start) * 1000)
#             print(f" ✔️ ({duration}ms)")
#             return result
#         return wrapper
#     return decorator








#------------------------------------------------------------------------------------
menu  = ActvityMenuStock()
help  = Help()
oInfo = Info()

sPlateformeName = "CHA - Chaponnay"
#--------------------------------------------------------------------------------------
#-------------------- Activity Accueil ------------------------------------------------
@pytest.fixture(autouse=True)
def test_getInfo(request):
        creation_time     = os.path.getctime(request.fspath)
        oInfo.nomScript   = request.node.name
        oInfo.dateCreation= datetime.datetime.fromtimestamp(creation_time)
        oInfo.dateTire    = datetime.datetime.now()
        
class TestActivityAccueil:
    def test_info(self):
        help.init(infos, oInfo)
        time.sleep(5)
    
    def test_un(self, driver):
        menu.removeAlerteMessage(driver)

    def test_deux(self, driver):
        driver.find_element(*menu.editTextUtilisateur).is_displayed()
        driver.find_element(*menu.editTextMotDePasse).is_displayed()
        driver.find_element(*menu.buttonConnexion).is_displayed()
        time.sleep(5)
        
        #driver.save_screenshot("screenshot.png")
    def test_trois(self, driver):
        driver.find_element(*menu.editTextUtilisateur).send_keys("lunettes")
        driver.find_element(*menu.editTextMotDePasse).send_keys("glasses")
        driver.find_element(*menu.buttonConnexion).click()
        time.sleep(10)
        
#--------------------------------------------------------------------------------------
#---------------------Activity Stock --------------------------------------------------

class TestActivityStock:

    # @step("Activity déplacer palette")
    def test_un(self, driver):
        with allure.step(f'ListView [PLATEFORME] = {sPlateformeName}'):
             menu.selectPlateformeByName(sPlateformeName, driver)

    def test_deux(self, driver):
        with allure.step(f'Menu [PLATEFORME]'):
             activityName = 'deplacerPalette'
             menu.clickActivity(activityName, driver)

# @step("Activity déplacer palette")
def test_allure_etapes_claires():
    with allure.step("Étape A - Connexion"):
        assert True
    with allure.step("Étape B - Navigation"):
        assert 1 + 1 == 2
    with allure.step("Étape C - Déconnexion"):
        assert "OK" == "OK"


@test_steps('step_a', 'step_b')
def test_suite():
    # Step A
    assert not False  # replace with your logic
    intermediate_a = 'hello'
    yield

    # Step B

    assert not False  # replace with your logic
    yield