import { GET_VIDEO_DETAILES, ERROR, RESET_ERROR, FILTER_DATA } from './action_types';
import {MARK_VIDEO_EXECUTION } from '../Exercise/action_types'

const initialState = {
    MergeArray: [],
    FilterArray:[],
    errMessage:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_VIDEO_DETAILES:
            return {
                ...state,
                MergeArray: action.payload,
                FilterArray:action.payload
            };
            case FILTER_DATA:
                return {
                    ...state,
                    FilterArray: action.payload
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