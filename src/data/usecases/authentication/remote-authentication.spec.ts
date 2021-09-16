// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';

import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials-error';
import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { AccountModel } from '../../../domain/models/account-model';
import { mockAuthentication } from '../../../domain/test/mock-authentication';
import { AuthenticationParams } from '../../../domain/usecases/authentication';
import { HttpStatusCode } from '../../protocols/http/http-response';
import { HttpPostClientSpy } from '../../tests/mock-http-client';
import { RemoteAuthentication } from './remote-authentication';

type SutTypes = {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AuthenticationParams,
    AccountModel
  >();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);

  return {
    sut,
    httpPostClientSpy,
  };
};

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);

    await sut.auth(mockAuthentication());

    expect(httpPostClientSpy.url).toBe(url);
  });

  test('Should call HttpClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    const authenticationParams = mockAuthentication();

    await sut.auth(authenticationParams);

    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });

  test('Should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };

    const authenticationParams = mockAuthentication();

    const promise = sut.auth(authenticationParams);

    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const authenticationParams = mockAuthentication();

    const promise = sut.auth(authenticationParams);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const authenticationParams = mockAuthentication();

    const promise = sut.auth(authenticationParams);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const authenticationParams = mockAuthentication();

    const promise = sut.auth(authenticationParams);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});