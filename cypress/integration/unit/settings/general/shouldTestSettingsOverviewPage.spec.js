/*global context, it, cy,beforeEach*/
/// <reference types="Cypress" />

import settings from "../../../../selectors/settings.selectors";
import toolbar from "../../../../selectors/toolbar.selectors";

context('Settings overview page tests', () => {
  beforeEach(() => {
    cy.server();
    cy.login('Admin');
    cy.route('/');
    cy.get(toolbar.settings).click();
    cy.url().should('include','instellingen/overzicht');
  });

  it('Should open settings page and see all fields from the general settings tab', () => {
    cy.get(settings.generalSettings).should('be.visible');
    cy.get(settings.manageMinisters).should('be.visible');
    cy.get(settings.manageUsers).should('be.visible');
    cy.get(settings.manageGovermentDomains).should('be.visible');
    cy.get(settings.manageGovermentFields).should('be.visible');
    cy.get(settings.manageIseCodes).should('be.visible');
    cy.get(settings.manageAlerts).should('be.visible');
    cy.get(settings.manageDocumentTypes).should('be.visible');
    cy.get(settings.manageCaseTypes).should('be.visible');
    cy.get(settings.manageSubcaseTypes).should('be.visible');
    cy.get(settings.manageSignatures).should('be.visible');
  });

  it('Should open the model behind manage goverment domains and close it', () => {
    cy.openSettingsModal(settings.manageGovermentDomains);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage goverment fields and close it', () => {
    cy.openSettingsModal(settings.manageGovermentFields);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage ISE codes and close it', () => {
    cy.openSettingsModal(settings.manageIseCodes);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage alerts and close it', () => {
    cy.openSettingsModal(settings.manageAlerts);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage document types and close it', () => {
    cy.openSettingsModal(settings.manageDocumentTypes);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage case types and close it', () => {
    cy.openSettingsModal(settings.manageCaseTypes);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage subcase types and close it', () => {
    cy.openSettingsModal(settings.manageSubcaseTypes);
    cy.closeSettingsModal();
  });

  it('Should open the model behind manage signatures and close it', () => {
    cy.openSettingsModal(settings.manageSignatures);
    cy.closeSettingsModal();
  });

  it('Upload a users CSV', () => {
    cy.route('/');
    cy.get(toolbar.settings).click();
    cy.url().should('include','instellingen/overzicht');
    cy.get(settings.manageUsers).contains('Gebruikersbeheer').click();
    cy.url().should('include','instellingen/gebruikers');
    cy.contains('Gebruikers importeren').click();
    cy.uploadUsersFile('files','test', 'csv');
    cy.get(settings.settingsUserTable).contains('Wendy');
  });
});
