// import validate from 'validate.js';
// import constraints from '../helpers/constraints';
import readingTime from 'reading-time';

export const actionTypes = {
    TOGGLE_DRAWER: 'TOGGLE_DRAWER',
    SIGNIN_OPEN: 'SIGNIN_OPEN',
    SIGNIN_CLOSE: 'SIGNIN_CLOSE',
    SNACKBAR_OPEN: 'SNACKBAR_OPEN',
    SNACKBAR_CLOSE: 'SNACKBAR_CLOSE',
}

export const toggleDrawer = (open) => {
    return {
        type: actionTypes.TOGGLE_DRAWER,
        payload: open
    };
};

export const openSignInDialog = () => {
    return {
        type: actionTypes.SIGNIN_OPEN,
        payload: true
    };
};

export const closeSignInDialog = (callback) => {

    if (callback && typeof callback === 'function') {
        callback();
    }

    return {
        type: actionTypes.SIGNIN_CLOSE,
        payload: false,
    };
};

export const openSnackbar = (message) => {
    const snack = {
        autoHideDuration: readingTime(message).time * 2,
        message: message,
        open: true
    };

    return {
        type: actionTypes.SNACKBAR_OPEN,
        payload: snack
    };
};

export const closeSnackbar = () => {

    const snack = {
        autoHideDuration: 0,
        message: '',
        open: false
    };

    return {
        type: actionTypes.SNACKBAR_CLOSE,
        payload: snack
    };
};