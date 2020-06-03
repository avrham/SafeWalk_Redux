import { ERROR,RESET_ERROR } from './action_types';

const initialState = {
    errMessage:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ERROR:
            return {
                ...state,
                errMessage: action.payload,
            };
            case RESET_ERROR:
            return {
                ...state,
                errMessage: action.payload,
            };
        default:
            return state;
    }
}