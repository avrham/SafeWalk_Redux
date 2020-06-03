import { GET_ALL_TESTS, ERROR, RESET_ERROR } from './action_types';

const initialState = {
    getAllTests: [],
    errMessage:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_TESTS:
            return {
                ...state,
                getAllTests: action.payload
            };
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