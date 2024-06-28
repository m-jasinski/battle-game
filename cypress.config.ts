import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    chromeWebSecurity: false,
    supportFile: false,
    specPattern: ['src/**/*.cy.ts'],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
