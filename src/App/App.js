import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { getFirebase } from '../helpers/firebase';

import {
  setUser,
  setAuthReady,
  setSignedIn,
  openSnackbar,
  closeSnackbar,
  registerUser,
  updateTheme,
} from '../store/actions';

import Snackbar from '@material-ui/core/Snackbar';

import HomeContent from '../layout/HomeContent';
import NotFoundContent from '../layout/NotFoundContent';
import LaunchScreen from '../layout/LaunchScreen';
import Bar from '../layout/Bar';

import MemoryEditor from '../components/memory/MemoryEditor';

class App extends Component {

  constructor(props) {
    super(props);

    this._isMounted = false;
    this.firebase = getFirebase();
    this.registerUser = registerUser;
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.updateTheme(
      JSON.parse(
        localStorage.getItem('theme')
      )
    );

    const self = this;

    this.removeAuthObserver =
      self.firebase.auth().onAuthStateChanged((user) => {
        if (self._isMounted) {

          self.props.setUser(user);
          self.props.setAuthReady(true);
          self.props.setSignedIn(!!user);
        };
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.removeAuthObserver();
  }

  render() {

    return (
      < Router >
        <MuiThemeProvider theme={this.props.theme}>
          <header>
            <Bar />
          </header>
          <main>
            <div style={{
              minHeight: '100vh',
              backgroundColor: this.props.theme.palette.type === 'dark' ? '#303030' : '#fafafa'
            }}>

              {!this.props.isAuthReady &&
                <LaunchScreen />
              }

              {this.props.isAuthReady &&
                <Switch>
                  <Route exact path="/" component={HomeContent} />
                  <Route exact path="/memory/:id" component={MemoryEditor} />
                  <Route component={NotFoundContent} />
                </Switch>
              }
            </div>
            <Snackbar
              autoHideDuration={this.props.snackbar.autoHideDuration}
              message={this.props.snackbar.message}
              open={this.props.snackbar.open}
              onClose={this.props.closeSnackbar}
            />
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
  openSnackbar,
  closeSnackbar,
  updateTheme
})(App);