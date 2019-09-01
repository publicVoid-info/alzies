import React, { Component } from 'react';
import { getFirebase } from '../helpers/firebase';
import { connect } from 'react-redux';
import validate from 'validate.js';

import {
  closeSignUpDialog,
  openSnackbar,
  registerUser,
  openWelcomeDialog,
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
  passwordConfirmation: '',

  errors: null
};

class SignUpDialog extends Component {
  constructor(props) {
    super(props);

    this.firebase = getFirebase();
    this.registerUser = registerUser;
    this.state = initialState;
  }

  handleSignUp = () => {
    const { emailAddress, password, passwordConfirmation } = this.state;

    const errors = validate(
      {
        emailAddress: emailAddress,
        password: password,
        passwordConfirmation: passwordConfirmation
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password,
        passwordConfirmation: constraints.passwordConfirmation
      });

    if (errors) {
      this.setState({ errors });
    } else {
      this.setState({
        errors: null
      }, () => {
        this.firebase.auth().createUserWithEmailAndPassword(emailAddress, password)
          .then((r) => {
            this.props.closeSignUpDialog(() => {

              this.registerUser(r);

              this.props.openWelcomeDialog();
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
      this.signUp();
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

  handlePasswordConfirmationChange = (event) => {
    const passwordConfirmation = event.target.value;

    this.setState({ passwordConfirmation });
  };

  render() {

    const { emailAddress, password, passwordConfirmation, errors } = this.state;

    return (
      <Dialog
        open={this.props.signUpDialog.open}
        onClose={this.props.closeSignUpDialog}
        onExited={this.handleExited}
        onKeyPress={this.handleKeyPress}>
        <DialogTitle>
          Sign up for an account
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Create an account to access features that are unavailable to users who haven't signed up.
          </DialogContentText>

          <AuthProviderList />

          <form>
            <TextField
              autoComplete="email"
              error={!!(errors && errors.emailAddress)}
              fullWidth
              helperText={(errors && errors.emailAddress) ? errors.emailAddress[0] : ''}
              label="E-mail address"
              margin="normal"
              onChange={this.handleEmailAddressChange}
              required
              type="email"
              value={emailAddress}
            />

            <TextField
              autoComplete="new-password"
              error={!!(errors && errors.password)}
              fullWidth
              helperText={(errors && errors.password) ? errors.password[0] : ''}
              label="Password"
              margin="normal"
              onChange={this.handlePasswordChange}
              required
              type="password"
              value={password}
            />

            <TextField
              autoComplete="password"
              error={!!(errors && errors.passwordConfirmation)}
              fullWidth
              helperText={(errors && errors.passwordConfirmation) ? errors.passwordConfirmation[0] : ''}
              label="Password confirmation"
              margin="normal"
              onChange={this.handlePasswordConfirmationChange}
              required
              type="password"
              value={passwordConfirmation}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.props.closeSignUpDialog}>Cancel</Button>
          <Button color="primary" disabled={(!emailAddress || !password || !passwordConfirmation)} variant="contained" onClick={this.signUp}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps,
  {
    closeSignUpDialog,
    openSnackbar,
    openWelcomeDialog,
  })(SignUpDialog);