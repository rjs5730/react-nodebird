// 페이지 별로 공통 처리
import React from 'react';
import 'antd/dist/antd.css';
import Head from 'next/head';
import PropType from 'prop-types';

import wrapper from '../store/configureStore';

const App = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>node birld</title>
    </Head>
    <Component />
  </>
);

App.propTypes = {
  Component: PropType.elementType.isRequired,
};

export default wrapper.withRedux(App);
