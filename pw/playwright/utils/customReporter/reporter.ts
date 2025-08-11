import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter'

class customReporter implements Reporter{

     onBegin(config: FullConfig, suite: Suite): void{
        console.log("Test title : " + `${suite.suites[0].suites[0].title}`);
     };

     onTestBegin(test: TestCase, result: TestResult): void{
      console.log("Exécution du test: " + `${test.title}`);
     };

     onTestEnd(test: TestCase, result: TestResult): void{ };

     onStepBegin(test: TestCase, result: TestResult, step: TestStep): void{
         if(step.category === "test.step"){
            console.log("Test step started: " + `${test.title}`);
         }
     };
 
     onStepEnd(test: TestCase, result: TestResult, step: TestStep): void{};

     onError(error: TestError): void{
        console.log(`${error.message}`);
     };
   
     onStdOut(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{// Permet de faire du débugage (valeur);

     };

     onStdErr(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{};

     onEnd(result: FullResult): void | Promise<void>{
        console.log("Status: " + `${result.status}`);
     };
   
     printsToStdio(): boolean{

       return false;
     };

     onExit(): Promise<void>{
 
        return new Promise(() => {});
     };

}
module.exports = customReporter;