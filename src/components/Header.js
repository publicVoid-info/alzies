import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import { GoogleAuth } from '../firebaseManager'
import SignInManager from '../signInManager'

import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
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
          googleAuth.registerCurrentUser()
          props.history.push('/home')

        }

      }, 2000)
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
              {(googleAuth.getCurrentUser()) &&
                <Avatar
                  alt={googleAuth.getCurrentUser().displayName}
                  src={googleAuth.getCurrentUser().photoURL}
                  className={classes.bigAvatar}
                  onClick={handleSignOut} />
              }
            </Grid>
          </Grid>
        </Toolbar>
        {(signInState.getSignInState().request) ? <LinearProgress color="secondary" /> : null}
      </AppBar>
    </React.Fragment >
  );
}

export default withRouter(Header)