import App from 'lib/app'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'

const Application: NextPage<AppProps<{}>> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Geist UI - Modern and minimalist React UI library</title>
        <meta name="google" content="notranslate" />
        <meta name="twitter:creator" content="@echo_witt" />
        <meta name="referrer" content="strict-origin" />
        <meta property="og:title" content="Geist UI" />
        <meta property="og:site_name" content="Geist UI" />
        <meta property="og:url" content="https://geist-ui.dev" />
        <link rel="dns-prefetch" href="//geist-ui.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="generator" content="Geist UI" />
        <meta
          name="description"
          content="An open-source design system for building modern websites and applications."
        />
        <meta
          property="og:description"
          content="An open-source design system for building modern websites and applications."
        />
        <meta
          itemProp="image"
          property="og:image"
          content="https://user-images.githubusercontent.com/11304944/91128466-dfc96c00-e6da-11ea-8b03-a96e6b98667d.png"
        />
        <meta
          property="og:image"
          content="https://user-images.githubusercontent.com/11304944/91128466-dfc96c00-e6da-11ea-8b03-a96e6b98667d.png"
        />
        <meta
          property="twitter:image"
          content="https://user-images.githubusercontent.com/11304944/91128466-dfc96c00-e6da-11ea-8b03-a96e6b98667d.png"
        />
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover"
        />
      </Head>

      <App Component={Component} pageProps={pageProps} />
    </>
  )
}

export default Application
