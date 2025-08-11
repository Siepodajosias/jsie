ECHO "Récupération des dernières sources"
cd c:\sonar-scanner-5.0.1.3006-windows\bin\sources\playwright
git pull origin master
ECHO "Scan SONARQUBE"
cd c:\sonar-scanner-5.0.1.3006-windows\bin
sonar-scanner.bat -D"sonar.projectKey=Playwright" -D"sonar.sources=./sources/playwright/" -D"sonar.host.url=http://recette.prosol.pri:9400" -D"sonar.login=bc0458c5106a1da0c3cd3c1f65b1dcb1a88391e4"