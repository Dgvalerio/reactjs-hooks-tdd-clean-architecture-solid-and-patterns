import React, { FC, useContext } from 'react';

import Context from '../../contexts/form/form-context';
import Spinner from '../spinner/spinner';
import Styles from './form-status-styles.scss';

const FormStatus: FC = () => {
  const {
    state: { isLoading, mainError },
  } = useContext(Context);

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && <span className={Styles.error}>{mainError}</span>}
    </div>
  );
};

export default FormStatus;
