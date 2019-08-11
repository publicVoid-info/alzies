import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { red, grey } from '@material-ui/core/colors'
import { CssBaseline } from '@material-ui/core';
import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: red[400]
    },
    primary: {
      main: red[600],
      contrastText: grey[200],
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
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
