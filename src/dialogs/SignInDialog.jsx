import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFirebase } from '../helpers/firebase';
import PropTypes from 'prop-types';
import validate from 'validate.js';

import {
  closeSignInDialog,
  openSnackbar,
} from '../store/actions';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import constraints from '../helpers/constraints';
import AuthProviderList from '../layout/AuthProviderList';

const initialState = {
  emailAddress: '',
  password: '',

  errors: null
};

class SignInDialog extends Component {
  constructor(props) {
    super(props);

    this.firebase = getFirebase();
    this.state = initialState;
  }

  signIn = () => {

    const { emailAddress, password } = this.state;

    const errors = validate(
      {
        emailAddress: emailAddress,
        password: password
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password
      }
    );

    if (errors) {
      this.setState({ errors });
    } else {
      this.setState({
        errors: null
      }, () => {
        this.firebase.auth().signInWithEmailAndPassword(emailAddress, password)
          .then((r) => {
            this.props.closeSignInDialog(() => {
              this.props.openSnackbar(`Signed in as ${r.user.displayName || r.user.email}`);
            })
          })
          .catch((reason) => {
            this.props.openSnackbar(reason.message);
          })
      });
    }
  };

  handleExited = () => {
    this.setState(initialState);
  };

  handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === 'Enter') {
      this.signIn();
    }
  };

  handleEmailAddressChange = (event) => {
    const emailAddress = event.target.value;

    this.setState({ emailAddress });
  };

  handlePasswordChange = (event) => {
    const password = event.target.value;

    this.setState({ password });
  };

  render() {

    // Events
    const { onAuthProviderClick, onResetPasswordClick } = this.props;

    const { emailAddress, password, errors } = this.state;

    return (
      <Dialog
        open={this.props.signInDialog.open}
        onClose={this.props.closeSignInDialog}
        onExited={this.handleExited}
        onKeyPress={this.handleKeyPress}>
        <DialogTitle>
          Sign in to your account
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Some features might be unavailable until you sign in.
            While you're signed in you can manage your account.
          </DialogContentText>

          <AuthProviderList onAuthProviderClick={onAuthProviderClick} />

          <form>
            <TextField
              autoComplete="email"
              error={!!(errors && errors.emailAddress)}
              fullWidth
              helperText={(errors && errors.emailAddress) ? errors.emailAddress[0] : ''}
              margin="normal"
              onChange={this.handleEmailAddressChange}
              placeholder="E-mail address"
              required
              type="email"
              value={emailAddress}
            />

            <TextField
              autoComplete="current-password"
              error={!!(errors && errors.password)}
              fullWidth
              helperText={(errors && errors.password) ? errors.password[0] : ''}
              margin="normal"
              onChange={this.handlePasswordChange}
              placeholder="Password"
              required
              type="password"
              value={password}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.props.closeSignInDialog}>Cancel</Button>
          <Button color="primary" variant="outlined" onClick={onResetPasswordClick}>Reset Password</Button>
          <Button color="primary" disabled={(!emailAddress || !password)} variant="contained" onClick={this.signIn}>Sign In</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SignInDialog.propTypes = {
  onAuthProviderClick: PropTypes.func.isRequired,
  onResetPasswordClick: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps,
  {
    closeSignInDialog,
    openSnackbar
  })(SignInDialog);