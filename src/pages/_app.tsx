import { useState, useEffect } from "react";
import "../../styles/globals.css";
import Header from "../components/header/header";
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }: { Component: React.FC<{}>, pageProps: any }) {
  return (
    <Provider store={store}>
      <Header />

      <section
        className="bg-black text-white"
      >
        <Component {...pageProps} />
      </section>
    </Provider>
  );
}
export default MyApp;
