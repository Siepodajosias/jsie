class Function:
    def __init__(self):
        pass

    def connexion():
        print('')

    def deconnexion():
        print('')

    def is_visible(driver, by, value):
        try:
            element = driver.find_element(by, value)
            return element.is_displayed()
        except:
            return False