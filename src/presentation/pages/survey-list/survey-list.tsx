import React, { FC, useEffect, useState } from 'react';

import { LoadSurveyList } from '../../../domain/usecases/load-survey-list';
import { Footer, Header } from '../../components';
import { useErrorHandler } from '../../hooks';
import { SurveyContext, SurveyListItem, Error } from './components';
import Styles from './survey-list-styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: FC<Props> = ({ loadSurveyList }) => {
  const handleError = useErrorHandler((error: Error) => {
    setError(error.message);
  });

  const [surveys, setSurveys] = useState<LoadSurveyList.Model[]>([]);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((response) => {
        setSurveys(response);
        setError('');
      })
      .catch(handleError);
  }, [reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider
          value={{
            surveys: [surveys, setSurveys],
            error: [error, setError],
            reload: [reload, setReload],
          }}
        >
          {error ? <Error /> : <SurveyListItem />}
        </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
