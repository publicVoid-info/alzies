import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFirebase } from '../helpers/firebase'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import {
  closeSignUpDialog,
  registerUser,
  closeSignInDialog,
  openSnackbar
} from '../store/actions'

import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import GoogleIcon from 'mdi-material-ui/Google'

const styles = theme => ({
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
})

class AuthProviderList extends Component {
  constructor(props) {
    super(props)

    this.firebase = getFirebase()
    this.registerUser = registerUser
  }

  handleProviderClick = () => {
    this.firebase
      .auth()
      .signInWithPopup(new this.firebase.auth.GoogleAuthProvider())
      .then(r => {
        this.props.closeSignUpDialog(() => {
          if (r.additionalUserInfo.isNewUser) {
            this.registerUser(r.user)
          }
          this.props.closeSignInDialog(() => {
            this.props.openSnackbar(
              `Signed in as ${r.user.displayName || r.user.email}`
            )
          })
        })
      })
      .catch(reason => {
        this.props.openSnackbar(reason.message)
      })
  }

  render() {
    // Styling
    const { classes } = this.props

    return (
      <React.Fragment>
        <DialogActions className={classes.dialogActions}>
          <Button
            className={classes.google}
            variant="contained"
            onClick={this.handleProviderClick}
          >
            <GoogleIcon className={classes.icon} />
            Google
          </Button>
        </DialogActions>
      </React.Fragment>
    )
  }
}

AuthProviderList.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const storeState = state
  return storeState
}

export default connect(mapStateToProps, {
  closeSignUpDialog,
  closeSignInDialog,
  openSnackbar
})(withStyles(styles)(AuthProviderList))
