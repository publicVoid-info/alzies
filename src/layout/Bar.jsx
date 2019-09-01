import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fade, withStyles } from '@material-ui/core/styles';
import { toggleDrawer, openSignInDialog } from '../store/actions';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import PersonIcon from '@material-ui/icons/Person';

const styles = (theme) => ({
  titulo: {
    flexGrow: '1',
    marginRight: theme.spacing(2),
  },
  signButton: {
    marginRight: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  search: {
    flexGrow: '1',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null
      }
    };
  }

  openMenu = (event) => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl
      }
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null
      }
    });
  };

  handleSettingsClick = () => {
    this.closeMenu();
    this.props.onSettingsClick();
  };

  handleSignOutClick = () => {
    this.closeMenu();
    this.props.onSignOutClick();
  };

  handleToggleDrawer = () => {
    this.props.toggleDrawer(!this.props.drawer.open);
  }

  handleSignInClick = () => {
    this.props.openSignInDialog(!this.props.signInDialog.open);
  }

  render() {
    // Styling
    const { classes } = this.props;

    // Properties
    const { isSignedIn, user } = this.props;

    // Events
    const { onSignUpClick } = this.props;

    const { menu } = this.state;

    return (
      <AppBar color="primary" position="static">
        <Toolbar variant="regular">
          <IconButton
            className={classes.menuButton}
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.titulo}
            color="inherit"
            variant="h5">Alzies</Typography>

          {isSignedIn &&
            <React.Fragment>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onInput={this.props.onSearchInput}
                />
              </div>
              <IconButton color="inherit" onClick={this.openMenu}>
                {user.photoURL ? <Avatar alt="Avatar" src={user.photoURL} /> : <PersonIcon />}
              </IconButton>

              <Popover anchorEl={menu.anchorEl} open={Boolean(menu.anchorEl)} onClose={this.closeMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem onClick={this.handleSettingsClick}>Settings</MenuItem>
                <MenuItem onClick={this.handleSignOutClick}>Sign out</MenuItem>
              </Popover>
            </React.Fragment>
          }

          {!isSignedIn &&
            <React.Fragment>
              <Button
                className={classes.signButton}
                color="primary"
                variant="contained"
                onClick={onSignUpClick}>
                Sign Up</Button>
              <Button
                className={classes.signButton}
                color="secondary"
                variant="contained"
                onClick={this.handleSignInClick}>
                Sign In</Button>
            </React.Fragment>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

Bar.propTypes = {
  classes: PropTypes.object.isRequired,

  isSignedIn: PropTypes.bool.isRequired,

  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, { toggleDrawer, openSignInDialog })(withStyles(styles)(Bar));