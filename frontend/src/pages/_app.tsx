import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#4285F4" />
      </Head>
      <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
