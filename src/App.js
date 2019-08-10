import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import Routes from './routes'
import { deepOrange, blueGrey } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: deepOrange[400]
    },
    primary: {
      main: blueGrey[700]
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
      <Routes />
    </ThemeProvider>
  )
}

export default App
