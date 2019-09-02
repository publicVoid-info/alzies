import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { getFirebase } from '../helpers/firebase';
import { initialState } from '../store/store';

import {
  setUser,
  setAuthReady,
  setSignedIn,
  closeWelcomeDialog,
  openSnackbar,
  closeSnackbar,
  registerUser,
} from '../store/actions';

import validate from 'validate.js';

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
    this.registerUser = registerUser;

    this.state = initialState;
  }

  resetPassword = (emailAddress) => {

    if (this.props.isSignedIn) {
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
          this.props.openSnackbar(`Password reset e-mail sent to ${emailAddress}`);
        })
      })
      .catch((reason) => {
        this.props.openSnackbar(reason.message);
      })
  }

  signOut = () => {

    if (!this.props.isSignedIn) {
      return;
    }

    this.firebase.auth().signOut()
      .then(() => {
        this.closeSignOutDialog(() => {
          this.props.openSnackbar('Signed out');
        });
      })
      .catch((reason) => {
        this.props.openSnackbar(reason.message);
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
      this.props.openSnackbar('Settings reset');
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

          self.props.setUser(user);
          self.props.setAuthReady(true);
          self.props.setSignedIn(!!user);
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.removeAuthObserver();
  }

  render() {

    const {
      primaryColor,
      secondaryColor,
      type,
    } = this.state;

    const {
      resetPasswordDialog,
      settingsDialog,
      signOutDialog
    } = this.state;

    return (
      < Router >
        <MuiThemeProvider theme={theme}>
          <header>
            <Bar
              onSettingsClick={this.openSettingsDialog}
              onSignOutClick={this.openSignOutDialog}

              onSearchInput={this.handleSearchInput}
            />
          </header>
          <main>

            <div style={{ minHeight: '100vh', backgroundColor: theme.palette.type === 'dark' ? '#303030' : '#fafafa' }}>
              {!this.props.isAuthReady &&
                <LaunchScreen />
              }

              {this.props.isAuthReady &&
                <React.Fragment>
                  <Switch>
                    <Route exact path="/" render={
                      () => (
                        <HomeContent
                          title={settings.title}
                          searchInput={this.state.searchInput}
                        />)
                    } />
                    <Route exact path="/memory/:id" component={MemoryEditor} />
                    <Route component={NotFoundContent} />
                  </Switch>

                  {this.props.isSignedIn &&
                    <React.Fragment>
                      <WelcomeDialog
                        title={settings.title}
                      />

                      <SettingsDialog
                        open={settingsDialog.open}

                        colors={colors}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        type={type}
                        defaultTheme={settings.theme}

                        onClose={this.closeSettingsDialog}
                        onPrimaryColorChange={this.changePrimaryColor}
                        onSecondaryColorChange={this.changeSecondaryColor}
                        onTypeChange={this.changeType}
                        onResetClick={this.resetTheme}
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

                  {!this.props.isSignedIn &&
                    <React.Fragment>
                      <SignUpDialog />

                      <SignInDialog
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
                    autoHideDuration={this.props.snackbar.autoHideDuration}
                    message={this.props.snackbar.message}
                    open={this.props.snackbar.open}
                    onClose={this.props.closeSnackbar}
                  />
                </React.Fragment>
              }
            </div>
          </main>
        </MuiThemeProvider>
      </Router >
    );
  }
}

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, {
  setUser,
  setAuthReady,
  setSignedIn,
  closeWelcomeDialog,
  openSnackbar,
  closeSnackbar
})(App);