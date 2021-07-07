// 페이지 별로 공통 처리
import "antd/dist/antd.css";
import Head from "next/head";
import PropType from "prop-types";

import wrapper from "../store/configureStore";

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>node birld</title>
      </Head>
      <Component />
    </>
  );
};

App.propType = {
  Component: PropType.elementType.isRequired,
};

export default wrapper.withRedux(App);
