import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  closeWelcomeDialog,
  openSnackbar,
  verifyEmailAddress,
} from '../store/actions';

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
    this.verifyEmailAddress(
      this.props.user,
      () => {
        this.props.closeWelcomeDialog()
      });
  };

  handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === 'Enter') {
      this.props.onOkClick();
    }
  };

  render() {
    // Custom Properties
    const { title } = this.props;

    // Custom Events
    const { onVerifyClick } = this.props;

    return (
      <Dialog
        open={this.props.welcomeDialog.open}
        onClose={this.props.closeWelcomeDialog}
        onKeyPress={this.handleKeyPress}>

        <DialogTitle>
          Welcome to {title}!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Complete your account by verifying your e-mail address.
            An e-mail will be sent to your e-mail address containing instructions on how to verify your e-mail address.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.props.closeWelcomeDialog}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={onVerifyClick}>Verify</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

WelcomeDialog.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps,
  {
    closeWelcomeDialog,
    openSnackbar,
  })(WelcomeDialog);