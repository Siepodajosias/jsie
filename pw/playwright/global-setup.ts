import * as fs  from 'fs';

async function globalSetup() {

    try {

        // Nettoyage anciens résultats
        //fs.rmSync('./test-results/', {recursive: true, force: true,});

    } catch (e) {
        console.log(`Error in globalSetup: ${e}`);
    } finally {
        // NOP
    }
  }
  
  export default globalSetup;