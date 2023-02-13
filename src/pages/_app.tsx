import { useState, useEffect } from "react";
import "../../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/header/header";
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(function () {
      setLoading(false);
    }, 1250);

    return () => {
      setLoading(true);
    };
  }, [pageProps]);

  return (
    <>
      <Provider store={store}>
        {
          loading ? <Loading />
            : <> <Header />

              <section
                className={`${loading === true ? " animate-Loading " : ""} bg-black text-white`}
              >
                <Component {...pageProps} />
              </section>
            </>
        }

      </Provider>
    </>
  );
}
export default MyApp;
