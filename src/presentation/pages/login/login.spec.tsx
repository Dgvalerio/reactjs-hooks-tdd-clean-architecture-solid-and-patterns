/* eslint-disable import/no-extraneous-dependencies */
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';
import faker from 'faker';
import React from 'react';

import { ValidationStub } from '../../test';
import Login from './login';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();

  validationStub.errorMessage = faker.random.words();

  const sut = render(<Login validation={validationStub} />);

  return { sut, validationStub };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('should start with initial state', () => {
    const {
      sut: { getByTestId },
      validationStub,
    } = makeSut();

    const errorWrap = getByTestId('error-wrap');

    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = getByTestId('submit') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);

    const emailStatus = getByTestId('email-status');

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = getByTestId('password-status');

    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should show email error if Validation fails', () => {
    const {
      sut: { getByTestId },
      validationStub,
    } = makeSut();

    const emailInput = getByTestId('email');
    const emailStatus = getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('should show password error if Validation fails', () => {
    const {
      sut: { getByTestId },
      validationStub,
    } = makeSut();

    const passwordInput = getByTestId('password');
    const passwordStatus = getByTestId('password-status');

    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });
});
