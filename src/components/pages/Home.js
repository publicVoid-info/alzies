import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import SignInManager from '../../helpers/signInManager'

import MemoryList from '../memory/MemoryList'
import Button from '@material-ui/core/Button'
import Fab from '../buttons/FloatingActionButton'
import AddIcon from '@material-ui/icons/Add'
import Container from '@material-ui/core/Container'
import AuthContext from '../../context/authContext';

const useStyles = makeStyles(theme => ({
  signinButton: {
    marginTop: '33vh',
    margin: 'auto',
    width: '36vw',
    height: '8vh',
    fontSize: '1.2em',
  },
  installButton: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '8vh',
    fontSize: '1.2em',
  },
  container: {
    textAlign: 'center',
  },
}))

let installPromptEvent

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('before prompt')
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later.
  installPromptEvent = event;
  // Update the install UI to notify the user app can be installed
  document.querySelector('#install-button').disabled = false;
})

window.addEventListener('appinstalled', (evt) => {
  console.log('alzies installed');
});

const handleInstall = () => {
  // Update the install UI to remove the install button
  document.querySelector('#install-button').disabled = true;
  // Show the modal add to home screen dialog
  installPromptEvent.prompt();
  // Wait for the user to respond to the prompt
  installPromptEvent.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    // Clear the saved prompt since it can't be used again
    installPromptEvent = null;
  });
}

export default function Home(props) {

  const classes = useStyles()
  const currentUser = useContext(AuthContext)

  const verificaSignIn = () => {

    if (!currentUser) {

      const signInState = new SignInManager()

      if (signInState.getSignInState().request) {
        return <React.Fragment />
      } else {
        return (
          <React.Fragment>
            <Button
              className={classes.signinButton}
              variant="contained"
              color="secondary"
              size="large"
              onClick={props.handleSignIn}>
              Sign In
          </Button>
            <Button
              id="install-button"
              className={classes.installButton}
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleInstall}
              disabled={true}>
              Install App
          </Button>
          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment>
          <MemoryList history={props.history} />
          <Link to="/memory/add">
            <Fab color="secondary" label="Add">
              <AddIcon />
            </Fab>
          </Link>
        </React.Fragment>
      )
    }
  }

  return (

    <Container className={classes.container} maxWidth="md">
      {verificaSignIn()}
    </Container>

  )
}



