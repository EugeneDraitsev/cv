import React, { memo, useCallback, useMemo } from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme'
import { Helmet } from 'react-helmet'
import { ThemeProvider as MuiProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'
import { useLocalStorage } from 'react-use'
import get from 'lodash/get'
import includes from 'lodash/includes'

import * as themesStyles from '../styles/themes'
import GlobalStyles from '../styles/global.styles'

export type ThemeType = 'dark' | 'light'

interface ThemeProviderProps {
  children: JSX.Element
}

interface ThemeState {
  theme: Theme
  themeType: ThemeType
  toggleTheme: () => void
}

const themes = ['light', 'dark']

const ThemeContext = React.createContext({} as ThemeState)

const ThemeProvider = memo(({ children }: ThemeProviderProps) => {
  const [themeType, setTheme] = useLocalStorage<ThemeType>('cv-theme', 'light')
  const styles = get(themesStyles, `[${themeType}]`)

  const theme = useMemo(() => createMuiTheme({
    palette: {
      type: includes(themes, themeType) ? themeType : 'light',
      ...styles,
    },
  }), [styles, themeType])

  const toggleTheme = useCallback(() => {
    setTheme((current: ThemeType) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme }}>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Helmet>
      <MuiProvider theme={theme}>
        <GlobalStyles />
        <CssBaseline />
        <StyledProvider theme={theme}>
          {children}
        </StyledProvider>
      </MuiProvider>
    </ThemeContext.Provider>
  )
})

export { ThemeContext, ThemeProvider }
