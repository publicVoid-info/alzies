import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => (
  {
    link: {
      textDecoration: 'none',
      color: 'inherit'
    },
  }
))

function Header(props) {

  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={6}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <Link className={classes.link} to="/">
                <Typography color="inherit" variant="h5" component="h1">
                  Alzies
              </Typography>
              </Link>
            </Grid>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar}>
                <Avatar
                  className={classes.avatar}
                  alt="My Avatar"
                >R</Avatar>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Header;
