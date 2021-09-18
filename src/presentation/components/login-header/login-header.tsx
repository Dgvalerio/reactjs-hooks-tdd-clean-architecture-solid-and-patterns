import React, { memo, FC } from 'react';

import Logo from '../logo/logo';
import Styles from './login-header-styles.scss';

const LoginHeader: FC = () => (
  <header className={Styles.header}>
    <Logo />
    <h1>4Dev - Enquetes para Programadores</h1>
  </header>
);

export default memo(LoginHeader);
