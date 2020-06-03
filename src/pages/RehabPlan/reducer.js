import { GET_VIDEO_DETAILES, ERROR, RESET_ERROR } from './action_types';
import {MARK_VIDEO_EXECUTION } from '../Exercise/action_types'

const initialState = {
    MergeArray: [],
    errMessage:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_VIDEO_DETAILES:
            return {
                ...state,
                MergeArray: action.payload
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
                case MARK_VIDEO_EXECUTION:
                    return {
                        ...state,
                        MergeArray: action.payload.MergeArray
                    };
        default:
            return state;
    }
}