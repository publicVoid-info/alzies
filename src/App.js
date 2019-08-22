import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import { GoogleAuth } from './helpers/firebaseManager'
import AuthContext from './context/authContext'
import SignInManager from './helpers/signInManager'

import Home from './components/pages/Home'
import Header from './components/pages/Header'
import MemoryEditor from './components/memory/MemoryEditor'
import NoMatch from './components/pages/NoMatch'

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

const googleAuth = new GoogleAuth()
const signInState = new SignInManager()

function App(props) {

  const [currentUser, setCurrentUser] = useState(googleAuth.getCurrentUser())
  let idInterval = null

  const inicializaSignInState = () => {

    if (signInState.getSignInState().complete && !googleAuth.getCurrentUser()) {
      signInState.reset()
    }
  }

  const timer = () => {

    inicializaSignInState()

    if (googleAuth.getCurrentUser()) return

    if (signInState.getSignInState().request) {

      idInterval = setInterval(() => {

        if (signInState.getSignInState().request) {

          signInState.logRedirect()
          googleAuth.getRedirectResult()

        }

        if (googleAuth.getAuth().currentUser) {

          signInState.finish()
          clearInterval(idInterval)
          googleAuth.registerCurrentUser()
          setCurrentUser(() => googleAuth.getAuth().currentUser)

        }

      }, 2000)
    }
  }

  const handleSignIn = () => {

    signInState.start()

    googleAuth.signIn()

  }

  const handleSignOut = () => {

    googleAuth.signOut().then(() => {

      signInState.reset()

      setCurrentUser(() => null)
    })
  }

  useEffect(() => {
    timer()
  })

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={currentUser}>
        <CssBaseline />
        <BrowserRouter>
          <nav >
            <Route
              render={(props) => <Header {...props} handleSignOut={handleSignOut} />}
            />
          </nav>
          <main>
            <Switch>
              <Route
                exact path='/'
                render={(props) => <Home {...props} handleSignIn={handleSignIn} />}
              />
              <Route exact path='/memory/:id' component={MemoryEditor} />
              <Route component={NoMatch} />
            </Switch>
          </main>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App
