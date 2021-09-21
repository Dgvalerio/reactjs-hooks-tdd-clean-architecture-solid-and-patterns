/* eslint-disable import/no-extraneous-dependencies */
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';
import faker from 'faker';
import React from 'react';

import { AuthenticationSpy, ValidationStub } from '../../test';
import Login from './login';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();

  validationStub.errorMessage = params?.validationError;

  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  );

  return { sut, authenticationSpy };
};

const populateEmailField = (
  sut: RenderResult,
  email = faker.internet.email()
): void => {
  fireEvent.input(sut.getByTestId('email'), { target: { value: email } });
};

const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  fireEvent.input(sut.getByTestId('password'), { target: { value: password } });
};

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);
  const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

  fireEvent.click(submitButton);
};

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);

  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const errorWrap = sut.getByTestId('error-wrap');

    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);

    simulateStatusForField(sut, 'email', validationError);

    simulateStatusForField(sut, 'password', validationError);
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    simulateStatusForField(sut, 'email', validationError);
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    simulateStatusForField(sut, 'password', validationError);
  });

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    simulateStatusForField(sut, 'email');
  });

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    simulateStatusForField(sut, 'password');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    populateEmailField(sut);
    populatePasswordField(sut);

    expect(submitButton.disabled).toBe(false);
  });

  test('should show spinner on submit', () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    const spinner = sut.getByTestId('spinner');

    expect(spinner).toBeTruthy();
  });

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();

    const email = faker.internet.email();
    const password = faker.internet.password();

    simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut();

    simulateValidSubmit(sut);
    simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    populateEmailField(sut);

    fireEvent.submit(sut.getByTestId('form'));

    expect(authenticationSpy.callsCount).toBe(0);
  });
});
