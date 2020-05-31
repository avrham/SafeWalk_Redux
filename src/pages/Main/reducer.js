import { CALC_PROGRESS } from './action_types';

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
        default:
            return state;
    }
}