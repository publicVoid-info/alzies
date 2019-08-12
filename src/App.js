import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#060606'
    },
    secondary: {
      main: '#F71E05'
    },
    background: {
      paper: '#F7F4F2',
      default: '#484848',
    },
    text: {
      primary: '#EFF0F0',
      secondary: '#060606'
    }
  },
  overrides: {
    MuiInput: {
      root: {
        color: '#060606',
      },
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
