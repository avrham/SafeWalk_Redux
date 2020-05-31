import { CALC_PROGRESS, ERROR, RESET_ERROR } from './action_types';

const initialState = {
    rehabProgress:0.0,
    timesOfAllVideo:0,
    errMessage:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CALC_PROGRESS:
            return {
                ...state,
                rehabProgress: action.payload.rehabProgress,
                timesOfAllVideo: action.payload.timesOfAllVideo
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