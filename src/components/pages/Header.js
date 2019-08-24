import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/authContext'
import SignInManager from '../../helpers/signInManager'

import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import AlziesIcon from '../../icons/Alzies'
import Button from '@material-ui/core/Button'
import GetAppIcon from '@material-ui/icons/GetApp'

const useStyles = makeStyles((theme) => (
  {
    alzies: {
      fontSize: '24px',
    },
    alziesIcon: {
      width: '32px',
      height: '32px',
      margin: '5px',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit'
    },
    appBar: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      outline: `1px solid ${theme.palette.secondary.main}`,
      marginBottom: '10px',
    },
    bigAvatar: {
      float: 'left',
      cursor: 'pointer',
    },
    installButton: {
      display: 'none',
      // inline- flex;
    }
  }
))

let installPromptEvent

window.addEventListener('beforeinstallprompt', (event) => {

  document.querySelector('#install-app').style.display = 'inline-flex'

  installPromptEvent = event
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault()
})

const handleInstallApp = () => {

  installPromptEvent.prompt()
  installPromptEvent.userChoice.then((choice) => {
    // Clear the saved prompt since it can't be used again
    installPromptEvent = null
    document.querySelector('#install-app').style.display = 'none'
  })
}

function Header(props) {

  const classes = useStyles()
  const currentUser = useContext(AuthContext)

  const progressoSignin = () => {

    const signInState = new SignInManager()

    if (signInState.getSignInState().request) {
      return <LinearProgress color="secondary" />
    } else {
      return null
    }
  }

  return (
    <React.Fragment>
      <AppBar className={classes.appBar} position="sticky" elevation={12} >
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Link className={classes.link} to={"/"}>
              <AlziesIcon className={classes.alziesIcon} />
            </Link>
            <Grid item xs>
              <Link className={classes.link} to={"/"}>
                <Typography
                  className={classes.alzies}
                  color="textSecondary"
                  variant="overline"
                  component="span">
                  Alzies
              </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Button
                id="install-app"
                className={classes.installButton}
                variant="text"
                color="secondary"
                onClick={handleInstallApp}>
                <GetAppIcon />
                Get App
              </Button>
              {(currentUser) &&
                <Avatar
                  alt={currentUser.displayName}
                  src={currentUser.photoURL}
                  className={classes.bigAvatar}
                  onClick={props.handleSignOut} />
              }
            </Grid>
          </Grid>
        </Toolbar>
        {progressoSignin()}
      </AppBar>
    </React.Fragment >
  )
}

export default Header