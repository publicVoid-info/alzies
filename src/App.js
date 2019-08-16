import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import Routes from './routes'
import './App.css'

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
      paper: '#FFFFFF',
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',

    }
  },
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  )
}

export default App
