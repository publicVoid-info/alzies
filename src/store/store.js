import settings from '../helpers/settings';
import { createStore } from 'redux';
import appReducer from './reducers';

export const initialState = {
    primaryColor: settings.theme.primaryColor.name,
    secondaryColor: settings.theme.secondaryColor.name,
    type: settings.theme.type,

    resetPasswordDialog: {
        open: false
    },
}

export default createStore(appReducer);