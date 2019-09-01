// import validate from 'validate.js';
// import constraints from '../helpers/constraints';

export const actionTypes = {
    TOGGLE_DRAWER: 'TOGGLE_DRAWER',
    SIGNIN_OPEN: 'SIGNIN_OPEN',
    SIGNIN_CLOSE: 'SIGNIN_CLOSE',
    SIGNIN: 'SIGNIN',
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