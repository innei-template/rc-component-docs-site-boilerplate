import {
  GeistProvider,
  CssBaseline,
  GeistUIThemes,
  useTheme,
  Image,
} from '@geist-ui/core'

import { MDXProvider } from '@mdx-js/react'
import { NextComponentType, NextPageContext } from 'next'
import { FC, memo, useEffect, useState } from 'react'
import { Search, HybridLink, HybridCode } from './components'
import Menu from './components/layout/menu'
import ConfigContext from './config-provider'
import useDomClean from './use-dom-clean'

export const App: FC<{
  Component: NextComponentType<NextPageContext, any, {}>
  pageProps: any
}> = memo(props => {
  const { Component, pageProps } = props
  const [themeType, setThemeType] = useState<string>()
  const theme = useTheme()
  const [customTheme, setCustomTheme] = useState<GeistUIThemes>(theme)
  const themeChangeHandle = (theme: GeistUIThemes) => {
    setCustomTheme(theme)
    setThemeType(theme.type)
  }

  useEffect(() => {
    const theme = window.localStorage.getItem('theme')
    if (theme !== 'dark') return
    setThemeType('dark')
  }, [])
  useDomClean()

  return (
    <GeistProvider themeType={themeType} themes={[customTheme]}>
      <CssBaseline />
      <ConfigContext
        onThemeChange={themeChangeHandle}
        onThemeTypeChange={type => setThemeType(type)}>
        <Menu />
        <Search />
        <MDXProvider
          components={{
            a: HybridLink,
            img: Image,
            pre: HybridCode,
          }}>
          <Component {...pageProps} />
        </MDXProvider>
      </ConfigContext>
      <style global jsx>{`
        .tag {
          color: ${theme.palette.accents_5};
        }
        .punctuation {
          color: ${theme.palette.accents_5};
        }
        .attr-name {
          color: ${theme.palette.accents_6};
        }
        .attr-value {
          color: ${theme.palette.accents_4};
        }
        .language-javascript {
          color: ${theme.palette.accents_4};
        }
        span.class-name {
          color: ${theme.palette.warning};
        }
        span.maybe-class-name {
          color: ${theme.palette.purple};
        }
        span.token.string {
          color: ${theme.palette.accents_5};
        }
        span.token.comment {
          color: ${theme.palette.accents_3};
        }
        span.keyword {
          color: ${theme.palette.success};
        }
        span.plain-text {
          color: ${theme.palette.accents_3};
        }
        body::-webkit-scrollbar {
          width: var(--geist-page-scrollbar-width);
          background-color: ${theme.palette.accents_1};
        }
        body::-webkit-scrollbar-thumb {
          background-color: ${theme.palette.accents_2};
          border-radius: ${theme.layout.radius};
        }
        :root {
          --geist-page-nav-height: 64px;
          --geist-page-scrollbar-width: 4px;
        }
      `}</style>
    </GeistProvider>
  )
})
export default App
