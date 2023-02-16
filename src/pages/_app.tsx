import { useState, useEffect } from "react";
import "../../styles/globals.css";
import Header from "../components/header/header";
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import Loading from "../components/Loading";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: { Component: React.FC<{}>, pageProps: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    const handleError = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);
  return (
    <div>
      {loading ? <Loading /> :
        <Provider store={store}>

          <Header />

          <section
            className="bg-black text-white"
          >
            <Component {...pageProps} />
          </section>
        </Provider>
      }
    </div>
  );
}
export default MyApp;
