import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  registerUser,
  verifyEmailAddress,
  setVerifyEmail,
  openSnackbar
} from '../store/actions'

import moment from 'moment'
import validate from 'validate.js'
import constraints from '../helpers/constraints'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import EditIcon from '@material-ui/icons/Edit'
import PersonIcon from '@material-ui/icons/Person'
import EmailIcon from '@material-ui/icons/Email'
import AccessTimeIcon from '@material-ui/icons/AccessTime'

import Profile from './Profile'
import ConfirmationDialog from '../dialogs/ConfirmationDialog'
import InputDialog from '../dialogs/InputDialog'

const styles = theme => ({
  root: {
    marginBottom: theme.spacing(0)
  },

  dialogContentTextUserComplete: {
    marginTop: theme.spacing(1)
  }
})

class AccountTab extends Component {
  constructor(props) {
    super(props)

    this.verifyEmailAddress = verifyEmailAddress
    this.registerUser = registerUser

    this.state = {
      displayName: '',

      changeDisplayNameDialog: {
        open: false,
        errors: ''
      },

      verifyEmailAddressDialog: {
        open: false
      }
    }
  }

  openVerifyEmailAddressDialog = () => {
    this.setState({
      verifyEmailAddressDialog: {
        open: true
      }
    })
  }

  closeVerifyEmailAddressDialog = callback => {
    this.setState(
      {
        verifyEmailAddressDialog: {
          open: false
        }
      },
      () => {
        if (callback && typeof callback === 'function') {
          callback()
        }
      }
    )
  }

  handleVerifyEmailAddress = () => {
    this.closeVerifyEmailAddressDialog(() => {
      this.props.setVerifyEmail(true)

      this.verifyEmailAddress(this.props.user, () => {
        this.props.openSnackbar(
          `Verification e-mail sent to ${this.props.user.email}`
        )
      })
    })
  }

  handleChangeDisplayName = () => {
    const errors = validate(
      {
        displayName: this.state.displayName
      },
      {
        displayName: constraints.username
      }
    )

    if (errors) {
      this.setState(state => ({
        changeDisplayNameDialog: {
          ...state.changeDisplayNameDialog,
          errors
        }
      }))

      return
    }

    if (this.state.displayName === this.props.user.displayName) {
      this.props.openSnackbar(
        `Display name is already ${this.state.displayName}`
      )

      return
    }

    this.props.user
      .updateProfile({ displayName: this.state.displayName })
      .then(() => {
        this.registerUser(this.props.user)
        this.closeChangeDisplayNameDialog(() => {
          this.props.openSnackbar('Display name changed')
        })
      })
      .catch(reason => {
        this.props.openSnackbar(reason.message)
      })
  }

  openChangeDisplayNameDialog = () => {
    this.setState({
      changeDisplayNameDialog: {
        open: true
      }
    })
  }

  closeChangeDisplayNameDialog = callback => {
    this.setState(
      {
        changeDisplayNameDialog: {
          open: false
        }
      },
      () => {
        if (callback && typeof callback === 'function') {
          callback()
        }
      }
    )
  }

  updateDisplayName = e => {
    this.setState({
      displayName: e.target.value
    })
  }

  render() {
    // Styling
    const { classes } = this.props

    const isUserComplete =
      this.props.user.photoURL &&
      this.props.user.displayName &&
      this.props.user.email

    return (
      <React.Fragment>
        <Profile extraTopMargin />

        <DialogContentText
          classes={{ root: classes.root }}
          className={isUserComplete && classes.dialogContentTextUserComplete}
        >
          Here's some info about your account. You can manage your account
          through the tabs.
        </DialogContentText>

        <List>
          <ListItem>
            <ListItemIcon>
              <Tooltip title="Display name">
                <PersonIcon />
              </Tooltip>
            </ListItemIcon>

            {this.props.user.displayName ? (
              <ListItemText
                primary="Display name"
                secondary={this.props.user.displayName}
              />
            ) : (
              <ListItemText primary="You don't have a display name. Add one!" />
            )}

            <ListItemSecondaryAction>
              <Tooltip title="Change">
                <IconButton onClick={this.openChangeDisplayNameDialog}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Tooltip title="E-mail address">
                <EmailIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={this.props.user.email}
              secondary={
                <React.Fragment>
                  {this.props.user.emailVerified && 'Verified'}
                  {!this.props.user.emailVerified &&
                    this.props.isVerifyingEmailAddress &&
                    'Awaiting e-mail address verification'}
                  {!this.props.user.emailVerified &&
                    !this.props.isVerifyingEmailAddress &&
                    'Not verified'}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              {this.props.isVerifyingEmailAddress && <CircularProgress />}
              {!this.props.isVerifyingEmailAddress &&
                !this.props.user.emailVerified && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.openVerifyEmailAddressDialog}
                  >
                    Verify
                  </Button>
                )}
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Tooltip title="Last sign-in">
                <AccessTimeIcon />
              </Tooltip>
            </ListItemIcon>

            <ListItemText
              primary="Last sign-in"
              secondary={moment(this.props.user.metadata.lastSignInTime).format(
                'LLLL'
              )}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Tooltip title="Signed up">
                <AccessTimeIcon />
              </Tooltip>
            </ListItemIcon>

            <ListItemText
              primary="Signed up"
              secondary={moment(this.props.user.metadata.creationTime).format(
                'LLLL'
              )}
            />
          </ListItem>
        </List>

        <InputDialog
          open={this.state.changeDisplayNameDialog.open}
          title="Change display name"
          contentText="Your display name is used to represent you. It's visible to other users and can be changed any time."
          textField={
            <TextField
              autoComplete="name"
              autoFocus
              error={this.state.changeDisplayNameDialog.errors}
              fullWidth
              helperText={
                this.state.changeDisplayNameDialog.errors &&
                this.state.changeDisplayNameDialog.errors.avatar
                  ? this.state.changeDisplayNameDialog.errors.avatar[0]
                  : ''
              }
              margin="normal"
              onChange={this.updateDisplayName}
              placeholder={this.props.user ? this.props.user.displayName : ''}
              required
              type="text"
              value={this.state.displayName}
            />
          }
          okText="Change"
          disableOkButton={!this.state.displayName}
          highlightOkButton
          onClose={this.closeChangeDisplayNameDialog}
          onExited={() => {
            this.setState({
              displayName: ''
            })
          }}
          onCancelClick={this.closeChangeDisplayNameDialog}
          onOkClick={this.handleChangeDisplayName}
        />

        <ConfirmationDialog
          open={this.state.verifyEmailAddressDialog.open}
          title="Send verification e-mail?"
          contentText="An e-mail will be sent to your e-mail address containing instructions on how to verify your e-mail address."
          okText="Send"
          highlightOkButton
          onClose={this.closeVerifyEmailAddressDialog}
          onCancelClick={this.closeVerifyEmailAddressDialog}
          onOkClick={this.verifyEmailAddress}
        />
      </React.Fragment>
    )
  }
}

AccountTab.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const storeState = state
  return storeState
}

export default connect(mapStateToProps, {
  setVerifyEmail,
  openSnackbar
})(withStyles(styles)(AccountTab))
