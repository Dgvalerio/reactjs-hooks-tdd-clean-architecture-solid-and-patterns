// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';

import { AccountModel } from '../models';
import { AuthenticationParams } from '../usecases';

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
  name: faker.internet.userName(),
});