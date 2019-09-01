import React, { Component } from 'react';

import PropTypes from 'prop-types';

import firebase from 'firebase/app';

import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import GoogleIcon from 'mdi-material-ui/Google';

const styles = (theme) => ({
  dialogActions: {
    justifyContent: 'center',

    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1)
  },

  dialogActionsMobile: {
    display: 'grid',
    justifyContent: 'stretch',

    marginTop: theme.spacing(2.5),
    marginBottom: -theme.spacing(0.5)
  },

  buttonMobile: {
    marginBottom: theme.spacing(1.5)
  },

  facebook: {
    backgroundColor: '#3c5a99',
    color: '#ffffff'
  },

  google: {
    backgroundColor: '#4285f4',
    color: '#ffffff'
  },

  gitHub: {
    backgroundColor: '#24292e',
    color: '#ffffff'
  },

  twitter: {
    backgroundColor: '#1da1f2',
    color: '#ffffff'
  },

  icon: {
    marginRight: theme.spacing(0.5)
  }
});

class AuthProviderList extends Component {
  render() {
    // Styling
    const { classes } = this.props;

    // Events
    const { onAuthProviderClick } = this.props;

    return (
      <React.Fragment>
        <DialogActions className={classes.dialogActions}>
          <Button className={classes.google} variant="contained" onClick={() => onAuthProviderClick(new firebase.auth.GoogleAuthProvider())}>
            <GoogleIcon className={classes.icon} />
            Google
            </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

AuthProviderList.propTypes = {
  classes: PropTypes.object.isRequired,

  onAuthProviderClick: PropTypes.func.isRequired
};

export default withStyles(styles)(AuthProviderList);