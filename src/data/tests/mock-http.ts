// eslint-disable-next-line import/no-extraneous-dependencies,max-classes-per-file
import * as faker from 'faker';

import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '../protocols/http';

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.random.arrayElement(['get', 'post', 'put', 'delete']),
  body: faker.random.objectElement(),
  headers: faker.random.objectElement(),
});

export class HttpClientSpy<BodyType = any, ResponseType = any>
  implements HttpClient<ResponseType>
{
  url?: string;

  method?: string;

  body?: BodyType;

  headers?: any;

  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok,
  };

  async request(data: HttpRequest): Promise<HttpResponse<ResponseType>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.headers = data.headers;

    return Promise.resolve(this.response);
  }
}
