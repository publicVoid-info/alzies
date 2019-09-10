import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setVerifyEmail,
  closeWelcomeDialog,
  openSnackbar,
  verifyEmailAddress,
} from '../store/actions';

import settings from '../helpers/settings';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';

class WelcomeDialog extends Component {
  constructor(props) {
    super(props);

    this.verifyEmailAddress = verifyEmailAddress;
  }

  handleVerifyClick = () => {
    const self = this;
    this.props.closeWelcomeDialog(() => {
      self.verifyEmailAddress(
        self.props.user,
        () => {
          self.props.setVerifyEmail(true);
          self.props.openSnackbar('Verification email sent');
        })
    });
  };

  handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === 'Enter') {
      this.handleVerifyClick();
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.welcomeDialog.open}
        onClose={this.props.closeWelcomeDialog}
        onKeyPress={this.handleKeyPress}>

        <DialogTitle>
          Welcome to {settings.title}!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Complete your account by verifying your e-mail address.
            An e-mail will be sent to your e-mail address containing instructions on how to verify your e-mail address.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.props.closeWelcomeDialog}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={this.handleVerifyClick}>Verify</Button>
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
    setVerifyEmail,
    closeWelcomeDialog,
    openSnackbar,
  })(WelcomeDialog);