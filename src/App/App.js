import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { getFirebase, getFirestore } from '../helpers/firebase';
import { AuthContext, initialState } from '../store/store';
import { closeSignInDialog } from '../store/actions';

import validate from 'validate.js';
import readingTime from 'reading-time';

import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

import colors from '../helpers/colors';
import settings from '../helpers/settings';
import constraints from '../helpers/constraints';

import HomeContent from '../layout/HomeContent';
import NotFoundContent from '../layout/NotFoundContent';
import LaunchScreen from '../layout/LaunchScreen';
import Bar from '../layout/Bar';

import SignUpDialog from '../dialogs/SignUpDialog';
import SignInDialog from '../dialogs/SignInDialog';
import ResetPasswordDialog from '../dialogs/ResetPasswordDialog';
import WelcomeDialog from '../dialogs/WelcomeDialog';
import SettingsDialog from '../dialogs/SettingsDialog';
import InputDialog from '../dialogs/InputDialog';
import ConfirmationDialog from '../dialogs/ConfirmationDialog';

import MemoryEditor from '../components/memory/MemoryEditor';

let theme = createMuiTheme({
  palette: {
    primary: settings.theme.primaryColor.import,
    secondary: settings.theme.secondaryColor.import,
    type: settings.theme.type
  }
})

class App extends Component {

  constructor(props) {
    super(props);

    this._isMounted = false;
    this.firebase = getFirebase();

    this.state = initialState;

  }

