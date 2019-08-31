import { TOGGLE_DRAWER } from './actions';
// import { initialState } from './store';

const initState = {
    drawer: {
        open: false
    },
}


function appReducer(state = initState, action) {
    switch (action.type) {
        case TOGGLE_DRAWER:
            return {
                ...state,
                drawer: {
                    open: action.payload
                }
            }

        default:
            return state;
    }
}

export default appReducer;