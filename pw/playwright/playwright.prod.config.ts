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
	outputDir:`C:/Reports/TA/jobs/${process.env.JOB_NAME}/builds/${process.env.BUILD_NUMBER}/pw`,

	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 0 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	timeout: 42000,
  	globalTimeout: 900000000,
	reporter: [
		['html', { outputFolder: `C:/Reports/TA/jobs/${process.env.JOB_NAME}/builds/${process.env.BUILD_NUMBER}/html`, open:'never'}],
		['list'],
		//['allure-playwright',{detail: true, suiteTitle: true, categories: [ { name: "Outdated tests", messageRegex: ".*FileNotFound.*", },], environmentInfo: { framework: "Playwright" },},],
		//['./utils/customReporter/reporter.ts', { customOption: 'Test reporter' }],
		//['json', { outputFile: 'test-results.json' }],
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
		{
			name: 'Chrome',
			use: { 
				...devices['Desktop Chrome'], 
				channel: 'chrome', 
				viewport: {width:1920, height: 1080}
			},
		},
	],

	/* Dernier Script lancé après le dernier worker */
	globalTeardown: require.resolve('./global-teardown.ts'),

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
