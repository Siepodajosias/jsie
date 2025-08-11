import { defineConfig, devices } from '@playwright/test';
require('dotenv').config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './specs',
	outputDir:`test-results/${process.env.PROJET}`,

	/* Action éxécutée avant tout */
	globalSetup: require.resolve('./global-setup'),

	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 1 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		//['html', { outputFolder: `/opt/reports/archives/${process.env.PROJET}`, open:'never'}],
		//['list', {printSteps:true}],
		// ["indent-list-reporter", 
		// 	{
		// 		printSteps:true,             
		// 		baseColors: 
		// 		{
		// 			specFileNameColor: "blue",
		// 			suiteDescriptionColor: "white",
		// 			testCaseTitleColor: "magenta",
		// 		},
		// 	}
		// ]
		['./utils/customReporter/reporter.ts', { customOption: 'Test reporter' }],
		// ['json', { outputFile: 'test-results.json' }],
	],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		headless: false,
		colorScheme: 'dark',
		/* Base URL to use in actions like `await page.goto('/')`. */
		//baseURL: 'http://127.0.0.1:8080',
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'off',
		/* Copie d'écran uniquement en cas d'erreur et sur environnement NON dev */
		screenshot: {
			mode:'only-on-failure',
			fullPage: true
		},
	},

	/* Configure projects for major browsers */
	projects: [
		// {
		//   name: 'setup',
		//   testMatch: '**/*.setup.ts',
		//   use: { 
		//     viewport: null,
		//     launchOptions: {
		//       args: ["--start-maximized"]
		//   }
		//   },

		// },
		{
		name: 'Chrome',
		use: { 
			...devices['Desktop Chrome'], 
			channel: 'chrome', 
			viewport: {width:1920, height: 1080}
			/*

			Le paramètre suivant ne semble pas être pris en compte...

			launchOptions: {
				args: ["--start-maximized"]
			}
			*/
		},
		//dependencies: ['setup']
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
