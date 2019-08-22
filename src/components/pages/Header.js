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