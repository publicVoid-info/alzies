// import validate from 'validate.js';
// import constraints from '../helpers/constraints';
import readingTime from 'reading-time';
import { getFirestore } from '../helpers/firebase';

export const actionTypes = {
    TOGGLE_DRAWER: 'TOGGLE_DRAWER',
    SIGNIN_OPEN: 'SIGNIN_OPEN',
    SIGNIN_CLOSE: 'SIGNIN_CLOSE',
    SIGNUP_OPEN: 'SIGNUP_OPEN',
    SIGNUP_CLOSE: 'SIGNUP_CLOSE',
    SNACKBAR_OPEN: 'SNACKBAR_OPEN',
    SNACKBAR_CLOSE: 'SNACKBAR_CLOSE',
    WELCOME_OPEN: 'WELCOME_OPEN',
    WELCOME_CLOSE: 'WELCOME_CLOSE',
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

    if (callback && typeof callback === 'function') callback();

    return {
        type: actionTypes.SIGNIN_CLOSE,
        payload: false,
    };
};

export const openSignUpDialog = () => {
    return {
        type: actionTypes.SIGNUP_OPEN,
        payload: true
    };
};

export const closeSignUpDialog = (callback) => {

    if (callback && typeof callback === 'function') callback();

    return {
        type: actionTypes.SIGNUP_CLOSE,
        payload: false,
    };
};

export const openWelcomeDialog = () => {
    return {
        type: actionTypes.WELCOME_OPEN,
        payload: true
    };
};

export const closeWelcomeDialog = (callback) => {

    if (callback && typeof callback === 'function') callback();

    return {
        type: actionTypes.WELCOME_CLOSE,
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

export const registerUser = (r) => {

    if (!r.additionalUserInfo) return;

    if (r.additionalUserInfo.isNewUser) {
        getFirestore().collection('users')
            .doc(r.user.uid)
            .set({
                displayName: r.user.displayName,
                email: r.user.email,
                uid: r.user.uid,
            });
    };
};