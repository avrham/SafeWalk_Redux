import { CALC_PROGRESS } from './action_types';
import {HANDLE_PROGRESS} from '../Exercise/action_types'

const initialState = {
    rehabProgress:0.0,
    timesOfAllVideo:0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CALC_PROGRESS:
            return {
                ...state,
                rehabProgress: action.payload.rehabProgress,
                timesOfAllVideo: action.payload.timesOfAllVideo
            };
            case HANDLE_PROGRESS:
            return {
                ...state,
                rehabProgress: action.payload,
            };
        default:
            return state;
    }
}