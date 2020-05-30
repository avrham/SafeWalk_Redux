import { SOME_ACTION } from './action_types';

const initialState = {
    x: 'bla bla'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SOME_ACTION:
            return {
                ...state,
                x: action.payload
            };
        default:
            return state;
    }
}