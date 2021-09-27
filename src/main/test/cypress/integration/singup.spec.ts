// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

import * as FormHelper from '../support/form-helper';

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup');
  });

  it('should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('name', 'Campo obrigatório');

    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Campo obrigatório');

    cy.getByTestId('password').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo obrigatório');

    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(2));
    FormHelper.testInputStatus('name', 'O campo name tem um valor inválido');

    cy.getByTestId('email').focus().type(faker.random.word());
    FormHelper.testInputStatus('email', 'O campo email tem um valor inválido');

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(2));
    FormHelper.testInputStatus(
      'password',
      'O campo password tem um valor inválido'
    );

    cy.getByTestId('passwordConfirmation')
      .focus()
      .type(faker.random.alphaNumeric(2));
    FormHelper.testInputStatus(
      'passwordConfirmation',
      'O campo passwordConfirmation tem um valor inválido'
    );

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });
});