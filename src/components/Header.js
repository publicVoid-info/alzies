import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { GoogleAuth } from '../firebaseManager'
import SignInManager from '../signInManager'

import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import LinearProgress from '@material-ui/core/LinearProgress'
import AlziesIcon from '../icons/Alzies'


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
    userButton: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      border: `1.5px solid ${theme.palette.secondary.main}`,
      borderRadius: '10px',
      paddingTop: '3px',
      paddingBottom: '3px',
      paddingLeft: '10px',
      cursor: 'pointer',
      textTransform: 'uppercase',
    },
    userIcon: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      paddingTop: '5px',
      paddingBottom: '5px',
    },
    appBar: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      outline: `1px solid ${theme.palette.secondary.main}`,
      marginBottom: '10px',
    },

  }
))

const googleAuth = new GoogleAuth()
const signInState = new SignInManager()

function Header(props) {

  let idInterval = null
  const classes = useStyles()

  const timer = () => {

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
          props.history.push('/home')

        }

      }, 2000)
    }
  }

  const handleSignIn = () => {

    if (!googleAuth.getCurrentUser()) {

      signInState.start()

      googleAuth.signIn()

    }
  }

  const handleSignOut = () => {

    googleAuth.signOut().then(() => {

      signInState.reset()

      props.history.push('/')
    })
  }

  useEffect(() => {
    timer()
  })

  return (
    <React.Fragment>
      <AppBar className={classes.appBar} position="sticky" elevation={12} >
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Link className={classes.link} to={(googleAuth.getCurrentUser()) ? "/home" : "/"}>
              <AlziesIcon className={classes.alziesIcon} />
            </Link>
            <Grid item xs>
              <Link className={classes.link} to={(googleAuth.getCurrentUser()) ? "/home" : "/"}>
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
              {(googleAuth.getCurrentUser())
                ?
                <h5 className={classes.userButton} onClick={handleSignOut}>
                  {googleAuth.getCurrentUser().displayName}
                  <IconButton className={classes.userIcon}>
                    <LogoutIcon />
                  </IconButton>
                </h5>
                :
                <IconButton className={classes.userIcon} onClick={handleSignIn}>
                  <LogoutIcon />
                </IconButton>
              }
            </Grid>
          </Grid>
        </Toolbar>
        {(signInState.getSignInState().request) ? <LinearProgress color="secondary" /> : null}
      </AppBar>
    </React.Fragment >
  );
}

export default Header
