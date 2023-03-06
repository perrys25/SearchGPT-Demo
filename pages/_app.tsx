import type {AppProps} from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import React from "react";
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="application-name" content="SearchGPT"/>
                <meta name="description" content="Bringing the Internet, and Chat AI one step closer"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="theme-color" content="#1E293B"/>
                <meta property="og:url" content="https://searchgpt.perrysahnow.com/"/>
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/images/icons/icon-512x512.png" />
            </Head>
            <GlobalStyles/>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
