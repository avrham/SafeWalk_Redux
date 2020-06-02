import { CALC_PROGRESS } from './action_types';
import {MARK_VIDEO_EXECUTION} from '../Exercise/action_types'

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
            case MARK_VIDEO_EXECUTION:
            return {
                ...state,
                rehabProgress: action.payload.progress,
            };
        default:
            return state;
    }
}