  signUp = (emailAddress, password, passwordConfirmation) => {
    if (this.state.isSignedIn) {
      return;
    }

    if (!emailAddress || !password || !passwordConfirmation) {
      return;
    }

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
      }
    )

    if (errors) {
      return;
    }

    this.firebase.auth().createUserWithEmailAndPassword(emailAddress, password)
      .then((r) => {
        this.closeSignUpDialog(() => {

          this.registerUser(r);

          this.openWelcomeDialog();
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })

  }

  signIn = (emailAddress, password) => {

    if (this.state.isSignedIn) {
      return;
    }

    if (!emailAddress || !password) {
      return;
    }

    const errors = validate(
      {
        emailAddress: emailAddress,
        password: password,
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password
      }
    )

    if (errors) {
      return;
    }

    this.firebase.auth().signInWithEmailAndPassword(emailAddress, password)
      .then((r) => {
        this.props.closeSignInDialog(() => {
          this.openSnackbar(`Signed in as ${r.user.displayName || r.user.email}`);
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);

      })
  };

  signInWithProvider = (provider) => {
    if (this.state.isSignedIn) {
      return;
    }

    if (!provider) {
      return;
    }

    this.firebase.auth().signInWithPopup(provider)
      .then((r) => {
        this.closeSignUpDialog(() => {

          this.registerUser(r);

          this.props.closeSignInDialog(() => {
            this.openSnackbar(`Signed in as ${r.user.displayName || r.user.email}`);
          })
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  resetPassword = (emailAddress) => {
    if (this.state.isSignedIn) {
      return;
    }

    if (!emailAddress) {
      return;
    }

    const errors = validate(
      {
        emailAddress: emailAddress
      },
      {
        emailAddress: constraints.emailAddress
      })

    if (errors) {
      return
    }

    this.firebase.auth().sendPasswordResetEmail(emailAddress)
      .then(() => {
        this.closeResetPasswordDialog(() => {
          this.openSnackbar(`Password reset e-mail sent to ${emailAddress}`);
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  addAvatar = () => {
    const { user, isSignedIn, avatar } = this.state;

    if (!user || !isSignedIn || !avatar) {
      return;
    }

    if (user.photoURL) {
      return;
    }

    const errors = validate(
      {
        avatar: avatar
      },
      {
        avatar: constraints.avatar
      }
    )

    if (errors) {
      this.setState((state) => ({
        addAvatarDialog: {
          ...state.addAvatarDialog,
          errors
        }
      }))

      return;
    }

    user.updateProfile({ photoURL: avatar })
      .then(() => {
        this.closeAddAvatarDialog(() => {
          this.openSnackbar('Avatar added');
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  changeAvatar = () => {
    const { user, isSignedIn, avatar } = this.state;

    if (!user || !isSignedIn || !avatar) {
      return;
    }

    const errors = validate(
      {
        avatar: avatar
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

    if (user.photoURL === avatar) {
      this.openSnackbar('Avatar already being used');

      return;
    }

    user.updateProfile({ photoURL: avatar })
      .then(() => {
        this.closeChangeAvatarDialog(() => {
          this.openSnackbar('Avatar changed');
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  addDisplayName = () => {
    const { user, isSignedIn, displayName } = this.state;

    if (!user || !isSignedIn || !displayName) {
      return;
    }

    if (user.displayName) {
      return;
    }

    const errors = validate(
      {
        displayName: displayName
      },
      {
        displayName: constraints.username
      }
    )

    if (errors) {
      this.setState((state) => ({
        addDisplayNameDialog: {
          ...state.addDisplayNameDialog,
          errors
        }
      }))

      return;
    }

    user.updateProfile({ displayName })
      .then(() => {
        this.closeAddDisplayNameDialog(() => {
          this.openSnackbar('Display name added');
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  changeDisplayName = () => {
    const { user, isSignedIn, displayName } = this.state;

    if (!user || !isSignedIn || !displayName) {
      return;
    }

    const errors = validate(
      {
        displayName: displayName
      },
      {
        displayName: constraints.username
      }
    )

    if (errors) {
      this.setState((state) => ({
        changeDisplayNameDialog: {
          ...state.changeDisplayNameDialog,
          errors
        }
      }))

      return;
    }

    if (displayName === user.displayName) {
      this.openSnackbar(`Display name is already ${displayName}`);

      return;
    }

    user.updateProfile({ displayName })
      .then(() => {
        this.closeChangeDisplayNameDialog(() => {
          this.openSnackbar('Display name changed');
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  }

  addEmailAddress = () => {
    const { user, isSignedIn, emailAddress } = this.state;

    if (!user || !isSignedIn || !emailAddress) {
      return;
    }

    if (user.email) {
      return;
    }

    const errors = validate(
      {
        emailAddress: emailAddress
      },
      {
        emailAddress: constraints.emailAddress
      }
    )

    if (errors) {
      this.setState((state) => ({
        addEmailAddressDialog: {
          ...state.addEmailAddressDialog,
          errors
        }
      }))

      return;
    }

    user.updateEmail(emailAddress)
      .then(() => {
        this.closeAddEmailAddressDialog(() => {
          this.openSnackbar('E-mail address added');
        })
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  };

  verifyEmailAddress = (callback) => {
    const { user, isSignedIn } = this.state;

    if (!user || !user.email || !isSignedIn) {
      return;
    }

    user.sendEmailVerification()
      .then(() => {
        this.setState({
          isVerifyingEmailAddress: true
        }, () => {
          this.openSnackbar(`Verification e-mail sent to ${user.email}`);

          if (callback && typeof callback === 'function') {
            callback();
          }
        });
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  };

  signOut = () => {
    if (!this.state.isSignedIn) {
      return;
    }

    this.firebase.auth().signOut()
      .then(() => {
        this.closeSignOutDialog(() => {
          this.openSnackbar('Signed out');
        });
      })
      .catch((reason) => {
        this.openSnackbar(reason.message);
      })
  };

  updateTheme = (palette, removeLocalStorage, callback) => {
    const { primaryColor, secondaryColor, type } = this.state;

    if (!palette.primaryColor) {
      palette.primaryColor = primaryColor;
    }

    if (!palette.secondaryColor) {
      palette.secondaryColor = secondaryColor;
    }

    if (!palette.type) {
      palette.type = type;
    }

    theme = createMuiTheme({
      palette: {
        primary: colors.find(color => color.id === palette.primaryColor).import,
        secondary: colors.find(color => color.id === palette.secondaryColor).import,
        type: palette.type
      }
    });

    this.setState({
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      type: palette.type
    }, () => {
      if (removeLocalStorage) {
        localStorage.removeItem('theme');
      } else {
        localStorage.setItem('theme', JSON.stringify({
          primaryColor: palette.primaryColor,
          secondaryColor: palette.secondaryColor,
          type: palette.type
        }));
      }

      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  resetTheme = () => {
    this.updateTheme({
      primaryColor: settings.theme.primaryColor.name,
      secondaryColor: settings.theme.secondaryColor.name,
      type: settings.theme.type
    }, true, () => {
      this.openSnackbar('Settings reset');
    });
  };

  changePrimaryColor = (event) => {
    const primaryColor = event.target.value;

    this.updateTheme({
      primaryColor
    });
  };

  changeSecondaryColor = (event) => {
    const secondaryColor = event.target.value;

    this.updateTheme({
      secondaryColor
    });
  };

  changeType = (event) => {
    const type = event.target.value;

    this.updateTheme({
      type
    });
  };

  openSignUpDialog = () => {
    this.setState({
      signUpDialog: {
        open: true
      }
    });
  };

  closeSignUpDialog = (callback) => {
    this.setState({
      signUpDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openResetPasswordDialog = () => {
    this.setState({
      resetPasswordDialog: {
        open: true
      }
    });
  };

  closeResetPasswordDialog = (callback) => {
    this.setState({
      resetPasswordDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openWelcomeDialog = () => {
    this.setState({
      welcomeDialog: {
        open: true
      }
    });
  };

  closeWelcomeDialog = (callback) => {
    this.setState({
      welcomeDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openSettingsDialog = () => {
    this.setState({
      settingsDialog: {
        open: true
      }
    });
  };

  closeSettingsDialog = (callback) => {
    this.setState({
      settingsDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openAddAvatarDialog = () => {
    this.setState({
      addAvatarDialog: {
        open: true
      }
    });
  };

  closeAddAvatarDialog = (callback) => {
    this.setState({
      addAvatarDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
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

  openAddDisplayNameDialog = () => {
    this.setState({
      addDisplayNameDialog: {
        open: true
      }
    });
  };

  closeAddDisplayNameDialog = (callback) => {
    this.setState({
      addDisplayNameDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openChangeDisplayNameDialog = () => {
    this.setState({
      changeDisplayNameDialog: {
        open: true
      }
    });
  };

  closeChangeDisplayNameDialog = (callback) => {
    this.setState({
      changeDisplayNameDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openAddEmailAddressDialog = () => {
    this.setState({
      addEmailAddressDialog: {
        open: true
      }
    });
  };

  closeAddEmailAddressDialog = (callback) => {
    this.setState({
      addEmailAddressDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  openSignOutDialog = () => {
    this.setState({
      signOutDialog: {
        open: true
      }
    });
  };

  closeSignOutDialog = (callback) => {
    this.setState({
      signOutDialog: {
        open: false
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  handleAvatarChange = (event) => {
    const avatar = event.target.value;

    this.setState({ avatar });
  };

  handleDisplayNameChange = (event) => {
    const displayName = event.target.value;

    this.setState({ displayName });
  };

  handleEmailAddressChange = (event) => {
    const emailAddress = event.target.value;

    this.setState({ emailAddress });
  };

  handleSearchInput = (e) => {
    this.setState({ searchInput: e.target.value });
  }

  openSnackbar = (message) => {
    this.setState({
      snackbar: {
        autoHideDuration: readingTime(message).time * 2,
        message,
        open: true
      }
    });
  };

  closeSnackbar = (clearMessage = false) => {
    const { snackbar } = this.state;

    this.setState({
      snackbar: {
        message: clearMessage ? '' : snackbar.message,
        open: false
      }
    });
  };

  componentDidMount() {
    this._isMounted = true;

    const theme = JSON.parse(localStorage.getItem('theme'));

    if (theme) {
      this.updateTheme(theme);
    }

    const self = this;

    this.removeAuthObserver =
      self.firebase.auth().onAuthStateChanged((user) => {
        if (self._isMounted) {

          self.setState({
            isAuthReady: true,
            isSignedIn: !!user,
            user
          });
        }
      });
  }

  registerUser(r) {

    if (!r.additionalUserInfo) return;

    if (r.additionalUserInfo.isNewUser) {
      return getFirestore().collection('users')
        .doc(r.user.uid)
        .set({
          displayName: r.user.displayName,
          email: r.user.email,
          uid: r.user.uid,
        });
    };
  };

  componentWillUnmount() {
    this._isMounted = false;

    this.removeAuthObserver();
  }

  render() {

    const {
      primaryColor,
      secondaryColor,
      type,
      isAuthReady,
      isVerifyingEmailAddress,
      isSignedIn,
      user,
      avatar,
      displayName,
      emailAddress
    } = this.state;

    const {
      signUpDialog,
      resetPasswordDialog,
      welcomeDialog,
      settingsDialog,
      addAvatarDialog,
      changeAvatarDialog,
      addDisplayNameDialog,
      changeDisplayNameDialog,
      addEmailAddressDialog,
      signOutDialog
    } = this.state;

    const { snackbar } = this.state;

    return (
      < Router >
        <AuthContext.Provider value={this.state.user}>
          <MuiThemeProvider theme={theme}>
            <header>
              <Bar
                isSignedIn={isSignedIn}
                user={user}

                onSignUpClick={this.openSignUpDialog}

                onSettingsClick={this.openSettingsDialog}
                onSignOutClick={this.openSignOutDialog}

                onSearchInput={this.handleSearchInput}
              />
            </header>
            <main>

              <div style={{ minHeight: '100vh', backgroundColor: theme.palette.type === 'dark' ? '#303030' : '#fafafa' }}>
                {!isAuthReady &&
                  <LaunchScreen />
                }

                {isAuthReady &&
                  <React.Fragment>
                    <Switch>
                      <Route exact path="/" render={
                        () => (
                          <HomeContent
                            user={user}
                            isSignedIn={isSignedIn}
                            title={settings.title}
                            searchInput={this.state.searchInput}
                          />)
                      } />
                      <Route exact path="/memory/:id" component={MemoryEditor} />
                      <Route component={NotFoundContent} />
                    </Switch>

                    {isSignedIn &&
                      <React.Fragment>
                        <WelcomeDialog
                          open={welcomeDialog.open}

                          title={settings.title}
                          user={user}

                          onClose={this.closeWelcomeDialog}

                          onCancelClick={this.closeWelcomeDialog}
                          onVerifyClick={() => {
                            this.verifyEmailAddress(() => {
                              this.closeWelcomeDialog()
                            })
                          }}
                        />

                        <SettingsDialog
                          open={settingsDialog.open}

                          user={user}
                          isVerifyingEmailAddress={isVerifyingEmailAddress}
                          colors={colors}
                          primaryColor={primaryColor}
                          secondaryColor={secondaryColor}
                          type={type}
                          defaultTheme={settings.theme}

                          onClose={this.closeSettingsDialog}
                          onAddAvatarClick={this.openAddAvatarDialog}
                          onChangeAvatarClick={this.openChangeAvatarDialog}
                          onAddDisplayNameClick={this.openAddDisplayNameDialog}
                          onChangeDisplayNameClick={this.openChangeDisplayNameDialog}
                          onAddEmailAddressClick={this.openAddEmailAddressDialog}
                          onVerifyEmailAddressClick={this.verifyEmailAddress}
                          onPrimaryColorChange={this.changePrimaryColor}
                          onSecondaryColorChange={this.changeSecondaryColor}
                          onTypeChange={this.changeType}
                          onResetClick={this.resetTheme}
                        />

                        <InputDialog
                          open={addAvatarDialog.open}

                          title="Add avatar"
                          contentText="Your avatar is used to represent you. It's visible to other users and can be changed any time."
                          textField={
                            <TextField
                              autoComplete="photo"
                              autoFocus
                              error={!!(addAvatarDialog.errors && addAvatarDialog.errors.avatar)}
                              fullWidth
                              helperText={(addAvatarDialog.errors && addAvatarDialog.errors.avatar) ? addAvatarDialog.errors.avatar[0] : ''}
                              margin="normal"
                              onChange={this.handleAvatarChange}
                              placeholder="Avatar URL"
                              required
                              type="url"
                              value={avatar}
                            />
                          }
                          okText="Add"
                          disableOkButton={!avatar}
                          highlightOkButton

                          onClose={this.closeAddAvatarDialog}
                          onExited={() => {
                            this.setState({
                              avatar: ''
                            });
                          }}

                          onCancelClick={this.closeAddAvatarDialog}
                          onOkClick={this.addAvatar}
                        />

                        <InputDialog
                          open={changeAvatarDialog.open}

                          title="Change avatar"
                          contentText="Your avatar is used to represent you. It's visible to other users and can be changed any time."
                          textField={
                            <TextField
                              autoComplete="photo"
                              autoFocus
                              error={!!(changeAvatarDialog.errors && changeAvatarDialog.errors.avatar)}
                              fullWidth
                              helperText={(changeAvatarDialog.errors && changeAvatarDialog.errors.avatar) ? changeAvatarDialog.errors.avatar[0] : ''}
                              margin="normal"
                              onChange={this.handleAvatarChange}
                              placeholder={user.photoURL}
                              required
                              type="url"
                              value={avatar}
                            />
                          }
                          okText="Change"
                          disableOkButton={!avatar}
                          highlightOkButton

                          onClose={this.closeChangeAvatarDialog}
                          onExited={() => {
                            this.setState({
                              avatar: ''
                            });
                          }}

                          onCancelClick={this.closeChangeAvatarDialog}
                          onOkClick={this.changeAvatar}
                        />

                        <InputDialog
                          open={addDisplayNameDialog.open}

                          title="Add display name"
                          contentText="Your display name is used to represent you. It's visible to other users and can be changed any time."
                          textField={
                            <TextField
                              autoComplete="name"
                              autoFocus
                              error={!!(addDisplayNameDialog.errors && addDisplayNameDialog.errors.displayName)}
                              fullWidth
                              helperText={(addDisplayNameDialog.errors && addDisplayNameDialog.errors.displayName) ? addDisplayNameDialog.errors.displayName[0] : ''}
                              margin="normal"
                              onChange={this.handleDisplayNameChange}
                              placeholder="Display name"
                              required
                              type="text"
                              value={displayName}
                            />
                          }
                          okText="Add"
                          disableOkButton={!displayName}
                          highlightOkButton

                          onClose={this.closeAddDisplayNameDialog}
                          onExited={() => {
                            this.setState({
                              displayName: ''
                            });
                          }}

                          onCancelClick={this.closeAddDisplayNameDialog}
                          onOkClick={this.addDisplayName}
                        />

                        <InputDialog
                          open={changeDisplayNameDialog.open}

                          title="Change display name"
                          contentText="Your display name is used to represent you. It's visible to other users and can be changed any time."
                          textField={
                            <TextField
                              autoComplete="name"
                              autoFocus
                              error={!!(changeDisplayNameDialog.errors && changeDisplayNameDialog.errors.displayName)}
                              fullWidth
                              helperText={(changeDisplayNameDialog.errors && changeDisplayNameDialog.errors.displayName) ? changeDisplayNameDialog.errors.displayName[0] : ''}
                              margin="normal"
                              onChange={this.handleDisplayNameChange}
                              placeholder={user.displayName}
                              required
                              type="text"
                              value={displayName}
                            />
                          }
                          okText="Change"
                          disableOkButton={!displayName}
                          highlightOkButton

                          onClose={this.closeChangeDisplayNameDialog}
                          onExited={() => {
                            this.setState({
                              displayName: ''
                            });
                          }}

                          onCancelClick={this.closeChangeDisplayNameDialog}
                          onOkClick={this.changeDisplayName}
                        />

                        <InputDialog
                          open={addEmailAddressDialog.open}

                          title="Add e-mail address"
                          contentText="Your e-mail address is used to identify you. It's not visible to other users and can be changed any time."
                          textField={
                            <TextField
                              autoComplete="email"
                              autoFocus
                              error={!!(addEmailAddressDialog.errors && addEmailAddressDialog.errors.emailAddress)}
                              fullWidth
                              helperText={(addEmailAddressDialog.errors && addEmailAddressDialog.errors.emailAddress) ? addEmailAddressDialog.errors.emailAddress[0] : ''}
                              margin="normal"
                              onChange={this.handleEmailAddressChange}
                              placeholder="E-mail address"
                              required
                              type="email"
                              value={emailAddress}
                            />
                          }
                          okText="Add"
                          disableOkButton={!emailAddress}
                          highlightOkButton

                          onClose={this.closeAddEmailAddressDialog}
                          onExited={() => {
                            this.setState({
                              emailAddress: ''
                            });
                          }}

                          onCancelClick={this.closeAddEmailAddressDialog}
                          onOkClick={this.addEmailAddress}
                        />

                        <ConfirmationDialog
                          open={signOutDialog.open}

                          title="Sign out?"
                          contentText="While signed out you are unable to manage your profile and conduct other activities that require you to be signed in."
                          okText="Sign Out"
                          highlightOkButton

                          onClose={this.closeSignOutDialog}
                          onCancelClick={this.closeSignOutDialog}
                          onOkClick={this.signOut}
                        />
                      </React.Fragment>
                    }

                    {!isSignedIn &&
                      <React.Fragment>
                        <SignUpDialog
                          open={signUpDialog.open}

                          signUp={this.signUp}

                          onClose={this.closeSignUpDialog}
                          onAuthProviderClick={this.signInWithProvider}
                        />

                        <SignInDialog
                          signIn={this.signIn}
                          onClose={this.props.closeSignInDialog}
                          onAuthProviderClick={this.signInWithProvider}
                          onResetPasswordClick={this.openResetPasswordDialog}
                        />
                        <ResetPasswordDialog
                          open={resetPasswordDialog.open}
                          resetPassword={this.resetPassword}
                          onClose={this.closeResetPasswordDialog}
                        />
                      </React.Fragment>
                    }

                    <Snackbar
                      autoHideDuration={snackbar.autoHideDuration}
                      message={snackbar.message}
                      open={snackbar.open}
                      onClose={this.closeSnackbar}
                    />
                  </React.Fragment>
                }
              </div>
            </main>
          </MuiThemeProvider>
        </AuthContext.Provider>
      </Router >
    );
  }
}

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, { closeSignInDialog })(App);
