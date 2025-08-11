# conftest.py
import os
import pytest
#--------------------------------------------------------------------

from appium.options.android         import UiAutomator2Options
from appium.webdriver.client_config import AppiumClientConfig

from appium                         import webdriver
from dotenv                         import load_dotenv

#--------------------------------------------------------------------
load_dotenv()
@pytest.fixture(scope="session")
def driver():
    options                = UiAutomator2Options()
    options.platform_name  = os.getenv("PLATEFORM_NAME")
    options.device_name    = os.getenv("DEVICE_NAME")
    options.app            = os.getenv("APP_NAME")
    options.automation_name= "UiAutomator2"
    options.app_package    = os.getenv("APP_PACKAGE")
    options.app_activity   = os.getenv("APP_ACTIVITY")

    # Nouvelle configuration recommandée
    client_config = AppiumClientConfig(
        remote_server_addr = os.getenv("APPIUM_SERVER_URL"),
        timeout=60        
    )

    driver  = webdriver.Remote(client_config=client_config, options=options)
    yield driver
    driver.quit()
