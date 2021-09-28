import { UnexpectedError } from '../../../domain/errors';
import { SurveyModel } from '../../../domain/models';
import { LoadSurveyList } from '../../../domain/usecases/load-survey-list';
import { HttpGetClient, HttpStatusCode } from '../../protocols/http';

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<SurveyModel[]>
  ) {} // eslint-disable-line no-empty-function

  async loadAll(): Promise<SurveyModel[]> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.noContent:
        return [];
      default:
        throw new UnexpectedError();
    }
  }
}
