import type {AppProps} from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import React from "react";
import Head from "next/head";

function SearchGPTWrapper({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="application-name" content="SearchGPT"/>
                <meta name="description" content="Bringing the Internet, and Chat AI one step closer"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="theme-color" content="#1E293B"/>
                <meta property="og:url" content="https://searchgpt.perrysahnow.com/"/>
                <link rel="manifest" href="/manifest.json"/>
                <link rel="shortcut icon" href="/images/icons/icon-512x512.png"/>
            </Head>
            <GlobalStyles/>
            <ColorMode/>
            <Component {...pageProps} />
        </>
    )
}

function ColorMode() {
    const code = `
    (() => {
        const dark = localStorage.getItem("dark") ;
        document.body.className = (dark ? (dark === "true") : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? "dark" : ""
    })()`
    return <script dangerouslySetInnerHTML={{__html: code}}/>
}

export default SearchGPTWrapper
