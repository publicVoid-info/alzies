import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    type: 'light',

    primary: {
      main: '#000000'

    },
    secondary: {

      main: '#FF290C'
    },
    background: {
      paper: '#F7F4F2',
      default: '#484848',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  )
}

export default App
