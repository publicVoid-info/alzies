import React from 'react';
import settings from '../helpers/settings';
import { createStore } from 'redux';
import appReducer from './reducers';

export const initialState = {
    primaryColor: settings.theme.primaryColor.name,
    secondaryColor: settings.theme.secondaryColor.name,
    type: settings.theme.type,

    isAuthReady: false,
    isVerifyingEmailAddress: false,
    isSignedIn: false,

    user: null,
    avatar: '',
    displayName: '',
    emailAddress: '',

    searchInput: '',

    resetPasswordDialog: {
        open: false
    },

    settingsDialog: {
        open: false
    },

    addAvatarDialog: {
        open: false,
        errors: null
    },

    changeAvatarDialog: {
        open: false,
        errors: null
    },

    addDisplayNameDialog: {
        open: false,
        errors: null
    },

    changeDisplayNameDialog: {
        open: false,
        errors: null
    },

    addEmailAddressDialog: {
        open: false,
        errors: null
    },

    signOutDialog: {
        open: false
    },
}

export default createStore(appReducer);

export const AuthContext = React.createContext({
    user: null
});

// export const appReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'getSignOutDialog':
//             return {
//                 ...state,
//                 signOutDialog: {
//                     open: state.signOutDialog.open
//                 }
//             };
//         case 'toggleSignOutDialog':
//             return {
//                 ...state,
//                 signOutDialog: {
//                     open: !state.signOutDialog.open
//                 }
//             };

//         default:
//             return state;
//     };
// };

// export const dispatchAppReducer = (action, callback) => {

// };

// export const AppContext = React.createContext({
//     appReducer,
//     dispatchAppReducer
// });

// export function AppState(props) {

//     return <AppState.Provider value={useReducer(appReducer, initialState)} />

// }