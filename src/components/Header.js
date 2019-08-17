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
      fontSize: '28px',
    },
    alziesIcon: {
      width: '48px',
      height: '48px',
      margin: '10px',
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
      paddingLeft: '20px',
      paddingTop: '15px',
      paddingBottom: '15px',
      cursor: 'pointer',
    },
    userIcon: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '20px',
      paddingRight: '10px',
    },
    appBar: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      outline: `1px solid ${theme.palette.secondary.main}`,
    },

  }
))

const googleAuth = new GoogleAuth()
const signInState = new SignInManager()

function Header(props) {

  let idInterval = null
  const classes = useStyles()
  const user = googleAuth.getCurrentUser()


  const timer = () => {

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

    if (!user) {

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
            <Link className={classes.link} to={(user) ? "/home" : "/"}>
              <AlziesIcon className={classes.alziesIcon} />
            </Link>
            <Grid item xs>
              <Link className={classes.link} to={(user) ? "/home" : "/"}>
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
              {(user)
                ?
                <Typography className={classes.userButton} variant="button" onClick={handleSignOut}>
                  {user.displayName}
                  <IconButton className={classes.userIcon}>
                    <LogoutIcon />
                  </IconButton>
                </Typography>
                :
                <Typography className={classes.userButton} variant="button" onClick={handleSignIn}>
                  {(signInState.getSignInState().request) ? 'Processing...' : 'Login'}
                  <IconButton className={classes.userIcon}>
                    <LogoutIcon />
                  </IconButton>
                </Typography>
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
