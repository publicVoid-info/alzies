import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import validate from 'validate.js';
import constraints from '../helpers/constraints';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';

import InputDialog from '../dialogs/InputDialog';

const styles = (theme) => ({
  profile: {
    textAlign: 'center',

    marginTop: theme.spacing(1)
  },

  changeAvatarContainer: {
    position: 'relative',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: 'auto',
    marginLeft: 'auto'
  },

  changeAvatar: {
    position: 'absolute',
    top: '-7.5%',
    left: '60%',
  },

  info: {
    marginTop: theme.spacing(0.5)
  },

  emailAddress: {
    marginTop: -theme.spacing(0.5)
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: '',

      changeAvatarDialog: {
        open: false,
        errors: ''
      },
    }
  }

  updateAvatarState = (e) => {
    this.setState({
      avatar: e.target.value
    });
  };

  openChangeAvatarDialog = () => {
    this.setState({
      changeAvatarDialog: {
        open: true
      }
    });
  };

  closeChangeAvatarDialog = (callback) => {
    this.setState({
      changeAvatarDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  handleChangeAvatar = () => {

    const errors = validate(
      {
        avatar: this.state.avatar
      },
      {
        avatar: constraints.avatar
      }
    )

    if (errors) {
      this.setState((state) => ({
        changeAvatarDialog: {
          ...state.changeAvatarDialog,
          errors
        }
      }))

      return;
    }

    if (this.props.user.photoURL === this.state.avatar) {
      this.props.openSnackbar('Avatar already being used');

      return;
    }

    this.props.user.updateProfile({ photoURL: this.state.avatar })
      .then(() => {
        this.closeChangeAvatarDialog(() => {
          this.props.openSnackbar('Avatar changed');
        })
      })
      .catch((reason) => {
        this.props.openSnackbar(reason.message);
      });
  };

  render() {
    // Styling
    const { classes } = this.props;

    return (
      <div className={classes.profile}>
        <div className={classes.changeAvatarContainer}>
          <Avatar className={classes.avatar} alt="Avatar" src={this.props.user.photoURL} />
          <Tooltip title="Change avatar">
            <Fab className={classes.changeAvatar} color="primary" size="small" onClick={this.openChangeAvatarDialog}>
              <EditIcon />
            </Fab>
          </Tooltip>
        </div>

        <div className={classes.info}>
          <Typography variant="h6">{this.props.user.displayName}</Typography>
          <Typography className={classes.emailAddress} color="textSecondary" variant="body1">{this.props.user.email}</Typography>
        </div>
        <InputDialog
          open={this.state.changeAvatarDialog.open}

          title="Change avatar"
          contentText="Your avatar is used to represent you. It's visible to other users and can be changed any time."
          textField={
            <TextField
              onChange={this.updateAvatarState}
              autoComplete="photo"
              autoFocus
              error={(this.state.changeAvatarDialog.errors)}
              fullWidth
              helperText={(this.state.changeAvatarDialog.errors)}
              margin="normal"
              placeholder={(this.props.user) ? this.props.user.photoURL : ''}
              required
              type="url"
              value={this.state.avatar}
            />
          }
          okText="Change"
          disableOkButton={!this.state.avatar}
          highlightOkButton

          onClose={this.closeChangeAvatarDialog}
          onExited={() => {
            this.setState({
              avatar: ''
            });
          }}

          onCancelClick={this.closeChangeAvatarDialog}
          onOkClick={this.handleChangeAvatar}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, {})(withStyles(styles)(Profile));