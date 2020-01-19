import { createStore } from 'redux'
import { actionTypes } from './actions'
import { createMuiTheme } from '@material-ui/core/styles'
import settings from '../helpers/settings'

const initState = {
  theme: createMuiTheme({
    palette: {
      primary: settings.theme.primaryColor.import,
      secondary: settings.theme.primaryColor.import,
      type: settings.theme.type
    }
  }),

  palette: {
    primaryColor: settings.theme.primaryColor.import,
    secondaryColor: settings.theme.secondaryColor.import,
    type: settings.theme.type
  },

  user: null,

  searchInput: '',

  activeTable: {
    trash: false,
    memories: 'memories',
    memoryPosition: 'memoryPosition'
  },

  isAuthReady: false,
  isVerifyingEmailAddress: false,
  isSignedIn: false,

  drawer: {
    open: false
  },
  signInDialog: {
    open: false
  },
  signUpDialog: {
    open: false
  },
  welcomeDialog: {
    open: false
  },
  settingsDialog: {
    open: false
  },
  resetPasswordDialog: {
    open: false
  },
  snackbar: {
    autoHideDuration: 0,
    message: '',
    open: false
  }
}

function appReducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_THEME:
      return {
        ...state,
        theme: action.payload.theme,
        palette: action.payload.palette
      }
    case actionTypes.SET_ACTIVETABLE:
      let newActiveTable = null

      newActiveTable =
        action.payload === 'trash'
          ? {
              trash: true,
              memories: 'archivedMemories',
              memoryPosition: 'archivedMemoryPosition'
            }
          : {
              trash: false,
              memories: 'memories',
              memoryPosition: 'memoryPosition'
            }

      return {
        ...state,
        activeTable: newActiveTable
      }

    case actionTypes.SET_SEARCHINPUT:
      return {
        ...state,
        searchInput: action.payload
      }
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case actionTypes.SET_AUTHREADY:
      return {
        ...state,
        isAuthReady: action.payload
      }
    case actionTypes.SET_SIGNEDIN:
      return {
        ...state,
        isSignedIn: action.payload
      }
    case actionTypes.SET_VERIFYEMAIL:
      return {
        ...state,
        isVerifyingEmailAddress: action.payload
      }
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
    case actionTypes.RESETPASSWORD_OPEN:
    case actionTypes.RESETPASSWORD_CLOSE:
      return {
        ...state,
        resetPasswordDialog: {
          open: action.payload
        }
      }
    case actionTypes.SETTINGS_OPEN:
    case actionTypes.SETTINGS_CLOSE:
      return {
        ...state,
        settingsDialog: {
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
      return state
  }
}

export default createStore(appReducer, initState)
