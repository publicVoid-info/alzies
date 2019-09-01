import { actionTypes } from './actions';
// import { initialState } from './store';

const initState = {
    drawer: {
        open: false
    },
    signInDialog: {
        open: false
    },
    signUpDialog: {
        open: false
    },
    snackbar: {
        autoHideDuration: 0,
        message: '',
        open: false
    },
    welcomeDialog: {
        open: false
    },
}


function appReducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_DRAWER:
            return {
                ...state,
                drawer: {
                    open: action.payload
                }
            }
        case actionTypes.SIGNIN_OPEN:
        case actionTypes.SIGNIN_CLOSE:
            return {
                ...state,
                signInDialog: {
                    open: action.payload
                }
            }
        case actionTypes.SIGNUP_OPEN:
        case actionTypes.SIGNUP_CLOSE:
            return {
                ...state,
                signUpDialog: {
                    open: action.payload
                }
            }
        case actionTypes.WELCOME_OPEN:
        case actionTypes.WELCOME_CLOSE:
            return {
                ...state,
                welcomeDialog: {
                    open: action.payload
                }
            }
        case actionTypes.SNACKBAR_OPEN:
        case actionTypes.SNACKBAR_CLOSE:
            return {
                ...state,
                snackbar: {
                    ...action.payload
                }
            }

        default:
            return state;
    }
}

export default appReducer;